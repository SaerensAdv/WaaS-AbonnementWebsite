import { db } from "../server/db";
import { plans, addOns } from "@shared/schema";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../server/stripeClient";

/**
 * Creates quarterly (every 3 months) Stripe prices for every plan and add-on,
 * based on their existing monthly price's product. The whole platform bills
 * per quarter (first quarter upfront, then every 3 months), so all subscription
 * items must share the same billing interval.
 *
 * Idempotent: if an active quarterly price already exists on the product it is
 * reused. Stores the quarterly price id on plans.stripeQuarterlyPriceId and
 * add_ons.stripeQuarterlyPriceId.
 *
 * Run with: npx tsx scripts/create-quarterly-prices.ts
 */
type StripeClient = Awaited<ReturnType<typeof getUncachableStripeClient>>;

/**
 * Resolve the Stripe product to attach the quarterly price to.
 * 1. Try the stored monthly price id -> its product (same account that seeded it).
 * 2. If that price no longer exists (different account), find an active product by name.
 * 3. Otherwise create a fresh product with that name.
 */
async function resolveProductId(
  stripe: StripeClient,
  monthlyPriceId: string | null,
  name: string,
): Promise<string> {
  if (monthlyPriceId) {
    try {
      const monthlyPrice = await stripe.prices.retrieve(monthlyPriceId);
      return typeof monthlyPrice.product === "string" ? monthlyPrice.product : monthlyPrice.product.id;
    } catch {
      // price id belongs to a different/old account — fall through to name lookup
    }
  }

  const products = await stripe.products.list({ active: true, limit: 100 });
  const match = products.data.find((p) => p.name === name);
  if (match) {
    return match.id;
  }

  const created = await stripe.products.create({ name });
  return created.id;
}

async function ensureQuarterlyPrice(
  stripe: StripeClient,
  monthlyPriceId: string | null,
  monthlyAmountCents: number,
  name: string,
): Promise<string> {
  const productId = await resolveProductId(stripe, monthlyPriceId, name);

  const existing = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const found = existing.data.find(
    (p) =>
      p.recurring?.interval === "month" &&
      p.recurring?.interval_count === 3 &&
      p.unit_amount === monthlyAmountCents * 3,
  );
  if (found) {
    return found.id;
  }

  const created = await stripe.prices.create({
    product: productId,
    currency: "eur",
    unit_amount: monthlyAmountCents * 3,
    recurring: { interval: "month", interval_count: 3 },
    nickname: "Quarterly (3 months upfront)",
  });
  return created.id;
}

export async function createQuarterlyPrices(): Promise<
  { type: "plan" | "addon"; name: string; quarterlyPriceId: string; quarterlyEuro: number }[]
> {
  const stripe = await getUncachableStripeClient();
  const results: { type: "plan" | "addon"; name: string; quarterlyPriceId: string; quarterlyEuro: number }[] = [];

  const allPlans = await db.select().from(plans);
  for (const plan of allPlans) {
    const quarterlyId = await ensureQuarterlyPrice(stripe, plan.stripePriceId, plan.monthlyPriceCents, plan.name);
    await db.update(plans).set({ stripeQuarterlyPriceId: quarterlyId }).where(eq(plans.id, plan.id));
    results.push({ type: "plan", name: plan.name, quarterlyPriceId: quarterlyId, quarterlyEuro: (plan.monthlyPriceCents * 3) / 100 });
  }

  const allAddOns = await db.select().from(addOns);
  for (const addOn of allAddOns) {
    const quarterlyId = await ensureQuarterlyPrice(stripe, addOn.stripePriceId, addOn.monthlyPriceCents, addOn.name);
    await db.update(addOns).set({ stripeQuarterlyPriceId: quarterlyId }).where(eq(addOns.id, addOn.id));
    results.push({ type: "addon", name: addOn.name, quarterlyPriceId: quarterlyId, quarterlyEuro: (addOn.monthlyPriceCents * 3) / 100 });
  }

  return results;
}

async function main() {
  const results = await createQuarterlyPrices();
  for (const r of results) {
    console.log(`[${r.type}] ${r.name}: ${r.quarterlyPriceId} (€${r.quarterlyEuro}/kwartaal)`);
  }
  console.log("Done.");
  process.exit(0);
}

const isDirectRun = process.argv[1] && process.argv[1].includes("create-quarterly-prices");
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
