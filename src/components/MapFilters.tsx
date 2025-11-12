"use client";
import { useState, useEffect } from "react";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

type FilterState = {
  categories: string[];
  distance: number | null;
  dateRange: { start: string; end: string } | null;
  searchQuery: string;
  showOnlyAvailable: boolean;
  country: string | null;
  city: string | null;
  type: 'all' | 'event' | 'permanent';
};

type MapFiltersProps = {
  allProjects: any[];
  onFilterChange: (filteredProjects: any[]) => void;
  onCenterOnLocation: () => void;
};

export default function MapFilters({ allProjects, onFilterChange, onCenterOnLocation }: MapFiltersProps) {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    distance: null,
    dateRange: null,
    searchQuery: "",
    showOnlyAvailable: false,
    country: null,
    city: null,
    type: 'all',
  });

  // Get unique categories from projects
  const availableCategories = Array.from(new Set(allProjects.map(p => p.category)));
  const availableCountries = Array.from(new Set(allProjects.map(p => p.country))).filter(Boolean);
  const availableCities = Array.from(new Set(allProjects.map(p => p.city))).filter(Boolean);

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...allProjects];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(p => (p.country || '').toLowerCase() === filters.country!.toLowerCase());
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(p => (p.city || '').toLowerCase() === filters.city!.toLowerCase());
    }

    // Type filter
    if (filters.type === 'event') {
      filtered = filtered.filter(p => !!p.startsAt && !p.isPermanent);
    } else if (filters.type === 'permanent') {
      filtered = filtered.filter(p => !!p.isPermanent);
    }

    // Date range filter (uses startsAt if present)
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start).getTime();
      const end = new Date(filters.dateRange.end).getTime();
      filtered = filtered.filter(p => {
        if (!p.startsAt) return false;
        const ts = new Date(p.startsAt).getTime();
        return ts >= start && ts <= end;
      });
    }

    // Available spots filter
    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(p => p.spots && p.spots > 0);
    }

    onFilterChange(filtered);
    try {
      trackEvent('map_filter', {
        categories: filters.categories.join(','),
        query: filters.searchQuery || '',
        available: filters.showOnlyAvailable ? 1 : 0,
        distance: filters.distance || 0,
      });
    } catch {}
  }, [filters, allProjects, onFilterChange]);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      distance: null,
      dateRange: null,
      searchQuery: "",
      showOnlyAvailable: false,
      country: null,
      city: null,
      type: 'all',
    });
  };

  const activeFiltersCount = filters.categories.length + 
    (filters.searchQuery ? 1 : 0) + 
    (filters.showOnlyAvailable ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.dateRange ? 1 : 0) +
    (filters.distance ? 1 : 0) +
    (filters.type !== 'all' ? 1 : 0);

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg border">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-2 p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <span>🔍</span>
          <span>{t("filters")}</span>
          {activeFiltersCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
        
        <button
          onClick={onCenterOnLocation}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 font-medium"
          title={t("centerOnLocation")}
        >
          <span>📍</span>
          <span className="hidden sm:inline">{locale === 'de' ? 'Standort' : locale === 'es' ? 'Ubicación' : 'Location'}</span>
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="p-3 border-t min-w-[280px] max-w-[350px]">
          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("search")}
            </label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder={t("searchProjects")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("country")}
            </label>
            <select
              value={filters.country || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value || null }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t("any")}</option>
              {availableCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("city")}
            </label>
            <select
              value={filters.city || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value || null }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t("any")}</option>
              {availableCities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("categories")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.categories.includes(category)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {categoryLabel(category, locale)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("type")}
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: (e.target.value as 'all' | 'event' | 'permanent') }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">{t("all")}</option>
              <option value="event">{t("events")}</option>
              <option value="permanent">{t("permanent")}</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("dateRange")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateRange?.start || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { start: e.target.value, end: prev.dateRange?.end || e.target.value } }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                value={filters.dateRange?.end || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { start: prev.dateRange?.start || e.target.value, end: e.target.value } }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Available Spots */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showOnlyAvailable}
                onChange={(e) => setFilters(prev => ({ ...prev, showOnlyAvailable: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {t("onlyAvailableSpots")}
              </span>
            </label>
          </div>

          {/* Distance Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("maxDistance")} (km)
            </label>
            <select
              value={filters.distance || ""}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                distance: e.target.value ? parseInt(e.target.value) : null 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t("anyDistance")}</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              {t("clearFilters")}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {t("apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
