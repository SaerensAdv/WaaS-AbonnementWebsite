import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useSEO } from "@/hooks/use-seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

function BlogPostCard({ post }: { post: BlogPost }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/blog/${post.slug}`} data-testid={`link-blog-post-${post.slug}`}>
      <Card className="h-full overflow-visible hover-elevate active-elevate-2 cursor-pointer group">
        {post.featuredImageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-md">
            <img
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-blog-${post.slug}`}
            />
          </div>
        )}
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <Badge variant="secondary" data-testid={`badge-category-${post.slug}`}>
                {post.category}
              </Badge>
            )}
          </div>
          
          <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-title-${post.slug}`}>
            {post.title}
          </h2>
          
          <p className="text-muted-foreground text-sm line-clamp-3" data-testid={`text-intro-${post.slug}`}>
            {post.intro}
          </p>
          
          <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {publishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {publishedDate}
                </span>
              )}
              {post.readTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTimeMinutes} min
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-primary font-medium">
              Lees meer
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BlogPostSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-video">
        <Skeleton className="w-full h-full rounded-t-md rounded-b-none" />
      </div>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogPage() {
  useSEO({
    title: "Blog - Tips & Inzichten voor Uw Website",
    description: "Ontdek de laatste tips, trends en inzichten over websites, SEO, en online marketing. Praktische informatie voor ondernemers die hun online aanwezigheid willen verbeteren.",
    canonical: "/blog",
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "WebsiteAbonnementen Blog",
      "description": "Tips, trends en inzichten over websites, SEO en online marketing",
      "url": "https://abonnement.website/blog",
      "publisher": {
        "@type": "Organization",
        "name": "WebsiteAbonnementen",
        "url": "https://abonnement.website"
      }
    }
  });

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <MarketingLayout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <BreadcrumbNav
            items={[{ label: "Blog" }]}
            className="mb-8"
          />

          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4" data-testid="heading-blog">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground" data-testid="text-blog-description">
              Tips, trends en inzichten om het maximale uit uw website te halen.
              Praktische informatie voor ondernemers die online willen groeien.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <BlogPostSkeleton key={i} />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-blog-posts">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground" data-testid="text-no-posts">
                Er zijn nog geen blogposts gepubliceerd.
              </p>
            </div>
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
