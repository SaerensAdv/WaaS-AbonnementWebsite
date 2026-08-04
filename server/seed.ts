import { db } from "./db";
import { plans, users } from "@shared/schema";
import { syncAddOnCatalog } from "./addonCatalog";
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

  await syncAddOnCatalog();

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
