import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
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
  Sparkles,
  ChevronRight,
  Cookie,
  Settings,
  BarChart3,
  Target,
  CheckCircle2,
  Shield,
  Eye,
} from "lucide-react";

const cookieTypes = [
  {
    icon: Settings,
    title: "Functioneel",
    subtitle: "Nodig",
    description: "Deze cookies zijn noodzakelijk om de website correct te laten werken. Zonder deze cookies werkt de site niet naar behoren.",
    required: true,
  },
  {
    icon: BarChart3,
    title: "Analytics",
    subtitle: "Inzichten",
    description: "Met deze cookies meten we hoe bezoekers de website gebruiken, zodat we de ervaring kunnen verbeteren.",
    required: false,
  },
  {
    icon: Target,
    title: "Marketing",
    subtitle: "Alleen met toestemming",
    description: "Deze cookies worden alleen geplaatst als u daar expliciet toestemming voor geeft. Ze helpen bij het tonen van relevante advertenties.",
    required: false,
  },
];

export default function CookiesPage() {
  useSEO({
    title: "Cookiebeleid",
    description: "Ons cookiebeleid uitgelegd. Welke cookies we gebruiken, waarvoor, en hoe u uw voorkeuren kunt beheren. Transparant en AVG-compliant.",
    canonical: "/cookies",
  });

  const lastUpdated = "6 december 2024";

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[40vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-cookies-hero"
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
                Transparant
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-cookies-hero-title"
              >
                Cookiebeleid
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Wij gebruiken cookies om de website goed te laten werken en om prestaties te meten. Marketingcookies alleen na uw keuze.
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-cookie-types">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <div className="mb-12">
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  <Cookie className="h-3 w-3 mr-1" />
                  Soorten
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Soorten cookies
                </h2>
              </div>
            </FadeInUp>

            <StaggerChildren className="space-y-4" staggerDelay={0.15}>
              {cookieTypes.map((cookie) => (
                <StaggerItem key={cookie.title}>
                  <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Card className="border bg-card" data-testid={`card-cookie-${cookie.title.toLowerCase()}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            cookie.required 
                              ? 'bg-green-500/10' 
                              : 'bg-primary/10'
                          }`}>
                            <cookie.icon className={`h-6 w-6 ${
                              cookie.required 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-primary'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold">{cookie.title}</h3>
                              <Badge 
                                variant={cookie.required ? "default" : "secondary"} 
                                className="text-xs no-default-hover-elevate no-default-active-elevate"
                              >
                                {cookie.subtitle}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{cookie.description}</p>
                          </div>
                          {cookie.required && (
                            <div className="flex-shrink-0 hidden sm:block">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                          )}
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

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50" data-testid="section-cookie-management">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <Card className="border bg-card">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Beheren</h2>
                      <p className="text-muted-foreground">
                        U kan uw cookie-voorkeuren altijd aanpassen. Wij respecteren uw keuze en slaan alleen de cookies op waarvoor u toestemming heeft gegeven.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="gap-2" data-testid="button-cookie-settings">
                        <Settings className="h-4 w-4" />
                        Cookie-instellingen
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <Card className="border bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Veilig opgeslagen</h3>
                        <p className="text-sm text-muted-foreground">Uw voorkeuren worden lokaal bewaard</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Altijd transparant</h3>
                        <p className="text-sm text-muted-foreground">Geen verborgen tracking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="text-center text-sm text-muted-foreground mt-8" data-testid="text-cookies-last-updated">
                Laatst bijgewerkt: {lastUpdated}
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
