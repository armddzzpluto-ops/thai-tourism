import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import os from "node:os";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const failures = [];
const warnings = [];

const expectedScriptLayout = [
  "scripts/quality/check-site.mjs",
  "scripts/build/generate-destination-pages.mjs",
  "scripts/curation/curate-province-gallery-batch.ps1",
  "scripts/curation/sync-image-curation.mjs",
  "scripts/maintenance/update-ai-memory.mjs"
];

for (const scriptPath of expectedScriptLayout) {
  if (!fs.existsSync(path.join(root, scriptPath))) {
    failures.push(`project script is missing from its responsibility folder: ${scriptPath}`);
  }
}

const looseScripts = fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true })
  .filter(entry => entry.isFile() && /\.(?:mjs|ps1)$/.test(entry.name));
if (looseScripts.length) {
  failures.push(`project scripts must be grouped by responsibility: ${looseScripts.map(entry => entry.name).join(", ")}`);
}

const read = relative =>
  fs.readFileSync(path.join(root, relative), "utf8").replace(/^\uFEFF/, "");

const index = read("index.html");
const app = read("js/app.js");
const data = read("js/data.js");
const translations = read("js/translations.js");
const i18n = read("js/i18n.js");
const enhancements = read("js/enhancements.js");
const curationData = read("js/image-curation-data.js");
const style = read("css/style.css");
const components = read("css/components.css");
const enhancementStyles = read("css/enhancements.css");
const destinationDetailStyles = read("css/destination-detail.css");
const destinationGenerator = read("scripts/build/generate-destination-pages.mjs");
const memoryWorkflow = read(".github/workflows/update-ai-memory.yml");
const curationWorkflow = read(".github/workflows/curate-all-provinces.yml");
const checksWorkflow = read(".github/workflows/site-checks.yml");
const codeqlWorkflow = read(".github/workflows/codeql.yml");
const curationSync = read("scripts/curation/sync-image-curation.mjs");

if (/^<<<<<<< |^=======$|^>>>>>>> /m.test(index)) {
  failures.push("index.html contains Git conflict markers");
}

const scriptSources = [...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match => match[1]);

for (const source of new Set(scriptSources)) {
  const count = scriptSources.filter(item => item === source).length;
  if (count > 1) failures.push(`duplicate script source: ${source} (${count})`);
}

function findRemoteExecutableTags(source) {
  return [
    ...source.matchAll(/<script\b[^>]*\bsrc=["']https:\/\/cdnjs\.cloudflare\.com\/[^"']+["'][^>]*>/gi),
    ...source.matchAll(/<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']https:\/\/cdnjs\.cloudflare\.com\/[^"']+["'])[^>]*>/gi)
  ].map(match => match[0]);
}

for (const [label, source] of [["index.html", index], ["destination generator", destinationGenerator]]) {
  for (const tag of findRemoteExecutableTags(source)) {
    if (!/\bintegrity=["']sha(?:384|512)-/i.test(tag) || !/\bcrossorigin=["']anonymous["']/i.test(tag)) {
      failures.push(`${label} loads a remote executable asset without SRI and anonymous CORS`);
    }
  }
}

if (!/script\.integrity\s*=\s*['"]sha(?:384|512)-/.test(app)
    || !/script\.crossOrigin\s*=\s*['"]anonymous['"]/.test(app)) {
  failures.push("dynamic Chart.js loader must set reviewed SRI and anonymous CORS before loading");
}

if (/\brun:[^\n]*\$\{\{\s*inputs\./.test(memoryWorkflow)
    || /git commit[^\n]*\$\{\{\s*inputs\./.test(memoryWorkflow)) {
  failures.push("workflow_dispatch input must enter shell steps through quoted environment variables");
}

for (const [label, workflow] of [
  ["site checks", checksWorkflow],
  ["CodeQL", codeqlWorkflow],
  ["curation", curationWorkflow],
  ["memory", memoryWorkflow]
]) {
  if (/uses:\s+[\w-]+\/[\w-]+@v\d+/i.test(workflow)) {
    failures.push(`${label} workflow must pin third-party actions to full commit SHAs`);
  }
}

if (!codeqlWorkflow.includes("github/codeql-action/init@cdf488f595d80d6e07e03d4674febd5ab45fa938")
    || !codeqlWorkflow.includes("github/codeql-action/analyze@cdf488f595d80d6e07e03d4674febd5ab45fa938")
    || !codeqlWorkflow.includes("queries: security-extended")) {
  failures.push("CodeQL must run the pinned security-extended JavaScript scan");
}

if (!app.includes("function escapeHTMLAttribute(value)")
    || !app.includes("function getSafeGalleryImageSource(value)")
    || !curationSync.includes("const normalizePlainText =")
    || !curationSync.includes("const normalizeGalleryPath =")) {
  failures.push("external gallery metadata must be normalized at ingestion and escaped at SPA render sinks");
}

if (/\sstyle=["']/.test(index)) {
  failures.push("index.html must use semantic classes instead of inline presentation styles");
}

if ((index.match(/class="hero-stat-icon"/g) || []).length !== 3
    || !index.includes('class="hero-stats" aria-label="ขอบเขตข้อมูลโปรเจกต์"')) {
  failures.push("Home hero coverage must keep three accessible icon-backed live metrics");
}

const dataIndex = scriptSources.indexOf("js/data.js");
const appIndex = scriptSources.indexOf("js/app.js");
const translationsIndex = scriptSources.indexOf("js/translations.js");
const i18nIndex = scriptSources.indexOf("js/i18n.js");
const enhancementsIndex = scriptSources.indexOf("js/enhancements.js");

if (dataIndex === -1) failures.push("index.html does not load js/data.js");
if (appIndex === -1) failures.push("index.html does not load js/app.js");
if (translationsIndex === -1) failures.push("index.html does not load js/translations.js");
if (i18nIndex === -1) failures.push("index.html does not load js/i18n.js");
if (enhancementsIndex === -1) failures.push("index.html does not load js/enhancements.js");
if (dataIndex !== -1 && i18nIndex !== -1 && dataIndex > i18nIndex) {
  failures.push("js/data.js must load before js/i18n.js");
}
if (translationsIndex !== -1 && i18nIndex !== -1 && translationsIndex > i18nIndex) {
  failures.push("js/translations.js must load before js/i18n.js");
}
if (!translations.includes("window.TRANSLATIONS =")) {
  failures.push("js/translations.js does not export the translation source");
}
if (/const dictionary\s*=\s*\{/.test(i18n) || /const sharedThai\s*=\s*\{/.test(i18n)) {
  failures.push("translation data leaked back into js/i18n.js");
}
if (i18nIndex !== -1 && enhancementsIndex !== -1 && i18nIndex > enhancementsIndex) {
  failures.push("js/i18n.js must load before js/enhancements.js");
}

if ((app.match(/let destinations\s*=\s*\[\]/g) || []).length !== 1) {
  failures.push("js/app.js must declare the runtime destinations array exactly once");
}

if ((data.match(/const DESTINATIONS\s*=\s*\[/g) || []).length !== 1) {
  failures.push("js/data.js must declare DESTINATIONS exactly once");
}

if (/const GALLERY\s*=\s*\[/.test(data) || /window\.GALLERY\s*=/.test(data)) {
  failures.push("legacy GALLERY data still exists in js/data.js");
}

const retiredMockPatterns = [
  ["fabricated reviews", /\bREVIEWS\b|testimonial-(?:track|dots|prev|next)/],
  ["fabricated weather", /\bWEATHER\b|weather-cards/],
  ["legacy promotion hydration", /data-promo-province|hydratePromotionCardsFromSharedData/],
  ["simulated tourism statistics", /ข้อมูลจำลอง|40\.2M|2\.1T|Visitors \(millions\)/],
  ["placeholder project people", /สมชาย ใจดี|สมหญิง สวยงาม|สมศักดิ์ เก่งมาก|อาจารย์ดีมาก/],
  ["placeholder contact details", /info@thailandtravel\.th|02-xxx-xxxx|10XXX/]
  ,["fabricated destination metrics", /\b(?:rating|reviews|tourists)\s*:/]
];
const runtimeSources = `${index}\n${app}\n${data}\n${enhancements}`;
for (const [label, pattern] of retiredMockPatterns) {
  if (pattern.test(runtimeSources)) failures.push(`retired mock content remains: ${label}`);
}

const retiredLoaderSources = `${index}\n${enhancements}\n${style}\n${enhancementStyles}`;
if (/loading-screen|loader-(?:card|logo|title|subtitle|track)|initLoader/.test(retiredLoaderSources)) {
  failures.push("retired full-screen loader can block the SPA runtime");
}

if (/\.page:not\(#page-home\)[^{]*first-of-type::before/.test(enhancementStyles)) {
  failures.push("retired orphan page accent can be mistaken for a loading indicator");
}

for (const page of ["destinations", "gallery", "promotions", "dashboard", "about", "contact"]) {
  const pageStart = index.indexOf(`id="page-${page}"`);
  const nextPageStart = index.indexOf('<!-- ===================== PAGE:', pageStart + 1);
  const pageMarkup = index.slice(pageStart, nextPageStart === -1 ? undefined : nextPageStart);
  const routeHeader = pageMarkup.match(/<div class="section-header route-header">/)?.[0] || "";
  if (!routeHeader) failures.push(`${page} route header must render without fade-in gating`);
}

if (/3,200|40M\+|นักท่องเที่ยวต่อปี/.test(index)) {
  failures.push("unsupported tourism totals remain visible in the Home hero");
}
if ((index.match(/data-live-metric/g) || []).length !== 3) {
  failures.push("Home live coverage metrics must opt out of decorative counter animation");
}
if (!index.includes('href="assets/images/provinces/chiang-mai/hero.webp" fetchpriority="high"')) {
  failures.push("Home hero must preload its current sharp local image");
}
if (!style.includes("--image-home-hero: url('../assets/images/provinces/chiang-mai/hero.webp')")) {
  failures.push("Home hero image must stay centralized in the shared design tokens");
}
if (!components.includes("background-image: var(--image-home-hero)")) {
  failures.push("Home hero art direction must use the shared image token");
}
if (enhancementStyles.includes("background-size: 100% min(920px, 100vh)")) {
  failures.push("Page ambient background must not end at a fixed first-viewport seam");
}
if (/body\s*\{[^}]*background-size:[^;}]*\b\d+px\b/s.test(enhancementStyles)) {
  failures.push("Page ambient background must not reintroduce a fixed-height mobile seam");
}
for (const token of ["--control-height", "--control-icon-size", "--control-radius"]) {
  if (!style.includes(token)) failures.push(`shared control token is missing: ${token}`);
}
for (const selector of [".theme-toggle-btn", ".card-fav", ".modal-close"]) {
  if (!enhancementStyles.includes(selector)) failures.push(`icon-control polish is missing: ${selector}`);
}
if (/SHOWCASE ART DIRECTION|SHOWCASE DETAIL POLISH/.test(`${enhancementStyles}\n${destinationDetailStyles}`)
    || /\.route-header\s*\{[^}]*(?:border|box-shadow|background)\s*:/s.test(enhancementStyles)
    || /#page-home\s*>\s*\.home-hero\s*\{[^}]*min-height\s*:/s.test(enhancementStyles)
    || enhancements.includes("initNavigationPresentation")) {
  failures.push("retired showcase overrides must not turn route headings or the Home Hero into oversized decorative surfaces");
}
const userFacingIconSources = `${index}\n${app}\n${read("scripts/build/generate-destination-pages.mjs")}`;
if (/[\u{1F000}-\u{1FAFF}\u2764\u26F0\u26F1\u26E9]/u.test(userFacingIconSources)) {
  failures.push("user-facing system emoji must use the shared Font Awesome icon system");
}
for (const iconClass of [
  "fa-umbrella-beach",
  "fa-place-of-worship",
  "fa-leaf",
  "fa-mountain-sun",
  "fa-masks-theater",
  "fa-map-location-dot"
]) {
  if (!index.includes(iconClass)) failures.push(`Home experience icon is missing: ${iconClass}`);
}
for (const overlayId of ["modal", "lightbox", "blog-modal"]) {
  const overlayPattern = new RegExp(`<div[^>]+id=["']${overlayId}["'][^>]+role=["']dialog["'][^>]+aria-hidden=["']true["']`);
  if (!overlayPattern.test(index)) failures.push(`accessible dialog state is missing: #${overlayId}`);
}

for (const containerId of [
  "home-trip-grid",
  "trip-assistant-form",
  "trip-assistant-input",
  "trip-assistant-messages",
  "budget-form",
  "budget-summary",
  "dashboard-stats"
]) {
  if (!index.includes(`id="${containerId}"`)) {
    failures.push(`cross-page data container is missing: #${containerId}`);
  }
}
if (!data.includes("window.CROSS_PAGE_DESTINATION_SLUGS =")) {
  failures.push("shared cross-page destination selection is not exported");
}
if (!data.includes("window.BLOG_DESTINATION_SLUGS =")) {
  failures.push("shared destination-guide data is not exported");
}
if (!data.includes("window.TRIP_PLANNER_TEMPLATES =")) {
  failures.push("sourced trip-planner templates are not exported");
}
if (!app.includes("parseTripPlannerRequest") || !app.includes("renderTripAssistant()")) {
  failures.push("local smart trip assistant is incomplete");
}
if (index.indexOf('id="trip-assistant-form"') > index.indexOf('id="trip-assistant-messages"')) {
  failures.push("trip controls must remain before the live plan so mobile users can revise a route");
}
if (/api\.openai\.com|generativelanguage\.googleapis\.com|api\.anthropic\.com/.test(runtimeSources)) {
  failures.push("static trip assistant must not expose or call an external AI endpoint");
}
if (/\bPROMOTIONS\b|promotion-(?:stay|package)-grid|Sample price|ราคาตัวอย่าง/.test(runtimeSources)) {
  failures.push("retired sample promotion data or UI remains");
}
if (/footer-social|social-btn|footer\.placeholder|initPlaceholderLinks/.test(`${index}\n${translations}\n${read("js/core-stability.js")}\n${components}\n${enhancementStyles}`)) {
  failures.push("placeholder social channels must not return; link to a real project destination instead");
}
if (/\.fab-wrap|\.fab-item|\.back-top\b|\.ripple(?:\W|$)|\.page-transition\b/.test(style)) {
  failures.push("retired floating-action and transition CSS must not return to the base stylesheet");
}
if (!app.includes("renderBudgetCalculator()") || !index.includes('id="budget-total"')) {
  failures.push("trip budget calculator is incomplete");
}
if (/images\.unsplash\.com/.test(data) || /const BLOG\s*=/.test(data)) {
  failures.push("legacy standalone blog content or external blog imagery remains");
}
if (/assets\/images\/destinations\//.test(runtimeSources)) {
  failures.push("legacy destination image paths remain; use province hero/gallery assets");
}
if (/\b(?:CATEGORIES|REGIONS|TRAVEL_STYLES|BUDGET_OPTIONS|ITINERARY_BANK|MEAL_SUGGESTIONS)\b/.test(data)) {
  failures.push("retired standalone category, region or planner data remains");
}
if (!app.includes("renderCrossPageDestinationGrids()")) {
  failures.push("cross-page destination grids are not rendered from shared data");
}
if (!app.includes('data-source="destinations"')) {
  failures.push("dashboard cards are not marked as derived from destination data");
}

if (/new Chart\(document\.getElementById/.test(app)) {
  failures.push("js/app.js creates a chart without checking the canvas first");
}


const requiredLanguageRoots = [
  "page-home",
  "page-destinations",
  "page-promotions",
  "page-gallery",
  "page-dashboard",
  "page-about",
  "page-contact"
];

for (const pageId of requiredLanguageRoots) {
  if (!i18n.includes(`#${pageId}`)) {
    failures.push(`i18n page coverage is missing #${pageId}`);
  }
}

if (!/addEventListener\(["']languagechange["']/.test(enhancements)) {
  failures.push("enhancements.js does not refresh widgets on language changes");
}

if (/const source\s*=\s*window\.destinations/.test(enhancements)) {
  failures.push("search suggestions capture a stale destination array");
}

if (!enhancements.includes("recentStorageKey()")) {
  failures.push("recent searches are not scoped by language");
}

if (!app.includes("modal.dataset.destinationId")) {
  failures.push("destination modal cannot refresh its open content after a language change");
}

if (!app.includes("lightbox.dataset.imageIndex")) {
  failures.push("lightbox cannot refresh its open caption after a language change");
}

if (!/Object\.keys\(item\)\.forEach\(key => delete item\[key\]\)/.test(i18n)) {
  failures.push("destination language reset does not remove fields added by the previous language");
}

if (!i18n.includes("baseT(key, variables)")) {
  failures.push("extended translations do not forward interpolation variables");
}

if (!i18n.includes("item.provinceSlug =")) {
  failures.push("localized destinations do not preserve a stable province slug");
}

if (!i18n.includes("translateTree(document.body, language)")) {
  failures.push("language application does not cover global controls and accessibility attributes");
}

if (!app.includes("item.provinceSlug || item.slug")) {
  failures.push("promotion hydration does not use the stable province slug");
}

const pairMatch = translations.match(/const staticPairs = (\[\[.*?\]\]);/s);
if (!pairMatch) {
  failures.push("unable to parse static bilingual text pairs");
} else {
  try {
    const parsedPairs = JSON.parse(pairMatch[1]);
    const pushedPairs = translations.match(/staticPairs\.push\(([\s\S]*?)\);\n\n  window\.TRANSLATIONS/);
    if (pushedPairs) {
      parsedPairs.push(...vm.runInNewContext(`[${pushedPairs[1]}]`));
    }
    const translatedThai = new Set(parsedPairs.map(pair => pair[0]));
    const staticMarkup = index
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "");
    const pageMarkup = staticMarkup.slice(
      staticMarkup.indexOf('id="page-home"'),
      staticMarkup.indexOf('id="modal"')
    );
    const thaiTextNodes = [...pageMarkup.matchAll(/>([^<>]+)</g)]
      .map(match => match[1].replace(/\s+/g, " ").trim())
      .filter(value => /[ก-๙]/.test(value))
      .filter(value => !/^฿(?:[\d\s,./]+)?$/.test(value));

    const unmapped = [...new Set(thaiTextNodes)]
      .filter(value => !translatedThai.has(value));

    if (unmapped.length) {
      failures.push(`unmapped static Thai UI text: ${unmapped.slice(0, 8).join(" | ")}`);
    }
  } catch (error) {
    failures.push(`static bilingual pair audit failed: ${error.message}`);
  }
}

const context = {
  window: {},
  console,
  URL,
  setTimeout,
  clearTimeout
};
vm.createContext(context);

try {
  vm.runInContext(curationData, context, { filename: "js/image-curation-data.js" });
  vm.runInContext(data, context, { filename: "js/data.js" });
  const destinations = context.window.DESTINATIONS;

  if (!Array.isArray(destinations)) {
    failures.push("window.DESTINATIONS was not exported");
  } else {
    if (destinations.length !== 77) {
      failures.push(`expected 77 destination records, found ${destinations.length}`);
    }

    const ids = destinations.map(item => item.id);
    if (new Set(ids).size !== ids.length) failures.push("duplicate destination IDs found");

    const selectedSlugs = context.window.CROSS_PAGE_DESTINATION_SLUGS;
    const destinationSlugs = new Set(destinations.map(item => item.provinceSlug || item.slug));
    const generatedDetailPages = destinations.filter(item =>
      fs.existsSync(path.join(root, "destinations", item.provinceSlug || item.slug, "index.html"))
    );
    if (generatedDetailPages.length !== destinations.length) {
      failures.push(`generated destination pages are incomplete: ${generatedDetailPages.length}/${destinations.length}`);
    }
    for (const destination of destinations) {
      const slug = destination.provinceSlug || destination.slug;
      const detailPath = path.join(root, "destinations", slug, "index.html");
      if (!fs.existsSync(detailPath)) continue;
      const detailHtml = fs.readFileSync(detailPath, "utf8");
      if (!detailHtml.includes(`<link rel="canonical" href="https://armddzzpluto-ops.github.io/thai-tourism/destinations/${slug}/">`)
        || !detailHtml.includes('type="application/ld+json"')
        || !detailHtml.includes('property="og:title"')) {
        failures.push(`destination detail metadata is incomplete: ${slug}`);
      }
      for (const tag of findRemoteExecutableTags(detailHtml)) {
        if (!/\bintegrity=["']sha(?:384|512)-/i.test(tag) || !/\bcrossorigin=["']anonymous["']/i.test(tag)) {
          failures.push(`destination detail remote stylesheet lacks SRI: ${slug}`);
        }
      }
    }
    if (!fs.existsSync(path.join(root, "sitemap.xml"))) failures.push("sitemap.xml is missing");
    if (!Array.isArray(selectedSlugs) || selectedSlugs.length < 5) {
      failures.push("cross-page destination selection must contain at least five slugs");
    } else {
      const unresolved = selectedSlugs.filter(slug => !destinationSlugs.has(slug));
      if (unresolved.length) failures.push(`unresolved cross-page destination slugs: ${unresolved.join(", ")}`);
    }

    const provinces = destinations.map(item => item.province).filter(Boolean);
    const uniqueProvinces = new Set(provinces);
    if (uniqueProvinces.size !== 77) {
      warnings.push(`province names are not unique: ${uniqueProvinces.size}/77`);
    }

    const attractionRecords = context.window.VERIFIED_ATTRACTIONS;
    if (!attractionRecords || typeof attractionRecords !== "object") {
      failures.push("verified attraction collection is missing");
    } else {
      const verified = Object.values(attractionRecords);
      if (verified.length < 5) failures.push("verified attraction foundation must include the first five records");
      const invalidAttractions = verified.filter(item =>
        !item.id || !item.name?.th || !item.name?.en ||
        !item.hours?.th || !item.hours?.en ||
        !item.admission?.th || !item.admission?.en ||
        !/^https:\/\//.test(item.officialSource || "") ||
        !/^https:\/\/www\.google\.com\/maps\/search\//.test(item.googleMaps || "") ||
        !/^https:\/\/www\.agoda\.com\/search/.test(item.agoda || "") ||
        !/^\d{4}-\d{2}-\d{2}$/.test(item.verifiedOn || "")
      );
      if (invalidAttractions.length) {
        failures.push(`verified attraction records have incomplete provenance: ${invalidAttractions.map(item => item.id).join(", ")}`);
      }
    }

    const tripTemplates = context.window.TRIP_PLANNER_TEMPLATES;
    const northeastFiveDay = Array.isArray(tripTemplates)
      ? tripTemplates.find(item => item.id === "northeast-5-days")
      : null;
    if (!northeastFiveDay || northeastFiveDay.days !== 5 || northeastFiveDay.itinerary?.length !== 5) {
      failures.push("official Northeast five-day planner template is incomplete");
    } else {
      const invalidPlannerDays = northeastFiveDay.itinerary.filter(item =>
        !item.provinceSlug || !item.province?.th || !item.province?.en ||
        !Array.isArray(item.stops?.th) || !item.stops.th.length ||
        !Array.isArray(item.stops?.en) || item.stops.en.length !== item.stops.th.length
      );
      if (invalidPlannerDays.length) failures.push("Northeast planner days need matching bilingual stops");
      if (!/^https:\/\/www\.tourismthailand\.org\/Trip-Planner\//.test(northeastFiveDay.source?.url || "") ||
          !/^\d{4}-\d{2}-\d{2}$/.test(northeastFiveDay.source?.verifiedOn || "")) {
        failures.push("Northeast planner template needs a dated official TAT source");
      }
    }

    const activityPromotion = destinations.filter(item =>
      item.primaryAttraction === null && Array.isArray(item.attractions) && item.attractions.length
    );
    if (activityPromotion.length) {
      failures.push("unverified activity suggestions were promoted to attraction records");
    }

    const uncuratedGalleryViolations = destinations.filter(item => {
      if (item.galleryCurated === true) return false;
      return !Array.isArray(item.galleryImages)
        || item.galleryImages.length !== 1
        || item.galleryImages[0] !== item.heroImage;
    });

    if (uncuratedGalleryViolations.length) {
      failures.push(
        `uncurated destinations must expose hero-only galleries: ${uncuratedGalleryViolations.length} violations`
      );
    }

    const genericGalleryCaptions = destinations.filter(item =>
      /tourism highlight|จุดท่องเที่ยว\s*\d+/i.test(String(item.caption || ""))
    );

    if (genericGalleryCaptions.length) {
      warnings.push(
        `generic destination image captions remain: ${genericGalleryCaptions.length}`
      );
    }

    const runtimeImagePaths = destinations.flatMap(item => {
      const sources = [item.heroImage, ...(Array.isArray(item.galleryImages) ? item.galleryImages : [])];
      return sources
        .filter(source => typeof source === "string" && !/^https?:\/\//.test(source))
        .map(source => ({ owner: item.provinceSlug || item.slug, source }));
    });
    const missingRuntimeImages = runtimeImagePaths
      .filter(({ source }) => !fs.existsSync(path.join(root, source)))
      .map(({ owner, source }) => `${owner}: ${source}`);

    if (missingRuntimeImages.length) {
      failures.push(`missing runtime destination images: ${missingRuntimeImages.slice(0, 8).join(" | ")}`);
    }

    const invalidWebpImages = [...new Set(runtimeImagePaths.map(({ source }) => source))]
      .filter(source => source.endsWith(".webp") && fs.existsSync(path.join(root, source)))
      .filter(source => {
        const header = fs.readFileSync(path.join(root, source)).subarray(0, 12);
        return header.length < 12
          || header.toString("ascii", 0, 4) !== "RIFF"
          || header.toString("ascii", 8, 12) !== "WEBP";
      });
    if (invalidWebpImages.length) {
      failures.push(`invalid runtime WebP files: ${invalidWebpImages.slice(0, 8).join(" | ")}`);
    }
  }
} catch (error) {
  failures.push(`js/data.js runtime check failed: ${error.message}`);
}

const forbiddenLegacyPaths = [
  ".checkpoints",
  ".terminal_sanity.txt",
  "docs/terminal-write-check.txt",
  "docs/batch1-curation-log.json",
  "js/script.js",
  "js/dashboard.js",
  "js/destinations.js",
  "assets/images/gallery",
  "scripts/build-province-image-pack.ps1",
  "scripts/download-province-images.ps1"
];

for (const legacyPath of forbiddenLegacyPaths) {
  if (fs.existsSync(path.join(root, legacyPath))) {
    failures.push(`retired project artifact returned: ${legacyPath}`);
  }
}

const provinceRoot = path.join(root, "assets", "images", "provinces");
const legacyProvinceJpgs = fs.readdirSync(provinceRoot)
  .filter(name => name.endsWith(".jpg"));
if (legacyProvinceJpgs.length) {
  failures.push(`legacy province JPG sources returned: ${legacyProvinceJpgs.length}`);
}

const referencedCurationImages = new Set(
  [...curationData.matchAll(/assets\/images\/provinces\/[^"'\s]+\/gallery-\d+\.webp/g)]
    .map(match => match[0])
);
const orphanExtendedGallery = [];
for (const entry of fs.readdirSync(provinceRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  for (const name of fs.readdirSync(path.join(provinceRoot, entry.name))) {
    if (!/^gallery-[45]\.webp$/.test(name)) continue;
    const relative = `assets/images/provinces/${entry.name}/${name}`;
    if (!referencedCurationImages.has(relative)) orphanExtendedGallery.push(relative);
  }
}
if (orphanExtendedGallery.length) {
  failures.push(`unreferenced gallery-4/5 assets: ${orphanExtendedGallery.length}`);
}

const skipDirs = new Set([".git", ".backup", "node_modules"]);
const jsFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".js")) jsFiles.push(full);
  }
}
walk(root);

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", file], {
    cwd: root,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    failures.push(`${path.relative(root, file)} syntax error: ${result.stderr.trim()}`);
  }
}

const inlineScripts = [...index.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(code => code.trim());

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "thai-tourism-check-"));

try {
  inlineScripts.forEach((code, indexNumber) => {
    const tempFile = path.join(tempDir, `inline-${indexNumber + 1}.js`);
    fs.writeFileSync(tempFile, code, "utf8");

    const result = spawnSync(process.execPath, ["--check", tempFile], {
      cwd: root,
      encoding: "utf8"
    });

    if (result.status !== 0) {
      failures.push(`index.html inline script ${indexNumber + 1}: ${result.stderr.trim()}`);
    }
  });
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

const externalImages = (index.match(/https:\/\/(?:images\.unsplash\.com|api\.dicebear\.com)\//g) || []).length;
if (externalImages) warnings.push(`${externalImages} external Unsplash/DiceBear image references remain`);

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exit(1);
}

console.log(`PASS: ${jsFiles.length} JavaScript files checked`);
console.log(`PASS: ${inlineScripts.length} inline scripts checked`);
console.log("PASS: shared data order and duplicate guards checked");
console.log("PASS: bilingual page coverage and language-change lifecycle checked");
