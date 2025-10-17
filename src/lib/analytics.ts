import { usePlausible } from 'next-plausible';

export type AnalyticsEventProps = Record<string, string | number | boolean | null | undefined>;

// Hook for components
export function useAnalytics() {
  const plausible = usePlausible();
  
  return {
    trackEvent: (eventName: string, props?: AnalyticsEventProps) => {
      try {
        if (props) {
          plausible(eventName, { props });
        } else {
          plausible(eventName);
        }
      } catch {}
    }
  };
}

// Standalone function for non-component usage
export function trackEvent(eventName: string, props?: AnalyticsEventProps) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.plausible === 'function') {
      if (props) {
        window.plausible(eventName, { props });
      } else {
        window.plausible(eventName);
      }
    }
  } catch {}
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsEventProps }) => void;
  }
}


