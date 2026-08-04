import { db } from "./db";
import { addOns } from "@shared/schema";
import { notInArray } from "drizzle-orm";

/**
 * Canonical add-on catalog. Price IDs differ per Stripe mode:
 * - test: created in the development (sandbox/test-mode) Stripe account
 * - live: created in the production (live-mode) Stripe account
 * The sync picks the right set based on REPLIT_DEPLOYMENT.
 */
const CATALOG = [
  {
    slug: "google-ads",
    name: "Google Ads Beheer",
    description: "Wekelijks zoektermen reviewen, biedstrategieën, conversie tracking en maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget.",
    monthlyPriceCents: 24900,
    icon: "megaphone",
    test: { monthly: "price_1U0i5fEyM9IEHbH5hrU6V40x", quarterly: "price_1U0i5gEyM9IEHbH5GvLG76tg" },
    live: { monthly: "price_1U0iCoAc0256vmxDNVFhUgRX", quarterly: "price_1U0iCoAc0256vmxDKuDy1uGA" },
  },
  {
    slug: "google-ads-ecommerce",
    name: "Google Ads + E-commerce/Shopping",
    description: "Google Ads + Merchant Center, Shopping campagnes, feedbeheer en productoptimalisatie. Max 5 uur/maand. Min fee €349 of 10% van ad spend. Excl. advertentiebudget.",
    monthlyPriceCents: 34900,
    icon: "shopping-bag",
    test: { monthly: "price_1U0i5gEyM9IEHbH5e6K1LPLO", quarterly: "price_1U0i5gEyM9IEHbH5jCUoE5r6" },
    live: { monthly: "price_1U0iCoAc0256vmxDRUITjBli", quarterly: "price_1U0iCoAc0256vmxDmPBBTeuD" },
  },
  {
    slug: "meta-ads",
    name: "Meta Ads Beheer",
    description: "Campagne-opzet, doelgroepen, A/B tests, Pixel en Conversions API setup, maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget.",
    monthlyPriceCents: 24900,
    icon: "share-2",
    test: { monthly: "price_1U0i5hEyM9IEHbH5AmD04dov", quarterly: "price_1U0i5hEyM9IEHbH5XcUmX4Kk" },
    live: { monthly: "price_1U0iCpAc0256vmxDLVNUhZIU", quarterly: "price_1U0iCpAc0256vmxDvnpajlDL" },
  },
  {
    slug: "seo",
    name: "SEO Optimalisatie",
    description: "On-page optimalisatie (2 pagina's/maand), technische monitoring, 20 keywords tracking, GSC rapportage in dashboard.",
    monthlyPriceCents: 19900,
    icon: "search",
    test: { monthly: "price_1U0i5hEyM9IEHbH5CFYUXmQr", quarterly: "price_1U0i5hEyM9IEHbH5ERvnP3fQ" },
    live: { monthly: "price_1U0iCpAc0256vmxDaDVoNymu", quarterly: "price_1U0iCpAc0256vmxDVa5JaCcF" },
  },
  {
    slug: "local-seo",
    name: "Lokale SEO",
    description: "Google Business Profile optimalisatie, lokale rankings, review management en lokale citaties.",
    monthlyPriceCents: 9900,
    icon: "map-pin",
    test: { monthly: "price_1U0i5hEyM9IEHbH580JpPP5a", quarterly: "price_1U0i5iEyM9IEHbH55v6YSeNe" },
    live: { monthly: "price_1U0iCqAc0256vmxDcL7SBO6m", quarterly: "price_1U0iCqAc0256vmxD6ezyb0p2" },
  },
  {
    slug: "social-media",
    name: "Social Media Beheer",
    description: "8 posts per maand op 2 kanalen, contentkalender, basis design, scheduling en community management (1x/dag).",
    monthlyPriceCents: 19900,
    icon: "users",
    test: { monthly: "price_1U0i5iEyM9IEHbH5C4NOHEPL", quarterly: "price_1U0i5iEyM9IEHbH5GxdB7P0h" },
    live: { monthly: "price_1U0iCqAc0256vmxDoaZPgnXs", quarterly: "price_1U0iCqAc0256vmxDiSzZKqWV" },
  },
  {
    slug: "ecommerce",
    name: "E-commerce Module",
    description: "Webshop functionaliteit tot 50 producten. Stripe/Mollie betalingen, productbeheer en bestelbevestigingsmails.",
    monthlyPriceCents: 7900,
    icon: "shopping-cart",
    test: { monthly: "price_1U0i5iEyM9IEHbH5jymoatSa", quarterly: "price_1U0i5iEyM9IEHbH5IWu8ExgQ" },
    live: { monthly: "price_1U0iCrAc0256vmxDpWpnRa6z", quarterly: "price_1U0iCrAc0256vmxD656C9BBu" },
  },
  {
    slug: "booking",
    name: "Booking / Reserveringssysteem",
    description: "Online boekingssysteem met kalender sync, bevestigingsmails en klant-zelf-boeken widget. Max 3 diensten.",
    monthlyPriceCents: 3900,
    icon: "calendar",
    test: { monthly: "price_1U0i5jEyM9IEHbH50z6yuq0j", quarterly: "price_1U0i5jEyM9IEHbH5uWhaeNvg" },
    live: { monthly: "price_1U0iCrAc0256vmxDVhjDT3KY", quarterly: "price_1U0iCrAc0256vmxD7MwS0v9w" },
  },
  {
    slug: "extra-content-bundle",
    name: "Extra Content Wijzigingen (bundel)",
    description: "Tot 10 content wijzigingen per maand. Tekst, afbeeldingen en kleine layout aanpassingen (fair use, max 15 min per wijziging).",
    monthlyPriceCents: 7900,
    icon: "file-text",
    test: { monthly: "price_1U0i5jEyM9IEHbH5CsOoM3ru", quarterly: "price_1U0i5jEyM9IEHbH5GeJuaiNn" },
    live: { monthly: "price_1U0iCsAc0256vmxD12XdKUZ2", quarterly: "price_1U0iCsAc0256vmxDWLXw9DiG" },
  },
] as const;

/**
 * Idempotent add-on catalog sync, run at server startup.
 * Upserts the 9 catalog add-ons (mode-appropriate Stripe price IDs) and
 * deactivates any add-ons that are no longer in the catalog.
 */
export async function syncAddOnCatalog(log: (msg: string, tag?: string) => void = console.log) {
  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const mode = isProduction ? "live" : "test";

  const rows = CATALOG.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    monthlyPriceCents: item.monthlyPriceCents,
    isActive: true,
    icon: item.icon,
    stripePriceId: item[mode].monthly,
    stripeQuarterlyPriceId: item[mode].quarterly,
  }));

  for (const row of rows) {
    await db
      .insert(addOns)
      .values(row)
      .onConflictDoUpdate({
        target: addOns.slug,
        set: {
          name: row.name,
          description: row.description,
          monthlyPriceCents: row.monthlyPriceCents,
          isActive: true,
          icon: row.icon,
          stripePriceId: row.stripePriceId,
          stripeQuarterlyPriceId: row.stripeQuarterlyPriceId,
        },
      });
  }

  // Deactivate (don't delete) add-ons no longer in the catalog, preserving
  // historical add_on_selections referencing them.
  const slugs = CATALOG.map((c) => c.slug);
  await db
    .update(addOns)
    .set({ isActive: false })
    .where(notInArray(addOns.slug, slugs));

  log(`Add-on catalog synced (${mode} mode, ${rows.length} add-ons)`, "catalog");
}
