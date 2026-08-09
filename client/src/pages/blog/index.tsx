import { Link } from "wouter";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import {
  getAllBlogArticles,
  buildBlogIndexJsonLd,
  BLOG_INTRO,
} from "@shared/blog";
import { formatDateNL } from "@/components/blog/article-renderer";
import { Clock, BookOpen, ArrowRight } from "@phosphor-icons/react";

const ICON_WEIGHT = "duotone" as const;

export default function BlogIndexPage() {
  const articles = getAllBlogArticles();

  useSEO({
    title: "Blog: websitetips voor starters",
    description: BLOG_INTRO,
    canonical: "/blog",
    structuredData: buildBlogIndexJsonLd(),
  });

  return (
    <MarketingLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-muted/20">
        <div className="mx-auto max-w-3xl px-6 pt-28 pb-14 text-center sm:pt-32">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
            <BookOpen size={16} weight={ICON_WEIGHT} />
            BLOG
          </div>
          <h1
            className="font-display text-[clamp(2rem,4vw+1rem,3.25rem)] leading-[1.1] tracking-tight"
            data-testid="text-page-title"
          >
            Slim online met je bedrijf
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {BLOG_INTRO}
          </p>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg"
                data-testid={`card-article-${article.slug}`}
              >
                <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                  <img
                    src={article.heroImagePath}
                    alt={article.heroAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {article.category}
                  </span>
                  <h2 className="mt-2 font-display text-xl leading-snug tracking-tight">
                    {article.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDateNL(article.datePublished)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} weight={ICON_WEIGHT} />
                      {article.readingTimeMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0f1c] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Klaar voor je eigen professionele website?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-slate-300">
            Alles inbegrepen voor €69 per maand. Geen opstartkosten, binnen 10
            werkdagen live.
          </p>
          <div className="mt-8">
            <a href="/#pricing">
              <Button
                size="lg"
                className="h-14 gap-2 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 px-8 text-base text-white shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]"
                data-testid="button-blog-cta"
              >
                Bekijk de prijzen
                <ArrowRight size={16} weight={ICON_WEIGHT} />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
