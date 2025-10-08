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
        <div className="flex gap-4 mt-8 justify-center">
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
