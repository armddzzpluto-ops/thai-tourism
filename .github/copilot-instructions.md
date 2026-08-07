# Copilot instructions

Follow `/AGENTS.md` as the primary repository policy.

- Keep `index.html` as a document shell; place behavior in JavaScript modules.
- Read UI copy from `js/translations.js`; never hardcode a new visible Thai/English string in render functions.
- Read destination/gallery content from `js/data.js`; never create a second destination dataset.
- Keep selectors, hashes and public function contracts stable unless tests are updated intentionally.
- Use optional chaining only where absence is valid; fail clearly for required data.
- Preserve mouse, touch and keyboard operation.
- Add or update Playwright coverage for user-visible behavior.
- Before proposing a commit, run `npm run check` and relevant E2E tests.
- Update project memory/status files when completing a phase.
