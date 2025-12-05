import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";

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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 group transition-opacity duration-200 hover:opacity-80" 
          data-testid="link-logo"
        >
          <img 
            src={logoImage} 
            alt="WebsiteAbonnementen" 
            className="h-12 w-12 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 object-contain"
          />
          <span className="text-xl font-semibold tracking-tight">WebsiteAbonnementen</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`relative transition-all duration-200 ${
                    isActive 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground"
                  }`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link href="/app">
              <Button data-testid="button-dashboard">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground transition-colors duration-200"
                  data-testid="button-login"
                >
                  Inloggen
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  className="shadow-sm shadow-primary/20 transition-shadow duration-200 hover:shadow-md hover:shadow-primary/30"
                  data-testid="button-signup"
                >
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10 dark:border-white/5 bg-background/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link, index) => {
                const isActive = location === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link href={link.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start transition-all duration-200 ${
                          isActive 
                            ? "text-foreground font-medium bg-accent/50" 
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="border-t border-border/50 my-3" 
              />
              
              {user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <Link href="/app">
                    <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <Link href="/login">
                      <Button 
                        variant="ghost" 
                        className="w-full text-muted-foreground" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Inloggen
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Link href="/signup">
                      <Button 
                        className="w-full shadow-sm shadow-primary/20" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Aan de slag
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="flex justify-center pt-3"
              >
                <ThemeToggle />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
