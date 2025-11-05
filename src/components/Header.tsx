import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Sun, Moon } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-white/10'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-lg sm:text-xl font-bold group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-2 py-1"
            aria-label="Go to top"
          >
            <span className="gradient-text group-hover:scale-105 transition-transform duration-300">
              haroon0x
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              'url' in item && item.url ? (
                item.url.startsWith('/') ? (
                  <Link
                    key={item.name}
                    to={item.url}
                    className="text-white/70 hover:text-white transition-all duration-200 font-medium tracking-wide relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-3 py-2"
                    aria-label={`Go to ${item.name}`}
                    tabIndex={0}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-all duration-200 font-medium tracking-wide relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-3 py-2"
                    aria-label={`Open ${item.name}`}
                    tabIndex={0}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
                  </a>
                )
              ) : (
                <button
                  key={item.id}
                  onClick={() => item.id && scrollToSection(item.id)}
                  className="text-white/70 hover:text-white transition-all duration-200 font-medium tracking-wide relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-3 py-2"
                  aria-label={`Go to ${item.name} section`}
                  tabIndex={0}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
                </button>
              )
            ))}
          </div>

          {/* Right Side - Theme Toggle, Social Links & Mobile Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 text-white/60 hover:text-white transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>

            {/* Social Links - Desktop & Tablet */}
            <div className="hidden sm:flex items-center space-x-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 sm:p-2.5 text-white/60 ${social.color} transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg`}
                  aria-label={`Visit ${social.name} profile`}
                >
                  <social.icon size={14} className="sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 text-white/70 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg ml-1"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-4 sm:mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-zinc-950/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2 sm:space-y-3">
              {navItems.map((item) => (
                'url' in item && item.url ? (
                  item.url.startsWith('/') ? (
                    <Link
                      key={item.name}
                      to={item.url}
                      className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 text-base sm:text-lg"
                      aria-label={`Go to ${item.name}`}
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
                      className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 text-base sm:text-lg"
                      aria-label={`Open ${item.name}`}
                    >
                      {item.name}
                    </a>
                  )
                ) : (
                  <button
                    key={item.id}
                    onClick={() => item.id && scrollToSection(item.id)}
                    className="block w-full text-left text-white/70 hover:text-white transition-colors duration-300 font-medium py-3 px-4 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 text-base sm:text-lg"
                    aria-label={`Go to ${item.name} section`}
                  >
                    {item.name}
                  </button>
                )
              ))}
            </div>
            
            {/* Mobile Social Links */}
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 sm:p-3.5 bg-zinc-900/50 border border-white/10 rounded-xl text-white/60 ${social.color} transition-all duration-300 hover:scale-110 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <social.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}