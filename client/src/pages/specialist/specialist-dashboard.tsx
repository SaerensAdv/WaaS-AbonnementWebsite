import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  ClipboardList,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  UserCog,
} from "lucide-react";
import type { Assignment, AddOnSelection, AddOn, User } from "@shared/schema";

interface SpecialistStats {
  totalAssignments: number;
  activeAssignments: number;
  proposedAssignments: number;
  reportsThisMonth: number;
  profile: {
    approved: boolean;
    skills: string[];
    capacity: number;
  } | null;
}

interface AssignmentData {
  assignment: Assignment;
  addOnSelection: AddOnSelection & { addOn: AddOn };
  customer: User;
}

interface SpecialistDashboardData {
  stats: SpecialistStats;
  recentAssignments: AssignmentData[];
}

const statusColors = {
  PROPOSED: "bg-chart-4/20 text-chart-4",
  ACTIVE: "bg-chart-2/20 text-chart-2",
  ENDED: "bg-muted text-muted-foreground",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default function SpecialistDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<SpecialistDashboardData>({
    queryKey: ["/api/specialist/dashboard"],
  });

  const stats = data?.stats;
  const recentAssignments = data?.recentAssignments || [];
  const isApproved = stats?.profile?.approved;

  return (
    <AppLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Specialist" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-specialist-welcome">
            Welkom terug, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Hier is een overzicht van uw toewijzingen en taken.
          </p>
        </div>

        {!isApproved && !isLoading && (
          <Card className="border border-chart-4/50 bg-chart-4/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-md bg-chart-4/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <h3 className="font-medium">Wachtend op goedkeuring</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uw specialistenprofiel wordt beoordeeld door een beheerder. 
                    U ontvangt een e-mail zodra uw account is goedgekeurd.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Toewijzingen</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-semibold">{stats?.activeAssignments || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Nieuwe Voorstellen</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold">{stats?.proposedAssignments || 0}</span>
                  {(stats?.proposedAssignments || 0) > 0 && (
                    <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">Nieuw</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Rapporten deze maand</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-semibold">{stats?.reportsThisMonth || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Capaciteit</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold">
                  {stats?.totalAssignments || 0}
                  <span className="text-base font-normal text-muted-foreground">
                    /{stats?.profile?.capacity || 5}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border">
            <CardHeader>
              <CardTitle>Recente Toewijzingen</CardTitle>
              <CardDescription>
                Uw meest recente klantaccounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentAssignments.length === 0 ? (
                <div className="text-center py-6">
                  <ClipboardList className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nog geen toewijzingen
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAssignments.map((item) => (
                    <div
                      key={item.assignment.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-md border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {item.customer.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className={statusColors[item.assignment.status as keyof typeof statusColors]}
                          >
                            {item.assignment.status === "PROPOSED" && "Nieuw"}
                            {item.assignment.status === "ACTIVE" && "Actief"}
                            {item.assignment.status === "ENDED" && "Beëindigd"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.addOnSelection.addOn.name}
                          {item.addOnSelection.totalBudgetCents && (
                            <> | {formatPrice(item.addOnSelection.totalBudgetCents)}/mnd</>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle>Snelle acties</CardTitle>
              <CardDescription>
                Veelgebruikte taken en pagina's
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/specialist/assignments">
                <Button variant="outline" className="w-full justify-between" data-testid="link-assignments">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Bekijk alle toewijzingen
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/specialist/reports">
                <Button variant="outline" className="w-full justify-between" data-testid="link-reports">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Rapporten maken
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/specialist/profile">
                <Button variant="outline" className="w-full justify-between" data-testid="link-profile">
                  <span className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    Mijn profiel bewerken
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
