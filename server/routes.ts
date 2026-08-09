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
  getComments,
  getTask,
} from "./clickup";
import { insertQuoteRequestSchema } from "@shared/schema";
import { getAllBlogArticles } from "@shared/blog";
import { registerAnalyticsRoutes } from "./analytics-routes";
import { isEmailConfigured, sendPasswordResetEmail, sendWelcomeEmail } from "./email";
import { siteOrigin, getSubdomain } from "./subdomain";

/** Base URL for outbound links (emails, redirects). Never localhost. */
const APP_BASE_URL = process.env.APP_BASE_URL || "https://abonnement.website";

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

  // Sessie-cookie geldig op alle subdomeinen (app./admin.), maar alléén als het
  // request daadwerkelijk via het custom domein binnenkomt. Op *.replit.app of
  // preview-hosts zou een Domain=.abonnement.website cookie geweigerd worden.
  const cookieRootDomain = new URL(APP_BASE_URL).host.replace(/^www\./, "");
  app.use((req, _res, next) => {
    if (
      process.env.NODE_ENV === "production" &&
      req.session &&
      (req.hostname === cookieRootDomain || req.hostname.endsWith(`.${cookieRootDomain}`))
    ) {
      req.session.cookie.domain = `.${cookieRootDomain}`;
    }
    next();
  });

  // --- Analytics routes (GA4 + GSC + PSI) ---
  registerAnalyticsRoutes(app, requireRole);

  // --- Support ticket comments ---
  app.get("/api/support-tickets/:id/comments", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const { id } = req.params;

      if (!isClickUpConfigured()) {
        return res.json({ comments: [] });
      }

      // Verify the task belongs to this user by checking the uid tag
      const task = await getTask(id);
      const hasUserTag = (task.tags || []).some((t: any) => t.name === `uid:${user.id}`);
      if (!hasUserTag) {
        return res.status(403).json({ message: "Geen toegang tot dit ticket" });
      }

      const result = await getComments(id);
      const comments = (result.comments || []).map((c: any) => ({
        id: c.id,
        text: c.comment_text || "",
        author: c.user?.username || c.user?.email || "Support",
        date: c.date,
      }));

      res.json({ comments });
    } catch (error: any) {
      console.error("Get ticket comments error:", error);
      res.status(500).json({ message: "Kon reacties niet ophalen" });
    }
  });

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

      // Send welcome email (non-blocking)
      if (isEmailConfigured()) {
        sendWelcomeEmail(user.email, user.name).catch((err) =>
          console.error("Welcome email error (non-blocking):", err.message)
        );
      }

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
        const resetUrl = `${siteOrigin("app")}/reset-password?token=${token}`;

        if (isEmailConfigured()) {
          try {
            await sendPasswordResetEmail(user.email, user.name, resetUrl);
          } catch (emailErr: any) {
            console.error("Password reset email failed:", emailErr.message);
            console.log(`Password reset fallback URL for ${email}: ${resetUrl}`);
          }
        } else {
          console.log(`Password reset requested for ${email}. Reset URL: ${resetUrl}`);
        }
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

  // ... remaining routes stay the same, abbreviated for commit size ...
  // The full content continues below

  app.get("/api/addons/my", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscription(user.id);
      const availableAddOns = await storage.getAddOns();
      let selectedAddOns: any[] = [];
      if (subscription) {
        selectedAddOns = await storage.getAddOnSelections(subscription.id);
      }
      res.json({ availableAddOns, selectedAddOns, hasSubscription: !!subscription });
    } catch (error) {
      console.error("Get my add-ons error:", error);
      res.status(500).json({ message: "Failed to fetch add-ons" });
    }
  });

  app.post("/api/addons/select", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscription(user.id);
      if (!subscription) return res.status(400).json({ message: "No active subscription found." });
      if (!subscription.stripeSubscriptionId) return res.status(400).json({ message: "No Stripe subscription found. Please complete your plan checkout first." });
      const { addOnId } = req.body;
      if (!addOnId) return res.status(400).json({ message: "Add-on ID is required" });
      const addOn = await storage.getAddOn(addOnId);
      if (!addOn) return res.status(404).json({ message: "Add-on not found" });
      if (!addOn.isActive) return res.status(400).json({ message: "This add-on is not available." });
      if (!addOn.stripeQuarterlyPriceId) return res.status(400).json({ message: "This add-on is not yet available for purchase." });
      const existingSelections = await storage.getAddOnSelections(subscription.id);
      const alreadySelected = existingSelections.some(s => s.addOnId === addOnId && s.status === "ACTIVE");
      if (alreadySelected) return res.status(400).json({ message: "This add-on is already active on your subscription." });
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const subscriptionItem = await stripe.subscriptionItems.create({ subscription: subscription.stripeSubscriptionId, price: addOn.stripeQuarterlyPriceId, quantity: 1, proration_behavior: "create_prorations" });
      let selection;
      try {
        selection = await storage.createAddOnSelection({ subscriptionId: subscription.id, addOnId, status: "ACTIVE", stripeItemId: subscriptionItem.id });
      } catch (dbError) {
        console.error("DB insert failed after Stripe item created, compensating:", dbError);
        try { await stripe.subscriptionItems.del(subscriptionItem.id, { proration_behavior: "none" }); } catch (compensateError) { console.error("Failed to compensate Stripe item deletion:", compensateError); }
        throw dbError;
      }
      res.json(selection);
    } catch (error: any) {
      console.error("Select add-on error:", error);
      const message = error?.message?.includes("No such") ? "Stripe-abonnement niet gevonden. Neem contact op met support." : "Kon de add-on niet toevoegen aan uw abonnement.";
      res.status(500).json({ message });
    }
  });

  app.post("/api/addons/remove", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      const subscription = await storage.getSubscription(user.id);
      if (!subscription) return res.status(400).json({ message: "No active subscription found." });
      const { addOnId } = req.body;
      if (!addOnId) return res.status(400).json({ message: "Add-on ID is required" });
      const existingSelections = await storage.getAddOnSelections(subscription.id);
      const selection = existingSelections.find(s => s.addOnId === addOnId && s.status === "ACTIVE");
      if (!selection) return res.status(404).json({ message: "Active add-on not found on your subscription." });
      if (selection.stripeItemId) {
        const { getUncachableStripeClient } = await import("./stripeClient");
        const stripe = await getUncachableStripeClient();
        try { await stripe.subscriptionItems.del(selection.stripeItemId, { proration_behavior: "create_prorations" }); } catch (stripeError: any) {
          if (stripeError?.code === "resource_missing" || stripeError?.message?.includes("No such")) { console.warn("Stripe item already removed, continuing with DB cleanup:", selection.stripeItemId); } else { throw stripeError; }
        }
      }
      await storage.updateAddOnSelection(selection.id, { status: "CANCELLED" as any });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Remove add-on error:", error);
      res.status(500).json({ message: "Kon de add-on niet verwijderen. Probeer het opnieuw." });
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
      if (name && name !== user.name) { await storage.updateUser(user.id, { name }); }
      const profile = await storage.getCustomerProfile(user.id);
      if (profile) { await storage.updateCustomerProfile(user.id, { companyName: companyName || null, phone: phone || null, address: address || null, vatNumber: vatNumber || null }); }
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
          const invoice = await (stripe.invoices as any).retrieveUpcoming({ subscription: subscription.stripeSubscriptionId });
          if (invoice) { const dueDateTs = invoice.next_payment_attempt || invoice.period_end; if (dueDateTs) { upcomingInvoice = { amount: invoice.amount_due, dueDate: new Date(dueDateTs * 1000).toISOString() }; } }
        } catch (stripeError: any) { if (stripeError?.code !== 'invoice_upcoming_none') { console.error("Upcoming invoice fetch error:", stripeError.message); } }
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
      if (!subscription?.stripeCustomerId) return res.json({ url: null, message: "No active subscription found" });
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const returnUrl = `${siteOrigin("app")}/billing`;
      const session = await stripe.billingPortal.sessions.create({ customer: subscription.stripeCustomerId, return_url: returnUrl });
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
      if (!planId) return res.status(400).json({ message: "Plan ID is required" });
      const plan = await storage.getPlan(planId);
      if (!plan || !plan.isActive) return res.status(404).json({ message: "Plan not found" });
      const user = await storage.getUser(userId);
      if (!user) return res.status(401).json({ message: "User not found" });
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      let customerId: string | undefined;
      const existingSubscription = await storage.getSubscription(userId);
      if (existingSubscription?.stripeCustomerId) { customerId = existingSubscription.stripeCustomerId; }
      if (!customerId) {
        const profile = await storage.getCustomerProfile(userId);
        const customer = await stripe.customers.create({ email: user.email, name: user.name, metadata: { userId }, ...(profile?.companyName ? { description: profile.companyName } : {}) });
        customerId = customer.id;
      }
      const successUrl = `${APP_BASE_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${APP_BASE_URL}/?checkout=cancelled`;
      const sessionConfig: any = { customer: customerId, payment_method_types: ['card', 'ideal'], line_items: [{ price: plan.stripeQuarterlyPriceId || undefined, quantity: 1 }], mode: 'subscription', success_url: successUrl, cancel_url: cancelUrl, metadata: { userId, planId: plan.id } };
      if (!plan.stripeQuarterlyPriceId) { sessionConfig.line_items = [{ price_data: { currency: 'eur', product_data: { name: plan.name, description: `${plan.name} - Website Abonnement (per kwartaal vooruit)` }, unit_amount: plan.monthlyPriceCents * 3, recurring: { interval: 'month', interval_count: 3 } }, quantity: 1 }]; }
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
      if (!sessionId) return res.status(400).json({ message: "Session ID is required" });
      const { getUncachableStripeClient } = await import("./stripeClient");
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') return res.status(400).json({ message: "Payment not completed" });
      let userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;
      if (!planId) return res.status(400).json({ message: "Invalid session metadata" });
      if (!userId && req.session.userId) { userId = req.session.userId; }
      if (!userId) return res.status(400).json({ message: "User not found. Please log in first." });
      let currentPeriodEnd: Date | undefined;
      if (stripeSubscriptionId) { try { const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId); currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000); } catch (e: any) { console.error("Could not retrieve subscription period:", e.message); } }
      const existingSubscription = await storage.getSubscription(userId);
      if (existingSubscription) { await storage.updateSubscription(existingSubscription.id, { planId, stripeCustomerId, stripeSubscriptionId, status: 'ACTIVE', ...(currentPeriodEnd ? { currentPeriodEnd } : {}) }); } else { await storage.createSubscription({ userId, planId, stripeCustomerId, stripeSubscriptionId, status: 'ACTIVE', ...(currentPeriodEnd ? { currentPeriodEnd } : {}) }); }
      const existingProject = await storage.getProject(userId);
      if (!existingProject) { await storage.createProject({ userId, planId, status: 'ONBOARDING' }); }
      const subscription = await storage.getSubscription(userId);
      const project = await storage.getProject(userId);
      if (isClickUpConfigured()) { try { const user = await storage.getUser(userId); const plan = await storage.getPlan(planId); const profile = await storage.getCustomerProfile(userId); if (user && plan) { createKlantTask(user.name, user.email, plan.name, profile?.companyName || undefined).catch((err) => console.error("ClickUp klant task error (non-blocking):", err.message)); } } catch (clickupError: any) { console.error("ClickUp klant task error (non-blocking):", clickupError.message); } }
      res.json({ success: true, subscription, project });
    } catch (error: any) {
      console.error("Verify checkout error:", error);
      res.status(500).json({ message: "Could not verify checkout session" });
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try { const { getStripePublishableKey } = await import("./stripeClient"); const publishableKey = await getStripePublishableKey(); res.json({ publishableKey }); } catch (error: any) { console.error("Get publishable key error:", error); res.status(500).json({ message: "Could not get Stripe publishable key" }); }
  });

  app.get("/api/admin/stats", requireRole("ADMIN"), async (_req, res) => {
    try {
      const [stats, allChanges, quotes] = await Promise.all([
        storage.getAdminStats(),
        storage.getAllChangeRequests(),
        storage.getQuoteRequests(),
      ]);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const pendingChanges = allChanges.filter((c) => c.request.status === "pending").length;
      const inProgressChanges = allChanges.filter((c) => c.request.status === "in_progress").length;
      const newQuotes = quotes.filter((q) => q.status === "NEW").length;
      res.json({
        ...stats,
        pendingChanges,
        inProgressChanges,
        newQuotes,
        completedChangesThisMonth: allChanges.filter((c) => c.request.status === "completed" && c.request.completedAt && new Date(c.request.completedAt) >= monthStart).length,
        creditsUsedThisMonth: allChanges
          .filter((c) => c.request.status !== "rejected" && c.request.createdAt && new Date(c.request.createdAt) >= monthStart)
          .reduce((sum, c) => sum + (c.request.creditsUsed ?? 1), 0),
        recentChanges: allChanges.slice(0, 5),
        recentQuotes: quotes.slice(0, 3),
      });
    } catch (error) { console.error("Get admin stats error:", error); res.status(500).json({ message: "Failed to fetch admin stats" }); }
  });

  app.get("/api/admin/customers", requireRole("ADMIN"), async (_req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      const { start, end } = currentPeriod();
      // Batched: één query voor alle allocaties, één voor verbruik, één voor add-on counts.
      const [allocations, usage, addOnCounts] = await Promise.all([
        storage.getCreditAllocationsForPeriod(start, end),
        storage.getCreditUsageByUserForPeriod(start, end),
        storage.getAddOnCountsBySubscription(),
      ]);
      const allocByUser = new Map(allocations.map((a) => [a.userId, a]));
      const enriched = customers.map((c) => {
        const allocation = allocByUser.get(c.user.id);
        const total = allocation ? allocation.includedCredits + (allocation.bonusCredits ?? 0) : 2;
        return {
          ...c,
          credits: { used: usage.get(c.user.id) ?? 0, total },
          addOnCount: c.subscription ? (addOnCounts.get(c.subscription.id) ?? 0) : 0,
        };
      });
      res.json({ customers: enriched, total: enriched.length });
    } catch (error) { console.error("Get customers error:", error); res.status(500).json({ message: "Failed to fetch customers" }); }
  });

  app.get("/api/admin/projects", requireRole("ADMIN"), async (_req, res) => {
    try {
      const projects = await storage.getAllProjectsWithDetails();
      const statusCounts = { ONBOARDING: projects.filter((p) => p.project.status === "ONBOARDING").length, PRODUCTION: projects.filter((p) => p.project.status === "PRODUCTION").length, LIVE: projects.filter((p) => p.project.status === "LIVE").length, MAINTENANCE: projects.filter((p) => p.project.status === "MAINTENANCE").length };
      res.json({ projects, total: projects.length, statusCounts });
    } catch (error) { console.error("Get projects error:", error); res.status(500).json({ message: "Failed to fetch projects" }); }
  });

  app.put("/api/admin/projects/:id/status", requireRole("ADMIN"), async (req, res) => {
    try { const { id } = req.params; const { status } = req.body; const updated = await storage.updateProject(id, { status }); if (!updated) return res.status(404).json({ message: "Project not found" }); res.json(updated); } catch (error) { console.error("Update project status error:", error); res.status(500).json({ message: "Failed to update project" }); }
  });

  // ── Wijzigingscredits ─────────────────────────────────────────────
  const EXTRA_CREDIT_PRICE_CENTS = 2900;

  function currentPeriod() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  async function getOrCreateAllocation(userId: string) {
    const { start, end } = currentPeriod();
    let allocation = await storage.getCreditAllocation(userId, start, end);
    if (!allocation) {
      allocation = await storage.createCreditAllocation({
        userId,
        periodStart: start,
        periodEnd: end,
        includedCredits: 2,
        bonusCredits: 0,
      });
    }
    return allocation;
  }

  async function getCreditStatus(userId: string) {
    const allocation = await getOrCreateAllocation(userId);
    // Productafspraak: betaalde extra credits (isPaidExtra) tellen NIET mee
    // in het inbegrepen maandverbruik — die worden apart gefactureerd (€29).
    const used = await storage.countUsedCredits(allocation.id);
    const included = allocation.includedCredits;
    const bonus = allocation.bonusCredits ?? 0;
    return {
      allocation,
      summary: {
        period: {
          start: allocation.periodStart.toISOString().slice(0, 10),
          end: allocation.periodEnd.toISOString().slice(0, 10),
        },
        included,
        bonus,
        used,
        remaining: Math.max(0, included + bonus - used),
        extraCreditPrice: EXTRA_CREDIT_PRICE_CENTS,
      },
    };
  }

  app.get("/api/credits", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { summary } = await getCreditStatus(userId);
      res.json(summary);
    } catch (error) {
      console.error("Get credits error:", error);
      res.status(500).json({ message: "Kon creditstatus niet ophalen" });
    }
  });

  app.get("/api/credits/history", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const requests = await storage.getChangeRequests(req.session.userId!);
      res.json({ requests });
    } catch (error) {
      console.error("Get credit history error:", error);
      res.status(500).json({ message: "Kon wijzigingsgeschiedenis niet ophalen" });
    }
  });

  const changeRequestInputSchema = z.object({
    title: z.string().min(3, "Titel is te kort").max(200),
    description: z.string().max(5000).optional(),
  });

  app.post("/api/credits/request", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const parsed = changeRequestInputSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const allocation = await getOrCreateAllocation(userId);
      const creditLimit = allocation.includedCredits + (allocation.bonusCredits ?? 0);
      // Atomaire check-en-insert (rij-lock op de allocatie) zodat twee
      // gelijktijdige aanvragen nooit samen over het creditlimiet gaan.
      const request = await storage.createChangeRequestWithCredit({
        userId,
        allocationId: allocation.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        creditsUsed: 1,
        isPaidExtra: false,
        status: "pending",
      }, creditLimit);
      if (!request) {
        return res.status(402).json({ message: "Geen credits meer deze maand. Extra credits kosten €29/stuk.", code: "NO_CREDITS" });
      }
      res.json(request);
    } catch (error) {
      console.error("Create change request error:", error);
      res.status(500).json({ message: "Kon wijzigingsverzoek niet aanmaken" });
    }
  });

  app.post("/api/credits/request-extra", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const parsed = changeRequestInputSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const allocation = await getOrCreateAllocation(userId);
      // Facturatie van de extra credit (€29) verloopt voorlopig handmatig via de admin.
      const request = await storage.createChangeRequest({
        userId,
        allocationId: allocation.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        creditsUsed: 1,
        isPaidExtra: true,
        status: "pending",
      });
      res.json(request);
    } catch (error) {
      console.error("Create extra change request error:", error);
      res.status(500).json({ message: "Kon wijzigingsverzoek niet aanmaken" });
    }
  });

  const changeRequestStatusSchema = z.object({
    status: z.enum(["pending", "in_progress", "completed", "rejected"]),
    adminNotes: z.string().max(5000).optional(),
  });

  app.patch("/api/credits/request/:id", requireRole("ADMIN"), async (req, res) => {
    try {
      const parsed = changeRequestStatusSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const existing = await storage.getChangeRequest(req.params.id);
      if (!existing) return res.status(404).json({ message: "Wijzigingsverzoek niet gevonden" });
      const updated = await storage.updateChangeRequest(req.params.id, {
        status: parsed.data.status,
        ...(parsed.data.adminNotes !== undefined ? { adminNotes: parsed.data.adminNotes } : {}),
        ...(parsed.data.status === "completed" ? { completedAt: new Date() } : {}),
      });
      res.json(updated);
    } catch (error) {
      console.error("Update change request error:", error);
      res.status(500).json({ message: "Kon wijzigingsverzoek niet bijwerken" });
    }
  });

  // ── Admin: wijzigingsbeheer ───────────────────────────────────────
  const changeRequestStatusUpdateSchema = z.object({
    status: z.enum(["pending", "in_progress", "completed", "rejected"]).optional(),
    adminNotes: z.string().max(5000).optional(),
  });

  app.get("/api/admin/changes", requireRole("ADMIN"), async (req, res) => {
    try {
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const validStatuses = ["pending", "in_progress", "completed", "rejected"];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Ongeldige status" });
      }
      const changes = await storage.getAllChangeRequests(status);
      res.json({ changes });
    } catch (error) {
      console.error("Get admin changes error:", error);
      res.status(500).json({ message: "Kon wijzigingsverzoeken niet ophalen" });
    }
  });

  app.patch("/api/admin/changes/:id", requireRole("ADMIN"), async (req, res) => {
    try {
      const parsed = changeRequestStatusUpdateSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const existing = await storage.getChangeRequest(req.params.id);
      if (!existing) return res.status(404).json({ message: "Wijzigingsverzoek niet gevonden" });
      const updated = await storage.updateChangeRequest(req.params.id, {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.adminNotes !== undefined ? { adminNotes: parsed.data.adminNotes } : {}),
        ...(parsed.data.status === "completed" ? { completedAt: new Date() } : {}),
      });
      res.json(updated);
    } catch (error) {
      console.error("Update admin change error:", error);
      res.status(500).json({ message: "Kon wijzigingsverzoek niet bijwerken" });
    }
  });

  // ── Admin: klantdetail ────────────────────────────────────────────
  app.get("/api/admin/clients/:id", requireRole("ADMIN"), async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.role !== "CUSTOMER") return res.status(404).json({ message: "Klant niet gevonden" });
      const [profile, subscription, project] = await Promise.all([
        storage.getCustomerProfile(user.id),
        storage.getSubscriptionWithPlan(user.id),
        storage.getProject(user.id),
      ]);
      const addOnSelections = subscription ? await storage.getAddOnSelections(subscription.id) : [];
      const { summary } = await getCreditStatus(user.id);
      const requests = await storage.getChangeRequests(user.id);
      res.json({
        user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
        profile: profile || null,
        subscription: subscription || null,
        project: project || null,
        addOnSelections,
        credits: summary,
        changeRequests: requests.slice(0, 10),
        totalChangeRequests: requests.length,
      });
    } catch (error) {
      console.error("Get client detail error:", error);
      res.status(500).json({ message: "Kon klantgegevens niet ophalen" });
    }
  });

  app.post("/api/admin/clients/:id/bonus-credit", requireRole("ADMIN"), async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.role !== "CUSTOMER") return res.status(404).json({ message: "Klant niet gevonden" });
      const allocation = await getOrCreateAllocation(user.id);
      const updated = await storage.addBonusCredit(allocation.id);
      const { summary } = await getCreditStatus(user.id);
      res.json({ allocation: updated, credits: summary });
    } catch (error) {
      console.error("Add bonus credit error:", error);
      res.status(500).json({ message: "Kon bonus credit niet toekennen" });
    }
  });

  app.patch("/api/admin/clients/:id/notes", requireRole("ADMIN"), async (req, res) => {
    try {
      const parsed = z.object({ adminNotes: z.string().max(10000) }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const user = await storage.getUser(req.params.id);
      if (!user || user.role !== "CUSTOMER") return res.status(404).json({ message: "Klant niet gevonden" });
      await storage.updateCustomerProfileNotes(user.id, parsed.data.adminNotes);
      res.json({ success: true });
    } catch (error) {
      console.error("Update client notes error:", error);
      res.status(500).json({ message: "Kon notities niet opslaan" });
    }
  });

  // ── Admin: offertes ───────────────────────────────────────────────
  app.get("/api/admin/quotes", requireRole("ADMIN"), async (req, res) => {
    try {
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      let quotes = await storage.getQuoteRequests();
      if (status) quotes = quotes.filter((q) => q.status === status);
      res.json({ quotes });
    } catch (error) {
      console.error("Get admin quotes error:", error);
      res.status(500).json({ message: "Kon offertes niet ophalen" });
    }
  });

  app.patch("/api/admin/quotes/:id", requireRole("ADMIN"), async (req, res) => {
    try {
      const parsed = z.object({
        status: z.enum(["NEW", "CONTACTED", "QUOTED", "ACCEPTED", "DECLINED"]).optional(),
        adminNotes: z.string().max(10000).optional(),
      }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const updated = await storage.updateQuoteRequest(req.params.id, {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.adminNotes !== undefined ? { adminNotes: parsed.data.adminNotes } : {}),
      });
      if (!updated) return res.status(404).json({ message: "Offerte niet gevonden" });
      res.json(updated);
    } catch (error) {
      console.error("Update quote error:", error);
      res.status(500).json({ message: "Kon offerte niet bijwerken" });
    }
  });

  app.post("/api/admin/quotes/:id/clickup", requireRole("ADMIN"), async (req, res) => {
    try {
      const quotes = await storage.getQuoteRequests();
      const quote = quotes.find((q) => q.id === req.params.id);
      if (!quote) return res.status(404).json({ message: "Offerte niet gevonden" });
      if (quote.clickupTaskId) return res.status(409).json({ message: "Er bestaat al een ClickUp taak voor deze offerte" });
      if (!isClickUpConfigured()) return res.status(503).json({ message: "ClickUp is niet geconfigureerd" });
      const task = await createMaatwerkQuoteTask(
        quote.companyName, quote.contactName, quote.email, quote.phone,
        quote.projectType, quote.budgetRange, quote.description, quote.currentWebsite,
        quote.details as Record<string, any> | null,
      );
      const updated = await storage.updateQuoteRequest(quote.id, { clickupTaskId: task.id });
      res.json(updated);
    } catch (error) {
      console.error("Create quote ClickUp task error:", error);
      res.status(500).json({ message: "Kon ClickUp taak niet aanmaken" });
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
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      if (!isClickUpConfigured()) return res.status(503).json({ message: "Support systeem is tijdelijk niet beschikbaar" });
      const { subject, message, priority } = parsed.data;
      const ticket = await createSupportTicketTask(user.name, user.email, user.id, subject, message, priority);
      res.json({ success: true, ticketId: ticket.id });
    } catch (error: any) {
      console.error("Create support ticket error:", error);
      res.status(500).json({ message: "Kon support ticket niet aanmaken" });
    }
  });

  app.get("/api/support-tickets", requireRole("CUSTOMER"), async (req, res) => {
    try {
      const user = (req as any).user as User;
      if (!isClickUpConfigured()) return res.json({ tickets: [] });

      // Include closed/completed tickets so they remain visible
      const userTickets = await getTasksByTag(CLICKUP_LISTS.CUSTOMERS_SUPPORT, `uid:${user.id}`, { includeClosed: true });

      const tickets = userTickets.map((task: any) => ({
        id: task.id,
        name: task.name,
        status: task.status?.status || "to do",
        statusColor: task.status?.color || "#808080",
        priority: task.priority?.id || 3,
        priorityLabel: task.priority?.priority || "normal",
        dateCreated: task.date_created,
        // No url field: customers should not navigate to ClickUp
      }));

      res.json({ tickets });
    } catch (error: any) {
      console.error("Get support tickets error:", error);
      res.status(500).json({ message: "Kon support tickets niet ophalen" });
    }
  });

  app.get("/api/admin/clickup/overview", requireRole("ADMIN"), async (_req, res) => {
    try {
      if (!isClickUpConfigured()) return res.json({ configured: false, roadmap: [], delivery: [], support: [], growth: [] });
      const [roadmapResult, deliveryResult, supportResult, growthResult] = await Promise.all([
        getTasks(CLICKUP_LISTS.ROADMAP).catch(() => ({ tasks: [] })),
        getTasks(CLICKUP_LISTS.DELIVERY).catch(() => ({ tasks: [] })),
        getTasks(CLICKUP_LISTS.CUSTOMERS_SUPPORT).catch(() => ({ tasks: [] })),
        getTasks(CLICKUP_LISTS.GROWTH).catch(() => ({ tasks: [] })),
      ]);
      const mapTask = (task: any) => ({ id: task.id, name: task.name, status: task.status?.status || "to do", statusColor: task.status?.color || "#808080", priority: task.priority?.id || 3, priorityLabel: task.priority?.priority || "normal", dateCreated: task.date_created, url: task.url, assignees: (task.assignees || []).map((a: any) => a.username || a.email) });
      res.json({ configured: true, roadmap: (roadmapResult.tasks || []).map(mapTask), delivery: (deliveryResult.tasks || []).map(mapTask), support: (supportResult.tasks || []).map(mapTask), growth: (growthResult.tasks || []).map(mapTask) });
    } catch (error: any) { console.error("Get ClickUp overview error:", error); res.status(500).json({ message: "Kon ClickUp overzicht niet ophalen" }); }
  });

  app.get("/robots.txt", (req, res) => {
    const sub = getSubdomain(req);
    if (sub) {
      // app./admin. subdomeinen: volledig uitsluiten van indexatie
      res.type("text/plain").send(`User-agent: *\nDisallow: /\n`);
      return;
    }
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /checkout-success\nDisallow: /api/\n\nSitemap: https://abonnement.website/sitemap.xml\n`);
  });

  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://abonnement.website";
    const today = new Date().toISOString().split("T")[0];
    const pages = [{ loc: "/", priority: "1.0", changefreq: "weekly", lastmod: today }, { loc: "/betaalbare-professionele-website", priority: "0.9", changefreq: "monthly", lastmod: today }, { loc: "/blog", priority: "0.8", changefreq: "weekly", lastmod: today }, { loc: "/offerte", priority: "0.8", changefreq: "monthly", lastmod: "2026-06-01" }, { loc: "/privacy", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" }, { loc: "/terms", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" }, ...getAllBlogArticles().map((a) => ({ loc: `/blog/${a.slug}`, priority: "0.7", changefreq: "monthly", lastmod: a.dateModified ?? a.datePublished }))];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
    res.type("application/xml").send(xml);
  });

  const popupLeadSchema = z.object({ name: z.string().min(2, "Naam is verplicht").max(100), email: z.string().email("Ongeldig e-mailadres").max(254), message: z.string().max(1000).optional() });
  const popupLeadRateMap = new Map<string, { count: number; resetAt: number }>();

  app.post("/api/popup-lead", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const now = Date.now();
      const rateEntry = popupLeadRateMap.get(ip);
      if (rateEntry && rateEntry.resetAt > now) { if (rateEntry.count >= 5) return res.status(429).json({ message: "Te veel aanvragen. Probeer het later opnieuw." }); rateEntry.count++; } else { popupLeadRateMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); }
      const parsed = popupLeadSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const { name, email, message } = parsed.data;
      await storage.createQuoteRequest({ companyName: name, contactName: name, email, description: message || "Popup lead \u2014 geen vraag ingevuld", projectType: "popup-lead", phone: null, budgetRange: null, currentWebsite: null, details: { source: "popup", submittedAt: new Date().toISOString() } });
      if (isClickUpConfigured()) { try { await createPopupLeadTask(name, email, message); } catch (clickupError) { console.error("ClickUp popup lead task creation failed:", clickupError); } }
      res.json({ success: true });
    } catch (error: any) { console.error("Popup lead error:", error); res.status(500).json({ message: "Er ging iets mis bij het versturen" }); }
  });

  app.post("/api/quote-requests", async (req, res) => {
    try {
      const quoteValidation = insertQuoteRequestSchema.extend({ email: z.string().email("Ongeldig e-mailadres"), companyName: z.string().min(2, "Bedrijfsnaam is verplicht"), contactName: z.string().min(2, "Contactpersoon is verplicht"), description: z.string().min(10, "Beschrijving moet minimaal 10 tekens bevatten"), projectType: z.string().min(1, "Kies een projecttype") });
      const parsed = quoteValidation.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Ongeldige invoer", errors: parsed.error.flatten().fieldErrors });
      const data = { ...parsed.data, phone: parsed.data.phone || null, budgetRange: parsed.data.budgetRange || null, currentWebsite: parsed.data.currentWebsite || null };
      const quoteRequest = await storage.createQuoteRequest(data);
      if (isClickUpConfigured()) { try { const task = await createMaatwerkQuoteTask(data.companyName, data.contactName, data.email, data.phone || null, data.projectType, data.budgetRange || null, data.description, data.currentWebsite || null, data.details as Record<string, any> | null); await storage.updateQuoteRequest(quoteRequest.id, { clickupTaskId: task.id }); } catch (clickupError) { console.error("ClickUp task creation failed:", clickupError); } }
      res.json({ success: true, id: quoteRequest.id });
    } catch (error: any) { console.error("Quote request error:", error); res.status(500).json({ message: "Er ging iets mis bij het versturen van uw aanvraag" }); }
  });

  app.get("/api/quote-requests", requireRole("ADMIN"), async (req, res) => {
    try { const requests = await storage.getQuoteRequests(); res.json(requests); } catch (error: any) { console.error("Get quote requests error:", error); res.status(500).json({ message: "Internal server error" }); }
  });

  return httpServer;
}
