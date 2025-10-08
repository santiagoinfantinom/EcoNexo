"use client";
import CalendarView from "@/components/CalendarView";

export default function CalendarioPage() {
  // CalendarView renders internal mock events; projects param not used here
  const noop = () => {};
  return (
    <main className="p-6">
      <div className="container mx-auto">
        <CalendarView projects={[]} onProjectSelect={noop as any} />
      </div>
    </main>
  );
}


