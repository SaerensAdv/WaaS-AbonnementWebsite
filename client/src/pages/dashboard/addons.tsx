import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Megaphone,
  Search,
  FileText,
  MapPin,
  TrendingUp,
  Plus,
  Check,
  AlertTriangle,
  Loader2,
  Info,
  Euro,
} from "lucide-react";
import type { AddOn, AddOnSelection } from "@shared/schema";

const addOnIcons: Record<string, any> = {
  "google-ads": Megaphone,
  "meta-ads": Megaphone,
  "seo": Search,
  "content": FileText,
  "local-seo": MapPin,
};

const statusColors = {
  REQUESTED: "bg-chart-4/20 text-chart-4",
  ACTIVE: "bg-chart-2/20 text-chart-2",
  PAUSED: "bg-muted text-muted-foreground",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface BudgetCalculatorProps {
  addOn: AddOn;
  onSubmit: (data: { totalBudget: number; mediaPercentage: number }) => void;
  isSubmitting: boolean;
}

function BudgetCalculator({ addOn, onSubmit, isSubmitting }: BudgetCalculatorProps) {
  const minBudget = (addOn.minBudgetCents || 50000) / 100;
  const defaultPercentage = addOn.mediaPercentageDefault || 85;
  const minPercentage = addOn.mediaPercentageMin || 80;
  const maxPercentage = addOn.mediaPercentageMax || 90;

  const [totalBudget, setTotalBudget] = useState(minBudget);
  const [mediaPercentage, setMediaPercentage] = useState(defaultPercentage);

  const mediaBudget = Math.round(totalBudget * (mediaPercentage / 100));
  const managementBudget = totalBudget - mediaBudget;
  const isBelowMinimum = totalBudget < minBudget;

  const handleSubmit = () => {
    if (!isBelowMinimum) {
      onSubmit({
        totalBudget: totalBudget * 100,
        mediaPercentage,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="totalBudget">Maandelijks budget</Label>
          <div className="flex items-center gap-2 mt-2">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <Input
              id="totalBudget"
              type="number"
              min={0}
              step={100}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="max-w-32 font-mono"
              data-testid="input-total-budget"
            />
            <span className="text-muted-foreground">/maand</span>
          </div>
          {isBelowMinimum && (
            <div className="flex items-center gap-2 mt-2 text-sm text-chart-4">
              <AlertTriangle className="h-4 w-4" />
              Minimum budget is {formatPrice(minBudget * 100)}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Media / Beheer verdeling</Label>
            <span className="text-sm font-mono">{mediaPercentage}% / {100 - mediaPercentage}%</span>
          </div>
          <Slider
            value={[mediaPercentage]}
            onValueChange={([value]) => setMediaPercentage(value)}
            min={minPercentage}
            max={maxPercentage}
            step={1}
            className="py-4"
            data-testid="slider-media-percentage"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min {minPercentage}% media</span>
            <span>Max {maxPercentage}% media</span>
          </div>
        </div>
      </div>

      <Card className="border bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Budgetverdeling</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${mediaPercentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                <div className="text-xs text-muted-foreground mb-1">Mediakosten</div>
                <div className="text-lg font-semibold font-mono">{formatPrice(mediaBudget * 100)}</div>
                <div className="text-xs text-muted-foreground">{mediaPercentage}% van budget</div>
              </div>
              <div className="p-3 rounded-md bg-muted border">
                <div className="text-xs text-muted-foreground mb-1">Beheerkosten</div>
                <div className="text-lg font-semibold font-mono">{formatPrice(managementBudget * 100)}</div>
                <div className="text-xs text-muted-foreground">{100 - mediaPercentage}% van budget</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Mediakosten gaan rechtstreeks naar {addOn.name}. Beheerkosten dekken optimalisatie, rapportage en support.
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isBelowMinimum || isSubmitting}
        className="w-full"
        data-testid="button-submit-budget"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Bezig...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Add-on toevoegen
          </>
        )}
      </Button>
    </div>
  );
}

interface AddOnsData {
  availableAddOns: AddOn[];
  selectedAddOns: (AddOnSelection & { addOn: AddOn })[];
  hasProject: boolean;
}

export default function AddOnsPage() {
  const { toast } = useToast();
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQuery<AddOnsData>({
    queryKey: ["/api/addons/my"],
  });

  const addMutation = useMutation({
    mutationFn: async (params: { addOnId: string; totalBudget?: number; mediaPercentage?: number }) => {
      const response = await apiRequest("POST", "/api/addons/select", params);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setDialogOpen(false);
      setSelectedAddOn(null);
      toast({
        title: "Add-on toegevoegd",
        description: "De add-on is succesvol toegevoegd aan uw project.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan bij het toevoegen.",
        variant: "destructive",
      });
    },
  });

  const availableAddOns = data?.availableAddOns || [];
  const selectedAddOns = data?.selectedAddOns || [];
  const hasProject = data?.hasProject ?? false;

  const selectedAddOnIds = new Set(selectedAddOns.map((s) => s.addOnId));

  const handleAddAddOn = (addOn: AddOn) => {
    if (addOn.requiresBudget) {
      setSelectedAddOn(addOn);
      setDialogOpen(true);
    } else {
      addMutation.mutate({ addOnId: addOn.id });
    }
  };

  const handleBudgetSubmit = (data: { totalBudget: number; mediaPercentage: number }) => {
    if (selectedAddOn) {
      addMutation.mutate({
        addOnId: selectedAddOn.id,
        totalBudget: data.totalBudget,
        mediaPercentage: data.mediaPercentage,
      });
    }
  };

  return (
    <AppLayout
      title="Add-ons"
      breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Add-ons" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Growth Add-ons</h1>
          <p className="text-muted-foreground">
            Versterk uw online aanwezigheid met advertenties, SEO en content.
          </p>
        </div>

        {!hasProject && !isLoading && (
          <Card className="border border-chart-4/50 bg-chart-4/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Geen actief project</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    U heeft een actief project nodig om add-ons te kunnen toevoegen.
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
                const IconComponent = addOnIcons[selection.addOn.slug] || TrendingUp;
                return (
                  <Card key={selection.id} className="border">
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
                          {selection.totalBudgetCents && (
                            <div className="text-sm text-muted-foreground">
                              Budget: {formatPrice(selection.totalBudgetCents)}/maand
                              <span className="mx-1">|</span>
                              Media: {formatPrice(selection.mediaBudgetCents || 0)}
                              <span className="mx-1">|</span>
                              Beheer: {formatPrice(selection.managementBudgetCents || 0)}
                            </div>
                          )}
                        </div>
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
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableAddOns.map((addOn) => {
                const IconComponent = addOnIcons[addOn.slug] || TrendingUp;
                const isSelected = selectedAddOnIds.has(addOn.id);

                return (
                  <Card key={addOn.id} className={`border ${isSelected ? "opacity-50" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{addOn.name}</h3>
                            {addOn.requiresBudget && (
                              <Badge variant="secondary" className="text-xs">Budget</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {addOn.description}
                          </p>
                          {addOn.baseFeeCents && addOn.baseFeeCents > 0 && (
                            <div className="text-sm mt-2">
                              Vanaf {formatPrice(addOn.baseFeeCents)}/maand
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        variant={isSelected ? "secondary" : "outline"}
                        size="sm"
                        className="w-full"
                        disabled={isSelected || !hasProject || addMutation.isPending}
                        onClick={() => handleAddAddOn(addOn)}
                        data-testid={`button-add-${addOn.slug}`}
                      >
                        {isSelected ? (
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedAddOn?.name} toevoegen</DialogTitle>
              <DialogDescription>
                Stel uw maandelijkse budget in en bekijk de verdeling.
              </DialogDescription>
            </DialogHeader>
            {selectedAddOn && (
              <BudgetCalculator
                addOn={selectedAddOn}
                onSubmit={handleBudgetSubmit}
                isSubmitting={addMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
