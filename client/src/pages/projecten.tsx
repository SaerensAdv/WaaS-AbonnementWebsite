import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useSEO } from "@/hooks/use-seo";
import { useTranslation } from "@/lib/i18n-context";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  FadeIn,
  StaggerChildren,
  StaggerItem,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  ArrowRight,
  Check,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Building2,
  Star,
  Briefcase,
  Globe,
  Zap,
  Award,
} from "lucide-react";

interface ShowcaseProject {
  project: {
    id: string;
    publicUrl: string | null;
    showcaseThumbnailUrl: string | null;
    showcaseTitle: string | null;
    showcaseDescription: string | null;
    showcaseIndustry: string | null;
    showcaseFeatured: boolean | null;
    domain: string | null;
  };
  plan: { tier: string; name: string } | null;
  customerName: string;
}

function ProjectCardSkeleton() {
  return (
    <Card className="border bg-card h-full overflow-visible">
      <CardContent className="p-0">
        <Skeleton className="aspect-[16/9] rounded-t-lg" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project, t }: { project: ShowcaseProject; t: (key: string) => string }) {
  const title = project.project.showcaseTitle || project.project.domain || "Website";
  const hasImage = !!project.project.showcaseThumbnailUrl;
  
  const industry = project.project.showcaseIndustry;
  const altText = industry 
    ? `Website abonnement ${title} - professionele ${industry.toLowerCase()} website op maat gemaakt`
    : `Website abonnement ${title} - professionele website op maat gemaakt`;

  const getTierLabel = (tier: string): string => {
    switch (tier) {
      case "LOW":
        return t("projects.tiers.starter");
      case "MEDIUM":
        return t("projects.tiers.professional");
      case "HIGH":
        return t("projects.tiers.enterprise");
      default:
        return tier;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="border bg-card h-full overflow-visible"
        data-testid={`card-project-${project.project.id}`}
      >
        <CardContent className="p-0">
          <div className="aspect-[16/9] rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {hasImage ? (
              <img 
                src={project.project.showcaseThumbnailUrl!}
                alt={altText}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
                <div className="text-center p-6 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{project.project.domain || "Website"}</p>
                </div>
              </>
            )}
            {project.plan && (
              <Badge 
                variant="secondary" 
                className="absolute top-3 left-3 no-default-hover-elevate no-default-active-elevate"
              >
                {getTierLabel(project.plan.tier)}
              </Badge>
            )}
          </div>
          
          <div className="p-6 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-3 min-h-[3.5rem]">
              <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
              {project.project.showcaseFeatured && (
                <Badge className="bg-primary text-primary-foreground gap-1 shrink-0 mt-0.5">
                  <Star className="h-3 w-3" />
                  {t("projects.featured")}
                </Badge>
              )}
            </div>
            
            <div className="h-7 mb-4">
              {project.project.showcaseIndustry && (
                <div className="flex flex-wrap gap-1">
                  <Badge 
                    variant="outline" 
                    className="text-xs gap-1 no-default-hover-elevate no-default-active-elevate"
                  >
                    <Building2 className="h-3 w-3" />
                    {project.project.showcaseIndustry}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="h-12 mb-6">
              {project.project.showcaseDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.project.showcaseDescription}
                </p>
              )}
            </div>
            
            {project.project.publicUrl ? (
              <a 
                href={`${project.project.publicUrl}${project.project.publicUrl.includes('?') ? '&' : '?'}utm_source=websiteabonnementen&utm_medium=showcase&utm_campaign=portfolio`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  className="w-full gap-2" 
                  data-testid={`button-visit-${project.project.id}`}
                >
                  {t("projects.viewWebsite")}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button 
                className="w-full gap-2" 
                variant="secondary"
                disabled
              >
                {t("projects.comingSoon")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProjectenPage() {
  const { t } = useTranslation();

  useSEO({
    title: t("projects.seo.title"),
    description: t("projects.seo.description"),
    canonical: "/projecten",
  });

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data: projects, isLoading } = useQuery<ShowcaseProject[]>({
    queryKey: ["/api/showcase-projects"],
  });

  const industries = useMemo(() => {
    if (!projects) return [];
    const uniqueIndustries = new Set<string>();
    projects.forEach((p) => {
      if (p.project.showcaseIndustry) {
        uniqueIndustries.add(p.project.showcaseIndustry);
      }
    });
    return Array.from(uniqueIndustries).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeFilter === "all") return projects;
    if (activeFilter === "featured") return projects.filter((p) => p.project.showcaseFeatured);
    return projects.filter((p) => p.project.showcaseIndustry === activeFilter);
  }, [projects, activeFilter]);

  const filterOptions = [
    { id: "all", label: t("projects.filters.all"), icon: Globe },
    { id: "featured", label: t("projects.filters.featured"), icon: Star },
    ...industries.map((industry) => ({ id: industry, label: industry, icon: Building2 })),
  ];

  const statsItems = [
    { icon: Zap, label: t("projects.stats.items.0.label"), desc: t("projects.stats.items.0.desc") },
    { icon: Award, label: t("projects.stats.items.1.label"), desc: t("projects.stats.items.1.desc") },
    { icon: Globe, label: t("projects.stats.items.2.label"), desc: t("projects.stats.items.2.desc") },
  ];

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[60vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-projecten-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        
        <AnimatedDotGrid 
          className="opacity-80"
          dotSize={1}
          gap={35}
          baseOpacity={0.06}
          accentColor="59, 130, 246"
        />
        
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <BreadcrumbNav 
            items={[{ label: t("common.nav.projects") }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {t("projects.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-projecten-hero-title"
              >
                {t("projects.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("projects.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                {t("projects.hero.description")}
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-projecten-start">
                    {t("common.buttons.getStarted")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </FadeInUp>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-projecten-grid">
        <div className="container mx-auto px-4">
          {industries.length > 0 && (
            <FadeInUp>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {filterOptions.map((filter) => (
                  <motion.div
                    key={filter.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => setActiveFilter(filter.id)}
                      data-testid={`button-filter-${filter.id}`}
                    >
                      <filter.icon className="h-4 w-4" />
                      {filter.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </FadeInUp>
          )}

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[...Array(8)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto" staggerDelay={0.1}>
              {filteredProjects.map((project) => (
                <StaggerItem key={project.project.id}>
                  <ProjectCard project={project} t={t} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <FadeIn>
              <div className="text-center py-16 max-w-lg mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("projects.empty.title")}</h3>
                <p className="text-muted-foreground mb-8">
                  {t("projects.empty.description")}
                </p>
                <Link href="/pricing">
                  <Button className="gap-2">
                    {t("common.buttons.viewPlans")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-projecten-stats">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                {t("projects.stats.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t("projects.stats.title")}
                <br />
                <span className="text-primary">{t("projects.stats.titleHighlight")}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {t("projects.stats.description")}
              </p>
              
              <StaggerChildren className="grid sm:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
                {statsItems.map((item) => (
                  <StaggerItem key={item.label}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border bg-card">
                        <CardContent className="p-6 text-center">
                          <div className="h-12 w-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <item.icon className="h-6 w-6 text-primary" />
                          </div>
                          <span className="font-medium block mb-1">{item.label}</span>
                          <span className="text-sm text-muted-foreground">{item.desc}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-projecten-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("projects.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("projects.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-projecten-cta-start">
                      {t("common.buttons.startToday")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                      data-testid="button-projecten-cta-pricing"
                    >
                      {t("common.buttons.viewPlans")}
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <FadeIn delay={0.3}>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("projects.cta.features.0")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("projects.cta.features.1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("projects.cta.features.2")}</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </FadeInUp>
        </div>
      </section>
    </MarketingLayout>
  );
}
