import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, FileText, ExternalLink, ClipboardList } from "lucide-react";
import type { QuoteRequest } from "@shared/schema";

const statusConfig: Record<string, { label: string; className: string }> = {
  NEW: { label: "Nieuw", className: "bg-chart-4/20 text-chart-4" },
  CONTACTED: { label: "Gecontacteerd", className: "bg-chart-1/20 text-chart-1" },
  QUOTED: { label: "Offerte verstuurd", className: "bg-chart-5/20 text-chart-5" },
  ACCEPTED: { label: "Geaccepteerd", className: "bg-chart-2/20 text-chart-2" },
  DECLINED: { label: "Afgewezen", className: "bg-destructive/20 text-destructive" },
};

const statusOptions = Object.entries(statusConfig).map(([value, cfg]) => ({ value, label: cfg.label }));

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
}

const detailLabels: Record<string, string> = {
  stylePreference: "Stijlvoorkeur",
  features: "Gewenste functies",
  languages: "Talen",
  pageCount: "Aantal pagina's",
  deadline: "Deadline",
  inspiration: "Inspiratie",
};

export default function AdminQuotesPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery<{ quotes: QuoteRequest[] }>({
    queryKey: ["/api/admin/quotes"],
  });

  const quotes = data?.quotes || [];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonth = quotes.filter((q) => q.createdAt && new Date(q.createdAt) >= monthStart);
  const accepted = quotes.filter((q) => q.status === "ACCEPTED").length;
  const conversion = quotes.length ? Math.round((accepted / quotes.length) * 100) : 0;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status?: string; adminNotes?: string } }) =>
      apiRequest("PATCH", `/api/admin/quotes/${id}`, body),
    onSuccess: () => { invalidate(); toast({ title: "Offerte bijgewerkt" }); },
    onError: () => toast({ title: "Bijwerken mislukt", variant: "destructive" }),
  });

  const clickupMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/quotes/${id}/clickup`),
    onSuccess: () => { invalidate(); toast({ title: "ClickUp taak aangemaakt" }); },
    onError: () => toast({ title: "ClickUp taak aanmaken mislukt", variant: "destructive" }),
  });

  const statCards = [
    { label: "Nieuw (onbehandeld)", value: quotes.filter((q) => q.status === "NEW").length },
    { label: "Totaal deze maand", value: thisMonth.length },
    { label: "Conversie", value: `${conversion}%` },
  ];

  const details = (selected?.details ?? null) as Record<string, unknown> | null;

  return (
    <AppLayout title="Offertes" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Offertes" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Offerte-aanvragen</h1>
          <p className="text-muted-foreground">Alle maatwerk-aanvragen via het offerteformulier.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((s) => (
            <Card key={s.label} className="border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{s.label}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-semibold">{s.value}</div></CardContent>
            </Card>
          ))}
        </div>

        <Card className="border">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Laden…
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nog geen offerte-aanvragen.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bedrijf</TableHead>
                      <TableHead>Contactpersoon</TableHead>
                      <TableHead>Type project</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead className="text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => {
                      const status = statusConfig[quote.status || "NEW"] ?? statusConfig.NEW;
                      return (
                        <TableRow
                          key={quote.id}
                          className="cursor-pointer"
                          onClick={() => { setSelected(quote); setNotes(quote.adminNotes || ""); }}
                          data-testid={`row-quote-${quote.id}`}
                        >
                          <TableCell className="font-medium">{quote.companyName}</TableCell>
                          <TableCell>
                            <div>{quote.contactName}</div>
                            <div className="text-sm text-muted-foreground">{quote.email}</div>
                          </TableCell>
                          <TableCell>{quote.projectType}</TableCell>
                          <TableCell>{quote.budgetRange || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell><Badge variant="secondary" className={status.className}>{status.label}</Badge></TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(quote.createdAt)}</TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end items-center gap-2">
                              <Select
                                value={quote.status || "NEW"}
                                onValueChange={(status) => updateMutation.mutate({ id: quote.id, body: { status } })}
                              >
                                <SelectTrigger className="w-[160px] h-8" data-testid={`select-status-${quote.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              {!quote.clickupTaskId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  disabled={clickupMutation.isPending}
                                  onClick={() => clickupMutation.mutate(quote.id)}
                                  data-testid={`button-clickup-${quote.id}`}
                                >
                                  <ClipboardList className="h-3.5 w-3.5" /> ClickUp
                                </Button>
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.companyName}</DialogTitle>
                <DialogDescription>
                  Aangevraagd op {formatDate(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div><span className="text-muted-foreground">Contact:</span> {selected.contactName}</div>
                  <div><span className="text-muted-foreground">E-mail:</span> {selected.email}</div>
                  {selected.phone && <div><span className="text-muted-foreground">Telefoon:</span> {selected.phone}</div>}
                  <div><span className="text-muted-foreground">Type:</span> {selected.projectType}</div>
                  {selected.budgetRange && <div><span className="text-muted-foreground">Budget:</span> {selected.budgetRange}</div>}
                  {selected.currentWebsite && (
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="text-muted-foreground">Huidige website:</span>
                      <a href={selected.currentWebsite.startsWith("http") ? selected.currentWebsite : `https://${selected.currentWebsite}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        {selected.currentWebsite} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Beschrijving</p>
                  <p className="whitespace-pre-wrap">{selected.description}</p>
                </div>
                {details && Object.keys(details).length > 0 && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Details</p>
                    {Object.entries(details).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{detailLabels[key] || key}:</span>{" "}
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="font-medium" htmlFor="quote-status">Status</label>
                  <Select
                    value={selected.status || "NEW"}
                    onValueChange={(status) => {
                      updateMutation.mutate({ id: selected.id, body: { status } });
                      setSelected({ ...selected, status: status as QuoteRequest["status"] });
                    }}
                  >
                    <SelectTrigger id="quote-status" data-testid="select-detail-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium" htmlFor="quote-notes">Interne notities</label>
                  <Textarea id="quote-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} data-testid="input-quote-notes" />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: selected.id, body: { adminNotes: notes } })}
                    data-testid="button-save-quote-notes"
                  >
                    Notities opslaan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
