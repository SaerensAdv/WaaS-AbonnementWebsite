import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  FolderKanban,
  Puzzle,
  FileText,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import type { Project, Subscription, AddOnSelection } from "@shared/schema";

const statusConfig = {
  ONBOARDING: { label: "Onboarding", color: "bg-chart-4/20 text-chart-4", icon: Clock },
  PRODUCTION: { label: "In productie", color: "bg-chart-1/20 text-chart-1", icon: Zap },
  LIVE: { label: "Live", color: "bg-chart-2/20 text-chart-2", icon: CheckCircle2 },
  MAINTENANCE: { label: "Onderhoud", color: "bg-chart-5/20 text-chart-5", icon: AlertCircle },
};

interface DashboardData {
  project: Project | null;
  subscription: Subscription | null;
  addOnSelections: AddOnSelection[];
  recentReports: number;
}

export default function CustomerDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const project = data?.project;
  const subscription = data?.subscription;
  const addOnCount = data?.addOnSelections?.length || 0;
  const reportCount = data?.recentReports || 0;

  const statusInfo = project?.status ? statusConfig[project.status as keyof typeof statusConfig] : null;

  return (
    <AppLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-welcome">
            Welkom terug, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Hier is een overzicht van uw website en diensten.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Project Status</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : statusInfo ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={statusInfo.color}>
                    <statusInfo.icon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Geen project</span>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Add-ons</CardTitle>
              <Puzzle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-semibold">{addOnCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Rapporten</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-semibold">{reportCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Abonnement</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : subscription?.status === "ACTIVE" ? (
                <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                  Actief
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Geen abonnement</span>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border">
            <CardHeader>
              <CardTitle>Uw Project</CardTitle>
              <CardDescription>
                {project ? "Bekijk en beheer uw website project" : "Start met het opzetten van uw website"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : project ? (
                <div className="space-y-4">
                  {project.domain && (
                    <div>
                      <span className="text-sm text-muted-foreground">Domein: </span>
                      <span className="font-medium">{project.domain}</span>
                    </div>
                  )}
                  <Link href="/app/project">
                    <Button className="gap-2" data-testid="button-view-project">
                      Bekijk project
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    U heeft nog geen actief project. Kies een plan om te beginnen.
                  </p>
                  <Link href="/pricing">
                    <Button className="gap-2" data-testid="button-choose-plan">
                      Kies een plan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle>Growth Add-ons</CardTitle>
              <CardDescription>
                Versterk uw online aanwezigheid met advertenties en SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : addOnCount > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    U heeft {addOnCount} actieve add-on{addOnCount !== 1 ? "s" : ""}.
                  </p>
                  <Link href="/app/addons">
                    <Button variant="outline" className="gap-2" data-testid="button-manage-addons">
                      Beheer add-ons
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Voeg Google Ads, Meta Ads, SEO of andere diensten toe aan uw pakket.
                  </p>
                  <Link href="/app/addons">
                    <Button variant="outline" className="gap-2" data-testid="button-explore-addons">
                      Ontdek add-ons
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {project?.status === "ONBOARDING" && (
          <Card className="border border-chart-4/50 bg-chart-4/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md bg-chart-4/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-chart-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Onboarding niet voltooid</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vul uw bedrijfsgegevens en voorkeuren in om uw website te kunnen bouwen.
                  </p>
                  <Link href="/app/project">
                    <Button size="sm" className="gap-2" data-testid="button-continue-onboarding">
                      Doorgaan met onboarding
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
