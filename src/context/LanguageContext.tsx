// src/context/LanguageContext.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type LangCode = "en" | "hi" | "kn";

export const LANGUAGES: Record<LangCode, { label: string; native: string; speechCode: string }> = {
  en: { label: "English", native: "English", speechCode: "en-IN" },
  hi: { label: "Hindi", native: "हिन्दी", speechCode: "hi-IN" },
  kn: { label: "Kannada", native: "ಕನ್ನಡ", speechCode: "kn-IN" },
};

const LanguageContext = createContext<{
  lang: LangCode;
  setLang: (l: LangCode) => void;
}>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
