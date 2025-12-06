import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
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
  Smartphone,
  Zap,
  Target,
  Layout,
  Star,
} from "lucide-react";

type FilterType = "all" | "starter" | "professional" | "popular";

const templates = [
  {
    id: "zakelijk-modern",
    title: "Strak & zakelijk",
    tier: "starter" as const,
    popular: true,
    features: [
      "Duidelijke diensten",
      "Sterke CTA",
      "Mobiel perfect",
    ],
    sectors: ["Consulting", "Zakelijke dienstverlening"],
  },
  {
    id: "warm-lokaal",
    title: "Warm & lokaal",
    tier: "starter" as const,
    popular: true,
    features: [
      "Persoonlijke uitstraling",
      "Lokale focus",
      "Vertrouwenwekkend",
    ],
    sectors: ["Horeca", "Retail", "Beauty"],
  },
  {
    id: "premium-service",
    title: "Premium service",
    tier: "professional" as const,
    popular: true,
    features: [
      "Luxe uitstraling",
      "Portfolio showcase",
      "Uitgebreide animaties",
    ],
    sectors: ["Automotive", "Vastgoed", "Luxe diensten"],
  },
  {
    id: "bouw-vakwerk",
    title: "Vakwerk & betrouwbaar",
    tier: "starter" as const,
    popular: false,
    features: [
      "Projecten showcase",
      "Contact formulier",
      "Snelle laadtijd",
    ],
    sectors: ["Bouw", "Installatie", "Techniek"],
  },
  {
    id: "zorg-vertrouwen",
    title: "Zorg & vertrouwen",
    tier: "professional" as const,
    popular: false,
    features: [
      "Rustige uitstraling",
      "Online afspraken",
      "Toegankelijk design",
    ],
    sectors: ["Zorg", "Fysiotherapie", "Coaching"],
  },
  {
    id: "creatief-portfolio",
    title: "Creatief & dynamisch",
    tier: "professional" as const,
    popular: true,
    features: [
      "Visueel portfolio",
      "Moderne animaties",
      "Uniek design",
    ],
    sectors: ["Creatieve sector", "Fotografie", "Design"],
  },
  {
    id: "restaurant-sfeer",
    title: "Sfeer & beleving",
    tier: "starter" as const,
    popular: false,
    features: [
      "Menu integratie",
      "Reserveringen",
      "Sfeerbeelden",
    ],
    sectors: ["Horeca", "Catering", "Events"],
  },
  {
    id: "groei-conversie",
    title: "Groei & conversie",
    tier: "professional" as const,
    popular: false,
    features: [
      "Lead generatie",
      "A/B test ready",
      "Analytics dashboard",
    ],
    sectors: ["Marketing", "E-commerce", "SaaS"],
  },
];

const filterOptions = [
  { id: "all" as const, label: "Alle stijlen", icon: Layout },
  { id: "starter" as const, label: "Starter websites", icon: Zap },
  { id: "professional" as const, label: "Professional websites", icon: Award },
  { id: "popular" as const, label: "Meest gekozen", icon: Star },
];

function TemplateCard({ template, index }: { template: typeof templates[0]; index: number }) {
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
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
            <div className="text-center p-6 relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layout className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Preview</p>
            </div>
            {template.popular && (
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                Populair
              </Badge>
            )}
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 no-default-hover-elevate no-default-active-elevate"
            >
              {template.tier === "starter" ? "Starter" : "Professional"}
            </Badge>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">{template.title}</h3>
            
            <ul className="space-y-2 mb-6">
              {template.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-1 mb-6">
              {template.sectors.slice(0, 2).map((sector) => (
                <Badge 
                  key={sector} 
                  variant="outline" 
                  className="text-xs no-default-hover-elevate no-default-active-elevate"
                >
                  {sector}
                </Badge>
              ))}
            </div>
            
            <Link href="/pricing">
              <Button className="w-full gap-2" data-testid={`button-select-${template.id}`}>
                Kies dit voorbeeld
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
  useSEO({
    title: "Website Templates",
    description: "Bekijk onze professionele website templates. Kies uit moderne ontwerpen voor zakelijke dienstverlening, retail, horeca en meer. Volledig aanpasbaar aan uw huisstijl.",
    canonical: "/templates",
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredTemplates = templates.filter((template) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "starter") return template.tier === "starter";
    if (activeFilter === "professional") return template.tier === "professional";
    if (activeFilter === "popular") return template.popular;
    return true;
  });

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[60vh] flex items-center overflow-hidden pt-[72px]"
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
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Professionele website voorbeelden
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-templates-hero-title"
              >
                Kies een stijl die
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">bij uw bedrijf past</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                Bekijk voorbeelden van websites die wij bouwen. Strak, snel en klaar om klanten op te leveren.
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-templates-start">
                    Start met een abonnement
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

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto" staggerDelay={0.1}>
            {filteredTemplates.map((template, index) => (
              <StaggerItem key={template.id}>
                <TemplateCard template={template} index={index} />
              </StaggerItem>
            ))}
          </StaggerChildren>

          {filteredTemplates.length === 0 && (
            <FadeIn>
              <div className="text-center py-16">
                <p className="text-muted-foreground">Geen templates gevonden voor deze filter.</p>
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
                Volledig op maat
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                U kiest een voorbeeld.
                <br />
                <span className="text-primary">Wij maken het van u.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Kleuren, logo, teksten en foto's passen we aan zodat het klopt met uw bedrijf. 
                Het resultaat is een unieke website die precies bij u past.
              </p>
              
              <StaggerChildren className="grid sm:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
                {[
                  { icon: Heart, label: "Uw huisstijl & kleuren" },
                  { icon: Briefcase, label: "Uw teksten & content" },
                  { icon: Target, label: "Uw doelen & resultaat" },
                ].map((item) => (
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
                    Bekijk abonnementen
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
                Klaar om te starten?
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Kies uw favoriete stijl en wij bouwen uw website binnen 10 werkdagen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-templates-cta-start">
                      Start vandaag
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
                      Bekijk abonnementen
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <FadeIn delay={0.3}>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Binnen 10 dagen live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>100% op maat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Geen opstartkosten</span>
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
