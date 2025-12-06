import { Link } from "wouter";
import { Linkedin, Twitter, Instagram, Mail, ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";

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
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-10 md:gap-12 grid-cols-2 md:grid-cols-2 lg:grid-cols-12">
          <div className="col-span-2 md:col-span-2 lg:col-span-4 space-y-5 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mx-auto md:mx-0" data-testid="link-footer-logo">
              <img 
                src={logoImage} 
                alt="WebsiteAbonnementen" 
                className="h-10 w-10 md:h-11 md:w-11 rounded-md object-contain"
              />
              <span className="text-lg md:text-xl font-semibold">WebsiteAbonnementen</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
              Premium website abonnementen met beheerde hosting, SEO, en reclame-oplossingen.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-1 pt-1">
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

          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-4 md:mb-5 text-sm font-semibold tracking-wide uppercase text-foreground">Producten</h4>
            <ul className="space-y-2.5 md:space-y-3 text-sm">
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
                  href="/projecten" 
                  className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  data-testid="link-footer-projecten"
                >
                  Projecten
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-4 md:mb-5 text-sm font-semibold tracking-wide uppercase text-foreground">Bedrijf</h4>
            <ul className="space-y-2.5 md:space-y-3 text-sm">
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

          <div className="col-span-2 lg:col-span-4 space-y-5">
            <div>
              <h4 className="mb-2 text-sm font-semibold tracking-wide uppercase text-foreground">Nieuwsbrief</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Blijf op de hoogte van updates
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2" data-testid="form-newsletter">
                <Input
                  type="email"
                  placeholder="Uw e-mailadres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button type="submit" className="w-full sm:w-auto" data-testid="button-newsletter-subscribe">
                  Aanmelden
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>SSL</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>GDPR</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Veilig betalen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 border-t border-border/50 pt-6 md:pt-8 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
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
          
          <p className="text-xs text-muted-foreground" data-testid="text-copyright">
            {currentYear} WebsiteAbonnementen. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
