"use client";
import React from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { useI18n, projectNameLabel, locationLabel, categoryLabel, projectDescriptionLabel, impactTagLabel } from "@/lib/i18n";
import ProjectImage from "@/components/ProjectImage";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

type ProjectDetails = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  spots?: number;
  volunteers: number;
  budgetRaisedEur: number;
  budgetGoalEur: number;
  image: string;
  description: string;
  description_en?: string;
  description_de?: string;
  info_url?: string;
  address?: string;
};

export default function ProjectDetailClient({ id, details, impactTags, paypalLink, stripeLink }: {
  id: string;
  details: ProjectDetails;
  impactTags: { label: string; emoji: string; color: string }[];
  paypalLink: string;
  stripeLink: string;
}) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [favorite, setFavorite] = React.useState(false);

  React.useEffect(() => {
    const fetchFav = async () => {
      // 1) Check localStorage (guest mode)
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        if (raw) {
          const list: { type: 'project' | 'event'; id: string }[] = JSON.parse(raw);
          const existsLocal = list.some((i) => i.type === 'project' && i.id === id);
          if (!user || !isSupabaseConfigured()) {
            setFavorite(existsLocal);
            return;
          }
        }
      } catch {}

      // 2) If logged in + Supabase, reconcile and fetch from DB
      if (!user || !isSupabaseConfigured()) return;
      const supabase = getSupabase();

      // Reconcile: push guest saved items to DB once after login
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        if (raw) {
          const list: { type: 'project' | 'event'; id: string }[] = JSON.parse(raw);
          const toInsert = list.map((i) => ({ user_id: user.id, item_type: i.type, item_id: i.id }));
          if (toInsert.length) {
            await supabase.from('favorites').upsert(toInsert as any, { onConflict: 'user_id,item_type,item_id' } as any);
            localStorage.removeItem('econexo:saved');
          }
        }
      } catch {}

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', 'project')
        .eq('item_id', id)
        .maybeSingle();
      setFavorite(!!data);
    };
    fetchFav();
  }, [user, id]);

  const toggleFavorite = async () => {
    // Guest mode: localStorage
    if (!user || !isSupabaseConfigured()) {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('econexo:saved') : null;
        const list: { type: 'project' | 'event'; id: string }[] = raw ? JSON.parse(raw) : [];
        const idx = list.findIndex((i) => i.type === 'project' && i.id === id);
        if (idx >= 0) {
          list.splice(idx, 1);
          setFavorite(false);
          try { trackEvent('save_item', { type: 'project', id, action: 'remove', auth: 0 }); } catch {}
        } else {
          list.push({ type: 'project', id });
          setFavorite(true);
          try { trackEvent('save_item', { type: 'project', id, action: 'add', auth: 0 }); } catch {}
        }
        if (typeof window !== 'undefined') localStorage.setItem('econexo:saved', JSON.stringify(list));
      } catch {}
      return;
    }

    // Authenticated: Supabase
    const supabase = getSupabase();
    if (favorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', 'project')
        .eq('item_id', id);
      setFavorite(false);
      try { trackEvent('save_item', { type: 'project', id, action: 'remove', auth: 1 }); } catch {}
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: 'project', item_id: id });
      if (!error) setFavorite(true);
      try { trackEvent('save_item', { type: 'project', id, action: 'add', auth: 1 }); } catch {}
    }
  };
  const progress = Math.min(100, Math.round((details.budgetRaisedEur / details.budgetGoalEur) * 100));

  return (
    <div className="grid gap-4 sm:gap-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header - Mejorado para móvil */}
      <div className="grid gap-3 sm:gap-2 place-items-center text-center">
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight px-2">{((locale === 'en' && details.name_en) ? details.name_en : (locale === 'de' && details.name_de) ? details.name_de : projectNameLabel(details.id, details.name, locale))}</div>
        <div className="text-xs sm:text-sm text-white/90 flex flex-col sm:flex-row gap-1 sm:gap-0 items-center">
          <span>{locationLabel(details.city, locale)}, {locationLabel(details.country, locale)}</span>
          <span className="hidden sm:inline"> · </span>
          <span>{t("category")}: {categoryLabel(details.category, locale)}</span>
        </div>
        {details.address && (
          <div className="text-xs text-white/70 px-2">{details.address}</div>
        )}
      </div>

      {/* Layout responsive - Vertical en móvil, horizontal en desktop */}
      <div className="grid lg:grid-cols-[2fr,3fr] gap-4 sm:gap-6 items-start">
        {/* Imagen - Mejorada para móvil */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <ProjectImage src={details.image} alt={details.name} fallbackSrc="/window.svg" className="w-full h-48 sm:h-64 md:h-72 object-cover bg-gray-100" />
        </div>

        {/* Contenido principal */}
        <div className="grid gap-4 sm:gap-5">
          {/* Estadísticas - Mejoradas para móvil */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="border rounded-lg p-4 sm:p-5 bg-white shadow-sm">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500 mb-2">{t("volunteers")}</div>
              <div className="text-3xl sm:text-4xl font-black text-white bg-gray-900 inline-block px-2 sm:px-3 rounded leading-tight">{details.volunteers.toLocaleString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES')}</div>
            </div>
            <div className="border rounded-lg p-4 sm:p-5 bg-white shadow-sm">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500 mb-2">{t("raised")}</div>
              <div className="text-3xl sm:text-4xl font-black text-white bg-green-700 inline-block px-2 sm:px-3 rounded leading-tight break-words">€ {details.budgetRaisedEur.toLocaleString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES')}</div>
            </div>
            <div className="border rounded-lg p-4 sm:p-5 bg-white shadow-sm">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-500 mb-2">{t("goal")}</div>
              <div className="text-3xl sm:text-4xl font-black text-white bg-amber-200 inline-block px-2 sm:px-3 rounded leading-tight break-words">€ {details.budgetGoalEur.toLocaleString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES')}</div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="grid gap-2">
            <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-green-700 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} aria-label={t("progressReached")} />
            </div>
            <div className="text-sm sm:text-base font-bold text-white text-center sm:text-left">{progress}% {t("reached")}</div>
          </div>

          {/* Descripción - Mejorada para móvil */}
          <div className="grid gap-2 sm:gap-3">
            <div className="text-sm sm:text-base font-semibold text-white">{t("description")}</div>
            <p className="text-sm sm:text-base leading-relaxed text-white/95 px-1">{((locale === 'en' && details.description_en) ? details.description_en : (locale === 'de' && details.description_de) ? details.description_de : projectDescriptionLabel(details.id, details.description, locale))}</p>
          </div>

          {/* Tags de impacto - Mejorados para móvil */}
          <div className="grid gap-2 sm:gap-3">
            <div className="text-sm sm:text-base font-semibold text-white">{t("impact")}</div>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
              {impactTags.map((tag, i) => (
                <span key={i} className={`px-3 py-1.5 sm:py-2 rounded-full border ${tag.color} inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium`}>
                  <span>{tag.emoji}</span>
                  <span>{impactTagLabel(tag.label, locale)}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Plazas disponibles */}
          {typeof details.spots === "number" && (
            <div className="text-sm sm:text-base text-white text-center sm:text-left">
              {t("availableSpots")}: <span className="font-extrabold text-white bg-gray-900 px-2 sm:px-3 py-1 rounded">{details.spots}</span>
            </div>
          )}

          {/* Botones de acción - Mejorados para móvil */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-start">
            <Link href={`/projects/${details.id}/voluntariado`} className="bg-green-700 text-white rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-green-800 transition-colors shadow-md hover:shadow-lg text-center text-sm sm:text-base">{t("beVolunteer")}</Link>
            <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg border-2 border-blue-700 text-center text-sm sm:text-base">{t("donatePaypal")}</a>
            <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg border-2 border-indigo-700 text-center text-sm sm:text-base">{t("donateStripe")}</a>
            {details.info_url && (
              <a href={details.info_url} target="_blank" rel="noopener noreferrer" className="bg-gray-700 text-white rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg border-2 border-gray-800 text-center text-sm sm:text-base">
                {t("moreInfo")}
              </a>
            )}
            <button onClick={toggleFavorite} className={`rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-semibold transition-colors shadow-md hover:shadow-lg text-sm sm:text-base ${favorite ? 'bg-amber-500 text-white hover:bg-amber-600 border-2 border-amber-600' : 'bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50'}`}>
              {favorite ? '★ ' + t('saved') : '☆ ' + t('save')}
            </button>
          </div>
        </div>
      </div>

      {/* Botón de volver */}
      <div className="pt-2">
        <BackButton href="/" label={t("backToMap") as string} />
      </div>
    </div>
  );
}


