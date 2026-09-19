import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  MAX_IMAGE_BYTES,
  assertTrustedCommonsUrl,
  normalizePlainText,
  validateImageBytes
} from "./curation-safety.mjs";

const root = process.cwd();
const provinceRoot = path.join(root, "assets", "images", "provinces");
const sourcePath = path.join(root, "scripts", "curation", "showcase-gallery-sources.json");
const manifestPath = path.join(provinceRoot, "manifest.json");
const validationPath = path.join(provinceRoot, "validation-report.json");
const apiUrl = "https://commons.wikimedia.org/w/api.php";
const userAgent = "ThaiTourismShowcaseCurator/1.0 (https://github.com/armddzzpluto-ops/thai-tourism)";

const readJson = file => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const commandExists = command => spawnSync(command, ["-version"], { stdio: "ignore" }).status === 0;
const cwebp = commandExists("cwebp") ? "cwebp" : null;
const imagemagick = commandExists("magick") ? "magick" : (commandExists("convert") ? "convert" : null);

if (!cwebp && !imagemagick) {
  throw new Error("Image conversion requires cwebp or ImageMagick (magick/convert).");
}

const sources = readJson(sourcePath);
const showcaseSlugs = Object.keys(sources);
if (showcaseSlugs.length !== 5 || Object.values(sources).some(item => item.images?.length !== 3)) {
  throw new Error("The showcase source manifest must contain exactly five provinces and three images per province.");
}
const requestedSlugs = process.argv.slice(2);
const slugs = requestedSlugs.length ? requestedSlugs : showcaseSlugs;
const unknownSlugs = slugs.filter(slug => !sources[slug]);
if (unknownSlugs.length) throw new Error(`Unknown showcase province: ${unknownSlugs.join(", ")}`);

const manifest = readJson(manifestPath);
const validation = readJson(validationPath);
const manifestBySlug = new Map(manifest.map(item => [item.slug, item]));
const validationBySlug = new Map(validation.map(item => [item.slug, item]));

async function resolveCommonsFile(fileTitle) {
  const url = new URL(apiUrl);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: "1800"
  });

  const response = await fetch(url, {
    headers: { "User-Agent": userAgent },
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error(`Commons metadata request failed (${response.status}): ${fileTitle}`);
  const payload = await response.json();
  const page = Object.values(payload.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url || !info?.descriptionurl || !String(info.mime || "").startsWith("image/")) {
    throw new Error(`Commons image could not be resolved: ${fileTitle}`);
  }

  return {
    downloadUrl: assertTrustedCommonsUrl(info.thumburl || info.url, "upload.wikimedia.org"),
    imageSource: assertTrustedCommonsUrl(info.descriptionurl, "commons.wikimedia.org").href,
    photoCredit: normalizePlainText(info.extmetadata?.Artist?.value) || "Wikimedia Commons contributor",
    license: normalizePlainText(info.extmetadata?.LicenseShortName?.value || info.extmetadata?.UsageTerms?.value)
  };
}

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent },
    redirect: "error",
    signal: AbortSignal.timeout(120000)
  });
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${url}`);
  const declaredSize = Number(response.headers.get("content-length") || 0);
  if (declaredSize > MAX_IMAGE_BYTES) throw new Error(`Image response exceeds ${MAX_IMAGE_BYTES} bytes`);
  if (!response.body) throw new Error(`Image response has no body: ${url}`);

  const reader = response.body.getReader();
  const chunks = [];
  let receivedSize = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    receivedSize += value.byteLength;
    if (receivedSize > MAX_IMAGE_BYTES) {
      await reader.cancel();
      throw new Error(`Image response exceeds ${MAX_IMAGE_BYTES} bytes`);
    }
    chunks.push(Buffer.from(value));
  }

  return validateImageBytes(Buffer.concat(chunks, receivedSize), response.headers.get("content-type"));
}

function convertToWebp(input, output) {
  if (cwebp) {
    execFileSync(cwebp, ["-quiet", "-q", "82", "-resize", "1600", "0", "-", "-o", output], { input });
    return;
  }

  const args = imagemagick === "magick"
    ? ["convert", "-", "-auto-orient", "-resize", "1600x1600>", "-quality", "82", output]
    : ["-", "-auto-orient", "-resize", "1600x1600>", "-quality", "82", output];
  execFileSync(imagemagick, args, { input });
}

for (const slug of slugs) {
  console.log(`Curating ${slug}...`);
  const provinceSource = sources[slug];
  const provinceMeta = manifestBySlug.get(slug);
  if (!provinceMeta) throw new Error(`Province is missing from the manifest: ${slug}`);

  const provinceDir = path.join(provinceRoot, slug);
  const galleryImages = [];
  const galleryAttribution = [];

  for (const [index, image] of provinceSource.images.entries()) {
    const resolved = await resolveCommonsFile(image.fileTitle);
    const relativeOutput = `assets/images/provinces/${slug}/gallery-${index + 1}.webp`;
    const absoluteOutput = path.join(root, relativeOutput);
    const input = await downloadImage(resolved.downloadUrl);
    convertToWebp(input, absoluteOutput);
    console.log(`  gallery-${index + 1}: ${image.fileTitle}`);

    galleryImages.push(relativeOutput);
    galleryAttribution.push({
      province: provinceSource.province,
      slug,
      role: `gallery-${index + 1}`,
      file: relativeOutput,
      caption: image.captionEn,
      captionTh: image.captionTh,
      photoCredit: normalizePlainText(image.photoCredit) || resolved.photoCredit,
      license: resolved.license,
      imageSource: resolved.imageSource,
      isFallback: false
    });
  }

  for (const retiredIndex of [4, 5]) {
    const retired = path.join(provinceDir, `gallery-${retiredIndex}.webp`);
    if (fs.existsSync(retired)) fs.rmSync(retired);
  }

  const metadataPath = path.join(provinceDir, "metadata.json");
  const metadata = readJson(metadataPath);
  const hero = Array.isArray(metadata.attribution)
    ? metadata.attribution.find(item => item.role === "hero")
    : null;
  metadata.galleryImages = galleryImages;
  metadata.attribution = [...(hero ? [hero] : []), ...galleryAttribution];
  writeJson(metadataPath, metadata);

  provinceMeta.galleryImages = galleryImages;
  provinceMeta.attribution = metadata.attribution;

  const validationRow = validationBySlug.get(slug);
  if (!validationRow) throw new Error(`Province is missing from validation data: ${slug}`);
  validationRow.status = "complete";
  validationRow.galleryCount = 3;
  validationRow.fallbackCount = 0;
  validationRow.reviewedOn = "2026-09-18";
}

writeJson(manifestPath, manifest);
writeJson(validationPath, validation);
console.log(`Curated showcase galleries: ${slugs.join(", ")}`);
