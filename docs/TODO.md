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
- [x] Remove fabricated weather, reviews, ratings and contact/team placeholders; isolate clearly labelled sample prices in shared promotion data

## Next phase
- [ ] Verify destination-level official websites, maps and coordinates
- [ ] Expand province attraction records with authoritative sources
- [ ] Continue splitting page markup into maintainable components without changing public selectors
- [ ] Consolidate overlapping CSS only after adding visual-regression snapshots
- [ ] Review performance after the content/data work is complete

## Definition of done
- [x] Static checks pass
- [ ] Playwright passes in Thai and English on all four viewport profiles
- [ ] No console errors, local HTTP errors, broken links or broken images
- [ ] Light/Dark, direct URL, refresh, back/forward, mouse, touch and keyboard verified
- [ ] `AI_MEMORY.md` and `CHANGELOG.md` updated
