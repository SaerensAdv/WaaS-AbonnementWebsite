import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
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
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Clock,
  Euro,
  Shield,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { SiWordpress } from "react-icons/si";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n-context";

const wordPressCosts = {
  threeYears: {
    hosting: { low: 180, high: 900, key: "hosting" },
    domain: { low: 30, high: 60, key: "domain" },
    theme: { low: 0, high: 200, key: "theme" },
    plugins: { low: 0, high: 500, key: "plugins" },
    design: { low: 0, high: 5000, key: "design" },
    maintenance: { low: 0, high: 5400, key: "maintenance" },
    security: { low: 0, high: 300, key: "security" },
    backup: { low: 0, high: 300, key: "backup" },
  },
};

const calculateTotal = (costs: typeof wordPressCosts.threeYears, type: "low" | "high") => {
  return Object.values(costs).reduce((sum, cost) => sum + cost[type], 0);
};

function generateComparisonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Website Abonnement vs WordPress Vergelijking",
    "description": "Gedetailleerde kostenvergelijking tussen een website abonnement en WordPress over 3 jaar",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Website Abonnement",
          "description": "All-in-one website oplossing vanaf €99/maand inclusief design, hosting, onderhoud en support"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "WordPress Website",
          "description": "Zelf-gehoste WordPress website met aparte kosten voor hosting, onderhoud, beveiliging en design"
        }
      ]
    }
  };
}

export default function VergelijkWordPressPage() {
  const { t } = useTranslation();
  const comparisonSchema = generateComparisonSchema();

  const comparisonFeatures = [
    {
      feature: t("compare.wordpress.features.items.design.feature"),
      wordpress: t("compare.wordpress.features.items.design.wordpress"),
      abonnement: t("compare.wordpress.features.items.design.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.hosting.feature"),
      wordpress: t("compare.wordpress.features.items.hosting.wordpress"),
      abonnement: t("compare.wordpress.features.items.hosting.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.ssl.feature"),
      wordpress: t("compare.wordpress.features.items.ssl.wordpress"),
      abonnement: t("compare.wordpress.features.items.ssl.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.maintenance.feature"),
      wordpress: t("compare.wordpress.features.items.maintenance.wordpress"),
      abonnement: t("compare.wordpress.features.items.maintenance.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.security.feature"),
      wordpress: t("compare.wordpress.features.items.security.wordpress"),
      abonnement: t("compare.wordpress.features.items.security.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.backups.feature"),
      wordpress: t("compare.wordpress.features.items.backups.wordpress"),
      abonnement: t("compare.wordpress.features.items.backups.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.support.feature"),
      wordpress: t("compare.wordpress.features.items.support.wordpress"),
      abonnement: t("compare.wordpress.features.items.support.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wordpress.features.items.flexibility.feature"),
      wordpress: t("compare.wordpress.features.items.flexibility.wordpress"),
      abonnement: t("compare.wordpress.features.items.flexibility.subscription"),
      advantage: "wordpress",
    },
    {
      feature: t("compare.wordpress.features.items.ownership.feature"),
      wordpress: t("compare.wordpress.features.items.ownership.wordpress"),
      abonnement: t("compare.wordpress.features.items.ownership.subscription"),
      advantage: "wordpress",
    },
  ];
  
  useSEO({
    title: t("compare.wordpress.seo.title"),
    description: t("compare.wordpress.seo.description"),
    canonical: "/vergelijk/wordpress",
  });

  useEffect(() => {
    const existingSchema = document.querySelector('script[data-schema="comparison-wordpress"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'comparison-wordpress');
    script.textContent = JSON.stringify(comparisonSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-schema="comparison-wordpress"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  const wpLowTotal = calculateTotal(wordPressCosts.threeYears, "low");
  const wpHighTotal = calculateTotal(wordPressCosts.threeYears, "high");

  const wpItems = t("compare.wordpress.costs.items") as unknown as Record<string, string>;
  const whenWordpressItems = t("compare.wordpress.when.wordpress.items") as unknown as string[];
  const whenSubscriptionItems = t("compare.wordpress.when.subscription.items") as unknown as string[];

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[50vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-wordpress-hero"
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
            items={[
              { label: t("compare.breadcrumb"), href: "/vergelijk" },
              { label: t("compare.wordpress.hero.breadcrumb") }
            ]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <SiWordpress className="h-4 w-4 text-[#21759b]" />
                {t("compare.wordpress.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-wordpress-hero-title"
              >
                {t("compare.wordpress.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("compare.wordpress.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("compare.wordpress.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-wordpress-costs">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("compare.wordpress.costs.badge")}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.wordpress.costs.title")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t("compare.wordpress.costs.description")}
                </p>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeInUp delay={0.1}>
                <Card className="border-2 border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <SiWordpress className="h-6 w-6 text-[#21759b]" />
                      </div>
                      <div>
                        <CardTitle>{t("compare.wordpress.costs.wordpress")}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t("compare.wordpress.costs.selfManaged")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(wordPressCosts.threeYears).map(([key, cost]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
                          <span className="text-sm text-muted-foreground">{wpItems[cost.key]}</span>
                          <span className="font-medium">
                            €{cost.low.toLocaleString("nl-NL")} - €{cost.high.toLocaleString("nl-NL")}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">{t("compare.wordpress.costs.total3Years")}</span>
                        <span className="text-xl font-bold text-red-600 dark:text-red-400">
                          €{wpLowTotal.toLocaleString("nl-NL")} - €{wpHighTotal.toLocaleString("nl-NL")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">{t("compare.wordpress.costs.warning.title")}</p>
                          <p className="text-amber-700 dark:text-amber-300">
                            {t("compare.wordpress.costs.warning.description")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <Card className="border-2 border-primary">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{t("compare.wordpress.costs.subscription")}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t("compare.wordpress.costs.weDoAll")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.wordpress.costs.subscriptionItems.starter")}</span>
                        <span className="font-medium">€3.564</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.wordpress.costs.subscriptionItems.professional")}</span>
                        <span className="font-medium">€7.164</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.wordpress.costs.subscriptionItems.design")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.wordpress.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.wordpress.costs.subscriptionItems.hosting")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.wordpress.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.wordpress.costs.subscriptionItems.maintenance")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.wordpress.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.wordpress.costs.subscriptionItems.support")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.wordpress.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">{t("compare.wordpress.costs.total3Years")}</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          €3.564 - €7.164
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-green-800 dark:text-green-200 mb-1">{t("compare.wordpress.costs.allIncluded.title")}</p>
                          <p className="text-green-700 dark:text-green-300">
                            {t("compare.wordpress.costs.allIncluded.description")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-wordpress-features">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.wordpress.features.title")}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t("compare.wordpress.features.description")}
                </p>
              </div>
            </FadeInUp>

            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="table-wordpress-comparison">
                      <thead>
                        <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left p-4 font-semibold">Feature</th>
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2">
                              <SiWordpress className="h-4 w-4 text-[#21759b]" />
                              {t("compare.wordpress.costs.wordpress")}
                            </div>
                          </th>
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2 text-primary">
                              <Check className="h-4 w-4" />
                              {t("compare.wordpress.costs.subscription")}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonFeatures.map((row, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="p-4 font-medium">{row.feature}</td>
                            <td className="p-4">
                              <div className="flex items-start gap-2">
                                {row.advantage === "wordpress" ? (
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-sm text-muted-foreground">{row.wordpress}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-start gap-2">
                                {row.advantage === "abonnement" ? (
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-sm text-muted-foreground">{row.abonnement}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-wordpress-when">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.wordpress.when.title")}
                </h2>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-8">
              <FadeInUp delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SiWordpress className="h-5 w-5 text-[#21759b]" />
                      {t("compare.wordpress.when.wordpress.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {whenWordpressItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Check className="h-5 w-5" />
                      {t("compare.wordpress.when.subscription.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {whenSubscriptionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-wordpress-cta">
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
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-wordpress-pricing">
                      {t("compare.cta.viewPlans")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/vergelijk">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                    >
                      {t("compare.cta.moreComparisons")}
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
