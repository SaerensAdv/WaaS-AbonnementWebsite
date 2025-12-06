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

const whatWeCollect = [
  {
    icon: User,
    title: "Accountgegevens",
    description: "Naam en e-mailadres",
  },
  {
    icon: CreditCard,
    title: "Facturatiegegevens",
    description: "Via onze betaalpartner",
  },
  {
    icon: Settings,
    title: "Website-instellingen",
    description: "En contactaanvragen",
  },
  {
    icon: BarChart3,
    title: "Basis gebruiksdata",
    description: "Om de dienst te verbeteren",
  },
];

const whyWeCollect = [
  {
    icon: Globe,
    text: "Om uw website te bouwen en te beheren",
  },
  {
    icon: Wallet,
    text: "Om betalingen en abonnementen te verwerken",
  },
  {
    icon: Headphones,
    text: "Om support te kunnen geven",
  },
  {
    icon: ShieldCheck,
    text: "Om veiligheid te garanderen",
  },
];

const thirdParties = [
  {
    icon: CreditCard,
    name: "Betaling",
  },
  {
    icon: Mail,
    name: "E-mail",
  },
  {
    icon: Server,
    name: "Hosting",
  },
];

export default function PrivacyPage() {
  const lastUpdated = "6 december 2024";

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[40vh] flex items-center overflow-hidden pt-[72px]"
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
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Helder en eerlijk
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-privacy-hero-title"
              >
                Privacy Policy
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Wij gebruiken uw gegevens alleen om onze dienst te leveren en u correct te helpen. Punt.
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
                  Gegevens
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Wat we bijhouden
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
              {whatWeCollect.map((item) => (
                <StaggerItem key={item.title}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card" data-testid={`card-collect-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-primary" />
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

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-why-we-collect">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  Doel
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Waarom
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="space-y-3" staggerDelay={0.1}>
              {whyWeCollect.map((item, index) => (
                <StaggerItem key={item.text}>
                  <motion.div 
                    className="flex items-center gap-4 p-4 rounded-lg bg-card border"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    data-testid={`item-why-${index}`}
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

      <section className="py-16 md:py-24" data-testid="section-third-parties">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  Derden
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Delen met derden
                </h2>
                <p className="text-muted-foreground">
                  Alleen partijen die nodig zijn om de dienst te leveren. Nooit voor "zomaar marketing".
                </p>
              </div>
            </FadeInUp>

            <StaggerChildren className="flex flex-wrap gap-4" staggerDelay={0.1}>
              {thirdParties.map((party) => (
                <StaggerItem key={party.name}>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card" data-testid={`card-party-${party.name.toLowerCase()}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <party.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{party.name}</span>
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
                      <h2 className="text-2xl font-bold mb-2">Uw rechten</h2>
                      <p className="text-muted-foreground">
                        Inzage, aanpassing of verwijdering van uw gegevens
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Wilt u weten welke gegevens we van u hebben, iets aanpassen of laten verwijderen? Neem dan contact met ons op via het contactformulier.
                  </p>
                  
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="gap-2" data-testid="button-contact-privacy">
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
              <p className="text-center text-sm text-muted-foreground mt-8" data-testid="text-last-updated">
                Laatst bijgewerkt: {lastUpdated}
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
