import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "CUSTOMER", "SPECIALIST"]);
export const planTierEnum = pgEnum("plan_tier", ["LOW", "MEDIUM", "HIGH"]);
export const projectStatusEnum = pgEnum("project_status", ["ONBOARDING", "PRODUCTION", "LIVE", "MAINTENANCE"]);
export const addOnStatusEnum = pgEnum("addon_status", ["REQUESTED", "ACTIVE", "PAUSED"]);
export const assignmentStatusEnum = pgEnum("assignment_status", ["PROPOSED", "ACTIVE", "ENDED"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["ACTIVE", "PAST_DUE", "CANCELED", "INCOMPLETE"]);
export const showcaseOptInEnum = pgEnum("showcase_opt_in", ["PENDING", "APPROVED", "DECLINED", "REVOKED"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("CUSTOMER"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Profile
export const customerProfiles = pgTable("customer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  companyName: text("company_name"),
  vatNumber: text("vat_number"),
  address: text("address"),
  phone: text("phone"),
  stripeCustomerId: text("stripe_customer_id"),
});

// Specialist Profile
export const specialistProfiles = pgTable("specialist_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  skills: text("skills").array(),
  niches: text("niches").array(),
  languages: text("languages").array(),
  capacity: integer("capacity").default(5),
  approved: boolean("approved").default(false),
  bio: text("bio"),
});

// Plans
export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tier: planTierEnum("tier").notNull(),
  monthlyPriceCents: integer("monthly_price_cents").notNull(),
  includedTemplatesMin: integer("included_templates_min").default(0),
  includedTemplatesMax: integer("included_templates_max").default(0),
  includedCredits: integer("included_credits").default(0),
  includedPages: integer("included_pages").default(5),
  slaText: text("sla_text"),
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  stripePriceId: text("stripe_price_id"),
});

// Templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  planEligibility: planTierEnum("plan_eligibility").notNull(),
  previewImageUrl: text("preview_image_url"),
  category: text("category"),
  isActive: boolean("is_active").default(true),
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => plans.id).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: subscriptionStatusEnum("status").default("INCOMPLETE"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => plans.id).notNull(),
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id),
  templateId: varchar("template_id").references(() => templates.id),
  status: projectStatusEnum("status").default("ONBOARDING"),
  onboardingData: jsonb("onboarding_data"),
  domain: text("domain"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  // Showcase fields for public portfolio
  publicUrl: text("public_url"),
  showcaseOptIn: showcaseOptInEnum("showcase_opt_in").default("PENDING"),
  showcaseThumbnailUrl: text("showcase_thumbnail_url"),
  showcaseTitle: text("showcase_title"),
  showcaseDescription: text("showcase_description"),
  showcaseIndustry: text("showcase_industry"),
  showcaseFeatured: boolean("showcase_featured").default(false),
  launchedAt: timestamp("launched_at"),
});

// Add-ons
export const addOns = pgTable("add_ons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  requiresBudget: boolean("requires_budget").default(false),
  configSchema: jsonb("config_schema"),
  baseFeeCents: integer("base_fee_cents"),
  mediaPercentageMin: integer("media_percentage_min").default(80),
  mediaPercentageMax: integer("media_percentage_max").default(90),
  mediaPercentageDefault: integer("media_percentage_default").default(85),
  minBudgetCents: integer("min_budget_cents").default(50000),
  isActive: boolean("is_active").default(true),
  icon: text("icon"),
});

// Add-on Selections
export const addOnSelections = pgTable("add_on_selections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  addOnId: varchar("add_on_id").references(() => addOns.id).notNull(),
  totalBudgetCents: integer("total_budget_cents"),
  mediaBudgetCents: integer("media_budget_cents"),
  managementBudgetCents: integer("management_budget_cents"),
  mediaPercentage: integer("media_percentage").default(85),
  configData: jsonb("config_data"),
  status: addOnStatusEnum("status").default("REQUESTED"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  addOnSelectionId: varchar("add_on_selection_id").references(() => addOnSelections.id).notNull(),
  specialistUserId: varchar("specialist_user_id").references(() => users.id).notNull(),
  status: assignmentStatusEnum("status").default("PROPOSED"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  month: text("month").notNull(),
  type: text("type").notNull(),
  summaryText: text("summary_text"),
  kpiData: jsonb("kpi_data"),
  dashboardUrl: text("dashboard_url"),
  createdByUserId: varchar("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Log
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorUserId: varchar("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Config (for admin settings like budget split ranges)
export const systemConfig = pgTable("system_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password Reset Tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog Status Enum
export const blogStatusEnum = pgEnum("blog_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  focusKeyword: text("focus_keyword"),
  supportingKeywords: text("supporting_keywords").array(),
  featuredImageUrl: text("featured_image_url"),
  featuredImageAlt: text("featured_image_alt"),
  intro: text("intro").notNull(),
  keyTakeaways: text("key_takeaways").array(),
  content: text("content").notNull(),
  inArticleImages: jsonb("in_article_images"),
  inArticleVideos: jsonb("in_article_videos"),
  authorId: varchar("author_id").references(() => users.id),
  authorBio: text("author_bio"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  status: blogStatusEnum("status").default("DRAFT"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  readTimeMinutes: integer("read_time_minutes").default(5),
  category: text("category"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  specialistProfile: one(specialistProfiles, {
    fields: [users.id],
    references: [specialistProfiles.userId],
  }),
  subscriptions: many(subscriptions),
  projects: many(projects),
  assignments: many(assignments),
  reports: many(reports),
}));

export const customerProfilesRelations = relations(customerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [customerProfiles.userId],
    references: [users.id],
  }),
}));

export const specialistProfilesRelations = relations(specialistProfiles, ({ one }) => ({
  user: one(users, {
    fields: [specialistProfiles.userId],
    references: [users.id],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  templates: many(templates),
  subscriptions: many(subscriptions),
  projects: many(projects),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
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
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
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
  template: one(templates, {
    fields: [projects.templateId],
    references: [templates.id],
  }),
  addOnSelections: many(addOnSelections),
  reports: many(reports),
}));

export const addOnsRelations = relations(addOns, ({ many }) => ({
  selections: many(addOnSelections),
}));

export const addOnSelectionsRelations = relations(addOnSelections, ({ one, many }) => ({
  project: one(projects, {
    fields: [addOnSelections.projectId],
    references: [projects.id],
  }),
  addOn: one(addOns, {
    fields: [addOnSelections.addOnId],
    references: [addOns.id],
  }),
  assignments: many(assignments),
}));

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  addOnSelection: one(addOnSelections, {
    fields: [assignments.addOnSelectionId],
    references: [addOnSelections.id],
  }),
  specialist: one(users, {
    fields: [assignments.specialistUserId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  project: one(projects, {
    fields: [reports.projectId],
    references: [projects.id],
  }),
  createdBy: one(users, {
    fields: [reports.createdByUserId],
    references: [users.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).omit({
  id: true,
});

export const insertSpecialistProfileSchema = createInsertSchema(specialistProfiles).omit({
  id: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
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

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type SpecialistProfile = typeof specialistProfiles.$inferSelect;
export type InsertSpecialistProfile = z.infer<typeof insertSpecialistProfileSchema>;
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type AddOn = typeof addOns.$inferSelect;
export type InsertAddOn = z.infer<typeof insertAddOnSchema>;
export type AddOnSelection = typeof addOnSelections.$inferSelect;
export type InsertAddOnSelection = z.infer<typeof insertAddOnSelectionSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Onboarding data type
export interface OnboardingData {
  step: number;
  completed: boolean;
  assets?: {
    logo?: string;
    images?: string[];
    brandColors?: string[];
  };
  content?: {
    companyDescription?: string;
    services?: string[];
    targetAudience?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  domain?: {
    preferred?: string;
    alternatives?: string[];
  };
}

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "SPECIALIST"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
