"use client";
import React, { useState } from "react";
import { useI18n, categoryLabel } from "@/lib/i18n";

type Category =
  | "Medio ambiente"
  | "Educación"
  | "Salud"
  | "Comunidad"
  | "Océanos"
  | "Alimentación";

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
];

export default function EventosPage() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<EventInput>({
    title: "",
    date: "",
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
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const COLOR_BY_CATEGORY: Record<Category, { bg: string; text: string; border: string }> = {
    "Medio ambiente": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
    "Educación": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    "Salud": { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
    "Comunidad": { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-200" },
    "Océanos": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200" },
    "Alimentación": { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-200" },
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
          city: form.city,
          country: form.country,
          address: form.address,
          website: form.website || undefined,
          image_url: form.image_url || undefined,
          category: form.category,
          optional_categories: form.optionalCategories,
          capacity: form.capacity,
          notes: form.notes,
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
        setForm((f) => ({ ...f, title: "", date: "", city: "", country: "", address: "", website: "", image_url: "", capacity: undefined, notes: "" }));
        return;
      }
      const saved = await res.json();
      setCreated(saved);
      setList((prev) => [saved, ...prev]);
      try {
        const refreshed = await fetch("/api/events").then((r) => r.ok ? r.json() : []);
        setList((prev) => {
          const apiList = Array.isArray(refreshed) ? refreshed : [];
          // Prepend saved if API is empty or doesn't contain it
          const exists = apiList.some((e: any) => e.id && saved.id && e.id === saved.id);
          return exists ? apiList : [saved, ...apiList];
        });
      } catch {}
      // reset parcial
      setForm((f) => ({ ...f, title: "", date: "", city: "", country: "", address: "", website: "", image_url: "", capacity: undefined, notes: "" }));
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
    <div className="grid gap-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-semibold">{t("createEvent")}</h1>
      <form onSubmit={submit} className="grid gap-4 mx-auto text-left max-w-xl">
        <div className="grid gap-1">
          <label className="text-sm text-slate-700 dark:text-slate-300">{t("title")} ({t("required")})</label>
          <input
            required
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder={t("titlePh")}
          />
        </div>
        <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t("date")} ({t("required")})</label>
            <input
              required
              type="date"
              className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t("mainCategory")} ({t("required")})</label>
            <select
              className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
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
        </div>
        <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t("city")} ({t("required")})</label>
            <input
              required
              className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder={t("cityPh")}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t("country")} ({t("required")})</label>
            <input
              required
              className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder={t("countryPh")}
            />
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-slate-700 dark:text-slate-300">{t("address")} ({t("optional")})</label>
          <input
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            value={form.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder={t("addressPh")}
          />
        </div>

        {/* Website URL (optional) */}
        <div className="grid gap-1">
          <label className="text-sm text-slate-700 dark:text-slate-300">Website ({t("optional")})</label>
          <input
            type="url"
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            value={form.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
            placeholder={locale === 'de' ? 'https://beispiel.de' : locale === 'en' ? 'https://example.com' : 'https://ejemplo.com'}
          />
        </div>

        {/* Image URL (optional) */}
        <div className="grid gap-1">
          <label className="text-sm text-slate-700 dark:text-slate-300">{t("image")} URL ({t("optional")})</label>
          <input
            type="url"
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            value={form.image_url ?? ""}
            onChange={(e) => update("image_url", e.target.value)}
            placeholder={locale === 'de' ? 'Bild-URL (optional)' : locale === 'en' ? 'Image URL (optional)' : 'URL de imagen (opcional)'}
          />
        </div>

        {/* JPG Upload (optional) */}
        <div className="grid gap-1">
          <label className="text-sm text-slate-700 dark:text-slate-300">{t("image")} JPG ({t("optional")})</label>
          <input
            type="file"
            accept="image/jpeg"
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
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
          {form.image_url && (
            <div className="mt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{locale === 'de' ? 'Vorschau' : locale === 'en' ? 'Preview' : 'Vista previa'}</div>
              <div className="w-full h-40 overflow-hidden rounded border border-gray-300 dark:border-slate-600">
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
        </div>

        <div className="grid gap-2">
          <div className="text-sm text-slate-700 dark:text-slate-300">{t("optionalCategories")}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleOptional(c)}
                className={`px-3 py-1 rounded-full border ${
                  form.optionalCategories.includes(c)
                    ? "bg-green-700 text-white"
                    : `${COLOR_BY_CATEGORY[c].bg} ${COLOR_BY_CATEGORY[c].text} ${COLOR_BY_CATEGORY[c].border}`
                }`}
              >
                {categoryLabel(c, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t("capacity")} ({t("optional")})</label>
            <input
              type="number"
              min={1}
              className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              value={form.capacity ?? ""}
              onChange={(e) => update("capacity", Number(e.target.value) || undefined)}
              placeholder={t("capacityPh")}
            />
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-slate-700 dark:text-slate-300">{t("notes")} ({t("optional")})</label>
          <textarea
            className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 min-h-24 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            placeholder={t("notesPh")}
          />
        </div>

        <button className="bg-green-700 text-white rounded px-4 py-2 w-fit">
          {t("save")}
        </button>
      </form>

      {created && (
        <div className="border rounded p-4 bg-gray-900 text-white">
          <div className="font-semibold mb-2">{t("createdEvent")}</div>
          <div className="text-sm">
            <span className="font-semibold">{created.title}</span> se realizará el <span className="font-semibold">{created.date}</span> en <span className="font-semibold">{created.city}, {created.country}</span>{created.address ? `, ${created.address}` : ""}.
          </div>
        </div>
      )}

      <div className="grid gap-3">
        <div className="h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent rounded-full" />
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{t("existingEvents")}</h2>
          <button 
            onClick={refreshParticipatedEvents}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            {locale === 'de' ? 'Aktualisieren' : locale === 'en' ? 'Refresh' : 'Actualizar'}
          </button>
        </div>
        <div className="overflow-auto border border-gray-300 dark:border-slate-600 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("title")}</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("date")}</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("city")}</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("country")}</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("category")}</th>
                <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("capacity")}</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500 dark:text-slate-400" colSpan={6}>{t("noParticipatedEvents")}</td>
                </tr>
              ) : (
                list.map((ev, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-800 dark:even:bg-slate-700">
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{ev.title}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{ev.date}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{ev.city}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{ev.country}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{categoryLabel(ev.category as Category, locale)}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{ev.capacity ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


