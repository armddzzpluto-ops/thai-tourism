# Image Guide

## Source Policy
Prefer images from:
- Official Tourism Authority of Thailand sources
- Unsplash
- Pexels
- Wikimedia Commons
- Official government/tourism sources

## Accuracy Rules
- Image must match destination and province.
- Do not reuse another province's landmark photo.
- Do not use random unrelated stock photos.

## Quality Rules
- Use clear, high-resolution images.
- Replace low-quality assets when better verified images are available.
- Keep optimized formats (WebP where possible).

## Performance Rules
- Use lazy loading for large imagery.
- Avoid duplicate assets.
- Reuse existing image paths when valid.
- Keep at least three verified gallery images per curated province.
- Do not keep raw download JPGs after verified WebP output and attribution metadata exist.
- Do not keep `gallery-4.webp` or `gallery-5.webp` unless referenced by `js/image-curation-data.js`.

## Curation Execution Policy
- Image curation must never be performed manually when the automated pipeline is unavailable.
- If the pipeline cannot execute: stop the batch, report the blocking issue, and do not partially curate metadata.
- Resume curation only after the pipeline is restored.
- The canonical pipeline is `scripts/curate-province-gallery-batch.ps1`; do not reintroduce retired download/build scripts.

Reason:
- Prevent inconsistent province data and duplicate work.
