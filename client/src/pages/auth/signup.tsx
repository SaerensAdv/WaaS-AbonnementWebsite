import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { siteUrl } from "@/lib/site";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { signupSchema } from "@shared/schema";
import { Loader2, ArrowLeft } from "lucide-react";
import logoImage from "@assets/logo-abonnement-website.webp";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSEO } from "@/hooks/use-seo";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import type { Plan } from "@shared/schema";

const extendedSignupSchema = signupSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"],
});

type ExtendedSignupInput = z.infer<typeof extendedSignupSchema>;

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { signup, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const pendingRedirect = useRef<string | null>(null);

  useEffect(() => {
    if (user && pendingRedirect.current) {
      const path = pendingRedirect.current;
      pendingRedirect.current = null;
      setLocation(path);
    }
  }, [user, setLocation]);

  useSEO({
    title: "Account aanmaken",
    description: "Maak een account aan bij Abonnement.Website.",
    noIndex: true,
  });

  // Single-plan model: use the plan from the URL if present, otherwise the one active plan.
  const urlPlanId = new URLSearchParams(searchString).get('plan');
  const { data: plans = [] } = useQuery<Plan[]>({ queryKey: ["/api/plans"] });
  const planId =
    (urlPlanId && plans.some((p) => p.id === urlPlanId) ? urlPlanId : plans[0]?.id) || null;

  const form = useForm<ExtendedSignupInput>({
    resolver: zodResolver(extendedSignupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ExtendedSignupInput) {
    setIsLoading(true);
    try {
      await signup(data.email, data.name, data.password);

      if (planId) {
        toast({
          title: "Account aangemaakt!",
          description: "U wordt doorgestuurd naar de betaalpagina...",
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          const response = await apiRequest("POST", "/api/checkout", { planId });
          const checkoutData = await response.json();
          if (checkoutData.url) {
            window.location.href = checkoutData.url;
            return;
          } else {
            toast({
              title: "Checkout kon niet starten",
              description: "Ga naar de homepage om uw plan te selecteren.",
              variant: "destructive",
            });
            setLocation("/#pricing");
            return;
          }
        } catch (checkoutError: any) {
          console.error("Checkout redirect failed:", checkoutError);
          toast({
            title: "Checkout fout",
            description: "Ga naar de homepage om uw plan te selecteren.",
            variant: "destructive",
          });
          setLocation("/#pricing");
          return;
        }
      }

      toast({
        title: "Account aangemaakt!",
        description: "Welkom bij WebsiteAbonnementen!",
      });
      pendingRedirect.current = "/";
    } catch (error) {
      toast({
        title: "Registratie mislukt",
        description: error instanceof Error ? error.message : "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="WebsiteAbonnementen"
              className="h-9 w-9 rounded-md object-contain"
            />
            <span className="text-lg font-semibold">abonnement.website</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Terug naar home
          </Link>

          <Card className="border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Account aanmaken</CardTitle>
              <CardDescription>
                Maak een account aan om uw website abonnement te starten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volledige naam</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jan de Vries"
                            autoComplete="name"
                            data-testid="input-name"
                            {...field}
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
                        <FormLabel>E-mailadres</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="naam@bedrijf.nl"
                            autoComplete="email"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wachtwoord</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Minimaal 6 tekens"
                            autoComplete="new-password"
                            data-testid="input-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bevestig wachtwoord</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Herhaal uw wachtwoord"
                            autoComplete="new-password"
                            data-testid="input-confirm-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-submit">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Account aanmaken...
                      </>
                    ) : (
                      "Account aanmaken"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Al een account? </span>
                <a href={siteUrl("app", "/login")} className="text-primary hover:underline font-medium" data-testid="link-login">
                  Inloggen
                </a>
              </div>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Door te registreren gaat u akkoord met onze{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  algemene voorwaarden
                </Link>{" "}
                en{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  privacybeleid
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
