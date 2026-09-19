import { test, expect } from "@playwright/test";
import {
  MAX_IMAGE_BYTES,
  assertTrustedCommonsUrl,
  normalizePlainText,
  validateImageBytes
} from "../scripts/curation/curation-safety.mjs";

test("curation metadata becomes bounded inert plain text", () => {
  expect(normalizePlainText('<a href="https://example.com">Alice &amp; Bob</a>')).toBe("Alice & Bob");
  expect(normalizePlainText("&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;")).toBe("alert(1)");
  expect(normalizePlainText("x".repeat(400))).toHaveLength(280);
});

test("curation only accepts exact HTTPS Wikimedia hosts", () => {
  expect(assertTrustedCommonsUrl("https://upload.wikimedia.org/example.jpg", "upload.wikimedia.org").hostname)
    .toBe("upload.wikimedia.org");
  expect(() => assertTrustedCommonsUrl("http://upload.wikimedia.org/example.jpg", "upload.wikimedia.org")).toThrow();
  expect(() => assertTrustedCommonsUrl("https://upload.wikimedia.org.evil.test/example.jpg", "upload.wikimedia.org")).toThrow();
});

test("curation validates image MIME, signature and maximum size", () => {
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
  expect(validateImageBytes(jpeg, "image/jpeg")).toEqual(jpeg);
  expect(() => validateImageBytes(Buffer.from("not an image"), "image/jpeg")).toThrow();
  expect(() => validateImageBytes(Buffer.alloc(MAX_IMAGE_BYTES + 1), "image/png")).toThrow();
});
