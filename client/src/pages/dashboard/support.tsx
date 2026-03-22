import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
} from "lucide-react";

const supportSchema = z.object({
  subject: z.string().min(3, "Onderwerp moet minimaal 3 karakters zijn"),
  message: z.string().min(10, "Bericht moet minimaal 10 karakters zijn"),
  priority: z.string().default("3"),
});

type SupportFormData = z.infer<typeof supportSchema>;

interface Ticket {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  priority: number;
  priorityLabel: string;
  dateCreated: string;
  url: string;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "in progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

function getPriorityBadge(priority: number, label: string) {
  const variants: Record<number, string> = {
    1: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    2: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    3: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    4: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[priority] || variants[3]}`}>
      {label}
    </span>
  );
}

export default function SupportPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      subject: "",
      message: "",
      priority: "3",
    },
  });

  const { data, isLoading } = useQuery<{ tickets: Ticket[] }>({
    queryKey: ["/api/support-tickets"],
  });

  const createTicket = useMutation({
    mutationFn: async (values: SupportFormData) => {
      const res = await apiRequest("POST", "/api/support-tickets", {
        subject: values.subject,
        message: values.message,
        priority: parseInt(values.priority),
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Ticket aangemaakt", description: "We nemen zo snel mogelijk contact met je op." });
      form.reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
    },
    onError: () => {
      toast({ title: "Fout", description: "Kon ticket niet aanmaken. Probeer het opnieuw.", variant: "destructive" });
    },
  });

  const tickets = data?.tickets || [];

  return (
    <AppLayout
      title="Support"
      breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Support" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-support-title">Support</h1>
            <p className="text-muted-foreground">
              Heb je een vraag of probleem? Maak een support ticket aan.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            data-testid="button-new-ticket"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Nieuw ticket
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nieuw support ticket</CardTitle>
              <CardDescription>Beschrijf je vraag of probleem zo duidelijk mogelijk.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((values) => createTicket.mutate(values))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Onderwerp</FormLabel>
                        <FormControl>
                          <Input placeholder="Bijv. Probleem met mijn website" {...field} data-testid="input-ticket-subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bericht</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Beschrijf je vraag of probleem..."
                            rows={5}
                            {...field}
                            data-testid="input-ticket-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioriteit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ticket-priority">
                              <SelectValue placeholder="Selecteer prioriteit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Urgent</SelectItem>
                            <SelectItem value="2">Hoog</SelectItem>
                            <SelectItem value="3">Normaal</SelectItem>
                            <SelectItem value="4">Laag</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={createTicket.isPending} data-testid="button-submit-ticket">
                      {createTicket.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Verstuur
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Annuleren
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Mijn tickets</CardTitle>
            <CardDescription>Overzicht van al je support tickets.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p>Je hebt nog geen support tickets.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    data-testid={`ticket-item-${ticket.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getStatusIcon(ticket.status)}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{ticket.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Number(ticket.dateCreated)).toLocaleDateString("nl-NL")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(ticket.priority, ticket.priorityLabel)}
                      <Badge variant={ticket.status === "complete" ? "default" : "secondary"}>
                        {ticket.status}
                      </Badge>
                      {ticket.url && (
                        <a href={ticket.url} target="_blank" rel="noopener noreferrer" data-testid={`link-ticket-${ticket.id}`}>
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
