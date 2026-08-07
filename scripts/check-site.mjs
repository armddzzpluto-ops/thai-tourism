import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import os from "node:os";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const failures = [];
const warnings = [];

const read = relative =>
  fs.readFileSync(path.join(root, relative), "utf8").replace(/^\uFEFF/, "");

const index = read("index.html");
const data = read("js/data.js");
const i18n = read("js/i18n.js");
const enhancements = read("js/enhancements.js");

if (/^<<<<<<< |^=======$|^>>>>>>> /m.test(index)) {
  failures.push("index.html contains Git conflict markers");
}

const scriptSources = [...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map(match => match[1]);

for (const source of new Set(scriptSources)) {
  const count = scriptSources.filter(item => item === source).length;
  if (count > 1) failures.push(`duplicate script source: ${source} (${count})`);
}

const dataIndex = scriptSources.indexOf("js/data.js");
const i18nIndex = scriptSources.indexOf("js/i18n.js");
const enhancementsIndex = scriptSources.indexOf("js/enhancements.js");

if (dataIndex === -1) failures.push("index.html does not load js/data.js");
if (i18nIndex === -1) failures.push("index.html does not load js/i18n.js");
if (enhancementsIndex === -1) failures.push("index.html does not load js/enhancements.js");
if (dataIndex !== -1 && i18nIndex !== -1 && dataIndex > i18nIndex) {
  failures.push("js/data.js must load before js/i18n.js");
}
if (i18nIndex !== -1 && enhancementsIndex !== -1 && i18nIndex > enhancementsIndex) {
  failures.push("js/i18n.js must load before js/enhancements.js");
}

if ((index.match(/let destinations\s*=\s*\[\]/g) || []).length !== 1) {
  failures.push("index.html must declare the runtime destinations array exactly once");
}

if ((data.match(/const DESTINATIONS\s*=\s*\[/g) || []).length !== 1) {
  failures.push("js/data.js must declare DESTINATIONS exactly once");
}

if (/const GALLERY\s*=\s*\[/.test(data) || /window\.GALLERY\s*=/.test(data)) {
  failures.push("legacy GALLERY data still exists in js/data.js");
}

if (/new Chart\(document\.getElementById/.test(index)) {
  failures.push("index.html creates a chart without checking the canvas first");
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

if (!index.includes("modal.dataset.destinationId")) {
  failures.push("destination modal cannot refresh its open content after a language change");
}

if (!index.includes("lightbox.dataset.imageIndex")) {
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

if (!index.includes("item.provinceSlug || item.slug")) {
  failures.push("promotion hydration does not use the stable province slug");
}

const pairMatch = i18n.match(/const pairs = (\[\[.*?\]\]);\n  const thToEn/s);
if (!pairMatch) {
  failures.push("unable to parse static bilingual text pairs");
} else {
  try {
    const parsedPairs = JSON.parse(pairMatch[1]);
    const pushedPairs = i18n.match(/pairs\.push\(([\s\S]*?)\);\n  const thToEn/);
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
      .filter(value => !/^฿[\d\s,./]+$/.test(value));

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

    const provinces = destinations.map(item => item.province).filter(Boolean);
    const uniqueProvinces = new Set(provinces);
    if (uniqueProvinces.size !== 77) {
      warnings.push(`province names are not unique: ${uniqueProvinces.size}/77`);
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
  }
} catch (error) {
  failures.push(`js/data.js runtime check failed: ${error.message}`);
}

const skipDirs = new Set([".git", ".backup", ".checkpoints", "node_modules"]);
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