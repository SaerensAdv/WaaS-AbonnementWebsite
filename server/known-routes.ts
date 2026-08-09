import { getBlogSlugs } from "@shared/blog";
import type { Subdomain } from "./subdomain";

const PUBLIC_ROUTES = new Set<string>([
  "/",
  "/privacy",
  "/terms",
  "/offerte",
  "/betaalbare-professionele-website",
  "/consentease",
  "/werkwijze",
  "/blog",
  "/checkout-success",
]);

const APP_ROUTES = new Set<string>([
  "/",
  "/onboarding",
  "/addons",
  "/analytics",
  "/billing",
  "/support",
  "/settings",
  "/changes",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
]);

const ADMIN_ROUTES = new Set<string>([
  "/",
  "/changes",
  "/customers",
  "/quotes",
  "/clickup",
  "/login",
]);

export function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function isKnownRoute(pathname: string, subdomain: Subdomain = null): boolean {
  // Normalize: strip trailing slash (except root)
  const normalized = pathname !== "/" && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  if (subdomain === "app") return APP_ROUTES.has(normalized);
  if (subdomain === "admin") {
    return ADMIN_ROUTES.has(normalized) || /^\/clients\/[^/]+$/.test(normalized);
  }

  if (PUBLIC_ROUTES.has(normalized)) return true;
  const match = normalized.match(/^\/blog\/([^/]+)$/);
  if (match) {
    const slug = safeDecode(match[1]);
    return slug !== null && getBlogSlugs().includes(slug);
  }
  return false;
}
