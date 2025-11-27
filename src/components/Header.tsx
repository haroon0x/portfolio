import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Sun, Moon, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Resume', url: 'https://drive.google.com/file/d/1Lg-j32yIQ9TKW6jnEvebK4tJffZ6MIS2/view?usp=sharing' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x', color: 'hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/skywalkerr0x', color: 'hover:text-blue-400' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <nav className={`
          pointer-events-auto
          flex items-center justify-between gap-6
          px-6 py-3
          rounded-full
          bg-zinc-900/40 backdrop-blur-xl
          border border-white/10
          shadow-lg shadow-black/10
          transition-all duration-500
          ${isScrolled ? 'bg-zinc-900/60 shadow-xl' : ''}
        `}>
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="text-lg font-bold group focus:outline-none"
            aria-label="Go to top"
          >
            <span className="text-white group-hover:text-accent transition-colors duration-300">
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
                      className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                    >
                      {item.name}
                    </a>
                  )
                ) : (
                  <button
                    onClick={() => item.id && scrollToSection(item.id)}
                    className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                  >
                    {item.name}
                  </button>
                )}
              </Magnetic>
            ))}
          </div>

          {/* Right Side - Theme & Socials */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <Magnetic>
              <button
                onClick={toggleTheme}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </Magnetic>

            <div className="hidden sm:flex items-center gap-1">
              {socialLinks.map((social) => (
                <Magnetic key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-2 text-white/60 ${social.color} hover:bg-white/10 rounded-full transition-all duration-300`}
                  >
                    <social.icon size={16} />
                  </a>
                </Magnetic>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-300"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  'url' in item && item.url ? (
                    item.url.startsWith('/') ? (
                      <Link
                        key={item.name}
                        to={item.url}
                        className="p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
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
                        className="p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                      >
                        {item.name}
                      </a>
                    )
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.id && scrollToSection(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="p-3 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                    >
                      {item.name}
                    </button>
                  )
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex justify-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 text-white/60 ${social.color} hover:bg-white/5 rounded-xl transition-all duration-300`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}