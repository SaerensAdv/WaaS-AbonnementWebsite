import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { useTranslation } from "@/lib/i18n-context";
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

const benefitIcons = [Coffee, Clock, Shield, TrendingUp, Users, Headphones];
const benefitKeys = [
  "noTechnicalKnowledge",
  "saveTime",
  "alwaysUpToDate",
  "measurableGrowth",
  "personalSpecialist",
  "alwaysReachable",
];

const howItWorksIcons = [MessageSquare, Rocket, FileCheck, BarChart3];

export default function HomePage() {
  const { t, language } = useTranslation();

  const testimonials = [
    {
      name: "Jan de Vries",
      initials: "JV",
      company: language === "nl" ? "De Vries Bouw" : "De Vries Construction",
      role: language === "nl" ? "Directeur" : "Director",
      text: t("home.testimonials.0.text"),
      rating: 5,
    },
    {
      name: "Sarah Jansen",
      initials: "SJ",
      company: "Jansen Consulting",
      role: "CEO",
      text: t("home.testimonials.1.text"),
      rating: 5,
    },
    {
      name: "Mohammed El-Amin",
      initials: "ME",
      company: "El-Amin Logistics",
      role: language === "nl" ? "Eigenaar" : "Owner",
      text: t("home.testimonials.2.text"),
      rating: 5,
    },
  ];
  
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
    title: t("home.seo.title"),
    description: t("home.seo.description"),
    canonical: "/",
    structuredData: homeStructuredData,
  });

  const includedServices = [
    t("home.valueProp.services.0"),
    t("home.valueProp.services.1"),
    t("home.valueProp.services.2"),
    t("home.valueProp.services.3"),
    t("home.valueProp.services.4"),
    t("home.valueProp.services.5"),
    t("home.valueProp.services.6"),
    t("home.valueProp.services.7"),
  ];

  const resultFeatures = [
    { icon: Target, label: t("home.results.features.0") },
    { icon: TrendingUp, label: t("home.results.features.1") },
    { icon: Award, label: t("home.results.features.2") },
    { icon: FileCheck, label: language === "nl" ? "Maandelijkse rapportages" : "Monthly reports" },
  ];

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
                {t("home.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white mb-8" 
                data-testid="text-hero-title"
              >
                {t("home.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("home.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                {t("home.hero.description")}
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-view-plans">
                      {t("common.buttons.viewPlans")}
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
                      {t("common.buttons.viewExamples")}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeInUp>
            
            <FadeIn delay={0.4}>
              <PartnerBadge className="mb-4" />
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-150 hover:text-white" data-testid="link-hero-tools">
                <BarChart3 className="h-4 w-4" />
                {t("common.meta.poweredBy")}
                <ChevronRight className="h-4 w-4" />
              </Link>
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
                      <div className="text-sm text-muted-foreground">{t("home.floatingCards.avgGrowth")}</div>
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
                      <div className="text-sm text-muted-foreground">{t("home.floatingCards.happyCustomers")}</div>
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
              {t("common.trust.trustedBy")}
            </p>
            <TrustLogos />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" staggerDelay={0.15}>
            {["happyCustomers", "uptime", "avgGrowth", "responseTime"].map((statKey, index) => (
              <StaggerItem key={statKey}>
                <motion.div 
                  className="text-center"
                  data-testid={`stat-${index}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono tabular-nums bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
                    {t(`home.stats.${statKey}.value`)}
                  </div>
                  <div className="text-lg font-medium mb-1">{t(`home.stats.${statKey}.label`)}</div>
                  <div className="text-sm text-muted-foreground">{t(`home.stats.${statKey}.description`)}</div>
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
                  {t("home.valueProp.badge")}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {t("home.valueProp.title")}
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {t("home.valueProp.description")}
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
                      {t("home.valueProp.buttonText")}
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
                {t("home.howItWorks.badge")}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("home.howItWorks.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("home.howItWorks.description")}
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={[0, 1, 2, 3].map((index) => {
              const IconComponent = howItWorksIcons[index];
              return (
                <motion.div 
                  key={index}
                  className="relative"
                  data-testid={`step-${index}`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-primary/10 mb-4 font-mono">
                      {t(`home.howItWorks.steps.${index}.step`)}
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{t(`home.howItWorks.steps.${index}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t(`home.howItWorks.steps.${index}.description`)}</p>
                  </div>
                </motion.div>
              );
            })}
          >
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
              {[0, 1, 2, 3].map((index) => {
                const IconComponent = howItWorksIcons[index];
                return (
                  <StaggerItem key={index}>
                    <motion.div 
                      className="relative"
                      data-testid={`step-${index}`}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {index < 3 && (
                        <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                      )}
                      <div className="relative z-10">
                        <div className="text-6xl font-bold text-primary/10 mb-4 font-mono">
                          {t(`home.howItWorks.steps.${index}.step`)}
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                          <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{t(`home.howItWorks.steps.${index}.title`)}</h3>
                        <p className="text-muted-foreground leading-relaxed">{t(`home.howItWorks.steps.${index}.description`)}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
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
                  {t("home.results.badge")}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  {t("home.results.title")}
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  {t("home.results.description")}
                </p>
                
                <StaggerChildren className="space-y-4 mb-8" staggerDelay={0.1}>
                  {resultFeatures.map((item) => (
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
                      {t("common.buttons.startToday")}
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
                {language === "nl" ? "Voordelen" : "Benefits"}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {language === "nl" ? "Waarom een website abonnement?" : "Why a website subscription?"}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === "nl" ? "Focus op uw bedrijf terwijl wij uw online aanwezigheid verzorgen" : "Focus on your business while we take care of your online presence"}
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={benefitKeys.map((key, index) => {
              const IconComponent = benefitIcons[index];
              return (
                <motion.div
                  key={key}
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
                        <IconComponent className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">{t(`home.benefits.${key}.title`)}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{t(`home.benefits.${key}.description`)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          >
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
              {benefitKeys.map((key, index) => {
                const IconComponent = benefitIcons[index];
                return (
                  <StaggerItem key={key}>
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
                            <IconComponent className="h-6 w-6 text-primary" />
                          </motion.div>
                          <h3 className="text-lg font-semibold mb-2">{t(`home.benefits.${key}.title`)}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{t(`home.benefits.${key}.description`)}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </MobileCarouselSection>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-testimonials">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                {language === "nl" ? "Ervaringen" : "Testimonials"}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {language === "nl" ? "Wat klanten zeggen" : "What customers say"}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === "nl" ? "Ondernemers die net als u kozen voor een zorgeloze website" : "Entrepreneurs who, like you, chose a worry-free website"}
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
                          {testimonial.role} {language === "nl" ? "bij" : "at"} {testimonial.company}
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
                              {testimonial.role} {language === "nl" ? "bij" : "at"} {testimonial.company}
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
              {language === "nl" ? "Veilig en eenvoudig betalen met" : "Safe and easy payment with"}
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
                {language === "nl" ? "Abonnementen" : "Subscriptions"}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {language === "nl" ? "Kies uw website abonnement" : "Choose your website subscription"}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === "nl" ? "Vaste maandprijs, alles inbegrepen. Geen opstartkosten, maandelijks opzegbaar." : "Fixed monthly price, everything included. No setup costs, cancel monthly."}
              </p>
            </div>
          </FadeInUp>

          <MobileCarouselSection
            mobileChildren={[
              <motion.div key="starter" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="border bg-card h-full" data-testid="pricing-low">
                  <CardContent className="p-8">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("pricing.planLabels.low")}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold font-mono">99</span>
                      <span className="text-muted-foreground">{t("pricing.planLabels.perMonth")}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8">{language === "nl" ? "Perfect voor starters" : "Perfect for starters"}</p>
                    <ul className="space-y-4 mb-8">
                      {(language === "nl" 
                        ? ["Professionele website", "5 pagina's", "SSL & hosting", "Maandelijkse updates", "E-mail support"]
                        : ["Professional website", "5 pages", "SSL & hosting", "Monthly updates", "Email support"]
                      ).map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full">{t("pricing.buttons.selectPlan")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>,
              <motion.div key="professional" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="border-2 border-primary bg-card relative h-full" data-testid="pricing-medium">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>{t("pricing.planLabels.popular")}</Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("pricing.planLabels.medium")}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-bold font-mono">199</span>
                      <span className="text-muted-foreground">{t("pricing.planLabels.perMonth")}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8">{language === "nl" ? "Voor groeiende bedrijven" : "For growing businesses"}</p>
                    <ul className="space-y-4 mb-8">
                      {(language === "nl"
                        ? ["Alles uit Starter", "Onbeperkt pagina's", "Persoonlijke specialist", "SEO optimalisatie", "Analytics dashboard", "Priority support"]
                        : ["Everything from Starter", "Unlimited pages", "Personal specialist", "SEO optimization", "Analytics dashboard", "Priority support"]
                      ).map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button className="w-full">{t("pricing.buttons.selectPlan")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>,
              <motion.div key="enterprise" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="border bg-card h-full" data-testid="pricing-high">
                  <CardContent className="p-8">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("pricing.planLabels.high")}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-bold">{t("pricing.planLabels.custom")}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-8">{language === "nl" ? "Complete ontzorging" : "Complete peace of mind"}</p>
                    <ul className="space-y-4 mb-8">
                      {(language === "nl"
                        ? ["Alles uit Professional", "Custom design", "Google & Meta Ads", "Dedicated account manager", "SLA garantie", "Wekelijkse rapportage"]
                        : ["Everything from Professional", "Custom design", "Google & Meta Ads", "Dedicated account manager", "SLA guarantee", "Weekly reporting"]
                      ).map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full">{t("common.buttons.contactUs")}</Button>
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
                      <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("pricing.planLabels.low")}</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-5xl font-bold font-mono">99</span>
                        <span className="text-muted-foreground">{t("pricing.planLabels.perMonth")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-8">{language === "nl" ? "Perfect voor starters" : "Perfect for starters"}</p>
                      <ul className="space-y-4 mb-8">
                        {(language === "nl" 
                          ? ["Professionele website", "5 pagina's", "SSL & hosting", "Maandelijkse updates", "E-mail support"]
                          : ["Professional website", "5 pages", "SSL & hosting", "Monthly updates", "Email support"]
                        ).map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing">
                        <Button variant="outline" className="w-full">{t("pricing.buttons.selectPlan")}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="border-2 border-primary bg-card relative h-full" data-testid="pricing-medium">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>{t("pricing.planLabels.popular")}</Badge>
                    </div>
                    <CardContent className="p-8">
                      <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("pricing.planLabels.medium")}</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-5xl font-bold font-mono">199</span>
                        <span className="text-muted-foreground">{t("pricing.planLabels.perMonth")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-8">{language === "nl" ? "Voor groeiende bedrijven" : "For growing businesses"}</p>
                      <ul className="space-y-4 mb-8">
                        {(language === "nl"
                          ? ["Alles uit Starter", "Onbeperkt pagina's", "Persoonlijke specialist", "SEO optimalisatie", "Analytics dashboard", "Priority support"]
                          : ["Everything from Starter", "Unlimited pages", "Personal specialist", "SEO optimization", "Analytics dashboard", "Priority support"]
                        ).map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing">
                        <Button className="w-full">{t("pricing.buttons.selectPlan")}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="border bg-card h-full" data-testid="pricing-high">
                    <CardContent className="p-8">
                      <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("pricing.planLabels.high")}</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-4xl font-bold">{t("pricing.planLabels.custom")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-8">{language === "nl" ? "Complete ontzorging" : "Complete peace of mind"}</p>
                      <ul className="space-y-4 mb-8">
                        {(language === "nl"
                          ? ["Alles uit Professional", "Custom design", "Google & Meta Ads", "Dedicated account manager", "SLA garantie", "Wekelijkse rapportage"]
                          : ["Everything from Professional", "Custom design", "Google & Meta Ads", "Dedicated account manager", "SLA guarantee", "Weekly reporting"]
                        ).map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pricing">
                        <Button variant="outline" className="w-full">{t("common.buttons.contactUs")}</Button>
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
              {t("home.cta.title")}
            </h2>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("home.cta.description")}
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
                    className="bg-white/5 border-white/20 text-white h-14 px-10 text-lg backdrop-blur-sm"
                    data-testid="button-cta-pricing"
                  >
                    {t("common.buttons.viewPlans")}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </MarketingLayout>
  );
}
