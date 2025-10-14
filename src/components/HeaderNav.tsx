"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import EcoTips from "./EcoTips";
import { useEffect, useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import { useAuth } from "@/lib/auth";

export default function HeaderNav() {
  const { t } = useI18n();
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading, signInWithMagicLink, signInWithOAuth, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signup, setSignup] = useState<{name:string; birthdate:string; birthPlace:string; email?: string}>({ name: "", birthdate: "", birthPlace: "", email: "" });

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
            <button onClick={() => setShowSignup(true)} className="btn-gls-secondary px-3 py-1 text-sm">Sign In / Sign Up</button>
          </div>
        )}

        {/* CTA a la derecha: Sign In/Sign Up unificado */}
        <div className="absolute right-2 md:right-4 flex items-center gap-2">
          {!loading && !user && (
            <button
              onClick={() => setShowSignup(true)}
              className="btn-gls-secondary px-4 py-2"
            >
              Sign In / Sign Up
            </button>
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
              // Si ya hay email, intentamos iniciar magic link; si no, solo guardamos el perfil
              localStorage.setItem('econexo:pendingProfile', JSON.stringify(signup));
              const emailInputLeft = (document.querySelector('input[placeholder=\"email@ejemplo.com\"]') as HTMLInputElement | null)?.value;
              const chosenEmail = signup.email && signup.email.trim() ? signup.email.trim() : (emailInputLeft || "");
              if (chosenEmail) {
                // también sincroniza el email del header para consistencia visual
                setEmail(chosenEmail);
                // disparar magic link para verificar cuenta e iniciar sesión
                window.dispatchEvent(new CustomEvent('econexo:signup:magic', { detail: { email: chosenEmail } }));
                alert('Te enviamos un correo para verificar tu cuenta. Revisa tu bandeja.');
              } else {
                alert('Perfil guardado. Ingresa tu correo y presiona login para verificar.');
              }
              setShowSignup(false);
            }}
          >
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Correo electrónico</label>
              <input type="email" value={signup.email} onChange={(e)=>setSignup({...signup, email:e.target.value})} placeholder="email@ejemplo.com" className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
              <p className="text-xs text-slate-500 mt-1">Usaremos este correo para enviarte el enlace de verificación.</p>
            </div>
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


