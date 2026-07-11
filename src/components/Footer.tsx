import React from 'react';
import { ArrowUp, Mail, Github, Linkedin } from 'lucide-react';
import { XIcon } from './icons/XIcon';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'Twitter', icon: XIcon, url: 'https://x.com/skywalkerr0x', color: 'hover:text-accent hover:border-accent/40' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x', color: 'hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8', color: 'hover:text-accent hover:border-accent/40' }
  ];

  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-12 sm:py-16">
      <div className="safe-x mx-auto max-w-5xl sm:px-8">
        <div className="text-center space-y-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
              Let's build something amazing
            </h3>
            <a 
              href="mailto:haroonbmc0@gmail.com"
              className="group inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg px-3 py-2 text-text-secondary transition-[color,transform] duration-fast hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.96]"
              aria-label="Send email to haroonbmc0@gmail.com"
            >
              <Mail size={18} />
              <span className="min-w-0 break-all font-medium">haroonbmc0@gmail.com</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex items-center justify-center gap-3 sm:gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 p-3 transition-[border-color,color,transform,box-shadow] duration-fast hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.96] ${social.color}`}
                aria-label={`Visit ${social.name} profile`}
                tabIndex={0}
              >
                <social.icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="text-xl font-light mb-2">
                <span className="text-gradient">
                  haroon0x
                </span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 p-3 transition-[border-color,color,transform,box-shadow] duration-fast hover-lift hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.96]"
              aria-label="Back to top"
            >
              <ArrowUp size={16} className="text-text-muted group-hover:text-accent group-hover:-translate-y-1 transition-[color,transform] duration-fast" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
