"use client";

/**
 * ThemeProvider — manages dark/light mode for the entire app.
 *
 * Strategy:
 *  1. On first mount, reads the saved preference from localStorage.
 *  2. Falls back to dark mode when localStorage is unavailable (SSR / private).
 *  3. Writes the "dark" or "light" class onto <html> so Tailwind darkMode:"class"
 *     and the CSS custom properties in globals.css take effect immediately.
 *  4. Persists any change back to localStorage.
 *
 * `suppressHydrationWarning` on <html> (set in layout.tsx) prevents React from
 * warning about the server-rendered "dark" class being replaced on the client.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "portfolio-theme";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // On mount: read persisted preference (safe even in private / SSR contexts)
  useEffect(() => {
    let saved: Theme = "dark";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "dark" || raw === "light") saved = raw;
    } catch {
      // localStorage unavailable — keep default dark
    }
    applyTheme(saved);
    setThemeState(saved);
  }, []);

  const applyTheme = (t: Theme) => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(t);
  };

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
