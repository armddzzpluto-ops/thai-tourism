/* ==========================================================
   Additive production UX layer for the existing Thailand guide.
   It depends only on the current page's inline data/functions.
   ========================================================== */
(function () {
  "use strict";

  const STORAGE = {
    theme: "tt_theme",
    recent: "tt_recent_searches",
    quoteDate: "tt_daily_quote_date",
    quoteIndex: "tt_daily_quote_index"
  };

  function tr(key, fallback, variables = {}) {
    return window.I18N?.t(key, variables) || fallback;
  }

  function getSharedQuotes() {
    return Array.isArray(window.QUOTES) ? window.QUOTES : [];
  }

  function getSharedBlogPosts() {
    const slugs = Array.isArray(window.BLOG_DESTINATION_SLUGS)
      ? window.BLOG_DESTINATION_SLUGS
      : [];
    const destinations = Array.isArray(window.DESTINATIONS) ? window.DESTINATIONS : [];
    const language = window.I18N?.getLanguage?.() || "th";

    return slugs.map((slug, index) => {
      const item = destinations.find(destination =>
        (destination.provinceSlug || destination.slug) === slug
      );
      if (!item) return null;
      const activities = Array.isArray(item.activities) ? item.activities : [];
      return {
        id: index + 1,
        destinationSlug: slug,
        category: regionLabel(item.region),
        title: language === "en" ? `${item.name} destination guide` : `คู่มือเที่ยว${item.name}`,
        date: language === "en" ? item.province : `จังหวัด${item.province}`,
        read: language === "en" ? `${activities.length} highlights` : `${activities.length} ไฮไลต์`,
        img: item.heroImage,
        excerpt: item.desc,
        body: [item.longDesc || item.desc, ...activities]
      };
    }).filter(Boolean);
  }

  function getSharedFaqs() {
    return Array.isArray(window.FAQ) ? window.FAQ : [];
  }

  function regionLabel(region) {
    const keys = {
      north: "region.north",
      central: "region.central",
      northeast: "region.northeast",
      east: "region.east",
      south: "region.south"
    };

    const fallback = {
      north: "ภาคเหนือ",
      central: "ภาคกลาง",
      northeast: "ภาคอีสาน",
      east: "ภาคตะวันออก",
      south: "ภาคใต้"
    };

    const key = keys[region];

    return key
      ? tr(key, fallback[region])
      : (region || tr("region.unknown", "ไม่ระบุภูมิภาค"));
  }

  document.addEventListener("DOMContentLoaded", initEnhancements);

  function initEnhancements() {
    installFallbacks();
    initLoader();
    initScrollProgress();
    initPageTransitions();
    initCounters();
    initSearchSuggestions();
    initRandomDestination();
    initDailyQuote();
    initRegionExplorer();
    initBlog();
    initFAQ();
    initFloatingActions();
    enhanceExistingEmptyState();
  }

  // Keeps existing inline functions from failing if CDN assets are unavailable.
  function installFallbacks() {
    if (!window.Swal) {
      window.Swal = {
        fire(options) {
          const title = typeof options === "string" ? options : (options.title || options.text || "Done");
          notify(stripHTML(title), options.icon || "info");
          return Promise.resolve();
        }
      };
    }

  }

  function initLoader() {
    const loader = document.getElementById("loading-screen");
    if (!loader) return;

    let closed = false;

    const closeLoader = () => {
      if (closed || !loader.isConnected) return;
      closed = true;
      loader.classList.add("is-hidden");
      setTimeout(() => loader.remove(), 600);
    };

    if (document.readyState === "complete") {
      setTimeout(closeLoader, 120);
    } else {
      window.addEventListener("load", () => {
        setTimeout(closeLoader, 120);
      }, { once: true });
    }

    setTimeout(closeLoader, 2500);

    window.addEventListener("pageshow", event => {
      if (event.persisted) closeLoader();
    }, { once: true });
  }

  function initTheme() {
    /* Theme is handled by the core application runtime. */
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  function applyTheme(theme, showMessage) {
    const next = theme === "dark" ? "dark" : "light";
    const toggle = document.getElementById("theme-toggle");
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE.theme, next);
    if (toggle) {
      toggle.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      toggle.setAttribute("aria-pressed", next === "dark");
    }
    if (showMessage) notify(tr(next === "dark" ? "theme.darkEnabled" : "theme.lightEnabled", next === "dark" ? "เปิดโหมดมืดแล้ว" : "เปิดโหมดสว่างแล้ว"), "info");
  }

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    let frameRequested = false;

    const update = () => {
      frameRequested = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0
        ? Math.min(1, Math.max(0, window.scrollY / max))
        : 0;

      bar.style.transform = `scaleX(${progress})`;
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  }

  function initPageTransitions() {
    const overlay = document.getElementById("page-transition");
    if (overlay) {
      overlay.classList.remove("is-active");
      overlay.setAttribute("hidden", "");
    }

    // This is a single-document app. Delaying every menu action with a
    // full-screen overlay makes navigation feel unresponsive.
  }

  function initCounters() {
    // Dashboard numbers are live data-quality indicators. Keep them exact instead
    // of briefly presenting partial values while a decorative counter runs.
    const counters = document.querySelectorAll(".stat-num, .about-badge .big");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const raw = el.textContent.trim();
    const numeric = parseFloat(raw.replace(/,/g, ""));
    if (Number.isNaN(numeric)) return;
    const suffix = raw.replace(/[0-9.,]/g, "");
    const decimals = raw.includes(".") ? 1 : 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = raw;
      return;
    }

    const start = performance.now();
    const duration = 700;

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = numeric * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initSearchSuggestions() {
    wireSearch("quick-search", term => {
      addRecentSearch(term);
      if (typeof window.doQuickSearch === "function") window.doQuickSearch();
    });
    wireSearch("main-search", term => {
      addRecentSearch(term);
      const input = document.getElementById("main-search");
      if (input) input.value = term;
      if (typeof window.filterCards === "function") window.filterCards();
    });

    const originalQuick = window.doQuickSearch;
    if (typeof originalQuick === "function") {
      window.doQuickSearch = function enhancedQuickSearch() {
        const value = document.getElementById("quick-search")?.value || "";
        addRecentSearch(value);
        originalQuick();
      };
    }
  }

  function wireSearch(inputId, onSelect) {
    const input = document.getElementById(inputId);
    if (!input || !Array.isArray(window.destinations)) return;

    const parent = input.parentElement;
    const box = document.createElement("div");
    box.className = "suggestion-box";
    box.id = `${inputId}-suggestions`;
    box.setAttribute("role", "listbox");

    input.setAttribute("aria-controls", box.id);
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("autocomplete", "off");

    parent.appendChild(box);

    let inputTimer = 0;
    let activeIndex = -1;

    const options = () => [...box.querySelectorAll("[data-search-term]")];

    const setOpen = open => {
      box.classList.toggle("is-open", open);
      input.setAttribute("aria-expanded", String(open));
      if (!open) {
        activeIndex = -1;
        input.removeAttribute("aria-activedescendant");
      }
    };

    const setActive = nextIndex => {
      const items = options();
      if (!items.length) return;

      activeIndex = (nextIndex + items.length) % items.length;

      items.forEach((item, index) => {
        const active = index === activeIndex;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      const activeItem = items[activeIndex];
      activeItem.id ||= `${box.id}-option-${activeIndex}`;
      input.setAttribute("aria-activedescendant", activeItem.id);
      activeItem.scrollIntoView({ block: "nearest" });
    };

    const choose = button => {
      const term = button?.getAttribute("data-search-term");
      if (!term) return;

      input.value = term;
      onSelect(term);
      setOpen(false);
      notify(tr("search.searching", `กำลังค้นหา: ${term}`, { term }), "info");
    };

    const render = () => {
      const query = input.value.trim().toLowerCase();
      const source = Array.isArray(window.destinations) ? window.destinations : [];
      const matches = query
        ? source.filter(destination => matchesDestination(destination, query)).slice(0, 6)
        : [];

      box.innerHTML = query
        ? renderMatches(matches)
        : renderRecentAndPopular();

      activeIndex = -1;

      options().forEach((button, index) => {
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", "false");
        button.id = `${box.id}-option-${index}`;

        button.addEventListener("mousedown", event => {
          event.preventDefault();
          choose(button);
        });
      });

      box.querySelector("[data-clear-recent]")?.addEventListener("mousedown", event => {
        event.preventDefault();
        localStorage.removeItem(recentStorageKey());
        render();
        notify(tr("search.cleared", "ล้างประวัติการค้นหาแล้ว"), "info");
      });

      setOpen(true);
    };

    input.addEventListener("input", () => {
      clearTimeout(inputTimer);
      inputTimer = setTimeout(render, 70);
    });

    input.addEventListener("focus", render);

    input.addEventListener("keydown", event => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!box.classList.contains("is-open")) render();
        setActive(activeIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!box.classList.contains("is-open")) render();
        setActive(activeIndex - 1);
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Enter") return;

      const active = options()[activeIndex];

      if (active) {
        event.preventDefault();
        choose(active);
        return;
      }

      const term = input.value.trim();
      if (term) addRecentSearch(term);
      setOpen(false);
    });

    document.addEventListener("click", event => {
      if (!box.contains(event.target) && event.target !== input) {
        setOpen(false);
      }
    });
  }

  function matchesDestination(d, q) {
    return [
      d.name,
      d.province,
      d.region,
      d.badge,
      d.desc,
      ...(d.tags || []),
      ...(d.category || []),
      ...(d.activities || []),
      ...(d.searchKeywords || [])
    ]
      .some(value => String(value).toLowerCase().includes(q));
  }

  function renderMatches(matches) {
    if (!matches.length) {
      return `<div class="empty-state"><i class="fas fa-search"></i>${tr("search.noResults", "ยังไม่พบสถานที่ที่ตรงคำค้น")}</div>`;
    }
    return `<div class="suggestion-label">${tr("search.suggestions", "คำแนะนำ")}</div>` + matches.map(d => `
      <button class="suggestion-item" type="button" data-search-term="${escapeAttr(d.name)}">
        <span><i class="fas fa-location-dot"></i> ${d.name}</span>
        <small>${regionLabel(d.region)}</small>
      </button>
    `).join("");
  }

  function renderRecentAndPopular() {
    const recent = getRecentSearches();
    const popular = destinations.slice(0, 6).map(d => d.name);
    const recentHTML = recent.length ? `
      <div class="suggestion-label">${tr("search.recent", "ค้นหาล่าสุด")} <button class="suggestion-clear" type="button" data-clear-recent>${tr("search.clear", "ล้าง")}</button></div>
      ${recent.map(term => `<button class="suggestion-item" type="button" data-search-term="${escapeAttr(term)}"><span><i class="fas fa-clock"></i> ${term}</span></button>`).join("")}
    ` : "";
    return `${recentHTML}<div class="suggestion-label">${tr("search.popular", "จุดหมายยอดนิยม")}</div>
      <div class="suggestion-chips">${popular.map(term => `<button class="suggestion-chip" type="button" data-search-term="${escapeAttr(term)}">${term}</button>`).join("")}</div>`;
  }

  function recentStorageKey() {
    return `${STORAGE.recent}:${window.I18N?.getLanguage?.() || "th"}`;
  }

  function getRecentSearches() {
    try {
      const value = JSON.parse(localStorage.getItem(recentStorageKey()) || "[]");

      return Array.isArray(value)
        ? value.filter(item => typeof item === "string" && item.trim())
        : [];
    } catch {
      localStorage.removeItem(recentStorageKey());
      return [];
    }
  }

  function addRecentSearch(term) {
    const clean = String(term || "").trim();
    if (!clean) return;
    const recent = getRecentSearches().filter(item => item.toLowerCase() !== clean.toLowerCase());
    recent.unshift(clean);
    localStorage.setItem(recentStorageKey(), JSON.stringify(recent.slice(0, 6)));
  }

  function initRandomDestination() {
    const run = () => {
      const list = destinations || [];
      if (!list.length) return;
      const pick = list[Math.floor(Math.random() * list.length)];
      if (typeof window.openModal === "function") {
        window.showPage?.("destinations");
        requestAnimationFrame(() => window.openModal(pick.id));
      }
      notify(tr("action.randomResult", `สุ่มได้: ${pick.name}`, { name: pick.name }), "success");
    };
    document.getElementById("random-destination")?.addEventListener("click", run);
    document.getElementById("fab-random")?.addEventListener("click", () => { closeFab(); run(); });
  }

  function initDailyQuote() {
    const text = document.getElementById("daily-quote");
    const author = document.getElementById("daily-quote-author");
    if (!text || !author) return;
    const quotes = getSharedQuotes();
    if (!quotes.length) return;

    function show(index) {
      const q = quotes[index % quotes.length];
      text.textContent = q.text;
      author.textContent = `- ${q.author}`;
    }

    const today = new Date().toISOString().slice(0, 10);
    let index = Number(localStorage.getItem(STORAGE.quoteIndex));
    if (localStorage.getItem(STORAGE.quoteDate) !== today || Number.isNaN(index)) {
      index = Math.floor(Math.random() * quotes.length);
      localStorage.setItem(STORAGE.quoteDate, today);
      localStorage.setItem(STORAGE.quoteIndex, String(index));
    }
    show(index);

    const refresh = () => {
      index = (index + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length;
      localStorage.setItem(STORAGE.quoteIndex, String(index));
      show(index);
      notify(tr("action.quoteChanged", "เปลี่ยนคำคมท่องเที่ยวแล้ว"), "info");
    };
    document.getElementById("refresh-quote")?.addEventListener("click", refresh);
    document.getElementById("fab-quote")?.addEventListener("click", () => {
      closeFab();
      refresh();
      document.querySelector(".smart-tools-section")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function initRegionExplorer() {
    const list = document.getElementById("region-filter-list");
    const panel = document.getElementById("region-result-panel");
    const title = document.getElementById("region-results-title");
    const meta = document.getElementById("region-results-meta");
    if (!list || !panel || !title || !meta) return;
    const regions = [...new Set(destinations.map(d => d.region))];
    panel.dataset.state = "init";
    list.innerHTML = regions.map((region, index) => `
      <button class="region-button ${index === 0 ? "active" : ""}" type="button" data-region="${escapeAttr(region)}">
        <span>${regionLabel(region)}</span><small>${destinations.filter(d => d.region === region).length}</small>
      </button>
    `).join("");

    function select(region) {
      try {
        panel.dataset.state = "loading";
        list.querySelectorAll(".region-button").forEach(btn => btn.classList.toggle("active", btn.dataset.region === region));
        const items = destinations.filter(d => d.region === region);
        title.textContent = regionLabel(region);
        meta.textContent = tr("region.found", `พบ ${items.length} สถานที่ในภูมิภาคนี้`, { count: items.length });
        panel.innerHTML = items.length ? `
          <div class="region-result-grid">
            ${items.map(d => `<button class="region-mini-card" type="button" data-destination-id="${d.id}">
              <strong>${d.name}</strong><span>${d.badge}</span>
            </button>`).join("")}
          </div>
        ` : `<div class="region-empty-state">
          <i class="fas fa-map region-empty-icon"></i>
          <p class="region-empty-title">${tr("region.emptyTitle", "ยังไม่พบสถานที่ในภูมิภาคนี้")}</p>
          <p class="region-empty-desc">${tr("region.emptyDescription", "ลองเลือกภูมิภาคอื่น หรือรีเซ็ตตัวกรองเพื่อดูทั้งหมด")}</p>
          <button type="button" class="region-reset-button">
            <i class="fas fa-redo"></i> ${tr("region.reset", "รีเซ็ตตัวกรอง")}
          </button>
        </div>`;
        panel.dataset.state = items.length ? "active" : "empty";
        panel.querySelectorAll("[data-destination-id]").forEach(card => {
          card.addEventListener("click", () => window.openModal?.(Number(card.dataset.destinationId)));
        });
        const resetButton = panel.querySelector(".region-reset-button");
        if (resetButton) {
          resetButton.addEventListener("click", () => {
            const firstButton = list.querySelector(".region-button");
            firstButton?.click();
          });
        }
      } catch (error) {
        panel.dataset.state = "error";
        panel.innerHTML = `<div class="region-empty-state">
          <i class="fas fa-triangle-exclamation region-empty-icon"></i>
          <p class="region-empty-title">${tr("region.errorTitle", "ไม่สามารถแสดงผลภูมิภาคได้")}</p>
          <p class="region-empty-desc">${tr("region.errorDescription", "ระบบแสดงผลเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")}</p>
        </div>`;
      }
    }

    list.querySelectorAll(".region-button").forEach(btn => {
      btn.addEventListener("click", () => select(btn.dataset.region));
    });
    select(regions[0]);
  }

  function initBlog() {
    const grid = document.getElementById("blog-grid");
    if (!grid) return;
    const blogPosts = getSharedBlogPosts();
    if (!blogPosts.length) return;
    grid.innerHTML = blogPosts.map(post => `
      <article class="blog-card-enhanced" tabindex="0" role="button" data-blog-id="${post.id}" data-destination-slug="${post.destinationSlug}">
        <img src="${post.img}" alt="${post.title}" loading="lazy">
        <div class="blog-card-body">
          <div class="blog-cat">${post.category}</div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <p class="blog-modal-meta">${post.date} · ${post.read}</p>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-blog-id]").forEach(card => {
      const open = () => openBlogArticle(Number(card.dataset.blogId));
      card.addEventListener("click", open);
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function openBlogArticle(id) {
    const post = getSharedBlogPosts().find(item => item.id === id);
    const modal = document.getElementById("blog-modal");
    if (!post || !modal) return;
    document.getElementById("blog-modal-img").src = post.img;
    document.getElementById("blog-modal-img").alt = post.title;
    document.getElementById("blog-modal-category").textContent = post.category;
    document.getElementById("blog-modal-title").textContent = post.title;
    document.getElementById("blog-modal-meta").textContent = `${post.date} · ${post.read}`;
    document.getElementById("blog-modal-content").innerHTML = post.body.map(p => `<p>${p}</p>`).join("");
    modal.dataset.blogId = String(id);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function initFAQ() {
    const list = document.getElementById("faq-list");
    if (!list) return;
    const faqs = getSharedFaqs();
    if (!faqs.length) return;
    list.innerHTML = faqs.map((item, index) => `
      <article class="faq-item-enhanced">
        <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
          <span>${item.q}</span><i class="fas fa-plus"></i>
        </button>
        <div class="faq-answer" id="faq-answer-${index}">
          <div class="faq-answer-inner">${item.a}</div>
        </div>
      </article>
    `).join("");

    list.querySelectorAll(".faq-item-enhanced").forEach(item => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      button.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        button.setAttribute("aria-expanded", open);
        answer.style.maxHeight = open ? `${answer.scrollHeight}px` : "0px";
      });
    });
  }

  function refreshLocalizedEnhancements() {
    document.querySelectorAll(".suggestion-box").forEach(box => {
      box.classList.remove("is-open");
      box.replaceChildren();
    });

    initRegionExplorer();
    initBlog();
    initFAQ();

    const quotes = getSharedQuotes();
    const quoteText = document.getElementById("daily-quote");
    const quoteAuthor = document.getElementById("daily-quote-author");
    const quoteIndex = Number(localStorage.getItem(STORAGE.quoteIndex)) || 0;
    const quote = quotes[quoteIndex % Math.max(quotes.length, 1)];
    if (quote && quoteText && quoteAuthor) {
      quoteText.textContent = quote.text;
      quoteAuthor.textContent = `- ${quote.author}`;
    }

    const blogModal = document.getElementById("blog-modal");
    const blogId = Number(blogModal?.dataset.blogId);
    if (blogModal?.classList.contains("open") && blogId) openBlogArticle(blogId);
  }

  document.addEventListener("languagechange", () => {
    requestAnimationFrame(refreshLocalizedEnhancements);
  });

  function initFloatingActions() {
    const top = document.getElementById("back-to-top");
    const fab = document.getElementById("fab-menu-wrap");
    const main = document.getElementById("fab-main");
    window.addEventListener("scroll", () => top?.classList.toggle("show", window.scrollY > 520), { passive: true });
    top?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    main?.addEventListener("click", () => {
      const open = fab.classList.toggle("open");
      main.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", event => {
      if (fab && !fab.contains(event.target)) closeFab();
    });
    document.getElementById("fab-search")?.addEventListener("click", () => {
      closeFab();
      window.showPage?.("destinations");
      setTimeout(() => document.getElementById("main-search")?.focus(), 320);
    });
  }

  function closeFab() {
    const fab = document.getElementById("fab-menu-wrap");
    const main = document.getElementById("fab-main");
    fab?.classList.remove("open");
    main?.setAttribute("aria-expanded", "false");
  }

  function enhanceExistingEmptyState() {
    const empty = document.getElementById("no-results");
    if (!empty) return;
    empty.classList.add("empty-state");
  }

  function notify(message, type = "success") {
    const stack = document.getElementById("toast-stack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(16px)";
      setTimeout(() => toast.remove(), 260);
    }, 2600);
  }

  function closeBlogArticle(event) {
    if (event && event.target && event.target.id !== "blog-modal") return;
    closeBlogArticleBtn();
  }

  function closeBlogArticleBtn() {
    document.getElementById("blog-modal")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function stripHTML(value) {
    const div = document.createElement("div");
    div.innerHTML = value;
    return div.textContent || div.innerText || "";
  }

  window.closeBlogArticle = closeBlogArticle;
  window.closeBlogArticleBtn = closeBlogArticleBtn;
})();
