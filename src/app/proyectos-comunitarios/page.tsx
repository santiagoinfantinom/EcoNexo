"use client";
import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PROJECTS from "@/data/projects";

export default function ProyectosComunitariosPage() {
    const { t, locale } = useI18n();

    // Filtrar proyectos comunitarios
    const communityProjects = PROJECTS.filter(project => project.category === "Comunidad");

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('communityProjectsTitle')}
                    </h1>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto">
                        {t('communityProjectsPageDesc')}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">{communityProjects.length}</div>
                        <div className="text-white/80">
                            {t('activeProjects')}
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">
                            {communityProjects.reduce((acc, p) => acc + (p.volunteers || 0), 0)}
                        </div>
                        <div className="text-white/80">
                            {t('totalVolunteers')}
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">
                            {new Set(communityProjects.map(p => p.city)).size}
                        </div>
                        <div className="text-white/80">
                            {t('cities')}
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {communityProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all hover:shadow-2xl border border-white/20 group"
                        >
                            {/* Project Image */}
                            {project.image_url && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={project.image_url}
                                        alt={project.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            {/* Project Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                    {locale === "en" && project.name_en ? project.name_en :
                                        locale === "de" && project.name_de ? project.name_de :
                                            project.name}
                                </h3>

                                <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {project.city}, {project.country}
                                </div>

                                {project.description && (
                                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                                        {locale === "en" && project.description_en ? project.description_en :
                                            locale === "de" && project.description_de ? project.description_de :
                                                project.description}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm">
                                    {project.volunteers && (
                                        <div className="flex items-center gap-1 text-white/80">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            {project.volunteers}
                                        </div>
                                    )}
                                    {project.spots && (
                                        <div className="flex items-center gap-1 text-green-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {project.spots} {t('availableSpots').toLowerCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Back Button */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="inline-block bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
                    >
                        {`← ${t('backToHome')}`}
                    </Link>
                </div>
            </div>
        </div>
    );
}
