import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { ProductMockup } from "@/components/product-mockup";
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
  Quote,
  MousePointer,
  Palette,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Professionele Websites",
    description: "Kies uit hoogwaardige templates of laat een website op maat maken voor uw bedrijf. Geoptimaliseerd voor alle apparaten.",
  },
  {
    icon: Zap,
    title: "Snelle Levering",
    description: "Uw website is binnen enkele dagen live dankzij ons gestroomlijnde onboardingproces en ervaren team.",
  },
  {
    icon: Shield,
    title: "Beheerde Hosting",
    description: "SSL, updates, backups en beveiliging worden volledig door ons beheerd. U hoeft nergens over na te denken.",
  },
  {
    icon: BarChart3,
    title: "Growth Add-ons",
    description: "Voeg Google Ads, Meta Ads, SEO en content toe voor maximale groei en zichtbaarheid online.",
  },
  {
    icon: Users,
    title: "Expert Specialisten",
    description: "Gecertificeerde specialisten beheren uw advertenties en optimalisaties met bewezen resultaten.",
  },
  {
    icon: Headphones,
    title: "Premium Support",
    description: "Persoonlijke ondersteuning en maandelijkse rapportages over uw resultaten en verbeterpunten.",
  },
];

const stats = [
  { value: "500+", label: "Tevreden klanten" },
  { value: "99.9%", label: "Uptime garantie" },
  { value: "24/7", label: "Monitoring" },
  { value: "30+", label: "Expert specialisten" },
];

const trustIndicators = [
  { icon: Users, value: "500+", label: "klanten" },
  { icon: Activity, value: "99.9%", label: "uptime" },
  { icon: Clock, value: "24/7", label: "support" },
];

const howItWorks = [
  {
    step: 1,
    icon: MousePointer,
    title: "Kies uw plan",
    description: "Selecteer het abonnement dat het beste past bij uw behoeften en budget. Van starter tot enterprise.",
  },
  {
    step: 2,
    icon: Palette,
    title: "Wij bouwen uw website",
    description: "Ons team ontwerpt en bouwt uw professionele website binnen enkele dagen. U geeft alleen feedback.",
  },
  {
    step: 3,
    icon: TrendingUp,
    title: "Groei met add-ons",
    description: "Breid uit met Google Ads, SEO, content en meer. Schaal mee met uw groeiende bedrijf.",
  },
];

const testimonials = [
  {
    name: "Jan de Vries",
    initials: "JV",
    company: "De Vries Bouw",
    role: "Directeur",
    text: "Eindelijk een website waar ik me geen zorgen over hoef te maken. Het team zorgt voor alles en de resultaten zijn uitstekend!",
    rating: 5,
  },
  {
    name: "Sarah Jansen",
    initials: "SJ",
    company: "Jansen Consulting",
    role: "CEO",
    text: "De combinatie van een mooie website plus Google Ads beheer heeft ons bedrijf een enorme boost gegeven. Aanrader!",
    rating: 5,
  },
  {
    name: "Mohammed El-Amin",
    initials: "ME",
    company: "El-Amin Logistics",
    role: "Eigenaar",
    text: "Transparante prijzen, professionele service, en uitstekende resultaten. Na jaren zoeken eindelijk de juiste partner.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      <section 
        className="relative min-h-screen flex items-center overflow-hidden"
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Vertrouwd door 500+ Nederlandse bedrijven
              </div>
              
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-white" 
                data-testid="text-hero-title"
              >
                Professionele
                <br />
                websites
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">zonder zorgen</span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                Alles-in-een website abonnementen met beheerde hosting, SEO, en advertentie-beheer. 
                Kies uw plan en laat ons de rest regelen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/pricing">
                  <Button size="lg" className="gap-2 text-base h-14 px-8 text-lg" data-testid="button-view-plans">
                    Bekijk plannen
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                    data-testid="button-learn-more"
                  >
                    Start gratis proefperiode
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-8 flex-wrap">
                {trustIndicators.map((indicator, index) => (
                  <div 
                    key={indicator.label}
                    className="flex items-center gap-2 text-white/80"
                    data-testid={`trust-indicator-${index}`}
                  >
                    <indicator.icon className="h-5 w-5 text-primary" />
                    <span className="font-bold text-white">{indicator.value}</span>
                    <span className="text-slate-400">{indicator.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-3xl rounded-3xl opacity-60" />
                <ProductMockup 
                  variant="auto" 
                  className="relative w-full"
                />
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Gemiddelde groei</div>
                    <div className="text-2xl font-bold font-mono">+127%</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Websites live</div>
                    <div className="text-2xl font-bold font-mono">2,847</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-b" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              De cijfers spreken voor zich
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vertrouwd door honderden bedrijven in heel Nederland
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center relative group"
                data-testid={`stat-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold font-mono tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-base text-muted-foreground mt-3 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900 text-white" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hoe het werkt
            </h2>
            <p className="text-xl text-slate-300">
              In drie eenvoudige stappen naar uw professionele online aanwezigheid.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {howItWorks.map((item) => (
              <div 
                key={item.step} 
                className="text-center"
                data-testid={`step-${item.step}`}
              >
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <Badge 
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 flex items-center justify-center bg-primary text-white border-0"
                  >
                    {item.step}
                  </Badge>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-features">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-20">
            <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Alles wat u nodig heeft
            </h2>
            <p className="text-xl text-muted-foreground">
              Van website tot advertenties, wij bieden een complete oplossing voor uw online aanwezigheid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border bg-card group relative overflow-visible"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800 text-white" data-testid="section-testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Wat klanten zeggen
            </h2>
            <p className="text-xl text-slate-300">
              Ontdek waarom honderden bedrijven kiezen voor WebsiteAbonnementen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name} 
                className="border-0 bg-white/5 backdrop-blur-sm"
                data-testid={`testimonial-${index}`}
              >
                <CardContent className="p-10">
                  <Quote className="h-10 w-10 text-primary/40 mb-6" />
                  <p className="text-white text-lg mb-8 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex gap-1 mb-8">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary text-white font-semibold text-lg">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                      <div className="text-slate-400">
                        {testimonial.role}
                      </div>
                      <div className="text-primary font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-pricing">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Drie flexibele plannen
            </h2>
            <p className="text-xl text-muted-foreground">
              Van starter tot enterprise, er is een plan dat past bij uw behoeften en budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card 
              className="border bg-card"
              data-testid="pricing-low"
            >
              <CardContent className="p-10">
                <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Low</div>
                <div className="text-5xl font-bold mb-1 font-mono tabular-nums">
                  99
                </div>
                <div className="text-muted-foreground mb-8">euro per maand</div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Keuze uit 3 templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>5 pagina's inbegrepen</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Basis ondersteuning</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-primary bg-card relative"
              data-testid="pricing-medium"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Populair</Badge>
              </div>
              <CardContent className="p-10">
                <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Medium</div>
                <div className="text-5xl font-bold mb-1 font-mono tabular-nums">
                  199
                </div>
                <div className="text-muted-foreground mb-8">euro per maand</div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Keuze uit 10 templates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>10 pagina's inbegrepen</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card 
              className="border bg-card"
              data-testid="pricing-high"
            >
              <CardContent className="p-10">
                <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">High</div>
                <div className="text-5xl font-bold mb-1">
                  Op maat
                </div>
                <div className="text-muted-foreground mb-8">neem contact op</div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Custom design</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Onbeperkte pagina's</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Contact</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section 
        className="py-32 md:py-40 relative overflow-hidden"
        data-testid="section-cta"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start vandaag nog met uw professionele website. Geen verplichtingen, transparante prijzen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="gap-2 text-lg h-14 px-10" 
                data-testid="button-cta-signup"
              >
                Start nu gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/5 border-white/20 text-white h-14 px-10 text-lg backdrop-blur-sm"
                data-testid="button-cta-pricing"
              >
                Bekijk prijzen
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-16 text-slate-400">
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
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
