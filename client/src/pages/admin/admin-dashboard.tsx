import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  Euro,
} from "lucide-react";

interface AdminStats {
  totalCustomers: number;
  totalProjects: number;
  activeSubscriptions: number;
  mrr: number;
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Klanten</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="text-total-customers">{data?.totalCustomers || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Geregistreerde klanten</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Projecten</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="text-total-projects">{data?.totalProjects || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Totaal projecten</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Abonnementen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="text-active-subs">{data?.activeSubscriptions || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Lopende abonnementen</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid="text-mrr">
                  €{((data?.mrr || 0) / 100).toFixed(0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Maandelijkse omzet</p>
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
