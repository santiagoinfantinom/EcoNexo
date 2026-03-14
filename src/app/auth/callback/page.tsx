"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("Authenticating...");

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get("code");
            const next = searchParams.get("next") || "/";
            const errorParam = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            if (errorParam) {
                console.error("Auth error from provider:", errorParam, errorDescription);
                setError(errorDescription || errorParam);
                setTimeout(() => router.push("/"), 3000);
                return;
            }

            const supabase = getSupabase();

            // Strategy 1: PKCE code exchange
            if (code) {
                setStatus("Exchanging authorization code...");
                try {
                    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

                    if (sessionError) {
                        console.error("Session exchange error:", sessionError);
                        const { data: sessionData } = await supabase.auth.getSession();
                        if (sessionData.session) {
                            await handlePostLoginRedirect(sessionData.session.user, next);
                            return;
                        }
                        setError(`Authentication failed: ${sessionError.message}`);
                        setTimeout(() => router.push("/"), 4000);
                        return;
                    }

                    if (data.session) {
                        await handlePostLoginRedirect(data.session.user, next);
                        return;
                    }
                } catch (err) {
                    console.error("Unexpected error during code exchange:", err);
                }
            }

            // Strategy 2: Hash fragment (implicit flow)
            if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
                setStatus("Processing authentication token...");
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    if (event === "SIGNED_IN" && session) {
                        subscription.unsubscribe();
                        await handlePostLoginRedirect(session.user, next);
                    }
                });

                setTimeout(async () => {
                    subscription.unsubscribe();
                    const { data: sessionData } = await supabase.auth.getSession();
                    if (sessionData.session) {
                        await handlePostLoginRedirect(sessionData.session.user, next);
                    } else {
                        setError("Authentication timed out. Please try again.");
                        setTimeout(() => router.push("/"), 3000);
                    }
                }, 5000);
                return;
            }

            // Strategy 3: Check for existing session
            setStatus("Checking session...");
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
                await handlePostLoginRedirect(sessionData.session.user, next);
            } else {
                router.push("/");
            }
        };

        const handlePostLoginRedirect = async (user: any, nextPath: string) => {
            try {
                const supabase = getSupabase();
                // Check if profile is complete
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, country, bio, phone')
                    .eq('id', user.id)
                    .single();

                // If profile is new or missing key info, redirect to profile
                // We also check if the user is coming from the profile page already to avoid loops
                const isProfileIncomplete = !profile || !profile.first_name || (!profile.bio && !profile.phone);

                if (isProfileIncomplete && !nextPath.includes('/perfil')) {
                    console.log("Redirecting to profile for completion");
                    router.push(`/perfil?next=${encodeURIComponent(nextPath)}`);
                } else {
                    console.log("Redirecting to intended destination:", nextPath);
                    router.push(nextPath);
                }
            } catch (err) {
                console.error("Error during post-login redirect:", err);
                router.push(nextPath);
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 min-h-screen flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Authentication Error</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{error}</p>
                    <p className="text-xs text-gray-400">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 min-h-screen flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{status}</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}

