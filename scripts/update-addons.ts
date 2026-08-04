/**
 * One-off script: create Stripe products + prices for the new add-on catalog
 * and replace all records in the add_ons table.
 * Run: npx tsx scripts/update-addons.ts
 */
import { getUncachableStripeClient } from "../server/stripeClient";
import { db } from "../server/db";
import { addOns, addOnSelections } from "@shared/schema";

const CATALOG = [
  { slug: "google-ads", name: "Google Ads Beheer", monthly: 24900, icon: "megaphone",
    description: "Wekelijks zoektermen reviewen, biedstrategieën, conversie tracking en maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget." },
  { slug: "google-ads-ecommerce", name: "Google Ads + E-commerce/Shopping", monthly: 34900, icon: "shopping-bag",
    description: "Google Ads + Merchant Center, Shopping campagnes, feedbeheer en productoptimalisatie. Max 5 uur/maand. Min fee €349 of 10% van ad spend. Excl. advertentiebudget." },
  { slug: "meta-ads", name: "Meta Ads Beheer", monthly: 24900, icon: "share-2",
    description: "Campagne-opzet, doelgroepen, A/B tests, Pixel en Conversions API setup, maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget." },
  { slug: "seo", name: "SEO Optimalisatie", monthly: 19900, icon: "search",
    description: "On-page optimalisatie (2 pagina's/maand), technische monitoring, 20 keywords tracking, GSC rapportage in dashboard." },
  { slug: "local-seo", name: "Lokale SEO", monthly: 9900, icon: "map-pin",
    description: "Google Business Profile optimalisatie, lokale rankings, review management en lokale citaties." },
  { slug: "social-media", name: "Social Media Beheer", monthly: 19900, icon: "users",
    description: "8 posts per maand op 2 kanalen, contentkalender, basis design, scheduling en community management (1x/dag)." },
  { slug: "ecommerce", name: "E-commerce Module", monthly: 7900, icon: "shopping-cart",
    description: "Webshop functionaliteit tot 50 producten. Stripe/Mollie betalingen, productbeheer en bestelbevestigingsmails." },
  { slug: "booking", name: "Booking / Reserveringssysteem", monthly: 3900, icon: "calendar",
    description: "Online boekingssysteem met kalender sync, bevestigingsmails en klant-zelf-boeken widget. Max 3 diensten." },
  { slug: "extra-content-bundle", name: "Extra Content Wijzigingen (bundel)", monthly: 7900, icon: "file-text",
    description: "Tot 10 content wijzigingen per maand. Tekst, afbeeldingen en kleine layout aanpassingen (fair use, max 15 min per wijziging)." },
];

async function main() {
  const stripe = await getUncachableStripeClient();

  const rows: (typeof addOns.$inferInsert)[] = [];
  for (const item of CATALOG) {
    const product = await stripe.products.create({
      name: item.name,
      description: item.description,
      metadata: { slug: item.slug, type: "addon" },
    });
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      currency: "eur",
      unit_amount: item.monthly,
      recurring: { interval: "month" },
      metadata: { slug: item.slug, billing: "monthly" },
    });
    const quarterlyPrice = await stripe.prices.create({
      product: product.id,
      currency: "eur",
      unit_amount: item.monthly * 3,
      recurring: { interval: "month", interval_count: 3 },
      metadata: { slug: item.slug, billing: "quarterly" },
    });
    console.log(`${item.slug}: product=${product.id} monthly=${monthlyPrice.id} quarterly=${quarterlyPrice.id}`);
    rows.push({
      slug: item.slug,
      name: item.name,
      description: item.description,
      monthlyPriceCents: item.monthly,
      isActive: true,
      icon: item.icon,
      stripePriceId: monthlyPrice.id,
      stripeQuarterlyPriceId: quarterlyPrice.id,
    });
  }

  await db.transaction(async (tx) => {
    await tx.delete(addOnSelections);
    await tx.delete(addOns);
    await tx.insert(addOns).values(rows);
  });
  console.log(`Replaced add_ons table with ${rows.length} add-ons.`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
