# Plan 001: Elevate the portfolio to a coherent, top-tier visual & UX standard

> **Executor instructions**: Follow this plan phase by phase, in order. Run every
> verification command and confirm the expected result before moving to the
> next phase. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat dbcfd78..HEAD -- src/ index.html tailwind.config.js tests/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.
>
> **Note on line endings**: at planning time the working tree showed every file
> modified due to CRLF churn (no `.gitattributes`). If that has not been fixed
> yet, run `git status` first; if all files show modified before you touch
> anything, report it — ideally the repo hygiene fix (see
> `plans/audit-findings.md`, DX-01) lands before this plan.

## Status

- **Priority**: P1
- **Effort**: L (multi-day; phases are independently landable)
- **Risk**: MED (broad visual surface; mitigated by per-phase verification and e2e/axe gates)
- **Depends on**: none (but see line-endings note above)
- **Category**: direction (visual/UX overhaul)
- **Planned at**: commit `dbcfd78`, 2026-06-11

## Why this matters

This is a personal portfolio whose entire job is to impress in the first ten
seconds. The bones are good — dark "Linear-like" aesthetic, glass cards,
smooth scroll, tasteful typography choices (Manrope + JetBrains Mono). But the
execution is incoherent: **three competing accent colors** (blurple `#5e6ad2`,
cyan `#00d9ff`, and `blue-400`/`cyan-400` gradients), **two competing
background blacks** (`#050505` vs `#0a0a0a`), ad-hoc spacing/radius/duration
values everywhere, a hero with five simultaneous animation systems fighting
for attention, a fake loading screen that delays content on a static site,
text that fails WCAG AA contrast, a theme toggle that visibly does nothing,
and a favicon + social card that 404. This plan makes the design system
*coherent* — one palette, one type scale, one motion language, restrained and
confident — which is what separates "nice template" from "crafted".

**Design north star**: Linear.app-style restraint. The accent `#5e6ad2` is
already Linear's blurple — lean into that lineage. Less motion, more
typography. Every animation must justify itself; everything else is calm.

## Current state

Stack: React 18 SPA, Vite 8, Tailwind 3.4 (config in `tailwind.config.js`),
Framer Motion 11, Lenis 1.3 smooth scroll, lucide-react icons. Routes:
`/` (Hero + Home→Work+Footer), `/pull-requests`, `*` (404). Deployed as a
static site (`public/_redirects` SPA fallback). **Mobile-friendliness is a
stated hard requirement** (`Agents.md:2`).

Key files and their roles:

- `tailwind.config.js` — design tokens. Currently:
  ```js
  colors: {
    background: '#050505',
    surface: '#0f0f0f',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: { DEFAULT: '#5e6ad2', glow: '#00d9ff' },
    text: { primary: '#ededed', secondary: '#a1a1a1' },
  }
  ```
  No `darkMode` key, no spacing/duration/radius extensions.
- `src/index.css` (241 lines) — base styles + utilities. Known debt:
  - `body` rule (`:11-13`) applies `bg-background` (#050505) **and**
    `background-color: #0a0a0a` — the hardcoded one wins.
  - `:root` vars `--background`/`--foreground` (`:6-9`) — used nowhere.
  - `.text-gradient` (`:53`) and `.gradient-text` (`:61`) — identical
    duplicates. `.glass-panel` (`:49`) and `.glass` (`:192`) — near-duplicates.
  - Hand-rolled `.line-clamp-2/3`, `.text-balance`, `.text-pretty`,
    `.tabular-nums` (`:73-97`) — Tailwind 3.4 ships all of these natively.
  - Global focus style (`:180-184`): `outline: 2px solid #00d9ff` (cyan).
  - Useful keepers: `.safe-x`, `.safe-top`, `.fluid-section`,
    `.card-container`/`.cq-card-*` (container queries), `.skip-link`,
    the `prefers-reduced-motion` global kill-switch (`:199-209`), scrollbar
    styling, noise overlay (`body::before`, `:19-31`).
- `index.html` — meta tags reference `/vite.svg` (lines 6, 19, 25) which does
  **not exist** in `public/`; Google Fonts Manrope + JetBrains Mono with
  preconnect; gtag analytics; a theme bootstrap script (lines 49–59) that
  toggles a `dark` class nothing consumes.
- `src/App.tsx` — composition root:
  `ThemeProvider > Router > SmoothScroll + HandsBackground > AppErrorBoundary > PageTransition > ScrollProgress + Routes`.
- `src/components/Hero.tsx` — full-viewport hero. Current animation systems
  running simultaneously: (1) three infinitely-spinning 3D border shapes,
  (2) mouse-parallax via `useState` re-rendering the whole component on every
  mousemove (`:23-33`), (3) rotating role text on a 3s interval with an `exit`
  prop that never runs (no `AnimatePresence`, `:161-171`), (4) pulsing
  "Available" badge, (5) bouncing scroll indicator, plus a CSS grid overlay
  (`:108-117`) duplicating the canvas grid in `HandsBackground`.
- `src/components/HandsBackground.tsx` — fixed background: inverted hands
  photo (`<picture>` webp 960/1600 + jpg fallback), gradient vignettes, and a
  canvas drawing a slowly-scrolling 40px grid every frame. Bug: under
  `prefers-reduced-motion`, resize clears the canvas and the grid never
  redraws (`:18-21,47-51`).
- `src/components/PageTransition.tsx` — fake loading screen: black overlay
  with pulsing logo for min 250 ms (600 ms on 2g, safety release at 1200 ms)
  on every page load, then a 1000 ms fade. Pure artificial delay on a static
  site. Has `data-testid="page-loader"` (not referenced by any test).
- `src/components/Header.tsx` — floating pill nav. Contains the dead theme
  toggle (Sun/Moon button calling `useTheme()`); nav items: Work (scroll),
  Pull Requests (route), Resume (Google Drive link); mobile menu overlay
  (good a11y: `role="dialog"`, `aria-modal`, Escape handling, body scroll
  lock).
- `src/components/Work.tsx` — 7 hardcoded projects rendered as
  `SpotlightCard`s (mouse-tracked radial highlight — keep, it's tasteful).
  Dead: `Project.size` field, `order='latest'` prop branch.
- `src/components/Footer.tsx` — contact email, socials, back-to-top. Uses
  off-palette `blue-400`/`blue-500` hovers and focus rings and `gradient-text`.
- `src/components/ScrollProgress.tsx` — top progress bar,
  `bg-gradient-to-r from-blue-400 to-cyan-400` (off-palette), animates `width`
  with a 300 ms transition (laggy feel).
- `src/components/SmoothScroll.tsx` — Lenis init passing **pre-1.0 option
  names** (`direction`, `gestureDirection`, `smooth`, `smoothTouch`,
  `mouseMultiplier`) that lenis 1.3 does not recognize.
- `src/components/Magnetic.tsx` — magnetic hover wrapper (spring-based; keep).
- `src/pages/PullRequests.tsx` (439 lines) — stats row, expandable org cards
  (default: **all expanded** via effect at `:61-63`), filter/sort button rows,
  PR card grid. PRs are listed twice (inside org cards and in the main grid).
- `src/pages/NotFound.tsx` — 404 card (good shape, minor token alignment).
- `src/contexts/ThemeContext.tsx`, `src/contexts/ThemeProvider.tsx`,
  `src/hooks/useTheme.tsx` — dead theme infrastructure (nothing styles off the
  `dark` class).
- `src/hooks/useScrollAnimation.tsx` — `useScrollAnimation` (used by
  PullRequests) + `useAdvancedScrollAnimation` (zero callers, dead).
- `tests/ui.spec.ts` — 3 Playwright tests (home + axe serious/critical, PR
  page heading, 404) on Desktop Chrome + Pixel 7 projects.

Repo conventions to match:

- Functional components, default exports, props interfaces above the
  component. Tailwind utility classes inline; the few custom utilities live in
  `src/index.css` `@layer utilities`. See `src/pages/NotFound.tsx` for the
  cleanest exemplar of current conventions.
- Commit style: conventional commits (`chore: update PR data`,
  `refactor: improve responsive design...` in `git log`).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run type-check` | exit 0, no errors |
| Build | `npm run build` | exit 0, `dist/` written |
| E2E + a11y | `npm run test:e2e` | all pass (starts its own preview server) |
| Dev server (manual checks) | `npm run dev` | serves on the printed port |
| Browsers (first run only) | `npx playwright install --with-deps chromium` | exit 0 |

Run the full gate (`lint`, `type-check`, `build`, `test:e2e`) at the end of
**every phase**. Phases are ordered so the app builds and runs after each one.

## Scope

**In scope** (the only files you should modify or create):

- `tailwind.config.js`, `src/index.css`, `index.html`
- Everything under `src/components/`, `src/pages/`, `src/contexts/`,
  `src/hooks/`, `src/App.tsx`
- `tests/ui.spec.ts`
- `public/favicon.svg`, `public/og-card.png` (create)
- `scripts/og-template.html` (create — used once to generate the OG card)
- `plans/README.md` (status row only)

**Out of scope** (do NOT touch, even though they look related):

- `haroon-resume.html` — repo rule (`Agents.md:1`): never commit/modify it.
- `scripts/fetch-prs.cjs`, `.github/workflows/*`, `backend-webhoook/` —
  separate findings, separate plans.
- `public/pr-data.json` — CI-generated data file.
- `package.json` / `package-lock.json` — **no new dependencies**; this plan is
  achievable with what's installed. (Exception: none. If you believe you need
  a dependency, that's a STOP condition.)
- `vite.config.ts`, `playwright.config.ts`, `eslint.config.js`, `tsconfig*`.
- Copy/content changes beyond those explicitly listed (project descriptions,
  PR data, links stay as they are).

## Git workflow

- Branch: `advisor/001-aesthetic-ux-redesign`
- One commit per phase, conventional style, e.g.
  `refactor: consolidate design tokens (phase A)`.
- Do NOT push or open a PR unless the operator instructed it.

---

## The design system (target)

This section is the specification the phases implement. Values are final —
do not re-derive them.

### Color

One background, one surface treatment, one accent. All in
`tailwind.config.js`:

```js
colors: {
  background: '#0a0a0a',            // single source of truth (was #050505 + #0a0a0a)
  surface: '#111113',               // raised panels (subtle blue-black, Linear-like)
  border: 'rgba(255, 255, 255, 0.08)',
  accent: {
    DEFAULT: '#5e6ad2',             // keep — Linear blurple
    hover: '#6e79e0',               // lighter for hover states
    muted: 'rgba(94, 106, 210, 0.15)', // tinted backgrounds (badges, icon chips)
  },
  text: {
    primary: '#ededed',             // headings, key copy
    secondary: 'rgba(255, 255, 255, 0.65)',  // body
    muted: 'rgba(255, 255, 255, 0.50)',      // metadata — the FLOOR for any text
  },
},
```

**Deleted**: `accent.glow` (`#00d9ff`) and every use of `blue-400`,
`blue-500`, `cyan-400` for chrome (focus rings, hovers, gradients, progress
bar). **Status colors survive only as PR-state semantics** on the
pull-requests page: purple = merged, green = open, red = closed — those are
GitHub's own conventions and stay.

**Contrast rule (WCAG AA on `#0a0a0a`)**: no text below 50% white opacity.
`text-white/40` (≈3.4:1) and `text-white/30` fail — replace with
`text-text-muted` (or `text-white/50`+) everywhere. Purely decorative,
`aria-hidden` glyphs may stay fainter.

### Typography

Manrope (headings/body) + JetBrains Mono (labels, metadata) stay. Fluid scale,
defined once in `tailwind.config.js` `fontSize` extension:

```js
fontSize: {
  'display': ['clamp(2.75rem, 8vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
  'title':   ['clamp(2rem, 5vw, 3rem)',      { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
  'heading': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.3' }],
  'body-lg': ['clamp(1.0625rem, 1.5vw, 1.1875rem)', { lineHeight: '1.7' }],
},
```

Usage: `text-display` = Hero h1 only. `text-title` = section h2s ("Selected
Works", "Open Source Contributions"). `text-heading` = card titles.
`text-body-lg` = section intro paragraphs. Everything else uses standard
Tailwind sizes. Mono (`font-mono`) is reserved for: the "Available" badge,
repo names, +/- line counts, dates, the 404 code — small uppercase-or-numeric
labels, never body copy.

### Radius

Two values: `rounded-full` for pills/circular icon buttons, `rounded-2xl`
(16px) for every card/panel/menu. Buttons that aren't pills: `rounded-xl`.
**Eliminate `rounded-3xl` and stray `rounded-lg` on interactive elements.**

### Motion

One easing, three durations, defined as Tailwind extensions:

```js
transitionDuration: { fast: '150ms', base: '250ms', slow: '500ms' },
transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
```

Rules:
- Hover/press feedback: `duration-fast`. State changes (menus, filters):
  `duration-base`. Entrances: `duration-slow`. **No more `duration-1000`.**
- Framer Motion entrances: one pattern — fade + 12px rise,
  `{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }`, stagger 0.06s between
  siblings. Viewport entrances use `whileInView` + `viewport={{ once: true }}`.
- Wrap the app in `<MotionConfig reducedMotion="user">` so every Framer
  animation respects `prefers-reduced-motion` (the CSS kill-switch in
  `index.css` doesn't reach JS-driven animations).
- Infinite animations allowed: the canvas grid drift, the badge pulse, the
  scroll-indicator drift. **Nothing else loops forever.**

---

## Steps

### Phase A — Token foundation (`tailwind.config.js`, `src/index.css`)

1. Replace the `colors` block in `tailwind.config.js` with the Color spec
   above; add the `fontSize`, `transitionDuration`, and
   `transitionTimingFunction` extensions from the spec. Keep `fontFamily` and
   `backgroundImage` as they are.
2. In `src/index.css`:
   - Remove the hardcoded `background-color: #0a0a0a` from `body` (the
     `bg-background` token now provides it) and the dead `:root`
     `--background`/`--foreground` variables and the stray
     "Hide default cursor" comment.
   - Delete `.gradient-text` and migrate its two usages
     (`src/components/Footer.tsx`, `src/components/PageTransition.tsx` — the
     latter is deleted in Phase C anyway) to `.text-gradient`.
   - Delete `.glass` (keep `.glass-panel`); grep confirms `.glass` has no
     `className="glass"` users — verify before deleting:
     `grep -rn '"glass[" ]' src/` should only show `glass-panel`.
   - Delete the hand-rolled `.line-clamp-2`, `.line-clamp-3`, `.text-balance`,
     `.text-pretty`, `.tabular-nums` utilities — Tailwind 3.4 provides all of
     them with identical class names, so **no component changes are needed**.
   - Change the global `:focus-visible` outline from `#00d9ff` to the accent:
     `outline: 2px solid #5e6ad2`.
   - Delete `.text-gradient-accent` if unused:
     `grep -rn "text-gradient-accent" src/` → if it returns nothing, delete.
3. Sweep components for the deleted `accent-glow` token:
   `grep -rn "accent-glow" src/` → update any hit to plain `accent`.

**Verify**: `npm run lint && npm run type-check && npm run build` → all exit 0.
`grep -rn "00d9ff\|accent-glow" src/ tailwind.config.js` → no matches.

### Phase B — Remove the dead theme system

1. Delete `src/contexts/ThemeContext.tsx`, `src/contexts/ThemeProvider.tsx`,
   `src/hooks/useTheme.tsx`.
2. In `src/App.tsx`: remove the `ThemeProvider` import and wrapper.
3. In `src/components/Header.tsx`: remove the `useTheme` import, the
   `const { isDark, toggleTheme } = useTheme();` line, and the entire
   Sun/Moon toggle `<Magnetic>` block (the button with
   `aria-label={isDark ? 'Switch to light theme' : ...}`). Remove the now-unused
   `Sun, Moon` imports from lucide-react.
4. In `index.html`: remove the theme bootstrap `<script>` (the IIFE reading
   `localStorage.getItem('theme')`, lines 49–59 at planning time).

**Verify**: `grep -rn "useTheme\|ThemeProvider\|ThemeContext\|isDark" src/ index.html`
→ no matches. `npm run lint && npm run type-check && npm run build` → exit 0.

### Phase C — Motion system & dead-weight removal

1. **Kill the fake loader.** Delete `src/components/PageTransition.tsx`. In
   `src/App.tsx`, remove its import and wrapper (children render directly).
   Content now paints immediately; the Framer entrance animations provide all
   the choreography a static site needs.
2. **MotionConfig.** In `src/App.tsx`, import `MotionConfig` from
   `framer-motion` and wrap the app's contents:
   `<MotionConfig reducedMotion="user"> … </MotionConfig>` (inside Router,
   outside everything else).
3. **Lenis options** (`src/components/SmoothScroll.tsx`): replace the options
   object with the lenis 1.x API:
   ```ts
   const lenis = new Lenis({
     duration: 1.2,
     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
     smoothWheel: true,
     syncTouch: false,
   });
   ```
4. **ScrollProgress** (`src/components/ScrollProgress.tsx`): replace the
   gradient with `bg-accent`; replace width-animation with transform —
   `style={{ transform: `scaleX(${scrollProgress})` }}` on a full-width bar
   with `origin-left`, and remove the `transition-[width] duration-300`
   classes (no transition; it should track scroll 1:1).
5. **HandsBackground** (`src/components/HandsBackground.tsx`): fix the
   reduced-motion resize bug — in the `resize` handler, after setting canvas
   dimensions, draw one static frame when `prefersReducedMotion` is true
   (extract the grid-drawing body so it can be called once without scheduling
   `requestAnimationFrame`).
6. **Dead code** (`src/hooks/useScrollAnimation.tsx`): delete the entire
   unused `useAdvancedScrollAnimation` export. In `src/components/Work.tsx`:
   delete the `size` field from the `Project` interface and all 7 project
   objects, and delete the `order` prop / `WorkProps` / `displayProjects`
   slicing (render `projects` directly); update `src/pages/Home.tsx` to
   `<Work />`.
7. **Duration sweep**: `grep -rn "duration-1000" src/` — replace every hit
   with `duration-slow` (these are the `transition-[opacity,transform]
   duration-1000` reveals in `PullRequests.tsx` and any others). Then
   `grep -rn "duration-500" src/` — for *hover* transitions replace with
   `duration-base`; leave Framer `transition={{ duration: 0.5 }}` entrance
   props alone.

**Verify**: `grep -rn "PageTransition\|useAdvancedScrollAnimation\|duration-1000" src/`
→ no matches. `npm run lint && npm run type-check && npm run build && npm run test:e2e`
→ all pass (the e2e home test must still pass without the loader).

### Phase D — Hero recomposition (`src/components/Hero.tsx`)

Goal: one calm, confident hero. Typography is the hero; motion is seasoning.

1. **Delete** the CSS grid-overlay block (the `div` with inline
   `backgroundImage: linear-gradient(...)` at `:108-117`) — the
   HandsBackground canvas grid already provides this texture.
2. **Reduce the floating shapes from three to one.** Keep only the first
   (top-left bordered square), delete the other two `motion.div` shapes.
   Slow its spin: `transition={{ duration: 40, repeat: Infinity, ease: "linear" }}`
   and drop its opacity classes to `opacity-40`.
3. **Re-implement mouse parallax without re-renders.** Replace the
   `useState` + `mousemove` listener (`:13, 23-33`) with Framer Motion motion
   values:
   ```tsx
   const mx = useMotionValue(0);
   const my = useMotionValue(0);
   const sx = useSpring(mx, { stiffness: 60, damping: 20 });
   const sy = useSpring(my, { stiffness: 60, damping: 20 });
   // listener (in useEffect, window mousemove):
   //   mx.set((e.clientX / window.innerWidth - 0.5) * 20);
   //   my.set((e.clientY / window.innerHeight - 0.5) * 20);
   const rotateX = useTransform(sy, (v) => v);
   const rotateY = useTransform(sx, (v) => v);
   ```
   Apply via `style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}` on
   the remaining shape. The component must no longer re-render on mouse move
   (no `useState` for position).
4. **Fix the role rotation.** Wrap the rotating `motion.p` in
   `<AnimatePresence mode="wait" initial={false}>` so the `exit` animation
   actually plays. Keep the 3s interval.
5. **Typography & hierarchy pass**:
   - h1: replace `text-[clamp(2.5rem,12vw,4rem)] sm:text-5xl md:text-6xl`
     (conflicting sizes) with `text-display`.
   - Intro paragraph: `text-body-lg text-text-secondary` (drop the
     `text-white/55`, which fails contrast).
   - Role line: `text-heading text-text-secondary`.
   - Badge copy: change "Available, also for freelance work" to
     `Open to full-time & freelance work` (clearer rhythm); style:
     `font-mono text-xs` with the pulsing dot (keep pulse).
   - Scroll indicator label: `text-white/30` → `text-text-muted`.
6. **Entrance choreography**: keep the existing staggered delays but cap the
   total: last element (socials) lands by ~0.9s (current chain runs past
   1.4s). Reduce each `delay` proportionally (0.1 → 0.7 range) and use the
   standard ease `[0.16, 1, 0.3, 1]` on all of them.
7. **CTA buttons**: primary keeps `bg-accent` but hover becomes
   `hover:bg-accent-hover` (replace `hover:bg-accent/90`); radius `rounded-xl`
   on both CTAs (replace `rounded-lg`).

**Verify**: `npm run lint && npm run type-check && npm run build && npm run test:e2e`
→ pass (home h1 test asserts /building intelligent/i — unchanged).
`grep -n "setMousePosition\|perspective-1000" src/components/Hero.tsx` →
`setMousePosition` gone (the `perspective-1000` wrapper may stay for the one
shape). Manual: `npm run dev`, confirm hero feels calmer and parallax is
smooth (no jank while moving the cursor).

### Phase E — Component coherence (Header, Footer, Work, NotFound)

1. **Footer** (`src/components/Footer.tsx`): replace every `blue-400` /
   `blue-500` with accent equivalents — `hover:border-blue-400/30` →
   `hover:border-accent/40`, `focus-visible:ring-blue-500` →
   `focus-visible:ring-accent`, `group-hover:text-blue-400` →
   `group-hover:text-accent`. Replace `gradient-text` with `text-gradient`
   (Phase A). Social squares: `rounded-xl` stays.
2. **Header** (`src/components/Header.tsx`): hover color on the Twitter/X and
   LinkedIn links is `hover:text-blue-400` — change to `hover:text-accent`
   (in both `socialLinks` usages: desktop and mobile menu; the `color` field
   in the `socialLinks` array). GitHub keeps `hover:text-white`.
3. **Work cards** (`src/components/Work.tsx`):
   - Card radius: `rounded-2xl sm:rounded-3xl` → `rounded-2xl` (everywhere).
   - Title: use `text-heading` and drop the `sm:text-2xl md:text-3xl`
     escalation (card titles shouldn't compete with section titles).
   - Description: `text-text-secondary` instead of `text-white/60`; cap at
     `sm:text-base` (the current `sm:text-lg` makes cards read like articles).
   - Tags: `text-white/70` → `text-text-secondary`.
   - Section h2: `text-title` instead of `text-3xl sm:text-4xl md:text-5xl`;
     intro paragraph `text-body-lg text-text-secondary`.
   - Keep the SpotlightCard radial-highlight effect exactly as is.
4. **NotFound** (`src/pages/NotFound.tsx`): `rounded-3xl` → `rounded-2xl`;
   button `rounded-xl` (already); `text-white/65` → `text-text-secondary`.
5. **Global metadata-contrast sweep**:
   `grep -rn "text-white/40\|text-white/30" src/` — replace every hit with
   `text-text-muted` (these are dates, language chips, icon tints in
   `PullRequests.tsx`, `Hero.tsx` leftovers, `Header.tsx`, `Work.tsx`).
   For *icon-only* decorative elements next to labeled text, `text-white/50`
   is acceptable.

**Verify**: `grep -rn "blue-400\|blue-500\|cyan-400\|gradient-text" src/` → no
matches. `grep -rn "text-white/40\|text-white/30" src/` → no matches.
`grep -rn "rounded-3xl" src/` → no matches.
`npm run lint && npm run type-check && npm run build && npm run test:e2e` →
all pass — **the axe scan is the contrast gate; it must report zero
serious/critical violations including `color-contrast`.**

### Phase F — Pull-requests page UX (`src/pages/PullRequests.tsx`)

The page works; it's just busy. Calm it:

1. **Org cards default collapsed.** Delete the auto-expand logic in the fetch
   effect (`:61-63` — the `prsArray`/`orgs`/`setExpandedOrgs` lines).
   `expandedOrgs` already initializes to an empty Set. The cards become an
   overview; the grid below remains the full list. (This also removes the
   double-listing feel without restructuring.)
2. **Toolbar consolidation.** Wrap the existing filter buttons and sort
   buttons in a single toolbar container:
   `flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between`
   — filters (with their label) on one side, sorts (with label) on the other.
   Keep every button's existing handler, aria-label, and active styles;
   change only layout wrappers. Active filter pills keep their semantic
   colors (accent/purple/green).
3. **Section header**: h2 → `text-title` (replace the
   `text-[clamp(2rem,10vw,3.5rem)] … md:text-5xl` mix); intro →
   `text-body-lg text-text-secondary`.
4. **Cards**: `rounded-3xl`/`sm:rounded-3xl` → `rounded-2xl` (PR cards, org
   cards, skeletons, error panel — align with Phase E's grep). Body text
   `text-white/60` → `text-text-secondary`; dates/langs already swept in
   Phase E.
5. **Stagger sanity**: PR-card entrance `delay: index * 0.05` is fine for the
   first dozen but with 30+ cards the tail takes 1.5s+. Cap it:
   `delay: Math.min(index * 0.05, 0.4)`. Same for org cards
   (`delay: index * 0.1` → `Math.min(index * 0.1, 0.4)`).

**Verify**: `npm run lint && npm run type-check && npm run build && npm run test:e2e`
→ pass (PR-page heading test unchanged). Manual: `npm run dev`, visit
`/pull-requests` — org cards collapsed, toolbar reads as one unit, filters
still work.

### Phase G — Brand surfaces: favicon + OG card

1. **Favicon.** Create `public/favicon.svg` — a hand-written SVG monogram:
   `#0a0a0a` rounded-square background (rx ≈ 20%), the text `h0x` (or `h`)
   in Manrope-ish bold (`font-family="system-ui, sans-serif"` is fine at
   favicon size), fill `#5e6ad2`. Keep it under 1 KB. Example shape:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
     <rect width="64" height="64" rx="13" fill="#0a0a0a"/>
     <text x="32" y="42" text-anchor="middle" font-family="system-ui,sans-serif"
           font-weight="800" font-size="28" fill="#5e6ad2">h0x</text>
   </svg>
   ```
2. **OG card.** Create `scripts/og-template.html`: a self-contained 1200×630
   page — `#0a0a0a` background, a faint 40px grid (CSS gradients, matching the
   site's texture), name `haroon0x` large in the site's heading style
   (system-ui fallback is acceptable; or load Manrope from Google Fonts since
   this renders once at generation time), subtitle
   `AI/ML Engineer · Agents · Open Source`, an accent `#5e6ad2` underline
   or dot motif. No external images.
   Generate the asset with the already-installed Playwright:
   ```bash
   npx playwright screenshot --viewport-size=1200,630 scripts/og-template.html public/og-card.png
   ```
3. **Wire up `index.html`**:
   - `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
   - `og:image` and `twitter:image` → `https://haroon0x.onrender.com/og-card.png`
     (absolute URL, matching the existing `og:url` at `index.html:18` — see
     STOP conditions if the canonical domain is in doubt).
   - Add `<meta property="og:image:width" content="1200" />` and
     `<meta property="og:image:height" content="630" />`.

**Verify**: `ls -la public/favicon.svg public/og-card.png` → both exist,
og-card.png > 10 KB. `npm run build` → exit 0, then
`ls dist/favicon.svg dist/og-card.png` → both present.
`grep -n "vite.svg" index.html` → no matches.

### Phase H — Test reinforcement (`tests/ui.spec.ts`)

Add to the existing describe block, following the existing tests' style:

1. **Mobile menu** (will run on both projects; meaningful on Pixel 7):
   ```ts
   test('mobile menu opens and navigates', async ({ page, isMobile }) => {
     test.skip(!isMobile, 'mobile-only interaction');
     await page.goto('/');
     await page.getByRole('button', { name: /open menu/i }).click();
     await expect(page.getByRole('dialog')).toBeVisible();
     await page.getByRole('dialog').getByRole('link', { name: /pull requests/i }).click();
     await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
   });
   ```
2. **PR filter interaction**:
   ```ts
   test('PR status filter narrows the list', async ({ page }) => {
     await page.goto('/pull-requests');
     await page.getByRole('button', { name: /show merged pull requests/i }).click();
     await expect(page.getByRole('button', { name: /show merged pull requests/i })).toBeVisible();
     // every visible status chip in the card grid should now read "Merged"
     const chips = page.locator('a:has(h3) >> text=/^(Open|Closed)$/');
     await expect(chips).toHaveCount(0);
   });
   ```
   (If the chip locator proves flaky against real data, assert instead that
   no card contains the text "Open" in its status pill — adjust the locator,
   keep the intent: filtering hides non-merged cards.)
3. **Brand assets respond**:
   ```ts
   test('favicon and og image are served', async ({ page }) => {
     const fav = await page.request.get('/favicon.svg');
     expect(fav.ok()).toBeTruthy();
     const og = await page.request.get('/og-card.png');
     expect(og.ok()).toBeTruthy();
   });
   ```
4. **Axe scan on the PR page** (the home page already has one): replicate the
   existing axe block from the home test on `/pull-requests`, same
   serious/critical filter, after the same animation-disabling style tag.

**Verify**: `npm run test:e2e` → all tests pass on both projects (3 existing +
new ones; the mobile-menu test skips on desktop).

### Phase I — Final gate & wrap-up

1. Full sweep: `npm run lint && npm run type-check && npm run build && npm run test:e2e` → all green.
2. Banned-pattern audit (all must return nothing):
   ```bash
   grep -rn "vite.svg" index.html
   grep -rn "00d9ff\|accent-glow" src/ tailwind.config.js
   grep -rn "blue-400\|blue-500\|cyan-400" src/
   grep -rn "text-white/40\|text-white/30" src/
   grep -rn "rounded-3xl\|duration-1000" src/
   grep -rn "useTheme\|ThemeProvider\|PageTransition\|useAdvancedScrollAnimation" src/
   ```
3. `git status` — confirm no files outside the Scope list are modified.
4. Update this plan's row in `plans/README.md` to DONE (or BLOCKED with reason).

## Test plan

Covered by Phase H: mobile navigation, PR filtering, brand-asset serving, and
a second axe scan. The axe scans are the machine gate for the contrast work;
the existing home/PR/404 tests are the regression net for the structural
changes. Model new tests on the existing ones in `tests/ui.spec.ts` (same
imports, same describe block, same animation-disabling pattern where axe is
involved).

## Done criteria

ALL must hold:

- [ ] `npm run lint`, `npm run type-check`, `npm run build`, `npm run test:e2e` all exit 0
- [ ] All Phase I banned-pattern greps return zero matches
- [ ] `public/favicon.svg` and `public/og-card.png` exist and ship in `dist/`
- [ ] Axe reports zero serious/critical violations on `/` and `/pull-requests` (includes `color-contrast`)
- [ ] Hero no longer re-renders on mousemove (no `useState` position in `Hero.tsx`)
- [ ] No fake loading screen: `src/components/PageTransition.tsx` deleted
- [ ] No theme infrastructure: contexts/hook files deleted, no toggle in Header
- [ ] `git status` shows no modifications outside the Scope list
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The drift check shows in-scope files changed and the "Current state"
  excerpts no longer match what you read.
- You believe a new npm dependency is required for any step.
- The canonical production domain is not `https://haroon0x.onrender.com/`
  (e.g. you find evidence the site actually deploys to Netlify — the
  `public/_redirects` file is a Netlify convention, which conflicts with the
  onrender.com `og:url`). Absolute OG URLs must point at the real domain;
  report the conflict instead of guessing.
- Removing the theme system reveals any component that *does* consume the
  `dark` class (i.e. `grep -rn "dark:" src/` returns matches — at planning
  time it returned zero).
- The e2e suite fails for a reason unrelated to your change (e.g.
  `pr-data.json` fetch flake) twice in a row.
- Any axe `color-contrast` violation persists after applying the contrast
  rules in this plan — report the specific element rather than muting the rule.

## Maintenance notes

- **Token discipline is the deliverable.** Future reviewers should reject any
  PR that reintroduces raw `blue-*`/`cyan-*` chrome, sub-`/50` text opacity,
  `rounded-3xl`, or `duration-1000`. The Phase I greps make a good CI check
  later if drift becomes a problem.
- The OG card must be regenerated (`scripts/og-template.html` + the Playwright
  screenshot command in Phase G) whenever branding or the headline role
  changes.
- If a light theme is ever actually wanted, it's a fresh plan: add
  `darkMode: 'class'` to Tailwind, define light tokens, and reintroduce a
  toggle — none of the removed code was worth keeping for that.
- Deferred out of this plan (tracked in `plans/audit-findings.md`): repo
  hygiene (untracking `haroon-resume.html`, stray binaries, `.gitattributes`),
  `npm audit fix`, `fetch-prs.cjs` concurrency + commit-noise fixes, the
  webhook stub decision, runtime validation of `pr-data.json`.
