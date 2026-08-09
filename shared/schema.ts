import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "CUSTOMER"]);
export const planTierEnum = pgEnum("plan_tier", ["LOW", "MEDIUM", "HIGH"]);
export const projectStatusEnum = pgEnum("project_status", ["ONBOARDING", "PRODUCTION", "LIVE", "MAINTENANCE"]);
export const addOnStatusEnum = pgEnum("addon_status", ["REQUESTED", "ACTIVE", "PAUSED", "CANCELLED"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["ACTIVE", "PAST_DUE", "CANCELED", "INCOMPLETE"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("CUSTOMER"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  companyName: text("company_name"),
  vatNumber: text("vat_number"),
  address: text("address"),
  phone: text("phone"),
  stripeCustomerId: text("stripe_customer_id"),
  adminNotes: text("admin_notes"),
});

export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tier: planTierEnum("tier").notNull(),
  monthlyPriceCents: integer("monthly_price_cents").notNull(),
  includedPages: integer("included_pages").default(5),
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  stripePriceId: text("stripe_price_id"),
  stripeQuarterlyPriceId: text("stripe_quarterly_price_id"),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => plans.id).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: subscriptionStatusEnum("status").default("INCOMPLETE"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_subscriptions_user_id").on(table.userId),
  index("idx_subscriptions_stripe_sub_id").on(table.stripeSubscriptionId),
]);

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => plans.id).notNull(),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id),
  status: projectStatusEnum("status").default("ONBOARDING"),
  companyName: text("company_name"),
  domain: text("domain"),
  websiteUrl: text("website_url"),
  ga4PropertyId: text("ga4_property_id"),
  gscSiteUrl: text("gsc_site_url"),
  notes: text("notes"),
  onboardingData: jsonb("onboarding_data"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_projects_user_id").on(table.userId),
]);

export const addOns = pgTable("add_ons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  monthlyPriceCents: integer("monthly_price_cents").notNull(),
  isActive: boolean("is_active").default(true),
  icon: text("icon"),
  stripePriceId: text("stripe_price_id"),
  stripeQuarterlyPriceId: text("stripe_quarterly_price_id"),
});

export const addOnSelections = pgTable("add_on_selections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id).notNull(),
  addOnId: varchar("add_on_id").references(() => addOns.id).notNull(),
  stripeItemId: text("stripe_item_id"),
  status: addOnStatusEnum("status").default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_addon_selections_subscription_id").on(table.subscriptionId),
]);

export const quoteRequestStatusEnum = pgEnum("quote_request_status", ["NEW", "CONTACTED", "QUOTED", "ACCEPTED", "DECLINED"]);

export const quoteRequests = pgTable("quote_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("project_type").notNull(),
  budgetRange: text("budget_range"),
  description: text("description").notNull(),
  currentWebsite: text("current_website"),
  details: jsonb("details"),
  status: quoteRequestStatusEnum("status").default("NEW"),
  clickupTaskId: text("clickup_task_id"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_password_reset_tokens_user_id").on(table.userId),
]);

export const changeRequestStatusEnum = pgEnum("change_request_status", ["pending", "in_progress", "completed", "rejected"]);

// Wijzigingscredits: maandelijkse allocatie per klant
export const creditAllocations = pgTable("credit_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  includedCredits: integer("included_credits").notNull().default(2),
  bonusCredits: integer("bonus_credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_credit_allocations_user_id").on(table.userId),
  uniqueIndex("uq_credit_allocations_user_period").on(table.userId, table.periodStart),
]);

// Wijzigingsverzoeken (credit usage)
export const changeRequests = pgTable("change_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  allocationId: varchar("allocation_id").references(() => creditAllocations.id),
  title: text("title").notNull(),
  description: text("description"),
  creditsUsed: integer("credits_used").notNull().default(1),
  isPaidExtra: boolean("is_paid_extra").default(false),
  status: changeRequestStatusEnum("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_change_requests_user_id").on(table.userId),
  index("idx_change_requests_allocation_id").on(table.allocationId),
]);

export const processedWebhookEvents = pgTable("processed_webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: text("event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  subscriptions: many(subscriptions),
  projects: many(projects),
}));

export const customerProfilesRelations = relations(customerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [customerProfiles.userId],
    references: [users.id],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
  projects: many(projects),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  projects: many(projects),
  addOnSelections: many(addOnSelections),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [projects.planId],
    references: [plans.id],
  }),
  subscription: one(subscriptions, {
    fields: [projects.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const addOnsRelations = relations(addOns, ({ many }) => ({
  selections: many(addOnSelections),
}));

export const addOnSelectionsRelations = relations(addOnSelections, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [addOnSelections.subscriptionId],
    references: [subscriptions.id],
  }),
  addOn: one(addOns, {
    fields: [addOnSelections.addOnId],
    references: [addOns.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).omit({
  id: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertAddOnSchema = createInsertSchema(addOns).omit({
  id: true,
});

export const insertAddOnSelectionSchema = createInsertSchema(addOnSelections).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  createdAt: true,
  status: true,
  clickupTaskId: true,
  adminNotes: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type AddOn = typeof addOns.$inferSelect;
export type InsertAddOn = z.infer<typeof insertAddOnSchema>;
export type AddOnSelection = typeof addOnSelections.$inferSelect;
export type InsertAddOnSelection = z.infer<typeof insertAddOnSelectionSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;

export const insertCreditAllocationSchema = createInsertSchema(creditAllocations).omit({
  id: true,
  createdAt: true,
});

export const insertChangeRequestSchema = createInsertSchema(changeRequests).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type CreditAllocation = typeof creditAllocations.$inferSelect;
export type InsertCreditAllocation = z.infer<typeof insertCreditAllocationSchema>;
export type ChangeRequest = typeof changeRequests.$inferSelect;
export type InsertChangeRequest = z.infer<typeof insertChangeRequestSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string()
    .min(8, "Wachtwoord moet minimaal 8 tekens bevatten")
    .regex(/[A-Z]/, "Wachtwoord moet minimaal 1 hoofdletter bevatten")
    .regex(/[0-9]/, "Wachtwoord moet minimaal 1 cijfer bevatten"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
