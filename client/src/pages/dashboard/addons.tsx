import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddOnCardSkeleton } from "@/components/skeletons";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Megaphone,
  Share2,
  FileText,
  ShoppingCart,
  ShoppingBag,
  Search,
  MapPin,
  Users,
  CalendarCheck,
  Zap,
  Plus,
  Check,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import type { AddOn, AddOnSelection } from "@shared/schema";

const addOnIcons: Record<string, any> = {
  "google-ads": Megaphone,
  "google-ads-ecommerce": ShoppingBag,
  "meta-ads": Share2,
  "seo": Search,
  "local-seo": MapPin,
  "social-media": Users,
  "ecommerce": ShoppingCart,
  "booking": CalendarCheck,
  "extra-pages": FileText,
};

const statusColors = {
  REQUESTED: "bg-chart-4/20 text-chart-4",
  ACTIVE: "bg-chart-2/20 text-chart-2",
  PAUSED: "bg-muted text-muted-foreground",
};

function parseErrorMessage(error: any): string | undefined {
  const msg = error?.message || "";
  const jsonStart = msg.indexOf("{");
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(msg.slice(jsonStart));
      return parsed.message;
    } catch {}
  }
  return msg.replace(/^\d+:\s*/, "") || undefined;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface AddOnsData {
  availableAddOns: AddOn[];
  selectedAddOns: (AddOnSelection & { addOn: AddOn })[];
  hasSubscription: boolean;
}

export default function AddOnsPage() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<AddOnsData>({
    queryKey: ["/api/addons/my"],
  });

  const addMutation = useMutation({
    mutationFn: async (addOnId: string) => {
      const response = await apiRequest("POST", "/api/addons/select", { addOnId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Add-on toegevoegd",
        description: "De add-on is succesvol toegevoegd aan uw abonnement. Het bedrag wordt bij uw volgende factuur verrekend.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fout",
        description: parseErrorMessage(error) || "Er is iets misgegaan bij het toevoegen.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (addOnId: string) => {
      const response = await apiRequest("POST", "/api/addons/remove", { addOnId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Add-on verwijderd",
        description: "De add-on is verwijderd van uw abonnement.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fout",
        description: parseErrorMessage(error) || "Er is iets misgegaan bij het verwijderen.",
        variant: "destructive",
      });
    },
  });

  const availableAddOns = data?.availableAddOns || [];
  const selectedAddOns = data?.selectedAddOns || [];
  const hasSubscription = data?.hasSubscription ?? false;

  const selectedAddOnIds = new Set(selectedAddOns.map((s) => s.addOnId));

  return (
    <AppLayout
      title="Add-ons"
      breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Add-ons" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Add-ons</h1>
          <p className="text-muted-foreground">
            Versterk uw online aanwezigheid met extra diensten.
          </p>
          <p className="text-xs text-muted-foreground mt-1" data-testid="text-addon-quarterly-note">
            Prijzen worden per maand getoond. Add-ons worden per kwartaal vooruit gefactureerd, samen met uw abonnement.
          </p>
        </div>

        {!hasSubscription && !isLoading && (
          <Card className="border border-chart-4/50 bg-chart-4/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Geen actief abonnement</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    U heeft een actief abonnement nodig om add-ons te kunnen toevoegen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedAddOns.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Uw actieve add-ons</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedAddOns.map((selection) => {
                const IconComponent = addOnIcons[selection.addOn.slug] || Zap;
                return (
                  <Card key={selection.id} className="border" data-testid={`card-active-addon-${selection.addOn.slug}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{selection.addOn.name}</h3>
                            <Badge
                              variant="secondary"
                              className={statusColors[selection.status as keyof typeof statusColors]}
                            >
                              {selection.status === "REQUESTED" && "Aangevraagd"}
                              {selection.status === "ACTIVE" && "Actief"}
                              {selection.status === "PAUSED" && "Gepauzeerd"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(selection.addOn.monthlyPriceCents)}/maand
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                          disabled={removeMutation.isPending}
                          onClick={() => removeMutation.mutate(selection.addOnId)}
                          data-testid={`button-remove-${selection.addOn.slug}`}
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Beschikbare add-ons</h2>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <AddOnCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableAddOns.map((addOn) => {
                const IconComponent = addOnIcons[addOn.slug] || Zap;
                const isSelected = selectedAddOnIds.has(addOn.id);

                return (
                  <Card key={addOn.id} className={`border ${isSelected ? "opacity-50" : ""}`} data-testid={`card-addon-${addOn.slug}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1">{addOn.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {addOn.description}
                          </p>
                          <span className="text-sm font-semibold">
                            {formatPrice(addOn.monthlyPriceCents)}/maand
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant={isSelected ? "secondary" : "outline"}
                        size="sm"
                        className="w-full"
                        disabled={isSelected || !hasSubscription || addMutation.isPending}
                        onClick={() => addMutation.mutate(addOn.id)}
                        data-testid={`button-add-${addOn.slug}`}
                      >
                        {addMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : isSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Toegevoegd
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Toevoegen
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
