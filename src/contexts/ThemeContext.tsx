import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

type Theme = 'dark' | 'light';

interface RippleState {
  x: number;
  y: number;
  nextTheme: Theme;
  active: boolean;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (clickX?: number, clickY?: number) => void;
  ripple: RippleState | null;
  onRippleDone: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  ripple: null,
  onRippleDone: () => {},
});

const STORAGE_KEY = 'portfolio-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  const [ripple, setRipple] = useState<RippleState | null>(null);

  const onRippleDone = useCallback(() => {
    setRipple(null);
  }, []);

  const toggleTheme = useCallback((clickX?: number, clickY?: number) => {
    setTheme((prev) => prev === 'dark' ? 'light' : 'dark');
    if (clickX !== undefined && clickY !== undefined) {
      const next = theme === 'dark' ? 'light' : 'dark';
      setRipple({ x: clickX, y: clickY, nextTheme: next, active: true });
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#faf8f4');
    }
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ripple, onRippleDone }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
