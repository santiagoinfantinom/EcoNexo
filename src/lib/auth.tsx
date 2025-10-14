"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "./supabaseClient";

type AuthUser = {
  id: string;
  email: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>;
  signInWithOAuth: (provider: "google" | "github" | "gitlab" | "bitbucket" | "azure" | "azure_ad" | "azuread" | "azure_b2c") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // No Supabase in this environment (e.g., Vercel preview without envs)
      setUser(null);
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    let mounted = true;

    const init = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? null } : null);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? null } : null);
      if (sessionUser) {
        // Upsert profile on login
        try {
          const fullName = (sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || null) as string | null;
          const birthdateRaw = (sessionUser.user_metadata?.birthdate || sessionUser.user_metadata?.dob || null) as string | null;
          const birthdate = birthdateRaw ? new Date(birthdateRaw).toISOString().slice(0,10) : null;
          const avatarUrl = (sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.picture || null) as string | null;
          const pending = typeof window !== 'undefined' ? localStorage.getItem('econexo:pendingProfile') : null;
          let overrides: any = {};
          if (pending) {
            try { overrides = JSON.parse(pending); } catch {}
            localStorage.removeItem('econexo:pendingProfile');
          }
          await supabase
            .from('profiles')
            .upsert({ id: sessionUser.id, full_name: overrides.name ?? fullName ?? undefined, birthdate: overrides.birthdate ?? birthdate ?? undefined, birth_place: overrides.birthPlace ?? undefined, avatar_url: avatarUrl ?? undefined }, { onConflict: 'id' });
        } catch {}
      }
    });

    init();
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined } });
    return { error: error?.message };
  }, []);

  const signInWithOAuth = useCallback(async (provider: "google" | "github" | "gitlab" | "bitbucket") => {
    if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined } });
    return { error: error?.message };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signInWithMagicLink, signInWithOAuth, signOut }), [user, loading, signInWithMagicLink, signInWithOAuth, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


