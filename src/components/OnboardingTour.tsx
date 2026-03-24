"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useI18n } from "@/lib/i18n";

export default function OnboardingTour() {
    const { t } = useI18n();

    useEffect(() => {
        // Function to start the tour
        const startTour = () => {
            // Check if user has seen the tour
            const tourSeen = localStorage.getItem("econexo_tour_seen");

            if (tourSeen) {
                return;
            }

            const getNavSelector = (baseId: string) => {
                // Return whichever version of the link is actually visible.
                const desktopId = `#nav-${baseId}`;
                const mdId = `#nav-md-${baseId}`;

                // Get elements
                const desktopEl = document.querySelector(desktopId);
                const mdEl = document.querySelector(mdId);

                // Return the desktop element if it exists and has layout width (is visible)
                if (desktopEl && (desktopEl as HTMLElement).offsetWidth > 0) return desktopId;
                if (mdEl && (mdEl as HTMLElement).offsetWidth > 0) return mdId;

                // Fallback to mobile button if we're on small screens
                return "#mobile-menu-button";
            };

            // Initialize driver
            const driverObj = driver({
                showProgress: true,
                allowClose: true,
                animate: true,
                doneBtnText: t("tourDone") || "Done",
                nextBtnText: t("tourNext") || "Next",
                prevBtnText: t("tourPrev") || "Previous",
                progressText: "{{current}} / {{total}}",
                steps: [
                    {
                        popover: {
                            title: t("tourWelcomeTitle") || "Welcome!",
                            description: t("tourWelcomeDesc") || "Let's take a quick tour.",
                            align: 'center'
                        }
                    },
                    {
                        element: getNavSelector("map"),
                        popover: {
                            title: t("tourMapTitle") || "Map",
                            description: t("tourMapDesc") || "Explore the map.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("noticias"),
                        popover: {
                            title: t("news") || "Noticias",
                            description: t("tourNewsDesc") || "Stay updated with the latest news.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("calendario"),
                        popover: {
                            title: t("tourCalendarTitle") || "Calendar",
                            description: t("tourCalendarDesc") || "Find events.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("trabajos"),
                        popover: {
                            title: t("tourJobsTitle") || "Jobs",
                            description: t("tourJobsDesc") || "Find green jobs.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("chat"),
                        popover: {
                            title: t("tourChatTitle") || "Chat",
                            description: t("tourChatDesc") || "Chat with community.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("matching"),
                        popover: {
                            title: t("tourMatchingTitle") || "Matching",
                            description: t("tourMatchingDesc") || "Find your match.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("comunidad"),
                        popover: {
                            title: t("tourCommunityTitle") || "Community",
                            description: t("tourCommunityDesc") || "Join groups.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("perfil"),
                        popover: {
                            title: t("tourProfileTitle") || "Profile",
                            description: t("tourProfileDesc") || "Your achievements.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: getNavSelector("about"),
                        popover: {
                            title: t("tourAboutTitle") || "About",
                            description: t("tourAboutDesc") || "Learn more.",
                            side: "bottom",
                            align: 'start'
                        }
                    }
                ],
                onDestroyed: () => {
                    localStorage.setItem("econexo_tour_seen", "true");
                }
            });

            // Start tour after a short delay to ensure elements are rendered/hydrated
            setTimeout(() => {
                driverObj.drive();
            }, 1000);
        };

        // Visitor Tracking Logic (IP & Visit History)
        const trackVisitor = async () => {
            try {
                const storedInfo = localStorage.getItem("econexo_visitor_info");
                let visitorInfo = storedInfo ? JSON.parse(storedInfo) : null;

                // If we don't have IP or it's been > 24h, refresh identification
                if (!visitorInfo || !visitorInfo.ip || (Date.now() - new Date(visitorInfo.lastVisit).getTime() > 86400000)) {
                    try {
                        const res = await fetch('https://api.ipify.org?format=json');
                        if (res.ok) {
                            const data = await res.json();
                            visitorInfo = {
                                ...visitorInfo,
                                ip: data.ip,
                                lastVisit: new Date().toISOString(),
                                firstVisit: visitorInfo?.firstVisit || new Date().toISOString()
                            };
                            localStorage.setItem("econexo_visitor_info", JSON.stringify(visitorInfo));
                            console.log("Visitor identified via client-side service:", visitorInfo.ip);
                        }
                    } catch (e) {
                        console.warn("Failed to identify visitor via public API, continuing...", e);
                    }
                }
            } catch (err) {
                console.error("Visitor tracking error:", err);
            }
        };

        trackVisitor();

        // CHECK: Has user completed intro?
        const introShown = localStorage.getItem("econexo-intro-shown");

        const handleIntroComplete = () => {
            startTour();
            window.removeEventListener('intro-completed', handleIntroComplete);
        };

        // BLOCKING GUARD: If Intro hasn't been shown, 
        // the SimpleIntro modal is definitely visible. Wait for it.
        if (!introShown) {
            window.addEventListener('intro-completed', handleIntroComplete);
            return () => {
                window.removeEventListener('intro-completed', handleIntroComplete);
            };
        }

        // FAIL-SAFE: Check if Intro Modal is currently visible in DOM to prevent overlap
        // This handles race conditions where localStorage might be "true" but modal is still mounting/closing
        const isIntroVisible = document.querySelector('[data-intro-modal="true"]');

        if (!isIntroVisible) {
            // If already onboarded and intro is NOT visible, start tour check immediately
            startTour();
        } else {
            window.addEventListener('intro-completed', handleIntroComplete);
            return () => {
                window.removeEventListener('intro-completed', handleIntroComplete);
            };
        }
    }, [t]);

    return null;
}
