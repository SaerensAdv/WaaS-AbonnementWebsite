import { db } from "./db";
import { plans, addOns, users, specialistProfiles } from "@shared/schema";
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
        monthlyPriceCents: 9900,
        yearlyPriceCents: 99000,
        includedPages: 5,
        includedCredits: 2,
        includedTemplatesMax: 3,
        features: [
          "Professionele website",
          "Beheerde hosting",
          "SSL certificaat",
          "Basis SEO",
          "Email support",
        ],
        slaText: "Response binnen 48 uur",
        isActive: true,
      },
      {
        name: "Professional",
        tier: "MEDIUM",
        monthlyPriceCents: 19900,
        yearlyPriceCents: 199000,
        includedPages: 10,
        includedCredits: 5,
        includedTemplatesMax: 10,
        features: [
          "Alles in Starter",
          "10 premium templates",
          "Geavanceerde SEO",
          "Analytics dashboard",
          "Priority support",
          "Maandelijks rapport",
        ],
        slaText: "Response binnen 24 uur",
        isActive: true,
      },
      {
        name: "Enterprise",
        tier: "HIGH",
        monthlyPriceCents: 49900,
        yearlyPriceCents: 499000,
        includedPages: 999,
        includedCredits: 20,
        includedTemplatesMax: 999,
        features: [
          "Alles in Professional",
          "Custom design",
          "Onbeperkte paginas",
          "Dedicated specialist",
          "Telefoon support",
          "SLA garantie",
        ],
        slaText: "Response binnen 4 uur",
        isActive: true,
      },
    ]);
    console.log("Plans created");
  }

  const existingAddOns = await db.select().from(addOns);
  if (existingAddOns.length === 0) {
    console.log("Creating add-ons...");
    await db.insert(addOns).values([
      {
        slug: "google-ads",
        name: "Google Ads Beheer",
        description: "Professioneel beheer van uw Google Ads campagnes met maandelijkse optimalisatie en rapportage.",
        baseFeeCents: 0,
        requiresBudget: true,
        minBudgetCents: 50000,
        mediaPercentageMin: 80,
        mediaPercentageMax: 90,
        mediaPercentageDefault: 85,
        isActive: true,
      },
      {
        slug: "meta-ads",
        name: "Meta Ads Beheer",
        description: "Beheer van Facebook en Instagram advertenties met doelgroep targeting en A/B testing.",
        baseFeeCents: 0,
        requiresBudget: true,
        minBudgetCents: 50000,
        mediaPercentageMin: 80,
        mediaPercentageMax: 90,
        mediaPercentageDefault: 85,
        isActive: true,
      },
      {
        slug: "seo",
        name: "SEO Optimalisatie",
        description: "Maandelijkse SEO optimalisatie inclusief keyword research, content suggesties en technische audits.",
        baseFeeCents: 29900,
        requiresBudget: false,
        isActive: true,
      },
      {
        slug: "content",
        name: "Content Creatie",
        description: "Professionele content voor uw website inclusief blogartikelen en landingpages.",
        baseFeeCents: 39900,
        requiresBudget: false,
        isActive: true,
      },
      {
        slug: "local-seo",
        name: "Lokale SEO",
        description: "Optimalisatie voor lokale zoekopdrachten inclusief Google Business Profile beheer.",
        baseFeeCents: 19900,
        requiresBudget: false,
        isActive: true,
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
    console.log("Updating admin password to use bcrypt...");
    const passwordHash = await hashPassword("admin123");
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, "admin@websiteabonnementen.nl"));
    console.log("Admin password updated");
  }

  console.log("Seeding completed!");
}

seed().catch(console.error).finally(() => process.exit(0));
