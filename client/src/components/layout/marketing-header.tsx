import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

export function MarketingHeader() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Prijzen" },
    { href: "/about", label: "Over ons" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">WebsiteAbonnementen</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={location === link.href ? "bg-accent" : ""}
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/app">
              <Button data-testid="button-dashboard">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">
                  Inloggen
                </Button>
              </Link>
              <Link href="/signup">
                <Button data-testid="button-signup">
                  Aan de slag
                </Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${location === link.href ? "bg-accent" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="border-t my-2" />
            {user ? (
              <Link href="/app">
                <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Inloggen
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Aan de slag
                  </Button>
                </Link>
              </>
            )}
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
