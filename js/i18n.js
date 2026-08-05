/* ==========================================================
   Phase 1 — Shared Thai / English interface language system
   ========================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "tt_language";
  const supported = new Set(["th", "en"]);

  const dictionary = {
    th: {
      "language.group": "เลือกภาษา",
      "language.th": "ภาษาไทย",
      "language.en": "English",

      "nav.home": "หน้าแรก",
      "nav.destinations": "สถานที่ท่องเที่ยว",
      "nav.promotions": "โปรโมชั่น",
      "nav.gallery": "คลังรูปภาพ",
      "nav.about": "เกี่ยวกับเรา",
      "nav.contact": "ติดต่อ",
      "nav.dashboard": "แดชบอร์ด",
      "nav.search": "ค้นหา",

      "mobile.home": "🏠 หน้าแรก",
      "mobile.destinations": "📍 สถานที่ท่องเที่ยว",
      "mobile.promotions": "🎫 โปรโมชั่น",
      "mobile.gallery": "🖼 คลังรูปภาพ",
      "mobile.about": "👥 เกี่ยวกับเรา",
      "mobile.contact": "📬 ติดต่อ",

      "menu.open": "เปิดเมนู",
      "menu.close": "ปิดเมนู",
      "theme.dark": "เปลี่ยนเป็นโหมดมืด",
      "theme.light": "เปลี่ยนเป็นโหมดสว่าง",

      "search.quickLabel": "ค้นหาสถานที่ท่องเที่ยวที่คุณสนใจ",
      "search.placeholder": "เช่น ภูเก็ต, เชียงใหม่, หัวหิน...",
      "search.mainPlaceholder": "ค้นหาสถานที่...",
      "search.submit": "ค้นหา",
      "search.all": "ทั้งหมด",
      "search.suggestions": "คำแนะนำ",
      "search.recent": "ค้นหาล่าสุด",
      "search.clear": "ล้าง",
      "search.popular": "จุดหมายยอดนิยม",
      "search.noResults": "ยังไม่พบสถานที่ที่ตรงคำค้น",
      "search.searching": "กำลังค้นหา: {term}",
      "search.cleared": "ล้างประวัติการค้นหาแล้ว",
      "search.south": "ภาคใต้",
      "search.north": "ภาคเหนือ",
      "search.central": "ภาคกลาง",
      "search.northeast": "ภาคอีสาน",
      "search.east": "ภาคตะวันออก",
      "search.sea": "เที่ยวทะเล",
      "search.mountain": "เที่ยวภูเขา",
      "search.temple": "วัดและวัฒนธรรม",

      "region.north": "ภาคเหนือ",
      "region.central": "ภาคกลาง",
      "region.northeast": "ภาคอีสาน",
      "region.east": "ภาคตะวันออก",
      "region.south": "ภาคใต้",
      "region.unknown": "ไม่ระบุภูมิภาค",
      "region.found": "พบ {count} สถานที่ในภูมิภาคนี้",
      "region.emptyTitle": "ยังไม่พบสถานที่ในภูมิภาคนี้",
      "region.emptyDescription": "ลองเลือกภูมิภาคอื่น หรือรีเซ็ตตัวกรองเพื่อดูทั้งหมด",
      "region.reset": "รีเซ็ตตัวกรอง",
      "region.errorTitle": "ไม่สามารถแสดงผลภูมิภาคได้",
      "region.errorDescription": "ระบบแสดงผลเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",

      "dialog.closeDestination": "ปิดรายละเอียดสถานที่",
      "dialog.closeImage": "ปิดรูปภาพ",
      "dialog.closeArticle": "ปิดบทความ",
      "dialog.acknowledge": "รับทราบ",
      "dialog.temperature": "อุณหภูมิ",
      "dialog.bestTime": "ช่วงเวลาดีที่สุด",
      "dialog.distance": "ระยะทาง",
      "dialog.rating": "คะแนน",
      "dialog.maps": "แผนที่ Google Maps",
      "dialog.official": "เว็บไซต์การท่องเที่ยวทางการ",

      "favorite.added": "เพิ่มในรายการโปรดแล้ว!",
      "favorite.removed": "นำออกจากรายการโปรดแล้ว",

      "action.backToTop": "กลับขึ้นด้านบน",
      "action.random": "สุ่มสถานที่",
      "action.quote": "แสดงคำคมประจำวัน",
      "action.theme": "สลับธีม",
      "action.search": "เปิดการค้นหาสถานที่",
      "action.menu": "เปิดเมนูลัด",
      "action.randomShort": "สุ่ม",
      "action.quoteShort": "คำคม",
      "action.themeShort": "ธีม",
      "action.searchShort": "ค้นหา",
      "action.randomResult": "สุ่มได้: {name}",
      "action.quoteChanged": "เปลี่ยนคำคมท่องเที่ยวแล้ว",

      "footer.description": "แหล่งรวมข้อมูลการท่องเที่ยวในประเทศไทย ครบครันทุกภูมิภาค จัดทำโดยนักศึกษา ปวส.",
      "footer.popular": "สถานที่ยอดนิยม",
      "footer.quick": "ลิงก์ด่วน",
      "footer.regions": "ภูมิภาค",
      "footer.copyright": "© 2026 Thailand Travel Guide | โครงงานวิชาชีพ ปวส. สาขาเทคโนโลยีสารสนเทศ",
      "footer.made": "สร้างด้วยใจในประเทศไทย ❤️",
      "footer.placeholder": "ลิงก์นี้ยังไม่เปิดใช้งาน",

      "place.phuket": "ภูเก็ต",
      "place.chiangMai": "เชียงใหม่",
      "place.krabi": "กระบี่",
      "place.pattaya": "พัทยา",
      "place.bangkok": "กรุงเทพฯ",

      "page.home.title": "Thailand Travel Guide | ท่องเที่ยวไทย",
      "page.destinations.title": "สถานที่ท่องเที่ยว | Thailand Travel Guide",
      "page.promotions.title": "โปรโมชั่น | Thailand Travel Guide",
      "page.gallery.title": "คลังรูปภาพ | Thailand Travel Guide",
      "page.about.title": "เกี่ยวกับเรา | Thailand Travel Guide",
      "page.contact.title": "ติดต่อ | Thailand Travel Guide",
      "page.dashboard.title": "แดชบอร์ด | Thailand Travel Guide",

      "system.imageUnavailable": "ไม่สามารถโหลดรูปภาพได้"
    },

    en: {
      "language.group": "Choose language",
      "language.th": "Thai",
      "language.en": "English",

      "nav.home": "Home",
      "nav.destinations": "Destinations",
      "nav.promotions": "Promotions",
      "nav.gallery": "Gallery",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.dashboard": "Dashboard",
      "nav.search": "Search",

      "mobile.home": "🏠 Home",
      "mobile.destinations": "📍 Destinations",
      "mobile.promotions": "🎫 Promotions",
      "mobile.gallery": "🖼 Gallery",
      "mobile.about": "👥 About",
      "mobile.contact": "📬 Contact",

      "menu.open": "Open menu",
      "menu.close": "Close menu",
      "theme.dark": "Switch to dark mode",
      "theme.light": "Switch to light mode",

      "search.quickLabel": "Find a destination that interests you",
      "search.placeholder": "Try Phuket, Chiang Mai, or Hua Hin...",
      "search.mainPlaceholder": "Search destinations...",
      "search.submit": "Search",
      "search.all": "All",
      "search.suggestions": "Suggestions",
      "search.recent": "Recent searches",
      "search.clear": "Clear",
      "search.popular": "Popular destinations",
      "search.noResults": "No destinations match your search",
      "search.searching": "Searching for: {term}",
      "search.cleared": "Recent searches cleared",
      "search.south": "South",
      "search.north": "North",
      "search.central": "Central",
      "search.northeast": "Northeast",
      "search.east": "East",
      "search.sea": "Beaches",
      "search.mountain": "Mountains",
      "search.temple": "Temples & Culture",

      "region.north": "North",
      "region.central": "Central",
      "region.northeast": "Northeast",
      "region.east": "East",
      "region.south": "South",
      "region.unknown": "Unspecified region",
      "region.found": "{count} destinations found in this region",
      "region.emptyTitle": "No destinations found in this region",
      "region.emptyDescription": "Choose another region or reset the filter to view all destinations.",
      "region.reset": "Reset filter",
      "region.errorTitle": "Unable to display this region",
      "region.errorDescription": "An error occurred while rendering the region. Please try again.",

      "dialog.closeDestination": "Close destination details",
      "dialog.closeImage": "Close image",
      "dialog.closeArticle": "Close article",
      "dialog.acknowledge": "Got it",
      "dialog.temperature": "Temperature",
      "dialog.bestTime": "Best time to visit",
      "dialog.distance": "Distance",
      "dialog.rating": "Rating",
      "dialog.maps": "Google Maps",
      "dialog.official": "Official tourism website",

      "favorite.added": "Added to favorites",
      "favorite.removed": "Removed from favorites",

      "action.backToTop": "Back to top",
      "action.random": "Choose a random destination",
      "action.quote": "Show the daily quote",
      "action.theme": "Switch theme",
      "action.search": "Open destination search",
      "action.menu": "Open quick actions",
      "action.randomShort": "Random",
      "action.quoteShort": "Quote",
      "action.themeShort": "Theme",
      "action.searchShort": "Search",
      "action.randomResult": "Random destination: {name}",
      "action.quoteChanged": "Travel quote updated",

      "footer.description": "A digital guide to destinations across every region of Thailand, created as a Higher Vocational Certificate student project.",
      "footer.popular": "Popular destinations",
      "footer.quick": "Quick links",
      "footer.regions": "Regions",
      "footer.copyright": "© 2026 Thailand Travel Guide | Higher Vocational Certificate Project in Information Technology",
      "footer.made": "Made with care in Thailand ❤️",
      "footer.placeholder": "This link is not available yet",

      "place.phuket": "Phuket",
      "place.chiangMai": "Chiang Mai",
      "place.krabi": "Krabi",
      "place.pattaya": "Pattaya",
      "place.bangkok": "Bangkok",

      "page.home.title": "Thailand Travel Guide | Home",
      "page.destinations.title": "Destinations | Thailand Travel Guide",
      "page.promotions.title": "Promotions | Thailand Travel Guide",
      "page.gallery.title": "Gallery | Thailand Travel Guide",
      "page.about.title": "About | Thailand Travel Guide",
      "page.contact.title": "Contact | Thailand Travel Guide",
      "page.dashboard.title": "Dashboard | Thailand Travel Guide",

      "system.imageUnavailable": "Image unavailable"
    }
  };

  const bindings = [
    [".nav-links a[data-page='home']", "nav.home"],
    [".nav-links a[data-page='destinations']", "nav.destinations"],
    [".nav-links a[data-page='promotions']", "nav.promotions"],
    [".nav-links a[data-page='gallery']", "nav.gallery"],
    [".nav-links a[data-page='about']", "nav.about"],
    [".nav-links a[data-page='contact']", "nav.contact"],

    [".mobile-menu a[data-page='home']", "mobile.home"],
    [".mobile-menu a[data-page='destinations']", "mobile.destinations"],
    [".mobile-menu a[data-page='promotions']", "mobile.promotions"],
    [".mobile-menu a[data-page='gallery']", "mobile.gallery"],
    [".mobile-menu a[data-page='about']", "mobile.about"],
    [".mobile-menu a[data-page='contact']", "mobile.contact"],

    [".nav-search-btn span", "nav.search"],
    [".search-label", "search.quickLabel"],
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
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(5)", "nav.dashboard"],
    [".footer-grid > .footer-col:nth-child(3) a:nth-of-type(6)", "nav.contact"],

    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(1)", "search.north"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(2)", "search.central"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(3)", "search.south"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(4)", "search.northeast"],
    [".footer-grid > .footer-col:nth-child(4) a:nth-of-type(5)", "search.east"],

    [".footer-bottom span:nth-child(1)", "footer.copyright"],
    [".footer-bottom span:nth-child(2)", "footer.made"]
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

    document.querySelectorAll(".filter-btn").forEach((button, index) => {
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