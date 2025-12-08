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
  TrendingUp,
  CreditCard,
  RefreshCw,
  Globe,
} from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n-context";

const eenmaligCosts = {
  threeYears: {
    development: { low: 3000, high: 10000, key: "development" },
    hosting: { low: 300, high: 900, key: "hosting" },
    domain: { low: 30, high: 60, key: "domain" },
    ssl: { low: 0, high: 300, key: "ssl" },
    maintenance: { low: 600, high: 5400, key: "maintenance" },
    updates: { low: 0, high: 2000, key: "updates" },
    fixes: { low: 0, high: 1500, key: "fixes" },
  },
};

const calculateTotal = (costs: typeof eenmaligCosts.threeYears, type: "low" | "high") => {
  return Object.values(costs).reduce((sum, cost) => sum + cost[type], 0);
};

function generateComparisonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Website Abonnement vs Eenmalige Website Vergelijking",
    "description": "Vergelijk de totale kosten van een website abonnement met een eenmalige website over 3 jaar",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Website Abonnement",
          "description": "Maandelijks abonnement inclusief design, hosting, onderhoud en support"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Eenmalige Website",
          "description": "Grote eenmalige investering plus doorlopende onderhoudskosten"
        }
      ]
    }
  };
}

export default function VergelijkEenmaligPage() {
  const { t } = useTranslation();
  const comparisonSchema = generateComparisonSchema();

  const comparisonFeatures = [
    {
      feature: t("compare.eenmalig.features.items.upfront.feature"),
      eenmalig: t("compare.eenmalig.features.items.upfront.onetime"),
      abonnement: t("compare.eenmalig.features.items.upfront.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.eenmalig.features.items.monthly.feature"),
      eenmalig: t("compare.eenmalig.features.items.monthly.onetime"),
      abonnement: t("compare.eenmalig.features.items.monthly.subscription"),
      advantage: "draw",
    },
    {
      feature: t("compare.eenmalig.features.items.maintenanceIncluded.feature"),
      eenmalig: t("compare.eenmalig.features.items.maintenanceIncluded.onetime"),
      abonnement: t("compare.eenmalig.features.items.maintenanceIncluded.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.eenmalig.features.items.updates.feature"),
      eenmalig: t("compare.eenmalig.features.items.updates.onetime"),
      abonnement: t("compare.eenmalig.features.items.updates.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.eenmalig.features.items.adjustments.feature"),
      eenmalig: t("compare.eenmalig.features.items.adjustments.onetime"),
      abonnement: t("compare.eenmalig.features.items.adjustments.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.eenmalig.features.items.cashflow.feature"),
      eenmalig: t("compare.eenmalig.features.items.cashflow.onetime"),
      abonnement: t("compare.eenmalig.features.items.cashflow.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.eenmalig.features.items.ownership.feature"),
      eenmalig: t("compare.eenmalig.features.items.ownership.onetime"),
      abonnement: t("compare.eenmalig.features.items.ownership.subscription"),
      advantage: "eenmalig",
    },
    {
      feature: t("compare.eenmalig.features.items.vendorFlex.feature"),
      eenmalig: t("compare.eenmalig.features.items.vendorFlex.onetime"),
      abonnement: t("compare.eenmalig.features.items.vendorFlex.subscription"),
      advantage: "eenmalig",
    },
    {
      feature: t("compare.eenmalig.features.items.outdatedRisk.feature"),
      eenmalig: t("compare.eenmalig.features.items.outdatedRisk.onetime"),
      abonnement: t("compare.eenmalig.features.items.outdatedRisk.subscription"),
      advantage: "abonnement",
    },
  ];

  const scenarios = [
    {
      name: t("compare.eenmalig.scenarios.budget.name"),
      description: t("compare.eenmalig.scenarios.budget.description"),
      eenmalig: 3930,
      abonnement: 3564,
      difference: -366,
    },
    {
      name: t("compare.eenmalig.scenarios.average.name"),
      description: t("compare.eenmalig.scenarios.average.description"),
      eenmalig: 7500,
      abonnement: 3564,
      difference: -3936,
    },
    {
      name: t("compare.eenmalig.scenarios.premium.name"),
      description: t("compare.eenmalig.scenarios.premium.description"),
      eenmalig: 20160,
      abonnement: 7164,
      difference: -12996,
    },
  ];

  const costItems = t("compare.eenmalig.costs.items") as unknown as Record<string, string>;
  
  useSEO({
    title: t("compare.eenmalig.seo.title"),
    description: t("compare.eenmalig.seo.description"),
    canonical: "/vergelijk/eenmalig",
  });

  useEffect(() => {
    const existingSchema = document.querySelector('script[data-schema="comparison-eenmalig"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'comparison-eenmalig');
    script.textContent = JSON.stringify(comparisonSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-schema="comparison-eenmalig"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  const eenmaligLowTotal = calculateTotal(eenmaligCosts.threeYears, "low");
  const eenmaligHighTotal = calculateTotal(eenmaligCosts.threeYears, "high");

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[50vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-eenmalig-hero"
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
              { label: t("compare.eenmalig.hero.breadcrumb") }
            ]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <CreditCard className="h-4 w-4 text-primary" />
                {t("compare.eenmalig.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-eenmalig-hero-title"
              >
                {t("compare.eenmalig.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("compare.eenmalig.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("compare.eenmalig.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-eenmalig-costs">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("compare.eenmalig.costs.badge")}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.eenmalig.costs.title")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t("compare.eenmalig.costs.description")}
                </p>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeInUp delay={0.1}>
                <Card className="border-2 border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <CardTitle>{t("compare.eenmalig.costs.onetime")}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t("compare.eenmalig.costs.traditional")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(eenmaligCosts.threeYears).map(([key, cost]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
                          <span className="text-sm text-muted-foreground">{costItems[cost.key]}</span>
                          <span className="font-medium">
                            €{cost.low.toLocaleString("nl-NL")} - €{cost.high.toLocaleString("nl-NL")}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">{t("compare.eenmalig.costs.total3Years")}</span>
                        <span className="text-xl font-bold text-red-600 dark:text-red-400">
                          €{eenmaligLowTotal.toLocaleString("nl-NL")} - €{eenmaligHighTotal.toLocaleString("nl-NL")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">{t("compare.eenmalig.costs.warning.title")}</p>
                          <p className="text-amber-700 dark:text-amber-300">
                            {t("compare.eenmalig.costs.warning.description")}
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
                        <RefreshCw className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{t("compare.eenmalig.costs.subscription")}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t("compare.eenmalig.costs.continuousService")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.eenmalig.costs.subscriptionItems.starter")}</span>
                        <span className="font-medium">€3.564</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.eenmalig.costs.subscriptionItems.professional")}</span>
                        <span className="font-medium">€7.164</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.eenmalig.costs.subscriptionItems.noUpfront")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">€0</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.eenmalig.costs.subscriptionItems.continuousUpdates")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.eenmalig.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.eenmalig.costs.subscriptionItems.noRedesign")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.eenmalig.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">{t("compare.eenmalig.costs.total3Years")}</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          €3.564 - €7.164
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-green-800 dark:text-green-200 mb-1">{t("compare.eenmalig.costs.improvement.title")}</p>
                          <p className="text-green-700 dark:text-green-300">
                            {t("compare.eenmalig.costs.improvement.description")}
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

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-eenmalig-scenarios">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.eenmalig.scenarios.title")}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t("compare.eenmalig.scenarios.description")}
                </p>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-3 gap-6">
              {scenarios.map((scenario, i) => (
                <FadeInUp key={i} delay={0.1 * i}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t("compare.eenmalig.scenarios.onetimeWebsite")}</p>
                          <p className="text-xl font-bold text-red-600 dark:text-red-400">
                            €{scenario.eenmalig.toLocaleString("nl-NL")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t("compare.eenmalig.scenarios.websiteSubscription")}</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            €{scenario.abonnement.toLocaleString("nl-NL")}
                          </p>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-1">{t("compare.eenmalig.scenarios.youSave")}</p>
                          <p className="text-2xl font-bold text-primary">
                            €{Math.abs(scenario.difference).toLocaleString("nl-NL")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-eenmalig-features">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.eenmalig.features.title")}
                </h2>
              </div>
            </FadeInUp>

            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="table-eenmalig-comparison">
                      <thead>
                        <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left p-4 font-semibold">Feature</th>
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-600" />
                              {t("compare.eenmalig.costs.onetime")}
                            </div>
                          </th>
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2 text-primary">
                              <Check className="h-4 w-4" />
                              {t("compare.eenmalig.costs.subscription")}
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
                                {row.advantage === "eenmalig" ? (
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                ) : row.advantage === "draw" ? (
                                  <div className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-sm text-muted-foreground">{row.eenmalig}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-start gap-2">
                                {row.advantage === "abonnement" || row.advantage === "draw" ? (
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

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-eenmalig-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("compare.eenmalig.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("compare.eenmalig.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-eenmalig-pricing">
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
