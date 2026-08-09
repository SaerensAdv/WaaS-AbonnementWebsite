import { Link } from "wouter";
import { Envelope, ShieldCheck, CreditCard, Lock, Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n-context";
import logoImage from "@assets/logo-abonnement-website.webp";

const ICON_WEIGHT = "duotone" as const;

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="relative bg-gradient-to-b from-muted/30 to-muted/10 border-t border-border/40" data-testid="marketing-footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" data-testid="link-footer-logo">
              <img
                src={logoImage}
                alt="WebsiteAbonnementen"
                className="h-9 w-9 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-lg font-semibold tracking-tight">abo.web</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[30ch]">
              Professionele websites als abonnement. Design, hosting, onderhoud en support inbegrepen.
            </p>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors" data-testid="link-social-email">
              <a href="mailto:info@abonnement.website" aria-label="Email">
                <Envelope size={20} weight={ICON_WEIGHT} />
              </a>
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Navigatie</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Abonnementen", href: "/#pricing" },
                { label: "Add-ons", href: "/#addons" },
                { label: "Op Maat", href: "/#maatwerk" },
                { label: "FAQ", href: "/#faq" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/betaalbare-professionele-website" className="text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-footer-betaalbare">
                  Betaalbare website
                </Link>
              </li>
              <li>
                <Link href="/werkwijze" className="text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-footer-werkwijze">
                  Werkwijze
                </Link>
              </li>
              <li>
                <Link href="/consentease" className="text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-footer-consentease">
                  ConsentEase
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-footer-blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Juridisch</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-footer-privacy">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="link-footer-terms">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/70">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@abonnement.website" className="hover:text-foreground transition-colors duration-200">
                  info@abonnement.website
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe size={14} weight={ICON_WEIGHT} />
                <span>België</span>
              </li>
              <li className="text-xs text-muted-foreground/60">
                Saerens Advertising<br />
                BE 1019.436.742
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/30 pt-6 pb-16 md:pb-0 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60" data-testid="text-copyright">
            © {currentYear} abonnement.website — Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-5">
            {[
              { icon: ShieldCheck, label: "SSL beveiligd" },
              { icon: Lock, label: "GDPR-compliant" },
              { icon: CreditCard, label: "Stripe betalingen" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                <item.icon size={14} weight={ICON_WEIGHT} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
