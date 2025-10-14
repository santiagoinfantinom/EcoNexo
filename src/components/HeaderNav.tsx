"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoTips from "./EcoTips";
import { useEffect, useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import { useAuth } from "@/lib/auth";

export default function HeaderNav() {
  const { t, locale } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading, signInWithMagicLink, signInWithOAuth, signOut } = useAuth();
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

  // When opening signup, prefill with known data
  useEffect(() => {
    if (!showSignup) return;
    const name = (profile?.full_name || profile?.name || "") as string;
    const birthdate = (profile?.birthdate || "") as string;
    const birthPlace = (profile?.birth_place || "") as string;
    const mail = (signup.email && signup.email.trim()) ? signup.email : (email || user?.email || "");
    setSignup((s) => ({
      ...s,
      name: s.name || name,
      birthdate: s.birthdate || birthdate,
      birthPlace: s.birthPlace || birthPlace,
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
            <button onClick={() => setShowSignup(true)} className="btn-gls-secondary px-2 py-[6px] text-xs order-1 leading-none">
              Sign In / Sign Up
            </button>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={locale === 'en' ? 'email@example.com' : (locale === 'de' ? 'email@beispiel.de' : 'email@ejemplo.com')}
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
          href="/calendario"
        >
          {t("calendar")}
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
        <EcoTips />
        <button
          onClick={handleShowWelcome}
          className="text-nav hover:text-ecosia-green transition-colors duration-200 text-gls-primary font-medium"
          title={t("about")}
        >
          {t("about")}
        </button>
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
                alert(locale === 'en' ? 'Profile saved. Enter your email and press login to verify.' : locale === 'de' ? 'Profil gespeichert. Gib deine E‑Mail ein und klicke auf Login, um zu verifizieren.' : 'Perfil guardado. Ingresa tu correo y presiona login para verificar.');
              }
              setShowSignup(false);
            }}
          >
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">{t("email")}</label>
              <input type="email" value={signup.email} onChange={(e)=>setSignup({...signup, email:e.target.value})} placeholder="email@ejemplo.com" className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
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
            <div className="flex justify-center gap-3 pt-2">
              <button type="button" onClick={()=>setShowSignup(false)} className="btn-gls-secondary px-3 py-2">{t("cancel")}</button>
              <button type="submit" className="btn-gls-primary px-3 py-2">{t("save")}</button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t("continueWith")}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async ()=>{ await signInWithOAuth('google'); }}
                  className="flex-1 btn-gls-secondary px-3 py-2"
                  title="Google"
                >
                  {t("google")}
                </button>
                <button
                  type="button"
                  onClick={async ()=>{ await signInWithOAuth('azure'); }}
                  className="flex-1 btn-gls-secondary px-3 py-2"
                  title="Outlook / Microsoft"
                >
                  {t("outlook")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}


