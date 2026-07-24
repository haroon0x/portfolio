import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { XIcon } from './icons/XIcon';
import VisitorCounter from './VisitorCounter';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8' },
  { name: 'X', icon: XIcon, url: 'https://x.com/skywalkerr0x' },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="safe-x mx-auto max-w-[96rem] py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div>
          <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,7rem)] font-medium leading-[0.96] tracking-[-0.055em] text-text-primary">
            Have something ambitious in mind?
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-x-12 gap-y-8">
            <a
              href="mailto:haroonbmc0@gmail.com"
              className="group inline-flex min-h-14 items-center gap-4 border-b border-accent pb-2 text-lg text-accent transition-colors hover:text-text-primary sm:text-xl"
            >
              haroonbmc0@gmail.com
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-secondary transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted sm:mt-20 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <span>© {new Date().getFullYear()} Muhammed Haroon</span>
          <VisitorCounter />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="self-start transition-colors hover:text-text-primary sm:justify-self-end"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
