import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Loader2,
  Globe,
  CreditCard,
  ExternalLink,
  PencilLine,
  Plus,
  ArrowLeft,
} from "lucide-react";
import type { User, CustomerProfile, Subscription, Plan, Project, AddOnSelection, AddOn, ChangeRequest } from "@shared/schema";

interface ClientDetail {
  user: Pick<User, "id" | "name" | "email" | "createdAt">;
  profile: CustomerProfile | null;
  subscription: (Subscription & { plan: Plan }) | null;
  project: Project | null;
  addOnSelections: (AddOnSelection & { addOn: AddOn })[];
  credits: { period: { start: string; end: string }; included: number; bonus: number; used: number; remaining: number };
  changeRequests: ChangeRequest[];
  totalChangeRequests: number;
}

const projectStatusLabels: Record<string, string> = {
  ONBOARDING: "Onboarding",
  PRODUCTION: "In productie",
  LIVE: "Live",
  MAINTENANCE: "Onderhoud",
};

const projectStatusColors: Record<string, string> = {
  ONBOARDING: "bg-chart-4/20 text-chart-4",
  PRODUCTION: "bg-chart-1/20 text-chart-1",
  LIVE: "bg-chart-2/20 text-chart-2",
  MAINTENANCE: "bg-chart-5/20 text-chart-5",
};

const requestStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Aangevraagd", className: "bg-chart-4/20 text-chart-4" },
  in_progress: { label: "In behandeling", className: "bg-chart-1/20 text-chart-1" },
  completed: { label: "Afgerond", className: "bg-chart-2/20 text-chart-2" },
  rejected: { label: "Afgewezen", className: "bg-destructive/20 text-destructive" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminClientDetailPage() {
  const [, params] = useRoute("/clients/:id");
  const clientId = params?.id;
  const { toast } = useToast();
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery<ClientDetail>({
    queryKey: ["/api/admin/clients", clientId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/clients/${clientId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Kon klant niet laden");
      return res.json();
    },
    enabled: !!clientId,
  });

  useEffect(() => {
    if (data) setNotes(data.profile?.adminNotes || "");
  }, [data?.profile?.adminNotes]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/admin/clients", clientId] });

  const bonusMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/clients/${clientId}/bonus-credit`),
    onSuccess: () => { invalidate(); toast({ title: "Bonus credit toegekend" }); },
    onError: () => toast({ title: "Toekennen mislukt", variant: "destructive" }),
  });

  const notesMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/admin/clients/${clientId}/notes`, { adminNotes: notes }),
    onSuccess: () => { invalidate(); toast({ title: "Notities opgeslagen" }); },
    onError: () => toast({ title: "Opslaan mislukt", variant: "destructive" }),
  });

  if (isLoading || !data) {
    return (
      <AppLayout title="Klant" breadcrumbs={[{ label: "Admin", href: "/" }, { label: "Klanten", href: "/customers" }, { label: "Detail" }]}>
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Laden…
        </div>
      </AppLayout>
    );
  }

  const { user, profile, subscription, project, addOnSelections, credits, changeRequests } = data;
  const statusInfo = project?.status ? { label: projectStatusLabels[project.status], className: projectStatusColors[project.status] } : null;

  return (
    <AppLayout
      title={user.name}
      breadcrumbs={[{ label: "Admin", href: "/" }, { label: "Klanten", href: "/customers" }, { label: user.name }]}
    >
      <div className="space-y-6">
        <Link href="/customers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Terug naar klanten
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold" data-testid="text-client-name">{user.name}</h1>
              {statusInfo ? (
                <Badge variant="secondary" className={statusInfo.className}>{statusInfo.label}</Badge>
              ) : (
                <Badge variant="secondary">Inactief</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {user.email}
              {profile?.companyName ? ` · ${profile.companyName}` : ""}
              {" · Lid sinds "}{formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Abonnement */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Abonnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {subscription ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subscription.plan.name}</span>
                    <span>€{(subscription.plan.monthlyPriceCents / 100).toFixed(0)}/mnd</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Billing status</span>
                    <Badge variant="secondary" className={subscription.status === "ACTIVE" ? "bg-chart-2/20 text-chart-2" : "bg-chart-4/20 text-chart-4"}>
                      {subscription.status === "ACTIVE" ? "Actief" : subscription.status}
                    </Badge>
                  </div>
                  {profile?.stripeCustomerId && (
                    <a
                      href={`https://dashboard.stripe.com/customers/${profile.stripeCustomerId}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1 mt-1" data-testid="button-stripe">
                        Bekijk in Stripe <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground mb-1">Actieve add-ons</p>
                    {addOnSelections.length ? (
                      <ul className="space-y-1">
                        {addOnSelections.map((sel) => (
                          <li key={sel.id} className="flex items-center justify-between">
                            <span>{sel.addOn.name}</span>
                            <span className="text-muted-foreground">€{(sel.addOn.monthlyPriceCents / 100).toFixed(0)}/mnd</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Geen add-ons</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Geen actief abonnement</p>
              )}
            </CardContent>
          </Card>

          {/* Credits */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><PencilLine className="h-4 w-4" /> Credits deze maand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-y-1">
                <span className="text-muted-foreground">Inbegrepen</span><span data-testid="text-credits-included">{credits.included}</span>
                <span className="text-muted-foreground">Bonus</span><span data-testid="text-credits-bonus">{credits.bonus}</span>
                <span className="text-muted-foreground">Gebruikt</span><span data-testid="text-credits-used">{credits.used}</span>
                <span className="text-muted-foreground">Resterend</span><span className="font-medium" data-testid="text-credits-remaining">{credits.remaining}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                disabled={bonusMutation.isPending}
                onClick={() => bonusMutation.mutate()}
                data-testid="button-bonus-credit"
              >
                {bonusMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Bonus credit toekennen
              </Button>
            </CardContent>
          </Card>

          {/* Project */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {project ? (
                <div className="grid grid-cols-2 gap-y-1">
                  <span className="text-muted-foreground">Domein</span>
                  <span>
                    {project.domain ? (
                      <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        {project.domain} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : "—"}
                  </span>
                  <span className="text-muted-foreground">Status</span>
                  <span>{statusInfo?.label || "—"}</span>
                  <span className="text-muted-foreground">Onboarding</span>
                  <span>{project.onboardingCompleted ? "Afgerond" : "Open"}</span>
                </div>
              ) : (
                <p className="text-muted-foreground">Geen project</p>
              )}
            </CardContent>
          </Card>

          {/* Notities */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">Interne notities</CardTitle>
              <CardDescription>Alleen zichtbaar voor admins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} data-testid="input-client-notes" />
              <Button size="sm" variant="outline" disabled={notesMutation.isPending} onClick={() => notesMutation.mutate()} data-testid="button-save-client-notes">
                {notesMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Opslaan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Wijzigingsgeschiedenis */}
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Wijzigingsgeschiedenis</CardTitle>
            <Link href="/changes" className="text-sm text-primary hover:underline">Volledige lijst</Link>
          </CardHeader>
          <CardContent>
            {changeRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nog geen wijzigingsverzoeken.</p>
            ) : (
              <div className="divide-y">
                {changeRequests.map((request) => {
                  const status = requestStatusConfig[request.status] ?? requestStatusConfig.pending;
                  return (
                    <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="font-medium text-sm leading-snug">{request.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {request.isPaidExtra && <Badge variant="outline">Extra credit</Badge>}
                        <Badge variant="secondary" className={status.className}>{status.label}</Badge>
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
