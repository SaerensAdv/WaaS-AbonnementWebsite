import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
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
  FileText,
  CreditCard,
  Globe,
  Settings,
  Calendar,
  Server,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  AlertCircle,
  Clock,
  FileImage,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const corePoints = [
  {
    icon: CreditCard,
    text: "U betaalt maandelijks voor uw website-abonnement",
  },
  {
    icon: Globe,
    text: "Wij bouwen, beheren en onderhouden uw website",
  },
  {
    icon: Settings,
    text: "Wij doen aanpassingen volgens uw abonnement (en eventuele extra's)",
  },
  {
    icon: Calendar,
    text: "U kan maandelijks opzeggen (tenzij anders afgesproken)",
  },
];

const included = [
  {
    icon: Server,
    title: "Hosting",
    description: "Betrouwbare hosting inbegrepen",
  },
  {
    icon: RefreshCw,
    title: "Updates",
    description: "Software updates en patches",
  },
  {
    icon: ShieldCheck,
    title: "Beveiliging",
    description: "SSL en beveiligingsmaatregelen",
  },
  {
    icon: Settings,
    title: "Onderhoud",
    description: "Technisch onderhoud",
  },
  {
    icon: MessageSquare,
    title: "Ondersteuning",
    description: "Support volgens uw pakket",
  },
  {
    icon: BarChart3,
    title: "Rapportering",
    description: "Zoals in uw abonnement staat",
  },
];

const notIncluded = [
  {
    icon: AlertCircle,
    title: "Grote herwerkingen",
    description: "Buiten de afgesproken scope",
  },
  {
    icon: Clock,
    title: "Spoedwerk",
    description: "Buiten normale support",
  },
  {
    icon: FileImage,
    title: "Content aanleveren",
    description: "Teksten/foto's door u of als extra dienst",
  },
];

export default function TermsPage() {
  const lastUpdated = "6 december 2024";

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[40vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-terms-hero"
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
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Duidelijk en eerlijk
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-terms-hero-title"
              >
                Algemene Voorwaarden
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Geen kleine lettertjes. Gewoon helder wat we afspreken.
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-core-terms">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  <FileText className="h-3 w-3 mr-1" />
                  Kern
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  In mensentaal
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="space-y-3" staggerDelay={0.1}>
              {corePoints.map((item, index) => (
                <StaggerItem key={item.text}>
                  <motion.div 
                    className="flex items-center gap-4 p-4 rounded-lg bg-card border"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    data-testid={`item-core-${index}`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-included">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Inbegrepen
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Wat zit inbegrepen
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.1}>
              {included.map((item) => (
                <StaggerItem key={item.title}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card h-full" data-testid={`card-included-${item.title.toLowerCase()}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
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

      <section className="py-16 md:py-24" data-testid="section-not-included">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  <XCircle className="h-3 w-3 mr-1" />
                  Niet standaard
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Wat niet automatisch inbegrepen is
                </h2>
                <p className="text-muted-foreground">
                  Deze zaken kunnen wel, maar worden apart afgesproken.
                </p>
              </div>
            </FadeInUp>

            <StaggerChildren className="grid sm:grid-cols-3 gap-4" staggerDelay={0.1}>
              {notIncluded.map((item) => (
                <StaggerItem key={item.title}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card h-full" data-testid={`card-not-included-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
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

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-responsibility">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <Card className="border bg-card">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Verantwoordelijkheid</h2>
                      <p className="text-muted-foreground">
                        Wij doen ons best om alles stabiel en veilig te houden, maar externe partijen (hosting/betalingen) kunnen impact hebben. Wij werken alleen met betrouwbare partners om dit risico te minimaliseren.
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Heeft u vragen over deze voorwaarden? Neem gerust contact met ons op.
                  </p>
                  
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="gap-2" data-testid="button-contact-terms">
                        <MessageSquare className="h-4 w-4" />
                        Contacteer ons
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="text-center text-sm text-muted-foreground mt-8" data-testid="text-terms-last-updated">
                Laatst bijgewerkt: {lastUpdated}
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
