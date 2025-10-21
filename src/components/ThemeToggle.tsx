"use client";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed top-20 left-4 z-[100] h-12 w-12 rounded-full bg-white/95 backdrop-blur border-2 border-gray-300 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
