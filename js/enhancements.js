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

  function getSharedQuotes() {
    return Array.isArray(window.QUOTES) ? window.QUOTES : [];
  }

  function getSharedWeatherSamples() {
    if (!Array.isArray(window.WEATHER)) return [];
    return window.WEATHER.map(item => ({
      city: item.city,
      region: item.province,
      temp: `${item.tempC}°C`,
      condition: item.condition,
      humidity: item.humidity,
      season: item.wind
    }));
  }

  function getSharedTestimonials() {
    if (!Array.isArray(window.REVIEWS)) return [];
    return window.REVIEWS.map(item => ({
      name: item.name,
      location: item.loc,
      rating: item.rating,
      destination: item.place,
      avatar: item.avatar,
      text: item.text
    }));
  }

  function getSharedBlogPosts() {
    if (!Array.isArray(window.BLOG)) return [];
    return window.BLOG.map(item => ({
      id: item.id,
      category: item.cat,
      title: item.title,
      date: item.date,
      read: item.readtime,
      img: item.img,
      excerpt: item.excerpt,
      body: [String(item.body || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()]
    }));
  }

  function getSharedFaqs() {
    return Array.isArray(window.FAQ) ? window.FAQ : [];
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
    initWeatherCards();
    initRegionExplorer();
    initTestimonials();
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

    if (!window.Chart) {
      window.Chart = function ChartFallback(canvas) {
        const ctx = canvas && canvas.getContext && canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rootStyles = getComputedStyle(document.documentElement);
        ctx.fillStyle = rootStyles.getPropertyValue("--color-accent").trim() || rootStyles.getPropertyValue("--accent").trim();
        ctx.font = "16px sans-serif";
        ctx.fillText("ไม่สามารถแสดงกราฟตัวอย่างในโหมดออฟไลน์", 24, 46);
      };
    }
  }

  function initLoader() {
    const loader = document.getElementById("loading-screen");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("is-hidden"), 450);
      setTimeout(() => loader.remove(), 1050);
    });
  }

  function initTheme() {
    /* Theme handled by script.js Theme module */
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
    if (showMessage) notify(next === "dark" ? "เปิดโหมดมืดแล้ว" : "เปิดโหมดสว่างแล้ว", "info");
  }

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initPageTransitions() {
    const overlay = document.getElementById("page-transition");
    if (!overlay || typeof window.showPage !== "function") return;
    const originalShowPage = window.showPage;
    window.showPage = function enhancedShowPage(page) {
      overlay.classList.add("is-active");
      setTimeout(() => {
        originalShowPage(page);
        setTimeout(() => overlay.classList.remove("is-active"), 160);
      }, 140);
    };
  }

  function initCounters() {
    const counters = document.querySelectorAll(".stat-num, .dash-num, .about-badge .big");
    if (!counters.length) return;
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
    const start = performance.now();
    const duration = 1300;

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
    if (!input || !Array.isArray(window.destinations || destinations)) return;
    const parent = input.parentElement;
    const box = document.createElement("div");
    box.className = "suggestion-box";
    box.id = `${inputId}-suggestions`;
    parent.appendChild(box);

    const render = () => {
      const q = input.value.trim().toLowerCase();
      const matches = q
        ? destinations.filter(d => matchesDestination(d, q)).slice(0, 6)
        : [];
      box.innerHTML = q ? renderMatches(matches) : renderRecentAndPopular();
      box.classList.add("is-open");

      box.querySelectorAll("[data-search-term]").forEach(btn => {
        btn.addEventListener("mousedown", event => {
          event.preventDefault();
          const term = btn.getAttribute("data-search-term");
          input.value = term;
          onSelect(term);
          box.classList.remove("is-open");
          notify(`กำลังค้นหา: ${term}`, "info");
        });
      });

      box.querySelector("[data-clear-recent]")?.addEventListener("mousedown", event => {
        event.preventDefault();
        localStorage.removeItem(STORAGE.recent);
        render();
        notify("ล้างประวัติการค้นหาแล้ว", "info");
      });
    };

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      const term = input.value.trim();
      if (term) addRecentSearch(term);
      box.classList.remove("is-open");
    });
    document.addEventListener("click", event => {
      if (!box.contains(event.target) && event.target !== input) box.classList.remove("is-open");
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
      return '<div class="empty-state"><i class="fas fa-search"></i>ยังไม่พบสถานที่ที่ตรงคำค้น</div>';
    }
    return '<div class="suggestion-label">คำแนะนำ</div>' + matches.map(d => `
      <button class="suggestion-item" type="button" data-search-term="${escapeAttr(d.name)}">
        <span><i class="fas fa-location-dot"></i> ${d.name}</span>
        <small>${d.region}</small>
      </button>
    `).join("");
  }

  function renderRecentAndPopular() {
    const recent = getRecentSearches();
    const popular = destinations.slice(0, 6).map(d => d.name);
    const recentHTML = recent.length ? `
      <div class="suggestion-label">ค้นหาล่าสุด <button class="suggestion-clear" type="button" data-clear-recent>ล้าง</button></div>
      ${recent.map(term => `<button class="suggestion-item" type="button" data-search-term="${escapeAttr(term)}"><span><i class="fas fa-clock"></i> ${term}</span></button>`).join("")}
    ` : "";
    return `${recentHTML}<div class="suggestion-label">จุดหมายยอดนิยม</div>
      <div class="suggestion-chips">${popular.map(term => `<button class="suggestion-chip" type="button" data-search-term="${escapeAttr(term)}">${term}</button>`).join("")}</div>`;
  }

  function getRecentSearches() {
    try { return JSON.parse(localStorage.getItem(STORAGE.recent) || "[]"); }
    catch { return []; }
  }

  function addRecentSearch(term) {
    const clean = String(term || "").trim();
    if (!clean) return;
    const recent = getRecentSearches().filter(item => item.toLowerCase() !== clean.toLowerCase());
    recent.unshift(clean);
    localStorage.setItem(STORAGE.recent, JSON.stringify(recent.slice(0, 6)));
  }

  function initRandomDestination() {
    const run = () => {
      const list = destinations || [];
      if (!list.length) return;
      const pick = list[Math.floor(Math.random() * list.length)];
      if (typeof window.openModal === "function") {
        window.showPage?.("destinations");
        setTimeout(() => window.openModal(pick.id), 260);
      }
      notify(`สุ่มได้: ${pick.name}`, "success");
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
      notify("เปลี่ยนคำคมท่องเที่ยวแล้ว", "info");
    };
    document.getElementById("refresh-quote")?.addEventListener("click", refresh);
    document.getElementById("fab-quote")?.addEventListener("click", () => {
      closeFab();
      refresh();
      document.querySelector(".smart-tools-section")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function initWeatherCards() {
    const grid = document.getElementById("weather-cards");
    if (!grid) return;
    const weatherSamples = getSharedWeatherSamples();
    grid.innerHTML = weatherSamples.map(item => `
      <article class="weather-card">
        <div class="weather-city">${item.city}</div>
        <div class="weather-condition">${item.region} ประเทศไทย</div>
        <div class="weather-temp">${item.temp}</div>
        <div class="weather-condition">${item.condition}</div>
        <div class="weather-meta">
          <span><i class="fas fa-droplet"></i> ${item.humidity}</span>
          <span><i class="fas fa-route"></i> ${item.season}</span>
        </div>
      </article>
    `).join("");
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
        <span>${region}</span><small>${destinations.filter(d => d.region === region).length}</small>
      </button>
    `).join("");

    function select(region) {
      try {
        panel.dataset.state = "loading";
        list.querySelectorAll(".region-button").forEach(btn => btn.classList.toggle("active", btn.dataset.region === region));
        const items = destinations.filter(d => d.region === region);
        title.textContent = region;
        meta.textContent = `พบ ${items.length} สถานที่ในภูมิภาคนี้`;
        panel.innerHTML = items.length ? `
          <div class="region-result-grid">
            ${items.map(d => `<button class="region-mini-card" type="button" data-destination-id="${d.id}">
              <strong>${d.name}</strong><span>${d.badge}</span>
            </button>`).join("")}
          </div>
        ` : `<div class="region-empty-state">
          <i class="fas fa-map region-empty-icon"></i>
          <p class="region-empty-title">ยังไม่พบสถานที่ในภูมิภาคนี้</p>
          <p class="region-empty-desc">ลองเลือกภูมิภาคอื่น หรือรีเซ็ตตัวกรองเพื่อดูทั้งหมด</p>
          <button type="button" class="region-reset-button">
            <i class="fas fa-redo"></i> รีเซ็ตตัวกรอง
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
          <p class="region-empty-title">ไม่สามารถแสดงผลภูมิภาคได้</p>
          <p class="region-empty-desc">ระบบแสดงผลเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง</p>
        </div>`;
      }
    }

    list.querySelectorAll(".region-button").forEach(btn => {
      btn.addEventListener("click", () => select(btn.dataset.region));
    });
    select(regions[0]);
  }

  function initTestimonials() {
    const track = document.getElementById("testimonial-track");
    const dots = document.getElementById("testimonial-dots");
    if (!track || !dots) return;
    const testimonials = getSharedTestimonials();
    if (!testimonials.length) return;
    track.innerHTML = testimonials.map(item => `
      <div class="testimonial-slide">
        <article class="testimonial-card">
          <div class="testimonial-head">
            <img class="testimonial-avatar" src="${item.avatar}" alt="${item.name}" loading="lazy">
            <div><div class="testimonial-name">${item.name}</div><div class="testimonial-loc">${item.location}</div></div>
          </div>
          <div class="testimonial-stars">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div>
          <p class="testimonial-text">"${item.text}"</p>
          <p class="testimonial-loc" style="margin-top:12px;"><i class="fas fa-location-dot"></i> ${item.destination}</p>
        </article>
      </div>
    `).join("");

    let index = 0;
    const visible = () => window.innerWidth < 641 ? 1 : window.innerWidth < 921 ? 2 : 3;
    const max = () => Math.max(0, testimonials.length - visible());
    const render = () => {
      const width = track.querySelector(".testimonial-slide")?.getBoundingClientRect().width || 0;
      track.style.transform = `translateX(-${index * width}px)`;
      dots.innerHTML = Array.from({ length: max() + 1 }, (_, i) => `<button type="button" class="${i === index ? "active" : ""}" aria-label="แสดงรีวิวที่ ${i + 1}"></button>`).join("");
      dots.querySelectorAll("button").forEach((btn, i) => btn.addEventListener("click", () => { index = i; render(); }));
    };
    document.getElementById("testimonial-prev")?.addEventListener("click", () => { index = Math.max(0, index - 1); render(); });
    document.getElementById("testimonial-next")?.addEventListener("click", () => { index = index >= max() ? 0 : index + 1; render(); });
    window.addEventListener("resize", () => { index = Math.min(index, max()); render(); });
    setInterval(() => { index = index >= max() ? 0 : index + 1; render(); }, 6500);
    render();
  }

  function initBlog() {
    const grid = document.getElementById("blog-grid");
    if (!grid) return;
    const blogPosts = getSharedBlogPosts();
    if (!blogPosts.length) return;
    grid.innerHTML = blogPosts.map(post => `
      <article class="blog-card-enhanced" tabindex="0" role="button" data-blog-id="${post.id}">
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