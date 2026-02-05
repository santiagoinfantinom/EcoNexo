"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";
import { useI18n } from "@/lib/i18n";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useI18n(); // Assuming useI18n provides a t() function, based on AuthModal
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get("code");
            const errorParam = searchParams.get("error");
            const errorDescription = searchParams.get("error_description");

            if (errorParam) {
                console.error("Auth error:", errorParam, errorDescription);
                setError(errorDescription || errorParam);
                setTimeout(() => router.push("/"), 3000);
                return;
            }

            if (code) {
                const supabase = getSupabase();
                try {
                    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

                    if (sessionError) {
                        console.error("Session exchange error:", sessionError);
                        setError(sessionError.message);
                        return;
                    }

                    // Successful authentication
                    // The onAuthStateChange listener in AuthProvider will pick up the session
                    // We just redirect to the destination
                    router.push("/perfil");
                } catch (err) {
                    console.error("Unexpected error during auth callback:", err);
                    setError("An unexpected error occurred.");
                }
            } else {
                // No code, redirect home
                router.push("/");
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex bg-gls-primary min-h-screen flex-col items-center justify-center p-4">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow max-w-md w-full text-center">
                    <h3 className="font-bold mb-2">Authentication Error</h3>
                    <p>{error}</p>
                    <p className="text-sm mt-4">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gls-primary min-h-screen flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Authenticating...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
