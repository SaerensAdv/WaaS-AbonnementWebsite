import type { Request, Response, NextFunction } from "express";

export type Subdomain = "app" | "admin" | null;

const PUBLIC_BASE_URL = process.env.APP_BASE_URL || "https://abonnement.website";

/** Absolute origin voor een site ("public" | "app" | "admin") in productie. */
export function siteOrigin(site: "public" | "app" | "admin"): string {
  const url = new URL(PUBLIC_BASE_URL);
  const host = url.host.replace(/^www\./, "");
  if (site === "public") return `${url.protocol}//${host}`;
  return `${url.protocol}//${site}.${host}`;
}

function parseCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=") || null;
  }
  return null;
}

/**
 * Bepaal het actieve subdomein voor een request.
 * - Productie: eerste hostname-label ("app." / "admin.").
 * - Development (Replit preview heeft geen subdomeinen): query param
 *   `?subdomain=app|admin|public` met een `dev_subdomain` cookie als fallback,
 *   zodat SPA-refreshes en asset-requests consistent blijven.
 */
export function getSubdomain(req: Request): Subdomain {
  const hostname = (req.hostname || "").toLowerCase();
  const first = hostname.split(".")[0];
  if (first === "app" || first === "admin") return first;

  if (process.env.NODE_ENV !== "production") {
    const q = typeof req.query.subdomain === "string" ? req.query.subdomain : null;
    if (q === "app" || q === "admin") return q;
    if (q === "public") return null;
    const c = parseCookie(req.headers.cookie, "dev_subdomain");
    if (c === "app" || c === "admin") return c;
  }
  return null;
}

/**
 * Middleware: zet req.subdomain, onderhoudt de dev-cookie en verzorgt
 * de 301-redirects van oude /app- en /admin-paden op de publieke site.
 */
export function subdomainMiddleware(req: Request, res: Response, next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";

  // Dev: query param wint en wordt gepersisteerd in een cookie.
  if (!isProd && typeof req.query.subdomain === "string") {
    const q = req.query.subdomain;
    if (q === "app" || q === "admin") {
      res.cookie("dev_subdomain", q, { httpOnly: false, sameSite: "lax" });
    } else if (q === "public") {
      res.clearCookie("dev_subdomain");
    }
  }

  const subdomain = getSubdomain(req);
  (req as any).subdomain = subdomain;

  // API en websockets: overal beschikbaar, nooit redirecten.
  if (req.path.startsWith("/api") || req.path.startsWith("/vite-hmr")) {
    return next();
  }

  if (subdomain === null) {
    // Oude paden op de publieke site → subdomein (301).
    if (req.path === "/app" || req.path.startsWith("/app/")) {
      const rest = req.path.slice("/app".length) || "/";
      return res.redirect(301, isProd ? `${siteOrigin("app")}${rest}` : `${rest}?subdomain=app`);
    }
    if (req.path === "/admin" || req.path.startsWith("/admin/")) {
      const rest = req.path.slice("/admin".length) || "/";
      return res.redirect(301, isProd ? `${siteOrigin("admin")}${rest}` : `${rest}?subdomain=admin`);
    }
    // Auth hoort bij het app-subdomein. Uitzondering: /signup blijft op de
    // publieke site beschikbaar (marketing-funnel → checkout).
    if (["/login", "/forgot-password", "/reset-password"].includes(req.path)) {
      const qs = req.url.slice(req.path.length);
      return res.redirect(301, isProd ? `${siteOrigin("app")}${req.path}${qs}` : `${req.path}${qs}${qs.includes("?") ? "&" : "?"}subdomain=app`);
    }
  }

  next();
}
