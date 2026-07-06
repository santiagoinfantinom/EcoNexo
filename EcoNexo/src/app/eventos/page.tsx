"use client";
import React, { useState } from "react";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import CalendarView from "@/components/CalendarView";
import { useSmartContext } from "@/context/SmartContext";
import { EVENT_DETAILS } from "@/data/eventDetails";
import {
  Leaf,
  BookOpen,
  Activity,
  Users,
  Waves,
  Apple,
  Cpu,
  Search,
  Calendar,
  Plus,
  MapPin,
  Globe,
  Clock,
  RefreshCw,
  Upload,
  X,
  Eye,
  Trash2
} from "lucide-react";

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

// Helper to get correctly translated field data either from ev object or EVENT_DETAILS
function getLocalizedEventField(ev: any, field: string, locale: string) {
  let valueObj = ev;
  // If the event corresponds to a known ID in EVENT_DETAILS, prioritize that for translation keys.
  if (ev.id && EVENT_DETAILS[ev.id]) {
    valueObj = EVENT_DETAILS[ev.id];
  }

  if (locale === 'en' && valueObj[`${field}_en`]) return valueObj[`${field}_en`];
  if (locale === 'de' && valueObj[`${field}_de`]) return valueObj[`${field}_de`];
  return valueObj[field];
}

// Helper to get appropriately translated City and Country from EVENT_DETAILS overriding existing local storage splits
function getLocalizedCityCountry(ev: any, locale: string) {
  if (ev.id && EVENT_DETAILS[ev.id]) {
    const locString = getLocalizedEventField(ev, 'location', locale);
    if (locString && typeof locString === 'string') {
      const parts = locString.split(',');
      return {
        city: parts[0]?.trim() || ev.city,
        country: parts[1]?.trim() || ev.country
      };
    }
  }
  
  // Fallback to ev properties (possibly already translated)
  return {
    city: getLocalizedEventField(ev, 'city', locale) || ev.city,
    country: getLocalizedEventField(ev, 'country', locale) || ev.country
  };
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

  const deleteEvent = async (eventId?: string) => {
    if (!eventId) return;

    const confirmText = locale === 'es'
      ? "Quieres borrar este evento?"
      : locale === 'de'
        ? "Mochten Sie dieses Ereignis loschen?"
        : "Do you want to delete this event?";

    if (!window.confirm(confirmText)) return;

    try {
      await fetch(`/api/events?id=${encodeURIComponent(eventId)}`, { method: "DELETE" });
    } catch (error) {
      console.warn("Delete API unavailable, removing from local state:", error);
    }

    setList((prev) => prev.filter((ev: any) => ev?.id !== eventId));

    try {
      const saved = JSON.parse(localStorage.getItem('econexo:participatedEvents') || '[]');
      const updated = saved.filter((ev: any) => ev?.id !== eventId);
      localStorage.setItem('econexo:participatedEvents', JSON.stringify(updated));
    } catch {
      // ignore localStorage parsing errors
    }
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
    "Medio ambiente": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    "Educación": { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
    "Salud": { bg: "bg-cta/10", text: "text-cta", border: "border-cta/20" },
    "Comunidad": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    "Océanos": { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
    "Alimentación": { bg: "bg-cta/10", text: "text-cta", border: "border-cta/20" },
    "Tecnología": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  };

  const CATEGORY_ICON: Record<Category, React.ReactNode> = {
    "Medio ambiente": <Leaf size={24} />,
    "Educación": <BookOpen size={24} />,
    "Salud": <Activity size={24} />,
    "Comunidad": <Users size={24} />,
    "Océanos": <Waves size={24} />,
    "Alimentación": <Apple size={24} />,
    "Tecnología": <Cpu size={24} />,
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
    <div className="w-full max-w-5xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 px-3 sm:px-4">
      <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
          {locale === "es" ? "Pipeline de impacto local" : locale === "de" ? "Lokale Impact-Pipeline" : "Local impact pipeline"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-sm font-sans">
          {viewMode === 'form' ? t("createEvent") : t("calendar")}
        </h1>
        <p className="max-w-2xl text-sm text-white/80">
          {locale === "es"
            ? "Planifica, publica y escala eventos con trazabilidad para comunidad, aliados y crecimiento."
            : locale === "de"
              ? "Plane, veröffentliche und skaliere Events mit nachvollziehbarer Wirkung für Community, Partner und Wachstum."
              : "Plan, publish, and scale events with traceable impact for community, partners, and growth."}
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md relative mx-auto group">
          <input
            type="text"
            placeholder={locale === 'es' ? 'Buscar eventos, ciudad o país...' : locale === 'de' ? 'Ereignisse suchen (Titel, Stadt...)' : 'Search events, city or country...'}
            className="w-full px-5 py-3 pl-12 border border-foreground/10 dark:border-white/10 rounded-2xl bg-background/50 backdrop-blur-sm dark:bg-slate-900/50 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base shadow-sm group-hover:shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
        </div>

        {/* Filtros */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-left">
            <label className="block text-xs font-bold text-foreground/60 mb-1 ml-1 uppercase tracking-wider">{t("date")}</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-foreground/10 dark:border-white/10 rounded-xl bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-bold"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="text-left">
            <label className="block text-xs font-bold text-foreground/60 mb-1 ml-1 uppercase tracking-wider">{t("city")}</label>
            <input
              type="text"
              placeholder={t("cityPh")}
              className="w-full px-4 py-2.5 border border-foreground/10 dark:border-white/10 rounded-xl bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-bold placeholder:text-foreground/20"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            />
          </div>
          <div className="text-left">
            <label className="block text-xs font-bold text-foreground/60 mb-1 ml-1 uppercase tracking-wider">{t("category")}</label>
            <select
              className="w-full px-4 py-2.5 border border-foreground/10 dark:border-white/10 rounded-xl bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-bold cursor-pointer"
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
            className="px-6 py-2 bg-cta/10 hover:bg-cta/20 text-cta font-bold rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <X size={16} /> {locale === 'es' ? 'Limpiar filtros' : locale === 'de' ? 'Filter löschen' : 'Clear filters'}
          </button>
        )}

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${viewMode === 'calendar'
              ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
              : 'bg-foreground/5 text-foreground hover:bg-foreground/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
              }`}
          >
            <Calendar size={18} /> {t("calendar")}
          </button>
        </div>
      </div>

      {viewMode === 'form' && (
        <>
          {/* Eventos existentes primero */}
          <div className="grid gap-4 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white font-sans">{t("existingEvents")}</h2>
              <button
                onClick={refreshParticipatedEvents}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={16} /> {t('refresh')}
              </button>
            </div>
            <div className="overflow-hidden border border-white/20 rounded-2xl shadow-xl bg-white/5 backdrop-blur-md dark:bg-slate-800">
              <table className="min-w-full text-sm">
                <thead className="bg-white/10 dark:bg-slate-700/50 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{t("title")}</th>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{t("date")}</th>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{t("city")}</th>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{t("country")}</th>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{t("category")}</th>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{t("capacity")}</th>
                    <th className="text-left p-4 text-white/80 font-bold uppercase tracking-widest text-[10px]">{locale === 'es' ? 'Acciones' : locale === 'de' ? 'Aktionen' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                        <td className="p-4 text-white/70 text-center font-medium" colSpan={7}>
                        {list.length === 0 ? t("noParticipatedEvents") : t("noResultsFound") || "No se encontraron eventos"}
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((ev, idx) => (
                      <tr
                        key={idx}
                        onClick={() => window.location.href = `/eventos/${(ev as any).id}`}
                        className="hover:bg-white/10 cursor-pointer transition-all border-b border-white/10 group"
                      >
                        <td className="p-4 text-white">
                          <div className="flex items-center gap-2 group-hover:text-green-300 transition-colors font-bold font-sans">
                            {getLocalizedEventField(ev, "title", locale)}
                            <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </td>
                        <td className="p-4 text-white">
                          <div className="font-bold flex items-center gap-2">
                            <Calendar size={14} className="text-green-400" />
                            {formatDate(ev.date, locale)}
                          </div>
                          {ev.start_time && (
                            <div className="text-xs text-white/60 font-mono mt-1 flex items-center gap-1">
                              <Clock size={12} /> {ev.start_time}{ev.end_time ? `–${ev.end_time}` : ""}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-white font-mono text-sm">{getLocalizedCityCountry(ev, locale).city}</td>
                        <td className="p-4 text-white font-mono text-sm">{getLocalizedCityCountry(ev, locale).country}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-white/10 text-white border border-white/20`}>
                            {CATEGORY_ICON[ev.category as Category] && React.cloneElement(CATEGORY_ICON[ev.category as Category] as React.ReactElement<any>, { size: 12 })}
                            {categoryLabel(ev.category as Category, locale)}
                          </span>
                        </td>
                        <td className="p-4 text-white font-mono text-sm">{ev.capacity ?? "-"}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteEvent((ev as any).id);
                            }}
                            disabled={!(ev as any).id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-200 border border-red-400/40 hover:bg-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            <Trash2 size={14} />
                            <span className="text-xs font-bold">
                              {locale === 'es' ? 'Borrar' : locale === 'de' ? 'Loschen' : 'Delete'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-foreground/5 dark:bg-white/5 my-12" />

          {/* Formulario de creación después */}
          <h2 className="text-3xl font-bold text-white mb-8 font-sans">{t("createEvent")}</h2>

          <form onSubmit={submit} className="grid gap-4 mx-auto text-left max-w-2xl">
            <div className="grid gap-1">
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("title")} ({t("required")})</label>
              <input
                required
                className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder={t("titlePh")}
              />
            </div>
            <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("date")} ({t("required")})</label>
                <input
                  required
                  type="date"
                  className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("time")} ({t("optional")})</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                    value={form.start_time ?? ""}
                    onChange={(e) => update("start_time", e.target.value)}
                    placeholder="HH:MM"
                  />
                  <input
                    type="time"
                    className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                    value={form.end_time ?? ""}
                    onChange={(e) => update("end_time", e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("mainCategory")} ({t("required")})</label>
                <select
                  className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all cursor-pointer"
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
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("image")} ({t("optional")})</label>
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-background dark:bg-slate-900 hover:bg-foreground/5 dark:hover:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 text-foreground dark:text-white text-sm font-bold transition-all flex items-center justify-center gap-2 flex-1 shadow-sm hover:shadow-md">
                    <Upload size={18} className="text-primary" />
                    {t('uploadImage')}
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
                      className="px-4 border border-cta rounded-2xl text-cta hover:bg-cta hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-cta/20"
                      title="Remove image"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("city")} ({t("required")})</label>
                <input
                  required
                  className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder={t("cityPh")}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("country")} ({t("required")})</label>
                <input
                  required
                  className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder={t("countryPh")}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("address")} ({t("optional")})</label>
              <input
                className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                value={form.address ?? ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder={t("addressPh")}
              />
            </div>

            {/* Website URL (optional) */}
            <div className="grid gap-1">
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("website")} ({t("optional")})</label>
              <input
                type="url"
                className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                value={form.website ?? ""}
                onChange={(e) => update("website", e.target.value)}
                placeholder={t('exampleWebsitePh')}
              />
            </div>

            {form.image_url && (
              <div className="mt-4">
                <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1">
                  <Plus size={10} className="text-secondary" /> {t('previewLabel')}
                </div>
                <div className="w-full h-64 overflow-hidden rounded-3xl border border-foreground/10 dark:border-white/10 shadow-2xl bg-background dark:bg-slate-900 group relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity" />
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-3 mt-4">
              <div className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("optionalCategories")}</div>
              <div className="flex flex-wrap gap-3 justify-center">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleOptional(c)}
                    className={`p-4 rounded-2xl border transition-all duration-300 hover-lift cursor-pointer shadow-sm hover:shadow-md ${form.optionalCategories.includes(c)
                      ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-110"
                      : `${COLOR_BY_CATEGORY[c].bg} ${COLOR_BY_CATEGORY[c].text} ${COLOR_BY_CATEGORY[c].border}`
                      }`}
                  >
                    {CATEGORY_ICON[c]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("capacity")} ({t("optional")})</label>
                <input
                  type="number"
                  min={1}
                  className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                  value={form.capacity ?? ""}
                  onChange={(e) => update("capacity", Number(e.target.value) || undefined)}
                  placeholder={t("capacityPh")}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest ml-1">{t("notes")} ({t("optional")})</label>
              <textarea
                className="border border-foreground/10 dark:border-white/10 rounded-2xl px-5 py-3 min-h-[120px] bg-background dark:bg-slate-900 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-bold transition-all placeholder:text-foreground/20"
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                placeholder={t("notesPh")}
              />
            </div>

            <button className="bg-primary text-white font-bold rounded-2xl px-10 py-4 w-fit transition-all shadow-xl shadow-primary/20 hover-lift cursor-pointer mt-4">
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


