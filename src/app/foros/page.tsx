"use client";
import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type ForumTopic = {
    id: string;
    title_es: string;
    title_en: string;
    title_de: string;
    description_es: string;
    description_en: string;
    description_de: string;
    category: string;
    posts: number;
    participants: number;
    lastActivity: string;
};

const FORUM_TOPICS: ForumTopic[] = [
    {
        id: "1",
        title_es: "Cómo reducir residuos en casa",
        title_en: "How to reduce waste at home",
        title_de: "Wie man Abfall zu Hause reduziert",
        description_es: "Consejos prácticos para minimizar la generación de residuos en el hogar",
        description_en: "Practical tips to minimize waste generation at home",
        description_de: "Praktische Tipps zur Minimierung der Abfallerzeugung zu Hause",
        category: "Medio ambiente",
        posts: 45,
        participants: 23,
        lastActivity: "2026-01-07"
    },
    {
        id: "2",
        title_es: "Mejores prácticas de compostaje urbano",
        title_en: "Best practices for urban composting",
        title_de: "Best Practices für urbanes Kompostieren",
        description_es: "Aprende a compostar en espacios reducidos y apartamentos",
        description_en: "Learn to compost in small spaces and apartments",
        description_de: "Lernen Sie, in kleinen Räumen und Wohnungen zu kompostieren",
        category: "Alimentación",
        posts: 38,
        participants: 19,
        lastActivity: "2026-01-06"
    },
    {
        id: "3",
        title_es: "Energías renovables accesibles",
        title_en: "Accessible renewable energy",
        title_de: "Zugängliche erneuerbare Energien",
        description_es: "Opciones de energía solar y eólica para hogares y comunidades",
        description_en: "Solar and wind energy options for homes and communities",
        description_de: "Solar- und Windenergie-Optionen für Haushalte und Gemeinden",
        category: "Tecnología",
        posts: 52,
        participants: 31,
        lastActivity: "2026-01-07"
    },
    {
        id: "4",
        title_es: "Agricultura urbana y huertos comunitarios",
        title_en: "Urban agriculture and community gardens",
        title_de: "Urbane Landwirtschaft und Gemeinschaftsgärten",
        description_es: "Experiencias y consejos para crear y mantener huertos urbanos",
        description_en: "Experiences and tips for creating and maintaining urban gardens",
        description_de: "Erfahrungen und Tipps zum Anlegen und Pflegen von Stadtgärten",
        category: "Alimentación",
        posts: 67,
        participants: 42,
        lastActivity: "2026-01-07"
    },
    {
        id: "5",
        title_es: "Movilidad sostenible en la ciudad",
        title_en: "Sustainable urban mobility",
        title_de: "Nachhaltige urbane Mobilität",
        description_es: "Bicicletas, transporte público y alternativas ecológicas",
        description_en: "Bicycles, public transport and eco-friendly alternatives",
        description_de: "Fahrräder, öffentliche Verkehrsmittel und umweltfreundliche Alternativen",
        category: "Comunidad",
        posts: 41,
        participants: 27,
        lastActivity: "2026-01-06"
    },
    {
        id: "6",
        title_es: "Conservación de océanos y playas",
        title_en: "Ocean and beach conservation",
        title_de: "Ozean- und Strandschutz",
        description_es: "Iniciativas para proteger ecosistemas marinos y reducir plásticos",
        description_en: "Initiatives to protect marine ecosystems and reduce plastics",
        description_de: "Initiativen zum Schutz mariner Ökosysteme und zur Reduzierung von Plastik",
        category: "Océanos",
        posts: 29,
        participants: 18,
        lastActivity: "2026-01-05"
    },
    {
        id: "7",
        title_es: "Educación ambiental para niños",
        title_en: "Environmental education for children",
        title_de: "Umweltbildung für Kinder",
        description_es: "Recursos y actividades para enseñar sostenibilidad a los más jóvenes",
        description_en: "Resources and activities to teach sustainability to young people",
        description_de: "Ressourcen und Aktivitäten, um jungen Menschen Nachhaltigkeit beizubringen",
        category: "Educación",
        posts: 34,
        participants: 21,
        lastActivity: "2026-01-06"
    },
    {
        id: "8",
        title_es: "Economía circular y reutilización",
        title_en: "Circular economy and reuse",
        title_de: "Kreislaufwirtschaft und Wiederverwendung",
        description_es: "Proyectos de reciclaje creativo y segunda vida de productos",
        description_en: "Creative recycling projects and second life of products",
        description_de: "Kreative Recyclingprojekte und zweites Leben von Produkten",
        category: "Medio ambiente",
        posts: 56,
        participants: 33,
        lastActivity: "2026-01-07"
    }
];

export default function ForosPage() {
    const { t, locale } = useI18n();
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

    const categories = ["all", "Medio ambiente", "Alimentación", "Tecnología", "Comunidad", "Océanos", "Educación"];

    const filteredTopics = selectedCategory === "all"
        ? FORUM_TOPICS
        : FORUM_TOPICS.filter(topic => topic.category === selectedCategory);

    const getTitle = (topic: ForumTopic) => {
        if (locale === "en" && topic.title_en) return topic.title_en;
        if (locale === "de" && topic.title_de) return topic.title_de;
        return topic.title_es;
    };

    const getDescription = (topic: ForumTopic) => {
        if (locale === "en" && topic.description_en) return topic.description_en;
        if (locale === "de" && topic.description_de) return topic.description_de;
        return topic.description_es;
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {locale === "en" ? "Community Forums" : locale === "de" ? "Community-Foren" : "Foros de la Comunidad"}
                    </h1>
                    <p className="text-lg text-white/80">
                        {locale === "en"
                            ? "Join discussions about sustainability and environmental protection"
                            : locale === "de"
                                ? "Nehmen Sie an Diskussionen über Nachhaltigkeit und Umweltschutz teil"
                                : "Únete a las discusiones sobre sostenibilidad y protección ambiental"}
                    </p>
                </div>

                {/* Suggested Topics - New Section */}
                <div className="mb-10 bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-ecosia-green/20 rounded-lg text-ecosia-green">
                            <span className="text-xl">💡</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {locale === 'es' ? 'Temas Sugeridos' : locale === 'de' ? 'Vorgeschlagene Themen' : 'Suggested Topics'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { es: "Iniciativas de reforestación local", en: "Local reforestation initiatives", de: "Lokale Aufforstungsinitiativen", icon: "🌳" },
                            { es: "Cómo organizar limpiezas de playa", en: "How to organize beach cleanups", de: "Wie man Strandreinigungen organisiert", icon: "🏖️" },
                            { es: "Transición a residuo cero", en: "Transitioning to zero waste", de: "Übergang zu Zero Waste", icon: "♻️" }
                        ].map((suggestion, idx) => (
                            <div key={idx} className="bg-white/5 hover:bg-white/10 transition-all p-4 rounded-xl border border-white/5 flex items-center gap-4 cursor-pointer group">
                                <span className="text-2xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                                <span className="text-white/90 font-medium text-sm">
                                    {locale === 'es' ? suggestion.es : locale === 'de' ? suggestion.de : suggestion.en}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === category
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                        >
                            {category === "all"
                                ? (locale === "en" ? "All" : locale === "de" ? "Alle" : "Todos")
                                : category}
                        </button>
                    ))}
                </div>

                {/* Topics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {filteredTopics.map((topic) => (
                        <Link
                            key={topic.id}
                            href={`/foros/${topic.id}`}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all hover:shadow-xl border border-white/20"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white flex-1">
                                    {getTitle(topic)}
                                </h3>
                                <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                                    {topic.category}
                                </span>
                            </div>

                            <p className="text-white/80 mb-4 line-clamp-2">
                                {getDescription(topic)}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-white/60">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {topic.posts} {locale === "en" ? "posts" : locale === "de" ? "Beiträge" : "publicaciones"}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    {topic.participants} {locale === "en" ? "participants" : locale === "de" ? "Teilnehmer" : "participantes"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-block bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
                    >
                        {locale === "en" ? "← Back to Home" : locale === "de" ? "← Zurück zur Startseite" : "← Volver al Inicio"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
