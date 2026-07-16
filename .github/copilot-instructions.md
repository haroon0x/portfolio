# AI Agent Instructions for haroon0x Portfolio

This is a React, TypeScript, Vite, Tailwind CSS, and Framer Motion portfolio. It is a frontend-only application with static project and pull-request content.

## Current structure

- `src/App.tsx` owns the router, global `Header` and `Footer`, route scrolling, lazy route loading, and route metadata.
- `src/pages/Home.tsx` composes the homepage sections from `src/components/`.
- `src/pages/PullRequests.tsx` fetches and presents `public/pr-data.json`.
- `src/pages/NotFound.tsx` renders the fallback route.
- `src/contexts/ThemeContext.tsx` owns the live dark/light theme, persistence, system preference handling, and browser theme color.
- `src/index.css` is the only source of palette, radius, and shadow values. Components use semantic Tailwind classes mapped in `tailwind.config.js`.
- `scripts/fetch-prs.cjs` generates the static pull-request data used by the frontend.

## Frontend conventions

- Build mobile-first layouts and preserve accessible landmarks, focus states, touch targets, and reduced-motion behavior.
- Use semantic classes such as `bg-background`, `bg-surface`, `text-text-primary`, `text-text-muted`, `border-border`, and `text-accent`.
- Do not add raw color values or palette utilities to components, HTML, or Tailwind configuration. Change shared visual values in `src/index.css`.
- Use `useTheme` from `src/contexts/ThemeContext.tsx` for the current theme and toggle action.
- Keep the global header and footer in `App.tsx`; route pages should provide their own main content.
- Add route title, description, canonical, social, and robots values to the metadata map in `App.tsx` when adding a route.
- Preserve existing user changes and keep edits scoped to the requested task.
- Do not add code comments.
- Do not add or modify tests unless explicitly requested.

## Pull-request data

`npm run fetch-prs` runs `scripts/fetch-prs.cjs` and updates `public/pr-data.json`. The scheduled `.github/workflows/fetch-prs.yml` workflow refreshes that file from public GitHub data. The site does not run a webhook or backend service.

## Development gates

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
npm run fetch-prs
npm run test:e2e
```

Run lint, type checking, and the production build for frontend changes. Run end-to-end tests only when the user explicitly requests them.
