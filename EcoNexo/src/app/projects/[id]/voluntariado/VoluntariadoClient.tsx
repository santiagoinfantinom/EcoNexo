"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSmartContext } from "@/context/SmartContext";

type Volunteer = {
  name: string;
  email: string;
  availability: string;
  notes?: string;
};

export default function VoluntariadoClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const storageKey = `econexo:volunteers:${id}`;
  const { t, locale } = useI18n();
  const { addPoints } = useSmartContext();
  const [form, setForm] = useState<Volunteer>({ name: "", email: "", availability: "", notes: "" });
  const [list, setList] = useState<Volunteer[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await fetch(`/api/volunteers?project_id=${id}`);
        if (res.ok) {
          const data = await res.json();
          // We combine with local storage if there are any that failed to sync, but Supabase is the primary source.
          // For simplicity and consistency, let's just use what Supabase returns.
          if (data && data.length > 0) {
            setList(data);
            return;
          }
        }

        // Fallback or empty state: check localStorage
        const raw = localStorage.getItem(storageKey);
        if (raw) setList(JSON.parse(raw));
      } catch {
        const raw = localStorage.getItem(storageKey);
        if (raw) setList(JSON.parse(raw));
      }
    };

    fetchVolunteers();
  }, [id, storageKey]);

  function update<K extends keyof Volunteer>(k: K, v: Volunteer[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function saveLocal(next: Volunteer[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch { }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let ok = false;
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          name: form.name,
          email: form.email,
          availability: form.availability,
          notes: form.notes,
        }),
      });
      ok = res.ok;
    } catch { }

    const next = [form, ...list];
    setList(next);
    saveLocal(next);
    setSaved(true);
    setForm({ name: "", email: "", availability: "", notes: "" });

    // Award points for joining a project
    addPoints(20, t("volunteeringPoints") || (locale === 'es' ? 'Unirse a proyecto' : 'Join project'));

    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t("volunteersPageTitle")}</h1>
          <div className="h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 mb-8">
          <form onSubmit={submit} className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">{t("name")}</label>
              <input
                className="border border-white/30 rounded-lg px-4 py-3 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">{t("email")}</label>
              <input
                type="email"
                className="border border-white/30 rounded-lg px-4 py-3 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">{t("availability")}</label>
              <input
                className="border border-white/30 rounded-lg px-4 py-3 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={form.availability}
                onChange={(e) => update("availability", e.target.value)}
                placeholder={t("availabilityPh")}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white">{t("notes")}</label>
              <textarea
                className="border border-white/30 rounded-lg px-4 py-3 min-h-32 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-3 w-full md:w-auto transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform">
              {t("save")}
            </button>

            {saved && <div className="text-green-400 text-sm font-medium text-center md:text-left">✓ {t("saved")}</div>}
          </form>
        </div>

        {/* Records Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">{t("localRecords")}</h2>
          {list.length === 0 ? (
            <div className="text-sm text-white/70 text-center py-8">{t("noVolunteersYet")}</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/20">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-3 border-b border-white/20 text-white font-semibold">{t("name")}</th>
                    <th className="text-left p-3 border-b border-white/20 text-white font-semibold">{t("email")}</th>
                    <th className="text-left p-3 border-b border-white/20 text-white font-semibold">{t("availability")}</th>
                    <th className="text-left p-3 border-b border-white/20 text-white font-semibold">{t("notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((v, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 border-b border-white/10 text-white">{v.name}</td>
                      <td className="p-3 border-b border-white/10 text-white">{v.email}</td>
                      <td className="p-3 border-b border-white/10 text-white">{v.availability}</td>
                      <td className="p-3 border-b border-white/10 text-white/70">{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href={`/projects/${id}`}
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            {t("backToProject")}
          </Link>
        </div>
      </div>
    </div>
  );
}
