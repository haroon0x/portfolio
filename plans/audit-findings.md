# Codebase Audit — Findings Report

- **Repo**: haroon0x-portfolio (React 18 + TypeScript + Vite 8 + Tailwind 3.4 + Framer Motion 11, static SPA)
- **Audited at**: commit `dbcfd78`, 2026-06-11
- **Effort level**: standard (full repo coverage — the repo is small enough that every source file was read directly; no subagents used)
- **Not audited locally**: build output and e2e runs (`node_modules` was not installed in the audit environment; CI runs lint, type-check, build, and Playwright e2e on every push/PR via `.github/workflows/frontend-quality.yml`)

## How the repo is verified

| Purpose | Command | Notes |
|---|---|---|
| Install | `npm ci` | Node 20 in CI |
| Lint | `npm run lint` | ESLint 9 flat config |
| Typecheck | `npm run type-check` | `tsc --noEmit` |
| Build | `npm run build` | Vite + terser, manual chunks |
| E2E + a11y | `npm run test:e2e` | Playwright, Chromium desktop + Pixel 7, axe-core scan on home |

A working verification baseline exists (good). All plans should use these commands as gates.

---

## Findings

### [CORRECTNESS-01] Favicon and social-card images point to a file that does not exist

- **Evidence**: `index.html:6` (`<link rel="icon" href="/vite.svg">`), `index.html:19` (`og:image` → `/vite.svg`), `index.html:25` (`twitter:image` → `/vite.svg`). `public/` contains no `vite.svg` (`ls public/` → `_redirects, hands-*.webp, hands-high-res.jpg, hands.png, pr-data.json`).
- **Impact**: Favicon 404s for every visitor. Every social/chat share of the portfolio renders with a broken or blank card — a direct hit to the site's entire purpose (being shared with recruiters/peers). Additionally `twitter:card` is `summary_large_image`, which requires an absolute URL to a raster image; an SVG would not work even if it existed.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Add a real favicon (SVG monogram + PNG fallback) and a 1200×630 raster OG card in `public/`; reference the OG image with an absolute URL. Folded into plan `001` (Phase G).

### [DEBT-01] `haroon-resume.html` is committed despite an explicit repo rule; stray binaries tracked

- **Evidence**: `Agents.md:1` — "Do not commit or add the resume html file". `.gitignore` final lines ignore `haroon-resume.html`, but `git ls-files` shows it tracked (gitignore does not untrack already-tracked files). Also tracked and referenced nowhere: `TrainLoop-11-27-2025_08_49_PM.png` (2.1 MB), `image.jpg` (16 KB), `public/hands.png` (16 KB, superseded by the webp/jpg variants).
- **Impact**: Stated repo policy is violated; 2.1 MB+ of junk ships in every clone; the resume remains in git history.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: `git rm --cached haroon-resume.html`, `git rm` the unreferenced binaries. Note: the file stays in git *history*; scrubbing history (e.g. `git filter-repo`) is a separate, riskier decision for the owner — the resume contains an email address but no phone number (checked).

### [DX-01] No `.gitattributes`; CRLF line endings poison every diff

- **Evidence**: All 47 tracked text files show as modified with `git diff --stat` reporting exactly 7892 insertions and 7892 deletions (pure line-ending churn). `file src/main.tsx` → "ASCII text, with CRLF line terminators". `git config core.autocrlf` is unset. Environment is WSL2.
- **Impact**: Real changes are invisible inside whole-file rewrites; every future PR diff is unreadable; blame history degrades.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Add `.gitattributes` with `* text=auto eol=lf` (binary exceptions for images), renormalize (`git add --renormalize .`), commit once. Do this **before** any other change lands, or every plan's diff will be polluted.

### [DEBT-02] Theme system is fully dead — visible toggle does nothing

- **Evidence**: `src/components/Header.tsx` renders a Sun/Moon toggle calling `toggleTheme`; `src/contexts/ThemeProvider.tsx` toggles a `dark` class on `<html>`; `index.html:49-59` has a theme bootstrap script. But `tailwind.config.js` has no `darkMode` setting, `grep -rn "dark:" src/` returns zero matches, and every component hardcodes dark colors (`bg-zinc-900/40`, `text-white`, …). Files involved: `src/contexts/ThemeContext.tsx`, `src/contexts/ThemeProvider.tsx`, `src/hooks/useTheme.tsx`.
- **Impact**: A visible UI control that visibly does nothing (only its own icon swaps) — broken UX; ~80 lines of dead infrastructure.
- **Effort**: S (remove) / M–L (actually implement a light theme) · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Remove the toggle, the three theme files, and the bootstrap script. Folded into plan `001` (Phase B). If the owner instead wants a real light theme, that is a separate plan.

### [SECURITY-01] Moderate dependency advisories with free fixes

- **Evidence**: `npm audit` → `react-router` 6.7.0–6.30.3 open-redirect via protocol-relative URL (GHSA-2j2x-hqr9-3h42, moderate; repo has `react-router-dom ^6.26.1`); `brace-expansion` ReDoS-class advisory in a dev-only lint dependency.
- **Impact**: Real exposure is low for a static portfolio (no auth, no redirect flows in app code), but the fix is `npm audit fix` within the v6 range — effectively free.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: `npm audit fix`, verify lint/type-check/build/e2e still pass.

### [CORRECTNESS-02] `fetch-prs.cjs` rate-limit delay is a no-op; all requests fire concurrently

- **Evidence**: `scripts/fetch-prs.cjs:86-90` — `Promise.all(prUrls.map(async (url) => { await new Promise(r => setTimeout(r, 150)); … }))`. Every mapped promise starts its 150 ms timer at the same time, so ~34 PR fetches (plus up to 34 language fetches) fire essentially simultaneously.
- **Impact**: The "Add delay between requests to avoid rate limiting" comment is false. In CI a token raises the limit so it works; a local tokenless run (60 req/hr) blows the limit and silently serves stale cached entries.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Sequential `for…of` loop with the delay between iterations (runtime ~10 s for 34 PRs — fine for a daily cron), or a small concurrency pool of 3–4.

### [DX-02] Daily cron commits "chore: update PR data" even when nothing changed

- **Evidence**: `scripts/fetch-prs.cjs:172` writes `lastUpdated: new Date().toISOString()` unconditionally, so `public/pr-data.json` always differs and `stefanzweifel/git-auto-commit-action` always commits. The last 11+ commits in `git log` are identical noise commits; `.github/workflows/fetch-prs.yml` also triggers on every push to main.
- **Impact**: Unreadable git history; a host rebuild is triggered daily for no content change.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Before writing, compare the new output (excluding `lastUpdated`) against the existing file; skip the write when equal. Optionally drop the `push:` trigger from the workflow.

### [PERF-01] Hero re-renders the whole component on every mousemove

- **Evidence**: `src/components/Hero.tsx:23-33` — a window `mousemove` listener calls `setMousePosition`, re-rendering the entire Hero (three infinite-animation motion divs plus all content) at pointer-move frequency. Same pattern at smaller scale in `src/components/Magnetic.tsx` (scoped to hover, acceptable).
- **Impact**: Continuous main-thread render churn on desktop whenever the cursor moves over the hero.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Replace state with framer-motion `useMotionValue` + `useSpring`/`useTransform` so pointer movement updates transforms without React re-renders. Folded into plan `001` (Phase D).

### [SECURITY-02] Webhook backend stub: unauthenticated, logs full payloads, consumed by nothing

- **Evidence**: `backend-webhoook/main.py:5-10` (directory name is typo'd) — a FastAPI `POST /github-webhook` endpoint with no `X-Hub-Signature-256` HMAC verification that `print`s the entire payload. No frontend code, workflow, or doc references it; `requirements.txt` is two lines.
- **Impact**: If ever deployed as-is: an unauthenticated endpoint accepting and logging arbitrary payloads. If never deployed: dead weight that confuses readers and agents.
- **Effort**: S (delete) · **Risk**: LOW · **Confidence**: HIGH (code), MED (deployment status unknown)
- **Fix sketch**: Delete the directory unless the owner wants the real-time-refresh feature (see Direction D3) — in which case it needs HMAC verification, no payload logging, and hosting.

### [DEBT-03] Dead code cluster

- **Evidence**: `src/hooks/useScrollAnimation.tsx:48+` — `useAdvancedScrollAnimation` exported, zero callers (`grep -rn useAdvancedScrollAnimation src` → definition only). `src/components/Work.tsx:15` — `Project.size` field set on all 7 projects, never read in render. `src/components/Work.tsx:18` — `order` prop: only `"all"` is ever passed (`src/pages/Home.tsx:11`), the `'latest'` branch is dead.
- **Impact**: Noise for readers and agents; implies features that don't exist.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Delete the unused hook, field, and prop branch.

### [CORRECTNESS-03] SmoothScroll passes legacy pre-1.0 Lenis options to lenis 1.3.x — INVESTIGATE

- **Evidence**: `src/components/SmoothScroll.tsx:10-20` passes `direction`, `gestureDirection`, `smooth`, `smoothTouch`, `mouseMultiplier` — option names from the pre-1.0 `@studio-freight/lenis` API. The installed `lenis@^1.3.14` uses `orientation`, `gestureOrientation`, `smoothWheel`, `syncTouch`, `wheelMultiplier`.
- **Impact**: The legacy options are likely silently ignored, so actual scroll behavior (especially touch) may differ from what the code expresses.
- **Effort**: S · **Risk**: LOW · **Confidence**: MED (CI type-check passes, so either the types permit excess props or behavior differs from intent — verify against the installed package)
- **Fix sketch**: Rewrite the options object using the lenis 1.x API. Folded into plan `001` (Phase C).

### [CORRECTNESS-04] Minor degrade-gracefully bugs

- **Evidence**:
  - `src/pages/PullRequests.tsx:59` — fetched JSON is cast `as PRData` with no runtime validation; an unexpected `status` value makes `statusOrder[a.status]` (`:133-135`) return `undefined` → NaN sort.
  - `src/pages/PullRequests.tsx:54-72` — fetch effect has no `AbortController`; `setState` can fire after unmount.
  - `src/components/HandsBackground.tsx:18-21,47-51` — under `prefers-reduced-motion`, `drawGrid` runs once; any window resize resets the canvas (clearing it) and the grid never redraws.
  - `src/components/Hero.tsx:166` — `exit` prop on `motion.p` without an `AnimatePresence` wrapper; the exit animation never runs.
- **Impact**: All minor; site degrades gracefully. The data source is the repo's own CI-generated JSON, so the validation gap is theoretical.
- **Effort**: S · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: The HandsBackground and Hero items are folded into plan `001` (Phases C–D). The JSON-validation and abort items are cheap standalone fixes.

### [TESTS-01] E2E baseline exists but thin

- **Evidence**: `tests/ui.spec.ts` — 3 tests (home render + axe serious/critical filter, PR page heading, 404 page) across two viewport projects. No coverage of: mobile menu, PR filters/sorting, error state, `scripts/fetch-prs.cjs` (zero tests).
- **Impact**: UI refactors (e.g. the redesign in plan 001) have limited regression protection.
- **Effort**: M · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Extend `tests/ui.spec.ts` with mobile-nav and PR-page interaction tests (plan 001 Phase H adds some); script tests are lower priority.

### [CSS-01] Stylesheet debt (feeds plan 001)

- **Evidence** (all `src/index.css`):
  - `:11-13` — `body` gets `@apply bg-background` (#050505 from Tailwind config) **and** a hardcoded `background-color: #0a0a0a` override: two competing blacks.
  - `:6-9` — `--background`/`--foreground` CSS variables defined, used nowhere.
  - `:53-63` — `.text-gradient` and `.gradient-text` are identical duplicates; `.glass-panel` (`:49`) and `.glass` (`:192`) are near-duplicates.
  - `:73-97` — hand-rolled `line-clamp-*`, `text-balance`, `text-pretty`, `tabular-nums` utilities that Tailwind 3.4 ships natively.
  - `:180-184` — global focus outline is cyan `#00d9ff`, a third accent alongside the blurple `#5e6ad2` token and the `blue-400`/`cyan-400` gradients used in `ScrollProgress.tsx`/`Footer.tsx`.
  - `:16` — "Hide default cursor" comment with no implementation.
- **Impact**: Three competing accent systems and two background blacks make visual coherence impossible; duplicate utilities invite drift.
- **Effort**: S–M · **Risk**: LOW · **Confidence**: HIGH
- **Fix sketch**: Single token source in `tailwind.config.js`, delete duplicates/dead rules. This is Phase A of plan `001`.

---

## Direction findings (options, not defects)

### [DIRECTION-01] Auto-discover PRs via the GitHub Search API

- **Evidence**: `scripts/fetch-prs.cjs:4-39` — 34 hardcoded PR URLs requiring a manual edit for every new contribution; a daily-cron workflow already exists to refresh data.
- **Impact**: Eliminates the ongoing maintenance tax forever; new contributions appear automatically (search `type:pr author:haroon0x is:public` + an exclude list).
- **Trade-offs**: Needs noise control (exclude list for trivial/own-repo PRs), pagination, and the search API has its own rate limits. Effort ~M (coarse).

### [DIRECTION-02] Proper OG share card

- **Evidence**: see CORRECTNESS-01; the portfolio's highest-value pixel for its audience (recruiters) is the share card.
- **Impact**: Every link share becomes a branded asset instead of a blank card.
- **Trade-offs**: Asset needs regenerating when branding changes. Effort S–M. **Selected — folded into plan 001 Phase G.**

### [DIRECTION-03] Webhook backend: finish or kill

- **Evidence**: `backend-webhoook/` stub (SECURITY-02); its evident intent is GitHub webhook → real-time PR refresh, replacing the daily cron.
- **Impact**: Near-real-time PR data instead of daily.
- **Trade-offs**: Requires hosting, HMAC verification, and a trigger path into the static-site build. The cron already works. Honest recommendation: delete the stub. Effort M (coarse) to finish; S to kill.

---

## Considered and rejected

- **React 19 / Tailwind 4 major migrations**: cost exceeds payoff for a working static portfolio right now; revisit when a dependency forces it.
- **`vite.config.ts` dev-server `Cache-Control: max-age=31536000` header**: dev-only oddity (production headers come from the host); harmless.
- **README project-list drift** (README features 4 projects, site shows 7): trivial; fix opportunistically.

## Status of findings → plans

Only plan `001` (aesthetic/UX redesign, absorbing CORRECTNESS-01, DEBT-02, PERF-01, CORRECTNESS-03/04-partial, CSS-01, DIRECTION-02) has been written, per owner request. The remaining findings (DEBT-01, DX-01, SECURITY-01, CORRECTNESS-02, DX-02, SECURITY-02, DEBT-03, TESTS-01, DIRECTION-01/03) are backlog — ask for plans as needed. **Recommendation: land DX-01 (.gitattributes) and DEBT-01 (untrack files) before plan 001, or its diff will be buried in line-ending churn.**
