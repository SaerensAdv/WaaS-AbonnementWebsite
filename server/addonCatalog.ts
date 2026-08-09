import { db } from "./db";
import { addOns } from "@shared/schema";
import { notInArray } from "drizzle-orm";

/**
 * Canonical add-on catalog (Aug 2026 pricing model). Price IDs differ per Stripe mode:
 * - test: created in the development (sandbox/test-mode) Stripe account
 * - live: created in the production (live-mode) Stripe account
 * The sync picks the right set based on REPLIT_DEPLOYMENT.
 *
 * Live prices (Aug 2026 activation) match the new amounts; the old live
 * prices are deactivated in Stripe. A missing quarterly price ID makes an
 * add-on "not yet available for purchase" in that mode.
 */
type PricePair = { monthly: string | null; quarterly: string | null };

const CATALOG: {
  slug: string;
  name: string;
  description: string;
  monthlyPriceCents: number;
  icon: string;
  test: PricePair;
  live: PricePair;
}[] = [
  {
    slug: "google-ads",
    name: "Google Ads Beheer",
    description: "Campagnes, zoektermen, optimalisatie en maandrapportage. 3u beheer/maand. Min fee €349 of 12% van ad spend. Excl. advertentiebudget.",
    monthlyPriceCents: 34900,
    icon: "megaphone",
    test: { monthly: "price_1U2YNlEyM9IEHbH5EJKUibSi", quarterly: "price_1U2YNlEyM9IEHbH5VTgweFk9" },
    live: { monthly: "price_1U2aMuAc0256vmxD4w6JWp54", quarterly: "price_1U2aMwAc0256vmxD3jMVB87f" },
  },
  {
    slug: "google-ads-ecommerce",
    name: "Google Ads + Shopping",
    description: "Search + Merchant Center, productfeed en Shopping campagnes. 4u beheer/maand. Min fee €449 of 12% van ad spend. Excl. advertentiebudget.",
    monthlyPriceCents: 44900,
    icon: "shopping-bag",
    test: { monthly: "price_1U2YNlEyM9IEHbH5nzxFJYG8", quarterly: "price_1U2YNlEyM9IEHbH5GkYWQrxz" },
    live: { monthly: "price_1U2aMzAc0256vmxDKcXDTEx1", quarterly: "price_1U2aN1Ac0256vmxDoAWTJRhF" },
  },
  {
    slug: "meta-ads",
    name: "Meta Ads Beheer",
    description: "Facebook en Instagram campagnes, doelgroepen, Pixel/CAPI en maandrapportage. 3u beheer/maand. Min fee €349 of 12% van ad spend. Excl. advertentiebudget.",
    monthlyPriceCents: 34900,
    icon: "share-2",
    test: { monthly: "price_1U2YNmEyM9IEHbH5hLRxlWAt", quarterly: "price_1U2YNmEyM9IEHbH5MCbuxqu7" },
    live: { monthly: "price_1U2aN3Ac0256vmxDDCdr7pi5", quarterly: "price_1U2aN6Ac0256vmxDBoGyUcUE" },
  },
  {
    slug: "seo",
    name: "SEO Optimalisatie",
    description: "On-page optimalisatie, technische monitoring en kwartaalrapport. 2u/maand.",
    monthlyPriceCents: 34900,
    icon: "search",
    test: { monthly: "price_1U2YNmEyM9IEHbH5ATwSkjR7", quarterly: "price_1U2YNmEyM9IEHbH5u1zkhqLE" },
    live: { monthly: "price_1U2aN8Ac0256vmxDsMPUlncO", quarterly: "price_1U2aNAAc0256vmxDf3ejc3Ah" },
  },
  {
    slug: "local-seo",
    name: "Lokale SEO",
    description: "Google Business Profile optimalisatie, maandelijkse check en review-monitoring. 1u/maand.",
    monthlyPriceCents: 19900,
    icon: "map-pin",
    test: { monthly: "price_1U2YNnEyM9IEHbH5mVO4afd7", quarterly: "price_1U2YNnEyM9IEHbH5JVIgfDGT" },
    live: { monthly: "price_1U2aNCAc0256vmxDOaIG96EK", quarterly: "price_1U2aNEAc0256vmxDxOX94mvb" },
  },
  {
    slug: "social-media",
    name: "Social Media Beheer",
    description: "6 posts/maand op 2 kanalen, contentplanning en basis community management. 4u/maand.",
    monthlyPriceCents: 39900,
    icon: "users",
    test: { monthly: "price_1U2YNnEyM9IEHbH50hUYoksc", quarterly: "price_1U2YNnEyM9IEHbH5e0B6YrCP" },
    live: { monthly: "price_1U2aNGAc0256vmxDN6bE396N", quarterly: "price_1U2aNIAc0256vmxDrWh5Sc0Z" },
  },
  {
    slug: "ecommerce",
    name: "E-commerce Module",
    description: "Webshop tot 50 producten met Stripe/Mollie. Eenmalige setup €199.",
    monthlyPriceCents: 9900,
    icon: "shopping-cart",
    test: { monthly: "price_1U2YNoEyM9IEHbH5eaK3N5X2", quarterly: "price_1U2YNoEyM9IEHbH5EsoPdxnY" },
    live: { monthly: "price_1U2aNKAc0256vmxDWV8g5yac", quarterly: "price_1U2aNMAc0256vmxDKUx2L3y7" },
  },
  {
    slug: "booking",
    name: "Booking / Reserveringssysteem",
    description: "Online boekingssysteem met kalender, bevestigingsmails en klant-zelf-boeken widget. Max 3 diensten. Eenmalige setup €99.",
    monthlyPriceCents: 4900,
    icon: "calendar",
    test: { monthly: "price_1U2YNoEyM9IEHbH5WJqdESdk", quarterly: "price_1U2YNoEyM9IEHbH56OcL9Sun" },
    live: { monthly: "price_1U2aNQAc0256vmxDqQjQIoiN", quarterly: "price_1U2aNUAc0256vmxD84L8gPZ1" },
  },
  {
    slug: "extra-pages",
    name: "Extra Pagina's",
    description: "Per bijkomende pagina boven de 5. Eenmalige bouw €149, daarna €15/maand onderhoud inbegrepen.",
    monthlyPriceCents: 1500,
    icon: "file-plus",
    test: { monthly: "price_1U2YNpEyM9IEHbH59Tpq2dqi", quarterly: "price_1U2YNpEyM9IEHbH5NfAeOPox" },
    live: { monthly: "price_1U2aNWAc0256vmxDG0MAebQs", quarterly: "price_1U2aNXAc0256vmxDhYFofXx9" },
  },
];

/**
 * Idempotent add-on catalog sync, run at server startup.
 * Upserts the catalog add-ons (mode-appropriate Stripe price IDs) and
 * deactivates any add-ons that are no longer in the catalog
 * (e.g. the removed "extra-content-bundle").
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
