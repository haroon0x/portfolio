import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-white/10 py-16">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center space-y-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-3xl font-light text-white tracking-tight">
              Let's work together
            </h3>
            <a 
              href="mailto:hello@portfolio.com"
              className="group inline-flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg px-3 py-2"
              aria-label="Send email to hello@portfolio.com"
            >
              <Mail size={18} />
              <span className="font-medium">hello@portfolio.com</span>
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="text-xl font-light mb-2">
                <span className="gradient-text">
                  Portfolio
                </span>
              </div>
              <p className="text-white/50 text-sm font-light">
                © 2024 All rights reserved
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="group p-3 bg-zinc-900 border border-white/10 hover:border-blue-400/30 rounded-xl transition-all duration-300 hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              aria-label="Back to top"
            >
              <ArrowUp size={16} className="text-white/70 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}