export type Site = "public" | "app" | "admin";

const PROD_ROOT = "abonnement.website";

function isProdHost(hostname: string): boolean {
  return hostname === PROD_ROOT || hostname.endsWith(`.${PROD_ROOT}`);
}

/**
 * Bepaal op welke "site" de SPA draait.
 * - Productie: subdomein (app./admin.) van abonnement.website.
 * - Development: ?subdomain= query param, gepersisteerd in een cookie
 *   (dezelfde `dev_subdomain` cookie die de server zet/leest).
 */
export function getSite(): Site {
  if (typeof window === "undefined") return "public";
  const hostname = window.location.hostname.toLowerCase();
  const first = hostname.split(".")[0];
  if (isProdHost(hostname)) {
    if (first === "app" || first === "admin") return first;
    return "public";
  }

  // Development / preview: query param > cookie.
  const q = new URLSearchParams(window.location.search).get("subdomain");
  if (q === "app" || q === "admin") {
    document.cookie = `dev_subdomain=${q}; path=/; samesite=lax`;
    return q;
  }
  if (q === "public") {
    document.cookie = "dev_subdomain=; path=/; max-age=0";
    return "public";
  }
  const match = document.cookie.match(/(?:^|;\s*)dev_subdomain=(app|admin)/);
  if (match) return match[1] as Site;
  return "public";
}

/**
 * Absolute (of dev-relatieve) URL naar een pad op een andere site.
 * Productie: https://app.abonnement.website/pad
 * Development: /pad?subdomain=app (cookie neemt het daarna over)
 */
export function siteUrl(site: Site, path: string = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined" && isProdHost(window.location.hostname.toLowerCase())) {
    const host = site === "public" ? PROD_ROOT : `${site}.${PROD_ROOT}`;
    return `${window.location.protocol}//${host}${normalized}`;
  }
  const sep = normalized.includes("?") ? "&" : "?";
  return `${normalized}${sep}subdomain=${site}`;
}

/** Volledige navigatie naar een andere site (hard redirect, geen SPA-route). */
export function goToSite(site: Site, path: string = "/"): void {
  window.location.href = siteUrl(site, path);
}
