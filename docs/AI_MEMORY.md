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
- Static GitHub Actions checks are active
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
- 2026-08-14 · Project intelligence and saved destinations · Added a project-local maintainer skill, full verification command and bilingual favorites filter; 44 browser checks passed
- 2026-08-08 · Trip budget calculator · Replaced sample promotions with user-entered cost calculations and retained the existing route for compatibility
- 2026-08-08 · Verified attraction foundation batch 1 · Separated province/place contracts and sourced Phuket, Chiang Mai, Krabi, Surat Thani and Bangkok; 36 browser checks passed
- 2026-08-08 · Responsive and accessibility polish · Removed bilingual mobile overflow, normalized route headings and touch targets, supported reduced motion and passed 32 browser checks
- 2026-08-08 · Project structure organization · Grouped quality, curation and maintenance scripts; updated all callers and passed 24 browser checks
- 2026-08-08 · Deep safe cleanup · Removed duplicate image/data contracts, 14 legacy images, retired planner/weather/testimonial/team code and unreferenced translations; 24 browser checks passed
- 2026-08-07 · Bilingual runtime audit · Seven routes, overlays and accessibility attributes verified in Thai and English · commit `a76c932`
- 2026-08-07 · Repository cleanup · Removed 247 proven-unused files, aligned curation to three images and added anti-regression guards
- 2026-08-07 · Phase 3 cross-page data · Unified page cards, derived Dashboard data, moved sample prices into shared promotion records and generated articles from destination data
