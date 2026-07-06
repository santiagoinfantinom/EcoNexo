"use client";
import { useI18n } from "@/lib/i18n";

export default function DashboardStatsCards() {
  const { t } = useI18n();

  const stats = [
    {
      number: "4",
      label: t('activeProjects')
    },
    {
      number: "490", 
      label: t('connectedVolunteers')
    },
    {
      number: "110",
      label: t('availableSpots')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-yellow-400 rounded-xl p-6 text-center shadow-lg">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {stat.number}
          </div>
          <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
