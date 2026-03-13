import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/data/projects';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8001';

interface MatchRequest {
  user_id: string;
  query: string;
  context?: Record<string, any>;
  filters?: Record<string, any>;
}

// Simple local matching logic as fallback
function localMatching(query: string, filters: Record<string, any> | undefined | null) {
  let scoredProjects = PROJECTS.map(p => ({ project: p, score: 0 }));
  const queryLower = query.toLowerCase();

  // Keyword extraction (ignoring common stop words)
  const stopWords = ['quiero', 'un', 'una', 'en', 'de', 'para', 'con', 'el', 'la', 'los', 'las', 'trabajo', 'proyecto', 'busco', 'buscar'];
  const words = queryLower.split(/[\s,.-]+/).filter(w => w.length > 2 && !stopWords.includes(w));

  scoredProjects.forEach(item => {
    const { project } = item;
    const textToSearch = `${project.name} ${project.name_en || ''} ${project.description} ${project.description_en || ''} ${project.category} ${project.city} ${project.country} ${project.tags?.join(' ') || ''}`.toLowerCase();

    // 1. Scoring based on search query words
    let wordMatches = 0;
    words.forEach(word => {
      if (textToSearch.includes(word)) {
        item.score += 20; // boost score for each matching keyword
        wordMatches++;
        // Extra boost for exact category or city matches
        if (project.category.toLowerCase().includes(word)) item.score += 15;
        if (project.city.toLowerCase().includes(word)) item.score += 25;
      }
    });

    // 2. Scoring/Filtering by Explicit Filters
    if (filters?.location) {
      const locLower = filters.location.toLowerCase();
      if (project.city.toLowerCase().includes(locLower) || project.country.toLowerCase().includes(locLower)) {
        item.score += 30;
      } else if (filters.location.trim() !== '') {
        item.score -= 50; // Penalize if location doesn't match
      }
    }

    if (filters?.skills && Array.isArray(filters.skills) && filters.skills.length > 0) {
      let skillMatch = false;
      filters.skills.forEach((s: string) => {
        if (s.trim().length > 0 && textToSearch.includes(s.toLowerCase())) {
          item.score += 20;
          skillMatch = true;
        }
      });
      // Optionally penalize if they specified skills and none matched
      if (!skillMatch && filters.skills.some((s: string) => s.trim().length > 0)) {
        item.score -= 10;
      }
    }
  });

  // Filter out projects with negative or 0 score if we have active criteria
  const hasActiveCriteria = words.length > 0 || (filters?.location && filters.location.trim() !== '') || (filters?.skills && filters.skills.length > 0);

  if (hasActiveCriteria) {
    scoredProjects = scoredProjects.filter(item => item.score > 0);
  }

  // Sort by score descending
  scoredProjects.sort((a, b) => b.score - a.score);

  // Take top 3 or just first matched ones
  const noMatches = scoredProjects.length === 0;
  if (noMatches) {
    // If nothing matches, just return random so it's not totally empty but indicate it in explanation
    scoredProjects = [...PROJECTS].sort(() => 0.5 - Math.random()).map(p => ({ project: p, score: 70 }));
  }

  const matches = scoredProjects.slice(0, 3).map(item => ({
    ...item.project,
    // Calculate a matching percentage (capping at 98 for realism)
    score: Math.min(98, Math.max(65, item.score > 50 ? 85 + Math.floor(Math.random() * 13) : item.score + 50))
  }));

  const explanations: Record<string, string> = {
    general: !noMatches && hasActiveCriteria
      ? "¡He encontrado estos proyectos basándome exactamente en tu búsqueda y filtros!"
      : "No encontré coincidencias exactas para tu búsqueda, pero aquí tienes algunos proyectos populares que podrían interesarte:"
  };

  const score_summary: Record<string, number> = {};

  matches.forEach((m, index) => {
    // Generate context-aware explanation
    let reason = "Sus características coinciden con tus intereses.";
    if (filters?.location && (m.city.toLowerCase().includes(filters.location.toLowerCase()) || m.country.toLowerCase().includes(filters.location.toLowerCase()))) {
      reason = `Se encuentra en la ubicación solicitada (${m.city}).`;
    }
    const matchWords = words.filter(w => (`${m.name} ${m.description} ${m.category}`).toLowerCase().includes(w));
    if (matchWords.length > 0) {
      reason += ` Además, está relacionado con tus términos clave: ${matchWords.join(', ')}.`;
    }

    explanations[m.id] = `Match del ${m.score}%: ${reason}`;
    score_summary[m.id] = m.score;
  });

  return {
    matches,
    explanations,
    suggestions: [
      "Prueba ser más específico con la categoría o habilidades.",
      "Considera otras ciudades cercanas.",
      "Revisa la página principal para ver el mapa de eventos."
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

