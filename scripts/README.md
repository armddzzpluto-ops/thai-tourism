# Project scripts

Scripts are grouped by responsibility so operational tooling stays separate from browser code.

- `quality/`: read-only structural and regression checks
- `curation/`: province-image download, validation and browser-data generation
- `maintenance/`: project documentation and repository housekeeping

Run the common tasks through `npm run check`, `npm run test:e2e` and
`npm run memory:update`. The curation workflow calls its scripts directly from
GitHub Actions because it requires Wikimedia access and WebP tooling.
