"use client";
import React, { useEffect, useState } from "react";
import { Twitter, Instagram, MessageSquare, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

interface SocialPost {
    id: string;
    author: string;
    handle: string;
    content: string;
    source: "twitter" | "instagram";
    likes: number;
    shares: number;
    avatar: string;
}

const MOCK_POSTS: SocialPost[] = [
    {
        id: "1",
        author: "European Eco-Watch",
        handle: "@ecowatch_eu",
        content: "The new Industrial Accelerator Act is a game changer for local clean-tech. Support for sustainable factories is finally here! ⚡ #EcoNexo #Sustainability2026",
        source: "twitter",
        likes: 142,
        shares: 38,
        avatar: "https://i.pravatar.cc/150?u=ecowatch"
    },
    {
        id: "2",
        author: "Green Policy Institute",
        handle: "@greenpolicy_inst",
        content: "Huge win for consumers! The EU's new greenwashing ban means labels must finally be honest. No more fake claims. ✅ #CircularEconomy #EcoNexo",
        source: "twitter",
        likes: 215,
        shares: 89,
        avatar: "https://i.pravatar.cc/150?u=policy"
    },
    {
        id: "3",
        author: "Marine Defenders",
        handle: "@ocean_defenders",
        content: "OceanEye data is rolling in! We're seeing better underwater monitoring than ever before thanks to the new €50M Horizon Europe fund. 🌊 #SaveOurOceans #EcoNexo",
        source: "instagram",
        likes: 567,
        shares: 124,
        avatar: "https://i.pravatar.cc/150?u=ocean"
    },
    {
        id: "4",
        author: "EcoFashion Global",
        handle: "@ecofashion_mag",
        content: "Circular economy in action: Unsold clothes in the EU now HAVE to be recycled or repurposed. The end of fast-fashion waste begins now! 👗♻️",
        source: "instagram",
        likes: 892,
        shares: 456,
        avatar: "https://i.pravatar.cc/150?u=fashion"
    }
];

const CARD_DELAY_CLASSES = [
    "perf-card-enter",
    "perf-card-enter-delay-1",
    "perf-card-enter-delay-2",
];

export default function SocialMediaFeed() {
    const { t } = useI18n();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % MOCK_POSTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const visiblePosts = [
        MOCK_POSTS[currentIndex],
        MOCK_POSTS[(currentIndex + 1) % MOCK_POSTS.length],
        MOCK_POSTS[(currentIndex + 2) % MOCK_POSTS.length],
    ].filter(Boolean);

    return (
        <section className="py-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl mb-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                            {t("liveCommunityActivity") || "Live Community Activity"}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            {t("mentionHashtag") || "#EcoNexo on Social Media"}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            LIVE
                        </div>
                    </div>
                </div>

                <div key={currentIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visiblePosts.map((post, index) => (
                        <div
                            key={`${post.id}-${currentIndex}-${index}`}
                            className={`glass-card p-6 flex flex-col h-full hover:shadow-xl transition-shadow border border-white/40 dark:border-slate-700/40 ${CARD_DELAY_CLASSES[index] || ''}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative w-10 h-10">
                                    <Image src={post.avatar} alt={post.author} fill sizes="40px" className="rounded-full ring-2 ring-green-600/20 object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{post.author}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{post.handle}</p>
                                </div>
                                {post.source === "twitter" ? (
                                    <Twitter className="w-4 h-4 text-sky-500" />
                                ) : (
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                )}
                            </div>

                            <p className="text-slate-700 dark:text-slate-300 text-sm mb-6 flex-1 italic">
                                &quot;{post.content}&quot;
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 transition-colors">
                                        <Heart className="w-3.5 h-3.5" />
                                        {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-600 transition-colors">
                                        <Share2 className="w-3.5 h-3.5" />
                                        {post.shares}
                                    </button>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
