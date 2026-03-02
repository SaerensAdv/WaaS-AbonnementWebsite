import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n-context";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
  structuredData?: object;
}

const SITE_NAME = "Abonnement.Website";
const BASE_URL = "https://abonnement.website";
const DEFAULT_OG_IMAGE = "/og-image.png";

export function useSEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
  structuredData,
}: SEOProps) {
  const { language } = useTranslation();
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    updateMeta("description", description);

    if (noIndex) {
      updateMeta("robots", "noindex, nofollow");
    } else {
      updateMeta("robots", "index, follow");
    }

    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:site_name", SITE_NAME, true);
    updateMeta("og:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`, true);
    updateMeta("og:locale", language === "nl" ? "nl_NL" : "en_US", true);
    updateMeta("og:locale:alternate", language === "nl" ? "en_US" : "nl_NL", true);

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);

    const currentPath = window.location.pathname;
    const resolvedCanonical = canonical
      ? (canonical.startsWith("http") ? canonical : `${BASE_URL}${canonical}`)
      : `${BASE_URL}${currentPath}`;
    updateLink("canonical", resolvedCanonical);
    updateMeta("og:url", resolvedCanonical, true);

    const updateHreflang = (lang: string, href: string) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    const fullUrl = `${BASE_URL}${currentPath}`;
    updateHreflang("nl", fullUrl);
    updateHreflang("en", fullUrl);
    updateHreflang("x-default", fullUrl);

    // Add structured data
    const existingScript = document.querySelector('script[data-seo-structured]');
    if (existingScript) {
      existingScript.remove();
    }
    
    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-structured", "true");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      document.title = SITE_NAME;
      const script = document.querySelector('script[data-seo-structured]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, canonical, ogImage, ogType, noIndex, structuredData, language]);
}
