"use client";
import React, { useState, useEffect } from 'react';

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  distance: number; // km
  impactType: string[];
  difficulty: string[];
  category: string[];
  accessibility: boolean;
  freeOnly: boolean;
  maxCost: number;
  organizer: string[];
  language: string[];
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

export default function AdvancedFilters({ 
  onFiltersChange, 
  initialFilters = {} 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    distance: 50,
    impactType: [],
    difficulty: [],
    category: [],
    accessibility: false,
    freeOnly: false,
    maxCost: 100,
    organizer: [],
    language: [],
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const impactTypes = [
    { id: 'environmental', label: 'Medioambiental', icon: '🌱' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'economic', label: 'Económico', icon: '💰' },
    { id: 'educational', label: 'Educativo', icon: '📚' },
    { id: 'health', label: 'Salud', icon: '🏥' }
  ];

  const difficultyLevels = [
    { id: 'easy', label: 'Fácil', color: 'green' },
    { id: 'medium', label: 'Medio', color: 'yellow' },
    { id: 'hard', label: 'Difícil', color: 'red' }
  ];

  const categories = [
    { id: 'environment', label: 'Medio ambiente', icon: '🌿' },
    { id: 'education', label: 'Educación', icon: '🎓' },
    { id: 'community', label: 'Comunidad', icon: '🏘️' },
    { id: 'technology', label: 'Tecnología', icon: '💻' },
    { id: 'health', label: 'Salud', icon: '🏥' },
    { id: 'culture', label: 'Cultura', icon: '🎭' }
  ];

  const organizers = [
    'Green City Initiative',
    'SolarTech Academy',
    'Local Climate Institute',
    'Urban Green Solutions',
    'Compost Masters',
    'Green Runners',
    'Solar Community',
    'Green Festival'
  ];

  const languages = [
    { id: 'es', label: 'Español', flag: '🇪🇸' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'it', label: 'Italiano', flag: '🇮🇹' }
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K, 
    value: FilterOptions[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends keyof FilterOptions>(
    key: K,
    value: string
  ) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      distance: 50,
      impactType: [],
      difficulty: [],
      category: [],
      accessibility: false,
      freeOnly: false,
      maxCost: 100,
      organizer: [],
      language: []
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.impactType.length > 0) count++;
    if (filters.difficulty.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.organizer.length > 0) count++;
    if (filters.language.length > 0) count++;
    if (filters.accessibility) count++;
    if (filters.freeOnly) count++;
    if (filters.maxCost < 100) count++;
    return count;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Filtros Avanzados
        </h3>
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {getActiveFiltersCount()} activos
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => updateFilter('freeOnly', !filters.freeOnly)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filters.freeOnly
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          🆓 Solo gratuitos
        </button>
        <button
          onClick={() => updateFilter('accessibility', !filters.accessibility)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filters.accessibility
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          ♿ Accesible
        </button>
        <button
          onClick={resetFilters}
          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          🔄 Limpiar
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              📅 Rango de fechas
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => updateFilter('dateRange', { 
                    ...filters.dateRange, 
                    start: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => updateFilter('dateRange', { 
                    ...filters.dateRange, 
                    end: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              📏 Distancia máxima: {filters.distance} km
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={filters.distance}
              onChange={(e) => updateFilter('distance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
            />
          </div>

          {/* Max Cost */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              💰 Costo máximo: €{filters.maxCost}
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.maxCost}
              onChange={(e) => updateFilter('maxCost', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
            />
          </div>

          {/* Impact Types */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              🎯 Tipo de impacto
            </label>
            <div className="grid grid-cols-2 gap-2">
              {impactTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleArrayFilter('impactType', type.id)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    filters.impactType.includes(type.id)
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ⚡ Dificultad
            </label>
            <div className="flex gap-2">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => toggleArrayFilter('difficulty', level.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    filters.difficulty.includes(level.id)
                      ? `bg-${level.color}-100 text-${level.color}-800 dark:bg-${level.color}-900/20 dark:text-${level.color}-400`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              📂 Categorías
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleArrayFilter('category', category.id)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    filters.category.includes(category.id)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Organizers */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              🏢 Organizadores
            </label>
            <div className="grid grid-cols-2 gap-2">
              {organizers.map((organizer) => (
                <button
                  key={organizer}
                  onClick={() => toggleArrayFilter('organizer', organizer)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all text-left ${
                    filters.organizer.includes(organizer)
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {organizer}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              🌍 Idiomas
            </label>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => toggleArrayFilter('language', lang.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    filters.language.includes(lang.id)
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
