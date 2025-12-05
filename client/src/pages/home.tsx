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
        className="relative min-h-screen flex items-center overflow-hidden py-20 lg:py-0"
        data-testid="section-hero"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-3 space-y-8">
              <Badge variant="secondary" className="no-default-hover-elevate no-default-active-elevate">
                Vertrouwd door 500+ bedrijven
              </Badge>
              
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none" 
                data-testid="text-hero-title"
              >
                Professionele websites
                <span className="block text-primary">zonder zorgen</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Alles-in-een website abonnementen met beheerde hosting, SEO, en advertentie-beheer. 
                Kies uw plan en laat ons de rest regelen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/pricing">
                  <Button size="lg" className="gap-2 text-base" data-testid="button-view-plans">
                    Bekijk plannen
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    variant="outline"
                    data-testid="button-learn-more"
                  >
                    Start gratis proefperiode
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-4 flex-wrap">
                {trustIndicators.map((indicator, index) => (
                  <div 
                    key={indicator.label}
                    className="flex items-center gap-2"
                    data-testid={`trust-indicator-${index}`}
                  >
                    <indicator.icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{indicator.value}</span>
                    <span className="text-muted-foreground">{indicator.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 relative">
              <div className="relative">
                <ProductMockup 
                  variant="auto" 
                  className="w-full max-w-xl mx-auto lg:max-w-none"
                />
                <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 blur-3xl rounded-full scale-150" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-6xl md:text-7xl font-bold text-primary font-mono tabular-nums">
                  {stat.value}
                </div>
                <div className="text-base text-muted-foreground mt-3">
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
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Alles wat u nodig heeft
            </h2>
            <p className="text-xl text-muted-foreground">
              Van website tot advertenties, wij bieden een complete oplossing voor uw online aanwezigheid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border bg-card"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-10">
                  <div className="h-14 w-14 rounded-md bg-primary/10 flex items-center justify-center mb-8">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
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
        className="py-24 md:py-32 bg-primary text-white"
        data-testid="section-cta"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start vandaag nog met uw professionele website. Geen verplichtingen, transparante prijzen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 text-base" 
                data-testid="button-cta-signup"
              >
                Start nu gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white/30 text-white"
                data-testid="button-cta-pricing"
              >
                Bekijk prijzen
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/60 mt-12">
            Vertrouwd door 500+ Nederlandse bedrijven
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
