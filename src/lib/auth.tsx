"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "./supabaseClient";

type AuthUser = {
  id: string;
  email: string | null;
  profile?: any | null;
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
      // No Supabase in this environment
      // Try LocalStorage fallback
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('econexo_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.id) {
              setUser({ id: parsedUser.id, email: parsedUser.email || null });
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    let mounted = true;

    const init = async () => {
      setLoading(true);

      // 1. Try Supabase session first
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const sessionUser = data.session?.user ?? null;

      if (sessionUser) {
        try {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();
          setUser({ id: sessionUser.id, email: sessionUser.email ?? null, profile });
        } catch (err) {
          setUser({ id: sessionUser.id, email: sessionUser.email ?? null });
        }
      } else {
        // 2. Fallback to LocalStorage (for custom OAuth / Demo mode)
        if (typeof window !== 'undefined') {
          try {
            const storedUser = localStorage.getItem('econexo_user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser && parsedUser.id) {
                console.log('✅ Found user in localStorage:', parsedUser.email);
                setUser({ id: parsedUser.id, email: parsedUser.email || null });
              }
            }
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;

      if (!sessionUser) {
        setUser(null);
        return;
      }

      // Upsert profile on login with enhanced OAuth data extraction
      try {
        const userMetadata = sessionUser.user_metadata || {};

        // Extract full name from various OAuth providers
        const fullName = userMetadata.full_name ||
          userMetadata.name ||
          userMetadata.display_name ||
          (userMetadata.given_name && userMetadata.family_name ?
            `${userMetadata.given_name} ${userMetadata.family_name}` : null);

        // Extract first and last names separately
        const firstName = userMetadata.given_name || userMetadata.first_name || '';
        const lastName = userMetadata.family_name || userMetadata.last_name || '';

        // Extract birthdate from various formats
        const birthdateRaw = userMetadata.birthdate ||
          userMetadata.dob ||
          userMetadata.date_of_birth ||
          userMetadata.birth_date;
        const birthdate = birthdateRaw ? new Date(birthdateRaw).toISOString().slice(0, 10) : null;

        // Calculate age if birthdate is available
        const age = birthdate ? Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

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

        // Extract gender from OAuth data
        const gender = userMetadata.gender || userMetadata.sex || '';

        // Extract phone number (if available)
        const phone = userMetadata.phone_number || userMetadata.phone || '';

        // Extract locale/language preference
        const preferredLanguage = userMetadata.locale || userMetadata.language || 'en';

        // Extract additional Google-specific data
        const googleData = userMetadata.provider === 'google' ? {
          verified_email: userMetadata.email_verified,
          locale: userMetadata.locale,
          hd: userMetadata.hd, // Google Workspace domain
          given_name: userMetadata.given_name,
          family_name: userMetadata.family_name,
          picture: userMetadata.picture,
          email_verified: userMetadata.email_verified,
          sub: userMetadata.sub, // Google user ID
          iss: userMetadata.iss, // Issuer
          aud: userMetadata.aud, // Audience
          iat: userMetadata.iat, // Issued at
          exp: userMetadata.exp, // Expires at
        } : {};

        // Extract additional Outlook/Microsoft-specific data
        const outlookData = userMetadata.provider === 'azure' ? {
          tenant_id: userMetadata.tid,
          preferred_username: userMetadata.preferred_username,
          upn: userMetadata.upn, // User Principal Name
          given_name: userMetadata.given_name,
          family_name: userMetadata.family_name,
          name: userMetadata.name,
          oid: userMetadata.oid, // Object ID
          sub: userMetadata.sub, // Subject
          aud: userMetadata.aud, // Audience
          iss: userMetadata.iss, // Issuer
          iat: userMetadata.iat, // Issued at
          exp: userMetadata.exp, // Expires at
          aio: userMetadata.aio, // Azure internal
          utid: userMetadata.utid, // User tenant ID
          rh: userMetadata.rh, // Refresh token hash
        } : {};

        // Get any pending profile data from localStorage
        const pending = typeof window !== 'undefined' ? localStorage.getItem('econexo:pendingProfile') : null;
        let overrides: any = {};
        if (pending) {
          try { overrides = JSON.parse(pending); } catch { }
          localStorage.removeItem('econexo:pendingProfile');
        }

        // Create profile data with OAuth data and overrides
        const profileData = {
          id: sessionUser.id,
          full_name: overrides.name ?? fullName ?? undefined,
          first_name: overrides.first_name ?? firstName ?? undefined,
          last_name: overrides.last_name ?? lastName ?? undefined,
          birthdate: overrides.birthdate ?? birthdate ?? undefined,
          birth_place: overrides.birthPlace ?? birthPlace ?? undefined,
          avatar_url: avatarUrl ?? undefined,
          email: sessionUser.email ?? undefined,
          phone: overrides.phone ?? phone ?? undefined,
          gender: overrides.gender ?? gender ?? undefined,
          preferred_language: overrides.preferred_language ?? preferredLanguage ?? undefined,
          // Store additional OAuth metadata
          oauth_provider: userMetadata.provider,
          oauth_data: {
            ...googleData,
            ...outlookData,
            age: age,
            raw_metadata: userMetadata
          }
        };

        const { data: finalProfile } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' }).select().single();

        if (mounted) {
          setUser({ id: sessionUser.id, email: sessionUser.email ?? null, profile: finalProfile });
        }
      } catch (error) {
        console.error('Error creating/updating profile:', error);
        if (mounted) {
          try {
            const { data: fallbackProfile } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();
            setUser({ id: sessionUser.id, email: sessionUser.email ?? null, profile: fallbackProfile });
          } catch (err) {
            // Final fallback to prevent hanging, but prioritized for profile data
            setUser({ id: sessionUser.id, email: sessionUser.email ?? null });
          }
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
    if (!isSupabaseConfigured()) {
      // In development mode without Supabase, simulate login with localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem('econexo_user', JSON.stringify({
          id: 'demo-' + Math.random().toString(36).substring(7),
          email: email,
        }));
        localStorage.setItem('econexo_auth_provider', 'email');
        // Simulate session
        window.location.reload();
      }
      return {};
    }
    const supabase = getSupabase();
    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } });
    return { error: error?.message };
  }, []);

  const signInWithOAuth = useCallback(async (provider: "google" | "github" | "gitlab" | "bitbucket" | "azure") => {
    if (!isSupabaseConfigured()) return { error: "Supabase not configured" };

    try {
      const supabase = getSupabase();

      // Handle GitHub Pages subpath dynamic redirection
      const isGH = typeof window !== "undefined" && window.location.hostname.includes("github.io");
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

      // If we are on GH Pages, strip the basePath from currentPath for the 'next' param
      // because router.push adds it back automatically.
      const relativePath = isGH && currentPath.startsWith('/EcoNexo')
        ? currentPath.replace('/EcoNexo', '') || '/'
        : currentPath;

      let redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(relativePath)}` : undefined;

      if (isGH) {
        redirectTo = `${window.location.origin}/EcoNexo/auth/callback/?next=${encodeURIComponent(relativePath)}`;
      }

      // Configure OAuth options
      const options: any = { redirectTo };

      if (provider === "google") {
        options.scopes = 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read';
        options.queryParams = {
          access_type: 'offline',
          prompt: 'consent',
        };
      }

      if (provider === "azure") {
        options.scopes = 'openid profile email User.Read';
      }

      const { error } = await supabase.auth.signInWithOAuth({ provider, options });

      if (error) {
        console.error("OAuth error:", error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error("OAuth error:", error);
      return { error: "Error de autenticación. Intenta de nuevo." };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem('econexo_user');
        localStorage.removeItem('econexo_auth_provider');
        sessionStorage.removeItem('econexo_welcomed');
      }
      if (isSupabaseConfigured()) {
        const supabase = getSupabase();
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signInWithMagicLink, signInWithOAuth, signOut }), [user, loading, signInWithMagicLink, signInWithOAuth, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


