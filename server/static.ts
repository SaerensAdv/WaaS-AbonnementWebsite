import express, { type Express } from "express";
import fs from "fs";
import path from "path";

const KNOWN_ROUTES = new Set([
  "/",
  "/privacy",
  "/terms",
  "/offerte",
  "/betaalbare-professionele-website",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/checkout-success",
  "/app",
  "/app/onboarding",
  "/app/addons",
  "/app/analytics",
  "/app/billing",
  "/app/support",
  "/app/settings",
  "/admin",
  "/admin/customers",
  "/admin/clickup",
]);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", (req, res) => {
    const pathname = req.path;
    const status = KNOWN_ROUTES.has(pathname) ? 200 : 404;
    res.status(status).sendFile(path.resolve(distPath, "index.html"));
  });
}
