import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Blog() {
  return (
    <main id="main-content" className="safe-x mx-auto min-h-[100svh] max-w-[96rem] px-4 pb-24 pt-36 sm:px-8 sm:pb-32 sm:pt-44 lg:px-12 lg:pb-40">
      <section aria-labelledby="blog-title">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid gap-10 border-b border-border pb-14 sm:pb-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)] lg:items-end lg:gap-20"
        >
          <div>
            <p className="mb-7 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent">Writing / 00</p>
            <h1 id="blog-title" className="text-[clamp(4rem,10vw,10rem)] font-medium uppercase leading-[0.82] tracking-[-0.07em] [word-spacing:0.12em] text-text-primary">
              Notes from the work.
            </h1>
          </div>
          <p className="max-w-lg text-lg leading-8 text-text-secondary sm:text-xl sm:leading-9">
            Technical essays, build notes, and the decisions behind systems that have to survive contact with the real world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="grid gap-10 border-b border-border py-14 sm:py-20 lg:grid-cols-[5rem_minmax(0,0.8fr)_minmax(20rem,1.2fr)] lg:gap-12"
        >
          <span className="font-mono text-xs tabular-nums tracking-[0.14em] text-text-muted">00</span>
          <div>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.17em] text-text-muted">Publication status</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.05em] [word-spacing:0.1em] text-text-primary">
              No published notes yet.
            </h2>
          </div>
          <div className="lg:border-l lg:border-border lg:pl-10">
            <p className="max-w-2xl text-lg leading-8 text-text-secondary">
              This space is ready, but the writing is not being backfilled for appearances. Entries will arrive when there is something useful and complete to say.
            </p>
            <p className="mt-5 max-w-2xl leading-7 text-text-muted">
              Until then, the open-source archive is the working record: shipped code, review history, and engineering decisions in public.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <Link to="/pull-requests" className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-text-primary">
                Browse open-source work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link to="/#work" className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:text-text-primary">
                Selected projects
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
