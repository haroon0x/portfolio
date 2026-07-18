import { useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const transitionTimeoutRef = useRef<number>();

  useEffect(() => () => {
    window.clearTimeout(transitionTimeoutRef.current);
    document.documentElement.classList.remove('theme-transition');
  }, []);

  const handleToggle = () => {
    const root = document.documentElement;
    window.clearTimeout(transitionTimeoutRef.current);
    root.classList.add('theme-transition');
    toggleTheme();
    transitionTimeoutRef.current = window.setTimeout(() => root.classList.remove('theme-transition'), 350);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -35, scale: 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 35, scale: 0.75 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
