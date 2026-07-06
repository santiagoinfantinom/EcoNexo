"use client";
import { useI18n } from "@/lib/i18n";

export default function AboutClient() {
  const { t, locale } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 opacity-90 max-w-3xl mx-auto">
            {t('aboutSubtitle')}
          </p>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            {locale === "es"
              ? "EcoNexo combina comunidad, datos y ejecución local para generar impacto climático medible y escalable."
              : locale === "de"
                ? "EcoNexo verbindet Community, Daten und lokale Umsetzung für messbare und skalierbare Klimawirkung."
                : "EcoNexo combines community, data, and local execution to deliver measurable and scalable climate impact."}
          </p>
        </div>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-green-700 dark:text-green-300 mb-2">
                {locale === "es" ? "Tracción" : locale === "de" ? "Traction" : "Traction"}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {locale === "es" ? "Actividad constante en comunidad, foros y eventos." : locale === "de" ? "Konstante Aktivität in Community, Foren und Events." : "Consistent activity across community, forums, and events."}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2">
                {locale === "es" ? "Confianza" : locale === "de" ? "Vertrauen" : "Trust"}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {locale === "es" ? "Arquitectura preparada para partners institucionales y de impacto." : locale === "de" ? "Architektur bereit für institutionelle und Impact-Partner." : "Architecture ready for institutional and impact partners."}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-2">
                {locale === "es" ? "Escalabilidad" : locale === "de" ? "Skalierbarkeit" : "Scalability"}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {locale === "es" ? "Modelo replicable por ciudad para expansión internacional." : locale === "de" ? "Pro-Stadt-Modell für internationale Expansion." : "City-by-city model for international expansion."}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('aboutMissionTitle')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('aboutMissionP1')}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('aboutMissionP2')}
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-12">{t('aboutOfferTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('aboutOfferMapTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('aboutOfferMapDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('aboutOfferEventsTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('aboutOfferEventsDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('aboutOfferJobsTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('aboutOfferJobsDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('aboutOfferChatTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('aboutOfferChatDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('aboutOfferProfilesTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('aboutOfferProfilesDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('aboutOfferMultilingualTitle')}</h3>
              <p className="text-gray-700 dark:text-gray-300">{t('aboutOfferMultilingualDesc')}</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('aboutValuesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">🌱 {t('aboutValueSustainabilityTitle')}</h3>
                <p className="text-gray-700 dark:text-gray-300">{t('aboutValueSustainabilityDesc')}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">🤝 {t('aboutValueCommunityTitle')}</h3>
                <p className="text-gray-700 dark:text-gray-300">{t('aboutValueCommunityDesc')}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">🌍 {t('aboutValueInclusivityTitle')}</h3>
                <p className="text-gray-700 dark:text-gray-300">{t('aboutValueInclusivityDesc')}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">📈 {t('aboutValueImpactTitle')}</h3>
                <p className="text-gray-700 dark:text-gray-300">{t('aboutValueImpactDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-white rounded-xl shadow-lg p-8" style={{
            background: 'linear-gradient(90deg, #16a34a 0%, #15803d 20%, #0ea5e9 50%, #0284c7 80%, #0369a1 100%)'
          }}>
            <h2 className="text-3xl font-bold text-center mb-12">{t('aboutImpactTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-green-100">{t('activeProjects')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-green-100">{t('aboutCommunityMembers')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-green-100">{t('aboutEuropeanCities')}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('aboutGetInvolvedTitle')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{t('aboutGetInvolvedDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/eventos" className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                {t('exploreEvents')}
              </a>
              <a href="/chat" className="bg-transparent border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors">
                {t('joinCommunity')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}





