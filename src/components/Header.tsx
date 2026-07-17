import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);

    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
      navigate({ pathname: '/', hash: `#${id}` }, { replace: true });
      return;
    }

    navigate({ pathname: '/', hash: `#${id}` });
  };

  return (
    <header ref={headerRef} className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'border-border bg-background/90 shadow-header backdrop-blur-xl' : 'border-transparent bg-background/0'}`}>
      <nav aria-label="Primary navigation" className="safe-x mx-auto flex h-20 max-w-[96rem] items-center justify-between sm:px-8 lg:h-24 lg:px-12">
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="group flex min-h-11 items-center gap-3 text-left"
          aria-label="Go to top"
        >
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-text-secondary transition-colors group-hover:text-text-primary">
            Muhammed Haroon
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="min-h-11 px-4 font-mono text-[0.66rem] uppercase tracking-[0.17em] text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/blog"
            onMouseEnter={() => import('../pages/Blog')}
            className="flex min-h-11 items-center px-4 font-mono text-[0.66rem] uppercase tracking-[0.17em] text-text-secondary transition-colors hover:text-text-primary"
          >
            Blog
          </Link>
          <Link
            to="/pull-requests"
            onMouseEnter={() => import('../pages/PullRequests')}
            className="flex min-h-11 items-center px-4 font-mono text-[0.66rem] uppercase tracking-[0.17em] text-text-secondary transition-colors hover:text-text-primary"
          >
            Pull requests
          </Link>
          <a
            href="mailto:haroonbmc0@gmail.com"
            className="ml-3 inline-flex min-h-11 items-center rounded-control border border-border px-5 font-mono text-[0.66rem] uppercase tracking-[0.17em] text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Let&apos;s talk ↗
          </a>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-primary"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-surface-strong/95 px-4 py-6 shadow-header backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[96rem] flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="flex min-h-14 items-center justify-between border-b border-border font-mono text-xs uppercase tracking-[0.16em] text-text-primary"
                >
                  {item.label}
                  <span className="text-accent">↘</span>
                </button>
              ))}
              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-14 items-center justify-between border-b border-border font-mono text-xs uppercase tracking-[0.16em] text-text-primary"
              >
                Blog
                <span className="text-accent">↗</span>
              </Link>
              <Link
                to="/pull-requests"
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-14 items-center justify-between border-b border-border font-mono text-xs uppercase tracking-[0.16em] text-text-primary"
              >
                Pull requests
                <span className="text-accent">↗</span>
              </Link>
              <a
                href="mailto:haroonbmc0@gmail.com"
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 flex min-h-12 items-center justify-center rounded-control bg-accent px-5 font-mono text-xs uppercase tracking-[0.16em] text-accent-foreground"
              >
                Let&apos;s talk ↗
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
