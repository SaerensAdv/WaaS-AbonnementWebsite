import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import { useTranslation } from "@/lib/i18n-context";
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

const whyUsIcons = [CreditCard, HeartHandshake, UserCheck, TrendingUp];
const promiseIcons = [Globe, Shield, Wrench, BarChart3];
const howWeWorkIcons = [MessageSquare, Rocket, FileCheck, RefreshCw];

export default function AboutPage() {
  const { t } = useTranslation();

  useSEO({
    title: t("about.seo.title"),
    description: t("about.seo.description"),
    canonical: "/about",
  });

  const whyUsReasons = [
    { icon: whyUsIcons[0], title: t("about.whyUs.reasons.0.title"), description: t("about.whyUs.reasons.0.description") },
    { icon: whyUsIcons[1], title: t("about.whyUs.reasons.1.title"), description: t("about.whyUs.reasons.1.description") },
    { icon: whyUsIcons[2], title: t("about.whyUs.reasons.2.title"), description: t("about.whyUs.reasons.2.description") },
    { icon: whyUsIcons[3], title: t("about.whyUs.reasons.3.title"), description: t("about.whyUs.reasons.3.description") },
  ];

  const promises = [
    { icon: promiseIcons[0], label: t("about.promise.items.0") },
    { icon: promiseIcons[1], label: t("about.promise.items.1") },
    { icon: promiseIcons[2], label: t("about.promise.items.2") },
    { icon: promiseIcons[3], label: t("about.promise.items.3") },
  ];

  const howWeWorkSteps = [
    { step: "01", icon: howWeWorkIcons[0], title: t("about.howWeWork.steps.0.title"), description: t("about.howWeWork.steps.0.description") },
    { step: "02", icon: howWeWorkIcons[1], title: t("about.howWeWork.steps.1.title"), description: t("about.howWeWork.steps.1.description") },
    { step: "03", icon: howWeWorkIcons[2], title: t("about.howWeWork.steps.2.title"), description: t("about.howWeWork.steps.2.description") },
    { step: "04", icon: howWeWorkIcons[3], title: t("about.howWeWork.steps.3.title"), description: t("about.howWeWork.steps.3.description") },
  ];

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[80vh] flex flex-col overflow-hidden pt-[72px]"
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
        
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <BreadcrumbNav 
            items={[{ label: t("common.nav.about") }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {t("about.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-about-hero-title"
              >
                {t("about.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("about.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                {t("about.hero.description")}
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-about-pricing">
                      {t("common.buttons.viewPlans")}
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
                      {t("common.buttons.viewExamples")}
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
                {t("about.whyUs.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t("about.whyUs.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("about.whyUs.description")}
              </p>
            </div>
          </FadeInUp>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto" staggerDelay={0.1}>
            {whyUsReasons.map((item, index) => (
              <StaggerItem key={index}>
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
                  {t("about.promise.badge")}
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {t("about.promise.title")}
                  <br />
                  <span className="text-primary">{t("about.promise.titleHighlight")}</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {t("about.promise.description")}{" "}
                  <a 
                    href="https://kbopub.economie.fgov.be" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    data-testid="link-external-kbo"
                  >
                    {t("about.promise.kboLink")}
                  </a>
                </p>
              </div>
            </SlideIn>
            
            <SlideIn direction="right">
              <StaggerChildren className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
                {promises.map((promise, index) => (
                  <StaggerItem key={index}>
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
                {t("about.howWeWork.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t("about.howWeWork.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("about.howWeWork.description")}
              </p>
            </div>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
            {howWeWorkSteps.map((item, index) => (
              <StaggerItem key={item.step}>
                <motion.div 
                  className="relative"
                  data-testid={`step-about-${index}`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {index < howWeWorkSteps.length - 1 && (
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
                {t("about.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("about.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-cta-start">
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
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                      data-testid="button-cta-pricing"
                    >
                      {t("common.buttons.viewPlans")}
                    </Button>
                  </motion.div>
                </Link>
              </div>
              
              <FadeIn delay={0.3}>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("common.trust.sslSecure")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("common.trust.uptime")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{t("common.trust.personalSupport")}</span>
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
