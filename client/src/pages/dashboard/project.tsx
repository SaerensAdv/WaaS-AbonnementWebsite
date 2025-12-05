import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Globe,
  Building2,
  Palette,
  FileText,
  Users,
  Phone,
  Loader2,
  Clock,
  CheckCircle2,
  Zap,
  AlertCircle,
} from "lucide-react";
import type { Project, Template, Plan, OnboardingData } from "@shared/schema";

const statusConfig = {
  ONBOARDING: { label: "Onboarding", color: "bg-chart-4/20 text-chart-4", icon: Clock },
  PRODUCTION: { label: "In productie", color: "bg-chart-1/20 text-chart-1", icon: Zap },
  LIVE: { label: "Live", color: "bg-chart-2/20 text-chart-2", icon: CheckCircle2 },
  MAINTENANCE: { label: "Onderhoud", color: "bg-chart-5/20 text-chart-5", icon: AlertCircle },
};

const onboardingSteps = [
  { id: 1, title: "Bedrijfsgegevens", icon: Building2 },
  { id: 2, title: "Branding & Stijl", icon: Palette },
  { id: 3, title: "Content & Services", icon: FileText },
  { id: 4, title: "Doelgroep", icon: Users },
  { id: 5, title: "Contact & Domein", icon: Phone },
];

interface ProjectData {
  project: Project | null;
  plan: Plan | null;
  template: Template | null;
  templates: Template[];
}

export default function ProjectPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});

  const { data, isLoading } = useQuery<ProjectData>({
    queryKey: ["/api/project"],
  });

  const updateMutation = useMutation({
    mutationFn: async (onboardingData: Partial<OnboardingData>) => {
      const response = await apiRequest("PUT", "/api/project/onboarding", onboardingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Opgeslagen",
        description: "Uw wijzigingen zijn opgeslagen.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan bij het opslaan.",
        variant: "destructive",
      });
    },
  });

  const project = data?.project;
  const plan = data?.plan;
  const template = data?.template;
  const templates = data?.templates || [];

  const onboardingData = (project?.onboardingData as OnboardingData) || {};
  const completedStep = onboardingData.step || 0;
  const progress = Math.round((completedStep / onboardingSteps.length) * 100);

  const statusInfo = project?.status ? statusConfig[project.status as keyof typeof statusConfig] : null;

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      updateMutation.mutate({
        ...formData,
        step: Math.max(completedStep, currentStep),
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    updateMutation.mutate({
      ...formData,
      step: onboardingSteps.length,
      completed: true,
    });
  };

  if (isLoading) {
    return (
      <AppLayout title="Mijn Project" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Project" }]}>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout title="Mijn Project" breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Project" }]}>
        <Card className="border">
          <CardContent className="p-12 text-center">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Geen actief project</h2>
            <p className="text-muted-foreground mb-6">
              U heeft nog geen website project. Kies een plan om te beginnen.
            </p>
            <Button asChild>
              <a href="/pricing">Bekijk plannen</a>
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Mijn Project"
      breadcrumbs={[{ label: "Dashboard", href: "/app" }, { label: "Project" }]}
    >
      <div className="space-y-6">
        <Card className="border">
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-xl">Project Status</CardTitle>
                <CardDescription>
                  {plan?.name || "Website"} {template ? `- ${template.name}` : ""}
                </CardDescription>
              </div>
              {statusInfo && (
                <Badge variant="secondary" className={statusInfo.color}>
                  <statusInfo.icon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              )}
            </div>
          </CardHeader>
          {project.domain && (
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Domein:</span>
                <span className="font-medium">{project.domain}</span>
              </div>
            </CardContent>
          )}
        </Card>

        {project.status === "ONBOARDING" && (
          <Card className="border">
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                Vul de onderstaande stappen in zodat we uw website kunnen bouwen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Voortgang</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {onboardingSteps.map((step, index) => {
                  const isCompleted = completedStep >= step.id;
                  const isCurrent = currentStep === step.id;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors
                        ${isCurrent ? "bg-primary text-primary-foreground" : 
                          isCompleted ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground"}`}
                      data-testid={`step-${step.id}`}
                    >
                      <step.icon className="h-4 w-4" />
                      {step.title}
                      {isCompleted && !isCurrent && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[300px]">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Bedrijfsnaam</Label>
                      <Input
                        id="companyName"
                        placeholder="Uw bedrijfsnaam"
                        defaultValue={(onboardingData.content as any)?.companyName || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, companyDescription: e.target.value }
                        })}
                        data-testid="input-company-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Bedrijfsomschrijving</Label>
                      <Textarea
                        id="description"
                        placeholder="Beschrijf kort wat uw bedrijf doet..."
                        rows={4}
                        defaultValue={onboardingData.content?.companyDescription || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, companyDescription: e.target.value }
                        })}
                        data-testid="input-description"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Logo uploaden</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Sleep uw logo hierheen of klik om te uploaden
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Bestand kiezen
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Merk kleuren</Label>
                      <div className="flex gap-2 mt-2">
                        <Input type="color" className="w-12 h-10 p-1" defaultValue="#2563eb" />
                        <Input type="color" className="w-12 h-10 p-1" defaultValue="#1e293b" />
                        <Input type="color" className="w-12 h-10 p-1" defaultValue="#f8fafc" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="services">Diensten / Producten</Label>
                      <Textarea
                        id="services"
                        placeholder="Lijst uw belangrijkste diensten of producten op..."
                        rows={4}
                        data-testid="input-services"
                      />
                    </div>
                    <div>
                      <Label htmlFor="usp">Unique Selling Points</Label>
                      <Textarea
                        id="usp"
                        placeholder="Wat maakt uw bedrijf uniek?"
                        rows={3}
                        data-testid="input-usp"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targetAudience">Doelgroep</Label>
                      <Textarea
                        id="targetAudience"
                        placeholder="Beschrijf uw ideale klant..."
                        rows={4}
                        defaultValue={onboardingData.content?.targetAudience || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, targetAudience: e.target.value }
                        })}
                        data-testid="input-target-audience"
                      />
                    </div>
                    <div>
                      <Label htmlFor="competitors">Concurrenten (optioneel)</Label>
                      <Input
                        id="competitors"
                        placeholder="Websites van concurrenten ter inspiratie"
                        data-testid="input-competitors"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Contact e-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@uwbedrijf.nl"
                        defaultValue={onboardingData.contact?.email || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          contact: { ...formData.contact, email: e.target.value }
                        })}
                        data-testid="input-contact-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefoonnummer</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+31 6 12345678"
                        defaultValue={onboardingData.contact?.phone || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          contact: { ...formData.contact, phone: e.target.value }
                        })}
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="domain">Gewenst domein</Label>
                      <Input
                        id="domain"
                        placeholder="www.uwbedrijf.nl"
                        defaultValue={onboardingData.domain?.preferred || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          domain: { ...formData.domain, preferred: e.target.value }
                        })}
                        data-testid="input-domain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4 border-t pt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                data-testid="button-prev-step"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Vorige
              </Button>
              {currentStep < onboardingSteps.length ? (
                <Button
                  onClick={handleNextStep}
                  disabled={updateMutation.isPending}
                  data-testid="button-next-step"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  Volgende
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={updateMutation.isPending}
                  data-testid="button-complete"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Voltooien
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {project.status !== "ONBOARDING" && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overzicht</TabsTrigger>
              <TabsTrigger value="settings">Instellingen</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card className="border">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-4">Website Details</h3>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Plan</dt>
                          <dd className="font-medium">{plan?.name}</dd>
                        </div>
                        {template && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Template</dt>
                            <dd className="font-medium">{template.name}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Status</dt>
                          <dd>{statusInfo?.label}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Inbegrepen</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {plan?.includedPages || 5} pagina's
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {plan?.includedCredits || 2} wijzigingen/maand
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          SSL certificaat
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Dagelijkse backups
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card className="border">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">
                    Projectinstellingen worden binnenkort beschikbaar.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}
