# Plan 004: Make navigation global, accessible, and scroll-correct

> **Executor instructions**: Follow this plan in order. Run each verification
> command before continuing. Stop on any STOP condition; do not improvise. Do
> not add code comments. Do not modify or create test files. Preserve the
> user's pre-existing uncommitted redesign. Update the status row in
> `plans/README.md` when finished unless a reviewer owns the index.
>
> **Drift check (run first)**:
> `git diff --stat 3decab9..HEAD -- src/App.tsx src/pages/Home.tsx src/pages/PullRequests.tsx src/components/Header.tsx src/components/Footer.tsx`
> Compare the Current state excerpts below with the live files. This plan was
> written against commit `3decab9` plus the working-tree redesign. A mismatch
> is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/003-global-design-tokens.md`
- **Category**: bug
- **Planned at**: commit `3decab9` plus working-tree redesign, 2026-07-16

## Why this matters

The current header and footer render only on the home route. Pull Requests is
a visually and navigationally separate page with only a Back Home pill. Route
changes also have no scroll restoration, so navigating from the lower About
section can open another route at the old vertical offset.

The mobile menu compounds this by locking body scrolling like a modal while
remaining an ordinary disclosure with no modal semantics or focus isolation.
This plan creates one predictable site shell, corrects route/hash scrolling,
and makes the mobile menu a proper non-modal navigation disclosure.

## Current state

- `src/pages/Home.tsx:9-16` renders `<Header />`, `<main>`, and `<Footer />`.
- `src/App.tsx:29-34` renders route components directly. Pull Requests and the
  404 route therefore do not receive the shared header or footer.
- `src/components/Header.tsx:40-43` scrolls only to an element already in the
  current document. Work/About controls do nothing from another route.
- `src/components/Header.tsx:23-34` locks `document.body.style.overflow` while
  the mobile menu is open.
- `src/components/Header.tsx:105-143` renders the mobile panel as a generic
  `motion.div`, without focus management or outside-click handling.
- `src/App.tsx` has no location-aware scroll restoration.
- `src/pages/PullRequests.tsx:153` starts with a `<section>` and has no
  `main-content` target for the global skip link.
- `src/components/Footer.tsx:49-55` already has a functional Back to top
  control and should remain behaviorally unchanged.

Repo conventions to preserve:

- React Router remains `BrowserRouter`; do not migrate to a data router.
- Framer Motion remains available for mobile-menu enter/exit animation.
- Existing 44px touch targets, theme toggle, typography, and token classes
  remain.
- Keep the implementation small; do not add a navigation library.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0, no errors |
| Typecheck | `npm run type-check` | exit 0 |
| Build | `npm run build` | exit 0 |
| Header ownership | `rg -n '<Header|<Footer' src/pages src/App.tsx` | one Header and one Footer call, both in `App.tsx` |
| Body lock | `rg -n "body\.style\.overflow|aria-modal|role=\"dialog\"" src/components/Header.tsx` | no matches |

The current Playwright suite is not a gate because its mobile-menu selector
expects the superseded modal design. Do not update it without explicit test
authorization.

## Scope

**In scope**:

- `src/App.tsx`
- `src/pages/Home.tsx`
- `src/pages/PullRequests.tsx` only for its root landmark
- `src/components/Header.tsx`
- `src/components/Footer.tsx` only if composition requires an import change
- `plans/README.md` status row only

**Out of scope**:

- `tests/`
- Pull Requests page content and styling; Plan 005 owns it
- Theme behavior and design-token values
- New packages or router migration
- Page copy, external links, and project data
- Route metadata; Plan 007 owns it

## Git workflow

- Branch: `advisor/004-global-navigation-scroll`
- Commit message: `fix: unify navigation and route scrolling`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Move the shared shell to `App.tsx`

Import `Header` and `Footer` in `src/App.tsx`. Render them once around the
route/Suspense region inside `MotionConfig`, so Home, Pull Requests, and the
404 route share the same chrome. Keep the skip link before the visual shell.

Remove `Header` and `Footer` imports/usages from `src/pages/Home.tsx`; Home
should return only its existing `<main id="main-content">` containing Hero and
Work. Do not add another `<main>` in `App.tsx`, because each route owns its main
landmark.

Change only the root element of `src/pages/PullRequests.tsx` from `section` to
`main` and give it `id="main-content"`; preserve its contents for Plan 005.
`NotFound.tsx` already has the correct main landmark and needs no change.

**Verify**: run the Header ownership command. It reports exactly one Header
and one Footer usage in `src/App.tsx`.

### Step 2: Add route scroll restoration without changing routers

Inside `src/App.tsx`, add a small internal component using `useLocation` and
`useEffect`. On a pathname change with no hash, synchronously reset to the top
with non-animated `window.scrollTo`. It renders `null` and sits inside the
Router.

Hash scrolling is handled by Home after it mounts, because Home is lazy-loaded
and its target elements may not exist when the top-level location effect runs.
In `src/pages/Home.tsx`, use `useLocation` and an effect keyed by `hash`. When
the hash is `#hero`, `#work`, or `#about`, schedule one animation frame, locate
the matching element, and call `scrollIntoView`. Use `auto` for users who
prefer reduced motion and `smooth` otherwise. Cancel the scheduled frame on
cleanup.

Do not use timeouts, polling, or a third-party scroll-restoration package.

**Verify**: `rg -n 'setTimeout|setInterval' src/App.tsx src/pages/Home.tsx`
returns no matches.

### Step 3: Make header section navigation work from every route

Keep `scrollToSection` as the single handler in `Header.tsx`, but give it
router awareness with `useNavigate` and the existing `useLocation`:

- On `/`, scroll an existing target immediately and replace the URL hash.
- Off `/`, navigate to `/#<section>`; Home's mount effect performs the scroll.
- Close the mobile menu in both cases.
- The logo targets `hero`; Work and About target their existing IDs.

Do not cause a full document reload. Preserve the Pull Requests `Link`, email
CTA, theme toggle, and route prefetch behavior.

**Verify**: `rg -n 'window\.location|href="/#(hero|work|about)' src/components/Header.tsx`
returns no full-reload navigation implementation.

### Step 4: Convert the mobile menu to a non-modal disclosure

Remove body scroll locking. Keep Escape-to-close, but store a ref to the menu
button and return focus to it when Escape closes the panel. Add a ref covering
the header and a document-level pointer handler that closes the menu when a
pointer event starts outside that header. Clean up every listener.

The expanded panel must contain a semantic `<nav aria-label="Mobile navigation">`.
Do not use `role="dialog"`, `aria-modal`, a focus trap, or background inerting;
this is a compact navigation disclosure, not a modal. Preserve
`aria-expanded`, `aria-controls`, and the existing touch-target sizes.

Ensure clicking a menu destination closes the panel and route changes also
leave it closed.

**Verify**:

- The Body lock command returns no matches.
- `rg -n 'Mobile navigation|aria-expanded|aria-controls' src/components/Header.tsx`
  returns the disclosure semantics.

### Step 5: Validate direct, cross-route, and keyboard flows

Run lint, typecheck, and build. If a browser environment is available, verify
these exact flows at desktop and 375px widths:

1. Load `/`, scroll to About, open Pull Requests, and confirm the new route
   starts at the top.
2. From Pull Requests, select Work and confirm Home opens at `#work`.
3. Use Back/Forward and confirm routes do not retain unrelated scroll offsets.
4. Open the mobile menu with keyboard, press Escape, and confirm focus returns
   to the menu button.
5. Open the mobile menu and click outside the header; the menu closes.

**Verify**: `npm run lint && npm run type-check && npm run build` exits 0.

## Test plan

Do not create or modify tests. Use the existing static gates plus the five
manual browser flows. The stale mobile-menu Playwright assertion remains a
known, explicitly deferred finding until the operator authorizes test work.

## Done criteria

- [ ] Header and Footer render once from `App.tsx`
- [ ] Every route has shared navigation and footer chrome
- [ ] Each route owns exactly one `main-content` landmark
- [ ] Path changes without hashes reset to the top
- [ ] `/#hero`, `/#work`, and `/#about` work from every route
- [ ] Mobile navigation is a non-modal disclosure with no body lock
- [ ] Escape returns focus and outside pointer interaction closes the menu
- [ ] Lint, typecheck, and build exit 0
- [ ] No test file was modified
- [ ] `plans/README.md` status row is updated

## STOP conditions

Stop and report if:

- Plan 003 is not complete or its semantic token API differs from its plan.
- Shared Header/Footer rendering creates duplicate main landmarks.
- Hash targets are renamed or absent from Home.
- Correct scrolling appears to require replacing BrowserRouter or Lenis.
- A focus trap or modal package appears necessary; that means the disclosure
  design has drifted.
- A test-file change appears necessary.
- Lint, typecheck, or build fails twice after a reasonable correction.

## Maintenance notes

- Any new top-level route automatically receives the global header/footer and
  non-hash scroll reset.
- New home sections must be added to both the Header navigation data and
  Home's allowed hash targets.
- If a future menu becomes full-screen, treat that as a new modal design and
  implement complete dialog semantics rather than restoring body lock alone.
