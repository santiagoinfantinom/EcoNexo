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

type LocaleMap = Record<string, string>;

const localePriority = ['es', 'en', 'de', 'fr', 'it', 'pl', 'nl'];

function readLocalizedValue(value: string | LocaleMap | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  for (const locale of localePriority) {
    if (value[locale]) return value[locale];
  }
  const first = Object.values(value)[0];
  return typeof first === 'string' ? first : '';
}

function readLocalizedArray(value: string[] | Record<string, string[]> | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  const merged = Object.values(value).flat();
  return merged.filter(Boolean);
}

function parseSalaryFilter(value: string | undefined): number {
  if (!value || value === 'Any') return 0;
  const numeric = Number(value.replace(/[^\d]/g, ''));
  if (!Number.isFinite(numeric)) return 0;
  return numeric * 1000;
}

function normalizeProject(project: any, score: number) {
  return {
    ...project,
    type: 'project' as const,
    match_score: Math.min(98, Math.max(55, score)),
  };
}

function normalizeJob(job: any, score: number) {
  const title = job.title || {};
  const description = job.description || {};
  const city = job.city || {};
  const country = job.country || {};
  const salary = job.salaryMinEur && job.salaryMaxEur
    ? `EUR ${job.salaryMinEur.toLocaleString()} - ${job.salaryMaxEur.toLocaleString()}`
    : undefined;

  return {
    id: job.id,
    type: 'job' as const,
    name: readLocalizedValue(title),
    name_en: typeof title === 'object' ? title.en : undefined,
    name_de: typeof title === 'object' ? title.de : undefined,
    description: readLocalizedValue(description),
    description_en: typeof description === 'object' ? description.en : undefined,
    description_de: typeof description === 'object' ? description.de : undefined,
    category: 'Empleo',
    city: readLocalizedValue(city),
    country: readLocalizedValue(country),
    lat: 0,
    lng: 0,
    company: job.company,
    salary,
    is_external: true,
    links: {
      apply: job.apply_url,
      website: job.apply_url,
    },
    match_score: Math.min(98, Math.max(55, score)),
  };
}

// Simple local matching logic as fallback
function localMatching(query: string, filters: Record<string, any> | undefined | null) {
  const queryLower = query.toLowerCase();
  const isJuniorIntent = /(junior|entry|entry[- ]?level|becario|trainee|prácticas|intern)/i.test(queryLower);

  // Keyword extraction (ignoring common stop words)
  const stopWords = ['quiero', 'un', 'una', 'en', 'de', 'para', 'con', 'el', 'la', 'los', 'las', 'trabajo', 'proyecto', 'busco', 'buscar', 'empleo', 'vacante'];
  const words = queryLower.split(/[\s,.-]+/).filter(w => w.length > 2 && !stopWords.includes(w));

  // Determine if user is specifically looking for jobs
  const isJobSearch = queryLower.includes('trabajo') || queryLower.includes('empleo') ||
    queryLower.includes('vacante') || queryLower.includes('sueldo') ||
    queryLower.includes('salario') || queryLower.includes('hire');

  const scoredProjects = PROJECTS.map(p => ({ item: p, type: 'project', score: 0 }));
  const scoredJobs = JOBS.map(j => ({ item: j, type: 'job', score: isJobSearch ? 10 : 0 }));

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

    if (entry.type === 'job') {
      const job = entry.item as any;
      const level = String(job.level || '').toLowerCase();
      if (filters?.isRemote && !job.remote) {
        entry.score -= 25;
      }
      if (filters?.experience && Number.isFinite(filters.experience)) {
        const experience = Number(filters.experience);
        const gap = Math.max(0, (job.experienceYears || 0) - experience);

        if (gap === 0) {
          entry.score += 16;
        } else if (gap === 1) {
          entry.score += 8;
        } else {
          entry.score -= Math.min(30, gap * 6);
        }

        // Stronger bias for junior seekers so senior roles sink in ranking.
        if (experience <= 1) {
          if (level === 'junior') entry.score += 14;
          if (level === 'mid') entry.score -= 6;
          if (level === 'senior' || level === 'lead') entry.score -= 18;
        }
      }

      if (isJuniorIntent) {
        if (level === 'junior') entry.score += 18;
        if (job.contract === 'internship') entry.score += 10;
        if (level === 'mid') entry.score -= 10;
        if (level === 'senior' || level === 'lead') entry.score -= 24;
      }
      const minSalary = parseSalaryFilter(filters?.salary);
      if (minSalary > 0) {
        if (job.salaryMaxEur >= minSalary) {
          entry.score += 16;
        } else {
          entry.score -= 20;
        }
      }
      const requiredSkills = Array.isArray(filters?.skills) ? filters.skills : [];
      if (requiredSkills.length > 0) {
        const normalizedSkills = requiredSkills.map((s: string) => s.toLowerCase());
        const jobSkills = readLocalizedArray(job.knowledgeAreas).map(skill => skill.toLowerCase());
        const matches = normalizedSkills.filter((skill: string) => jobSkills.some(js => js.includes(skill)));
        if (matches.length > 0) {
          entry.score += Math.min(25, matches.length * 8);
        } else {
          entry.score -= 10;
        }
      }
    } else if (Array.isArray(filters?.skills) && filters.skills.length > 0) {
      const project = entry.item as any;
      const projectTags = Array.isArray(project.tags) ? project.tags.map((tag: string) => tag.toLowerCase()) : [];
      const normalizedSkills = filters.skills.map((s: string) => s.toLowerCase());
      const matches = normalizedSkills.filter((skill: string) => projectTags.some((tag: string) => tag.includes(skill)));
      if (matches.length > 0) {
        entry.score += Math.min(20, matches.length * 6);
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
  const results = filteredResults.slice(0, 5).map(entry => {
    const baseScore = entry.score > 50 ? 85 + Math.floor(Math.random() * 13) : entry.score + 50;
    if (entry.type === 'job') return normalizeJob(entry.item, baseScore);
    return normalizeProject(entry.item, baseScore);
  });

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

