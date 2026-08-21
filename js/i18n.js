/* ==========================================================
   Phase 1 — Shared Thai / English interface language system
   ========================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "tt_language";
  const supported = new Set(["th", "en"]);

  const dictionary = window.TRANSLATIONS.dictionary;

  const bindings = [
    [".nav-links a[data-page='home']", "nav.home"],
    [".nav-links a[data-page='destinations']", "nav.destinations"],
    [".nav-links a[data-page='promotions']", "nav.promotions"],
    [".nav-links a[data-page='gallery']", "nav.gallery"],
    [".nav-links a[data-page='about']", "nav.about"],
    [".nav-links a[data-page='contact']", "nav.contact"],

    [".mobile-menu a[data-page='home'] [data-i18n-label]", "mobile.home"],
    [".mobile-menu a[data-page='destinations'] [data-i18n-label]", "mobile.destinations"],
    [".mobile-menu a[data-page='promotions'] [data-i18n-label]", "mobile.promotions"],
    [".mobile-menu a[data-page='gallery'] [data-i18n-label]", "mobile.gallery"],
    [".mobile-menu a[data-page='about'] [data-i18n-label]", "mobile.about"],
    [".mobile-menu a[data-page='contact'] [data-i18n-label]", "mobile.contact"],

    [".nav-search-btn span", "nav.search"],
    [".search-label [data-i18n-label]", "search.quickLabel"],
    ["#quick-search", "search.placeholder", "placeholder"],
    ["#main-search", "search.mainPlaceholder", "placeholder"],

    [".search-tags .search-tag:nth-child(1)", "search.south"],
    [".search-tags .search-tag:nth-child(2)", "search.north"],
    [".search-tags .search-tag:nth-child(3)", "search.central"],
    [".search-tags .search-tag:nth-child(4)", "search.sea"],
    [".search-tags .search-tag:nth-child(5)", "search.mountain"],
    [".search-tags .search-tag:nth-child(6)", "search.temple"],

    [".filter-btn[data-filter-value='']", "search.all"],
    [".filter-btn[data-filter-value='ภาคเหนือ']", "search.north"],
    [".filter-btn[data-filter-value='ภาคกลาง']", "search.central"],
    [".filter-btn[data-filter-value='ภาคใต้']", "search.south"],
    [".filter-btn[data-filter-value='ภาคอีสาน']", "search.northeast"],
    [".filter-btn[data-filter-value='ภาคตะวันออก']", "search.east"],

    [".footer-brand > p", "footer.description"],
    [".footer-grid > .footer-col:nth-child(2) h4", "footer.popular"],
    [".footer-grid > .footer-col:nth-child(3) h4", "footer.quick"],
    [".footer-grid > .footer-col:nth-child(4) h4", "footer.regions"],

    [".footer-grid > .footer-col:nth-child(2) a:nth-of-type(1)", "place.phuket"],
    [".footer-grid > .footer-col:nth-child(2) a:nth-of-type(2)", "place.chiangMai"],
    [".footer-grid > .footer-col:nth-child(2) a:nth-of-type(3)", "place.krabi"],
    [".footer-grid > .footer-col:nth-child(2) a:nth-of-type(4)", "place.pattaya"],
    [".footer-grid > .footer-col:nth-child(2) a:nth-of-type(5)", "place.bangkok"],

    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(1)", "nav.home"],
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(2)", "nav.destinations"],
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(3)", "nav.promotions"],
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(4)", "nav.gallery"],
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(5) [data-i18n-label]", "nav.dashboard"],
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(6)", "nav.contact"],

    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(1)", "search.north"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(2)", "search.central"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(3)", "search.south"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(4)", "search.northeast"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(5)", "search.east"],

    [".footer-bottom span:nth-child(1)", "footer.copyright"],
    [".footer-bottom > span:nth-child(2) [data-i18n-label]", "footer.made"]
  ];

  function normalizeLanguage(value) {
    return supported.has(value) ? value : "th";
  }

  function readLanguage() {
    try {
      return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    } catch {
      return "th";
    }
  }

  let language = readLanguage();

  function interpolate(value, variables) {
    return String(value).replace(/\{(\w+)\}/g, (_, key) => {
      return Object.prototype.hasOwnProperty.call(variables, key)
        ? String(variables[key])
        : `{${key}}`;
    });
  }

  function t(key, variables = {}) {
    const selected = dictionary[language] || dictionary.th;
    const value = selected[key] ?? dictionary.th[key] ?? key;
    return interpolate(value, variables);
  }

  function setButtonLabel(button, text) {
    const icon = button.querySelector("i");

    if (!icon) {
      button.textContent = text;
      return;
    }

    let label = button.querySelector(":scope > [data-i18n-label]");

    if (!label) {
      [...button.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.remove();
      });

      label = document.createElement("span");
      label.dataset.i18nLabel = "true";
      button.appendChild(label);
    }

    label.textContent = text;
  }

  function bindFilterValues() {
    const values = ["", "ภาคเหนือ", "ภาคกลาง", "ภาคใต้", "ภาคอีสาน", "ภาคตะวันออก"];

    document.querySelectorAll(".filter-btn:not(.favorites-filter)").forEach((button, index) => {
      if (values[index] !== undefined) {
        button.dataset.filterValue = values[index];
      }
    });
  }

  function createLanguageSwitch(className = "") {
    const group = document.createElement("div");
    group.className = `language-switch ${className}`.trim();
    group.setAttribute("role", "group");

    group.innerHTML = `
      <button type="button" data-language="th">TH</button>
      <button type="button" data-language="en">EN</button>
    `;

    group.querySelectorAll("[data-language]").forEach(button => {
      button.addEventListener("click", () => setLanguage(button.dataset.language));
    });

    return group;
  }

  function installLanguageSwitches() {
    const navActions = document.querySelector(".nav-actions");
    const themeButton = document.getElementById("theme-toggle");

    if (navActions && themeButton && !navActions.querySelector(".language-switch")) {
      navActions.insertBefore(createLanguageSwitch(), themeButton);
    }

    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileMenu && !mobileMenu.querySelector(".mobile-language-switch")) {
      mobileMenu.prepend(createLanguageSwitch("mobile-language-switch"));
    }
  }

  function applyBindings() {
    bindings.forEach(([selector, key, mode = "text"]) => {
      document.querySelectorAll(selector).forEach(element => {
        const value = t(key);

        if (mode === "placeholder") {
          element.setAttribute("placeholder", value);
        } else if (element instanceof HTMLButtonElement) {
          setButtonLabel(element, value);
        } else {
          element.textContent = value;
        }
      });
    });

    const searchButton = document.querySelector(".search-btn");
    if (searchButton) setButtonLabel(searchButton, t("search.submit"));

    const acceptButton = document.querySelector("#modal .btn-primary");
    if (acceptButton) setButtonLabel(acceptButton, t("dialog.acknowledge"));

    const actionLabels = [
      ["#fab-random", "action.randomShort", "action.random"],
      ["#fab-quote", "action.quoteShort", "action.quote"],
      ["#fab-theme", "action.themeShort", "action.theme"],
      ["#fab-search", "action.searchShort", "action.search"]
    ];

    actionLabels.forEach(([selector, textKey, ariaKey]) => {
      const button = document.querySelector(selector);
      if (!button) return;
      setButtonLabel(button, t(textKey));
      button.setAttribute("aria-label", t(ariaKey));
    });

    const dialogClose = document.querySelector("#modal .modal-close");
    const lightboxClose = document.querySelector("#lightbox button");
    const articleClose = document.querySelector("#blog-modal .modal-close");

    dialogClose?.setAttribute("aria-label", t("dialog.closeDestination"));
    lightboxClose?.setAttribute("aria-label", t("dialog.closeImage"));
    articleClose?.setAttribute("aria-label", t("dialog.closeArticle"));

    document.getElementById("back-to-top")
      ?.setAttribute("aria-label", t("action.backToTop"));

    document.getElementById("fab-main")
      ?.setAttribute("aria-label", t("action.menu"));
  }

  function syncControls() {
    document.documentElement.lang = language;

    document.querySelectorAll(".language-switch").forEach(group => {
      group.setAttribute("aria-label", t("language.group"));
    });

    document.querySelectorAll("[data-language]").forEach(button => {
      const active = button.dataset.language === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute(
        "aria-label",
        t(active ? `language.${language}` : `language.${button.dataset.language}`)
      );
    });

    const hamburger = document.getElementById("hamburger");

    if (hamburger) {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-label", t(expanded ? "menu.close" : "menu.open"));
    }

    const themeButton = document.getElementById("theme-toggle");

    if (themeButton) {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      themeButton.setAttribute("aria-label", t(dark ? "theme.light" : "theme.dark"));
    }
  }

  function pageTitle(page) {
    return t(`page.${page}.title`);
  }

  function refreshDynamicCore() {
    document.querySelectorAll(".suggestion-box").forEach(box => {
      box.classList.remove("is-open");
    });

    const activeRegion = document.querySelector(".region-button.active");
    activeRegion?.click();

    const homeCards = document.getElementById("home-cards");
    if (homeCards) homeCards.dataset.rendered = "false";

    if (typeof window.renderHomeCards === "function") {
      window.renderHomeCards();
    }

    const page = window.location.hash.replace(/^#/, "") || "home";

    if (page === "destinations" && typeof window.filterCards === "function") {
      window.filterCards();
    }
  }

  function apply() {
    bindFilterValues();
    applyBindings();
    syncControls();

    const page = window.location.hash.replace(/^#/, "") || "home";
    document.title = pageTitle(page);
  }

  function setLanguage(nextLanguage, options = {}) {
    language = normalizeLanguage(nextLanguage);

    if (options.persist !== false) {
      try {
        localStorage.setItem(STORAGE_KEY, language);
      } catch {
        // Continue without persistence when storage is unavailable.
      }
    }

    apply();
    refreshDynamicCore();

    document.dispatchEvent(new CustomEvent("languagechange", {
      detail: { language }
    }));
  }

  function init() {
    installLanguageSwitches();
    apply();

    document.addEventListener("themechange", syncControls);

    const observer = new MutationObserver(records => {
      const hasElements = records.some(record =>
        [...record.addedNodes].some(node => node instanceof Element)
      );

      if (hasElements) applyBindings();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.I18N = {
    t,
    apply,
    setLanguage,
    getLanguage: () => language,
    pageTitle,
    syncControls
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* ==========================================================
   Phase 2 — Complete bilingual content for all public pages
   ========================================================== */
(function () {
  "use strict";

  const PAGE_ROOTS = "#page-home,#page-destinations,#page-promotions,#page-gallery,#page-dashboard,#page-about,#page-contact,#modal,#lightbox,#blog-modal";
  const pairs = window.TRANSLATIONS.staticPairs;
  const thToEn = new Map(pairs);
  const enToTh = new Map(pairs.map(([th, en]) => [en, th]));
  const extra = window.TRANSLATIONS.extra;
  const thaiNames = window.TRANSLATIONS.thaiNames;
  const provinceTh = window.TRANSLATIONS.provinceTh;
  const categoryTh = window.TRANSLATIONS.categoryTh;
  const sharedThai = window.TRANSLATIONS.sharedThai;
  const sharedSnapshots = {};

  function registerSharedPair(thaiValue, englishValue) {
    if (typeof thaiValue !== "string" || typeof englishValue !== "string") return;
    const thaiText = thaiValue.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const englishText = englishValue.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!thaiText || !englishText || thaiText === englishText) return;
    thToEn.set(thaiText, englishText);
    enToTh.set(englishText, thaiText);
  }

  function localizeSharedCollections(language) {
    Object.entries(sharedThai).forEach(([key, translated]) => {
      const collection = window[key];
      if (!Array.isArray(collection)) return;
      if (!sharedSnapshots[key]) sharedSnapshots[key] = structuredClone(collection);

      sharedSnapshots[key].forEach((original, index) => {
        const localized = translated[index] || {};
        Object.keys(localized).forEach(field => registerSharedPair(localized[field], original[field]));
      });

      const source = language === "th"
        ? sharedSnapshots[key].map((item, index) => ({ ...item, ...(translated[index] || {}) }))
        : sharedSnapshots[key];
      collection.splice(0, collection.length, ...structuredClone(source));
    });
  }

  const snapshots = new Map();

  const baseT = window.I18N.t.bind(window.I18N);
  window.I18N.t = function (key, variables = {}) {
    const language = window.I18N.getLanguage();
    const value = extra[language]?.[key];
    if (value) {
      return value.replace(/\{(\w+)\}/g, (match, name) =>
        Object.prototype.hasOwnProperty.call(variables, name) ? variables[name] : match
      );
    }
    return baseT(key, variables);
  };

  function translateText(value, language) {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const translated = (language === "en" ? thToEn : enToTh).get(trimmed);
    return translated ? value.replace(trimmed, translated) : value;
  }

  function translateTree(root, language) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest("script,style")) return;
      node.nodeValue = translateText(node.nodeValue, language);
    });

    const attributed = root.matches?.("[placeholder],[title],[aria-label]") ? [root, ...root.querySelectorAll("[placeholder],[title],[aria-label]")] : root.querySelectorAll("[placeholder],[title],[aria-label]");
    attributed.forEach(element => {
      ["placeholder", "title", "aria-label"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        let value = element.getAttribute(attribute);
        value = translateText(value, language);
        if (language === "en") {
          value = value
            .replace(/^เปิดรูปภาพ\s*/, "Open image: ")
            .replace(/^เปิดคลังรูปภาพ:\s*/, "Open gallery: ")
            .replace(/^แสดงรูป\s*/, "Show image ");
        } else {
          value = value
            .replace(/^Open image:\s*/, "เปิดรูปภาพ ")
            .replace(/^Open gallery:\s*/, "เปิดคลังรูปภาพ: ")
            .replace(/^Show image\s*/, "แสดงรูป ");
        }
        element.setAttribute(attribute, value);
      });
    });
  }

  function localizeDestinations(language) {
    if (!Array.isArray(window.DESTINATIONS)) return;
    window.DESTINATIONS.forEach((item, index) => {
      if (!snapshots.has(item.id)) snapshots.set(item.id, structuredClone(item));
      const original = snapshots.get(item.id);
      Object.keys(item).forEach(key => delete item[key]);
      Object.assign(item, structuredClone(original));
      item.provinceSlug = original.provinceSlug || String(original.province || original.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (language !== "th") {
        item.caption = `${original.name}, ${original.province}`;
        item.galleryCaptions = (original.galleryImages || [])
          .slice(1)
          .map((_, imageIndex) => `${original.name} image ${imageIndex + 2}`);
        return;
      }

      const name = thaiNames[index] || original.name;
      const category = categoryTh[original.category] || categoryTh.culture;
      item.name = name;
      item.province = provinceTh[original.province] || name;
      item.desc = `${name} เป็น${category.desc}`;
      item.longDesc = `${name} เป็น${category.desc} เหมาะสำหรับผู้เดินทางที่ต้องการสัมผัสเอกลักษณ์ของจังหวัดอย่างใกล้ชิด`;
      item.categoryLabel = category.label;
      item.tags = [category.label, "ท่องเที่ยวไทย", name];
      item.activities = category.activities.slice();
      item.hours = /24/.test(original.hours || "") ? "เปิดตลอด 24 ชั่วโมง" : "ตรวจสอบเวลาเปิดให้บริการก่อนเดินทาง";
      item.entry = /free/i.test(original.entry || original.price || "") ? "เข้าชมฟรี" : "ตรวจสอบค่าบริการก่อนเดินทาง";
      item.price = item.entry;
      item.best = "ตรวจสอบฤดูกาลที่เหมาะสมก่อนเดินทาง";
      item.distance = "ตรวจสอบเส้นทางจากตำแหน่งของคุณ";
      item.weather = "ตรวจสอบพยากรณ์อากาศล่าสุด";
      item.caption = `${name} จังหวัด${item.province}`;
      item.galleryCaptions = (original.galleryImages || [])
        .slice(1)
        .map((_, imageIndex) => `${name} ภาพที่ ${imageIndex + 2}`);
    });

    localizeSharedCollections(language);
    if (typeof window.__hydrateTravelData === "function") window.__hydrateTravelData();
  }

  function rerender() {
    ["home-cards", "gallery-grid", "home-gallery-preview"].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.dataset.rendered = "false";
    });
    window.renderHomeCards?.();
    window.filterCards?.();
    window.renderGallery?.();
    window.renderHomeGalleryPreview?.();
    window.hydratePromotionCardsFromSharedData?.();
    if (typeof window.Chart === "function") window.initCharts?.();

    const modal = document.getElementById("modal");
    const destinationId = Number(modal?.dataset.destinationId);
    if (modal?.classList.contains("open") && destinationId) {
      window.openModal?.(destinationId);
    }

    const lightbox = document.getElementById("lightbox");
    const imageIndex = Number(lightbox?.dataset.imageIndex);
    if (lightbox?.classList.contains("open") && Number.isInteger(imageIndex)) {
      window.openLightbox?.(imageIndex);
    }
  }

  function applyCompleteLanguage() {
    const language = window.I18N.getLanguage();
    localizeDestinations(language);
    rerender();
    translateTree(document.body, language);
    const heroDescription = document.querySelector("#page-home .hero-desc");
    if (heroDescription) {
      heroDescription.textContent = language === "en"
        ? "Explore beautiful seas, ancient temples, mountains, culture and remarkable destinations across Thailand with a digital guide designed for 2026."
        : "สำรวจทะเลสวย วัดโบราณ ภูเขา วัฒนธรรม และจุดหมายปลายทางที่น่าสนใจทั่วประเทศไทย ผ่านคู่มือท่องเที่ยวดิจิทัลที่ออกแบบมาเพื่อปี 2026";
    }
    const localizedAlts = [
      ["#page-about .about-img", "ทิวทัศน์จังหวัดเชียงใหม่ ประเทศไทย", "Chiang Mai landscape, Thailand"]
    ];
    localizedAlts.forEach(([selector, thai, english]) => {
      document.querySelector(selector)?.setAttribute("alt", language === "en" ? english : thai);
    });
  }

  const originalSubmit = window.submitContact;
  window.submitContact = function (event) {
    event?.preventDefault();
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("cf-name");
    const emailInput = document.getElementById("cf-email");
    const messageInput = document.getElementById("cf-message");
    const fields = [nameInput, emailInput, messageInput].filter(Boolean);
    fields.forEach(field => field.setAttribute("aria-invalid", String(!field.validity.valid)));

    if (!form?.checkValidity()) {
      const firstInvalid = fields.find(field => !field.validity.valid);
      firstInvalid?.focus();
      Swal.fire({
        icon: "warning",
        title: window.I18N.t("validation.title"),
        text: firstInvalid?.validity.typeMismatch ? window.I18N.t("validation.email") : window.I18N.t("validation.required"),
        confirmButtonText: window.I18N.t("dialog.ok"),
        confirmButtonColor: "var(--teal-mid)"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: window.I18N.t("validation.success"),
      text: window.I18N.t("validation.thanks").replace("{name}", nameInput.value.trim()),
      confirmButtonText: window.I18N.t("dialog.ok"),
      confirmButtonColor: "var(--teal-deep)"
    }).then(() => {
      form.reset();
      fields.forEach(field => field.removeAttribute("aria-invalid"));
    });
  };

  document.addEventListener("languagechange", applyCompleteLanguage);
  const observer = new MutationObserver(records => {
    const language = window.I18N.getLanguage();
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) translateTree(node, language);
    }));
  });

  function initCompleteLanguage() {
    applyCompleteLanguage();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCompleteLanguage, { once: true });
  } else {
    initCompleteLanguage();
  }
})();
