"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n, categoryLabel, locationLabel } from "@/lib/i18n";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  city: string;
  country: string;
  address?: string;
  category: string;
  capacity?: number;
  image_url?: string;
  created_at?: string;
};

type EventWithAvailability = Event & {
  currentRegistrations: number;
  spotsAvailable: number;
  isAvailable: boolean;
};

export default function EventosDisponiblesPage() {
  const { t, locale } = useI18n();
  const [events, setEvents] = useState<EventWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'urgent'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAvailableEvents();
  }, []);

  const loadAvailableEvents = async () => {
    setLoading(true);
    try {
      // Fetch all events
      const eventsRes = await fetch('/api/events');
      const eventsData: Event[] = eventsRes.ok ? await eventsRes.json() : [];
      
      // For each event, count registrations
      const eventsWithAvailability: EventWithAvailability[] = await Promise.all(
        eventsData.map(async (event) => {
          let currentRegistrations = 0;
          
          if (isSupabaseConfigured()) {
            try {
              const supabase = getSupabase();
              const { count } = await supabase
                .from('event_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', event.id);
              currentRegistrations = count || 0;
            } catch (err) {
              console.warn('Error counting registrations:', err);
            }
          }
          
          const spotsAvailable = event.capacity 
            ? Math.max(0, event.capacity - currentRegistrations)
            : null;
          
          const isAvailable = spotsAvailable === null || spotsAvailable > 0;
          
          return {
            ...event,
            currentRegistrations,
            spotsAvailable,
            isAvailable,
          };
        })
      );
      
      // Filter events that are available
      const availableEvents = eventsWithAvailability.filter(e => e.isAvailable);
      
      // Sort by date (upcoming first)
      availableEvents.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.start_time || '00:00'}`).getTime();
        const dateB = new Date(`${b.date} ${b.start_time || '00:00'}`).getTime();
        return dateA - dateB;
      });
      
      setEvents(availableEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;
    
    // Filter by availability type
    if (filter === 'urgent') {
      filtered = filtered.filter(e => 
        e.spotsAvailable !== null && e.spotsAvailable > 0 && e.spotsAvailable <= 5
      );
    } else if (filter === 'available') {
      filtered = filtered.filter(e => e.isAvailable);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    return filtered;
  };

  const categories = Array.from(new Set(events.map(e => e.category)));

  const formatDate = (dateStr: string, startTime?: string, endTime?: string) => {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString(locale === 'de' ? 'de-DE' : locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    if (startTime) {
      const timeStr = endTime ? `${startTime}–${endTime}` : startTime;
      return `${dateFormatted} ${timeStr}`;
    }
    return dateFormatted;
  };

  const getEventTitle = (event: Event) => {
    if (locale === 'en' && event.title_en) return event.title_en;
    if (locale === 'de' && event.title_de) return event.title_de;
    return event.title;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === 'de' ? 'Verfügbare Veranstaltungen' : locale === 'es' ? 'Eventos Disponibles' : 'Available Events'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {locale === 'de' 
              ? 'Entdecken Sie Veranstaltungen, die noch Teilnehmer suchen' 
              : locale === 'es' 
              ? 'Descubre eventos que aún buscan participantes'
              : 'Discover events that are still looking for participants'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Availability Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'all'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
              }`}
            >
              {locale === 'de' ? 'Alle' : locale === 'es' ? 'Todos' : 'All'}
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'available'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
              }`}
            >
              {locale === 'de' ? 'Verfügbar' : locale === 'es' ? 'Disponibles' : 'Available'}
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'urgent'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
              }`}
            >
              {locale === 'de' ? 'Dringend' : locale === 'es' ? 'Urgentes' : 'Urgent'} (≤5)
            </button>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                }`}
              >
                {t("all")}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-gray-800 text-white'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                  }`}
                >
                  {categoryLabel(cat, locale)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {locale === 'de' ? 'Lade Veranstaltungen...' : locale === 'es' ? 'Cargando eventos...' : 'Loading events...'}
            </p>
          </div>
        )}

        {/* Events List */}
        {!loading && (
          <>
            {getFilteredEvents().length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {locale === 'de' 
                    ? 'Keine verfügbaren Veranstaltungen' 
                    : locale === 'es' 
                    ? 'No hay eventos disponibles'
                    : 'No available events'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {locale === 'de'
                    ? 'Es gibt derzeit keine Veranstaltungen mit verfügbaren Plätzen.'
                    : locale === 'es'
                    ? 'Actualmente no hay eventos con plazas disponibles.'
                    : 'There are currently no events with available spots.'}
                </p>
                <Link
                  href="/eventos"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
                >
                  {locale === 'de' ? 'Zurück zu Veranstaltungen' : locale === 'es' ? 'Volver a eventos' : 'Back to Events'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {getFilteredEvents().map((event) => (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.id}`}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200 dark:border-slate-700 hover:scale-[1.02]"
                  >
                    {/* Event Image */}
                    {event.image_url && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={getEventTitle(event)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    {/* Event Content */}
                    <div className="p-4 sm:p-6">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                          {categoryLabel(event.category, locale)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {getEventTitle(event)}
                      </h3>

                      {/* Date and Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>📅</span>
                        <span>{formatDate(event.date, event.start_time, event.end_time)}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span>📍</span>
                        <span>{locationLabel(event.city, locale)}, {locationLabel(event.country, locale)}</span>
                      </div>

                      {/* Availability Info */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                        {event.spotsAvailable !== null ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${
                              event.spotsAvailable <= 5 
                                ? 'text-red-600 dark:text-red-400' 
                                : event.spotsAvailable <= 10
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-green-600 dark:text-green-400'
                            }`}>
                              {event.spotsAvailable} {locale === 'de' ? 'Plätze frei' : locale === 'es' ? 'plazas' : 'spots'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {locale === 'de' ? 'Offen für Anmeldungen' : locale === 'es' ? 'Abierto para inscripciones' : 'Open for registration'}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.currentRegistrations} {locale === 'de' ? 'Teilnehmer' : locale === 'es' ? 'participantes' : 'participants'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-colors text-sm font-medium shadow-sm hover:shadow-md"
          >
            <span>←</span>
            <span>{locale === 'de' ? 'Zurück zu Veranstaltungen' : locale === 'es' ? 'Volver a eventos' : 'Back to Events'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

