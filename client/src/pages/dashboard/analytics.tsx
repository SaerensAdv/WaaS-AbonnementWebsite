import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BarChart3,
  Gauge,
  Rocket,
  MousePointerClick,
  Eye,
  TrendingUp,
  Globe,
  Users,
  Timer,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function ComingSoonFeature({
  icon: Icon,
  title,
  description,
  features,
  testId,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: { icon: React.ElementType; label: string }[];
  testId: string;
}) {
  return (
    <Card className="border relative overflow-hidden" data-testid={testId}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="mt-0.5">{description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-chart-4/10 text-chart-4 shrink-0">
            Coming soon
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2.5"
            >
              <f.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{f.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <AppLayout
      title="Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-analytics-title">Analytics</h1>
          <p className="text-muted-foreground">
            Inzicht in de prestaties van uw website.
          </p>
        </div>

        <Card className="border bg-primary/[0.03]">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2" data-testid="text-coming-soon">Binnenkort beschikbaar</h2>
            <p className="text-muted-foreground max-w-lg">
              We werken aan krachtige analytics-integraties zodat u direct vanuit uw dashboard inzicht krijgt
              in de prestaties van uw website. Hieronder een voorproefje van wat er komt.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <ComingSoonFeature
            icon={Search}
            title="Google Search Console"
            description="Ontdek hoe uw website presteert in Google zoekresultaten"
            features={[
              { icon: MousePointerClick, label: "Klikken" },
              { icon: Eye, label: "Vertoningen" },
              { icon: TrendingUp, label: "Gem. CTR" },
              { icon: BarChart3, label: "Gem. Positie" },
              { icon: Search, label: "Top zoekopdrachten" },
              { icon: Globe, label: "Top pagina's" },
            ]}
            testId="feature-search-console"
          />

          <ComingSoonFeature
            icon={BarChart3}
            title="Google Analytics 4"
            description="Volg uw bezoekers, verkeersbronnen en conversies"
            features={[
              { icon: Users, label: "Gebruikers" },
              { icon: Globe, label: "Sessies" },
              { icon: Timer, label: "Sessieduur" },
              { icon: TrendingUp, label: "Conversies" },
              { icon: Smartphone, label: "Apparaten" },
              { icon: BarChart3, label: "Verkeersbronnen" },
            ]}
            testId="feature-analytics"
          />

          <ComingSoonFeature
            icon={Gauge}
            title="PageSpeed Insights"
            description="Monitor de snelheid en Core Web Vitals van uw website"
            features={[
              { icon: Gauge, label: "Prestatiescores" },
              { icon: Monitor, label: "Desktop & Mobiel" },
              { icon: CheckCircle2, label: "Core Web Vitals" },
              { icon: AlertTriangle, label: "Optimalisatietips" },
              { icon: Smartphone, label: "Mobiele score" },
              { icon: TrendingUp, label: "Historiek" },
            ]}
            testId="feature-pagespeed"
          />
        </div>
      </div>
    </AppLayout>
  );
}
