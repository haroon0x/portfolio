# Plan 005: Rebuild Pull Requests in the editorial site language

> **Executor instructions**: Follow the plan in order and run every gate. Stop
> on any STOP condition. Do not add code comments. Do not modify or create
> test files. Preserve the user's working-tree redesign and use only the
> semantic tokens established by Plan 003. Update the status row in
> `plans/README.md` when finished unless a reviewer owns the index.
>
> **Drift check (run first)**:
> `git diff --stat 3decab9..HEAD -- src/pages/PullRequests.tsx src/components/Magnetic.tsx src/hooks/useScrollAnimation.tsx`
> Compare the Current state below with the live code. This plan assumes Plans
> 003 and 004 have landed. If they have not, stop.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/003-global-design-tokens.md`, `plans/004-global-navigation-scroll.md`
- **Category**: direction
- **Planned at**: commit `3decab9` plus working-tree redesign, 2026-07-16

## Why this matters

The homepage now has a restrained editorial identity: large type, sharp
borders, compact mono labels, and project rows. Pull Requests still presents
the same data through rounded glass cards, gradients, colorful pills, a
magnetic Back Home control, and expandable organization cards that duplicate
the main PR list. The route feels like a separate template and takes too long
to scan.

This plan turns it into a credible evidence page rather than a dashboard. It
keeps all useful PR data and filter/sort behavior, removes duplicated views,
and makes every selected sort behave exactly as labelled.

## Current state

- `src/pages/PullRequests.tsx` is 436 lines and owns fetching, organization
  aggregation, filtering, sorting, and the full UI.
- `PullRequests.tsx:71-96` derives organization cards from every PR.
- `PullRequests.tsx:98-108` maintains expanded-organization state.
- `PullRequests.tsx:119-137` always pins `isTopRepo` entries before applying
  the selected status/date/repo sort, so the requested ordering is not global.
- `PullRequests.tsx:179-274` renders stats and expandable organization cards.
  Expanded cards repeat PR links that appear again in the main grid.
- `PullRequests.tsx:276-353` renders a rounded two-part toolbar.
- `PullRequests.tsx:371-428` renders all PRs as two-column rounded cards.
- The page title is an `h2`, despite being the route's primary heading.
- `Magnetic.tsx` is used only for the Back Home control on this page.
- `useScrollAnimation.tsx` is used only to reveal this page.
- `public/pr-data.json` currently contains 36 PRs. Its public shape is the
  existing `PRData` interface and must not change in this plan.

Homepage conventions to match:

- `src/components/Hero.tsx`: mono uppercase eyebrow, large tight heading,
  sharp dividers, restrained accent.
- `src/components/Work.tsx:64-85`: wide `max-w-[96rem]` container and a
  border-led list.
- `src/components/Work.tsx:126-167`: desktop grid rows that stack naturally
  on mobile.
- Use only Plan 003 semantic tokens. No raw hue utilities or color literals.

## Target page structure

The route must contain one `<main id="main-content">` with this order:

1. Editorial page header: eyebrow, `h1`, concise description.
2. Flat four-cell evidence strip using the existing total, merged, open, and
   additions values.
3. A compact results toolbar with filter and sort controls.
4. A bordered single-column PR list.
5. Loading, error, and zero-result states that occupy the list region.

Remove organization cards and their duplicated PR links entirely. Do not
replace them with tabs, accordions, charts, logos, or another view mode.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0, no errors |
| Typecheck | `npm run type-check` | exit 0 |
| Build | `npm run build` | exit 0 |
| Removed organization UI | `rg -n 'OrgStats|orgStats|expandedOrgs|toggleOrg|topOrgs|Building2' src/pages/PullRequests.tsx` | no matches |
| Removed legacy visual language | `rg -n 'rounded-2xl|bg-gradient|backdrop-blur|Magnetic|useScrollAnimation' src/pages/PullRequests.tsx` | no matches |
| Raw colors | `rg -n '#[0-9a-fA-F]{3,8}|(?:bg|text|border|from|to|via)-(?:red|green|purple|blue|cyan|zinc|stone|neutral|gray)-' src/pages/PullRequests.tsx` | no matches |

Do not run or modify the stale Playwright suite as part of this plan.

## Scope

**In scope**:

- `src/pages/PullRequests.tsx`
- `src/components/Magnetic.tsx` deletion, after confirming zero callers
- `src/hooks/useScrollAnimation.tsx` deletion, after confirming zero callers
- `plans/README.md` status row only

**Out of scope**:

- `tests/`
- `public/pr-data.json`
- `scripts/fetch-prs.cjs` and its data schema
- Header, Footer, Home, and route-shell structure
- New filters, search, pagination, charts, organization logos, or view modes
- New dependencies
- Project-page or case-study work

## Git workflow

- Branch: `advisor/005-editorial-pull-requests`
- Commit message: `refactor: simplify pull request showcase`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Reduce state and derived data to the actual page controls

Remove `OrgStats`, `topOrgs`, `expandedOrgs`, `toggleOrg`, organization
aggregation, and the `Building2` import. Keep the existing `PullRequest` and
`PRData` interfaces unchanged.

Use `useMemo` for the displayed list, keyed by `data`, `filterStatus`,
`sortBy`, and `sortOrder`:

- Apply the selected status filter first.
- Apply exactly one selected sort second.
- Do not pre-pin `isTopRepo` entries.
- Status ordering remains Merged, Open, Closed in descending mode and reverses
  in ascending mode.
- Date and repository sorting retain the existing behaviour.

Keep only the existing `all`, `merged`, and `open` filters. Do not invent a
new Closed filter in this redesign.

Add `aria-pressed` to filter and sort buttons so selected state is exposed
semantically, not only by color.

**Verify**: the Removed organization UI command returns no matches.

### Step 2: Make data loading safe without changing the data contract

Keep client-side fetching from `/pr-data.json`. Add an `AbortController` to
the effect, pass its signal to `fetch`, and abort on cleanup. Do not set error
or loading state after an abort. Preserve the current user-facing failure
message and the `PRData` shape.

Do not add a validation dependency or change the generation script in this
plan.

**Verify**: `rg -n 'AbortController|signal|abort\(' src/pages/PullRequests.tsx`
returns the controller, fetch signal, and cleanup call.

### Step 3: Build the editorial header and evidence strip

Replace the Back Home pill and legacy heading block. The global header from
Plan 004 provides navigation.

Use the same max-width, safe horizontal padding, mono eyebrow, heading
tracking, and border rhythm as `Work.tsx`. The route title must be an `h1`
reading `Open source contributions`. Keep the existing explanatory copy or
tighten it without adding unverifiable claims.

Render total PRs, merged PRs, open PRs, and lines added as a four-cell strip
separated by borders. It stacks as two columns on narrow screens and four on
desktop. Use semantic text/status tokens from Plan 003 and no filled cards.

The evidence strip always describes the complete dataset. Label the results
count beside the toolbar so filtering is not confused with the global totals.

**Verify**: `rg -n '<h1|<h2' src/pages/PullRequests.tsx` shows one route `h1`
and a subordinate results heading only if one is needed.

### Step 4: Replace the dashboard toolbar with compact editorial controls

Place Filter and Sort controls in one border-y toolbar. Controls use
`rounded-control`, semantic borders, and the global accent for selected state.
Avoid filled semantic status colors on filter buttons; the PR rows themselves
carry status meaning.

Keep all existing handlers and visible counts. On mobile, allow controls to
wrap without horizontal scrolling. Display `<shown count> of <total> pull
requests` in a small `aria-live="polite"` result summary so state changes are
announced.

**Verify**: every filter/sort button has an `aria-label` and `aria-pressed`.

### Step 5: Replace cards with one scan-friendly list

Render the displayed PRs as a semantic list with one external link per row.
Use borders instead of card containers. Match the ProjectRow responsive
pattern:

- Desktop: status/date column, repository/title/description column,
  additions/deletions/languages column, arrow affordance.
- Mobile: natural vertical stack with the title first after compact status
  metadata.
- Preserve title, repository, status, date, description, additions,
  deletions, languages, target URL, `target="_blank"`, and
  `rel="noopener noreferrer"`.
- Status uses `status-open`, `status-merged`, or `status-closed` text with a
  subtle opacity-derived background or marker.
- Hover may add `bg-surface`; do not add gradients, blur, scale-down press
  effects, or rounded cards.
- If Framer entrance motion remains, cap all row delays at 0.2 seconds.

When the filtered list is empty, show a bordered zero-result row with a button
that resets the filter to All. Loading uses border-led skeleton rows. Error
uses the semantic closed/error color and remains readable in both themes.

**Verify**: run the Removed legacy visual language and Raw colors commands;
both return no matches.

### Step 6: Delete helpers made obsolete by the rewrite

Run:

- `rg -n 'Magnetic' src`
- `rg -n 'useScrollAnimation' src`

If each search returns only its definition file, delete
`src/components/Magnetic.tsx` and `src/hooks/useScrollAnimation.tsx`. If any
other caller exists, preserve that file and report the caller in the final
handoff.

**Verify**: repeat both searches; they return no matches if the files were
deleted.

### Step 7: Validate behaviour and responsive hierarchy

Run lint, typecheck, and build. If a browser is available, check dark and light
themes at 375px, 768px, and 1440px:

1. Page begins below the global header and has one visible h1.
2. Every filter changes only the list and updates the result count.
3. Every sort globally orders the entire visible result set.
4. Zero-result, loading, and error layouts do not collapse the page.
5. Long repository/title/description values do not cause horizontal overflow.
6. Status colors are readable in both themes.

**Verify**: `npm run lint && npm run type-check && npm run build` exits 0.

## Test plan

Do not create or modify tests. Verify with strict TypeScript, production build,
banned-pattern searches, and the six manual browser checks. Existing stale
tests are deferred until explicitly authorized.

## Done criteria

- [ ] Pull Requests uses the same editorial token and layout language as Home
- [ ] The page has one h1 and no duplicate organization-card view
- [ ] Filters and sorts expose selected state with `aria-pressed`
- [ ] Selected sorts order the complete visible list without feature pinning
- [ ] A polite result count and explicit empty state exist
- [ ] Loading and error states match the border-led layout
- [ ] No raw hue utilities, gradients, blur cards, or rounded legacy panels remain
- [ ] Obsolete Magnetic/scroll helper files are deleted if caller-free
- [ ] Lint, typecheck, and build exit 0
- [ ] No test file was modified
- [ ] `plans/README.md` status row is updated

## STOP conditions

Stop and report if:

- Plans 003 or 004 are incomplete.
- `PRData` differs from the Current state or requires a generator/schema edit.
- Removing organizations would discard data that exists nowhere in each PR
  record.
- A new dependency or new view mode seems necessary.
- Another component still calls Magnetic or `useScrollAnimation`.
- A test-file change appears necessary.
- Lint, typecheck, or build fails twice after a reasonable correction.

## Maintenance notes

- `public/pr-data.json` remains the source of truth; this route only presents
  it.
- Future sorting must remain exact. If featured PRs are wanted later, add an
  explicit Featured control instead of silently overriding every sort.
- Do not restore organization cards unless the product goal changes; they
  duplicated the primary list and weakened scanning.
- A future PR-discovery plan must preserve this page's existing data contract
  unless a separate schema change is explicitly approved.
