"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Plus, Map as MapIcon, Users, Rocket, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function GreenCompass() {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [suggestion, setSuggestion] = useState<{
        icon: React.ReactNode;
        label: string;
        action: () => void;
    } | null>(null);

    // Determine suggestion based on route
    useEffect(() => {
        if (pathname === "/" || pathname === "/explore") {
            setSuggestion({
                icon: <MapIcon size={20} />,
                label: t("explore") || "Explorar",
                action: () => {
                    const mapElement = document.getElementById("map");
                    if (mapElement) {
                        mapElement.scrollIntoView({ behavior: "smooth" });
                    } else {
                        router.push("/#map");
                    }
                },
            });
        } else if (pathname.startsWith("/eventos")) {
            setSuggestion({
                icon: <Plus size={20} />,
                label: t("createEvent") || "Crear Evento",
                action: () => router.push("/eventos?create=true"), // Assuming query param or modal trigger
            });
        } else if (pathname.startsWith("/proyectos")) {
            setSuggestion({
                icon: <Rocket size={20} />,
                label: t("publishProject") || "Iniciar Proyecto",
                action: () => router.push("/proyectos/nuevo"),
            });
        } else if (pathname.startsWith("/trabajos")) {
            setSuggestion({
                icon: <Briefcase size={20} />,
                label: "Publicar Empleo", // Add i18n key later
                action: () => router.push("/trabajos/nuevo"),
            });
        } else if (pathname.startsWith("/comunidad")) {
            setSuggestion({
                icon: <Users size={20} />,
                label: t("searchGroups") || "Grupos",
                action: () => router.push("/comunidad/grupos"),
            });
        } else {
            setSuggestion({
                icon: <Compass size={20} />,
                label: t("explore") || "Explorar",
                action: () => router.push("/"),
            });
        }
    }, [pathname, router, t]);

    const toggleOpen = () => setIsOpen(!isOpen);

    if (!suggestion) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="mb-2 mr-1"
                    >
                        <button
                            onClick={suggestion.action}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-100 hover:scale-105 transition-transform"
                        >
                            <span className="font-semibold text-sm">{suggestion.label}</span>
                            <span className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                                {suggestion.icon}
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen
                        ? "bg-slate-800 text-white rotate-45"
                        : "bg-gradient-to-br from-emerald-400 to-teal-600 text-white"
                    }`}
            >
                {isOpen ? (
                    <Plus size={28} />
                ) : (
                    <Compass size={28} className="animate-pulse-slow" />
                )}

                {/* Ping animation when closed */}
                {!isOpen && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
                )}
            </motion.button>
        </div>
    );
}
