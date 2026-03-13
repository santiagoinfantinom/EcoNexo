"use client";
import { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface TagInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    suggestions?: string[];
    onlyAllowSuggestions?: boolean;
}

export default function TagInput({
    value,
    onChange,
    disabled = false,
    placeholder = "",
    className = "",
    suggestions = [],
    onlyAllowSuggestions = false
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert string to array of tags
    const tags = value ? value.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

    useEffect(() => {
        if (inputValue.trim() && suggestions.length > 0) {
            const filtered = suggestions.filter(s =>
                s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [inputValue, suggestions, tags]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;

        // If validation is on, check if it's in suggestions
        if (onlyAllowSuggestions && suggestions.length > 0) {
            const match = suggestions.find(s => s.toLowerCase() === trimmedTag.toLowerCase());
            if (match) {
                if (!tags.includes(match)) {
                    const newTags = [...tags, match];
                    onChange(newTags.join(', '));
                }
                setInputValue('');
                setShowSuggestions(false);
            }
            // If it doesn't match, we don't add it
            return;
        }

        if (!tags.includes(trimmedTag)) {
            const newTags = [...tags, trimmedTag];
            onChange(newTags.join(', '));
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (indexToRemove: number) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onChange(newTags.join(', '));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleBlur = () => {
        // Small delay to allow clicking on a suggestion
        setTimeout(() => {
            if (inputValue.trim() && !showSuggestions) {
                addTag(inputValue);
            }
        }, 200);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent dark:bg-slate-700 ${disabled ? 'bg-gray-100 dark:bg-slate-600' : 'bg-white'} ${className}`}>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
                        >
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="ml-1 hover:text-green-600 dark:hover:text-green-200 focus:outline-none"
                                    aria-label={`Remove ${tag}`}
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                {!disabled && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        onFocus={() => inputValue.trim() && filteredSuggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={tags.length === 0 ? placeholder : ''}
                        className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                    />
                )}
            </div>

            {showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => addTag(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
