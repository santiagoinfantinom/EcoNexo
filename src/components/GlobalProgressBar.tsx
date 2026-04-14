"use client";

import Link from "next/link";
import { Flame, Trophy, Target } from "lucide-react";
import { useSmartContext } from "@/context/SmartContext";
import { useI18n } from "@/lib/i18n";

export default function GlobalProgressBar() {
  const { gamification } = useSmartContext();
  const { locale } = useI18n();

  const points = gamification.points || 0;
  const level = gamification.level || 1;
  const streak = gamification.streak || 0;
  const levelProgress = ((points % 1000) / 1000) * 100;
  const nextLevelXP = 1000 - (points % 1000);

  const streakLabel = locale === "es"
    ? `${streak} dias`
    : locale === "de"
      ? `${streak} tage`
      : `${streak} days`;

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/85 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 py-2">
        <div className="flex items-center gap-3 text-white">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            Lv {level}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/80">
              <span className="inline-flex items-center gap-1">
                <Target className="w-3 h-3" />
                {points} XP
              </span>
              <span>{nextLevelXP} XP</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.max(4, levelProgress)}%` }}
              />
            </div>
          </div>
          <Link
            href="/badges"
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-white/20"
          >
            <Flame className="w-3 h-3 text-orange-300" />
            {streakLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

