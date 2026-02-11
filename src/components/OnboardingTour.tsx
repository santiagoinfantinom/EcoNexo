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
                        element: "#nav-map",
                        popover: {
                            title: t("tourMapTitle") || "Map",
                            description: t("tourMapDesc") || "Explore the map.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-calendario",
                        popover: {
                            title: t("tourCalendarTitle") || "Calendar",
                            description: t("tourCalendarDesc") || "Find events.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-trabajos",
                        popover: {
                            title: t("tourJobsTitle") || "Jobs",
                            description: t("tourJobsDesc") || "Find green jobs.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-chat",
                        popover: {
                            title: t("tourChatTitle") || "Chat",
                            description: t("tourChatDesc") || "Chat with community.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-matching",
                        popover: {
                            title: t("tourMatchingTitle") || "Matching",
                            description: t("tourMatchingDesc") || "Find your match.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-comunidad",
                        popover: {
                            title: t("tourCommunityTitle") || "Community",
                            description: t("tourCommunityDesc") || "Join groups.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-perfil",
                        popover: {
                            title: t("tourProfileTitle") || "Profile",
                            description: t("tourProfileDesc") || "Your achievements.",
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: "#nav-about",
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
                        const res = await fetch('/api/identify');
                        if (res.ok) {
                            const data = await res.json();
                            visitorInfo = {
                                ...visitorInfo,
                                ip: data.ip,
                                lastVisit: new Date().toISOString(),
                                firstVisit: visitorInfo?.firstVisit || new Date().toISOString()
                            };
                            localStorage.setItem("econexo_visitor_info", JSON.stringify(visitorInfo));
                            console.log("Visitor identified:", visitorInfo.ip);
                        }
                    } catch (e) {
                        console.error("Failed to identify visitor via API", e);
                    }
                }
            } catch (err) {
                console.error("Visitor tracking error:", err);
            }
        };

        trackVisitor();

        // CHECK: Has user completed onboarding (preferences)?
        const isOnboarded = localStorage.getItem("econexo_onboarded");
        const introShown = localStorage.getItem("econexo-intro-shown");

        // BLOCKING GUARD: If Intro hasn't been shown AND user isn't onboarded, 
        // the SimpleIntro modal is definitely visible. Do not start tour.
        if (!introShown && !isOnboarded) {
            return;
        }

        // FAIL-SAFE: Check if Intro Modal is currently visible in DOM to prevent overlap
        // This handles race conditions where localStorage might be "true" but modal is still mounting/closing
        const isIntroVisible = document.querySelector('[data-intro-modal="true"]');

        if (isOnboarded && !isIntroVisible) {
            // If already onboarded and intro is NOT visible, start tour check immediately
            startTour();
        } else {
            // ... match existing else block ...
            const handleOnboardingComplete = () => {
                startTour();
                window.removeEventListener('onboarding-completed', handleOnboardingComplete);
            };

            window.addEventListener('onboarding-completed', handleOnboardingComplete);

            return () => {
                window.removeEventListener('onboarding-completed', handleOnboardingComplete);
            };
        }
    }, [t]);

    return null;
}
