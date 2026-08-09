import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  Euro,
  PencilLine,
  FileText,
} from "lucide-react";
import type { ChangeRequest, QuoteRequest } from "@shared/schema";

interface AdminStats {
  totalCustomers: number;
  totalProjects: number;
  activeSubscriptions: number;
  mrr: number;
  pendingChanges: number;
  newQuotes: number;
  recentChanges: { request: ChangeRequest; customer: { id: string; name: string; email: string } }[];
  recentQuotes: QuoteRequest[];
}

const changeStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Aangevraagd", className: "bg-chart-4/20 text-chart-4" },
  in_progress: { label: "In behandeling", className: "bg-chart-1/20 text-chart-1" },
  completed: { label: "Afgerond", className: "bg-chart-2/20 text-chart-2" },
  rejected: { label: "Afgewezen", className: "bg-destructive/20 text-destructive" },
};

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("nl-BE", { day: "numeric", month: "short" });
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <AppLayout
      title="Admin Dashboard"
      breadcrumbs={[{ label: "Admin" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-admin-title">Dashboard</h1>
          <p className="text-muted-foreground">
            Overzicht van het platform.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Klanten</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-total-customers">{data?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Geregistreerde klanten</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Projecten</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-total-projects">{data?.totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Totaal projecten</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Abonnementen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-active-subs">{data?.activeSubscriptions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Lopende abonnementen</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-mrr">
                €{((data?.mrr || 0) / 100).toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Maandelijkse omzet</p>
            </CardContent>
          </Card>

          <Link href="/admin/changes">
            <Card className="border hover-elevate cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium">Open wijzigingen</CardTitle>
                <PencilLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold" data-testid="text-pending-changes">{data?.pendingChanges ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Wachten op behandeling</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/quotes">
            <Card className="border hover-elevate cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium">Nieuwe offertes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold" data-testid="text-new-quotes">{data?.newQuotes ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Onbehandelde aanvragen</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Laatste wijzigingsverzoeken</CardTitle>
              <Link href="/admin/changes" className="text-sm text-primary hover:underline">Alle</Link>
            </CardHeader>
            <CardContent>
              {data?.recentChanges?.length ? (
                <div className="divide-y">
                  {data.recentChanges.map(({ request, customer }) => {
                    const status = changeStatusConfig[request.status] ?? changeStatusConfig.pending;
                    return (
                      <div key={request.id} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{request.title}</p>
                          <p className="text-xs text-muted-foreground">{customer.name} · {formatDate(request.createdAt)}</p>
                        </div>
                        <Badge variant="secondary" className={`shrink-0 ${status.className}`}>{status.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nog geen wijzigingsverzoeken.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Laatste offerte-aanvragen</CardTitle>
              <Link href="/admin/quotes" className="text-sm text-primary hover:underline">Alle</Link>
            </CardHeader>
            <CardContent>
              {data?.recentQuotes?.length ? (
                <div className="divide-y">
                  {data.recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{quote.companyName}</p>
                        <p className="text-xs text-muted-foreground">{quote.projectType} · {formatDate(quote.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nog geen offerte-aanvragen.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border">
          <CardHeader className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">Beheer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/customers">
              <Button variant="outline" className="w-full justify-between" data-testid="link-admin-customers">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Klanten bekijken
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
