import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import type { User } from "@shared/schema";
import {
  isGoogleConfigured,
  getTrafficOverview,
  getSearchOverview,
  runPSI,
} from "./google-analytics";

/**
 * Register analytics routes on the Express app.
 * Call this from registerRoutes() after session middleware is set up.
 */
export function registerAnalyticsRoutes(app: Express, requireRole: (...roles: string[]) => any) {

  // Check if analytics is available for the current user's project
  app.get("/api/analytics/status", requireRole("CUSTOMER"), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);

      const googleConfigured = isGoogleConfigured();
      const hasGA4 = !!(project?.ga4PropertyId);
      const hasGSC = !!(project?.gscSiteUrl);
      const hasWebsite = !!(project?.websiteUrl || project?.domain);

      res.json({
        configured: googleConfigured,
        ga4: { available: googleConfigured && hasGA4, propertyId: project?.ga4PropertyId || null },
        gsc: { available: googleConfigured && hasGSC, siteUrl: project?.gscSiteUrl || null },
        psi: { available: hasWebsite, url: project?.websiteUrl || (project?.domain ? `https://${project.domain}` : null) },
      });
    } catch (error: any) {
      console.error("Analytics status error:", error);
      res.status(500).json({ message: "Kon analytics status niet ophalen" });
    }
  });

  // GA4 traffic data
  app.get("/api/analytics/traffic", requireRole("CUSTOMER"), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);

      if (!project?.ga4PropertyId) {
        return res.status(404).json({ message: "Geen GA4 property gekoppeld aan uw project." });
      }

      if (!isGoogleConfigured()) {
        return res.status(503).json({ message: "Google Analytics is nog niet geconfigureerd." });
      }

      const days = parseInt(req.query.days as string) || 30;
      const data = await getTrafficOverview(project.ga4PropertyId, Math.min(days, 90));

      res.json(data);
    } catch (error: any) {
      console.error("Analytics traffic error:", error);
      res.status(500).json({ message: "Kon verkeergegevens niet ophalen." });
    }
  });

  // GSC search data
  app.get("/api/analytics/search", requireRole("CUSTOMER"), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);

      if (!project?.gscSiteUrl) {
        return res.status(404).json({ message: "Geen Search Console property gekoppeld aan uw project." });
      }

      if (!isGoogleConfigured()) {
        return res.status(503).json({ message: "Google Analytics is nog niet geconfigureerd." });
      }

      const days = parseInt(req.query.days as string) || 28;
      const data = await getSearchOverview(project.gscSiteUrl, Math.min(days, 90));

      res.json(data);
    } catch (error: any) {
      console.error("Analytics search error:", error);
      res.status(500).json({ message: "Kon zoekgegevens niet ophalen." });
    }
  });

  // PSI speed data
  app.get("/api/analytics/speed", requireRole("CUSTOMER"), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as User;
      const project = await storage.getProject(user.id);

      const url = project?.websiteUrl || (project?.domain ? `https://${project.domain}` : null);

      if (!url) {
        return res.status(404).json({ message: "Geen website URL gekoppeld aan uw project." });
      }

      const strategy = (req.query.strategy as "mobile" | "desktop") || "mobile";
      const data = await runPSI(url, strategy);

      res.json({ url, strategy, ...data });
    } catch (error: any) {
      console.error("Analytics speed error:", error);
      res.status(500).json({ message: "Kon snelheidsgegevens niet ophalen." });
    }
  });

  // Admin: set analytics config for a project
  app.patch("/api/admin/projects/:id/analytics", requireRole("ADMIN"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { ga4PropertyId, gscSiteUrl, websiteUrl } = req.body;

      const updates: any = {};
      if (ga4PropertyId !== undefined) updates.ga4PropertyId = ga4PropertyId || null;
      if (gscSiteUrl !== undefined) updates.gscSiteUrl = gscSiteUrl || null;
      if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl || null;

      const updated = await storage.updateProject(id, updates);
      if (!updated) {
        return res.status(404).json({ message: "Project niet gevonden" });
      }

      res.json({ success: true, project: updated });
    } catch (error: any) {
      console.error("Update analytics config error:", error);
      res.status(500).json({ message: "Kon analytics configuratie niet bijwerken" });
    }
  });
}
