import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FolderKanban,
  UserCog,
  Puzzle,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AdminStats {
  totalCustomers: number;
  totalProjects: number;
  activeProjects: number;
  totalSpecialists: number;
  pendingSpecialists: number;
  activeAddOns: number;
  recentActivity: {
    type: string;
    message: string;
    timestamp: string;
  }[];
}

const activityIcons = {
  signup: Users,
  project: FolderKanban,
  addon: Puzzle,
  specialist: UserCog,
};

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
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overzicht van het platform en recente activiteit.
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
                <div className="text-2xl font-semibold">{data?.totalCustomers || 0}</div>
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
                <div className="text-2xl font-semibold">
                  {data?.activeProjects || 0}
                  <span className="text-base font-normal text-muted-foreground">
                    /{data?.totalProjects || 0}
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Actief / Totaal</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Specialisten</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold">{data?.totalSpecialists || 0}</span>
                  {(data?.pendingSpecialists || 0) > 0 && (
                    <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">
                      {data?.pendingSpecialists} wachtend
                    </Badge>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Goedgekeurde specialisten</p>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Add-ons</CardTitle>
              <Puzzle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold">{data?.activeAddOns || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Lopende diensten</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border">
            <CardHeader className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg">Snelle acties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/customers">
                <Button variant="outline" className="w-full justify-between" data-testid="link-admin-customers">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Klanten beheren
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full justify-between" data-testid="link-admin-projects">
                  <span className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    Projecten beheren
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/specialists">
                <Button variant="outline" className="w-full justify-between" data-testid="link-admin-specialists">
                  <span className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    Specialisten beheren
                    {(data?.pendingSpecialists || 0) > 0 && (
                      <Badge variant="secondary" className="bg-chart-4/20 text-chart-4 ml-1">
                        {data?.pendingSpecialists}
                      </Badge>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/addons">
                <Button variant="outline" className="w-full justify-between" data-testid="link-admin-addons">
                  <span className="flex items-center gap-2">
                    <Puzzle className="h-4 w-4" />
                    Add-ons configureren
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-lg">Recente activiteit</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.recentActivity && data.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {data.recentActivity.map((activity, index) => {
                    const Icon = activityIcons[activity.type as keyof typeof activityIcons] || TrendingUp;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString("nl-NL")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Geen recente activiteit
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
