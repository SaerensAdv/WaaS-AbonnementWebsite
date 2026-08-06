import type { RouteMetadata } from "./seo-prerender";
import { safeDecode } from "./known-routes";
import type { ContentBlock, InlineNode, BlogArticle } from "@shared/blog";
import {
  getSocialImagePath,
  getAllBlogArticles,
  getBlogArticleBySlug,
  getRelatedArticles,
  buildArticleJsonLd,
  buildBlogIndexJsonLd,
  BLOG_INTRO,
} from "@shared/blog";

const BASE_URL = "https://abonnement.website";
const SITE_NAME = "Abonnement.Website";
const TITLE_SUFFIX = " | Abonnement.Website";
const MAX_TITLE_LENGTH = 60;

const MONTHS_NL = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function formatDateNL(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTitle(base: string): string {
  // If title + suffix fits, use it. Otherwise just use the base title.
  const full = base + TITLE_SUFFIX;
  if (full.length <= MAX_TITLE_LENGTH) return full;
  return base;
}

function renderInline(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      if (typeof node === "string") return escapeHtml(node);
      if (node.href === "#") return `<strong>${escapeHtml(node.text)}</strong>`;
      return `<a href="${escapeHtml(node.href)}">${escapeHtml(node.text)}</a>`;
    })
    .join("");
}

function renderBlocks(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
        case "paragraph":
          return `<p>${renderInline(block.content)}</p>`;
        case "list": {
          const tag = block.ordered ? "ol" : "ul";
          const items = block.items
            .map((item) => `<li>${renderInline(item)}</li>`)
            .join("");
          return `<${tag}>${items}</${tag}>`;
        }
        case "callout": {
          const title = block.title
            ? `<strong>${escapeHtml(block.title)}</strong> `
            : "";
          return `<aside>${title}${renderInline(block.content)}</aside>`;
        }
        case "quote": {
          const cite = block.cite
            ? `<footer>${escapeHtml(block.cite)}</footer>`
            : "";
          return `<blockquote><p>${escapeHtml(block.text)}</p>${cite}</blockquote>`;
        }
        case "table": {
          const caption = block.caption
            ? `<caption>${escapeHtml(block.caption)}</caption>`
            : "";
          const head = `<thead><tr>${block.headers
            .map((h) => `<th>${escapeHtml(h)}</th>`)
            .join("")}</tr></thead>`;
          const body = `<tbody>${block.rows
            .map(
              (row) =>
                `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`,
            )
            .join("")}</tbody>`;
          return `<table>${caption}${head}${body}</table>`;
        }
        case "cta": {
          const text = block.text ? `<p>${escapeHtml(block.text)}</p>` : "";
          return `<section><h3>${escapeHtml(block.title)}</h3>${text}<a href="${escapeHtml(block.href)}">${escapeHtml(block.buttonLabel)}</a></section>`;
        }
        default:
          return "";
      }
    })
    .join("\n    ");
}

function headerHtml(): string {
  return `  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/blog">Blog</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>`;
}

function footerHtml(): string {
  return `  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/blog">Blog</a> | <a href="/#pricing">Prijzen</a> | <a href="/privacy">Privacy</a>
  </footer>`;
}

function renderBlogIndexHtml(): string {
  const articles = getAllBlogArticles();
  const cards = articles
    .map(
      (a) => `      <article>
        <p>${escapeHtml(a.category)}</p>
        <h2><a href="/blog/${a.slug}">${escapeHtml(a.title)}</a></h2>
        <p>${escapeHtml(a.excerpt)}</p>
        <p>${formatDateNL(a.datePublished)} &middot; ${a.readingTimeMinutes} min leestijd</p>
        <a href="/blog/${a.slug}">Lees artikel</a>
      </article>`,
    )
    .join("\n");
  return `
<div id="root">
${headerHtml()}
  <main>
    <nav aria-label="Breadcrumb">
      <a href="/">Home</a> &rsaquo; <span>Blog</span>
    </nav>
    <h1>Slim online met je bedrijf</h1>
    <p>${escapeHtml(BLOG_INTRO)}</p>
    <section>
${cards}
    </section>
    <section>
      <h2>Professionele website nodig?</h2>
      <p>Bekijk onze website abonnementen vanaf \u20ac49 per maand. Design, hosting en support inbegrepen.</p>
      <a href="/#pricing">Bekijk abonnementen</a>
    </section>
  </main>
${footerHtml()}
</div>`;
}

function renderArticleHtml(article: BlogArticle): string {
  const faqHtml =
    article.faqs && article.faqs.length > 0
      ? `    <section>
      <h2>Veelgestelde vragen</h2>
      <dl>
${article.faqs
  .map(
    (f) =>
      `        <dt>${escapeHtml(f.q)}</dt>\n        <dd>${escapeHtml(f.a)}</dd>`,
  )
  .join("\n")}
      </dl>
    </section>`
      : "";

  const related = getRelatedArticles(article, 3);
  const relatedHtml =
    related.length > 0
      ? `    <section>
      <h2>Lees ook</h2>
      <ul>
${related
  .map((r) => `        <li><a href="/blog/${r.slug}">${escapeHtml(r.title)}</a></li>`)
  .join("\n")}
      </ul>
    </section>`
      : "";

  return `
<div id="root">
${headerHtml()}
  <main>
    <nav aria-label="Breadcrumb">
      <a href="/">Home</a> &rsaquo; <a href="/blog">Blog</a> &rsaquo; <span>${escapeHtml(article.title)}</span>
    </nav>
    <article>
      <p>${escapeHtml(article.category)}</p>
      <h1>${escapeHtml(article.title)}</h1>
      <p>${escapeHtml(article.author)} &middot; ${formatDateNL(article.datePublished)} &middot; ${article.readingTimeMinutes} min leestijd</p>
      ${renderBlocks(article.blocks)}
    </article>
${faqHtml}
${relatedHtml}
    <section>
      <h2>Website abonnement bekijken?</h2>
      <p>Professionele website vanaf \u20ac49/maand. Hosting, onderhoud en support inbegrepen.</p>
      <a href="/#pricing">Bekijk de prijzen</a> | <a href="/betaalbare-professionele-website">Meer over onze aanpak</a>
    </section>
  </main>
${footerHtml()}
</div>`;
}

export function getBlogMetadata(pathname: string): RouteMetadata | undefined {
  if (pathname === "/blog") {
    return {
      title: `Blog: websitetips voor starters | ${SITE_NAME}`,
      description: BLOG_INTRO,
      canonical: `${BASE_URL}/blog`,
      structuredData: buildBlogIndexJsonLd(BASE_URL),
      staticHtml: renderBlogIndexHtml(),
    };
  }

  const match = pathname.match(/^\/blog\/([^/]+)$/);
  if (match) {
    const slug = safeDecode(match[1]);
    if (slug === null) return undefined;
    const article = getBlogArticleBySlug(slug);
    if (!article) return undefined;

    const title = buildTitle(article.metaTitle ?? article.title);
    return {
      title,
      description: article.metaDescription,
      canonical: `${BASE_URL}/blog/${article.slug}`,
      ogTitle: title,
      ogDescription: article.metaDescription,
      ogImage: `${BASE_URL}${getSocialImagePath(article)}`,
      structuredData: buildArticleJsonLd(article, BASE_URL),
      staticHtml: renderArticleHtml(article),
    };
  }

  return undefined;
}
