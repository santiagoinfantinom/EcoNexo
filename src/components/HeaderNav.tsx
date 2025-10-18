"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoTips from "./EcoTips";
import { useEffect, useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import NotificationConsent from "./NotificationConsent";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function HeaderNav() {
  const { t, locale } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading, signInWithMagicLink, signInWithOAuth, signOut } = useAuth();
  const supaReady = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signup, setSignup] = useState<{name:string; birthdate:string; birthPlace:string; email?: string}>({ name: "", birthdate: "", birthPlace: "", email: "" });
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const handler = async (e: any) => {
      const targetEmail = e?.detail?.email as string | undefined;
      if (!targetEmail) return;
      try {
        const { error } = await signInWithMagicLink(targetEmail);
        if (!error) alert(t("checkYourEmail"));
      } catch {}
    };
    window.addEventListener('econexo:signup:magic', handler as any);
    return () => window.removeEventListener('econexo:signup:magic', handler as any);
  }, [signInWithMagicLink, t]);

  const handleShowWelcome = () => {
    setShowWelcome(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // Fetch profile from API (Supabase-backed) once logged in
  useEffect(() => {
    let aborted = false;
    (async () => {
      if (!user) { setProfile(null); return; }
      try {
        const res = await fetch(`/api/profiles?id=${encodeURIComponent(user.id)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!aborted) setProfile(data);
      } catch {}
    })();
    return () => { aborted = true; };
  }, [user]);

  // When opening signup, prefill with known data from OAuth or existing profile
  useEffect(() => {
    if (!showSignup) return;
    
    // Extract data from profile (which includes OAuth data)
    const name = (profile?.full_name || profile?.name || "") as string;
    const birthdate = (profile?.birthdate || "") as string;
    const birthPlace = (profile?.birth_place || "") as string;
    const mail = (signup.email && signup.email.trim()) ? signup.email : (email || user?.email || "");
    
    // Check if we have OAuth data to prefill
    const oauthData = profile?.oauth_data || {};
    const oauthProvider = profile?.oauth_provider;
    
    // Additional OAuth-specific data extraction
    let oauthName = name;
    let oauthBirthdate = birthdate;
    let oauthBirthPlace = birthPlace;
    
    if (oauthProvider === 'google' && oauthData.raw_metadata) {
      const metadata = oauthData.raw_metadata;
      oauthName = metadata.given_name && metadata.family_name ? 
        `${metadata.given_name} ${metadata.family_name}` : 
        metadata.name || metadata.full_name || name;
      
      // Google doesn't typically provide birthdate, but we can try
      oauthBirthdate = metadata.birthdate || metadata.dob || birthdate;
      
      // Use locale as birth place if available
      oauthBirthPlace = metadata.locale || birthPlace;
    }
    
    if (oauthProvider === 'azure' && oauthData.raw_metadata) {
      const metadata = oauthData.raw_metadata;
      oauthName = metadata.name || metadata.display_name || name;
      
      // Azure/Outlook might have different field names
      oauthBirthdate = metadata.birthdate || metadata.date_of_birth || birthdate;
      oauthBirthPlace = metadata.location || metadata.locale || birthPlace;
    }
    
    setSignup((s) => ({
      ...s,
      name: s.name || oauthName,
      birthdate: s.birthdate || oauthBirthdate,
      birthPlace: s.birthPlace || oauthBirthPlace,
      email: mail || s.email,
    }));
  }, [showSignup, profile, user, email]);

  return (
    <>
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      <header className="bg-gls-primary text-gls-primary px-6 py-4 relative">
      {/* Brand block estilo GLS Bank */}
      <div className="flex items-center justify-center relative">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <span className="text-2xl text-brand font-black text-gls-primary">{t("app")}</span>
        </div>
        
        {/* Input email a la izquierda, junto al selector de idioma */}
        {!loading && !user && (
          <div className="absolute left-0 sm:left-3 md:left-6 top-0 h-full flex items-center gap-1">
            <button onClick={() => setShowSignup(true)} className="btn-signin order-1">
              {t("signIn")} / {t("signUp")}
            </button>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder' + locale.charAt(0).toUpperCase() + locale.slice(1))}
              className="px-2 py-[6px] rounded bg-white/80 text-slate-800 text-sm w-32 sm:w-40 order-2 leading-none"
            />
          </div>
        )}

        {/* CTA a la derecha */}
        <div className="absolute right-2 md:right-4 flex items-center gap-2">
          {!loading && user && (
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="h-8 w-8 rounded-full border border-white/30" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {(profile?.full_name || user.email || "").slice(0,2).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{profile?.full_name || user.email}</span>
                {profile?.birthdate && (
                  <span className="text-[11px] opacity-80">{profile.birthdate}</span>
                )}
              </div>
              <button onClick={async () => { await signOut(); }} className="btn-gls-secondary">
                {t("logout")}
              </button>
            </div>
          )}
          <button className="btn-gls-primary">
            {t("supportUs")} 💚
          </button>
        </div>
      </div>
      <nav className="flex gap-6 text-base mt-4 justify-center">
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/"
        >
          {t("map")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/eventos"
        >
          {t("events")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/trabajos"
        >
          {t("jobs")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/chat"
        >
          {t("chat")}
        </Link>
        <Link 
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium" 
          href="/perfil"
        >
          {t("profile")}
        </Link>
      </nav>
    </header>
    {showSignup && (
      <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t("createProfile")}</h3>
            <button onClick={() => setShowSignup(false)} className="text-slate-500 hover:text-slate-700">✕</button>
          </div>
          <form
            className="p-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // Si ya hay email, intentamos iniciar magic link; si no, solo guardamos el perfil
              localStorage.setItem('econexo:pendingProfile', JSON.stringify(signup));
              const emailInputLeft = (document.querySelector('input[placeholder="email@ejemplo.com"], input[placeholder="email@example.com"]') as HTMLInputElement | null)?.value;
              const chosenEmail = signup.email && signup.email.trim() ? signup.email.trim() : (emailInputLeft || "");
              if (chosenEmail) {
                // también sincroniza el email del header para consistencia visual
                setEmail(chosenEmail);
                // disparar magic link para verificar cuenta e iniciar sesión
                window.dispatchEvent(new CustomEvent('econexo:signup:magic', { detail: { email: chosenEmail } }));
                alert(t("checkYourEmail"));
              } else {
                alert(t('profileSavedMessage' + locale.charAt(0).toUpperCase() + locale.slice(1)));
              }
              setShowSignup(false);
            }}
          >
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("email")}</label>
              <input type="email" value={signup.email} onChange={(e)=>setSignup({...signup, email:e.target.value})} placeholder={t('emailPlaceholder' + locale.charAt(0).toUpperCase() + locale.slice(1))} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
              <p className="text-xs text-slate-500 mt-1">{t("emailNote")}</p>
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("fullName")}</label>
              <input value={signup.name} onChange={(e)=>setSignup({...signup, name:e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("birthdate")}</label>
              <input type="date" value={signup.birthdate} onChange={(e)=>setSignup({...signup, birthdate:e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("birthPlace")}</label>
              <input value={signup.birthPlace} onChange={(e)=>setSignup({...signup, birthPlace:e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div className="pt-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t("continueWith")}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                {t('oauthExtractMessage' + locale.charAt(0).toUpperCase() + locale.slice(1))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={async ()=>{
                    const res = await signInWithOAuth('google');
                    if (res?.error) {
                      alert(t('signinNotConfigured' + locale.charAt(0).toUpperCase() + locale.slice(1)));
                    }
                  }}
                  className={`btn-oauth btn-oauth-google ${!supaReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={t('googleOAuthTitle' + locale.charAt(0).toUpperCase() + locale.slice(1))}
                  disabled={!supaReady}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" className="mr-1">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t("google")}
                </button>
                <button
                  type="button"
                  onClick={async ()=>{
                    const res = await signInWithOAuth('azure');
                    if (res?.error) {
                      alert(t('signinNotConfigured' + locale.charAt(0).toUpperCase() + locale.slice(1)));
                    }
                  }}
                  className={`btn-oauth btn-oauth-outlook ${!supaReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={t('outlookOAuthTitle' + locale.charAt(0).toUpperCase() + locale.slice(1))}
                  disabled={!supaReady}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" className="mr-1">
                    <path fill="currentColor" d="M7.5 2h9a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5v-17A1.5 1.5 0 0 1 7.5 2zM8 4v16h8V4H8zm1 2h6v2H9V6zm0 3h6v2H9V9zm0 3h6v2H9v-2zm0 3h4v2H9v-2z"/>
                  </svg>
                  {t("outlook")}
                </button>
              </div>
              
              {/* Enlaces directos a Gmail y Outlook */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {t('orGoDirectlyTo' + locale.charAt(0).toUpperCase() + locale.slice(1))}
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-oauth btn-oauth-google text-xs px-3 py-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" className="mr-1">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Gmail
                  </a>
                  <a
                    href="https://outlook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-oauth btn-oauth-outlook text-xs px-3 py-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" className="mr-1">
                      <path fill="currentColor" d="M7.5 2h9a1.5 1.5 0 0 1 1.5 1.5v17a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5v-17A1.5 1.5 0 0 1 7.5 2zM8 4v16h8V4H8zm1 2h6v2H9V6zm0 3h6v2H9V9zm0 3h6v2H9v-2zm0 3h4v2H9v-2z"/>
                    </svg>
                    Outlook.com
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}


