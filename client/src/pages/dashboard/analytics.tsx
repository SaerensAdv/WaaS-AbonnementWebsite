import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Search,
  BarChart3,
  Gauge,
  MousePointerClick,
  Eye,
  Users,
  Globe,
  Smartphone,
  Monitor,
  AlertTriangle,
  Rocket,
} from "lucide-react";

interface AnalyticsStatus {
  configured: boolean;
  ga4: { available: boolean; propertyId: string | null };
  gsc: { available: boolean; siteUrl: string | null };
  psi: { available: boolean; url: string | null };
}

interface TrafficData {
  daily: { date: string; sessions: number; users: number; pageviews: number }[];
  totals: { sessions: number; users: number; pageviews: number; avgSessionDuration: number; bounceRate: number };
  topPages: { path: string; pageviews: number; users: number }[];
}

interface SearchData {
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
  daily: { date: string; clicks: number; impressions: number }[];
}

interface SpeedData {
  url: string;
  strategy: string;
  scores: { performance: number; seo: number; accessibility: number; bestPractices: number };
  metrics: { fcp: string; lcp: string; tbt: string; cls: string; si: string };
  opportunities: { title: string; savings: string }[];
}

function formatGa4Date(d: string) {
  // "20260710" -> "10/07"
  if (d.length === 8) return `${d.slice(6, 8)}/${d.slice(4, 6)}`;
  return d;
}

function formatIsoDate(d: string) {
  // "2026-07-06" -> "06/07"
  const parts = d.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  return d;
}

function StatCard({ label, value, icon: Icon, testId }: { label: string; value: string | number; icon: React.ElementType; testId: string }) {
  return (
    <Card className="border" data-testid={testId}>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Icon className="h-4 w-4" />
          <span className="text-sm">{label}</span>
        </div>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function scoreColor(score: number) {
  if (score >= 90) return "text-chart-2";
  if (score >= 50) return "text-chart-4";
  return "text-destructive";
}

function ScoreRing({ label, score }: { label: string; score: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" className="stroke-muted" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * c} ${c}`}
            className={score >= 90 ? "stroke-chart-2" : score >= 50 ? "stroke-chart-4" : "stroke-destructive"}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${scoreColor(score)}`}>
          {score}
        </span>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <Card className="border">
      <CardContent className="flex items-center gap-3 py-6 text-muted-foreground">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <span className="text-sm">{message}</span>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[280px] w-full rounded-lg" />;
}

export default function AnalyticsPage() {
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");

  const { data: status, isLoading: statusLoading, isError: statusError, refetch: refetchStatus } = useQuery<AnalyticsStatus>({
    queryKey: ["/api/analytics/status"],
  });

  const { data: traffic, isLoading: trafficLoading, isError: trafficError } = useQuery<TrafficData>({
    queryKey: ["/api/analytics/traffic"],
    enabled: !!status?.ga4.available,
    staleTime: 5 * 60 * 1000,
  });

  const { data: search, isLoading: searchLoading, isError: searchError } = useQuery<SearchData>({
    queryKey: ["/api/analytics/search"],
    enabled: !!status?.gsc.available,
    staleTime: 5 * 60 * 1000,
  });

  const { data: speed, isLoading: speedLoading, isError: speedError } = useQuery<SpeedData>({
    queryKey: [`/api/analytics/speed?strategy=${strategy}`],
    enabled: !!status?.psi.available,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });

  const searchTotals = search
    ? search.daily.reduce(
        (acc, d) => ({ clicks: acc.clicks + d.clicks, impressions: acc.impressions + d.impressions }),
        { clicks: 0, impressions: 0 },
      )
    : null;

  const nothingConfigured =
    status && !status.ga4.available && !status.gsc.available && !status.psi.available;

  return (
    <AppLayout title="Analytics" breadcrumbs={[{ label: "Analytics" }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-analytics-title">Analytics</h1>
          <p className="text-muted-foreground">Inzicht in de prestaties van uw website.</p>
        </div>

        {statusLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
            <ChartSkeleton />
          </div>
        )}

        {statusError && (
          <Card className="border">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold mb-1" data-testid="text-status-error">
                Analytics kon niet geladen worden
              </h2>
              <p className="text-muted-foreground max-w-md mb-4">
                Er ging iets mis bij het ophalen van uw analytics-gegevens. Controleer uw verbinding en probeer het opnieuw.
              </p>
              <button
                onClick={() => refetchStatus()}
                className="text-sm font-medium text-primary hover:underline"
                data-testid="button-retry-status"
              >
                Opnieuw proberen
              </button>
            </CardContent>
          </Card>
        )}

        {nothingConfigured && (
          <Card className="border bg-primary/[0.03]">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="text-not-configured">
                Analytics wordt ingesteld
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Zodra uw website live is, koppelen wij Google Analytics, Search Console en
                snelheidsmonitoring aan uw dashboard. U ziet hier dan bezoekers, zoekprestaties en
                Core Web Vitals.
              </p>
            </CardContent>
          </Card>
        )}

        {/* GA4 Traffic */}
        {status?.ga4.available && (
          <section className="space-y-4" data-testid="section-traffic">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Bezoekers</h2>
              <Badge variant="secondary" className="ml-1">laatste 30 dagen</Badge>
            </div>
            {trafficLoading ? (
              <ChartSkeleton />
            ) : trafficError || !traffic ? (
              <SectionError message="Bezoekersgegevens zijn tijdelijk niet beschikbaar. Probeer het later opnieuw." />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Gebruikers" value={traffic.totals.users} icon={Users} testId="stat-users" />
                  <StatCard label="Sessies" value={traffic.totals.sessions} icon={Globe} testId="stat-sessions" />
                  <StatCard label="Paginaweergaven" value={traffic.totals.pageviews} icon={Eye} testId="stat-pageviews" />
                  <StatCard
                    label="Bouncepercentage"
                    value={`${Math.round(traffic.totals.bounceRate * 100)}%`}
                    icon={MousePointerClick}
                    testId="stat-bounce"
                  />
                </div>
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Bezoekers per dag</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={traffic.daily} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                          <XAxis dataKey="date" tickFormatter={formatGa4Date} tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                          <Tooltip
                            labelFormatter={(l) => formatGa4Date(String(l))}
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: 8,
                              fontSize: 13,
                            }}
                          />
                          <Area type="monotone" dataKey="users" name="Gebruikers" stroke="hsl(var(--primary))" fill="url(#gradUsers)" strokeWidth={2} />
                          <Area type="monotone" dataKey="sessions" name="Sessies" stroke="hsl(var(--chart-2))" fill="transparent" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                {traffic.topPages.length > 0 && (
                  <Card className="border">
                    <CardHeader>
                      <CardTitle className="text-base">Meest bezochte pagina's</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y divide-border/60">
                        {traffic.topPages.slice(0, 8).map((p) => (
                          <div key={p.path} className="flex items-center justify-between py-2 gap-4">
                            <span className="text-sm truncate">{p.path}</span>
                            <span className="text-sm text-muted-foreground shrink-0">
                              {p.pageviews} weergaven · {p.users} gebruikers
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </section>
        )}

        {/* GSC Search */}
        {status?.gsc.available && (
          <section className="space-y-4" data-testid="section-search">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Google zoekresultaten</h2>
              <Badge variant="secondary" className="ml-1">laatste 28 dagen</Badge>
            </div>
            {searchLoading ? (
              <ChartSkeleton />
            ) : searchError || !search ? (
              <SectionError message="Zoekgegevens zijn tijdelijk niet beschikbaar. Probeer het later opnieuw." />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Klikken" value={searchTotals?.clicks ?? 0} icon={MousePointerClick} testId="stat-clicks" />
                  <StatCard label="Vertoningen" value={searchTotals?.impressions ?? 0} icon={Eye} testId="stat-impressions" />
                </div>
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Vertoningen &amp; klikken per dag</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={search.daily} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradImpr" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                          <XAxis dataKey="date" tickFormatter={formatIsoDate} tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                          <Tooltip
                            labelFormatter={(l) => formatIsoDate(String(l))}
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: 8,
                              fontSize: 13,
                            }}
                          />
                          <Area type="monotone" dataKey="impressions" name="Vertoningen" stroke="hsl(var(--chart-3))" fill="url(#gradImpr)" strokeWidth={2} />
                          <Area type="monotone" dataKey="clicks" name="Klikken" stroke="hsl(var(--primary))" fill="transparent" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="border">
                    <CardHeader>
                      <CardTitle className="text-base">Top zoekopdrachten</CardTitle>
                      <CardDescription>Waarop uw website gevonden wordt</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y divide-border/60">
                        {search.topQueries.slice(0, 8).map((q) => (
                          <div key={q.query} className="flex items-center justify-between py-2 gap-4">
                            <span className="text-sm truncate">{q.query}</span>
                            <span className="text-sm text-muted-foreground shrink-0">
                              {q.impressions} vert. · pos. {q.position.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border">
                    <CardHeader>
                      <CardTitle className="text-base">Best presterende pagina's</CardTitle>
                      <CardDescription>In Google zoekresultaten</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y divide-border/60">
                        {search.topPages.slice(0, 8).map((p) => (
                          <div key={p.page} className="flex items-center justify-between py-2 gap-4">
                            <span className="text-sm truncate">{p.page.replace(/^https?:\/\/(www\.)?[^/]+/, "") || "/"}</span>
                            <span className="text-sm text-muted-foreground shrink-0">
                              {p.clicks} klikken · {p.impressions} vert.
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </section>
        )}

        {/* PageSpeed */}
        {status?.psi.available && (
          <section className="space-y-4" data-testid="section-speed">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Website snelheid</h2>
              </div>
              <Tabs value={strategy} onValueChange={(v) => setStrategy(v as "mobile" | "desktop")}>
                <TabsList>
                  <TabsTrigger value="mobile" data-testid="tab-mobile">
                    <Smartphone className="h-4 w-4 mr-1.5" /> Mobiel
                  </TabsTrigger>
                  <TabsTrigger value="desktop" data-testid="tab-desktop">
                    <Monitor className="h-4 w-4 mr-1.5" /> Desktop
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {speedLoading ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
              </div>
            ) : speedError || !speed ? (
              <SectionError message="Snelheidsmeting is tijdelijk niet beschikbaar (de meting duurt soms even of het daglimiet is bereikt). Probeer het later opnieuw." />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Scores</CardTitle>
                    <CardDescription>Google PageSpeed Insights ({speed.strategy === "mobile" ? "mobiel" : "desktop"})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start justify-around gap-2 flex-wrap">
                      <ScoreRing label="Prestaties" score={speed.scores.performance} />
                      <ScoreRing label="SEO" score={speed.scores.seo} />
                      <ScoreRing label="Toegankelijkheid" score={speed.scores.accessibility} />
                      <ScoreRing label="Best practices" score={speed.scores.bestPractices} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Core Web Vitals</CardTitle>
                    <CardDescription>Belangrijkste laadstatistieken</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "First Contentful Paint", value: speed.metrics.fcp },
                        { label: "Largest Contentful Paint", value: speed.metrics.lcp },
                        { label: "Total Blocking Time", value: speed.metrics.tbt },
                        { label: "Cumulative Layout Shift", value: speed.metrics.cls },
                        { label: "Speed Index", value: speed.metrics.si },
                      ].map((m) => (
                        <div key={m.label} className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                          <p className="text-xs text-muted-foreground">{m.label}</p>
                          <p className="text-sm font-semibold mt-0.5">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {speed.opportunities.length > 0 && (
                  <Card className="border lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Optimalisatietips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y divide-border/60">
                        {speed.opportunities.map((o) => (
                          <div key={o.title} className="flex items-center justify-between py-2 gap-4">
                            <span className="text-sm">{o.title}</span>
                            <span className="text-sm text-muted-foreground shrink-0">{o.savings}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </AppLayout>
  );
}
