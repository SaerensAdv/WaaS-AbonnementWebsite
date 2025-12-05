import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Professionele Websites",
    description: "Kies uit hoogwaardige templates of laat een website op maat maken voor uw bedrijf.",
  },
  {
    icon: Zap,
    title: "Snelle Levering",
    description: "Uw website is binnen enkele dagen live dankzij ons gestroomlijnde onboardingproces.",
  },
  {
    icon: Shield,
    title: "Beheerde Hosting",
    description: "SSL, updates, backups en beveiliging worden volledig door ons beheerd.",
  },
  {
    icon: BarChart3,
    title: "Growth Add-ons",
    description: "Voeg Google Ads, Meta Ads, SEO en content toe voor maximale groei.",
  },
  {
    icon: Users,
    title: "Expert Specialisten",
    description: "Gecertificeerde specialisten beheren uw advertenties en optimalisaties.",
  },
  {
    icon: Headphones,
    title: "Premium Support",
    description: "Persoonlijke ondersteuning en maandelijkse rapportages over uw resultaten.",
  },
];

const stats = [
  { value: "500+", label: "Tevreden klanten" },
  { value: "99.9%", label: "Uptime garantie" },
  { value: "24/7", label: "Monitoring" },
  { value: "30+", label: "Expert specialisten" },
];

const testimonials = [
  {
    name: "Jan de Vries",
    company: "De Vries Bouw",
    text: "Eindelijk een website waar ik me geen zorgen over hoef te maken. Het team zorgt voor alles!",
    rating: 5,
  },
  {
    name: "Sarah Jansen",
    company: "Jansen Consulting",
    text: "De combinatie van een mooie website plus Google Ads beheer heeft ons bedrijf een enorme boost gegeven.",
    rating: 5,
  },
  {
    name: "Mohammed El-Amin",
    company: "El-Amin Logistics",
    text: "Transparante prijzen, professionele service, en uitstekende resultaten. Zeer tevreden!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Nieuw: Specialist Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight" data-testid="text-hero-title">
              Professionele websites
              <span className="text-primary"> zonder zorgen</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Alles-in-een website abonnementen met beheerde hosting, SEO, en advertentie-beheer. 
              Kies uw plan en laat ons de rest regelen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/pricing">
                <Button size="lg" className="gap-2" data-testid="button-view-plans">
                  Bekijk plannen
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" data-testid="button-learn-more">
                  Meer informatie
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
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
            {features.map((feature) => (
              <Card key={feature.title} className="border bg-card">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30">
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
            <Card className="border bg-card">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">LOW</div>
                <div className="text-3xl font-semibold mb-4">
                  vanaf 99
                  <span className="text-lg font-normal text-muted-foreground">/maand</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Keuze uit 3 templates
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    5 pagina's inbegrepen
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Basis ondersteuning
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Populair</Badge>
              </div>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">MEDIUM</div>
                <div className="text-3xl font-semibold mb-4">
                  vanaf 199
                  <span className="text-lg font-normal text-muted-foreground">/maand</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Keuze uit 10 templates
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    10 pagina's inbegrepen
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Priority support
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">HIGH</div>
                <div className="text-3xl font-semibold mb-4">
                  Op maat
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Custom design
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Onbeperkte pagina's
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
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

      <section className="py-20 md:py-28">
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
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border bg-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Start vandaag nog met uw professionele website. Geen verplichtingen, transparante prijzen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="button-cta-signup">
                Start nu gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground">
                Bekijk prijzen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
