"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoTips from "./EcoTips";
import { useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import { useAuth } from "@/lib/auth";

export default function HeaderNav() {
  const { t } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading, signInWithMagicLink, signInWithOAuth, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signup, setSignup] = useState<{name:string; birthdate:string; birthPlace:string}>({ name: "", birthdate: "", birthPlace: "" });

  const handleShowWelcome = () => {
    setShowWelcome(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

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
          <div className="absolute left-2 sm:left-6 md:left-10 top-0 h-full flex items-center gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@ejemplo.com"
              className="px-2 py-1 rounded bg-white/80 text-slate-800 text-sm w-32 sm:w-40"
            />
            <button
              onClick={async () => {
                if (!email) return;
                const { error } = await signInWithMagicLink(email);
                alert(error ? t("emailInvalid") : t("checkYourEmail"));
              }}
              className="btn-gls-primary px-3 py-1 text-sm"
            >
              {t("login")}
            </button>
            <button onClick={() => setShowSignup(true)} className="btn-gls-secondary px-3 py-1 text-sm">Sign Up</button>
          </div>
        )}

        {/* Área de auth social y CTA a la derecha */}
        <div className="absolute right-2 md:right-4 flex items-center gap-2">
          {!loading && !user && (
            <div className="flex items-center gap-2">
              <a
                href="https://accounts.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gls-secondary flex items-center justify-center"
                title="Google"
                aria-label="Google"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.23 9.23 3.64l6.9-6.9C35.88 2.16 30.58 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.04 6.24C12.44 13.1 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.2-.43-4.7H24v9.02h12.7c-.55 2.97-2.22 5.49-4.74 7.19l7.27 5.64C43.9 37.6 46.5 31.5 46.5 24.5z"/>
                  <path fill="#FBBC05" d="M10.6 19.46l-8.04-6.24C.9 16.2 0 20 0 24s.9 7.8 2.56 10.78l8.04-6.24C10.2 27.1 10 25.58 10 24s.2-3.1.6-4.54z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.94-2.14 15.92-5.85l-7.27-5.64C30.54 38.45 27.5 39.5 24 39.5c-6.26 0-11.56-3.6-13.4-8.96l-8.04 6.24C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </a>
              <a
                href="https://outlook.live.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gls-secondary flex items-center justify-center"
                title="Outlook / Microsoft"
                aria-label="Outlook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#0078D4" d="M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm0 2v.2l9 6.3 9-6.3V6H3zm18 12V8.5l-9 6.3-9-6.3V18h18z"/>
                </svg>
              </a>
            </div>
          )}
          {!loading && user && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.email}</span>
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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Crear perfil</h3>
            <button onClick={() => setShowSignup(false)} className="text-slate-500 hover:text-slate-700">✕</button>
          </div>
          <form
            className="p-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem('econexo:pendingProfile', JSON.stringify(signup));
              alert('Perfil preliminar guardado. Inicia sesión para completar el registro.');
              setShowSignup(false);
            }}
          >
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Nombre completo</label>
              <input value={signup.name} onChange={(e)=>setSignup({...signup, name:e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Fecha de nacimiento</label>
              <input type="date" value={signup.birthdate} onChange={(e)=>setSignup({...signup, birthdate:e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Lugar de nacimiento</label>
              <input value={signup.birthPlace} onChange={(e)=>setSignup({...signup, birthPlace:e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={()=>setShowSignup(false)} className="btn-gls-secondary px-3 py-2">Cancelar</button>
              <button type="submit" className="btn-gls-primary px-3 py-2">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}


