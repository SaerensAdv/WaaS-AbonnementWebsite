import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AuthorBio } from "@/components/author-bio";
import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

function KeyTakeawaysBox({ takeaways }: { takeaways: string[] }) {
  return (
    <Card className="bg-primary/5 border-primary/20" data-testid="box-key-takeaways">
      <CardContent className="p-6">
        <h2 className="font-semibold text-lg mb-4">Belangrijkste Punten</h2>
        <ul className="space-y-3">
          {takeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{takeaway}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CTASection({ text, link }: { text: string; link: string }) {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20" data-testid="cta-section">
      <CardContent className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">{text}</h3>
        <Button asChild size="lg" data-testid="button-cta">
          <Link href={link}>
            Bekijk Onze Abonnementen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="h-10 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  const publishedDate = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const articleSchema = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.intro,
    "image": post.featuredImageUrl,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": "WebsiteAbonnementen Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WebsiteAbonnementen",
      "url": "https://abonnement.website",
      "logo": {
        "@type": "ImageObject",
        "url": "https://abonnement.website/favicon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://abonnement.website/blog/${slug}`
    },
    "wordCount": post.content?.split(/\s+/).length || 0,
    "timeRequired": `PT${post.readTimeMinutes || 5}M`
  } : undefined;

  useSEO({
    title: post?.metaTitle || post?.title || "Blog Artikel",
    description: post?.metaDescription || post?.intro || "Lees dit artikel op de WebsiteAbonnementen blog.",
    canonical: `/blog/${slug}`,
    ogType: "article",
    ogImage: post?.featuredImageUrl,
    structuredData: articleSchema
  });

  if (isLoading) {
    return (
      <MarketingLayout>
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <BlogPostSkeleton />
            </div>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  if (error || !post) {
    return (
      <MarketingLayout>
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-semibold mb-4">Artikel niet gevonden</h1>
            <p className="text-muted-foreground mb-8">
              Het artikel dat u zoekt bestaat niet of is niet meer beschikbaar.
            </p>
            <Button asChild>
              <Link href="/blog">Terug naar Blog</Link>
            </Button>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <BreadcrumbNav
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title }
              ]}
              className="mb-8"
            />

            {post.featuredImageUrl && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt || post.title}
                  className="w-full h-full object-cover"
                  data-testid="img-featured"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <Badge variant="secondary" data-testid="badge-category">
                  {post.category}
                </Badge>
              )}
              {publishedDate && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {publishedDate}
                </span>
              )}
              {post.readTimeMinutes && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTimeMinutes} minuten leestijd
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6" data-testid="heading-title">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-intro">
              {post.intro}
            </p>

            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="mb-10">
                <KeyTakeawaysBox takeaways={post.keyTakeaways} />
              </div>
            )}

            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
              data-testid="content-main"
            />

            {post.ctaText && post.ctaLink && (
              <div className="mb-10">
                <CTASection text={post.ctaText} link={post.ctaLink} />
              </div>
            )}

            {post.authorBio && (
              <div className="mt-12 pt-8 border-t">
                <AuthorBio
                  name="WebsiteAbonnementen Team"
                  bio={post.authorBio}
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
