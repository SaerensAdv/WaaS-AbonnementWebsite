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
          "Professionele website",
          "Beheerde hosting",
          "SSL certificaat",
          "Responsive design",
          "Contactformulier",
          "Onderhoud & updates",
        ],
        isActive: true,
      },
      {
        name: "Professional",
        tier: "MEDIUM",
        monthlyPriceCents: 9900,
        includedPages: 10,
        features: [
          "Alles in Starter",
          "SEO basis optimalisatie",
          "2 content updates per maand",
          "Google Analytics setup",
          "Social media integratie",
        ],
        isActive: true,
      },
      {
        name: "Business",
        tier: "HIGH",
        monthlyPriceCents: 19900,
        includedPages: 20,
        features: [
          "Alles in Professional",
          "5 content updates per maand",
          "Prioriteit support",
          "Geavanceerde SEO",
          "Performance optimalisatie",
          "Maandelijks rapport",
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
        description: "Professioneel beheer van uw Google Ads campagnes met maandelijkse optimalisatie en rapportage.",
        monthlyPriceCents: 14900,
        isActive: true,
        icon: "megaphone",
      },
      {
        slug: "meta-ads",
        name: "Meta Ads Beheer",
        description: "Beheer van Facebook en Instagram advertenties met doelgroep targeting en A/B testing.",
        monthlyPriceCents: 14900,
        isActive: true,
        icon: "share-2",
      },
      {
        slug: "seo",
        name: "SEO Pakket",
        description: "Maandelijkse SEO optimalisatie inclusief keyword research, content suggesties en technische audits.",
        monthlyPriceCents: 9900,
        isActive: true,
        icon: "search",
      },
      {
        slug: "content",
        name: "Content Creatie",
        description: "Professionele content voor uw website inclusief blogartikelen en landingpages.",
        monthlyPriceCents: 7900,
        isActive: true,
        icon: "pen-tool",
      },
      {
        slug: "cookie-banner",
        name: "Cookie Banner (ConsentEase)",
        description: "GDPR-conforme cookie banner met volledige consent management en rapportage.",
        monthlyPriceCents: 900,
        isActive: true,
        icon: "shield-check",
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
