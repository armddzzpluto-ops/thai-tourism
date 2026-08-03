# CLAUDE

## Mission
Maintain a production-quality Thailand Tourism website with minimal, safe, incremental edits.

## Core Rules
- Use incremental editing only.
- Keep diffs small.
- Do not rewrite architecture.
- Preserve existing HTML structure, CSS architecture, JS architecture, selector order, responsive behavior, animations, spacing, and typography.

## Do Not Modify Unless Bug Is Reported
- Theme system
- Navigation
- Dashboard
- Gallery
- Accessibility
- Layout

## Validation Scope
After each change, run only incremental validation:
- Syntax validation
- Missing variables
- Missing imports
- Runtime errors
- Broken references

Skip broad audits unless explicitly requested.

## Data Quality Rules
Destination data is the source of truth.
Each destination should include:
- Province
- Region
- District (if applicable)
- Category
- Description
- Coordinates (if available)
- Opening hours (if available)
- Ticket price (if available)
- Official image
- Official location
- Google Maps link
- Tags
- Search keywords

## Production Safety
- Never leave partial implementations.
- If a task cannot be completed safely, stop and request approval.

## Definition of Done
A task is complete only if all items pass:
- Feature works
- No console errors
- No broken links
- No missing assets
- Responsive behavior verified
- Dark mode verified
- Accessibility preserved
- PROJECT_STATUS updated
- TODO updated
- CHANGELOG updated
