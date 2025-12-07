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

const comparisonFeatures = [
  {
    feature: "Wie doet het werk?",
    wix: "U zelf - ontwerp, teksten, onderhoud",
    abonnement: "Wij doen alles voor u",
    advantage: "abonnement",
  },
  {
    feature: "Professioneel design",
    wix: "Sjabloon - zelf aanpassen",
    abonnement: "Op maat door designers",
    advantage: "abonnement",
  },
  {
    feature: "Maandelijkse prijs",
    wix: "€17-€35/maand (Core-Business)",
    abonnement: "€99-€199/maand (alles inbegrepen)",
    advantage: "draw",
  },
  {
    feature: "Uw tijdsinvestering",
    wix: "40+ uur opzetten, 2-4 uur/maand onderhoud",
    abonnement: "0 uur - wij doen het",
    advantage: "abonnement",
  },
  {
    feature: "SEO-optimalisatie",
    wix: "Basis - zelf instellen",
    abonnement: "Professioneel ingesteld",
    advantage: "abonnement",
  },
  {
    feature: "Ondersteuning",
    wix: "Helpcentrum, geen persoonlijke hulp",
    abonnement: "Persoonlijke support",
    advantage: "abonnement",
  },
  {
    feature: "Aanpassingen",
    wix: "Zelf doen in editor",
    abonnement: "Vraag aan en wij passen aan",
    advantage: "abonnement",
  },
  {
    feature: "Wix-advertenties",
    wix: "Alleen weg bij betaald plan",
    abonnement: "Nooit advertenties",
    advantage: "abonnement",
  },
  {
    feature: "Flexibiliteit",
    wix: "Beperkt tot Wix-functies",
    abonnement: "Maatwerk mogelijk",
    advantage: "abonnement",
  },
];

const wixCosts = {
  yearly: {
    light: { price: 17, name: "Light", description: "Geen betalingen, 2GB opslag" },
    core: { price: 29, name: "Core", description: "Betalingen, 50GB opslag" },
    business: { price: 36, name: "Business", description: "E-commerce, 100GB" },
  },
  hidden: [
    { item: "Apps uit App Market", cost: "€0-€30+/maand per app" },
    { item: "Premium functies", cost: "€5-€50/maand extra" },
    { item: "Domeinnaam na jaar 1", cost: "€10-€45/jaar" },
    { item: "E-mail hosting", cost: "€5-€15/maand" },
  ],
};

const timeInvestment = {
  initial: {
    hours: 40,
    tasks: [
      "Sjabloon kiezen en aanpassen",
      "Alle teksten schrijven",
      "Afbeeldingen zoeken en plaatsen",
      "Menu en pagina's structureren",
      "Formulieren instellen",
      "SEO basis instellen",
      "Mobiele versie controleren",
    ],
  },
  monthly: {
    hours: 3,
    tasks: [
      "Content updates",
      "Kleine aanpassingen",
      "Statistieken bekijken",
      "Problemen oplossen",
    ],
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
  const comparisonSchema = generateComparisonSchema();
  const hourlyRate = 50;
  
  useSEO({
    title: "Website Abonnement vs Wix - Zelf Doen of Laten Doen? 2025",
    description: "Vergelijk Wix met een website abonnement. Hoeveel tijd kost Wix echt? Tel uw uren bij de prijs op en ontdek wat voordeliger is.",
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
  const timeValueInitial = timeInvestment.initial.hours * hourlyRate;
  const timeValueMonthly = timeInvestment.monthly.hours * hourlyRate * 12;
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
              { label: "Vergelijken", href: "/vergelijk" },
              { label: "vs Wix" }
            ]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <SiWix className="h-4 w-4 text-[#0C6EFC]" />
                Zelf doen vs laten doen
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-wix-hero-title"
              >
                Website Abonnement
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">vs Wix</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Wix lijkt goedkoop, maar hoeveel is uw tijd waard? 
                Tel de uren erbij op.
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
                  De verborgen kost: uw tijd
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Hoeveel uur kost Wix echt?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Wix is doe-het-zelf. Dat betekent dat u alles zelf doet.
                </p>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeInUp delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Opzetten: {timeInvestment.initial.hours}+ uur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {timeInvestment.initial.tasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <p className="text-sm">
                        <span className="font-medium">Waarde van uw tijd:</span>{" "}
                        <span className="text-primary font-semibold">€{timeValueInitial.toLocaleString("nl-NL")}</span>
                        <span className="text-muted-foreground"> (à €{hourlyRate}/uur)</span>
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
                      Maandelijks: {timeInvestment.monthly.hours} uur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {timeInvestment.monthly.tasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <p className="text-sm">
                        <span className="font-medium">Waarde per jaar:</span>{" "}
                        <span className="text-primary font-semibold">€{timeValueMonthly.toLocaleString("nl-NL")}</span>
                        <span className="text-muted-foreground"> ({timeInvestment.monthly.hours} × 12 × €{hourlyRate})</span>
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
                  Totale kosten over 3 jaar
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
                        <CardTitle>Wix Core</CardTitle>
                        <p className="text-sm text-muted-foreground">Zelf doen</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">Wix Core (€29/mnd × 36)</span>
                        <span className="font-medium">€{(wixCosts.yearly.core.price * 36).toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">Opzetten (40 uur × €50)</span>
                        <span className="font-medium">€{timeValueInitial.toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">Onderhoud (3 uur/mnd × 36 × €50)</span>
                        <span className="font-medium">€{(timeValueMonthly * 3).toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">Totaal 3 jaar</span>
                        <span className="text-xl font-bold text-red-600 dark:text-red-400">
                          €{wixTotal3Years.toLocaleString("nl-NL")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Plus verborgen kosten</p>
                          <ul className="text-amber-700 dark:text-amber-300 space-y-1">
                            {wixCosts.hidden.slice(0, 2).map((item, i) => (
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
                        <CardTitle>Website Abonnement</CardTitle>
                        <p className="text-sm text-muted-foreground">Wij doen alles</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">Starter (€99/mnd × 36)</span>
                        <span className="font-medium">€3.564</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Professioneel maatwerk design
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Inbegrepen</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Uw tijd: 0 uur
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">€0</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t-2">
                        <span className="font-semibold">Totaal 3 jaar</span>
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
                            U bespaart: €{(wixTotal3Years - 3564).toLocaleString("nl-NL")}
                          </p>
                          <p className="text-green-700 dark:text-green-300">
                            Plus {timeInvestment.initial.hours + (timeInvestment.monthly.hours * 36)} uur van uw tijd
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
                  Feature vergelijking
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
                              Website Abonnement
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
                Uw tijd is waardevol
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Laat ons uw website bouwen en onderhouden.
                Focus op wat u het beste kunt: uw bedrijf runnen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-wix-pricing">
                      Bekijk abonnementen
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
                      Meer vergelijkingen
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
