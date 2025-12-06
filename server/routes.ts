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

  // Sitemap.xml for SEO
  app.get("/sitemap.xml", async (_req, res) => {
    const baseUrl = "https://websiteabonnementen.nl";
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/pricing", priority: "0.9", changefreq: "weekly" },
      { url: "/projecten", priority: "0.8", changefreq: "daily" },
      { url: "/templates", priority: "0.8", changefreq: "weekly" },
      { url: "/about", priority: "0.7", changefreq: "monthly" },
      { url: "/contact", priority: "0.7", changefreq: "monthly" },
      { url: "/specialists", priority: "0.6", changefreq: "monthly" },
      { url: "/privacy", priority: "0.3", changefreq: "yearly" },
      { url: "/terms", priority: "0.3", changefreq: "yearly" },
      { url: "/cookies", priority: "0.3", changefreq: "yearly" },
    ];

    const today = new Date().toISOString().split("T")[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }
    
    xml += `</urlset>`;
    
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

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

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        const token = await storage.createPasswordResetToken(user.id);
        const resetUrl = `${req.headers.origin || 'https://' + req.headers.host}/reset-password?token=${token}`;
        
        console.log(`Password reset requested for ${email}. Reset URL: ${resetUrl}`);
      }
      
      res.json({ 
        message: "Als dit e-mailadres bij ons bekend is, ontvangt u een e-mail met instructies om uw wachtwoord te resetten." 
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Er is iets misgegaan. Probeer het later opnieuw." });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token en nieuw wachtwoord zijn vereist" });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ message: "Wachtwoord moet minimaal 8 tekens bevatten" });
      }
      
      const tokenData = await storage.getValidPasswordResetToken(token);
      
      if (!tokenData) {
        return res.status(400).json({ message: "Ongeldige of verlopen token. Vraag een nieuwe reset link aan." });
      }
      
      const passwordHash = await hashPassword(password);
      await storage.updateUserPassword(tokenData.userId, passwordHash);
      await storage.usePasswordResetToken(token);
      
      res.json({ message: "Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen." });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Er is iets misgegaan. Probeer het later opnieuw." });
    }
  });

  app.get("/api/auth/verify-reset-token", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ valid: false });
      }
      
      const tokenData = await storage.getValidPasswordResetToken(token);
      res.json({ valid: !!tokenData });
    } catch (error) {
      console.error("Verify reset token error:", error);
      res.json({ valid: false });
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

  app.get("/api/showcase-projects", async (_req, res) => {
    try {
      const showcaseProjects = await storage.getShowcaseProjects();
      res.json(showcaseProjects);
    } catch (error) {
      console.error("Get showcase projects error:", error);
      res.status(500).json({ message: "Failed to fetch showcase projects" });
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

  app.get("/api/profile", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const profile = await storage.getCustomerProfile(user.id);
      res.json({ profile, user: { name: user.name, email: user.email, createdAt: user.createdAt } });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const { name, companyName, phone, address, vatNumber } = req.body;
      
      if (name && name !== user.name) {
        await storage.updateUser(user.id, { name });
      }
      
      const profile = await storage.getCustomerProfile(user.id);
      if (profile) {
        await storage.updateCustomerProfile(profile.id, {
          companyName: companyName || null,
          phone: phone || null,
          address: address || null,
          vatNumber: vatNumber || null,
        });
      }
      
      const updatedProfile = await storage.getCustomerProfile(user.id);
      res.json({ success: true, profile: updatedProfile });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
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
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscription(user.id);
      
      if (!subscription?.stripeCustomerId) {
        return res.json({ url: null, message: "No active subscription found" });
      }

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host;
      const returnUrl = `${protocol}://${host}/app/billing`;
      
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Billing portal error:", error);
      res.json({ url: null, message: "Could not create billing portal session" });
    }
  });

  app.post("/api/checkout", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const { planId } = req.body;
      
      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }
      
      const plan = await storage.getPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      let customerId: string | undefined;
      const existingSubscription = await storage.getSubscription(user.id);
      
      if (existingSubscription?.stripeCustomerId) {
        customerId = existingSubscription.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
      }
      
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host;
      const successUrl = `${protocol}://${host}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${protocol}://${host}/pricing?checkout=cancelled`;
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card', 'ideal'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: plan.name,
              description: `${plan.name} - Website Abonnement`,
            },
            unit_amount: plan.monthlyPriceCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: user.id,
          planId: plan.id,
        },
      });
      
      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Could not create checkout session" });
    }
  });

  app.post("/api/verify-checkout", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: "Payment not completed" });
      }
      
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;
      
      if (!userId || !planId) {
        return res.status(400).json({ message: "Invalid session metadata" });
      }
      
      if (userId !== user.id) {
        return res.status(403).json({ message: "Session does not belong to this user" });
      }
      
      const existingSubscription = await storage.getSubscription(userId);
      
      if (existingSubscription) {
        await storage.updateSubscription(existingSubscription.id, {
          planId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: 'ACTIVE',
        });
      } else {
        await storage.createSubscription({
          userId,
          planId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: 'ACTIVE',
        });
      }
      
      const existingProject = await storage.getProject(userId);
      
      if (!existingProject) {
        await storage.createProject({
          userId,
          planId,
          status: 'ONBOARDING',
        });
      }
      
      const subscription = await storage.getSubscription(userId);
      const project = await storage.getProject(userId);
      
      res.json({ success: true, subscription, project });
    } catch (error: any) {
      console.error("Verify checkout error:", error);
      res.status(500).json({ message: "Could not verify checkout session" });
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const { getStripePublishableKey } = await import("./stripeClient");
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: any) {
      console.error("Get publishable key error:", error);
      res.status(500).json({ message: "Could not get Stripe publishable key" });
    }
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

  app.get("/api/admin/projects", requireRole("ADMIN"), async (_req, res) => {
    try {
      const projects = await storage.getAllProjectsWithDetails();
      const statusCounts = {
        ONBOARDING: projects.filter((p) => p.project.status === "ONBOARDING").length,
        PRODUCTION: projects.filter((p) => p.project.status === "PRODUCTION").length,
        LIVE: projects.filter((p) => p.project.status === "LIVE").length,
        MAINTENANCE: projects.filter((p) => p.project.status === "MAINTENANCE").length,
      };
      res.json({ projects, total: projects.length, statusCounts });
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.put("/api/admin/projects/:id/status", requireRole("ADMIN"), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updated = await storage.updateProject(id, { status });
      if (!updated) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update project status error:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.patch("/api/admin/projects/:id/showcase", requireRole("ADMIN"), async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        publicUrl,
        showcaseOptIn,
        showcaseThumbnailUrl,
        showcaseTitle,
        showcaseDescription,
        showcaseIndustry,
        showcaseFeatured,
        launchedAt
      } = req.body;
      
      const updateData: Record<string, any> = {};
      if (publicUrl !== undefined) updateData.publicUrl = publicUrl;
      if (showcaseOptIn !== undefined) updateData.showcaseOptIn = showcaseOptIn;
      if (showcaseThumbnailUrl !== undefined) updateData.showcaseThumbnailUrl = showcaseThumbnailUrl;
      if (showcaseTitle !== undefined) updateData.showcaseTitle = showcaseTitle;
      if (showcaseDescription !== undefined) updateData.showcaseDescription = showcaseDescription;
      if (showcaseIndustry !== undefined) updateData.showcaseIndustry = showcaseIndustry;
      if (showcaseFeatured !== undefined) updateData.showcaseFeatured = showcaseFeatured;
      if (launchedAt !== undefined) updateData.launchedAt = launchedAt ? new Date(launchedAt) : null;
      
      const updated = await storage.updateProject(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update project showcase error:", error);
      res.status(500).json({ message: "Failed to update showcase settings" });
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
      
      const user = await storage.getUser(userId);
      if (!user || user.role !== "SPECIALIST") {
        return res.status(404).json({ message: "Specialist not found" });
      }
      
      let profile = await storage.getSpecialistProfile(userId);
      
      if (!profile) {
        profile = await storage.createSpecialistProfile({ 
          userId, 
          approved: approved === true,
          skills: [],
          capacity: 5
        });
      } else {
        const updated = await storage.updateSpecialistProfile(userId, { approved });
        if (updated) profile = updated;
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Approve specialist error:", error);
      res.status(500).json({ message: "Failed to update specialist" });
    }
  });

  app.get("/api/admin/assignments", requireRole("ADMIN"), async (_req, res) => {
    try {
      const allAssignments = await storage.getAllAssignmentsWithDetails();
      const unassigned = await storage.getUnassignedAddOnSelections();
      const specialists = await storage.getApprovedSpecialistsWithProfiles();
      
      res.json({ assignments: allAssignments, unassigned, specialists });
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
      const assignmentsWithDetails = await storage.getAssignmentsWithDetailsBySpecialist(user.id);
      const reportsThisMonth = await storage.getReportsCountByCreatorThisMonth(user.id);
      
      const activeCount = assignmentsWithDetails.filter((a) => a.assignment.status === "ACTIVE").length;
      const proposedCount = assignmentsWithDetails.filter((a) => a.assignment.status === "PROPOSED").length;

      const recentAssignments = assignmentsWithDetails
        .sort((a, b) => new Date(b.assignment.createdAt!).getTime() - new Date(a.assignment.createdAt!).getTime())
        .slice(0, 5);

      res.json({
        stats: {
          totalAssignments: assignmentsWithDetails.length,
          activeAssignments: activeCount,
          proposedAssignments: proposedCount,
          reportsThisMonth,
          profile,
        },
        recentAssignments,
      });
    } catch (error) {
      console.error("Get specialist dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/specialist/assignments", requireRole("SPECIALIST"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const assignmentsWithDetails = await storage.getAssignmentsWithDetailsBySpecialist(user.id);
      res.json({ assignments: assignmentsWithDetails });
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
      const assignmentsWithDetails = await storage.getAssignmentsWithDetailsBySpecialist(user.id);
      res.json({ reports, assignments: assignmentsWithDetails });
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

  // Contact form endpoint (public)
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // For now, just log the contact request
      // In production, this would send an email or store in database
      console.log("Contact form submission:", { name, email, subject, message });
      
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
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
