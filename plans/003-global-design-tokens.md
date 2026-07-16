# Plan 003: Make the visual system globally configurable

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If a STOP condition occurs, stop and report instead of
> improvising. Do not add code comments. Do not modify or create test files.
> When done, update this plan's status in `plans/README.md` unless a reviewer
> tells you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 3decab9..HEAD -- tailwind.config.js src/index.css src/App.tsx src/components src/pages src/contexts`
> This plan was written against commit `3decab9` plus the pre-existing
> uncommitted editorial redesign in `index.html`, `src/App.tsx`,
> `src/components/{Footer,Header,Hero,ThemeToggle,Work}.tsx`,
> `src/contexts/ThemeContext.tsx`, `src/index.css`, and `src/pages/Home.tsx`.
> Preserve those user changes. If the current files do not match the excerpts
> below, stop and report the drift.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `3decab9` plus working-tree redesign, 2026-07-16

## Why this matters

The site partly uses CSS variables, but components still contain literal
Tailwind palette choices such as `purple-400`, `green-300`, `red-200`, and
`text-white`. Surface-specific variables also duplicate the same decisions as
header, card, and footer tokens. This makes a palette change require edits in
many files and has already produced contrast failures between the dark and
light themes.

After this plan, `src/index.css` is the only place that defines palette,
corner style, and shadow character. `tailwind.config.js` maps semantic class
names to those variables once. Components consume only semantic names, so a
future redesign can change the global token block without hunting through
TSX files.

## Current state

- `src/index.css:5-70` defines separate dark/light variables. Examples:
  `--bg`, `--surface`, `--accent-rgb`, `--text-muted`, plus narrowly scoped
  duplicates including `--header-bg-*`, `--footer-bg`, and `--card-*`.
- `tailwind.config.js:5-45` maps those variables to Tailwind names. Several
  mappings are full colors rather than RGB channels, so opacity modifiers are
  not uniformly reliable.
- `src/pages/PullRequests.tsx:186-192,237-243,288-390,416-417` contains raw
  purple, green, and red utilities. The light theme therefore renders several
  pale status colors on a pale background.
- `src/components/Header.tsx:136` and several PR controls use `text-white` on
  `bg-accent`. In the dark theme, white on the current orange accent is only
  about 3.67:1.
- The current muted text contrast is about 4.05:1 in dark mode and 3.40:1 in
  light mode. Small labels in `Hero.tsx`, `Work.tsx`, and `Footer.tsx` use it.
- The current editorial homepage uses square controls and border-led sections,
  while legacy pages still hardcode `rounded-2xl` and `rounded-full`.

Repo conventions to preserve:

- React function components and strict TypeScript.
- Tailwind utilities remain inline in TSX; global base and token definitions
  remain in `src/index.css`.
- Theme switching continues to use `.theme-dark` and `.theme-light` on the
  root element.
- No new dependency and no new styling framework.

## Target token API

`src/index.css` must define RGB-channel variables in `.theme-dark` and
`.theme-light`. Use these exact semantic names:

```css
--color-bg
--color-surface
--color-surface-strong
--color-border
--color-border-strong
--color-text
--color-text-secondary
--color-text-muted
--color-accent
--color-accent-hover
--color-accent-muted
--color-on-accent
--color-status-open
--color-status-merged
--color-status-closed
--shadow-panel
--shadow-header
--radius-panel
--radius-control
```

Color variables must contain channels such as `11 11 10`, not a hex value or
an `rgb(...)` wrapper. This allows Tailwind opacity modifiers to work through
`rgb(var(--color-name) / <alpha-value>)`.

Move the existing `--font-heading` value out of the duplicated theme blocks
and define it once in `:root`. Typography is global and must not disappear
when the palette blocks are simplified. Focus, selection, and scrollbar rules
should derive from the core accent/background/surface tokens rather than
keeping separate palette aliases.

Keep the current warm black/ivory and orange identity. Adjust only the values
needed for readable normal text:

- Dark `--color-text-muted`: at least 4.5:1 against dark `--color-bg`.
- Light `--color-text-muted`: at least 4.5:1 against light `--color-bg`.
- Light `--color-accent`: at least 4.5:1 against light `--color-bg` when used
  as small link text.
- Dark `--color-on-accent`: use the dark background color.
- Light `--color-on-accent`: use white.
- Status colors must each meet 4.5:1 against their theme background when used
  as text. Their muted backgrounds are produced with opacity modifiers.
- `--radius-panel` and `--radius-control` default to the current square
  editorial treatment. Decorative circles may continue using `rounded-full`.

`tailwind.config.js` must expose only the semantic component-facing names:

```js
background
surface
surface-strong
border
border-strong
accent.DEFAULT
accent.hover
accent.muted
accent.foreground
text.primary
text.secondary
text.muted
status.open
status.merged
status.closed
```

It must also expose `rounded-panel`, `rounded-control`, `shadow-panel`, and
`shadow-header` through the corresponding Tailwind extensions. Remove the
old component-specific color names such as `header-bg-*`, `footer-bg`,
`card-bg`, `card-border-*`, `overlay`, and `divider` once all callers have
been migrated.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0; the pre-existing Fast Refresh warning is acceptable |
| Typecheck | `npm run type-check` | exit 0, no errors |
| Build | `npm run build` | exit 0 |
| Find raw TSX colors | `rg -n '#[0-9a-fA-F]{3,8}|(?:bg|text|border|from|to|via)-(?:red|green|purple|blue|cyan|zinc|stone|neutral|gray)-' src --glob '*.tsx'` | no styling hits |
| Find removed tokens | `rg -n 'header-bg|footer-bg|card-bg|card-border|overlay|divider' src tailwind.config.js` | no matches |

The repository's Playwright suite is not a gate for this plan. Its selectors
are already stale from the uncommitted redesign, and the operator has not
authorized test-file edits.

## Scope

**In scope**:

- `tailwind.config.js`
- `src/index.css`
- `src/App.tsx`
- `src/components/AppErrorBoundary.tsx`
- `src/components/Footer.tsx`
- `src/components/Header.tsx`
- `src/components/Hero.tsx`
- `src/components/ScrollProgress.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/Work.tsx`
- `src/pages/NotFound.tsx`
- `src/pages/PullRequests.tsx`
- `plans/README.md` status row only

**Out of scope**:

- `tests/`
- Component structure, copy, links, project data, and PR behavior
- `package.json`, `package-lock.json`, and all build configuration
- `public/pr-data.json`
- Background-component deletion; that belongs to Plan 006
- Route layout and navigation behavior; that belongs to Plan 004

## Git workflow

- Branch: `advisor/003-global-design-tokens`
- Commit message: `refactor: centralize visual design tokens`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Replace duplicated theme variables with the semantic token block

In `src/index.css`, replace the existing `.theme-dark` and `.theme-light`
palette variables with the Target token API. Preserve both themes, the warm
background identity, and existing base/accessibility rules. Update direct CSS
consumers such as `html`, `.site-shell`, selection, focus, and scrollbars to
use `rgb(var(--color-name))` or the corresponding semantic value.

Do not leave aliases from old names to new names. The objective is one set of
authoritative variables, not two naming systems layered together.

**Verify**: `rg -n -- '--header-|--footer-|--card-|--overlay|--divider' src/index.css`
returns no matches.

### Step 2: Make Tailwind a thin adapter over the global variables

Update `tailwind.config.js` to map the exact Target token API with
`rgb(var(...) / <alpha-value>)`. Map the two radius variables and two shadow
variables. Preserve the established font families, fluid type scale, duration
scale, easing, and spacing values unless a removed color mapping references
them.

Do not put palette literals in `tailwind.config.js`; palette values belong only
in `src/index.css`.

**Verify**: `rg -n '#[0-9a-fA-F]{3,8}|rgba?\(' tailwind.config.js` returns no
color-definition matches.

### Step 3: Migrate component surfaces and controls

Replace every removed component-specific token with the smallest matching
semantic token:

- Header backgrounds use `background` with opacity and `border`.
- Footer and generic panels use `surface`.
- Cards use `surface`, `border`, and `border-strong`.
- Primary controls use `bg-accent text-accent-foreground`.
- Panel and control shapes use `rounded-panel` and `rounded-control`.
- Existing decorative dots and genuinely circular icon buttons may retain
  `rounded-full`.

Do not change layout or component composition in this step.

**Verify**: `rg -n 'header-bg|footer-bg|card-bg|card-border|overlay|divider' src`
returns no matches.

### Step 4: Migrate status and error colors

In `src/pages/PullRequests.tsx` and `src/components/AppErrorBoundary.tsx`,
replace raw Tailwind palette utilities with `status-open`, `status-merged`,
and `status-closed`. Use opacity modifiers for muted status backgrounds and
borders. Selected filter/sort controls use the global accent rather than
inventing separate button foreground pairs for every status.

Replace all remaining `text-white` uses on accent backgrounds with
`text-accent-foreground`. Do not replace white used for unrelated content
unless the semantic token is clearly applicable.

**Verify**: run the raw-color search from the Commands table; it returns no
TSX styling hits.

### Step 5: Validate the complete token migration

Run lint, typecheck, and build. Inspect dark and light token blocks and confirm
that all required variables exist in both, with no theme-only omissions.

**Verify**:

- `npm run lint` exits 0 with no errors.
- `npm run type-check` exits 0.
- `npm run build` exits 0.
- `git diff --name-only` contains no file outside Scope, apart from the
  pre-existing user changes documented in the drift check and plan files.

## Test plan

Do not create or modify tests. Verification is lint, strict TypeScript, the
production build, the banned-pattern searches, and manual contrast inspection
in both themes. Updating the stale Playwright selectors requires separate,
explicit operator authorization.

## Done criteria

- [ ] Palette values exist only in the dark/light blocks in `src/index.css`
- [ ] Components contain no raw Tailwind hue families or hex color literals
- [ ] Tailwind exposes the documented semantic token API
- [ ] Old header/card/footer-specific token names have zero callers
- [ ] Small muted and accent text meet a 4.5:1 contrast target in both themes
- [ ] Accent-filled controls use the theme-specific on-accent token
- [ ] Panel/control radii and panel/header shadows are globally configurable
- [ ] Lint, typecheck, and build exit 0
- [ ] No test file was modified
- [ ] `plans/README.md` status row is updated

## STOP conditions

Stop and report if:

- The working-tree redesign no longer matches the Current state.
- A raw color appears necessary for product data rather than presentation.
- The migration appears to require a new styling dependency.
- A semantic token cannot support both themes without adding a new token;
  report the exact state and proposed token instead of adding it silently.
- Lint, typecheck, or build fails twice after a reasonable correction.
- Any test-file change appears necessary.

## Maintenance notes

- Future palette changes belong only in the two theme blocks in
  `src/index.css`.
- Future components must use semantic Tailwind names. Reviewers should reject
  raw hue utilities in TSX.
- Keep layout spacing local. This plan centralizes visual identity, not every
  one-off measurement.
- Plan 005 intentionally depends on this API and must not introduce new raw
  colors while rebuilding the PR page.
