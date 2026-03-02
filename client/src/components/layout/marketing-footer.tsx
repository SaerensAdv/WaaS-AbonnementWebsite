import { Link } from "wouter";
import { Envelope, ShieldCheck, CreditCard, Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n-context";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";

const ICON_WEIGHT = "duotone" as const;

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="relative bg-muted/20 border-t border-border/50" data-testid="marketing-footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" data-testid="link-footer-logo">
              <img
                src={logoImage}
                alt="WebsiteAbonnementen"
                className="h-10 w-10 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-lg font-semibold tracking-tight">abo.web</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Professionele websites als maandelijks abonnement. Alles inbegrepen: design, hosting, onderhoud en support.
            </p>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors" data-testid="link-social-email">
              <a href="mailto:info@abonnement.website" aria-label="Email">
                <Envelope size={20} weight={ICON_WEIGHT} />
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
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-footer-privacy">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="link-footer-terms">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {[
                { icon: ShieldCheck, label: "SSL" },
                { icon: Lock, label: "GDPR" },
                { icon: CreditCard, label: "Stripe" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <item.icon size={16} weight={ICON_WEIGHT} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 pb-16 md:pb-0 text-center">
          <p className="text-xs text-muted-foreground" data-testid="text-copyright">
            © {currentYear} abonnement.website — Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
