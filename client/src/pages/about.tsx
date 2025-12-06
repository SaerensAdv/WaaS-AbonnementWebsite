import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  FadeIn,
  SlideIn,
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
  CreditCard,
  HeartHandshake,
  UserCheck,
  TrendingUp,
  Globe,
  Shield,
  Wrench,
  BarChart3,
  MessageSquare,
  Rocket,
  FileCheck,
  RefreshCw,
  Play,
} from "lucide-react";

const whyUs = [
  {
    icon: CreditCard,
    title: "Geen grote eenmalige facturen",
    description: "Voorspelbare maandelijkse kosten zonder verrassingen of hoge opstartkosten.",
  },
  {
    icon: HeartHandshake,
    title: "Geen stress over updates of problemen",
    description: "Wij zorgen voor alle technische zaken, zodat u zich nergens zorgen over hoeft te maken.",
  },
  {
    icon: UserCheck,
    title: "Altijd iemand die het opvolgt",
    description: "Een vaste specialist die uw bedrijf begrijpt en uw website actief beheert.",
  },
  {
    icon: TrendingUp,
    title: "Elke maand beter",
    description: "Sneller, duidelijker, meer resultaat. Wij blijven continu verbeteren.",
  },
];

const promises = [
  {
    icon: Globe,
    label: "Een professionele website",
  },
  {
    icon: Shield,
    label: "Onderhoud en veiligheid",
  },
  {
    icon: Wrench,
    label: "Aanpassingen wanneer nodig",
  },
  {
    icon: BarChart3,
    label: "Heldere rapportage met wat telt",
  },
];

const howWeWork = [
  {
    step: "01",
    icon: MessageSquare,
    title: "U vertelt wat u doet",
    description: "Een kort gesprek over uw bedrijf, wensen en doelen.",
  },
  {
    step: "02",
    icon: Rocket,
    title: "Wij bouwen uw website",
    description: "Ons team ontwerpt en bouwt alles voor u op maat.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "U keurt goed",
    description: "Bekijk het resultaat en geef feedback tot u tevreden bent.",
  },
  {
    step: "04",
    icon: RefreshCw,
    title: "Wij blijven verbeteren",
    description: "Uw website wordt elke maand sneller en beter.",
  },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[80vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-about-hero"
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
        
        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Wij doen alles, u geniet van de resultaten
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-about-hero-title"
              >
                Online aanwezig
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">zonder gedoe</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                U wilt online aanwezig zijn zonder gedoe. Daarom bouwen, beheren en verbeteren wij uw website alsof het onze eigen zaak is.
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-about-pricing">
                      Bekijk abonnementen
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/templates">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                      data-testid="button-about-templates"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Bekijk voorbeelden
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-why-us">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Waarom wij?
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Waarom abonnement.website?
              </h2>
              <p className="text-xl text-muted-foreground">
                Focus op uw bedrijf, wij regelen de rest
              </p>
            </div>
          </FadeInUp>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
            {whyUs.map((item, index) => (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="border bg-card h-full"
                    data-testid={`card-why-${index}`}
                  >
                    <CardContent className="p-6">
                      <motion.div 
                        className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-promise">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <SlideIn direction="left">
              <div>
                <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                  Onze belofte
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Zorgeloos online,
                  <br />
                  <span className="text-primary">elke dag opnieuw</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Wij nemen alle zorgen uit handen zodat u kunt focussen op wat u het beste doet: uw bedrijf runnen.
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <StaggerChildren className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
                {promises.map((promise, index) => (
                  <StaggerItem key={promise.label}>
                    <motion.div
                      whileHover={{ y: -2, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border bg-card" data-testid={`card-promise-${index}`}>
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <promise.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex items-center min-h-[40px]">
                              <span className="font-medium">{promise.label}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </SlideIn>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-how-we-work">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Hoe wij werken
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Simpel en transparant
              </h2>
              <p className="text-xl text-muted-foreground">
                In 4 stappen naar een website die voor u werkt
              </p>
            </div>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
            {howWeWork.map((item, index) => (
              <StaggerItem key={item.step}>
                <motion.div 
                  className="relative"
                  data-testid={`step-about-${index}`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {index < howWeWork.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-primary/10 mb-4 font-mono">
                      {item.step}
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Klaar om te starten?
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Laat de techniek aan ons over. U focust op uw klanten, wij zorgen voor uw professionele website.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-cta-start">
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
                      data-testid="button-cta-pricing"
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
                    <span>SSL Beveiligd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Persoonlijke support</span>
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
