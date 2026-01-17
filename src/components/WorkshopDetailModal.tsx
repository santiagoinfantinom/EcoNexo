"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useSmartContext } from '@/context/SmartContext';
import { Workshop } from '@/data/workshops';
import {
    X,
    Calendar,
    MapPin,
    Clock,
    Users,
    Globe,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

interface WorkshopDetailModalProps {
    workshop: Workshop | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function WorkshopDetailModal({ workshop, isOpen, onClose }: WorkshopDetailModalProps) {
    const { locale } = useI18n();
    const { addPoints } = useSmartContext();

    if (!isOpen || !workshop) return null;

    const handleRegisterClick = () => {
        addPoints(25, locale === 'es' ? 'Inscribirse a taller' : 'Workshop registration');
    };

    const getLocalizedValue = (ws: Workshop, key: "title" | "description" | "location") => {
        if (locale === "es") return ws[key];
        if (locale === "de") return ws[`${key}_de` as keyof Workshop] as string;
        return ws[`${key}_en` as keyof Workshop] as string;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">

                {/* Header with Background Image */}
                <div className="relative h-64 sm:h-80 flex-shrink-0">
                    <img
                        src={workshop.image_url}
                        alt={workshop.title_en}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                    {/* Category Check */}
                    <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 rounded-full bg-green-500/90 backdrop-blur-xl text-white text-[10px] uppercase font-black tracking-widest shadow-lg border border-white/20">
                            {workshop.category}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-xl text-white transition-all transform hover:rotate-90"
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 custom-scrollbar">
                    {/* Main Title & Meta */}
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                            {getLocalizedValue(workshop, "title")}
                        </h2>

                        <div className="flex flex-wrap gap-4 text-slate-400">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                <Users className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-medium">{workshop.capacity} {locale === 'es' ? 'Plazas' : 'Capacity'}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                <Globe className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-medium">{workshop.organizer}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Info Cards */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors group">
                                <Calendar className="w-6 h-6 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'es' ? 'Fecha' : 'Date'}</h4>
                                <p className="text-white font-bold">{workshop.date}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors group">
                                <Clock className="w-6 h-6 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'es' ? 'Horario' : 'Schedule'}</h4>
                                <p className="text-white font-bold">{workshop.time} ({workshop.duration})</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors group">
                                <MapPin className="w-6 h-6 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'es' ? 'Ubicación' : 'Location'}</h4>
                                <p className="text-white font-bold">{getLocalizedValue(workshop, "location")}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    {locale === 'es' ? 'Sobre el Taller' : 'About the Workshop'}
                                </h3>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    {getLocalizedValue(workshop, "description")}
                                </p>
                            </div>

                            {/* Additional Benefits/Features (Placeholder for more rich content) */}
                            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                                <h4 className="text-emerald-400 font-bold mb-2">
                                    {locale === 'es' ? '¿Por qué participar?' : 'Why join?'}
                                </h4>
                                <ul className="text-slate-300 text-sm space-y-2">
                                    <li className="flex gap-2"><span>✨</span> Certificado de asistencia emitido por EcoNexo</li>
                                    <li className="flex gap-2"><span>🌱</span> Acceso a materiales exclusivos de {workshop.organizer}</li>
                                    <li className="flex gap-2"><span>👥</span> Sesión de networking con otros actores del sector</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-slate-900 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="text-slate-500 text-xs max-w-xs">
                        {locale === 'es' ? '* Al inscribirte, aceptas recibir notificaciones recordatorio por parte del organizador.' : '* By registering, you agree to receive reminder notifications from the organizer.'}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                        >
                            {locale === 'es' ? 'Cerrar' : 'Close'}
                        </button>
                        <a
                            href={workshop.registration_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleRegisterClick}
                            className="px-10 py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transform active:scale-95 transition-all flex items-center gap-2"
                        >
                            {locale === 'es' ? 'Inscribirme Ahora' : 'Register Now'}
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
