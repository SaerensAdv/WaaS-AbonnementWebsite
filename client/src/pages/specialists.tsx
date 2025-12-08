import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import { useTranslation } from "@/lib/i18n-context";
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
  Sparkles,
  ChevronRight,
  CreditCard,
  PlusCircle,
  UserCheck,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";

const howItWorksIcons = [CreditCard, PlusCircle, UserCheck, LayoutDashboard];

const placeholderSpecialists = [
  {
    id: "sarah-j",
    name: "Sarah J.",
    skills: ["Google Ads", "SEO", "Analytics"],
    focus: "B2B & Zakelijke dienstverlening",
    verified: true,
  },
  {
    id: "mark-v",
    name: "Mark V.",
    skills: ["Meta Ads", "Content", "E-commerce"],
    focus: "Retail & E-commerce",
    verified: true,
  },
  {
    id: "lisa-d",
    name: "Lisa D.",
    skills: ["SEO", "Local SEO", "Google Ads"],
    focus: "Lokale bedrijven",
    verified: true,
  },
];

export default function SpecialistsPage() {
  const { t } = useTranslation();

  useSEO({
    title: t("specialists.seo.title"),
    description: t("specialists.seo.description"),
    canonical: "/specialists",
  });

  const howItWorks = [
    { step: "01", icon: howItWorksIcons[0], title: t("specialists.howItWorks.steps.0.title"), description: t("specialists.howItWorks.steps.0.description") },
    { step: "02", icon: howItWorksIcons[1], title: t("specialists.howItWorks.steps.1.title"), description: t("specialists.howItWorks.steps.1.description") },
    { step: "03", icon: howItWorksIcons[2], title: t("specialists.howItWorks.steps.2.title"), description: t("specialists.howItWorks.steps.2.description") },
    { step: "04", icon: howItWorksIcons[3], title: t("specialists.howItWorks.steps.3.title"), description: t("specialists.howItWorks.steps.3.description") },
  ];

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[60vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-specialists-hero"
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
                {t("specialists.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-specialists-hero-title"
              >
                {t("specialists.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("specialists.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                {t("specialists.hero.description")}
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <Link href="/pricing">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-specialists-pricing">
                    {t("common.buttons.viewPlans")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </FadeInUp>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                {t("specialists.howItWorks.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t("specialists.howItWorks.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("specialists.howItWorks.description")}
              </p>
            </div>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
            {howItWorks.map((item, index) => (
              <StaggerItem key={item.step}>
                <motion.div 
                  className="relative"
                  data-testid={`step-specialist-${index}`}
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
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50" data-testid="section-specialists-cards">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                {t("specialists.team.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t("specialists.team.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("specialists.team.description")}
              </p>
            </div>
          </FadeInUp>

          <FadeIn>
            <div className="max-w-4xl mx-auto mb-12 p-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">{t("specialists.team.comingSoon.title")}</h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    {t("specialists.team.comingSoon.description")}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
            {placeholderSpecialists.map((specialist) => (
              <StaggerItem key={specialist.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="border bg-card opacity-75"
                    data-testid={`card-specialist-${specialist.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-semibold text-primary">
                              {specialist.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{specialist.name}</h3>
                            <p className="text-sm text-muted-foreground">{specialist.focus}</p>
                          </div>
                        </div>
                        {specialist.verified && (
                          <Badge variant="secondary" className="gap-1 flex-shrink-0 no-default-hover-elevate no-default-active-elevate">
                            <Shield className="h-3 w-3" />
                            {t("specialists.team.verified")}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {specialist.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="text-xs no-default-hover-elevate no-default-active-elevate"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-specialists-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 bg-white/10 text-white border-white/20 no-default-hover-elevate no-default-active-elevate">
                {t("specialists.cta.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("specialists.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("specialists.cta.description")}
              </p>
              
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-become-specialist">
                    {t("common.buttons.becomeSpecialist")}
                    <ArrowRight className="h-5 w-5" />
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
