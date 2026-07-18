# haroon0x Portfolio

Muhammed Haroon's portfolio as an independent engineer building reliable systems and ambitious products.

## What is included

- A responsive React, TypeScript, Vite, and Tailwind CSS frontend
- Framer Motion transitions with reduced-motion support
- A dark and light theme controlled by global semantic design tokens
- Static pull-request data discovered by GitHub author search and presented on a dedicated route

## Selected work

- **Wake AI** — Private, searchable on-device AI memory for Android
- **DeadDrop** — A sovereign asynchronous task inbox and local agent runner
- **OutSync** — Reliable PostgreSQL event delivery through the transactional outbox pattern
- **Containerized Agent** — Natural-language task execution in isolated Docker environments
- **CrawlWise** — High-performance crawling and structured extraction across thousands of domains
- **PromoAgent** — Autonomous community outreach with tailored content
- **Percolation Hypotheses** — A hypothesis generation engine for computational research
- **Neural Network From Scratch** — Deep learning fundamentals implemented from first principles

## Development

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
npm run fetch-prs
npm run test:e2e
```

The scheduled `fetch-prs` workflow discovers public pull requests authored by `haroon0x`, refreshes `public/pr-data.json`, and retains the last valid dataset if GitHub is unavailable. The frontend reads that static file at runtime.

## Deployment routing

The production origin is hosted as a free Render static site. The production build emits `dist/pull-requests/index.html` with route-specific metadata, so direct navigation and refresh work without a catch-all rewrite. `render.yaml` also defines exact Rewrite rules for compatibility and gives hashed assets a one-year immutable browser cache.

If the existing Render service is not managed as a Blueprint, add the same two rules under Redirects/Rewrites in its dashboard; Render does not automatically apply a new Blueprint file to an independently created service. The client also renders its own not-found page for unknown routes reached through in-app navigation and applies `noindex, nofollow` metadata there. `public/_redirects` mirrors the primary exact-route behavior for hosts that support that file.

## Visitor counter

The footer counter records approximate unique browsers rather than page views. A random identifier stays in first-party local storage; the counter stores that identifier and its first-seen timestamp in a Cloudflare SQLite-backed Durable Object. It does not store IP addresses, routes, or referrers.

The portfolio remains on Render with DNS managed at Name.com. The counter uses a separate `workers.dev` address, so no domain or nameserver changes are required.

```bash
npx wrangler@4.112.0 login
npx wrangler@4.112.0 deploy --config visitor-counter/wrangler.jsonc
```

Wrangler prints the deployed `workers.dev` URL. Append `/visit`, save the complete URL as `VITE_VISITOR_COUNTER_URL` in the Render static site's environment variables, and trigger a new Render deployment. The footer counter remains hidden until that environment variable points to a working endpoint.

The Worker URL, name, and allowed site origin are public configuration. Keep Cloudflare API tokens and Wrangler development secrets out of the repository; `.dev.vars` and `.wrangler` are ignored.

## Contact

- GitHub: [haroon0x](https://github.com/haroon0x)
- LinkedIn: [Muhammed Haroon](https://linkedin.com/in/muhammed-haroon-0399962b8)
