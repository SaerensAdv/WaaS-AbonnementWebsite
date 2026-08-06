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

  // Strip trailing slashes (except root) to prevent duplicate URLs and 404s
  app.use((req, res, next) => {
    const reqPath = req.path;
    if (reqPath !== "/" && reqPath.endsWith("/")) {
      const query = req.url.slice(reqPath.length);
      const cleanPath = reqPath.slice(0, -1);
      res.redirect(301, cleanPath + query);
      return;
    }
    next();
  });

  // redirect: false prevents express.static from 301-ing /blog to /blog/
  // when a /blog/ directory exists in the build output (hero images live there)
  app.use(express.static(distPath, { redirect: false }));

  app.use("*", (req, res) => {
    const pathname = req.originalUrl.split("?")[0].replace(/\/$/, "") || "/";
    const status = isKnownRoute(pathname) ? 200 : 404;
    const indexPath = path.resolve(distPath, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    const injected = injectRouteMetadata(html, pathname);
    res.status(status).set("Content-Type", "text/html").end(injected);
  });
}
