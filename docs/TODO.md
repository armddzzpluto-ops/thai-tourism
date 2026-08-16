# TODO

## Completed foundation
- [x] Canonical agent and Copilot instructions
- [x] Playwright coverage for Desktop, Notebook, Tablet and Mobile
- [x] Automated phase-memory workflow
- [x] Core SPA runtime extracted to `js/app.js`
- [x] Translation data centralized in `js/translations.js`
- [x] Gallery connected to destination-owned image records
- [x] At least three curated, attributed images for every province
- [x] Remove retired code, checkpoints, source JPGs and unreferenced image assets
- [x] Add CI guards against missing runtime images and retired artifacts
- [x] Connect Home, Destinations, Promotions, Gallery and Modal to destination-owned records
- [x] Replace simulated tourism Dashboard values with metrics derived from live site data
- [x] Remove fabricated weather, reviews, ratings and contact/team placeholders
- [x] Replace sample promotions with a user-input trip budget calculator
- [x] Group quality, curation and maintenance tooling into responsibility-based script folders
- [x] Remove bilingual mobile overflow, normalize route headings and touch targets, and support reduced motion
- [x] Generate real detail URLs for all 77 destinations with canonical, Open Graph, JSON-LD and sitemap coverage
- [x] Add a bilingual saved-destination filter backed by the existing favorites storage
- [x] Add a project-local AI skill and one-command full verification workflow
- [x] Add a portfolio-grade README with real Desktop/Mobile screenshots, live demo, setup guide and transparent data status
- [x] Unify Light/Dark colors around one emerald-and-gold identity and lock key theme foregrounds with browser regression tests
- [x] Improve Light Mode canvas/card separation and border visibility on bright displays
- [x] Add theme-aware ambient backgrounds and unify detail-card, icon and micro-alignment treatments
- [x] Replace unsupported Home hero tourism claims with live project coverage values
- [x] Unify modal, lightbox and article keyboard/focus behavior
- [x] Replace the compressed Home Hero source and blend the first screen into the page without a fixed background seam
- [x] Normalize button shapes, icon-only tap targets and interaction feedback across shared controls
- [x] Remove the decorative full-screen loader and prevent route-blocking loader regressions

## Next phase
- [ ] Verify attraction records for the remaining 72 provinces in small source-reviewed batches
- [ ] Add authoritative numeric coordinates where an official source publishes them
- [ ] Confirm that each province hero/gallery depicts the selected primary attraction before linking it to that attraction
- [ ] Continue splitting page markup into maintainable components without changing public selectors
- [ ] Consolidate overlapping CSS only after adding visual-regression snapshots
- [ ] Review performance after the content/data work is complete

## Definition of done
- [x] Static checks pass
- [x] Playwright passes in Thai and English on all four viewport profiles
- [x] No console errors, local HTTP errors, broken links or broken images
- [x] Light/Dark, direct URL, refresh, back/forward, mouse, touch and keyboard verified
- [x] `AI_MEMORY.md` and `CHANGELOG.md` updated
