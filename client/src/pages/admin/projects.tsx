import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  FolderKanban,
  Globe,
  Clock,
  Zap,
  CheckCircle2,
  Wrench,
  Loader2,
} from "lucide-react";
import type { Project, Plan, User } from "@shared/schema";

interface ProjectData {
  project: Project;
  customer: User;
  plan: Plan | null;
}

interface ProjectsResponse {
  projects: ProjectData[];
  total: number;
  statusCounts: {
    ONBOARDING: number;
    PRODUCTION: number;
    LIVE: number;
    MAINTENANCE: number;
  };
}

const statusConfig = {
  ONBOARDING: { label: "Onboarding", color: "bg-chart-4/20 text-chart-4", icon: Clock },
  PRODUCTION: { label: "In productie", color: "bg-chart-1/20 text-chart-1", icon: Zap },
  LIVE: { label: "Live", color: "bg-chart-2/20 text-chart-2", icon: CheckCircle2 },
  MAINTENANCE: { label: "Onderhoud", color: "bg-chart-5/20 text-chart-5", icon: Wrench },
};

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery<ProjectsResponse>({
    queryKey: ["/api/admin/projects"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/projects/${projectId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Status bijgewerkt",
        description: "De projectstatus is succesvol gewijzigd.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon de status niet bijwerken.",
        variant: "destructive",
      });
    },
  });

  const projects = data?.projects || [];
  const statusCounts = data?.statusCounts || { ONBOARDING: 0, PRODUCTION: 0, LIVE: 0, MAINTENANCE: 0 };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.project.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === "all" || p.project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (projectId: string, newStatus: string) => {
    updateStatusMutation.mutate({ projectId, status: newStatus });
  };

  return (
    <AppLayout
      title="Projecten"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projecten" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Projecten</h1>
          <p className="text-muted-foreground">
            Beheer alle klantprojecten en hun status.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(statusConfig).map(([key, config]) => {
            const IconComponent = config.icon;
            const count = statusCounts[key as keyof typeof statusCounts] || 0;
            return (
              <Card
                key={key}
                className={`border cursor-pointer transition-colors ${statusFilter === key ? "ring-2 ring-primary" : ""}`}
                onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-md flex items-center justify-center ${config.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{count}</div>
                      <div className="text-sm text-muted-foreground">{config.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op klant, e-mail of domein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-projects"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="select-status-filter">
                  <SelectValue placeholder="Alle statussen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Geen projecten gevonden" : "Nog geen projecten"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Domein</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((item) => {
                    const status = item.project.status || "ONBOARDING";
                    const statusInfo = statusConfig[status as keyof typeof statusConfig];
                    return (
                      <TableRow key={item.project.id} data-testid={`row-project-${item.project.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.customer.name}</div>
                            <div className="text-sm text-muted-foreground">{item.customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.plan?.name || "-"}</TableCell>
                        <TableCell>
                          {item.project.domain ? (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{item.project.domain}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusInfo?.color || "bg-muted"}>
                            {statusInfo?.label || status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={status}
                            onValueChange={(value) => handleStatusChange(item.project.id, value)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-36" data-testid={`select-status-${item.project.id}`}>
                              {updateStatusMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  {config.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
