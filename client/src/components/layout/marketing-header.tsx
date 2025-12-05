import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/4ef942ca-8d76-4222-9f26-919b2fc00dd3_1764969199445.png";
import logoGif from "@assets/Untitled_design_1764969853491.gif";

export function MarketingHeader() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Prijzen" },
    { href: "/about", label: "Over ons" },
  ];

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
            <span className="text-lg font-semibold tracking-tight hidden sm:inline">WebsiteAbonnementen</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative transition-all duration-200 ${
                      isActive 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground"
                    }`}
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link href="/app">
                <Button size="sm" data-testid="button-dashboard">Dashboard</Button>
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
                    Inloggen
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="sm"
                    className="shadow-sm shadow-primary/20 transition-shadow duration-200 hover:shadow-md hover:shadow-primary/30"
                    data-testid="button-signup"
                  >
                    Aan de slag
                  </Button>
                </Link>
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
            className="md:hidden absolute left-4 right-4 top-[calc(100%+0.5rem)] mx-auto max-w-5xl rounded-2xl border border-white/20 dark:border-white/10 bg-background/95 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden"
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
