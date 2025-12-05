import { eq, and, desc } from "drizzle-orm";
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
} from "@shared/schema";

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
  createPlan(plan: InsertPlan): Promise<Plan>;

  getTemplates(tier?: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;

  getAddOns(): Promise<AddOn[]>;
  getAddOn(id: string): Promise<AddOn | undefined>;
  createAddOn(addOn: InsertAddOn): Promise<AddOn>;

  getSubscription(userId: string): Promise<Subscription | undefined>;
  getSubscriptionWithPlan(userId: string): Promise<(Subscription & { plan: Plan }) | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription | undefined>;

  getProject(userId: string): Promise<Project | undefined>;
  getProjectById(id: string): Promise<Project | undefined>;
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
}

export const storage = new DatabaseStorage();
