"use client";

import LanguagePicker from "@/components/LanguagePicker";

interface LanguageSwitcherProps {
  className?: string;
}

/** Floating language control — top-right to avoid overlapping map / PWA prompts. */
export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  return (
    <div className={`fixed right-4 top-4 z-[90] ${className}`}>
      <LanguagePicker />
    </div>
  );
}
