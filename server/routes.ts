import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import {
  loginSchema,
  signupSchema,
} from "@shared/schema";
import type { User } from "@shared/schema";
import { z } from "zod";
import {
  createAanvraagTask,
  createKlantTask,
  createOnboardingSprintTask,
  createSupportTicketTask,
  createMaatwerkQuoteTask,
  createPopupLeadTask,
  getTasksByTag,
  isClickUpConfigured,
  CLICKUP_LISTS,
  getTasks,
} from "./clickup";
import { insertQuoteRequestSchema } from "@shared/schema";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Te veel pogingen. Probeer het over 15 minuten opnieuw." },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Te veel wachtwoord reset verzoeken. Probeer het later opnieuw." },
  standardHeaders: true,
  legacyHeaders: false,
});

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

  app.post("/api/auth/signup", authLimiter, async (req, res) => {
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
        role: "CUSTOMER",
      });

      await storage.createCustomerProfile({ userId: user.id });

      req.session.userId = user.id;

      if (isClickUpConfigured()) {
        createAanvraagTask(user.name, user.email).catch((err) =>
          console.error("ClickUp aanvraag task error (non-blocking):", err.message)
        );
      }

      res.json({ user: { ...user, passwordHash: undefined } });
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]?.message || "Ongeldige invoer";
        return res.status(400).json({ message: firstError });
      }
      res.status(400).json({ message: "Registratie mislukt. Probeer het opnieuw." });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
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

  app.post("/api/auth/forgot-password", forgotPasswordLimiter, async (req, res) => {
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

  app.post("/api/auth/reset-password", authLimiter, async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: "Token en nieuw wachtwoord zijn vereist" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Wachtwoord moet minimaal 8 tekens bevatten" });
      }
      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: "Wachtwoord moet minimaal 1 hoofdletter bevatten" });
      }
      if (!/[0-9]/.test(password)) {
        return res.status(400).json({ message: "Wachtwoord moet minimaal 1 cijfer bevatten" });
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

  app.get("/api/dashboard", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;

      const project = await storage.getProject(user.id);
      const subscription = await storage.getSubscriptionWithPlan(user.id);

      let addOnSelections: any[] = [];

      if (subscription) {
        addOnSelections = await storage.getAddOnSelections(subscription.id);
      }

      res.json({
        project,
        subscription,
        addOnSelections,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/onboarding", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);

      if (!project) {
        return res.json({ project: null, onboardingData: null, onboardingCompleted: false });
      }

      res.json({
        project,
        onboardingData: project.onboardingData,
        onboardingCompleted: project.onboardingCompleted ?? false,
      });
    } catch (error) {
      console.error("Get onboarding error:", error);
      res.status(500).json({ message: "Failed to fetch onboarding data" });
    }
  });

  app.post("/api/onboarding", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);

      if (!project) {
        return res.status(400).json({ message: "No project found. Please subscribe to a plan first." });
      }

      const { onboardingData } = req.body;

      if (!onboardingData) {
        return res.status(400).json({ message: "Onboarding data is required" });
      }

      const updated = await storage.updateProject(project.id, {
        onboardingData,
        onboardingCompleted: true,
        companyName: onboardingData.companyName || project.companyName,
      });

      if (isClickUpConfigured() && !project.onboardingCompleted) {
        const subscription = await storage.getSubscriptionWithPlan(user.id);
        createOnboardingSprintTask(
          user.name,
          subscription?.plan?.name || "Onbekend plan",
          onboardingData,
        ).catch((err) =>
          console.error("ClickUp onboarding task error (non-blocking):", err.message)
        );
      }

      res.json({ success: true, project: updated });
    } catch (error) {
      console.error("Save onboarding error:", error);
      res.status(500).json({ message: "Failed to save onboarding data" });
    }
  });

  app.get("/api/addons/my", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscription(user.id);

      const availableAddOns = await storage.getAddOns();
      let selectedAddOns: any[] = [];

      if (subscription) {
        selectedAddOns = await storage.getAddOnSelections(subscription.id);
      }

      res.json({
        availableAddOns,
        selectedAddOns,
        hasSubscription: !!subscription,
      });
    } catch (error) {
      console.error("Get my add-ons error:", error);
      res.status(500).json({ message: "Failed to fetch add-ons" });
    }
  });

  app.post("/api/addons/select", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscription(user.id);

      if (!subscription) {
        return res.status(400).json({ message: "No active subscription found." });
      }

      const { addOnId } = req.body;

      if (!addOnId) {
        return res.status(400).json({ message: "Add-on ID is required" });
      }

      const addOn = await storage.getAddOn(addOnId);
      if (!addOn) {
        return res.status(404).json({ message: "Add-on not found" });
      }

      const selection = await storage.createAddOnSelection({
        subscriptionId: subscription.id,
        addOnId,
        status: "ACTIVE",
      });

      res.json(selection);
    } catch (error) {
      console.error("Select add-on error:", error);
      res.status(500).json({ message: "Failed to select add-on" });
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
        await storage.updateCustomerProfile(user.id, {
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

      let upcomingInvoice: { amount: number; dueDate: string } | undefined;

      if (subscription?.stripeSubscriptionId) {
        try {
          const { getUncachableStripeClient } = await import("./stripeClient");
          const stripe = await getUncachableStripeClient();
          const invoice = await stripe.invoices.retrieveUpcoming({
            subscription: subscription.stripeSubscriptionId,
          });
          if (invoice) {
            const dueDateTs = invoice.next_payment_attempt || invoice.period_end;
            if (dueDateTs) {
              upcomingInvoice = {
                amount: invoice.amount_due,
                dueDate: new Date(dueDateTs * 1000).toISOString(),
              };
            }
          }
        } catch (stripeError: any) {
          if (stripeError?.code !== 'invoice_upcoming_none') {
            console.error("Upcoming invoice fetch error:", stripeError.message);
          }
        }
      }

      res.json({ subscription, upcomingInvoice });
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

  app.post("/api/checkout", requireAuth, async (req, res) => {
    try {
      const { planId } = req.body;
      const userId = req.session.userId!;

      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }

      const plan = await storage.getPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();

      let customerId: string | undefined;

      const existingSubscription = await storage.getSubscription(userId);
      if (existingSubscription?.stripeCustomerId) {
        customerId = existingSubscription.stripeCustomerId;
      }

      if (!customerId) {
        const profile = await storage.getCustomerProfile(userId);
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId },
          ...(profile?.companyName ? { description: profile.companyName } : {}),
        });
        customerId = customer.id;
      }

      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host;
      const successUrl = `${protocol}://${host}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${protocol}://${host}/?checkout=cancelled`;

      const sessionConfig: any = {
        customer: customerId,
        payment_method_types: ['card', 'ideal'],
        line_items: [{
          price: plan.stripePriceId || undefined,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          planId: plan.id,
        },
      };

      if (!plan.stripePriceId) {
        sessionConfig.line_items = [{
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
        }];
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Could not create checkout session" });
    }
  });

  app.post("/api/verify-checkout", async (req, res) => {
    try {
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

      let userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!planId) {
        return res.status(400).json({ message: "Invalid session metadata" });
      }

      if (!userId && req.session.userId) {
        userId = req.session.userId;
      }

      if (!userId) {
        return res.status(400).json({ message: "User not found. Please log in first." });
      }

      let currentPeriodEnd: Date | undefined;
      if (stripeSubscriptionId) {
        try {
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          currentPeriodEnd = new Date(stripeSub.current_period_end * 1000);
        } catch (e: any) {
          console.error("Could not retrieve subscription period:", e.message);
        }
      }

      const existingSubscription = await storage.getSubscription(userId);

      if (existingSubscription) {
        await storage.updateSubscription(existingSubscription.id, {
          planId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: 'ACTIVE',
          ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
        });
      } else {
        await storage.createSubscription({
          userId,
          planId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: 'ACTIVE',
          ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
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

      if (isClickUpConfigured()) {
        try {
          const user = await storage.getUser(userId);
          const plan = await storage.getPlan(planId);
          const profile = await storage.getCustomerProfile(userId);
          if (user && plan) {
            createKlantTask(
              user.name,
              user.email,
              plan.name,
              profile?.companyName || undefined,
            ).catch((err) =>
              console.error("ClickUp klant task error (non-blocking):", err.message)
            );
          }
        } catch (clickupError: any) {
          console.error("ClickUp klant task error (non-blocking):", clickupError.message);
        }
      }

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
      res.json(stats);
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

  const supportTicketSchema = z.object({
    subject: z.string().min(3).max(200),
    message: z.string().min(10).max(5000),
    priority: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(3),
  });

  app.post("/api/support-tickets", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;

      const parsed = supportTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      }

      if (!isClickUpConfigured()) {
        return res.status(503).json({ message: "Support systeem is tijdelijk niet beschikbaar" });
      }

      const { subject, message, priority } = parsed.data;

      const ticket = await createSupportTicketTask(
        user.name,
        user.email,
        user.id,
        subject,
        message,
        priority,
      );

      res.json({ success: true, ticketId: ticket.id, ticketUrl: ticket.url });
    } catch (error: any) {
      console.error("Create support ticket error:", error);
      res.status(500).json({ message: "Kon support ticket niet aanmaken" });
    }
  });

  app.get("/api/support-tickets", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;

      if (!isClickUpConfigured()) {
        return res.json({ tickets: [] });
      }

      const userTickets = await getTasksByTag(CLICKUP_LISTS.SUPPORT_TICKETS, `uid:${user.id}`);

      const tickets = userTickets.map((task: any) => ({
        id: task.id,
        name: task.name,
        status: task.status?.status || "to do",
        statusColor: task.status?.color || "#808080",
        priority: task.priority?.id || 3,
        priorityLabel: task.priority?.priority || "normal",
        dateCreated: task.date_created,
        url: task.url,
      }));

      res.json({ tickets });
    } catch (error: any) {
      console.error("Get support tickets error:", error);
      res.status(500).json({ message: "Kon support tickets niet ophalen" });
    }
  });

  app.get("/api/admin/clickup/overview", requireRole("ADMIN"), async (_req, res) => {
    try {
      if (!isClickUpConfigured()) {
        return res.json({ configured: false, sprint: [], bugs: [], support: [], backlog: [] });
      }

      const [sprintResult, bugsResult, supportResult, backlogResult] = await Promise.all([
        getTasks(CLICKUP_LISTS.SPRINT).catch(() => ({ tasks: [] })),
        getTasks(CLICKUP_LISTS.BUGS).catch(() => ({ tasks: [] })),
        getTasks(CLICKUP_LISTS.SUPPORT_TICKETS).catch(() => ({ tasks: [] })),
        getTasks(CLICKUP_LISTS.BACKLOG).catch(() => ({ tasks: [] })),
      ]);

      const mapTask = (task: any) => ({
        id: task.id,
        name: task.name,
        status: task.status?.status || "to do",
        statusColor: task.status?.color || "#808080",
        priority: task.priority?.id || 3,
        priorityLabel: task.priority?.priority || "normal",
        dateCreated: task.date_created,
        url: task.url,
        assignees: (task.assignees || []).map((a: any) => a.username || a.email),
      });

      res.json({
        configured: true,
        sprint: (sprintResult.tasks || []).map(mapTask),
        bugs: (bugsResult.tasks || []).map(mapTask),
        support: (supportResult.tasks || []).map(mapTask),
        backlog: (backlogResult.tasks || []).map(mapTask),
      });
    } catch (error: any) {
      console.error("Get ClickUp overview error:", error);
      res.status(500).json({ message: "Kon ClickUp overzicht niet ophalen" });
    }
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /checkout-success
Disallow: /api/

Sitemap: https://abonnement.website/sitemap.xml
`);
  });

  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://abonnement.website";
    const pages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
      { loc: "/terms", priority: "0.3", changefreq: "yearly" },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.type("application/xml").send(xml);
  });

  const popupLeadSchema = z.object({
    name: z.string().min(2, "Naam is verplicht").max(100),
    email: z.string().email("Ongeldig e-mailadres").max(254),
    message: z.string().max(1000).optional(),
  });

  const popupLeadRateMap = new Map<string, { count: number; resetAt: number }>();

  app.post("/api/popup-lead", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const now = Date.now();
      const rateEntry = popupLeadRateMap.get(ip);
      if (rateEntry && rateEntry.resetAt > now) {
        if (rateEntry.count >= 5) {
          return res.status(429).json({ message: "Te veel aanvragen. Probeer het later opnieuw." });
        }
        rateEntry.count++;
      } else {
        popupLeadRateMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
      }

      const parsed = popupLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      }

      const { name, email, message } = parsed.data;

      await storage.createQuoteRequest({
        companyName: name,
        contactName: name,
        email,
        description: message || "Popup lead — geen vraag ingevuld",
        projectType: "popup-lead",
        phone: null,
        budgetRange: null,
        currentWebsite: null,
        details: { source: "popup", submittedAt: new Date().toISOString() },
      });

      if (isClickUpConfigured()) {
        try {
          await createPopupLeadTask(name, email, message);
        } catch (clickupError) {
          console.error("ClickUp popup lead task creation failed:", clickupError);
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Popup lead error:", error);
      res.status(500).json({ message: "Er ging iets mis bij het versturen" });
    }
  });

  app.post("/api/quote-requests", async (req, res) => {
    try {
      const quoteValidation = insertQuoteRequestSchema.extend({
        email: z.string().email("Ongeldig e-mailadres"),
        companyName: z.string().min(2, "Bedrijfsnaam is verplicht"),
        contactName: z.string().min(2, "Contactpersoon is verplicht"),
        description: z.string().min(10, "Beschrijving moet minimaal 10 tekens bevatten"),
        projectType: z.string().min(1, "Kies een projecttype"),
      });
      const parsed = quoteValidation.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      }

      const data = {
        ...parsed.data,
        phone: parsed.data.phone || null,
        budgetRange: parsed.data.budgetRange || null,
        currentWebsite: parsed.data.currentWebsite || null,
      };

      const quoteRequest = await storage.createQuoteRequest(data);

      if (isClickUpConfigured()) {
        try {
          const task = await createMaatwerkQuoteTask(
            data.companyName,
            data.contactName,
            data.email,
            data.phone || null,
            data.projectType,
            data.budgetRange || null,
            data.description,
            data.currentWebsite || null,
            data.details as Record<string, any> | null,
          );
          await storage.updateQuoteRequest(quoteRequest.id, { clickupTaskId: task.id });
        } catch (clickupError) {
          console.error("ClickUp task creation failed:", clickupError);
        }
      }

      res.json({ success: true, id: quoteRequest.id });
    } catch (error: any) {
      console.error("Quote request error:", error);
      res.status(500).json({ message: "Er ging iets mis bij het versturen van uw aanvraag" });
    }
  });

  app.get("/api/quote-requests", requireRole("ADMIN"), async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests();
      res.json(requests);
    } catch (error: any) {
      console.error("Get quote requests error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
