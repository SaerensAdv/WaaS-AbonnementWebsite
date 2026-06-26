import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Globe,
  CalendarCheck,
  Gear,
  ArrowsClockwise,
  DotsThree,
  Clock,
  ShieldCheck,
  Buildings,
  User,
  Palette,
  Timer,
  Check,
  Phone,
  Envelope,
  IdentificationCard,
  UsersThree,
  Target,
  Browsers,
  PaintBrush,
  Image,
  Translate,
  FileText,
  CalendarBlank,
  Lightning,
  Wrench,
  ChatCircleDots,
} from "@phosphor-icons/react";

const ICON_WEIGHT = "duotone" as const;

const STEPS = [
  { id: 1, label: "Bedrijf", icon: Buildings },
  { id: 2, label: "Project", icon: Target },
  { id: 3, label: "Design", icon: Palette },
  { id: 4, label: "Planning", icon: Timer },
];

const quoteFormSchema = z.object({
  companyName: z.string().min(2, "Bedrijfsnaam is verplicht"),
  contactName: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().optional(),
  vatNumber: z.string().optional(),
  companySize: z.string().optional(),
  sector: z.string().optional(),

  projectType: z.string().min(1, "Selecteer een projecttype"),
  currentWebsite: z.string().optional(),
  targetAudience: z.string().optional(),
  estimatedPages: z.string().optional(),
  desiredFeatures: z.array(z.string()).optional(),
  competitors: z.string().optional(),

  designStyle: z.string().optional(),
  exampleWebsites: z.string().optional(),
  brandColors: z.string().optional(),
  hasLogo: z.boolean().optional(),
  contentReady: z.string().optional(),
  languages: z.array(z.string()).optional(),

  budgetRange: z.string().optional(),
  deadline: z.string().optional(),
  urgency: z.string().optional(),
  maintenancePlan: z.string().optional(),
  description: z.string().min(20, "Beschrijf uw project in minimaal 20 tekens"),
  additionalNotes: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const projectTypes = [
  { value: "ecommerce", label: "E-commerce / Webshop", icon: ShoppingCart },
  { value: "multilingual", label: "Meertalige website", icon: Globe },
  { value: "booking", label: "Boekings- / reserveringssysteem", icon: CalendarCheck },
  { value: "custom-integration", label: "Custom integraties & API's", icon: Gear },
  { value: "redesign", label: "Volledige redesign", icon: ArrowsClockwise },
  { value: "other", label: "Anders", icon: DotsThree },
];

const budgetRanges = [
  { value: "1000-2500", label: "€1.000 – €2.500" },
  { value: "2500-5000", label: "€2.500 – €5.000" },
  { value: "5000-10000", label: "€5.000 – €10.000" },
  { value: "10000+", label: "€10.000+" },
  { value: "unknown", label: "Nog geen idee" },
];

const featureOptions = [
  { value: "contact-form", label: "Contactformulier" },
  { value: "blog", label: "Blog / nieuwssectie" },
  { value: "webshop", label: "Webshop / producten" },
  { value: "booking-system", label: "Boekingssysteem" },
  { value: "user-accounts", label: "Gebruikersaccounts / login" },
  { value: "multilingual", label: "Meertalig" },
  { value: "seo", label: "SEO optimalisatie" },
  { value: "analytics", label: "Google Analytics" },
  { value: "newsletter", label: "Nieuwsbrief integratie" },
  { value: "social-media", label: "Social media integratie" },
  { value: "chat", label: "Live chat / chatbot" },
  { value: "maps", label: "Google Maps" },
  { value: "gallery", label: "Foto- / videogalerij" },
  { value: "reviews", label: "Reviews / testimonials" },
  { value: "payment", label: "Online betalingen (iDEAL, Bancontact)" },
  { value: "crm", label: "CRM integratie" },
];

const companySizes = [
  { value: "1", label: "Zelfstandige / eenmanszaak" },
  { value: "2-10", label: "2 – 10 medewerkers" },
  { value: "11-50", label: "11 – 50 medewerkers" },
  { value: "50+", label: "50+ medewerkers" },
];

const sectors = [
  { value: "retail", label: "Retail / Winkel" },
  { value: "horeca", label: "Horeca" },
  { value: "services", label: "Dienstverlening" },
  { value: "healthcare", label: "Gezondheidszorg" },
  { value: "construction", label: "Bouw / Vastgoed" },
  { value: "tech", label: "Technologie / IT" },
  { value: "education", label: "Onderwijs / Opleiding" },
  { value: "creative", label: "Creatieve sector" },
  { value: "non-profit", label: "Non-profit / Overheid" },
  { value: "other", label: "Anders" },
];

const designStyles = [
  { value: "modern-minimalist", label: "Modern & minimalistisch" },
  { value: "corporate-professional", label: "Zakelijk & professioneel" },
  { value: "creative-bold", label: "Creatief & opvallend" },
  { value: "warm-friendly", label: "Warm & toegankelijk" },
  { value: "luxury-elegant", label: "Luxe & elegant" },
  { value: "no-preference", label: "Geen voorkeur" },
];

const contentReadyOptions = [
  { value: "ready", label: "Alle content is klaar (tekst, foto's)" },
  { value: "partial", label: "Gedeeltelijk klaar" },
  { value: "need-help", label: "Ik heb hulp nodig bij content" },
  { value: "not-yet", label: "Nog niet begonnen" },
];

const urgencyOptions = [
  { value: "asap", label: "Zo snel mogelijk" },
  { value: "1-month", label: "Binnen 1 maand" },
  { value: "1-3-months", label: "Binnen 1-3 maanden" },
  { value: "3-6-months", label: "Binnen 3-6 maanden" },
  { value: "no-rush", label: "Geen haast" },
];

const languageOptions = [
  { value: "nl", label: "Nederlands" },
  { value: "fr", label: "Frans" },
  { value: "en", label: "Engels" },
  { value: "de", label: "Duits" },
];

const maintenanceOptions = [
  { value: "yes-full", label: "Ja, volledige onderhoud & updates" },
  { value: "yes-basic", label: "Ja, alleen hosting & beveiliging" },
  { value: "no", label: "Nee, ik beheer het zelf" },
  { value: "unsure", label: "Weet ik nog niet" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10" data-testid="step-indicator">
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const StepIcon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isCompleted
                    ? "bg-emerald-500 text-white shadow-[0_0_20px_hsl(145_60%_45%/0.3)]"
                    : isActive
                      ? "bg-gradient-to-br from-[hsl(var(--primary))] to-blue-600 text-white shadow-[0_0_25px_hsl(var(--primary)/0.35)]"
                      : "bg-muted/50 text-muted-foreground border border-border/50"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={18} weight="bold" />
                ) : (
                  <StepIcon size={18} weight={isActive ? "fill" : ICON_WEIGHT} />
                )}
              </div>
              <span className={`
                text-[11px] md:text-xs mt-1.5 font-medium transition-colors duration-300
                ${isActive ? "text-foreground" : isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}
              `}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`
                w-8 md:w-16 h-[2px] mx-1 md:mx-2 -mt-5 rounded-full transition-colors duration-500
                ${step.id < currentStep ? "bg-emerald-500" : "bg-border/50"}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

export default function OffertePage() {
  useSEO({
    title: "Offerte Aanvragen",
    description: "Vraag een vrijblijvende offerte aan voor uw maatwerkwebsite. Ontvang binnen 48 uur een persoonlijke prijsopgave op basis van uw wensen en budget.",
    canonical: "/offerte",
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      vatNumber: "",
      companySize: "",
      sector: "",
      projectType: "",
      currentWebsite: "",
      targetAudience: "",
      estimatedPages: "",
      desiredFeatures: [],
      competitors: "",
      designStyle: "",
      exampleWebsites: "",
      brandColors: "",
      hasLogo: false,
      contentReady: "",
      languages: [],
      budgetRange: "",
      deadline: "",
      urgency: "",
      maintenancePlan: "",
      description: "",
      additionalNotes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteFormValues) => {
      const { companyName, contactName, email, phone, projectType, budgetRange, description, currentWebsite, ...extras } = data;
      const payload = {
        companyName,
        contactName,
        email,
        phone: phone || undefined,
        projectType,
        budgetRange: budgetRange || undefined,
        description,
        currentWebsite: currentWebsite || undefined,
        details: extras,
      };
      const res = await apiRequest("POST", "/api/quote-requests", payload);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: () => {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het opnieuw of stuur een e-mail naar info@abonnement.website",
        variant: "destructive",
      });
    },
  });

  const validateStep = async (step: number): Promise<boolean> => {
    let fields: (keyof QuoteFormValues)[] = [];
    switch (step) {
      case 1:
        fields = ["companyName", "contactName", "email"];
        break;
      case 2:
        fields = ["projectType"];
        break;
      case 3:
        break;
      case 4:
        fields = ["description"];
        break;
    }
    if (fields.length === 0) return true;
    const result = await form.trigger(fields);
    return result;
  };

  const goNext = async () => {
    const valid = await validateStep(currentStep);
    if (!valid) return;
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (data: QuoteFormValues) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <MarketingLayout>
        <section className="py-32 px-4 min-h-[70vh] flex items-center">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} weight="fill" className="text-emerald-500" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
                Uw aanvraag is ontvangen
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Bedankt voor de uitgebreide informatie. Wij nemen binnen 48 uur contact met u op om uw project te bespreken.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2 rounded-full" asChild>
                  <a href="/#pricing">
                    Bekijk standaard plannen
                    <ArrowRight size={16} weight={ICON_WEIGHT} />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 rounded-full" onClick={() => setLocation("/")}>
                  Terug naar home
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 bg-[#f3a427]/10 border-[#f3a427]/20 text-[#f3a427] dark:text-[#f3a427]">
              <Star size={14} weight="fill" className="mr-1.5" />
              Op Maat
            </Badge>
            <h1 className="font-display text-[clamp(2rem,3.5vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.1]" data-testid="text-offerte-title">
              Vraag een offerte aan
            </h1>
            <p className="text-lg text-muted-foreground max-w-[55ch] mx-auto leading-relaxed">
              Vul de onderstaande stappen in en ontvang binnen 48 uur een vrijblijvende offerte op maat. Hoe meer details, hoe nauwkeuriger onze offerte.
            </p>
          </div>

          <StepIndicator currentStep={currentStep} />

          <div className="grid lg:grid-cols-[1fr_300px] gap-10">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="rounded-2xl border bg-card p-6 md:p-8 min-h-[420px]">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        {currentStep === 1 && <Step1Company form={form} />}
                        {currentStep === 2 && <Step2Project form={form} />}
                        {currentStep === 3 && <Step3Design form={form} />}
                        {currentStep === 4 && <Step4Planning form={form} />}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      className="gap-2 rounded-xl"
                      onClick={goPrev}
                      disabled={currentStep === 1}
                      data-testid="button-prev-step"
                    >
                      <ArrowLeft size={16} weight={ICON_WEIGHT} />
                      Vorige
                    </Button>

                    <span className="text-xs text-muted-foreground">
                      Stap {currentStep} van {STEPS.length}
                    </span>

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        className="gap-2 rounded-xl"
                        onClick={goNext}
                        data-testid="button-next-step"
                      >
                        Volgende
                        <ArrowRight size={16} weight={ICON_WEIGHT} />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="gap-2 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 hover:from-[hsl(var(--primary)/0.9)] hover:to-blue-500 shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                        disabled={mutation.isPending}
                        data-testid="button-submit-quote"
                      >
                        {mutation.isPending ? "Bezig met versturen..." : "Offerte aanvragen"}
                        {!mutation.isPending && <ArrowRight size={16} weight={ICON_WEIGHT} />}
                      </Button>
                    )}
                  </div>

                  {currentStep === 4 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Door dit formulier te versturen gaat u akkoord met onze{" "}
                      <a href="/privacy" className="underline hover:text-foreground">privacyverklaring</a>.
                    </p>
                  )}
                </form>
              </Form>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-5 hidden lg:block"
            >
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold text-sm mb-4">Wat u kunt verwachten</h3>
                <ul className="space-y-3">
                  {[
                    { icon: Clock, text: "Reactie binnen 48 uur" },
                    { icon: CheckCircle, text: "Vrijblijvende offerte" },
                    { icon: ShieldCheck, text: "Geen verborgen kosten" },
                    { icon: Star, text: "Dedicated projectmanager" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3 text-sm">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={16} weight={ICON_WEIGHT} className="text-primary" />
                      </div>
                      <span className="text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <StepHelp step={currentStep} />

              <div className="rounded-2xl border border-dashed border-muted-foreground/20 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Liever eerst bellen?</p>
                <a href="mailto:info@abonnement.website" className="text-sm font-medium text-primary hover:underline">
                  info@abonnement.website
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function StepHelp({ step }: { step: number }) {
  const hints: Record<number, { title: string; items: string[] }> = {
    1: {
      title: "Tips voor stap 1",
      items: [
        "BTW-nummer is optioneel maar helpt bij facturatie",
        "Gebruik het e-mailadres waar u bereikbaar bent",
        "Sector helpt ons relevante voorbeelden te tonen",
      ],
    },
    2: {
      title: "Tips voor stap 2",
      items: [
        "Selecteer alle functies die u nodig heeft",
        "Een bestaande website helpt ons het huidige niveau te begrijpen",
        "Denk aan uw doelgroep: wie moet de website aanspreken?",
      ],
    },
    3: {
      title: "Tips voor stap 3",
      items: [
        "Deel voorbeeldwebsites die u aanspreken",
        "Heeft u al een huisstijl of logo? Vermeld dat",
        "Weet u welke talen nodig zijn? Geef het aan",
      ],
    },
    4: {
      title: "Tips voor stap 4",
      items: [
        "Een realistisch budget helpt bij een passend voorstel",
        "Beschrijf uw project zo uitgebreid mogelijk",
        "Extra opmerkingen? Alles is welkom!",
      ],
    },
  };

  const data = hints[step];
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="font-semibold text-sm mb-3">{data.title}</h3>
      <ul className="space-y-2">
        {data.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckCircle size={14} weight={ICON_WEIGHT} className="text-primary shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step1Company({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Buildings size={20} weight={ICON_WEIGHT} className="text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Bedrijfsgegevens</h2>
          <p className="text-xs text-muted-foreground">Vertel ons meer over uw bedrijf</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrijfsnaam *</FormLabel>
              <FormControl>
                <Input placeholder="Uw bedrijfsnaam" {...field} data-testid="input-company-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contactpersoon *</FormLabel>
              <FormControl>
                <Input placeholder="Uw naam" {...field} data-testid="input-contact-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mailadres *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="info@uwbedrijf.be" {...field} data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefoonnummer</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+32 ..." {...field} data-testid="input-phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BTW-nummer</FormLabel>
              <FormControl>
                <Input placeholder="BE 0123.456.789" {...field} data-testid="input-vat" />
              </FormControl>
              <FormDescription className="text-xs">Optioneel — handig voor facturatie</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-sector">
                    <SelectValue placeholder="Selecteer uw sector..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bedrijfsgrootte</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-company-size">
                  <SelectValue placeholder="Hoeveel medewerkers?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companySizes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step2Project({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target size={20} weight={ICON_WEIGHT} className="text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Projectdetails</h2>
          <p className="text-xs text-muted-foreground">Wat wilt u laten bouwen?</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type project *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-project-type">
                    <SelectValue placeholder="Selecteer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Huidige website</FormLabel>
              <FormControl>
                <Input placeholder="https://www.uwbedrijf.be" {...field} data-testid="input-current-website" />
              </FormControl>
              <FormDescription className="text-xs">Indien u al een website heeft</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doelgroep</FormLabel>
              <FormControl>
                <Input placeholder="bijv. KMO's in België, consumenten 25-45" {...field} data-testid="input-target-audience" />
              </FormControl>
              <FormDescription className="text-xs">Wie wilt u bereiken met uw website?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimatedPages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Geschat aantal pagina's</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-pages">
                    <SelectValue placeholder="Selecteer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-5">1 – 5 pagina's</SelectItem>
                  <SelectItem value="5-10">5 – 10 pagina's</SelectItem>
                  <SelectItem value="10-20">10 – 20 pagina's</SelectItem>
                  <SelectItem value="20+">20+ pagina's</SelectItem>
                  <SelectItem value="unknown">Weet ik nog niet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="competitors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Concurrenten of voorbeelden</FormLabel>
            <FormControl>
              <Input placeholder="URL's van websites die u aanspreken of van concurrenten" {...field} data-testid="input-competitors" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="desiredFeatures"
        render={() => (
          <FormItem>
            <FormLabel>Gewenste functies</FormLabel>
            <FormDescription className="text-xs mb-3">Selecteer alle functies die u nodig heeft</FormDescription>
            <div className="grid grid-cols-2 gap-2.5">
              {featureOptions.map((feature) => (
                <FormField
                  key={feature.value}
                  control={form.control}
                  name="desiredFeatures"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(feature.value)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            field.onChange(
                              checked
                                ? [...current, feature.value]
                                : current.filter((v: string) => v !== feature.value)
                            );
                          }}
                          data-testid={`checkbox-feature-${feature.value}`}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">{feature.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

function Step3Design({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Palette size={20} weight={ICON_WEIGHT} className="text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Design & Content</h2>
          <p className="text-xs text-muted-foreground">Hoe moet uw website eruit zien?</p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="designStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stijlvoorkeur</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1.5">
              {designStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => field.onChange(style.value)}
                  className={`
                    p-3 rounded-xl border text-sm text-left transition-all duration-200
                    ${field.value === style.value
                      ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                      : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50"
                    }
                  `}
                  data-testid={`button-style-${style.value}`}
                >
                  {style.label}
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exampleWebsites"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voorbeeldwebsites die u aanspreken</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Deel URL's van websites waarvan u het design, de stijl of de structuur goed vindt. Vertel ook wat u er precies aan bevalt."
                rows={3}
                {...field}
                data-testid="textarea-examples"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="brandColors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merkkleuren</FormLabel>
              <FormControl>
                <Input placeholder="bijv. donkerblauw, goud, wit" {...field} data-testid="input-brand-colors" />
              </FormControl>
              <FormDescription className="text-xs">Kleuren van uw huisstijl</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasLogo"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0 pt-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="checkbox-has-logo"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="cursor-pointer">Ik heb al een logo</FormLabel>
                <FormDescription className="text-xs">Wij kunnen ook een logo ontwerpen</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="contentReady"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-content-ready">
                  <SelectValue placeholder="Heeft u al content (tekst, foto's) klaar?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {contentReadyOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="languages"
        render={() => (
          <FormItem>
            <FormLabel>Talen van de website</FormLabel>
            <FormDescription className="text-xs mb-2">Selecteer alle gewenste talen</FormDescription>
            <div className="flex flex-wrap gap-2.5">
              {languageOptions.map((lang) => (
                <FormField
                  key={lang.value}
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(lang.value)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            field.onChange(
                              checked
                                ? [...current, lang.value]
                                : current.filter((v: string) => v !== lang.value)
                            );
                          }}
                          data-testid={`checkbox-lang-${lang.value}`}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">{lang.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

function Step4Planning({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Timer size={20} weight={ICON_WEIGHT} className="text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Planning & Budget</h2>
          <p className="text-xs text-muted-foreground">Wanneer en met welk budget?</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget indicatie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-budget">
                    <SelectValue placeholder="Selecteer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgentie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-urgency">
                    <SelectValue placeholder="Hoe snel?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {urgencyOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gewenste lanceerdatum</FormLabel>
              <FormControl>
                <Input type="date" {...field} data-testid="input-deadline" />
              </FormControl>
              <FormDescription className="text-xs">Optioneel — indien u een deadline heeft</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maintenancePlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onderhoud na oplevering</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-maintenance">
                    <SelectValue placeholder="Selecteer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maintenanceOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Projectbeschrijving *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Beschrijf uw project, wensen en doelen zo uitgebreid mogelijk. Wat is het doel van de website? Welk probleem moet het oplossen? Hoe meer detail, hoe nauwkeuriger onze offerte."
                rows={5}
                {...field}
                data-testid="textarea-description"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extra opmerkingen</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Heeft u nog iets anders dat u wilt meegeven? Bijv. specifieke integraties, speciale wensen, referenties van andere projecten..."
                rows={3}
                {...field}
                data-testid="textarea-additional-notes"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
