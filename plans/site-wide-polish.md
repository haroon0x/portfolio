# Site-Wide Polish: PR Page, Blog, Global Design

## The one problem

The homepage gets all the craft; the rest of the site runs on good bones without the final layer. The PR page presents numbers without scale or time, the blog is a dead nav item, and the global shell (header, theme, route changes) is functional but inert.

This plan is a bundle of small, independent upgrades across three areas. None depend on each other — ship in any order. All use existing tokens, existing motion language, no new dependencies.

## Part 1 — Pull requests page

### 1a. Diff-stat bars (primary)

PR rows show `+1,204 −87` as bare text. Add a proportional hairline bar beneath the numbers: green segment (`--color-status-open`) for additions, red (`--color-status-closed`) for deletions, widths from existing `pr.additions / pr.deletions`.

- Bar height 2px, fixed track width (~4rem) in the same cell as the numbers
- Scale per row: `additions / (additions + deletions)` — no global normalization needed, matches GitHub's own convention
- Pure CSS widths computed inline; zero JS cost
- Renders instantly, no animation — this is chrome, not a moment

### 1b. Activity timeline

The stats strip has totals but no time dimension. Insert a slim monthly bar chart between the stats grid and the organization network:

- 12 hairline bars (last 12 months), height = PR count that month, computed from `data.prs` dates in a `useMemo`
- Bars `bg-border-strong`, current month in `bg-accent`; month labels only on Jan + current
- Height ~3rem, full width of the content column — a sparkline, not a chart with axes
- Bars grow from 0 on first paint (300ms stagger, existing `EASE`); after that, static

### 1c. Merge-rate stat + small fixes

- Fifth cell in the stats `dl`: `merged / total` as a percentage, `text-accent`
- Rename "Depth" sort to "Volume" (it means PR count per repo) or add a `title` attribute explaining it
- Press `/` anywhere on the page to focus the search input (ignore when already typing in an input); `Escape` blurs and clears

## Part 2 — Blog: in-progress ledger

The empty state is honest but the page is still a dead nav item. Replace the "No published notes yet" block with a ledger of notes actually being written:

- 3–4 rows, each: index numeral · working title · status · one-line description
- Status vocabulary from the same grammar as the PR page: `drafting` (text-status-open), `researching` (text-text-secondary), `editing` (text-status-merged)
- Rows use the archive-row visual pattern from `Work.tsx` (hairline dividers, hover surface sweep) — consistent list language across the site
- Header count `Writing / 00` becomes `Writing / 04 · in progress` so the nav promise matches reality
- Keep the "not backfilling for appearances" line — it is the brand — but move it below the ledger as a footnote, not the headline

Alternative if no notes are genuinely in progress: remove Blog from `navItems`/header links until the first post ships. Do not leave the current state — a nav item leading to "nothing" erodes the trust the PR page builds.

## Part 3 — Global shell

### 3a. Live IST clock in header (primary)

A ticking mono clock next to the name in the header: `14:32:07 IST`.

- `setInterval` at 1s, `Intl.DateTimeFormat` with `timeZone: 'Asia/Kolkata'` — no date library
- `tabular-nums` so digits don't jitter; `text-text-muted`, same `0.66rem` uppercase tracking as nav items
- Echoes the hero's "India · Global" line and quietly answers "what timezone is this person in" for collaborators
- Pause the interval when `document.hidden`; render once server-side-safe (no hydration concern in this SPA, but avoid layout shift by reserving width with `tabular-nums`)
- Skip the seconds if it reads nervous: `14:32 IST` at 30s interval is calmer

### 3b. Route transitions

Blog and PR pages currently hard-cut. Wrap the route outlet in `AnimatePresence` + a keyed `motion.main`:

- Exit: opacity → 0, 150ms. Enter: opacity 0→1, y 8→0, 250ms, existing `EASE`
- `mode="wait"` so pages don't overlap mid-transition
- Must coordinate with the existing per-page `motion.div` entrances — page-level transition handles the fade, inner entrances keep their stagger; ensure no double-y movement (drop y from inner entrances if stacked)
- `prefers-reduced-motion`: instant swap (flag already threaded through the app)

### 3c. Theme-toggle crossfade

Body background/color transitions 300ms but borders and surfaces snap, so a theme switch strobes. Fix globally:

- Add `transition-colors duration-300` to the shared border/surface utilities (the `border-border`, `bg-surface`, `bg-surface-strong` classes used on chrome elements — header, cards, index rows)
- Cheapest correct implementation: extend the base layer in `index.css` — `*, ::before, ::after { transition-property: border-color, background-color; transition-duration: 300ms }` scoped behind a `.theme-transition` class on `<html>`, toggled only during theme switches (add class, remove after 350ms) so scroll/hover transitions elsewhere are never affected
- Result: theme change reads as one object crossfading, not a cascade of snaps

### 3d. Grain overlay (optional)

A fixed, `pointer-events-none` layer over the app: SVG `feTurbulence` noise as a data-URI background, `opacity: 0.03`, `mix-blend-mode: overlay` (dark theme) / `multiply` (light theme).

- Adds print-paper tooth to the paper/ink palette; pushes the editorial direction further
- One CSS rule + one div in `App.tsx`; no perf cost (static layer, composited once)
- Ship only if it reads as texture, not trend — evaluate against the live site in both themes before keeping

## Token & motion spec

| Element | Value | Source |
|---|---|---|
| Diff bars | `--color-status-open` / `--color-status-closed`, 2px | existing tokens |
| Timeline bars | `--color-border-strong`, current month `--color-accent` | existing tokens |
| Clock | `text-text-muted`, `tabular-nums`, 0.66rem mono | existing header style |
| Route transition | 150ms out / 250ms in, `EASE` | existing constants |
| Theme crossfade | 300ms border-color/background-color | matches body transition |
| Grain | feTurbulence data-URI, 3% opacity | self-contained |

## Accessibility & fallbacks

- Diff bars and timeline are decorative: numbers remain as text; bars `aria-hidden`
- Timeline gets a visually-hidden summary ("12-month activity: peak N PRs in <month>")
- `/` shortcut documented via `aria-keyshortcuts` on the search input; never fires while focus is in a form field
- Clock has `aria-label="Current time in India"` and does not announce ticks (no live region)
- Route transitions respect `prefers-reduced-motion`; theme crossfade class is transient and never blocks interaction
- Blog ledger statuses are text, not color-only

## Implementation outline

1. `PullRequests.tsx` — diff bars in PR row cell; `monthlyActivity` memo + `ActivityTimeline` block; merge-rate cell; `/` keydown listener; sort rename
2. `Blog.tsx` — replace empty-state block with `inProgressNotes` data array + ledger rows; adjust header count; keep footnote line
3. `Header.tsx` — `IstClock` component (colocate), interval + visibility pause
4. `App.tsx` — `AnimatePresence` around routed outlet; optional grain div
5. `index.css` — transient `.theme-transition` rule; grain background utility (if 3d ships)
6. `ThemeToggle.tsx` — add/remove `.theme-transition` around the theme class swap
7. No new dependencies

## Files touched

- `src/pages/PullRequests.tsx`
- `src/pages/Blog.tsx`
- `src/components/Header.tsx`
- `src/App.tsx`
- `src/components/ThemeToggle.tsx`
- `src/index.css`

## Validation

- Existing test suite passes
- Manual: bars proportional on extreme diffs (0 additions, 0 deletions), timeline correct against raw PR dates, `/` focuses search and ignores typing contexts, clock correct in IST across DST-free year, route fade smooth both directions, theme switch crossfades chrome
- `prefers-reduced-motion`: route swap instant, timeline bars render at full height, clock still ticks (information, not decoration)
- Both themes: grain subtle, timeline/bar colors legible
- Performance: no intervals left running with hidden document; grain layer composites once
