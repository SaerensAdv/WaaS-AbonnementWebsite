import { getBlogSlugs } from "@shared/blog";

const STATIC_ROUTES = new Set<string>([
  "/",
  "/privacy",
  "/terms",
  "/offerte",
  "/betaalbare-professionele-website",
  "/blog",
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

export function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function isKnownRoute(pathname: string): boolean {
  if (STATIC_ROUTES.has(pathname)) return true;
  const match = pathname.match(/^\/blog\/([^/]+)$/);
  if (match) {
    const slug = safeDecode(match[1]);
    return slug !== null && getBlogSlugs().includes(slug);
  }
  return false;
}
