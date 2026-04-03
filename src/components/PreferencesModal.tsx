"use client";

import React, { useState, useEffect } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { Category } from '@/data/projects';
import { X, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

// Available options
const AVAILABLE_SKILLS = [
    { id: 'tech', labelKey: 'skillTech', icon: '💻', desc: 'Digital & Web' },
    { id: 'gardening', labelKey: 'skillGardening', icon: '🌱', desc: 'Planting & Care' },
    { id: 'teaching', labelKey: 'skillTeaching', icon: '📚', desc: 'Workshops' },
    { id: 'manual', labelKey: 'skillManual', icon: '🔧', desc: 'Building' },
    { id: 'social', labelKey: 'skillSocial', icon: '🤝', desc: 'Helping people' },
    { id: 'art', labelKey: 'skillArt', icon: '🎨', desc: 'Creative' },
];

const CATEGORY_MAP: Record<Category, { icon: string }> = {
    'Medio ambiente': { icon: '🌳' },
    'Educación': { icon: '📖' },
    'Salud': { icon: '⚕️' },
    'Comunidad': { icon: '🫂' },
    'Océanos': { icon: '🌊' },
    'Alimentación': { icon: '🍎' }
};

export default function PreferencesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { preferences, updatePreferences, completeOnboarding } = useSmartContext();
    const { t, locale } = useI18n();
    const [step, setStep] = useState(1);
    const [isCalculating, setIsCalculating] = useState(false);

    // Block body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

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
        setStep(3); // Go to calculation screen
        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            setTimeout(() => {
                completeOnboarding();
                onClose();
            }, 1000); // 1s extra to show success state
        }, 2000); // 2s of "processing"
    };

    const slideVariants = {
        hiddenRight: { x: 50, opacity: 0 },
        hiddenLeft: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', bounce: 0.3, duration: 0.6 } },
        exitLeft: { x: -50, opacity: 0, transition: { ease: 'easeInOut', duration: 0.2 } },
        exitRight: { x: 50, opacity: 0, transition: { ease: 'easeInOut', duration: 0.2 } },
    };

    const progressPercentage = step === 1 ? 33 : step === 2 ? 66 : 100;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md md:p-4">
            <div className="bg-white dark:bg-slate-900 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Visual Progress Bar */}
                {step < 3 && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-slate-800 z-10">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                )}

                {/* Header Navbar */}
                {step < 3 && (
                    <div className="px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400 tracking-wider uppercase mb-1">
                                {t('onboardingSubtitle') || 'Personaliza tu experiencia'}
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                {step === 1 ? t('causesTitle') || '¿Qué te motiva?' : t('skillsTitle') || '¿Cómo puedes ayudar?'}
                            </h2>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    <AnimatePresence mode="wait">
                        
                        {/* STEP 1: CAUSES */}
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                variants={slideVariants}
                                initial="hiddenRight"
                                animate="visible"
                                exit="exitLeft"
                                className="px-6 pb-24 pt-4"
                            >
                                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                                    {locale === 'es' ? 'Selecciona los temas que más te apasionan. Te recomendaremos proyectos de este tipo.' : 'Select the topics you care about most. We will recommend you projects like these.'}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {(Object.keys(CATEGORY_MAP) as Category[]).map((cat) => {
                                        const isSelected = preferences.selectedCategories.includes(cat);
                                        return (
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                key={cat}
                                                onClick={() => toggleCategory(cat)}
                                                className={`relative p-5 rounded-2xl border-2 text-left flex flex-col items-start gap-3 transition-colors ${
                                                    isSelected
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                                                        : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-green-200'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isSelected ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-100 dark:bg-slate-700'}`}>
                                                    {CATEGORY_MAP[cat].icon}
                                                </div>
                                                <span className={`font-bold ${isSelected ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {cat}
                                                </span>
                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: SKILLS */}
                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                variants={slideVariants}
                                initial="hiddenRight"
                                animate="visible"
                                exit="exitLeft"
                                className="px-6 pb-24 pt-4"
                            >
                                <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                                    {locale === 'es' ? '¿En qué destacas? Te conectaremos con equipos que busquen superpoderes como los tuyos.' : 'What are you good at? We will match you with teams looking for superpowers like yours.'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {AVAILABLE_SKILLS.map((skill) => {
                                        const isSelected = preferences.selectedSkills.includes(skill.id);
                                        return (
                                            <motion.button
                                                whileTap={{ scale: 0.96 }}
                                                key={skill.id}
                                                onClick={() => toggleSkill(skill.id)}
                                                className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-colors ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                                        : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-blue-200'
                                                }`}
                                            >
                                                <span className="text-3xl">{skill.icon}</span>
                                                <div className="flex-1">
                                                    <div className={`font-bold ${isSelected ? 'text-blue-800 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {t(skill.labelKey)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{skill.desc}</div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-slate-600'}`}>
                                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: SUCCESS / CALCULATING */}
                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-6 py-12 flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                            >
                                {isCalculating ? (
                                    <>
                                        <div className="relative w-24 h-24 mb-8">
                                            <motion.div 
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-green-500 border-b-blue-500"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {locale === 'es' ? 'Analizando tu perfil...' : 'Analyzing your profile...'}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {locale === 'es' ? 'Buscando el mejor impacto para ti' : 'Finding the best impact for you'}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                                            transition={{ type: "spring", duration: 0.6 }}
                                            className="w-24 h-24 mb-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.4)]"
                                        >
                                            <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
                                        </motion.div>
                                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-3">
                                            {locale === 'es' ? '¡Match Encontrado!' : 'Match Found!'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                                            {locale === 'es' 
                                                ? 'Hemos personalizado tu mapa y eventos.' 
                                                : 'We have personalized your map and events.'}
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Navigation (Absolute bottom) */}
                {step < 3 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 flex justify-between gap-4">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3.5 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                            >
                                {t('back') || 'Atrás'}
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-3.5 text-gray-400 font-semibold hover:text-gray-600 transition"
                            >
                                {t('skip') || 'Omitir'}
                            </button>
                        )}

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={step === 2 ? handleFinish : () => setStep(2)}
                            className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-gray-900/20 dark:shadow-white/10 transition-all active:shadow-sm"
                        >
                            {step === 1 ? (t('next') || 'Siguiente') : (locale === 'es' ? 'Descubrir mi Match' : 'Find my Match')}
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
}
