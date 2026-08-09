import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectRouteMetadata } from "./seo-prerender";
import { isKnownRoute } from "./known-routes";
import { getSubdomain } from "./subdomain";

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
    const subdomain = getSubdomain(req as any);
    const status = isKnownRoute(pathname, subdomain) ? 200 : 404;
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    // SEO prerender alleen voor de publieke site; app/admin zijn noindex SPA's.
    if (!subdomain) {
      html = injectRouteMetadata(html, pathname);
    } else {
      html = html.replace("</head>", `<meta name="robots" content="noindex, nofollow" /></head>`);
    }
    res.status(status).set("Content-Type", "text/html").end(html);
  });
}
