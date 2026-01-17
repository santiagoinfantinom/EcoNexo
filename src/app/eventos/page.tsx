"use client";
import React, { useState } from "react";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import CalendarView from "@/components/CalendarView";
import { useSmartContext } from "@/context/SmartContext";

// Función para formatear fechas de manera legible
function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', options);
}

type Category =
  | "Medio ambiente"
  | "Educación"
  | "Salud"
  | "Comunidad"
  | "Océanos"
  | "Alimentación"
  | "Tecnología";

type EventInput = {
  title: string;
  title_en?: string;
  title_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  website?: string;
  date: string;
  start_time?: string; // HH:MM
  end_time?: string;   // HH:MM (opcional)
  city: string;
  country: string;
  address?: string;
  category: Category; // obligatorio
  optionalCategories: Category[]; // opcionales
  capacity?: number; // opcional
  notes?: string; // opcional
};

const CATEGORIES: Category[] = [
  "Medio ambiente",
  "Educación",
  "Salud",
  "Comunidad",
  "Océanos",
  "Alimentación",
  "Tecnología",
];

export default function EventosPage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { addPoints, unlockBadge, gamification } = useSmartContext();
  const [viewMode, setViewMode] = useState<'form' | 'calendar'>('form');
  const [form, setForm] = useState<EventInput>({
    title: "",
    date: "",
    start_time: "",
    end_time: "",
    city: "",
    country: "",
    address: "",
    website: "",
    image_url: "",
    category: "Medio ambiente",
    optionalCategories: [],
    capacity: undefined,
    notes: "",
  });
  const [created, setCreated] = useState<EventInput | null>(null);
  const [list, setList] = useState<EventInput[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "">("");

  const filteredList = list.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !filterDate || event.date === filterDate;
    const matchesCity = !filterCity || event.city.toLowerCase().includes(filterCity.toLowerCase());
    const matchesCategory = !filterCategory || event.category === filterCategory;
    return matchesSearch && matchesDate && matchesCity && matchesCategory;
  });
  // Load participated events from localStorage
  React.useEffect(() => {
    const participatedEvents = JSON.parse(localStorage.getItem('econexo:participatedEvents') || '[]');
    setList(participatedEvents);
  }, []);

  // Function to refresh the participated events list
  const refreshParticipatedEvents = () => {
    const participatedEvents = JSON.parse(localStorage.getItem('econexo:participatedEvents') || '[]');
    setList(participatedEvents);
  };

  // Listen for storage changes to update the list when events are added from other tabs
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'econexo:participatedEvents') {
        refreshParticipatedEvents();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event when event is added from same tab
    const handleParticipatedEventAdded = () => {
      refreshParticipatedEvents();
    };
    window.addEventListener('econexo:participatedEventAdded', handleParticipatedEventAdded);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('econexo:participatedEventAdded', handleParticipatedEventAdded);
    };
  }, []);
  const COLOR_BY_CATEGORY: Record<Category, { bg: string; text: string; border: string }> = {
    "Medio ambiente": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
    "Educación": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    "Salud": { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
    "Comunidad": { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-200" },
    "Océanos": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200" },
    "Alimentación": { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-200" },
    "Tecnología": { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200" },
  };

  const CATEGORY_EMOJI: Record<Category, string> = {
    "Medio ambiente": "🌍",
    "Educación": "📚",
    "Salud": "🏥",
    "Comunidad": "👥",
    "Océanos": "🌊",
    "Alimentación": "🍎",
    "Tecnología": "💻",
  };

  function update<K extends keyof EventInput>(key: K, value: EventInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleOptional(cat: Category) {
    update(
      "optionalCategories",
      form.optionalCategories.includes(cat)
        ? form.optionalCategories.filter((c) => c !== cat)
        : [...form.optionalCategories, cat]
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          start_time: form.start_time || null,
          end_time: form.end_time || null,
          city: form.city,
          country: form.country,
          address: form.address,
          website: form.website || undefined,
          image_url: form.image_url || undefined,
          category: form.category,
          optional_categories: form.optionalCategories,
          capacity: form.capacity,
          notes: form.notes,
          created_by: user?.id, // Add the creator's user ID
        }),
      });
      if (!res.ok) {
        console.warn("API not available, using mock data");
        const mockEvent = {
          id: `mock_${Date.now()}`,
          ...form,
          created_at: new Date().toISOString()
        };
        setCreated(mockEvent);
        setList((prev) => [mockEvent, ...prev]);
        setForm((f) => ({ ...f, title: "", date: "", start_time: "", end_time: "", city: "", country: "", address: "", website: "", image_url: "", capacity: undefined, notes: "" }));
        return;
      }
      const saved = await res.json();
      setCreated(saved);
      setList((prev) => [saved, ...prev]);

      // Award points for creating an event
      addPoints(100, 'Crear evento');
      if (!gamification.badges.includes('event_creator')) {
        unlockBadge('event_creator');
        addPoints(150, 'Insignia: Organizador de Eventos');
      }

      try {
        const refreshed = await fetch("/api/events").then((r) => r.ok ? r.json() : []);
        setList((prev) => {
          const apiList = Array.isArray(refreshed) ? refreshed : [];
          // Prepend saved if API is empty or doesn't contain it
          const exists = apiList.some((e: any) => e.id && saved.id && e.id === saved.id);
          return exists ? apiList : [saved, ...apiList];
        });
      } catch { }
      // reset parcial
      setForm((f) => ({ ...f, title: "", date: "", start_time: "", end_time: "", city: "", country: "", address: "", website: "", image_url: "", capacity: undefined, notes: "" }));
    } catch (err) {
      console.error(err);
      setCreated(form); // fallback en memoria
    }
  }

  // cargar eventos existentes al montar
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          console.warn("API not available, using empty list");
          setList([]);
          return;
        }
        const data = await res.json();
        setList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.warn("Failed to load events:", error);
        setList([]);
      }
    })();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 px-3 sm:px-4">
      <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white capitalize">
          {viewMode === 'form' ? t("createEvent") : t("calendar")}
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-md relative mx-auto">
          <input
            type="text"
            placeholder="Buscar eventos, ciudad o país..."
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-base min-h-[44px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filtros */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-white mb-1">{t("date")}</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white mb-1">{t("city")}</label>
            <input
              type="text"
              placeholder={t("cityPh")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white mb-1">{t("category")}</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category | "")}
            >
              <option value="">{locale === 'es' ? 'Todas' : locale === 'de' ? 'Alle' : 'All'}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {(filterDate || filterCity || filterCategory) && (
          <button
            onClick={() => {
              setFilterDate("");
              setFilterCity("");
              setFilterCategory("");
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            {locale === 'es' ? 'Limpiar filtros' : locale === 'de' ? 'Filter löschen' : 'Clear filters'}
          </button>
        )}

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize min-h-[44px] ${viewMode === 'calendar'
              ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
              : 'bg-white/20 text-white hover:bg-white/30'
              }`}
          >
            {t("calendar")}
          </button>
        </div>
      </div>

      {viewMode === 'form' && (
        <>
          {/* Eventos existentes primero */}
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{t("existingEvents")}</h2>
              <button
                onClick={refreshParticipatedEvents}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-sm transition-colors duration-200 shadow-sm"
              >
                {t('refresh')}
              </button>
            </div>
            <div className="overflow-auto border border-gray-600 rounded table-mobile-scroll">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="text-left p-2 border-b border-gray-600 text-white">{t("title")}</th>
                    <th className="text-left p-2 border-b border-gray-600 text-white">{t("date")}</th>
                    <th className="text-left p-2 border-b border-gray-600 text-white">{t("city")}</th>
                    <th className="text-left p-2 border-b border-gray-600 text-white">{t("country")}</th>
                    <th className="text-left p-2 border-b border-gray-600 text-white">{t("category")}</th>
                    <th className="text-left p-2 border-b border-gray-600 text-white">{t("capacity")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td className="p-3 text-slate-400" colSpan={6}>
                        {list.length === 0 ? t("noParticipatedEvents") : t("noResultsFound") || "No se encontraron eventos"}
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((ev, idx) => (
                      <tr
                        key={idx}
                        onClick={() => window.location.href = `/eventos/${(ev as any).id}`}
                        className="bg-slate-800 odd:bg-slate-800 even:bg-slate-700 hover:bg-slate-600 cursor-pointer transition-colors"
                      >
                        <td className="p-2 border-b border-gray-600 text-white">
                          <a
                            href={`/eventos/${(ev as any).id}`}
                            className="text-green-400 hover:text-green-300 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ev.title}
                          </a>
                        </td>
                        <td className="p-2 border-b border-gray-600 text-white">
                          <div className="font-medium">{formatDate(ev.date, locale)}</div>
                          {ev.start_time && (
                            <div className="text-xs text-slate-400">{ev.start_time}{ev.end_time ? `–${ev.end_time}` : ""}</div>
                          )}
                        </td>
                        <td className="p-2 border-b border-gray-600 text-white">{ev.city}</td>
                        <td className="p-2 border-b border-gray-600 text-white">{ev.country}</td>
                        <td className="p-2 border-b border-gray-600 text-white">{categoryLabel(ev.category as Category, locale)}</td>
                        <td className="p-2 border-b border-gray-600 text-white">{ev.capacity ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Separador */}
          <div className="h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent rounded-full my-6" />

          {/* Formulario de creación después */}
          <h2 className="text-2xl font-bold text-white mb-4">{t("createEvent")}</h2>

          <form onSubmit={submit} className="grid gap-4 mx-auto text-left max-w-2xl">
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-white">{t("title")} ({t("required")})</label>
              <input
                required
                className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white placeholder-slate-400"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder={t("titlePh")}
              />
            </div>
            <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("date")} ({t("required")})</label>
                <input
                  required
                  type="date"
                  className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("time")} ({t("optional")})</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white"
                    value={form.start_time ?? ""}
                    onChange={(e) => update("start_time", e.target.value)}
                    placeholder="HH:MM"
                  />
                  <input
                    type="time"
                    className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white"
                    value={form.end_time ?? ""}
                    onChange={(e) => update("end_time", e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("mainCategory")} ({t("required")})</label>
                <select
                  className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value as Category)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(c, locale)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("image")} ({t("optional")})</label>
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-gray-600 rounded px-3 py-2 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 flex-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {locale === 'es' ? 'Subir Imagen' : locale === 'de' ? 'Bild hochladen' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = typeof reader.result === 'string' ? reader.result : '';
                          update('image_url', result);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => update('image_url', '')}
                      className="px-2 border border-red-500 rounded text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("city")} ({t("required")})</label>
                <input
                  required
                  className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white placeholder-slate-400"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder={t("cityPh")}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("country")} ({t("required")})</label>
                <input
                  required
                  className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white placeholder-slate-400"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder={t("countryPh")}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-semibold text-white">{t("address")} ({t("optional")})</label>
              <input
                className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white placeholder-slate-400"
                value={form.address ?? ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder={t("addressPh")}
              />
            </div>

            {/* Website URL (optional) */}
            <div className="grid gap-1">
              <label className="text-sm font-semibold text-white">{t("website")} ({t("optional")})</label>
              <input
                type="url"
                className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white placeholder-slate-400"
                value={form.website ?? ""}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>

            {form.image_url && (
              <div className="mt-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('previewLabel')}</div>
                <div className="w-full h-48 overflow-hidden rounded-xl border border-gray-600 shadow-inner bg-slate-800">
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    decoding="async"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <div className="text-sm font-semibold text-white">{t("optionalCategories")}</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleOptional(c)}
                    className={`px-3 py-1 rounded-full border font-medium transition-colors duration-200 ${form.optionalCategories.includes(c)
                      ? "bg-green-700 text-white shadow-md"
                      : `${COLOR_BY_CATEGORY[c].bg} ${COLOR_BY_CATEGORY[c].text} ${COLOR_BY_CATEGORY[c].border} hover:shadow-sm`
                      }`}
                  >
                    <span className="text-xl">{CATEGORY_EMOJI[c]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-white">{t("capacity")} ({t("optional")})</label>
                <input
                  type="number"
                  min={1}
                  className="border border-gray-600 rounded px-3 py-2 bg-slate-700 text-white placeholder-slate-400"
                  value={form.capacity ?? ""}
                  onChange={(e) => update("capacity", Number(e.target.value) || undefined)}
                  placeholder={t("capacityPh")}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-semibold text-white">{t("notes")} ({t("optional")})</label>
              <textarea
                className="border border-gray-600 rounded px-3 py-2 min-h-24 bg-slate-700 text-white placeholder-slate-400"
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                placeholder={t("notesPh")}
              />
            </div>

            <button className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded px-4 py-2 w-fit transition-colors duration-200 shadow-md">
              {t("save")}
            </button>
          </form>

          {created && (
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 shadow-md mt-4">
              <div className="font-bold mb-2 text-lg">{t("createdEvent")}</div>
              <div className="text-sm">
                <span className="font-semibold">{created.title}</span> {t('eventCreatedMessage')} <span className="font-semibold">{created.date}</span>{created.start_time ? ` ${t('time')}: ${created.start_time}${created.end_time ? `–${created.end_time}` : ""}` : ""} en <span className="font-semibold">{created.city}, {created.country}</span>{created.address ? `, ${created.address}` : ""}.
              </div>
            </div>
          )}
        </>
      )}

      {viewMode === 'calendar' && (
        <div className="max-w-6xl mx-auto">
          <CalendarView
            projects={[]}
            onProjectSelect={() => { }}
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setViewMode('form')}
              className="px-6 py-3 rounded-lg text-sm font-medium transition-all capitalize bg-green-600 text-white shadow-md hover:bg-green-700"
            >
              {t("createEvent")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


