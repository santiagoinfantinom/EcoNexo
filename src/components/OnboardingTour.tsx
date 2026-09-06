"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { destroyProductTour, startProductTour } from "@/lib/startProductTour";
import { hasSeenProductTour } from "@/lib/onboardingStorage";

/**
 * Listens for manual tour requests (help button) and also auto-starts the
 * tour once, right after a first-time visitor finishes the language +
 * preferences onboarding. `hasSeenProductTour()` (backed by the
 * `econexo_tour_seen` localStorage flag, set once the tour is dismissed or
 * completed) guarantees this only ever happens on the very first visit.
 */
export default function OnboardingTour() {
  const { t } = useI18n();

  useEffect(() => {
    const onLocaleChange = () => destroyProductTour();
    const onStartTour = () => {
      void startProductTour(t);
    };
    const onOnboardingCompleted = () => {
      if (hasSeenProductTour()) return;
      window.setTimeout(() => void startProductTour(t), 900);
    };

    window.addEventListener("econexo-locale-changed", onLocaleChange);
    window.addEventListener("econexo-start-tour", onStartTour);
    window.addEventListener("onboarding-completed", onOnboardingCompleted);

    return () => {
      window.removeEventListener("econexo-locale-changed", onLocaleChange);
      window.removeEventListener("econexo-start-tour", onStartTour);
      window.removeEventListener("onboarding-completed", onOnboardingCompleted);
      destroyProductTour();
    };
  }, [t]);

  return null;
}
