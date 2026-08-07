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

/* ==========================================================
   Phase 2 — Complete bilingual content for all public pages
   ========================================================== */
(function () {
  "use strict";

  const PAGE_ROOTS = "#page-home,#page-destinations,#page-promotions,#page-gallery,#page-about,#page-contact,#modal,#lightbox,#blog-modal";
  const pairs = [["ค้นพบเสน่ห์ของ","Discover the charm of"],["ประเทศไทย","Thailand"],["เริ่มสำรวจ","Start exploring"],["ค้นหาจุดหมาย","Find destinations"],["จังหวัดทั่วไทย","provinces nationwide"],["นักท่องเที่ยวต่อปี","visitors per year"],["เลื่อนลง","Scroll down"],["🔍 ค้นหาสถานที่ท่องเที่ยวที่คุณสนใจ","🔍 Search for a destination"],["ค้นหา","Search"],["สถานที่แนะนำ","Featured places"],["จุดหมายปลายทาง","Destinations"],["ยอดนิยม","Popular"],["ดูทั้งหมด","View all"],["หมวดหมู่","Categories"],["ค้นพบประสบการณ์","Discover experiences"],["หลากหลาย","for every interest"],["ชายหาด","Beaches"],["วัดวาอาราม","Temples"],["ธรรมชาติ","Nature"],["ภูเขา","Mountains"],["วัฒนธรรม","Culture"],["เลือกพื้นที่ที่สนใจ","Choose an area"],["สำรวจประเทศไทยตามภูมิภาค","Explore Thailand by region"],["แถบควบคุม","Controls"],["ผลลัพธ์","Results"],["แพ็กเกจท่องเที่ยว","Travel packages"],["เลือกแพ็กเกจ","Choose the package"],["ที่ใช่สำหรับคุณ","that suits you"],["ประหยัด","Budget"],["แพ็กเกจประหยัด","Budget package"],["ครอบครัว","Family"],["แพ็กเกจครอบครัว","Family package"],["หรูหรา","Luxury"],["แพ็กเกจพรีเมียม","Premium package"],["ดูรายละเอียด","View details"],["ดูโปรโมชั่นทั้งหมด","View all promotions"],["คลังรูปภาพ","Gallery"],["ภาพสวยงาม","Beautiful images"],["จากทั่วไทย","from across Thailand"],["ดูรูปภาพทั้งหมด","View all images"],["เคล็ดลับ","Travel"],["การเดินทาง","tips"],["เลือกช่วงเวลาที่เหมาะสม","Choose the right season"],["วางแผนงบประมาณ","Plan your budget"],["เคารพวัฒนธรรมท้องถิ่น","Respect local culture"],["ใช้การขนส่งท้องถิ่น","Use local transport"],["เครื่องมืออัจฉริยะ","Smart tools"],["กำลังโหลดคำคมท่องเที่ยวประจำวัน...","Loading today's travel quote..."],["คำคมใหม่","New quote"],["สุ่มจุดหมาย","Random destination"],["สุ่มให้เลย","Surprise me"],["สภาพอากาศท่องเที่ยว","Travel weather"],["สภาพอากาศ","Weather"],["เสียงจากนักเดินทาง","Traveler stories"],["รีวิวจาก","Reviews from"],["ผู้เข้าชม","visitors"],["บันทึกการเดินทาง","Travel journal"],["บทความ","Latest"],["ล่าสุด","articles"],["คำถาม","questions"],["เริ่มต้นการเดินทาง","Start your journey"],["พร้อมสำรวจ","Ready to explore"],["แล้วหรือยัง?","Thailand?"],["เริ่มสำรวจสถานที่","Explore destinations"],["ดูโปรโมชั่น","View promotions"],["สำรวจทั่วไทย","Explore Thailand"],["สถานที่ท่องเที่ยว","Destinations"],["ทั้งหมด","All"],["ภาคเหนือ","Northern region"],["ภาคกลาง","Central region"],["ภาคใต้","Southern region"],["ภาคอีสาน","Northeastern region"],["ภาคตะวันออก","Eastern region"],["ไม่พบสถานที่ที่ค้นหา","No destinations found"],["ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น","Try another search or category"],["ข้อเสนอพิเศษ","Special offers"],["โปรโมชั่น","Promotions"],["พิเศษ 2026","2026 specials"],["ดีลที่พัก","Accommodation deals"],["ดีล","Accommodation"],["ที่พัก","deals"],["จองเลย","Book now"],["ดีลแพ็กเกจ","Package deals"],["แพ็กเกจ","Complete"],["ครบวงจร","packages"],["สอบถาม","Enquire"],["แคมเปญตามฤดูกาล","Seasonal campaigns"],["แคมเปญ","Seasonal"],["ตามฤดูกาล","campaigns"],["ฤดูกาลท่องเที่ยวสูงสุด","Peak travel season"],["สำรวจเลย","Explore now"],["สงกรานต์ 2026","Songkran 2026"],["ดูดีล","View deals"],["ลอยกระทงสุโขทัย","Sukhothai Loy Krathong"],["ดูข้อมูล","Learn more"],["ต้องการความช่วยเหลือในการ","Need help"],["วางแผนการเดินทาง?","planning your trip?"],["ติดต่อทีมงาน","Contact our team"],["ข้อมูลสถิติ","Statistics"],["แดชบอร์ด","Tourism"],["การท่องเที่ยว","dashboard"],["นักท่องเที่ยวปีนี้","visitors this year"],["รายได้จากท่องเที่ยว (บาท)","tourism revenue (THB)"],["คะแนนความพึงพอใจ","satisfaction rating"],["แหล่งท่องเที่ยวยอดนิยม","popular attractions"],["คลัง","Photo"],["รูปภาพ","gallery"],["ภาพถ่ายอันงดงามจากสถานที่ท่องเที่ยวทั่วไทย","Beautiful photographs from destinations across Thailand"],["โครงงานเพื่อการศึกษา","Educational project"],["เกี่ยวกับเรา","About us"],["ทำไมต้อง","Why"],["โครงการนี้จัดทำขึ้นเพื่อการศึกษา โดยนักศึกษาสาขาเทคโนโลยีสารสนเทศ เพื่อนำเสนอความเป็นไปได้ของเว็บไซต์การท่องเที่ยวที่ทันสมัย ใช้งานง่าย และสวยงาม","This educational project was created by information technology students to demonstrate a modern, accessible and visually engaging travel website."],["รายการจังหวัด","provinces"],["ภูมิภาคที่ครอบคลุม","regions covered"],["พันธกิจและวิสัยทัศน์","Mission and vision"],["เป้าหมาย","Our"],["ของเรา","goals"],["พันธกิจ (Mission)","Mission"],["วิสัยทัศน์ (Vision)","Vision"],["ทำไมต้องเลือกเรา","Why choose us"],["ข้อได้เปรียบ","Advantages"],["ข้อมูลครบถ้วน","Complete information"],["ใช้งานง่ายทุกอุปกรณ์","Easy on every device"],["ค้นหาและกรองข้อมูล","Search and filters"],["Dashboard สถิติ","Statistics dashboard"],["ทีมงาน","Team"],["ผู้จัดทำ","Project"],["โครงงาน","contributors"],["นักศึกษา ปวส. ปีที่ 2","Second-year vocational student"],["ออกแบบและพัฒนา Frontend","Frontend design and development"],["รวบรวมข้อมูลและเนื้อหา","Research and content"],["ออกแบบ UI และ Dashboard","UI and dashboard design"],["ที่ปรึกษาโครงงาน","Project adviser"],["สาขาวิชาเทคโนโลยีสารสนเทศ","Information Technology program"],["เทคโนโลยี","Technology"],["ที่ใช้พัฒนา","used"],["ดูแดชบอร์ดสถิติ","View statistics dashboard"],["ติดต่อเรา","Contact us"],["ส่ง","Send a"],["ข้อความ","message"],["ถึงเรา","to us"],["มีคำถาม? เราพร้อมช่วยเหลือ","Questions? We are here to help."],["อีเมล","Email"],["โทรศัพท์","Phone"],["ที่อยู่","Address"],["เวลาทำการ","Business hours"],["กรอกแบบฟอร์มติดต่อ","Contact form"],["ชื่อ-นามสกุล *","Full name *"],["หัวข้อ","Subject"],["-- เลือกหัวข้อ --","-- Select a subject --"],["แนะนำสถานที่ท่องเที่ยว","Suggest a destination"],["รายงานข้อมูลผิดพลาด","Report incorrect information"],["ความร่วมมือ / สปอนเซอร์","Partnership / sponsorship"],["สอบถามข้อมูลทั่วไป","General enquiry"],["อื่นๆ","Other"],["ข้อความ *","Message *"],["ส่งข้อความ","Send message"],["แผนที่อ้างอิงการท่องเที่ยว","Tourism reference map"],["ติดตามเราบนโซเชียลมีเดีย","Follow us on social media"],["รับทราบ","OK"],["สุ่ม","Random"],["คำคม","Quote"],["ธีม","Theme"]];
  const thToEn = new Map(pairs);
  const enToTh = new Map(pairs.map(([th, en]) => [en, th]));
  const extra = {"th":{"validation.title":"กรุณาตรวจสอบข้อมูล","validation.email":"กรุณากรอกอีเมลให้ถูกต้อง","validation.required":"ชื่อ อีเมล และข้อความจำเป็นต้องกรอก","validation.success":"ตรวจสอบแบบฟอร์มเรียบร้อย","validation.thanks":"ขอบคุณ {name} นี่เป็นแบบฟอร์มตัวอย่าง จึงยังไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์","gallery.open":"เปิดรูปภาพ","gallery.openCollection":"เปิดคลังรูปภาพ","gallery.show":"แสดงรูป","empty.gallery":"ยังไม่มีรูปภาพสำหรับแสดง","dialog.ok":"รับทราบ"},"en":{"validation.title":"Please check your information","validation.email":"Please enter a valid email address","validation.required":"Name, email and message are required","validation.success":"Form checked successfully","validation.thanks":"Thank you, {name}. This is a demonstration form, so no data was sent to a server.","gallery.open":"Open image","gallery.openCollection":"Open gallery","gallery.show":"Show image","empty.gallery":"No images are available yet","dialog.ok":"OK"}};
  const thaiNames = ["ภูเก็ต","เชียงใหม่","กระบี่","เกาะสมุย","กรุงเทพมหานคร","เชียงราย","พัทยา","สุโขทัย","เขาใหญ่","เกาะช้าง","น่าน","อุบลราชธานี","แม่ฮ่องสอน","ลำพูน","ลำปาง","พะเยา","แพร่","อุตรดิตถ์","เกาะเกร็ด","ปทุมธานี","สมุทรปราการ","พระนครศรีอยุธยา","อ่างทอง","สิงห์บุรี","ชัยนาท","ลพบุรี","สระบุรี","นครนายก","สุพรรณบุรี","นครปฐม","สมุทรสาคร","สมุทรสงคราม","กาญจนบุรี","ราชบุรี","เพชรบุรี","ประจวบคีรีขันธ์","กำแพงเพชร","พิจิตร","นครสวรรค์","อุทัยธานี","ตาก","พิษณุโลก","เพชรบูรณ์","ระยอง","จันทบุรี","ฉะเชิงเทรา","ปราจีนบุรี","สระแก้ว","บุรีรัมย์","สุรินทร์","ศรีสะเกษ","ยโสธร","อำนาจเจริญ","มุกดาหาร","นครพนม","สกลนคร","กาฬสินธุ์","ร้อยเอ็ด","มหาสารคาม","ขอนแก่น","อุดรธานี","หนองคาย","หนองบัวลำภู","เลย","ชัยภูมิ","บึงกาฬ","ชุมพร","นครศรีธรรมราช","พังงา","ตรัง","พัทลุง","สตูล","สงขลา","ปัตตานี","ยะลา","นราธิวาส","ระนอง"];
  const provinceTh = {"Phuket":"ภูเก็ต","Chiang Mai":"เชียงใหม่","Krabi":"กระบี่","Surat Thani":"สุราษฎร์ธานี","Bangkok":"กรุงเทพมหานคร","Chiang Rai":"เชียงราย","Chonburi":"ชลบุรี","Sukhothai":"สุโขทัย","Nakhon Ratchasima":"นครราชสีมา","Trat":"ตราด","Nan":"น่าน","Ubon Ratchathani":"อุบลราชธานี","Mae Hong Son":"แม่ฮ่องสอน","Lamphun":"ลำพูน","Lampang":"ลำปาง","Phayao":"พะเยา","Phrae":"แพร่","Uttaradit":"อุตรดิตถ์","Nonthaburi":"นนทบุรี","Pathum Thani":"ปทุมธานี","Samut Prakan":"สมุทรปราการ","Phra Nakhon Si Ayutthaya":"พระนครศรีอยุธยา","Ang Thong":"อ่างทอง","Sing Buri":"สิงห์บุรี","Chai Nat":"ชัยนาท","Lop Buri":"ลพบุรี","Saraburi":"สระบุรี","Nakhon Nayok":"นครนายก","Suphan Buri":"สุพรรณบุรี","Nakhon Pathom":"นครปฐม","Samut Sakhon":"สมุทรสาคร","Samut Songkhram":"สมุทรสงคราม","Kanchanaburi":"กาญจนบุรี","Ratchaburi":"ราชบุรี","Phetchaburi":"เพชรบุรี","Prachuap Khiri Khan":"ประจวบคีรีขันธ์","Kamphaeng Phet":"กำแพงเพชร","Phichit":"พิจิตร","Nakhon Sawan":"นครสวรรค์","Uthai Thani":"อุทัยธานี","Tak":"ตาก","Phitsanulok":"พิษณุโลก","Phetchabun":"เพชรบูรณ์","Rayong":"ระยอง","Chanthaburi":"จันทบุรี","Chachoengsao":"ฉะเชิงเทรา","Prachin Buri":"ปราจีนบุรี","Sa Kaeo":"สระแก้ว","Buri Ram":"บุรีรัมย์","Surin":"สุรินทร์","Si Sa Ket":"ศรีสะเกษ","Yasothon":"ยโสธร","Amnat Charoen":"อำนาจเจริญ","Mukdahan":"มุกดาหาร","Nakhon Phanom":"นครพนม","Sakon Nakhon":"สกลนคร","Kalasin":"กาฬสินธุ์","Roi Et":"ร้อยเอ็ด","Maha Sarakham":"มหาสารคาม","Khon Kaen":"ขอนแก่น","Udon Thani":"อุดรธานี","Nong Khai":"หนองคาย","Nong Bua Lamphu":"หนองบัวลำภู","Loei":"เลย","Chaiyaphum":"ชัยภูมิ","Bueng Kan":"บึงกาฬ","Chumphon":"ชุมพร","Nakhon Si Thammarat":"นครศรีธรรมราช","Phang Nga":"พังงา","Trang":"ตรัง","Phatthalung":"พัทลุง","Satun":"สตูล","Songkhla":"สงขลา","Pattani":"ปัตตานี","Yala":"ยะลา","Narathiwat":"นราธิวาส","Ranong":"ระนอง"};
  const categoryTh = {
    beach: { label: "ทะเล", desc: "จุดหมายริมทะเลที่โดดเด่นด้วยชายหาด ทิวทัศน์ และกิจกรรมทางน้ำ", activities: ["ชมชายหาดและพระอาทิตย์ตก", "ล่องเรือชมทิวทัศน์", "ชิมอาหารท้องถิ่น", "ถ่ายภาพจุดชมวิว"] },
    temple: { label: "วัดและวัฒนธรรม", desc: "จุดหมายทางประวัติศาสตร์และศาสนาที่สะท้อนศิลปวัฒนธรรมไทย", activities: ["เยี่ยมชมวัดสำคัญ", "เรียนรู้ประวัติศาสตร์ท้องถิ่น", "ชมสถาปัตยกรรม", "เดินชมย่านวัฒนธรรม"] },
    nature: { label: "ธรรมชาติ", desc: "จุดหมายธรรมชาติที่เหมาะกับการพักผ่อน ชมทิวทัศน์ และเรียนรู้ระบบนิเวศ", activities: ["เดินชมธรรมชาติ", "เยี่ยมชมจุดชมวิว", "เรียนรู้ระบบนิเวศ", "ชิมอาหารท้องถิ่น"] },
    mountain: { label: "ภูเขา", desc: "จุดหมายบนภูเขาที่มีอากาศสดชื่น เส้นทางธรรมชาติ และจุดชมวิว", activities: ["เดินป่า", "ชมพระอาทิตย์ขึ้น", "เยี่ยมชมชุมชนท้องถิ่น", "ถ่ายภาพทิวทัศน์"] },
    culture: { label: "วัฒนธรรม", desc: "จุดหมายที่โดดเด่นด้านชุมชน วิถีชีวิต อาหาร และมรดกท้องถิ่น", activities: ["สำรวจชุมชน", "ชิมอาหารท้องถิ่น", "เยี่ยมชมพิพิธภัณฑ์", "เลือกซื้อสินค้าพื้นเมือง"] }
  };
  const snapshots = new Map();

  const baseT = window.I18N.t.bind(window.I18N);
  window.I18N.t = function (key) {
    const language = window.I18N.getLanguage();
    return extra[language]?.[key] || baseT(key);
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

    root.querySelectorAll("[placeholder],[title],[aria-label]").forEach(element => {
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
      Object.assign(item, structuredClone(original));
      if (language !== "th") return;

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
      item.galleryCaptions = (original.galleryImages || []).slice(1).map((_, imageIndex) => `${name} ภาพที่ ${imageIndex + 2}`);
    });

    if (typeof window.__hydrateTravelData === "function") window.__hydrateTravelData();
  }

  function rerender() {
    ["home-cards", "gallery-grid", "home-gallery-preview"].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.dataset.rendered = "false";
    });
    window.renderHomeCards?.();
    window.renderDestCards?.(window.activeFilter || "", document.getElementById("main-search")?.value || "");
    window.renderGallery?.();
    window.renderHomeGalleryPreview?.();
    window.hydratePromotionCardsFromSharedData?.();
  }

  function applyCompleteLanguage() {
    const language = window.I18N.getLanguage();
    localizeDestinations(language);
    rerender();
    document.querySelectorAll(PAGE_ROOTS).forEach(root => translateTree(root, language));
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
    document.querySelectorAll(PAGE_ROOTS).forEach(root => observer.observe(root, { childList: true, subtree: true }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCompleteLanguage, { once: true });
  } else {
    initCompleteLanguage();
  }
})();
