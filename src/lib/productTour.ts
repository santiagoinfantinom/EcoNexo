import type { DriveStep, Side } from "driver.js";

export type TourAnchor = {
  /** First visible selector wins */
  selectors: string[];
  titleKey: string;
  descKey: string;
  side: Side;
  align?: "start" | "center" | "end";
};

export function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

export async function waitForVisibleSelector(
  selector: string,
  maxAttempts = 24,
  intervalMs = 125
): Promise<HTMLElement | null> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
      return el;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null;
}

export async function resolveVisibleSelector(
  selectors: string[]
): Promise<string | undefined> {
  for (const selector of selectors) {
    const el = await waitForVisibleSelector(selector, 8, 100);
    if (el) return selector;
  }
  return undefined;
}

export function scrollTourTargetIntoView(element?: Element) {
  if (!element || !("scrollIntoView" in element)) return;
  (element as HTMLElement).scrollIntoView({
    block: "center",
    inline: "nearest",
    behavior: "smooth",
  });
}

export async function buildAnchoredSteps(
  anchors: TourAnchor[],
  translate: (key: string) => string
): Promise<DriveStep[]> {
  const steps: DriveStep[] = [];

  for (const anchor of anchors) {
    const element = await resolveVisibleSelector(anchor.selectors);
    if (!element) continue;

    steps.push({
      element,
      popover: {
        title: translate(anchor.titleKey),
        description: translate(anchor.descKey),
        side: anchor.side,
        align: anchor.align ?? "center",
      },
    });
  }

  return steps;
}

export const MOBILE_TOUR_ANCHORS: TourAnchor[] = [
  {
    selectors: ['[data-tour="home-map"]', '[data-tour="tab-home"]'],
    titleKey: "tourMapTitle",
    descKey: "tourMapDesc",
    side: "top",
    align: "center",
  },
  {
    selectors: ['[data-tour="tab-events"]'],
    titleKey: "tourCalendarTitle",
    descKey: "tourCalendarDesc",
    side: "top",
    align: "center",
  },
  {
    selectors: ['[data-tour="tab-community"]'],
    titleKey: "tourCommunityTitle",
    descKey: "tourCommunityDesc",
    side: "top",
    align: "center",
  },
  {
    selectors: ['[data-tour="tab-profile"]'],
    titleKey: "tourProfileTitle",
    descKey: "tourProfileDesc",
    side: "top",
    align: "center",
  },
];

export const DESKTOP_TOUR_ANCHORS: TourAnchor[] = [
  {
    selectors: ['[data-tour="home-map"]', '[data-tour="nav-map"]'],
    titleKey: "tourMapTitle",
    descKey: "tourMapDesc",
    side: "bottom",
    align: "start",
  },
  {
    selectors: ['[data-tour="nav-calendar"]'],
    titleKey: "tourCalendarTitle",
    descKey: "tourCalendarDesc",
    side: "bottom",
    align: "start",
  },
  {
    selectors: ['[data-tour="nav-jobs"]'],
    titleKey: "tourJobsTitle",
    descKey: "tourJobsDesc",
    side: "bottom",
    align: "start",
  },
  {
    selectors: ['[data-tour="nav-chat"]'],
    titleKey: "tourChatTitle",
    descKey: "tourChatDesc",
    side: "left",
    align: "center",
  },
  {
    selectors: ['[data-tour="nav-profile"]'],
    titleKey: "tourProfileTitle",
    descKey: "tourProfileDesc",
    side: "left",
    align: "center",
  },
];
