import { Link } from "wouter";
import { Mail, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n-context";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="relative bg-muted/30" data-testid="marketing-footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3" data-testid="link-footer-logo">
              <img
                src={logoImage}
                alt="WebsiteAbonnementen"
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="text-lg font-semibold">abonnement.website</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Professionele websites als maandelijks abonnement. Alles inbegrepen: design, hosting, onderhoud en support.
            </p>
            <Button variant="ghost" size="icon" asChild data-testid="link-social-email">
              <a href="mailto:info@abonnement.website" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@abonnement.website</li>
              <li>België</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Juridisch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>GDPR</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Stripe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground" data-testid="text-copyright">
            {currentYear} abonnement.website. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
