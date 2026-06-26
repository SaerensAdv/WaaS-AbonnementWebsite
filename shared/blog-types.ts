export type InlineNode = string | { text: string; href: string };

export type ContentBlock =
  | { type: "paragraph"; content: InlineNode[] }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: InlineNode[][] }
  | {
      type: "callout";
      variant?: "tip" | "info" | "warning";
      title?: string;
      content: InlineNode[];
    }
  | { type: "quote"; text: string; cite?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "cta"; title: string; text?: string; buttonLabel: string; href: string };

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  readingTimeMinutes: number;
  heroImagePath: string;
  heroAlt: string;
  blocks: ContentBlock[];
  faqs?: BlogFaq[];
  relatedSlugs: string[];
}
