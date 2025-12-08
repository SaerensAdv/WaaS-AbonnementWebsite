import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  StaggerChildren,
  StaggerItem,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Scale,
  Check,
  X,
} from "lucide-react";
import { SiWordpress, SiWix } from "react-icons/si";
import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";

export default function VergelijkOverviewPage() {
  const { t } = useTranslation();

  const comparisons = [
    {
      id: "wordpress",
      title: t("compare.comparisons.wordpress.title"),
      subtitle: t("compare.comparisons.wordpress.subtitle"),
      description: t("compare.comparisons.wordpress.description"),
      icon: SiWordpress,
      highlights: [
        { label: t("compare.comparisons.wordpress.wpTotal"), value: "€4.200 - €8.000+", type: "negative" },
        { label: t("compare.comparisons.wordpress.subTotal"), value: "€3.564 - €7.164", type: "positive" },
      ],
      href: "/vergelijk/wordpress",
      color: "text-[#21759b]",
    },
    {
      id: "wix",
      title: t("compare.comparisons.wix.title"),
      subtitle: t("compare.comparisons.wix.subtitle"),
      description: t("compare.comparisons.wix.description"),
      icon: SiWix,
      highlights: [
        { label: t("compare.comparisons.wix.wixTotal"), value: "€2.800 - €4.500/jaar", type: "negative" },
        { label: t("compare.comparisons.wix.subTotal"), value: "€1.188 - €2.388/jaar", type: "positive" },
      ],
      href: "/vergelijk/wix",
      color: "text-[#0C6EFC]",
    },
    {
      id: "eenmalig",
      title: t("compare.comparisons.onetime.title"),
      subtitle: t("compare.comparisons.onetime.subtitle"),
      description: t("compare.comparisons.onetime.description"),
      icon: Globe,
      highlights: [
        { label: t("compare.comparisons.onetime.onetimeTotal"), value: "€4.500 - €14.500", type: "negative" },
        { label: t("compare.comparisons.onetime.subTotal"), value: "€3.564 - €7.164", type: "positive" },
      ],
      href: "/vergelijk/eenmalig",
      color: "text-chart-3",
    },
  ];

  const benefits = t("compare.benefits.items") as unknown as string[];

  useSEO({
    title: t("compare.seo.title"),
    description: t("compare.seo.description"),
    canonical: "/vergelijk",
  });

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[60vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-vergelijk-hero"
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
            items={[{ label: t("compare.breadcrumb") }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <Scale className="h-4 w-4 text-primary" />
                {t("compare.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-vergelijk-hero-title"
              >
                {t("compare.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("compare.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("compare.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-vergelijk-options">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <StaggerChildren staggerDelay={0.1}>
              {comparisons.map((comparison) => (
                <StaggerItem key={comparison.id}>
                  <Link href={comparison.href}>
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                      <Card 
                        className="mb-6 hover-elevate cursor-pointer"
                        data-testid={`card-comparison-${comparison.id}`}
                      >
                        <CardContent className="p-6 md:p-8">
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-shrink-0">
                              <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <comparison.icon className={`h-8 w-8 ${comparison.color}`} />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h2 className="text-xl md:text-2xl font-semibold mb-1">
                                {comparison.title}
                              </h2>
                              <p className="text-sm text-primary font-medium mb-2">
                                {comparison.subtitle}
                              </p>
                              <p className="text-muted-foreground line-clamp-2">
                                {comparison.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-4 mt-4">
                                {comparison.highlights.map((highlight, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm">
                                    {highlight.type === "positive" ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <X className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="text-muted-foreground">{highlight.label}:</span>
                                    <span className={`font-medium ${highlight.type === "positive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                      {highlight.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <Button className="gap-2">
                                {t("compare.cta.viewPlans")}
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-vergelijk-benefits">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("compare.benefits.badge")}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.benefits.title")}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t("compare.benefits.description")}
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {benefits.map((benefit, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border"
                  >
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-vergelijk-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("compare.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("compare.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-vergelijk-pricing">
                      {t("compare.cta.viewPlans")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/faq">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                    >
                      {t("compare.cta.faq")}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </MarketingLayout>
  );
}
