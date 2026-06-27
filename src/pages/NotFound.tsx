import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-[100svh] flex items-center justify-center px-6 py-24">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-petal p-8 sm:p-12 text-center">
        <p className="font-mono text-sm text-accent tabular-nums">404</p>
        <h1 className="mt-3 font-heading text-ink text-4xl sm:text-5xl font-semibold text-balance">
          Page not found
        </h1>
        <p className="mt-4 text-ink-secondary text-lg leading-relaxed text-pretty">
          Route you requested does not exist or moved. Use button below to return home.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-accent text-white px-6 py-3 font-medium transition-[background-color,transform] duration-300 hover:bg-accent-hover active:scale-[0.96]"
          >
            Go back home
          </Link>
        </div>
      </section>
    </main>
  );
}
