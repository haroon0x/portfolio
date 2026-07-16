import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-[100svh] flex items-center justify-center px-6 py-24">
      <section className="w-full max-w-2xl rounded-panel border border-border bg-surface p-8 text-center shadow-panel backdrop-blur-xl sm:p-12">
        <p className="font-mono text-sm text-accent tabular-nums">404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-heading font-semibold text-text-primary text-balance">
          Page not found
        </h1>
        <p className="mt-4 text-text-secondary text-lg leading-relaxed text-pretty">
          The route you requested does not exist or has moved. Return home to continue exploring.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-control bg-accent px-6 py-3 font-medium text-accent-foreground transition-[background-color,transform] duration-300 hover:bg-accent-hover active:scale-[0.96]"
          >
            Go back home
          </Link>
        </div>
      </section>
    </main>
  );
}
