"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { ensureEventImage } from '@/lib/eventImages';
import ImageWithFallback from '@/components/ImageWithFallback';
import { PROJECTS } from '@/data/projects';
import { JOBS } from '@/data/jobs';

interface Match {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  category: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  spots?: number;
  image_url?: string;
  links?: { website?: string; apply?: string };
  company?: string;   // For jobs
  salary?: string;    // For jobs
  type?: 'project' | 'job'; // Unified type
  match_score?: number;
  startsAt?: string;
  endsAt?: string;
  isPermanent?: boolean;
  is_external?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  matches?: Match[];
  explanations?: Record<string, string>;
  suggestions?: string[];
}

interface AgentStats {
  status: string;
  active_threads: number;
  saturation_index: number;
  rate_limits: {
    remaining_requests: number;
  };
}

interface MatchingAgentChatProps {
  onMatchClick?: (match: Match) => void;
}

const MATCHING_SESSION_KEY = 'econexo:matching-session';
const SAVED_ITEMS_KEY = 'econexo:saved';
const DEFAULT_FILTERS = {
  location: '',
  experience: 0,
  skills: '',
  isRemote: false,
  salary: 'Any'
};

const getLocalizedText = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const localized = value as Record<string, string>;
    return localized.es || localized.en || localized.de || Object.values(localized)[0] || '';
  }
  return '';
};

const getLocalizedArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(v => typeof v === 'string') as string[];
  if (typeof value === 'object') {
    return Object.values(value as Record<string, string[]>).flat().filter(Boolean);
  }
  return [];
};

const parseMinSalary = (value: string): number => {
  if (!value || value === 'Any') return 0;
  const parsed = Number(value.replace(/[^\d]/g, ''));
  if (!Number.isFinite(parsed)) return 0;
  return parsed * 1000;
};

export default function MatchingAgentChat({ onMatchClick }: MatchingAgentChatProps) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);

  // Advanced Search filters state
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem(SAVED_ITEMS_KEY);
      const savedItems = rawSaved ? JSON.parse(rawSaved) : [];
      const savedIds = Array.isArray(savedItems) ? savedItems.map((item: any) => item.id).filter(Boolean) : [];
      setFavoriteIds(savedIds);
    } catch (e) {
      console.warn('Unable to load favorites', e);
    }

    try {
      const rawSession = localStorage.getItem(MATCHING_SESSION_KEY);
      if (!rawSession) {
        setSessionReady(true);
        return;
      }
      const parsed = JSON.parse(rawSession);
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        const hydratedMessages: Message[] = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }));
        setMessages(hydratedMessages);
      }
      if (parsed.filters && typeof parsed.filters === 'object') {
        setFilters({
          ...DEFAULT_FILTERS,
          ...parsed.filters,
        });
      }
      if (typeof parsed.input === 'string') {
        setInput(parsed.input);
      }
    } catch (e) {
      console.warn('Unable to restore matching session', e);
    } finally {
      setSessionReady(true);
    }
  }, []);

  useEffect(() => {
    // Initialize with welcome message
    if (sessionReady && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: t('matchingAgentWelcome'),
        timestamp: new Date(),
      }]);
    }
  }, [messages.length, locale, sessionReady, t]);

  useEffect(() => {
    if (!sessionReady || messages.length === 0) return;
    const localizedWelcome = t('matchingAgentWelcome');
    setMessages(prev => {
      const firstMessage = prev[0];
      if (!firstMessage || firstMessage.id !== '1' || firstMessage.type !== 'assistant') return prev;
      if (firstMessage.content === localizedWelcome) return prev;
      return [
        { ...firstMessage, content: localizedWelcome },
        ...prev.slice(1),
      ];
    });
  }, [locale, sessionReady, t, messages.length]);

  useEffect(() => {
    if (!sessionReady) return;
    try {
      const trimmedMessages = messages.slice(-20).map(message => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
      }));
      localStorage.setItem(MATCHING_SESSION_KEY, JSON.stringify({
        messages: trimmedMessages,
        filters,
        input,
      }));
    } catch (e) {
      console.warn('Unable to persist matching session', e);
    }
  }, [filters, input, messages, sessionReady]);


  // Fetch stats periodically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/agents/matching/stats/');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          throw new Error('Stats API unreachable');
        }
      } catch (e) {
        // Mock stats for static deployment
        setStats({
          status: 'online',
          active_threads: 0,
          saturation_index: 0.1,
          rate_limits: {
            remaining_requests: 1000
          }
        });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const matchLookup = useMemo(() => {
    const lookup = new Map<string, Match>();
    for (const message of messages) {
      for (const match of message.matches || []) {
        lookup.set(match.id, match);
      }
    }
    return lookup;
  }, [messages]);

  const compareMatches = compareIds
    .map(id => matchLookup.get(id))
    .filter((match): match is Match => Boolean(match));

  const activeFilterChips = [
    filters.location ? `${locale === 'es' ? 'Ubicación' : 'Location'}: ${filters.location}` : '',
    filters.experience > 0 ? `${t('experienceYears')}: ${filters.experience}+` : '',
    filters.skills.trim() ? `${locale === 'es' ? 'Skills' : 'Skills'}: ${filters.skills}` : '',
    filters.isRemote ? (locale === 'es' ? 'Solo remoto' : 'Remote only') : '',
    filters.salary !== 'Any' ? `${t('salaryMin')}: ${filters.salary}` : '',
  ].filter(Boolean);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const toggleFavorite = (match: Match, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = favoriteIds.includes(match.id);
    const nextIds = isSaved
      ? favoriteIds.filter(id => id !== match.id)
      : [...favoriteIds, match.id];
    setFavoriteIds(nextIds);
    try {
      const raw = localStorage.getItem(SAVED_ITEMS_KEY);
      const savedItems = raw ? JSON.parse(raw) : [];
      const normalizedList = Array.isArray(savedItems) ? savedItems : [];
      const nextList = isSaved
        ? normalizedList.filter((item: any) => item.id !== match.id)
        : [...normalizedList, {
          type: match.type === 'job' ? 'job' : 'project',
          ...match,
          title: match.name,
          savedAt: new Date().toISOString(),
        }];
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(nextList));
    } catch (errorSaving) {
      console.warn('Unable to save favorite', errorSaving);
    }
  };

  const toggleCompare = (match: Match, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(match.id)) return prev.filter(id => id !== match.id);
      if (prev.length >= 3) return prev;
      return [...prev, match.id];
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let data;
      try {
        const response = await fetch('/api/agents/matching/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id || user.email || 'anonymous',
            query: input.trim(),
            filters: {
              ...filters,
              skills: filters.skills.split(',').map(s => s.trim()).filter(Boolean)
            }
          }),
        });

        if (!response.ok) {
          throw new Error('API Unavailable');
        }
        data = await response.json();
      } catch (apiErr) {
        console.warn('API call failed, falling back to client-side matching:', apiErr);
        // Client-side fallback for static export (GitHub Pages)
        const query = input.toLowerCase();
        const isJobSearch = /(trabajo|empleo|vacante|sueldo|salario|career|job|hiring)/i.test(query);
        const keywords = query
          .split(/[\s,.-]+/)
          .map(word => word.trim())
          .filter(word => word.length > 2 && !['quiero', 'busco', 'una', 'para', 'con', 'los', 'las'].includes(word));
        const minSalary = parseMinSalary(filters.salary);
        const requiredSkills = filters.skills
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean);

        const scoredJobs = JOBS.map(job => {
          let score = isJobSearch ? 20 : 0;
          const title = getLocalizedText(job.title).toLowerCase();
          const description = getLocalizedText(job.description).toLowerCase();
          const city = getLocalizedText(job.city).toLowerCase();
          const country = getLocalizedText(job.country).toLowerCase();
          const skillSet = getLocalizedArray(job.knowledgeAreas).map(skill => skill.toLowerCase());
          const text = `${title} ${description} ${job.company.toLowerCase()} ${city} ${country} ${skillSet.join(' ')}`;

          keywords.forEach(keyword => {
            if (text.includes(keyword)) score += 12;
            if (title.includes(keyword)) score += 14;
            if (skillSet.some(skill => skill.includes(keyword))) score += 8;
          });

          if (filters.location) {
            const locationLower = filters.location.toLowerCase();
            if (city.includes(locationLower) || country.includes(locationLower)) score += 28;
            else score -= 18;
          }

          if (filters.isRemote) {
            if (job.remote) score += 14;
            else score -= 22;
          }

          if (Number.isFinite(filters.experience) && filters.experience > 0) {
            const experienceGap = Math.max(0, job.experienceYears - filters.experience);
            if (experienceGap === 0) score += 14;
            else if (experienceGap === 1) score += 7;
            else score -= Math.min(20, experienceGap * 5);
          }

          if (minSalary > 0) {
            if (job.salaryMaxEur >= minSalary) score += 12;
            else score -= 20;
          }

          if (requiredSkills.length > 0) {
            const skillMatches = requiredSkills.filter(skill =>
              skillSet.some(jobSkill => jobSkill.includes(skill))
            );
            if (skillMatches.length > 0) {
              score += Math.min(24, skillMatches.length * 8);
            } else {
              score -= 10;
            }
          }

          const normalizedScore = Math.max(58, Math.min(98, 70 + score));
          return {
            id: job.id,
            type: 'job' as const,
            name: getLocalizedText(job.title),
            description: getLocalizedText(job.description),
            category: 'Empleo',
            city: getLocalizedText(job.city),
            country: getLocalizedText(job.country),
            lat: 0,
            lng: 0,
            company: job.company,
            salary: `EUR ${job.salaryMinEur.toLocaleString()} - ${job.salaryMaxEur.toLocaleString()}`,
            is_external: true,
            links: {
              apply: job.apply_url,
              website: job.apply_url
            },
            match_score: normalizedScore,
          };
        });

        const scoredProjects = PROJECTS.map(project => {
          let score = isJobSearch ? -8 : 4;
          const text = `${project.name} ${project.description} ${project.category} ${project.tags?.join(' ') || ''} ${project.city} ${project.country}`.toLowerCase();
          keywords.forEach(keyword => {
            if (text.includes(keyword)) score += 10;
          });

          if (filters.location) {
            const locationLower = filters.location.toLowerCase();
            if (
              project.city.toLowerCase().includes(locationLower) ||
              project.country.toLowerCase().includes(locationLower)
            ) {
              score += 16;
            }
          }

          return {
            ...project,
            type: 'project' as const,
            match_score: Math.max(55, Math.min(90, 65 + score)),
          };
        });

        const rankedMatches = [...scoredJobs, ...scoredProjects]
          .filter(item => (isJobSearch ? item.type === 'job' : true))
          .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
          .slice(0, 5);

        data = {
          matches: rankedMatches,
          explanations: rankedMatches.reduce((acc, p) => ({
            ...acc,
            [p.id]: p.type === 'job'
              ? `Este trabajo coincide con tus condiciones (skills/ubicación/salario/remoto) y tu intención de búsqueda.`
              : `Este proyecto coincide con tus intereses y filtros actuales.`
          }), {
            general: rankedMatches.length > 0
              ? `He encontrado ${rankedMatches.length} opciones alineadas con lo que pediste en el chat.`
              : 'No encontré coincidencias exactas; prueba añadiendo stack técnico, nivel y ciudad.'
          }),
          suggestions: rankedMatches.length === 0
            ? ['Prueba con un rol concreto (ej. "junior frontend sostenible").', 'Añade skills separadas por comas y una ciudad.']
            : []
        };

        // Use a small delay for "thinking" feel
        await new Promise(r => setTimeout(r, 1500));
      }

      // Format explanation
      const explanation = data.explanations?.general ||
        Object.values(data.explanations || {}).join('\n') ||
        'Found some matches for you!';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: explanation,
        timestamp: new Date(),
        matches: data.matches || [],
        explanations: data.explanations || {},
        suggestions: data.suggestions || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: t('matchingAgentError'),
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getProjectName = (match: Match) => {
    if (locale === 'en' && match.name_en) return match.name_en;
    if (locale === 'de' && match.name_de) return match.name_de;
    return match.name;
  };

  const getProjectDescription = (match: Match) => {
    if (locale === 'en' && match.description_en) return match.description_en;
    if (locale === 'de' && match.description_de) return match.description_de;
    return match.description || '';
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {t('signInToUseMatching')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col h-[600px]">
      {/* Header with Stats */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-800 dark:text-white">Matching Agent</h3>
        {stats && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1" title="Agent Saturation Level">
              <div className={`w-2 h-2 rounded-full ${stats.saturation_index > 0.8 ? 'bg-red-500' : stats.saturation_index > 0.5 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-gray-600 dark:text-gray-400">
                Load: {(stats.saturation_index * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-gray-500" title="API Quota Remaining">
              ⚡ {stats.rate_limits?.remaining_requests ?? '-'}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Filters Panel */}
      <div className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
        <div className="w-full px-4 py-2 flex items-center justify-between gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 text-left hover:text-gray-700 dark:hover:text-gray-200"
          >
            {t('searchConfiguration')}
            {filters.isRemote ? ' (Remote)' : ''}
            {filters.location ? ` (${filters.location})` : ''}
            <span className="ml-2">{showFilters ? '▲' : '▼'}</span>
          </button>
          <button
            onClick={clearFilters}
            className="px-2.5 py-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
          >
            {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
          </button>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {activeFilterChips.map(chip => (
              <span
                key={chip}
                className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {showFilters && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
            {/* Location */}
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">
                {t('location')}
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder={locale === 'es' ? 'ej. Madrid, Berlín' : 'e.g. Madrid, Berlin'}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Experience */}
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">
                {t('experienceYears')} {filters.experience}+
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* Skills */}
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">
                {t('skillsCommas')}
              </label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                placeholder="Python, React, Django..."
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Salary */}
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">
                {t('salaryMin')}
              </label>
              <select
                value={filters.salary}
                onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="Any">{t('any')}</option>
                <option value="30k+">$30k+</option>
                <option value="50k+">$50k+</option>
                <option value="80k+">$80k+</option>
                <option value="100k+">$100k+</option>
              </select>
            </div>

            {/* Remote Checkbox */}
            <div className="col-span-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="remote-check"
                checked={filters.isRemote}
                onChange={(e) => setFilters(prev => ({ ...prev, isRemote: e.target.checked }))}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="remote-check" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                {t('remoteWorkOnly')}
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/30 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {locale === 'es'
            ? `Comparación: ${compareIds.length}/3 seleccionados`
            : `Compare: ${compareIds.length}/3 selected`}
        </p>
        <button
          onClick={() => setShowCompareModal(true)}
          disabled={compareIds.length < 2}
          className="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {locale === 'es' ? 'Comparar resultados' : 'Compare results'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* Matches */}
              {message.matches && message.matches.length > 0 && (
                <div className="mt-4 space-y-3">
                  {message.matches.map((match) => {
                    const imageSrc = ensureEventImage({
                      image_url: match.image_url,
                      category: match.category,
                      website: match.links?.website
                    });
                    const explanation = message.explanations?.[match.id] || '';
                    const score = typeof match.match_score === 'number' ? match.match_score : 85;

                    return (
                      <div
                        key={match.id}
                        className="bg-white dark:bg-slate-600 rounded-lg p-3 border border-gray-200 dark:border-slate-500 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onMatchClick?.(match)}
                      >
                        <div className="mb-2 flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => toggleFavorite(match, e)}
                            className={`text-[11px] px-2 py-1 rounded border ${favoriteIds.includes(match.id)
                              ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                              : 'bg-gray-50 text-gray-600 border-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-500'
                              }`}
                          >
                            {favoriteIds.includes(match.id)
                              ? (locale === 'es' ? 'Guardado' : 'Saved')
                              : (locale === 'es' ? 'Guardar' : 'Save')}
                          </button>
                          <button
                            onClick={(e) => toggleCompare(match, e)}
                            className={`text-[11px] px-2 py-1 rounded border ${compareIds.includes(match.id)
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
                              : 'bg-gray-50 text-gray-600 border-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-500'
                              }`}
                          >
                            {compareIds.includes(match.id)
                              ? (locale === 'es' ? 'Comparando' : 'Comparing')
                              : (locale === 'es' ? 'Comparar' : 'Compare')}
                          </button>
                        </div>
                        <div className="flex items-start gap-3">
                          <ImageWithFallback
                            src={imageSrc || '/assets/default-event.png'}
                            alt={getProjectName(match)}
                            category={match.category}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-semibold text-sm truncate">
                                {getProjectName(match)}
                              </h4>
                              {match.type === 'job' && (
                                <span className="flex-shrink-0 text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                  {locale === 'es' ? 'Empleo' : locale === 'de' ? 'Job' : 'Job'}
                                </span>
                              )}
                            </div>

                            {match.company && (
                              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 -mt-0.5">
                                {match.company}
                              </p>
                            )}

                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {getProjectDescription(match).substring(0, 100)}...
                            </p>

                            {explanation && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                {explanation}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                                {score}% match
                              </span>

                              {match.salary && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                                  💰 {match.salary}
                                </span>
                              )}

                              {match.is_external && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                                  🌐 External
                                </span>
                              )}

                              <span className="text-xs text-gray-500">
                                📍 {match.city}, {match.country}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-slate-600">
                  <p className="text-xs font-semibold mb-1">
                    {t('suggestionsLabel')}
                  </p>
                  <ul className="text-xs space-y-1">
                    {message.suggestions.map((suggestion, idx) => (
                      <li key={idx}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 w-full max-w-[88%]">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                {locale === 'es'
                  ? 'Analizando skills, ubicación, experiencia y salario...'
                  : 'Analyzing skills, location, experience and salary...'}
              </p>
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg p-2.5">
                    <div className="h-3 bg-gray-200 dark:bg-slate-500 rounded w-2/3 mb-2" />
                    <div className="h-2.5 bg-gray-200 dark:bg-slate-500 rounded w-full mb-1.5" />
                    <div className="h-2.5 bg-gray-200 dark:bg-slate-500 rounded w-4/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {locale === 'es' ? 'Comparación de resultados' : 'Result comparison'}
              </h4>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-slate-700">
                    <th className="py-2 pr-4">{locale === 'es' ? 'Nombre' : 'Name'}</th>
                    <th className="py-2 pr-4">{locale === 'es' ? 'Tipo' : 'Type'}</th>
                    <th className="py-2 pr-4">{locale === 'es' ? 'Ubicación' : 'Location'}</th>
                    <th className="py-2 pr-4">{locale === 'es' ? 'Salario' : 'Salary'}</th>
                    <th className="py-2 pr-4">{locale === 'es' ? 'Match' : 'Match'}</th>
                  </tr>
                </thead>
                <tbody>
                  {compareMatches.map(match => (
                    <tr key={match.id} className="border-b border-gray-100 dark:border-slate-700/70">
                      <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white">{getProjectName(match)}</td>
                      <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{match.type || 'project'}</td>
                      <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{match.city}, {match.country}</td>
                      <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{match.salary || '-'}</td>
                      <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{match.match_score || 85}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {locale === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('typeSearchPh')}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('send')}
          </button>
        </div>
      </div>
    </div>
  );
}

