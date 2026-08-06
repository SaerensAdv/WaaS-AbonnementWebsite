import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import logoImage from "@assets/logo-abonnement-website.webp";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSEO } from "@/hooks/use-seo";

const forgotPasswordSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useSEO({
    title: "Wachtwoord vergeten",
    description: "Vraag een nieuw wachtwoord aan voor uw account.",
    noIndex: true,
  });

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", data);
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Er is iets misgegaan",
        description: "Probeer het later opnieuw.",
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
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Terug naar inloggen
          </Link>

          <Card className="border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Wachtwoord vergeten</CardTitle>
              <CardDescription>
                Voer uw e-mailadres in om een reset link te ontvangen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-chart-2/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-chart-2" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Controleer uw e-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Als dit e-mailadres bij ons bekend is, ontvangt u een e-mail met instructies om uw wachtwoord te resetten.
                    </p>
                  </div>
                  <Link href="/login">
                    <Button variant="outline" className="mt-4">
                      Terug naar inloggen
                    </Button>
                  </Link>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mailadres</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="email"
                                placeholder="uw@email.nl"
                                className="pl-9"
                                data-testid="input-email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-testid="button-submit"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verzenden...
                        </>
                      ) : (
                        "Verstuur reset link"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
