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
        features: [
          "Alles in Professional, plus:",
          "Blog / nieuwssectie",
          "Meertalige website (NL + 1 extra taal)",
          "Geavanceerde formulieren (offerte, booking, multi-step)",
          "Performance optimalisatie (Core Web Vitals)",
          "Maandelijks prestatierapport",
          "5 content wijzigingen per maand",
          "Dedicated accountmanager",
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
        description: "3 uur campagnebeheer + 1 uur rapportage per maand. Keyword onderzoek, A/B testing en maandelijks prestatierapport. Exclusief advertentiebudget.",
        monthlyPriceCents: 24900,
        isActive: true,
        icon: "megaphone",
      },
      {
        slug: "meta-ads",
        name: "Meta Ads Beheer",
        description: "3 uur campagnebeheer + 1 uur rapportage per maand. Doelgroep targeting, retargeting en advertentie creatie. Exclusief advertentiebudget.",
        monthlyPriceCents: 24900,
        isActive: true,
        icon: "share-2",
      },
      {
        slug: "extra-content",
        name: "Extra Content Wijzigingen",
        description: "5 extra content wijzigingen per maand bovenop uw plan. Tekst aanpassingen, afbeeldingen vervangen en kleine layout wijzigingen.",
        monthlyPriceCents: 2900,
        isActive: true,
        icon: "file-text",
      },
      {
        slug: "ecommerce",
        name: "E-commerce Module",
        description: "Webshop functionaliteit tot 50 producten. Betaalintegratie (iDEAL, Bancontact, creditcard), voorraadbeheer en verzendopties.",
        monthlyPriceCents: 7900,
        isActive: true,
        icon: "shopping-cart",
      },
      {
        slug: "social-media",
        name: "Social Media Beheer",
        description: "8 posts per maand op 2 platforms. Contentplanning, creatie, community management en maandelijks overzicht.",
        monthlyPriceCents: 19900,
        isActive: true,
        icon: "users",
      },
      {
        slug: "booking",
        name: "Booking / Reserveringssysteem",
        description: "Online agenda en boekingssysteem met automatische bevestigingsmails, klant-zelf-boeken widget en Google Calendar sync.",
        monthlyPriceCents: 3900,
        isActive: true,
        icon: "calendar",
      },
    ]);
    console.log("Add-ons created");
  }

  const existingAdmins = await db.select().from(users).where(eq(users.role, "ADMIN"));
  if (existingAdmins.length === 0) {
    console.log("Creating admin user...");
    const passwordHash = await hashPassword("admin123");
    await db.insert(users).values({
      email: "admin@websiteabonnementen.nl",
      name: "Platform Admin",
      passwordHash,
      role: "ADMIN",
    });
    console.log("Admin user created (email: admin@websiteabonnementen.nl, password: admin123)");
  } else {
    console.log("Updating admin password...");
    const passwordHash = await hashPassword("admin123");
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, "admin@websiteabonnementen.nl"));
    console.log("Admin password updated");
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
