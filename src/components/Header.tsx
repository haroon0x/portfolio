import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Heart } from 'lucide-react';
import { XIcon } from './icons/XIcon';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Work', id: 'work' },
    { name: 'Pull Requests', url: '/pull-requests' },
    { name: 'Resume', url: 'https://drive.google.com/file/d/1fcm8Z6ul2k97JCTBcJoufh6UHVeSKiOv/view?usp=sharing' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: XIcon, url: 'https://x.com/skywalkerr0x' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="safe-top fixed top-3 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none sm:top-6 sm:px-4"
      >
        <nav aria-label="Primary navigation" className={`
          pointer-events-auto
          flex w-full max-w-[calc(100vw-1.5rem)] items-center justify-between gap-2
          px-3 py-2 sm:w-auto sm:max-w-none sm:px-4 md:gap-6 md:px-6 md:py-3
          rounded-full
          bg-white/80 backdrop-blur-xl
          border border-border
          shadow-petal
          transition-colors duration-500
          ${isScrolled ? 'bg-white/95 shadow-petal-lg' : ''}
        `}>
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="min-w-0 text-base font-bold group focus:outline-none sm:text-lg"
            aria-label="Go to top"
          >
            <span className="block truncate text-ink-secondary group-hover:text-accent transition-colors duration-300">
              haroon0x
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Magnetic key={item.name}>
                {'url' in item && item.url ? (
                  item.url.startsWith('/') ? (
                    <Link
                      to={item.url}
                      onMouseEnter={() => {
                        if (item.url === '/pull-requests') import('../pages/PullRequests');
                      }}
                      className="block px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-full transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-full transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                    >
                      {item.name}
                    </a>
                  )
                ) : (
                  <button
                    onClick={() => item.id && scrollToSection(item.id)}
                    className="block px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-full transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                  >
                    {item.name}
                  </button>
                )}
              </Magnetic>
            ))}
          </div>

          {/* Right Side - Sponsor & Socials */}
          <div className="flex shrink-0 items-center gap-1.5 pl-2 border-l border-border sm:gap-3 sm:pl-3">
            <Magnetic>
              <a 
                href="https://github.com/sponsors/haroon0x" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink bg-ink/[0.03] hover:bg-ink/[0.06] border border-border rounded-full transition-[color,background-color,border-color,transform] duration-300 group active:scale-[0.96]"
              >
                <Heart size={12} className="group-hover:text-accent group-hover:fill-accent transition-colors" />
                <span>Sponsor</span>
              </a>
            </Magnetic>

            <div className="hidden sm:flex items-center gap-1">
              {socialLinks.map((social) => (
                <Magnetic key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name} profile`}
                    className="block p-3 text-ink-muted hover:text-accent hover:bg-accent-muted rounded-full transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                  >
                    <social.icon size={16} />
                  </a>
                </Magnetic>
              ))}
            </div>

            {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-3 text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-full transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-ink/20 md:hidden"
            />
            <motion.div
              id="mobile-nav-menu"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-3 right-3 z-40 md:hidden sm:top-24 sm:left-4 sm:right-4"
            >
              <div className="bg-white/97 backdrop-blur-xl rounded-2xl border border-border shadow-petal-lg p-3 sm:p-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  'url' in item && item.url ? (
                    item.url.startsWith('/') ? (
                      <Link
                        key={item.name}
                        to={item.url}
                        onMouseEnter={() => {
                          if (item.url === '/pull-requests') import('../pages/PullRequests');
                        }}
                        className="p-3 text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-xl transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-xl transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                      >
                        {item.name}
                      </a>
                    )
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id) {
                          scrollToSection(item.id);
                        }
                        setIsMenuOpen(false);
                      }}
                      className="p-3 text-left text-ink-secondary hover:text-ink hover:bg-ink/[0.04] rounded-xl transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                    >
                      {item.name}
                    </button>
                  )
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name} profile`}
                    className="p-3 text-ink-muted hover:text-accent hover:bg-accent-muted rounded-xl transition-[color,background-color,transform] duration-300 active:scale-[0.96]"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
