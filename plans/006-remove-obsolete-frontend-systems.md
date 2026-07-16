# Plan 006: Remove obsolete visual systems and continuous smooth scrolling

> **Executor instructions**: Execute each step and gate in order. Stop on any
> STOP condition. Do not add code comments. Do not modify or create test
> files. Preserve unrelated user changes. Update this plan's status in
> `plans/README.md` when complete unless a reviewer owns the index.
>
> **Drift check (run first)**:
> `git diff --stat 3decab9..HEAD -- src/App.tsx src/components src/contexts src/index.css package.json package-lock.json public`
> This plan assumes Plans 003-005 are complete. If they are not, stop.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/003-global-design-tokens.md`, `plans/005-editorial-pull-requests.md`
- **Category**: perf
- **Planned at**: commit `3decab9` plus working-tree redesign, 2026-07-16

## Why this matters

The working redesign stopped rendering three earlier background systems, but
their components and image assets remain tracked. Theme ripple state also
survived after the ripple UI was removed. Lenis runs a permanent animation
frame loop even though the site already enables native smooth scrolling and
has no gesture-driven interaction that requires a custom scroll engine.

Removing these paths makes the runtime and repository match the current
design. It reduces maintenance surface, removes a continuous main-thread loop,
and avoids carrying unused design experiments into future agent work.

## Current state

- `src/App.tsx:23-24` renders `<SmoothScroll />` and the new `.site-shell`.
- `src/components/SmoothScroll.tsx:10-27` creates Lenis and drives it from a
  continuous `requestAnimationFrame` loop.
- `package.json` lists `lenis` as a production dependency.
- `src/components/FlowField.tsx` is 234 lines and has no importers.
- `src/components/HandsBackground.tsx` is 106 lines and has no importers.
- `src/components/LilyGarden.tsx` is 47 lines and has no importers.
- `public/hands-960.webp`, `public/hands-1600.webp`, and
  `public/hands-high-res.jpg` support only HandsBackground and total roughly
  780 KB.
- `src/contexts/ThemeContext.tsx:5-16,36-48,74` retains `RippleState`,
  `ripple`, `onRippleDone`, and optional click coordinates.
- `src/components/ThemeToggle.tsx:11` calls `toggleTheme()` with no
  coordinates, so ripple state cannot become active.
- `src/index.css` contains helper rules such as `.safe-top`, `.fluid-section`,
  `.card-container`, and `.theme-transition`; their live usage must be
  rechecked after Plans 003-005.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Caller audit | `rg -n 'FlowField|HandsBackground|LilyGarden|SmoothScroll|lenis|ripple|onRippleDone' src package.json` | only expected definitions before deletion; no matches after |
| Asset audit | `rg -n 'hands-(960|1600|high-res)' . --glob '!plans/**' --glob '!dist/**' --glob '!node_modules/**'` | only HandsBackground before deletion; no matches after |
| Lint | `npm run lint` | exit 0, no errors |
| Typecheck | `npm run type-check` | exit 0 |
| Build | `npm run build` | exit 0 |

Do not modify or run tests as part of this plan.

## Scope

**In scope**:

- `src/App.tsx`
- `src/components/SmoothScroll.tsx` deletion
- `src/components/FlowField.tsx` deletion
- `src/components/HandsBackground.tsx` deletion
- `src/components/LilyGarden.tsx` deletion
- `src/components/ThemeToggle.tsx`
- `src/contexts/ThemeContext.tsx`
- `src/index.css`
- `public/hands-960.webp` deletion
- `public/hands-1600.webp` deletion
- `public/hands-high-res.jpg` deletion
- `package.json`
- `package-lock.json`
- `plans/README.md` status row only

**Out of scope**:

- `tests/`
- Current homepage/PR layout, copy, and motion components
- Framer Motion removal
- Theme removal; dark/light switching remains a supported feature
- Favicon, OG card, and PR data
- Any replacement background effect

## Git workflow

- Branch: `advisor/006-remove-obsolete-frontend-systems`
- Commit message: `refactor: remove obsolete visual systems`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Prove the old background components are unreachable

Run the Caller and Asset audit commands. Inspect every hit outside the
definition files. Delete FlowField, HandsBackground, LilyGarden, and the three
hands assets only if there are no live callers after Plans 003-005.

Do not delete a component based only on this plan's old evidence. The live
caller audit is the gate.

**Verify**: after deletion, both audit commands have no background/asset hits.

### Step 2: Remove Lenis and use native scrolling

Remove `<SmoothScroll />` and its import from `src/App.tsx`, then delete
`src/components/SmoothScroll.tsx`. Remove Lenis using the package manager so
both manifest and lockfile remain synchronized:

`npm uninstall lenis`

Preserve `scroll-behavior: smooth` in `src/index.css` and the existing
reduced-motion override that forces automatic scrolling. Do not add a native
scroll polyfill or custom animation loop.

**Verify**: `npm ls lenis` reports no installed project dependency and the
Caller audit has no SmoothScroll/lenis matches.

### Step 3: Reduce ThemeContext to the supported contract

Keep only:

- `theme`
- a zero-argument `toggleTheme`
- the existing localStorage persistence
- root theme-class updates
- theme-color meta updates
- system preference handling when no stored override exists

Remove `RippleState`, ripple state, `onRippleDone`, click coordinate
arguments, and the related callback. Change the context default to
`undefined` so the existing provider guard becomes meaningful, or otherwise
ensure `useTheme` throws when called outside ThemeProvider.

Update `ThemeToggle.tsx` only as required by the narrowed function type.
Preserve its visible design, aria-label, and icon animation.

**Verify**: `rg -n 'ripple|onRippleDone|clickX|clickY|RippleState' src` returns
no matches.

### Step 4: Remove CSS helpers with zero callers

For each of `.safe-top`, `.fluid-section`, `.card-container`,
`.theme-transition`, `.text-balance`, and `.text-pretty`, run an `rg` search
against `src` excluding `src/index.css`. Delete only definitions with zero
callers. Tailwind 3.4 already provides `text-balance` and `text-pretty`, so
their custom definitions may be deleted even when class names remain used.

Do not remove `.safe-x`, `.skip-link`, reduced-motion rules, focus styles,
selection, or scrollbar styling.

**Verify**: every removed custom selector either has no component caller or is
provided by Tailwind.

### Step 5: Validate the smaller runtime and repository

Run lint, typecheck, and build. Compare the build output with the audit
baseline: the initial build emitted a 25.87 KB raw shared app chunk and a
154.37 KB raw Framer Motion chunk. Framer remains; the shared app chunk should
not grow as a result of removing Lenis.

**Verify**:

- `npm run lint && npm run type-check && npm run build` exits 0.
- Caller and Asset audit commands return no obsolete-system matches.
- `git diff --name-only` contains only Scope files, pre-existing user changes,
  and plan files.

## Test plan

Do not create or modify tests. Verify by dependency/caller searches, strict
TypeScript, lint, production build, and manual native scrolling at desktop and
mobile widths if a browser is available.

## Done criteria

- [ ] Three unreachable background components and their hands assets are gone
- [ ] Lenis, SmoothScroll, and the permanent RAF loop are gone
- [ ] Native smooth scrolling still respects reduced motion
- [ ] ThemeContext exposes only active theme behaviour
- [ ] Unused custom CSS helpers are removed after caller verification
- [ ] Framer Motion and current entrance animations remain intact
- [ ] Lint, typecheck, and build exit 0
- [ ] No test file was modified
- [ ] `plans/README.md` status row is updated

## STOP conditions

Stop and report if:

- Plans 003-005 are incomplete.
- Any supposedly obsolete component or asset has a live caller.
- Native scrolling breaks required route/hash behavior from Plan 004.
- Removing Lenis changes another package unexpectedly beyond normal lockfile
  reconciliation.
- Theme ripple UI has reappeared or is called from another component.
- A test-file change appears necessary.
- Lint, typecheck, or build fails twice after a reasonable correction.

## Maintenance notes

- Keep background identity in CSS tokens and layout, not dormant competing
  canvas/SVG systems.
- Reintroduce a custom scroll engine only for a demonstrated interaction that
  native scrolling cannot support.
- ThemeContext should remain a small state boundary. Visual theme decisions
  belong in Plan 003's global token blocks.
