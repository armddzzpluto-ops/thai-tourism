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
