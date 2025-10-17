"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";

type SavedItem = { type: 'project' | 'event'; id: string };

export default function SavedPage() {
  const { user } = useAuth();
  const [saved, setSaved] = React.useState<SavedItem[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'project' | 'event'>('all');

  React.useEffect(() => {
    const load = async () => {
      // Load guest saved
      let local: SavedItem[] = [];
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        local = raw ? JSON.parse(raw) : [];
      } catch {}

      // If no auth or no supabase config, show local
      if (!user || !isSupabaseConfigured()) {
        setSaved(local);
        return;
      }

      const supabase = getSupabase();

      // Reconcile guest -> DB once
      try {
        if (local.length) {
          const toInsert = local.map((i) => ({ user_id: user.id, item_type: i.type, item_id: i.id }));
          await supabase.from('favorites').upsert(toInsert as any, { onConflict: 'user_id,item_type,item_id' } as any);
          if (typeof window !== 'undefined') localStorage.removeItem('econexo:saved');
        }
      } catch {}

      // Load from DB
      const { data } = await supabase
        .from('favorites')
        .select('item_type,item_id')
        .eq('user_id', user.id);
      const fromDb: SavedItem[] = (data || []).map((row: any) => ({ type: row.item_type, id: String(row.item_id) }));
      setSaved(fromDb);
    };
    load();
  }, [user]);

  const filtered = saved.filter((i) => filter === 'all' ? true : i.type === filter);

  return (
    <div className="min-h-screen bg-modern">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Guardados</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all'?'bg-slate-900 text-white':'border text-slate-700 dark:text-slate-300'}`}>Todos</button>
          <button onClick={() => setFilter('project')} className={`px-3 py-1 rounded ${filter==='project'?'bg-slate-900 text-white':'border text-slate-700 dark:text-slate-300'}`}>Proyectos</button>
          <button onClick={() => setFilter('event')} className={`px-3 py-1 rounded ${filter==='event'?'bg-slate-900 text-white':'border text-slate-700 dark:text-slate-300'}`}>Eventos</button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-slate-600 dark:text-slate-400">No tienes elementos guardados.</div>
        ) : (
          <ul className="grid gap-3">
            {filtered.map((item, idx) => (
              <li key={idx} className="border rounded-lg p-4 bg-white dark:bg-slate-800 flex items-center justify-between">
                <div className="text-slate-800 dark:text-slate-100">{item.type === 'project' ? 'Proyecto' : 'Evento'} · {item.id}</div>
                <Link href={item.type === 'project' ? `/projects/${item.id}` : `/eventos/${item.id}`} className="text-green-700 font-semibold">Ver</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


