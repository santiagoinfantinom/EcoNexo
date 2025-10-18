"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type Locale = "es" | "en" | "de";

type Dict = Record<string, string>;

const DICTS: Record<Locale, Dict> = {
  es: {
    app: "EcoNexo",
    map: "Mapa",
    events: "Eventos",
    jobs: "Trabajos",
    chat: "Chat",
    profile: "Perfil",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    logout: "Cerrar sesión",
    supportUs: "Apóyanos",
    createProfile: "Crear perfil",
    email: "Email",
    fullName: "Nombre completo",
    birthdate: "Fecha de nacimiento",
    birthPlace: "Lugar de nacimiento",
    emailNote: "Usaremos tu email para verificar tu cuenta",
    continueWith: "Continuar con",
    google: "Google",
    outlook: "Outlook",
    checkYourEmail: "Revisa tu email",
    cancel: "Cancelar",
    saveChanges: "Guardar cambios",
    editProfile: "Editar perfil",
    myProfile: "Mi perfil",
    profileUpdated: "Perfil actualizado exitosamente",
    changePhoto: "Cambiar foto",
    savingEs: "Guardando...",
    savingEn: "Saving...",
    savingDe: "Speichern...",
    // Page content
    welcomeMessageTitle: "Conecta con proyectos sostenibles en Europa",
    welcomeMessageDescription: "Únete a la comunidad que está construyendo un futuro más verde. Encuentra eventos, proyectos y oportunidades de voluntariado cerca de ti.",
    exploreEvents: "Explorar Eventos",
    findJobs: "Encontrar Trabajos",
    activeProjects: "Proyectos Activos",
    volunteers: "Voluntarios",
    cities: "Ciudades",
    connectedVolunteers: "Voluntarios conectados",
    availableSpots: "Cupos disponibles",
    featuredProjects: "Proyectos Destacados",
    exploreCategories: "Explorar Categorías",
    ecoTipsTitle: "Consejos Ecológicos",
    joinCommunity: "Unirse a la Comunidad",
    readyToMakeDifference: "¿Listo para hacer la diferencia?",
    readyDescription: "Explora proyectos, únete a eventos y conecta con una comunidad comprometida con el futuro del planeta",
    letsGo: "¡Empezar!",
    viewMap: "Ver Mapa",
    // Categories
    environmentTitle: "Medio Ambiente",
    environmentDescription: "Proyectos de conservación, reforestación y protección de ecosistemas",
    educationTitle: "Educación",
    educationDescription: "Iniciativas educativas y programas de formación ambiental",
    communityTitle: "Comunidad",
    communityDescription: "Proyectos de desarrollo comunitario y cohesión social",
    healthTitle: "Salud",
    healthDescription: "Iniciativas de salud comunitaria y bienestar",
    oceansTitle: "Océanos",
    oceansDescription: "Proyectos de protección marina y conservación acuática",
    foodTitle: "Alimentación",
    foodDescription: "Agricultura sostenible y sistemas alimentarios locales",
    // Labels
    volunteersLabelEs: "voluntarios",
    volunteersLabelEn: "volunteers",
    volunteersLabelDe: "Freiwillige",
    spotsLabelEs: "cupos",
    spotsLabelEn: "spots",
    spotsLabelDe: "Plätze",
    // Locations
    locationBerlin: "Berlín, Alemania",
    locationParis: "París, Francia",
    locationMadrid: "Madrid, España",
    // Notifications
    notificationsNotSupported: "Notificaciones no soportadas",
    browserNotSupportPush: "Tu navegador no soporta notificaciones push. Actualiza tu navegador o usa uno más moderno.",
    notificationSettings: "Configuración de Notificaciones",
    pushNotifications: "Notificaciones Push",
    receiveNotificationsAboutEvents: "Recibe notificaciones sobre nuevos eventos y proyectos",
    activated: "Activadas",
    deactivating: "Desactivando...",
    deactivate: "Desactivar",
    activating: "Activando...",
    activate: "Activar",
    notificationsBlocked: "Las notificaciones están bloqueadas. Ve a la configuración de tu navegador para permitirlas.",
    subscribedToPushNotifications: "Suscrito a notificaciones push. Recibirás actualizaciones sobre eventos y proyectos.",
    // Profile
    pleaseSelectValidImageEs: "Por favor selecciona un archivo de imagen válido",
    pleaseSelectValidImageEn: "Please select a valid image file",
    pleaseSelectValidImageDe: "Bitte wählen Sie eine gültige Bilddatei aus",
    imageTooLargeEs: "La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB",
    imageTooLargeEn: "Image is too large. Please select an image smaller than 5MB",
    imageTooLargeDe: "Bild ist zu groß. Bitte wählen Sie ein Bild kleiner als 5MB aus",
    errorLoadingImageEs: "Error al cargar la imagen. Por favor intenta de nuevo.",
    errorLoadingImageEn: "Error loading image. Please try again.",
    errorLoadingImageDe: "Fehler beim Laden des Bildes. Bitte versuchen Sie es erneut.",
    // Events
    categoryEnvironment: "Medio ambiente",
    categoryEducation: "Educación",
    categoryCommunity: "Comunidad",
    pleaseSignInFirstEs: "Por favor inicia sesión primero",
    pleaseSignInFirstEn: "Please sign in first",
    pleaseSignInFirstDe: "Bitte zuerst anmelden",
    linkCopiedEs: "Enlace copiado.",
    linkCopiedEn: "Link copied.",
    linkCopiedDe: "Link kopiert.",
    savedEs: "Guardado",
    savedEn: "Saved",
    savedDe: "Gespeichert",
    saveEs: "Guardar",
    saveEn: "Save",
    saveDe: "Speichern",
    joinEvent: "Unirse al evento",
    fullyBooked: "Completo",
    shareEvent: "Compartir evento",
    // Header
    emailPlaceholderEs: "email@ejemplo.com",
    emailPlaceholderEn: "email@example.com",
    emailPlaceholderDe: "email@beispiel.de",
    profileSavedMessageEs: "Perfil guardado. Ingresa tu correo y presiona login para verificar.",
    profileSavedMessageEn: "Profile saved. Enter your email and press login to verify.",
    profileSavedMessageDe: "Profil gespeichert. Gib deine E‑Mail ein und klicke auf Login, um zu verifizieren.",
    oauthExtractMessageEs: "Se extraerán automáticamente: nombre, email y foto de perfil",
    oauthExtractMessageEn: "Automatically extracted: name, email and profile picture",
    oauthExtractMessageDe: "Automatisch extrahiert: Name, E-Mail und Profilbild",
    signinNotConfiguredEs: "Inicio de sesión no configurado",
    signinNotConfiguredEn: "Sign-in not configured",
    signinNotConfiguredDe: "Anmeldung nicht konfiguriert",
    googleOAuthTitleEs: "Google - Extrae nombre, email y foto",
    googleOAuthTitleEn: "Google - Extracts name, email and photo",
    googleOAuthTitleDe: "Google - Extrahiert Name, E-Mail und Foto",
    outlookOAuthTitleEs: "Outlook/Microsoft - Extrae nombre, email y foto",
    outlookOAuthTitleEn: "Outlook/Microsoft - Extracts name, email and photo",
    outlookOAuthTitleDe: "Outlook/Microsoft - Extrahiert Name, E-Mail und Foto",
    orGoDirectlyToEs: "O ve directamente a:",
    orGoDirectlyToEn: "Or go directly to:",
    orGoDirectlyToDe: "Oder direkt zu:",
    // App metadata
    appTitle: "EcoNexo - Proyectos Sostenibles en Europa",
    appDescription: "Conecta con proyectos y eventos sostenibles en toda Europa. Únete a la comunidad que está construyendo un futuro más verde.",
    // Event details
    backToEvents: "Volver a eventos",
    date: "Fecha",
    time: "Hora",
    location: "Ubicación",
    contact: "Contacto",
    volunteerProgress: "Progreso de voluntarios",
    spotsLeft: "cupos restantes",
    requirements: "Requisitos",
    benefits: "Beneficios",
  },
  en: {
    app: "EcoNexo",
    map: "Map",
    events: "Events",
    jobs: "Jobs",
    chat: "Chat",
    profile: "Profile",
    signIn: "Sign In",
    signUp: "Sign Up",
    logout: "Logout",
    supportUs: "Support Us",
    createProfile: "Create Profile",
    email: "Email",
    fullName: "Full Name",
    birthdate: "Birth Date",
    birthPlace: "Birth Place",
    emailNote: "We'll use your email to verify your account",
    continueWith: "Continue with",
    google: "Google",
    outlook: "Outlook",
    checkYourEmail: "Check your email",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    editProfile: "Edit Profile",
    myProfile: "My Profile",
    profileUpdated: "Profile updated successfully",
    changePhoto: "Change Photo",
    savingEs: "Guardando...",
    savingEn: "Saving...",
    savingDe: "Speichern...",
    // Page content
    welcomeMessageTitle: "Connect with sustainable projects in Europe",
    welcomeMessageDescription: "Join the community building a greener future. Find events, projects and volunteer opportunities near you.",
    exploreEvents: "Explore Events",
    findJobs: "Find Jobs",
    activeProjects: "Active Projects",
    volunteers: "Volunteers",
    cities: "Cities",
    connectedVolunteers: "Connected volunteers",
    availableSpots: "Available spots",
    featuredProjects: "Featured Projects",
    exploreCategories: "Explore Categories",
    ecoTipsTitle: "Eco Tips",
    joinCommunity: "Join Community",
    readyToMakeDifference: "Ready to make a difference?",
    readyDescription: "Explore projects, join events and connect with a community committed to the planet's future",
    letsGo: "Let's Go!",
    viewMap: "View Map",
    // Categories
    environmentTitle: "Environment",
    environmentDescription: "Conservation, reforestation and ecosystem protection projects",
    educationTitle: "Education",
    educationDescription: "Educational initiatives and environmental training programs",
    communityTitle: "Community",
    communityDescription: "Community development and social cohesion projects",
    healthTitle: "Health",
    healthDescription: "Community health and wellness initiatives",
    oceansTitle: "Oceans",
    oceansDescription: "Marine protection and aquatic conservation projects",
    foodTitle: "Food",
    foodDescription: "Sustainable agriculture and local food systems",
    // Labels
    volunteersLabelEs: "voluntarios",
    volunteersLabelEn: "volunteers",
    volunteersLabelDe: "Freiwillige",
    spotsLabelEs: "cupos",
    spotsLabelEn: "spots",
    spotsLabelDe: "Plätze",
    // Locations
    locationBerlin: "Berlin, Germany",
    locationParis: "Paris, France",
    locationMadrid: "Madrid, Spain",
    // Notifications
    notificationsNotSupported: "Notifications not supported",
    browserNotSupportPush: "Your browser doesn't support push notifications. Update your browser or use a more modern one.",
    notificationSettings: "Notification Settings",
    pushNotifications: "Push Notifications",
    receiveNotificationsAboutEvents: "Receive notifications about new events and projects",
    activated: "Activated",
    deactivating: "Deactivating...",
    deactivate: "Deactivate",
    activating: "Activating...",
    activate: "Activate",
    notificationsBlocked: "Notifications are blocked. Go to your browser settings to allow them.",
    subscribedToPushNotifications: "Subscribed to push notifications. You will receive updates about events and projects.",
    // Profile
    pleaseSelectValidImageEs: "Por favor selecciona un archivo de imagen válido",
    pleaseSelectValidImageEn: "Please select a valid image file",
    pleaseSelectValidImageDe: "Bitte wählen Sie eine gültige Bilddatei aus",
    imageTooLargeEs: "La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB",
    imageTooLargeEn: "Image is too large. Please select an image smaller than 5MB",
    imageTooLargeDe: "Bild ist zu groß. Bitte wählen Sie ein Bild kleiner als 5MB aus",
    errorLoadingImageEs: "Error al cargar la imagen. Por favor intenta de nuevo.",
    errorLoadingImageEn: "Error loading image. Please try again.",
    errorLoadingImageDe: "Fehler beim Laden des Bildes. Bitte versuchen Sie es erneut.",
    // Events
    categoryEnvironment: "Environment",
    categoryEducation: "Education",
    categoryCommunity: "Community",
    pleaseSignInFirstEs: "Por favor inicia sesión primero",
    pleaseSignInFirstEn: "Please sign in first",
    pleaseSignInFirstDe: "Bitte zuerst anmelden",
    linkCopiedEs: "Enlace copiado.",
    linkCopiedEn: "Link copied.",
    linkCopiedDe: "Link kopiert.",
    savedEs: "Guardado",
    savedEn: "Saved",
    savedDe: "Gespeichert",
    saveEs: "Guardar",
    saveEn: "Save",
    saveDe: "Speichern",
    joinEvent: "Join Event",
    fullyBooked: "Fully Booked",
    shareEvent: "Share Event",
    // Header
    emailPlaceholderEs: "email@ejemplo.com",
    emailPlaceholderEn: "email@example.com",
    emailPlaceholderDe: "email@beispiel.de",
    profileSavedMessageEs: "Perfil guardado. Ingresa tu correo y presiona login para verificar.",
    profileSavedMessageEn: "Profile saved. Enter your email and press login to verify.",
    profileSavedMessageDe: "Profil gespeichert. Gib deine E‑Mail ein und klicke auf Login, um zu verifizieren.",
    oauthExtractMessageEs: "Se extraerán automáticamente: nombre, email y foto de perfil",
    oauthExtractMessageEn: "Automatically extracted: name, email and profile picture",
    oauthExtractMessageDe: "Automatisch extrahiert: Name, E-Mail und Profilbild",
    signinNotConfiguredEs: "Inicio de sesión no configurado",
    signinNotConfiguredEn: "Sign-in not configured",
    signinNotConfiguredDe: "Anmeldung nicht konfiguriert",
    googleOAuthTitleEs: "Google - Extrae nombre, email y foto",
    googleOAuthTitleEn: "Google - Extracts name, email and photo",
    googleOAuthTitleDe: "Google - Extrahiert Name, E-Mail und Foto",
    outlookOAuthTitleEs: "Outlook/Microsoft - Extrae nombre, email y foto",
    outlookOAuthTitleEn: "Outlook/Microsoft - Extracts name, email and photo",
    outlookOAuthTitleDe: "Outlook/Microsoft - Extrahiert Name, E-Mail und Foto",
    orGoDirectlyToEs: "O ve directamente a:",
    orGoDirectlyToEn: "Or go directly to:",
    orGoDirectlyToDe: "Oder direkt zu:",
    // App metadata
    appTitle: "EcoNexo - Sustainable Projects in Europe",
    appDescription: "Connect with sustainable projects and events across Europe. Join the community building a greener future.",
    // Event details
    backToEvents: "Back to events",
    date: "Date",
    time: "Time",
    location: "Location",
    contact: "Contact",
    volunteerProgress: "Volunteer progress",
    spotsLeft: "spots left",
    requirements: "Requirements",
    benefits: "Benefits",
  },
  de: {
    app: "EcoNexo",
    map: "Karte",
    events: "Veranstaltungen",
    jobs: "Jobs",
    chat: "Chat",
    profile: "Profil",
    signIn: "Anmelden",
    signUp: "Registrieren",
    logout: "Abmelden",
    supportUs: "Unterstützen",
    createProfile: "Profil erstellen",
    email: "E-Mail",
    fullName: "Vollständiger Name",
    birthdate: "Geburtsdatum",
    birthPlace: "Geburtsort",
    emailNote: "Wir verwenden Ihre E-Mail zur Kontoverifizierung",
    continueWith: "Fortfahren mit",
    google: "Google",
    outlook: "Outlook",
    checkYourEmail: "Überprüfen Sie Ihre E-Mail",
    cancel: "Abbrechen",
    saveChanges: "Änderungen speichern",
    editProfile: "Profil bearbeiten",
    myProfile: "Mein Profil",
    profileUpdated: "Profil erfolgreich aktualisiert",
    changePhoto: "Foto ändern",
    savingEs: "Guardando...",
    savingEn: "Saving...",
    savingDe: "Speichern...",
    // Page content
    welcomeMessageTitle: "Verbinden Sie sich mit nachhaltigen Projekten in Europa",
    welcomeMessageDescription: "Treten Sie der Gemeinschaft bei, die eine grünere Zukunft aufbaut. Finden Sie Veranstaltungen, Projekte und Freiwilligenmöglichkeiten in Ihrer Nähe.",
    exploreEvents: "Veranstaltungen erkunden",
    findJobs: "Jobs finden",
    activeProjects: "Aktive Projekte",
    volunteers: "Freiwillige",
    cities: "Städte",
    connectedVolunteers: "Verbundene Freiwillige",
    availableSpots: "Verfügbare Plätze",
    featuredProjects: "Empfohlene Projekte",
    exploreCategories: "Kategorien erkunden",
    ecoTipsTitle: "Öko-Tipps",
    joinCommunity: "Gemeinschaft beitreten",
    readyToMakeDifference: "Bereit, einen Unterschied zu machen?",
    readyDescription: "Erkunde Projekte, nimm an Veranstaltungen teil und verbinde dich mit einer Gemeinschaft, die sich für die Zukunft des Planeten engagiert",
    letsGo: "Los geht's!",
    viewMap: "Karte anzeigen",
    // Categories
    environmentTitle: "Umwelt",
    environmentDescription: "Naturschutz-, Aufforstungs- und Ökosystemschutzprojekte",
    educationTitle: "Bildung",
    educationDescription: "Bildungsinitiativen und Umweltausbildungsprogramme",
    communityTitle: "Gemeinschaft",
    communityDescription: "Gemeinschaftsentwicklung und sozialer Zusammenhalt",
    healthTitle: "Gesundheit",
    healthDescription: "Gemeinschaftsgesundheit und Wohlbefinden",
    oceansTitle: "Ozeane",
    oceansDescription: "Meeresschutz und Wasserprojekte",
    foodTitle: "Ernährung",
    foodDescription: "Nachhaltige Ernährung und Landwirtschaft",
    // Labels
    volunteersLabelEs: "voluntarios",
    volunteersLabelEn: "volunteers",
    volunteersLabelDe: "Freiwillige",
    spotsLabelEs: "cupos",
    spotsLabelEn: "spots",
    spotsLabelDe: "Plätze",
    // Locations
    locationBerlin: "Berlin, Deutschland",
    locationParis: "Paris, Frankreich",
    locationMadrid: "Madrid, Spanien",
    // Notifications
    notificationsNotSupported: "Benachrichtigungen nicht unterstützt",
    browserNotSupportPush: "Ihr Browser unterstützt keine Push-Benachrichtigungen. Aktualisieren Sie Ihren Browser oder verwenden Sie einen moderneren.",
    notificationSettings: "Benachrichtigungseinstellungen",
    pushNotifications: "Push-Benachrichtigungen",
    receiveNotificationsAboutEvents: "Erhalten Sie Benachrichtigungen über neue Veranstaltungen und Projekte",
    activated: "Aktiviert",
    deactivating: "Deaktivieren...",
    deactivate: "Deaktivieren",
    activating: "Aktivieren...",
    activate: "Aktivieren",
    notificationsBlocked: "Benachrichtigungen sind blockiert. Gehen Sie zu Ihren Browser-Einstellungen, um sie zu erlauben.",
    subscribedToPushNotifications: "Für Push-Benachrichtigungen angemeldet. Sie erhalten Updates über Veranstaltungen und Projekte.",
    // Profile
    pleaseSelectValidImageEs: "Por favor selecciona un archivo de imagen válido",
    pleaseSelectValidImageEn: "Please select a valid image file",
    pleaseSelectValidImageDe: "Bitte wählen Sie eine gültige Bilddatei aus",
    imageTooLargeEs: "La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB",
    imageTooLargeEn: "Image is too large. Please select an image smaller than 5MB",
    imageTooLargeDe: "Bild ist zu groß. Bitte wählen Sie ein Bild kleiner als 5MB aus",
    errorLoadingImageEs: "Error al cargar la imagen. Por favor intenta de nuevo.",
    errorLoadingImageEn: "Error loading image. Please try again.",
    errorLoadingImageDe: "Fehler beim Laden des Bildes. Bitte versuchen Sie es erneut.",
    // Events
    categoryEnvironment: "Umwelt",
    categoryEducation: "Bildung",
    categoryCommunity: "Gemeinschaft",
    pleaseSignInFirstEs: "Por favor inicia sesión primero",
    pleaseSignInFirstEn: "Please sign in first",
    pleaseSignInFirstDe: "Bitte zuerst anmelden",
    linkCopiedEs: "Enlace copiado.",
    linkCopiedEn: "Link copied.",
    linkCopiedDe: "Link kopiert.",
    savedEs: "Guardado",
    savedEn: "Saved",
    savedDe: "Gespeichert",
    saveEs: "Guardar",
    saveEn: "Save",
    saveDe: "Speichern",
    joinEvent: "Veranstaltung beitreten",
    fullyBooked: "Ausgebucht",
    shareEvent: "Veranstaltung teilen",
    // Header
    emailPlaceholderEs: "email@ejemplo.com",
    emailPlaceholderEn: "email@example.com",
    emailPlaceholderDe: "email@beispiel.de",
    profileSavedMessageEs: "Perfil guardado. Ingresa tu correo y presiona login para verificar.",
    profileSavedMessageEn: "Profile saved. Enter your email and press login to verify.",
    profileSavedMessageDe: "Profil gespeichert. Gib deine E‑Mail ein und klicke auf Login, um zu verifizieren.",
    oauthExtractMessageEs: "Se extraerán automáticamente: nombre, email y foto de perfil",
    oauthExtractMessageEn: "Automatically extracted: name, email and profile picture",
    oauthExtractMessageDe: "Automatisch extrahiert: Name, E-Mail und Profilbild",
    signinNotConfiguredEs: "Inicio de sesión no configurado",
    signinNotConfiguredEn: "Sign-in not configured",
    signinNotConfiguredDe: "Anmeldung nicht konfiguriert",
    googleOAuthTitleEs: "Google - Extrae nombre, email y foto",
    googleOAuthTitleEn: "Google - Extracts name, email and photo",
    googleOAuthTitleDe: "Google - Extrahiert Name, E-Mail und Foto",
    outlookOAuthTitleEs: "Outlook/Microsoft - Extrae nombre, email y foto",
    outlookOAuthTitleEn: "Outlook/Microsoft - Extracts name, email and photo",
    outlookOAuthTitleDe: "Outlook/Microsoft - Extrahiert Name, E-Mail und Foto",
    orGoDirectlyToEs: "O ve directamente a:",
    orGoDirectlyToEn: "Or go directly to:",
    orGoDirectlyToDe: "Oder direkt zu:",
    // App metadata
    appTitle: "EcoNexo - Nachhaltige Projekte in Europa",
    appDescription: "Verbinden Sie sich mit nachhaltigen Projekten und Veranstaltungen in ganz Europa. Treten Sie der Gemeinschaft bei, die eine grünere Zukunft aufbaut.",
    // Event details
    backToEvents: "Zurück zu Veranstaltungen",
    date: "Datum",
    time: "Zeit",
    location: "Standort",
    contact: "Kontakt",
    volunteerProgress: "Freiwilligenfortschritt",
    spotsLeft: "Plätze übrig",
    requirements: "Anforderungen",
    benefits: "Vorteile",
  },
};

const I18nContext = createContext<{ t: (k: string) => string; locale: Locale; setLocale: (l: Locale) => void } | null>(null);

export { DICTS };

// Helper functions for dynamic content
export function locationLabel(original: string, locale: Locale) {
  if (locale === "es") return original;
  
  const locationMap: Record<string, Record<Locale, string>> = {
    "Berlín": { en: "Berlin", de: "Berlin" },
    "Madrid": { en: "Madrid", de: "Madrid" },
    "París": { en: "Paris", de: "Paris" },
    "Alemania": { en: "Germany", de: "Deutschland" },
    "España": { en: "Spain", de: "Spanien" },
    "Francia": { en: "France", de: "Frankreich" },
  };
  
  return locationMap[original]?.[locale] || original;
}

export function categoryLabel(category: string, locale: Locale) {
  if (locale === "es") return category;
  
  const categoryMap: Record<string, Record<Locale, string>> = {
    "Medio ambiente": { en: "Environment", de: "Umwelt" },
    "Educación": { en: "Education", de: "Bildung" },
    "Comunidad": { en: "Community", de: "Gemeinschaft" },
    "Salud": { en: "Health", de: "Gesundheit" },
    "Océanos": { en: "Oceans", de: "Ozeane" },
    "Alimentación": { en: "Food", de: "Ernährung" },
  };
  
  return categoryMap[category]?.[locale] || category;
}

export function projectNameLabel(id: string, name: string, locale: Locale) {
  if (locale === "es") return name;
  
  // For now, return the original name
  // In the future, this could be enhanced with a database lookup
  return name;
}

export function projectDescriptionLabel(projectId: string, original: string, locale: Locale) {
  if (locale === "es") return original;
  
  // For now, return the original description
  // In the future, this could be enhanced with a database lookup
  return original;
}

export function impactTagLabel(original: string, locale: Locale) {
  if (locale === "es") return original;
  
  const impactMap: Record<string, Record<Locale, string>> = {
    "Alto impacto": { en: "High impact", de: "Hohe Wirkung" },
    "Medio impacto": { en: "Medium impact", de: "Mittlere Wirkung" },
    "Bajo impacto": { en: "Low impact", de: "Niedrige Wirkung" },
  };
  
  return impactMap[original]?.[locale] || original;
}

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
    } catch {}
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("econexo:locale", l);
      }
    } catch {}
  };

  const t = useMemo(() => {
    const dict = DICTS[locale];
    return (k: string) => dict[k] || k;
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