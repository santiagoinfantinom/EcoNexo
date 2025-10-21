"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🌙 ThemeToggle: Component mounted');
    setMounted(true);
    
    // Load theme from localStorage
    try {
      const saved = localStorage.getItem("econexo:theme") as "light" | "dark" | null;
      if (saved === "light" || saved === "dark") {
        console.log('🌙 ThemeToggle: Loading theme from localStorage:', saved);
        setTheme(saved);
      }
    } catch (error) {
      console.error('🌙 ThemeToggle: Error loading theme:', error);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('🌙 ThemeToggle: Applying theme to document:', theme);
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      console.log('🌙 ThemeToggle: data-theme attribute set to:', root.getAttribute("data-theme"));
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log('🌙 ThemeToggle: Button clicked! Current theme:', theme, 'Switching to:', newTheme);
    
    try {
      localStorage.setItem("econexo:theme", newTheme);
      console.log('🌙 ThemeToggle: Theme saved to localStorage');
    } catch (error) {
      console.error('🌙 ThemeToggle: Error saving theme:', error);
    }
    
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
