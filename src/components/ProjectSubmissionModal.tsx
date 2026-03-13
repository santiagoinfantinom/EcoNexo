"use client";
import React, { useState } from 'react';
import { useI18n, categoryLabel } from '@/lib/i18n';

interface ProjectSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectSubmissionModal({ isOpen, onClose }: ProjectSubmissionModalProps) {
    const { t, locale } = useI18n();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'environment', // using internal keys like existing categories
        targetParticipants: '',
        budget: '',
        milestones: '',
        location: '',
        image: null as File | null
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const newId = `local_${Date.now()}`;
            const newProject = {
                id: newId,
                ...formData,
                created_at: new Date().toISOString(),
                // Add fields expected by the details page
                name: formData.title,
                city: formData.location.split(',')[0]?.trim() || formData.location,
                country: formData.location.split(',')[1]?.trim() || '',
                budgetGoalEur: Number(formData.budget) || 10000,
                budgetRaisedEur: 0,
                volunteers: 0,
                spots: Number(formData.targetParticipants) || 100,
                lat: 40.4168, // Default fallback
                lng: -3.7038, // Default fallback
                image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80" // Default sustainable image
            };

            // Save to localStorage
            const existing = JSON.parse(localStorage.getItem('econexo:projects') || '[]');
            localStorage.setItem('econexo:projects', JSON.stringify([newProject, ...existing]));

            console.log("Project submitted locally:", newProject);
            setLoading(false);
            onClose();

            // Redirect to the new project page
            // We use window.location to ensure a full refresh/navigation if needed, 
            // but router.push is better for SPA feeling.
            window.location.href = `/projects/${newId}`;

        } catch (err) {
            console.error(err);
            setLoading(false);
            alert(t('errorSavingProject'));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('publishProject')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="project-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('projectTitle')} *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t('projectTitlePh')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Category & Location Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('category')} *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="environment">{categoryLabel('environment', locale)}</option>
                                    <option value="education">{categoryLabel('education', locale)}</option>
                                    <option value="community">{categoryLabel('community', locale)}</option>
                                    <option value="health">{categoryLabel('health', locale)}</option>
                                    <option value="oceans">{categoryLabel('oceans', locale)}</option>
                                    <option value="food">{categoryLabel('food', locale)}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('location')} *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder={t('locationPh')}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('detailedDescription')} *
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder={t('detailedDescriptionPh')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('targetParticipants')}
                                </label>
                                <input
                                    type="number"
                                    name="targetParticipants"
                                    value={formData.targetParticipants}
                                    onChange={handleChange}
                                    placeholder="100"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('estimatedBudget')}
                                </label>
                                <input
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Milestones */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('keyMilestones')}
                            </label>
                            <textarea
                                name="milestones"
                                rows={3}
                                value={formData.milestones}
                                onChange={handleChange}
                                placeholder={t('keyMilestonesPh')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        form="project-form"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transform active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? t('publishing') : t('publishProject')}
                    </button>
                </div>

            </div>
        </div>
    );
}
