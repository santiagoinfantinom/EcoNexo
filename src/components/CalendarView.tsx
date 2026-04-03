"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useGlobalConfig } from "@/hooks/useGlobalConfig";
import { BaseCard, BaseButton, BaseSelect, BaseTitle, BaseFilterPanel, BaseEmptyState, BaseLabel, BaseInput } from "@/components/ui";
import Link from "next/link";
import { ensureEventImage } from "@/lib/eventImages";
import ImageWithFallback from '@/components/ImageWithFallback';

type CalendarViewProps = {
  projects: any[];
  onProjectSelect: (project: any) => void;
};

type CalendarEvent = {
  id: string;
  projectId?: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  spots: number;
  registered: number;
  location: string;
  category: 'environment' | 'education' | 'community' | 'technology';
  organizer?: string;
  website?: string;
  image_url?: string;
};

export default function CalendarView({ projects, onProjectSelect }: CalendarViewProps) {
  const { t, locale } = useI18n();
  const {
    getCardClasses,
    getButtonClasses,
    getInputClasses,
    getTitleClasses,
    getNavigationClasses,
    getCalendarClasses,
    getFilterClasses,
    getEventClasses,
    getEmptyClasses,
    combineClasses
  } = useGlobalConfig();
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [realEvents, setRealEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [subscriptionEndpoint, setSubscriptionEndpoint] = useState<string | null>(null);

  // External Search State
  const [searchCity, setSearchCity] = useState('');
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [externalEvents, setExternalEvents] = useState<CalendarEvent[]>([]);

  // Initialize currentMonth only on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Default to February 2026 to show the new events
    setCurrentMonth(new Date(2026, 1, 1));
  }, []);

  // Filter states for list view
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    dateRange: '',
    spotsAvailable: false,
    searchText: ''
  });

  const handleExternalSearch = async () => {
    if (!searchCity.trim()) return;

    setIsSearchingExternal(true);
    setExternalEvents([]);

    try {
      const res = await fetch('/api/events/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: searchCity,
          query: 'environmental events'
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Transform external events to CalendarEvent format
        const mappedEvents: CalendarEvent[] = (data.events || []).map((evt: any) => {
          // Adjust timezone issues by treating YYYY-MM-DD as local midnight
          const parts = evt.date ? evt.date.split("-") : null;
          const parsedDate = parts ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date();

          return {
            id: evt.id,
            title: evt.title,
            date: parsedDate,
            time: evt.time || '10:00',
            duration: 2,
            spots: evt.spots || 0,
            registered: 0,
            location: evt.city || searchCity,
            category: evt.category || 'environment',
            organizer: evt.organizer || 'External',
            website: evt.website,
            image_url: evt.image_url
          };
        });
        setExternalEvents(mappedEvents);

        // SYNC: Ensure local calendar view filters out other cities to cleanly view the search results
        setFilters(prev => ({ ...prev, location: searchCity }));
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearchingExternal(false);
    }
  };

  // Mock events data - no longer needed
  const mockEvents: CalendarEvent[] = [];

  // Load real events from API
  useEffect(() => {
    // Transform API event to calendar event format
    const transformEvent = (apiEvent: any): CalendarEvent | null => {
      try {
        const eventDate = new Date(apiEvent.date);
        if (isNaN(eventDate.getTime())) return null;

        // Map category from Spanish/English to calendar format
        const categoryMap: Record<string, 'environment' | 'education' | 'community' | 'technology'> = {
          'Medio ambiente': 'environment',
          'Environment': 'environment',
          'Umwelt': 'environment',
          'Educación': 'education',
          'Education': 'education',
          'Bildung': 'education',
          'Comunidad': 'community',
          'Community': 'community',
          'Gemeinschaft': 'community',
          'Salud': 'community',
          'Health': 'community',
          'Gesundheit': 'community',
          'Océanos': 'environment',
          'Oceans': 'environment',
          'Ozeane': 'environment',
          'Alimentación': 'community',
          'Food': 'community',
          'Ernährung': 'community',
          'Tecnología': 'technology',
          'Technology': 'technology',
          'Technologie': 'technology',
        };

        const category = categoryMap[apiEvent.category] || 'community';

        // Calculate duration from start_time and end_time
        let duration = 2; // default
        if (apiEvent.start_time && apiEvent.end_time) {
          const start = apiEvent.start_time.split(':').map(Number);
          const end = apiEvent.end_time.split(':').map(Number);
          const startMinutes = start[0] * 60 + start[1];
          const endMinutes = end[0] * 60 + end[1];
          duration = Math.round((endMinutes - startMinutes) / 60);
          if (duration <= 0) duration = 2;
        }

        // Format time display
        const timeDisplay = apiEvent.start_time
          ? (apiEvent.end_time ? `${apiEvent.start_time}–${apiEvent.end_time}` : apiEvent.start_time)
          : '09:00';

        // Build location string
        const locationParts = [apiEvent.city, apiEvent.country].filter(Boolean);
        const location = locationParts.length > 0
          ? locationParts.join(', ')
          : (apiEvent.address || 'Location TBD');

        // Get localized title
        const title = locale === 'es'
          ? (apiEvent.title || apiEvent.title_en || 'Untitled Event')
          : locale === 'de'
            ? (apiEvent.title_de || apiEvent.title || apiEvent.title_en || 'Untitled Event')
            : (apiEvent.title_en || apiEvent.title || 'Untitled Event');

        return {
          id: apiEvent.id || `event_${Date.now()}_${Math.random()}`,
          title,
          date: eventDate,
          time: timeDisplay,
          duration,
          spots: apiEvent.capacity || 50,
          registered: 0, // TODO: Get from API if available
          location,
          category,
          website: apiEvent.website,
          image_url: apiEvent.image_url,
        };
      } catch (error) {
        console.error('Error transforming event:', error, apiEvent);
        return null;
      }
    };

    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          const events = Array.isArray(data)
            ? data.map(transformEvent).filter((e): e is CalendarEvent => e !== null)
            : [];
          setRealEvents(events);
        } else {
          console.warn("API not available, using mock events as fallback");
          setRealEvents([]);
        }
      } catch (error) {
        console.warn("Failed to load events:", error);
        setRealEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, [locale]);

  // Combine real events with mock events (mock as fallback if no real events)
  const allEvents = realEvents.length > 0 ? realEvents : mockEvents;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return allEvents.filter(event =>
      event.date.toDateString() === date.toDateString() &&
      (filters.category ? event.category === filters.category : true) &&
      (filters.location ? event.location.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
      (filters.searchText ? (
        event.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.searchText.toLowerCase())
      ) : true)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      if (!prev) return new Date();
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatMonthYear = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Filter functions
  const getFilteredEvents = () => {
    if (!currentMonth) return [];
    // Merge external events with allEvents for filtering
    const combinedEvents = [...allEvents, ...externalEvents];
    let filtered = combinedEvents;

    // Only filter by current month if no search text or location filter is active
    if (!filters.searchText && !filters.location) {
      filtered = filtered.filter(event =>
        event.date.getMonth() === currentMonth.getMonth() &&
        event.date.getFullYear() === currentMonth.getFullYear()
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.dateRange) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(event =>
            event.date.toDateString() === today.toDateString()
          );
          break;
        case 'tomorrow':
          filtered = filtered.filter(event =>
            event.date.toDateString() === tomorrow.toDateString()
          );
          break;
        case 'week':
          filtered = filtered.filter(event =>
            event.date >= today && event.date <= nextWeek
          );
          break;
        case 'month':
          filtered = filtered.filter(event =>
            event.date >= today && event.date <= nextMonth
          );
          break;
      }
    }

    if (filters.spotsAvailable) {
      filtered = filtered.filter(event => event.registered < event.spots);
    }

    if (filters.searchText) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        (event.organizer && event.organizer.toLowerCase().includes(filters.searchText.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      dateRange: '',
      spotsAvailable: false,
      searchText: ''
    });
  };

  const getUniqueCategories = () => {
    return [...new Set(allEvents.map(event => event.category))];
  };

  const getUniqueLocations = () => {
    return [...new Set(allEvents.map(event => event.location))];
  };

  const weekDays = locale === 'es' ?
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] :
    locale === 'de' ?
      ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] :
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Don't render calendar content until mounted to avoid hydration mismatch
  if (!mounted || !currentMonth) {
    return (
      <BaseCard variant="default" className="w-full my-6">
        <div className="text-center py-4 text-slate-600 dark:text-slate-300">
          {t('loadingCalendar')}
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard variant="default" className="w-full my-6">
      {/* Loading indicator */}
      {loadingEvents && realEvents.length === 0 && (
        <div className="text-center py-4 text-slate-600 dark:text-slate-300">
          {t('loadingEventsIndicator')}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col items-center mb-4 w-full px-4">

        {/* Global Search Bar */}
        <div className="w-full max-w-xl mb-6 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 shadow-sm">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('searchEventsPlaceholder')}
              value={searchCity}
              onChange={(e) => {
                const val = e.target.value;
                setSearchCity(val);
                // Sync the local search text to instantly filter local events
                setFilters(prev => ({ ...prev, searchText: val }));
                // If user clears the input entirely, clear the filter to restore standard view
                if (!val.trim()) {
                  setExternalEvents([]);
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleExternalSearch()}
              className="flex-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <BaseButton
              onClick={handleExternalSearch}
              disabled={isSearchingExternal || !searchCity.trim()}
              variant="outline"
              className="px-4"
            >
              {isSearchingExternal ? (
                <span className="animate-spin">↻</span>
              ) : (
                <span>🌐</span>
              )}
              <span className="ml-2 hidden sm:inline">{t('webSearch')}</span>
            </BaseButton>
          </div>
          {externalEvents.length > 0 && (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 px-1">
              {locale === 'es'
                ? `Encontrados ${externalEvents.length} eventos externos en ${searchCity}`
                : `Found ${externalEvents.length} external events in ${searchCity}`}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <BaseButton
            variant={viewMode === 'month' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('month')}
          >
            {t("month")}
          </BaseButton>
          <BaseButton
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
          >
            {t("list")}
          </BaseButton>
          <BaseButton
            variant={notificationsEnabled ? 'secondary' : 'primary'}
            onClick={async () => {
              try {
                if (!('Notification' in window) || !('serviceWorker' in navigator)) {
                  alert(t('notificationsNotSupported'));
                  return;
                }

                // Request notification permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                  alert(t('notificationsBlocked'));
                  return;
                }

                // Register service worker
                let registration = await navigator.serviceWorker.getRegistration('/sw.js');
                if (!registration) {
                  registration = await navigator.serviceWorker.register('/sw.js');
                  await navigator.serviceWorker.ready;
                }

                // Get VAPID public key from environment (available in client via NEXT_PUBLIC_)
                const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!vapidPublicKey) {
                  alert(locale === 'es'
                    ? 'VAPID keys no configuradas. Contacta al administrador.'
                    : locale === 'de'
                      ? 'VAPID-Schlüssel nicht konfiguriert. Kontaktieren Sie den Administrator.'
                      : 'VAPID keys not configured. Contact administrator.');
                  return;
                }

                // Convert VAPID key to Uint8Array
                const urlBase64ToUint8Array = (base64String: string) => {
                  const padding = '='.repeat((4 - base64String.length % 4) % 4);
                  const base64 = (base64String + padding)
                    .replace(/\-/g, '+')
                    .replace(/_/g, '/');
                  const rawData = window.atob(base64);
                  const outputArray = new Uint8Array(rawData.length);
                  for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                  }
                  return outputArray;
                };

                // Subscribe to push notifications
                const subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });

                // Send subscription to server
                const response = await fetch('/api/push/subscribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(subscription)
                });

                if (response.ok) {
                  setNotificationsEnabled(true);
                  setSubscriptionEndpoint(subscription.endpoint);
                  alert(t('subscribedToPushNotifications'));
                } else {
                  throw new Error('Failed to save subscription');
                }
              } catch (error: any) {
                console.error('Error enabling notifications:', error);
                alert(locale === 'es'
                  ? `Error al activar notificaciones: ${error.message}`
                  : locale === 'de'
                    ? `Fehler beim Aktivieren von Benachrichtigungen: ${error.message}`
                    : `Error enabling notifications: ${error.message}`);
              }
            }}
          >
            {notificationsEnabled ? (locale === 'es' ? 'Notificaciones activas' : locale === 'de' ? 'Benachrichtigungen aktiv' : 'Notifications on')
              : (locale === 'es' ? 'Activar notificaciones' : locale === 'de' ? 'Benachrichtigungen aktivieren' : 'Enable notifications')}
          </BaseButton>
        </div>
      </div>

      {viewMode === 'month' && (
        <>
          {/* Month filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <BaseSelect
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
              className="w-full md:w-auto min-w-[200px]"
            >
              <option value="">{locale === 'es' ? 'Todas las categorías' : locale === 'de' ? 'Alle Kategorien' : 'All categories'}</option>
              <option value="environment">{locale === 'es' ? 'Medio Ambiente' : locale === 'de' ? 'Umwelt' : 'Environment'}</option>
              <option value="education">{locale === 'es' ? 'Educación' : locale === 'de' ? 'Bildung' : 'Education'}</option>
              <option value="community">{locale === 'es' ? 'Comunidad' : locale === 'de' ? 'Gemeinschaft' : 'Community'}</option>
              <option value="technology">{locale === 'es' ? 'Tecnología' : locale === 'de' ? 'Technologie' : 'Technology'}</option>
            </BaseSelect>

            <BaseSelect
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full md:w-auto min-w-[200px]"
            >
              <option value="">{locale === 'es' ? 'Todas las ubicaciones' : locale === 'de' ? 'Alle Standorte' : 'All locations'}</option>
              {getUniqueLocations().sort().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </BaseSelect>
          </div>
          {/* Month Navigation */}
          <div className={`${getNavigationClasses('container')} bg-gradient-to-r from-green-600 via-green-700 to-blue-700 rounded-lg p-4 mb-4 shadow-lg`}>
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-md transition-colors text-white font-bold text-xl"
            >
              ←
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {formatMonthYear(currentMonth)}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-md transition-colors text-white font-bold text-xl"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map(day => (
              <div key={day} className={getCalendarClasses('weekDays')}>
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {getDaysInMonth(currentMonth).map((day, index) => {
              const events = day ? getEventsForDate(day) : [];
              const isToday = day && day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={combineClasses(
                    getCalendarClasses('dayCell'),
                    day ? getCalendarClasses('dayCellActive') : getCalendarClasses('dayCellInactive'),
                    isToday ? 'bg-green-50 dark:bg-green-900 border-green-500' : ''
                  )}
                >
                  {day && (
                    <>
                      <div className={combineClasses(
                        'text-sm font-semibold',
                        isToday ? getCalendarClasses('dayNumberToday') : getCalendarClasses('dayNumber')
                      )}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map(event => (
                          <Link
                            key={event.id}
                            href={`/eventos/${event.id}`}
                            className="text-xs px-1.5 py-0.5 rounded cursor-pointer truncate block hover:opacity-95 font-medium"
                            title={event.title}
                            style={{
                              backgroundColor: event.category === 'environment' ? '#dcfce7' : event.category === 'education' ? '#dbeafe' : '#f3e8ff',
                              color: event.category === 'environment' ? '#166534' : event.category === 'education' ? '#1e3a8a' : '#6b21a8'
                            }}
                          >
                            <span className="inline-flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${event.category === 'environment' ? 'bg-green-600' : event.category === 'education' ? 'bg-blue-700' : 'bg-purple-700'
                                }`} />
                              {/* Show time before title if available */}
                              {event.time ? <span className="opacity-90">{event.time}</span> : null}
                              <span className="truncate">{event.title}</span>
                              <span className="ml-1 opacity-90">
                                ({event.registered}/{event.spots})
                              </span>
                            </span>
                          </Link>
                        ))}
                        {events.length > 2 && (
                          <div className={getCalendarClasses('eventText')}>
                            +{events.length - 2} {locale === 'es' ? 'más' : locale === 'de' ? 'mehr' : 'more'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {viewMode === 'list' && (
        <>
          {/* Month Navigation and Filter Toggle */}
          <div className={`${getNavigationClasses('container')} bg-gradient-to-r from-green-600 via-green-700 to-blue-700 rounded-lg p-4 mb-4 shadow-lg`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white/20 rounded-md transition-colors text-white font-bold text-xl"
              >
                ←
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {formatMonthYear(currentMonth)}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white/20 rounded-md transition-colors text-white font-bold text-xl"
              >
                →
              </button>
            </div>
            <BaseButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 text-sm"
            >
              {showFilters
                ? t('hideFiltersLabel')
                : t('showFiltersLabel')
              }
            </BaseButton>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <BaseFilterPanel>
              {/* Search */}
              <div>
                <BaseLabel>
                  {locale === 'es' ? 'Buscar' : locale === 'de' ? 'Suchen' : 'Search'}
                </BaseLabel>
                <BaseInput
                  type="text"
                  value={filters.searchText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters({ ...filters, searchText: val });
                    setSearchCity(val);
                    if (!val.trim()) {
                      setExternalEvents([]);
                    }
                  }}
                  placeholder={t('searchEventsTitlePh')}
                />
              </div>

              {/* Category Filter */}
              <div>
                <BaseLabel>
                  {locale === 'es' ? 'Categoría' : locale === 'de' ? 'Kategorie' : 'Category'}
                </BaseLabel>
                <BaseSelect
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">{locale === 'es' ? 'Todas las categorías' :
                    locale === 'de' ? 'Alle Kategorien' :
                      'All categories'}</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>
                      {category === 'environment' ?
                        (locale === 'es' ? 'Medio Ambiente' :
                          locale === 'de' ? 'Umwelt' : 'Environment') :
                        category === 'education' ?
                          (locale === 'es' ? 'Educación' :
                            locale === 'de' ? 'Bildung' : 'Education') :
                          category === 'community' ?
                            (locale === 'es' ? 'Comunidad' :
                              locale === 'de' ? 'Gemeinschaft' : 'Community') :
                            category}
                    </option>
                  ))}
                </BaseSelect>
              </div>

              {/* Location Filter */}
              <div>
                <BaseLabel>
                  {locale === 'es' ? 'Ubicación' : locale === 'de' ? 'Standort' : 'Location'}
                </BaseLabel>
                <BaseSelect
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <option value="">{locale === 'es' ? 'Todas las ubicaciones' :
                    locale === 'de' ? 'Alle Standorte' :
                      'All locations'}</option>
                  {getUniqueLocations().map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </BaseSelect>
              </div>

              {/* Date Range Filter */}
              <div>
                <BaseLabel>
                  {locale === 'es' ? 'Rango de fechas' : locale === 'de' ? 'Datumsbereich' : 'Date range'}
                </BaseLabel>
                <BaseSelect
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                >
                  <option value="">{locale === 'es' ? 'Todas las fechas' :
                    locale === 'de' ? 'Alle Daten' :
                      'All dates'}</option>
                  <option value="today">{locale === 'es' ? 'Hoy' :
                    locale === 'de' ? 'Heute' : 'Today'}</option>
                  <option value="tomorrow">{locale === 'es' ? 'Mañana' :
                    locale === 'de' ? 'Morgen' : 'Tomorrow'}</option>
                  <option value="week">{locale === 'es' ? 'Esta semana' :
                    locale === 'de' ? 'Diese Woche' : 'This week'}</option>
                  <option value="month">{locale === 'es' ? 'Este mes' :
                    locale === 'de' ? 'Diesen Monat' : 'This month'}</option>
                </BaseSelect>
              </div>

              {/* Spots Available Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="spotsAvailable"
                  checked={filters.spotsAvailable}
                  onChange={(e) => setFilters({ ...filters, spotsAvailable: e.target.checked })}
                  className="mr-2"
                />
                <BaseLabel htmlFor="spotsAvailable" variant="checkbox">
                  {locale === 'es' ? 'Solo con cupos disponibles' :
                    locale === 'de' ? 'Nur mit verfügbaren Plätzen' :
                      'Only with available spots'}
                </BaseLabel>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <BaseButton
                  variant="secondary"
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm"
                >
                  {t('clearFilters')}
                </BaseButton>
              </div>
            </BaseFilterPanel>
          )}

          {/* Filtered Events for Current Month */}
          <div className="space-y-3">
            {getFilteredEvents().map(event => {
              const project = projects.find(p => p.id === event.projectId);
              return (
                <BaseCard key={event.id} variant="default">
                  <div className="flex items-start justify-between gap-4">
                    {/* Event image - Always show on the left */}
                    {(() => {
                      const headerImageSrc = ensureEventImage({
                        image_url: (event as any).image_url,
                        category: (event as any).category || 'community',
                        website: (event as any).website
                      });
                      return (
                        <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-slate-700">
                          <ImageWithFallback
                            src={headerImageSrc || '/assets/default-event.png'}
                            alt={event.title}
                            category={(event as any).category}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/eventos/${event.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-300 transition-colors"
                      >
                        {event.title}
                      </Link>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{event.location}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📅 {event.date.toLocaleDateString()}</span>
                        <span>🕐 {event.time}</span>
                        <span>⏱️ {event.duration}h</span>
                        <span>👥 {event.registered}/{event.spots}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${event.category === 'environment' ? 'bg-green-100 text-green-800' :
                          event.category === 'education' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                          {event.category === 'environment' ?
                            (locale === 'es' ? 'Medio Ambiente' :
                              locale === 'de' ? 'Umwelt' : 'Environment') :
                            event.category === 'education' ?
                              (locale === 'es' ? 'Educación' :
                                locale === 'de' ? 'Bildung' : 'Education') :
                              event.category === 'community' ?
                                (locale === 'es' ? 'Comunidad' :
                                  locale === 'de' ? 'Gemeinschaft' : 'Community') :
                                event.category}
                        </span>
                      </div>
                    </div>
                    <div className={getEventClasses('actions')}>
                      <Link
                        href={`/eventos/${event.id}`}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {t("viewEvent")}
                      </Link>
                      <Link
                        href={`/eventos/${event.id}#join`}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        {t("join")}
                      </Link>
                    </div>
                  </div>
                </BaseCard>
              );
            })}

            {/* Show message if no events match filters */}
            {getFilteredEvents().length === 0 && (
              <BaseEmptyState
                icon="🔍"
                description={t('noEventsFound')}
                action={
                  <BaseButton
                    variant="primary"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    {t('clearFilters')}
                  </BaseButton>
                }
              />
            )}
          </div>
        </>
      )}
    </BaseCard>
  );
}
