"use client";
import React from "react";
import { useI18n, locationLabel } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventRegistrationForm from "./EventRegistrationForm";
import EventAdministrators from "./EventAdministrators";
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
    title_en: "Vertical Gardens Construction",
    title_de: "Vertikale Gärten Bau",
    description: "Aprende a construir jardines verticales en edificios urbanos para mejorar la calidad del aire y la biodiversidad urbana.",
    description_en: "Learn to build vertical gardens on urban buildings to improve air quality and urban biodiversity.",
    description_de: "Lerne, vertikale Gärten an städtischen Gebäuden zu bauen, um die Luftqualität und die städtische Biodiversität zu verbessern.",
    date: "2025-03-18",
    time: "10:00",
    duration: 5,
    location: "Edificio Comercial Centro, Londres",
    location_en: "Commercial Center Building, London",
    location_de: "Geschäftszentrum Gebäude, London",
    organizer: "Urban Green Solutions",
    organizer_en: "Urban Green Solutions",
    organizer_de: "Städtische Grüne Lösungen",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 8,
    requirements: ["Herramientas básicas", "Ropa de trabajo", "Almuerzo"],
    requirements_en: ["Basic tools", "Work clothes", "Lunch"],
    requirements_de: ["Grundwerkzeuge", "Arbeitskleidung", "Mittagessen"],
    benefits: ["Técnicas de jardinería vertical", "Plantas para llevar", "Certificado"],
    benefits_en: ["Vertical gardening techniques", "Plants to take home", "Certificate"],
    benefits_de: ["Vertikale Gartentechniken", "Pflanzen zum Mitnehmen", "Zertifikat"],
    contact: "vertical@urbangreen.es"
  },
  "e7": {
    id: "e7",
    title: "Taller de compostaje",
    title_en: "Composting Workshop",
    title_de: "Kompostierungs-Workshop",
    description: "Aprende técnicas de compostaje doméstico para reducir residuos orgánicos y crear fertilizante natural para tus plantas.",
    description_en: "Learn home composting techniques to reduce organic waste and create natural fertilizer for your plants.",
    description_de: "Lerne Techniken für die Kompostierung zu Hause, um organische Abfälle zu reduzieren und natürlichen Dünger für deine Pflanzen zu schaffen.",
    date: "2025-04-12",
    time: "15:00",
    duration: 2,
    location: "Jardín Comunitario Sur, Berlín",
    location_en: "South Community Garden, Berlin",
    location_de: "Süd Gemeinschaftsgarten, Berlin",
    organizer: "Compost Masters",
    organizer_en: "Compost Masters",
    organizer_de: "Kompost Meister",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 16,
    requirements: ["Cuaderno para notas", "Ropa cómoda"],
    requirements_en: ["Notebook for notes", "Comfortable clothes"],
    requirements_de: ["Notizbuch für Notizen", "Bequeme Kleidung"],
    benefits: ["Kit de compostaje", "Manual digital", "Seguimiento online"],
    benefits_en: ["Composting kit", "Digital manual", "Online follow-up"],
    benefits_de: ["Kompostierungs-Kit", "Digitales Handbuch", "Online-Nachbetreuung"],
    contact: "compost@masters.es"
  },
  "e8": {
    id: "e8",
    title: "eventEcoRace",
    title_en: "Eco-Friendly 5K Race",
    title_de: "Ökologischer 5K-Lauf",
    description: "Únete a nuestra carrera 5K con enfoque ecológico. Recorreremos rutas verdes mientras promovemos el deporte sostenible.",
    description_en: "Join our eco-friendly 5K race. We'll run through green routes while promoting sustainable sports.",
    description_de: "Nimm an unserem umweltfreundlichen 5K-Lauf teil. Wir laufen durch grüne Routen und fördern nachhaltigen Sport.",
    date: "2025-04-22",
    time: "08:00",
    duration: 2,
    location: "Parque Central, Madrid",
    location_en: "Central Park, Madrid",
    location_de: "Zentralpark, Madrid",
    organizer: "Green Runners",
    organizer_en: "Green Runners",
    organizer_de: "Grüne Läufer",
    category: "community",
    maxVolunteers: 100,
    currentVolunteers: 75,
    requirements: ["Registro previo", "Certificado médico", "Ropa deportiva"],
    requirements_en: ["Prior registration", "Medical certificate", "Sports clothes"],
    requirements_de: ["Vorherige Anmeldung", "Ärztliches Attest", "Sportkleidung"],
    benefits: ["Medalla ecológica", "Kit de hidratación", "Descuentos en tiendas verdes"],
    benefits_en: ["Eco-friendly medal", "Hydration kit", "Discounts at green stores"],
    benefits_de: ["Umweltfreundliche Medaille", "Hydratations-Kit", "Rabatte in grünen Läden"],
    contact: "carrera@greenrunners.es"
  },
  "e9": {
    id: "e9",
    title: "eventSolarPanels",
    title_en: "Solar Panels Installation",
    title_de: "Solarpanels Installation",
    description: "Participa en la instalación de paneles solares en una escuela primaria para promover las energías renovables.",
    description_en: "Participate in the installation of solar panels at an elementary school to promote renewable energy.",
    description_de: "Nimm an der Installation von Solarpanelen an einer Grundschule teil, um erneuerbare Energien zu fördern.",
    date: "2025-05-10",
    time: "09:00",
    duration: 7,
    location: "Escuela Primaria Verde, Barcelona",
    location_en: "Green Elementary School, Barcelona",
    location_de: "Grüne Grundschule, Barcelona",
    organizer: "Solar Community",
    organizer_en: "Solar Community",
    organizer_de: "Solar Gemeinschaft",
    category: "environment",
    maxVolunteers: 12,
    currentVolunteers: 9,
    requirements: ["Experiencia básica en electricidad", "Herramientas de seguridad"],
    requirements_en: ["Basic electrical experience", "Safety tools"],
    requirements_de: ["Grundkenntnisse in Elektrizität", "Sicherheitswerkzeuge"],
    benefits: ["Certificación técnica", "Material educativo", "Visita técnica"],
    benefits_en: ["Technical certification", "Educational material", "Technical visit"],
    benefits_de: ["Technische Zertifizierung", "Bildungsmaterial", "Technischer Besuch"],
    contact: "solar@community.es"
  },
  "e10": {
    id: "e10",
    title: "Festival de sostenibilidad",
    title_en: "Sustainability Festival",
    title_de: "Nachhaltigkeitsfestival",
    description: "Celebra la sostenibilidad en nuestro festival anual con talleres, charlas, música y comida local orgánica.",
    description_en: "Celebrate sustainability at our annual festival with workshops, talks, music and local organic food.",
    description_de: "Feiere Nachhaltigkeit auf unserem jährlichen Festival mit Workshops, Vorträgen, Musik und lokalen Bio-Lebensmitteln.",
    date: "2025-05-25",
    time: "16:00",
    duration: 6,
    location: "Centro Cultural, Milán",
    location_en: "Cultural Center, Milan",
    location_de: "Kulturzentrum, Mailand",
    organizer: "Green Festival",
    organizer_en: "Green Festival",
    organizer_de: "Grünes Festival",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 120,
    requirements: ["Entrada gratuita", "Registro previo"],
    requirements_en: ["Free entry", "Prior registration"],
    requirements_de: ["Freier Eintritt", "Vorherige Anmeldung"],
    benefits: ["Acceso VIP", "Degustaciones", "Red de contactos"],
    benefits_en: ["VIP access", "Tastings", "Contact network"],
    benefits_de: ["VIP-Zugang", "Kostproben", "Kontaktnetzwerk"],
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
    requirements_en: ["Basic knowledge of technology", "Smartphone"],
    requirements_de: ["Grundkenntnisse in Technologie", "Smartphone"],
    benefits: ["Sensor de aire personal", "App de monitoreo", "Certificado"],
    benefits_en: ["Personal air sensor", "Monitoring app", "Certificate"],
    benefits_de: ["Persönlicher Luftensor", "Überwachungs-App", "Zertifikat"],
    contact: "aire@clean.es"
  },
  "e12": {
    id: "e12",
    title: "Cena vegana comunitaria",
    title_en: "Community Vegan Dinner",
    title_de: "Gemeinschaftliches veganes Abendessen",
    description: "Únete a nuestra cena comunitaria vegana para promover una alimentación más sostenible y saludable.",
    description_en: "Join our community vegan dinner to promote more sustainable and healthy eating.",
    description_de: "Nimm an unserem gemeinschaftlichen veganen Abendessen teil, um nachhaltigeres und gesünderes Essen zu fördern.",
    date: "2025-06-21",
    time: "19:00",
    duration: 2,
    location: "Restaurante Verde, Londres",
    location_en: "Green Restaurant, London",
    location_de: "Grünes Restaurant, London",
    organizer: "United Vegans",
    organizer_en: "United Vegans",
    organizer_de: "Vereinte Veganer",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Registro previo", "Contribución voluntaria"],
    requirements_en: ["Prior registration", "Voluntary contribution"],
    requirements_de: ["Vorherige Anmeldung", "Freiwilliger Beitrag"],
    benefits: ["Cena completa", "Recetas veganas", "Red de contactos"],
    benefits_en: ["Full dinner", "Vegan recipes", "Contact network"],
    benefits_de: ["Vollständiges Abendessen", "Vegane Rezepte", "Kontaktnetzwerk"],
    contact: "vegano@united.es"
  },
  "e13": {
    id: "e13",
    title: "eventEnvironmentalReflection",
    title_en: "Environmental Reflection Session",
    title_de: "Umweltreflexions-Sitzung",
    description: "Participa en nuestra sesión de reflexión sobre los logros ambientales del primer semestre y planifica acciones futuras.",
    description_en: "Participate in our reflection session on environmental achievements of the first semester and plan future actions.",
    description_de: "Nimm an unserer Reflexionssitzung über die Umweltleistungen des ersten Semesters teil und plane zukünftige Aktionen.",
    date: "2025-07-15",
    time: "17:00",
    duration: 2,
    location: "Biblioteca Pública, Berlín",
    location_en: "Public Library, Berlin",
    location_de: "Öffentliche Bibliothek, Berlin",
    organizer: "Green Future",
    organizer_en: "Green Future",
    organizer_de: "Grüne Zukunft",
    category: "education",
    maxVolunteers: 40,
    currentVolunteers: 28,
    requirements: ["Participación activa", "Cuaderno"],
    requirements_en: ["Active participation", "Notebook"],
    requirements_de: ["Aktive Teilnahme", "Notizbuch"],
    benefits: ["Informe semestral", "Plan de acción", "Certificado"],
    benefits_en: ["Semester report", "Action plan", "Certificate"],
    benefits_de: ["Semesterbericht", "Aktionsplan", "Zertifikat"],
    contact: "futuro@green.es"
  },
  "e14": {
    id: "e14",
    title: "eventSustainableSummer",
    title_en: "Sustainable Summer Celebration",
    title_de: "Nachhaltige Sommerfeier",
    description: "Celebra el verano de manera sostenible con música en vivo, comida local y actividades eco-friendly.",
    description_en: "Celebrate summer sustainably with live music, local food and eco-friendly activities.",
    description_de: "Feiere den Sommer nachhaltig mit Live-Musik, lokalen Lebensmitteln und umweltfreundlichen Aktivitäten.",
    date: "2025-07-30",
    time: "20:00",
    duration: 4,
    location: "Plaza Principal, Madrid",
    location_en: "Main Square, Madrid",
    location_de: "Hauptplatz, Madrid",
    organizer: "Green Summer",
    organizer_en: "Green Summer",
    organizer_de: "Grüner Sommer",
    category: "community",
    maxVolunteers: 150,
    currentVolunteers: 90,
    requirements: ["Entrada gratuita", "Registro previo"],
    requirements_en: ["Free entry", "Prior registration"],
    requirements_de: ["Freier Eintritt", "Vorherige Anmeldung"],
    benefits: ["Acceso VIP", "Degustaciones", "Souvenirs ecológicos"],
    benefits_en: ["VIP access", "Tastings", "Eco-friendly souvenirs"],
    benefits_de: ["VIP-Zugang", "Kostproben", "Umweltfreundliche Souvenirs"],
    contact: "verano@green.es"
  },
  "e15": {
    id: "e15",
    title: "eventAutumnPlanting",
    title_en: "Autumn Planting",
    title_de: "Herbstaufforstung",
    description: "Únete a nuestra plantación de especies otoñales para preparar el ecosistema para el invierno.",
    description_en: "Join our planting of autumn species to prepare the ecosystem for winter.",
    description_de: "Schließe dich unserer Pflanzung von Herbstarten an, um das Ökosystem für den Winter vorzubereiten.",
    date: "2025-10-05",
    time: "10:00",
    duration: 4,
    location: "Parque del Otoño, Barcelona",
    location_en: "Autumn Park, Barcelona",
    location_de: "Park des Herbstes, Barcelona",
    organizer: "Autumn Planters",
    organizer_en: "Autumn Planters",
    organizer_de: "Herbstpflanzer",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Ropa cómoda", "Guantes", "Agua"],
    requirements_en: ["Comfortable clothes", "Gloves", "Water"],
    requirements_de: ["Bequeme Kleidung", "Handschuhe", "Wasser"],
    benefits: ["Plantas para llevar", "Certificado", "Refrigerio"],
    benefits_en: ["Plants to take home", "Certificate", "Snack"],
    benefits_de: ["Pflanzen zum Mitnehmen", "Zertifikat", "Erfrischung"],
    contact: "otono@planters.es"
  },
  "e15b": {
    id: "e15b",
    title: "Ruta en bici por la ciudad",
    title_en: "City Bike Tour",
    title_de: "Stadtradtour",
    description: "Explora la ciudad de manera sostenible en nuestra ruta guiada en bicicleta por los puntos verdes más importantes.",
    description_en: "Explore the city sustainably on our guided bike tour through the most important green spots.",
    description_de: "Erkunde die Stadt nachhaltig auf unserer geführten Radtour durch die wichtigsten grünen Orte.",
    date: "2025-10-08",
    time: "10:00",
    duration: 2,
    location: "Centro Histórico, París",
    location_en: "Historic Center, Paris",
    location_de: "Historisches Zentrum, Paris",
    organizer: "Green Bikes",
    organizer_en: "Green Bikes",
    organizer_de: "Grüne Fahrräder",
    category: "community",
    maxVolunteers: 30,
    currentVolunteers: 10,
    requirements: ["Bicicleta propia", "Casco", "Agua"],
    requirements_en: ["Own bicycle", "Helmet", "Water"],
    requirements_de: ["Eigenes Fahrrad", "Helm", "Wasser"],
    benefits: ["Guía turística", "Mapa verde", "Descuentos locales"],
    benefits_en: ["Tour guide", "Green map", "Local discounts"],
    benefits_de: ["Reiseführer", "Grüne Karte", "Lokale Rabatte"],
    contact: "bici@green.es"
  },
  "e16": {
    id: "e16",
    title: "Workshop: Lebensmittel konservieren",
    title_en: "Food Preservation Workshop",
    title_de: "Workshop: Lebensmittel konservieren",
    description: "Lerne traditionelle und moderne Techniken, um Lebensmittel zu konservieren und Abfall zu reduzieren.",
    description_en: "Learn traditional and modern techniques to preserve food and reduce waste.",
    description_de: "Lerne traditionelle und moderne Techniken, um Lebensmittel zu konservieren und Abfall zu reduzieren.",
    date: "2025-10-12",
    time: "14:00",
    duration: 3,
    location: "Grünes Kulinarisches Zentrum, Mailand",
    location_en: "Green Culinary Center, Milan",
    location_de: "Grünes Kulinarisches Zentrum, Mailand",
    organizer: "Sustainable Kitchen",
    organizer_en: "Sustainable Kitchen",
    organizer_de: "Nachhaltige Küche",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Schürze", "Notizbuch", "Behälter"],
    requirements_en: ["Apron", "Notebook", "Container"],
    requirements_de: ["Schürze", "Notizbuch", "Behälter"],
    benefits: ["Konservierte Lebensmittel", "Rezepte", "Zertifikat"],
    benefits_en: ["Preserved food", "Recipes", "Certificate"],
    benefits_de: ["Konservierte Lebensmittel", "Rezepte", "Zertifikat"],
    contact: "conservacion@sustainable.de"
  },
  "e16b": {
    id: "e16b",
    title: "Workshop: Kompostieren zu Hause",
    title_en: "Home Composting Workshop",
    title_de: "Workshop: Kompostieren zu Hause",
    description: "Lerne, wie man zu Hause einfach und sicher kompostiert. Ideal für Anfänger und Familien.",
    description_en: "Learn how to compost easily and safely at home. Ideal for beginners and families.",
    description_de: "Lerne, wie man zu Hause einfach und sicher kompostiert. Ideal für Anfänger und Familien.",
    date: "2025-10-15",
    time: "18:00",
    duration: 2,
    location: "Nachbarschaftszentrum, Berlin",
    location_en: "Neighborhood Center, Berlin",
    location_de: "Nachbarschaftszentrum, Berlin",
    organizer: "Compost Masters",
    organizer_en: "Compost Masters",
    organizer_de: "Kompost Meister",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 11,
    requirements: ["Saubere organische Abfälle", "Notizbuch"],
    requirements_en: ["Clean organic waste", "Notebook"],
    requirements_de: ["Saubere organische Abfälle", "Notizbuch"],
    benefits: ["Kompostierungs-Kit", "Praktisches Handbuch", "Online-Support"],
    benefits_en: ["Composting kit", "Practical manual", "Online support"],
    benefits_de: ["Kompostierungs-Kit", "Praktisches Handbuch", "Online-Support"],
    contact: "compost@masters.de"
  },
  "e17": {
    id: "e17",
    title: "eventForestCleanup",
    title_en: "Autumn Forest Cleanup",
    title_de: "Herbstwaldreinigung",
    description: "Participa en la limpieza del bosque otoñal para mantener el ecosistema saludable durante el cambio de estación.",
    description_en: "Participate in the autumn forest cleanup to keep the ecosystem healthy during the season change.",
    description_de: "Nimm an der Herbstwaldreinigung teil, um das Ökosystem während des Jahreszeitenwechsels gesund zu halten.",
    date: "2025-10-19",
    time: "09:00",
    duration: 3,
    location: "Bosque de Otoño, París",
    location_en: "Autumn Forest, Paris",
    location_de: "Herbstwald, Paris",
    organizer: "Forest Guardians",
    organizer_en: "Forest Guardians",
    organizer_de: "Waldschützer",
    category: "environment",
    maxVolunteers: 30,
    currentVolunteers: 22,
    requirements: ["Ropa resistente", "Guantes", "Botas"],
    requirements_en: ["Resistant clothing", "Gloves", "Boots"],
    requirements_de: ["Robuste Kleidung", "Handschuhe", "Stiefel"],
    benefits: ["Certificado", "Refrigerio", "Material educativo"],
    benefits_en: ["Certificate", "Snack", "Educational material"],
    benefits_de: ["Zertifikat", "Erfrischung", "Bildungsmaterial"],
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
    title_en: "Seasonal Products Market",
    title_de: "Saisonproduktmarkt",
    description: "Descubre productos de temporada en nuestro mercado especializado en alimentos locales y sostenibles.",
    description_en: "Discover seasonal products at our specialized market for local and sustainable food.",
    description_de: "Entdecke Saisonprodukte auf unserem spezialisierten Markt für lokale und nachhaltige Lebensmittel.",
    date: "2025-10-26",
    time: "11:00",
    duration: 5,
    location: "Plaza de la Temporada, Londres",
    location_en: "Season Square, London",
    location_de: "Saisonplatz, London",
    organizer: "Seasonal Producers",
    organizer_en: "Seasonal Producers",
    organizer_de: "Saisonproduzenten",
    category: "community",
    maxVolunteers: 50,
    currentVolunteers: 35,
    requirements: ["Bolsa reutilizable", "Dinero para compras"],
    requirements_en: ["Reusable bag", "Money for purchases"],
    requirements_de: ["Wiederverwendbare Tasche", "Geld für Einkäufe"],
    benefits: ["Descuentos especiales", "Degustaciones", "Red de productores"],
    benefits_en: ["Special discounts", "Tastings", "Producer network"],
    benefits_de: ["Spezielle Rabatte", "Kostproben", "Produzentennetzwerk"],
    contact: "temporada@producers.es"
  },
  "e18b": {
    id: "e18b",
    title: "Charla sobre consumo responsable",
    title_en: "Responsible Consumption Talk",
    title_de: "Vortrag über verantwortungsvollen Konsum",
    description: "Aprende sobre consumo responsable y cómo tus decisiones de compra pueden impactar positivamente el medio ambiente.",
    description_en: "Learn about responsible consumption and how your purchasing decisions can positively impact the environment.",
    description_de: "Lerne über verantwortungsvollen Konsum und wie deine Kaufentscheidungen die Umwelt positiv beeinflussen können.",
    date: "2025-10-29",
    time: "18:00",
    duration: 1.5,
    location: "Biblioteca Central, Berlín",
    location_en: "Central Library, Berlin",
    location_de: "Zentralbibliothek, Berlin",
    organizer: "Conscious Consumption",
    organizer_en: "Conscious Consumption",
    organizer_de: "Bewusster Konsum",
    category: "education",
    maxVolunteers: 50,
    currentVolunteers: 30,
    requirements: ["Registro previo", "Participación activa"],
    requirements_en: ["Prior registration", "Active participation"],
    requirements_de: ["Vorherige Anmeldung", "Aktive Teilnahme"],
    benefits: ["Guía de consumo", "Certificado", "Red de contactos"],
    benefits_en: ["Consumption guide", "Certificate", "Contact network"],
    benefits_de: ["Konsumführer", "Zertifikat", "Kontaktnetzwerk"],
    contact: "consumo@conscious.es"
  },
  "e19": {
    id: "e19",
    title: "eventBirdShelters",
    title_en: "Bird Shelters Construction",
    title_de: "Vogelschutzunterkünfte Bau",
    description: "Ayuda a construir refugios para aves migratorias en nuestra reserva natural para proteger la biodiversidad.",
    description_en: "Help build shelters for migratory birds in our nature reserve to protect biodiversity.",
    description_de: "Hilf beim Bau von Unterkünften für Zugvögel in unserem Naturschutzgebiet, um die Biodiversität zu schützen.",
    date: "2025-11-03",
    time: "13:00",
    duration: 4,
    location: "Reserva Natural, Berlín",
    location_en: "Nature Reserve, Berlin",
    location_de: "Naturschutzgebiet, Berlin",
    organizer: "Bird Protectors",
    organizer_en: "Bird Protectors",
    organizer_de: "Vogelschützer",
    category: "environment",
    maxVolunteers: 15,
    currentVolunteers: 12,
    requirements: ["Herramientas básicas", "Ropa de campo"],
    requirements_en: ["Basic tools", "Field clothes"],
    requirements_de: ["Grundwerkzeuge", "Feldkleidung"],
    benefits: ["Refugio personal", "Guía de aves", "Certificado"],
    benefits_en: ["Personal shelter", "Bird guide", "Certificate"],
    benefits_de: ["Persönliche Unterkunft", "Vogelführer", "Zertifikat"],
    contact: "aves@protectors.es"
  },
  "e20": {
    id: "e20",
    title: "eventWindEnergy",
    title_en: "Wind Energy Workshop",
    title_de: "Windenergie-Workshop",
    description: "Aprende sobre energía eólica y participa en la construcción de pequeños generadores eólicos.",
    description_en: "Learn about wind energy and participate in the construction of small wind generators.",
    description_de: "Lerne über Windenergie und nimm an der Konstruktion kleiner Windgeneratoren teil.",
    date: "2025-11-07",
    time: "16:00",
    duration: 2,
    location: "Centro de Energías Renovables, Madrid",
    location_en: "Renewable Energy Center, Madrid",
    location_de: "Zentrum für erneuerbare Energien, Madrid",
    organizer: "Green Energy",
    organizer_en: "Green Energy",
    organizer_de: "Grüne Energie",
    category: "education",
    maxVolunteers: 25,
    currentVolunteers: 20,
    requirements: ["Conocimientos básicos de electricidad"],
    requirements_en: ["Basic knowledge of electricity"],
    requirements_de: ["Grundkenntnisse in Elektrizität"],
    benefits: ["Kit de construcción", "Manual técnico", "Certificado"],
    benefits_en: ["Construction kit", "Technical manual", "Certificate"],
    benefits_de: ["Bausatz", "Technisches Handbuch", "Zertifikat"],
    contact: "eolica@greenenergy.es"
  },
  "e21": {
    id: "e21",
    title: "eventOrganicProducts",
    title_en: "Organic Products Fair",
    title_de: "Bio-Produkte Messe",
    description: "Explora productos orgánicos locales en nuestra feria especializada con productores certificados.",
    description_en: "Explore local organic products at our specialized fair with certified producers.",
    description_de: "Entdecke lokale Bio-Produkte auf unserer spezialisierten Messe mit zertifizierten Produzenten.",
    date: "2025-11-10",
    time: "09:00",
    duration: 6,
    location: "Mercado Central, Barcelona",
    location_en: "Central Market, Barcelona",
    location_de: "Zentralmarkt, Barcelona",
    organizer: "Organic Products",
    organizer_en: "Organic Products",
    organizer_de: "Bio-Produkte",
    category: "community",
    maxVolunteers: 100,
    currentVolunteers: 75,
    requirements: ["Bolsa reutilizable", "Dinero para compras"],
    requirements_en: ["Reusable bag", "Money for purchases"],
    requirements_de: ["Wiederverwendbare Tasche", "Geld für Einkäufe"],
    benefits: ["Descuentos especiales", "Degustaciones", "Red de productores"],
    benefits_en: ["Special discounts", "Tastings", "Producer network"],
    benefits_de: ["Spezielle Rabatte", "Kostproben", "Produzentennetzwerk"],
    contact: "organico@products.es"
  },
  "e22": {
    id: "e22",
    title: "eventWetlandsRestoration",
    title_en: "Wetlands Restoration",
    title_de: "Feuchtgebietsrestaurierung",
    description: "Participa en la restauración de humedales para mejorar la calidad del agua y proteger especies acuáticas.",
    description_en: "Participate in wetlands restoration to improve water quality and protect aquatic species.",
    description_de: "Nimm an der Feuchtgebietsrestaurierung teil, um die Wasserqualität zu verbessern und aquatische Arten zu schützen.",
    date: "2025-11-14",
    time: "08:00",
    duration: 5,
    location: "Humedales del Norte, Milán",
    location_en: "Northern Wetlands, Milan",
    location_de: "Nördliche Feuchtgebiete, Mailand",
    organizer: "Wetland Restorers",
    organizer_en: "Wetland Restorers",
    organizer_de: "Feuchtgebietsrestaurierer",
    category: "environment",
    maxVolunteers: 20,
    currentVolunteers: 16,
    requirements: ["Ropa impermeable", "Botas de agua"],
    requirements_en: ["Waterproof clothing", "Water boots"],
    requirements_de: ["Wasserdichte Kleidung", "Wasserstiefel"],
    benefits: ["Certificado", "Material educativo", "Refrigerio"],
    benefits_en: ["Certificate", "Educational material", "Snack"],
    benefits_de: ["Zertifikat", "Bildungsmaterial", "Erfrischung"],
    contact: "humedales@restorers.es"
  },
  "e23": {
    id: "e23",
    title: "Conferencia sobre biodiversidad",
    title_en: "Biodiversity Conference",
    title_de: "Biodiversitätskonferenz",
    description: "Asiste a esta conferencia sobre la importancia de la biodiversidad y las amenazas actuales.",
    description_en: "Attend this conference on the importance of biodiversity and current threats.",
    description_de: "Nimm an dieser Konferenz über die Bedeutung der Biodiversität und aktuelle Bedrohungen teil.",
    date: "2025-11-17",
    time: "18:30",
    duration: 3,
    location: "Centro de Convenciones, París",
    location_en: "Convention Center, Paris",
    location_de: "Kongresszentrum, Paris",
    organizer: "Biodiversity Institute",
    organizer_en: "Biodiversity Institute",
    organizer_de: "Biodiversitätsinstitut",
    category: "education",
    maxVolunteers: 150,
    currentVolunteers: 120,
    requirements: ["Registro previo", "Documento de identidad"],
    requirements_en: ["Prior registration", "Identity document"],
    requirements_de: ["Vorherige Anmeldung", "Ausweisdokument"],
    benefits: ["Certificado de asistencia", "Material informativo", "Networking"],
    benefits_en: ["Attendance certificate", "Informative material", "Networking"],
    benefits_de: ["Teilnahmezertifikat", "Informatives Material", "Netzwerken"],
    contact: "biodiversidad@institute.es"
  },
  "e24": {
    id: "e24",
    title: "eventCommunityGardens",
    title_en: "Community Gardens Construction",
    title_de: "Gemeinschaftsgärten Bau",
    description: "Ayuda a construir jardines comunitarios para promover la agricultura urbana y la cohesión social.",
    description_en: "Help build community gardens to promote urban agriculture and social cohesion.",
    description_de: "Hilf beim Bau von Gemeinschaftsgärten, um urbane Landwirtschaft und sozialen Zusammenhalt zu fördern.",
    date: "2025-11-21",
    time: "10:00",
    duration: 6,
    location: "Barrio Verde, Londres",
    location_en: "Green Neighborhood, London",
    location_de: "Grünes Viertel, London",
    organizer: "Community Gardeners",
    organizer_en: "Community Gardeners",
    organizer_de: "Gemeinschaftsgärtner",
    category: "community",
    maxVolunteers: 30,
    currentVolunteers: 25,
    requirements: ["Herramientas básicas", "Ropa de trabajo"],
    requirements_en: ["Basic tools", "Work clothes"],
    requirements_de: ["Grundwerkzeuge", "Arbeitskleidung"],
    benefits: ["Parcela personal", "Semillas", "Certificado"],
    benefits_en: ["Personal plot", "Seeds", "Certificate"],
    benefits_de: ["Persönliches Grundstück", "Samen", "Zertifikat"],
    contact: "jardines@community.es"
  },
  "e25": {
    id: "e25",
    title: "Monitoreo de especies en peligro",
    title_en: "Endangered Species Monitoring",
    title_de: "Überwachung gefährdeter Arten",
    description: "Participa en el monitoreo de especies en peligro de extinción en nuestra reserva de vida silvestre.",
    description_en: "Participate in monitoring endangered species at our wildlife reserve.",
    description_de: "Nimm an der Überwachung gefährdeter Arten in unserem Wildtierreservat teil.",
    date: "2025-11-24",
    time: "07:00",
    duration: 4,
    location: "Reserva de Vida Silvestre, Berlín",
    location_en: "Wildlife Reserve, Berlin",
    location_de: "Wildtierreservat, Berlin",
    organizer: "Wildlife Protectors",
    organizer_en: "Wildlife Protectors",
    organizer_de: "Wildtierschützer",
    category: "environment",
    maxVolunteers: 12,
    currentVolunteers: 10,
    requirements: ["Binoculares", "Cuaderno de campo"],
    requirements_en: ["Binoculars", "Field notebook"],
    requirements_de: ["Fernglas", "Feldnotizbuch"],
    benefits: ["Guía de especies", "Certificado", "Acceso VIP"],
    benefits_en: ["Species guide", "Certificate", "VIP access"],
    benefits_de: ["Artenführer", "Zertifikat", "VIP-Zugang"],
    contact: "vidasilvestre@protectors.es"
  },
  "e26": {
    id: "e26",
    title: "Taller de reciclaje creativo",
    title_en: "Creative Recycling Workshop",
    title_de: "Kreatives Recycling-Workshop",
    description: "Aprende a crear objetos útiles y artísticos a partir de materiales reciclados.",
    description_en: "Learn to create useful and artistic objects from recycled materials.",
    description_de: "Lerne, nützliche und künstlerische Objekte aus recycelten Materialien zu erstellen.",
    date: "2025-11-28",
    time: "15:00",
    duration: 3,
    location: "Centro de Arte Reciclado, Madrid",
    location_en: "Recycled Art Center, Madrid",
    location_de: "Recycling-Kunstzentrum, Madrid",
    organizer: "Recycled Art",
    organizer_en: "Recycled Art",
    organizer_de: "Recycling-Kunst",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 18,
    requirements: ["Materiales reciclados", "Herramientas básicas"],
    requirements_en: ["Recycled materials", "Basic tools"],
    requirements_de: ["Recycelte Materialien", "Grundwerkzeuge"],
    benefits: ["Objetos creados", "Manual de técnicas", "Certificado"],
    benefits_en: ["Created objects", "Technique manual", "Certificate"],
    benefits_de: ["Erstellte Objekte", "Technikhandbuch", "Zertifikat"],
    contact: "reciclaje@art.es"
  },
  "e27": {
    id: "e27",
    title: "eventSustainableChristmas",
    title_en: "Sustainable Christmas Market",
    title_de: "Nachhaltiger Weihnachtsmarkt",
    description: "Descubre productos navideños sostenibles en nuestro mercado especializado con enfoque ecológico.",
    description_en: "Discover sustainable Christmas products at our specialized eco-friendly market.",
    description_de: "Entdecke nachhaltige Weihnachtsprodukte auf unserem spezialisierten umweltfreundlichen Markt.",
    date: "2025-12-01",
    time: "12:00",
    duration: 8,
    location: "Plaza Navideña, Barcelona",
    location_en: "Christmas Square, Barcelona",
    location_de: "Weihnachtsplatz, Barcelona",
    organizer: "Sustainable Christmas",
    organizer_en: "Sustainable Christmas",
    organizer_de: "Nachhaltiges Weihnachten",
    category: "community",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Bolsa reutilizable", "Dinero para compras"],
    requirements_en: ["Reusable bag", "Money for purchases"],
    requirements_de: ["Wiederverwendbare Tasche", "Geld für Einkäufe"],
    benefits: ["Descuentos especiales", "Degustaciones", "Souvenirs ecológicos"],
    benefits_en: ["Special discounts", "Tastings", "Eco-friendly souvenirs"],
    benefits_de: ["Spezielle Rabatte", "Kostproben", "Umweltfreundliche Souvenirs"],
    contact: "navidad@sustainable.es"
  },
  "e28": {
    id: "e28",
    title: "eventWinterReforestation",
    title_en: "Winter Reforestation",
    title_de: "Winteraufforstung",
    description: "Participa en la reforestación de invierno para preparar el bosque para la próxima primavera.",
    description_en: "Participate in winter reforestation to prepare the forest for next spring.",
    description_de: "Nimm an der Winteraufforstung teil, um den Wald für den nächsten Frühling vorzubereiten.",
    date: "2025-12-05",
    time: "09:00",
    duration: 4,
    location: "Bosque de Invierno, Milán",
    location_en: "Winter Forest, Milan",
    location_de: "Winterwald, Mailand",
    organizer: "Winter Reforesters",
    organizer_en: "Winter Reforesters",
    organizer_de: "Winteraufforster",
    category: "environment",
    maxVolunteers: 40,
    currentVolunteers: 32,
    requirements: ["Ropa abrigada", "Guantes", "Botas"],
    requirements_en: ["Warm clothing", "Gloves", "Boots"],
    requirements_de: ["Warme Kleidung", "Handschuhe", "Stiefel"],
    benefits: ["Árbol personal", "Certificado", "Refrigerio caliente"],
    benefits_en: ["Personal tree", "Certificate", "Hot snack"],
    benefits_de: ["Persönlicher Baum", "Zertifikat", "Heißer Snack"],
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
    requirements_en: ["Prior registration", "Basic knowledge"],
    requirements_de: ["Vorherige Anmeldung", "Grundkenntnisse"],
    benefits: ["Certificado universitario", "Material académico", "Networking"],
    benefits_en: ["University certificate", "Academic material", "Networking"],
    benefits_de: ["Universitätszertifikat", "Akademisches Material", "Netzwerken"],
    contact: "clima@universidad.es"
  },
  "e30": {
    id: "e30",
    title: "eventEcoNewYear",
    title_en: "Eco-Friendly New Year Celebration",
    title_de: "Umweltfreundliche Neujahrsfeier",
    description: "Celebra el fin de año de manera ecológica con música, comida local y actividades sostenibles.",
    description_en: "Celebrate the end of the year in an eco-friendly way with music, local food and sustainable activities.",
    description_de: "Feiere das Jahresende auf umweltfreundliche Weise mit Musik, lokalen Lebensmitteln und nachhaltigen Aktivitäten.",
    date: "2025-12-15",
    time: "19:00",
    duration: 4,
    location: "Centro Cultural Verde, Londres",
    location_en: "Green Cultural Center, London",
    location_de: "Grünes Kulturzentrum, London",
    organizer: "Green New Year",
    organizer_en: "Green New Year",
    organizer_de: "Grünes Neujahr",
    category: "community",
    maxVolunteers: 120,
    currentVolunteers: 95,
    requirements: ["Entrada gratuita", "Registro previo"],
    requirements_en: ["Free entry", "Prior registration"],
    requirements_de: ["Freier Eintritt", "Vorherige Anmeldung"],
    benefits: ["Acceso VIP", "Degustaciones", "Souvenirs ecológicos"],
    benefits_en: ["VIP access", "Tastings", "Eco-friendly souvenirs"],
    benefits_de: ["VIP-Zugang", "Kostproben", "Umweltfreundliche Souvenirs"],
    contact: "añonuevo@green.es"
  },
  "e31": {
    id: "e31",
    title: "eventMarineConservation",
    title_en: "Marine Conservation",
    title_de: "Meeresschutz",
    description: "Aprende sobre la conservación de especies marinas y participa en actividades de protección del océano.",
    description_en: "Learn about marine species conservation and participate in ocean protection activities.",
    description_de: "Lerne über den Schutz mariner Arten und nimm an Aktivitäten zum Schutz der Ozeane teil.",
    date: "2025-12-19",
    time: "11:00",
    duration: 3,
    location: "Centro Marino, Berlín",
    location_en: "Marine Center, Berlin",
    location_de: "Meereszentrum, Berlin",
    organizer: "Marine Protectors",
    organizer_en: "Marine Protectors",
    organizer_de: "Meeresschützer",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 20,
    requirements: ["Ropa cómoda", "Cuaderno"],
    requirements_en: ["Comfortable clothes", "Notebook"],
    requirements_de: ["Bequeme Kleidung", "Notizbuch"],
    benefits: ["Guía marina", "Certificado", "Material educativo"],
    benefits_en: ["Marine guide", "Certificate", "Educational material"],
    benefits_de: ["Meeresführer", "Zertifikat", "Bildungsmaterial"],
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
    requirements_en: ["Basic knowledge of physics"],
    requirements_de: ["Grundkenntnisse in Physik"],
    benefits: ["Kit de construcción", "Manual técnico", "Certificado"],
    benefits_en: ["Construction kit", "Technical manual", "Certificate"],
    benefits_de: ["Bausatz", "Technisches Handbuch", "Zertifikat"],
    contact: "hidro@energy.es"
  },
  "e33": {
    id: "e33",
    title: "Fiesta de la sostenibilidad",
    title_en: "Sustainability Party",
    title_de: "Nachhaltigkeitsfeier",
    description: "Celebra la sostenibilidad en nuestra gran fiesta de fin de año con música, comida y actividades eco-friendly.",
    description_en: "Celebrate sustainability at our big end-of-year party with music, food and eco-friendly activities.",
    description_de: "Feiere Nachhaltigkeit auf unserer großen Jahresendfeier mit Musik, Essen und umweltfreundlichen Aktivitäten.",
    date: "2025-12-29",
    time: "20:00",
    duration: 5,
    location: "Plaza de la Sostenibilidad, Barcelona",
    location_en: "Sustainability Square, Barcelona",
    location_de: "Nachhaltigkeitsplatz, Barcelona",
    organizer: "Total Sustainability",
    organizer_en: "Total Sustainability",
    organizer_de: "Totale Nachhaltigkeit",
    category: "community",
    maxVolunteers: 150,
    currentVolunteers: 120,
    requirements: ["Entrada gratuita", "Registro previo"],
    requirements_en: ["Free entry", "Prior registration"],
    requirements_de: ["Freier Eintritt", "Vorherige Anmeldung"],
    benefits: ["Acceso VIP", "Degustaciones", "Souvenirs ecológicos"],
    benefits_en: ["VIP access", "Tastings", "Eco-friendly souvenirs"],
    benefits_de: ["VIP-Zugang", "Kostproben", "Umweltfreundliche Souvenirs"],
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
      const key = locale === 'es' ? 'pleaseSignInFirstEs' : locale === 'de' ? 'pleaseSignInFirstDe' : 'pleaseSignInFirstEn';
      alert(t(key));
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
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                  {getCategoryLabel(event.category)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {event.organizer}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {event.title.startsWith('event') && !event.title.includes(' ') ? t(event.title) : event.title}
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
            {saved ? (locale === 'es' ? t('savedEs') : locale === 'de' ? t('savedDe') : t('savedEn')) : (locale === 'es' ? t('saveEs') : locale === 'de' ? t('saveDe') : t('saveEn'))}
          </button>
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
