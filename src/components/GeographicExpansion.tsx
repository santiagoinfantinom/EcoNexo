'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { COUNTRIES, getCountriesByRegion, getCountriesByLanguage, Country } from '@/lib/countries';
import { GOVERNMENT_APIS, getGovernmentAPI } from '@/lib/governmentAPIs';

export default function GeographicExpansion() {
  const { t, locale } = useI18n();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [countries, setCountries] = useState<Country[]>(COUNTRIES);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES);

  const regions = ['all', 'Northern Europe', 'Western Europe', 'Central Europe', 'Southern Europe', 'Eastern Europe'];
  const languages = ['all', 'de', 'en', 'es', 'fr', 'it', 'pl', 'nl', 'da', 'sv', 'no', 'fi', 'pt', 'cs', 'hu', 'ro', 'bg', 'hr', 'sr', 'sk', 'sl', 'et', 'lv', 'lt'];

  useEffect(() => {
    let filtered = countries;

    if (selectedRegion !== 'all') {
      filtered = getCountriesByRegion(selectedRegion);
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(country => country.language === selectedLanguage);
    }

    setFilteredCountries(filtered);
  }, [selectedRegion, selectedLanguage, countries]);

  const getCountryName = (country: Country) => {
    switch (locale) {
      case 'de': return country.name_de;
      case 'es': return country.name_es;
      case 'fr': return country.name_fr;
      case 'it': return country.name_it;
      case 'pl': return country.name_pl;
      case 'nl': return country.name_nl;
      default: return country.name_en;
    }
  };

  const getRegionName = (region: string) => {
    const regionNames: Record<string, string> = {
      'all': t('all'),
      'Northern Europe': t('northernEurope'),
      'Western Europe': t('westernEurope'),
      'Central Europe': t('centralEurope'),
      'Southern Europe': t('southernEurope'),
      'Eastern Europe': t('easternEurope')
    };
    return regionNames[region] || region;
  };

  const getLanguageName = (lang: string) => {
    const languageNames: Record<string, string> = {
      'all': t('all'),
      'de': 'Alemán',
      'en': 'Inglés',
      'es': 'Español',
      'fr': 'Francés',
      'it': 'Italiano',
      'pl': 'Polaco',
      'nl': 'Holandés',
      'da': 'Danés',
      'sv': 'Sueco',
      'no': 'Noruego',
      'fi': 'Finlandés',
      'pt': 'Portugués',
      'cs': 'Checo',
      'hu': 'Húngaro',
      'ro': 'Rumano',
      'bg': 'Búlgaro',
      'hr': 'Croata',
      'sr': 'Serbio',
      'sk': 'Eslovaco',
      'sl': 'Esloveno',
      'et': 'Estonio',
      'lv': 'Letón',
      'lt': 'Lituano'
    };
    return languageNames[lang] || lang;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          🌍 {t('geographicExpansion')}
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">
          {t('geographicExpansionDescription')}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {COUNTRIES.length}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{t('countries')}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {new Set(COUNTRIES.map(c => c.language)).size}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{t('languages')}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {new Set(COUNTRIES.map(c => c.currency)).size}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{t('currencies')}</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {GOVERNMENT_APIS.length}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{t('governmentAPIs')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t('filters')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('region')}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {getRegionName(region)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('language')}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {getLanguageName(lang)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCountries.map((country) => {
          const api = getGovernmentAPI(country.code);
          return (
            <div key={country.code} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{country.flag}</div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {getCountryName(country)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {country.code}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('capital')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{country.capital}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('population')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{country.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('currency')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{country.currencySymbol} {country.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('language')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getLanguageName(country.language)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('regionLabel')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getRegionName(country.region)}</span>
                  </div>
                </div>

                {api && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      ✓ {t('governmentAPIAvailable')}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-300">
                      {api.name}
                    </div>
                  </div>
                )}

                {!api && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {t('governmentAPIInDevelopment')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Government APIs Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          🔌 {t('integratedGovernmentAPIs')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOVERNMENT_APIS.map((api) => (
            <div key={api.country} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{api.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{api.country}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{api.description}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('baseURL')}: {api.baseUrl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
