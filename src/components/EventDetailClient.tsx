"use client";
import React from "react";
import { autoTranslateEventText } from "@/lib/dictionaries";
import { useI18n, locationLabel } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventRegistrationForm from "./EventRegistrationForm";
import EventAdministrators from "./EventAdministrators";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";
import { ensureEventImage } from "@/lib/eventImages";
import { EVENT_DETAILS, EventDetails } from "@/data/eventDetails";
import { useSmartContext, QuestStep } from "@/context/SmartContext";
import { CalendarPlus, Download, ExternalLink } from "lucide-react";
import { generateGoogleCalendarLink, generateOutlookCalendarLink, downloadICSFile } from "@/lib/calendarUtils";

// Localized overrides for event strings (progressive coverage)
const EVENT_I18N: Record<string, { en: Partial<EventDetails>; de: Partial<EventDetails>; fr?: Partial<EventDetails> }> = {
  e15: {
    en: {
      title: "Autumn planting",
      description:
        "Join our planting of autumn species to prepare the ecosystem for winter.",
      location: "Autumn Park, Barcelona",
      organizer: "Autumn Planters",
      requirements: ["Comfortable clothes", "Gloves", "Water"],
      benefits: ["Plants to take home", "Certificate", "Snack"],
    },
    de: {
      title: "Herbstaufforstung",
      description:
        "Schließe dich unserer Pflanzung von Herbstarten an, um das Ökosystem für den Winter vorzubereiten.",
      location: "Park des Herbstes, Barcelona",
      organizer: "Autumn Planters",
      requirements: ["Bequeme Kleidung", "Handschuhe", "Wasser"],
      benefits: ["Pflanzen zum Mitnehmen", "Zertifikat", "Erfrischung"],
    },
  },
  e15b: {
    en: {
      title: "City bike tour",
      description: "Explore the city sustainably with a guided bike tour through the main green spots.",
      location: "Historic Center, Paris",
      organizer: "Green Bikes",
      benefits: ["Tour guide", "Green map", "Local discounts"],
      requirements: ["Own bicycle", "Helmet", "Water"],
    },
    de: {
      title: "Radtour durch die Stadt",
      description: "Erkunde die Stadt nachhaltig bei einer geführten Fahrradtour zu den wichtigsten grünen Orten.",
      location: "Historisches Zentrum, Paris",
      organizer: "Green Bikes",
      benefits: ["Reiseleitung", "Grüne Karte", "Lokale Rabatte"],
      requirements: ["Eigenes Fahrrad", "Helm", "Wasser"],
    },
  },
  e16b: {
    en: {
      title: "Home composting workshop",
      description: "Learn to compost at home easily and safely. Ideal for beginners and families.",
      location: "Community Center, Berlin",
      organizer: "Compost Masters",
      benefits: ["Compost kit", "Practical guide", "Online support"],
      requirements: ["Clean organic waste", "Notebook"],
    },
    de: {
      title: "Workshop: Kompostieren zu Hause",
      description: "Lerne, zu Hause einfach und sicher zu kompostieren. Ideal für Einsteiger:innen und Familien.",
      location: "Nachbarschaftszentrum, Berlin",
      organizer: "Compost Masters",
      benefits: ["Kompost‑Kit", "Praxisleitfaden", "Online‑Support"],
      requirements: ["Sauberer Bioabfall", "Notizbuch"],
    },
  },
  e16: {
    en: {
      title: "Food preservation workshop",
      description: "Learn traditional and modern techniques to preserve food and reduce waste.",
      location: "Green Culinary Center, Milan",
      organizer: "Sustainable Kitchen",
    },
    de: {
      title: "Workshop: Lebensmittel konservieren",
      description: "Lerne traditionelle und moderne Techniken, um Lebensmittel zu konservieren und Abfall zu reduzieren.",
      location: "Grünes Kulinarisches Zentrum, Mailand",
      organizer: "Nachhaltige Küche",
    },
  },
  e17: {
    en: {
      title: "Autumn forest cleanup",
      description: "Help keep the forest healthy during the season change.",
      location: "Autumn Forest, Paris",
      organizer: "Forest Guardians",
    },
    de: {
      title: "Herbstwald‑Reinigung",
      description: "Hilf mit, den Wald während des Jahreszeitenwechsels gesund zu halten.",
      location: "Herbstwald, Paris",
      organizer: "Waldwächter",
    },
  },
  e18: {
    en: {
      title: "Seasonal products market",
      description: "Discover seasonal produce at our market focused on local and sustainable food.",
      location: "Season Square, London",
      organizer: "Seasonal Producers",
    },
    de: {
      title: "Saisonprodukt‑Markt",
      description: "Entdecke saisonale Produkte auf unserem Markt mit Fokus auf lokale, nachhaltige Lebensmittel.",
      location: "Saisonplatz, London",
      organizer: "Saisonproduzenten",
    },
  },
};


function translateLocationSpan(span: string, locale: string): string {
  // Try to map standalone city/country tokens via locationLabel
  return locationLabel(span.trim(), locale as any);
}

function translateLocation(full: string, locale: string): string {
  if (!full || locale === "es") return full;
  // Common format: "Place, City" or "Place, City, Country"
  const parts = full.split(",").map((s) => s.trim());
  if (parts.length === 1) return translateLocationSpan(full, locale);
  const last = translateLocationSpan(parts[parts.length - 1], locale);
  const rest = parts.slice(0, parts.length - 1).join(", ");
  return `${rest}, ${last}`;
}

function autoTranslateEvent(base: EventDetails, locale: string): Partial<EventDetails> {
  if (locale === "es") return {};
  if (!base) return {};

  const result: Partial<EventDetails> = {};

  try {
    if (base.title) result.title = autoTranslateEventText(String(base.title), locale);
    if (base.description) result.description = autoTranslateEventText(String(base.description), locale);
    if (base.location) result.location = translateLocation(String(base.location), locale);
    if (base.organizer) result.organizer = autoTranslateEventText(String(base.organizer), locale);

    if (Array.isArray(base.benefits)) {
      result.benefits = base.benefits.map((b) => {
        try {
          return autoTranslateEventText(String(b || ''), locale);
        } catch {
          return String(b || '');
        }
      });
    } else if (base.benefits) {
      result.benefits = base.benefits;
    }

    if (Array.isArray(base.requirements)) {
      result.requirements = base.requirements.map((r) => {
        try {
          return autoTranslateEventText(String(r || ''), locale);
        } catch {
          return String(r || '');
        }
      });
    } else if (base.requirements) {
      result.requirements = base.requirements;
    }
  } catch (error) {
    console.warn('Error in autoTranslateEvent:', error);
    // Return empty object on error to prevent breaking the app
    return {};
  }

  return result;
}

// Function to get localized event data
async function getLocalizedEventData(eventId: string, locale: string) {
  try {
    // Debug: Check if eventId exists in EVENT_DETAILS
    const availableKeys = Object.keys(EVENT_DETAILS);
    console.log(`[getLocalizedEventData] Looking for event: ${eventId}`);
    console.log(`[getLocalizedEventData] Total events available: ${availableKeys.length}`);
    console.log(`[getLocalizedEventData] Events containing "26":`, availableKeys.filter(k => k.includes('26')).join(', '));

    let baseEvent = EVENT_DETAILS[eventId];

    // If event not found in mock data and ID starts with "real_2026", try fetching from API
    if (!baseEvent && eventId.startsWith('real_2026')) {
      console.log(`🔍 Event ${eventId} not in mock data, fetching from API...`);
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const events = await response.json();
          const apiEvent = events.find((e: any) => e.id === eventId);
          if (apiEvent) {
            console.log(`✅ Found event ${eventId} in API`);
            // Convert API event to EventDetails format
            baseEvent = {
              id: apiEvent.id,
              title: apiEvent.title || apiEvent.title_es,
              title_en: apiEvent.title_en,
              title_de: apiEvent.title_de,
              description: apiEvent.description || apiEvent.description_es,
              description_en: apiEvent.description_en,
              description_de: apiEvent.description_de,
              date: apiEvent.date,
              time: apiEvent.start_time || '09:00',
              duration: apiEvent.duration || 2,
              location: apiEvent.city ? `${apiEvent.city}, ${apiEvent.country}` : apiEvent.address || 'TBD',
              location_en: apiEvent.city ? `${apiEvent.city}, ${apiEvent.country}` : apiEvent.address || 'TBD',
              location_de: apiEvent.city ? `${apiEvent.city}, ${apiEvent.country}` : apiEvent.address || 'TBD',
              organizer: apiEvent.organizer || 'EcoNexo',
              organizer_en: apiEvent.organizer || 'EcoNexo',
              organizer_de: apiEvent.organizer || 'EcoNexo',
              category: apiEvent.category || 'environment',
              maxVolunteers: apiEvent.capacity || 50,
              currentVolunteers: 0,
              requirements: ['Registro previo', 'Ropa cómoda', 'Agua para hidratación'],
              requirements_en: ['Prior registration', 'Comfortable clothing', 'Water for hydration'],
              requirements_de: ['Vorherige Anmeldung', 'Bequeme Kleidung', 'Wasser zur Hydratation'],
              benefits: apiEvent.benefits || [],
              contact: apiEvent.contact || 'info@surfrider.org',
              website: apiEvent.website,
              image_url: apiEvent.image_url
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching event from API:`, error);
      }
    }

    if (!baseEvent) {
      console.error(`❌ Event ${eventId} not found in EVENT_DETAILS or API.`);
      console.error(`   Available events (first 30):`, availableKeys.slice(0, 30).join(', '));
      console.error(`   Events containing "26":`, availableKeys.filter(k => k.includes('26')).join(', '));
      return null;
    }
    console.log(`✅ Found event ${eventId}:`, {
      id: baseEvent.id,
      title: baseEvent.title,
      title_de: baseEvent.title_de,
      location: baseEvent.location,
      location_de: baseEvent.location_de,
      maxVolunteers: baseEvent.maxVolunteers,
      currentVolunteers: baseEvent.currentVolunteers
    });

    // Use specific language fields if available, otherwise fall back to auto-translation
    const localizedEvent: EventDetails = { ...baseEvent };

    // Apply localization FIRST, before setting defaults
    if (locale === 'en') {
      if (baseEvent.title_en) localizedEvent.title = baseEvent.title_en;
      if (baseEvent.description_en) localizedEvent.description = baseEvent.description_en;
      if (baseEvent.location_en) localizedEvent.location = baseEvent.location_en;
      if (baseEvent.organizer_en) localizedEvent.organizer = baseEvent.organizer_en;
      if (baseEvent.requirements_en && Array.isArray(baseEvent.requirements_en)) {
        localizedEvent.requirements = baseEvent.requirements_en;
      }
      if (baseEvent.benefits_en && Array.isArray(baseEvent.benefits_en)) {
        localizedEvent.benefits = baseEvent.benefits_en;
      }
    } else if (locale === 'de') {
      if (baseEvent.title_de) localizedEvent.title = baseEvent.title_de;
      if (baseEvent.description_de) localizedEvent.description = baseEvent.description_de;
      if (baseEvent.location_de) localizedEvent.location = baseEvent.location_de;
      if (baseEvent.organizer_de) localizedEvent.organizer = baseEvent.organizer_de;
      if (baseEvent.requirements_de && Array.isArray(baseEvent.requirements_de)) {
        localizedEvent.requirements = baseEvent.requirements_de;
      }
      if (baseEvent.benefits_de && Array.isArray(baseEvent.benefits_de)) {
        localizedEvent.benefits = baseEvent.benefits_de;
      }
    } else if (locale === 'fr') {
      if (baseEvent.title_fr) localizedEvent.title = baseEvent.title_fr;
      else if (baseEvent.title_en) localizedEvent.title = baseEvent.title_en; // Fallback to EN
      if (baseEvent.description_fr) localizedEvent.description = baseEvent.description_fr;
      else if (baseEvent.description_en) localizedEvent.description = baseEvent.description_en;
      if (baseEvent.location_fr) localizedEvent.location = baseEvent.location_fr;
      else if (baseEvent.location_en) localizedEvent.location = baseEvent.location_en;
      if (baseEvent.organizer_fr) localizedEvent.organizer = baseEvent.organizer_fr;
      else if (baseEvent.organizer_en) localizedEvent.organizer = baseEvent.organizer_en;
      if (baseEvent.requirements_fr && Array.isArray(baseEvent.requirements_fr)) {
        localizedEvent.requirements = baseEvent.requirements_fr;
      } else if (baseEvent.requirements_en && Array.isArray(baseEvent.requirements_en)) {
        localizedEvent.requirements = baseEvent.requirements_en;
      }
      if (baseEvent.benefits_fr && Array.isArray(baseEvent.benefits_fr)) {
        localizedEvent.benefits = baseEvent.benefits_fr;
      } else if (baseEvent.benefits_en && Array.isArray(baseEvent.benefits_en)) {
        localizedEvent.benefits = baseEvent.benefits_en;
      }
    }

    // Ensure required fields have defaults (only if truly missing after localization)
    if (!localizedEvent.requirements || !Array.isArray(localizedEvent.requirements) || localizedEvent.requirements.length === 0) {
      // Generate default requirements based on category
      const defaultRequirements: Record<string, Record<string, string[]>> = {
        environment: {
          es: ['Ropa cómoda y resistente', 'Calzado adecuado', 'Agua para hidratación', 'Protector solar', 'Guantes (si es necesario)'],
          en: ['Comfortable and durable clothing', 'Appropriate footwear', 'Water for hydration', 'Sunscreen', 'Gloves (if needed)'],
          de: ['Bequeme und strapazierfähige Kleidung', 'Geeignetes Schuhwerk', 'Wasser zur Hydratation', 'Sonnencreme', 'Handschuhe (falls erforderlich)']
        },
        education: {
          es: ['Cuaderno para tomar notas', 'Bolígrafo', 'Ropa cómoda', 'Interés en aprender'],
          en: ['Notebook for taking notes', 'Pen', 'Comfortable clothing', 'Interest in learning'],
          de: ['Notizbuch zum Mitschreiben', 'Stift', 'Bequeme Kleidung', 'Interesse am Lernen']
        },
        community: {
          es: ['Ropa cómoda', 'Agua para hidratación', 'Buen humor y energía positiva'],
          en: ['Comfortable clothing', 'Water for hydration', 'Good mood and positive energy'],
          de: ['Bequeme Kleidung', 'Wasser zur Hydratation', 'Gute Laune und positive Energie']
        },
        technology: {
          es: ['Dispositivo móvil o laptop (opcional)', 'Cuaderno para notas', 'Interés en tecnología'],
          en: ['Mobile device or laptop (optional)', 'Notebook for notes', 'Interest in technology'],
          de: ['Mobilgerät oder Laptop (optional)', 'Notizbuch für Notizen', 'Interesse an Technologie']
        }
      };
      const category = localizedEvent.category || 'community';
      const lang = locale === 'es' ? 'es' : locale === 'de' ? 'de' : 'en';
      localizedEvent.requirements = defaultRequirements[category]?.[lang] || defaultRequirements.community[lang];
    }
    if (!localizedEvent.benefits || !Array.isArray(localizedEvent.benefits) || localizedEvent.benefits.length === 0) {
      // Generate default benefits based on category
      const defaultBenefits: Record<string, Record<string, string[]>> = {
        environment: {
          es: ['Experiencia práctica en conservación', 'Certificado de participación', 'Conocimiento sobre prácticas sostenibles', 'Conexión con la naturaleza'],
          en: ['Hands-on conservation experience', 'Participation certificate', 'Knowledge about sustainable practices', 'Connection with nature'],
          de: ['Praktische Erfahrung im Naturschutz', 'Teilnahmezertifikat', 'Wissen über nachhaltige Praktiken', 'Verbindung mit der Natur']
        },
        education: {
          es: ['Conocimientos prácticos', 'Material educativo', 'Certificado de asistencia', 'Red de contactos'],
          en: ['Practical knowledge', 'Educational material', 'Attendance certificate', 'Network of contacts'],
          de: ['Praktisches Wissen', 'Bildungsmaterial', 'Teilnahmezertifikat', 'Netzwerk von Kontakten']
        },
        community: {
          es: ['Conexión con la comunidad', 'Experiencia enriquecedora', 'Nuevos amigos y contactos', 'Contribución a un proyecto significativo'],
          en: ['Community connection', 'Enriching experience', 'New friends and contacts', 'Contribution to a meaningful project'],
          de: ['Gemeinschaftsverbindung', 'Bereichernde Erfahrung', 'Neue Freunde und Kontakte', 'Beitrag zu einem bedeutungsvollen Projekt']
        },
        technology: {
          es: ['Conocimiento de tecnologías emergentes', 'Acceso a herramientas digitales', 'Certificado de participación', 'Oportunidades de networking'],
          en: ['Knowledge of emerging technologies', 'Access to digital tools', 'Participation certificate', 'Networking opportunities'],
          de: ['Wissen über aufstrebende Technologien', 'Zugang zu digitalen Tools', 'Teilnahmezertifikat', 'Netzwerkmöglichkeiten']
        }
      };
      const category = localizedEvent.category || 'community';
      const lang = locale === 'es' ? 'es' : locale === 'de' ? 'de' : 'en';
      localizedEvent.benefits = defaultBenefits[category]?.[lang] || defaultBenefits.community[lang];
    }

    // Ensure all required string fields have defaults (only if truly missing)
    // Don't override if field exists but is empty string - that's intentional
    if (localizedEvent.title === undefined || localizedEvent.title === null || localizedEvent.title === '') {
      console.warn(`Event ${eventId} missing title after localization, using default`);
      localizedEvent.title = `Evento ${eventId}`;
    }
    if (localizedEvent.description === undefined || localizedEvent.description === null || localizedEvent.description === '') {
      // Generate a realistic description based on event title and category
      const categoryDescriptions: Record<string, Record<string, string>> = {
        environment: {
          es: `Únete a esta actividad medioambiental que contribuye a la protección y mejora de nuestro entorno natural. Durante esta actividad, trabajaremos juntos para crear un impacto positivo en el medio ambiente y aprender sobre prácticas sostenibles.`,
          en: `Join this environmental activity that contributes to the protection and improvement of our natural environment. During this activity, we'll work together to create a positive impact on the environment and learn about sustainable practices.`,
          de: `Nehmen Sie an dieser Umweltaktivität teil, die zum Schutz und zur Verbesserung unserer natürlichen Umwelt beiträgt. Während dieser Aktivität arbeiten wir zusammen, um positive Auswirkungen auf die Umwelt zu schaffen und mehr über nachhaltige Praktiken zu lernen.`
        },
        education: {
          es: `Participa en este taller educativo donde aprenderás habilidades prácticas y conocimientos valiosos sobre temas importantes. Esta es una oportunidad perfecta para expandir tus conocimientos y conectar con otros participantes interesados en el mismo tema.`,
          en: `Participate in this educational workshop where you'll learn practical skills and valuable knowledge about important topics. This is a perfect opportunity to expand your knowledge and connect with other participants interested in the same topic.`,
          de: `Nehmen Sie an diesem Bildungs-Workshop teil, bei dem Sie praktische Fähigkeiten und wertvolles Wissen über wichtige Themen erlernen. Dies ist eine perfekte Gelegenheit, Ihr Wissen zu erweitern und sich mit anderen Teilnehmern zu verbinden, die sich für dasselbe Thema interessieren.`
        },
        community: {
          es: `Únete a esta actividad comunitaria que reúne a personas con intereses similares para trabajar juntos hacia un objetivo común. Esta es una oportunidad para conocer a otros miembros de la comunidad, compartir experiencias y contribuir a un proyecto significativo.`,
          en: `Join this community activity that brings together people with similar interests to work together toward a common goal. This is an opportunity to meet other community members, share experiences, and contribute to a meaningful project.`,
          de: `Schließen Sie sich dieser Gemeinschaftsaktivität an, die Menschen mit ähnlichen Interessen zusammenbringt, um gemeinsam auf ein gemeinsames Ziel hinzuarbeiten. Dies ist eine Gelegenheit, andere Gemeindemitglieder kennenzulernen, Erfahrungen auszutauschen und zu einem bedeutungsvollen Projekt beizutragen.`
        },
        technology: {
          es: `Participa en este evento tecnológico donde explorarás las últimas innovaciones y herramientas tecnológicas para la sostenibilidad. Aprenderás sobre cómo la tecnología puede ayudar a resolver problemas ambientales y crear soluciones innovadoras.`,
          en: `Participate in this technology event where you'll explore the latest innovations and technological tools for sustainability. You'll learn about how technology can help solve environmental problems and create innovative solutions.`,
          de: `Nehmen Sie an dieser Technologieveranstaltung teil, bei der Sie die neuesten Innovationen und technologischen Werkzeuge für Nachhaltigkeit erkunden. Sie erfahren, wie Technologie dazu beitragen kann, Umweltprobleme zu lösen und innovative Lösungen zu schaffen.`
        }
      };

      const category = localizedEvent.category || 'community';
      const lang = locale === 'es' ? 'es' : locale === 'de' ? 'de' : 'en';
      localizedEvent.description = categoryDescriptions[category]?.[lang] || categoryDescriptions.community[lang];
    }
    if (localizedEvent.location === undefined || localizedEvent.location === null || localizedEvent.location === '') {
      console.warn(`Event ${eventId} missing location after localization, using default`);
      localizedEvent.location = 'TBD';
    }
    if (!localizedEvent.organizer) localizedEvent.organizer = 'EcoNexo Community';
    if (!localizedEvent.category) localizedEvent.category = 'community';
    if (!localizedEvent.contact) localizedEvent.contact = 'info@econexo.app';
    if (!localizedEvent.date) localizedEvent.date = new Date().toISOString().split('T')[0];
    if (!localizedEvent.time) localizedEvent.time = '09:00';
    if (typeof localizedEvent.duration !== 'number') localizedEvent.duration = 2;
    if (typeof localizedEvent.maxVolunteers !== 'number') {
      console.warn(`Event ${eventId} missing maxVolunteers, using default`);
      localizedEvent.maxVolunteers = 50;
    }
    if (typeof localizedEvent.currentVolunteers !== 'number') {
      localizedEvent.currentVolunteers = 0;
    }

    // Fallback to auto-translation for missing fields
    const auto = autoTranslateEvent(localizedEvent, locale);

    // Apply manual overrides if they exist
    const currentLocale = locale as 'en' | 'de' | 'fr';
    const overridesFromMap = (EVENT_I18N as Record<string, Record<string, Partial<EventDetails>>>)[eventId]?.[currentLocale] || {};

    // Merge carefully, ensuring arrays are properly handled
    const result: EventDetails = {
      ...localizedEvent,
      ...auto,
      ...overridesFromMap,
    };

    // Ensure arrays are always arrays
    if (!Array.isArray(result.requirements)) {
      result.requirements = Array.isArray(localizedEvent.requirements) ? localizedEvent.requirements : [];
    }
    if (!Array.isArray(result.benefits)) {
      result.benefits = Array.isArray(localizedEvent.benefits) ? localizedEvent.benefits : [];
    }

    // Final validation - ensure all required fields exist (only if truly missing)
    if (!result.id) result.id = eventId;
    if (!result.title || result.title === `Evento ${eventId}`) {
      // Only set default if title is actually missing or already default
      if (!result.title) {
        console.warn(`Event ${eventId} missing title in final validation`);
        result.title = `Evento ${eventId}`;
      }
    }
    if (result.description === undefined || result.description === null) result.description = '';
    if (!result.location || result.location === 'TBD') {
      // Only set default if location is actually missing or already default
      if (!result.location) {
        console.warn(`Event ${eventId} missing location in final validation`);
        result.location = 'TBD';
      }
    }
    if (!result.organizer) result.organizer = 'EcoNexo Community';
    if (!result.category) result.category = 'community';
    // Remove the hardcoded info@econexo.app fallback if it's already set to something else
    if (!result.contact || result.contact === 'info@econexo.app') {
      // Only set if truly missing
      if (baseEvent.contact) result.contact = baseEvent.contact;
      else result.contact = result.contact || 'info@econexo.app';
    }
    if (!result.date) result.date = new Date().toISOString().split('T')[0];
    if (!result.time) result.time = '09:00';
    if (typeof result.duration !== 'number') result.duration = 2;
    if (typeof result.maxVolunteers !== 'number') {
      console.warn(`Event ${eventId} missing maxVolunteers in final validation`);
      result.maxVolunteers = 50;
    }
    if (typeof result.currentVolunteers !== 'number') result.currentVolunteers = 0;

    // Debug log to verify the event was loaded correctly
    if (result.title === `Evento ${eventId}` || result.location === 'TBD') {
      console.warn(`⚠️ Event ${eventId} loaded with default values:`, {
        title: result.title,
        location: result.location,
        maxVolunteers: result.maxVolunteers,
        currentVolunteers: result.currentVolunteers
      });
    }

    return result;
  } catch (error) {
    console.error(`Error in getLocalizedEventData for event ${eventId}:`, error);
    // Return a safe default event object instead of null to prevent crashes
    return {
      id: eventId,
      title: `Evento ${eventId}`,
      title_en: `Event ${eventId}`,
      title_de: `Veranstaltung ${eventId}`,
      description: 'Información del evento no disponible temporalmente.',
      description_en: 'Event information temporarily unavailable.',
      description_de: 'Veranstaltungsinformationen vorübergehend nicht verfügbar.',
      image_url: undefined,
      website: undefined,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 2,
      location: 'TBD',
      location_en: 'TBD',
      location_de: 'TBD',
      organizer: 'EcoNexo Community',
      organizer_en: 'EcoNexo Community',
      organizer_de: 'EcoNexo Community',
      category: 'community',
      maxVolunteers: 50,
      currentVolunteers: 0,
      requirements: [],
      benefits: [],
      contact: 'info@econexo.app'
    };
  }
}

export default function EventDetailClient({ eventId }: { eventId: string }) {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // This is required by React's Rules of Hooks
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { addPoints, unlockBadge, gamification, updateQuestProgress } = useSmartContext();
  const [saved, setSaved] = React.useState<boolean>(false);
  const [apiEvent, setApiEvent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [baseEvent, setBaseEvent] = React.useState<EventDetails | null>(null);
  // These hooks must be declared here, even if we use them conditionally later
  const [currentVolunteers, setCurrentVolunteers] = React.useState<number>(0);
  const [showRegistrationForm, setShowRegistrationForm] = React.useState(false);

  // Update currentVolunteers when baseEvent changes
  React.useEffect(() => {
    if (baseEvent && baseEvent.currentVolunteers !== undefined) {
      setCurrentVolunteers(baseEvent.currentVolunteers);
    }
  }, [baseEvent?.id, baseEvent?.currentVolunteers]);

  // Load saved state (guest/local + Supabase) - must be before conditional returns
  React.useEffect(() => {
    const loadSaved = async () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        if (raw) {
          const list: { type: 'project' | 'event'; id: string }[] = JSON.parse(raw);
          const existsLocal = list.some((i) => i.type === 'event' && i.id === eventId);
          if (!user || !isSupabaseConfigured()) {
            setSaved(existsLocal);
            return;
          }
        }
      } catch { }

      if (!user || !isSupabaseConfigured()) return;
      const supabase = getSupabase();
      if (!supabase) return;

      // Reconcile guest saved into DB on login
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        if (raw) {
          const list: { type: 'project' | 'event'; id: string }[] = JSON.parse(raw);
          const toInsert = list.map((i) => ({ user_id: user.id, item_type: i.type, item_id: i.id }));
          if (toInsert.length) {
            await supabase.from('favorites').upsert(toInsert as any, { onConflict: 'user_id,item_type,item_id' } as any);
            localStorage.removeItem('econexo:saved');
          }
        }
      } catch { }

      try {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('item_type', 'event')
          .eq('item_id', eventId)
          .maybeSingle();
        setSaved(!!data);
      } catch (err) {
        console.warn('Error loading saved state:', err);
      }
    };

    loadSaved();
  }, [eventId, user]);

  // Load event data (mock or API)
  React.useEffect(() => {
    const loadEventData = async () => {
      try {
        // First try to load from API
        try {
          const res = await fetch(`/api/events?id=${encodeURIComponent(eventId)}`);
          if (res.ok) {
            const data = await res.json();
            // Only use API data if it's valid and has essential fields
            // Check if data has a valid title (not generic) and location (not TBD)
            const hasValidTitle = data && data.title && data.title !== `Evento ${eventId}` && !data.title.startsWith('Evento ');
            // Be more lenient with location, but check if it's populated
            const hasValidLocation = data && (data.location || data.city || data.address) &&
              data.location !== 'TBD';

            if (data && !data.error && hasValidTitle && hasValidLocation) {
              setApiEvent(data);

              // Base event coming from API (language‑agnostic)
              const apiBaseEvent: EventDetails = {
                id: data.id || eventId,
                title: data.title || data.title_en || `Evento ${eventId}`,
                title_en: data.title_en || data.title,
                title_de: data.title_de || data.title,
                description: data.description || data.description_en || '',
                description_en: data.description_en || data.description,
                description_de: data.description_de || data.description,
                image_url: data.image_url,
                website: data.website,
                registration_url: data.registration_url,
                date: data.date || new Date().toISOString().split('T')[0],
                time: data.start_time || '09:00',
                duration: data.duration || 2,
                location: data.location || (data.city && data.country ? `${data.city}, ${data.country}` : (data.city || data.country || 'TBD')),
                location_en: data.location_en,
                location_de: data.location_de,
                organizer: data.organizer || 'EcoNexo Community',
                organizer_en: data.organizer_en || data.organizer,
                organizer_de: data.organizer_de || data.organizer,
                category: (data.category || 'community').toLowerCase(),
                maxVolunteers: data.max_volunteers || data.capacity || 50,
                minVolunteers: data.min_volunteers,
                currentVolunteers: data.current_volunteers || 0,
                // Keep raw arrays; we'll localize them below when per‑language variants exist
                requirements: Array.isArray(data.requirements) ? data.requirements : [],
                requirements_en: Array.isArray(data.requirements_en) ? data.requirements_en : undefined,
                requirements_de: Array.isArray(data.requirements_de) ? data.requirements_de : undefined,
                benefits: Array.isArray(data.benefits) ? data.benefits : [],
                benefits_en: Array.isArray(data.benefits_en) ? data.benefits_en : undefined,
                benefits_de: Array.isArray(data.benefits_de) ? data.benefits_de : undefined,
                contact: data.contact || 'info@econexo.app'
              };

              // Apply localization based on current locale, using *_en / *_de fields when available
              const localizedFromApi: EventDetails = { ...apiBaseEvent };
              if (locale === 'en') {
                if (apiBaseEvent.title_en) localizedFromApi.title = apiBaseEvent.title_en;
                if (apiBaseEvent.description_en) localizedFromApi.description = apiBaseEvent.description_en;
                if (apiBaseEvent.location_en) localizedFromApi.location = apiBaseEvent.location_en;
                if (apiBaseEvent.organizer_en) localizedFromApi.organizer = apiBaseEvent.organizer_en;
                if (apiBaseEvent.requirements_en && Array.isArray(apiBaseEvent.requirements_en)) {
                  localizedFromApi.requirements = apiBaseEvent.requirements_en;
                }
                if (apiBaseEvent.benefits_en && Array.isArray(apiBaseEvent.benefits_en)) {
                  localizedFromApi.benefits = apiBaseEvent.benefits_en;
                }
              } else if (locale === 'de') {
                if (apiBaseEvent.title_de) localizedFromApi.title = apiBaseEvent.title_de;
                if (apiBaseEvent.description_de) localizedFromApi.description = apiBaseEvent.description_de;
                if (apiBaseEvent.location_de) localizedFromApi.location = apiBaseEvent.location_de;
                if (apiBaseEvent.organizer_de) localizedFromApi.organizer = apiBaseEvent.organizer_de;
                if (apiBaseEvent.requirements_de && Array.isArray(apiBaseEvent.requirements_de)) {
                  localizedFromApi.requirements = apiBaseEvent.requirements_de;
                }
                if (apiBaseEvent.benefits_de && Array.isArray(apiBaseEvent.benefits_de)) {
                  localizedFromApi.benefits = apiBaseEvent.benefits_de;
                }
              }

              setBaseEvent(localizedFromApi);
              setLoading(false);
              return;
            } else {
              console.warn(`[EventDetailClient] API returned invalid data for ${eventId}, falling back to mock data.`, {
                hasValidTitle,
                hasValidLocation,
                title: data?.title,
                location: data?.location || (data?.city && data?.country ? `${data.city}, ${data.country}` : null)
              });
            }
          }
        } catch (apiError) {
          console.warn('Failed to load event from API, using mock data:', apiError);
        }

        // ALWAYS fall back to mock data if API fails or returns empty
        console.log(`[EventDetailClient] Attempting to load event ${eventId} from EVENT_DETAILS...`);
        console.log(`[EventDetailClient] Total events in EVENT_DETAILS:`, Object.keys(EVENT_DETAILS).length);
        console.log(`[EventDetailClient] Events containing "${eventId.slice(1, 3)}":`, Object.keys(EVENT_DETAILS).filter(k => k.includes(eventId.slice(1, 3))).join(', '));

        const mockEvent = await getLocalizedEventData(eventId, locale);
        if (mockEvent) {
          console.log(`✅ [EventDetailClient] Loaded event ${eventId} from mock data:`, {
            title: mockEvent.title,
            title_de: mockEvent.title_de,
            location: mockEvent.location,
            location_de: mockEvent.location_de,
            date: mockEvent.date,
            time: mockEvent.time,
            volunteers: `${mockEvent.currentVolunteers}/${mockEvent.maxVolunteers}`
          });
          setBaseEvent(mockEvent);
        } else {
          console.error(`❌ [EventDetailClient] Event ${eventId} not found in mock data`);
          console.error(`   Available events containing "${eventId.slice(1, 3)}":`, Object.keys(EVENT_DETAILS).filter(k => k.includes(eventId.slice(1, 3))).join(', '));
          console.error(`   First 30 available events:`, Object.keys(EVENT_DETAILS).slice(0, 30).join(', '));
          const notFoundMessage =
            locale === 'de'
              ? `Veranstaltung ${eventId} nicht gefunden`
              : locale === 'en'
                ? `Event ${eventId} not found`
                : `Evento ${eventId} no encontrado`;
          setError(notFoundMessage);
        }
      } catch (err) {
        console.error(`Error loading event ${eventId}:`, err);
        const baseMessage =
          locale === 'de'
            ? 'Fehler beim Laden der Veranstaltung'
            : locale === 'en'
              ? 'Error loading event'
              : 'Error al cargar el evento';
        const detail = err instanceof Error ? err.message : 'Unknown error';
        setError(`${baseMessage}: ${detail}`);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId, locale]);

  // Debug: Log component state
  console.log(`[EventDetailClient Render] State:`, {
    loading,
    error,
    hasBaseEvent: !!baseEvent,
    baseEventTitle: baseEvent?.title,
    baseEventLocation: baseEvent?.location,
    eventId
  });

  // If still loading, show loading state
  if (loading) {
    console.log(`[EventDetailClient] Rendering loading state`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading') || 'Cargando...'}</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error
  if (error) {
    console.log(`[EventDetailClient] Rendering error state:`, error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {locale === 'de' ? 'Seite neu laden' : locale === 'en' ? 'Reload page' : 'Recargar página'}
          </button>
        </div>
      </div>
    );
  }

  // Only show notFound if we've finished loading and still don't have an event
  if (!baseEvent) {
    console.error(`[EventDetailClient] Event ${eventId} not found - calling notFound()`);
    console.error(`  Loading: ${loading}, Error: ${error}, baseEvent:`, baseEvent);
    notFound();
  }

  console.log(`[EventDetailClient] Rendering event detail for:`, {
    id: baseEvent.id,
    title: baseEvent.title,
    location: baseEvent.location
  });

  // Translate category within the component where t is available
  const normCat = (baseEvent.category || 'community').toLowerCase().trim();
  const isEnv = normCat.includes('environment') || normCat.includes('umwelt') || normCat.includes('medio ambiente') || normCat.includes('nature') || normCat.includes('océanos');
  const isEdu = normCat.includes('education') || normCat.includes('bildung') || normCat.includes('educación');
  const isTech = normCat.includes('technology') || normCat.includes('technologie') || normCat.includes('tecnología');

  const translatedCategory = isEnv ?
    t('categoryEnvironment') :
    isEdu ?
      t('categoryEducation') :
      isTech ?
        t('categoryTechnology') :
        t('categoryCommunity');

  const event = {
    ...baseEvent,
    category: translatedCategory,
  };

  if (!event) {
    notFound();
  }

  const progressPercentage = event ? (currentVolunteers / event.maxVolunteers) * 100 : 0;
  const spotsLeft = event ? event.maxVolunteers - currentVolunteers : 0;

  // Ensure event has an image (use helper function)
  const headerImageSrc = ensureEventImage({
    image_url: event.image_url,
    category: event.category,
    website: (event as any).website
  });

  const handleJoin = () => {
    if (!user) {
      alert(locale === 'es' ? 'Debes iniciar sesión para unirte al evento' : t('mustLoginToJoin'));
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleDelete = async () => {
    if (!confirm(locale === 'es' ? '¿Estás seguro de que deseas eliminar este evento?' : 'Are you sure you want to delete this event?')) {
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = getSupabase();
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId);

        if (error) throw error;
      }

      alert(locale === 'es' ? 'Evento eliminado con éxito' : 'Event deleted successfully');
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(locale === 'es' ? 'Error al eliminar el evento' : 'Error deleting event');
    }
  };

  const toggleSaved = async () => {
    // Guest/local mode
    if (!user || !isSupabaseConfigured()) {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        const list: any[] = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex((i) => i.type === 'event' && i.id === eventId);
        if (idx >= 0) {
          list.splice(idx, 1);
          setSaved(false);
          try { trackEvent('save_item', { type: 'event', id: eventId, action: 'remove', auth: 0 }); } catch { }
        } else {
          list.push({
            type: 'event',
            id: eventId,
            title: event.title,
            image_url: headerImageSrc,
            category: event.category,
            city: event.location ? event.location.split(',')[0].trim() : '',
            country: event.location && event.location.includes(',') ? event.location.split(',')[1].trim() : '',
            date: event.date,
            location: event.location
          });
          setSaved(true);
          // Award points for favoriting
          addPoints(10, 'Guardar evento favorito');
          try { trackEvent('save_item', { type: 'event', id: eventId, action: 'add', auth: 0 }); } catch { }
        }
        if (typeof window !== 'undefined') localStorage.setItem('econexo:saved', JSON.stringify(list));
      } catch { }
      return;
    }

    // Authenticated via Supabase
    const supabase = getSupabase();
    if (saved) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', 'event')
        .eq('item_id', eventId);
      setSaved(false);
      try { trackEvent('save_item', { type: 'event', id: eventId, action: 'remove', auth: 1 }); } catch { }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: 'event', item_id: eventId });
      if (!error) {
        setSaved(true);
        // Award points for favoriting
        addPoints(10, 'Guardar evento favorito');
      }
      try { trackEvent('save_item', { type: 'event', id: eventId, action: 'add', auth: 1 }); } catch { }
    }
  };

  const handleRegistration = async (registrationData: {
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
    emergencyPhone: string;
    dietaryRestrictions?: string;
    accessibilityNeeds?: string;
    experience: 'beginner' | 'intermediate' | 'expert';
    motivation: string;
    agreeToTerms: boolean;
    agreeToPhotos: boolean;
  }) => {
    try {
      if (!isSupabaseConfigured()) throw new Error('Supabase not configured');
      const supabase = getSupabase();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone,
          emergency_contact: registrationData.emergencyContact,
          emergency_phone: registrationData.emergencyPhone,
          dietary_restrictions: registrationData.dietaryRestrictions,
          accessibility_needs: registrationData.accessibilityNeeds,
          experience: registrationData.experience,
          motivation: registrationData.motivation,
          agree_to_terms: registrationData.agreeToTerms,
          agree_to_photos: registrationData.agreeToPhotos,
        });
      if (error) throw error;

      setCurrentVolunteers((v: number) => Math.min(event.maxVolunteers, v + 1));
      setShowRegistrationForm(false);
      try { trackEvent('register_event', { id: event.id }); } catch { }

      // Add event to user's participated events list
      const participatedEvents = JSON.parse(localStorage.getItem('econexo:participatedEvents') || '[]');
      const eventToAdd = {
        id: event.id,
        title: event.title,
        date: event.date,
        city: event.location.split(',')[0]?.trim() || 'Unknown',
        country: event.location.split(',')[1]?.trim() || 'Unknown',
        category: event.category,
        capacity: event.maxVolunteers
      };

      // Check if event is already in the list
      const isAlreadyParticipated = participatedEvents.some((e: any) => e.id === event.id);
      if (!isAlreadyParticipated) {
        participatedEvents.push(eventToAdd);
        localStorage.setItem('econexo:participatedEvents', JSON.stringify(participatedEvents));

        // Award points for event registration
        addPoints(25, 'Inscribirse a evento');
        updateQuestProgress('join', event.category);

        // Check for badge unlocks based on event count
        const eventCount = participatedEvents.length;
        if (eventCount === 1 && !gamification.badges.includes('first_event')) {
          unlockBadge('first_event');
          addPoints(50, 'Insignia: Primer Evento');
        } else if (eventCount === 5 && !gamification.badges.includes('event_enthusiast')) {
          unlockBadge('event_enthusiast');
          addPoints(100, 'Insignia: Entusiasta de Eventos');
        } else if (eventCount === 10 && !gamification.badges.includes('event_master')) {
          unlockBadge('event_master');
          addPoints(200, 'Insignia: Maestro de Eventos');
        }

        // Dispatch custom event to update the list in same tab
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('econexo:participatedEventAdded', {
            detail: { event: eventToAdd }
          }));
        }
      }

      alert(locale === 'de' ?
        'Du hast dich erfolgreich für die Veranstaltung angemeldet!' :
        locale === 'en' ?
          'You have successfully registered for the event!' :
          '¡Te has registrado exitosamente al evento!'
      );
    } catch (error) {
      console.error('Registration error:', error);
      alert(locale === 'de' ?
        'Fehler bei der Anmeldung.' :
        locale === 'en' ?
          'Registration failed.' :
          'Error en el registro.'
      );
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = event.title;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        const key = locale === 'es' ? 'linkCopiedEs' : locale === 'de' ? 'linkCopiedDe' : 'linkCopiedEn';
        alert(t(key));
      } else {
        alert(url);
      }

      // Award points for sharing
      addPoints(10, locale === 'es' ? 'Compartir evento' : 'Share event');
      updateQuestProgress('share', event.category);

      // Unlock badge if share count reaches 10 (approximated via history for now if not tracking shares separately)
      // For a more robust approach, I'll update GamificationState to track shares.
    } catch {
      // silently ignore
    }
  };

  const getCategoryColor = (category: string) => {
    // Check for localized category names
    if (category.includes('Umwelt') || category.includes('Environment') || category.includes('Medio ambiente')) {
      return "bg-green-100 text-green-800";
    }
    if (category.includes('Bildung') || category.includes('Education') || category.includes('Educación')) {
      return "bg-blue-100 text-blue-800";
    }
    if (category.includes('Gemeinschaft') || category.includes('Community') || category.includes('Comunidad')) {
      return "bg-purple-100 text-purple-800";
    }
    if (category.includes('Technologie') || category.includes('Technology') || category.includes('Tecnología')) {
      return "bg-violet-100 text-violet-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (category: string) => {
    // Since we're already returning localized category names, just return them
    return category;
  };

  return (
    <div className="min-h-screen bg-gls-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/eventos"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg mb-6"
        >
          ← {t("backToEvents")}
        </Link>

        {/* Event Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
          {/* Event Image - Always show (ensureEventImage always returns an image) */}
          <div className="mb-6">
            <img
              src={headerImageSrc}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
              loading="lazy"
              referrerPolicy="no-referrer"
              decoding="async"
              crossOrigin="anonymous"
            />
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                  {getCategoryLabel(event.category)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {event.organizer}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {event.title.startsWith('event') && !event.title.includes(' ') ? t(event.title) : event.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("date")}</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {new Date(event.date).toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US')}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("time")}</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {event.time} ({event.duration}h)
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("location")}</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {event.location}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("contact")}</div>
              <div className="font-semibold text-slate-900 dark:text-white relative group/tooltip">
                <a
                  href={`mailto:${(event as any).contact}`}
                  className="hover:text-green-600 transition-colors cursor-pointer block truncate"
                >
                  {(event as any).contact}
                </a>

                {/* Tooltip Bubble */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-30 shadow-xl pointer-events-none">
                  {t("rememberToTellThemTooltip")}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Calendar Section */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-green-600" />
              {t("addToCalendar")}
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={generateGoogleCalendarLink({
                  title: event.title,
                  description: event.description,
                  location: event.location,
                  startDate: `${event.date}T${event.time.replace(':', '')}00`,
                  url: typeof window !== 'undefined' ? window.location.href : undefined
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  addPoints(15, locale === 'es' ? 'Sincronizar calendario' : 'Sync calendar');
                  updateQuestProgress('sync');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                Google Calendar
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
              <a
                href={generateOutlookCalendarLink({
                  title: event.title,
                  description: event.description,
                  location: event.location,
                  startDate: `${event.date}T${event.time}:00`,
                  url: typeof window !== 'undefined' ? window.location.href : undefined
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  addPoints(15, locale === 'es' ? 'Sincronizar calendario' : 'Sync calendar');
                  updateQuestProgress('sync');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                Outlook
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
              <button
                onClick={() => {
                  downloadICSFile({
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    startDate: `${event.date}T${event.time.replace(':', '')}00`,
                    url: typeof window !== 'undefined' ? window.location.href : undefined
                  });
                  addPoints(15, locale === 'es' ? 'Sincronizar calendario' : 'Sync calendar');
                  updateQuestProgress('sync');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                iCal / Apple
              </button>
            </div>
          </div>

          {/* Volunteer Progress */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t("volunteerProgress")}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {event.currentVolunteers}/{event.maxVolunteers} {t("volunteers")}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {spotsLeft > 0 ? `${spotsLeft} ${t("spotsLeft")}` : t("fullyBooked")}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requirements */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              {t("requirements")}
            </h2>
            <ul className="space-y-2">
              {event.requirements.map((req: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="text-green-600">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              {t("benefits")}
            </h2>
            <ul className="space-y-2">
              {event.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="text-blue-600">🎁</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="join" className="flex flex-wrap gap-4 mt-8 justify-center">
          {/* Registration Button - Only show if registration_url exists */}
          {(event as any).registration_url && (
            <div className="relative group">
              <a
                href={(event as any).registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                title={
                  locale === 'es'
                    ? '¡Recuerda decir que llegaste a través de EcoNexo!'
                    : locale === 'de'
                      ? 'Vergiss nicht zu sagen, dass du über EcoNexo gekommen bist!'
                      : 'Remember to say you came through EcoNexo!'
                }
              >
                {locale === 'es' ? 'Inscribirme Ahora' : locale === 'de' ? 'Jetzt Anmelden' : 'Register Now'}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              {/* Custom tooltip bubble */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-10">
                {locale === 'es'
                  ? '💚 Recuerda decir que llegaste a través de EcoNexo'
                  : locale === 'de'
                    ? '💚 Vergiss nicht zu sagen, dass du über EcoNexo gekommen bist'
                    : '💚 Remember to say you came through EcoNexo'}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
          )}
          <button onClick={handleShare} className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            {t("shareEvent")}
          </button>
          <button onClick={toggleSaved} className={`px-8 py-3 rounded-lg font-semibold transition-colors ${saved ? 'bg-amber-200 text-slate-900 border-amber-300' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
            {saved ? (locale === 'es' ? t('savedEs') : locale === 'de' ? t('savedDe') : t('savedEn')) : (locale === 'es' ? t('saveEs') : locale === 'de' ? t('saveDe') : t('saveEn'))}
          </button>
          {((event as any).created_by === user?.id || !isSupabaseConfigured()) && (
            <button
              onClick={handleDelete}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              {locale === 'es' ? 'Eliminar Evento' : locale === 'de' ? 'Event löschen' : 'Delete Event'}
            </button>
          )}
        </div>

        {/* Event Administrators */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mt-6">
          <EventAdministrators eventId={eventId} isCreator={(event as any).created_by === user?.id} />
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <EventRegistrationForm
          event={{
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            maxVolunteers: event.maxVolunteers,
            currentVolunteers: currentVolunteers
          }}
          onRegister={handleRegistration}
          onCancel={() => setShowRegistrationForm(false)}
        />
      )}
    </div>
  );
}
