import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/i18n-context";
import { List, X } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import logoImage from "@assets/logo-abonnement-website.webp";
import logoGif from "@assets/logo-animated.webp";

const ICON_WEIGHT = "duotone" as const;

export function MarketingHeader() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], [0.7, 0.95]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleScroll = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <motion.header
        className="mx-auto max-w-5xl rounded-full border border-border/50 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20"
        style={{
          backgroundColor: `hsl(var(--background) / ${headerBg})`,
        }}
      >
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

          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/#pricing", label: "Prijzen", testId: "nav-pricing" },
              { href: "/#maatwerk", label: "Op Maat", testId: "nav-maatwerk" },
              { href: "/#addons", label: "Add-ons", testId: "nav-addons" },
              { href: "/#faq", label: "FAQ", testId: "nav-faq" },
            ].map((link) => (
              <a key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  data-testid={link.testId}
                >
                  {link.label}
                </Button>
              </a>
            ))}
            <Link href="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-testid="nav-blog"
              >
                Blog
              </Button>
            </Link>
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
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    data-testid="button-login"
                  >
                    {t("common.buttons.login")}
                  </Button>
                </Link>
                <a href="/#pricing">
                  <Button
                    size="sm"
                    className="shadow-sm shadow-primary/20"
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
                    <X size={20} weight={ICON_WEIGHT} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <List size={20} weight={ICON_WEIGHT} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute left-4 right-4 top-[calc(100%+0.5rem)] mx-auto max-w-5xl rounded-2xl border border-border/50 bg-card/95 backdrop-blur-2xl shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              <a href="/#pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Prijzen</Button>
              </a>
              <a href="/#maatwerk" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Op Maat</Button>
              </a>
              <a href="/#addons" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">Add-ons</Button>
              </a>
              <a href="/#faq" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">FAQ</Button>
              </a>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" data-testid="nav-blog-mobile">Blog</Button>
              </Link>

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
                  <a href="/#pricing">
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
