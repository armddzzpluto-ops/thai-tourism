# Changelog

## 2026-08-17 — Local Smart Trip Assistant
- Evolved the backward-compatible `#promotions` route into a combined conversational trip planner and user-input budget calculator.
- Added safe natural-language parsing for region, trip length, interests and optional budget without an external AI API or exposed key.
- Added a bilingual five-day Buri Ram–Si Sa Ket–Ubon Ratchathani itinerary with a dated official Tourism Authority of Thailand source.
- Linked every planner day to the project’s province guides and kept unverified generic suggestions at province level instead of inventing attraction facts, prices or opening hours.
- Added responsive, keyboard-accessible chat controls plus structural and browser regressions for five-day output, bilingual rerendering, XSS-safe text and budget handoff.

## 2026-08-17 — Site-wide icon consistency
- Replaced operating-system Emoji in the brand, mobile navigation, Home search, experience cards, favorites and footer with the existing Font Awesome system.
- Rebuilt the six Home experience icons as equal 48px themed squircle marks instead of platform-dependent colorful glyphs.
- Updated all 77 generated destination pages to use the same brand mark as the SPA shell.
- Added structural and browser guards for icon presence, geometry, bilingual labels and Emoji-free visible UI.

## 2026-08-17 — Orphan route accent removal
- Removed the detached green-gold pseudo-element above non-Home route headings that visually resembled a stuck loading bar.
- Removed its separate mobile positioning rule instead of hiding it with another override.
- Preserved the heading-owned divider so route hierarchy remains intentional and aligned with its title.
- Added structural and browser guards that require the retired pseudo-element content to remain absent.

## 2026-08-17 — Route header visibility
- Removed `fade-in` gating from the primary heading group on every non-Home SPA route.
- Fixed the intermittent state where a route opened with only its decorative accent line, search controls and result count visible.
- Kept reveal motion on supporting content while making route identity synchronous for direct links, refresh and History navigation.
- Added structural and browser guards for immediate route-header opacity and transform state.

## 2026-08-17 — Loader deadlock prevention
- Removed the decorative full-screen loader that could cover every SPA route when its optional closing script failed or was delayed.
- Kept the non-blocking scroll progress and route behavior while allowing the first usable page to render immediately.
- Removed duplicate legacy loader CSS and JavaScript instead of adding another timeout override.
- Added structural and browser regressions that reject any full-screen loader reintroduction across route reloads.

## 2026-08-16 — Button and icon control consistency
- Organized controls into three intentional shapes: squircle text actions, pill filters/chips and 44px squircle icon controls.
- Normalized icon centering, tap targets, borders, hover/pressed motion and focus rings across navigation, cards, dialogs, footer and floating actions.
- Replaced the harsh modal-close and scaling favorite interactions with restrained theme-aware feedback that does not visually jump.
- Added structural tokens and browser regressions for control sizing and geometry in Light/Dark Mode across all responsive profiles.

## 2026-08-16 — Homepage visual depth and hero clarity
- Replaced the visibly compressed Bangkok skyline Hero with the sharper existing Chiang Mai landscape and preloaded the exact rendered asset.
- Centralized the homepage image path as a design token and removed superseded Hero image/overlay overrides from older refinement layers.
- Rebuilt the Hero scrim, bottom transition, page ambience and search-panel boundary so the first screen blends into the content without a hard background seam.
- Added structural and browser regressions for the Hero asset, full-quality rendering, theme transition layer and horizontal overflow.

## 2026-08-15 — Runtime trust and dialog consistency
- Replaced unsupported coastline and annual-visitor hero claims with province, verified-attraction and linked-image counts derived from the live project data.
- Kept live coverage values exact on first paint by excluding them from the decorative counter animation.
- Unified the destination modal, gallery lightbox and article modal as accessible dialogs with explicit open/closed state, initial focus, focus containment, Escape-to-close and focus restoration.
- Preserved body scroll locking until every overlay is closed instead of allowing one close action to unlock the page behind another dialog.
- Added structural guards and browser regressions for honest hero coverage and keyboard-safe overlay behavior.

## 2026-08-15 — UI detail polish
- Added theme-aware emerald-and-gold ambient gradients so page and alternate-section backgrounds have restrained depth in both Light and Dark Mode.
- Rebuilt the Travel Tips, About metrics, mission, advantages and technology groups as reusable aligned components instead of inline styles and mouse handlers.
- Standardized small icons and floating controls around bordered squircle containers, optical centering and consistent spacing.
- Added responsive one-column card composition for small screens and a browser regression for ambient surfaces, icon geometry and removal of inline hover behavior.
- Verified all 52 Playwright scenarios across Desktop, Notebook, Tablet and Mobile.

## 2026-08-15 — Light Mode surface definition
- Increased the visual separation between the warm page canvas, alternate sections and raised cards without changing the emerald-and-gold identity.
- Replaced extremely faint translucent Light Mode borders with restrained warm-gray border tokens so cards, fields and dividers remain visible on bright displays.
- Kept Dark Mode values and the existing theme architecture unchanged, and extended the browser theme regression to cover both surface and border tokens.

## 2026-08-15 — Unified two-mode color system
- Unified Light and Dark Mode around one emerald-and-temple-gold identity instead of switching the dark theme to an unrelated blue palette.
- Replaced navy Dark Mode surfaces with deep emerald ink, warm neutral text and emerald-tinted interactive overlays.
- Fixed the Dark Mode inverse-text token that made the Navbar and Hero text render dark on dark backgrounds.
- Aligned hardcoded Home hero, statistic-card, navigation and shadow colors with the shared semantic palette.
- Added a four-viewport Playwright regression for both theme palettes and key Navbar/Hero foreground colors; all 48 browser checks pass.
- Refreshed the README screenshots to show the corrected Desktop Dark Mode and Mobile Light Mode.

## 2026-08-15 — Portfolio README
- Added a portfolio-grade repository README with the live site, project scope, feature summary, technology stack, local setup and verification commands.
- Added real Desktop Dark Mode and Mobile Light Mode screenshots captured from the current site.
- Documented the 77-province coverage and the 5/77 sourced-attraction status without presenting pending records as verified.
- Added a concise architecture map and roadmap for contributors and portfolio reviewers.

## 2026-08-14 — Project intelligence and saved destinations
- Added a project-local AI maintainer skill that points contributors to the canonical architecture, data, verification and PR rules.
- Added `npm run verify` to run structural and browser checks as one delivery command.
- Added a bilingual Favorites filter to the Destinations route using the existing `tt_favs` local storage contract.
- Added live saved counts, combined region/search filtering and an honest empty state when no saved destination matches.
- Added Playwright coverage for persistence, filtering, live removal and Thai/English switching.

## 2026-08-08 — Real destination detail URLs
- Added pre-rendered `/destinations/<province-slug>/` pages for all 77 province records.
- Changed destination cards and discovery widgets to navigate to shareable URLs instead of relying only on a modal.
- Added canonical, Open Graph, JSON-LD and sitemap metadata for search discovery.
- Added bilingual detail controls, saved-theme support and direct URL/refresh/Back/Forward tests.

## 2026-08-08 — User-input trip budget calculator
- Replaced all fabricated promotion cards and provider-style prices with a practical budget calculator.
- Calculates accommodation, food, transport, activities and other costs from user-entered values only.
- Shows trip total, per-person cost and a transparent category breakdown in Thai and English.
- Preserved the existing `#promotions` route so bookmarks and browser navigation continue to work.
- Added static guards against sample promotions and browser coverage for calculation accuracy.

## 2026-08-08 — Verified attraction data foundation (batch 1)
- Separated all 77 province records from attraction records instead of promoting activity suggestions into places.
- Added sourced bilingual attraction records for Phuket, Chiang Mai, Krabi, Surat Thani and Bangkok.
- Added attraction-specific hours, admission guidance, verification dates, Google Maps links, official sources and Agoda accommodation searches.
- Updated the destination modal to show verified attraction facts or an explicit pending-verification state.
- Added static provenance guards and browser regressions; all 36 Playwright scenarios pass.

## 2026-08-08 — Responsive and accessibility polish
- Fixed the mobile region explorer and About mission grid so bilingual content no longer causes horizontal overflow.
- Added one primary heading to every route and preserved the existing visual hierarchy.
- Increased favorite, search-tag, language and navigation controls to reliable touch-target sizes.
- Ensured reveal content remains visible when the operating system requests reduced motion.
- Improved the contact email field hint and mobile keyboard behavior.
- Added browser regressions for bilingual heading structure, mobile overflow, touch targets and reduced motion; all 32 Playwright scenarios pass.

## 2026-08-08 — Project structure organization
- Grouped operational scripts by responsibility under `scripts/quality`, `scripts/curation` and `scripts/maintenance`.
- Updated npm commands, GitHub Actions, documentation and generated-file ownership references to the new paths.
- Added a scripts directory guide and a structural guard that rejects loose executable scripts.
- Preserved browser-facing HTML, CSS, JavaScript and province asset paths to avoid unnecessary runtime churn.
- Verified all 24 Playwright scenarios across Desktop, Notebook, Tablet and Mobile after the moves.

## 2026-08-08 — Deep safe cleanup
- Removed 14 legacy destination images after migrating every runtime, placeholder and test reference to the 77-province image source.
- Removed the duplicate `img` destination field and retained `heroImage` as the single primary-image contract.
- Removed unused category, region and retired travel-planner datasets, plus the stale planner reference in FAQ copy.
- Removed retired weather, testimonial, team and planner styles from active style layers.
- Pruned unreferenced translation pairs and stale mock-person accessibility mappings.
- Added static guards that reject legacy destination paths and retired standalone datasets.
- Verified all 24 Playwright scenarios across Desktop, Notebook, Tablet and Mobile.

## 2026-08-07 — Phase 3 cross-page data
- Replaced hardcoded Home and Promotions cards with shared destination records and one renderer.
- Rebuilt Dashboard metrics and charts from the live 77-province destination/gallery dataset.
- Removed fabricated weather, traveler reviews, tourism totals, ratings and review counts.
- Restored portfolio-sample promotion prices in one shared `PROMOTIONS` collection and clearly labels them as non-provider sample prices.
- Replaced standalone legacy blog posts and external covers with destination guides generated from shared province records and curated images.
- Removed placeholder team, adviser, phone, address, office and social-media content.
- Kept only the verified GitHub repository as the project contact channel.
- Added static and Playwright regression checks for cross-page record identity and derived dashboard values.

## 2026-08-07 — Repository cleanup
- Removed 247 proven-unused files and reduced the tracked working tree from about 290 MB to 72 MB.
- Removed legacy JavaScript bundles, checkpoints, terminal probes and duplicate status documents.
- Removed raw province JPG sources, the retired standalone gallery and unreferenced extended-gallery WebP files.
- Preserved every image referenced by current destination and curation records.
- Aligned the curation workflow with the three-image completion contract.
- Added static guards for missing runtime images, retired artifacts and orphan `gallery-4/5` files.

## 2026-08-07 — Developer foundation
- Added canonical agent and Copilot repository instructions.
- Added Playwright browser checks across four viewport profiles.
- Added automated AI memory checkpoint tooling and workflow.
- Extracted core SPA behavior from `index.html` into `js/app.js`.
- Centralized Thai/English copy in `js/translations.js`.
- Updated structural audits for the modular architecture.
