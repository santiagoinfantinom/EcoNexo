"use client";
import React, { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { WORKSHOPS, Workshop } from "@/data/workshops";
import {
    Search,
    MapPin,
    Calendar,
    Clock,
    Users,
    ExternalLink,
    Filter,
    ChevronRight,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import WorkshopDetailModal from "@/components/WorkshopDetailModal";

export default function WorkshopsPage() {
    const { t, locale } = useI18n();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (ws: Workshop) => {
        setSelectedWorkshop(ws);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const categories = useMemo(() => {
        const cats = Array.from(new Set(WORKSHOPS.map((ws) => ws.category)));
        return ["All", ...cats];
    }, []);

    const filteredWorkshops = useMemo(() => {
        return WORKSHOPS.filter((ws) => {
            const matchesSearch =
                ws.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ws.title_de.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ws.title_fr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ws.location_en.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === "All" || ws.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const getLocalizedValue = (ws: Workshop, key: "title" | "description" | "location") => {
        const language = locale as string;
        if (locale === "es") return ws[key];
        if (locale === "de") return ws[`${key}_de` as keyof Workshop] as string;
        if (language === "fr" && ws[`${key}_fr` as keyof Workshop]) return ws[`${key}_fr` as keyof Workshop] as string;
        return ws[`${key}_en` as keyof Workshop] as string;
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-8">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4 animate-fade-in">
                    <Sparkles className="w-3 h-3" />
                    <span>{t("new") || "Nuevo"}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {t("coursesAndWorkshops") || "Cursos y Talleres"}
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    {t("coursesAndWorkshopsDesc") || "Aprende habilidades para un futuro sostenible con expertos de toda Europa."}
                </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder={t("searchPlaceholder") || "Buscar talleres..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {cat === "All" ? (t("all") || "Todos") : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Workshop Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWorkshops.map((ws) => (
                    <div
                        key={ws.id}
                        className="group relative flex flex-col rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-green-500/10"
                    >
                        {/* Image Section */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={ws.image_url}
                                alt={ws.title_en}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full bg-green-600/90 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider">
                                    {ws.category}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                {getLocalizedValue(ws, "title")}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                                {getLocalizedValue(ws, "description")}
                            </p>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span>{ws.date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span>{getLocalizedValue(ws, "location")}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span>{ws.duration} • {ws.time}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleOpenModal(ws)}
                                className="mt-6 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-300"
                            >
                                {t("moreInfo") || "Más información"}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredWorkshops.length === 0 && (
                <div className="max-w-md mx-auto text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {t("noResults") || "No se encontraron talleres"}
                    </h3>
                    <p className="text-slate-500">
                        {t("tryDifferentSearch") || "Prueba con otros términos o cambia los filtros."}
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("All");
                        }}
                        className="mt-6 text-green-500 font-medium hover:underline"
                    >
                        {t("clearFilters") || "Limpiar filtros"}
                    </button>
                </div>
            )}

            {/* Workshop Detail Modal */}
            <WorkshopDetailModal
                workshop={selectedWorkshop}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
