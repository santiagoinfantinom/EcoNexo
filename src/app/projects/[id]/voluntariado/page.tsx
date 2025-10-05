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

export default function VoluntariadoPage({ params }: { params: Promise<{ id: string }> }) {
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
        <h1 className="text-2xl font-semibold">{t("volunteersPageTitle")}</h1>
        <div className="text-sm text-gray-500">Proyecto: {id}</div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-1">
          <label className="text-sm">{t("name")}</label>
          <input className="border rounded px-3 py-2" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">{t("email")}</label>
          <input type="email" className="border rounded px-3 py-2" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">{t("availability")}</label>
          <input className="border rounded px-3 py-2" value={form.availability} onChange={(e) => update("availability", e.target.value)} placeholder={t("availabilityPh")} required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">{t("notes")}</label>
          <textarea className="border rounded px-3 py-2 min-h-24" value={form.notes ?? ""} onChange={(e) => update("notes", e.target.value)} />
        </div>
        <button className="bg-green-700 text-white rounded px-4 py-2 w-fit">{t("save")}</button>
        {saved && <div className="text-green-700 text-sm">{t("saved")}</div>}
      </form>

      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">{t("localRecords")}</h2>
        {list.length === 0 ? (
          <div className="text-sm text-gray-500">Aún no hay personas registradas.</div>
        ) : (
          <div className="overflow-auto border rounded bg-white text-black">
            <table className="min-w-full text-sm text-gray-900">
              <thead className="bg-gray-50 text-gray-900">
                <tr>
                  <th className="text-left p-2 border-b text-gray-900">Nombre</th>
                  <th className="text-left p-2 border-b text-gray-900">Email</th>
                  <th className="text-left p-2 border-b text-gray-900">Disponibilidad</th>
                  <th className="text-left p-2 border-b text-gray-900">Notas</th>
                </tr>
              </thead>
              <tbody>
                {list.map((v, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border-b text-gray-900">{v.name}</td>
                    <td className="p-2 border-b text-gray-900">{v.email}</td>
                    <td className="p-2 border-b text-gray-900">{v.availability}</td>
                    <td className="p-2 border-b text-gray-900">{v.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Link href={`/projects/${id}`} className="text-green-700 underline w-fit">Volver al proyecto</Link>
    </div>
  );
}


