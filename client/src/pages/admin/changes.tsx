import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Play, CheckCircle2, XCircle, PencilLine, User as UserIcon, Sparkles } from "lucide-react";
import type { ChangeRequest } from "@shared/schema";

interface AdminChange {
  request: ChangeRequest;
  customer: { id: string; name: string; email: string };
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Aangevraagd", className: "bg-chart-4/20 text-chart-4" },
  in_progress: { label: "In behandeling", className: "bg-chart-1/20 text-chart-1" },
  completed: { label: "Afgerond", className: "bg-chart-2/20 text-chart-2" },
  rejected: { label: "Afgewezen", className: "bg-destructive/20 text-destructive" },
};

const filters = [
  { value: "pending", label: "Aangevraagd" },
  { value: "in_progress", label: "In behandeling" },
  { value: "completed", label: "Afgerond" },
  { value: "rejected", label: "Afgewezen" },
  { value: "all", label: "Alle" },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminChangesPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selected, setSelected] = useState<AdminChange | null>(null);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery<{ changes: AdminChange[] }>({
    queryKey: ["/api/admin/changes"],
  });

  const { data: stats } = useQuery<{ pendingChanges: number; inProgressChanges: number; completedChangesThisMonth: number; creditsUsedThisMonth: number }>({
    queryKey: ["/api/admin/stats"],
  });

  const changes = data?.changes || [];
  const filtered = statusFilter === "all" ? changes : changes.filter((c) => c.request.status === statusFilter);

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status?: string; adminNotes?: string } }) =>
      apiRequest("PATCH", `/api/admin/changes/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/changes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Bijgewerkt" });
    },
    onError: () => toast({ title: "Bijwerken mislukt", variant: "destructive" }),
  });

  const setStatus = (id: string, status: string) => updateMutation.mutate({ id, body: { status } });

  const statCards = [
    { label: "Openstaand", value: stats?.pendingChanges ?? "—" },
    { label: "In behandeling", value: stats?.inProgressChanges ?? "—" },
    { label: "Afgerond deze maand", value: stats?.completedChangesThisMonth ?? "—" },
    { label: "Credits gebruikt deze maand", value: stats?.creditsUsedThisMonth ?? "—" },
  ];

  return (
    <AppLayout title="Wijzigingen" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Wijzigingen" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Wijzigingsverzoeken</h1>
          <p className="text-muted-foreground">Beheer alle wijzigingsaanvragen van klanten.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label} className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="flex-wrap h-auto">
                {filters.map((f) => (
                  <TabsTrigger key={f.value} value={f.value} data-testid={`filter-${f.value}`}>
                    {f.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Laden…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <PencilLine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Geen wijzigingsverzoeken in deze weergave.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Klant</TableHead>
                      <TableHead>Titel</TableHead>
                      <TableHead>Aangevraagd op</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(({ request, customer }) => {
                      const status = statusConfig[request.status] ?? statusConfig.pending;
                      return (
                        <TableRow
                          key={request.id}
                          className="cursor-pointer"
                          onClick={() => { setSelected({ request, customer }); setNotes(request.adminNotes || ""); }}
                          data-testid={`row-change-${request.id}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-[10px]">{getInitials(customer.name)}</AvatarFallback>
                              </Avatar>
                              <span className="whitespace-nowrap">{customer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[280px] truncate font-medium">{request.title}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {request.isPaidExtra ? (
                              <Badge variant="outline" className="gap-1 whitespace-nowrap"><Sparkles className="h-3 w-3" />Extra credit</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">Inbegrepen</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              {request.status === "pending" && (
                                <Button size="sm" variant="outline" className="gap-1" onClick={() => setStatus(request.id, "in_progress")} data-testid={`button-start-${request.id}`}>
                                  <Play className="h-3.5 w-3.5" /> Start
                                </Button>
                              )}
                              {(request.status === "pending" || request.status === "in_progress") && (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1" onClick={() => setStatus(request.id, "completed")} data-testid={`button-complete-${request.id}`}>
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Afronden
                                  </Button>
                                  <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => setStatus(request.id, "rejected")} data-testid={`button-reject-${request.id}`}>
                                    <XCircle className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.request.title}</DialogTitle>
                <DialogDescription>
                  Aangevraagd op {formatDate(selected.request.createdAt)} · {selected.request.creditsUsed} credit
                  {selected.request.isPaidExtra ? " · Extra credit (€29)" : " · Inbegrepen"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/clients/${selected.customer.id}`}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    data-testid="link-client-profile"
                  >
                    <UserIcon className="h-4 w-4" />
                    {selected.customer.name} ({selected.customer.email})
                  </Link>
                  <Badge variant="secondary" className={(statusConfig[selected.request.status] ?? statusConfig.pending).className}>
                    {(statusConfig[selected.request.status] ?? statusConfig.pending).label}
                  </Badge>
                </div>
                {selected.request.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.request.description}</p>
                )}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="admin-notes">Admin notities</label>
                  <Textarea id="admin-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} data-testid="input-admin-notes" />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: selected.request.id, body: { adminNotes: notes } })}
                    data-testid="button-save-notes"
                  >
                    Notities opslaan
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {selected.request.status !== "in_progress" && selected.request.status !== "completed" && (
                    <Button size="sm" className="gap-1" onClick={() => { setStatus(selected.request.id, "in_progress"); setSelected(null); }}>
                      <Play className="h-3.5 w-3.5" /> Start
                    </Button>
                  )}
                  {selected.request.status !== "completed" && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => { setStatus(selected.request.id, "completed"); setSelected(null); }}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Afronden
                    </Button>
                  )}
                  {selected.request.status !== "rejected" && (
                    <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => { setStatus(selected.request.id, "rejected"); setSelected(null); }}>
                      <XCircle className="h-3.5 w-3.5" /> Afwijzen
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
