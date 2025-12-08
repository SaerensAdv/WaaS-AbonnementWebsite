import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useSEO } from "@/hooks/use-seo";
import { useTranslation } from "@/lib/i18n-context";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
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
  User,
  CreditCard,
  Settings,
  BarChart3,
  Globe,
  Wallet,
  Headphones,
  ShieldCheck,
  Users,
  Mail,
  Server,
  MessageSquare,
} from "lucide-react";

const whatWeCollectIcons = [User, CreditCard, Settings, BarChart3];
const whyWeCollectIcons = [Globe, Wallet, Headphones, ShieldCheck];
const thirdPartiesIcons = [CreditCard, Mail, Server];

export default function PrivacyPage() {
  const { t } = useTranslation();

  useSEO({
    title: t("legal.privacy.seo.title"),
    description: t("legal.privacy.seo.description"),
    canonical: "/privacy",
  });

  const lastUpdated = "6 december 2024";

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[40vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-privacy-hero"
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
            items={[{ label: t("common.footer.privacy") }]} 
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
                {t("legal.privacy.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-privacy-hero-title"
              >
                {t("legal.privacy.hero.title")}
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {t("legal.privacy.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-what-we-collect">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("legal.privacy.whatWeCollect.badge")}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {t("legal.privacy.whatWeCollect.title")}
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
              {whatWeCollectIcons.map((Icon, index) => (
                <StaggerItem key={index}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card" data-testid={`card-collect-${index}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{t(`legal.privacy.whatWeCollect.items.${index}.title`)}</h3>
                            <p className="text-sm text-muted-foreground">{t(`legal.privacy.whatWeCollect.items.${index}.description`)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-why-we-collect">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("legal.privacy.whyWeCollect.badge")}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {t("legal.privacy.whyWeCollect.title")}
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="space-y-3" staggerDelay={0.1}>
              {whyWeCollectIcons.map((Icon, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="flex items-center gap-4 p-4 rounded-lg bg-card border"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    data-testid={`item-why-${index}`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{t(`legal.privacy.whyWeCollect.items.${index}`)}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-third-parties">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {t("legal.privacy.thirdParties.badge")}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {t("legal.privacy.thirdParties.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("legal.privacy.thirdParties.description")}
                </p>
              </div>
            </FadeInUp>

            <StaggerChildren className="flex flex-wrap gap-4" staggerDelay={0.1}>
              {thirdPartiesIcons.map((Icon, index) => (
                <StaggerItem key={index}>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card" data-testid={`card-party-${index}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{t(`legal.privacy.thirdParties.items.${index}`)}</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-your-rights">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <Card className="border bg-card">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{t("legal.privacy.yourRights.title")}</h2>
                      <p className="text-muted-foreground">
                        {t("legal.privacy.yourRights.description")}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {t("legal.privacy.yourRights.text")}
                  </p>
                  
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="gap-2" data-testid="button-contact-privacy">
                        <MessageSquare className="h-4 w-4" />
                        {t("legal.privacy.yourRights.buttonText")}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="text-center text-sm text-muted-foreground mt-8" data-testid="text-last-updated">
                {t("legal.privacy.lastUpdated")} {lastUpdated}
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
