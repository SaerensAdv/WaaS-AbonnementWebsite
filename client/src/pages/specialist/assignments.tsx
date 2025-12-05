import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  ClipboardList,
  CheckCircle2,
  Clock,
  Building2,
  Globe,
  Euro,
  Loader2,
} from "lucide-react";
import type { Assignment, AddOnSelection, AddOn, User, Project } from "@shared/schema";

interface AssignmentData {
  assignment: Assignment;
  addOnSelection: AddOnSelection & { addOn: AddOn };
  customer: User;
  project: Project | null;
}

interface AssignmentsResponse {
  assignments: AssignmentData[];
}

const statusLabels: Record<string, string> = {
  PROPOSED: "Voorgesteld",
  ACTIVE: "Actief",
  ENDED: "Beëindigd",
};

const statusColors: Record<string, string> = {
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

export default function SpecialistAssignmentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const { data, isLoading } = useQuery<AssignmentsResponse>({
    queryKey: ["/api/specialist/assignments"],
  });

  const acceptMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const response = await apiRequest("PUT", `/api/specialist/assignments/${assignmentId}/accept`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/dashboard"] });
      toast({
        title: "Toewijzing geaccepteerd",
        description: "U kunt nu beginnen met dit account.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon toewijzing niet accepteren.",
        variant: "destructive",
      });
    },
  });

  const assignments = data?.assignments || [];

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.addOnSelection.addOn.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && a.assignment.status === "ACTIVE") ||
      (activeTab === "proposed" && a.assignment.status === "PROPOSED") ||
      (activeTab === "ended" && a.assignment.status === "ENDED");

    return matchesSearch && matchesTab;
  });

  const proposedCount = assignments.filter((a) => a.assignment.status === "PROPOSED").length;
  const activeCount = assignments.filter((a) => a.assignment.status === "ACTIVE").length;

  return (
    <AppLayout
      title="Toewijzingen"
      breadcrumbs={[{ label: "Specialist", href: "/specialist" }, { label: "Toewijzingen" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mijn Toewijzingen</h1>
          <p className="text-muted-foreground">
            Beheer uw toegewezen klantaccounts.
          </p>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op klant of add-on..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-assignments"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="active" className="gap-2">
                  Actief
                  {activeCount > 0 && (
                    <Badge variant="secondary" className="ml-1">{activeCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="proposed" className="gap-2">
                  Voorstellen
                  {proposedCount > 0 && (
                    <Badge variant="secondary" className="bg-chart-4/20 text-chart-4 ml-1">
                      {proposedCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="ended">Beëindigd</TabsTrigger>
                <TabsTrigger value="all">Alle</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "Geen toewijzingen gevonden" : "Geen toewijzingen in deze categorie"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssignments.map((item) => (
                      <Card key={item.assignment.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-medium">{item.customer.name}</h3>
                                <Badge
                                  variant="secondary"
                                  className={statusColors[item.assignment.status]}
                                >
                                  {statusLabels[item.assignment.status]}
                                </Badge>
                                <Badge variant="outline">{item.addOnSelection.addOn.name}</Badge>
                              </div>

                              <div className="grid gap-2 text-sm text-muted-foreground">
                                {item.project?.domain && (
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    {item.project.domain}
                                  </div>
                                )}
                                {item.addOnSelection.totalBudgetCents && (
                                  <div className="flex items-center gap-2">
                                    <Euro className="h-4 w-4" />
                                    Totaal: {formatPrice(item.addOnSelection.totalBudgetCents)}/mnd
                                    {item.addOnSelection.mediaBudgetCents && (
                                      <>
                                        {" | "}Media: {formatPrice(item.addOnSelection.mediaBudgetCents)}
                                        {" | "}Beheer: {formatPrice(item.addOnSelection.managementBudgetCents || 0)}
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              {item.assignment.status === "PROPOSED" && (
                                <Button
                                  onClick={() => acceptMutation.mutate(item.assignment.id)}
                                  disabled={acceptMutation.isPending}
                                  data-testid={`button-accept-${item.assignment.id}`}
                                >
                                  {acceptMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                  )}
                                  Accepteren
                                </Button>
                              )}
                              {item.assignment.status === "ACTIVE" && (
                                <Button variant="outline" data-testid={`button-view-${item.assignment.id}`}>
                                  Bekijk details
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
