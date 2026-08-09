import { db } from "./db";
import { users } from "@shared/schema";
import { syncAddOnCatalog } from "./addonCatalog";
import { syncPlanCatalog } from "./planCatalog";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  console.log("Seeding database...");

  await syncPlanCatalog();
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
