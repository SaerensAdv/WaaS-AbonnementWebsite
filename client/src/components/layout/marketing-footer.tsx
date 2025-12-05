import { Link } from "wouter";
import { Linkedin, Twitter, Instagram, Mail, ShieldCheck, CreditCard, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";

function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/30 md:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 md:hidden"
        data-testid={`button-footer-accordion-${title.toLowerCase().replace(/\s/g, '-')}`}
      >
        <span className="text-sm font-semibold tracking-wide uppercase text-foreground">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>
      
      <h4 className="hidden md:block mb-5 text-sm font-semibold tracking-wide uppercase text-foreground">
        {title}
      </h4>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="hidden md:block">
        {children}
      </div>
    </div>
  );
}

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
        <div className="md:hidden mb-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <Link href="/" className="flex items-center gap-3" data-testid="link-footer-logo-mobile">
              <img 
                src={logoImage} 
                alt="WebsiteAbonnementen" 
                className="h-12 w-12 rounded-md object-contain"
              />
              <span className="text-xl font-semibold">WebsiteAbonnementen</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium website abonnementen met beheerde hosting, SEO, en reclame-oplossingen.
            </p>

            <div className="flex items-center gap-1 pt-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-linkedin-mobile"
              >
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-twitter-mobile"
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-instagram-mobile"
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                data-testid="link-social-email-mobile"
              >
                <a href="mailto:info@websiteabonnementen.nl" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-0 md:gap-12 lg:grid-cols-12">
          <div className="hidden md:block lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3" data-testid="link-footer-logo">
              <img 
                src={logoImage} 
                alt="WebsiteAbonnementen" 
                className="h-11 w-11 rounded-md object-contain"
              />
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
            <FooterAccordion title="Producten">
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
            </FooterAccordion>
          </div>

          <div className="lg:col-span-2">
            <FooterAccordion title="Bedrijf">
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
            </FooterAccordion>
          </div>

          <div className="lg:col-span-4 space-y-6 pt-4 md:pt-0">
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide uppercase text-foreground">Nieuwsbrief</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Blijf op de hoogte van de laatste updates
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

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 pt-4">
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

        <div className="mt-10 md:mt-16 border-t border-border/50 pt-6 md:pt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground text-center md:text-left order-2 md:order-1" data-testid="text-copyright">
            {currentYear} WebsiteAbonnementen. Alle rechten voorbehouden.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm order-1 md:order-2">
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
