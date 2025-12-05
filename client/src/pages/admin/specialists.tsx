import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  CheckCircle2,
  XCircle,
  UserCog,
  Users,
  Loader2,
} from "lucide-react";
import type { User, SpecialistProfile, Assignment } from "@shared/schema";

interface SpecialistData {
  user: User;
  profile: SpecialistProfile | null;
  assignmentCount: number;
}

interface SpecialistsResponse {
  specialists: SpecialistData[];
  total: number;
  pending: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminSpecialistsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const { data, isLoading } = useQuery<SpecialistsResponse>({
    queryKey: ["/api/admin/specialists"],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ userId, approved }: { userId: string; approved: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/specialists/${userId}/approve`, { approved });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specialists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: variables.approved ? "Specialist goedgekeurd" : "Specialist afgekeurd",
        description: variables.approved
          ? "De specialist kan nu toewijzingen ontvangen."
          : "De specialist is gemarkeerd als niet-goedgekeurd.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan.",
        variant: "destructive",
      });
    },
  });

  const specialists = data?.specialists || [];
  const filteredSpecialists = specialists.filter((s) => {
    const matchesSearch =
      s.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !s.profile?.approved) ||
      (filter === "approved" && s.profile?.approved);

    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout
      title="Specialisten"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Specialisten" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Specialisten</h1>
            <p className="text-muted-foreground">
              Beheer specialisten en hun goedkeuringsstatus.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(data?.pending || 0) > 0 && (
              <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">
                {data?.pending} wachtend op goedkeuring
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <UserCog className="h-3 w-3" />
              {data?.total || 0} specialisten
            </Badge>
          </div>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam of email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-specialists"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Alle
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                >
                  Wachtend
                </Button>
                <Button
                  variant={filter === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("approved")}
                >
                  Goedgekeurd
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredSpecialists.length === 0 ? (
              <div className="text-center py-8">
                <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || filter !== "all"
                    ? "Geen specialisten gevonden"
                    : "Nog geen specialisten"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specialist</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Capaciteit</TableHead>
                    <TableHead>Toewijzingen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSpecialists.map((specialist) => (
                    <TableRow key={specialist.user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(specialist.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{specialist.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {specialist.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {specialist.profile?.skills?.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {(specialist.profile?.skills?.length || 0) > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(specialist.profile?.skills?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">
                          {specialist.assignmentCount}/{specialist.profile?.capacity || 5}
                        </span>
                      </TableCell>
                      <TableCell>{specialist.assignmentCount}</TableCell>
                      <TableCell>
                        {specialist.profile?.approved ? (
                          <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Goedgekeurd
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">
                            Wachtend
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={approveMutation.isPending}
                              data-testid={`button-specialist-actions-${specialist.user.id}`}
                            >
                              {approveMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Bekijk profiel
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Stuur e-mail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!specialist.profile?.approved ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  approveMutation.mutate({
                                    userId: specialist.user.id,
                                    approved: true,
                                  })
                                }
                                className="text-chart-2"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Goedkeuren
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  approveMutation.mutate({
                                    userId: specialist.user.id,
                                    approved: false,
                                  })
                                }
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Goedkeuring intrekken
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
