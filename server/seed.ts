import { db } from "./db";
import { plans, addOns, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  console.log("Seeding database...");

  const existingPlans = await db.select().from(plans);
  if (existingPlans.length === 0) {
    console.log("Creating plans...");
    await db.insert(plans).values([
      {
        name: "Starter",
        tier: "LOW",
        monthlyPriceCents: 4900,
        includedPages: 5,
        stripePriceId: "price_1TDvSbAc0256vmxD2Ebe1D1i",
        features: [
          "Op maat gemaakt design",
          "Responsive (mobiel-vriendelijk)",
          "Beheerde hosting & SSL",
          "Contactformulier",
          "Basis SEO (meta tags, sitemap, Google indexering)",
          "Cookie banner (ConsentEase) inbegrepen",
          "Onderhoud & beveiligingsupdates",
          "1 content wijziging per maand",
          "E-mail support (reactie binnen 24 uur)",
        ],
        isActive: true,
      },
      {
        name: "Professional",
        tier: "MEDIUM",
        monthlyPriceCents: 9900,
        includedPages: 10,
        stripePriceId: "price_1TDvScAc0256vmxDmNrKQdt2",
        features: [
          "Alles in Starter, plus:",
          "Google Analytics & Search Console setup",
          "Geavanceerde SEO (keyword onderzoek, technische optimalisatie)",
          "Social media integratie (feed, deelknoppen, Open Graph)",
          "Google Maps integratie",
          "Beeldbank toegang (stockfoto's)",
          "3 content wijzigingen per maand",
          "Prioriteit e-mail & telefoon support (reactie binnen 8 uur)",
        ],
        isActive: true,
      },
      {
        name: "Business",
        tier: "HIGH",
        monthlyPriceCents: 19900,
        includedPages: 20,
        stripePriceId: "price_1TDvScAc0256vmxDLbhrMpRz",
        features: [
          "Alles in Professional, plus:",
          "Blog / nieuwssectie",
          "Meertalige website (NL + 1 extra taal)",
          "Geavanceerde formulieren (offerte, booking, multi-step)",
          "Performance optimalisatie (Core Web Vitals)",
          "Maandelijks prestatierapport",
          "5 content wijzigingen per maand",
          "Vast aanspreekpunt",
          "Prioriteit support (reactie binnen 4 uur)",
        ],
        isActive: true,
      },
    ]);
    console.log("Plans created: Starter (€49), Professional (€99), Business (€199)");
  }

  const existingAddOns = await db.select().from(addOns);
  if (existingAddOns.length === 0) {
    console.log("Creating add-ons...");
    await db.insert(addOns).values([
      {
        slug: "google-ads",
        name: "Google Ads Beheer",
        description: "Wekelijks zoektermen reviewen, biedstrategieën, conversie tracking en maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget.",
        monthlyPriceCents: 24900,
        isActive: true,
        icon: "megaphone",
        stripePriceId: "price_1U0i5fEyM9IEHbH5hrU6V40x",
        stripeQuarterlyPriceId: "price_1U0i5gEyM9IEHbH5GvLG76tg",
      },
      {
        slug: "google-ads-ecommerce",
        name: "Google Ads + E-commerce/Shopping",
        description: "Google Ads + Merchant Center, Shopping campagnes, feedbeheer en productoptimalisatie. Max 5 uur/maand. Min fee €349 of 10% van ad spend. Excl. advertentiebudget.",
        monthlyPriceCents: 34900,
        isActive: true,
        icon: "shopping-bag",
        stripePriceId: "price_1U0i5gEyM9IEHbH5e6K1LPLO",
        stripeQuarterlyPriceId: "price_1U0i5gEyM9IEHbH5jCUoE5r6",
      },
      {
        slug: "meta-ads",
        name: "Meta Ads Beheer",
        description: "Campagne-opzet, doelgroepen, A/B tests, Pixel en Conversions API setup, maandrapportage. Max 4 uur/maand. Min fee €249 of 10% van ad spend. Excl. advertentiebudget.",
        monthlyPriceCents: 24900,
        isActive: true,
        icon: "share-2",
        stripePriceId: "price_1U0i5hEyM9IEHbH5AmD04dov",
        stripeQuarterlyPriceId: "price_1U0i5hEyM9IEHbH5XcUmX4Kk",
      },
      {
        slug: "seo",
        name: "SEO Optimalisatie",
        description: "On-page optimalisatie (2 pagina's/maand), technische monitoring, 20 keywords tracking, GSC rapportage in dashboard.",
        monthlyPriceCents: 19900,
        isActive: true,
        icon: "search",
        stripePriceId: "price_1U0i5hEyM9IEHbH5CFYUXmQr",
        stripeQuarterlyPriceId: "price_1U0i5hEyM9IEHbH5ERvnP3fQ",
      },
      {
        slug: "local-seo",
        name: "Lokale SEO",
        description: "Google Business Profile optimalisatie, lokale rankings, review management en lokale citaties.",
        monthlyPriceCents: 9900,
        isActive: true,
        icon: "map-pin",
        stripePriceId: "price_1U0i5hEyM9IEHbH580JpPP5a",
        stripeQuarterlyPriceId: "price_1U0i5iEyM9IEHbH55v6YSeNe",
      },
      {
        slug: "social-media",
        name: "Social Media Beheer",
        description: "8 posts per maand op 2 kanalen, contentkalender, basis design, scheduling en community management (1x/dag).",
        monthlyPriceCents: 19900,
        isActive: true,
        icon: "users",
        stripePriceId: "price_1U0i5iEyM9IEHbH5C4NOHEPL",
        stripeQuarterlyPriceId: "price_1U0i5iEyM9IEHbH5GxdB7P0h",
      },
      {
        slug: "ecommerce",
        name: "E-commerce Module",
        description: "Webshop functionaliteit tot 50 producten. Stripe/Mollie betalingen, productbeheer en bestelbevestigingsmails.",
        monthlyPriceCents: 7900,
        isActive: true,
        icon: "shopping-cart",
        stripePriceId: "price_1U0i5iEyM9IEHbH5jymoatSa",
        stripeQuarterlyPriceId: "price_1U0i5iEyM9IEHbH5IWu8ExgQ",
      },
      {
        slug: "booking",
        name: "Booking / Reserveringssysteem",
        description: "Online boekingssysteem met kalender sync, bevestigingsmails en klant-zelf-boeken widget. Max 3 diensten.",
        monthlyPriceCents: 3900,
        isActive: true,
        icon: "calendar",
        stripePriceId: "price_1U0i5jEyM9IEHbH50z6yuq0j",
        stripeQuarterlyPriceId: "price_1U0i5jEyM9IEHbH5uWhaeNvg",
      },
      {
        slug: "extra-content-bundle",
        name: "Extra Content Wijzigingen (bundel)",
        description: "Tot 10 content wijzigingen per maand. Tekst, afbeeldingen en kleine layout aanpassingen (fair use, max 15 min per wijziging).",
        monthlyPriceCents: 7900,
        isActive: true,
        icon: "file-text",
        stripePriceId: "price_1U0i5jEyM9IEHbH5CsOoM3ru",
        stripeQuarterlyPriceId: "price_1U0i5jEyM9IEHbH5GeJuaiNn",
      },
    ]);
    console.log("Add-ons created");
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn(
      "⚠️  ADMIN_PASSWORD is not set — falling back to an insecure development default. " +
      "Set a strong ADMIN_PASSWORD secret before going live, then re-run the seed.",
    );
  }
  const adminPasswordPlain = adminPassword || "admin123";

  const existingAdmins = await db.select().from(users).where(eq(users.role, "ADMIN"));
  if (existingAdmins.length === 0) {
    console.log("Creating admin user...");
    const passwordHash = await hashPassword(adminPasswordPlain);
    await db.insert(users).values({
      email: "admin@websiteabonnementen.nl",
      name: "Platform Admin",
      passwordHash,
      role: "ADMIN",
    });
    console.log("Admin user created (email: admin@websiteabonnementen.nl)");
  } else {
    console.log("Updating admin password...");
    const passwordHash = await hashPassword(adminPasswordPlain);
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, "admin@websiteabonnementen.nl"));
    console.log("Admin password updated");
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
