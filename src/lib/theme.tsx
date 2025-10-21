"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("econexo:theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      console.log('🎨 Theme changed to:', theme);
    }
  }, [theme, mounted]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (t: Theme) => {
        console.log('🎨 Setting theme to:', t);
        try { 
          localStorage.setItem("econexo:theme", t); 
          console.log('🎨 Theme saved to localStorage');
        } catch (error) {
          console.error('🎨 Error saving theme to localStorage:', error);
        }
        setThemeState(t);
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}


