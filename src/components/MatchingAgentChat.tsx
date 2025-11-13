"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { ensureEventImage } from '@/lib/eventImages';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: locale === 'es' 
          ? '¡Hola! Soy tu asistente de matching inteligente. Puedo ayudarte a encontrar proyectos que se ajusten perfectamente a tus intereses y preferencias. ¿Qué tipo de proyectos te interesan?'
          : locale === 'de'
          ? 'Hallo! Ich bin dein intelligenter Matching-Assistent. Ich kann dir helfen, Projekte zu finden, die perfekt zu deinen Interessen und Präferenzen passen. Welche Art von Projekten interessieren dich?'
          : 'Hello! I\'m your intelligent matching assistant. I can help you find projects that perfectly match your interests and preferences. What type of projects interest you?',
        timestamp: new Date(),
      }]);
    }
  }, [messages.length, locale]);

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
      const response = await fetch('/api/agents/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id || user.email || 'anonymous',
          query: input.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get matches');
      }

      const data = await response.json();
      
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
        content: locale === 'es'
          ? 'Lo siento, hubo un error al buscar proyectos. Por favor, intenta de nuevo.'
          : locale === 'de'
          ? 'Entschuldigung, beim Suchen nach Projekten ist ein Fehler aufgetreten. Bitte versuche es erneut.'
          : 'Sorry, there was an error searching for projects. Please try again.',
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
          {locale === 'es'
            ? 'Por favor, inicia sesión para usar el asistente de matching.'
            : locale === 'de'
            ? 'Bitte melde dich an, um den Matching-Assistenten zu verwenden.'
            : 'Please sign in to use the matching assistant.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
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
                        onClick={() => onMatchClick?.(match)}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={imageSrc}
                            alt={getProjectName(match)}
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
                    {locale === 'es' ? 'Sugerencias:' : locale === 'de' ? 'Vorschläge:' : 'Suggestions:'}
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
            placeholder={
              locale === 'es'
                ? 'Escribe tu búsqueda...'
                : locale === 'de'
                ? 'Schreibe deine Suche...'
                : 'Type your search...'
            }
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {locale === 'es' ? 'Enviar' : locale === 'de' ? 'Senden' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

