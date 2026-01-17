"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";

// Mock data for mentors
const MOCK_MENTORS = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Sustainability Director",
    company: "EcoTech Solutions",
    location: "Madrid, Spain",
    topics: ["Circular Economy", "Corporate Strategy"],
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Thomas Mueller",
    role: "Renewable Energy Engineer",
    company: "WindPower GmbH",
    location: "Berlin, Germany",
    topics: ["Solar Energy", "Wind Technology"],
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Sophie Dubois",
    role: "Urban Planner",
    company: "City of Paris",
    location: "Paris, France",
    topics: ["Urban Gardening", "Public Transport"],
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

export default function BuscarMentorPage() {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");

  const filteredMentors = MOCK_MENTORS.filter(mentor => {
    const search = query.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(search) ||
      mentor.role.toLowerCase().includes(search) ||
      mentor.company.toLowerCase().includes(search) ||
      mentor.location.toLowerCase().includes(search) ||
      mentor.topics.some(topic => topic.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          {locale === "de"
            ? "🔍 Mentor suchen"
            : locale === "es"
              ? "🔍 Buscar Mentor"
              : "🔍 Find Mentor"}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg font-medium">
          {locale === "de"
            ? "Finde Expertinnen und Experten en Nachhaltigkeit nach Themen, Sprachen und Städten."
            : locale === "es"
              ? "Encuentra especialistas en sostenibilidad por temas, idiomas y ciudades."
              : "Find sustainability experts by topics, languages and cities."}
        </p>

        <div className="bg-white/80 dark:bg-slate-800/90 rounded-xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === "de"
                  ? "Tema, ciudad o idioma..."
                  : locale === "es"
                    ? "Tema, ciudad o idioma..."
                    : "Topic, city or language..."
              }
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">
              {locale === "de" ? "Suchen" : locale === "es" ? "Buscar" : "Search"}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 group">
                <div className="relative h-24 bg-gradient-to-r from-green-400 to-blue-500">
                  <div className="absolute -bottom-10 left-6">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 object-cover shadow-md"
                    />
                  </div>
                </div>
                <div className="pt-12 px-6 pb-6">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors">{mentor.name}</h3>
                  <p className="text-sm text-green-600 font-medium mb-1">{mentor.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                    <span>🏢 {mentor.company}</span>
                    <span>📍 {mentor.location}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.topics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-gray-50 dark:bg-slate-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-200 font-semibold rounded-lg text-sm transition-colors border border-gray-200 dark:border-slate-600">
                    {locale === "es" ? "Conectar" : locale === "de" ? "Verbinden" : "Connect"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {locale === "es" ? "No se encontraron mentores." : locale === "de" ? "Keine Mentoren gefunden." : "No mentors found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
