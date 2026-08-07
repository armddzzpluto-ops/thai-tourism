# TODO

## Developer foundation
- [x] Add root AGENTS.md as the canonical agent guide
- [x] Add repository-wide Copilot instructions
- [x] Add Playwright E2E coverage for languages, routes, overlays, responsive projects and runtime errors
- [x] Add automated AI memory checkpoint workflow
- [x] Extract core SPA behavior from index.html into js/app.js
- [x] Centralize translation data in js/translations.js


## Phase 1 Active
- [x] Add official websites to destination records (fallback Tourism Thailand search links)
- [x] Validate Google Maps links for all destinations (auto-repair invalid/missing links)
- [~] Improve destination image accuracy and quality (local WebP package complete; attraction curation pending)
- [ ] Expand each province toward 10-30 attractions
- [x] Fill required destination metadata schema keys for all shared records (heroImage, galleryImages, maps, officialWebsite, coordinates, keywords, openingHours, ticketInfo)
- [ ] Verify official coordinates and district-level metadata per province (replace pending placeholders)
- [x] Re-check search quality after each data batch
- [ ] Replace fallback officialWebsite links with verified destination-level official websites
- [ ] Replace fallback Google Maps search links with verified place-level links
- [x] Replace remaining generic province images with province-specific local WebP structure (hero + gallery scaffolding)
- [ ] Curate 5-10 attraction-accurate tourism images per province (replace fallback duplicates)
- [ ] Validate per-image caption/photoCredit/imageSource entries against final curated sources
- [ ] Add additional verified attractions where province coverage is still thin
- [x] Migrate Gallery page data source to shared destination.galleryImages layer
- [~] Migrate Promotions page cards to shared destination image layer (seasonal campaign copy still static inline)
- [ ] Resolve terminal execution blocker and rerun Batch 1 curation (automated-only, no manual fallback)
- [ ] Run Batch 1 with explicit province list after pipeline restore:
	- chiang-mai
	- chiang-rai
	- mae-hong-son
	- lampang
	- lamphun
	- phrae
	- nan
	- phayao
	- uttaradit
	- tak
- [x] Production hotfix: remove active runtime console errors (no architecture refactor)
- [x] Production hotfix: replace broken inline province image sources with local assets
- [x] Production hotfix: add inline fallback map/official links in active modal flow
- [x] Production hotfix: accessibility-safe modal/lightbox/blog preview alt/src defaults
- [ ] Consolidate duplicate datasets into a single source (future scoped task, not merged in hotfix)

## Next
- [ ] Province pages (Phase 2)
- [ ] Travel planner enhancements (Phase 2)
- [ ] Nearby attractions (Phase 2)
- [ ] Weather integration strategy (Phase 2)
- [ ] Favorites persistence review (Phase 2)

