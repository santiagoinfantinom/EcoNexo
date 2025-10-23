"use client";
import React from "react";
import { useI18n, locationLabel } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventRegistrationForm from "./EventRegistrationForm";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

type EventDetails = {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  website?: string; // Optional website for deriving a preview image
  date: string;
  time: string;
  duration: number;
  location: string;
  location_en?: string;
  location_de?: string;
  organizer: string;
  organizer_en?: string;
  organizer_de?: string;
  category: string;
  maxVolunteers: number;
  currentVolunteers: number;
  requirements: string[];
  requirements_en?: string[];
  requirements_de?: string[];
  benefits: string[];
  benefits_en?: string[];
  benefits_de?: string[];
  contact: string;
};

// Mock event details - in a real app, this would come from an API
const EVENT_DETAILS: Record<string, EventDetails> = {
  "e1": {
    id: "e1",
    title: "Native Tree Planting",
    title_en: "Native Tree Planting",
    title_de: "Pflanzung einheimischer Bäume",
    description: "Únete a nuestra plantación comunitaria de especies nativas para restaurar el ecosistema local. Aprenderás sobre las especies autóctonas y su importancia para la biodiversidad urbana.",
    description_en: "Join our community planting of native species to restore the local ecosystem. You will learn about native species and their importance for urban biodiversity.",
    description_de: "Schließe dich unserer Gemeinschaftspflanzung einheimischer Arten an, um das lokale Ökosystem wiederherzustellen. Du wirst über einheimische Arten und ihre Bedeutung für die städtische Biodiversität lernen.",
    image_url: "/leaflet/marker-icon.png",
    date: "2025-01-15",
    time: "09:00",
    duration: 3,
    location: "Bosque Urbano Norte, Berlín",
    organizer: "Green City Initiative",
    category: "environment",
    maxVolunteers: 30,
    currentVolunteers: 12,
    requirements: ["Comfortable clothing", "Work boots", "Gloves", "Water"],
    benefits: ["Participation certificate", "Lunch included", "Educational material"],
    contact: "info@greencity.org"
  },
  "e2": {
    id: "e2",
    title: "Solar Energy Workshop",
    title_en: "Solar Energy Workshop",
    title_de: "Solar-Energie-Workshop",
    description: "Aprende sobre instalación y beneficios de paneles solares residenciales. Incluye demostración práctica y cálculo de ahorro energético.",
    description_en: "Learn about installation and benefits of residential solar panels. Includes practical demonstration and energy savings calculation.",
    description_de: "Lerne über Installation und Vorteile von Wohnsolarpanelen. Beinhaltet praktische Demonstration und Energiesparberechnung.",
    image_url: "/next.svg",
    date: "2025-01-22",
    time: "14:00",
    duration: 3,
    location: "Centro de Innovación Verde, Madrid",
    organizer: "SolarTech Academy",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Notebook", "Calculator", "Comfortable clothing"],
    benefits: ["Training certificate", "Technical manual", "Coffee break"],
    contact: "training@solartech.edu"
  },
  "e3": {
    id: "e3",
    title: "Local Products Market",
    title_en: "Local Products Market",
    title_de: "Lokaler Produktmarkt",
    description: "Feria de productos orgánicos y artesanías locales sostenibles. Conoce productores locales y sus prácticas ecológicas.",
    description_en: "Fair of organic products and sustainable local crafts. Meet local producers and their ecological practices.",
    description_de: "Messe für Bio-Produkte und nachhaltige lokale Handwerkskunst. Lerne lokale Produzenten und ihre ökologischen Praktiken kennen.",
    image_url: "/globe.svg",
    date: "2025-02-08",
    time: "10:00",
    duration: 6,
    location: "Plaza del Mercado, Barcelona",
    organizer: "Asociación de Productores Locales",
    category: "community",
    maxVolunteers: 40,
    currentVolunteers: 25,
    requirements: ["Money for purchases", "Reusable bag"],
    benefits: ["Special discounts", "Free tastings", "Contact network"],
    contact: "mercado@productoreslocales.es"
  },
  "e4": {
    id: "e4",
    title: "River Cleanup",
    title_en: "River Cleanup",
    title_de: "Flussreinigung",
    description: "Participa en la limpieza del río Verde para mejorar la calidad del agua y proteger la vida acuática. Incluye clasificación de residuos y educación ambiental.",
    description_en: "Participate in the Green River cleanup to improve water quality and protect aquatic life. Includes waste sorting and environmental education.",
    description_de: "Nimm an der Reinigung des Grünen Flusses teil, um die Wasserqualität zu verbessern und das Wasserleben zu schützen. Beinhaltet Mülltrennung und Umweltbildung.",
    date: "2025-02-14",
    time: "08:00",
    duration: 3,
    location: "Río Verde, Milán",
    location_en: "Green River, Milan",
    location_de: "Grüner Fluss, Mailand",
    organizer: "River Guardians",
    organizer_en: "River Guardians",
    organizer_de: "Flusswächter",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Work gloves", "Comfortable clothing", "Waterproof boots"],
    requirements_en: ["Work gloves", "Comfortable clothing", "Waterproof boots"],
    requirements_de: ["Arbeitshandschuhe", "Bequeme Kleidung", "Wasserdichte Stiefel"],
    benefits: ["Participation certificate", "Refreshments", "Educational material"],
    benefits_en: ["Participation certificate", "Refreshments", "Educational material"],
    benefits_de: ["Teilnahmezertifikat", "Erfrischungen", "Bildungsmaterial"],
    contact: "rio@guardianes.es"
  },
  "e5": {
    id: "e5",
    title: "Climate Change Conference",
    title_en: "Climate Change Conference",
    title_de: "Klimawandel-Konferenz",
    description: "Asiste a esta conferencia informativa sobre los efectos del cambio climático y las acciones que podemos tomar para mitigarlo.",
    description_en: "Attend this informative conference about the effects of climate change and the actions we can take to mitigate it.",
    description_de: "Nimm an dieser informativen Konferenz über die Auswirkungen des Klimawandels und die Maßnahmen teil, die wir zur Eindämmung ergreifen können.",
    date: "2025-03-05",
    time: "18:00",
    duration: 2,
    location: "Auditorio Municipal, París",
    location_en: "Municipal Auditorium, Paris",
    location_de: "Städtisches Auditorium, Paris",
    organizer: "Local Climate Institute",
    organizer_en: "Local Climate Institute",
    organizer_de: "Lokales Klimainstitut",
    category: "education",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Registro previo", "Documento de identidad"],
    requirements_en: ["Prior registration", "Identity document"],
    requirements_de: ["Vorherige Anmeldung", "Ausweisdokument"],
    benefits: ["Certificado de asistencia", "Material informativo", "Networking"],
    benefits_en: ["Attendance certificate", "Informative material", "Networking"],
    benefits_de: ["Teilnahmezertifikat", "Informatives Material", "Netzwerken"],
    contact: "clima@instituto.es"
  },
  "e6": {
    id: "e6",
    title: "eventVerticalGardens",
    description: "Aprende a construir jardines verticales en edificios urbanos para mejorar la calidad del aire y la biodiversidad urbana.",
    date: "2025-03-18",
    time: "10:00",
    duration: 5,
    location: "Edificio Comercial Centro, Londres",
    organizer: "Urban Green Solutions",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 8,
    requirements: ["Herramientas básicas", "Ropa de trabajo", "Almuerzo"],
    benefits: ["Técnicas de jardinería vertical", "Plantas para llevar", "Certificado"],
    contact: "vertical@urbangreen.es"
  },
  "e7": {
    id: "e7",
    title: "Taller de compostaje",
    description: "Aprende técnicas de compostaje doméstico para reducir residuos orgánicos y crear fertilizante natural para tus plantas.",
    date: "2025-04-12",
    time: "15:00",
    duration: 2,
    location: "Jardín Comunitario Sur, Berlín",
    organizer: "Compost Masters",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 16,
    requirements: ["Cuaderno para notas", "Ropa cómoda"],
    benefits: ["Kit de compostaje", "Manual digital", "Seguimiento online"],
    contact: "compost@masters.es"
  },
  "e8": {
    id: "e8",
    title: "eventEcoRace",
    description: "Únete a nuestra carrera 5K con enfoque ecológico. Recorreremos rutas verdes mientras promovemos el deporte sostenible.",
    date: "2025-04-22",
    time: "08:00",
    duration: 2,
    location: "Parque Central, Madrid",
    organizer: "Green Runners",
    category: "community",
    maxVolunteers: 100,
    currentVolunteers: 75,
    requirements: ["Registro previo", "Certificado médico", "Ropa deportiva"],
    benefits: ["Medalla ecológica", "Kit de hidratación", "Descuentos en tiendas verdes"],
    contact: "carrera@greenrunners.es"
  },
  "e9": {
    id: "e9",
    title: "eventSolarPanels",
    description: "Participa en la instalación de paneles solares en una escuela primaria para promover las energías renovables.",
    date: "2025-05-10",
    time: "09:00",
    duration: 7,
    location: "Escuela Primaria Verde, Barcelona",
    organizer: "Solar Community",
    category: "environment",
    maxVolunteers: 12,
    currentVolunteers: 9,
    requirements: ["Experiencia básica en electricidad", "Herramientas de seguridad"],
    benefits: ["Certificación técnica", "Material educativo", "Visita técnica"],
    contact: "solar@community.es"
  },
  "e10": {
    id: "e10",
    title: "Festival de sostenibilidad",
    description: "Celebra la sostenibilidad en nuestro festival anual con talleres, charlas, música y comida local orgánica.",
    date: "2025-05-25",
    time: "16:00",
    duration: 6,
    location: "Centro Cultural, Milán",
    organizer: "Green Festival",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 120,
    requirements: ["Entrada gratuita", "Registro previo"],
    benefits: ["Acceso VIP", "Degustaciones", "Red de contactos"],
    contact: "festival@green.es"
  },
  "e11": {
    id: "e11",
    title: "Monitoreo de calidad del aire",
    description: "Aprende a usar sensores de calidad del aire y participa en el monitoreo ciudadano de la contaminación atmosférica.",
    date: "2025-06-08",
    time: "13:00",
    duration: 4,
    location: "Distrito Industrial, París",
    organizer: "Clean Air",
    category: "environment",
    maxVolunteers: 8,
    currentVolunteers: 6,
    requirements: ["Conocimientos básicos de tecnología", "Smartphone"],
    benefits: ["Sensor de aire personal", "App de monitoreo", "Certificado"],
    contact: "aire@clean.es"
  },
  "e12": {
    id: "e12",
    title: "Cena vegana comunitaria",
    description: "Únete a nuestra cena comunitaria vegana para promover una alimentación más sostenible y saludable.",
    date: "2025-06-21",
    time: "19:00",
    duration: 2,
    location: "Restaurante Verde, Londres",
    organizer: "United Vegans",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Registro previo", "Contribución voluntaria"],
    benefits: ["Cena completa", "Recetas veganas", "Red de contactos"],
    contact: "vegano@united.es"
  },
  "e13": {
    id: "e13",
    title: "eventEnvironmentalReflection",
    description: "Participa en nuestra sesión de reflexión sobre los logros ambientales del primer semestre y planifica acciones futuras.",
    date: "2025-07-15",
    time: "17:00",
    duration: 2,
    location: "Biblioteca Pública, Berlín",
    organizer: "Green Future",
    category: "education",
    maxVolunteers: 40,
    currentVolunteers: 28,
    requirements: ["Participación activa", "Cuaderno"],
    benefits: ["Informe semestral", "Plan de acción", "Certificado"],
    contact: "futuro@green.es"
  },
  "e14": {
    id: "e14",
    title: "eventSustainableSummer",
    description: "Celebra el verano de manera sostenible con música en vivo, comida local y actividades eco-friendly.",
    date: "2025-07-30",
    time: "20:00",
    duration: 4,
    location: "Plaza Principal, Madrid",
    organizer: "Green Summer",
    category: "community",
    maxVolunteers: 150,
    currentVolunteers: 90,
    requirements: ["Entrada gratuita", "Registro previo"],
    benefits: ["Acceso VIP", "Degustaciones", "Souvenirs ecológicos"],
    contact: "verano@green.es"
  },
  "e15": {
    id: "e15",
    title: "eventAutumnPlanting",
    description: "Únete a nuestra plantación de especies otoñales para preparar el ecosistema para el invierno.",
    date: "2025-10-05",
    time: "10:00",
    duration: 4,
    location: "Parque del Otoño, Barcelona",
    organizer: "Autumn Planters",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Ropa cómoda", "Guantes", "Agua"],
    benefits: ["Plantas para llevar", "Certificado", "Refrigerio"],
    contact: "otono@planters.es"
  },
  "e15b": {
    id: "e15b",
    title: "Ruta en bici por la ciudad",
    description: "Explora la ciudad de manera sostenible en nuestra ruta guiada en bicicleta por los puntos verdes más importantes.",
    date: "2025-10-08",
    time: "10:00",
    duration: 2,
    location: "Centro Histórico, París",
    organizer: "Green Bikes",
    category: "community",
    maxVolunteers: 30,
    currentVolunteers: 10,
    requirements: ["Bicicleta propia", "Casco", "Agua"],
    benefits: ["Guía turística", "Mapa verde", "Descuentos locales"],
    contact: "bici@green.es"
  },
  "e16": {
    id: "e16",
    title: "Workshop: Lebensmittel konservieren",
    description: "Lerne traditionelle und moderne Techniken, um Lebensmittel zu konservieren und Abfall zu reduzieren.",
    date: "2025-10-12",
    time: "14:00",
    duration: 3,
    location: "Grünes Kulinarisches Zentrum, Mailand",
    organizer: "Sustainable Kitchen",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Schürze", "Notizbuch", "Behälter"],
    benefits: ["Konservierte Lebensmittel", "Rezepte", "Zertifikat"],
    contact: "conservacion@sustainable.de"
  },
  "e16b": {
    id: "e16b",
    title: "Workshop: Kompostieren zu Hause",
    description: "Lerne, wie man zu Hause einfach und sicher kompostiert. Ideal für Anfänger und Familien.",
    date: "2025-10-15",
    time: "18:00",
    duration: 2,
    location: "Nachbarschaftszentrum, Berlin",
    organizer: "Compost Masters",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 11,
    requirements: ["Saubere organische Abfälle", "Notizbuch"],
    benefits: ["Kompostierungs-Kit", "Praktisches Handbuch", "Online-Support"],
    contact: "compost@masters.de"
  },
  "e17": {
    id: "e17",
    title: "eventForestCleanup",
    description: "Participa en la limpieza del bosque otoñal para mantener el ecosistema saludable durante el cambio de estación.",
    date: "2025-10-19",
    time: "09:00",
    duration: 3,
    location: "Bosque de Otoño, París",
    organizer: "Forest Guardians",
    category: "environment",
    maxVolunteers: 30,
    currentVolunteers: 22,
    requirements: ["Ropa resistente", "Guantes", "Botas"],
    benefits: ["Certificado", "Refrigerio", "Material educativo"],
    contact: "bosque@guardians.es"
  },
  "e17b": {
    id: "e17b",
    title: "Taller de huertos urbanos",
    title_en: "Urban Garden Workshop",
    title_de: "Urbaner Gartenbau-Workshop",
    description: "Aprende a crear y mantener un huerto urbano en espacios pequeños para cultivar tus propios alimentos.",
    description_en: "Learn to create and maintain an urban garden in small spaces to grow your own food.",
    description_de: "Lerne, einen städtischen Garten in kleinen Räumen zu schaffen und zu pflegen, um dein eigenes Essen anzubauen.",
    date: "2025-10-15",
    time: "16:00",
    duration: 3,
    location: "Jardín Comunitario, Londres",
    location_en: "Community Garden, London",
    location_de: "Gemeinschaftsgarten, London",
    organizer: "Urban Gardens",
    organizer_en: "Urban Gardens",
    organizer_de: "Städtische Gärten",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Ropa cómoda", "Cuaderno", "Semillas"],
    requirements_en: ["Comfortable clothes", "Notebook", "Seeds"],
    requirements_de: ["Bequeme Kleidung", "Notizbuch", "Samen"],
    benefits: ["Kit de semillas", "Manual", "Seguimiento"],
    benefits_en: ["Seed kit", "Manual", "Follow-up"],
    benefits_de: ["Samen-Kit", "Handbuch", "Nachbetreuung"],
    contact: "huerto@urban.es"
  },
  "e18": {
    id: "e18",
    title: "Mercado de productos de temporada",
    description: "Descubre productos de temporada en nuestro mercado especializado en alimentos locales y sostenibles.",
    date: "2025-10-26",
    time: "11:00",
    duration: 5,
    location: "Plaza de la Temporada, Londres",
    organizer: "Seasonal Producers",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Bolsa reutilizable", "Dinero para compras"],
    benefits: ["Descuentos especiales", "Degustaciones", "Red de productores"],
    contact: "temporada@producers.es"
  },
  "e18b": {
    id: "e18b",
    title: "Charla sobre consumo responsable",
    description: "Aprende sobre consumo responsable y cómo tus decisiones de compra pueden impactar positivamente el medio ambiente.",
    date: "2025-10-29",
    time: "18:00",
    duration: 1.5,
    location: "Biblioteca Central, Berlín",
    organizer: "Conscious Consumption",
    category: "education",
    maxVolunteers: 50,
    currentVolunteers: 30,
    requirements: ["Registro previo", "Participación activa"],
    benefits: ["Guía de consumo", "Certificado", "Red de contactos"],
    contact: "consumo@conscious.es"
  },
  "e19": {
    id: "e19",
    title: "eventBirdShelters",
    description: "Ayuda a construir refugios para aves migratorias en nuestra reserva natural para proteger la biodiversidad.",
    date: "2025-11-03",
    time: "13:00",
    duration: 4,
    location: "Reserva Natural, Berlín",
    organizer: "Bird Protectors",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 12,
    requirements: ["Herramientas básicas", "Ropa de campo"],
    benefits: ["Refugio personal", "Guía de aves", "Certificado"],
    contact: "aves@protectors.es"
  },
  "e20": {
    id: "e20",
    title: "eventWindEnergy",
    description: "Aprende sobre energía eólica y participa en la construcción de pequeños generadores eólicos.",
    date: "2025-11-07",
    time: "16:00",
    duration: 2,
    location: "Centro de Energías Renovables, Madrid",
    organizer: "Green Energy",
    category: "education",
    maxVolunteers: 25,
    currentVolunteers: 20,
    requirements: ["Conocimientos básicos de electricidad"],
    benefits: ["Kit de construcción", "Manual técnico", "Certificado"],
    contact: "eolica@greenenergy.es"
  },
  "e21": {
    id: "e21",
    title: "eventOrganicProducts",
    description: "Explora productos orgánicos locales en nuestra feria especializada con productores certificados.",
    date: "2025-11-10",
    time: "09:00",
    duration: 6,
    location: "Mercado Central, Barcelona",
    organizer: "Organic Products",
    category: "community",
    maxVolunteers: 100,
    currentVolunteers: 75,
    requirements: ["Bolsa reutilizable", "Dinero para compras"],
    benefits: ["Descuentos especiales", "Degustaciones", "Red de productores"],
    contact: "organico@products.es"
  },
  "e22": {
    id: "e22",
    title: "eventWetlandsRestoration",
    description: "Participa en la restauración de humedales para mejorar la calidad del agua y proteger especies acuáticas.",
    date: "2025-11-14",
    time: "08:00",
    duration: 5,
    location: "Humedales del Norte, Milán",
    organizer: "Wetland Restorers",
    category: "environment",
    maxVolunteers: 20,
    currentVolunteers: 16,
    requirements: ["Ropa impermeable", "Botas de agua"],
    benefits: ["Certificado", "Material educativo", "Refrigerio"],
    contact: "humedales@restorers.es"
  },
  "e23": {
    id: "e23",
    title: "Conferencia sobre biodiversidad",
    description: "Asiste a esta conferencia sobre la importancia de la biodiversidad y las amenazas actuales.",
    date: "2025-11-17",
    time: "18:30",
    duration: 3,
    location: "Centro de Convenciones, París",
    organizer: "Biodiversity Institute",
    category: "education",
    maxVolunteers: 150,
    currentVolunteers: 120,
    requirements: ["Registro previo", "Documento de identidad"],
    benefits: ["Certificado de asistencia", "Material informativo", "Networking"],
    contact: "biodiversidad@institute.es"
  },
  "e24": {
    id: "e24",
    title: "eventCommunityGardens",
    description: "Ayuda a construir jardines comunitarios para promover la agricultura urbana y la cohesión social.",
    date: "2025-11-21",
    time: "10:00",
    duration: 6,
    location: "Barrio Verde, Londres",
    organizer: "Community Gardeners",
    category: "community",
    maxVolunteers: 30,
    currentVolunteers: 25,
    requirements: ["Herramientas básicas", "Ropa de trabajo"],
    benefits: ["Parcela personal", "Semillas", "Certificado"],
    contact: "jardines@community.es"
  },
  "e25": {
    id: "e25",
    title: "Monitoreo de especies en peligro",
    description: "Participa en el monitoreo de especies en peligro de extinción en nuestra reserva de vida silvestre.",
    date: "2025-11-24",
    time: "07:00",
    duration: 4,
    location: "Reserva de Vida Silvestre, Berlín",
    organizer: "Wildlife Protectors",
    category: "environment",
    maxVolunteers: 12,
    currentVolunteers: 10,
    requirements: ["Binoculares", "Cuaderno de campo"],
    benefits: ["Guía de especies", "Certificado", "Acceso VIP"],
    contact: "vidasilvestre@protectors.es"
  },
  "e26": {
    id: "e26",
    title: "Taller de reciclaje creativo",
    description: "Aprende a crear objetos útiles y artísticos a partir de materiales reciclados.",
    date: "2025-11-28",
    time: "15:00",
    duration: 3,
    location: "Centro de Arte Reciclado, Madrid",
    organizer: "Recycled Art",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 18,
    requirements: ["Materiales reciclados", "Herramientas básicas"],
    benefits: ["Objetos creados", "Manual de técnicas", "Certificado"],
    contact: "reciclaje@art.es"
  },
  "e27": {
    id: "e27",
    title: "eventSustainableChristmas",
    description: "Descubre productos navideños sostenibles en nuestro mercado especializado con enfoque ecológico.",
    date: "2025-12-01",
    time: "12:00",
    duration: 8,
    location: "Plaza Navideña, Barcelona",
    organizer: "Sustainable Christmas",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Bolsa reutilizable", "Dinero para compras"],
    benefits: ["Descuentos especiales", "Degustaciones", "Souvenirs ecológicos"],
    contact: "navidad@sustainable.es"
  },
  "e28": {
    id: "e28",
    title: "eventWinterReforestation",
    description: "Participa en la reforestación de invierno para preparar el bosque para la próxima primavera.",
    date: "2025-12-05",
    time: "09:00",
    duration: 4,
    location: "Bosque de Invierno, Milán",
    organizer: "Winter Reforesters",
    category: "environment",
    maxVolunteers: 40,
    currentVolunteers: 32,
    requirements: ["Ropa abrigada", "Guantes", "Botas"],
    benefits: ["Árbol personal", "Certificado", "Refrigerio caliente"],
    contact: "invierno@reforesters.es"
  },
  "e29": {
    id: "e29",
    title: "eventClimateSeminar",
    description: "Asiste a este seminario especializado sobre los últimos avances en la lucha contra el cambio climático.",
    date: "2025-12-08",
    time: "17:00",
    duration: 2,
    location: "Universidad Verde, París",
    organizer: "Green Climate",
    category: "education",
    maxVolunteers: 80,
    currentVolunteers: 65,
    requirements: ["Registro previo", "Conocimientos básicos"],
    benefits: ["Certificado universitario", "Material académico", "Networking"],
    contact: "clima@universidad.es"
  },
  "e30": {
    id: "e30",
    title: "eventEcoNewYear",
    description: "Celebra el fin de año de manera ecológica con música, comida local y actividades sostenibles.",
    date: "2025-12-15",
    time: "19:00",
    duration: 4,
    location: "Centro Cultural Verde, Londres",
    organizer: "Green New Year",
    category: "community",
    maxVolunteers: 120,
    currentVolunteers: 95,
    requirements: ["Entrada gratuita", "Registro previo"],
    benefits: ["Acceso VIP", "Degustaciones", "Souvenirs ecológicos"],
    contact: "añonuevo@green.es"
  },
  "e31": {
    id: "e31",
    title: "eventMarineConservation",
    description: "Aprende sobre la conservación de especies marinas y participa en actividades de protección del océano.",
    date: "2025-12-19",
    time: "11:00",
    duration: 3,
    location: "Centro Marino, Berlín",
    organizer: "Marine Protectors",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 20,
    requirements: ["Ropa cómoda", "Cuaderno"],
    benefits: ["Guía marina", "Certificado", "Material educativo"],
    contact: "marino@protectors.es"
  },
  "e32": {
    id: "e32",
    title: "eventHydroelectricWorkshop",
    description: "Aprende sobre energía hidroeléctrica y participa en la construcción de pequeños generadores hidráulicos.",
    date: "2025-12-22",
    time: "14:00",
    duration: 3,
    location: "Centro Hidroeléctrico, Madrid",
    organizer: "Hydroelectric Energy",
    category: "education",
    maxVolunteers: 18,
    currentVolunteers: 15,
    requirements: ["Conocimientos básicos de física"],
    benefits: ["Kit de construcción", "Manual técnico", "Certificado"],
    contact: "hidro@energy.es"
  },
  "e33": {
    id: "e33",
    title: "Fiesta de la sostenibilidad",
    description: "Celebra la sostenibilidad en nuestra gran fiesta de fin de año con música, comida y actividades eco-friendly.",
    date: "2025-12-29",
    time: "20:00",
    duration: 5,
    location: "Plaza de la Sostenibilidad, Barcelona",
    organizer: "Total Sustainability",
    category: "community",
    maxVolunteers: 150,
    currentVolunteers: 120,
    requirements: ["Entrada gratuita", "Registro previo"],
    benefits: ["Acceso VIP", "Degustaciones", "Souvenirs ecológicos"],
    contact: "sostenibilidad@total.es"
  }
};

// Localized overrides for event strings (progressive coverage)
const EVENT_I18N: Record<string, { en: Partial<EventDetails>; de: Partial<EventDetails> }> = {
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

// Very small phrase dictionaries to automatically translate common words
// used across our demo events. Unknown words are preserved.
const ES_EN: Record<string, string> = {
  "Taller": "Workshop",
  "Plantación": "Planting",
  "árboles": "trees",
  "Limpieza": "Cleanup",
  "de": "of",
  "río": "river",
  "playas": "beaches",
  "Mercado": "Market",
  "productos": "products",
  "locales": "local",
  "energía": "energy",
  "solar": "solar",
  "hidroeléctrica": "hydropower",
  "Reciclaje": "Recycling",
  "Huertos": "Gardens",
  "urbanos": "urban",
  "Conferencia": "Conference",
  "cambio climático": "climate change",
  "Monitoreo": "Monitoring",
  "calidad del aire": "air quality",
  "Fiesta": "Festival",
  "sostenibilidad": "sustainability",
  // Common requirements/benefits
  "Bolsa reutilizable": "Reusable bag",
  "Dinero para compras": "Money for purchases",
  "Descuentos especiales": "Special discounts",
  "Degustaciones": "Tastings",
  "Red de productores": "Producers network",
  "Entrada gratuita": "Free entry",
  "Registro previo": "Prior registration",
  "Guía marina": "Marine guide",
  "Certificado": "Certificate",
  "Material educativo": "Educational material",
};

const ES_DE: Record<string, string> = {
  "Taller": "Workshop",
  "Plantación": "Aufforstung",
  "árboles": "Bäume",
  "Limpieza": "Reinigung",
  "de": "von",
  "río": "Fluss",
  "playas": "Strände",
  "Mercado": "Markt",
  "productos": "Produkte",
  "locales": "lokal",
  "energía": "Energie",
  "solar": "Solar",
  "hidroeléctrica": "Wasserkraft",
  "Reciclaje": "Recycling",
  "Huertos": "Gärten",
  "urbanos": "urban",
  "Conferencia": "Konferenz",
  "cambio climático": "Klimawandel",
  "Monitoreo": "Überwachung",
  "calidad del aire": "Luftqualität",
  "Fiesta": "Fest",
  "sostenibilidad": "Nachhaltigkeit",
  // Common requirements/benefits
  "Bolsa reutilizable": "Wiederverwendbare Tasche",
  "Dinero para compras": "Geld für Einkäufe",
  "Descuentos especiales": "Sonderrabatte",
  "Degustaciones": "Verkostungen",
  "Red de productores": "Netz der Produzenten",
  "Entrada gratuita": "Freier Eintritt",
  "Registro previo": "Vorherige Anmeldung",
  "Guía marina": "Meeresführer",
  "Certificado": "Zertifikat",
  "Material educativo": "Bildungsmaterial",
  // Specific translations for e16
  "conservación de alimentos": "Lebensmittelkonservierung",
  "conservar alimentos": "Lebensmittel konservieren",
  "reducir el desperdicio": "Abfall reduzieren",
  "técnicas tradicionales": "traditionelle Techniken",
  "técnicas modernas": "moderne Techniken",
  "Delantal": "Schürze",
  "Cuaderno": "Notizbuch",
  "Contenedores": "Behälter",
  "Alimentos conservados": "Konservierte Lebensmittel",
  "Recetas": "Rezepte",
  // Specific translations for e16b
  "compost en casa": "Kompostieren zu Hause",
  "compostar en casa": "zu Hause kompostieren",
  "forma sencilla": "einfache Weise",
  "forma segura": "sichere Weise",
  "principiantes": "Anfänger",
  "familias": "Familien",
  "Residuo orgánico limpio": "Saubere organische Abfälle",
  "Kit de compostaje": "Kompostierungs-Kit",
  "Manual práctico": "Praktisches Handbuch",
  "Soporte online": "Online-Support",
};

function autoTranslate(text: string, locale: string): string {
  if (!text) return text;
  if (locale === "es") return text;
  const dict = locale === "en" ? ES_EN : ES_DE;
  // Replace longer phrases first
  const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
  let out = text;
  for (const [es, tr] of entries) {
    // word boundaries break on accents/compound words; do a safer global replace
    const re = new RegExp(`${es.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`, "gi");
    out = out.replace(re, (m) => {
      const isCap = m[0] === m[0].toUpperCase();
      const rep = tr;
      return isCap ? rep.charAt(0).toUpperCase() + rep.slice(1) : rep;
    });
  }
  return out;
}

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
  return {
    title: autoTranslate(base.title, locale),
    description: autoTranslate(base.description, locale),
    location: translateLocation(base.location, locale),
    organizer: autoTranslate(base.organizer, locale),
    benefits: Array.isArray(base.benefits) ? base.benefits.map((b) => autoTranslate(b, locale)) : base.benefits,
    requirements: Array.isArray(base.requirements) ? base.requirements.map((r) => autoTranslate(r, locale)) : base.requirements,
  } as Partial<EventDetails>;
}

// Function to get localized event data
function getLocalizedEventData(eventId: string, locale: string) {
  const baseEvent = EVENT_DETAILS[eventId];
  if (!baseEvent) return null;

  // Use specific language fields if available, otherwise fall back to auto-translation
  const localizedEvent = { ...baseEvent };
  
  if (locale === 'en') {
    if (baseEvent.title_en) localizedEvent.title = baseEvent.title_en;
    if (baseEvent.description_en) localizedEvent.description = baseEvent.description_en;
    if (baseEvent.location_en) localizedEvent.location = baseEvent.location_en;
    if (baseEvent.organizer_en) localizedEvent.organizer = baseEvent.organizer_en;
    if (baseEvent.requirements_en) localizedEvent.requirements = baseEvent.requirements_en;
    if (baseEvent.benefits_en) localizedEvent.benefits = baseEvent.benefits_en;
  } else if (locale === 'de') {
    if (baseEvent.title_de) localizedEvent.title = baseEvent.title_de;
    if (baseEvent.description_de) localizedEvent.description = baseEvent.description_de;
    if (baseEvent.location_de) localizedEvent.location = baseEvent.location_de;
    if (baseEvent.organizer_de) localizedEvent.organizer = baseEvent.organizer_de;
    if (baseEvent.requirements_de) localizedEvent.requirements = baseEvent.requirements_de;
    if (baseEvent.benefits_de) localizedEvent.benefits = baseEvent.benefits_de;
  }

  // Fallback to auto-translation for missing fields
  const auto = autoTranslateEvent(localizedEvent, locale);
  
  // Apply manual overrides if they exist
  const overridesFromMap = (EVENT_I18N as Record<string, Record<string, Partial<EventDetails>>>)[eventId]?.[locale as 'en' | 'de'] || {};

  return {
    ...localizedEvent,
    ...auto,
    ...overridesFromMap,
  };
}

export default function EventDetailClient({ eventId }: { eventId: string }) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [saved, setSaved] = React.useState<boolean>(false);
  
  const baseEvent = getLocalizedEventData(eventId, locale);
  if (!baseEvent) {
    notFound();
  }

  // Translate category within the component where t is available
  const translatedCategory = baseEvent.category === 'environment' ? 
    t('categoryEnvironment') :
    baseEvent.category === 'education' ?
    t('categoryEducation') :
    baseEvent.category === 'community' ?
    t('categoryCommunity') :
    baseEvent.category;

  const event = {
    ...baseEvent,
    category: translatedCategory,
  };
  
  if (!event) {
    notFound();
  }

  const [currentVolunteers, setCurrentVolunteers] = React.useState<number>(event.currentVolunteers);
  const progressPercentage = (currentVolunteers / event.maxVolunteers) * 100;
  const spotsLeft = event.maxVolunteers - currentVolunteers;
  const [showRegistrationForm, setShowRegistrationForm] = React.useState(false);

  // Prefer explicit image_url; otherwise, if website exists, use a live screenshot preview (WordPress mShots)
  const websitePreview = event.website ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(event.website)}?w=1600` : undefined;
  const headerImageSrc = event.image_url || websitePreview;

  const handleJoin = async () => {
    if (spotsLeft <= 0) return;
    if (!user) {
      alert(t('pleaseSignInFirst' + locale.charAt(0).toUpperCase() + locale.slice(1)));
      return;
    }
    setShowRegistrationForm(true);
  };

  // Load saved state (guest/local + Supabase)
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
      } catch {}

      if (!user || !isSupabaseConfigured()) return;
      const supabase = getSupabase();

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
      } catch {}

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', 'event')
        .eq('item_id', eventId)
        .maybeSingle();
      setSaved(!!data);
    };
    loadSaved();
  }, [user, eventId]);

  const toggleSaved = async () => {
    // Guest/local mode
    if (!user || !isSupabaseConfigured()) {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        const list: { type: 'project' | 'event'; id: string }[] = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex((i) => i.type === 'event' && i.id === eventId);
        if (idx >= 0) {
          list.splice(idx, 1);
          setSaved(false);
          try { trackEvent('save_item', { type: 'event', id: eventId, action: 'remove', auth: 0 }); } catch {}
        } else {
          list.push({ type: 'event', id: eventId });
          setSaved(true);
          try { trackEvent('save_item', { type: 'event', id: eventId, action: 'add', auth: 0 }); } catch {}
        }
        if (typeof window !== 'undefined') localStorage.setItem('econexo:saved', JSON.stringify(list));
      } catch {}
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
      try { trackEvent('save_item', { type: 'event', id: eventId, action: 'remove', auth: 1 }); } catch {}
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: 'event', item_id: eventId });
      if (!error) setSaved(true);
      try { trackEvent('save_item', { type: 'event', id: eventId, action: 'add', auth: 1 }); } catch {}
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
      try { trackEvent('register_event', { id: event.id }); } catch {}
      
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
        alert(t('linkCopied' + locale.charAt(0).toUpperCase() + locale.slice(1)));
      } else {
        alert(url);
      }
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
    return "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (category: string) => {
    // Since we're already returning localized category names, just return them
    return category;
  };

  return (
    <div className="min-h-screen bg-modern">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/eventos"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-6"
        >
          ← {t("backToEvents")}
        </Link>

        {/* Event Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
          {/* Event Image: show only if we have either an explicit image or a website preview */}
          {headerImageSrc && (
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
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                  {getCategoryLabel(event.category)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {event.organizer}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t(event.title)}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("date")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {new Date(event.date).toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US')}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("time")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {event.time} ({event.duration}h)
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("location")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {event.location}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("contact")}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {event.contact}
              </div>
            </div>
          </div>

          {/* Volunteer Progress */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{t("volunteerProgress")}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {event.currentVolunteers}/{event.maxVolunteers} {t("volunteers")}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {spotsLeft > 0 ? `${spotsLeft} ${t("spotsLeft")}` : t("fullyBooked")}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requirements */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("requirements")}
            </h2>
            <ul className="space-y-2">
              {event.requirements.map((req: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-green-600">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("benefits")}
            </h2>
            <ul className="space-y-2">
              {event.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-blue-600">🎁</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="join" className="flex gap-4 mt-8 justify-center">
          <button 
            onClick={handleJoin}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={spotsLeft === 0}
          >
            {spotsLeft > 0 ? t("joinEvent") : t("fullyBooked")}
          </button>
          <button onClick={handleShare} className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {t("shareEvent")}
          </button>
          <button onClick={toggleSaved} className={`px-8 py-3 rounded-lg font-semibold transition-colors ${saved ? 'bg-amber-200 text-slate-900' : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {saved ? t('saved' + locale.charAt(0).toUpperCase() + locale.slice(1)) : t('save' + locale.charAt(0).toUpperCase() + locale.slice(1))}
          </button>
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
