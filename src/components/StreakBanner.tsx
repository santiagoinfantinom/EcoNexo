"use client";

import { useSmartContext } from "@/context/SmartContext";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Trophy, X } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Get streak tier info based on consecutive days
 */
function getStreakTier(streak: number) {
  if (streak >= 30) return { tier: 3, label: '🔥🔥🔥', multiplier: 2.0, color: 'from-orange-500 to-red-600', ring: 'ring-red-500', bg: 'bg-red-500', next: null, nextAt: null };
  if (streak >= 7)  return { tier: 2, label: '🔥🔥',  multiplier: 1.5, color: 'from-orange-400 to-amber-600', ring: 'ring-amber-500', bg: 'bg-amber-500', next: '🔥🔥🔥', nextAt: 30 };
  if (streak >= 3)  return { tier: 1, label: '🔥',    multiplier: 1.2, color: 'from-yellow-400 to-orange-500', ring: 'ring-orange-400', bg: 'bg-orange-400', next: '🔥🔥', nextAt: 7 };
  return { tier: 0, label: '',   multiplier: 1.0, color: 'from-gray-400 to-gray-500', ring: 'ring-gray-400', bg: 'bg-gray-400', next: '🔥', nextAt: 3 };
}

export default function StreakBanner() {
  const { gamification } = useSmartContext();
  const { locale } = useI18n();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || dismissed) return null;

  const streak = gamification.streak || 0;
  const tier = getStreakTier(streak);

  // Don't show banner if streak is 0
  if (streak === 0) return null;

  const streakText = locale === 'es'
    ? `${streak} día${streak !== 1 ? 's' : ''} seguidos`
    : locale === 'de'
      ? `${streak} Tag${streak !== 1 ? 'e' : ''} in Folge`
      : `${streak} day${streak !== 1 ? 's' : ''} streak`;

  const multiplierText = tier.multiplier > 1
    ? `${tier.multiplier}x XP`
    : '';

  const motivationText = tier.next && tier.nextAt
    ? (locale === 'es'
        ? `¡${tier.nextAt - streak} día${(tier.nextAt - streak) !== 1 ? 's' : ''} más para ${tier.next}!`
        : locale === 'de'
          ? `Noch ${tier.nextAt - streak} Tag${(tier.nextAt - streak) !== 1 ? 'e' : ''} bis ${tier.next}!`
          : `${tier.nextAt - streak} more day${(tier.nextAt - streak) !== 1 ? 's' : ''} to ${tier.next}!`)
    : (locale === 'es' ? '¡Racha legendaria!' : locale === 'de' ? 'Legendärer Streak!' : 'Legendary streak!');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className="mx-4 md:mx-auto md:max-w-2xl mt-4 mb-2"
      >
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${tier.color} p-4 shadow-lg`}>
          {/* Animated fire particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {streak >= 3 && (
              <>
                <motion.div
                  animate={{ y: [-20, -60], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  className="absolute bottom-0 left-[15%] w-3 h-3 bg-yellow-300 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [-10, -50], opacity: [0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                  className="absolute bottom-0 left-[45%] w-2 h-2 bg-orange-300 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [-15, -55], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 1 }}
                  className="absolute bottom-0 left-[75%] w-2.5 h-2.5 bg-red-300 rounded-full blur-sm"
                />
              </>
            )}
          </div>

          {/* Content */}
          <div className="relative flex items-center gap-4">
            {/* Fire icon cluster */}
            <div className="flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <Flame className="w-8 h-8 text-white" strokeWidth={2.5} />
              </motion.div>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-black text-lg leading-tight">
                  {tier.label} {streakText}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {multiplierText && (
                  <span className="inline-flex items-center gap-1 bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <Zap className="w-3 h-3" /> {multiplierText}
                  </span>
                )}
                <span className="text-white/80 text-xs font-medium">
                  {motivationText}
                </span>
              </div>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 w-8 h-8 bg-white/15 rounded-full flex items-center justify-center text-white/70 hover:bg-white/25 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar to next tier */}
          {tier.nextAt && (
            <div className="relative mt-3">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((streak / tier.nextAt) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-white/70 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Export the multiplier function so other components (like Eco-Missions) can apply it
 */
export function getStreakMultiplier(streak: number): number {
  return getStreakTier(streak).multiplier;
}
