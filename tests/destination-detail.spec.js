import { test, expect } from "@playwright/test";

test("generated province detail uses the responsive shared visual shell", async ({ page }) => {
  await page.goto("/destinations/sa-kaeo/");

  await expect(page.locator(".detail-hero h1")).toHaveText("สระแก้ว");
  await expect(page.locator(".detail-summary-item")).toHaveCount(3);
  await expect(page.locator(".detail-gallery figure")).toHaveCount(4);

  const geometry = await page.evaluate(() => {
    const shell = document.querySelector(".detail-page-shell").getBoundingClientRect();
    const summaryItems = [...document.querySelectorAll(".detail-summary-item")].map(item => item.getBoundingClientRect());
    const galleryItems = [...document.querySelectorAll(".detail-gallery figure")].map(item => item.getBoundingClientRect());
    return {
      viewport: window.innerWidth,
      shell: { left: shell.left, right: shell.right, width: shell.width },
      summaryTops: summaryItems.map(item => Math.round(item.top)),
      galleryTops: galleryItems.map(item => Math.round(item.top)),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });

  expect(geometry.horizontalOverflow).toBe(0);
  expect(Math.abs(geometry.shell.left - (geometry.viewport - geometry.shell.right))).toBeLessThanOrEqual(1);
  if (geometry.viewport > 800) {
    expect(new Set(geometry.summaryTops).size).toBe(1);
  } else {
    expect(new Set(geometry.summaryTops).size).toBe(3);
  }
  if (geometry.viewport > 1100) {
    expect(new Set(geometry.galleryTops).size).toBe(1);
  } else if (geometry.viewport > 520) {
    expect(new Set(geometry.galleryTops).size).toBe(2);
  } else {
    expect(new Set(geometry.galleryTops).size).toBe(4);
  }

  const brokenImages = await page.locator("img").evaluateAll(images =>
    images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute("src"))
  );
  expect(brokenImages).toEqual([]);
});

test("province detail language and theme controls update the live page", async ({ page }) => {
  await page.goto("/destinations/chiang-mai/");

  const html = page.locator("html");
  const theme = page.locator("#detail-theme");
  const language = page.locator("#detail-language");

  await expect(page.locator(".detail-summary-item")).toHaveCount(3);
  await expect(theme).toHaveAttribute("aria-label", "ใช้ธีมมืด");
  await theme.click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(theme).toHaveAttribute("aria-label", "ใช้ธีมสว่าง");

  await language.click();
  await expect(html).toHaveAttribute("lang", "en");
  await expect(page.locator(".detail-back span")).toHaveText("Back to destinations");
  await expect(page.locator(".detail-summary-item").nth(2)).toContainText("Verified");
  await expect(theme).toHaveAttribute("aria-label", "Use light theme");
});
