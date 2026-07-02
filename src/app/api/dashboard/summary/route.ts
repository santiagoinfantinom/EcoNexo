import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 15;
const cacheHeaders = {
  'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: volunteers } = await supabase.from('volunteers').select('*');
    const { data: favorites } = await supabase.from('favorites').select('*');
    const { data: reviews } = await supabase.from('reviews').select('*');

    const summary = (projects || []).map((p: any) => {
      const vols = (volunteers || []).filter((v: any) => String(v.project_id) === String(p.id));
      const favs = (favorites || []).filter((f: any) => String(f.item_id) === String(p.id) && f.item_type === 'project');
      const revs = (reviews || []).filter((r: any) => r.reviewable_type === 'project' && String(r.reviewable_id) === String(p.id));

      return {
        id: p.id,
        name: p.name,
        city: p.city,
        category: p.category,
        participants: p.participants || null,
        volunteers_count: vols.length,
        favorites_count: favs.length,
        reviews_count: revs.length,
        reviews_avg: revs.length ? (revs.reduce((s:any,r:any)=>s+(r.rating||0),0)/revs.length) : null,
      };
    });

    return NextResponse.json({ projects: summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
