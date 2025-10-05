"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type Locale = "es" | "en" | "de";

type Dict = Record<string, string>;

const DICTS: Record<Locale, Dict> = {
  es: {
    app: "EcoNexo",
    map: "Mapa",
    events: "Eventos",
    all: "Todas",
    category: "Categoría",
    volunteers: "Voluntaries",
    raised: "Recaudado",
    goal: "Meta",
    description: "Descripción",
    availableSpots: "Cupos disponibles",
    beVolunteer: "Ser voluntarix",
    donatePaypal: "Donar con PayPal",
    donateStripe: "Donar con Stripe",
    createEvent: "Crear evento",
    optionalCategories: "Categorías opcionales",
    existingEvents: "Eventos existentes",
    viewDetails: "Ver detalle",
    impact: "Impacto",
    backToMap: "Volver al mapa",
    title: "Título",
    date: "Fecha",
    city: "Ciudad",
    country: "País",
    mainCategory: "Categoría principal",
    capacity: "Cupo",
    notes: "Notas",
    save: "Guardar",
    noEvents: "No hay eventos aún",
    createdEvent: "Evento creado",
    volunteersPageTitle: "Ser voluntarix",
    localRecords: "Registros locales",
    name: "Nombre",
    email: "Email",
    availability: "Disponibilidad",
    saved: "¡Guardado!",
    required: "obligatorio",
    optional: "opcional",
    also: "además",
    titlePh: "Nombre del evento",
    cityPh: "Ciudad",
    countryPh: "País",
    capacityPh: "Número de plazas",
    notesPh: "Detalles, requisitos, etc.",
    availabilityPh: "Ej: fines de semana",
  },
  en: {
    app: "EcoNexo",
    map: "Map",
    events: "Events",
    all: "All",
    category: "Category",
    volunteers: "Volunteers",
    raised: "Raised",
    goal: "Goal",
    description: "Description",
    availableSpots: "Available spots",
    beVolunteer: "Become a volunteer",
    donatePaypal: "Donate with PayPal",
    donateStripe: "Donate with Stripe",
    createEvent: "Create event",
    optionalCategories: "Optional categories",
    existingEvents: "Existing events",
    viewDetails: "View details",
    impact: "Impact",
    backToMap: "Back to map",
    title: "Title",
    date: "Date",
    city: "City",
    country: "Country",
    mainCategory: "Main category",
    capacity: "Capacity",
    notes: "Notes",
    save: "Save",
    noEvents: "No events yet",
    createdEvent: "Event created",
    volunteersPageTitle: "Become a volunteer",
    localRecords: "Local records",
    name: "Name",
    email: "Email",
    availability: "Availability",
    saved: "Saved!",
    required: "required",
    optional: "optional",
    also: "also",
    titlePh: "Event name",
    cityPh: "City",
    countryPh: "Country",
    capacityPh: "Number of seats",
    notesPh: "Details, requirements, etc.",
    availabilityPh: "e.g., weekends",
  },
  de: {
    app: "EcoNexo",
    map: "Karte",
    events: "Veranstaltungen",
    all: "Alle",
    category: "Kategorie",
    volunteers: "Freiwillige",
    raised: "Eingenommen",
    goal: "Ziel",
    description: "Beschreibung",
    availableSpots: "Verfügbare Plätze",
    beVolunteer: "Freiwillige/r werden",
    donatePaypal: "Mit PayPal spenden",
    donateStripe: "Mit Stripe spenden",
    createEvent: "Veranstaltung erstellen",
    optionalCategories: "Optionale Kategorien",
    existingEvents: "Vorhandene Veranstaltungen",
    viewDetails: "Details ansehen",
    impact: "Wirkung",
    backToMap: "Zurück zur Karte",
    title: "Titel",
    date: "Datum",
    city: "Stadt",
    country: "Land",
    mainCategory: "Hauptkategorie",
    capacity: "Kapazität",
    notes: "Notizen",
    save: "Speichern",
    noEvents: "Noch keine Veranstaltungen",
    createdEvent: "Veranstaltung erstellt",
    volunteersPageTitle: "Als Freiwillige/r mitmachen",
    localRecords: "Lokale Einträge",
    name: "Name",
    email: "E-Mail",
    availability: "Verfügbarkeit",
    saved: "Gespeichert!",
    required: "erforderlich",
    optional: "optional",
    also: "außerdem",
    titlePh: "Veranstaltungsname",
    cityPh: "Stadt",
    countryPh: "Land",
    capacityPh: "Anzahl der Plätze",
    notesPh: "Details, Anforderungen usw.",
    availabilityPh: "z. B. Wochenenden",
  },
};

const I18nContext = createContext<{ t: (k: string) => string; locale: Locale; setLocale: (l: Locale) => void } | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("econexo:locale") as Locale | null;
        if (saved) setLocaleState(saved);
      }
    } catch {}
  }, []);
  const t = useMemo(() => {
    const dict = DICTS[locale] || DICTS.es;
    return (k: string) => dict[k] ?? k;
  }, [locale]);
  const value = useMemo(
    () => ({
      t,
      locale,
      setLocale: (l: Locale) => {
        try {
          if (typeof window !== "undefined") localStorage.setItem("econexo:locale", l);
        } catch {}
        setLocaleState(l);
      },
    }),
    [t, locale]
  );
  return React.createElement(I18nContext.Provider, { value }, children as any);
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider missing");
  return ctx;
}

const CATEGORY_MAP: Record<string, { en: string; de: string }> = {
  "Medio ambiente": { en: "Environment", de: "Umwelt" },
  "Educación": { en: "Education", de: "Bildung" },
  "Salud": { en: "Health", de: "Gesundheit" },
  "Comunidad": { en: "Community", de: "Gemeinschaft" },
  "Océanos": { en: "Oceans", de: "Ozeane" },
  "Alimentación": { en: "Food", de: "Ernährung" },
};

export function categoryLabel(original: string, locale: Locale) {
  if (locale === "es") return original;
  const m = CATEGORY_MAP[original];
  if (!m) return original;
  return (m as any)[locale] || original;
}


