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

  // Mock events data - localized based on current locale
  const mockEvents = [
    {
      id: 'e1',
      projectId: 'p1',
      title: locale === 'es' ? 'Plantación de árboles' : 
             locale === 'de' ? 'Baumpflanzung' : 'Tree planting',
      date: new Date(2024, 11, 15), // December 15, 2024
      time: '09:00',
      duration: 4,
      spots: 20,
      registered: 15,
      location: locale === 'es' ? 'Parque Central, Berlín' :
                locale === 'de' ? 'Zentralpark, Berlin' : 'Central Park, Berlin'
    },
    {
      id: 'e2',
      projectId: 'p2',
      title: locale === 'es' ? 'Taller de robótica' :
             locale === 'de' ? 'Robotik-Workshop' : 'Robotics workshop',
      date: new Date(2024, 11, 18),
      time: '14:00',
      duration: 3,
      spots: 15,
      registered: 8,
      location: locale === 'es' ? 'Centro Comunitario, Madrid' :
                locale === 'de' ? 'Gemeinschaftszentrum, Madrid' : 'Community Center, Madrid'
    },
    {
      id: 'e3',
      projectId: 'p3',
      title: locale === 'es' ? 'Clínica móvil' :
             locale === 'de' ? 'Mobile Klinik' : 'Mobile clinic',
      date: new Date(2024, 11, 22),
      time: '10:00',
      duration: 6,
      spots: 30,
      registered: 25,
      location: locale === 'es' ? 'Plaza Mayor, Milán' :
                locale === 'de' ? 'Hauptplatz, Mailand' : 'Main Square, Milan'
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
                          <div
                            key={event.id}
                            onClick={() => onProjectSelect(projects.find(p => p.id === event.projectId))}
                            className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded cursor-pointer hover:bg-blue-200 truncate"
                            title={event.title}
                          >
                            {event.title}
                          </div>
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
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>📅 {event.date.toLocaleDateString()}</span>
                      <span>🕐 {event.time}</span>
                      <span>⏱️ {event.duration}h</span>
                      <span>👥 {event.registered}/{event.spots}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onProjectSelect(project)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      {t("viewProject")}
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
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
