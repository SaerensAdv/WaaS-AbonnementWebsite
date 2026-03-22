import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  BarChart3,
  Gauge,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  Users,
  Timer,
  FileText,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Period = "7d" | "28d" | "3m";

function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  tooltip,
  testId,
}: {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  tooltip?: string;
  testId: string;
}) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="border" data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono" data-testid={`${testId}-value`}>{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-chart-2" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className={`text-xs font-medium ${isPositive ? "text-chart-2" : "text-destructive"}`}>
              {isPositive ? "+" : ""}{change}%
            </span>
            {changeLabel && (
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s >= 90) return "text-chart-2";
    if (s >= 50) return "text-chart-4";
    return "text-destructive";
  };

  const getBg = (s: number) => {
    if (s >= 90) return "bg-chart-2/10";
    if (s >= 50) return "bg-chart-4/10";
    return "bg-destructive/10";
  };

  const getLabel = (s: number) => {
    if (s >= 90) return "Goed";
    if (s >= 50) return "Matig";
    return "Slecht";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-20 h-20 rounded-full ${getBg(score)} flex items-center justify-center`}>
        <span className={`text-2xl font-bold font-mono ${getColor(score)}`}>{score}</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{label}</p>
        <Badge variant="secondary" className={`${getBg(score)} ${getColor(score)} text-xs mt-1`}>
          {getLabel(score)}
        </Badge>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

function SearchConsoleTab({ period }: { period: Period }) {
  const hasData = true;

  const periodLabel = period === "7d" ? "vorige week" : period === "28d" ? "vorige maand" : "vorig kwartaal";

  const topQueries = [
    { query: "website abonnement", clicks: 124, impressions: 1890, ctr: 6.6, position: 3.2 },
    { query: "website laten maken prijs", clicks: 89, impressions: 2340, ctr: 3.8, position: 5.1 },
    { query: "professionele website kosten", clicks: 67, impressions: 1560, ctr: 4.3, position: 4.7 },
    { query: "website onderhoud abonnement", clicks: 45, impressions: 890, ctr: 5.1, position: 6.3 },
    { query: "website laten bouwen belgie", clicks: 38, impressions: 1230, ctr: 3.1, position: 8.9 },
  ];

  const topPages = [
    { page: "/", clicks: 342, impressions: 5670, ctr: 6.0, position: 4.1 },
    { page: "/prijzen", clicks: 156, impressions: 2340, ctr: 6.7, position: 3.8 },
    { page: "/diensten", clicks: 89, impressions: 1890, ctr: 4.7, position: 5.2 },
    { page: "/blog/website-kosten", clicks: 67, impressions: 3210, ctr: 2.1, position: 12.4 },
    { page: "/contact", clicks: 34, impressions: 560, ctr: 6.1, position: 2.9 },
  ];

  if (!hasData) {
    return (
      <EmptyState
        icon={Search}
        title="Nog geen Search Console data"
        description="Zodra uw website is gekoppeld aan Google Search Console, verschijnen hier uw zoekprestaties."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Klikken"
          value="688"
          change={12}
          changeLabel={`vs ${periodLabel}`}
          icon={MousePointerClick}
          tooltip="Aantal keren dat gebruikers vanuit Google op uw site hebben geklikt"
          testId="metric-clicks"
        />
        <MetricCard
          title="Vertoningen"
          value="12.4K"
          change={8}
          changeLabel={`vs ${periodLabel}`}
          icon={Eye}
          tooltip="Aantal keren dat uw site in zoekresultaten is verschenen"
          testId="metric-impressions"
        />
        <MetricCard
          title="Gem. CTR"
          value="5.5%"
          change={3}
          changeLabel={`vs ${periodLabel}`}
          icon={TrendingUp}
          tooltip="Percentage vertoningen dat tot een klik heeft geleid"
          testId="metric-ctr"
        />
        <MetricCard
          title="Gem. Positie"
          value="4.8"
          change={-2}
          changeLabel={`vs ${periodLabel}`}
          icon={BarChart3}
          tooltip="Gemiddelde positie in Google zoekresultaten (lager = beter)"
          testId="metric-position"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Top Zoekopdrachten</CardTitle>
            <CardDescription>Waar gebruikers op zoeken om uw site te vinden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                <span>Zoekopdracht</span>
                <span className="text-right w-14">Klikken</span>
                <span className="text-right w-14">Vertoning</span>
                <span className="text-right w-12">CTR</span>
                <span className="text-right w-12">Positie</span>
              </div>
              {topQueries.map((q, i) => (
                <div
                  key={q.query}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 py-2 text-sm items-center hover:bg-muted/50 rounded px-1 -mx-1"
                  data-testid={`query-row-${i}`}
                >
                  <span className="truncate font-medium">{q.query}</span>
                  <span className="text-right w-14 font-mono text-xs">{q.clicks}</span>
                  <span className="text-right w-14 font-mono text-xs text-muted-foreground">{q.impressions.toLocaleString()}</span>
                  <span className="text-right w-12 font-mono text-xs">{q.ctr}%</span>
                  <span className="text-right w-12 font-mono text-xs text-muted-foreground">{q.position.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Top Pagina's</CardTitle>
            <CardDescription>Best presterende pagina's in zoekresultaten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                <span>Pagina</span>
                <span className="text-right w-14">Klikken</span>
                <span className="text-right w-14">Vertoning</span>
                <span className="text-right w-12">CTR</span>
                <span className="text-right w-12">Positie</span>
              </div>
              {topPages.map((p, i) => (
                <div
                  key={p.page}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 py-2 text-sm items-center hover:bg-muted/50 rounded px-1 -mx-1"
                  data-testid={`page-row-${i}`}
                >
                  <span className="truncate font-medium font-mono text-xs">{p.page}</span>
                  <span className="text-right w-14 font-mono text-xs">{p.clicks}</span>
                  <span className="text-right w-14 font-mono text-xs text-muted-foreground">{p.impressions.toLocaleString()}</span>
                  <span className="text-right w-12 font-mono text-xs">{p.ctr}%</span>
                  <span className="text-right w-12 font-mono text-xs text-muted-foreground">{p.position.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsTab({ period }: { period: Period }) {
  const hasData = true;

  const periodLabel = period === "7d" ? "vorige week" : period === "28d" ? "vorige maand" : "vorig kwartaal";

  const topSources = [
    { source: "Google / organisch", users: 456, sessions: 612, percentage: 52 },
    { source: "Direct", users: 187, sessions: 234, percentage: 21 },
    { source: "Facebook / social", users: 98, sessions: 145, percentage: 11 },
    { source: "LinkedIn / social", users: 67, sessions: 89, percentage: 8 },
    { source: "Google / cpc", users: 45, sessions: 67, percentage: 5 },
    { source: "Overig", users: 23, sessions: 31, percentage: 3 },
  ];

  const topLandingPages = [
    { page: "/", sessions: 487, bounceRate: 42, avgDuration: "2:34" },
    { page: "/prijzen", sessions: 234, bounceRate: 28, avgDuration: "3:12" },
    { page: "/blog/website-kosten", sessions: 156, bounceRate: 65, avgDuration: "1:45" },
    { page: "/diensten", sessions: 89, bounceRate: 38, avgDuration: "2:56" },
    { page: "/contact", sessions: 67, bounceRate: 22, avgDuration: "4:01" },
  ];

  if (!hasData) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Nog geen Analytics data"
        description="Zodra Google Analytics 4 is ingesteld, verschijnen hier uw websitestatistieken."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Gebruikers"
          value="876"
          change={15}
          changeLabel={`vs ${periodLabel}`}
          icon={Users}
          tooltip="Unieke bezoekers op uw website"
          testId="metric-users"
        />
        <MetricCard
          title="Sessies"
          value="1.178"
          change={11}
          changeLabel={`vs ${periodLabel}`}
          icon={Globe}
          tooltip="Totaal aantal bezoeksessies"
          testId="metric-sessions"
        />
        <MetricCard
          title="Gem. Sessieduur"
          value="2:48"
          change={5}
          changeLabel={`vs ${periodLabel}`}
          icon={Timer}
          tooltip="Gemiddelde tijd die bezoekers op uw site doorbrengen"
          testId="metric-duration"
        />
        <MetricCard
          title="Bouncepercentage"
          value="38%"
          change={-4}
          changeLabel={`vs ${periodLabel}`}
          icon={TrendingDown}
          tooltip="Percentage bezoekers dat na 1 pagina vertrekt (lager = beter)"
          testId="metric-bounce"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          title="Paginaweergaven"
          value="3.245"
          change={18}
          changeLabel={`vs ${periodLabel}`}
          icon={FileText}
          tooltip="Totaal aantal bekeken pagina's"
          testId="metric-pageviews"
        />
        <MetricCard
          title="Conversiepercentage"
          value="3.2%"
          change={7}
          changeLabel={`vs ${periodLabel}`}
          icon={TrendingUp}
          tooltip="Percentage bezoekers dat een gewenste actie onderneemt"
          testId="metric-conversions"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Verkeersbronnen</CardTitle>
            <CardDescription>Waar uw bezoekers vandaan komen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSources.map((s, i) => (
                <div key={s.source} className="space-y-1.5" data-testid={`source-row-${i}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.source}</span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="font-mono text-xs">{s.users} gebruikers</span>
                      <span className="font-mono text-xs font-medium text-foreground">{s.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Top Landingspagina's</CardTitle>
            <CardDescription>Eerste pagina die bezoekers zien</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                <span>Pagina</span>
                <span className="text-right w-16">Sessies</span>
                <span className="text-right w-16">Bounce</span>
                <span className="text-right w-14">Duur</span>
              </div>
              {topLandingPages.map((p, i) => (
                <div
                  key={p.page}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-3 py-2 text-sm items-center hover:bg-muted/50 rounded px-1 -mx-1"
                  data-testid={`landing-row-${i}`}
                >
                  <span className="truncate font-medium font-mono text-xs">{p.page}</span>
                  <span className="text-right w-16 font-mono text-xs">{p.sessions}</span>
                  <span className={`text-right w-16 font-mono text-xs ${p.bounceRate > 50 ? "text-destructive" : ""}`}>
                    {p.bounceRate}%
                  </span>
                  <span className="text-right w-14 font-mono text-xs text-muted-foreground">{p.avgDuration}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base">Apparaten</CardTitle>
          <CardDescription>Verdeling van verkeer per apparaattype</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Smartphone, label: "Mobiel", value: "62%", count: 543 },
              { icon: Monitor, label: "Desktop", value: "31%", count: 272 },
              { icon: Monitor, label: "Tablet", value: "7%", count: 61 },
            ].map((device) => (
              <div key={device.label} className="flex flex-col items-center gap-2 py-4" data-testid={`device-${device.label.toLowerCase()}`}>
                <device.icon className="h-8 w-8 text-muted-foreground" />
                <span className="text-xl font-bold font-mono">{device.value}</span>
                <span className="text-sm text-muted-foreground">{device.label}</span>
                <span className="text-xs text-muted-foreground font-mono">{device.count} sessies</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PageSpeedTab() {
  const hasData = true;

  const coreWebVitals = [
    {
      name: "LCP",
      fullName: "Largest Contentful Paint",
      value: "1.8s",
      status: "good" as const,
      description: "Laadtijd van het grootste element",
      threshold: "< 2.5s",
    },
    {
      name: "INP",
      fullName: "Interaction to Next Paint",
      value: "120ms",
      status: "good" as const,
      description: "Responstijd bij interactie",
      threshold: "< 200ms",
    },
    {
      name: "CLS",
      fullName: "Cumulative Layout Shift",
      value: "0.05",
      status: "good" as const,
      description: "Visuele stabiliteit van de pagina",
      threshold: "< 0.1",
    },
  ];

  const diagnostics = [
    { title: "Afbeeldingen optimaliseren", impact: "high" as const, savings: "1.2s" },
    { title: "Ongebruikte CSS verwijderen", impact: "medium" as const, savings: "0.4s" },
    { title: "JavaScript minimaliseren", impact: "medium" as const, savings: "0.3s" },
    { title: "Browser caching instellen", impact: "low" as const, savings: "0.1s" },
  ];

  if (!hasData) {
    return (
      <EmptyState
        icon={Gauge}
        title="Nog geen PageSpeed data"
        description="Zodra uw website live is, worden hier automatisch prestatiescores getoond."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobiel
            </CardTitle>
            <CardDescription>PageSpeed score voor mobiele apparaten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              <ScoreGauge score={78} label="Prestaties" />
              <ScoreGauge score={92} label="Toegankelijkheid" />
              <ScoreGauge score={95} label="SEO" />
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Desktop
            </CardTitle>
            <CardDescription>PageSpeed score voor desktopcomputers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              <ScoreGauge score={94} label="Prestaties" />
              <ScoreGauge score={92} label="Toegankelijkheid" />
              <ScoreGauge score={97} label="SEO" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base">Core Web Vitals</CardTitle>
          <CardDescription>De belangrijkste prestatie-indicatoren van Google</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {coreWebVitals.map((vital) => (
              <div
                key={vital.name}
                className="rounded-lg border p-4 space-y-2"
                data-testid={`vital-${vital.name.toLowerCase()}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    <span className="font-bold text-sm">{vital.name}</span>
                  </div>
                  <span className="text-xl font-bold font-mono">{vital.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{vital.fullName}</p>
                <p className="text-xs text-muted-foreground">{vital.description}</p>
                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 text-xs">
                  Drempel: {vital.threshold}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base">Optimalisatiesuggesties</CardTitle>
          <CardDescription>Aanbevelingen om de laadtijd te verbeteren</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {diagnostics.map((d, i) => (
              <div
                key={d.title}
                className="flex items-center justify-between py-2 border-b last:border-0"
                data-testid={`diagnostic-${i}`}
              >
                <div className="flex items-center gap-3">
                  {d.impact === "high" ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : d.impact === "medium" ? (
                    <AlertTriangle className="h-4 w-4 text-chart-4" />
                  ) : (
                    <Info className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{d.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      d.impact === "high"
                        ? "bg-destructive/10 text-destructive"
                        : d.impact === "medium"
                          ? "bg-chart-4/10 text-chart-4"
                          : "bg-muted text-muted-foreground"
                    }
                  >
                    {d.impact === "high" ? "Hoog" : d.impact === "medium" ? "Gemiddeld" : "Laag"}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono w-12 text-right">-{d.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("28d");

  return (
    <AppLayout
      title="Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-analytics-title">Analytics</h1>
            <p className="text-muted-foreground">
              Inzicht in de prestaties van uw website.
            </p>
          </div>
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[180px]" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Laatste 7 dagen</SelectItem>
              <SelectItem value="28d">Laatste 28 dagen</SelectItem>
              <SelectItem value="3m">Laatste 3 maanden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="search-console" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-analytics">
            <TabsTrigger value="search-console" className="flex items-center gap-2" data-testid="tab-search-console">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search Console</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">GA4</span>
            </TabsTrigger>
            <TabsTrigger value="pagespeed" className="flex items-center gap-2" data-testid="tab-pagespeed">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">PageSpeed</span>
              <span className="sm:hidden">Speed</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search-console">
            <SearchConsoleTab period={period} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab period={period} />
          </TabsContent>

          <TabsContent value="pagespeed">
            <PageSpeedTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
