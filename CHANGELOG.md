# Changelog

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
