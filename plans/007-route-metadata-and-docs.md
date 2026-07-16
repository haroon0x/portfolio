# Plan 007: Centralize route metadata and make documentation truthful

> **Executor instructions**: Follow the plan in order. Stop on any STOP
> condition. Do not add code comments. Do not modify or create test files.
> Preserve unrelated user changes. Update this plan's status in
> `plans/README.md` when complete unless a reviewer owns the index.
>
> **Drift check (run first)**:
> `git diff --stat 3decab9..HEAD -- index.html src/App.tsx README.md .github/copilot-instructions.md public/_redirects`
> This plan assumes Plans 004 and 005 are complete. Compare the Current state
> with the live files before editing.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/004-global-navigation-scroll.md`, `plans/005-editorial-pull-requests.md`
- **Category**: docs
- **Planned at**: commit `3decab9` plus working-tree redesign, 2026-07-16

## Why this matters

Every SPA route currently inherits the homepage title, description, Open Graph
URL, and Twitter copy from `index.html`. Pull Requests therefore shares as the
homepage, while unknown routes can present the homepage metadata despite being
visually a 404. Contributor documentation also describes components, hooks,
and a webhook backend that no longer exist.

This plan makes route metadata a single global mapping and updates the docs to
describe the repository that executors will actually encounter. It does not
pretend the static host can return a true 404 status for an arbitrary SPA
route; that hosting limitation remains explicit.

## Current state

- `index.html:8-25` defines one homepage title/description and fixed
  `og:url=https://haroon0x.onrender.com/` for every route.
- There is no canonical link and no route-aware metadata code in `src`.
- `public/_redirects:1` rewrites every route to `/index.html` with status 200.
- `README.md` describes four older projects while `Work.tsx` contains seven
  current projects and a different positioning statement.
- `.github/copilot-instructions.md:23-36` references a deleted `useTheme`
  location, deleted `PageTransition`, and deleted `backend-webhoook` service.
- The same file claims real-time PR updates although the repository uses a
  scheduled static JSON workflow.

## Target metadata model

Keep one route metadata map near the router, with entries for:

- `/`: current homepage title and description.
- `/pull-requests`: a title and description specifically about Muhammed
  Haroon's open-source contributions.
- fallback: Page not found title and a noindex directive.

Each known-route entry contains only title and description. A single site URL
constant derives canonical and Open Graph URLs. Twitter title/description
mirror the route entry. The existing OG image remains global.

Do not add React Helmet or another dependency.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Stale docs | `rg -n 'PageTransition|backend-webhoook|real-time|hooks/useTheme|isDark' README.md .github/copilot-instructions.md` | no matches |
| Metadata wiring | `rg -n 'canonical|og:url|twitter:title|document.title|robots' index.html src/App.tsx` | global base tags plus route updater are present |
| Lint | `npm run lint` | exit 0, no errors |
| Typecheck | `npm run type-check` | exit 0 |
| Build | `npm run build` | exit 0 |

Do not modify or run tests as part of this plan.

## Scope

**In scope**:

- `index.html`
- `src/App.tsx`
- `README.md`
- `.github/copilot-instructions.md`
- `plans/README.md` status row only

**Out of scope**:

- `tests/`
- `public/_redirects`
- Deployment-provider migration or server-side rendering
- OG image redesign
- Analytics, fonts, route copy outside metadata
- New dependencies
- Source architecture changes beyond the small route metadata updater

## Git workflow

- Branch: `advisor/007-route-metadata-and-docs`
- Commit message: `docs: align metadata and contributor guidance`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Establish correct base metadata in `index.html`

Keep the current homepage title, description, favicon, OG image, dimensions,
Twitter card type, author, analytics, font loading, and theme bootstrap.

Add a canonical link for the homepage and a robots meta element defaulting to
`index, follow`. Ensure the base Open Graph/Twitter title and description match
the visible homepage positioning after the working redesign. Do not add
duplicate title or description tags.

The canonical production origin is assumed to be
`https://haroon0x.onrender.com`. If repository/deployment evidence contradicts
that, stop instead of choosing a domain.

**Verify**: `rg -n '<title|name="description"|rel="canonical"|name="robots"' index.html`
shows one of each.

### Step 2: Add one route-aware metadata updater

In `src/App.tsx`, add a small internal component using `useLocation` and an
effect. Keep the metadata map and production origin constant at module scope.
For every route change it must update:

- `document.title`
- meta description
- canonical href
- `og:title`
- `og:description`
- `og:url`
- `twitter:title`
- `twitter:description`
- robots content

Known routes use `index, follow`; unknown paths use `noindex, nofollow` and the
fallback title/description. Canonical/OG URLs are derived from the single site
origin and current known path. Do not modify `og:image` or Twitter image.

Render the updater inside Router beside the route scroll manager from Plan
004. It returns `null` and does not alter page layout.

Use a tiny helper that selects an existing meta/link element and updates it.
Do not create duplicate elements on every route change.

**Verify**: `rg -n 'querySelector|createElement' src/App.tsx` shows selectors
for existing elements and no repeated element creation path.

### Step 3: Rewrite README around the live portfolio

Update `README.md` so it accurately states:

- The current independent-engineer/systems positioning.
- React, TypeScript, Vite, Tailwind, Framer Motion, and static PR data.
- Dark/light semantic token theming.
- The seven projects currently present in `Work.tsx`, without inventing new
  project claims.
- Exact install, dev, lint, typecheck, build, PR-fetch, and existing e2e
  commands.
- The scheduled GitHub workflow updates `public/pr-data.json`.

Keep it concise. Do not add badges, roadmap sections, deployment claims, or
configuration fields that do not exist.

**Verify**: every named project in README exists in `Work.tsx`.

### Step 4: Replace stale agent guidance with current conventions

Rewrite `.github/copilot-instructions.md` to describe:

- Current folders and route composition.
- Plan 003's semantic token rule: no raw palette utilities in TSX.
- Theme access through the live ThemeContext location.
- Global Header/Footer and route scroll/metadata behavior in App.
- Static PR data generation and presentation.
- Exact verification commands.
- Repository rules: mobile-first, preserve user changes, no source comments,
  and no tests unless explicitly requested.

Remove every reference to deleted components, hooks, and backend services.
Do not duplicate long implementation details already obvious from the code.

**Verify**: the Stale docs command returns no matches.

### Step 5: Validate metadata and documentation

Run lint, typecheck, and build. If a browser is available, navigate among `/`,
`/pull-requests`, and an unknown route and inspect title, description,
canonical, Open Graph URL, and robots content after each navigation.

Document in the handoff that unknown SPA routes still return HTTP 200 because
of `public/_redirects`; route-level noindex mitigates indexing but does not
turn the response into a true server 404.

**Verify**: `npm run lint && npm run type-check && npm run build` exits 0.

## Test plan

Do not create or modify tests. Verify with static tag searches, strict
TypeScript, production build, and manual route metadata inspection if a
browser is available.

## Done criteria

- [ ] One global route metadata map covers Home, Pull Requests, and fallback
- [ ] Known routes update title, description, canonical, OG, and Twitter copy
- [ ] Unknown routes set `noindex, nofollow`
- [ ] No duplicate metadata elements are created during navigation
- [ ] README matches current projects, stack, and commands
- [ ] Contributor guidance contains no deleted architecture
- [ ] Static-host soft-404 limitation is reported, not hidden
- [ ] Lint, typecheck, and build exit 0
- [ ] No test file was modified
- [ ] `plans/README.md` status row is updated

## STOP conditions

Stop and report if:

- Plans 004 or 005 are incomplete.
- The production origin is not clearly `https://haroon0x.onrender.com`.
- Route metadata appears to require SSR, React Helmet, or another dependency.
- The project list in Work has changed from the Current state.
- Correct 404 status handling would require deployment-provider changes.
- A test-file change appears necessary.
- Lint, typecheck, or build fails twice after a reasonable correction.

## Maintenance notes

- Add future top-level routes to the single metadata map when the route is
  introduced.
- A true 404 response requires host/server routing support and is deliberately
  outside this frontend-only plan.
- Keep contributor docs factual. Remove obsolete guidance in the same change
  that removes the underlying feature.
