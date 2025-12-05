import { Link } from "wouter";
import { Globe, Linkedin, Twitter, Instagram, Mail, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="relative bg-muted/30" data-testid="marketing-footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3" data-testid="link-footer-logo">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">WebsiteAbonnementen</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Premium website abonnementen met beheerde hosting, SEO, en reclame-oplossingen. Wij zorgen voor uw online aanwezigheid, zodat u zich kunt focussen op uw bedrijf.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-linkedin"
              >
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-twitter"
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-instagram"
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-email"
              >
                <a href="mailto:info@websiteabonnementen.nl" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold tracking-wide uppercase text-foreground">Producten</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/pricing" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-pricing"
                >
                  Abonnementen
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing#addons" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-addons"
                >
                  Add-ons
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-templates"
                >
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold tracking-wide uppercase text-foreground">Bedrijf</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-about"
                >
                  Over ons
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/specialists" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-specialists"
                >
                  Word specialist
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div>
              <h4 className="mb-2 text-sm font-semibold tracking-wide uppercase text-foreground">Nieuwsbrief</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Blijf op de hoogte van de laatste updates
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2" data-testid="form-newsletter">
                <Input
                  type="email"
                  placeholder="Uw e-mailadres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button type="submit" data-testid="button-newsletter-subscribe">
                  Aanmelden
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>SSL Beveiligd</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Veilig betalen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            {currentYear} WebsiteAbonnementen. Alle rechten voorbehouden.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              data-testid="link-footer-privacy"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              data-testid="link-footer-terms"
            >
              Voorwaarden
            </Link>
            <Link 
              href="/cookies" 
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
              data-testid="link-footer-cookies"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
