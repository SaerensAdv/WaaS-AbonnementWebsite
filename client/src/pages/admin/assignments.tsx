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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  Plus,
  ClipboardList,
  Users,
  Loader2,
  UserPlus,
} from "lucide-react";
import type { AddOnSelection, AddOn, User, Assignment, SpecialistProfile } from "@shared/schema";

interface AssignmentData {
  assignment: Assignment;
  addOnSelection: AddOnSelection & { addOn: AddOn };
  specialist: User;
  customer: User;
}

interface UnassignedSelection {
  selection: AddOnSelection & { addOn: AddOn };
  customer: User;
}

interface AssignmentsResponse {
  assignments: AssignmentData[];
  unassigned: UnassignedSelection[];
  specialists: (User & { profile: SpecialistProfile })[];
}

const statusLabels: Record<string, string> = {
  PROPOSED: "Voorgesteld",
  ACTIVE: "Actief",
  ENDED: "Beëindigd",
};

const statusColors: Record<string, string> = {
  PROPOSED: "bg-chart-4/20 text-chart-4",
  ACTIVE: "bg-chart-2/20 text-chart-2",
  ENDED: "bg-muted text-muted-foreground",
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default function AdminAssignmentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState<UnassignedSelection | null>(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState("");

  const { data, isLoading } = useQuery<AssignmentsResponse>({
    queryKey: ["/api/admin/assignments"],
  });

  const assignMutation = useMutation({
    mutationFn: async (params: { addOnSelectionId: string; specialistUserId: string }) => {
      const response = await apiRequest("POST", "/api/admin/assignments", params);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assignments"] });
      setDialogOpen(false);
      setSelectedSelection(null);
      setSelectedSpecialistId("");
      toast({
        title: "Toewijzing aangemaakt",
        description: "De specialist heeft een notificatie ontvangen.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon toewijzing niet aanmaken.",
        variant: "destructive",
      });
    },
  });

  const assignments = data?.assignments || [];
  const unassigned = data?.unassigned || [];
  const specialists = data?.specialists || [];

  const filteredAssignments = assignments.filter(
    (a) =>
      a.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.addOnSelection.addOn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = (selection: UnassignedSelection) => {
    setSelectedSelection(selection);
    setDialogOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedSelection && selectedSpecialistId) {
      assignMutation.mutate({
        addOnSelectionId: selectedSelection.selection.id,
        specialistUserId: selectedSpecialistId,
      });
    }
  };

  return (
    <AppLayout
      title="Toewijzingen"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Toewijzingen" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Toewijzingen</h1>
          <p className="text-muted-foreground">
            Wijs add-on accounts toe aan specialisten.
          </p>
        </div>

        {unassigned.length > 0 && (
          <Card className="border border-chart-4/50 bg-chart-4/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Wachtend op toewijzing ({unassigned.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unassigned.map((item) => (
                  <div
                    key={item.selection.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-md bg-background border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.selection.addOn.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Klant: {item.customer.name}
                        {item.selection.totalBudgetCents && (
                          <> | Budget: {formatPrice(item.selection.totalBudgetCents)}/maand</>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(item)}
                      data-testid={`button-assign-${item.selection.id}`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Toewijzen
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek toewijzingen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-assignments"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "Geen toewijzingen gevonden" : "Nog geen toewijzingen"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Add-on</TableHead>
                    <TableHead>Klant</TableHead>
                    <TableHead>Specialist</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.addOnSelection.addOn.name}
                      </TableCell>
                      <TableCell>{assignment.customer.name}</TableCell>
                      <TableCell>{assignment.specialist.name}</TableCell>
                      <TableCell className="font-mono">
                        {assignment.addOnSelection.totalBudgetCents
                          ? formatPrice(assignment.addOnSelection.totalBudgetCents)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusColors[assignment.assignment.status || "PROPOSED"] || "bg-muted"}
                        >
                          {statusLabels[assignment.assignment.status || "PROPOSED"] || assignment.assignment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Specialist toewijzen</DialogTitle>
              <DialogDescription>
                Selecteer een specialist voor {selectedSelection?.selection.addOn.name} van{" "}
                {selectedSelection?.customer.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Specialist</Label>
                <Select value={selectedSpecialistId} onValueChange={setSelectedSpecialistId}>
                  <SelectTrigger data-testid="select-specialist">
                    <SelectValue placeholder="Kies een specialist..." />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists
                      .filter((s) => s.profile?.approved)
                      .map((specialist) => (
                        <SelectItem key={specialist.id} value={specialist.id}>
                          <div className="flex items-center gap-2">
                            <span>{specialist.name}</span>
                            <span className="text-muted-foreground text-xs">
                              ({specialist.profile?.skills?.slice(0, 2).join(", ")})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuleren
              </Button>
              <Button
                onClick={handleConfirmAssign}
                disabled={!selectedSpecialistId || assignMutation.isPending}
                data-testid="button-confirm-assign"
              >
                {assignMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Toewijzen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
