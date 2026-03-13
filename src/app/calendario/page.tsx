"use client";
import CalendarView from "@/components/CalendarView";
import { useI18n } from "@/lib/i18n";

export default function CalendarioPage() {
  const { t, locale } = useI18n();
  // CalendarView renders internal mock events; projects param not used here
  const noop = () => {};
  return (
    <main className="p-6 bg-gradient-to-br from-green-600 via-green-700 to-blue-700 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center drop-shadow-lg" style={{
          WebkitTextStroke: '2px white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5), -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white'
        } as React.CSSProperties}>
          {t('calendar') || 'Calendario'}
        </h1>
        <CalendarView projects={[]} onProjectSelect={noop as any} />
      </div>
    </main>
  );
}


