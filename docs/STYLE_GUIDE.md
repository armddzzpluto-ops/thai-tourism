# Style guide

## HTML
- Keep `index.html` semantic and focused on document/page components.
- Preserve public IDs, classes, hashes and accessible relationships.
- Visible copy must have a translation entry.

## CSS
- Reuse tokens from `css/style.css`.
- Keep component rules in `css/components.css` and optional UX rules in `css/enhancements.css`.
- Do not duplicate selectors or hardcode colors when a token exists.
- Verify Light/Dark and all four supported viewport profiles.

## JavaScript
- Core SPA behavior belongs in `js/app.js`.
- Shared tourism content belongs in `js/data.js`.
- Translation content belongs only in `js/translations.js`.
- Language mechanics belong in `js/i18n.js`.
- Optional widgets belong in `js/enhancements.js`.
- Preserve keyboard behavior and mounted/open UI across live language changes.

## Accessibility
- Images require meaningful localized alt text.
- Icon-only buttons require localized accessible names.
- Dialogs require focus management, Escape support and focus restoration.
- Focus must remain visible in both themes.

## Art direction
- Preserve the shared emerald, temple-gold, warm-cream and deep-emerald-ink identity in both themes.
- Prefer editorial composition, photographic hierarchy, fine line ornament and restrained ambient light over novelty effects.
- Home may carry the strongest cinematic treatment; supporting routes should remain calmer and clearly related.
- Use `--surface-*`, `--border-ornament`, shared shadows and existing spacing/type tokens before introducing a new literal value.
- Glass is reserved for navigation, Hero metrics and top-depth overlays; ordinary cards should retain solid readable surfaces.

## Motion and depth
- Use opacity and transform for motion, keep hover travel small, and preserve `prefers-reduced-motion`.
- Critical route headings and controls must never depend on reveal observers to become usable.
- Depth order is canvas → basic surface → interactive surface → floating navigation/dialog → modal/lightbox.
- Decorative pseudo-elements must be pointer-inert and must never create horizontal overflow or replace semantic content.
- New visual polish should reduce or consolidate conflicting overrides rather than create an `!important` wall.

