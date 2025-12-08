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
  Clock,
  AlertTriangle,
  TrendingUp,
  User,
} from "lucide-react";
import { SiWix } from "react-icons/si";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n-context";

const wixCosts = {
  yearly: {
    light: { price: 17, name: "Light", description: "Geen betalingen, 2GB opslag" },
    core: { price: 29, name: "Core", description: "Betalingen, 50GB opslag" },
    business: { price: 36, name: "Business", description: "E-commerce, 100GB" },
  },
};

const timeInvestmentData = {
  initial: {
    hours: 40,
  },
  monthly: {
    hours: 3,
  },
};

function generateComparisonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Website Abonnement vs Wix Vergelijking",
    "description": "Vergelijk een website abonnement met Wix. Inclusief tijdsinvestering en verborgen kosten.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Website Abonnement",
          "description": "Professionele website service waarbij experts alles voor u doen"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wix",
          "description": "Doe-het-zelf website bouwer met maandelijks abonnement"
        }
      ]
    }
  };
}

export default function VergelijkWixPage() {
  const { t } = useTranslation();
  const comparisonSchema = generateComparisonSchema();
  const hourlyRate = 50;

  const comparisonFeatures = [
    {
      feature: t("compare.wix.features.items.whoDoesWork.feature"),
      wix: t("compare.wix.features.items.whoDoesWork.wix"),
      abonnement: t("compare.wix.features.items.whoDoesWork.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.design.feature"),
      wix: t("compare.wix.features.items.design.wix"),
      abonnement: t("compare.wix.features.items.design.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.monthlyPrice.feature"),
      wix: t("compare.wix.features.items.monthlyPrice.wix"),
      abonnement: t("compare.wix.features.items.monthlyPrice.subscription"),
      advantage: "draw",
    },
    {
      feature: t("compare.wix.features.items.timeInvestment.feature"),
      wix: t("compare.wix.features.items.timeInvestment.wix"),
      abonnement: t("compare.wix.features.items.timeInvestment.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.seo.feature"),
      wix: t("compare.wix.features.items.seo.wix"),
      abonnement: t("compare.wix.features.items.seo.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.support.feature"),
      wix: t("compare.wix.features.items.support.wix"),
      abonnement: t("compare.wix.features.items.support.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.adjustments.feature"),
      wix: t("compare.wix.features.items.adjustments.wix"),
      abonnement: t("compare.wix.features.items.adjustments.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.ads.feature"),
      wix: t("compare.wix.features.items.ads.wix"),
      abonnement: t("compare.wix.features.items.ads.subscription"),
      advantage: "abonnement",
    },
    {
      feature: t("compare.wix.features.items.flexibility.feature"),
      wix: t("compare.wix.features.items.flexibility.wix"),
      abonnement: t("compare.wix.features.items.flexibility.subscription"),
      advantage: "abonnement",
    },
  ];

  const setupTasks = t("compare.wix.time.setup.tasks") as unknown as string[];
  const monthlyTasks = t("compare.wix.time.monthly.tasks") as unknown as string[];
  const hiddenCostItems = t("compare.wix.costs.hidden.items") as unknown as Array<{item: string; cost: string}>;
  
  useSEO({
    title: t("compare.wix.seo.title"),
    description: t("compare.wix.seo.description"),
    canonical: "/vergelijk/wix",
  });

  useEffect(() => {
    const existingSchema = document.querySelector('script[data-schema="comparison-wix"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'comparison-wix');
    script.textContent = JSON.stringify(comparisonSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-schema="comparison-wix"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  const wixYearlyCost = wixCosts.yearly.core.price * 12;
  const timeValueInitial = timeInvestmentData.initial.hours * hourlyRate;
  const timeValueMonthly = timeInvestmentData.monthly.hours * hourlyRate * 12;
  const wixTotalYear1 = wixYearlyCost + timeValueInitial + timeValueMonthly;
  const wixTotalYear2And3 = wixYearlyCost + timeValueMonthly;
  const wixTotal3Years = wixTotalYear1 + (wixTotalYear2And3 * 2);

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[50vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-wix-hero"
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
              { label: t("compare.wix.hero.breadcrumb") }
            ]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <SiWix className="h-4 w-4 text-[#0C6EFC]" />
                {t("compare.wix.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-wix-hero-title"
              >
                {t("compare.wix.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("compare.wix.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("compare.wix.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-wix-time">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("compare.wix.time.badge")}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.wix.time.title")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t("compare.wix.time.description")}
                </p>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeInUp delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {(t("compare.wix.time.setup.title") as string).replace("{hours}", String(timeInvestmentData.initial.hours))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {setupTasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <p className="text-sm">
                        <span className="font-medium">{t("compare.wix.time.setup.timeValue")}</span>{" "}
                        <span className="text-primary font-semibold">€{timeValueInitial.toLocaleString("nl-NL")}</span>
                        <span className="text-muted-foreground"> {(t("compare.wix.time.setup.hourlyRate") as string).replace("{rate}", String(hourlyRate))}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {(t("compare.wix.time.monthly.title") as string).replace("{hours}", String(timeInvestmentData.monthly.hours))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {monthlyTasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <p className="text-sm">
                        <span className="font-medium">{t("compare.wix.time.monthly.timeValue")}</span>{" "}
                        <span className="text-primary font-semibold">€{timeValueMonthly.toLocaleString("nl-NL")}</span>
                        <span className="text-muted-foreground"> {(t("compare.wix.time.monthly.calculation") as string).replace("{hours}", String(timeInvestmentData.monthly.hours)).replace("{rate}", String(hourlyRate))}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-wix-costs">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.wix.costs.title")}
                </h2>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-8">
              <FadeInUp delay={0.1}>
                <Card className="border-2 border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <SiWix className="h-6 w-6 text-[#0C6EFC]" />
                      </div>
                      <div>
                        <CardTitle>{t("compare.wix.costs.wix")}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t("compare.wix.costs.wixSelfDo")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.wix.costs.items.wixCore")}</span>
                        <span className="font-medium">€{(wixCosts.yearly.core.price * 36).toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.wix.costs.items.setup")}</span>
                        <span className="font-medium">€{timeValueInitial.toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.wix.costs.items.maintenance")}</span>
                        <span className="font-medium">€{(timeValueMonthly * 3).toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">{t("compare.wix.costs.total3Years")}</span>
                        <span className="text-xl font-bold text-red-600 dark:text-red-400">
                          €{wixTotal3Years.toLocaleString("nl-NL")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">{t("compare.wix.costs.hidden.title")}</p>
                          <ul className="text-amber-700 dark:text-amber-300 space-y-1">
                            {hiddenCostItems.slice(0, 2).map((item, i) => (
                              <li key={i}>{item.item}: {item.cost}</li>
                            ))}
                          </ul>
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
                        <CardTitle>{t("compare.wix.costs.subscription")}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t("compare.wix.costs.weDoAll")}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("compare.wix.costs.subscriptionItems.starter")}</span>
                        <span className="font-medium">€3.564</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.wix.costs.subscriptionItems.design")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t("compare.wix.costs.included")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {t("compare.wix.costs.subscriptionItems.time")}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">€0</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">{t("compare.wix.costs.total3Years")}</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          €3.564
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                            {(t("compare.wix.costs.savings.title") as string).replace("{amount}", (wixTotal3Years - 3564).toLocaleString("nl-NL"))}
                          </p>
                          <p className="text-green-700 dark:text-green-300">
                            {(t("compare.wix.costs.savings.time") as string).replace("{hours}", String(timeInvestmentData.initial.hours + (timeInvestmentData.monthly.hours * 36)))}
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

      <section className="py-16 md:py-24" data-testid="section-wix-features">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeInUp>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("compare.wix.features.title")}
                </h2>
              </div>
            </FadeInUp>

            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="table-wix-comparison">
                      <thead>
                        <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left p-4 font-semibold">Feature</th>
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2">
                              <SiWix className="h-4 w-4 text-[#0C6EFC]" />
                              Wix
                            </div>
                          </th>
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2 text-primary">
                              <Check className="h-4 w-4" />
                              {t("compare.wix.costs.subscription")}
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
                                {row.advantage === "wix" ? (
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                ) : row.advantage === "draw" ? (
                                  <div className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-sm text-muted-foreground">{row.wix}</span>
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

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-wix-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("compare.wix.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("compare.wix.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-wix-pricing">
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
