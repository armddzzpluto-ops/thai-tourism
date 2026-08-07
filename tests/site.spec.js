import { test, expect } from "@playwright/test";

const pages = ["home", "destinations", "promotions", "gallery", "dashboard", "about", "contact"];
const thaiPattern = /[\u0E01-\u0E3A\u0E40-\u0E5B]/;

test.beforeEach(async ({ page }) => {
  await page.route("**/*", route => {
    const request = route.request();
    const url = request.url();
    if (url.startsWith("http://127.0.0.1:4173")) return route.continue();
    if (request.resourceType() === "document") return route.continue();
    return route.fulfill({ status: 204, body: "" });
  });
  await page.addInitScript(() => {
    window.Chart = class {
      static getChart() { return null; }
      static register() {}
      destroy() {}
    };
    window.Swal = { fire: () => Promise.resolve() };
  });
  await page.goto("/");
  await page.waitForFunction(() => window.I18N && window.showPage);
});

test("all pages stay English after a live language switch", async ({ page }) => {
  await page.evaluate(() => window.I18N.setLanguage("en"));

  for (const name of pages) {
    await page.evaluate(pageName => window.showPage(pageName, {
      updateHistory: false,
      scrollToTop: false
    }), name);

    const text = await page.locator(`#page-${name}`).innerText();
    expect(text, `Thai text leaked on ${name}`).not.toMatch(thaiPattern);
  }
});

test("open overlays refresh when the language changes", async ({ page }) => {
  await page.evaluate(() => window.openModal(1));
  await page.evaluate(() => {
    window.I18N.setLanguage("th");
    window.I18N.setLanguage("en");
  });
  await expect(page.locator("#modal")).toHaveClass(/open/);
  expect(await page.locator("#modal").innerText()).not.toMatch(thaiPattern);

  await page.evaluate(() => {
    window.showPage("gallery", { updateHistory: false });
    window.openLightbox(0);
    window.I18N.setLanguage("th");
    window.I18N.setLanguage("en");
  });
  expect(await page.locator("#lightbox").innerText()).not.toMatch(thaiPattern);
});

test("English accessibility attributes contain no Thai text", async ({ page }) => {
  await page.evaluate(() => window.I18N.setLanguage("en"));
  const leaks = await page.locator("[aria-label],[placeholder],[title],[alt]").evaluateAll(elements =>
    elements.flatMap(element =>
      ["aria-label", "placeholder", "title", "alt"]
        .map(attribute => element.getAttribute(attribute))
        .filter(Boolean)
        .filter(value => /[\u0E01-\u0E3A\u0E40-\u0E5B]/.test(value))
    )
  );
  expect(leaks).toEqual([]);
});

test("routing, console and local resources remain healthy", async ({ page }) => {
  const errors = [];
  const failedLocal = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", response => {
    if (response.url().startsWith("http://127.0.0.1:4173") && response.status() >= 400) {
      failedLocal.push(`${response.status()} ${response.url()}`);
    }
  });

  for (const name of pages) {
    await page.evaluate(pageName => window.showPage(pageName), name);
    await expect(page.locator(`#page-${name}`)).toHaveClass(/active/);
    await page.reload();
    await expect(page.locator(`#page-${name}`)).toHaveClass(/active/);
  }

  expect(errors).toEqual([]);
  expect(failedLocal).toEqual([]);
});
