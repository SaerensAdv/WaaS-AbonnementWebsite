import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarketingLayout } from "@/components/layout/marketing-layout";
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
  Lock,
} from "lucide-react";
import { SiVisa, SiMastercard } from "react-icons/si";
import heroImage from "@assets/stock_images/professional_team_me_49739f15.jpg";

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
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-testid="section-hero"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
              Nieuw: Specialist Marketplace
            </Badge>
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-tight" 
              data-testid="text-hero-title"
            >
              Professionele websites
              <span className="block">zonder zorgen</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Alles-in-een website abonnementen met beheerde hosting, SEO, en advertentie-beheer. 
              Kies uw plan en laat ons de rest regelen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/pricing">
                <Button size="lg" className="gap-2 text-base" data-testid="button-view-plans">
                  Bekijk plannen
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
                  data-testid="button-learn-more"
                >
                  Meer informatie
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/70 pt-4">
              Vertrouwd door 500+ Nederlandse bedrijven
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50" data-testid="section-trust">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground font-medium">
              Vertrouwd door 500+ Nederlandse bedrijven
            </p>
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <SiVisa className="h-8 w-auto" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <SiMastercard className="h-8 w-auto" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  SSL Secured
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  GDPR Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-5xl md:text-6xl font-semibold text-primary font-mono tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Hoe het werkt
            </h2>
            <p className="text-lg text-muted-foreground">
              In drie eenvoudige stappen naar uw professionele online aanwezigheid.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item) => (
              <div 
                key={item.step} 
                className="text-center"
                data-testid={`step-${item.step}`}
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <Badge 
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 flex items-center justify-center"
                  >
                    {item.step}
                  </Badge>
                </div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" data-testid="section-features">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Alles wat u nodig heeft
            </h2>
            <p className="text-lg text-muted-foreground">
              Van website tot advertenties, wij bieden een complete oplossing voor uw online aanwezigheid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border bg-card"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30" data-testid="section-pricing">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Drie flexibele plannen
            </h2>
            <p className="text-lg text-muted-foreground">
              Van starter tot enterprise, er is een plan dat past bij uw behoeften en budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card 
              className="border bg-card transition-shadow duration-200 hover:shadow-lg"
              data-testid="pricing-low"
            >
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">LOW</div>
                <div className="text-4xl font-semibold mb-1 font-mono">
                  99
                </div>
                <div className="text-sm text-muted-foreground mb-6">euro per maand</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Keuze uit 3 templates
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    5 pagina's inbegrepen
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Basis ondersteuning
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card 
              className="border-2 border-primary bg-card relative transition-shadow duration-200 hover:shadow-lg"
              data-testid="pricing-medium"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Populair</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">MEDIUM</div>
                <div className="text-4xl font-semibold mb-1 font-mono">
                  199
                </div>
                <div className="text-sm text-muted-foreground mb-6">euro per maand</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Keuze uit 10 templates
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    10 pagina's inbegrepen
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Priority support
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card 
              className="border bg-card transition-shadow duration-200 hover:shadow-lg"
              data-testid="pricing-high"
            >
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">HIGH</div>
                <div className="text-4xl font-semibold mb-1">
                  Op maat
                </div>
                <div className="text-sm text-muted-foreground mb-6">neem contact op</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Custom design
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Onbeperkte pagina's
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    Dedicated support
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

      <section className="py-20 md:py-28" data-testid="section-testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Wat klanten zeggen
            </h2>
            <p className="text-lg text-muted-foreground">
              Ontdek waarom honderden bedrijven kiezen voor WebsiteAbonnementen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name} 
                className="border bg-card"
                data-testid={`testimonial-${index}`}
              >
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="relative py-24 md:py-32 overflow-hidden"
        data-testid="section-cta"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
            Start vandaag nog met uw professionele website. Geen verplichtingen, transparante prijzen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base" data-testid="button-cta-signup">
                Start nu gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
                data-testid="button-cta-pricing"
              >
                Bekijk prijzen
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/60 mt-8">
            Vertrouwd door 500+ Nederlandse bedrijven
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
