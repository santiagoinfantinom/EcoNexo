"use client";
import React from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { useI18n, categoryLabel, impactTagLabel, projectDescriptionLabel, projectNameLabel, locationLabel } from "@/lib/i18n";
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
    <div className="grid gap-6 max-w-6xl mx-auto">
      <div className="grid gap-2 place-items-center text-center">
        <div className="text-3xl font-semibold">{projectNameLabel(details.id, details.name, locale)}</div>
        <div className="text-sm text-gray-400">
          {locationLabel(details.city, locale)}, {locationLabel(details.country, locale)} · {t("category")}: {categoryLabel(details.category, locale)}
        </div>
        {details.address && (
          <div className="text-xs text-gray-500">{details.address}</div>
        )}
      </div>

      <div className="grid lg:grid-cols-[2fr,3fr] gap-6 items-start">
        <div className="border rounded overflow-hidden bg-white shadow-sm">
          <ProjectImage src={details.image} alt={details.name} fallbackSrc="/window.svg" className="w-full h-72 object-cover bg-gray-100" />
        </div>

        <div className="grid gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center sm:place-items-stretch">
            <div className="border rounded p-5 bg-white shadow-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">{t("volunteers")}</div>
              <div className="text-4xl font-black text-gray-50 bg-gray-900 inline-block px-3 rounded leading-tight">{details.volunteers.toLocaleString("es-ES")}</div>
            </div>
            <div className="border rounded p-5 bg-white shadow-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">{t("raised")}</div>
              <div className="text-4xl font-black text-white bg-green-700 inline-block px-3 rounded leading-tight">€ {details.budgetRaisedEur.toLocaleString("es-ES")}</div>
            </div>
            <div className="border rounded p-5 bg-white shadow-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">{t("goal")}</div>
              <div className="text-4xl font-black text-gray-900 bg-amber-200 inline-block px-3 rounded leading-tight">€ {details.budgetGoalEur.toLocaleString("es-ES")}</div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="h-3 w-full bg-gray-300 rounded">
              <div className="h-3 bg-green-700 rounded" style={{ width: `${progress}%` }} aria-label={t("progressReached")} />
            </div>
            <div className="text-base font-bold text-white">{progress}% {t("reached")}</div>
          </div>

          <div className="grid gap-2">
            <div className="text-base font-semibold text-white">{t("description")}</div>
            <p className="text-[16px] leading-relaxed text-white">{(locale === 'en' && details.description_en) ? details.description_en : (locale === 'de' && details.description_de) ? details.description_de : projectDescriptionLabel(details.id, details.description, locale)}</p>
          </div>

          <div className="grid gap-2">
            <div className="text-base font-semibold text-white">{t("impact")}</div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {impactTags.map((tag, i) => (
                <span key={i} className={`px-3 py-1 rounded-full border ${tag.color} inline-flex items-center gap-1 text-sm`}>
                  <span>{tag.emoji}</span>
                  <span>{impactTagLabel(tag.label, locale)}</span>
                </span>
              ))}
            </div>
          </div>

          {typeof details.spots === "number" && (
            <div className="text-sm text-white">{t("availableSpots")}: <span className="font-extrabold text-gray-50 bg-gray-900 px-2 rounded">{details.spots}</span></div>
          )}

          <div className="flex gap-3 justify-center sm:justify-start">
            <Link href={`/projects/${details.id}/voluntariado`} className="bg-green-700 text-white rounded px-4 py-2 font-medium">{t("beVolunteer")}</Link>
            <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="border rounded px-4 py-2 font-medium hover:bg-gray-50">{t("donatePaypal")}</a>
            <a href={stripeLink} target="_blank" rel="noopener noreferrer" className="border rounded px-4 py-2 font-medium hover:bg-gray-50">{t("donateStripe")}</a>
            {details.info_url && (
              <a href={details.info_url} target="_blank" rel="noopener noreferrer" className="border rounded px-4 py-2 font-medium hover:bg-gray-50">
                {locale === 'de' ? 'Mehr Info' : locale === 'en' ? 'More info' : 'Más info'}
              </a>
            )}
            <button onClick={toggleFavorite} className={`rounded px-4 py-2 font-medium ${favorite ? 'bg-amber-200' : 'border hover:bg-gray-50'}`}>
              {favorite ? '★ ' + t('saved') : '☆ ' + t('save')}
            </button>
          </div>
        </div>
      </div>

      <div>
        <BackButton href="/" label={t("backToMap") as string} />
      </div>
    </div>
  );
}


