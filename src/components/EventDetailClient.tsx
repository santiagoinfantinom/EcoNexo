"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventDetails = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  organizer: string;
  category: string;
  maxVolunteers: number;
  currentVolunteers: number;
  requirements: string[];
  benefits: string[];
  contact: string;
};

// Mock event details - in a real app, this would come from an API
const EVENT_DETAILS: Record<string, EventDetails> = {
  "e1": {
    id: "e1",
    title: "Plantación de árboles nativos",
    description: "Únete a nuestra plantación comunitaria de especies nativas para restaurar el ecosistema local. Aprenderás sobre las especies autóctonas y su importancia para la biodiversidad urbana.",
    date: "2024-12-02",
    time: "09:00",
    duration: 3,
    location: "Bosque Urbano Norte, Berlín",
    organizer: "Green City Initiative",
    category: "environment",
    maxVolunteers: 30,
    currentVolunteers: 12,
    requirements: ["Ropa cómoda", "Botas de trabajo", "Guantes", "Agua"],
    benefits: ["Certificado de participación", "Almuerzo incluido", "Material educativo"],
    contact: "info@greencity.org"
  },
  "e2": {
    id: "e2",
    title: "Taller de energía solar",
    description: "Aprende sobre instalación y beneficios de paneles solares residenciales. Incluye demostración práctica y cálculo de ahorro energético.",
    date: "2024-12-04",
    time: "14:00",
    duration: 3,
    location: "Centro de Innovación Verde, Madrid",
    organizer: "SolarTech Academy",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Cuaderno", "Calculadora", "Ropa cómoda"],
    benefits: ["Certificado de capacitación", "Manual técnico", "Coffee break"],
    contact: "training@solartech.edu"
  },
  "e3": {
    id: "e3",
    title: "Mercado de productos locales",
    description: "Feria de productos orgánicos y artesanías locales sostenibles. Conoce productores locales y sus prácticas ecológicas.",
    date: "2024-12-06",
    time: "10:00",
    duration: 6,
    location: "Plaza del Mercado, Barcelona",
    organizer: "Asociación de Productores Locales",
    category: "community",
    maxVolunteers: 40,
    currentVolunteers: 25,
    requirements: ["Dinero para compras", "Bolsa reutilizable"],
    benefits: ["Descuentos especiales", "Degustaciones gratuitas", "Red de contactos"],
    contact: "mercado@productoreslocales.es"
  },
  "e4": {
    id: "e4",
    title: "Limpieza de río",
    description: "Participa en la limpieza del río Verde para mejorar la calidad del agua y proteger la vida acuática. Incluye clasificación de residuos y educación ambiental.",
    date: "2025-02-14",
    time: "08:00",
    duration: 3,
    location: "Río Verde, Milán",
    organizer: "River Guardians",
    category: "environment",
    maxVolunteers: 25,
    currentVolunteers: 18,
    requirements: ["Guantes de trabajo", "Ropa cómoda", "Botas impermeables"],
    benefits: ["Certificado de participación", "Refrigerio", "Material educativo"],
    contact: "rio@guardianes.es"
  },
  "e5": {
    id: "e5",
    title: "Conferencia sobre cambio climático",
    description: "Asiste a esta conferencia informativa sobre los efectos del cambio climático y las acciones que podemos tomar para mitigarlo.",
    date: "2025-03-05",
    time: "18:00",
    duration: 2,
    location: "Auditorio Municipal, París",
    organizer: "Local Climate Institute",
    category: "education",
    maxVolunteers: 200,
    currentVolunteers: 150,
    requirements: ["Registro previo", "Documento de identidad"],
    benefits: ["Certificado de asistencia", "Material informativo", "Networking"],
    contact: "clima@instituto.es"
  },
  "e6": {
    id: "e6",
    title: "Construcción de jardines verticales",
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
    title: "Carrera ecológica 5K",
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
    title: "Instalación de paneles solares",
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
    title: "Reflexión semestral ambiental",
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
    title: "Celebración de verano sostenible",
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
    title: "Plantación de otoño",
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
  "e16": {
    id: "e16",
    title: "Taller de conservación de alimentos",
    description: "Aprende técnicas tradicionales y modernas para conservar alimentos y reducir el desperdicio.",
    date: "2025-10-12",
    time: "14:00",
    duration: 3,
    location: "Centro Culinario Verde, Milán",
    organizer: "Sustainable Kitchen",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Delantal", "Cuaderno", "Contenedores"],
    benefits: ["Alimentos conservados", "Recetas", "Certificado"],
    contact: "conservacion@sustainable.es"
  },
  "e16b": {
    id: "e16b",
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
  "e17": {
    id: "e17",
    title: "Limpieza de bosque otoñal",
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
    description: "Aprende a crear y mantener un huerto urbano en espacios pequeños para cultivar tus propios alimentos.",
    date: "2025-10-15",
    time: "16:00",
    duration: 3,
    location: "Jardín Comunitario, Londres",
    organizer: "Urban Gardens",
    category: "education",
    maxVolunteers: 20,
    currentVolunteers: 15,
    requirements: ["Ropa cómoda", "Cuaderno", "Semillas"],
    benefits: ["Kit de semillas", "Manual", "Seguimiento"],
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
    title: "Construcción de refugios para aves",
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
    title: "Taller de energía eólica",
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
    title: "Feria de productos orgánicos",
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
    title: "Restauración de humedales",
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
    title: "Construcción de jardines comunitarios",
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
    title: "Mercado navideño sostenible",
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
    title: "Reforestación de invierno",
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
    title: "Seminario de cambio climático",
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
    title: "Celebración de fin de año ecológica",
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
    title: "Conservación de especies marinas",
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
    title: "Taller de energía hidroeléctrica",
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

export default function EventDetailClient({ eventId }: { eventId: string }) {
  const { t, locale } = useI18n();
  
  const event = EVENT_DETAILS[eventId];
  
  if (!event) {
    notFound();
  }

  const progressPercentage = (event.currentVolunteers / event.maxVolunteers) * 100;
  const spotsLeft = event.maxVolunteers - event.currentVolunteers;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "environment": return "bg-green-100 text-green-800";
      case "education": return "bg-blue-100 text-blue-800";
      case "community": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "environment": return t("environment");
      case "education": return t("education");
      case "community": return t("community");
      default: return category;
    }
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
                {event.title}
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
              {event.requirements.map((req, index) => (
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
              {event.benefits.map((benefit, index) => (
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
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            disabled={spotsLeft === 0}
          >
            {spotsLeft > 0 ? t("joinEvent") : t("fullyBooked")}
          </button>
          <button className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {t("shareEvent")}
          </button>
        </div>
      </div>
    </div>
  );
}
