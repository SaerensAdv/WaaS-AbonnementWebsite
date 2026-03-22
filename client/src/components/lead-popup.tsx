import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PaperPlaneTilt, CheckCircle, ShieldCheck, Clock, ChatCircleDots } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const ICON_WEIGHT = "duotone" as const;
const POPUP_COOKIE = "wa_popup_dismissed";
const POPUP_SUBMITTED = "wa_popup_submitted";
const SCROLL_THRESHOLD = 0.65;
const TIME_DELAY_MS = 20000;

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasTriggered = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    vraag: "",
  });

  const wasDismissed = getCookie(POPUP_COOKIE) || getCookie(POPUP_SUBMITTED);

  const showPopup = useCallback(() => {
    if (hasTriggered.current || wasDismissed) return;
    hasTriggered.current = true;
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsVisible(true);
  }, [wasDismissed]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setCookie(POPUP_COOKIE, "1", 7);
    previousFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isVisible && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, dismiss]);

  useEffect(() => {
    const handleManualOpen = () => {
      hasTriggered.current = false;
      previousFocusRef.current = document.activeElement as HTMLElement;
      setIsVisible(true);
      setIsSuccess(false);
      setErrors({});
      setFormData({ naam: "", email: "", vraag: "" });
    };

    window.addEventListener("open-lead-popup", handleManualOpen);

    return () => {
      window.removeEventListener("open-lead-popup", handleManualOpen);
    };
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.naam.trim() || formData.naam.trim().length < 2) {
      newErrors.naam = "Vul uw naam in";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Vul een geldig e-mailadres in";
    }
    if (formData.vraag.length > 1000) {
      newErrors.vraag = "Maximaal 1000 tekens";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/popup-lead", {
        name: formData.naam.trim(),
        email: formData.email.trim(),
        message: formData.vraag.trim() || undefined,
      });
      setIsSuccess(true);
      setCookie(POPUP_SUBMITTED, "1", 90);
      setTimeout(() => {
        setIsVisible(false);
        previousFocusRef.current?.focus();
      }, 3000);
    } catch {
      setErrors({ form: "Er ging iets mis. Probeer het opnieuw." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
            data-testid="popup-overlay"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-dialog-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[101] inset-4 m-auto w-[calc(100%-2rem)] max-w-md h-fit bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            data-testid="popup-lead-form"
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              aria-label="Sluiten"
              data-testid="button-popup-close"
            >
              <X size={18} weight="bold" />
            </button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-12 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={36} weight="fill" className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" data-testid="text-popup-success-title">
                    Bericht ontvangen!
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-popup-success-message">
                    We nemen binnen 24 uur contact met u op.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  <div className="px-6 pt-7 pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f3a427]/10 flex items-center justify-center shrink-0">
                        <ChatCircleDots size={22} weight={ICON_WEIGHT} className="text-[#f3a427]" />
                      </div>
                      <div>
                        <h3 id="popup-dialog-title" className="text-lg font-semibold leading-tight" data-testid="text-popup-title">
                          Gratis advies nodig?
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Reactie binnen 24 uur, zonder verplichtingen.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5" noValidate>
                    <div>
                      <label htmlFor="popup-naam" className="block text-sm font-medium mb-1.5">
                        Naam
                      </label>
                      <input
                        ref={firstInputRef}
                        id="popup-naam"
                        type="text"
                        value={formData.naam}
                        onChange={(e) => handleChange("naam", e.target.value)}
                        placeholder="Jan Janssen"
                        aria-invalid={!!errors.naam}
                        aria-describedby={errors.naam ? "popup-naam-error" : undefined}
                        className={`w-full h-11 px-3.5 rounded-lg border bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#f3a427]/30 focus:border-[#f3a427] ${errors.naam ? "border-red-400" : "border-border"}`}
                        data-testid="input-popup-naam"
                        autoComplete="name"
                      />
                      {errors.naam && (
                        <p id="popup-naam-error" className="text-xs text-red-500 mt-1" role="alert">{errors.naam}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="popup-email" className="block text-sm font-medium mb-1.5">
                        E-mailadres
                      </label>
                      <input
                        id="popup-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="jan@bedrijf.nl"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "popup-email-error" : undefined}
                        className={`w-full h-11 px-3.5 rounded-lg border bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#f3a427]/30 focus:border-[#f3a427] ${errors.email ? "border-red-400" : "border-border"}`}
                        data-testid="input-popup-email"
                        autoComplete="email"
                        inputMode="email"
                      />
                      {errors.email && (
                        <p id="popup-email-error" className="text-xs text-red-500 mt-1" role="alert">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="popup-vraag" className="block text-sm font-medium mb-1.5">
                        Uw vraag <span className="text-muted-foreground font-normal">(optioneel)</span>
                      </label>
                      <textarea
                        id="popup-vraag"
                        value={formData.vraag}
                        onChange={(e) => handleChange("vraag", e.target.value)}
                        placeholder="Waar kunnen we u mee helpen?"
                        rows={3}
                        maxLength={1000}
                        aria-invalid={!!errors.vraag}
                        aria-describedby={errors.vraag ? "popup-vraag-error" : undefined}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-[#f3a427]/30 focus:border-[#f3a427]"
                        data-testid="input-popup-vraag"
                      />
                      {errors.vraag && (
                        <p id="popup-vraag-error" className="text-xs text-red-500 mt-1" role="alert">{errors.vraag}</p>
                      )}
                    </div>

                    {errors.form && (
                      <p className="text-xs text-red-500 text-center" role="alert">{errors.form}</p>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 gap-2 text-sm font-medium rounded-xl"
                      disabled={isSubmitting}
                      data-testid="button-popup-submit"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Verzenden...
                        </span>
                      ) : (
                        <>
                          Verstuur mijn vraag
                          <PaperPlaneTilt size={16} weight={ICON_WEIGHT} />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} weight={ICON_WEIGHT} />
                        Binnen 24 uur reactie
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} weight={ICON_WEIGHT} />
                        Geen spam
                      </span>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
