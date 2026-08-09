import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Target,
  FileText,
  Palette,
  Share2,
  Check,
  Loader2,
} from "lucide-react";

const INDUSTRIES = [
  "Horeca",
  "Retail",
  "Zakelijke dienstverlening",
  "Bouw & vastgoed",
  "Gezondheid & welzijn",
  "Onderwijs & training",
  "IT & technologie",
  "Marketing & communicatie",
  "Financieel & juridisch",
  "Transport & logistiek",
  "Landbouw & voeding",
  "Kunst & cultuur",
  "Sport & recreatie",
  "Non-profit",
  "Anders",
];

const WEBSITE_GOALS = [
  { id: "more-customers", label: "Meer klanten aantrekken" },
  { id: "information", label: "Informatie verstrekken" },
  { id: "online-sales", label: "Online verkoop / reserveringen" },
  { id: "portfolio", label: "Portfolio / showcase" },
  { id: "branding", label: "Merkbekendheid vergroten" },
  { id: "other", label: "Anders" },
];

const STYLE_OPTIONS = [
  { value: "modern", label: "Modern / Minimalistisch" },
  { value: "classic", label: "Klassiek / Traditioneel" },
  { value: "playful", label: "Speels / Creatief" },
  { value: "corporate", label: "Zakelijk / Corporate" },
];

const STEPS = [
  { icon: Building2, label: "Bedrijfsgegevens" },
  { icon: Target, label: "Website doelen" },
  { icon: FileText, label: "Content" },
  { icon: Palette, label: "Design" },
  { icon: Share2, label: "Social & opmerkingen" },
];

interface OnboardingFormData {
  companyName: string;
  country: "NL" | "BE" | "";
  kvkNumber: string;
  btwNumber: string;
  industry: string;
  existingWebsite: string;
  phone: string;
  address: string;
  websiteGoals: string[];
  targetAudience: string;
  competitors: string;
  hasTexts: string;
  hasLogo: string;
  hasPhotos: string;
  colorPreference: string;
  stylePreference: string;
  exampleWebsites: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  notes: string;
}

const defaultFormData: OnboardingFormData = {
  companyName: "",
  country: "",
  kvkNumber: "",
  btwNumber: "",
  industry: "",
  existingWebsite: "",
  phone: "",
  address: "",
  websiteGoals: [],
  targetAudience: "",
  competitors: "",
  hasTexts: "",
  hasLogo: "",
  hasPhotos: "",
  colorPreference: "",
  stylePreference: "",
  exampleWebsites: "",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  notes: "",
};

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData);

  const { data: onboardingInfo, isLoading } = useQuery<{
    onboardingCompleted: boolean;
    onboardingData: OnboardingFormData | null;
  }>({
    queryKey: ["/api/onboarding"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      const res = await apiRequest("POST", "/api/onboarding", { onboardingData: data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Onboarding voltooid!",
        description: "Bedankt voor het invullen. We gaan voor u aan de slag!",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Er is iets misgegaan bij het opslaan.",
        variant: "destructive",
      });
    },
  });

  const updateField = (field: keyof OnboardingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      websiteGoals: prev.websiteGoals.includes(goalId)
        ? prev.websiteGoals.filter((g) => g !== goalId)
        : [...prev.websiteGoals, goalId],
    }));
  };

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 0:
        if (!formData.companyName.trim()) return "Bedrijfsnaam is verplicht";
        if (!formData.country) return "Selecteer een land";
        if (formData.country === "NL" && !formData.kvkNumber.trim()) return "KVK-nummer is verplicht";
        if (formData.country === "BE" && !formData.btwNumber.trim()) return "BTW-nummer is verplicht";
        if (!formData.industry) return "Selecteer een branche";
        if (!formData.phone.trim()) return "Telefoonnummer is verplicht";
        if (!formData.address.trim()) return "Bedrijfsadres is verplicht";
        return null;
      case 1:
        if (formData.websiteGoals.length === 0) return "Selecteer minimaal één doel";
        if (!formData.targetAudience.trim()) return "Doelgroep is verplicht";
        return null;
      case 2:
        if (!formData.hasTexts) return "Geef aan of u teksten heeft";
        if (!formData.hasLogo) return "Geef aan of u een logo heeft";
        if (!formData.hasPhotos) return "Geef aan of u foto's heeft";
        return null;
      case 3:
        if (!formData.stylePreference) return "Selecteer een stijlvoorkeur";
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      toast({ title: "Niet alle velden zijn ingevuld", description: error, variant: "destructive" });
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const error = validateStep(currentStep);
    if (error) {
      toast({ title: "Niet alle velden zijn ingevuld", description: error, variant: "destructive" });
      return;
    }
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <AppLayout title="Onboarding" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Onboarding" }]}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (onboardingInfo?.onboardingCompleted) {
    return (
      <AppLayout title="Onboarding" breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Onboarding" }]}>
        <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
          <div className="h-16 w-16 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-chart-2" />
          </div>
          <h1 className="text-2xl font-semibold">Onboarding afgerond</h1>
          <p className="text-muted-foreground">
            U heeft het onboarding formulier al ingevuld. We zijn voor u aan het werk!
          </p>
          <Button onClick={() => setLocation("/")} className="gap-2" data-testid="button-back-dashboard">
            Terug naar dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Onboarding"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Onboarding" }]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-onboarding-title">
            Vertel ons over uw bedrijf
          </h1>
          <p className="text-muted-foreground">
            Met deze informatie kunnen we direct aan de slag met uw website.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isDone = index < currentStep;
            return (
              <button
                key={index}
                onClick={() => {
                  if (isDone) setCurrentStep(index);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-${index}`}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            );
          })}
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => { const Icon = STEPS[currentStep].icon; return <Icon className="h-5 w-5" />; })()}
              {STEPS[currentStep].label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Bedrijfsnaam *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Uw bedrijfsnaam"
                    data-testid="input-company-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Land *</Label>
                  <Select value={formData.country} onValueChange={(v) => updateField("country", v)}>
                    <SelectTrigger data-testid="select-country">
                      <SelectValue placeholder="Selecteer land" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NL">Nederland</SelectItem>
                      <SelectItem value="BE">België</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.country === "NL" && (
                  <div className="space-y-2">
                    <Label htmlFor="kvkNumber">KVK-nummer *</Label>
                    <Input
                      id="kvkNumber"
                      value={formData.kvkNumber}
                      onChange={(e) => updateField("kvkNumber", e.target.value)}
                      placeholder="12345678"
                      data-testid="input-kvk"
                    />
                  </div>
                )}

                {formData.country === "BE" && (
                  <div className="space-y-2">
                    <Label htmlFor="btwNumber">BTW-nummer *</Label>
                    <Input
                      id="btwNumber"
                      value={formData.btwNumber}
                      onChange={(e) => updateField("btwNumber", e.target.value)}
                      placeholder="BE0123456789"
                      data-testid="input-btw"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Branche *</Label>
                  <Select value={formData.industry} onValueChange={(v) => updateField("industry", v)}>
                    <SelectTrigger data-testid="select-industry">
                      <SelectValue placeholder="Selecteer branche" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingWebsite">Bestaande website (optioneel)</Label>
                  <Input
                    id="existingWebsite"
                    value={formData.existingWebsite}
                    onChange={(e) => updateField("existingWebsite", e.target.value)}
                    placeholder="https://www.uwbedrijf.nl"
                    data-testid="input-existing-website"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoonnummer *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+31 6 12345678"
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Bedrijfsadres *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Straat, huisnummer, postcode, plaats"
                    rows={2}
                    data-testid="input-address"
                  />
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="space-y-3">
                  <Label>Wat is het hoofddoel van uw website? *</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {WEBSITE_GOALS.map((goal) => (
                      <label
                        key={goal.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.websiteGoals.includes(goal.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        data-testid={`goal-${goal.id}`}
                      >
                        <Checkbox
                          checked={formData.websiteGoals.includes(goal.id)}
                          onCheckedChange={() => toggleGoal(goal.id)}
                        />
                        <span className="text-sm">{goal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Doelgroep *</Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => updateField("targetAudience", e.target.value)}
                    placeholder="Beschrijf uw ideale klant (bijv. 'MKB-ondernemers in de regio Rotterdam, 25-55 jaar')"
                    rows={3}
                    data-testid="input-target-audience"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Concurrenten (optioneel)</Label>
                  <Textarea
                    id="competitors"
                    value={formData.competitors}
                    onChange={(e) => updateField("competitors", e.target.value)}
                    placeholder="Noem 2-3 vergelijkbare bedrijven of websites"
                    rows={2}
                    data-testid="input-competitors"
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-3">
                  <Label>Heeft u al teksten voor de website? *</Label>
                  <RadioGroup value={formData.hasTexts} onValueChange={(v) => updateField("hasTexts", v)}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="texts-yes" data-testid="radio-texts-yes" />
                      <Label htmlFor="texts-yes" className="font-normal">Ja, ik heb teksten klaar</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="partial" id="texts-partial" data-testid="radio-texts-partial" />
                      <Label htmlFor="texts-partial" className="font-normal">Gedeeltelijk</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="texts-no" data-testid="radio-texts-no" />
                      <Label htmlFor="texts-no" className="font-normal">Nee, ik heb hulp nodig</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Heeft u een logo? *</Label>
                  <RadioGroup value={formData.hasLogo} onValueChange={(v) => updateField("hasLogo", v)}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="logo-yes" data-testid="radio-logo-yes" />
                      <Label htmlFor="logo-yes" className="font-normal">Ja, ik heb een logo</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="logo-no" data-testid="radio-logo-no" />
                      <Label htmlFor="logo-no" className="font-normal">Nee, ik heb er geen</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Heeft u foto's van uw bedrijf/producten? *</Label>
                  <RadioGroup value={formData.hasPhotos} onValueChange={(v) => updateField("hasPhotos", v)}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="photos-yes" data-testid="radio-photos-yes" />
                      <Label htmlFor="photos-yes" className="font-normal">Ja, ik heb foto's</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="partial" id="photos-partial" data-testid="radio-photos-partial" />
                      <Label htmlFor="photos-partial" className="font-normal">Gedeeltelijk</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="photos-no" data-testid="radio-photos-no" />
                      <Label htmlFor="photos-no" className="font-normal">Nee, ik heb er geen</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="colorPreference">Kleurvoorkeur (optioneel)</Label>
                  <Input
                    id="colorPreference"
                    value={formData.colorPreference}
                    onChange={(e) => updateField("colorPreference", e.target.value)}
                    placeholder="Bijv. 'blauw en wit' of 'gebruik mijn logo kleuren'"
                    data-testid="input-color"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Stijlvoorkeur *</Label>
                  <RadioGroup value={formData.stylePreference} onValueChange={(v) => updateField("stylePreference", v)}>
                    {STYLE_OPTIONS.map((style) => (
                      <div key={style.value} className="flex items-center gap-2">
                        <RadioGroupItem value={style.value} id={`style-${style.value}`} data-testid={`radio-style-${style.value}`} />
                        <Label htmlFor={`style-${style.value}`} className="font-normal">{style.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exampleWebsites">Voorbeeldwebsites (optioneel)</Label>
                  <Textarea
                    id="exampleWebsites"
                    value={formData.exampleWebsites}
                    onChange={(e) => updateField("exampleWebsites", e.target.value)}
                    placeholder="Websites waarvan u het design mooi vindt"
                    rows={2}
                    data-testid="input-examples"
                  />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook (optioneel)</Label>
                  <Input
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) => updateField("facebookUrl", e.target.value)}
                    placeholder="https://facebook.com/uwbedrijf"
                    data-testid="input-facebook"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram (optioneel)</Label>
                  <Input
                    id="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={(e) => updateField("instagramUrl", e.target.value)}
                    placeholder="https://instagram.com/uwbedrijf"
                    data-testid="input-instagram"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn (optioneel)</Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => updateField("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/company/uwbedrijf"
                    data-testid="input-linkedin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Overige opmerkingen (optioneel)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Alles wat u ons nog wilt meegeven..."
                    rows={4}
                    data-testid="input-notes"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Vorige
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Stap {currentStep + 1} van {STEPS.length}
            </Badge>
          </div>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="gap-2" data-testid="button-next">
              Volgende
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="gap-2"
              data-testid="button-submit"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Verstuur
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
