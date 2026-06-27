# Plan 002: Rebuild the portfolio as a light "white lily garden" anime aesthetic

> **Executor instructions**: Follow this plan phase by phase, in order. Run
> every verification command and confirm the expected result before moving on.
> If anything in the "STOP conditions" section occurs, stop and report — do
> not improvise. When done, update the status row for this plan in
> `plans/README.md`.
>
> **MUTUALLY EXCLUSIVE WITH PLAN 001.** Plans 001 (dark Linear-style) and 002
> (this one) restyle the same files toward different identities. Execute one
> or the other, never both. If `plans/README.md` shows 001 as IN PROGRESS or
> DONE, treat that as a STOP condition and ask the operator which identity
> wins.
>
> **Drift check (run first)**:
> `git diff --stat dbcfd78..HEAD -- src/ index.html tailwind.config.js tests/`
> If in-scope files changed since planning, compare the "Current state"
> excerpts in this file against the live code; on a mismatch, STOP.
>
> **Line-endings note**: at planning time every file showed modified due to
> CRLF churn (no `.gitattributes`). If `git status` shows the whole tree
> modified before you touch anything, report it — the repo-hygiene fix
> (`plans/audit-findings.md`, DX-01) should land first.

## Status

- **Priority**: P1 (alternative to 001 — operator picks one)
- **Effort**: L (multi-day; phases are independently landable)
- **Risk**: MED (complete visual identity swap; mitigated by per-phase gates,
  e2e + axe scans, and the fact that all *structure* and copy stay put)
- **Depends on**: none (conflicts with 001 — see above)
- **Category**: direction (visual/UX overhaul)
- **Planned at**: commit `dbcfd78`, 2026-06-11

## Why this matters

The current site is a competent dark "Linear-like" template — and it looks
like a thousand other developer portfolios. This plan replaces it with an
identity nobody else has: a **luminous, anime-film light theme** — ivory paper,
a soft morning-sky gradient, a hand-drawn white lily garden growing from the
page edges, and petals drifting slowly down the viewport. Think the quiet
painted frames of a Makoto Shinkai or Studio Ghibli background: lots of light,
lots of air, one or two living details, and typography that reads like a film
title card. The craft bar is "exceptionally well thought out": every color is
tokenized and WCAG-AA verified, every animation is GPU-cheap and respects
`prefers-reduced-motion`, and the garden is built from hand-authored inline
SVG — zero image downloads, zero new dependencies, crisp at every DPI.

It also fixes, in passing, the same functional debt plan 001 fixes (dead theme
toggle, fake loading screen, mousemove re-renders, broken favicon/OG, legacy
Lenis options), because no restyle is credible on top of broken chrome.

**Design north star**: *ma* (間 — negative space) and *shibui* (渋い — quiet,
unobtrusive beauty). The garden never competes with the content. If a step
ever forces a choice between "more decoration" and "more air", choose air.

## Current state

Stack: React 18 SPA, Vite 8, Tailwind 3.4, Framer Motion 11, Lenis 1.3,
lucide-react. Routes: `/` (Hero + Work + Footer), `/pull-requests`, `*` (404).
Static deploy (`public/_redirects` SPA fallback). **Mobile-friendliness is a
stated hard requirement** (`Agents.md:2`).

The site today is a dark theme: background blacks `#050505`/`#0a0a0a`
(two competing values), glass cards `bg-zinc-900/40` + `border-white/10`,
text as white-opacity utilities (`text-white/60` etc.), accent blurple
`#5e6ad2`, stray `blue-400`/`cyan-400` chrome, and a fixed background
component compositing an inverted photograph of hands with an animated canvas
grid. Almost every component hardcodes dark colors — this plan inverts the
entire surface.

Key files (read each before editing it):

- `tailwind.config.js` — tokens today:
  ```js
  colors: {
    background: '#050505', surface: '#0f0f0f',
    border: 'rgba(255, 255, 255, 0.08)',
    accent: { DEFAULT: '#5e6ad2', glow: '#00d9ff' },
    text: { primary: '#ededed', secondary: '#a1a1a1' },
  }
  ```
  `fontFamily`: Manrope (heading + body), JetBrains Mono. No `darkMode` key.
- `src/index.css` (241 lines) — dark base styles: body forces
  `background-color: #0a0a0a`; an SVG-noise overlay (`body::before`,
  lines 19–31); duplicate utilities (`.text-gradient`/`.gradient-text`,
  `.glass`/`.glass-panel`); hand-rolled `.line-clamp-*`, `.text-balance`,
  `.text-pretty`, `.tabular-nums` (all native in Tailwind 3.4); cyan
  `#00d9ff` global focus outline (lines 180–184); dark scrollbar styles;
  useful keepers: `.safe-x`, `.safe-top`, `.fluid-section`,
  `.card-container`/`.cq-card-*` container queries, `.skip-link`, the
  `prefers-reduced-motion` kill-switch (lines 199–209).
- `index.html` — favicon/`og:image`/`twitter:image` all point to `/vite.svg`
  which **does not exist** in `public/`; Google Fonts link loads Manrope +
  JetBrains Mono; a dead theme bootstrap script (lines 49–59); a `<link
  rel="preload">` for `/hands-960.webp` (lines 29–36); gtag analytics (keep).
- `src/App.tsx` — composition:
  `ThemeProvider > Router > skip-link + SmoothScroll + HandsBackground > AppErrorBoundary > PageTransition > ScrollProgress + Suspense(Routes)`.
- `src/components/HandsBackground.tsx` — the fixed photo+canvas background.
  **Replaced wholesale by this plan.**
- `src/components/PageTransition.tsx` — fake black loading screen (min 250 ms,
  up to 1200 ms) on every load. **Deleted by this plan.**
- `src/components/Hero.tsx` — dark hero: three infinitely-spinning 3D border
  shapes, mouse parallax via `useState` (re-renders whole component per
  mousemove, lines 23–33), rotating role text with a dead `exit` prop (no
  `AnimatePresence`), pulsing badge, scroll indicator, and a CSS grid overlay.
- `src/components/Header.tsx` — floating dark pill nav (`bg-zinc-900/40
  backdrop-blur-xl border-white/10`), a Sun/Moon theme toggle that does
  nothing (no `dark:` styles exist anywhere), mobile menu overlay with good
  a11y (`role="dialog"`, `aria-modal`, Escape handler, scroll lock).
- `src/components/Work.tsx` — 7 hardcoded projects in `SpotlightCard`s
  (white radial mouse highlight on dark glass). Dead: `Project.size` field,
  `order` prop.
- `src/components/Footer.tsx` — dark footer, off-palette `blue-400/500`
  hovers/rings, `gradient-text` logo.
- `src/components/ScrollProgress.tsx` — top bar, `from-blue-400 to-cyan-400`
  gradient, animates `width` with a 300 ms transition.
- `src/components/SmoothScroll.tsx` — Lenis init with **pre-1.0 option names**
  (`direction`, `gestureDirection`, `smooth`, `smoothTouch`,
  `mouseMultiplier`) the installed lenis 1.3 ignores.
- `src/components/Magnetic.tsx` — spring magnetic hover wrapper (keep as-is).
- `src/pages/PullRequests.tsx` (439 lines) — stats row, expandable org cards
  (auto-expanded on load, lines 61–63), filter/sort button rows, PR card
  grid; dark glass styling throughout; status colors purple/green/red.
- `src/pages/NotFound.tsx` — dark glass 404 card.
- `src/contexts/ThemeContext.tsx`, `src/contexts/ThemeProvider.tsx`,
  `src/hooks/useTheme.tsx` — dead theme infrastructure. **Deleted.**
- `src/hooks/useScrollAnimation.tsx` — `useScrollAnimation` (used) +
  `useAdvancedScrollAnimation` (zero callers). Latter deleted.
- `tests/ui.spec.ts` — 3 Playwright tests (home + axe serious/critical
  filter, PR heading, 404) on Desktop Chrome + Pixel 7.

Conventions to match: functional components, default exports, Tailwind
utilities inline, custom utilities in `src/index.css` `@layer utilities`,
conventional-commit messages (see `git log`).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run type-check` | exit 0, no errors |
| Build | `npm run build` | exit 0, `dist/` written |
| E2E + a11y | `npm run test:e2e` | all pass (starts its own preview server) |
| Dev server (manual checks) | `npm run dev` | serves on printed port |
| Browsers (first run only) | `npx playwright install --with-deps chromium` | exit 0 |

Run the full gate (`lint`, `type-check`, `build`, `test:e2e`) at the end of
**every phase**. Phases are ordered so the app builds and runs after each one
(the site may look transitional between phases — that is expected on the
working branch).

## Scope

**In scope** (the only files you may modify or create):

- `tailwind.config.js`, `src/index.css`, `index.html`
- Everything under `src/components/`, `src/pages/`, `src/contexts/`,
  `src/hooks/`, `src/App.tsx`
- `src/components/LilyGarden.tsx` (create — replaces `HandsBackground.tsx`)
- `tests/ui.spec.ts`
- `public/favicon.svg`, `public/og-card.png` (create)
- `scripts/og-template.html` (create — used once to generate the OG card)
- Deletion of `public/hands-960.webp`, `public/hands-1600.webp`,
  `public/hands-high-res.jpg`, `public/hands.png` (Phase C, after nothing
  references them)
- `plans/README.md` (status row only)

**Out of scope** (do NOT touch):

- `haroon-resume.html` — repo rule (`Agents.md:1`).
- `scripts/fetch-prs.cjs`, `.github/workflows/*`, `backend-webhoook/`,
  `public/pr-data.json`, `public/_redirects`.
- `package.json` / `package-lock.json` — **no new npm dependencies.** Fonts
  come from Google Fonts (already the loading mechanism). If you believe you
  need a package, STOP.
- `vite.config.ts`, `playwright.config.ts`, `eslint.config.js`, `tsconfig*`.
- All copy/content except where a step explicitly rewrites it.

## Git workflow

- Branch: `advisor/002-anime-lily-garden`
- One commit per phase, conventional style, e.g.
  `feat: lily garden background component (phase C)`.
- Do NOT push or open a PR unless the operator instructed it.

---

## The design system (target)

This is the specification the phases implement. Values are final — do not
re-derive them. Every color pair listed has been chosen against WCAG AA.

### Palette — "morning garden"

```js
// tailwind.config.js → theme.extend.colors  (REPLACES the current block)
colors: {
  background: '#faf8f4',                  // warm ivory paper
  sky: {
    light: '#eef5fc',                     // top-of-page morning sky
    haze: '#fdfbf7',                      // where sky melts into ivory
  },
  surface: '#ffffff',                     // cards/panels
  border: 'rgba(31, 35, 40, 0.08)',       // hairline ink
  ink: {
    DEFAULT: '#1f2328',                   // headings, key copy  (~15:1 on ivory)
    secondary: '#46525c',                 // body                 (~7.5:1)
    muted: '#66707a',                     // metadata FLOOR       (~4.7:1)
  },
  accent: {
    DEFAULT: '#3e7a52',                   // deep garden green — links, CTAs (~5:1 on ivory)
    hover: '#346847',                     // darker on hover
    muted: 'rgba(62, 122, 82, 0.10)',     // tinted chips/badges
  },
  gold: {
    DEFAULT: '#a8821f',                   // lily-pollen gold — decorative lines,
    soft: 'rgba(168, 130, 31, 0.14)',     // large text & ornaments ONLY (3.4:1 —
  },                                      // never body/metadata text)
  blush: '#f7eef0',                       // petal-pink tinted surfaces
},
```

**Contrast rules (the law of this plan):**
- Text uses only `ink`, `ink-secondary`, `ink-muted`, `accent`, or `#fff` on
  a solid `accent`/`accent-hover` fill. Nothing lighter than `ink-muted`
  (`#66707a`) may carry information.
- `gold` is decorative: rules, ornaments, the section-marker dots, and text
  at ≥ 24 px only.
- PR status colors become light-theme semantics (GitHub's own conventions):
  merged `#6f42c1` on `bg-purple-700/10`, open `#1a7f37` on
  `bg-green-700/10`, closed `#cf222e` on `bg-red-700/10` — chip text at
  these exact hex values passes AA on their tints.
- **Banned after this plan**: `text-white/*` (except on solid accent fills),
  `bg-zinc-*`, `border-white/*`, `bg-white/5`, `bg-white/10`, `#00d9ff`,
  `blue-400`, `blue-500`, `cyan-400`, `#5e6ad2`.

### Typography — film title card

- **Headings**: `Shippori Mincho` (Google Fonts; weights 500, 600, 700) — a
  Japanese mincho serif that instantly reads "anime film title". Latin glyphs
  are elegant; tracking slightly open.
- **Body/UI**: Manrope stays (already loaded). **Mono**: JetBrains Mono stays
  — repo names, dates, +/- counts, small labels.

```js
// tailwind.config.js → theme.extend.fontFamily  (REPLACES current)
fontFamily: {
  heading: ['"Shippori Mincho"', 'Georgia', 'serif'],
  body: ['Manrope', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
},
// theme.extend.fontSize  (ADD)
fontSize: {
  'display': ['clamp(2.75rem, 8vw, 4.75rem)', { lineHeight: '1.08', letterSpacing: '0.01em' }],
  'title':   ['clamp(2rem, 5vw, 3rem)',       { lineHeight: '1.15', letterSpacing: '0.01em' }],
  'heading': ['clamp(1.25rem, 3vw, 1.5rem)',  { lineHeight: '1.35' }],
  'body-lg': ['clamp(1.0625rem, 1.5vw, 1.1875rem)', { lineHeight: '1.75' }],
},
```

Usage: `font-heading text-display` = Hero h1 only. `font-heading text-title`
= section h2s. `text-heading` = card titles (font-heading for Work projects,
font-body semibold for PR cards — PR titles are data, not poetry).
Serif headings get `text-ink`; never set serif below 1.25 rem.

### Radius, elevation, texture

- Radius: `rounded-2xl` for cards/panels/menus, `rounded-xl` for buttons,
  `rounded-full` for pills and icon buttons. No `rounded-3xl`.
- Elevation (replaces dark-glass): cards are `bg-surface` +
  `border border-border` + soft diffuse shadow. Add to
  `tailwind.config.js → theme.extend.boxShadow`:
  ```js
  boxShadow: {
    petal: '0 1px 2px rgba(31,35,40,0.04), 0 8px 24px rgba(31,35,40,0.06)',
    'petal-lg': '0 2px 4px rgba(31,35,40,0.05), 0 16px 48px rgba(31,35,40,0.09)',
  },
  ```
  Default card: `shadow-petal`, hover: `shadow-petal-lg` + `border-accent/30`.
- Texture: the existing SVG-noise overlay in `index.css` survives but drops
  to `opacity: 0.25` — paper grain, barely there.

### Motion — "petals, not pyrotechnics"

```js
// tailwind.config.js → theme.extend  (ADD)
transitionDuration: { fast: '150ms', base: '250ms', slow: '500ms' },
transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
```

- Hover/press: `duration-fast`. Menus/filters: `duration-base`. Entrances:
  `duration-slow`. No `duration-1000` anywhere.
- Framer entrances: fade + 12 px rise, `{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }`,
  sibling stagger 0.06 s, `viewport={{ once: true }}` for scroll reveals.
- `<MotionConfig reducedMotion="user">` wraps the app.
- Infinite animations allowed: **drifting petals (≤ 8), the lily sway
  (one subtle rotation), the badge pulse.** Nothing else loops.
- All looping animation is `transform`/`opacity` only and is removed for
  `prefers-reduced-motion` users via Tailwind's `motion-reduce:hidden` /
  the existing CSS kill-switch.

---

## Steps

### Phase A — Foundation: fonts, tokens, light base styles

1. **Fonts** (`index.html`): in the Google Fonts stylesheet URL, add
   Shippori Mincho — replace the existing `<link href="https://fonts.googleapis.com/css2?family=Manrope...">`
   with:
   ```
   https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Shippori+Mincho:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap
   ```
   (Drop the unused Manrope 200/800 weights while you're there.) Add
   `<meta name="theme-color" content="#faf8f4" />` to `<head>`. Remove the
   `<link rel="preload" ... hands-960.webp ...>` block (the asset goes away
   in Phase C). Remove the dead theme bootstrap `<script>` (the IIFE reading
   `localStorage.getItem('theme')`).
2. **Tokens** (`tailwind.config.js`): replace `colors` and `fontFamily` with
   the spec blocks above; add `fontSize`, `boxShadow`, `transitionDuration`,
   `transitionTimingFunction`. Keep `backgroundImage` as is.
3. **Base styles** (`src/index.css`):
   - `body`: delete the hardcoded `background-color: #0a0a0a` line — the
     `@apply bg-background` now yields ivory. Update the `@apply` line's
     selection colors: `selection:bg-accent/20 selection:text-ink`.
     Replace `text-text-primary` with `text-ink` (token rename).
   - Delete the dead `:root` `--background`/`--foreground` variables and the
     stray "Hide default cursor" comment.
   - Noise overlay (`body::before`): change `opacity: 0.4` → `0.25`.
   - Delete `.gradient-text` (migrate its `Footer.tsx` use to plain
     `text-ink font-heading`; its other user `PageTransition.tsx` is deleted
     in Phase B). Delete `.glass` and `.text-gradient-accent` after
     confirming no users: `grep -rn '"glass[" ]\|text-gradient-accent' src/`
     → only `.glass-panel` hits allowed. Restyle `.glass-panel` and
     `.text-gradient` for light theme or delete them too if unused.
   - Delete the hand-rolled `.line-clamp-2/3`, `.text-balance`,
     `.text-pretty`, `.tabular-nums` utilities (Tailwind 3.4 natives share
     the class names — zero component changes).
   - `:focus-visible`: `outline: 2px solid #3e7a52`.
   - Scrollbar: track `#f3f0ea`, thumb `#d8d2c6` with `border-border`,
     hover `#c4bcae`.
   - `.skip-link`: light theme — `background: #ffffff; color: #1f2328;
     border: 1px solid rgba(31,35,40,0.15)`.
   - Keep: `.safe-x`, `.safe-top`, `.fluid-section`, `.card-container`,
     `.cq-card-*`, reduced-motion kill-switch, print styles, mobile
     min-target rules.

**Verify**: `npm run lint && npm run type-check && npm run build` → exit 0.
`grep -rn "00d9ff\|0a0a0a\|050505" src/index.css tailwind.config.js` → no
matches. (The site will look half-themed in the browser — fine; components
are swept in B–F.)

### Phase B — Functional surgery (same debt plan 001 kills)

1. **Theme infra**: delete `src/contexts/ThemeContext.tsx`,
   `src/contexts/ThemeProvider.tsx`, `src/hooks/useTheme.tsx`. In
   `src/App.tsx` remove the `ThemeProvider` import/wrapper. In
   `src/components/Header.tsx` remove `useTheme` usage and the entire
   Sun/Moon toggle block plus its `Sun, Moon` lucide imports.
2. **Fake loader**: delete `src/components/PageTransition.tsx`; remove its
   import/wrapper from `src/App.tsx`.
3. **MotionConfig**: in `src/App.tsx`, wrap the app contents (inside Router)
   with `<MotionConfig reducedMotion="user">` (import from `framer-motion`).
4. **Lenis** (`src/components/SmoothScroll.tsx`): replace the options object
   with the lenis 1.x API:
   ```ts
   const lenis = new Lenis({
     duration: 1.2,
     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
     smoothWheel: true,
     syncTouch: false,
   });
   ```
5. **ScrollProgress** (`src/components/ScrollProgress.tsx`): bar becomes a
   gold thread — track `bg-border`, fill `bg-gold`, animate with
   `style={{ transform: \`scaleX(${scrollProgress})\` }}` + `origin-left`
   on a full-width bar; remove the `transition-[width] duration-300` classes.
6. **Dead code**: delete `useAdvancedScrollAnimation` from
   `src/hooks/useScrollAnimation.tsx`; in `src/components/Work.tsx` delete
   the `Project.size` field (interface + all 7 objects) and the
   `order`/`WorkProps`/`displayProjects` machinery (render `projects`
   directly); update `src/pages/Home.tsx` to `<Work />`.

**Verify**:
`grep -rn "useTheme\|ThemeProvider\|ThemeContext\|PageTransition\|useAdvancedScrollAnimation\|isDark" src/ index.html`
→ no matches. `npm run lint && npm run type-check && npm run build && npm run test:e2e` → pass.

### Phase C — The garden: `src/components/LilyGarden.tsx`

Replaces `HandsBackground.tsx` (photo + canvas grid). One component, three
layers, all inline SVG/CSS — no image requests, no canvas, no new deps.

1. **Create `src/components/LilyGarden.tsx`** with the same external contract
   as HandsBackground (`{ children: React.ReactNode }`, wraps content in a
   `relative` container with the painted layers behind at `z-0` and
   `children` at `z-10`):

   **Layer 1 — sky wash** (a `div`, `fixed inset-0`, `aria-hidden`):
   ```html
   <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0"
        style={{ background:
          'linear-gradient(180deg, #eef5fc 0%, #f6f7f5 38%, #faf8f4 70%)' }} />
   ```
   plus one soft sun glow, top-right:
   ```html
   <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0"
        style={{ background:
          'radial-gradient(900px 600px at 78% -8%, rgba(255, 244, 214, 0.55), transparent 65%)' }} />
   ```

   **Layer 2 — the lily bed**: one inline SVG pinned to the bottom of the
   viewport (`fixed bottom-0 inset-x-0`, `aria-hidden`, `pointer-events-none`),
   height `clamp(180px, 28vh, 340px)`, `preserveAspectRatio="xMidYMax slice"`.
   Stylized cel-style white lilies on green stems rising from the bottom edge —
   denser in the corners, sparse in the middle (content must stay readable).
   Build it from a reusable `<defs>` lily and leaf, then place 7–9 instances
   with varied scale/rotation. Use exactly this drawing vocabulary (copy, then
   refine placement by eye in the dev server):
   ```svg
   <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <!-- one trumpet lily, drawn facing up-left; ~80×90 units -->
       <g id="lily">
         <!-- petals: 5 overlapping, white with faint cool shading -->
         <path d="M40 70 C18 52 8 28 16 8 C30 18 42 38 44 62 Z" fill="#ffffff" stroke="#dfe5e2" stroke-width="1.5"/>
         <path d="M44 68 C36 42 38 16 52 2 C60 18 58 44 52 66 Z" fill="#fbfcfb" stroke="#dfe5e2" stroke-width="1.5"/>
         <path d="M48 70 C60 48 76 34 92 32 C86 50 70 64 54 72 Z" fill="#ffffff" stroke="#dfe5e2" stroke-width="1.5"/>
         <path d="M46 72 C64 66 80 68 90 78 C76 84 58 82 46 76 Z" fill="#f4f6f4" stroke="#dfe5e2" stroke-width="1.5"/>
         <path d="M42 74 C28 70 16 74 8 84 C20 90 34 86 42 78 Z" fill="#fbfcfb" stroke="#dfe5e2" stroke-width="1.5"/>
         <!-- stamens: gold anthers -->
         <path d="M44 68 L40 44 M46 68 L48 42 M44 68 L52 48" stroke="#c9c2ae" stroke-width="1.2"/>
         <ellipse cx="39" cy="42" rx="3" ry="1.6" fill="#a8821f" transform="rotate(-30 39 42)"/>
         <ellipse cx="49" cy="40" rx="3" ry="1.6" fill="#a8821f" transform="rotate(15 49 40)"/>
         <ellipse cx="53" cy="46" rx="3" ry="1.6" fill="#a8821f" transform="rotate(40 53 46)"/>
       </g>
       <!-- one leaf blade -->
       <path id="leaf" d="M0 0 C24 -10 52 -8 78 14 C50 22 22 18 0 0 Z" fill="#5d8a6b"/>
     </defs>
     <!-- stems first (behind), two greens for depth -->
     <path d="M120 320 C124 240 118 190 130 150" stroke="#4c7a5d" stroke-width="5" stroke-linecap="round"/>
     <path d="M210 320 C200 250 214 210 206 175" stroke="#5d8a6b" stroke-width="4" stroke-linecap="round"/>
     <!-- …more stems for each lily placement… -->
     <use href="#leaf" x="96" y="236" transform="rotate(-18 96 236)"/>
     <use href="#leaf" x="214" y="252" transform="rotate(156 214 252) scale(-0.8 0.8)"/>
     <!-- blooms on the stem tips; vary scale 0.7–1.2 and rotation ±25° -->
     <use href="#lily" x="92" y="92" transform="scale(1.1)"/>
     <use href="#lily" x="176" y="130" transform="rotate(14 200 160) scale(0.8)"/>
     <!-- mirror a denser cluster on the right side (x ≈ 1180–1380),
          leave x ≈ 420–1020 with only 1–2 small distant blooms at low opacity -->
   </svg>
   ```
   Apply a single, slow sway to the whole bed (CSS, not Framer):
   `animation: lily-sway 14s ease-in-out infinite alternate` where
   `@keyframes lily-sway { from { transform: rotate(-0.4deg); } to { transform: rotate(0.5deg); } }`
   with `transform-origin: bottom center`, and gate it: the animation class is
   added together with Tailwind's `motion-reduce:animate-none`.

   **Layer 3 — drifting petals**: 8 absolutely-positioned petal sprites
   (`fixed`, `aria-hidden`, `pointer-events-none`, hidden entirely under
   `motion-reduce:hidden`). Each is a tiny inline SVG:
   ```svg
   <svg width="14" height="10" viewBox="0 0 14 10">
     <path d="M1 5 C3 1 9 0 13 3 C10 8 4 10 1 5 Z" fill="#ffffff" stroke="#e7e3da" stroke-width="0.8"/>
   </svg>
   ```
   Animated by one keyframe family in `src/index.css`:
   ```css
   @keyframes petal-fall {
     0%   { transform: translate3d(0, -8vh, 0) rotate(0deg); opacity: 0; }
     8%   { opacity: 0.9; }
     100% { transform: translate3d(7vw, 108vh, 0) rotate(300deg); opacity: 0; }
   }
   ```
   Each petal gets inline `left` (spread 5%–95%), `animation-duration`
   (14 s–26 s), and negative `animation-delay` (so the sky is already
   populated on load). Transform/opacity only — nothing else animates.

2. **Swap it in**: in `src/App.tsx`, replace the `HandsBackground`
   import/usage with `LilyGarden`. Delete
   `src/components/HandsBackground.tsx`.
3. **Delete the orphaned assets**:
   `git rm public/hands-960.webp public/hands-1600.webp public/hands-high-res.jpg public/hands.png`
   — first confirm zero references: `grep -rn "hands-" src/ index.html` → no
   matches (the index.html preload was removed in Phase A).

**Verify**: `grep -rn "HandsBackground\|hands-" src/ index.html` → no matches.
`npm run lint && npm run type-check && npm run build && npm run test:e2e` →
pass. Manual (`npm run dev`): sky gradient behind everything, lilies along the
bottom denser at the corners, ≤ 8 petals drifting slowly; with OS
reduced-motion enabled, petals are gone and the bed is still. Scroll
performance stays smooth (petals are `fixed`; no layout thrash). On a
~375 px-wide viewport the lily bed must not cover interactive content —
center is intentionally sparse.

### Phase D — Hero as a film title card (`src/components/Hero.tsx`)

1. **Delete** the CSS grid-overlay block and **all three** spinning 3D
   shapes, plus the `perspective-1000` wrapper and the mouse-parallax state
   (`mousePosition`, its `useEffect` listener) entirely. The garden is the
   background now; the hero adds no shapes. (This also fixes PERF-01: zero
   re-renders on mousemove, by removal rather than motion values.)
2. **Composition** (structure stays: badge → h1 → rotating role → paragraph →
   CTAs → socials → scroll indicator):
   - Badge: `bg-surface border border-border shadow-petal rounded-full`,
     text `font-mono text-xs text-ink-secondary`, the pulsing dot becomes
     `bg-accent`. Copy: `Open to full-time & freelance work`.
   - h1: `font-heading text-display text-ink` —
     `Building Intelligent` / line break / `Systems` where the word
     `Systems` is wrapped in a span with `text-accent` and a hand-drawn
     gold underline: an inline SVG stroke under the word
     (`<svg viewBox="0 0 200 12">` with
     `<path d="M3 9 C60 3 140 3 197 7" stroke="#a8821f" stroke-width="2.5"
     stroke-linecap="round" fill="none"/>`, width 100%, `aria-hidden`).
   - Optional flourish (include it — it earns its place): a small vertical
     Japanese caption beside the h1 on `lg:` screens only:
     `<span aria-hidden="true" className="hidden lg:block absolute -left-10 top-2 font-heading text-sm text-ink-muted tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>白百合の庭</span>`
     ("white lily garden"). `aria-hidden` keeps screen readers in English.
   - Rotating role: wrap the `motion.p` in
     `<AnimatePresence mode="wait" initial={false}>` so the existing `exit`
     prop finally runs; style `text-heading text-ink-secondary`; keep the 3 s
     interval.
   - Paragraph: `text-body-lg text-ink-secondary`.
   - Primary CTA: `bg-accent text-white hover:bg-accent-hover rounded-xl
     shadow-petal` (drop the `shadow-accent/20` glow classes). Secondary CTA:
     `border border-border bg-surface text-ink hover:border-accent
     hover:text-accent rounded-xl`.
   - Social icons: `text-ink-muted hover:text-accent hover:bg-accent-muted`.
   - Scroll indicator: keep, recolor — the gradient line
     `via-accent/50`, label `text-ink-muted`.
3. **Entrance choreography**: keep the existing stagger order but cap the
   chain at ~0.9 s total and use ease `[0.16, 1, 0.3, 1]` everywhere.

**Verify**: home e2e test still passes (`/building intelligent/i` heading
unchanged). `grep -n "setMousePosition\|perspective-1000\|rotateX" src/components/Hero.tsx`
→ no matches. Full gate passes. Manual: hero reads ivory/serif/garden; the
only motion is the role rotation, badge pulse, petals, and scroll hint.

### Phase E — Components in the light (Header, Work, Footer, NotFound)

1. **Header** (`src/components/Header.tsx`):
   - Nav pill: `bg-white/80 backdrop-blur-xl border border-border
     shadow-petal`; scrolled state: `bg-white/95 shadow-petal-lg`.
   - Logo + nav links: `text-ink-secondary hover:text-ink
     hover:bg-ink/[0.04]`; active/hover accent underline optional.
   - Social `color` fields: `hover:text-accent` for all three (drop
     `hover:text-blue-400` / `hover:text-white`).
   - Sponsor pill: `text-ink-muted hover:text-ink bg-ink/[0.03]
     hover:bg-ink/[0.06] border-border`; heart hover stays
     `group-hover:text-accent group-hover:fill-accent`.
   - Mobile menu panel: `bg-white/97 backdrop-blur-xl border-border
     rounded-2xl shadow-petal-lg`; items `text-ink-secondary hover:text-ink
     hover:bg-ink/[0.04]`; overlay `bg-ink/20` (was `bg-black/40`).
   - Keep all aria attributes, Escape handling, and scroll lock exactly as
     they are.
2. **Work** (`src/components/Work.tsx`):
   - Section h2: `font-heading text-title text-ink` ("Selected" plain ink,
     "Works" in `text-accent`); intro `text-body-lg text-ink-secondary`.
   - Cards: `bg-surface border border-border rounded-2xl shadow-petal
     hover:shadow-petal-lg hover:border-accent/30` (replace the zinc/glass
     classes; drop `sm:rounded-3xl`).
   - **SpotlightCard highlight**: keep the mouse-tracked radial, but flip it
     for light — replace the white radial with a green-gold garden tint:
     `radial-gradient(600px circle at ${x}px ${y}px, rgba(62,122,82,0.07), transparent 40%)`.
   - Title: `font-heading text-heading text-ink group-hover:text-accent`;
     description `text-ink-secondary` capped at `sm:text-base`; tags
     `font-mono text-xs text-ink-secondary bg-ink/[0.04] border-border`.
   - Icon buttons: `border-border bg-ink/[0.03] text-ink-muted
     hover:text-ink hover:border-ink/20`.
   - "View Project" link: `text-accent` (keep the slide-in-on-hover
     behavior).
3. **Footer** (`src/components/Footer.tsx`): `bg-transparent border-t
   border-border` (the garden shows through at the page floor — this is
   where the lilies live, so the footer must be airy). Heading
   `font-heading text-ink`; email link `text-ink-secondary hover:text-ink`;
   social squares `bg-surface border-border shadow-petal
   hover:border-accent/40`; ALL `blue-400`/`blue-500` ring/hover classes →
   accent equivalents; focus rings `focus-visible:ring-accent
   focus-visible:ring-offset-background` (offset color was `zinc-950`);
   logo span: `font-heading text-ink` (the `gradient-text` class died in
   Phase A).
4. **NotFound** (`src/pages/NotFound.tsx`): card `bg-surface border-border
   rounded-2xl shadow-petal`; "404" stays `font-mono text-accent`; h1
   `font-heading text-ink`; body `text-ink-secondary`; button
   `bg-accent text-white hover:bg-accent-hover rounded-xl`.
5. **AppErrorBoundary** (`src/components/AppErrorBoundary.tsx`): light error
   panel — `border-red-700/30 bg-red-700/5`, heading `text-ink`, body
   `text-ink-secondary`.
6. **PageLoader** (in `src/App.tsx`): spinner border classes are already
   accent-based; confirm visibility on ivory (border `border-accent
   border-t-transparent` works — no change expected).

**Verify**: `grep -rn "zinc-900\|zinc-950\|blue-400\|blue-500\|cyan-400\|gradient-text" src/`
→ no matches. Full gate passes — **axe is the contrast gate on the new light
theme; zero serious/critical violations.**

### Phase F — Pull-requests page in the light (`src/pages/PullRequests.tsx`)

1. **Org cards default collapsed**: delete the auto-expand lines in the fetch
   effect (the `prsArray`/`orgs`/`setExpandedOrgs(new Set(orgs))` statements,
   lines 61–63 at planning time). `expandedOrgs` already initializes empty.
2. **Header block**: back-link pill → `bg-surface border-border
   text-ink-secondary hover:text-ink shadow-petal`; icon chip →
   `bg-accent-muted text-accent border-accent/20`; h2 →
   `font-heading text-title text-ink` ("Open Source" ink, "Contributions"
   `text-accent`); intro → `text-body-lg text-ink-secondary`.
3. **Stats row**: cards `bg-surface border-border rounded-2xl shadow-petal`;
   numbers `text-ink font-heading tabular-nums`; labels `text-ink-muted`;
   merged tile: number `text-[#6f42c1]`, label `text-ink-muted`,
   `bg-purple-700/5 border-purple-700/20`; open tile: number `text-[#1a7f37]`,
   `bg-green-700/5 border-green-700/20`.
4. **Toolbar**: wrap filters + sorts in one container —
   `flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4
   shadow-petal sm:flex-row sm:items-center sm:justify-between`. Inactive
   buttons: `bg-ink/[0.03] text-ink-secondary hover:bg-ink/[0.06]
   hover:text-ink border-border`. Active: All → `bg-accent text-white`;
   Merged → `bg-[#6f42c1] text-white`; Open → `bg-[#1a7f37] text-white`;
   sort-active → `bg-accent text-white`. Labels (`Filter:`/`Sort:`)
   `text-ink-muted`. Keep every handler and aria-label untouched.
5. **Org cards**: top-org variant `bg-gradient-to-br from-accent-muted
   to-blush border-accent/25 hover:border-accent/50`; regular
   `bg-surface border-border hover:border-ink/20`; all `rounded-2xl
   shadow-petal`; org name `font-heading text-ink`; metadata
   `text-ink-muted`; merged/open counts `text-[#6f42c1]` / `text-[#1a7f37]`;
   language chips `text-ink-muted bg-ink/[0.04]`; expanded rows
   `bg-ink/[0.03] hover:bg-ink/[0.06]`, row text `text-ink-secondary`.
6. **PR cards**: `bg-surface border-border rounded-2xl shadow-petal
   hover:shadow-petal-lg hover:border-accent/40` (drop the dark radial
   overlay div and `backdrop-blur-xl`); title `font-semibold text-ink
   group-hover:text-accent` (font-body — data, not display); status chips →
   the light tints from the Palette spec; repo line `font-mono
   text-ink-muted`; description `text-ink-secondary`; +/- counts:
   `text-[#1a7f37] bg-green-700/10` and `text-[#cf222e] bg-red-700/10`;
   arrow chip `bg-ink/[0.04] text-ink-muted group-hover:bg-accent
   group-hover:text-white`; "Last updated" `text-ink-muted`; skeletons
   `bg-ink/[0.04] border-border`; error panel `bg-red-700/5
   border-red-700/25 text-[#cf222e]`.
7. **Stagger caps**: PR cards `delay: Math.min(index * 0.05, 0.4)`; org cards
   `delay: Math.min(index * 0.1, 0.4)`. Replace the two `duration-1000`
   reveal classes on this page with `duration-slow`.

**Verify**: `grep -rn "duration-1000\|text-white/\|bg-white/5\|bg-white/10\|border-white/" src/pages/PullRequests.tsx`
→ no matches (solid-fill `text-white` on accent/status buttons is allowed —
the grep above targets the opacity variants). Full gate passes; manual check:
filters work, org cards expand/collapse, everything readable on ivory.

### Phase G — Brand surfaces: lily favicon + OG card

1. **Favicon** — create `public/favicon.svg`, a minimal lily mark (keep
   under 1 KB):
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
     <rect width="64" height="64" rx="14" fill="#faf8f4"/>
     <path d="M32 46 C24 38 20 26 24 16 C30 22 33 30 32 40 Z" fill="#ffffff" stroke="#9aa89f" stroke-width="1.5"/>
     <path d="M32 46 C40 38 44 26 40 16 C34 22 31 30 32 40 Z" fill="#ffffff" stroke="#9aa89f" stroke-width="1.5"/>
     <path d="M32 46 C28 34 32 22 32 14 C32 22 36 34 32 46 Z" fill="#f4f6f4" stroke="#9aa89f" stroke-width="1"/>
     <circle cx="32" cy="20" r="2.4" fill="#a8821f"/>
     <path d="M32 46 C32 52 30 56 26 58" stroke="#3e7a52" stroke-width="2.5" stroke-linecap="round" fill="none"/>
   </svg>
   ```
2. **OG card** — create `scripts/og-template.html`: a self-contained
   1200×630 page using the same design language — the Phase A sky gradient,
   2–3 inline SVG lilies (reuse the Phase C `<defs>` vocabulary) rising from
   the bottom-left corner, `haroon0x` in Shippori Mincho (load the Phase A
   Google Fonts URL inside the template — it renders once at generation
   time), subtitle `AI/ML Engineer · Agents · Open Source` in Manrope
   `#46525c`, a short gold underline. Generate with the already-installed
   Playwright:
   ```bash
   npx playwright screenshot --viewport-size=1200,630 scripts/og-template.html public/og-card.png
   ```
3. **Wire `index.html`**:
   - `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
   - `og:image` + `twitter:image` → `https://haroon0x.onrender.com/og-card.png`
     (absolute; see STOP conditions about the canonical domain), plus
     `og:image:width` 1200 / `og:image:height` 630.
   - `grep -n "vite.svg" index.html` must come back empty afterwards.

**Verify**: `ls -la public/favicon.svg public/og-card.png` → both exist,
og-card.png > 10 KB. `npm run build && ls dist/favicon.svg dist/og-card.png`
→ present. Open `public/og-card.png` and confirm the text is not clipped.

### Phase H — Test reinforcement (`tests/ui.spec.ts`)

Add to the existing describe block, in the existing style:

1. **Mobile menu**:
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
2. **PR filter narrows the list**:
   ```ts
   test('PR status filter narrows the list', async ({ page }) => {
     await page.goto('/pull-requests');
     await page.getByRole('button', { name: /show merged pull requests/i }).click();
     const nonMergedChips = page.locator('a:has(h3) >> text=/^(Open|Closed)$/');
     await expect(nonMergedChips).toHaveCount(0);
   });
   ```
3. **Brand assets served**:
   ```ts
   test('favicon and og image are served', async ({ page }) => {
     expect((await page.request.get('/favicon.svg')).ok()).toBeTruthy();
     expect((await page.request.get('/og-card.png')).ok()).toBeTruthy();
   });
   ```
4. **Axe on `/pull-requests`**: replicate the home test's axe block
   (including the animation-disabling style tag) for the PR page — this is
   the machine gate for light-theme contrast.
5. **Reduced motion hides petals**: add a test with
   `page.emulateMedia({ reducedMotion: 'reduce' })` before `goto('/')`,
   asserting the petal layer is hidden — give the petal container
   `data-testid="petal-layer"` in `LilyGarden.tsx` and assert
   `await expect(page.getByTestId('petal-layer')).toBeHidden()`.

**Verify**: `npm run test:e2e` → all pass on both projects (mobile-menu test
skips on desktop).

### Phase I — Final gate & wrap-up

1. `npm run lint && npm run type-check && npm run build && npm run test:e2e` → all green.
2. Banned-pattern audit (all must return nothing):
   ```bash
   grep -rn "vite.svg" index.html
   grep -rn "5e6ad2\|00d9ff\|accent-glow" src/ tailwind.config.js
   grep -rn "blue-400\|blue-500\|cyan-400" src/
   grep -rn "zinc-900\|zinc-950\|bg-black" src/
   grep -rn "text-white/\|border-white/\|bg-white/5\|bg-white/10" src/
   grep -rn "rounded-3xl\|duration-1000" src/
   grep -rn "HandsBackground\|PageTransition\|useTheme\|ThemeProvider\|useAdvancedScrollAnimation" src/
   ```
   (`text-white` without an opacity suffix is allowed only on solid
   accent/status fills — spot-check those hits manually if the last grep
   variant flags them.)
3. Manual sweep in the dev server at 375 px, 768 px, 1440 px widths: garden
   never obscures content; tap targets ≥ 44 px (the CSS rule enforcing this
   survives); footer floor shows the lilies.
4. `git status` — no files outside the Scope list modified.
5. Update this plan's row in `plans/README.md` (and mark plan 001 REJECTED
   with rationale "operator chose 002 garden identity" if the operator
   confirmed that choice).

## Test plan

Phase H covers: mobile navigation, PR filtering, brand-asset serving, a
second axe scan (light-theme contrast gate), and a reduced-motion behavior
test for the petal layer. Existing tests (home heading, PR heading, 404)
remain the structural regression net — none of their selectors change.
Model new tests on the existing ones in `tests/ui.spec.ts`.

## Done criteria

ALL must hold:

- [ ] `npm run lint`, `npm run type-check`, `npm run build`, `npm run test:e2e` all exit 0
- [ ] All Phase I banned-pattern greps return zero matches
- [ ] `public/favicon.svg` + `public/og-card.png` exist and ship in `dist/`; no `vite.svg` references remain
- [ ] Axe: zero serious/critical violations on `/` and `/pull-requests` (light-theme contrast proven)
- [ ] `LilyGarden.tsx` exists; `HandsBackground.tsx`, `PageTransition.tsx`, and all theme-infra files deleted; hands image assets removed
- [ ] Petal layer hidden under reduced motion (test from Phase H passes)
- [ ] Hero has no mousemove listener and no spinning shapes (`grep -n "mousemove" src/components/Hero.tsx` → no matches)
- [ ] `git status` shows no modifications outside the Scope list
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `plans/README.md` shows plan 001 IN PROGRESS or DONE (mutually exclusive
  identities — the operator must choose).
- The drift check shows in-scope files changed and the "Current state"
  excerpts no longer match.
- You believe a new npm dependency is required for any step.
- The canonical production domain is not `https://haroon0x.onrender.com/`
  (the `public/_redirects` file is a Netlify convention, which conflicts
  with the onrender.com `og:url` at `index.html:18` — report instead of
  guessing the OG absolute URL).
- Any axe `color-contrast` violation persists after applying this plan's
  palette — report the element; do not mute the rule or darken tokens ad hoc.
- The lily-bed SVG or petal layer measurably degrades scroll performance on
  the Pixel 7 Playwright project (e2e timeouts, jank you can reproduce) —
  report; the fallback design (static bed, no petals) is an operator
  decision.
- Deleting the hands assets turns up a reference the Phase C grep missed.

## Maintenance notes

- **The palette is law.** Reviewers should reject any PR reintroducing
  white-opacity text, zinc surfaces, the old blurple, sub-AA contrast, or a
  second accent family. The Phase I greps are CI-able if drift appears.
- The lily bed and petals are hand-authored SVG in `LilyGarden.tsx` — they
  are design assets expressed as code. Edit placement/scale by eye in the
  dev server; never let a formatter mangle the path data.
- The OG card regenerates via `scripts/og-template.html` + the Playwright
  screenshot command whenever branding changes.
- Shippori Mincho adds one extra font family to the Google Fonts request;
  if font weight ever becomes a perf concern, subset to the used weights
  (500/600/700) — already done in the Phase A URL — or self-host later.
- If the owner later wants seasonal variation (e.g. autumn palette), it's a
  token swap plus petal-color change — the structure supports it; that's a
  new small plan, not an edit to this one.
- Deferred (tracked in `plans/audit-findings.md`): repo hygiene
  (`.gitattributes`, untracking `haroon-resume.html` + stray binaries),
  `npm audit fix`, `fetch-prs.cjs` concurrency + commit noise, webhook stub
  decision, runtime validation of `pr-data.json`.
