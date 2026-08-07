# Architecture

## Stack
- Static HTML, CSS and JavaScript
- No backend or database
- GitHub Pages compatible

## Layers
- `index.html`: semantic document shell and page components
- `css/style.css`: tokens, theme and foundations
- `css/components.css`: shared/page components
- `css/enhancements.css`: optional UX layer
- `js/app.js`: routing, rendering, Modal/Lightbox and core interaction
- `js/data.js`: shared tourism/content records
- `js/translations.js`: single Thai/English translation source
- `js/i18n.js`: translation runtime and language lifecycle
- `js/enhancements.js`: search suggestions, region explorer, reviews, blog and FAQ
- `js/core-stability.js`: focus/history/runtime stability guards

## Load order
1. Page shell and core app definitions
2. Image-curation metadata
3. Shared data
4. Translation data
5. Language runtime
6. UX enhancements
7. Stability guards

## Contracts
- Destination IDs and page hashes are stable public identifiers.
- `window.DESTINATIONS` is the source consumed by renderers.
- `window.TRANSLATIONS` is the only translation data source.
- Language changes dispatch `languagechange` and update mounted/open UI without reload.
