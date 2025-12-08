import { nl, type TranslationKeys } from "./nl";
import { en } from "./en";

export type Language = "nl" | "en";

export const translations: Record<Language, TranslationKeys> = {
  nl,
  en,
};

export { nl, en };
export type { TranslationKeys };

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang] || translations.nl;
}

export function t(lang: Language, path: string): string {
  const keys = path.split(".");
  let result: any = translations[lang];
  
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      console.warn(`Translation key not found: ${path} for language: ${lang}`);
      return path;
    }
  }
  
  return typeof result === "string" ? result : path;
}

export const defaultLanguage: Language = "nl";

export const supportedLanguages: { code: Language; name: string; nativeName: string }[] = [
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "en", name: "English", nativeName: "English" },
];
