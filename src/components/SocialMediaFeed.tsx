"use client";
import React, { useEffect, useState } from "react";
import { Twitter, Instagram, MessageSquare, Heart, Share2 } from "lucide-react";
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
        author: "Elena Verde",
        handle: "@elenagreen",
        content: "Just joined the beach cleanup in Barcelona! Incredible energy today. #EcoNexo #Sustainability",
        source: "twitter",
        likes: 24,
        shares: 5,
        avatar: "https://i.pravatar.cc/150?u=elena"
    },
    {
        id: "2",
        author: "Marco Sostenible",
        handle: "@marcos_eco",
        content: "The new community garden in Madrid is looking amazing. Thanks #EcoNexo for the coordination!",
        source: "instagram",
        likes: 56,
        shares: 12,
        avatar: "https://i.pravatar.cc/150?u=marco"
    },
    {
        id: "3",
        author: "Green Warrior",
        handle: "@grnwarrior",
        content: "Reforestation goals for 2026 are looking bright. Proud to be part of this community. #EcoNexo",
        source: "twitter",
        likes: 89,
        shares: 42,
        avatar: "https://i.pravatar.cc/150?u=warrior"
    },
    {
        id: "4",
        author: "Sophie Nature",
        handle: "@sophie_n",
        content: "Amazing workshop today in Berlin about urban composting. Highly recommended! #EcoNexo",
        source: "instagram",
        likes: 112,
        shares: 18,
        avatar: "https://i.pravatar.cc/150?u=sophie"
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
                                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full ring-2 ring-green-600/20" />
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
