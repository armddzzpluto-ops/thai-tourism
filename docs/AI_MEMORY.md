# AI Memory

## Project identity
- Project: Thailand Travel Guide 2026
- Type: Static bilingual SPA
- Production branch: `main`
- Current architecture policy: shell + modules + single-source data/translations
- Destination detail policy: generate all `destinations/<province-slug>/` pages and `sitemap.xml` from shared data with `npm run build:destinations`

## Current production status
- Seven routes: Home, Destinations, Promotions, Gallery, Dashboard, About and Contact
- Thai/English live switching covers static UI, shared data, open overlays and accessibility attributes
- Shared destination source contains all 77 provinces
- Gallery uses destination-owned image records; curated provinces require at least three verified gallery images
- Light/Dark mode, history navigation, responsive layouts and keyboard interactions are active
- Static GitHub Actions checks and pinned CodeQL JavaScript/TypeScript scanning are active
- Playwright coverage is the required browser regression layer
- All 77 destination cards have pre-rendered, shareable detail URLs with canonical and structured metadata
- Working tree cleanup reduced tracked content from about 290 MB to 72 MB without removing runtime-referenced assets
- Home, Destinations, Promotions, Gallery and Modal resolve destination identity, names and images from `window.DESTINATIONS`
- Dashboard displays dataset coverage computed from live destination/gallery records; it does not claim tourism totals
- Fabricated weather, traveler reviews, prices, ratings, people and contact channels have been removed
- Province and attraction records are separate; 5/77 provinces currently have one sourced attraction record and all others expose an honest pending-verification state
- The legacy Promotions route now hosts a user-input trip budget calculator; sample packages and provider-style prices have been removed
- The Destinations route can filter the existing local favorites list, updates saved counts live and provides bilingual empty states
- A project-local maintainer skill and `npm run verify` encode the repository workflow for compatible AI agents and contributors
- The repository README presents the live site, real responsive screenshots, architecture, verification workflow and honest 5/77 attraction-verification status
- Light and Dark Mode now share one emerald-and-temple-gold identity; Dark Mode uses deep emerald ink surfaces and warm readable foregrounds instead of the former blue/navy remap
- Light Mode uses a warm cream canvas, softly raised cards and visible warm-gray borders so boundaries remain legible on bright displays
- Shared Light/Dark ambient gradients, squircle icon containers and reusable detail-card layouts now provide consistent background depth, alignment and micro-spacing across Home and About content
- Home hero metrics now come from the live province, verified-attraction and gallery datasets; unsupported tourism totals are blocked by the structural audit
- Destination, gallery and article overlays share accessible dialog state, keyboard focus containment, Escape-to-close and focus restoration
- The Home Hero uses the sharper existing Chiang Mai landscape through one shared image token, with theme-safe scrims and a seamless transition into the first content surface
- Buttons now follow one control hierarchy: 12px squircle actions, pill filters/chips and accessible 44px squircle icon-only targets with stable hover/focus feedback
- The decorative full-screen loader has been removed so no optional script, image or load event can block access to SPA routes
- Route headings render synchronously instead of depending on IntersectionObserver state from pages that begin hidden
- Non-Home routes no longer draw the detached green-gold pseudo-element that resembled a stuck loading bar
- User-facing operating-system Emoji have been replaced by the existing Font Awesome icon system across the SPA shell, dynamic favorites and all generated destination pages
- The backward-compatible `#promotions` route now combines a local bilingual Smart Trip Assistant with the existing budget calculator; it parses region, days, interests and budget without an external AI API
- The exact Northeast five-day request resolves to a dated TAT-sourced Buri Ram–Si Sa Ket–Ubon Ratchathani itinerary, while other requests stay at province level unless attraction data is source-verified
- Smart Trip Assistant duration parsing now recognizes Thai and English day phrases including hyphenated English forms such as "5-day" and preserves explicit day counts instead of defaulting to three days
- Route-critical hero and planner controls now render immediately, theme changes apply atomically, and semantic classes replace the remaining SPA inline presentation styles
- CDN-hosted Font Awesome, SweetAlert2 and Chart.js bytes are version-pinned with reviewed SRI; persisted recent searches and manual memory-workflow inputs are treated as untrusted text
- The Home Hero uses a landmark-safe editorial split on wide screens, icon-backed live coverage metrics and a simpler responsive fallback without duplicating data claims
- Wikimedia gallery captions are normalized to bounded plain text, image paths are locally allowlisted and both SPA gallery renderers contextually escape metadata before `innerHTML`
- Persisted search history and quote indexes are size/type bounded, and all GitHub Actions run from reviewed immutable commit SHAs
- The PR #41 showcase override layer was removed after matched visual QA found oversized route-title surfaces and avoidable first-viewport whitespace; the established compact route hierarchy is guarded by static and browser checks
- Smart Trip Assistant controls remain before generated results in document order, including on mobile, while the bilingual duration parser continues to recognize forms such as `5-day`
- The footer exposes one verified bilingual GitHub source link instead of non-functional social placeholders

## Source-of-truth map
- `AGENTS.md`: agent rules and definition of done
- `js/data.js`: destinations and shared content
- `js/translations.js`: Thai/English copy
- `js/i18n.js`: language state/runtime
- `js/app.js`: core SPA behavior
- `tests/site.spec.js`: browser acceptance tests

## Current priorities
1. Keep all 77 destination/gallery records accurate and attributed.
2. Verify official websites, maps, coordinates and attraction-level content.
3. Continue modularization without changing public selectors or behavior.
4. Improve performance and local asset coverage.

## Known acceptable English in Thai mode
- Personal names and brand names
- Email addresses and social-network names
- Units and technology names such as HTML, CSS, JavaScript and Chart.js

## Definition of done
- Static audit passes
- Playwright passes on Desktop, Notebook, Tablet and Mobile
- No console errors or failed local requests
- Thai/English and Light/Dark verified
- Direct URL, refresh and back/forward verified
- Mouse, touch and keyboard verified
- Memory, TODO and changelog updated for completed phases
- No checkpoints, terminal probes, retired bundles, raw province JPGs or orphan extended-gallery assets

## Automated Phase Log
- 2026-09-02 · Visual hierarchy recovery and delivery hardening · Removed the oversized PR #41 showcase layer, retained its independent parser fix, restored mobile planning continuity, replaced placeholder social links, removed dead UI selectors and added pinned CodeQL scanning; 108 browser checks passed
- 2026-09-01 · Bilingual trip duration parsing fix · Resolved English hyphenated day parsing (for example "5-day"), preserved Thai duration parsing, and added browser regressions for day parsing and budget boundary safety
- 2026-08-22 · Cinematic Home composition · Reframed the Chiang Mai Hero, live metric panel and search/category transition for a richer but responsive first impression
- 2026-08-22 · Gallery and workflow trust boundaries · Kept external image metadata inert, bounded persisted UI state and pinned GitHub Actions to immutable commits
- 2026-08-22 · Visual consistency and trust hardening · Removed remaining inline presentation styles, tightened critical rendering and bilingual headings, pinned CDN assets with SRI, and hardened persisted/workflow inputs
- 2026-08-17 · Local Smart Trip Assistant · Added safe bilingual text-to-itinerary planning, an official-source Northeast five-day route and budget handoff without a backend or external AI API
- 2026-08-17 · Site-wide icon consistency · Unified brand, navigation, category, search, favorite and footer symbols with responsive bilingual regression coverage
- 2026-08-17 · Orphan page accent removal · Removed the detached route pseudo-element and locked its absence with structural/browser checks
- 2026-08-17 · Route header visibility · Removed animation gating from every route-critical heading so direct links and SPA navigation cannot leave an orphan accent line
- 2026-08-17 · Loader deadlock prevention · Removed the decorative full-screen loader and added structural/browser guards so every route remains immediately accessible
- 2026-08-16 · Button and icon control consistency · Normalized shared button geometry, icon targets and interaction feedback across Light/Dark and responsive layouts
- 2026-08-16 · Homepage visual depth and Hero clarity · Replaced the compressed Hero source, consolidated its art direction and removed the fixed first-viewport background seam
- 2026-08-15 · Runtime trust and dialog consistency · Replaced unsupported hero claims with live data and unified keyboard-safe overlay behavior
- 2026-08-15 · UI detail polish · Added ambient theme surfaces, reusable aligned detail cards and a unified squircle icon treatment; 52 browser checks passed
- 2026-08-15 · Light Mode surface definition · Increased canvas/card separation and made card, field and divider borders visible without changing Dark Mode
- 2026-08-15 · Unified two-mode color system · Aligned both themes to emerald/gold, fixed dark-on-dark Navbar/Hero text and passed 48 browser checks
- 2026-08-15 · Portfolio README · Added real Desktop/Mobile screenshots, live demo, feature/technology/setup documentation and transparent coverage status
- 2026-08-14 · Project intelligence and saved destinations · Added a project-local maintainer skill, full verification command and bilingual favorites filter; 44 browser checks passed
- 2026-08-08 · Trip budget calculator · Replaced sample promotions with user-entered cost calculations and retained the existing route for compatibility
- 2026-08-08 · Verified attraction foundation batch 1 · Separated province/place contracts and sourced Phuket, Chiang Mai, Krabi, Surat Thani and Bangkok; 36 browser checks passed
- 2026-08-08 · Responsive and accessibility polish · Removed bilingual mobile overflow, normalized route headings and touch targets, supported reduced motion and passed 32 browser checks
- 2026-08-08 · Project structure organization · Grouped quality, curation and maintenance scripts; updated all callers and passed 24 browser checks
- 2026-08-08 · Deep safe cleanup · Removed duplicate image/data contracts, 14 legacy images, retired planner/weather/testimonial/team code and unreferenced translations; 24 browser checks passed
- 2026-08-07 · Bilingual runtime audit · Seven routes, overlays and accessibility attributes verified in Thai and English · commit `a76c932`
- 2026-08-07 · Repository cleanup · Removed 247 proven-unused files, aligned curation to three images and added anti-regression guards
- 2026-08-07 · Phase 3 cross-page data · Unified page cards, derived Dashboard data, moved sample prices into shared promotion records and generated articles from destination data
