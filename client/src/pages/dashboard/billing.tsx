import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  CreditCard,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Euro,
} from "lucide-react";
import type { Subscription, Plan } from "@shared/schema";

interface BillingData {
  subscription: (Subscription & { plan: Plan }) | null;
  upcomingInvoice?: {
    amount: number;
    dueDate: string;
  };
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: string | Date | null): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statusConfig = {
  ACTIVE: { label: "Actief", color: "bg-chart-2/20 text-chart-2", icon: CheckCircle2 },
  PAST_DUE: { label: "Achterstallig", color: "bg-destructive/20 text-destructive", icon: AlertCircle },
  CANCELED: { label: "Geannuleerd", color: "bg-muted text-muted-foreground", icon: AlertCircle },
  INCOMPLETE: { label: "Incompleet", color: "bg-chart-4/20 text-chart-4", icon: AlertCircle },
};

export default function BillingPage() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<BillingData>({
    queryKey: ["/api/billing"],
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/billing/portal");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kan de facturatieportal niet openen.",
        variant: "destructive",
      });
    },
  });

  const subscription = data?.subscription;
  const statusInfo = subscription?.status
    ? statusConfig[subscription.status as keyof typeof statusConfig]
    : null;

  return (
    <AppLayout
      title="Facturatie"
      breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Facturatie" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Facturatie & Abonnement</h1>
          <p className="text-muted-foreground">
            Beheer uw abonnement en bekijk uw facturen.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : !subscription ? (
          <Card className="border">
            <CardContent className="p-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Geen actief abonnement</h2>
              <p className="text-muted-foreground mb-6">
                U heeft nog geen abonnement. Kies een plan om te beginnen.
              </p>
              <Button asChild>
                <a href="/#pricing">Bekijk plannen</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg">Huidig Abonnement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{subscription.plan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {statusInfo && (
                    <Badge variant="secondary" className={statusInfo.color}>
                      <statusInfo.icon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Prijs</span>
                  <span className="font-medium font-mono">
                    {formatPrice(subscription.plan.monthlyPriceCents)}/maand
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Volgende factuur</span>
                  <span>{formatDate(subscription.currentPeriodEnd)}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => portalMutation.mutate()}
                  disabled={portalMutation.isPending}
                  data-testid="button-manage-subscription"
                >
                  {portalMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Abonnement beheren
                </Button>
              </CardFooter>
            </Card>

            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg">Betalingsgegevens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Betaalmethode</div>
                    <div className="text-xs text-muted-foreground">
                      Beheer via Stripe portal
                    </div>
                  </div>
                </div>

                {data?.upcomingInvoice && (
                  <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Komende factuur</span>
                      <Badge variant="secondary">Gepland</Badge>
                    </div>
                    <div className="text-2xl font-semibold font-mono">
                      {formatPrice(data.upcomingInvoice.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Vervaldatum: {formatDate(data.upcomingInvoice.dueDate)}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full gap-2"
                  onClick={() => portalMutation.mutate()}
                  disabled={portalMutation.isPending}
                  data-testid="button-view-invoices"
                >
                  <FileText className="h-4 w-4" />
                  Factuurgeschiedenis bekijken
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">Veelgestelde vragen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-1">Hoe kan ik mijn abonnement upgraden?</h4>
              <p className="text-sm text-muted-foreground">
                Klik op "Abonnement beheren" om uw plan te wijzigen. Het prijsverschil wordt pro-rata berekend.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-1">Wat gebeurt er als mijn betaling mislukt?</h4>
              <p className="text-sm text-muted-foreground">
                We proberen de betaling automatisch opnieuw. U ontvangt een e-mail met instructies om uw betaalmethode bij te werken.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Kan ik mijn abonnement opzeggen?</h4>
              <p className="text-sm text-muted-foreground">
                Ja, u kunt maandelijks opzeggen via "Abonnement beheren". Uw website blijft actief tot het einde van de factureringsperiode.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
