"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

type CalendarViewProps = {
  projects: any[];
  onProjectSelect: (project: any) => void;
};

export default function CalendarView({ projects, onProjectSelect }: CalendarViewProps) {
  const { t, locale } = useI18n();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');

  // Mock events data - localized based on current locale (2025)
  const mockEvents = [
    // January 2025
    {
      id: 'e1',
      projectId: 'p1',
      title: locale === 'es' ? 'Plantación de árboles nativos' : 
             locale === 'de' ? 'Einheimische Baumpflanzung' : 'Native tree planting',
      date: new Date(2025, 0, 15), // January 15, 2025
      time: '09:00',
      duration: 3,
      spots: 30,
      registered: 12,
      location: locale === 'es' ? 'Bosque Urbano Norte, Berlín' :
                locale === 'de' ? 'Stadtwald Nord, Berlin' : 'North Urban Forest, Berlin',
      category: 'environment',
      organizer: locale === 'es' ? 'Green City Initiative' : locale === 'de' ? 'Grüne Stadt Initiative' : 'Green City Initiative'
    },
    {
      id: 'e2',
      projectId: 'p2',
      title: locale === 'es' ? 'Taller de energía solar' :
             locale === 'de' ? 'Solar-Energie Workshop' : 'Solar energy workshop',
      date: new Date(2025, 0, 22), // January 22, 2025
      time: '14:00',
      duration: 3,
      spots: 20,
      registered: 15,
      location: locale === 'es' ? 'Centro de Innovación Verde, Madrid' :
                locale === 'de' ? 'Grünes Innovationszentrum, Madrid' : 'Green Innovation Center, Madrid',
      category: 'education',
      organizer: locale === 'es' ? 'SolarTech Academy' : locale === 'de' ? 'SolarTech Akademie' : 'SolarTech Academy'
    },

    // February 2025
    {
      id: 'e3',
      projectId: 'p3',
      title: locale === 'es' ? 'Mercado de productos locales' :
             locale === 'de' ? 'Lokaler Produktmarkt' : 'Local products market',
      date: new Date(2025, 1, 8), // February 8, 2025
      time: '10:00',
      duration: 6,
      spots: 40,
      registered: 25,
      location: locale === 'es' ? 'Plaza del Mercado, Barcelona' :
                locale === 'de' ? 'Marktplatz, Barcelona' : 'Market Square, Barcelona',
      category: 'community',
      organizer: locale === 'es' ? 'Asociación de Productores Locales' : locale === 'de' ? 'Vereinigung lokaler Produzenten' : 'Local Producers Association'
    },
    {
      id: 'e4',
      projectId: 'p4',
      title: locale === 'es' ? 'Limpieza de río' :
             locale === 'de' ? 'Flussreinigung' : 'River cleanup',
      date: new Date(2025, 1, 14), // February 14, 2025
      time: '08:00',
      duration: 3,
      spots: 25,
      registered: 18,
      location: locale === 'es' ? 'Río Verde, Milán' :
                locale === 'de' ? 'Grüner Fluss, Mailand' : 'Green River, Milan',
      category: 'environment',
      organizer: locale === 'es' ? 'Guardianes del Río' : locale === 'de' ? 'Flusswächter' : 'River Guardians'
    },

    // March 2025
    {
      id: 'e5',
      projectId: 'p5',
      title: locale === 'es' ? 'Conferencia sobre cambio climático' :
             locale === 'de' ? 'Klimawandel-Konferenz' : 'Climate change conference',
      date: new Date(2025, 2, 5), // March 5, 2025
      time: '18:00',
      duration: 2,
      spots: 200,
      registered: 150,
      location: locale === 'es' ? 'Auditorio Municipal, París' :
                locale === 'de' ? 'Stadtauditorium, Paris' : 'City Auditorium, Paris',
      category: 'education',
      organizer: locale === 'es' ? 'Instituto Climático Local' : locale === 'de' ? 'Lokales Klimainstitut' : 'Local Climate Institute'
    },
    {
      id: 'e6',
      projectId: 'p6',
      title: locale === 'es' ? 'Construcción de jardines verticales' :
             locale === 'de' ? 'Vertikale Gartenbau' : 'Vertical garden building',
      date: new Date(2025, 2, 18), // March 18, 2025
      time: '10:00',
      duration: 5,
      spots: 15,
      registered: 8,
      location: locale === 'es' ? 'Edificio Comercial Centro, Londres' :
                locale === 'de' ? 'Zentrum Geschäftsgebäude, London' : 'Downtown Commercial Building, London',
      category: 'environment',
      organizer: locale === 'es' ? 'Urban Green Solutions' : locale === 'de' ? 'Städtische Grüne Lösungen' : 'Urban Green Solutions'
    },

    // April 2025
    {
      id: 'e7',
      projectId: 'p1',
      title: locale === 'es' ? 'Taller de compostaje' :
             locale === 'de' ? 'Kompostierungs-Workshop' : 'Composting workshop',
      date: new Date(2025, 3, 12), // April 12, 2025
      time: '15:00',
      duration: 2,
      spots: 20,
      registered: 16,
      location: locale === 'es' ? 'Jardín Comunitario Sur, Berlín' :
                locale === 'de' ? 'Südlicher Gemeinschaftsgarten, Berlin' : 'South Community Garden, Berlin',
      category: 'education',
      organizer: locale === 'es' ? 'Compost Masters' : locale === 'de' ? 'Kompost-Meister' : 'Compost Masters'
    },
    {
      id: 'e8',
      projectId: 'p2',
      title: locale === 'es' ? 'Carrera ecológica 5K' :
             locale === 'de' ? 'Ökologischer 5K-Lauf' : 'Eco-friendly 5K run',
      date: new Date(2025, 3, 22), // April 22, 2025 (Earth Day)
      time: '08:00',
      duration: 2,
      spots: 100,
      registered: 75,
      location: locale === 'es' ? 'Parque Central, Madrid' :
                locale === 'de' ? 'Zentralpark, Madrid' : 'Central Park, Madrid',
      category: 'community',
      organizer: locale === 'es' ? 'Runners Verdes' : locale === 'de' ? 'Grüne Läufer' : 'Green Runners'
    },

    // May 2025
    {
      id: 'e9',
      projectId: 'p3',
      title: locale === 'es' ? 'Instalación de paneles solares' :
             locale === 'de' ? 'Solarpanel-Installation' : 'Solar panel installation',
      date: new Date(2025, 4, 10), // May 10, 2025
      time: '09:00',
      duration: 7,
      spots: 12,
      registered: 9,
      location: locale === 'es' ? 'Escuela Primaria Verde, Barcelona' :
                locale === 'de' ? 'Grüne Grundschule, Barcelona' : 'Green Elementary School, Barcelona',
      category: 'environment',
      organizer: locale === 'es' ? 'Solar Community' : locale === 'de' ? 'Solar-Gemeinschaft' : 'Solar Community'
    },
    {
      id: 'e10',
      projectId: 'p4',
      title: locale === 'es' ? 'Festival de sostenibilidad' :
             locale === 'de' ? 'Nachhaltigkeitsfestival' : 'Sustainability festival',
      date: new Date(2025, 4, 25), // May 25, 2025
      time: '16:00',
      duration: 6,
      spots: 200,
      registered: 120,
      location: locale === 'es' ? 'Centro Cultural, Milán' :
                locale === 'de' ? 'Kulturzentrum, Mailand' : 'Cultural Center, Milan',
      category: 'community',
      organizer: locale === 'es' ? 'Festival Verde' : locale === 'de' ? 'Grünes Festival' : 'Green Festival'
    },

    // June 2025
    {
      id: 'e11',
      projectId: 'p5',
      title: locale === 'es' ? 'Monitoreo de calidad del aire' :
             locale === 'de' ? 'Luftqualitätsüberwachung' : 'Air quality monitoring',
      date: new Date(2025, 5, 8), // June 8, 2025
      time: '13:00',
      duration: 4,
      spots: 8,
      registered: 6,
      location: locale === 'es' ? 'Distrito Industrial, París' :
                locale === 'de' ? 'Industriegebiet, Paris' : 'Industrial District, Paris',
      category: 'environment',
      organizer: locale === 'es' ? 'Aire Limpio' : locale === 'de' ? 'Saubere Luft' : 'Clean Air'
    },
    {
      id: 'e12',
      projectId: 'p6',
      title: locale === 'es' ? 'Cena vegana comunitaria' :
             locale === 'de' ? 'Gemeinschaftliches veganes Abendessen' : 'Community vegan dinner',
      date: new Date(2025, 5, 21), // June 21, 2025 (Summer Solstice)
      time: '19:00',
      duration: 2,
      spots: 50,
      registered: 35,
      location: locale === 'es' ? 'Restaurante Verde, Londres' :
                locale === 'de' ? 'Grünes Restaurant, London' : 'Green Restaurant, London',
      category: 'community',
      organizer: locale === 'es' ? 'Veganos Unidos' : locale === 'de' ? 'Vereinte Veganer' : 'United Vegans'
    },

    // July 2025
    {
      id: 'e13',
      projectId: 'p1',
      title: locale === 'es' ? 'Reflexión semestral ambiental' :
             locale === 'de' ? 'Halbjährliche Umweltreflexion' : 'Semi-annual environmental reflection',
      date: new Date(2025, 6, 15), // July 15, 2025
      time: '17:00',
      duration: 2,
      spots: 40,
      registered: 28,
      location: locale === 'es' ? 'Biblioteca Pública, Berlín' :
                locale === 'de' ? 'Öffentliche Bibliothek, Berlin' : 'Public Library, Berlin',
      category: 'education',
      organizer: locale === 'es' ? 'Futuro Verde' : locale === 'de' ? 'Grüne Zukunft' : 'Green Future'
    },
    {
      id: 'e14',
      projectId: 'p2',
      title: locale === 'es' ? 'Celebración de verano sostenible' :
             locale === 'de' ? 'Nachhaltige Sommerfeier' : 'Sustainable summer celebration',
      date: new Date(2025, 6, 30), // July 30, 2025
      time: '20:00',
      duration: 4,
      spots: 150,
      registered: 90,
      location: locale === 'es' ? 'Plaza Principal, Madrid' :
                locale === 'de' ? 'Hauptplatz, Madrid' : 'Main Square, Madrid',
      category: 'community',
      organizer: locale === 'es' ? 'Verano Verde' : locale === 'de' ? 'Grüner Sommer' : 'Green Summer'
    }
  ];

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
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const weekDays = locale === 'es' ? 
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] :
    locale === 'de' ?
    ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] :
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg border p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{t("calendar")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'month' 
                ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t("month")}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t("list")}
          </button>
        </div>
      </div>

      {viewMode === 'month' && (
        <>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              ←
            </button>
            <h3 className="text-lg font-medium">{formatMonthYear(currentMonth)}</h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
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
                  className={`min-h-[80px] p-1 border border-gray-200 ${
                    day ? 'bg-white hover:bg-gray-50' : 'bg-gray-100'
                  } ${isToday ? 'bg-green-100 border-green-300' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium ${isToday ? 'text-green-700' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map(event => (
                          <Link
                            key={event.id}
                            href={`/eventos/${event.id}`}
                            className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded cursor-pointer hover:bg-blue-200 truncate block"
                            title={event.title}
                          >
                            {event.title}
                          </Link>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} más
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
        <div className="space-y-3">
          {mockEvents.map(event => {
            const project = projects.find(p => p.id === event.projectId);
            return (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link 
                      href={`/eventos/${event.id}`}
                      className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {event.title}
                    </Link>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>📅 {event.date.toLocaleDateString()}</span>
                      <span>🕐 {event.time}</span>
                      <span>⏱️ {event.duration}h</span>
                      <span>👥 {event.registered}/{event.spots}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/eventos/${event.id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {t("viewEvent")}
                    </Link>
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                      {t("join")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
