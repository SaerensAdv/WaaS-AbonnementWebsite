import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Language = "nl" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "preferred-language";

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "nl";
  
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  if (langCode === "en") return "en";
  if (langCode === "nl" || langCode === "be" || langCode === "de" || langCode === "fr") return "nl";
  
  return "en";
}

function getStoredLanguage(): Language | null {
  if (typeof localStorage === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "nl" || stored === "en") return stored;
  return null;
}

function storeLanguage(lang: Language): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

let nlTranslations: Translations = {};
let enTranslations: Translations = {};

export function setTranslations(nl: Translations, en: Translations) {
  nlTranslations = nl;
  enTranslations = en;
}

function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return typeof current === "string" ? current : undefined;
}

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{{${key}}}`;
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = getStoredLanguage();
    if (stored) return stored;
    return detectBrowserLanguage();
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    storeLanguage(lang);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const translations = language === "nl" ? nlTranslations : enTranslations;
    const value = getNestedValue(translations, key);
    
    if (value === undefined) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      return key;
    }
    
    return interpolate(value, params);
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage } = useI18n();
  return { t, language, setLanguage };
}
