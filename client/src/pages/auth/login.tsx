import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginInput } from "@shared/schema";
import { Loader2, ArrowLeft } from "lucide-react";
import logoImage from "@assets/logo-abonnement-website.webp";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSEO } from "@/hooks/use-seo";
import { getSite, goToSite } from "@/lib/site";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();
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
    title: "Inloggen",
    description: "Log in op uw Abonnement.Website dashboard.",
    noIndex: true,
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const loggedInUser = await login(data.email, data.password);
      const site = getSite();
      const targetSite = loggedInUser.role === "ADMIN" ? "admin" : "app";

      toast({
        title: "Welkom terug!",
        description: "U bent succesvol ingelogd.",
      });
      if (site !== targetSite) {
        // Verkeerde site voor deze rol → hard redirect naar het juiste subdomein.
        goToSite(targetSite, "/");
        return;
      }
      pendingRedirect.current = "/";
    } catch (error) {
      toast({
        title: "Inloggen mislukt",
        description: error instanceof Error ? error.message : "Controleer uw gegevens en probeer opnieuw.",
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
              <CardTitle className="text-2xl font-semibold">Inloggen</CardTitle>
              <CardDescription>
                Voer uw gegevens in om toegang te krijgen tot uw account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Wachtwoord</FormLabel>
                          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Wachtwoord vergeten?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Uw wachtwoord"
                            autoComplete="current-password"
                            data-testid="input-password"
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
                        Bezig met inloggen...
                      </>
                    ) : (
                      "Inloggen"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Nog geen account? </span>
                <Link href="/signup" className="text-primary hover:underline font-medium" data-testid="link-signup">
                  Registreer nu
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
