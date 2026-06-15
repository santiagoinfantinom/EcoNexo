const INTRO_KEY = "econexo-intro-shown";
const TOUR_KEY = "econexo_tour_seen";
const LOCALE_KEY = "econexo:locale";

export function hasCompletedLanguageIntro(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(INTRO_KEY) === "true";
}

export function markLanguageIntroComplete(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTRO_KEY, "true");
  window.dispatchEvent(new Event("intro-completed"));
}

export function hasSeenProductTour(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(TOUR_KEY) === "true";
}

export function markProductTourComplete(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOUR_KEY, "true");
}

export function hasSavedLocale(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem(LOCALE_KEY);
  return saved === "es" || saved === "en" || saved === "de";
}
