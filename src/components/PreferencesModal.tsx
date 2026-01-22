"use client";

import React, { useState } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { Category } from '@/data/projects';
import { X, Check, Award, MapPin } from 'lucide-react';
import { useI18n, categoryLabel } from '@/lib/i18n';

// Available options for the MVP
const AVAILABLE_SKILLS = [
    { id: 'tech', labelKey: 'skillTech', icon: '💻' },
    { id: 'gardening', labelKey: 'skillGardening', icon: '🌱' },
    { id: 'teaching', labelKey: 'skillTeaching', icon: '📚' },
    { id: 'manual', labelKey: 'skillManual', icon: '🔧' },
    { id: 'social', labelKey: 'skillSocial', icon: '🤝' },
    { id: 'art', labelKey: 'skillArt', icon: '🎨' },
];

export default function PreferencesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { preferences, updatePreferences, completeOnboarding } = useSmartContext();
    const { t, locale } = useI18n();
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const toggleCategory = (cat: Category) => {
        const current = preferences.selectedCategories;
        const updated = current.includes(cat)
            ? current.filter(c => c !== cat)
            : [...current, cat];
        updatePreferences({ selectedCategories: updated });
    };

    const toggleSkill = (skillId: string) => {
        const current = preferences.selectedSkills;
        const updated = current.includes(skillId)
            ? current.filter(s => s !== skillId)
            : [...current, skillId];
        updatePreferences({ selectedSkills: updated });
    };

    const handleFinish = () => {
        completeOnboarding();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">🎯 {t('personalizeEcoNexo')}</h2>
                        <p className="text-green-100 text-sm">{t('onboardingSubtitle')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    {t('causesTitle')}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Medio ambiente', 'Educación', 'Salud', 'Comunidad', 'Océanos', 'Alimentación'] as Category[]).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${preferences.selectedCategories.includes(cat)
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                                : 'border-gray-200 dark:border-slate-700 hover:border-green-300 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            <span className="font-medium">{categoryLabel(cat, locale)}</span>
                                            {preferences.selectedCategories.includes(cat) && <Check size={18} className="text-green-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    {t('skillsTitle')}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {AVAILABLE_SKILLS.map((skill) => (
                                        <button
                                            key={skill.id}
                                            onClick={() => toggleSkill(skill.id)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${preferences.selectedSkills.includes(skill.id)
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{skill.icon}</span>
                                                <span className="font-medium text-sm">{t(skill.labelKey)}</span>
                                            </span>
                                            {preferences.selectedSkills.includes(skill.id) && <Check size={18} className="text-blue-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-between bg-gray-50 dark:bg-slate-900/50">
                    {step === 2 ? (
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            {t('back')}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-500 font-medium hover:text-gray-700 dark:text-gray-400"
                        >
                            {t('skip')}
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={() => setStep(2)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            {t('next')}
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            {t('ready')} <Award size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
