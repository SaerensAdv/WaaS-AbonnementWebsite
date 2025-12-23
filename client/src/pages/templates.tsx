import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Briefcase,
  Heart,
  Award,
  Zap,
  Target,
  Layout,
  Star,
  Loader2,
} from "lucide-react";
import type { Template } from "@shared/schema";

type FilterType = "all" | "starter" | "professional" | "featured";

function TemplateCard({ template, t }: { template: Template; t: (key: string) => string }) {
  const tierLabel = template.planEligibility === "LOW" ? t("templates.badges.starter") : t("templates.badges.professional");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="border bg-card h-full overflow-visible"
        data-testid={`card-template-${template.id}`}
      >
        <CardContent className="p-0">
          <div className="aspect-[4/3] rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {template.previewImageUrl ? (
              <img 
                src={template.previewImageUrl} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <Layout className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {template.isFeatured && (
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                {t("templates.badges.popular")}
              </Badge>
            )}
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 no-default-hover-elevate no-default-active-elevate"
            >
              {tierLabel}
            </Badge>
            {template.category && (
              <Badge 
                variant="outline" 
                className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/90 text-foreground no-default-hover-elevate no-default-active-elevate"
              >
                {template.category}
              </Badge>
            )}
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                {template.description}
              </p>
            )}
            
            <Link href="/pricing">
              <Button className="w-full gap-2" data-testid={`button-select-${template.id}`}>
                {t("common.buttons.chooseExample")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const { t } = useTranslation();

  useSEO({
    title: t("templates.seo.title"),
    description: t("templates.seo.description"),
    canonical: "/templates",
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const filterOptions = [
    { id: "all" as const, label: t("templates.filters.all"), icon: Layout },
    { id: "starter" as const, label: t("templates.filters.starter"), icon: Zap },
    { id: "professional" as const, label: t("templates.filters.professional"), icon: Award },
    { id: "featured" as const, label: t("templates.filters.popular"), icon: Star },
  ];

  const filteredTemplates = templates.filter((template) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "starter") return template.planEligibility === "LOW";
    if (activeFilter === "professional") return template.planEligibility === "MEDIUM" || template.planEligibility === "HIGH";
    if (activeFilter === "featured") return template.isFeatured;
    return true;
  });

  const reassuranceItems = [
    { icon: Heart, label: t("templates.reassurance.items.0") },
    { icon: Briefcase, label: t("templates.reassurance.items.1") },
    { icon: Target, label: t("templates.reassurance.items.2") },
  ];

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[60vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-templates-hero"
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
            items={[{ label: t("common.nav.templates") }]} 
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
                {t("templates.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-templates-hero-title"
              >
                {t("templates.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("templates.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                {t("templates.hero.description")}
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-templates-start">
                    {t("common.buttons.viewPlans")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </FadeInUp>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-templates-grid">
        <div className="container mx-auto px-4">
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

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto" staggerDelay={0.1}>
              {filteredTemplates.map((template) => (
                <StaggerItem key={template.id}>
                  <TemplateCard template={template} t={t} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}

          {!isLoading && filteredTemplates.length === 0 && (
            <FadeIn>
              <div className="text-center py-16">
                <p className="text-muted-foreground">{t("templates.noResults")}</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-reassurance">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                {t("templates.reassurance.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t("templates.reassurance.title")}
                <br />
                <span className="text-primary">{t("templates.reassurance.titleHighlight")}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {t("templates.reassurance.description")}
              </p>
              
              <StaggerChildren className="grid sm:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
                {reassuranceItems.map((item) => (
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
                          <span className="font-medium">{item.label}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
              
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-reassurance-pricing">
                    {t("common.buttons.viewPlans")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-templates-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("templates.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("templates.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-templates-cta-start">
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
                      data-testid="button-templates-cta-pricing"
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
                    <span>{t("templates.cta.features.0")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("templates.cta.features.1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("templates.cta.features.2")}</span>
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
