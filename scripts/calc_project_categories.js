const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TEMPLATES_DIR = path.resolve(__dirname, '../project_templates');

function parseNumberMatch(match) {
  if (!match) return 0;
  const v = match[1];
  if (!v) return 0;
  if (v === 'TODO') return 0;
  const n = parseInt(v.toString().replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseReviewsCount(match) {
  if (!match) return 0;
  const text = match[1];
  if (!text) return 0;
  const m = text.match(/\((\d+) reviews?\)/);
  if (m) return parseInt(m[1], 10);
  return 0;
}

function categorize(totalActivity, thresholds) {
  if (totalActivity >= thresholds.HIGH) return 'HIGH';
  if (totalActivity >= thresholds.MED) return 'MED';
  return 'MIN';
}

async function fetchSupabaseData() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
    const [{ data: projects }, { data: volunteers }, { data: favorites }, { data: reviews }, { data: events }] = await Promise.all([
      supabase.from('projects').select('*'),
      supabase.from('volunteers').select('*'),
      supabase.from('favorites').select('*'),
      supabase.from('reviews').select('*'),
      supabase.from('events').select('*')
    ]).catch(e => { console.warn('Supabase fetch error', e); return [ { data: null }, { data: null }, { data: null }, { data: null }, { data: null } ]; });
    return { projects: projects || [], volunteers: volunteers || [], favorites: favorites || [], reviews: reviews || [], events: events || [] };
  } catch (e) {
    console.warn('Supabase exception:', e.message || e);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const thresholds = { HIGH: 20, MED: 8 };
  // allow override via args: --high 20 --med 8
  args.forEach((a,i) => {
    if (a === '--high' && args[i+1]) thresholds.HIGH = parseInt(args[i+1],10) || thresholds.HIGH;
    if (a === '--med' && args[i+1]) thresholds.MED = parseInt(args[i+1],10) || thresholds.MED;
  });

  console.log('Calculating categories with thresholds:', thresholds);

  const supabaseData = await fetchSupabaseData();

  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));
  const results = [];

  for (const f of files) {
    const p = path.join(TEMPLATES_DIR, f);
    const content = fs.readFileSync(p, 'utf8');
    const title = (content.split('\n')[0] || '').replace(/^#\s*/, '').trim();

    let volunteers_count = 0;
    let favorites_count = 0;
    let events_count = 0;
    let reviews_count = 0;

    // try parse from file
    const volMatch = content.match(/Voluntarios registrados:\s*(\d+|TODO)/i);
    const favMatch = content.match(/Favoritos.*?:\s*(\d+|TODO)/i);
    const evtMatch = content.match(/Eventos asociados.*?:\s*(\d+|TODO)/i);
    const revMatch = content.match(/Valoración media \(reviews?\):?\s*([\d.]+(?: \(\d+ reviews?\))?|TODO)/i) || content.match(/Valoración media.*?:\s*([\d.]+(?: \(\d+ reviews?\))?|TODO)/i);

    volunteers_count = parseNumberMatch(volMatch);
    favorites_count = parseNumberMatch(favMatch);
    events_count = parseNumberMatch(evtMatch);
    reviews_count = parseReviewsCount(revMatch);

    // If supabase available, try to refine counts by matching project name
    if (supabaseData && supabaseData.projects && supabaseData.projects.length) {
      const proj = supabaseData.projects.find(pr => {
        if (!pr) return false;
        const n = (pr.name || '').toString().toLowerCase();
        return n && title.toLowerCase().includes(n.slice(0, Math.min(12, n.length)));
      });
      if (proj) {
        const pid = proj.id;
        const vols = supabaseData.volunteers.filter(v => v.project_id === pid);
        const favs = supabaseData.favorites.filter(fa => fa.item_type === 'project' && fa.item_id === pid);
        const evts = supabaseData.events.filter(e => (e.city === proj.city || (proj.city && e.city && e.city.includes(proj.city))));
        const revs = supabaseData.reviews.filter(r => r.reviewable_type === 'project' && r.reviewable_id === pid);
        volunteers_count = vols.length || volunteers_count;
        favorites_count = favs.length || favorites_count;
        events_count = evts.length || events_count;
        reviews_count = revs.length || reviews_count;
      }
    }

    const totalActivity = (volunteers_count || 0) + (favorites_count || 0) + (events_count || 0) + (reviews_count || 0);
    const category = categorize(totalActivity, thresholds);

    results.push({ file: f, title, volunteers_count, favorites_count, events_count, reviews_count, totalActivity, category });
  }

  // write outputs
  const outJson = path.join(__dirname, '../.project_categories.json');
  fs.writeFileSync(outJson, JSON.stringify(results, null, 2), 'utf8');

  const mdLines = [];
  mdLines.push('# Project Categories');
  mdLines.push('');
  mdLines.push(`Generated: ${new Date().toISOString()}`);
  mdLines.push('');
  mdLines.push('| Project | Category | Total activity | volunteers | favorites | events | reviews |');
  mdLines.push('|---|---:|---:|---:|---:|---:|---:|');
  results.forEach(r => {
    mdLines.push(`| ${r.title} | ${r.category} | ${r.totalActivity} | ${r.volunteers_count} | ${r.favorites_count} | ${r.events_count} | ${r.reviews_count} |`);
  });

  const outMd = path.join(__dirname, '../project_templates/project_categories.md');
  fs.writeFileSync(outMd, mdLines.join('\n'), 'utf8');

  console.log('Wrote', outJson);
  console.log('Wrote', outMd);

  // summary
  const summary = results.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
  console.log('Summary:', summary);
}

main().catch(err => { console.error(err); process.exit(1); });
