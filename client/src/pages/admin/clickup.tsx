import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClickUpStatsSkeleton, ClickUpTaskListSkeleton } from "@/components/skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Rocket,
  Hammer,
  MessageSquare,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface ClickUpTask {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  priority: number;
  priorityLabel: string;
  dateCreated: string;
  url: string;
  assignees: string[];
}

interface ClickUpOverview {
  configured: boolean;
  roadmap: ClickUpTask[];
  delivery: ClickUpTask[];
  support: ClickUpTask[];
  growth: ClickUpTask[];
}

function getStatusBadge(status: string) {
  const colorMap: Record<string, string> = {
    "to do": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "in progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "complete": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || colorMap["to do"]}`}>
      {status}
    </span>
  );
}

function getPriorityDot(priority: number) {
  const colors: Record<number, string> = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-blue-500",
    4: "bg-gray-400",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[priority] || colors[3]}`} />;
}

function TaskList({ tasks, emptyMessage }: { tasks: ClickUpTask[]; emptyMessage: string }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          data-testid={`clickup-task-${task.id}`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {getPriorityDot(task.priority)}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{task.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {new Date(Number(task.dateCreated)).toLocaleDateString("nl-NL")}
                </span>
                {task.assignees.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    — {task.assignees.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {getStatusBadge(task.status)}
            {task.url && (
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                data-testid={`link-clickup-task-${task.id}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminClickUpPage() {
  const { data, isLoading } = useQuery<ClickUpOverview>({
    queryKey: ["/api/admin/clickup/overview"],
  });

  const deliveryActive = data?.delivery.filter((t) => t.status !== "complete") || [];
  const supportOpen = data?.support.filter((t) => t.status !== "complete") || [];
  const growthActive = data?.growth.filter((t) => t.status !== "complete") || [];

  return (
    <AppLayout
      title="Projectbeheer"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projectbeheer" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-clickup-title">Projectbeheer</h1>
          <p className="text-muted-foreground">
            Overzicht van taken uit ClickUp.
          </p>
        </div>

        {!data?.configured && !isLoading && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ClickUp is niet geconfigureerd. Voeg de CLICKUP_API_TOKEN toe aan de environment variables.
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <ClickUpStatsSkeleton />
            <ClickUpTaskListSkeleton />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery</CardTitle>
                  <Hammer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold" data-testid="text-delivery-count">{deliveryActive.length}</div>
                  <p className="text-xs text-muted-foreground">actieve taken</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Support tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold" data-testid="text-support-count">{supportOpen.length}</div>
                  <p className="text-xs text-muted-foreground">open tickets</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold" data-testid="text-growth-count">{growthActive.length}</div>
                  <p className="text-xs text-muted-foreground">leads & experimenten</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="roadmap">
              <TabsList>
                <TabsTrigger value="roadmap" data-testid="tab-roadmap">
                  <Rocket className="mr-1.5 h-3.5 w-3.5" />
                  Roadmap ({data?.roadmap.length || 0})
                </TabsTrigger>
                <TabsTrigger value="delivery" data-testid="tab-delivery">
                  <Hammer className="mr-1.5 h-3.5 w-3.5" />
                  Delivery ({data?.delivery.length || 0})
                </TabsTrigger>
                <TabsTrigger value="support" data-testid="tab-support">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Support ({data?.support.length || 0})
                </TabsTrigger>
                <TabsTrigger value="growth" data-testid="tab-growth">
                  <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                  Growth ({data?.growth.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="roadmap" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Roadmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={data?.roadmap || []} emptyMessage="Geen roadmap items gevonden." />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={data?.delivery || []} emptyMessage="Geen delivery taken gevonden." />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Support tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={data?.support || []} emptyMessage="Geen support tickets gevonden." />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growth" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={data?.growth || []} emptyMessage="Geen growth items gevonden." />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  );
}
