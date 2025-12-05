import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { signupSchema, type SignupInput } from "@shared/schema";
import { Globe, Loader2, ArrowLeft, Building2, UserCog } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { z } from "zod";

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
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"CUSTOMER" | "SPECIALIST">("CUSTOMER");

  const planId = new URLSearchParams(searchString).get('plan');

  const form = useForm<ExtendedSignupInput>({
    resolver: zodResolver(extendedSignupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });

  async function onSubmit(data: ExtendedSignupInput) {
    setIsLoading(true);
    try {
      await signup(data.email, data.name, data.password, accountType);
      
      if (accountType === "CUSTOMER" && planId) {
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
              description: "Ga naar de prijzen pagina om uw plan te selecteren.",
              variant: "destructive",
            });
            setLocation("/pricing");
            return;
          }
        } catch (checkoutError: any) {
          console.error("Checkout redirect failed:", checkoutError);
          toast({
            title: "Checkout fout",
            description: "Ga naar de prijzen pagina om uw plan te selecteren.",
            variant: "destructive",
          });
          setLocation("/pricing");
          return;
        }
      }
      
      toast({
        title: "Account aangemaakt!",
        description: accountType === "SPECIALIST" 
          ? "Uw aanvraag wordt beoordeeld door een beheerder."
          : "Welkom bij WebsiteAbonnementen!",
      });
      setLocation(accountType === "SPECIALIST" ? "/specialist" : "/app");
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
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <Globe className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">WebsiteAbonnementen</span>
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
                Kies uw accounttype en maak een account aan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={accountType} onValueChange={(v) => setAccountType(v as "CUSTOMER" | "SPECIALIST")} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="CUSTOMER" className="gap-2" data-testid="tab-customer">
                    <Building2 className="h-4 w-4" />
                    Klant
                  </TabsTrigger>
                  <TabsTrigger value="SPECIALIST" className="gap-2" data-testid="tab-specialist">
                    <UserCog className="h-4 w-4" />
                    Specialist
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="CUSTOMER" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Registreer als klant om een website abonnement af te sluiten en add-ons te configureren.
                  </p>
                </TabsContent>
                <TabsContent value="SPECIALIST" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Registreer als specialist om toegewezen klantaccounts te beheren. 
                    Uw aanvraag wordt beoordeeld door een beheerder.
                  </p>
                </TabsContent>
              </Tabs>

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
                <Link href="/login" className="text-primary hover:underline font-medium" data-testid="link-login">
                  Inloggen
                </Link>
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
