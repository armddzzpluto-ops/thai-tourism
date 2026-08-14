---
name: thailand-travel-guide-maintainer
description: Maintain and incrementally improve the Thailand Travel Guide 2026 repository. Use for its bilingual vanilla HTML/CSS/JavaScript UI, 77-province data, attraction sources, destination URLs, gallery curation, accessibility, tests, documentation, and pull-request work.
---

# Thailand Travel Guide Maintainer

1. Read `/AGENTS.md`, `/docs/AI_MEMORY.md`, `/docs/TODO.md`, and relevant source files before editing.
2. Preserve unrelated user changes and work from the latest `main` on a focused branch.
3. Keep destination data in `js/data.js`, translations in `js/translations.js`, and behavior in the existing modules.
4. Do not invent tourism facts, prices, ratings, reviews, weather, contacts, or coordinates. Require authoritative sources and verification dates for attraction facts.
5. Keep Vanilla HTML/CSS/JavaScript, stable selectors, bilingual switching, accessibility, responsive layouts, direct URLs, refresh, and back/forward behavior.
6. Regenerate destination pages when shared data changes.
7. Run `npm run check`, relevant Playwright tests, and `git diff --check`.
8. Update project memory, TODO, and changelog for completed phases.
9. Open a focused PR and wait for checks. Never merge without explicit user approval.
