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
    noVolunteersYet: "Aún no hay personas registradas.",
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
    clusterMarkers: "Agrupar marcadores",
    cluster: "Agrupar",
    individual: "Individual",
    // Eco Tips
    ecoTips: "Tips Ecológicos",
    ecoTipsDescription: "Descubre formas sencillas de reducir tu impacto ambiental",
    highImpact: "Alto Impacto",
    mediumImpact: "Medio Impacto",
    lowImpact: "Bajo Impacto",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    // Event Details
    backToEvents: "Volver a eventos",
    volunteerProgress: "Progreso de voluntarios",
    spotsLeft: "lugares disponibles",
    fullyBooked: "Completo",
    joinEvent: "Unirse al evento",
    shareEvent: "Compartir evento",
    viewEvent: "Ver evento",
    time: "Hora",
    location: "Ubicación",
    contact: "Contacto",
    requirements: "Requisitos",
    benefits: "Beneficios",
    // Registration form
    registerForEvent: "Registrarse al Evento",
    event: "Evento",
    close: "Cerrar",
    personalInformation: "Información Personal",
    fullName: "Nombre completo",
    phoneNumber: "Teléfono",
    experienceLevel: "Nivel de experiencia",
    beginner: "Principiante",
    intermediate: "Intermedio",
    expert: "Experto",
    emergencyContact: "Contacto de Emergencia",
    emergencyContactName: "Nombre del contacto",
    emergencyContactPhone: "Teléfono de emergencia",
    additionalInformation: "Información Adicional",
    motivationToParticipate: "¿Por qué quieres participar en este evento?",
    dietaryRestrictions: "Restricciones alimentarias (opcional)",
    accessibilityNeeds: "Necesidades de accesibilidad (opcional)",
    consents: "Consentimientos",
    photoVideoConsent: "Autorizo el uso de mi imagen en fotos y videos del evento con fines promocionales",
    acceptTerms: "Acepto los términos y condiciones y la política de privacidad",
    cancel: "Cancelar",
    register: "Registrarse al Evento",
    registering: "Registrando...",
    // Validation
    fullNameRequired: "El nombre es obligatorio",
    emailRequired: "El email es obligatorio",
    emailInvalid: "El email no es válido",
    phoneRequired: "El número de teléfono es obligatorio",
    phoneInvalid: "El número de teléfono no es válido",
    emergencyContactNameRequired: "El contacto de emergencia es obligatorio",
    emergencyContactPhoneRequired: "El teléfono de emergencia es obligatorio",
    motivationRequired: "Por favor explica por qué quieres participar",
    termsRequired: "Debes aceptar los términos y condiciones",
    // Social
    profile: "Perfil",
    editProfile: "Editar perfil",
    saveProfile: "Guardar perfil",
    bio: "Biografía",
    interests: "Intereses",
    language: "Idioma",
    chats: "Chats",
    newMessage: "Nuevo mensaje",
    typeMessage: "Escribe un mensaje...",
    send: "Enviar",
    startChat: "Iniciar chat",
    createEvent: "Crear evento",
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
    noVolunteersYet: "No volunteers registered yet.",
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
    clusterMarkers: "Cluster markers",
    cluster: "Cluster",
    individual: "Individual",
    // Eco Tips
    ecoTips: "Eco Tips",
    ecoTipsDescription: "Discover simple ways to reduce your environmental impact",
    highImpact: "High Impact",
    mediumImpact: "Medium Impact",
    lowImpact: "Low Impact",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    // Event Details
    backToEvents: "Back to events",
    volunteerProgress: "Volunteer progress",
    spotsLeft: "spots available",
    fullyBooked: "Fully booked",
    joinEvent: "Join event",
    shareEvent: "Share event",
    viewEvent: "View event",
    time: "Time",
    location: "Location",
    contact: "Contact",
    requirements: "Requirements",
    benefits: "Benefits",
    // Registration form
    registerForEvent: "Register for Event",
    event: "Event",
    close: "Close",
    personalInformation: "Personal Information",
    fullName: "Full name",
    phoneNumber: "Phone number",
    experienceLevel: "Experience level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Expert",
    emergencyContact: "Emergency Contact",
    emergencyContactName: "Emergency contact name",
    emergencyContactPhone: "Emergency phone",
    additionalInformation: "Additional Information",
    motivationToParticipate: "Why do you want to participate in this event?",
    dietaryRestrictions: "Dietary restrictions (optional)",
    accessibilityNeeds: "Accessibility needs (optional)",
    consents: "Consents",
    photoVideoConsent: "I authorize the use of my image in event photos/videos for promotional purposes",
    acceptTerms: "I accept the terms and conditions and the privacy policy",
    cancel: "Cancel",
    register: "Register",
    registering: "Registering...",
    // Validation
    fullNameRequired: "Full name is required",
    emailRequired: "Email is required",
    emailInvalid: "Email is invalid",
    phoneRequired: "Phone number is required",
    phoneInvalid: "Phone number is invalid",
    emergencyContactNameRequired: "Emergency contact name is required",
    emergencyContactPhoneRequired: "Emergency phone is required",
    motivationRequired: "Please explain why you want to participate",
    termsRequired: "You must accept the terms and conditions",
    // Social
    profile: "Profile",
    editProfile: "Edit profile",
    saveProfile: "Save profile",
    bio: "Bio",
    interests: "Interests",
    language: "Language",
    chats: "Chats",
    newMessage: "New message",
    typeMessage: "Type a message...",
    send: "Send",
    startChat: "Start chat",
    createEvent: "Create event",
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
    noVolunteersYet: "Noch keine Freiwilligen registriert.",
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
    clusterMarkers: "Marker gruppieren",
    cluster: "Gruppieren",
    individual: "Einzeln",
    // Eco Tips
    ecoTips: "Öko-Tipps",
    ecoTipsDescription: "Entdecke einfache Wege, deinen Umweltfußabdruck zu reduzieren",
    highImpact: "Hoher Einfluss",
    mediumImpact: "Mittlerer Einfluss",
    lowImpact: "Geringer Einfluss",
    easy: "Einfach",
    medium: "Mittel",
    hard: "Schwer",
    // Event Details
    backToEvents: "Zurück zu Veranstaltungen",
    volunteerProgress: "Freiwilligenfortschritt",
    spotsLeft: "Plätze verfügbar",
    fullyBooked: "Ausgebucht",
    joinEvent: "Veranstaltung beitreten",
    shareEvent: "Veranstaltung teilen",
    viewEvent: "Veranstaltung ansehen",
    time: "Zeit",
    location: "Ort",
    contact: "Kontakt",
    requirements: "Anforderungen",
    benefits: "Vorteile",
    // Registration form
    registerForEvent: "Für Veranstaltung anmelden",
    event: "Veranstaltung",
    close: "Schließen",
    personalInformation: "Persönliche Daten",
    fullName: "Vollständiger Name",
    phoneNumber: "Telefonnummer",
    experienceLevel: "Erfahrungsniveau",
    beginner: "Anfänger/in",
    intermediate: "Fortgeschritten",
    expert: "Experte/Expertin",
    emergencyContact: "Notfallkontakt",
    emergencyContactName: "Name des Notfallkontakts",
    emergencyContactPhone: "Notfalltelefon",
    additionalInformation: "Zusätzliche Informationen",
    motivationToParticipate: "Warum möchtest du an dieser Veranstaltung teilnehmen?",
    dietaryRestrictions: "Ernährungseinschränkungen (optional)",
    accessibilityNeeds: "Barrierefreiheitsbedürfnisse (optional)",
    consents: "Einwilligungen",
    photoVideoConsent: "Ich erlaube die Nutzung meines Bildes in Fotos/Videos der Veranstaltung zu Werbezwecken",
    acceptTerms: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen und die Datenschutzerklärung",
    cancel: "Abbrechen",
    register: "Anmelden",
    registering: "Wird angemeldet...",
    // Validation
    fullNameRequired: "Der Name ist erforderlich",
    emailRequired: "E‑Mail ist erforderlich",
    emailInvalid: "E‑Mail ist ungültig",
    phoneRequired: "Telefonnummer ist erforderlich",
    phoneInvalid: "Telefonnummer ist ungültig",
    emergencyContactNameRequired: "Notfallkontakt ist erforderlich",
    emergencyContactPhoneRequired: "Notfalltelefon ist erforderlich",
    motivationRequired: "Bitte erkläre, warum du teilnehmen möchtest",
    termsRequired: "Du musst die AGB akzeptieren",
    // Social
    profile: "Profil",
    editProfile: "Profil bearbeiten",
    saveProfile: "Profil speichern",
    bio: "Biografie",
    interests: "Interessen",
    language: "Sprache",
    chats: "Chats",
    newMessage: "Neue Nachricht",
    typeMessage: "Nachricht schreiben...",
    send: "Senden",
    startChat: "Chat starten",
    createEvent: "Veranstaltung erstellen",
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

// Location translations
const LOCATION_MAP: Record<string, { en: string; de: string }> = {
  // Cities
  "Berlín": { en: "Berlin", de: "Berlin" },
  "Madrid": { en: "Madrid", de: "Madrid" },
  "Barcelona": { en: "Barcelona", de: "Barcelona" },
  "Milán": { en: "Milan", de: "Mailand" },
  "París": { en: "Paris", de: "Paris" },
  "Londres": { en: "London", de: "London" },
  "Roma": { en: "Rome", de: "Rom" },
  "Ámsterdam": { en: "Amsterdam", de: "Amsterdam" },
  "Viena": { en: "Vienna", de: "Wien" },
  "Praga": { en: "Prague", de: "Prag" },
  "Varsovia": { en: "Warsaw", de: "Warschau" },
  "Budapest": { en: "Budapest", de: "Budapest" },
  "Lisboa": { en: "Lisbon", de: "Lissabon" },
  "Dublín": { en: "Dublin", de: "Dublin" },
  "Estocolmo": { en: "Stockholm", de: "Stockholm" },
  "Oslo": { en: "Oslo", de: "Oslo" },
  "Copenhague": { en: "Copenhagen", de: "Kopenhagen" },
  "Helsinki": { en: "Helsinki", de: "Helsinki" },
  "Atenas": { en: "Athens", de: "Athen" },
  "Zúrich": { en: "Zurich", de: "Zürich" },
  
  // Countries
  "Alemania": { en: "Germany", de: "Deutschland" },
  "España": { en: "Spain", de: "Spanien" },
  "Italia": { en: "Italy", de: "Italien" },
  "Francia": { en: "France", de: "Frankreich" },
  "Reino Unido": { en: "United Kingdom", de: "Vereinigtes Königreich" },
  "Países Bajos": { en: "Netherlands", de: "Niederlande" },
  "Austria": { en: "Austria", de: "Österreich" },
  "República Checa": { en: "Czech Republic", de: "Tschechische Republik" },
  "Polonia": { en: "Poland", de: "Polen" },
  "Hungría": { en: "Hungary", de: "Ungarn" },
  "Portugal": { en: "Portugal", de: "Portugal" },
  "Irlanda": { en: "Ireland", de: "Irland" },
  "Suecia": { en: "Sweden", de: "Schweden" },
  "Noruega": { en: "Norway", de: "Norwegen" },
  "Dinamarca": { en: "Denmark", de: "Dänemark" },
  "Finlandia": { en: "Finland", de: "Finnland" },
  "Grecia": { en: "Greece", de: "Griechenland" },
  "Suiza": { en: "Switzerland", de: "Schweiz" },
  "Bélgica": { en: "Belgium", de: "Belgien" },
  "Luxemburgo": { en: "Luxembourg", de: "Luxemburg" },
};

export function locationLabel(original: string, locale: Locale) {
  if (locale === "es") return original;
  const m = LOCATION_MAP[original];
  if (!m) return original;
  return (m as any)[locale] || original;
}

