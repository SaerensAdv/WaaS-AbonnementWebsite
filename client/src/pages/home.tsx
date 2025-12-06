import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { DashboardMockup, TrustLogos, PaymentMethods, PartnerBadge } from "@/components/dashboard-mockup";
import { MobileCarouselSection } from "@/components/mobile-carousel";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  FadeIn,
  ScaleIn,
  SlideIn,
  StaggerChildren,
  StaggerItem,
  Parallax,
  Float,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  Globe,
  Zap,
  Shield,
  BarChart3,
  Users,
  Headphones,
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  Clock,
  Activity,
  Sparkles,
  Play,
  ChevronRight,
  Target,
  Coffee,
  FileCheck,
  MessageSquare,
  Rocket,
  Heart,
  Award,
} from "lucide-react";

const benefits = [
  {
    icon: Coffee,
    title: "Geen technische kennis nodig",
    description: "U hoeft geen verstand van websites te hebben. Wij regelen alles van A tot Z.",
  },
  {
    icon: Clock,
    title: "Bespaar uren tijd",
    description: "Geen gedoe met hosting, updates of onderhoud. Besteed uw tijd aan uw bedrijf.",
  },
  {
    icon: Shield,
    title: "Altijd up-to-date & veilig",
    description: "SSL, backups, updates en beveiliging worden automatisch door ons geregeld.",
  },
  {
    icon: TrendingUp,
    title: "Meetbare groei",
    description: "Bekijk uw resultaten in een helder dashboard. Meer bezoekers, meer klanten.",
  },
  {
    icon: Users,
    title: "Persoonlijke specialist",
    description: "Een vaste specialist die uw bedrijf begrijpt en voor optimale resultaten zorgt.",
  },
  {
    icon: Headphones,
    title: "Altijd bereikbaar",
    description: "Vragen of wijzigingen? Wij staan voor u klaar met snelle, persoonlijke support.",
  },
];

const stats = [
  { value: "500+", label: "Tevreden klanten", description: "Zorgeloos online" },
  { value: "99.9%", label: "Uptime garantie", description: "Altijd bereikbaar" },
  { value: "127%", label: "Gem. groei", description: "Meer bezoekers" },
  { value: "<48u", label: "Reactietijd", description: "Snelle support" },
];

const howItWorks = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Vertel over uw bedrijf",
    description: "Een kort gesprek over uw wensen, doelgroep en doelen. Wij luisteren en adviseren.",
  },
  {
    step: "02",
    icon: Rocket,
    title: "Wij bouwen alles voor u",
    description: "Ons team ontwerpt en bouwt uw complete website. U hoeft niets te doen.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "U keurt goed",
    description: "Bekijk het resultaat en geef feedback. Wij passen aan tot u 100% tevreden bent.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Bekijk uw resultaten",
    description: "Uw website is live! Volg uw bezoekers en groei via uw persoonlijke dashboard.",
  },
];

const testimonials = [
  {
    name: "Jan de Vries",
    initials: "JV",
    company: "De Vries Bouw",
    role: "Directeur",
    text: "Eindelijk een partij die alles uit handen neemt. Ik hoef me nergens zorgen over te maken en de resultaten zijn fantastisch!",
    rating: 5,
  },
  {
    name: "Sarah Jansen",
    initials: "SJ",
    company: "Jansen Consulting",
    role: "CEO",
    text: "Als ondernemer heb ik geen tijd voor technische zaken. Dit team regelt alles en ik zie alleen maar groei in mijn dashboard.",
    rating: 5,
  },
  {
    name: "Mohammed El-Amin",
    initials: "ME",
    company: "El-Amin Logistics",
    role: "Eigenaar",
    text: "Transparante prijzen, geen verrassingen, en een website waar ik trots op ben. Eindelijk de juiste partner gevonden.",
    rating: 5,
  },
];

const includedServices = [
  "Professioneel website ontwerp",
  "Hosting & domein beheer",
  "SSL beveiliging",
  "Maandelijkse updates",
  "Content aanpassingen",
  "Performance monitoring",
  "Cookie banner (ConsentEase.io)",
  "Maandelijkse rapportage",
];

export default function HomePage() {
  const totalRatings = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = totalRatings / testimonials.length;
  
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Wat kost een website abonnement?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Onze website abonnementen starten vanaf €99 per maand. Dit is inclusief professioneel ontwerp, hosting, SSL beveiliging, maandelijkse updates en persoonlijke support."
            }
          },
          {
            "@type": "Question",
            "name": "Moet ik technische kennis hebben?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nee, u hoeft geen technische kennis te hebben. Wij regelen alles van A tot Z: ontwerp, hosting, updates, beveiliging en onderhoud. U focust op uw bedrijf, wij zorgen voor uw website."
            }
          },
          {
            "@type": "Question",
            "name": "Hoe snel is mijn website online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Na een kort kennismakingsgesprek bouwen wij uw website binnen 2-4 weken. U keurt het ontwerp goed en daarna gaat uw website direct live."
            }
          },
          {
            "@type": "Question",
            "name": "Wat is het verschil tussen een website abonnement en een eenmalige website?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bij een website abonnement betaalt u een vast maandbedrag en is alles inbegrepen: ontwerp, hosting, onderhoud, updates en support. Bij een eenmalige website betaalt u een grote som vooraf en komen hosting, onderhoud en updates daar nog bovenop."
            }
          },
          {
            "@type": "Question",
            "name": "Kan ik mijn website abonnement opzeggen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, u kunt uw website abonnement maandelijks opzeggen. Er is geen lange contractduur of opzegboete. U betaalt alleen voor de maanden dat u gebruik maakt van onze diensten."
            }
          },
          {
            "@type": "Question",
            "name": "Is een website abonnement geschikt voor mijn bedrijf?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Een website abonnement is ideaal voor ondernemers en MKB-bedrijven die een professionele website willen zonder technisch gedoe. Of u nu een ZZP'er, lokale dienstverlener of groeiend bedrijf bent - wij hebben een passend abonnement."
            }
          }
        ]
      },
      {
        "@type": "Organization",
        "name": "Abonnement.Website",
        "url": "https://abonnement.website",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": averageRating.toFixed(1),
          "reviewCount": testimonials.length,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": testimonials.map((testimonial) => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": testimonial.name
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": testimonial.rating,
            "bestRating": "5",
            "worstRating": "1"
          },
          "reviewBody": testimonial.text
        }))
      }
    ]
  };

  useSEO({
    title: "Website Abonnement vanaf €99/maand",
    description: "Website abonnement met design, hosting en support inbegrepen. Geen technische kennis nodig. Maandelijks opzegbaar. Start vandaag.",
    canonical: "/",
    structuredData: homeStructuredData,
  });

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[100vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-hero"
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
        
        <div className="container mx-auto px-4 relative z-10 pt-24 pb-20">
          <div className="max-w-5xl mx-auto text-center mb-16">
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
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white mb-8" 
                data-testid="text-hero-title"
              >
                Website abonnement
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">zonder zorgen</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                Professioneel ontwerp, hosting, onderhoud en support - alles inbegrepen in één vast maandbedrag. 
                Geen technische kennis nodig. Wij regelen alles, u focust op uw bedrijf.
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-view-plans">
                      Bekijk abonnementen
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/projecten">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                      data-testid="button-view-examples"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Bekijk voorbeelden
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeInUp>
            
            <FadeIn delay={0.4}>
              <PartnerBadge className="mb-0" />
            </FadeIn>
          </div>
          
          <ScaleIn delay={0.3}>
            <div className="relative max-w-5xl mx-auto">
              <GlowPulse className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-3xl rounded-3xl opacity-50" />
              <DashboardMockup variant="dashboard" className="relative" />
              
              <Float duration={5} distance={8} delay={0}>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Gem. groei klanten</div>
                      <div className="text-2xl font-bold font-mono">+127%</div>
                    </div>
                  </div>
                </div>
              </Float>
              
              <Float duration={5} distance={8} delay={1}>
                <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tevreden klanten</div>
                      <div className="text-2xl font-bold font-mono">500+</div>
                    </div>
                  </div>
                </div>
              </Float>
            </div>
          </ScaleIn>
        </div>
      </section>

      <section className="py-16 border-b" data-testid="section-trust">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Vertrouwd door 500+ ondernemers in heel België
            </p>
            <TrustLogos />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" staggerDelay={0.15}>
            {stats.map((stat, index) => (
              <StaggerItem key={stat.label}>
                <motion.div 
                  className="text-center"
                  data-testid={`stat-${index}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono tabular-nums bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-value-prop">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SlideIn direction="left">
              <div>
                <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                  Alles inbegrepen
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Wat zit er in uw website abonnement?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Bij ons website abonnement is alles inbegrepen: ontwerp, hosting, onderhoud en support. 
                  Geen verborgen kosten, geen technisch gedoe. Wij regelen alles voor u.
                </p>
                
                <StaggerChildren className="grid sm:grid-cols-2 gap-4 mb-8" staggerDelay={0.05}>
                  {includedServices.map((service) => (
                    <StaggerItem key={service}>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">{service}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/pricing">
                    <Button size="lg" className="gap-2">
                      Bekijk wat u krijgt
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <Parallax speed={0.2}>
                <div className="relative">
                  <GlowPulse className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl rounded-3xl opacity-50" />
                  <DashboardMockup variant="timeline" className="relative" />
                </div>
              </Parallax>
            </SlideIn>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Hoe het werkt
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Uw website abonnement in 4 stappen
              </h2>
              <p className="text-xl text-muted-foreground">
                Van aanvraag tot live website - wij begeleiden u bij elke stap.
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={howItWorks.map((item, index) => (
              <motion.div 
                key={item.step}
                className="relative"
                data-testid={`step-${index}`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
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
            ))}
          >
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
              {howItWorks.map((item, index) => (
                <StaggerItem key={item.step}>
                  <motion.div 
                    className="relative"
                    data-testid={`step-${index}`}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index < howItWorks.length - 1 && (
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
          </MobileCarouselSection>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-results">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SlideIn direction="left" className="order-2 lg:order-1">
              <Parallax speed={0.2}>
                <div className="relative">
                  <GlowPulse className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl opacity-50" />
                  <DashboardMockup variant="results" className="relative" />
                </div>
              </Parallax>
            </SlideIn>
            
            <SlideIn direction="right" className="order-1 lg:order-2">
              <div>
                <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                  Uw Dashboard
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Volg uw resultaten in real-time
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Bij elk website abonnement krijgt u een persoonlijk dashboard. 
                  Bekijk bezoekers, leads en groei - alles overzichtelijk op één plek.
                </p>
                
                <StaggerChildren className="space-y-4 mb-8" staggerDelay={0.1}>
                  {[
                    { icon: Target, label: "Real-time bezoekersstatistieken" },
                    { icon: TrendingUp, label: "Groei en conversie tracking" },
                    { icon: Award, label: "SEO score en ranking" },
                    { icon: FileCheck, label: "Maandelijkse rapportages" },
                  ].map((item) => (
                    <StaggerItem key={item.label}>
                      <div className="flex items-center gap-3 text-slate-200">
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/pricing">
                    <Button size="lg" className="gap-2">
                      Start vandaag
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-benefits">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Voordelen
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Waarom een website abonnement?
              </h2>
              <p className="text-xl text-muted-foreground">
                Focus op uw bedrijf terwijl wij uw online aanwezigheid verzorgen
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border bg-card h-full"
                  data-testid={`benefit-card-${index}`}
                >
                  <CardContent className="p-6">
                    <motion.div 
                      className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          >
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              {benefits.map((benefit, index) => (
                <StaggerItem key={benefit.title}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="border bg-card h-full"
                      data-testid={`benefit-card-${index}`}
                    >
                      <CardContent className="p-6">
                        <motion.div 
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <benefit.icon className="h-6 w-6 text-primary" />
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </MobileCarouselSection>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-testimonials">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Ervaringen
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Wat klanten zeggen
              </h2>
              <p className="text-xl text-muted-foreground">
                Ondernemers die net als u kozen voor een zorgeloze website
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border bg-card h-full"
                  data-testid={`testimonial-card-${index}`}
                >
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i, duration: 0.2 }}
                        >
                          <Star className="h-5 w-5 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-lg leading-relaxed mb-8">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} bij {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          >
            <StaggerChildren className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
              {testimonials.map((testimonial, index) => (
                <StaggerItem key={testimonial.name}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="border bg-card h-full"
                      data-testid={`testimonial-card-${index}`}
                    >
                      <CardContent className="p-8">
                        <div className="flex gap-1 mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * i, duration: 0.2 }}
                            >
                              <Star className="h-5 w-5 fill-primary text-primary" />
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-lg leading-relaxed mb-8">
                          "{testimonial.text}"
                        </p>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {testimonial.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {testimonial.role} bij {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </MobileCarouselSection>
        </div>
      </section>

      <section className="py-16 border-y" data-testid="section-payments">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Veilig en eenvoudig betalen met
            </p>
            <PaymentMethods />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-pricing-preview">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Abonnementen
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Kies uw website abonnement
              </h2>
              <p className="text-xl text-muted-foreground">
                Vaste maandprijs, alles inbegrepen. Geen opstartkosten, maandelijks opzegbaar.
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={[
              <motion.div key="starter" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="border bg-card h-full" data-testid="pricing-low">
                  <CardContent className="p-8">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Starter</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold font-mono">99</span>
                      <span className="text-muted-foreground">/maand</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8">Perfect voor starters</p>
                    <ul className="space-y-4 mb-8">
                      {["Professionele website", "5 pagina's", "SSL & hosting", "Maandelijkse updates", "E-mail support"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full">Selecteer</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>,
              <motion.div key="professional" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="border-2 border-primary bg-card relative h-full" data-testid="pricing-medium">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Meest gekozen</Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Professional</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold font-mono">199</span>
                      <span className="text-muted-foreground">/maand</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8">Voor groeiende bedrijven</p>
                    <ul className="space-y-4 mb-8">
                      {["Alles uit Starter", "Onbeperkt pagina's", "Persoonlijke specialist", "SEO optimalisatie", "Analytics dashboard", "Priority support"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button className="w-full">Selecteer</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>,
              <motion.div key="enterprise" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="border bg-card h-full" data-testid="pricing-high">
                  <CardContent className="p-8">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Enterprise</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-bold">Op maat</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8">Complete ontzorging</p>
                    <ul className="space-y-4 mb-8">
                      {["Alles uit Professional", "Custom design", "Google & Meta Ads", "Dedicated account manager", "SLA garantie", "Wekelijkse rapportage"].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full">Neem contact op</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ]}
          >
            <StaggerChildren className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" staggerDelay={0.15}>
              <StaggerItem>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="border bg-card h-full" data-testid="pricing-low">
                    <CardContent className="p-8">
                      <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Starter</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-5xl font-bold font-mono">99</span>
                        <span className="text-muted-foreground">/maand</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-8">Perfect voor starters</p>
                      <ul className="space-y-4 mb-8">
                        {["Professionele website", "5 pagina's", "SSL & hosting", "Maandelijkse updates", "E-mail support"].map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing">
                        <Button variant="outline" className="w-full">Selecteer</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="border-2 border-primary bg-card relative h-full" data-testid="pricing-medium">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Meest gekozen</Badge>
                    </div>
                    <CardContent className="p-8">
                      <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Professional</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-5xl font-bold font-mono">199</span>
                        <span className="text-muted-foreground">/maand</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-8">Voor groeiende bedrijven</p>
                      <ul className="space-y-4 mb-8">
                        {["Alles uit Starter", "Onbeperkt pagina's", "Persoonlijke specialist", "SEO optimalisatie", "Analytics dashboard", "Priority support"].map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing">
                        <Button className="w-full">Selecteer</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="border bg-card h-full" data-testid="pricing-high">
                    <CardContent className="p-8">
                      <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Enterprise</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-4xl font-bold">Op maat</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-8">Complete ontzorging</p>
                      <ul className="space-y-4 mb-8">
                        {["Alles uit Professional", "Custom design", "Google & Meta Ads", "Dedicated account manager", "SLA garantie", "Wekelijkse rapportage"].map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing">
                        <Button variant="outline" className="w-full">Neem contact op</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            </StaggerChildren>
          </MobileCarouselSection>
        </div>
      </section>

      <section 
        className="py-32 md:py-40 relative overflow-hidden"
        data-testid="section-cta"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white">
              Klaar om te starten?
            </h2>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Uw professionele website, vaste maandprijs, geen zorgen. 
              Laat de techniek aan ons over en focus op wat u het beste doet.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="gap-2 text-lg h-14 px-10" 
                    data-testid="button-cta-signup"
                  >
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
                    className="bg-white/5 border-white/20 text-white h-14 px-10 text-lg backdrop-blur-sm"
                    data-testid="button-cta-pricing"
                  >
                    Bekijk abonnementen
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeInUp>
          
          <FadeIn delay={0.3}>
            <div className="flex items-center justify-center gap-8 mt-16 text-slate-400 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>SSL Beveiligd</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Persoonlijke support</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-8">
              Uw privacy is gewaarborgd volgens de{" "}
              <a 
                href="https://autoriteitpersoonsgegevens.nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-external-ap"
              >
                Autoriteit Persoonsgegevens
              </a>{" "}
              richtlijnen.
            </p>
          </FadeIn>
        </div>
      </section>
    </MarketingLayout>
  );
}
