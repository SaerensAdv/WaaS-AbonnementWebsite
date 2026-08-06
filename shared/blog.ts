import type { BlogArticle } from "./blog-types";
import { article as watKostEenProfessioneleWebsite } from "./blog/wat-kost-een-professionele-website";
import { article as websiteLatenMakenOfZelfDoen } from "./blog/website-laten-maken-of-zelf-doen";
import { article as websiteVoorZzpEnZelfstandigen } from "./blog/website-voor-zzp-en-zelfstandigen";
import { article as watKostEenWebsitePerMaand } from "./blog/wat-kost-een-website-per-maand";
import { article as checklistGoedeBedrijfswebsite } from "./blog/checklist-goede-bedrijfswebsite";
import { article as cookiebannerGdprWebsite } from "./blog/cookiebanner-gdpr-website";

export type { InlineNode, ContentBlock, BlogFaq, BlogArticle } from "./blog-types";

const SITE_NAME = "Abonnement.Website";
const DEFAULT_BASE_URL = "https://abonnement.website";
const DEFAULT_OG_IMAGE = "/og-image.png";

export const BLOG_INTRO =
  "Praktische tips en eerlijke uitleg over websites, kosten, SEO en GDPR voor starters, zzp'ers en zelfstandigen in Nederland en België.";

export const BLOG_ARTICLES: BlogArticle[] = [
  watKostEenProfessioneleWebsite,
  websiteLatenMakenOfZelfDoen,
  websiteVoorZzpEnZelfstandigen,
  watKostEenWebsitePerMaand,
  checklistGoedeBedrijfswebsite,
  cookiebannerGdprWebsite,
];

export function getAllBlogArticles(): BlogArticle[] {
  return [...BLOG_ARTICLES].sort((a, b) =>
    (b.dateModified ?? b.datePublished).localeCompare(
      a.dateModified ?? a.datePublished,
    ),
  );
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getBlogSlugs(): string[] {
  return BLOG_ARTICLES.map((a) => a.slug);
}

export function getBlogRoutes(): string[] {
  return BLOG_ARTICLES.map((a) => `/blog/${a.slug}`);
}

export function getRelatedArticles(
  article: BlogArticle,
  limit = 3,
): BlogArticle[] {
  const related = article.relatedSlugs
    .map((slug) => getBlogArticleBySlug(slug))
    .filter((a): a is BlogArticle => Boolean(a));
  if (related.length >= limit) return related.slice(0, limit);
  const fallback = getAllBlogArticles().filter(
    (a) => a.slug !== article.slug && !article.relatedSlugs.includes(a.slug),
  );
  return [...related, ...fallback].slice(0, limit);
}

function absoluteUrl(baseUrl: string, path: string): string {
  return path.startsWith("http") ? path : `${baseUrl}${path}`;
}

function buildBreadcrumb(
  baseUrl: string,
  items: { name: string; path: string }[],
): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}

/**
 * Social share image (Open Graph / Twitter). WebP heroes are used on-page,
 * but social scrapers (LinkedIn, messaging apps) have inconsistent WebP
 * support, so social cards use a JPEG variant generated alongside each hero.
 */
export function getSocialImagePath(article: BlogArticle): string {
  return article.heroImagePath.replace(/\.webp$/, ".jpg");
}

export function buildArticleJsonLd(
  article: BlogArticle,
  baseUrl: string = DEFAULT_BASE_URL,
): object {
  const url = `${baseUrl}/blog/${article.slug}`;
  const graph: object[] = [
    {
      "@type": "BlogPosting",
      headline: article.title,
      description: article.metaDescription,
      datePublished: article.datePublished,
      dateModified: article.dateModified ?? article.datePublished,
      image: absoluteUrl(baseUrl, article.heroImagePath),
      author: { "@type": "Organization", name: article.author, url: baseUrl },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}${DEFAULT_OG_IMAGE}`,
        },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: "nl-NL",
    },
    buildBreadcrumb(baseUrl, [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: article.title, path: `/blog/${article.slug}` },
    ]),
  ];
  if (article.faqs && article.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: article.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildBlogIndexJsonLd(baseUrl: string = DEFAULT_BASE_URL): object {
  const articles = getAllBlogArticles();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: `Blog | ${SITE_NAME}`,
        url: `${baseUrl}/blog`,
        description: BLOG_INTRO,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: baseUrl,
        },
        blogPost: articles.map((a) => ({
          "@type": "BlogPosting",
          headline: a.title,
          description: a.metaDescription,
          url: `${baseUrl}/blog/${a.slug}`,
          datePublished: a.datePublished,
          dateModified: a.dateModified ?? a.datePublished,
        })),
      },
      buildBreadcrumb(baseUrl, [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  };
}
