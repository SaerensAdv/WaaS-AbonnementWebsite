import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, LayoutTemplate, Image } from "lucide-react";
import type { Template } from "@shared/schema";

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

export default function AdminTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const filteredTemplates = (templates || []).filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Templates"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Templates" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Templates</h1>
            <p className="text-muted-foreground">
              Bekijk alle beschikbare website templates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <LayoutTemplate className="h-3 w-3" />
              {templates?.length || 0} templates
            </Badge>
          </div>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam, beschrijving of categorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-templates"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border">
                    <Skeleton className="h-40 w-full rounded-t-lg" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-6 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <LayoutTemplate className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Geen templates gevonden" : "Nog geen templates"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="border overflow-hidden"
                    data-testid={`card-template-${template.id}`}
                  >
                    <div className="aspect-video bg-muted relative">
                      {template.previewImageUrl ? (
                        <img
                          src={template.previewImageUrl}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {template.category && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 text-xs"
                        >
                          {template.category}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge
                          variant="secondary"
                          className={
                            tierColors[template.planEligibility] || "bg-muted"
                          }
                        >
                          {tierLabels[template.planEligibility] ||
                            template.planEligibility}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description || "Geen beschrijving beschikbaar"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
