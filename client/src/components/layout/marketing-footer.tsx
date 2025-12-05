import { Link } from "wouter";
import { Globe } from "lucide-react";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">WebsiteAbonnementen</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium website abonnementen met beheerde hosting, SEO, en reclame-oplossingen.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Producten</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Abonnementen
                </Link>
              </li>
              <li>
                <Link href="/pricing#addons" className="hover:text-foreground transition-colors">
                  Add-ons
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Bedrijf</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/specialists" className="hover:text-foreground transition-colors">
                  Word specialist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Algemene voorwaarden
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors">
                  Cookiebeleid
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {currentYear} WebsiteAbonnementen. Alle rechten voorbehouden.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care in the Netherlands
          </p>
        </div>
      </div>
    </footer>
  );
}
