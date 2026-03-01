import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  Globe,
  Puzzle,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ExternalLink,
} from "lucide-react";
import type { Project, Subscription, Plan, AddOnSelection, AddOn } from "@shared/schema";

const statusConfig = {
  ONBOARDING: { label: "Onboarding", color: "bg-chart-4/20 text-chart-4", icon: Clock },
  PRODUCTION: { label: "In productie", color: "bg-chart-1/20 text-chart-1", icon: Zap },
  LIVE: { label: "Live", color: "bg-chart-2/20 text-chart-2", icon: CheckCircle2 },
  MAINTENANCE: { label: "Onderhoud", color: "bg-chart-5/20 text-chart-5", icon: AlertCircle },
};

interface DashboardData {
  project: Project | null;
  subscription: (Subscription & { plan: Plan }) | null;
  addOnSelections: (AddOnSelection & { addOn: AddOn })[];
}

export default function CustomerDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const project = data?.project;
  const subscription = data?.subscription;
  const addOnCount = data?.addOnSelections?.length || 0;
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

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Website Status</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : statusInfo ? (
                <Badge variant="secondary" className={statusInfo.color}>
                  <statusInfo.icon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Geen project</span>
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
              ) : subscription ? (
                <div>
                  <span className="font-semibold">{subscription.plan.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    €{(subscription.plan.monthlyPriceCents / 100).toFixed(0)}/mo
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Geen abonnement</span>
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
                <div className="text-2xl font-semibold" data-testid="text-addon-count">{addOnCount}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {project?.domain && (
            <Card className="border">
              <CardHeader>
                <CardTitle>Uw Website</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{project.domain}</span>
                  {project.status === "LIVE" && (
                    <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border">
            <CardHeader>
              <CardTitle>Add-ons</CardTitle>
              <CardDescription>
                Versterk uw online aanwezigheid met extra diensten
              </CardDescription>
            </CardHeader>
            <CardContent>
              {addOnCount > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {data?.addOnSelections?.map((sel) => (
                      <div key={sel.id} className="flex items-center justify-between text-sm">
                        <span>{sel.addOn.name}</span>
                        <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">Actief</Badge>
                      </div>
                    ))}
                  </div>
                  <Link href="/app/addons">
                    <Button variant="outline" className="w-full gap-2" data-testid="button-manage-addons">
                      Beheer add-ons
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Voeg Google Ads, SEO of andere diensten toe.
                  </p>
                  <Link href="/app/addons">
                    <Button variant="outline" className="w-full gap-2" data-testid="button-explore-addons">
                      Ontdek add-ons
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle>Facturatie</CardTitle>
              <CardDescription>
                Beheer uw betalingen en facturen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/billing">
                <Button variant="outline" className="w-full gap-2" data-testid="button-view-billing">
                  Bekijk facturatie
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {!subscription && (
          <Card className="border border-primary/50 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Start met uw website</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kies een plan om uw professionele website te laten bouwen.
                  </p>
                  <Link href="/#pricing">
                    <Button size="sm" className="gap-2" data-testid="button-choose-plan">
                      Kies een plan
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
