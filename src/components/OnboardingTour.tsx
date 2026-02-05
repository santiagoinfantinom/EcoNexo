"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useI18n } from "@/lib/i18n";

export default function OnboardingTour() {
    const { t } = useI18n();

    useEffect(() => {
        // Check if user has seen tour
        const hasSeenTour = localStorage.getItem("econexo_tour_seen");
        if (hasSeenTour) return;

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
        const timer = setTimeout(() => {
            driverObj.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, [t]);

    return null;
}
