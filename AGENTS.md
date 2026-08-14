# Thailand Travel Guide — Agent Operating Guide

## Mission
Maintain a presentation-ready, bilingual static tourism SPA covering all 77 Thai provinces.

## Source of truth
- `index.html`: document shell and page markup only.
- `js/app.js`: core SPA routing, rendering and interactions.
- `js/data.js`: destination and shared content records.
- `js/translations.js`: every Thai/English UI and content translation.
- `js/i18n.js`: language runtime only; do not add copy here.
- `js/enhancements.js`: optional UX widgets that consume current shared data.
- `scripts/quality/check-site.mjs`: fast structural regression checks.
- `tests/`: browser-level acceptance tests.

## Non-negotiable rules
1. Preserve direct URLs, refresh, back/forward and hash navigation.
2. A language change must update existing UI, open overlays and JavaScript-rendered content without reloading.
3. English mode must not expose Thai UI text; Thai mode must avoid unnecessary English except names, brands, units and technology names.
4. Destination cards, Gallery, Hero and Modal must consume the same destination/image records.
5. Never set `galleryCurated: true` unless the province has at least three verified curated gallery images.
6. Preserve keyboard focus, visible focus, semantic controls, alt text and accessible labels.
7. Do not duplicate data, translations, CSS selectors or render pipelines.
8. Do not commit checkpoints, terminal probes, generated reports or source-format images that the site does not serve.
9. Keep only runtime-referenced assets; Git history is the archive for retired files.

## Required verification
- Run `npm run check`.
- Run `npm run test:e2e` for changes affecting UI, routing, responsive layout, data rendering or language.
- Run `npm run verify` before delivery when a change requires both structural and browser checks.
- Test Thai and English.
- Test Desktop 1440×900, Notebook 1280×800, Tablet 768×1024 and Mobile 390×844.
- Check console errors, failed local requests, broken links and broken images.
- Confirm `npm run check` reports no retired artifacts or orphan extended-gallery assets.

## Delivery workflow
1. Inspect current source and docs.
2. State the defect and acceptance criteria.
3. Make the smallest coherent change.
4. Run static and browser tests.
5. Update `docs/AI_MEMORY.md`, `docs/TODO.md` and `CHANGELOG.md` when a phase completes.
6. Commit by phase, open a PR, wait for checks, then merge.

## Safety
- Preserve unrelated user changes.
- Do not merge partial implementations.
- Do not rewrite working architecture without an explicit task and regression coverage.
- Use authoritative sources for factual tourism data and image attribution.
