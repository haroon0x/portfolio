import React from 'react';
import { ArrowUp, Mail, Github, Linkedin } from 'lucide-react';
import { XIcon } from './icons/XIcon';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'Twitter', icon: XIcon, url: 'https://x.com/skywalkerr0x' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8' }
  ];

  return (
    <footer className="border-t border-border bg-transparent py-12 sm:py-16">
      <div className="safe-x mx-auto max-w-5xl sm:px-8">
        <div className="text-center space-y-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading text-ink text-2xl tracking-tight sm:text-3xl">
              Let's build something amazing
            </h3>
            <a 
              href="mailto:haroonbmc0@gmail.com"
              className="group inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg px-3 py-2 text-ink-secondary transition-[color,transform] duration-300 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
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
                className="group flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-surface p-3 shadow-petal transition-[border-color,color,transform,box-shadow] duration-200 hover-lift hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
                aria-label={`Visit ${social.name} profile`}
                tabIndex={0}
              >
                <social.icon size={18} className="text-ink-muted transition-transform duration-200 group-hover:scale-110" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="text-xl font-heading text-ink mb-2">
                haroon0x
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-surface p-3 shadow-petal transition-[border-color,color,transform,box-shadow] duration-200 hover-lift hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
              aria-label="Back to top"
            >
              <ArrowUp size={16} className="text-ink-muted group-hover:text-accent group-hover:-translate-y-1 transition-[color,transform] duration-200" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
