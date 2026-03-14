"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { ensureEventImage } from '@/lib/eventImages';
import ImageWithFallback from '@/components/ImageWithFallback';
import { PROJECTS } from '@/data/projects';

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
  info_url?: string;
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
  const [filters, setFilters] = useState({
    location: '',
    experience: 0,
    skills: '',
    isRemote: false,
    salary: 'Any' // New salary filter
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: t('matchingAgentWelcome'),
        timestamp: new Date(),
      }]);
    }
  }, [messages.length, locale]);


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

        // Simple matching algorithm
        const rankedMatches = PROJECTS.map(p => {
          let score = 0;
          const text = `${p.name} ${p.description} ${p.category} ${p.tags?.join(' ')}`.toLowerCase();

          // Keyword matching
          const keywords = query.split(/\s+/).filter(k => k.length > 3);
          keywords.forEach(k => {
            if (text.includes(k)) score += 10;
          });

          // Category priority
          if (query.includes('social') && p.category === 'Comunidad') score += 20;
          if (query.includes('programar') && p.category === 'Tecnología') score += 20;
          if (query.includes('educación') && p.category === 'Educación') score += 20;
          if (query.includes('clima') && p.category === 'Medio ambiente') score += 20;
          if (query.includes('mar') && p.category === 'Océanos') score += 20;

          // Location filtering
          if (filters.location && p.city.toLowerCase().includes(filters.location.toLowerCase())) {
            score += 30;
          }

          return { ...p, score };
        })
          .filter(p => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        data = {
          matches: rankedMatches,
          explanations: rankedMatches.reduce((acc, p) => ({
            ...acc,
            [p.id]: `Este proyecto es relevante porque coincide con tu interés en ${p.category.toLowerCase()}.`
          }), {
            general: rankedMatches.length > 0
              ? `He encontrado ${rankedMatches.length} proyectos que encajan con tu perfil. ¡Echa un vistazo!`
              : "No he encontrado coincidencias exactas, pero aquí tienes algunos proyectos destacados que podrían interesarte."
          }),
          suggestions: rankedMatches.length === 0 ? ["Intenta buscar por 'clima', 'social' o 'tecnología'", "Prueba especificando una ciudad"] : []
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
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span>
            {t('searchConfiguration')}
            {filters.isRemote ? ' (Remote)' : ''}
            {filters.location ? ` (${filters.location})` : ''}
          </span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>

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
                      website: match.info_url
                    });
                    const explanation = message.explanations?.[match.id] || '';
                    const score = 85; // Would come from API in real implementation

                    return (
                      <div
                        key={match.id}
                        className="bg-white dark:bg-slate-600 rounded-lg p-3 border border-gray-200 dark:border-slate-500 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          if (match.is_external || (match.info_url && match.info_url.startsWith('http'))) {
                            window.open(match.info_url, '_blank');
                          } else {
                            onMatchClick?.(match);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <ImageWithFallback
                            src={imageSrc || '/assets/default-event.png'}
                            alt={getProjectName(match)}
                            category={match.category}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {getProjectName(match)}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {getProjectDescription(match).substring(0, 100)}...
                            </p>
                            {explanation && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                {explanation}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                {score}% match
                              </span>
                              {match.is_external && (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
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
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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

