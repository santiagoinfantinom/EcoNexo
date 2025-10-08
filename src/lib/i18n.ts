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
    reached: "alcanzado",
    titlePh: "Nombre del evento",
    cityPh: "Ciudad",
    countryPh: "País",
    capacityPh: "Número de plazas",
    notesPh: "Detalles, requisitos, etc.",
    availabilityPh: "Ej: fines de semana",
    backToProject: "Volver al proyecto",
    // Map filters
    filters: "Filtros",
    search: "Buscar",
    searchProjects: "Buscar proyectos...",
    categories: "Categorías",
    onlyAvailableSpots: "Solo cupos disponibles",
    maxDistance: "Distancia máxima",
    anyDistance: "Cualquier distancia",
    clearFilters: "Limpiar filtros",
    apply: "Aplicar",
    myLocation: "Mi ubicación",
    centerOnLocation: "Centrar en mi ubicación",
    // Calendar
    calendar: "Calendario",
    month: "Mes",
    week: "Semana",
    list: "Lista",
    viewProject: "Ver proyecto",
    join: "Unirse",
    // Map layers
    satellite: "Satélite",
    traffic: "Tráfico",
    terrain: "Terreno",
    // Clustering
    showAll: "Mostrar todos",
    clusterInfo: "proyectos en esta área",
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
    reached: "reached",
    titlePh: "Event name",
    cityPh: "City",
    countryPh: "Country",
    capacityPh: "Number of seats",
    notesPh: "Details, requirements, etc.",
    availabilityPh: "e.g., weekends",
    backToProject: "Back to project",
    // Map filters
    filters: "Filters",
    search: "Search",
    searchProjects: "Search projects...",
    categories: "Categories",
    onlyAvailableSpots: "Only available spots",
    maxDistance: "Max distance",
    anyDistance: "Any distance",
    clearFilters: "Clear filters",
    apply: "Apply",
    myLocation: "My location",
    centerOnLocation: "Center on my location",
    // Calendar
    calendar: "Calendar",
    month: "Month",
    week: "Week",
    list: "List",
    viewProject: "View project",
    join: "Join",
    // Map layers
    satellite: "Satellite",
    traffic: "Traffic",
    terrain: "Terrain",
    // Clustering
    showAll: "Show all",
    clusterInfo: "projects in this area",
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
    reached: "erreicht",
    titlePh: "Veranstaltungsname",
    cityPh: "Stadt",
    countryPh: "Land",
    capacityPh: "Anzahl der Plätze",
    notesPh: "Details, Anforderungen usw.",
    availabilityPh: "z. B. Wochenenden",
    backToProject: "Zurück zum Projekt",
    // Map filters
    filters: "Filter",
    search: "Suchen",
    searchProjects: "Projekte suchen...",
    categories: "Kategorien",
    onlyAvailableSpots: "Nur verfügbare Plätze",
    maxDistance: "Maximale Entfernung",
    anyDistance: "Beliebige Entfernung",
    clearFilters: "Filter löschen",
    apply: "Anwenden",
    myLocation: "Mein Standort",
    centerOnLocation: "Auf meinen Standort zentrieren",
    // Calendar
    calendar: "Kalender",
    month: "Monat",
    week: "Woche",
    list: "Liste",
    viewProject: "Projekt ansehen",
    join: "Beitreten",
    // Map layers
    satellite: "Satellit",
    traffic: "Verkehr",
    terrain: "Gelände",
    // Clustering
    showAll: "Alle anzeigen",
    clusterInfo: "Projekte in diesem Bereich",
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

// Impact tags translations from Spanish labels used in data
const IMPACT_TAG_MAP: Record<string, { en: string; de: string }> = {
  "Reforestación": { en: "Reforestation", de: "Aufforstung" },
  "Calidad del aire": { en: "Air quality", de: "Luftqualität" },
  STEM: { en: "STEM", de: "STEM" },
  "Inclusión": { en: "Inclusion", de: "Inklusion" },
  "Prevención": { en: "Prevention", de: "Prävention" },
  "Acceso": { en: "Access", de: "Zugang" },
  "Integración": { en: "Integration", de: "Integration" },
  "Cultura": { en: "Culture", de: "Kultur" },
  "Playas limpias": { en: "Clean beaches", de: "Saubere Strände" },
  "Biodiversidad": { en: "Biodiversity", de: "Biodiversität" },
  "Huertos urbanos": { en: "Urban gardens", de: "Urbane Gärten" },
  "Comunidad": { en: "Community", de: "Gemeinschaft" },
};

export function impactTagLabel(original: string, locale: Locale) {
  if (locale === "es") return original;
  const m = IMPACT_TAG_MAP[original];
  if (!m) return original;
  return (m as any)[locale] || original;
}

// Optional per-project description translations for fallback/demo content
const PROJECT_DESCRIPTION_MAP: Record<string, { en: string; de: string }> = {
  p1: {
    en: "Planting native trees in neighborhoods lacking green areas, engaging schools and local organizations.",
    de: "Pflanzung einheimischer Bäume in Vierteln mit wenig Grünflächen, unter Einbindung von Schulen und lokalen Organisationen.",
  },
  p2: {
    en: "STEAM program for at‑risk youth focusing on prototyping and computational thinking.",
    de: "STEAM‑Programm für benachteiligte Jugendliche mit Schwerpunkt auf Prototyping und Computational Thinking.",
  },
  p3: {
    en: "Mobile primary care with a focus on prevention and basic check‑ups in peripheral neighborhoods.",
    de: "Mobile Grundversorgung mit Fokus auf Prävention und Basis‑Checks in Randbezirken.",
  },
  p4: {
    en: "Coastal clean‑ups, microplastic monitoring, and environmental education for tourists and residents.",
    de: "Küstenreinigung, Mikroplastik‑Monitoring und Umweltbildung für Tourist:innen und Einwohner:innen.",
  },
  p5: {
    en: "Network of community gardens to strengthen food security and promote sustainable diets.",
    de: "Netzwerk von Gemeinschaftsgärten zur Stärkung der Ernährungssicherheit und Förderung nachhaltiger Ernährung.",
  },
  p6: {
    en: "Creation of community centers with cultural programming and integration workshops for new residents.",
    de: "Aufbau von Nachbarschaftszentren mit Kulturprogramm und Integrationsworkshops für neue Einwohner:innen.",
  },
};

export function projectDescriptionLabel(projectId: string, original: string, locale: Locale) {
  if (locale === "es") return original;
  const m = PROJECT_DESCRIPTION_MAP[projectId];
  if (!m) return original;
  return (m as any)[locale] || original;
}

// Translations for demo project names (as displayed on the map)
const PROJECT_NAME_MAP: Record<string, { en: string; de: string }> = {
  p1: { en: "Berlin Urban Reforestation", de: "Urbane Aufforstung Berlin" },
  p2: { en: "Educational Robotics Workshop", de: "Workshop für Bildungsrobotik" },
  p3: { en: "Community Mobile Clinic", de: "Mobile Gemeinschaftsklinik" },
  p4: { en: "Beach Recovery", de: "Strandaufbereitung" },
  p5: { en: "Urban Gardens", de: "Urbane Gärten" },
  p6: { en: "Inclusive Neighborhood Centers", de: "Inklusive Nachbarschaftszentren" },
};

export function projectNameLabel(projectId: string, original: string, locale: Locale) {
  if (locale === "es") return original;
  const m = PROJECT_NAME_MAP[projectId];
  if (!m) return original;
  return (m as any)[locale] || original;
}

