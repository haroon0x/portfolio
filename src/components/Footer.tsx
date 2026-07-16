import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { XIcon } from './icons/XIcon';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8' },
  { name: 'X', icon: XIcon, url: 'https://x.com/skywalkerr0x' },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="safe-x mx-auto max-w-[96rem] py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.55fr] lg:gap-20">
          <div>
            <p className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">Start a conversation</p>
            <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,7rem)] font-medium leading-[0.96] tracking-[-0.055em] text-text-primary">
              Have something ambitious in mind?
            </h2>
            <a
              href="mailto:haroonbmc0@gmail.com"
              className="group mt-10 inline-flex min-h-14 items-center gap-4 border-b border-accent pb-2 text-lg text-accent transition-colors hover:text-text-primary sm:text-xl"
            >
              haroonbmc0@gmail.com
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>

          <div className="flex flex-col justify-end lg:items-end">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-secondary transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-border pt-6 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Muhammed Haroon</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="self-start transition-colors hover:text-text-primary sm:self-auto"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
