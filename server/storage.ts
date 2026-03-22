import { eq, and, desc, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  customerProfiles,
  plans,
  subscriptions,
  projects,
  addOns,
  addOnSelections,
  passwordResetTokens,
  quoteRequests,
  type User,
  type InsertUser,
  type CustomerProfile,
  type InsertCustomerProfile,
  type Plan,
  type InsertPlan,
  type Subscription,
  type InsertSubscription,
  type Project,
  type InsertProject,
  type AddOn,
  type InsertAddOn,
  type AddOnSelection,
  type InsertAddOnSelection,
  type QuoteRequest,
  type InsertQuoteRequest,
} from "@shared/schema";
import { randomBytes } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  getCustomerProfile(userId: string): Promise<CustomerProfile | undefined>;
  createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile>;
  updateCustomerProfile(userId: string, data: Partial<CustomerProfile>): Promise<CustomerProfile | undefined>;

  getPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  getPlanByStripePriceId(stripePriceId: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;

  getAddOns(): Promise<AddOn[]>;
  getAddOn(id: string): Promise<AddOn | undefined>;
  createAddOn(addOn: InsertAddOn): Promise<AddOn>;

  getSubscription(userId: string): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  getSubscriptionWithPlan(userId: string): Promise<(Subscription & { plan: Plan }) | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription | undefined>;

  getProject(userId: string): Promise<Project | undefined>;
  getProjectById(id: string): Promise<Project | undefined>;
  getAllProjectsWithDetails(): Promise<{ project: Project; customer: User; plan: Plan | null; subscription: Subscription | null }[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project | undefined>;

  getAddOnSelections(subscriptionId: string): Promise<(AddOnSelection & { addOn: AddOn })[]>;
  createAddOnSelection(selection: InsertAddOnSelection): Promise<AddOnSelection>;
  updateAddOnSelection(id: string, data: Partial<AddOnSelection>): Promise<AddOnSelection | undefined>;

  getAllCustomers(): Promise<{ user: User; profile: CustomerProfile | null; subscription: Subscription | null; project: Project | null }[]>;
  getAdminStats(): Promise<{
    totalCustomers: number;
    totalProjects: number;
    activeSubscriptions: number;
    mrr: number;
  }>;

  createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest>;
  getQuoteRequests(): Promise<QuoteRequest[]>;
  updateQuoteRequest(id: string, data: Partial<QuoteRequest>): Promise<QuoteRequest | undefined>;

  createPasswordResetToken(userId: string): Promise<string>;
  getValidPasswordResetToken(token: string): Promise<{ userId: string } | null>;
  usePasswordResetToken(token: string): Promise<boolean>;
  updateUserPassword(userId: string, passwordHash: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> {
    const [profile] = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, userId));
    return profile || undefined;
  }

  async createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile> {
    const [result] = await db.insert(customerProfiles).values(profile).returning();
    return result;
  }

  async updateCustomerProfile(userId: string, data: Partial<CustomerProfile>): Promise<CustomerProfile | undefined> {
    const [result] = await db.update(customerProfiles).set(data).where(eq(customerProfiles.userId, userId)).returning();
    return result || undefined;
  }

  async getPlans(): Promise<Plan[]> {
    return db.select().from(plans).where(eq(plans.isActive, true));
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan || undefined;
  }

  async getPlanByStripePriceId(stripePriceId: string): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.stripePriceId, stripePriceId));
    return plan || undefined;
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const [result] = await db.insert(plans).values(plan).returning();
    return result;
  }

  async getAddOns(): Promise<AddOn[]> {
    return db.select().from(addOns).where(eq(addOns.isActive, true));
  }

  async getAddOn(id: string): Promise<AddOn | undefined> {
    const [addOn] = await db.select().from(addOns).where(eq(addOns.id, id));
    return addOn || undefined;
  }

  async createAddOn(addOn: InsertAddOn): Promise<AddOn> {
    const [result] = await db.insert(addOns).values(addOn).returning();
    return result;
  }

  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription || undefined;
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    return subscription || undefined;
  }

  async getSubscriptionWithPlan(userId: string): Promise<(Subscription & { plan: Plan }) | undefined> {
    const result = await db
      .select()
      .from(subscriptions)
      .innerJoin(plans, eq(subscriptions.planId, plans.id))
      .where(eq(subscriptions.userId, userId));

    if (result.length === 0) return undefined;
    return { ...result[0].subscriptions, plan: result[0].plans };
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [result] = await db.insert(subscriptions).values(subscription).returning();
    return result;
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const [result] = await db.update(subscriptions).set(data).where(eq(subscriptions.id, id)).returning();
    return result || undefined;
  }

  async getProject(userId: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.userId, userId));
    return project || undefined;
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getAllProjectsWithDetails(): Promise<{ project: Project; customer: User; plan: Plan | null; subscription: Subscription | null }[]> {
    const allProjects = await db.select().from(projects);
    const results: { project: Project; customer: User; plan: Plan | null; subscription: Subscription | null }[] = [];

    for (const project of allProjects) {
      const customer = await this.getUser(project.userId);
      if (!customer) continue;

      const plan = project.planId ? (await this.getPlan(project.planId)) || null : null;
      const subscription = project.subscriptionId ? (await this.getSubscriptionByStripeId(project.subscriptionId)) || null : null;

      results.push({ project, customer, plan, subscription });
    }

    return results;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [result] = await db.insert(projects).values(project).returning();
    return result;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | undefined> {
    const [result] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return result || undefined;
  }

  async getAddOnSelections(subscriptionId: string): Promise<(AddOnSelection & { addOn: AddOn })[]> {
    const result = await db
      .select()
      .from(addOnSelections)
      .innerJoin(addOns, eq(addOnSelections.addOnId, addOns.id))
      .where(eq(addOnSelections.subscriptionId, subscriptionId));

    return result.map((r) => ({ ...r.add_on_selections, addOn: r.add_ons }));
  }

  async createAddOnSelection(selection: InsertAddOnSelection): Promise<AddOnSelection> {
    const [result] = await db.insert(addOnSelections).values(selection).returning();
    return result;
  }

  async updateAddOnSelection(id: string, data: Partial<AddOnSelection>): Promise<AddOnSelection | undefined> {
    const [result] = await db.update(addOnSelections).set(data).where(eq(addOnSelections.id, id)).returning();
    return result || undefined;
  }

  async getAllCustomers(): Promise<{ user: User; profile: CustomerProfile | null; subscription: Subscription | null; project: Project | null }[]> {
    const customerUsers = await db.select().from(users).where(eq(users.role, "CUSTOMER"));

    const result = await Promise.all(
      customerUsers.map(async (user) => {
        const profile = await this.getCustomerProfile(user.id);
        const subscription = await this.getSubscription(user.id);
        const project = await this.getProject(user.id);
        return { user, profile: profile || null, subscription: subscription || null, project: project || null };
      })
    );

    return result;
  }

  async getAdminStats(): Promise<{
    totalCustomers: number;
    totalProjects: number;
    activeSubscriptions: number;
    mrr: number;
  }> {
    const allCustomers = await db.select().from(users).where(eq(users.role, "CUSTOMER"));
    const allProjects = await db.select().from(projects);
    const allSubscriptions = await db.select().from(subscriptions).where(eq(subscriptions.status, "ACTIVE"));

    let mrr = 0;
    for (const sub of allSubscriptions) {
      const plan = await this.getPlan(sub.planId);
      if (plan) mrr += plan.monthlyPriceCents;
    }

    return {
      totalCustomers: allCustomers.length,
      totalProjects: allProjects.length,
      activeSubscriptions: allSubscriptions.length,
      mrr,
    };
  }

  async createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest> {
    const [result] = await db.insert(quoteRequests).values(request).returning();
    return result;
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  }

  async updateQuoteRequest(id: string, data: Partial<QuoteRequest>): Promise<QuoteRequest | undefined> {
    const [result] = await db.update(quoteRequests).set(data).where(eq(quoteRequests.id, id)).returning();
    return result || undefined;
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    });

    return token;
  }

  async getValidPasswordResetToken(token: string): Promise<{ userId: string } | null> {
    const now = new Date();
    const [result] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          isNull(passwordResetTokens.usedAt)
        )
      );

    if (!result || new Date(result.expiresAt) < now) {
      return null;
    }

    return { userId: result.userId };
  }

  async usePasswordResetToken(token: string): Promise<boolean> {
    const [result] = await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.token, token))
      .returning();

    return !!result;
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId))
      .returning();

    return user || undefined;
  }
}

export const storage = new DatabaseStorage();
