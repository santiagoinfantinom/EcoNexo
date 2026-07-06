"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  console.log('🎨 ThemeProvider: Rendering with theme:', theme, 'mounted:', mounted);

  useEffect(() => {
    console.log('🎨 ThemeProvider: useEffect - setting mounted to true');
    setMounted(true);
    try {
      const saved = localStorage.getItem("econexo:theme") as Theme | null;
      console.log('🎨 ThemeProvider: Saved theme from localStorage:', saved);
      if (saved === "light" || saved === "dark") {
        console.log('🎨 ThemeProvider: Setting theme from localStorage:', saved);
        setThemeState(saved);
      }
    } catch (error) {
      console.error('🎨 ThemeProvider: Error reading from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('🎨 ThemeProvider: Applying theme to document:', theme);
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      console.log('🎨 ThemeProvider: data-theme attribute set to:', root.getAttribute("data-theme"));
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


