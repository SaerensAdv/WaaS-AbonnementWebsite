import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PencilLine, Loader2, Sparkles } from "lucide-react";
import type { ChangeRequest } from "@shared/schema";

interface CreditSummary {
  period: { start: string; end: string };
  included: number;
  bonus: number;
  used: number;
  remaining: number;
  extraCreditPrice: number;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Aangevraagd", className: "bg-chart-4/20 text-chart-4" },
  in_progress: { label: "In behandeling", className: "bg-chart-1/20 text-chart-1" },
  completed: { label: "Afgerond", className: "bg-chart-2/20 text-chart-2" },
  rejected: { label: "Afgewezen", className: "bg-destructive/20 text-destructive" },
};

function formatPeriod(start: string) {
  const date = new Date(start + "T00:00:00");
  const label = date.toLocaleDateString("nl-BE", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatDate(value: string | Date | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" });
}

export default function ChangesPage() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: credits, isLoading: creditsLoading } = useQuery<CreditSummary>({
    queryKey: ["/api/credits"],
  });

  const { data: history, isLoading: historyLoading } = useQuery<{ requests: ChangeRequest[] }>({
    queryKey: ["/api/credits/history"],
  });

  const total = credits ? credits.included + credits.bonus : 0;
  const remaining = credits?.remaining ?? 0;
  const used = credits?.used ?? 0;
  const noCredits = !!credits && remaining <= 0;
  const extraPrice = credits ? `€${(credits.extraCreditPrice / 100).toFixed(0)}` : "€29";

  const onSuccess = () => {
    setTitle("");
    setDescription("");
    queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
    queryClient.invalidateQueries({ queryKey: ["/api/credits/history"] });
    toast({ title: "Wijziging aangevraagd", description: "We gaan er zo snel mogelijk mee aan de slag." });
  };

  const onError = async (error: Error) => {
    toast({
      title: "Aanvragen mislukt",
      description: error.message.replace(/^\d+:\s*/, "").replace(/^\{.*"message":"([^"]+)".*\}$/, "$1"),
      variant: "destructive",
    });
  };

  const requestMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/credits/request", { title, description: description || undefined }),
    onSuccess,
    onError,
  });

  const requestExtraMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/credits/request-extra", { title, description: description || undefined }),
    onSuccess,
    onError,
  });

  const isSubmitting = requestMutation.isPending || requestExtraMutation.isPending;
  const canSubmit = title.trim().length >= 3 && !isSubmitting;

  return (
    <AppLayout title="Wijzigingen" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Wijzigingen" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Wijzigingen</h1>
          <p className="text-muted-foreground">
            Vraag aanpassingen aan uw website aan met uw maandelijkse wijzigingscredits.
          </p>
        </div>

        {/* Credit-status */}
        <Card className="border" data-testid="card-credit-status">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">Wijzigingscredits deze maand</CardTitle>
              {credits && (
                <span className="text-sm text-muted-foreground" data-testid="text-credit-period">
                  {formatPeriod(credits.period.start)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {creditsLoading || !credits ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Laden…
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-2xl font-semibold" data-testid="text-credits-remaining">
                      {remaining} {remaining === 1 ? "credit" : "credits"} beschikbaar
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {used} van {total} credits gebruikt · Credits vervallen aan het einde van de maand
                    </p>
                  </div>
                </div>
                <Progress value={total > 0 ? (used / total) * 100 : 0} className="h-2" />
                {noCredits && (
                  <p className="text-sm text-muted-foreground">
                    Geen credits meer deze maand. U kunt hieronder een wijziging aanvragen als extra credit ({extraPrice}).
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nieuwe wijziging aanvragen */}
        <Card className="border" data-testid="card-new-request">
          <CardHeader>
            <CardTitle className="text-base">Nieuwe wijziging aanvragen</CardTitle>
            <CardDescription>
              1 credit = 1 wijzigingsverzoek: tekst, afbeelding of een kleine layout-update.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit) return;
                if (noCredits) {
                  requestExtraMutation.mutate();
                } else {
                  requestMutation.mutate();
                }
              }}
            >
              <div className="space-y-1.5">
                <label htmlFor="change-title" className="text-sm font-medium">
                  Titel <span className="text-destructive">*</span>
                </label>
                <Input
                  id="change-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Wat wilt u wijzigen?"
                  maxLength={200}
                  required
                  data-testid="input-change-title"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="change-description" className="text-sm font-medium">
                  Beschrijving
                </label>
                <Textarea
                  id="change-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Geef zoveel detail als mogelijk. Welke pagina? Welke tekst/afbeelding? Wat moet het worden?"
                  rows={4}
                  maxLength={5000}
                  data-testid="input-change-description"
                />
              </div>

              {noCredits ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button type="submit" disabled={!canSubmit} className="gap-2" data-testid="button-request-extra">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Aanvragen als extra credit ({extraPrice})
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    De extra credit wordt achteraf gefactureerd.
                  </p>
                </div>
              ) : (
                <Button type="submit" disabled={!canSubmit || !credits} className="gap-2" data-testid="button-request-change">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Wijziging aanvragen
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Mijn wijzigingen */}
        <Card className="border" data-testid="card-request-history">
          <CardHeader>
            <CardTitle className="text-base">Mijn wijzigingen</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Laden…
              </div>
            ) : !history?.requests?.length ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <PencilLine className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="max-w-sm text-sm text-muted-foreground" data-testid="text-empty-state">
                  Nog geen wijzigingen aangevraagd. Gebruik je credits om teksten, afbeeldingen of kleine
                  aanpassingen te laten doen.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {history.requests.map((request) => {
                  const status = statusConfig[request.status] ?? statusConfig.pending;
                  return (
                    <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0" data-testid={`request-${request.id}`}>
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{request.title}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(request.createdAt)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {request.isPaidExtra && (
                          <Badge variant="outline" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            Extra credit
                          </Badge>
                        )}
                        <Badge variant="secondary" className={status.className}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
