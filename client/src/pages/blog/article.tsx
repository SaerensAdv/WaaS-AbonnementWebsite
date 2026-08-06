import { Link, useParams } from "wouter";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import {
  getBlogArticleBySlug,
  getRelatedArticles,
  buildArticleJsonLd,
  type BlogArticle,
  getSocialImagePath,
} from "@shared/blog";
import { ArticleRenderer, formatDateNL } from "@/components/blog/article-renderer";
import NotFound from "@/pages/not-found";
import {
  Clock,
  User,
  CaretRight,
  ArrowRight,
  ArrowLeft,
} from "@phosphor-icons/react";

const ICON_WEIGHT = "duotone" as const;

export default function BlogArticlePage() {
  const params = useParams();
  const slug = (params.slug ?? "") as string;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    return <NotFound />;
  }

  return <ArticleView article={article} />;
}

function ArticleView({ article }: { article: BlogArticle }) {
  useSEO({
    title: article.metaTitle ?? article.title,
    description: article.metaDescription,
    canonical: `/blog/${article.slug}`,
    ogImage: getSocialImagePath(article),
    ogType: "article",
    structuredData: buildArticleJsonLd(article),
  });

  const related = getRelatedArticles(article, 3);

  return (
    <MarketingLayout>
      <article>
        {/* HEADER */}
        <header className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-3xl px-6 pt-28 pb-10 sm:pt-32">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Link
                href="/"
                className="hover:text-foreground"
                data-testid="breadcrumb-home"
              >
                Home
              </Link>
              <CaretRight size={14} weight="bold" />
              <Link
                href="/blog"
                className="hover:text-foreground"
                data-testid="breadcrumb-blog"
              >
                Blog
              </Link>
              <CaretRight size={14} weight="bold" />
              <span className="truncate text-foreground/70">
                {article.title}
              </span>
            </nav>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {article.category}
            </span>
            <h1
              className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]"
              data-testid="text-article-title"
            >
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User size={16} weight={ICON_WEIGHT} />
                {article.author}
              </span>
              <span>{formatDateNL(article.datePublished)}</span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} weight={ICON_WEIGHT} />
                {article.readingTimeMinutes} min leestijd
              </span>
            </div>
          </div>
        </header>

        {/* HERO IMAGE */}
        <div className="mx-auto max-w-4xl px-6">
          <div className="-mt-px aspect-[16/8] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 sm:mt-6 sm:rounded-3xl">
            <img
              src={article.heroImagePath}
              alt={article.heroAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* BODY */}
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <ArticleRenderer blocks={article.blocks} />

          {/* FAQ */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Veelgestelde vragen
              </h2>
              <div className="mt-6 space-y-4">
                {article.faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6"
                    data-testid={`faq-${faq.q}`}
                  >
                    <h3 className="font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BACK LINK */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              data-testid="link-back-to-blog"
            >
              <ArrowLeft size={16} weight={ICON_WEIGHT} />
              Terug naar alle artikelen
            </Link>
          </div>
        </div>
      </article>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-border bg-muted/20 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Lees ook
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg"
                  data-testid={`card-related-${rel.slug}`}
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src={rel.heroImagePath}
                      alt={rel.heroAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {rel.category}
                    </span>
                    <h3 className="mt-2 font-display text-lg leading-snug tracking-tight">
                      {rel.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {rel.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-[#0a0f1c] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Liever professioneel, zonder gedoe?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-light leading-relaxed text-slate-300">
            Wij bouwen en onderhouden je website. Alles inbegrepen vanaf €49 per
            maand — binnen 10 werkdagen online.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/#pricing">
              <Button
                size="lg"
                className="h-14 gap-2 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 px-8 text-base text-white shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]"
                data-testid="button-article-final-cta"
              >
                Bekijk de prijzen
                <ArrowRight size={16} weight={ICON_WEIGHT} />
              </Button>
            </a>
            <Link href="/betaalbare-professionele-website">
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                data-testid="button-article-secondary-cta"
              >
                Meer over onze aanpak
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
