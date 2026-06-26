import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectRouteMetadata } from "./seo-prerender";
import { isKnownRoute } from "./known-routes";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", (req, res) => {
    const pathname = req.originalUrl.split("?")[0];
    const status = isKnownRoute(pathname) ? 200 : 404;
    const indexPath = path.resolve(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    const injected = injectRouteMetadata(html, pathname);
    res.status(status).set("Content-Type", "text/html").end(injected);
  });
}
