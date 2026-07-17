# Portfolio Experience Audit and Improvement Roadmap

- Audited at commit: `35d3628`
- Audit date: 2026-07-17
- Scope: design, information architecture, frontend, routing, SEO/GEO,
  accessibility, performance, content, and maintainability
- Current quality bar: the organization → repository → individual pull request
  structure on `/pull-requests`

## Executive assessment

The Pull Requests page works because it has a real information architecture:
organization → repository → individual pull request. It gives visitors an
overview, lets them narrow the archive, preserves selections in the URL, and
survives a refresh.

The rest of the portfolio needs the same depth. The largest remaining weakness
is not the color palette or the amount of animation. Work, About, and Blog lack
the navigable structure and verifiable evidence that now make the Pull Requests
page effective.

The ASCII hero is already the site's strongest visual signature. The next
cycle should deepen the content underneath it instead of adding another
generative effect.

## Prioritized findings

| Priority | Area | Finding | Impact | Effort | Change risk | Confidence |
|---:|---|---|---|---|---|---|
| 1 | Work | Projects are summaries that immediately send visitors elsewhere | Very high | L | Medium | High |
| 2 | SEO/GEO | Generated HTML contains metadata but no meaningful page content | Very high | M–L | Medium | High |
| 3 | About | The section presents a quote instead of explaining the person | High | M | Low | High |
| 4 | Blog | A primary navigation destination currently advertises that nothing exists | High | M–L | Low | High |
| 5 | Routing | Route information is duplicated across at least seven files | High | M | Medium | High |
| 6 | Home | The hero is distinctive visually but generic in positioning | Medium–high | M | Low | High |
| 7 | Navigation | The interface does not indicate the current route or section | Medium | S | Low | High |
| 8 | Contact and domain | Generic conversion language and the Render subdomain weaken trust | Medium | S–M | Low | High |

## 1. Turn selected work into navigable case studies

### Current problem

`src/components/Work.tsx` contains useful Problem, System, and Engineering
Proof text for Wake AI, DeadDrop, and OutSync. However, the proof is presented
as assertion chips, and every project ultimately sends the visitor to GitHub or
an external demo.

The portfolio currently describes the work but does not let a visitor examine
it inside the portfolio.

### Recommended structure

Create internal, refresh-safe project routes:

- `/work/wake-ai`
- `/work/deaddrop`
- `/work/outsync`

The homepage Work section remains the project index. Each featured project
leads to an internal case study, with the external repository and demo retained
as supporting links.

Each case study should use a compact chapter navigator inspired by the
repository navigator on the Pull Requests page:

1. Overview
2. Problem
3. Architecture
4. Important decisions
5. Evidence
6. Limitations
7. What changed
8. Repository and demo

On desktop, the chapter navigator can remain sticky beside the case-study
content. On mobile, it should become a compact disclosure or select-like index.
The current chapter should be reflected in the URL hash so it can be shared and
restored on refresh.

### Visual direction

Use a real system schematic as the visual centerpiece of each case study:

- Wake AI: capture → exclusion and deduplication → Room/FTS/embeddings →
  hybrid retrieval → cited answer
- DeadDrop: browser inbox → hosted server ← outbound worker → local agent →
  logs and diff receipt
- OutSync: API → atomic data/outbox transaction → polling worker → Kafka

These diagrams should explain architecture rather than decorate the page. Use
the existing semantic colors, hairline borders, mono labels, and restrained
motion. They should render fully under reduced-motion preferences and include a
textual equivalent for assistive technology.

### Evidence requirements

Only publish evidence that can be traced to a project artifact:

- Real screenshots and demo recordings
- Real test or benchmark output
- Commit-linked implementation excerpts
- Architecture documents
- Security or privacy boundaries visible in code or documentation
- Honest limitations and unfinished work

Wake already documents its privacy rules, hybrid retrieval, local embedding
layer, and cited answers. DeadDrop already has a screenshot, demo recording,
security model, tests, deployment guide, and worker architecture. OutSync has a
documented transactional-outbox sequence, but its presentation needs stronger
visual and operational proof.

Project sources:

- <https://github.com/haroon0x/Wake-ai>
- <https://github.com/haroon0x/DeadDrop>
- <https://github.com/haroon0x/OutSync>

### Correction to the existing evidence plan

`plans/work-about-evidence-layer.md` correctly identifies that the Work section
contains claims without receipts. Its proposed console values must not be
implemented as written.

Examples such as `12,403 memories`, `41ms p95`, `1,204/1,204 published`, and
`280ms p99` are not established by the current project repositories. Rendering
them as terminal output would create fabricated evidence.

Replace the simulated console with captured, reproducible artifacts. If a
metric cannot be traced to a command, test fixture, benchmark definition, and
project revision, do not display it as fact.

### Correction to the existing visual plan

Keep the inline system schematics proposed in
`plans/work-about-visual-layer.md`. They explain the projects and reinforce the
site's systems-engineering identity.

Do not implement the 24-hour lifestyle dial without real data supplied by the
owner. Do not add the contribution heatmap, sticky card stack, animated
schematics, console typing, and project glyphs all at once. That density would
compete with the ASCII hero and turn evidence into spectacle.

The recommended visual package is:

- One architecture schematic per featured project
- One real artifact or screenshot per featured project
- A restrained chapter transition
- No additional ambient animation

## 2. Render meaningful HTML for SEO and GEO

### Current problem

The build creates route-specific titles, descriptions, canonical URLs, robots
directives, and JSON-LD. However, the generated Home, Blog, and Pull Requests
documents still contain an empty application mount:

```html
<div id="root"></div>
```

The visible content appears only after JavaScript loads and executes.
`scripts/generate-static-routes.cjs` changes metadata but does not render route
content.

This is weaker for search crawlers, AI retrieval systems, non-JavaScript
readers, and any service that does not fully execute the React application.

### Recommended outcome

Prerender meaningful HTML at build time for:

- Home
- Pull Requests
- Blog index
- Every blog article
- Every project case study
- The custom 404 document where the host supports it

The React application can hydrate afterward to preserve the ASCII field,
filters, theme toggle, and other interactions.

### Structured data

Generate route-specific structured data from the same content source:

- `ProfilePage` for Home
- `CollectionPage` plus `ItemList` for Pull Requests
- `SoftwareSourceCode`, `SoftwareApplication`, or `CreativeWork` for project
  case studies, selected according to the actual project
- `Blog` for the writing index
- `BlogPosting` for individual articles
- `BreadcrumbList` for project and article routes

Project and article content should also feed `sitemap.xml` and `llms.txt`.
Adding more generic metadata without prerendering the meaningful content is not
the priority.

## 3. Give the About section a subject

### Current problem

The current About section contains the Kobe Bryant quote, a résumé link, and an
open-source link. The quote is effective as a statement of attitude, but the
section does not explain who Muhammed Haroon is, what he builds, what he values,
or what he is currently doing.

### Recommended structure

Keep About on the homepage until its content genuinely requires a dedicated
route. Organize it into four beats:

1. A precise two-to-three-sentence biography
2. Current focus and availability
3. A compact chronological operating record
4. Working principles grounded in actual projects

Move the Kobe Bryant quote to the end as the emotional close. The section then
has a progression from person → work → method → motivation.

Avoid decorative personal analytics. A lifestyle dial, invented schedule, or
generic personality chart does not provide stronger evidence than a clear
biography and real project history.

## 4. Make Blog a real publishing surface

### Current problem

The header gives Blog the same prominence as Work and Pull Requests, but the
page's central message is `No published notes yet.` The route is truthfully set
to `noindex`, and the sitemap omits it.

A placeholder blog is less credible than no blog because it creates a visible
promise and immediately breaks it.

### Recommended launch

Either remove Blog from the primary navigation until an article exists, or
launch it with one serious, source-backed article. The preferred path is to
publish rather than remove it.

Strong initial topics already exist in the work:

1. Why Wake combines full-text search and local embeddings
2. How DeadDrop reaches a local coding agent without exposing the machine
3. Designing a contribution archive around organizations and repositories

### Initial feature scope

- Markdown-based source files
- `/blog/:slug` routes that survive direct navigation and refresh
- Title, description, publication date, and canonical URL
- A table of contents for long articles
- Cross-links to related projects and pull requests
- Previous and next article navigation after more than one article exists
- `BlogPosting` JSON-LD
- Sitemap entries
- RSS feed

Do not add tags, categories, recommendations, reactions, or a CMS before the
number of articles requires them.

## 5. Establish one route and content source

### Current problem

Adding one public route currently requires coordinated edits in:

- `src/App.tsx`
- `scripts/generate-static-routes.cjs`
- `render.yaml`
- `public/_redirects`
- `public/sitemap.xml`
- `public/llms.txt`
- `index.html`

Project content is separately embedded inside `src/components/Work.tsx`. This
creates drift between visible content, metadata, structured data, sitemap data,
and generated static routes.

### Recommended outcome

Create one typed route/content source that drives:

- React route definitions
- Route metadata
- Static output paths
- Canonical URLs
- Structured data
- Sitemap generation
- `llms.txt` generation or validation
- Project and article indexes

Render-specific rewrites can remain deployment configuration, but their paths
should be derived or verified against the same route list during the build.

This is the first implementation dependency because the project and article
routes will otherwise multiply the existing duplication.

## 6. Make the homepage positioning more specific

### Preserve

- The large interactive ASCII hand composition
- The global editorial palette
- The restrained mono labels
- The selected-work and open-source emphasis

### Improve

`Building ambitious systems, end to end` is visually strong but could describe
almost any experienced developer. The supporting copy should name the actual
territory of the work: private AI, local agents, open source, and reliable
backend infrastructure.

The availability indicator should explain what `Available` means. It should not
claim freelance, employment, consulting, or a date unless that status is true
and intentionally public.

### Strengthen the open-source bridge

The homepage proof strip currently shows four counters. Keep the totals, but
also identify a small selection of organizations such as Kubeflow, Google
DeepMind, mem0, or Supermemory, based on the current PR dataset.

Each organization name should deep-link to its existing URL-backed filter on
the Pull Requests page. This lets the homepage present recognizable evidence
and hands the visitor directly into the stronger archive experience.

## 7. Add navigation orientation

### Current problem

The header provides hover feedback but does not show the current route or
current homepage section. Internal mobile routes also use an external-link
arrow, which weakens the spatial model.

### Recommended changes

- Add `aria-current="page"` and a visual active state for Blog, Pull Requests,
  project routes, and article routes
- Track Work/About section visibility on Home and expose a restrained active
  state
- Add breadcrumbs below the global header on project and article pages
- Use internal-navigation arrow semantics for internal links
- Keep the existing Escape and outside-click mobile-menu behavior

## 8. Improve contact conversion and domain trust

### Contact

`Have something ambitious in mind?` is attractive but vague. Clarify the kinds
of conversations that are useful without inventing a service menu. For example,
the surrounding copy can reference product engineering, AI systems,
infrastructure, or open-source collaboration if those are genuinely in scope.

The public availability status and the footer should use the same wording and
source of truth.

### Domain

The current canonical origin is `https://haroon0x.onrender.com`. A custom
domain provides more trust and a more durable identity than another visual
effect.

Render static sites support custom domains and managed TLS. After a domain is
selected, update the single canonical-origin source and generate all route,
schema, sitemap, social-card, and `llms.txt` URLs from it.

Official Render documentation:

- <https://render.com/docs/static-sites>
- <https://render.com/docs/custom-domains>

### Visitor count

Do not prioritize a public all-time visitor counter. Google Analytics is already
loaded in `index.html`, so private traffic measurement exists. A visible
counter would require persistent storage or another external dependency while
providing weaker proof than projects and contributions.

Revisit a public counter only if it becomes part of an intentional live-signal
concept rather than a vanity statistic.

## Maintainability findings

`src/pages/PullRequests.tsx`, `src/components/AsciiHands.tsx`, and
`src/components/Work.tsx` are the largest frontend modules. File length alone is
not a reason to refactor them.

Recommended boundaries when the relevant surface is next changed:

- Pull Requests: organization map, repository index, controls, contribution
  row, and pure derivation helpers
- Work: typed project data, project index, featured case-study preview, archive
  row, and About section
- ASCII field: rendering math, lifecycle controller, and visual component only
  if performance profiling or future changes require it

Do not refactor the completed Pull Requests page or ASCII field solely to reduce
line count. Stabilize the new content and route system first.

## Performance and dependency assessment

The production build succeeds. Approximate compressed payload measurements from
the current build show that React and Framer Motion are the largest shared
chunks, but the total is acceptable for the current interactive portfolio.

The ASCII image is small, and the field already pauses idle work while offscreen
or while the document is hidden. Do not replace Framer Motion or rewrite the
ASCII field without a measured performance problem.

`npm audit` reports zero known vulnerabilities. Major React, React Router,
Tailwind, and Framer Motion migrations have no immediate product payoff and
should remain deferred.

## Verification baseline

Commands available in the repository:

```bash
npm run lint
npm run type-check
npm run build
npm run test:e2e
```

Audit verification performed:

- `npm run type-check`: passed
- `npm run build`: passed
- `npm run lint`: passed with one existing Fast Refresh warning in
  `src/contexts/ThemeContext.tsx`
- `npm audit`: zero vulnerabilities
- Test suite: not run, following the standing instruction not to run tests
  unless explicitly requested

Local screenshot inspection was blocked because the available Chromium binary
could not load a required system library. Responsive findings were therefore
vetted from the complete DOM, component layouts, responsive classes, and
generated production files rather than claimed as screenshot verification.

## Recommended implementation order

```text
Typed route/content source
    ├── Project case-study routes
    │     └── Homepage Work index and project cross-links
    ├── Blog article routes
    │     └── Blog index, RSS, and article cross-links
    └── Static prerendering
          ├── Structured data
          ├── Sitemap
          └── llms.txt

About content restructure
    └── Homepage positioning and proof bridge

Active navigation and breadcrumbs
    └── Contact consistency and custom domain migration
```

Recommended delivery batches:

1. Establish the typed route/content model.
2. Build Wake AI, DeadDrop, and OutSync case-study routes.
3. Replace the current About section structure.
4. Publish the first real article and article route.
5. Prerender all public content for SEO and GEO.
6. Tighten hero positioning and homepage organization proof.
7. Add active navigation and breadcrumbs.
8. Move canonical identity to a custom domain.

## Deliberately deferred or rejected

- More hero animation: the hero already has sufficient identity and motion.
- Fake terminal metrics: they would undermine the evidence-first direction.
- Lifestyle data visualization without real data: decorative fiction is not an
  About section.
- Contribution heatmap on Home: redundant with the stronger PR archive.
- Simultaneous card stacking, console typing, glyph scrambling, schematics, and
  ambient motion: too many competing ideas.
- Public visitor counter: low-value relative to unfinished project and writing
  content.
- React 19, React Router 7, Tailwind 4, or Framer Motion migrations: no immediate
  product return.
- Rewriting the completed PR or ASCII systems for file-size aesthetics: defer
  until real maintenance or performance evidence exists.

## Definition of success

The roadmap is complete when a visitor can:

- Understand the exact kinds of systems Haroon builds from the first viewport
- Enter a project from Home and explore its architecture, decisions, evidence,
  and limitations without leaving the portfolio
- Navigate directly to a case-study chapter and refresh without losing place
- Learn who Haroon is from the About section before encountering the quote
- Read at least one substantive, source-backed article
- Follow project ↔ article ↔ pull-request relationships
- Receive meaningful HTML content before JavaScript executes
- Understand the current route and move between related content
- Share any public route with correct canonical, social, and structured metadata
- Experience the same hierarchy and navigation on desktop and mobile
