"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Locale, categoryLabel, locationLabel, projectDescriptionLabel, projectNameLabel, impactTagLabel } from "./dictionaries";

export type { Locale };
export { categoryLabel, locationLabel, projectDescriptionLabel, projectNameLabel, impactTagLabel };

const I18nContext = createContext<{ t: (k: string, vars?: Record<string, any>) => string; locale: Locale; setLocale: (l: Locale) => void } | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [dict, setDict] = useState<Record<string, string>>({});
  const [enDict, setEnDict] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("econexo:locale");
        if (saved && ["es", "en", "de"].includes(saved)) {
          setLocaleState(saved as Locale);
        }
      }
    } catch { }
    // Fetch EN fallback
    import('./dictionaries/en').then(m => setEnDict(m.default || m)).catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (["es", "en", "de"].includes(locale)) {
      import(`./dictionaries/${locale}`).then(m => {
        if (isMounted) setDict(m.default || m);
      }).catch(e => console.error("Dict load error", e));
    }
    return () => { isMounted = false; };
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("econexo:locale", l);
      }
    } catch { }
  };

  const humanizeKey = (key: string) => {
    if (!key) return key;
    const spaced = key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const t = useMemo(() => {
    return (k: string, vars?: Record<string, any>) => {
      let translation = dict[k] || enDict[k];
      
      if (!translation) {
        translation = humanizeKey(k);
      }

      if (vars && typeof translation === 'string') {
        Object.entries(vars).forEach(([key, value]) => {
          translation = translation.replace(`{{${key}}}`, String(value));
        });
      }

      return translation;
    };
  }, [dict, enDict]);

  return React.createElement(
    I18nContext.Provider,
    { value: { t, locale, setLocale } },
    children
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
