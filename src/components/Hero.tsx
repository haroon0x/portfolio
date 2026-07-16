import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="safe-x relative mx-auto flex min-h-[100svh] max-w-[96rem] items-center pt-28 sm:px-8 sm:pt-32 lg:px-12">
      <div className="w-full border-b border-border pb-14 pt-12 sm:pb-20 lg:pb-24 lg:pt-16">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.75fr)_minmax(18rem,0.8fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="mb-8 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-text-muted sm:mb-10">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Independent engineer & builder
            </p>
            <h1 className="max-w-5xl text-[clamp(3.1rem,7vw,7.5rem)] font-medium uppercase leading-[0.93] tracking-[-0.055em] text-text-primary text-balance">
              Building ambitious systems, end to end.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
            className="flex h-full flex-col justify-end lg:pb-1 lg:pt-24"
          >
            <p className="max-w-md text-lg leading-8 text-text-secondary sm:text-xl sm:leading-9">
              I&apos;m Muhammed Haroon, an independent engineer focused on turning difficult ideas into reliable products.
            </p>

            <div className="mt-9 border-t border-border pt-6">
              <div className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Available for select projects
              </div>
              <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-text-muted">
                India · Working globally
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                onClick={scrollToWork}
                className="group inline-flex min-h-11 items-center gap-3 border-b border-accent pb-2 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-text-primary"
              >
                Explore selected work
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
              <a
                href="https://github.com/haroon0x"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:text-text-primary"
              >
                GitHub
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
