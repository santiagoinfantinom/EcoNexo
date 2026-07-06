"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

interface FavoriteButtonProps {
    type: 'event' | 'project' | 'job';
    id: string;
    data: any; // The full data object to save
    className?: string;
    iconSize?: string;
}

export default function FavoriteButton({ type, id, data, className, iconSize = "text-xl" }: FavoriteButtonProps) {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const dbFavoriteType: 'event' | 'project' | null = type === 'job' ? null : type;

    const checkSavedStatus = useCallback(async () => {
        // Guest/Local mode
        if (!user || !isSupabaseConfigured() || !dbFavoriteType) {
            try {
                const raw = localStorage.getItem('econexo:saved');
                if (raw) {
                    const list = JSON.parse(raw);
                    const isSaved = list.some((i: any) => i.type === type && i.id === id);
                    setSaved(isSaved);
                }
            } catch (e) {
                console.error("Error checking saved status", e);
            }
            return;
        }

        // Authenticated
        const supabase = getSupabase();
        const { data: found } = await supabase
            .from('favorites')
            .select('item_id')
            .eq('user_id', user.id)
            .eq('item_type', dbFavoriteType)
            .eq('item_id', id)
            .single();

        if (found) setSaved(true);
    }, [dbFavoriteType, id, type, user]);

    useEffect(() => {
        checkSavedStatus();
    }, [checkSavedStatus]);

    const toggleSaved = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a card
        e.stopPropagation();

        // Guest/Local mode
        if (!user || !isSupabaseConfigured() || !dbFavoriteType) {
            try {
                const raw = localStorage.getItem('econexo:saved');
                const list: any[] = raw ? JSON.parse(raw) : [];
                const idx = list.findIndex((i: any) => i.type === type && i.id === id);

                if (idx >= 0) {
                    list.splice(idx, 1);
                    setSaved(false);
                    trackEvent('save_item', { type, id, action: 'remove', auth: 0 });
                } else {
                    // Ensure we save the type and id, plus spread the data
                    // Map name to title if needed for consistency
                    const itemToSave = {
                        type,
                        id,
                        ...data,
                        title: data.title || data.name, // Ensure title exists
                        savedAt: new Date().toISOString()
                    };
                    list.push(itemToSave);
                    setSaved(true);
                    trackEvent('save_item', { type, id, action: 'add', auth: 0 });
                }
                localStorage.setItem('econexo:saved', JSON.stringify(list));
            } catch (e) {
                console.error("Error toggling favorite", e);
            }
            return;
        }

        // Authenticated
        const supabase = getSupabase();
        if (saved) {
            await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('item_type', dbFavoriteType)
                .eq('item_id', id);
            setSaved(false);
            trackEvent('save_item', { type, id, action: 'remove', auth: 1 });
        } else {
            const { error } = await supabase
                .from('favorites')
                .insert({ user_id: user.id, item_type: dbFavoriteType, item_id: id });
            if (!error) setSaved(true);
            trackEvent('save_item', { type, id, action: 'add', auth: 1 });
        }
    };

    return (
        <button
            onClick={toggleSaved}
            className={`transition-all duration-300 transform active:scale-90 ${saved ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500 dark:hover:text-rose-400'} ${className || ''}`}
            aria-label={saved ? "Remove from favorites" : "Add to favorites"}
            title={saved ? 'Saved in favorites' : 'Save to favorites'}
        >
            {saved ? (
                <svg className={iconSize === "text-xl" ? "w-6 h-6" : "w-8 h-8"} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0116.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ) : (
                <svg className={iconSize === "text-xl" ? "w-6 h-6" : "w-8 h-8"} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0116.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            )}
        </button>
    );
}
