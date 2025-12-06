import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Image,
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

const industryOptions = [
  "Horeca",
  "Retail",
  "Bouw",
  "Zorg",
  "Dienstverlening",
  "Creatief",
  "Tech",
  "Overig",
];

const optInOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "DECLINED", label: "Declined" },
  { value: "REVOKED", label: "Revoked" },
];

interface ShowcaseFormValues {
  publicUrl: string;
  showcaseTitle: string;
  showcaseDescription: string;
  showcaseIndustry: string;
  showcaseThumbnailUrl: string;
  showcaseOptIn: string;
  showcaseFeatured: boolean;
  launchedAt: string;
}

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showcaseSheetOpen, setShowcaseSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const form = useForm<ShowcaseFormValues>({
    defaultValues: {
      publicUrl: "",
      showcaseTitle: "",
      showcaseDescription: "",
      showcaseIndustry: "",
      showcaseThumbnailUrl: "",
      showcaseOptIn: "PENDING",
      showcaseFeatured: false,
      launchedAt: "",
    },
  });

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

  const updateShowcaseMutation = useMutation({
    mutationFn: async ({ projectId, data }: { projectId: string; data: ShowcaseFormValues }) => {
      const response = await apiRequest("PATCH", `/api/admin/projects/${projectId}/showcase`, {
        publicUrl: data.publicUrl || null,
        showcaseTitle: data.showcaseTitle || null,
        showcaseDescription: data.showcaseDescription || null,
        showcaseIndustry: data.showcaseIndustry || null,
        showcaseThumbnailUrl: data.showcaseThumbnailUrl || null,
        showcaseOptIn: data.showcaseOptIn,
        showcaseFeatured: data.showcaseFeatured,
        launchedAt: data.launchedAt || null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setShowcaseSheetOpen(false);
      setSelectedProject(null);
      toast({
        title: "Showcase instellingen opgeslagen",
        description: "De showcase instellingen zijn succesvol bijgewerkt.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon de showcase instellingen niet opslaan.",
        variant: "destructive",
      });
    },
  });

  const openShowcaseSheet = (projectData: ProjectData) => {
    setSelectedProject(projectData);
    const project = projectData.project;
    form.reset({
      publicUrl: project.publicUrl || "",
      showcaseTitle: project.showcaseTitle || "",
      showcaseDescription: project.showcaseDescription || "",
      showcaseIndustry: project.showcaseIndustry || "",
      showcaseThumbnailUrl: project.showcaseThumbnailUrl || "",
      showcaseOptIn: project.showcaseOptIn || "PENDING",
      showcaseFeatured: project.showcaseFeatured || false,
      launchedAt: project.launchedAt ? new Date(project.launchedAt).toISOString().split("T")[0] : "",
    });
    setShowcaseSheetOpen(true);
  };

  const onShowcaseSubmit = (values: ShowcaseFormValues) => {
    if (!selectedProject) return;
    updateShowcaseMutation.mutate({ projectId: selectedProject.project.id, data: values });
  };

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
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openShowcaseSheet(item)}
                              data-testid={`button-showcase-${item.project.id}`}
                            >
                              <Image className="h-4 w-4" />
                            </Button>
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
                          </div>
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

      <Sheet open={showcaseSheetOpen} onOpenChange={setShowcaseSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Showcase Instellingen</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onShowcaseSubmit)} className="space-y-4 mt-6">
              <FormField
                control={form.control}
                name="publicUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        data-testid="input-showcase-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showcaseTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Project title"
                        {...field}
                        data-testid="input-showcase-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showcaseDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short description of the project"
                        {...field}
                        data-testid="input-showcase-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showcaseIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Industry</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-showcase-industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industryOptions.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showcaseThumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        data-testid="input-showcase-thumbnail"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showcaseOptIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Opt-In</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-showcase-optin">
                          <SelectValue placeholder="Select opt-in status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {optInOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showcaseFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Highlight this project on the public page
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-showcase-featured"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="launchedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Launched At</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        data-testid="input-showcase-launched"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowcaseSheetOpen(false)}
                  className="flex-1"
                >
                  Annuleren
                </Button>
                <Button
                  type="submit"
                  disabled={updateShowcaseMutation.isPending}
                  className="flex-1"
                  data-testid="button-showcase-save"
                >
                  {updateShowcaseMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Opslaan"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
