"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });

interface CTASectionProps { }

export default function CTASection() {
    const { t } = useI18n();
    const { user } = useAuth();
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("register");

    return (
        <>
            <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 pattern-dots opacity-20"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
                        {t('readyToMakeDifference')}
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-blue-50/90 font-light">
                        {t('readyDescription')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => {
                                if (user) {
                                    router.push('/eventos');
                                } else {
                                    setAuthMode("register");
                                    setIsAuthModalOpen(true);
                                }
                            }}
                            className="bg-white text-green-600 px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            {t('letsGo')}
                        </button>
                        <Link
                            href="/chat"
                            className="bg-transparent border-2 border-white/50 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            {t('joinCommunity')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
            />
        </>
    );
}
