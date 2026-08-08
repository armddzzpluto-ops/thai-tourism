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

test("Budget calculator uses user inputs and articles resolve shared destinations", async ({ page }) => {
  await page.evaluate(() => window.I18N.setLanguage("en"));
  const result = await page.evaluate(() => {
    const slugs = window.CROSS_PAGE_DESTINATION_SLUGS.slice(0, 3);
    const expected = slugs.map(slug => {
      const item = window.destinations.find(destination =>
        (destination.provinceSlug || destination.slug) === slug
      );
      return {
        name: item.name,
        image: item.heroImage
      };
    });
    const articleCards = [...document.querySelectorAll("#blog-grid [data-destination-slug]")]
      .map(card => {
        const destination = window.destinations.find(item =>
          (item.provinceSlug || item.slug) === card.dataset.destinationSlug
        );
        return [card.querySelector("img")?.getAttribute("src"), destination.heroImage];
      });
    return {
      expected,
      home: [...document.querySelectorAll("#home-trip-grid .dest-card")].map(card => ({
        name: card.querySelector(".card-title")?.textContent.trim(),
        image: card.querySelector("img")?.getAttribute("src")
      })),
      articleCards
    };
  });

  expect(result.home).toEqual(result.expected);
  expect(result.articleCards).toHaveLength(6);
  expect(result.articleCards.every(([image, expected]) => image === expected)).toBe(true);

  await page.evaluate(() => window.showPage("promotions", { updateHistory: false }));
  await page.locator("#budget-travelers").fill("2");
  await page.locator("#budget-days").fill("3");
  await page.locator("#budget-nights").fill("2");
  await page.locator("#budget-room").fill("1500");
  await page.locator("#budget-food").fill("500");
  await page.locator("#budget-transport").fill("300");
  await page.locator("#budget-activities").fill("1000");
  await page.locator("#budget-other").fill("200");
  await expect(page.locator("#budget-total")).toContainText("10,000");
  await expect(page.locator("#budget-per-person")).toContainText("5,000");
  await expect(page.locator("#page-promotions")).not.toContainText("Sample price");
});

test("Dashboard values are calculated from live shared data", async ({ page }) => {
  await page.evaluate(() => window.showPage("dashboard", { updateHistory: false }));
  const result = await page.evaluate(() => ({
    expected: [
      window.destinations.length,
      window.galleryImages.length,
      window.destinations.filter(item => item.galleryCurated === true).length,
      new Set(window.destinations.map(item => item.region).filter(Boolean)).size
    ],
    rendered: [...document.querySelectorAll("#dashboard-stats .dash-num")]
      .map(element => Number(element.textContent.trim())),
    sources: [...document.querySelectorAll("#dashboard-stats .dash-stat")]
      .map(element => element.dataset.source)
  }));

  expect(result.rendered).toEqual(result.expected);
  expect(result.sources).toEqual(["destinations", "destinations", "destinations", "destinations"]);
});

test("province and verified attraction records remain separate", async ({ page }) => {
  const result = await page.evaluate(() => ({
    provinces: window.destinations.length,
    verified: Object.keys(window.VERIFIED_ATTRACTIONS).length,
    wrongTypes: window.destinations.filter(item => item.recordType !== "province").length,
    promotedActivities: window.destinations.filter(item =>
      !item.primaryAttraction && Array.isArray(item.attractions) && item.attractions.length
    ).length
  }));

  expect(result).toEqual({ provinces: 77, verified: 5, wrongTypes: 0, promotedActivities: 0 });

  await page.evaluate(() => window.openModal(5));
  await expect(page.locator("#modal-info")).toContainText("พระบรมมหาราชวัง");
  await expect(page.locator("#modal-info a[href*='google.com/maps/search']")).toHaveCount(1);
  await expect(page.locator("#modal-info a[href*='agoda.com/search']")).toHaveCount(1);
  await expect(page.locator("#modal-info .modal-info-item")).toHaveCount(3);

  await page.evaluate(() => window.openModal(6));
  await expect(page.locator("#modal-info")).toContainText("กำลังรอตรวจสอบ");
});

test("page semantics, mobile layout and primary tap targets stay accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const language of ["th", "en"]) {
    await page.evaluate(lang => window.I18N.setLanguage(lang), language);

    for (const name of pages) {
      await page.evaluate(pageName => window.showPage(pageName, {
        updateHistory: false,
        scrollToTop: false
      }), name);

      const result = await page.locator(`#page-${name}`).evaluate(root => ({
        h1Count: root.querySelectorAll("h1").length,
        overflow: Math.max(document.documentElement.scrollWidth - window.innerWidth, 0)
      }));

      expect(result.h1Count, `${language}/${name} must have one primary heading`).toBe(1);
      expect(result.overflow, `${language}/${name} must not overflow horizontally`).toBe(0);
    }
  }

  await page.evaluate(() => window.showPage("home", { updateHistory: false }));
  const undersized = await page.locator(".card-fav, .search-tag, .region-mini-card").evaluateAll(elements =>
    elements.filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40);
    }).map(element => element.className)
  );
  expect(undersized).toEqual([]);
});

test("reduced-motion users receive visible content without reveal transitions", async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 }
  });
  const reducedPage = await context.newPage();
  await reducedPage.goto("/");
  await reducedPage.waitForFunction(() => window.showPage);
  await reducedPage.evaluate(() => window.showPage("gallery", { updateHistory: false }));

  const hidden = await reducedPage.locator("#page-gallery .fade-in, #page-gallery .reveal").evaluateAll(elements =>
    elements.filter(element => Number(getComputedStyle(element).opacity) === 0).length
  );
  expect(hidden).toBe(0);
  await context.close();
});

test("routing, console and local resources remain healthy", async ({ page }) => {
  test.setTimeout(90_000);
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
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(`#page-${name}`)).toHaveClass(/active/);
  }

  expect(errors).toEqual([]);
  expect(failedLocal).toEqual([]);
});
