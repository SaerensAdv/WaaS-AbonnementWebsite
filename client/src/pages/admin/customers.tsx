import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerRowSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  FolderKanban,
  Users,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User, CustomerProfile, Project } from "@shared/schema";

interface CustomerData {
  user: User;
  profile: CustomerProfile | null;
  project: Project | null;
  credits?: { used: number; total: number };
  addOnCount?: number;
}

interface CustomersResponse {
  customers: CustomerData[];
  total: number;
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<CustomersResponse>({
    queryKey: ["/api/admin/customers"],
  });

  const customers = data?.customers || [];
  const filteredCustomers = customers.filter(
    (c) =>
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.profile?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Klanten"
      breadcrumbs={[{ label: "Admin", href: "/" }, { label: "Klanten" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Klanten</h1>
            <p className="text-muted-foreground">
              Beheer alle geregistreerde klanten en hun projecten.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {data?.total || 0} klanten
            </Badge>
          </div>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam, email of bedrijf..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-customers"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <CustomerRowSkeleton key={i} />
                ))}
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Geen klanten gevonden" : "Nog geen klanten"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klant</TableHead>
                    <TableHead>Bedrijf</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Add-ons</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(customer.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/clients/${customer.user.id}`}
                              className="font-medium hover:underline"
                              data-testid={`link-client-${customer.user.id}`}
                            >
                              {customer.user.name}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              {customer.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.profile?.companyName || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.project ? (
                          <div className="flex items-center gap-2">
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {customer.project.domain || "Project"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Geen project
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.project?.status ? (
                          <Badge
                            variant="secondary"
                            className={
                              projectStatusColors[customer.project.status] ||
                              "bg-muted"
                            }
                          >
                            {projectStatusLabels[customer.project.status] ||
                              customer.project.status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {customer.credits ? `${customer.credits.used}/${customer.credits.total}` : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{customer.addOnCount ?? 0}</span>
                      </TableCell>
                      <TableCell>
                        {customer.project ? (
                          customer.project.onboardingCompleted ? (
                            <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                              Afgerond
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">
                              Open
                            </Badge>
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`button-customer-actions-${customer.user.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocation(`/clients/${customer.user.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Bekijk details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Stuur e-mail
                            </DropdownMenuItem>
                            {customer.project && (
                              <DropdownMenuItem>
                                <FolderKanban className="h-4 w-4 mr-2" />
                                Bekijk project
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
