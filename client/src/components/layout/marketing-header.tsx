import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/i18n-context";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";
import logoGif from "@assets/Untitled_design_1764969853491.gif";

export function MarketingHeader() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStaticLogo, setShowStaticLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-4">
      <header className="mx-auto max-w-5xl rounded-full border border-white/20 dark:border-white/10 bg-background/60 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-primary/10">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity duration-200 hover:opacity-80"
            data-testid="link-logo"
          >
            <img
              src={showStaticLogo ? logoImage : logoGif}
              alt="WebsiteAbonnementen"
              className="h-10 w-10 rounded-lg transition-transform duration-200 group-hover:scale-105 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight hidden sm:inline">abo.web</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a href="#pricing">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                data-testid="nav-pricing"
              >
                Prijzen
              </Button>
            </a>
            <a href="#addons">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                data-testid="nav-addons"
              >
                Add-ons
              </Button>
            </a>
            <a href="#faq">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                data-testid="nav-faq"
              >
                FAQ
              </Button>
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <Link href={user.role === "ADMIN" ? "/admin" : "/app"}>
                <Button size="sm" data-testid="button-dashboard">{t("common.buttons.dashboard")}</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground transition-colors duration-200"
                    data-testid="button-login"
                  >
                    {t("common.buttons.login")}
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button
                    size="sm"
                    className="shadow-sm shadow-primary/20 transition-shadow duration-200 hover:shadow-md hover:shadow-primary/30"
                    data-testid="button-get-started"
                  >
                    {t("common.buttons.getStarted")}
                  </Button>
                </a>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute left-4 right-4 top-[calc(100%+0.5rem)] mx-auto max-w-5xl rounded-2xl border border-white/20 dark:border-white/10 bg-background/60 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-primary/10 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Prijzen</Button>
              </a>
              <a href="#addons" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Add-ons</Button>
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">FAQ</Button>
              </a>

              <div className="border-t border-border/50 my-3" />

              {user ? (
                <Link href={user.role === "ADMIN" ? "/admin" : "/app"}>
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
                      Inloggen
                    </Button>
                  </Link>
                  <a href="#pricing">
                    <Button className="w-full shadow-sm shadow-primary/20" onClick={() => setMobileMenuOpen(false)}>
                      Aan de slag
                    </Button>
                  </a>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
