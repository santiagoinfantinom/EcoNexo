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
            const errorParam = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            if (errorParam) {
                console.error("Auth error from provider:", errorParam, errorDescription);
                setError(errorDescription || errorParam);
                setTimeout(() => router.push("/"), 3000);
                return;
            }

            const supabase = getSupabase();

            // Strategy 1: PKCE code exchange (most common with Supabase OAuth)
            if (code) {
                setStatus("Exchanging authorization code...");
                try {
                    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

                    if (sessionError) {
                        console.error("Session exchange error:", sessionError);
                        // If code exchange fails, try getting session directly
                        // (Supabase may have already processed it via the onAuthStateChange listener)
                        const { data: sessionData } = await supabase.auth.getSession();
                        if (sessionData.session) {
                            console.log("✅ Session found via getSession fallback");
                            router.push("/");
                            return;
                        }
                        setError(`Authentication failed: ${sessionError.message}`);
                        setTimeout(() => router.push("/"), 4000);
                        return;
                    }

                    if (data.session) {
                        console.log("✅ Successfully authenticated via code exchange");
                        router.push("/");
                        return;
                    }
                } catch (err) {
                    console.error("Unexpected error during code exchange:", err);
                    // Fall through to session check
                }
            }

            // Strategy 2: Hash fragment (implicit flow)
            if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
                setStatus("Processing authentication token...");
                // Supabase client automatically parses the hash
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === "SIGNED_IN" && session) {
                        console.log("✅ Successfully authenticated via implicit flow");
                        subscription.unsubscribe();
                        router.push("/");
                    }
                });

                // Timeout fallback
                setTimeout(async () => {
                    subscription.unsubscribe();
                    const { data: sessionData } = await supabase.auth.getSession();
                    if (sessionData.session) {
                        router.push("/");
                    } else {
                        setError("Authentication timed out. Please try again.");
                        setTimeout(() => router.push("/"), 3000);
                    }
                }, 5000);
                return;
            }

            // Strategy 3: Check for existing session (edge case)
            setStatus("Checking session...");
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
                console.log("✅ Existing session found");
                router.push("/");
            } else {
                // No auth method worked, redirect home
                router.push("/");
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

