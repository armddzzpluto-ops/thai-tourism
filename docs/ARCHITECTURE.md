# Architecture

## Frontend Stack
- Static HTML, CSS, JavaScript
- No backend/database

## Main Entry
- index.html

## CSS Layers
- css/style.css: tokens, base styles, theme variables
- css/components.css: component styles and page sections
- css/enhancements.css: additive production UX layer

## JS Layers
- js/data.js: shared source-of-truth data constants
- js/script.js: core rendering, filters, interactions
- js/enhancements.js: additive UX behavior
- js/dashboard.js: dashboard-only charting and metrics

## Design Principle
- Additive, patch-based changes only.
- Reuse existing globals and modules.
- No architectural rewrites unless explicitly approved.
