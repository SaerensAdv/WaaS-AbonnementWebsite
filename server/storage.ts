import { eq, and, desc, lt, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  customerProfiles,
  specialistProfiles,
  plans,
  templates,
  subscriptions,
  projects,
  addOns,
  addOnSelections,
  assignments,
  reports,
  auditLogs,
  passwordResetTokens,
  blogPosts,
  type User,
  type InsertUser,
  type CustomerProfile,
  type InsertCustomerProfile,
  type SpecialistProfile,
  type InsertSpecialistProfile,
  type Plan,
  type InsertPlan,
  type Template,
  type InsertTemplate,
  type Subscription,
  type InsertSubscription,
  type Project,
  type InsertProject,
  type AddOn,
  type InsertAddOn,
  type AddOnSelection,
  type InsertAddOnSelection,
  type Assignment,
  type InsertAssignment,
  type Report,
  type InsertReport,
  type AuditLog,
  type InsertAuditLog,
  type BlogPost,
  type InsertBlogPost,
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

  getSpecialistProfile(userId: string): Promise<SpecialistProfile | undefined>;
  createSpecialistProfile(profile: InsertSpecialistProfile): Promise<SpecialistProfile>;
  updateSpecialistProfile(userId: string, data: Partial<SpecialistProfile>): Promise<SpecialistProfile | undefined>;

  getPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  getPlanByStripePriceId(stripePriceId: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;

  getTemplates(tier?: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;

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
  getAllProjectsWithDetails(): Promise<{ project: Project; customer: User; plan: Plan | null }[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project | undefined>;

  getAddOnSelections(projectId: string): Promise<(AddOnSelection & { addOn: AddOn })[]>;
  createAddOnSelection(selection: InsertAddOnSelection): Promise<AddOnSelection>;
  updateAddOnSelection(id: string, data: Partial<AddOnSelection>): Promise<AddOnSelection | undefined>;

  getAssignmentsBySpecialist(userId: string): Promise<Assignment[]>;
  getAssignmentsByAddOnSelection(addOnSelectionId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment | undefined>;

  getReportsByProject(projectId: string): Promise<Report[]>;
  getReportsByCreator(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  getAllCustomers(): Promise<{ user: User; profile: CustomerProfile | null; project: Project | null }[]>;
  getAllSpecialists(): Promise<{ user: User; profile: SpecialistProfile | null; assignmentCount: number }[]>;
  getAdminStats(): Promise<{
    totalCustomers: number;
    totalProjects: number;
    activeProjects: number;
    totalSpecialists: number;
    pendingSpecialists: number;
    activeAddOns: number;
  }>;

  getShowcaseProjects(): Promise<{ project: Project; plan: Plan | null; customerName: string }[]>;

  getBlogPosts(status?: string): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(data: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
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

  async getSpecialistProfile(userId: string): Promise<SpecialistProfile | undefined> {
    const [profile] = await db.select().from(specialistProfiles).where(eq(specialistProfiles.userId, userId));
    return profile || undefined;
  }

  async createSpecialistProfile(profile: InsertSpecialistProfile): Promise<SpecialistProfile> {
    const [result] = await db.insert(specialistProfiles).values(profile).returning();
    return result;
  }

  async updateSpecialistProfile(userId: string, data: Partial<SpecialistProfile>): Promise<SpecialistProfile | undefined> {
    const [result] = await db.update(specialistProfiles).set(data).where(eq(specialistProfiles.userId, userId)).returning();
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

  async getTemplates(tier?: string): Promise<Template[]> {
    if (tier) {
      return db.select().from(templates).where(and(eq(templates.isActive, true), eq(templates.planEligibility, tier as any)));
    }
    return db.select().from(templates).where(eq(templates.isActive, true));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
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

  async getAllProjectsWithDetails(): Promise<{ project: Project; customer: User; plan: Plan | null }[]> {
    const allProjects = await db.select().from(projects);
    const results: { project: Project; customer: User; plan: Plan | null }[] = [];
    
    for (const project of allProjects) {
      const customer = await this.getUser(project.userId);
      if (!customer) continue;
      
      let plan: Plan | null = null;
      if (project.planId) {
        plan = (await this.getPlan(project.planId)) || null;
      }
      
      results.push({ project, customer, plan });
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

  async getAddOnSelections(projectId: string): Promise<(AddOnSelection & { addOn: AddOn })[]> {
    const result = await db
      .select()
      .from(addOnSelections)
      .innerJoin(addOns, eq(addOnSelections.addOnId, addOns.id))
      .where(eq(addOnSelections.projectId, projectId));
    
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

  async getAssignmentsBySpecialist(userId: string): Promise<Assignment[]> {
    return db.select().from(assignments).where(eq(assignments.specialistUserId, userId));
  }

  async getAssignmentsByAddOnSelection(addOnSelectionId: string): Promise<Assignment[]> {
    return db.select().from(assignments).where(eq(assignments.addOnSelectionId, addOnSelectionId));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [result] = await db.insert(assignments).values(assignment).returning();
    return result;
  }

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment | undefined> {
    const [result] = await db.update(assignments).set(data).where(eq(assignments.id, id)).returning();
    return result || undefined;
  }

  async getReportsByProject(projectId: string): Promise<Report[]> {
    return db.select().from(reports).where(eq(reports.projectId, projectId)).orderBy(desc(reports.createdAt));
  }

  async getReportsByCreator(userId: string): Promise<Report[]> {
    return db.select().from(reports).where(eq(reports.createdByUserId, userId)).orderBy(desc(reports.createdAt));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [result] = await db.insert(reports).values(report).returning();
    return result;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [result] = await db.insert(auditLogs).values(log).returning();
    return result;
  }

  async getAllCustomers(): Promise<{ user: User; profile: CustomerProfile | null; project: Project | null }[]> {
    const customerUsers = await db.select().from(users).where(eq(users.role, "CUSTOMER"));
    
    const result = await Promise.all(
      customerUsers.map(async (user) => {
        const profile = await this.getCustomerProfile(user.id);
        const project = await this.getProject(user.id);
        return { user, profile: profile || null, project: project || null };
      })
    );
    
    return result;
  }

  async getAllSpecialists(): Promise<{ user: User; profile: SpecialistProfile | null; assignmentCount: number }[]> {
    const specialistUsers = await db.select().from(users).where(eq(users.role, "SPECIALIST"));
    
    const result = await Promise.all(
      specialistUsers.map(async (user) => {
        const profile = await this.getSpecialistProfile(user.id);
        const userAssignments = await this.getAssignmentsBySpecialist(user.id);
        const activeCount = userAssignments.filter((a) => a.status === "ACTIVE").length;
        return { user, profile: profile || null, assignmentCount: activeCount };
      })
    );
    
    return result;
  }

  async getAdminStats(): Promise<{
    totalCustomers: number;
    totalProjects: number;
    activeProjects: number;
    totalSpecialists: number;
    pendingSpecialists: number;
    activeAddOns: number;
  }> {
    const allCustomers = await db.select().from(users).where(eq(users.role, "CUSTOMER"));
    const allProjects = await db.select().from(projects);
    const allSpecialists = await db.select().from(users).where(eq(users.role, "SPECIALIST"));
    const allSpecialistProfiles = await db.select().from(specialistProfiles);
    const allAddOnSelections = await db.select().from(addOnSelections);

    const pendingCount = allSpecialistProfiles.filter((p) => !p.approved).length;
    const activeAddOnsCount = allAddOnSelections.filter((s) => s.status === "ACTIVE").length;
    const liveProjectsCount = allProjects.filter((p) => p.status === "LIVE").length;

    return {
      totalCustomers: allCustomers.length,
      totalProjects: allProjects.length,
      activeProjects: liveProjectsCount,
      totalSpecialists: allSpecialists.length,
      pendingSpecialists: pendingCount,
      activeAddOns: activeAddOnsCount,
    };
  }

  async getAllAssignmentsWithDetails(): Promise<{
    assignment: Assignment;
    addOnSelection: AddOnSelection & { addOn: AddOn };
    specialist: User;
    customer: User;
  }[]> {
    const allAssignments = await db.select().from(assignments);
    
    const result = await Promise.all(
      allAssignments.map(async (assignment) => {
        const [selectionResult] = await db
          .select()
          .from(addOnSelections)
          .innerJoin(addOns, eq(addOnSelections.addOnId, addOns.id))
          .where(eq(addOnSelections.id, assignment.addOnSelectionId));
        
        if (!selectionResult) return null;
        
        const [project] = await db.select().from(projects).where(eq(projects.id, selectionResult.add_on_selections.projectId));
        if (!project) return null;
        
        const specialist = await this.getUser(assignment.specialistUserId);
        const customer = await this.getUser(project.userId);
        
        if (!specialist || !customer) return null;
        
        return {
          assignment,
          addOnSelection: { ...selectionResult.add_on_selections, addOn: selectionResult.add_ons },
          specialist,
          customer,
        };
      })
    );
    
    return result.filter((r): r is NonNullable<typeof r> => r !== null);
  }

  async getUnassignedAddOnSelections(): Promise<{
    selection: AddOnSelection & { addOn: AddOn };
    customer: User;
  }[]> {
    const allSelections = await db
      .select()
      .from(addOnSelections)
      .innerJoin(addOns, eq(addOnSelections.addOnId, addOns.id))
      .where(eq(addOnSelections.status, "REQUESTED"));
    
    const result = await Promise.all(
      allSelections.map(async (selectionResult) => {
        const existingAssignments = await this.getAssignmentsByAddOnSelection(selectionResult.add_on_selections.id);
        if (existingAssignments.length > 0) return null;
        
        const [project] = await db.select().from(projects).where(eq(projects.id, selectionResult.add_on_selections.projectId));
        if (!project) return null;
        
        const customer = await this.getUser(project.userId);
        if (!customer) return null;
        
        return {
          selection: { ...selectionResult.add_on_selections, addOn: selectionResult.add_ons },
          customer,
        };
      })
    );
    
    return result.filter((r): r is NonNullable<typeof r> => r !== null);
  }

  async getApprovedSpecialistsWithProfiles(): Promise<(User & { profile: SpecialistProfile })[]> {
    const specialistUsers = await db.select().from(users).where(eq(users.role, "SPECIALIST"));
    
    const result = await Promise.all(
      specialistUsers.map(async (user) => {
        const profile = await this.getSpecialistProfile(user.id);
        if (!profile || !profile.approved) return null;
        return { ...user, profile };
      })
    );
    
    return result.filter((r): r is NonNullable<typeof r> => r !== null);
  }

  async getAssignmentsWithDetailsBySpecialist(userId: string): Promise<{
    assignment: Assignment;
    addOnSelection: AddOnSelection & { addOn: AddOn };
    customer: User;
    project: Project;
  }[]> {
    const userAssignments = await this.getAssignmentsBySpecialist(userId);
    
    const result = await Promise.all(
      userAssignments.map(async (assignment) => {
        const [selectionResult] = await db
          .select()
          .from(addOnSelections)
          .innerJoin(addOns, eq(addOnSelections.addOnId, addOns.id))
          .where(eq(addOnSelections.id, assignment.addOnSelectionId));
        
        if (!selectionResult) return null;
        
        const [project] = await db.select().from(projects).where(eq(projects.id, selectionResult.add_on_selections.projectId));
        if (!project) return null;
        
        const customer = await this.getUser(project.userId);
        if (!customer) return null;
        
        return {
          assignment,
          addOnSelection: { ...selectionResult.add_on_selections, addOn: selectionResult.add_ons },
          customer,
          project,
        };
      })
    );
    
    return result.filter((r): r is NonNullable<typeof r> => r !== null);
  }

  async getReportsCountByCreatorThisMonth(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const allReports = await db.select().from(reports).where(eq(reports.createdByUserId, userId));
    return allReports.filter((r) => new Date(r.createdAt!) >= startOfMonth).length;
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

  async getShowcaseProjects(): Promise<{ project: Project; plan: Plan | null; customerName: string }[]> {
    const allProjects = await db.select().from(projects);
    
    const showcaseProjects = allProjects.filter(
      (p) => p.status === "LIVE" && p.showcaseOptIn === "APPROVED"
    );
    
    const sortedProjects = showcaseProjects.sort((a, b) => {
      if (a.showcaseFeatured && !b.showcaseFeatured) return -1;
      if (!a.showcaseFeatured && b.showcaseFeatured) return 1;
      const aDate = a.launchedAt ? new Date(a.launchedAt).getTime() : 0;
      const bDate = b.launchedAt ? new Date(b.launchedAt).getTime() : 0;
      return bDate - aDate;
    });
    
    const result = await Promise.all(
      sortedProjects.map(async (project) => {
        const plan = project.planId ? await this.getPlan(project.planId) : null;
        const user = await this.getUser(project.userId);
        const profile = user ? await this.getCustomerProfile(user.id) : null;
        return {
          project,
          plan: plan || null,
          customerName: profile?.companyName || user?.name || "Anoniem",
        };
      })
    );
    
    return result;
  }

  async getBlogPosts(status?: string): Promise<BlogPost[]> {
    if (status) {
      return db.select().from(blogPosts).where(eq(blogPosts.status, status as any)).orderBy(desc(blogPosts.publishedAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(data).returning();
    return post;
  }

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db.update(blogPosts).set({ ...data, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return post || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const [result] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return !!result;
  }
}

export const storage = new DatabaseStorage();
