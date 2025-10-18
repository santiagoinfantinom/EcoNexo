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
  signInWithOAuth: (provider: "google" | "github" | "gitlab" | "bitbucket" | "azure") => Promise<{ error?: string }>;
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
        // Upsert profile on login with enhanced OAuth data extraction
        try {
          const userMetadata = sessionUser.user_metadata || {};
          
          // Extract full name from various OAuth providers
          const fullName = userMetadata.full_name || 
                          userMetadata.name || 
                          userMetadata.display_name ||
                          (userMetadata.given_name && userMetadata.family_name ? 
                            `${userMetadata.given_name} ${userMetadata.family_name}` : null);
          
          // Extract birthdate from various formats
          const birthdateRaw = userMetadata.birthdate || 
                              userMetadata.dob || 
                              userMetadata.date_of_birth ||
                              userMetadata.birth_date;
          const birthdate = birthdateRaw ? new Date(birthdateRaw).toISOString().slice(0,10) : null;
          
          // Extract avatar URL
          const avatarUrl = userMetadata.avatar_url || 
                           userMetadata.picture || 
                           userMetadata.photo ||
                           userMetadata.profile_image;
          
          // Extract birth place (if available from OAuth)
          const birthPlace = userMetadata.birth_place || 
                            userMetadata.place_of_birth ||
                            userMetadata.location ||
                            userMetadata.locale;
          
          // Extract additional Google-specific data
          const googleData = userMetadata.provider === 'google' ? {
            verified_email: userMetadata.email_verified,
            locale: userMetadata.locale,
            hd: userMetadata.hd, // Google Workspace domain
          } : {};
          
          // Extract additional Outlook/Microsoft-specific data
          const outlookData = userMetadata.provider === 'azure' ? {
            tenant_id: userMetadata.tid,
            preferred_username: userMetadata.preferred_username,
            upn: userMetadata.upn, // User Principal Name
          } : {};
          
          // Get any pending profile data from localStorage
          const pending = typeof window !== 'undefined' ? localStorage.getItem('econexo:pendingProfile') : null;
          let overrides: any = {};
          if (pending) {
            try { overrides = JSON.parse(pending); } catch {}
            localStorage.removeItem('econexo:pendingProfile');
          }
          
          // Create profile data with OAuth data and overrides
          const profileData = {
            id: sessionUser.id,
            full_name: overrides.name ?? fullName ?? undefined,
            birthdate: overrides.birthdate ?? birthdate ?? undefined,
            birth_place: overrides.birthPlace ?? birthPlace ?? undefined,
            avatar_url: avatarUrl ?? undefined,
            email: sessionUser.email ?? undefined,
            // Store additional OAuth metadata
            oauth_provider: userMetadata.provider,
            oauth_data: {
              ...googleData,
              ...outlookData,
              raw_metadata: userMetadata
            }
          };
          
          await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' });
        } catch (error) {
          console.error('Error creating/updating profile:', error);
        }
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

  const signInWithOAuth = useCallback(async (provider: "google" | "github" | "gitlab" | "bitbucket" | "azure") => {
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


