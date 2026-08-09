import { db } from "./db";
import { plans } from "@shared/schema";
import { eq, ne } from "drizzle-orm";

/**
 * Canonical plan catalog (Aug 2026 pricing model): ONE plan with a credit
 * system. The old tiered plans (Starter/Professional/Business) are
 * deactivated, never deleted (subscriptions/projects keep their planId FK).
 *
 * Stripe price IDs exist per mode: test (sandbox account) and live
 * (production account, product prod_V2fhnUu2k9bO1Y, €69/mnd + €207/kwartaal,
 * tax exclusive). When a quarterly price ID would be null, the checkout route
 * falls back to inline quarterly price_data (monthlyPriceCents * 3).
 */
const PLAN = {
  name: "Website-abonnement",
  tier: "MEDIUM" as const, // legacy enum, no longer meaningful
  monthlyPriceCents: 6900,
  includedPages: 5,
  features: [
    "Website op maat (tot 5 pagina's)",
    "Responsive ontwerp",
    "Hosting, SSL en onderhoud",
    "ConsentEase inbegrepen",
    "2 wijzigingscredits per maand",
    "Support via e-mail",
  ],
  test: { monthly: "price_1U2YNkEyM9IEHbH5lAKtj7eW", quarterly: "price_1U2YNkEyM9IEHbH5LmpOfwDl" },
  live: { monthly: "price_1U2aMqAc0256vmxDkDMJsJLC", quarterly: "price_1U2aMsAc0256vmxDhncyesKJ" },
};

export async function syncPlanCatalog(log: (msg: string, tag?: string) => void = console.log) {
  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const mode = isProduction ? "live" : "test";
  const priceIds = PLAN[mode];

  const values = {
    name: PLAN.name,
    tier: PLAN.tier,
    monthlyPriceCents: PLAN.monthlyPriceCents,
    includedPages: PLAN.includedPages,
    features: [...PLAN.features],
    isActive: true,
    stripePriceId: priceIds.monthly,
    stripeQuarterlyPriceId: priceIds.quarterly,
  };

  const [existing] = await db.select().from(plans).where(eq(plans.name, PLAN.name));
  if (existing) {
    await db.update(plans).set(values).where(eq(plans.id, existing.id));
  } else {
    await db.insert(plans).values(values);
  }

  // Deactivate (don't delete) all other plans.
  await db.update(plans).set({ isActive: false }).where(ne(plans.name, PLAN.name));

  log(`Plan catalog synced (${mode} mode, single plan "${PLAN.name}")`, "catalog");
}
