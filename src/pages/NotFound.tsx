import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="main-content" className="safe-x mx-auto flex min-h-[100svh] max-w-[96rem] items-center pt-28 sm:px-8 sm:pt-32 lg:px-12">
      <div className="w-full border-y border-border py-14 sm:py-20">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-muted">Error 404</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,6vw,6rem)] font-medium leading-none tracking-[-0.05em] text-text-primary">
          This page does not exist.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-text-secondary">
          The address you followed is wrong, or the page it pointed to has moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <Link
            to="/"
            className="group inline-flex min-h-11 items-center gap-2 border-b border-accent pb-2 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-text-primary"
          >
            Back to the homepage
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/pull-requests"
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:text-text-primary"
          >
            Open-source contributions
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
