// src/components/LanguageSwitcher.tsx
"use client";

import { useLanguage, LANGUAGES, type LangCode } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-1 rounded-full bg-clay-100 p-1">
      {(Object.keys(LANGUAGES) as LangCode[]).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            lang === code
              ? "bg-leaf-500 text-white"
              : "text-ink/70 hover:bg-clay-200"
          }`}
        >
          {LANGUAGES[code].native}
        </button>
      ))}
    </div>
  );
}
