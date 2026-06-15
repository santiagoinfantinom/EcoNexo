"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { destroyProductTour, startProductTour } from "@/lib/startProductTour";

/** Listens for manual tour requests — no auto-start on page load. */
export default function OnboardingTour() {
  const { t } = useI18n();

  useEffect(() => {
    const onLocaleChange = () => destroyProductTour();
    const onStartTour = () => {
      void startProductTour(t);
    };

    window.addEventListener("econexo-locale-changed", onLocaleChange);
    window.addEventListener("econexo-start-tour", onStartTour);

    return () => {
      window.removeEventListener("econexo-locale-changed", onLocaleChange);
      window.removeEventListener("econexo-start-tour", onStartTour);
      destroyProductTour();
    };
  }, [t]);

  return null;
}
