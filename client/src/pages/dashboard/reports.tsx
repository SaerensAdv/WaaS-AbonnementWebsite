import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  ExternalLink,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { Report } from "@shared/schema";

const typeLabels: Record<string, string> = {
  WEBSITE: "Website",
  GOOGLE_ADS: "Google Ads",
  META: "Meta Ads",
  SEO: "SEO",
  CONTENT: "Content",
};

const typeColors: Record<string, string> = {
  WEBSITE: "bg-chart-1/20 text-chart-1",
  GOOGLE_ADS: "bg-chart-4/20 text-chart-4",
  META: "bg-chart-5/20 text-chart-5",
  SEO: "bg-chart-2/20 text-chart-2",
  CONTENT: "bg-chart-3/20 text-chart-3",
};

interface ReportsData {
  reports: (Report & { createdBy?: { name: string } })[];
}

function formatMonth(month: string): string {
  const [year, monthNum] = month.split("-");
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
}

export default function ReportsPage() {
  const { data, isLoading } = useQuery<ReportsData>({
    queryKey: ["/api/reports"],
  });

  const reports = data?.reports || [];

  return (
    <AppLayout
      title="Rapporten"
      breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Rapporten" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Rapporten</h1>
          <p className="text-muted-foreground">
            Bekijk maandelijkse prestatierapportages van uw website en add-ons.
          </p>
        </div>

        {isLoading ? (
          <Card className="border">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="border">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nog geen rapporten</h2>
              <p className="text-muted-foreground">
                Rapporten worden maandelijks aangemaakt door uw specialist of beheerder.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium">{formatMonth(report.month)}</h3>
                        <Badge
                          variant="secondary"
                          className={typeColors[report.type] || "bg-muted"}
                        >
                          {typeLabels[report.type] || report.type}
                        </Badge>
                      </div>
                      {report.summaryText && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.summaryText}
                        </p>
                      )}
                      {report.createdBy && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Door: {report.createdBy.name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {report.dashboardUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          data-testid={`button-view-dashboard-${report.id}`}
                        >
                          <a href={report.dashboardUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Dashboard
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-view-report-${report.id}`}
                      >
                        Bekijk details
                      </Button>
                    </div>
                  </div>

                  {report.kpiData && typeof report.kpiData === "object" && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(report.kpiData as Record<string, any>).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-center p-3 rounded-md bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1 capitalize">
                              {key.replace(/_/g, " ")}
                            </div>
                            <div className="text-lg font-semibold font-mono">
                              {typeof value === "number" ? value.toLocaleString("nl-NL") : value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
