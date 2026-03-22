import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Star,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Globe,
  CalendarCheck,
  Gear,
  ArrowsClockwise,
  DotsThree,
  Clock,
  ShieldCheck,
  Check,
} from "@phosphor-icons/react";

const ICON_WEIGHT = "duotone" as const;

const quoteFormSchema = z.object({
  companyName: z.string().min(2, "Bedrijfsnaam is verplicht"),
  contactName: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Selecteer een projecttype"),
  budgetRange: z.string().optional(),
  description: z.string().min(20, "Beschrijf uw project in minimaal 20 tekens"),
  currentWebsite: z.string().optional(),
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

export default function OffertePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      projectType: "",
      budgetRange: "",
      description: "",
      currentWebsite: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteFormValues) => {
      const res = await apiRequest("POST", "/api/quote-requests", data);
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
                Bedankt voor uw interesse. Wij nemen binnen 48 uur contact met u op om uw project te bespreken.
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
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300">
              <Star size={14} weight="fill" className="mr-1.5" />
              Op Maat
            </Badge>
            <h1 className="font-display text-[clamp(2rem,3.5vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.1]" data-testid="text-offerte-title">
              Vraag een offerte aan
            </h1>
            <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
              Beschrijf uw project en ontvang binnen 48 uur een vrijblijvende offerte. Geen verplichtingen, geen verrassingen.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl border bg-card p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type project *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget indicatie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </div>

                    <FormField
                      control={form.control}
                      name="currentWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Huidige website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.uwbedrijf.be (optioneel)" {...field} data-testid="input-current-website" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Projectbeschrijving *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Beschrijf uw project, wensen en doelen. Hoe meer detail, hoe nauwkeuriger onze offerte."
                              rows={5}
                              {...field}
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2 h-13 text-base rounded-xl"
                        disabled={mutation.isPending}
                        data-testid="button-submit-quote"
                      >
                        {mutation.isPending ? "Bezig met versturen..." : "Offerte aanvragen"}
                        {!mutation.isPending && <ArrowRight size={16} weight={ICON_WEIGHT} />}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Door dit formulier te versturen gaat u akkoord met onze{" "}
                        <a href="/privacy" className="underline hover:text-foreground">privacyverklaring</a>.
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-6"
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

              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold text-sm mb-4">Populaire maatwerkprojecten</h3>
                <ul className="space-y-2.5">
                  {projectTypes.slice(0, 4).map((type) => (
                    <li key={type.value} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <type.icon size={16} weight={ICON_WEIGHT} className="text-primary shrink-0" />
                      <span>{type.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
