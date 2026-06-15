"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Info } from "lucide-react";

type HeroImpactMetricsProps = {
  trees: number;
  volunteers: number;
  co2: number;
};

export default function HeroImpactMetrics({ trees, volunteers, co2 }: HeroImpactMetricsProps) {
  const { t } = useI18n();

  const stats = [
    { value: trees.toLocaleString(), label: t("impactStatInitiatives"), color: "text-green-600" },
    { value: `${volunteers.toLocaleString()}+`, label: t("impactStatPeople"), color: "text-blue-600" },
    { value: co2.toLocaleString(), label: t("impactStatCo2"), color: "text-purple-600" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-100">
          {t("impactDemoBadge")}
        </span>
        <Link
          href="/about#impact-methodology"
          className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 underline-offset-2 hover:text-white hover:underline"
        >
          <Info className="h-3.5 w-3.5" />
          {t("impactMethodologyLink")}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-6 text-center transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
            <p className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
