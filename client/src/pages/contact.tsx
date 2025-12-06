import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSEO } from "@/hooks/use-seo";
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
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  FadeIn,
  SlideIn,
  StaggerChildren,
  StaggerItem,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  Send,
  Mail,
  Clock,
  Phone,
  Sparkles,
  ChevronRight,
  Check,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters zijn"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  subject: z.string().min(1, "Selecteer een onderwerp"),
  message: z.string().min(10, "Bericht moet minimaal 10 karakters zijn"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactOptions = [
  {
    icon: Mail,
    title: "E-mail",
    value: "info@abonnement.website",
    description: "Stuur ons een bericht",
  },
  {
    icon: Clock,
    title: "Reactietijd",
    value: "Binnen 48 uur",
    description: "Wij reageren snel",
  },
  {
    icon: Phone,
    title: "Telefonisch",
    value: "Op afspraak",
    description: "Plan een gesprek in",
  },
];

const subjectOptions = [
  { value: "website", label: "Website" },
  { value: "advertenties", label: "Advertenties" },
  { value: "support", label: "Support" },
  { value: "andere", label: "Andere" },
];

export default function ContactPage() {
  useSEO({
    title: "Contact",
    description: "Neem contact op met WebsiteAbonnementen. Stel uw vragen over onze website abonnementen, krijg een vrijblijvend advies, of plan een demo in.",
    canonical: "/contact",
  });

  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Bericht verzonden",
        description: "Wij nemen zo snel mogelijk contact met u op.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw of mail ons direct.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[50vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-contact-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        
        <AnimatedDotGrid 
          className="opacity-80"
          dotSize={1}
          gap={35}
          baseOpacity={0.06}
          accentColor="59, 130, 246"
        />
        
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <BreadcrumbNav 
            items={[{ label: "Contact" }]} 
            className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Wij helpen u graag verder
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-contact-hero-title"
              >
                Stuur ons een bericht.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">Wij regelen de rest.</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Vraag een voorstel, stel een vraag of laat ons even meekijken. U krijgt snel antwoord.
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-contact-options">
        <div className="container mx-auto px-4">
          <StaggerChildren className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16" staggerDelay={0.1}>
            {contactOptions.map((option, index) => (
              <StaggerItem key={option.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="border bg-card text-center"
                    data-testid={`card-contact-option-${index}`}
                  >
                    <CardContent className="p-6">
                      <div className="h-12 w-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <option.icon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{option.title}</p>
                      <p className="font-semibold text-lg">{option.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <div className="max-w-2xl mx-auto">
            <FadeInUp>
              <Card className="border bg-card" data-testid="card-contact-form">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">Bedankt voor uw bericht!</h3>
                      <p className="text-muted-foreground mb-6">
                        Wij nemen binnen 48 uur contact met u op.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                        data-testid="button-send-another"
                      >
                        Nog een bericht versturen
                      </Button>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">Contactformulier</h2>
                            <p className="text-sm text-muted-foreground">Vul onderstaande velden in</p>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Naam</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Uw naam" 
                                  {...field} 
                                  data-testid="input-contact-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="uw@email.nl" 
                                  {...field} 
                                  data-testid="input-contact-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Waar gaat het over?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-contact-subject">
                                    <SelectValue placeholder="Selecteer een onderwerp" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjectOptions.map((option) => (
                                    <SelectItem 
                                      key={option.value} 
                                      value={option.value}
                                      data-testid={`option-subject-${option.value}`}
                                    >
                                      {option.label}
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
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bericht</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Vertel ons waar we u mee kunnen helpen..." 
                                  className="min-h-[150px] resize-none"
                                  {...field} 
                                  data-testid="textarea-contact-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          size="lg"
                          className="w-full gap-2"
                          disabled={contactMutation.isPending}
                          data-testid="button-contact-submit"
                        >
                          {contactMutation.isPending ? (
                            "Versturen..."
                          ) : (
                            <>
                              Verstuur
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeIn delay={0.2}>
              <div className="mt-8 p-6 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-border">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Geen zin om lang uit te leggen?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Zet gewoon uw website of idee in het bericht. Wij stellen de juiste vragen terug.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
