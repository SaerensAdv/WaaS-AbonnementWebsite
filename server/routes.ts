import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import {
  loginSchema,
  signupSchema,
  insertAddOnSelectionSchema,
  insertReportSchema,
} from "@shared/schema";
import type { User } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production");
  }

  app.use(
    session({
      secret: sessionSecret || "dev-secret-only-for-development",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const passwordHash = await hashPassword(data.password);
      const user = await storage.createUser({
        email: data.email,
        name: data.name,
        passwordHash,
        role: data.role || "CUSTOMER",
      });

      if (user.role === "CUSTOMER") {
        await storage.createCustomerProfile({ userId: user.id });
      } else if (user.role === "SPECIALIST") {
        await storage.createSpecialistProfile({ userId: user.id, approved: false });
      }

      req.session.userId = user.id;
      res.json({ user: { ...user, passwordHash: undefined } });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(data.password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { ...user, passwordHash: undefined } });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json({ user: { ...user, passwordHash: undefined } });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/plans", async (_req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      console.error("Get plans error:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  app.get("/api/addons", async (_req, res) => {
    try {
      const addOns = await storage.getAddOns();
      res.json(addOns);
    } catch (error) {
      console.error("Get add-ons error:", error);
      res.status(500).json({ message: "Failed to fetch add-ons" });
    }
  });

  app.get("/api/templates", async (req, res) => {
    try {
      const tier = req.query.tier as string | undefined;
      const templates = await storage.getTemplates(tier);
      res.json(templates);
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/dashboard", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      
      const project = await storage.getProject(user.id);
      const subscription = await storage.getSubscription(user.id);
      
      let addOnSelections: any[] = [];
      let recentReports = 0;
      
      if (project) {
        addOnSelections = await storage.getAddOnSelections(project.id);
        const reports = await storage.getReportsByProject(project.id);
        recentReports = reports.length;
      }

      res.json({
        project,
        subscription,
        addOnSelections,
        recentReports,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/project", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      
      const project = await storage.getProject(user.id);
      const subscription = await storage.getSubscriptionWithPlan(user.id);
      
      let plan = null;
      let template = null;
      let templates: any[] = [];
      
      if (project) {
        plan = await storage.getPlan(project.planId);
        if (project.templateId) {
          template = await storage.getTemplate(project.templateId);
        }
        if (plan) {
          templates = await storage.getTemplates(plan.tier);
        }
      }

      res.json({ project, plan, template, templates });
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Failed to fetch project data" });
    }
  });

  app.put("/api/project/onboarding", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);
      
      if (!project) {
        return res.status(404).json({ message: "No project found" });
      }

      const currentData = (project.onboardingData as any) || {};
      const updatedData = { ...currentData, ...req.body };
      
      const updated = await storage.updateProject(project.id, {
        onboardingData: updatedData,
        status: updatedData.completed ? "PRODUCTION" : "ONBOARDING",
      });

      res.json(updated);
    } catch (error) {
      console.error("Update onboarding error:", error);
      res.status(500).json({ message: "Failed to update onboarding data" });
    }
  });

  app.get("/api/addons/my", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);
      
      const availableAddOns = await storage.getAddOns();
      let selectedAddOns: any[] = [];
      
      if (project) {
        selectedAddOns = await storage.getAddOnSelections(project.id);
      }

      res.json({
        availableAddOns,
        selectedAddOns,
        hasProject: !!project,
      });
    } catch (error) {
      console.error("Get my add-ons error:", error);
      res.status(500).json({ message: "Failed to fetch add-ons" });
    }
  });

  app.post("/api/addons/select", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);
      
      if (!project) {
        return res.status(400).json({ message: "No project found. Please complete onboarding first." });
      }

      const { addOnId, totalBudget, mediaPercentage } = req.body;
      
      if (!addOnId) {
        return res.status(400).json({ message: "Add-on ID is required" });
      }
      
      const addOn = await storage.getAddOn(addOnId);
      if (!addOn) {
        return res.status(404).json({ message: "Add-on not found" });
      }

      let mediaBudgetCents = null;
      let managementBudgetCents = null;
      
      if (totalBudget && mediaPercentage) {
        mediaBudgetCents = Math.round(totalBudget * (mediaPercentage / 100));
        managementBudgetCents = totalBudget - mediaBudgetCents;
      }

      const selection = await storage.createAddOnSelection({
        projectId: project.id,
        addOnId,
        totalBudgetCents: totalBudget || null,
        mediaBudgetCents,
        managementBudgetCents,
        mediaPercentage: mediaPercentage || null,
        status: "REQUESTED",
      });

      res.json(selection);
    } catch (error) {
      console.error("Select add-on error:", error);
      res.status(500).json({ message: "Failed to select add-on" });
    }
  });

  app.get("/api/reports", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);
      
      if (!project) {
        return res.json({ reports: [] });
      }

      const reports = await storage.getReportsByProject(project.id);
      res.json({ reports });
    } catch (error) {
      console.error("Get reports error:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/billing", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscriptionWithPlan(user.id);
      res.json({ subscription });
    } catch (error) {
      console.error("Get billing error:", error);
      res.status(500).json({ message: "Failed to fetch billing data" });
    }
  });

  app.post("/api/billing/portal", requireRole("CUSTOMER"), async (req, res) => {
    res.json({ url: null, message: "Stripe billing portal will be configured upon Stripe integration" });
  });

  app.get("/api/admin/stats", requireRole("ADMIN"), async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json({ ...stats, recentActivity: [] });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/customers", requireRole("ADMIN"), async (_req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json({ customers, total: customers.length });
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/admin/specialists", requireRole("ADMIN"), async (_req, res) => {
    try {
      const specialists = await storage.getAllSpecialists();
      const pending = specialists.filter((s) => !s.profile?.approved).length;
      res.json({ specialists, total: specialists.length, pending });
    } catch (error) {
      console.error("Get specialists error:", error);
      res.status(500).json({ message: "Failed to fetch specialists" });
    }
  });

  app.put("/api/admin/specialists/:userId/approve", requireRole("ADMIN"), async (req, res) => {
    try {
      const { userId } = req.params;
      const { approved } = req.body;
      
      const updated = await storage.updateSpecialistProfile(userId, { approved });
      if (!updated) {
        return res.status(404).json({ message: "Specialist not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Approve specialist error:", error);
      res.status(500).json({ message: "Failed to update specialist" });
    }
  });

  app.get("/api/admin/assignments", requireRole("ADMIN"), async (_req, res) => {
    try {
      res.json({ assignments: [], unassigned: [], specialists: [] });
    } catch (error) {
      console.error("Get assignments error:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/admin/assignments", requireRole("ADMIN"), async (req, res) => {
    try {
      const { addOnSelectionId, specialistUserId } = req.body;
      
      if (!addOnSelectionId || !specialistUserId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const assignment = await storage.createAssignment({
        addOnSelectionId,
        specialistUserId,
        status: "PROPOSED",
      });
      
      res.json(assignment);
    } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  app.get("/api/specialist/dashboard", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const profile = await storage.getSpecialistProfile(user.id);
      const assignments = await storage.getAssignmentsBySpecialist(user.id);
      
      const activeCount = assignments.filter((a) => a.status === "ACTIVE").length;
      const proposedCount = assignments.filter((a) => a.status === "PROPOSED").length;

      res.json({
        stats: {
          totalAssignments: assignments.length,
          activeAssignments: activeCount,
          proposedAssignments: proposedCount,
          reportsThisMonth: 0,
          profile,
        },
        recentAssignments: [],
      });
    } catch (error) {
      console.error("Get specialist dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/specialist/assignments", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const assignments = await storage.getAssignmentsBySpecialist(user.id);
      res.json({ assignments });
    } catch (error) {
      console.error("Get specialist assignments error:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.put("/api/specialist/assignments/:id/accept", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateAssignment(id, { status: "ACTIVE" });
      if (!updated) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Accept assignment error:", error);
      res.status(500).json({ message: "Failed to accept assignment" });
    }
  });

  app.get("/api/specialist/reports", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const reports = await storage.getReportsByCreator(user.id);
      const assignments = await storage.getAssignmentsBySpecialist(user.id);
      res.json({ reports, assignments });
    } catch (error) {
      console.error("Get specialist reports error:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/specialist/reports", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const { projectId, month, type, summaryText, dashboardUrl, kpiData } = req.body;
      
      if (!projectId || !month || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const report = await storage.createReport({
        projectId,
        month,
        type,
        summaryText,
        dashboardUrl,
        kpiData,
        createdByUserId: user.id,
      });
      
      res.json(report);
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/specialist/profile", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const profile = await storage.getSpecialistProfile(user.id);
      res.json({ profile });
    } catch (error) {
      console.error("Get specialist profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/specialist/profile", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const { skills, languages, niches, capacity, bio } = req.body;
      
      const updated = await storage.updateSpecialistProfile(user.id, {
        skills,
        languages,
        niches,
        capacity,
        bio,
      });
      
      if (!updated) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update specialist profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  return httpServer;
}
