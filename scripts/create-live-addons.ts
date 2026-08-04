/**
 * One-off script: create the 9 add-on products + prices in the LIVE Stripe account.
 * Run: npx tsx scripts/create-live-addons.ts
 * Prints the live price IDs to paste into server/seed.ts (LIVE catalog).
 */
import Stripe from "stripe";

async function getLiveStripe(): Promise<Stripe> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const token = process.env.REPL_IDENTITY ? "repl " + process.env.REPL_IDENTITY : null;
  if (!hostname || !token) throw new Error("Connector credentials unavailable");
  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", "production");
  const res = await fetch(url, { headers: { Accept: "application/json", X_REPLIT_TOKEN: token } });
  const data = await res.json();
  const secret = data.items?.[0]?.settings?.secret;
  if (!secret?.startsWith("sk_live_")) throw new Error("Live Stripe secret not found");
  return new Stripe(secret, { apiVersion: "2025-11-17.clover" as any });
}

const CATALOG = [
  { slug: "google-ads", name: "Google Ads Beheer", monthly: 24900,
    description: "Wekelijks zoektermen reviewen, biedstrategieën, conversie tracking en maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget." },
  { slug: "google-ads-ecommerce", name: "Google Ads + E-commerce/Shopping", monthly: 34900,
    description: "Google Ads + Merchant Center, Shopping campagnes, feedbeheer en productoptimalisatie. Max 5 uur/maand. Min fee €349 of 10% van ad spend. Excl. advertentiebudget." },
  { slug: "meta-ads", name: "Meta Ads Beheer", monthly: 24900,
    description: "Campagne-opzet, doelgroepen, A/B tests, Pixel en Conversions API setup, maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget." },
  { slug: "seo", name: "SEO Optimalisatie", monthly: 19900,
    description: "On-page optimalisatie (2 pagina's/maand), technische monitoring, 20 keywords tracking, GSC rapportage in dashboard." },
  { slug: "local-seo", name: "Lokale SEO", monthly: 9900,
    description: "Google Business Profile optimalisatie, lokale rankings, review management en lokale citaties." },
  { slug: "social-media", name: "Social Media Beheer", monthly: 19900,
    description: "8 posts per maand op 2 kanalen, contentkalender, basis design, scheduling en community management (1x/dag)." },
  { slug: "ecommerce", name: "E-commerce Module", monthly: 7900,
    description: "Webshop functionaliteit tot 50 producten. Stripe/Mollie betalingen, productbeheer en bestelbevestigingsmails." },
  { slug: "booking", name: "Booking / Reserveringssysteem", monthly: 3900,
    description: "Online boekingssysteem met kalender sync, bevestigingsmails en klant-zelf-boeken widget. Max 3 diensten." },
  { slug: "extra-content-bundle", name: "Extra Content Wijzigingen (bundel)", monthly: 7900,
    description: "Tot 10 content wijzigingen per maand. Tekst, afbeeldingen en kleine layout aanpassingen (fair use, max 15 min per wijziging)." },
];

async function main() {
  const stripe = await getLiveStripe();

  // Idempotency: skip products that already exist (by metadata slug)
  const existing = await stripe.products.list({ limit: 100, active: true });
  const existingBySlug = new Map(existing.data.filter(p => p.metadata?.slug && p.metadata?.type === "addon").map(p => [p.metadata.slug, p]));

  for (const item of CATALOG) {
    if (existingBySlug.has(item.slug)) {
      console.log(`${item.slug}: already exists (${existingBySlug.get(item.slug)!.id}), skipping`);
      continue;
    }
    const product = await stripe.products.create({
      name: item.name,
      description: item.description,
      metadata: { slug: item.slug, type: "addon" },
    });
    const monthlyPrice = await stripe.prices.create({
      product: product.id, currency: "eur", unit_amount: item.monthly,
      recurring: { interval: "month" }, metadata: { slug: item.slug, billing: "monthly" },
    });
    const quarterlyPrice = await stripe.prices.create({
      product: product.id, currency: "eur", unit_amount: item.monthly * 3,
      recurring: { interval: "month", interval_count: 3 }, metadata: { slug: item.slug, billing: "quarterly" },
    });
    console.log(`${item.slug}\t${monthlyPrice.id}\t${quarterlyPrice.id}`);
  }
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
