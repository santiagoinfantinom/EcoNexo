"use client";
import { useTheme } from "@/lib/theme";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🌙 ThemeToggle: Component mounted');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log('🌙 ThemeToggle: Button clicked! Current theme:', theme, 'Switching to:', newTheme);
    setTheme(newTheme);
  };

  console.log('🌙 ThemeToggle: Rendering with theme:', theme, 'mounted:', mounted);

  if (!mounted) {
    console.log('🌙 ThemeToggle: Not mounted yet, returning null');
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-20 left-4 z-[100] h-12 w-12 rounded-full bg-white/95 backdrop-blur border-2 border-gray-300 shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{ 
        position: 'fixed',
        top: '80px',
        left: '16px',
        zIndex: 100,
        height: '48px',
        width: '48px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #d1d5db',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease'
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
