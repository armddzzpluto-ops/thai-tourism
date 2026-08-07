# Claude project guide

The canonical instructions are in `/AGENTS.md`. Follow that file before making changes.

## Working agreement
- Preserve current public behavior and selectors unless the task explicitly changes them.
- Refactoring is allowed when requested, covered by tests and completed as one coherent migration.
- UI copy belongs in `js/translations.js`.
- Tourism content belongs in `js/data.js`.
- Core behavior belongs in `js/app.js`; optional UX belongs in `js/enhancements.js`.
- Run static and Playwright tests before proposing a merge.
- Update project memory after completing a phase.
