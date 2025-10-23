"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

type Volunteer = {
  name: string;
  email: string;
  availability: string;
  notes?: string;
};

export default function VoluntariadoClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const storageKey = `econexo:volunteers:${id}`;
  const { t } = useI18n();
  const [form, setForm] = useState<Volunteer>({ name: "", email: "", availability: "", notes: "" });
  const [list, setList] = useState<Volunteer[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setList(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  function update<K extends keyof Volunteer>(k: K, v: Volunteer[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function saveLocal(next: Volunteer[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
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
    } catch {}

    const next = [form, ...list];
    setList(next);
    saveLocal(next);
    setSaved(true);
    setForm({ name: "", email: "", availability: "", notes: "" });
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="grid gap-6 max-w-2xl">
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("volunteersPageTitle")}</h1>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("name")}</label>
          <input className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("email")}</label>
          <input type="email" className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("availability")}</label>
          <input className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" value={form.availability} onChange={(e) => update("availability", e.target.value)} placeholder={t("availabilityPh")} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("notes")}</label>
          <textarea className="border border-gray-300 dark:border-slate-600 rounded px-3 py-2 min-h-24 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" value={form.notes ?? ""} onChange={(e) => update("notes", e.target.value)} />
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded px-4 py-2 w-fit transition-colors duration-200 shadow-md">{t("save")}</button>
        {saved && <div className="text-green-700 dark:text-green-400 text-sm font-medium">{t("saved")}</div>}
      </form>

      <div className="grid gap-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("localRecords")}</h2>
        {list.length === 0 ? (
          <div className="text-sm text-slate-600 dark:text-slate-400">{t("noVolunteersYet")}</div>
        ) : (
          <div className="overflow-auto border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("name")}</th>
                  <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("email")}</th>
                  <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("availability")}</th>
                  <th className="text-left p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{t("notes")}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((v, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-800 dark:even:bg-slate-700">
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{v.name}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{v.email}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{v.availability}</td>
                    <td className="p-2 border-b border-gray-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">{v.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Link href={`/projects/${id}`} className="text-green-700 dark:text-green-400 underline w-fit font-medium hover:text-green-800 dark:hover:text-green-300 transition-colors">{t("backToProject")}</Link>
    </div>
  );
}
