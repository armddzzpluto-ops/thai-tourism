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

test("light and dark themes keep one emerald-and-gold identity", async ({ page }) => {
  const snapshot = theme => page.evaluate(selectedTheme => {
    window.applyTheme(selectedTheme);
    const root = getComputedStyle(document.documentElement);
    const read = token => root.getPropertyValue(token).trim().toUpperCase();
    return {
      primary: read("--color-emerald-dark"),
      gold: read("--color-gold-base"),
      surface: read("--color-bg-primary"),
      raisedSurface: read("--color-bg-tertiary"),
      border: read("--color-border-default"),
      subtleBorder: read("--color-border-light"),
      inverse: read("--color-text-inverse"),
      navColor: getComputedStyle(document.querySelector(".nav-logo")).color,
      heroColor: getComputedStyle(document.querySelector(".hero-title")).color
    };
  }, theme);

  const light = await snapshot("light");
  expect(light).toEqual({
    primary: "#0B6B66",
    gold: "#D4A373",
    surface: "#F6F3ED",
    raisedSurface: "#FFFDFC",
    border: "#CEC8BE",
    subtleBorder: "#E0DBD2",
    inverse: "#FFFFFF",
    navColor: "rgb(26, 28, 30)",
    heroColor: "rgb(255, 255, 255)"
  });

  const dark = await snapshot("dark");
  expect(dark).toEqual({
    primary: "#238F82",
    gold: "#E9C46A",
    surface: "#071512",
    raisedSurface: "#132A24",
    border: "RGBA(139,216,204,.12)",
    subtleBorder: "RGBA(139,216,204,.07)",
    inverse: "#F5F2E9",
    navColor: "rgb(245, 242, 233)",
    heroColor: "rgb(245, 242, 233)"
  });
});

test("critical route content renders immediately and primary controls keep readable contrast", async ({ page }) => {
  const snapshot = await page.evaluate(() => {
    const heroTitle = document.querySelector("#page-home .hero-title");
    const heroActions = document.querySelector("#page-home .hero-btns");
    const heroContent = document.querySelector("#page-home .hero-content");
    const heroStats = document.querySelector("#page-home .hero-stats");
    const heroMetricGeometry = [...heroStats.querySelectorAll(".hero-stat-card")].map(card => {
      const cardRect = card.getBoundingClientRect();
      const labelRect = card.querySelector(".stat-label").getBoundingClientRect();
      const valueRect = card.querySelector(".stat-num").getBoundingClientRect();
      return {
        cardWidth: cardRect.width,
        labelWidth: labelRect.width,
        valueWidth: valueRect.width,
        labelInsideCard: labelRect.left >= cardRect.left && labelRect.right <= cardRect.right
      };
    });
    const heroLayout = {
      iconCount: heroStats.querySelectorAll(".hero-stat-icon").length,
      statsDisplay: getComputedStyle(heroStats).display,
      contentLeft: heroContent.getBoundingClientRect().left,
      viewportWidth: innerWidth
    };
    window.showPage("promotions", { updateHistory: false, scrollToTop: false });
    const assistant = document.querySelector("#page-promotions .trip-assistant");
    const primary = document.querySelector("#page-promotions .btn-primary");
    return {
      heroAnimation: [getComputedStyle(heroTitle).animationName, getComputedStyle(heroActions).animationName],
      heroStatIcons: heroLayout.iconCount,
      heroStatsDisplay: heroLayout.statsDisplay,
      heroMetricGeometry,
      heroContentLeft: heroLayout.contentLeft,
      viewportWidth: heroLayout.viewportWidth,
      assistantOpacity: getComputedStyle(assistant).opacity,
      assistantTransform: getComputedStyle(assistant).transform,
      primaryColor: getComputedStyle(primary).color,
      primaryBackground: getComputedStyle(primary).backgroundColor
    };
  });

  expect(snapshot.heroAnimation).toEqual(["none", "none"]);
  expect(snapshot.heroStatIcons).toBe(3);
  if (snapshot.viewportWidth > 1100) {
    expect(snapshot.heroStatsDisplay).toBe("grid");
    expect(snapshot.heroContentLeft).toBeLessThan(snapshot.viewportWidth * 0.4);
    expect(snapshot.heroMetricGeometry).toHaveLength(3);
    for (const metric of snapshot.heroMetricGeometry) {
      expect(metric.labelInsideCard).toBe(true);
      expect(metric.valueWidth).toBeGreaterThan(20);
      expect(metric.labelWidth).toBeGreaterThanOrEqual(metric.cardWidth * 0.75);
    }
  } else {
    expect(snapshot.heroStatsDisplay).toBe("none");
  }
  expect(snapshot.assistantOpacity).toBe("1");
  expect(snapshot.assistantTransform).toBe("none");
  expect(snapshot.primaryColor).toBe("rgb(20, 59, 54)");
  expect(snapshot.primaryBackground).toBe("rgb(212, 163, 115)");
});

test("remote executable assets are pinned with subresource integrity", async ({ page }) => {
  const assets = await page.locator('script[src*="cdnjs.cloudflare.com"], link[rel="stylesheet"][href*="cdnjs.cloudflare.com"]').evaluateAll(elements =>
    elements.map(element => ({
      integrity: element.getAttribute("integrity"),
      crossorigin: element.getAttribute("crossorigin")
    }))
  );

  expect(assets).toHaveLength(2);
  expect(assets.every(asset => /^sha(?:384|512)-/.test(asset.integrity || ""))).toBe(true);
  expect(assets.every(asset => asset.crossorigin === "anonymous")).toBe(true);
});

test("home search suggestions remain visible beyond the search bridge", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("tt_recent_searches:th", JSON.stringify([
      "เชียงใหม่",
      "ภูเก็ต",
      "กระบี่",
      "กรุงเทพมหานคร",
      "สุราษฎร์ธานี",
      "อุบลราชธานี"
    ]));
  });
  await page.reload();
  await page.waitForFunction(() => window.I18N && window.showPage);

  await page.locator("#quick-search").focus();
  const suggestions = page.locator("#quick-search-suggestions");
  await expect(suggestions).toHaveClass(/is-open/);
  await suggestions.scrollIntoViewIfNeeded();

  const geometry = await suggestions.evaluate(box => {
    const searchBridge = box.closest(".search-bar-inner");
    const boxRect = box.getBoundingClientRect();
    const bridgeRect = searchBridge.getBoundingClientRect();
    const probe = document.elementFromPoint(
      boxRect.left + boxRect.width / 2,
      Math.min(window.innerHeight - 2, boxRect.bottom - 2)
    );

    return {
      extendsBeyondBridge: boxRect.bottom > bridgeRect.bottom + 1,
      bridgeOverflow: getComputedStyle(searchBridge).overflow,
      bottomEdgeVisible: probe === box || box.contains(probe)
    };
  });

  expect(geometry.extendsBeyondBridge).toBe(true);
  expect(geometry.bridgeOverflow).toBe("visible");
  expect(geometry.bottomEdgeVisible).toBe(true);
});

test("primary navigation keeps the intentional six-item contract while dashboard stays non-primary", async ({ page }) => {
  const expectedPages = ["home", "destinations", "promotions", "gallery", "about", "contact"];

  const desktopPages = await page.locator(".nav-links a[data-page]").evaluateAll(links =>
    links.map(link => link.getAttribute("data-page"))
  );
  const mobilePages = await page.locator(".mobile-menu a[data-page]").evaluateAll(links =>
    links.map(link => link.getAttribute("data-page"))
  );

  expect(desktopPages).toEqual(expectedPages);
  expect(mobilePages).toEqual(expectedPages);
  expect(desktopPages).not.toContain("dashboard");
  expect(mobilePages).not.toContain("dashboard");

  await page.evaluate(() => window.showPage("about", { updateHistory: false, scrollToTop: false }));
  const dashboardInternalLink = page.locator("#page-about .section-actions [onclick=\"showPage('dashboard')\"]");
  await expect(dashboardInternalLink).toBeVisible();
  await dashboardInternalLink.click();
  await expect(page.locator("#page-dashboard")).toHaveClass(/active/);
});

test("ambient surfaces and detail icons stay consistent across themes", async ({ page }) => {
  const inspectTheme = theme => page.evaluate(selectedTheme => {
    window.applyTheme(selectedTheme);
    window.showPage("about", { updateHistory: false, scrollToTop: false });
    const detailCard = document.querySelector("#page-about .detail-card");
    const detailIcon = detailCard.querySelector(".detail-icon");
    const floatingButton = document.querySelector(".fab-main-btn");
    return {
      bodyBackground: getComputedStyle(document.body).backgroundImage,
      cardBorder: getComputedStyle(detailCard).borderTopStyle,
      viewportWidth: window.innerWidth,
      iconSize: [detailIcon.offsetWidth, detailIcon.offsetHeight],
      iconRadius: getComputedStyle(detailIcon).borderRadius,
      floatingRadius: getComputedStyle(floatingButton).borderRadius,
      inlineHoverHandlers: document.querySelectorAll("[onmouseover], [onmouseout]").length
    };
  }, theme);

  for (const theme of ["light", "dark"]) {
    const snapshot = await inspectTheme(theme);
    const compact = snapshot.viewportWidth <= 640;
    expect(snapshot.bodyBackground).toContain("radial-gradient");
    expect(snapshot.cardBorder).toBe("solid");
    expect(snapshot.iconSize).toEqual(compact ? [48, 48] : [54, 54]);
    expect(snapshot.iconRadius).toBe(compact ? "14px" : "16px");
    expect(snapshot.floatingRadius).toBe("13px");
    expect(snapshot.inlineHoverHandlers).toBe(0);
  }
});

test("Home hero reports live project coverage instead of unsupported tourism totals", async ({ page }) => {
  const coverage = await page.evaluate(() => ({
    rendered: [
      Number(document.getElementById("hero-province-count")?.textContent),
      Number(document.getElementById("hero-verified-count")?.textContent),
      Number(document.getElementById("hero-gallery-count")?.textContent)
    ],
    expected: [
      window.destinations.length,
      Object.keys(window.VERIFIED_ATTRACTIONS).length,
      window.galleryImages.length
    ],
    heroText: document.querySelector(".hero-stats")?.textContent || ""
  }));

  expect(coverage.rendered).toEqual(coverage.expected);
  expect(coverage.heroText).not.toMatch(/3,200|40M\+|นักท่องเที่ยวต่อปี/);
});

test("Home hero uses the sharp local artwork and blends into the page surface", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    const snapshot = await page.evaluate(selectedTheme => {
      window.applyTheme(selectedTheme);
      const hero = document.querySelector("#page-home > .home-hero");
      const media = hero.querySelector(".hero-bg");
      return {
        media: getComputedStyle(media).backgroundImage,
        size: getComputedStyle(media).backgroundSize,
        opacity: getComputedStyle(media).opacity,
        transition: getComputedStyle(hero, "::after").backgroundImage,
        bodySize: getComputedStyle(document.body).backgroundSize,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    }, theme);

    expect(snapshot.media).toContain("assets/images/provinces/chiang-mai/hero.webp");
    expect(snapshot.size).toBe("cover");
    expect(snapshot.opacity).toBe("1");
    expect(snapshot.transition).toContain("linear-gradient");
    expect(snapshot.bodySize).not.toContain("px");
    expect(snapshot.bodySize.split(", ").every(size => size.endsWith(" 100%"))).toBe(true);
    expect(snapshot.overflow).toBe(0);
  }
});

test("buttons and icon controls use one stable geometry system", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    const snapshot = await page.evaluate(selectedTheme => {
      window.applyTheme(selectedTheme);
      window.showPage("home", { updateHistory: false, scrollToTop: false });
      const geometry = selector => {
        const element = document.querySelector(selector);
        const style = getComputedStyle(element);
        return {
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
          cssWidth: Number.parseFloat(style.width),
          cssHeight: Number.parseFloat(style.height),
          radius: style.borderRadius
        };
      };

      const primary = geometry("#page-home .btn-primary");
      window.showPage("destinations", { updateHistory: false, scrollToTop: false });
      window.openModal(window.destinations[0].id);
      const close = geometry(".modal-close");
      window.closeModalBtn();

      return {
        primary,
        filter: geometry("#page-destinations .filter-btn"),
        navSearch: geometry(".nav-search-btn"),
        theme: geometry(".theme-toggle-btn"),
        favorite: geometry(".card-fav"),
        close,
        hamburger: geometry(".hamburger"),
        isCompact: window.innerWidth <= 640
      };
    }, theme);

    expect(snapshot.primary.height).toBeGreaterThanOrEqual(46);
    expect(snapshot.primary.radius).toBe("12px");
    expect(snapshot.filter.height).toBeGreaterThanOrEqual(44);
    expect(snapshot.filter.radius).toBe("999px");
    expect(snapshot.navSearch.height).toBeGreaterThanOrEqual(44);
    expect(snapshot.navSearch.radius).toBe("12px");

    for (const control of [snapshot.theme, snapshot.favorite, snapshot.close]) {
      expect(control.cssWidth).toBeGreaterThanOrEqual(44);
      expect(control.cssHeight).toBeGreaterThanOrEqual(44);
      expect(control.radius).toBe("12px");
    }

    if (snapshot.isCompact) {
      expect(snapshot.hamburger.width).toBeGreaterThanOrEqual(44);
      expect(snapshot.hamburger.height).toBeGreaterThanOrEqual(44);
      expect(snapshot.hamburger.radius).toBe("12px");
    }
  }
});

test("route hierarchy stays compact and footer links to the verified project", async ({ page }) => {
  const hierarchy = await page.evaluate(() => {
    window.showPage("destinations", { updateHistory: false, scrollToTop: false });
    const header = document.querySelector("#page-destinations .route-header");
    const style = getComputedStyle(header);
    return {
      borderWidth: style.borderTopWidth,
      boxShadow: style.boxShadow,
      backgroundImage: style.backgroundImage
    };
  });

  expect(hierarchy).toEqual({ borderWidth: "0px", boxShadow: "none", backgroundImage: "none" });

  const source = page.locator(".footer-project-link");
  await expect(source).toHaveCount(1);
  await expect(source).toHaveAttribute("href", "https://github.com/armddzzpluto-ops/thai-tourism");
  await expect(source).toHaveAttribute("rel", /noopener/);
  await expect(page.locator(".footer-social, .social-btn, [data-placeholder-link]")).toHaveCount(0);

  await page.evaluate(() => window.I18N.setLanguage("en"));
  await expect(source).toContainText("View source on GitHub");
});

test("user-facing emoji are replaced by one stable icon system", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    const snapshot = await page.evaluate(selectedTheme => {
      window.applyTheme(selectedTheme);
      window.showPage("home", { updateHistory: false, scrollToTop: false });

      const experienceIcons = [...document.querySelectorAll(".home-category-section .experience-icon")];
      const iconGeometry = experienceIcons.map(element => {
        const style = getComputedStyle(element);
        return {
          width: element.offsetWidth,
          height: element.offsetHeight,
          radius: style.borderRadius,
          border: style.borderTopStyle,
          iconCount: element.querySelectorAll("i[class*='fa-']").length
        };
      });

      return {
        visibleEmoji: (document.body.innerText.match(/[\u{1F000}-\u{1FAFF}\u2764\u26F0\u26F1\u26E9]/gu) || []),
        experienceIcons: iconGeometry,
        logoUsesIcon: Boolean(document.querySelector(".nav-logo .logo-icon .fa-spa")),
        searchUsesIcon: Boolean(document.querySelector(".search-label .fa-magnifying-glass")),
        favoriteUsesIcon: Boolean(document.querySelector(".card-fav .fa-heart"))
      };
    }, theme);

    expect(snapshot.visibleEmoji).toEqual([]);
    expect(snapshot.logoUsesIcon).toBe(true);
    expect(snapshot.searchUsesIcon).toBe(true);
    expect(snapshot.favoriteUsesIcon).toBe(true);
    expect(snapshot.experienceIcons).toHaveLength(6);
    snapshot.experienceIcons.forEach(icon => {
      expect(icon).toEqual({
        width: 48,
        height: 48,
        radius: "14px",
        border: "solid",
        iconCount: 1
      });
    });
  }

  await page.evaluate(() => window.I18N.setLanguage("en"));
  await expect(page.locator(".mobile-menu a[data-page] > i")).toHaveCount(6);
  await expect(page.locator(".mobile-menu a[data-page] > [data-i18n-label]").first()).toHaveText("Home");

  const favorite = page.locator("#home-cards .card-fav").first();
  await expect(favorite.locator("i")).toHaveClass(/far/);
  await favorite.click();
  await expect(favorite.locator("i")).toHaveClass(/fas/);
});

test("overlays expose dialog state, close with Escape and restore focus", async ({ page }) => {
  await page.evaluate(() => window.showPage("gallery", { updateHistory: false }));
  const trigger = page.locator("#gallery-grid .gallery-item").first();
  await trigger.focus();
  await trigger.click();

  const lightbox = page.locator("#lightbox");
  await expect(lightbox).toHaveAttribute("role", "dialog");
  await expect(lightbox).toHaveAttribute("aria-hidden", "false");
  await expect(lightbox.locator("button").first()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(lightbox).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
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

test("Smart Trip Assistant builds the sourced Northeast five-day plan safely", async ({ page }) => {
  await page.evaluate(() => window.showPage("promotions", { updateHistory: false }));
  await page.locator("#trip-assistant-input").fill('<img src=x onerror="window.tripXss=true"> อาจารย์อยากเที่ยวภาคอีสาน 5 วัน งบ 8,000 บาท');
  await page.locator("#trip-assistant-form button[type='submit']").click();

  const cards = page.locator("#trip-assistant-messages .trip-day-card");
  await expect(cards).toHaveCount(5);
  await expect(cards.nth(0)).toContainText("บุรีรัมย์");
  await expect(cards.nth(1)).toContainText("บุรีรัมย์");
  await expect(cards.nth(2)).toContainText("ศรีสะเกษ");
  await expect(cards.nth(3)).toContainText("อุบลราชธานี");
  await expect(cards.nth(4)).toContainText("อุบลราชธานี");
  await expect(page.locator(".trip-plan-source a")).toHaveAttribute("href", /^https:\/\/www\.tourismthailand\.org\/Trip-Planner\//);
  await expect(page.locator("#budget-days")).toHaveValue("5");
  await expect(page.locator("#budget-nights")).toHaveValue("4");
  await expect(page.locator("#trip-assistant-messages img")).toHaveCount(0);
  expect(await page.evaluate(() => window.tripXss === true)).toBe(false);

  await page.evaluate(() => window.I18N.setLanguage("en"));
  await expect(page.locator(".trip-plan-response h3")).toContainText("5-day Lower Northeast");
  await expect(page.locator(".trip-plan-response")).not.toContainText(thaiPattern);
  await expect(page.locator(".trip-plan-source a")).toContainText("Tourism Authority of Thailand");
});

test("Trip planner parser supports Thai and English duration phrases", async ({ page }) => {
  const parsed = await page.evaluate(() => {
    const cases = {
      thaiWithBudget: "เที่ยวภาคอีสาน 5 วัน งบ 8,000 บาท",
      thaiCompact: "5วัน",
      englishHyphen: "Isan 5-day trip",
      englishSpace: "Isan 5 day trip",
      englishTripFor: "Trip for 5 days",
      englishSentence: "I want a 5-day trip",
      defaultDays: "เที่ยวภาคอีสาน เน้นธรรมชาติ"
    };
    const parse = window.parseTripPlannerRequest;
    return Object.fromEntries(Object.entries(cases).map(([key, value]) => [key, parse(value)]));
  });

  expect(parsed.thaiWithBudget.days).toBe(5);
  expect(parsed.thaiWithBudget.budget).toBe(8000);
  expect(parsed.thaiCompact.days).toBe(5);
  expect(parsed.englishHyphen.days).toBe(5);
  expect(parsed.englishHyphen.region).toBe("northeast");
  expect(parsed.englishSpace.days).toBe(5);
  expect(parsed.englishTripFor.days).toBe(5);
  expect(parsed.englishSentence.days).toBe(5);
  expect(parsed.defaultDays.days).toBe(3);
});

test("Smart Trip Assistant suggestion chips and generic province plans remain useful", async ({ page }) => {
  await page.evaluate(() => window.showPage("promotions", { updateHistory: false }));
  expect(await page.evaluate(() => {
    const form = document.querySelector("#trip-assistant-form");
    const output = document.querySelector("#trip-assistant-messages");
    return Boolean(form && output && (form.compareDocumentPosition(output) & Node.DOCUMENT_POSITION_FOLLOWING));
  })).toBe(true);
  await page.locator(".trip-suggestion").first().click();
  await expect(page.locator(".trip-day-card")).toHaveCount(5);

  await page.evaluate(() => window.I18N.setLanguage("en"));
  await page.locator(".trip-suggestion").first().click();
  await expect(page.locator(".trip-day-card")).toHaveCount(5);
  await expect(page.locator(".trip-plan-response h3")).toContainText("5-day Lower Northeast");

  await page.evaluate(() => window.I18N.setLanguage("th"));

  await page.locator("#trip-assistant-input").fill("เที่ยวภาคเหนือ 3 วัน เน้นธรรมชาติ");
  await page.locator("#trip-assistant-form button[type='submit']").click();
  await expect(page.locator(".trip-day-card")).toHaveCount(3);
  await expect(page.locator(".trip-plan-meta")).toContainText("77 จังหวัด");
  await expect(page.locator(".trip-day-link")).toHaveCount(3);
  await expect(page.locator("#budget-days")).toHaveValue("3");
});

test("recent search history remains inert when it contains HTML", async ({ page }) => {
  const payload = '<img src=x onerror="window.recentSearchXss=true">';
  await page.evaluate(value => {
    localStorage.setItem("tt_recent_searches:th", JSON.stringify([value]));
  }, payload);

  await page.locator("#quick-search").focus();
  const recent = page.locator("#quick-search-suggestions .suggestion-item").first();
  await expect(recent).toContainText(payload);
  await expect(recent.locator("img")).toHaveCount(0);
  expect(await page.evaluate(() => window.recentSearchXss === true)).toBe(false);
});

test("gallery metadata remains inert across initial preview and gallery rendering", async ({ page }) => {
  const payload = 'caption\" onpointerenter=\"window.galleryMetadataXss=true';
  await page.evaluate(value => {
    const image = window.galleryImages.find(item => item.curated && !item.isHero) || window.galleryImages[0];
    image.cap = value;
    image.src = 'x\" onerror=\"window.gallerySourceXss=true';

    const homePreview = document.getElementById("home-gallery-preview");
    homePreview.replaceChildren();
    window.renderHomeGalleryPreview();

    const gallery = document.getElementById("gallery-grid");
    gallery.replaceChildren();
    gallery.dataset.rendered = "false";
    window.renderGallery();
  }, payload);

  const homeItem = page.locator("#home-gallery-preview .gallery-item").filter({ hasText: payload });
  const galleryItem = page.locator("#gallery-grid .gallery-item").filter({ hasText: payload });
  await expect(homeItem).toHaveCount(1);
  await expect(galleryItem).toHaveCount(1);
  await expect(page.locator('[onpointerenter*="galleryMetadataXss"]')).toHaveCount(0);
  await expect(page.locator('[onerror*="gallerySourceXss"]')).toHaveCount(0);
  expect(await page.evaluate(value => ({
    metadata: window.galleryMetadataXss === true,
    source: window.gallerySourceXss === true,
    homeSource: [...document.querySelectorAll("#home-gallery-preview .gallery-item")]
      .find(item => item.textContent.includes(value))?.querySelector("img")?.getAttribute("src"),
    gallerySource: [...document.querySelectorAll("#gallery-grid .gallery-item")]
      .find(item => item.textContent.includes(value))?.querySelector("img")?.getAttribute("src")
  }), payload)).toEqual({
    metadata: false,
    source: false,
    homeSource: "assets/images/provinces/bangkok/hero.webp",
    gallerySource: "assets/images/provinces/bangkok/hero.webp"
  });
});

test("oversized persisted enhancement state is normalized before rendering", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("tt_recent_searches:th", JSON.stringify(Array.from({ length: 500 }, (_, index) => `term-${index}`)));
    localStorage.setItem("tt_quote_date", new Date().toISOString().slice(0, 10));
    localStorage.setItem("tt_quote_index", "Infinity");
  });
  await page.reload();
  await page.locator("#quick-search").focus();

  await expect(page.locator("#quick-search-suggestions .suggestion-item")).toHaveCount(0);
  await expect(page.locator("#quick-search-suggestions .suggestion-chip")).toHaveCount(6);
  await expect(page.locator("#daily-quote")).not.toHaveText("");
  await expect(page.locator("#region-filter-list")).toBeVisible();
});

test("destination cards use real, refreshable and navigable URLs", async ({ page }) => {
  await page.goto("/#destinations");
  const detailLink = page.locator("#dest-cards .card-cta").first();
  await expect(detailLink).toHaveAttribute("href", /^destinations\/[a-z0-9-]+\/$/);
  await detailLink.click();
  await expect(page).toHaveURL(/\/destinations\/[a-z0-9-]+\/$/);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  const detailUrl = page.url();
  await page.reload();
  await expect(page).toHaveURL(detailUrl);
  await expect(page.locator("h1")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#destinations$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/destinations\/[a-z0-9-]+\/$/);
});

test("saved destinations can be filtered and stay bilingual", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("tt_favs", JSON.stringify([1, 2])));
  await page.reload();
  await page.waitForFunction(() => window.I18N && window.showPage);
  await page.evaluate(() => window.showPage("destinations", { updateHistory: false }));

  const filter = page.locator("#favorites-filter");
  await expect(filter).toContainText("รายการโปรด (2)");
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#dest-cards .dest-card")).toHaveCount(2);

  await page.locator("#dest-cards .card-fav").first().click();
  await expect(filter).toContainText("รายการโปรด (1)");
  await expect(page.locator("#dest-cards .dest-card")).toHaveCount(1);

  await page.evaluate(() => window.I18N.setLanguage("en"));
  await expect(filter).toContainText("Favorites (1)");
  expect(await page.locator("#page-destinations").innerText()).not.toMatch(thaiPattern);

  await page.locator("#dest-cards .card-fav").click();
  await expect(page.locator("#no-results")).toBeVisible();
  await expect(page.locator("#no-results-title")).toHaveText("No saved destinations match these filters");
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
    if (
      message.type() === "error" &&
      !message.text().startsWith("Failed to find a valid digest in the 'integrity' attribute for resource")
    ) errors.push(message.text());
  });
  page.on("response", response => {
    if (response.url().startsWith("http://127.0.0.1:4173") && response.status() >= 400) {
      failedLocal.push(`${response.status()} ${response.url()}`);
    }
  });

  await expect(page.locator("#loading-screen")).toHaveCount(0);

  for (const name of pages) {
    await page.evaluate(pageName => window.showPage(pageName), name);
    await expect(page.locator(`#page-${name}`)).toHaveClass(/active/);
    if (name !== "home") {
      const headerState = await page.locator(`#page-${name} .route-header`).evaluate(element => {
        const firstSection = element.closest(".page")?.querySelector(".section:first-of-type");
        return {
          opacity: getComputedStyle(element).opacity,
          transform: getComputedStyle(element).transform,
          pageAccentContent: firstSection ? getComputedStyle(firstSection, "::before").content : null
        };
      });
      expect(headerState, `${name} route header must not wait for an observer`).toEqual({
        opacity: "1",
        transform: "none",
        pageAccentContent: "none"
      });
    }
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(`#page-${name}`)).toHaveClass(/active/);
    await expect(page.locator("#loading-screen")).toHaveCount(0);
  }

  expect(errors).toEqual([]);
  expect(failedLocal).toEqual([]);
});
