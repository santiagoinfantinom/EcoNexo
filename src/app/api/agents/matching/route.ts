import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/data/projects';
import { JOBS } from '@/data/jobs';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8001';

interface MatchRequest {
  user_id: string;
  query: string;
  context?: Record<string, any>;
  filters?: Record<string, any>;
}

// Simple local matching logic as fallback
function localMatching(query: string, filters: Record<string, any> | undefined | null) {
  const queryLower = query.toLowerCase();

  // Keyword extraction (ignoring common stop words)
  const stopWords = ['quiero', 'un', 'una', 'en', 'de', 'para', 'con', 'el', 'la', 'los', 'las', 'trabajo', 'proyecto', 'busco', 'buscar', 'empleo', 'vacante'];
  const words = queryLower.split(/[\s,.-]+/).filter(w => w.length > 2 && !stopWords.includes(w));

  // Determine if user is specifically looking for jobs
  const isJobSearch = queryLower.includes('trabajo') || queryLower.includes('empleo') ||
    queryLower.includes('vacante') || queryLower.includes('sueldo') ||
    queryLower.includes('salario') || queryLower.includes('hire');

  let scoredProjects = PROJECTS.map(p => ({ item: p, type: 'project', score: 0 }));
  let scoredJobs = JOBS.map(j => ({ item: j, type: 'job', score: isJobSearch ? 10 : 0 }));

  const allScored = [...scoredProjects, ...scoredJobs];

  allScored.forEach(entry => {
    const { item, type } = entry;

    // Unified search text
    let textToSearch = "";
    if (type === 'project') {
      const p = item as any;
      textToSearch = `${p.name} ${p.name_en || ''} ${p.description} ${p.description_en || ''} ${p.category} ${p.city} ${p.country} ${p.tags?.join(' ') || ''}`.toLowerCase();
    } else {
      const j = item as any;
      // Resolve localized strings for jobs
      const title = typeof j.title === 'string' ? j.title : Object.values(j.title).join(' ');
      const city = typeof j.city === 'string' ? j.city : Object.values(j.city).join(' ');
      const country = typeof j.country === 'string' ? j.country : Object.values(j.country).join(' ');
      const description = typeof j.description === 'string' ? j.description : Object.values(j.description).join(' ');
      const tags = Array.isArray(j.knowledgeAreas) ? j.knowledgeAreas.join(' ') : Object.values(j.knowledgeAreas).flat().join(' ');

      textToSearch = `${title} ${j.company} ${city} ${country} ${description} ${tags}`.toLowerCase();
    }

    // 1. Scoring based on search query words
    words.forEach(word => {
      if (textToSearch.includes(word)) {
        entry.score += 20; // boost score for each matching keyword

        // Extra boost for exact category/title matches
        if (type === 'project') {
          if ((item as any).category.toLowerCase().includes(word)) entry.score += 15;
        } else {
          const title = typeof (item as any).title === 'string' ? (item as any).title : Object.values((item as any).title).join(' ');
          if (title.toLowerCase().includes(word)) entry.score += 25;
        }

        // Boost for location
        const city = typeof (item as any).city === 'string' ? (item as any).city : Object.values((item as any).city).join(' ');
        if (city.toLowerCase().includes(word)) entry.score += 25;
      }
    });

    // 2. Scoring/Filtering by Explicit Filters
    if (filters?.location) {
      const locLower = filters.location.toLowerCase();
      const city = typeof (item as any).city === 'string' ? (item as any).city : Object.values((item as any).city).join(' ');
      const country = typeof (item as any).country === 'string' ? (item as any).country : Object.values((item as any).country).join(' ');

      if (city.toLowerCase().includes(locLower) || country.toLowerCase().includes(locLower)) {
        entry.score += 30;
      } else if (filters.location.trim() !== '') {
        entry.score -= 50; // Penalize if location doesn't match
      }
    }
  });

  // Filter out items with negative or 0 score if we have active criteria
  const hasActiveCriteria = words.length > 0 || (filters?.location && filters.location.trim() !== '');

  let filteredResults = allScored;
  if (hasActiveCriteria) {
    filteredResults = allScored.filter(entry => entry.score > 0);
  }

  // Sort by score descending
  filteredResults.sort((a, b) => b.score - a.score);

  // Take top 5
  const results = filteredResults.slice(0, 5).map(entry => ({
    ...entry.item,
    type: entry.type,
    // Calculate a matching percentage
    match_score: Math.min(98, Math.max(65, entry.score > 50 ? 85 + Math.floor(Math.random() * 13) : entry.score + 50))
  }));

  const explanations: Record<string, string> = {
    general: results.length > 0 && hasActiveCriteria
      ? "¡He encontrado estas opciones basándome en tu búsqueda!"
      : "No encontré coincidencias exactas, pero aquí tienes algunas oportunidades interesantes:"
  };

  const score_summary: Record<string, number> = {};

  results.forEach((m: any) => {
    let reason = "Coincide con tus intereses.";
    if (m.type === 'job') {
      reason = `Oferta de empleo en ${m.company} que encaja con tu perfil.`;
    }

    explanations[m.id] = `Match del ${m.match_score}%: ${reason}`;
    score_summary[m.id] = m.match_score;
  });

  return {
    matches: results,
    explanations,
    suggestions: [
      "Prueba buscar por cargo específico (ej: 'Ingeniero', 'Manager').",
      "Filtra por ciudad para ver empleos locales.",
      "Explora la sección de proyectos si buscas voluntariado."
    ],
    score_summary
  };
}


export async function POST(req: NextRequest) {
  try {
    const body: MatchRequest = await req.json();

    if (!body.user_id || !body.query) {
      return NextResponse.json(
        { error: 'user_id and query are required' },
        { status: 400 }
      );
    }

    // Try to call MCP server first
    try {
      const response = await fetch(`${MCP_SERVER_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: body.user_id,
          query: body.query,
          context: body.context || {},
          filters: body.filters || null,
        }),
        // Add a short timeout so we fallback quickly
        signal: AbortSignal.timeout(2000)
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // Ignore fetch error to fallback
      console.warn('MCP server unreachable or slow, falling back to local matching');
    }

    // Fallback to local matching
    const localData = localMatching(body.query, body.filters);
    return NextResponse.json(localData);

  } catch (error) {
    console.error('Error in matching API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/health`, {
      signal: AbortSignal.timeout(1000)
    });
    if (!response.ok) {
      return NextResponse.json(
        { status: 'unhealthy', mcp_server: 'down', local_fallback: 'active' },
        { status: 200 }
      );
    }
    const data = await response.json();
    return NextResponse.json({ status: 'healthy', ...data });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', mcp_server: 'unreachable', local_fallback: 'active' },
      { status: 200 }
    );
  }
}

