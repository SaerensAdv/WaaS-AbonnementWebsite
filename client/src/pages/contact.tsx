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
import { useTranslation } from "@/lib/i18n-context";
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

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const { t } = useTranslation();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Abonnement.Website",
      "url": "https://abonnement.website",
      "email": "info@abonnement.website",
      "description": t("contact.seo.description"),
      "address": {
        "@type": "PostalAddress",
        "addressCountry": ["BE", "NL"],
      },
      "areaServed": [
        { "@type": "Country", "name": "Belgium" },
        { "@type": "Country", "name": "Netherlands" },
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@abonnement.website",
        "availableLanguage": ["Dutch", "English"],
      },
    },
  };

  useSEO({
    title: t("contact.seo.title"),
    description: t("contact.seo.description"),
    canonical: "/contact",
    structuredData: contactSchema,
  });

  const contactFormSchema = z.object({
    name: z.string().min(2, t("contact.validation.nameMin")),
    email: z.string().email(t("contact.validation.emailInvalid")),
    subject: z.string().min(1, t("contact.validation.subjectRequired")),
    message: z.string().min(10, t("contact.validation.messageMin")),
  });

  const contactOptions = [
    {
      icon: Mail,
      title: t("contact.options.email.title"),
      value: t("contact.options.email.value"),
      description: t("contact.options.email.description"),
    },
    {
      icon: Clock,
      title: t("contact.options.responseTime.title"),
      value: t("contact.options.responseTime.value"),
      description: t("contact.options.responseTime.description"),
    },
    {
      icon: Phone,
      title: t("contact.options.phone.title"),
      value: t("contact.options.phone.value"),
      description: t("contact.options.phone.description"),
    },
  ];

  const subjectOptions = [
    { value: "website", label: t("contact.form.subjects.website") },
    { value: "advertenties", label: t("contact.form.subjects.advertising") },
    { value: "support", label: t("contact.form.subjects.support") },
    { value: "andere", label: t("contact.form.subjects.other") },
  ];

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
        title: t("contact.toast.success.title"),
        description: t("contact.toast.success.description"),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t("contact.toast.error.title"),
        description: t("contact.toast.error.description"),
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
        className="relative min-h-[50vh] flex flex-col overflow-hidden pt-[72px]"
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
        
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <BreadcrumbNav 
            items={[{ label: t("common.nav.contact") }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {t("contact.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-contact-hero-title"
              >
                {t("contact.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("contact.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {t("contact.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-contact-options">
        <div className="container mx-auto px-4">
          <StaggerChildren className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16" staggerDelay={0.1}>
            {contactOptions.map((option, index) => (
              <StaggerItem key={index}>
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
                      <h3 className="text-2xl font-semibold mb-3">{t("contact.success.title")}</h3>
                      <p className="text-muted-foreground mb-6">
                        {t("contact.success.description")}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                        data-testid="button-send-another"
                      >
                        {t("common.buttons.sendAnother")}
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
                            <h2 className="text-xl font-semibold">{t("contact.form.title")}</h2>
                            <p className="text-sm text-muted-foreground">{t("contact.form.description")}</p>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.name")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("contact.form.namePlaceholder")} 
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
                              <FormLabel>{t("contact.form.email")}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder={t("contact.form.emailPlaceholder")} 
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
                              <FormLabel>{t("contact.form.subject")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-contact-subject">
                                    <SelectValue placeholder={t("contact.form.subjectPlaceholder")} />
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
                              <FormLabel>{t("contact.form.message")}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={t("contact.form.messagePlaceholder")} 
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
                            t("contact.form.submitting")
                          ) : (
                            <>
                              {t("contact.form.submit")}
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
                    <h3 className="font-semibold mb-1">{t("contact.tip.title")}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t("contact.tip.description")}
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
