"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { DICTS, Locale, categoryLabel, locationLabel, projectDescriptionLabel, projectNameLabel, impactTagLabel } from "./dictionaries";

export type { Locale };
export { DICTS, categoryLabel, locationLabel, projectDescriptionLabel, projectNameLabel, impactTagLabel };

const I18nContext = createContext<{ t: (k: string, vars?: Record<string, any>) => string; locale: Locale; setLocale: (l: Locale) => void } | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("econexo:locale");
        if (saved && ["es", "en", "de"].includes(saved)) {
          setLocaleState(saved as Locale);
        }
      }
    } catch { }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("econexo:locale", l);
      }
    } catch { }
  };

  const t = useMemo(() => {
    // Defensive Access: Check if DICTS[locale] exists, fallback to 'en'
    const dict = DICTS[locale] || DICTS['en'];
    const FALLBACKS: Record<Locale, Record<string, string>> = {
      en: {
        // General
        all: "All",
        apply: "Apply",
        filters: "Filters",
        search: "Search",
        searchProjects: "Search projects, cities or countries",
        categories: "Categories",
        onlyAvailableSpots: "Only with available spots",
        maxDistance: "Max distance",
        anyDistance: "Any distance",
        dateRange: "Date range",
        country: "Country",
        city: "City",
        type: "Type",
        events: "Events",
        permanent: "Permanent",
        centerOnLocation: "Center on my location",
        clearFilters: "Clear filters",
        availableSpots: "Available spots",
        category: "Category",
        // EcoTips
        ecoTips: "Eco Tips",
        ecoTipsDescription: "Practical ideas to reduce your footprint and live sustainably.",
        ecoTipCategoryFinance: "Finance",
        ecoTipCategoryTransport: "Transport",
        ecoTipCategoryFood: "Food",
        ecoTipCategoryEnergy: "Energy",
        ecoTipCategoryWaste: "Waste",
        ecoTipCategoryWater: "Water",
        highImpact: "High impact",
        mediumImpact: "Medium impact",
        lowImpact: "Low impact",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        // Event detail common
        date: "Date",
        time: "Time",
        location: "Location",
        contact: "Contact",
        volunteerProgress: "Volunteer progress",
        volunteers: "volunteers",
        spotsLeft: "spots left",
        fullyBooked: "Fully booked",
        requirements: "Requirements",
        benefits: "Benefits",
        joinEvent: "Join event",
        shareEvent: "Share",
        backToEvents: "Back to events",
        backToMap: "Back to map",
      },
      de: {
        // General
        all: "Alle",
        apply: "Anwenden",
        filters: "Filter",
        search: "Suche",
        searchProjects: "Suche nach Projekten, Städten oder Ländern",
        categories: "Kategorien",
        onlyAvailableSpots: "Nur mit freien Plätzen",
        maxDistance: "Maximale Entfernung",
        anyDistance: "Beliebige Entfernung",
        dateRange: "Datumsbereich",
        country: "Land",
        city: "Stadt",
        type: "Typ",
        events: "Veranstaltungen",
        permanent: "Dauerhaft",
        centerOnLocation: "Auf meinen Standort zentrieren",
        clearFilters: "Filter zurücksetzen",
        availableSpots: "Freie Plätze",
        category: "Kategorie",
        // EcoTips
        ecoTips: "Eco‑Tipps",
        ecoTipsDescription: "Praktische Ideen, um deinen Fußabdruck zu senken und nachhaltig zu leben.",
        ecoTipCategoryFinance: "Finanzen",
        ecoTipCategoryTransport: "Verkehr",
        ecoTipCategoryFood: "Ernährung",
        ecoTipCategoryEnergy: "Energie",
        ecoTipCategoryWaste: "Abfall",
        ecoTipCategoryWater: "Wasser",
        highImpact: "Hohe Wirkung",
        mediumImpact: "Mittlere Wirkung",
        lowImpact: "Geringe Wirkung",
        easy: "Leicht",
        medium: "Mittel",
        hard: "Schwierig",
        // Event detail common
        date: "Datum",
        time: "Zeit",
        location: "Ort",
        contact: "Kontakt",
        volunteerProgress: "Freiwilligen‑Fortschritt",
        volunteers: "Freiwillige",
        spotsLeft: "Plätze frei",
        fullyBooked: "Ausgebucht",
        requirements: "Voraussetzungen",
        benefits: "Vorteile",
        joinEvent: "Teilnehmen",
        shareEvent: "Teilen",
        backToEvents: "Zurück zu Veranstaltungen",
        backToMap: "Zurück zur Karte",
      },
      es: {},
    } as any;
    const humanizeKey = (key: string) => {
      if (!key) return key;
      const spaced = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[-_.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    };
    return (k: string, vars?: Record<string, any>) => {
      let translation = dict[k];
      if (!translation) {
        console.warn(`Missing translation key "${k}" for locale "${locale}"`);
        const fb = (FALLBACKS as any)[locale]?.[k];
        translation = fb || humanizeKey(k);
      }

      if (vars && typeof translation === 'string') {
        Object.entries(vars).forEach(([key, value]) => {
          translation = translation.replace(`{{${key}}}`, String(value));
        });
      }

      return translation;
    };
  }, [locale]);

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