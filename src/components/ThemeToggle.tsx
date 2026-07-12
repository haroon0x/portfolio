import React, { useRef, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const iconVariants = {
  initial: { rotate: -120, opacity: 0, scale: 0.3 },
  animate: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 120, opacity: 0, scale: 0.3 },
};

const iconTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      toggleTheme(cx, cy);
    } else {
      toggleTheme();
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-full border border-accent/40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.6, 2.2],
            }}
            transition={{
              duration: 2,
              times: [0, 0.5, 1],
              repeat: 1,
              repeatDelay: 0.8,
            }}
          />
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="relative flex items-center gap-2 pl-2 pr-3.5 py-2 rounded-full border border-border bg-surface hover:bg-hover-bg hover:border-accent/40 transition-[background-color,border-color,box-shadow] duration-300 active:scale-[0.95] shadow-sm"
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={iconTransition}
            className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full"
            style={{
              background: theme === 'dark'
                ? 'rgba(94, 106, 210, 0.18)'
                : 'rgba(183, 45, 59, 0.12)',
            }}
          >
            {theme === 'dark' ? (
              <Moon size={15} className="text-accent" />
            ) : (
              <Sun size={15} className="text-accent" />
            )}
          </motion.div>
        </AnimatePresence>

        <span className="text-xs font-medium text-text-secondary hidden sm:inline relative z-10">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </motion.button>
    </div>
  );
}
