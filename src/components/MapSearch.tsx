"use client";
import { useMemo, useState } from "react";
import { useI18n, locationLabel } from "@/lib/i18n";
import { COUNTRIES } from "@/lib/countries";

type Project = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
};

type Suggestion =
  | { type: "project"; id: string; label: string; lat: number; lng: number }
  | { type: "city"; label: string }
  | { type: "country"; label: string };

export default function MapSearch({
  allProjects,
  onResults,
}: {
  allProjects: Project[];
  onResults: (projects: Project[]) => void;
}) {
  const { locale } = useI18n();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo<Suggestion[]>(() => {
    const projSugs: Suggestion[] = allProjects.map((p) => ({
      type: "project",
      id: p.id,
      label:
        (locale === "en" && (p as any).name_en) ? (p as any).name_en :
        (locale === "de" && (p as any).name_de) ? (p as any).name_de : p.name,
      lat: p.lat,
      lng: p.lng,
    }));

    const citySet = Array.from(new Set(allProjects.map((p) => p.city).filter(Boolean)));
    const citySugs: Suggestion[] = citySet.map((c) => ({ type: "city", label: locationLabel(c, locale as any) }));

    const countryNames = new Set<string>();
    COUNTRIES.forEach((c) => {
      const n =
        locale === "en" ? c.name_en :
        locale === "de" ? c.name_de :
        locale === "fr" ? (c as any).name_fr :
        locale === "it" ? c.name_it :
        locale === "pl" ? c.name_pl :
        locale === "nl" ? c.name_nl :
        c.name_es || c.name;
      if (n) countryNames.add(n);
    });
    // also include countries present in projects (localized via locationLabel)
    allProjects.forEach((p) => countryNames.add(locationLabel(p.country, locale as any)));
    const countrySugs: Suggestion[] = Array.from(countryNames).map((n) => ({ type: "country", label: n }));

    return [...projSugs, ...citySugs, ...countrySugs];
  }, [allProjects, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Suggestion[];
    return suggestions
      .filter((s) => s.label.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, suggestions]);

  const centerOn = (lat: number, lon: number) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("econexo:center", { detail: { lat, lon } }));
    }
  };

  const onSelect = (s: Suggestion) => {
    setOpen(false);
    setQuery("");
    if (s.type === "project") {
      const p = allProjects.find((x) => x.id === s.id);
      if (!p) return;
      centerOn(p.lat, p.lng);
      onResults([p]);
      return;
    }
    if (s.type === "city") {
      const list = allProjects.filter((p) => locationLabel(p.city, locale as any) === s.label);
      if (list.length) {
        const lat = list.reduce((a, p) => a + p.lat, 0) / list.length;
        const lon = list.reduce((a, p) => a + p.lng, 0) / list.length;
        centerOn(lat, lon);
        onResults(list);
      }
      return;
    }
    if (s.type === "country") {
      const list = allProjects.filter((p) => locationLabel(p.country, locale as any) === s.label);
      if (list.length) {
        const lat = list.reduce((a, p) => a + p.lat, 0) / list.length;
        const lon = list.reduce((a, p) => a + p.lng, 0) / list.length;
        centerOn(lat, lon);
        onResults(list);
      }
      return;
    }
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search projects, cities, countries..."
        className="w-64 md:w-80 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-[6000] mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
          {filtered.map((s, i) => (
            <button
              key={i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(s)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
            >
              <span>{s.type === "project" ? "📌" : s.type === "city" ? "🏙️" : "🏳️"}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


