"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Compass,
    Calendar,
    Heart,
    Rocket,
    Users,
    AlertTriangle,
    X
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function GreenCompass() {
    const router = useRouter();
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const menuItems = [
        {
            icon: <Calendar size={20} />,
            label: t("createEvent") || "Crear Evento",
            action: () => router.push("/eventos?create=true"),
            color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
        },
        {
            icon: <Heart size={20} />,
            label: t("supportInitiatives") || "Apoyar Iniciativas",
            action: () => router.push("/impact"),
            color: "text-rose-500 bg-rose-100 dark:bg-rose-900/30"
        },
        {
            icon: <Rocket size={20} />,
            label: t("proposeProject") || "Proponer Proyecto",
            action: () => router.push("/proyectos/nuevo"),
            color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
        },
        {
            icon: <Users size={20} />,
            label: t("searchVolunteering") || "Buscar Voluntariado",
            action: () => router.push("/trabajos?type=volunteering"),
            color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30"
        },
        {
            icon: <AlertTriangle size={20} />,
            label: t("reportProblem") || "Reportar Problema",
            action: () => router.push("/chat?report=true"),
            color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30"
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">
            {/* Menu Items */}
            {isOpen && (
                <div className="flex flex-col items-end gap-3 mb-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-emerald-100 dark:border-white/5 text-slate-700 dark:text-slate-100 hover:scale-105 transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="font-bold text-xs whitespace-nowrap">{item.label}</span>
                            <span className={`p-2 rounded-xl ${item.color}`}>
                                {item.icon}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500 transform ${isOpen
                    ? "bg-slate-900 text-white rotate-[135deg] scale-90"
                    : "bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 text-white hover:scale-110 active:scale-95"
                    }`}
                aria-label="EcoActions"
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <Compass size={28} className="animate-pulse-slow" />
                )}

                {/* Glow & Ping Effects */}
                {!isOpen && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
                        <div className="absolute inset-[-4px] rounded-full border-2 border-emerald-400/20 animate-pulse"></div>
                    </>
                )}
            </button>
        </div>
    );
}
