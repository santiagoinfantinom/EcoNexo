import { driver, type Driver } from "driver.js";
import {
  buildAnchoredSteps,
  DESKTOP_TOUR_ANCHORS,
  isMobileViewport,
  MOBILE_TOUR_ANCHORS,
  scrollTourTargetIntoView,
} from "@/lib/productTour";
import { markProductTourComplete } from "@/lib/onboardingStorage";

let activeDriver: Driver | null = null;

export function destroyProductTour() {
  activeDriver?.destroy();
  activeDriver = null;
}

export async function startProductTour(translate: (key: string) => string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (document.querySelector('[data-intro-modal="true"]')) return false;

  destroyProductTour();

  const anchors = isMobileViewport() ? MOBILE_TOUR_ANCHORS : DESKTOP_TOUR_ANCHORS;
  const anchoredSteps = await buildAnchoredSteps(anchors, translate);
  if (anchoredSteps.length === 0) return false;

  const driverObj = driver({
    showProgress: true,
    allowClose: true,
    animate: true,
    smoothScroll: true,
    overlayOpacity: 0.72,
    stagePadding: 10,
    stageRadius: 12,
    popoverOffset: 14,
    popoverClass: "econexo-tour-popover",
    doneBtnText: translate("tourDone") || "Done",
    nextBtnText: translate("tourNext") || "Next",
    prevBtnText: translate("tourPrev") || "Previous",
    progressText: "{{current}} / {{total}}",
    steps: [
      {
        popover: {
          title: translate("tourWelcomeTitle") || "Welcome!",
          description: translate("tourWelcomeDesc") || "A quick guide to EcoNexo.",
          side: "over",
          align: "center",
        },
      },
      ...anchoredSteps,
    ],
    onHighlightStarted: (element) => {
      scrollTourTargetIntoView(element);
    },
    onDestroyed: () => {
      markProductTourComplete();
      activeDriver = null;
    },
    onCloseClick: () => {
      driverObj.destroy();
      markProductTourComplete();
      activeDriver = null;
    },
  });

  activeDriver = driverObj;
  driverObj.drive();
  return true;
}

export function requestProductTour() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("econexo-start-tour"));
  }
}
