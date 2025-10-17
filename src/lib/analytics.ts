export type AnalyticsEventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsEventProps }) => void;
  }
}

export function trackEvent(eventName: string, props?: AnalyticsEventProps) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, props ? { props } : undefined);
    }
  } catch {}
}


