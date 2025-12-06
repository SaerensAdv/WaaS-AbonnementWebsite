import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Search, CreditCard } from "lucide-react";
import type { Plan } from "@shared/schema";

const tierLabels: Record<string, string> = {
  LOW: "Basis",
  MEDIUM: "Standaard",
  HIGH: "Premium",
};

const tierColors: Record<string, string> = {
  LOW: "bg-chart-4/20 text-chart-4",
  MEDIUM: "bg-chart-1/20 text-chart-1",
  HIGH: "bg-chart-2/20 text-chart-2",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function AdminPlansPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const filteredPlans = (plans || []).filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Plannen"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Plannen" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Plannen</h1>
            <p className="text-muted-foreground">
              Bekijk alle beschikbare abonnementsplannen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <CreditCard className="h-3 w-3" />
              {plans?.length || 0} plannen
            </Badge>
          </div>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam of tier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-plans"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Geen plannen gevonden" : "Nog geen plannen"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Prijs/maand</TableHead>
                    <TableHead>Functies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id} data-testid={`row-plan-${plan.id}`}>
                      <TableCell>
                        <div className="font-medium">{plan.name}</div>
                        {plan.slaText && (
                          <div className="text-sm text-muted-foreground">
                            {plan.slaText}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={tierColors[plan.tier] || "bg-muted"}
                        >
                          {tierLabels[plan.tier] || plan.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatPrice(plan.monthlyPriceCents)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {plan.features && plan.features.length > 0 ? (
                            plan.features.slice(0, 3).map((feature, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                          {plan.features && plan.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{plan.features.length - 3} meer
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
