# Changelog

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
