"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";

type Project = {
  id: string;
  name: string;
  category: string;
  lat: number; lng: number;
  city: string; country: string;
};

export default function AdminProjects() {
  const [list, setList] = useState<Project[]>([]);
  const [form, setForm] = useState<Partial<Project>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured()) return;
      const sb = getSupabase();
      const { data, error } = await sb.from("projects").select("id,name,category,lat,lng,city,country").order("created_at", { ascending: false });
      if (!error && data) setList(data as any);
    })();
  }, []);

  const upsert = async () => {
    setError(null);
    if (!isSupabaseConfigured()) { setError("Supabase no configurado"); return; }
    const sb = getSupabase();
    const row = { ...form, id: form.id?.trim() } as any;
    if (!row.id || !row.name) { setError("id y name son requeridos"); return; }
    const { data, error } = await sb.from("projects").upsert(row).select("*");
    if (error) { setError(error.message); return; }
    setList((prev) => [data![0] as any, ...prev.filter(p => p.id !== row.id)]);
    setForm({});
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin · Projects</h1>
      {!isSupabaseConfigured() && (
        <div className="mb-4 text-sm">Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar el admin.</div>
      )}
      <div className="grid gap-2 mb-6">
        <input placeholder="id" className="border p-2" value={form.id ?? ""} onChange={(e)=>setForm(f=>({...f,id:e.target.value}))} />
        <input placeholder="name" className="border p-2" value={form.name ?? ""} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} />
        <input placeholder="category" className="border p-2" value={form.category ?? ""} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))} />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="lat" className="border p-2" value={form.lat ?? ""} onChange={(e)=>setForm(f=>({...f,lat:Number(e.target.value)}))} />
          <input placeholder="lng" className="border p-2" value={form.lng ?? ""} onChange={(e)=>setForm(f=>({...f,lng:Number(e.target.value)}))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="city" className="border p-2" value={form.city ?? ""} onChange={(e)=>setForm(f=>({...f,city:e.target.value}))} />
          <input placeholder="country" className="border p-2" value={form.country ?? ""} onChange={(e)=>setForm(f=>({...f,country:e.target.value}))} />
        </div>
        <button className="btn-gls-primary w-fit" onClick={upsert}>Guardar</button>
        {error && <div className="text-rose-700">{error}</div>}
      </div>
      <ul className="grid gap-2">
        {list.map((p)=> (
          <li key={p.id} className="border p-3 rounded flex justify-between">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">{p.category} · {p.city}, {p.country}</div>
            </div>
            <a className="text-green-700 underline" href={`/projects/${p.id}`}>ver</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


