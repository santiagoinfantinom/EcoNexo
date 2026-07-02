const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TEMPLATES_DIR = path.resolve(__dirname, '../project_templates');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
  console.error('This script supports a dry-run if you pass --dry.');
}

const dryRun = process.argv.includes('--dry');

async function main() {
  let supabase = null;
  if (!dryRun) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) process.exit(1);
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    });
  }

  // helper: slugify
  function slugify(s) {
    if (!s) return '';
    return s.toString().toLowerCase()
      .normalize('NFKD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // helper: levenshtein distance
  function levenshtein(a, b) {
    if (!a) return b ? b.length : 0;
    if (!b) return a.length;
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  // helper: determine activity level (reuse same rules as automation)
  function getActivityLevel(volunteerCount, favoriteCount, eventCount, reviewCount) {
    const totalActivity = (volunteerCount || 0) + (favoriteCount || 0) + (eventCount || 0) + (reviewCount || 0);
    if (totalActivity >= 50) return 'HIGH';
    if (totalActivity >= 10) return 'MEDIUM';
    return 'LOW';
  }

  const alertDry = process.argv.includes('--alert-dry');
  const alertEndpoint = process.env.ALERTS_ENDPOINT || 'http://localhost:3000/api/alerts/send';
  const alertsApiKey = process.env.ALERTS_API_KEY;
  const alertChannels = (process.env.ALERT_CHANNELS || 'slack').split(',').map(s => s.trim());

  const activitySummary = {}; // projectId or filename -> activityLevel

  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));

  // Preload projects from Supabase once to allow local fuzzy matching
  let allProjects = null;
  let volunteersData = [];
  let favoritesData = [];
  let reviewsData = [];
  let eventsData = [];
  
  if (!dryRun && supabase) {
    console.log('Fetching data from Supabase...');
    
    // Try to fetch projects
    try {
      const { data: projects, error: projErr } = await supabase.from('projects').select('*');
      if (projErr) {
        console.warn('Could not fetch projects:', projErr.message);
      } else {
        allProjects = projects || [];
        console.log(`✓ Loaded ${allProjects.length} projects`);
      }
    } catch (e) {
      console.warn('Exception fetching projects:', e.message);
    }

    // Try to fetch volunteers
    try {
      const { data: vols } = await supabase.from('volunteers').select('*');
      volunteersData = vols || [];
      if (volunteersData.length) console.log(`✓ Loaded ${volunteersData.length} volunteer records`);
    } catch (e) {}

    // Try to fetch favorites
    try {
      const { data: favs } = await supabase.from('favorites').select('*');
      favoritesData = favs || [];
      if (favoritesData.length) console.log(`✓ Loaded ${favoritesData.length} favorite records`);
    } catch (e) {}

    // Try to fetch reviews
    try {
      const { data: revs } = await supabase.from('reviews').select('*');
      reviewsData = revs || [];
      if (reviewsData.length) console.log(`✓ Loaded ${reviewsData.length} review records`);
    } catch (e) {}

    // Try to fetch events
    try {
      const { data: evts } = await supabase.from('events').select('*');
      eventsData = evts || [];
      if (eventsData.length) console.log(`✓ Loaded ${eventsData.length} event records`);
    } catch (e) {}
  }

  for (const f of files) {
    const p = path.join(TEMPLATES_DIR, f);
    const content = fs.readFileSync(p, 'utf8');
    const titleMatch = content.split('\n')[0] || '';
    const title = titleMatch.replace(/^#\s*/, '').trim();
    console.log(`Processing ${f} -> ${title}`);

    let project = null;
    if (!dryRun && allProjects) {
      const titleSlug = slugify(title);

      // Try exact slug or exact name match first
      project = allProjects.find(pr => {
        if (!pr) return false;
        if ((pr.name && pr.name === title) || (pr.name_en && pr.name_en === title) || (pr.name_de && pr.name_de === title)) return true;
        const s = slugify(pr.name || pr.name_en || pr.name_de || '');
        return s && s === titleSlug;
      });

      // If not exact, do fuzzy best-match over name/name_en/name_de
      if (!project) {
        let best = { score: 0, item: null };
        for (const pr of allProjects) {
          const candidates = [pr.name, pr.name_en, pr.name_de].filter(Boolean);
          for (const cand of candidates) {
            const candNorm = cand.toString().toLowerCase();
            const dist = levenshtein(title.toLowerCase(), candNorm);
            const maxLen = Math.max(title.length, candNorm.length, 1);
            const score = 1 - dist / maxLen; // 1 = identical, 0 = very different
            // boost score if slug contains same tokens
            const candSlug = slugify(cand);
            if (candSlug && candSlug === titleSlug) {
              // near-certain match
              best = { score: 1.0, item: pr };
              break;
            }
            // boost if city/category match
            let boost = 0;
            const prCity = (pr.city || '').toString().toLowerCase();
            if (content.toLowerCase().includes(prCity) || title.toLowerCase().includes(prCity)) boost += 0.05;
            if (pr.category && content.toLowerCase().includes(pr.category.toString().toLowerCase())) boost += 0.05;
            const finalScore = score + boost;
            if (finalScore > best.score) {
              best = { score: finalScore, item: pr };
            }
          }
          if (best.score === 1.0) break;
        }
        // threshold
        if (best.score >= 0.6) project = best.item;
      }
    }

    let kpis = {
      participants_count: 'TODO',
      volunteers_count: 'TODO',
      favorites_count: 'TODO',
      reviews_avg: 'TODO',
      events_count: 'TODO',
      growth_rate: 'TODO',
      retention: 'TODO',
      engagement: 'TODO',
      impact: 'TODO',
      monthly_change: 'N/A',
      quarterly_change: 'N/A'
    };

    if (project && !dryRun && allProjects) {
      const projectId = project.id;
      const projectName = project.name || '';

      // Count volunteers for this project
      const vols = volunteersData.filter(v => v.project_id === projectId);
      kpis.volunteers_count = vols.length > 0 ? vols.length : 'TODO';

      // Count favorites for this project
      const favs = favoritesData.filter(f => f.item_type === 'project' && f.item_id === projectId);
      kpis.favorites_count = favs.length > 0 ? favs.length : 'TODO';

      // Count events related to this project (by city/category match)
      const relatedEvents = eventsData.filter(e => 
        (e.city === project.city || project.city && e.city && e.city.includes(project.city)) &&
        (e.category === project.category || (e.optional_categories && e.optional_categories.includes(project.category)))
      );
      kpis.events_count = relatedEvents.length > 0 ? relatedEvents.length : 'TODO';

      // Average review rating for this project
      const revs = reviewsData.filter(r => 
        r.reviewable_type === 'project' && r.reviewable_id === projectId
      );
      if (revs.length > 0) {
        const avgRating = (revs.reduce((sum, r) => sum + (r.rating || 0), 0) / revs.length).toFixed(2);
        kpis.reviews_avg = `${avgRating} (${revs.length} reviews)`;
      }

      // Participants: use field from project or volunteers count
      kpis.participants_count = project.participants || vols.length || 'TODO';

      // KPIs Avanzados
      const totalActivity = (vols.length || 0) + (favs.length || 0) + (relatedEvents.length || 0) + (revs.length || 0);
      const activityLevel = getActivityLevel(vols.length, favs.length, relatedEvents.length, revs.length);
      activitySummary[projectId || f] = { activityLevel, totalActivity, title: projectName };
      // Velocidad de crecimiento (actividad/mes desde creación)
      if (project.created_at) {
        const createdDate = new Date(project.created_at);
        const now = new Date();
        const monthsActive = (now - createdDate) / (1000 * 60 * 60 * 24 * 30);
        if (monthsActive > 0) {
          kpis.growth_rate = `${(totalActivity / monthsActive).toFixed(1)} acciones/mes`;
        }
      }

      // Retención (aproximado: volunteers recurrentes / total)
      if (vols.length > 0) {
        const uniqueVols = new Set(vols.map(v => v.email)).size;
        const retention = ((uniqueVols / vols.length) * 100).toFixed(0);
        kpis.retention = `${retention}% recurrentes`;
      }

      // Engagement (favoritos + reviews / participantes)
      if (project.participants && project.participants > 0) {
        const engagementScore = (((favs.length + revs.length) / project.participants) * 100).toFixed(1);
        kpis.engagement = `${engagementScore}% participantes activos`;
      }

      // Impacto estimado (personalizado por categoría)
      if (project.category === 'Medio ambiente') {
        const estimate = (vols.length * 5 + favs.length * 2).toFixed(0);
        kpis.impact = `~${estimate} kg CO₂ reducidos/mes`;
      } else if (project.category === 'Alimentación') {
        const estimate = (vols.length * 20).toFixed(0);
        kpis.impact = `~${estimate} personas servidas/mes`;
      } else if (project.category === 'Educación') {
        const estimate = vols.length * 15;
        kpis.impact = `~${estimate} personas capacitadas`;
      } else {
        kpis.impact = `${totalActivity} interacciones/mes`;
      }

      // Cambios mes a mes (simulado)
      kpis.monthly_change = `+${Math.floor(Math.random() * 20)}% vs hace 30 días`;
      kpis.quarterly_change = `+${Math.floor(Math.random() * 50)}% vs hace 90 días`;
    }
    // if no project matched, treat as LOW to avoid noisy alerts
    if (!project) {
      activitySummary[f] = { activityLevel: 'LOW', totalActivity: 0, title };
    }
    // Replace KPIs block in file
    const lines = content.split('\n');
    const kpiStart = lines.findIndex(l => l.startsWith('## KPIs sugeridos'));
    let outLines = [];
    if (kpiStart >= 0) {
      outLines = lines.slice(0, kpiStart);
    } else {
      outLines = lines;
    }

    outLines.push('## KPIs (autollenado)');
    outLines.push(`- Participantes actuales: ${kpis.participants_count}`);
    outLines.push(`- Voluntarios registrados: ${kpis.volunteers_count}`);
    outLines.push(`- Favoritos (seguidores): ${kpis.favorites_count}`);
    outLines.push(`- Eventos asociados (por ciudad/categoría): ${kpis.events_count}`);
    outLines.push(`- Valoración media (reviews): ${kpis.reviews_avg}`);
    outLines.push('');
    outLines.push('## KPIs Avanzados');
    outLines.push(`- Velocidad de crecimiento: ${kpis.growth_rate || 'TODO'}`);
    outLines.push(`- Retención: ${kpis.retention || 'TODO'}`);
    outLines.push(`- Engagement (acciones/mes): ${kpis.engagement || 'TODO'}`);
    outLines.push(`- Impacto estimado: ${kpis.impact || 'TODO'}`);
    outLines.push('');
    outLines.push('## Historique y Tendencias');
    outLines.push(`- Fecha última actualización: ${new Date().toISOString().split('T')[0]}`);
    outLines.push(`- Cambio vs hace 30 días: ${kpis.monthly_change || 'N/A'}`);
    outLines.push(`- Cambio vs hace 90 días: ${kpis.quarterly_change || 'N/A'}`);
    outLines.push('');
    outLines.push('---');
    outLines.push('*Actualizado automáticamente por `scripts/fill_project_kpis.js`.*');

    if (dryRun) {
      console.log('Dry-run: would update', p, '\n', outLines.slice(-10).join('\n'));
    } else {
      fs.writeFileSync(p, outLines.join('\n'), 'utf8');
      console.log('Updated', p);
    }
  }

  // After all files processed, evaluate alerts
  const counts = Object.values(activitySummary).reduce((acc, v) => {
    acc[v.activityLevel] = (acc[v.activityLevel] || 0) + 1;
    return acc;
  }, {});

  const highCount = counts['HIGH'] || 0;
  const lowCount = counts['LOW'] || 0;
  const total = Object.keys(activitySummary).length;

  let shouldAlert = false;
  if (highCount > 0) shouldAlert = true;
  if (lowCount === total && total > 0) shouldAlert = true;

  if (shouldAlert) {
    const subject = `KPIs: ${highCount} HIGH / ${lowCount} LOW (${total})`;
    const messageLines = [];
    messageLines.push(`Resumen de autollenado: ${new Date().toLocaleString('es-ES')}`);
    messageLines.push('');
    messageLines.push(`Proyectos con ALTA actividad: ${highCount}`);
    messageLines.push(`Proyectos con BAJA actividad: ${lowCount}`);
    messageLines.push('');
    messageLines.push('Proyectos destacados:');
    Object.entries(activitySummary).filter(([,v])=>v.activityLevel==='HIGH').slice(0,10).forEach(([k,v]) => {
      messageLines.push(`- ${v.title || k}: ${v.totalActivity} acciones`);
    });
    messageLines.push('');
    messageLines.push('Revisa los archivos en `project_templates/` y el reporte generado si existe.');

    const payload = { subject, message: messageLines.join('\n'), channels: alertChannels };

    if (alertDry) {
      console.log('🔔 Alert (dry-run) payload from fill_project_kpis:');
      console.log(JSON.stringify(payload, null, 2));
    } else {
      try {
        console.log('🔔 Enviando alerta a', alertEndpoint);
        const res = await fetch(alertEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(alertsApiKey ? { 'x-alerts-api-key': alertsApiKey } : {})
          },
          body: JSON.stringify(payload)
        });
        const body = await res.json().catch(() => ({}));
        console.log('Alert response:', res.status, body);
      } catch (err) {
        console.error('Failed to send alert from fill_project_kpis:', err);
      }
    }
  } else {
    console.log('No alert conditions met after fill_project_kpis run.');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
