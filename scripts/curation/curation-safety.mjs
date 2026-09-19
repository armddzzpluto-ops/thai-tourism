const HTML_ENTITIES = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", '"']
]);

const MAX_ENTITY_DECODE_PASSES = 4;
export const MAX_IMAGE_BYTES = 24 * 1024 * 1024;

function decodeHtmlEntitiesOnce(value) {
  return value.replace(/&(?:#(\d{1,7})|#x([\da-f]{1,6})|([a-z]+));/gi, (match, decimal, hexadecimal, named) => {
    if (decimal || hexadecimal) {
      const codePoint = Number.parseInt(decimal || hexadecimal, decimal ? 10 : 16);
      return Number.isSafeInteger(codePoint) && codePoint > 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : " ";
    }

    return HTML_ENTITIES.get(String(named).toLowerCase()) ?? match;
  });
}

export function normalizePlainText(value, fallback = "") {
  let decoded = String(value || fallback).slice(0, 10_000);
  for (let pass = 0; pass < MAX_ENTITY_DECODE_PASSES; pass += 1) {
    const next = decodeHtmlEntitiesOnce(decoded);
    if (next === decoded) break;
    decoded = next;
  }

  let text = "";
  let insideTag = false;
  for (const character of decoded) {
    if (character === "<") {
      insideTag = true;
      text += " ";
    } else if (character === ">") {
      insideTag = false;
      text += " ";
    } else if (!insideTag) {
      text += character;
    }
  }

  return text.replace(/\s+/g, " ").trim().slice(0, 280);
}

export function assertTrustedCommonsUrl(value, expectedHost) {
  const url = new URL(String(value));
  if (url.protocol !== "https:" || url.hostname !== expectedHost || url.username || url.password) {
    throw new Error(`Untrusted Wikimedia URL: ${url.origin}`);
  }
  return url;
}

export function validateImageBytes(value, contentType = "") {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  const mime = String(contentType).split(";", 1)[0].trim().toLowerCase();
  const signatures = {
    "image/jpeg": bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
    "image/png": bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    "image/webp": bytes.length >= 12
      && bytes.subarray(0, 4).toString("ascii") === "RIFF"
      && bytes.subarray(8, 12).toString("ascii") === "WEBP"
  };

  if (!signatures[mime]) throw new Error(`Unsupported or invalid image response: ${mime || "missing content type"}`);
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error(`Image response exceeds ${MAX_IMAGE_BYTES} bytes`);
  return bytes;
}
