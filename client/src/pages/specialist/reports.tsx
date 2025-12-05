import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  FileText,
  Plus,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { Assignment, AddOnSelection, AddOn, User, Report } from "@shared/schema";

interface AssignmentData {
  assignment: Assignment;
  addOnSelection: AddOnSelection & { addOn: AddOn };
  customer: User;
}

interface ReportData {
  report: Report;
  assignment: AssignmentData;
}

interface ReportsResponse {
  reports: ReportData[];
  assignments: AssignmentData[];
}

const reportSchema = z.object({
  assignmentId: z.string().min(1, "Selecteer een toewijzing"),
  month: z.string().min(1, "Selecteer een maand"),
  summaryText: z.string().min(10, "Samenvatting moet minstens 10 karakters bevatten"),
  dashboardUrl: z.string().url("Voer een geldige URL in").optional().or(z.literal("")),
  impressions: z.string().optional(),
  clicks: z.string().optional(),
  conversions: z.string().optional(),
  spend: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const typeLabels: Record<string, string> = {
  GOOGLE_ADS: "Google Ads",
  META: "Meta Ads",
  SEO: "SEO",
  WEBSITE: "Website",
};

function formatMonth(month: string): string {
  const [year, monthNum] = month.split("-");
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getLastMonths(count: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export default function SpecialistReportsPage() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQuery<ReportsResponse>({
    queryKey: ["/api/specialist/reports"],
  });

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      assignmentId: "",
      month: getCurrentMonth(),
      summaryText: "",
      dashboardUrl: "",
      impressions: "",
      clicks: "",
      conversions: "",
      spend: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      const assignment = assignments.find((a) => a.assignment.id === data.assignmentId);
      const kpiData: Record<string, number> = {};
      if (data.impressions) kpiData.impressions = parseInt(data.impressions);
      if (data.clicks) kpiData.clicks = parseInt(data.clicks);
      if (data.conversions) kpiData.conversions = parseInt(data.conversions);
      if (data.spend) kpiData.spend = parseFloat(data.spend);

      const response = await apiRequest("POST", "/api/specialist/reports", {
        projectId: assignment?.addOnSelection.projectId,
        month: data.month,
        type: assignment?.addOnSelection.addOn.slug === "google-ads" ? "GOOGLE_ADS" : 
              assignment?.addOnSelection.addOn.slug === "meta-ads" ? "META" : "SEO",
        summaryText: data.summaryText,
        dashboardUrl: data.dashboardUrl || null,
        kpiData: Object.keys(kpiData).length > 0 ? kpiData : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/dashboard"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Rapport aangemaakt",
        description: "Het rapport is zichtbaar voor de klant.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon rapport niet aanmaken.",
        variant: "destructive",
      });
    },
  });

  const reports = data?.reports || [];
  const assignments = data?.assignments || [];
  const activeAssignments = assignments.filter((a) => a.assignment.status === "ACTIVE");
  const months = getLastMonths(6);

  const onSubmit = (data: ReportFormData) => {
    createMutation.mutate(data);
  };

  return (
    <AppLayout
      title="Rapporten"
      breadcrumbs={[{ label: "Specialist", href: "/specialist" }, { label: "Rapporten" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Rapporten</h1>
            <p className="text-muted-foreground">
              Maak maandelijkse rapporten voor uw klanten.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} data-testid="button-create-report">
            <Plus className="h-4 w-4 mr-2" />
            Nieuw rapport
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <Card className="border">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nog geen rapporten</h2>
              <p className="text-muted-foreground mb-6">
                Maak uw eerste rapport aan voor een van uw actieve toewijzingen.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nieuw rapport
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((item) => (
              <Card key={item.report.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatMonth(item.report.month)}</span>
                        <Badge variant="outline">
                          {typeLabels[item.report.type] || item.report.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Klant: {item.assignment.customer.name}
                      </p>
                      {item.report.summaryText && (
                        <p className="text-sm line-clamp-2">{item.report.summaryText}</p>
                      )}
                    </div>
                    {item.report.dashboardUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.report.dashboardUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Dashboard
                        </a>
                      </Button>
                    )}
                  </div>

                  {item.report.kpiData && typeof item.report.kpiData === "object" && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(item.report.kpiData as Record<string, any>).map(([key, value]) => (
                          <div key={key} className="text-center p-2 rounded-md bg-muted/50">
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace(/_/g, " ")}
                            </div>
                            <div className="font-semibold font-mono">
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nieuw rapport aanmaken</DialogTitle>
              <DialogDescription>
                Maak een maandelijks prestatierapport voor een klant.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="assignmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toewijzing</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-assignment">
                            <SelectValue placeholder="Selecteer een klant..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAssignments.map((a) => (
                            <SelectItem key={a.assignment.id} value={a.assignment.id}>
                              {a.customer.name} - {a.addOnSelection.addOn.name}
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
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maand</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-month">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {formatMonth(month)}
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
                  name="summaryText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Samenvatting</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beschrijf de prestaties van deze maand..."
                          rows={4}
                          data-testid="input-summary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dashboardUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dashboard URL (optioneel)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://lookerstudio.google.com/..."
                          data-testid="input-dashboard-url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="impressions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impressies</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clicks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clicks</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="conversions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conversies</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uitgaven</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-report">
                    {createMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Rapport aanmaken
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
