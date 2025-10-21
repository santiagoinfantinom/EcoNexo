"use client";
import { useTheme } from "@/lib/theme";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log('🌙 ThemeToggle: Current theme:', theme, 'Switching to:', newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-20 left-4 z-[100] h-12 w-12 rounded-full bg-white/95 backdrop-blur border-2 border-gray-300 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
