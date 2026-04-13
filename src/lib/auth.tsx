"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "./supabaseClient";
import { createOAuthService } from "./oauth";

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
              const fallbackProfile = parsedUser.profile || {
                full_name: parsedUser.name || undefined,
                first_name: parsedUser.given_name || parsedUser.first_name || undefined,
                avatar_url: parsedUser.picture || parsedUser.avatar_url || undefined,
              };
              setUser({ id: parsedUser.id, email: parsedUser.email || null, profile: fallbackProfile });
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
                const fallbackProfile = parsedUser.profile || {
                  full_name: parsedUser.name || undefined,
                  first_name: parsedUser.given_name || parsedUser.first_name || undefined,
                  avatar_url: parsedUser.picture || parsedUser.avatar_url || undefined,
                };
                setUser({ id: parsedUser.id, email: parsedUser.email || null, profile: fallbackProfile });
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
        // Prevent clearing dummy user
        if (typeof window !== 'undefined' && localStorage.getItem('econexo_user')) {
          return;
        }
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
    // FORCE DUMMY LOGIN
    if (typeof window !== "undefined") {
      localStorage.setItem('econexo_user', JSON.stringify({
        id: 'dummy-' + Math.random().toString(36).substring(7),
        email: email,
        profile: {
          full_name: 'Eco User',
          first_name: 'Eco',
          last_name: 'User',
          avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        }
      }));
      localStorage.setItem('econexo_auth_provider', 'email');
      window.location.reload();
    }
    return {};
  }, []);

  const signInWithOAuth = useCallback(async (provider: "google" | "github" | "gitlab" | "bitbucket" | "azure") => {
    // Real implementation for Google
    if (provider === 'google') {
      try {
        const oauthService = await createOAuthService();
        const result = await oauthService.authenticateWithGoogle();
        if (!result.success && result.error) {
          return { error: result.error };
        }
        return {}; // Redirection is happening
      } catch (error) {
        console.error('Error initiating Google OAuth:', error);
        return { error: 'Error al iniciar sesión con Google' };
      }
    }

    // FORCE DUMMY LOGIN for others
    if (typeof window !== "undefined") {
      localStorage.setItem('econexo_user', JSON.stringify({
        id: 'dummy-' + Math.random().toString(36).substring(7),
        email: `tester-${provider}@econexo.eu`,
        profile: {
          full_name: 'Eco Tester',
          first_name: 'Eco',
          last_name: 'Tester',
          avatar_url: 'https://i.pravatar.cc/150?img=12',
        }
      }));
      localStorage.setItem('econexo_auth_provider', provider);
      window.location.reload();
    }
    return {};
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


