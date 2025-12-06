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
import { Search, Puzzle } from "lucide-react";
import type { AddOn } from "@shared/schema";

function formatPrice(cents: number | null): string {
  if (cents === null || cents === undefined) return "-";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function AdminAddonsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: addons, isLoading } = useQuery<AddOn[]>({
    queryKey: ["/api/addons"],
  });

  const filteredAddons = (addons || []).filter(
    (addon) =>
      addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addon.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Add-ons"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Add-ons" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Add-ons</h1>
            <p className="text-muted-foreground">
              Bekijk alle beschikbare add-on diensten.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Puzzle className="h-3 w-3" />
              {addons?.length || 0} add-ons
            </Badge>
          </div>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam of beschrijving..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-addons"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredAddons.length === 0 ? (
              <div className="text-center py-8">
                <Puzzle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Geen add-ons gevonden" : "Nog geen add-ons"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Beschrijving</TableHead>
                    <TableHead>Prijs/maand</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAddons.map((addon) => (
                    <TableRow key={addon.id} data-testid={`row-addon-${addon.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {addon.icon && (
                            <span className="text-lg">{addon.icon}</span>
                          )}
                          <div className="font-medium">{addon.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {addon.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatPrice(addon.baseFeeCents)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            addon.requiresBudget
                              ? "bg-chart-1/20 text-chart-1"
                              : "bg-chart-4/20 text-chart-4"
                          }
                        >
                          {addon.requiresBudget ? "Budget vereist" : "Vast tarief"}
                        </Badge>
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
