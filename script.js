/* ============================================================
   THAILAND TRAVEL GUIDE 2026 — Main Script
   Shared across every page. Each module checks for its target
   elements before running, so this single file works safely
   site-wide without errors on pages that don't use a feature.
   No database / backend — all state lives in localStorage.
   ============================================================ */
"use strict";

/* ---------------------------------------------------------------
   0. THEME (DARK / LIGHT MODE)
   The <head> of every page also runs a tiny inline snippet that
   applies the saved theme before first paint (avoids flash).
--------------------------------------------------------------- */
const Theme = {
  key: "tt_theme",
  get() { return localStorage.getItem(this.key) || "light"; },
  set(val) {
    const next = val === "dark" ? "dark" : "light";
    localStorage.setItem(this.key, next);
    document.documentElement.setAttribute("data-theme", next);
    document.querySelectorAll(".theme-toggle .knob").forEach(k => {
      k.textContent = next === "light" ? "☀️" : "🌙";
    });
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      toggle.setAttribute("aria-pressed", next === "dark");
    }
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  },
  toggle() {
    document.body.classList.add("theme-switching");
    this.set(this.get() === "light" ? "dark" : "light");
    setTimeout(() => document.body.classList.remove("theme-switching"), 500);
  },
  init() {
    this.set(this.get());
    document.querySelectorAll(".theme-toggle, #theme-toggle, #fab-theme").forEach(btn => {
      btn.addEventListener("click", () => this.toggle());
      btn.setAttribute("role", "switch");
      btn.setAttribute("aria-checked", this.get() === "dark");
    });
  }
};

/* ---------------------------------------------------------------
   1. LOADING SCREEN
--------------------------------------------------------------- */
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  if (!screen) return;
  window.addEventListener("load", () => {
    setTimeout(() => screen.classList.add("fade-out"), 600);
    setTimeout(() => screen.remove(), 1300);
  });
}

/* ---------------------------------------------------------------
   2. PAGE TRANSITION (between multi-page navigations)
--------------------------------------------------------------- */
function initPageTransition() {
  const overlay = document.getElementById("page-transition");
  if (!overlay) return;

  // Fade the overlay out once this page has rendered
  requestAnimationFrame(() => {
    overlay.classList.add("active");
    requestAnimationFrame(() => {
      setTimeout(() => overlay.classList.remove("active"), 60);
    });
  });

  // Intercept internal link clicks for a smooth exit transition
  document.querySelectorAll('a[href$=".html"], a[href="index.html"], a[href="/"]').forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || link.target === "_blank") return;
      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(() => { window.location.href = href; }, 380);
    });
  });
}

/* ---------------------------------------------------------------
   3. NAVBAR — scroll state + mobile menu
--------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const burger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const open = burger.classList.toggle("open");
      mobileNav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
    });
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      burger.classList.remove("open");
      mobileNav.classList.remove("open");
    }));
  }
}

/* ---------------------------------------------------------------
   4. CUSTOM CURSOR (fine-pointer devices only)
--------------------------------------------------------------- */
function initCustomCursor() {
  if (!window.matchMedia("(pointer:fine)").matches) return;
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);
  document.documentElement.classList.add("has-cursor");

  let rx = 0, ry = 0, dx = 0, dy = 0;
  window.addEventListener("mousemove", e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
  });
  (function loop() {
    rx += (dx - rx) * 0.18;
    ry += (dy - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener("mouseover", e => {
    if (e.target.closest("a,button,input,textarea,select,.clickable")) {
      document.body.classList.add("cursor-grow");
    }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("a,button,input,textarea,select,.clickable")) {
      document.body.classList.remove("cursor-grow");
    }
  });
  document.addEventListener("mouseleave", () => document.body.classList.add("cursor-hide"));
  document.addEventListener("mouseenter", () => document.body.classList.remove("cursor-hide"));
}

/* ---------------------------------------------------------------
   5. RIPPLE EFFECT — attach to any .ripple element
--------------------------------------------------------------- */
function initRipple() {
  document.addEventListener("click", e => {
    const el = e.target.closest(".ripple");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const circle = document.createElement("span");
    circle.className = "ripple-circle";
    circle.style.width = circle.style.height = size + "px";
    circle.style.left = (e.clientX - rect.left - size / 2) + "px";
    circle.style.top = (e.clientY - rect.top - size / 2) + "px";
    el.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
}

/* ---------------------------------------------------------------
   6. BACK TO TOP
--------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------------------------------------------------------------
   7. FLOATING ACTION BUTTON (FAB)
--------------------------------------------------------------- */
function initFab() {
  const main = document.getElementById("fabMain");
  const menu = document.getElementById("fabMenu");
  if (!main || !menu) return;

  main.addEventListener("click", () => {
    const open = main.classList.toggle("open");
    menu.classList.toggle("open", open);
    main.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".fab-wrap") && menu.classList.contains("open")) {
      main.classList.remove("open"); menu.classList.remove("open");
    }
  });

  document.getElementById("fabRandom")?.addEventListener("click", () => {
    closeFab();
    const d = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
    openDestinationModal(d.id);
  });
  document.getElementById("fabQuote")?.addEventListener("click", () => {
    closeFab();
    showRandomQuote();
  });
  document.getElementById("fabTheme")?.addEventListener("click", () => {
    closeFab();
    Theme.toggle();
  });
  document.getElementById("fabTop")?.addEventListener("click", () => {
    closeFab();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function closeFab() { main.classList.remove("open"); menu.classList.remove("open"); }
}

/* ---------------------------------------------------------------
   8. MODAL FOCUS TRAP (WCAG 2.1 Compliance)
   Traps focus within modal dialogs when open
--------------------------------------------------------------- */
function initModalFocusTrap() {
  // Focus trap for destination detail modals
  document.addEventListener("click", e => {
    const modalOverlay = e.target.closest(".modal-overlay.open");
    if (!modalOverlay) return;
    
    // Only trigger if clicking the overlay itself (outside modal)
    if (e.target !== modalOverlay) return;
    
    const modal = modalOverlay.querySelector(".modal");
    if (modal) {
      // Close modal when clicking outside
      if (e.target.id === "modal" || e.target.id === "lightbox" || e.target.id === "blog-modal") {
        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) closeBtn.click();
      }
    }
  });

  // Trap Tab key within open modals
  document.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    
    // Find any open modal
    const openModal = document.querySelector(".modal-overlay.open .modal");
    if (!openModal) return;

    const focusableElements = openModal.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    // If Shift+Tab on first element, focus last
    if (e.shiftKey) {
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // If Tab on last element, focus first
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Trap Escape key to close modals
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    
    const openModal = document.querySelector(".modal-overlay.open");
    if (openModal) {
      const closeBtn = openModal.querySelector(".modal-close");
      if (closeBtn) closeBtn.click();
    }
  });
}

/* ---------------------------------------------------------------
   9. TRAVEL QUOTE GENERATOR
--------------------------------------------------------------- */
function showRandomQuote() {
  const box = document.getElementById("quoteText");
  const author = document.getElementById("quoteAuthor");
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  if (box && author) {
    box.style.opacity = 0;
    setTimeout(() => {
      box.textContent = q.text;
      author.textContent = "— " + q.author;
      box.style.opacity = 1;
    }, 200);
  } else if (window.Swal) {
    const rootStyles = getComputedStyle(document.documentElement);
    const bg = rootStyles.getPropertyValue("--color-bg-tertiary").trim() || rootStyles.getPropertyValue("--bg3").trim();
    const text = rootStyles.getPropertyValue("--color-text-primary").trim() || rootStyles.getPropertyValue("--text").trim();
    const confirm = rootStyles.getPropertyValue("--color-accent").trim() || rootStyles.getPropertyValue("--accent").trim();
    Swal.fire({
      html: `<p style="font-style:italic;font-size:1.05rem;margin-bottom:10px;">"${q.text}"</p><p style="color:var(--accent);font-weight:700;font-size:.85rem;">— ${q.author}</p>`,
      background: bg, color: text, confirmButtonColor: confirm, confirmButtonText: "Inspiring ✦"
    });
  }
}
function initQuoteBox() {
  const box = document.getElementById("quoteText");
  if (!box) return;
  box.style.transition = "opacity .2s ease";
  showRandomQuote();
  document.getElementById("quoteRefreshBtn")?.addEventListener("click", showRandomQuote);
}

/* ---------------------------------------------------------------
   9. FAVORITES SYSTEM (localStorage)
--------------------------------------------------------------- */
const Favorites = {
  key: "ttg_favorites",
  all() { return JSON.parse(localStorage.getItem(this.key) || "[]"); },
  has(id) { return this.all().includes(id); },
  toggle(id) {
    let favs = this.all();
    const has = favs.includes(id);
    favs = has ? favs.filter(x => x !== id) : [...favs, id];
    localStorage.setItem(this.key, JSON.stringify(favs));
    return !has;
  }
};

/* ---------------------------------------------------------------
   10. SHARE BUTTON
--------------------------------------------------------------- */
function shareDestination(d) {
  const shareData = {
    title: `${d.name} — Thailand Travel Guide 2026`,
    text: `Check out ${d.name}, ${d.province}: ${d.desc}`,
    url: window.location.origin + window.location.pathname + `?dest=${d.id}`
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard?.writeText(shareData.url).then(() => toast("Link copied to clipboard!"));
  }
}
function toast(msg, icon = "success") {
  if (window.Swal) {
    const rootStyles = getComputedStyle(document.documentElement);
    const bg = rootStyles.getPropertyValue("--color-bg-tertiary").trim() || rootStyles.getPropertyValue("--bg3").trim();
    const text = rootStyles.getPropertyValue("--color-text-primary").trim() || rootStyles.getPropertyValue("--text").trim();
    Swal.fire({
      toast: true, position: "top-end", icon, title: msg,
      showConfirmButton: false, timer: 2200, timerProgressBar: true,
      background: bg,
      color: text
    });
  } else { alert(msg); }
}

/* ---------------------------------------------------------------
   11. DESTINATION CARD RENDERING + MODAL
--------------------------------------------------------------- */
function destinationCardHTML(d) {
  const stars = "★".repeat(Math.round(d.rating)) + "☆".repeat(5 - Math.round(d.rating));
  const liked = Favorites.has(d.id);
  return `
  <div class="dest-card reveal" data-id="${d.id}" data-region="${d.region}" data-category="${d.category}">
    <div class="card-img">
      <img src="${d.img}" alt="${d.name}, ${d.province}" loading="lazy">
      <div class="card-img-ov"></div>
      <span class="card-chip">${capitalize(d.category)}</span>
      <div class="card-actions-top">
        <button class="card-fav ${liked ? "liked" : ""}" aria-label="Save ${d.name} to favorites" onclick="event.stopPropagation();toggleCardFav(${d.id}, this)">${liked ? "❤️" : "🤍"}</button>
        <button class="card-share" aria-label="Share ${d.name}" onclick="event.stopPropagation();shareDestination(DESTINATIONS.find(x=>x.id===${d.id}))"><i class="fa-solid fa-share-nodes"></i></button>
      </div>
      <div class="card-star"><i class="fa-solid fa-star"></i> ${d.rating}</div>
    </div>
    <div class="card-body">
      <div class="card-prov">${d.province} · ${capitalize(d.region)}</div>
      <h3 class="card-name">${d.name}</h3>
      <p class="card-desc">${d.desc}</p>
      <div class="card-foot">
        <span class="card-tourists"><i class="fa-solid fa-user-group"></i> ${d.tourists}/yr</span>
        <button class="btn-view ripple" onclick="openDestinationModal(${d.id})">View Details</button>
      </div>
    </div>
  </div>`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function toggleCardFav(id, btn) {
  const liked = Favorites.toggle(id);
  btn.classList.toggle("liked", liked);
  btn.textContent = liked ? "❤️" : "🤍";
  toast(liked ? "Added to favorites" : "Removed from favorites", liked ? "success" : "info");
}

function renderCardGrid(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.length
    ? items.map(destinationCardHTML).join("")
    : `<div class="no-results"><div class="icon">🔍</div><p style="font-weight:700;color:var(--text)">No destinations found</p><p>Try a different search term or category.</p></div>`;
  ScrollReveal.observe();
}

function openDestinationModal(id) {
  const d = DESTINATIONS.find(x => x.id === id);
  const modal = document.getElementById("destModal");
  if (!d || !modal) return;
  document.getElementById("modalImg").src = d.img;
  document.getElementById("modalImg").alt = d.name;
  document.getElementById("modalProvince").textContent = `${d.province} · ${capitalize(d.region)}`;
  document.getElementById("modalName").textContent = d.name;
  document.getElementById("modalStars").innerHTML = "★".repeat(Math.round(d.rating)) + "☆".repeat(5 - Math.round(d.rating));
  document.getElementById("modalReviews").textContent = `${d.rating} (${d.reviews.toLocaleString()} reviews)`;
  document.getElementById("modalDesc").textContent = d.desc;
  document.getElementById("modalInfo").innerHTML = `
    <div class="modal-info-card"><div class="modal-lbl">Opening Hours</div><div class="modal-val">${d.hours}</div></div>
    <div class="modal-info-card"><div class="modal-lbl">Entry Fee</div><div class="modal-val">${d.entry}</div></div>
    <div class="modal-info-card"><div class="modal-lbl">Category</div><div class="modal-val">${capitalize(d.category)}</div></div>
    <div class="modal-info-card"><div class="modal-lbl">Annual Visitors</div><div class="modal-val">${d.tourists}</div></div>`;
  document.getElementById("modalActs").innerHTML = `<h4>Recommended Activities</h4><ul>${d.activities.map(a => `<li>${a}</li>`).join("")}</ul>`;
  const favBtn = document.getElementById("modalFavBtn");
  if (favBtn) {
    const liked = Favorites.has(d.id);
    favBtn.innerHTML = liked ? '<i class="fa-solid fa-heart"></i> Saved' : '<i class="fa-regular fa-heart"></i> Save';
    favBtn.classList.toggle("liked-state", liked);
    favBtn.onclick = () => {
      const nowLiked = Favorites.toggle(d.id);
      favBtn.innerHTML = nowLiked ? '<i class="fa-solid fa-heart"></i> Saved' : '<i class="fa-regular fa-heart"></i> Save';
      toast(nowLiked ? "Added to favorites" : "Removed from favorites");
      document.querySelectorAll(`.dest-card[data-id="${d.id}"] .card-fav`).forEach(b => {
        b.classList.toggle("liked", nowLiked); b.textContent = nowLiked ? "❤️" : "🤍";
      });
    };
  }
  const shareBtn = document.getElementById("modalShareBtn");
  if (shareBtn) shareBtn.onclick = () => shareDestination(d);

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeDestinationModal() {
  document.getElementById("destModal")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------------------------------------------------------------
   12. CATEGORY FILTER CHIPS (home + destinations page)
--------------------------------------------------------------- */
function renderCategoryGrid(containerId, onSelect) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => {
    const count = DESTINATIONS.filter(d => d.category === c.key).length;
    return `<button class="cat-btn reveal" data-cat="${c.key}">
      <span class="cat-icon">${c.icon}</span>
      <span class="cat-lbl">${c.label}</span>
      <span class="cat-cnt">${count} places</span>
    </button>`;
  }).join("");
  el.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      el.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      onSelect(btn.dataset.cat);
    });
  });
  ScrollReveal.observe();
}

/* ---------------------------------------------------------------
   13. SMART SEARCH SYSTEM (destinations.html + home quick search)
--------------------------------------------------------------- */
const RecentSearches = {
  key: "ttg_recent_searches",
  all() { return JSON.parse(localStorage.getItem(this.key) || "[]"); },
  add(term) {
    if (!term.trim()) return;
    let arr = this.all().filter(t => t.toLowerCase() !== term.toLowerCase());
    arr.unshift(term);
    arr = arr.slice(0, 5);
    localStorage.setItem(this.key, JSON.stringify(arr));
  },
  clear() { localStorage.removeItem(this.key); }
};
const POPULAR_SEARCHES = ["Phuket", "Chiang Mai", "Beach", "Temple", "Krabi", "Bangkok"];

function initSmartSearch(opts) {
  // opts: { inputId, suggestId, onApply(term), navigateOnSubmit (bool) }
  const input = document.getElementById(opts.inputId);
  const suggestBox = document.getElementById(opts.suggestId);
  if (!input) return;

  function renderSuggestions(term) {
    if (!suggestBox) return;
    const q = term.trim().toLowerCase();
    let html = "";
    if (q) {
      const matches = DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      ).slice(0, 6);
      html += `<div class="sg-label">Matching Destinations</div>`;
      html += matches.length
        ? matches.map(d => `<div class="sg-item" data-term="${d.name}"><i class="fa-solid fa-location-dot"></i> ${d.name} <small>${d.province}</small></div>`).join("")
        : `<div class="sg-item" style="cursor:default;color:var(--text3)"><i class="fa-solid fa-circle-info"></i> No matches — try a category like "beach" or "temple"</div>`;
    } else {
      const recent = RecentSearches.all();
      if (recent.length) {
        html += `<div class="sg-label">Recent Searches <span class="sg-clear" data-clear-recent>Clear</span></div>`;
        html += recent.map(t => `<div class="sg-item" data-term="${t}"><i class="fa-solid fa-clock-rotate-left"></i> ${t}</div>`).join("");
        html += `<div class="sg-divider"></div>`;
      }
      html += `<div class="sg-label">Popular Searches</div>`;
      html += `<div class="sg-chiprow">${POPULAR_SEARCHES.map(t => `<span class="sg-chip" data-term="${t}">${t}</span>`).join("")}</div>`;
    }
    suggestBox.innerHTML = html;

    suggestBox.querySelectorAll("[data-term]").forEach(item => {
      item.addEventListener("click", () => {
        input.value = item.dataset.term;
        apply(item.dataset.term);
        suggestBox.classList.remove("open");
      });
    });
    suggestBox.querySelector("[data-clear-recent]")?.addEventListener("click", e => {
      e.stopPropagation();
      RecentSearches.clear();
      renderSuggestions(input.value);
    });
  }

  function apply(term) {
    opts.onApply(term);
    if (term.trim()) RecentSearches.add(term.trim());
  }

  input.addEventListener("input", () => {
    renderSuggestions(input.value);
    if (suggestBox) suggestBox.classList.add("open");
    opts.onApply(input.value); // real-time filtering, no refresh
  });
  input.addEventListener("focus", () => {
    renderSuggestions(input.value);
    if (suggestBox) suggestBox.classList.add("open");
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      apply(input.value);
      suggestBox?.classList.remove("open");
      if (opts.navigateOnSubmit) {
        window.location.href = `destinations.html?q=${encodeURIComponent(input.value)}`;
      }
    }
  });
  document.addEventListener("click", e => {
    if (suggestBox && !e.target.closest(opts.wrapSelector || "." + opts.inputId)) {
      if (!e.target.closest(`#${opts.suggestId}`) && e.target !== input) suggestBox.classList.remove("open");
    }
  });

  return { apply };
}

/* ---------------------------------------------------------------
   14. DESTINATIONS PAGE — combined search + category + region filter
--------------------------------------------------------------- */
function initDestinationsPage() {
  const grid = document.getElementById("destGrid");
  if (!grid) return;

  let state = { q: "", region: "", category: "" };

  function apply() {
    const q = state.q.trim().toLowerCase();
    const filtered = DESTINATIONS.filter(d => {
      const matchQ = !q || d.name.toLowerCase().includes(q) || d.province.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.region.toLowerCase().includes(q);
      const matchRegion = !state.region || d.region === state.region;
      const matchCat = !state.category || d.category === state.category;
      return matchQ && matchRegion && matchCat;
    });
    renderCardGrid("destGrid", filtered);
    const counter = document.getElementById("resultsCount");
    if (counter) counter.textContent = `${filtered.length} destination${filtered.length !== 1 ? "s" : ""} found`;
  }

  // Region filter pills
  const regionWrap = document.getElementById("regionFilters");
  if (regionWrap) {
    regionWrap.innerHTML = `<button class="filter-pill active" data-region="">All Regions</button>` +
      REGIONS.map(r => `<button class="filter-pill" data-region="${r.key}">${r.icon} ${r.label}</button>`).join("");
    regionWrap.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        regionWrap.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.region = btn.dataset.region;
        apply();
      });
    });
  }

  renderCategoryGrid("catFilterGrid", cat => {
    state.category = document.querySelector('#catFilterGrid .cat-btn.active')?.dataset.cat === state.category ? "" : cat;
    // toggle off if clicking same active category twice
    apply();
  });

  initSmartSearch({
    inputId: "destSearchInput",
    suggestId: "destSuggest",
    wrapSelector: ".search-wrap-rel",
    onApply: term => { state.q = term; apply(); }
  });

  // Pre-fill from URL ?q=
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) {
    document.getElementById("destSearchInput").value = params.get("q");
    state.q = params.get("q");
  }

  apply();
}

/* ---------------------------------------------------------------
   15. STAT COUNTER ANIMATION (on scroll)
--------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (target % 1 === 0 ? Math.floor(val).toLocaleString() : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}

/* ---------------------------------------------------------------
   16. SCROLL REVEAL ANIMATION SYSTEM
--------------------------------------------------------------- */
const ScrollReveal = {
  io: null,
  init() {
    this.io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); this.io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    this.observe();
  },
  observe() {
    document.querySelectorAll(".reveal:not(.visible),.reveal-left:not(.visible),.reveal-right:not(.visible),.reveal-zoom:not(.visible)")
      .forEach(el => this.io.observe(el));
  }
};

/* ---------------------------------------------------------------
   17. GALLERY (MASONRY + LIGHTBOX + FILTER)
--------------------------------------------------------------- */
let lightboxFiltered = [...GALLERY];
let lightboxIndex = 0;

function renderGallery(filterRegion = "") {
  const el = document.getElementById("galleryGrid");
  if (!el) return;
  lightboxFiltered = filterRegion ? GALLERY.filter(g => g.region === filterRegion) : [...GALLERY];
  el.innerHTML = lightboxFiltered.map((img, i) => `
    <div class="gal-item reveal-zoom" onclick="openLightbox(${i})">
      <img src="${img.src}" alt="${img.cap}" loading="lazy">
      <div class="gal-ov"><i class="fa-solid fa-expand"></i></div>
      <div class="gal-cap">${img.cap}</div>
    </div>`).join("");
  ScrollReveal.observe();
}

function initGalleryFilters() {
  const wrap = document.getElementById("galleryFilters");
  if (!wrap) return;
  wrap.innerHTML = `<button class="filter-pill active" data-region="">All</button>` +
    REGIONS.map(r => `<button class="filter-pill" data-region="${r.key}">${r.icon} ${r.label}</button>`).join("");
  wrap.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery(btn.dataset.region);
    });
  });
}

function openLightbox(i) {
  lightboxIndex = i;
  updateLightbox();
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}
function updateLightbox() {
  const img = lightboxFiltered[lightboxIndex];
  document.getElementById("lightboxImg").src = img.src;
  document.getElementById("lightboxImg").alt = img.cap;
  document.getElementById("lightboxCap").textContent = img.cap;
  document.getElementById("lightboxCounter").textContent = `${lightboxIndex + 1} / ${lightboxFiltered.length}`;
}
function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxFiltered.length) % lightboxFiltered.length;
  updateLightbox();
}
function closeLightbox() {
  document.getElementById("lightbox")?.classList.remove("open");
  document.body.style.overflow = "";
}
function initLightboxKeys() {
  document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (!lb || !lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lightboxNav(1);
    if (e.key === "ArrowLeft") lightboxNav(-1);
  });
}

/* ---------------------------------------------------------------
   18. WEATHER WIDGET
--------------------------------------------------------------- */
let weatherUnit = "C";
function renderWeather() {
  const el = document.getElementById("weatherGrid");
  if (!el) return;
  el.innerHTML = WEATHER.map(w => {
    const temp = weatherUnit === "C" ? w.tempC : Math.round(w.tempC * 9 / 5 + 32);
    return `<div class="weather-card reveal">
      <div class="weather-city">${w.city}</div>
      <div class="weather-prov">${w.province}</div>
      <span class="weather-icon">${w.icon}</span>
      <div class="weather-temp">${temp}°${weatherUnit}</div>
      <div class="weather-desc">${w.condition}</div>
      <div class="weather-meta">
        <span><i class="fa-solid fa-droplet"></i> ${w.humidity}</span>
        <span><i class="fa-solid fa-wind"></i> ${w.wind}</span>
      </div>
    </div>`;
  }).join("");
  ScrollReveal.observe();
}
function initWeatherToggle() {
  const wrap = document.getElementById("weatherUnitToggle");
  if (!wrap) return;
  wrap.querySelectorAll(".wu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".wu-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      weatherUnit = btn.dataset.unit;
      renderWeather();
    });
  });
}

/* ---------------------------------------------------------------
   19. INTERACTIVE MAP
--------------------------------------------------------------- */
function initInteractiveMap() {
  const listWrap = document.getElementById("mapRegionsList");
  const resultsWrap = document.getElementById("mapResults");
  if (!listWrap) return;

  listWrap.innerHTML = REGIONS.map(r => {
    const count = DESTINATIONS.filter(d => d.region === r.key).length;
    return `<div class="map-region-btn" data-region="${r.key}">
      <div class="mr-left"><span class="mr-ico">${r.icon}</span>
        <div><div class="mr-name">${r.label}</div><div class="mr-provs">${r.provinces}</div></div>
      </div>
      <span class="mr-count">${count}</span>
    </div>`;
  }).join("");

  function select(regionKey) {
    document.querySelectorAll(".map-region-btn").forEach(b => b.classList.toggle("active", b.dataset.region === regionKey));
    document.querySelectorAll(".map-pin").forEach(p => p.classList.toggle("active", p.dataset.region === regionKey));
    if (resultsWrap) {
      const items = DESTINATIONS.filter(d => d.region === regionKey);
      resultsWrap.innerHTML = `<h4 style="font-size:.95rem;font-weight:700;margin-bottom:4px;">Destinations in ${capitalize(regionKey)} Thailand</h4>
        <div class="map-results-grid">${items.map(destinationCardHTML).join("")}</div>`;
      ScrollReveal.observe();
    }
  }

  listWrap.querySelectorAll(".map-region-btn").forEach(btn => {
    btn.addEventListener("click", () => select(btn.dataset.region));
  });
  document.querySelectorAll(".map-pin").forEach(pin => {
    pin.addEventListener("click", () => select(pin.dataset.region));
  });

  select("south"); // default selection
}

/* ---------------------------------------------------------------
   20. TRAVEL PLANNER
--------------------------------------------------------------- */
function initTravelPlanner() {
  const form = document.getElementById("plannerForm");
  if (!form) return;

  const provinceSelect = document.getElementById("plannerProvince");
  const uniqueProvinces = [...new Set(DESTINATIONS.map(d => d.province))].sort();
  provinceSelect.innerHTML = `<option value="">Surprise me — any province</option>` +
    uniqueProvinces.map(p => `<option value="${p}">${p}</option>`).join("");

  const styleGrid = document.getElementById("styleGrid");
  styleGrid.innerHTML = TRAVEL_STYLES.map(s => `<div class="style-opt" data-style="${s.key}"><span class="so-ico">${s.icon}</span>${s.label}</div>`).join("");
  let selectedStyle = "nature";
  styleGrid.querySelector(`[data-style="${selectedStyle}"]`).classList.add("selected");
  styleGrid.querySelectorAll(".style-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      styleGrid.querySelectorAll(".style-opt").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedStyle = opt.dataset.style;
    });
  });

  const budgetGrid = document.getElementById("budgetGrid");
  budgetGrid.innerHTML = BUDGET_OPTIONS.map(b => `<div class="budget-opt" data-budget="${b.key}">${b.label}</div>`).join("");
  let selectedBudget = "mid";
  budgetGrid.querySelector(`[data-budget="${selectedBudget}"]`).classList.add("selected");
  budgetGrid.querySelectorAll(".budget-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      budgetGrid.querySelectorAll(".budget-opt").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedBudget = opt.dataset.budget;
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const days = Math.max(1, Math.min(14, parseInt(document.getElementById("plannerDays").value) || 3));
    const province = provinceSelect.value || uniqueProvinces[Math.floor(Math.random() * uniqueProvinces.length)];
    generateItinerary({ province, days, style: selectedStyle, budget: selectedBudget });
  });
}

const BUDGET_PER_DAY = { budget: 1200, mid: 3200, luxury: 8500 };

function generateItinerary({ province, days, style, budget }) {
  const result = document.getElementById("itineraryResult");
  const activities = [...ITINERARY_BANK[style]];
  const dest = DESTINATIONS.find(d => d.province === province) || DESTINATIONS[0];
  const styleLabel = TRAVEL_STYLES.find(s => s.key === style).label;
  const budgetLabel = BUDGET_OPTIONS.find(b => b.key === budget).label;
  const total = BUDGET_PER_DAY[budget] * days;

  let daysHTML = "";
  for (let i = 1; i <= days; i++) {
    const act1 = activities[(i - 1) % activities.length];
    const act2 = activities[(i + 1) % activities.length];
    const meal = MEAL_SUGGESTIONS[(i - 1) % MEAL_SUGGESTIONS.length];
    daysHTML += `
    <div class="itin-day reveal">
      <div class="itin-day-head">
        <span class="itin-day-num">Day ${i} of ${days}</span>
        <span class="itin-day-theme">${i === 1 ? "Arrival & Orientation" : i === days ? "Farewell & Departure" : styleLabel + " Day"}</span>
      </div>
      <div class="itin-slot"><span class="itin-time">08:00</span><span class="itin-activity">${meal}</span></div>
      <div class="itin-slot"><span class="itin-time">10:00</span><span class="itin-activity">${act1}</span></div>
      <div class="itin-slot"><span class="itin-time">13:00</span><span class="itin-activity">Lunch break + rest at accommodation</span></div>
      <div class="itin-slot"><span class="itin-time">15:00</span><span class="itin-activity">${act2}</span></div>
      <div class="itin-slot"><span class="itin-time">19:00</span><span class="itin-activity">Dinner exploring ${dest.province} local cuisine</span></div>
    </div>`;
  }

  result.innerHTML = `
    <div class="itin-summary">
      <div class="itin-summary-item"><b>${dest.province}</b><span>Destination</span></div>
      <div class="itin-summary-item"><b>${days}</b><span>Day${days > 1 ? "s" : ""}</span></div>
      <div class="itin-summary-item"><b>${styleLabel}</b><span>Travel Style</span></div>
      <div class="itin-summary-item"><b>${budgetLabel}</b><span>Budget Tier</span></div>
      <div class="itin-summary-item"><b>฿${total.toLocaleString()}</b><span>Est. Total (excl. flights)</span></div>
    </div>
    ${daysHTML}
    <div style="text-align:center;margin-top:10px;">
      <button class="btn-glass ripple" onclick="document.getElementById('plannerForm').scrollIntoView({behavior:'smooth'})"><i class="fa-solid fa-rotate"></i> Plan Another Trip</button>
    </div>`;
  result.classList.add("show");
  ScrollReveal.observe();
  setTimeout(() => result.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
}

/* ---------------------------------------------------------------
   21. FAQ ACCORDION
--------------------------------------------------------------- */
function initFAQ() {
  const list = document.getElementById("faqList");
  if (!list) return;
  list.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item reveal" id="faq-${i}">
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
        <span>${f.q}</span><span class="faq-plus">+</span>
      </div>
      <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
    </div>`).join("");

  list.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    function toggle() {
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      q.setAttribute("aria-expanded", open);
    }
    q.addEventListener("click", toggle);
    q.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  ScrollReveal.observe();
}

/* ---------------------------------------------------------------
   22. TESTIMONIAL SLIDER
--------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.getElementById("testTrack");
  if (!track) return;
  track.innerHTML = REVIEWS.map(r => `
    <div class="test-slide">
      <div class="rev-card">
        <div class="rev-head">
          <img src="${r.avatar}" alt="${r.name}" class="rev-avatar" loading="lazy">
          <div><div class="rev-name">${r.name}</div><div class="rev-loc">${r.loc}</div></div>
        </div>
        <div class="rev-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <p class="rev-text">"${r.text}"</p>
        <div class="rev-place">📍 ${r.place}</div>
      </div>
    </div>`).join("");

  let index = 0;
  function visibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }
  function maxIndex() { return Math.max(0, REVIEWS.length - visibleCount()); }
  function update() {
    const slideWidth = track.children[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    renderDots();
  }
  function renderDots() {
    const dotsWrap = document.getElementById("testDots");
    if (!dotsWrap) return;
    const total = maxIndex() + 1;
    dotsWrap.innerHTML = Array.from({ length: total }).map((_, i) =>
      `<span class="test-dot ${i === index ? "active" : ""}" data-i="${i}"></span>`).join("");
    dotsWrap.querySelectorAll(".test-dot").forEach(dot => dot.addEventListener("click", () => { index = +dot.dataset.i; update(); }));
  }

  document.getElementById("testPrev")?.addEventListener("click", () => { index = Math.max(0, index - 1); update(); });
  document.getElementById("testNext")?.addEventListener("click", () => { index = Math.min(maxIndex(), index + 1); update(); });

  let auto = setInterval(() => { index = index >= maxIndex() ? 0 : index + 1; update(); }, 5000);
  const slider = document.getElementById("testSlider");
  slider?.addEventListener("mouseenter", () => clearInterval(auto));
  slider?.addEventListener("mouseleave", () => { auto = setInterval(() => { index = index >= maxIndex() ? 0 : index + 1; update(); }, 5000); });

  window.addEventListener("resize", () => { index = Math.min(index, maxIndex()); update(); });
  setTimeout(update, 80);
}

/* ---------------------------------------------------------------
   23. BLOG SECTION + MODAL
--------------------------------------------------------------- */
function renderBlog() {
  const el = document.getElementById("blogGrid");
  if (!el) return;
  el.innerHTML = BLOG.map(b => `
    <div class="blog-card reveal" onclick="openBlogModal(${b.id})">
      <div class="blog-img"><img src="${b.img}" alt="${b.title}" loading="lazy"><span class="blog-readtime">${b.readtime}</span></div>
      <div class="blog-body">
        <div class="blog-cat">${b.cat}</div>
        <h3 class="blog-title">${b.title}</h3>
        <p class="blog-excerpt">${b.excerpt}</p>
        <div class="blog-meta"><span>${b.date}</span><span>Read article →</span></div>
      </div>
    </div>`).join("");
  ScrollReveal.observe();
}
function openBlogModal(id) {
  const b = BLOG.find(x => x.id === id);
  const modal = document.getElementById("blogModal");
  if (!b || !modal) return;
  document.getElementById("blogModalImg").src = b.img;
  document.getElementById("blogModalCat").textContent = b.cat;
  document.getElementById("blogModalTitle").textContent = b.title;
  document.getElementById("blogModalMeta").textContent = `${b.date} · ${b.readtime}`;
  document.getElementById("blogModalBody").innerHTML = b.body;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeBlogModal() {
  document.getElementById("blogModal")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------------------------------------------------------------
   24. NEWSLETTER SUBSCRIPTION
--------------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("newsletterEmail");
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Please enter a valid email address", "error");
      return;
    }
    const subs = JSON.parse(localStorage.getItem("ttg_subscribers") || "[]");
    if (!subs.includes(email)) { subs.push(email); localStorage.setItem("ttg_subscribers", JSON.stringify(subs)); }
    toast("Subscribed! Welcome aboard ✈️");
    input.value = "";
  });
}

/* ---------------------------------------------------------------
   25. CONTACT FORM
--------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("cfName").value.trim();
    const email = document.getElementById("cfEmail").value.trim();
    const subject = document.getElementById("cfSubject").value;
    const message = document.getElementById("cfMessage").value.trim();
    const rootStyles = getComputedStyle(document.documentElement);
    const swalBg = rootStyles.getPropertyValue("--color-bg-tertiary").trim() || rootStyles.getPropertyValue("--bg3").trim();
    const swalText = rootStyles.getPropertyValue("--color-text-primary").trim() || rootStyles.getPropertyValue("--text").trim();
    const swalConfirm = rootStyles.getPropertyValue("--color-accent").trim() || rootStyles.getPropertyValue("--accent").trim();

    if (!name || !email || !message) {
      Swal.fire({ icon: "warning", title: "Missing information", text: "Please fill in your name, email and message.", confirmButtonColor: swalConfirm, background: swalBg, color: swalText });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({ icon: "error", title: "Invalid email", text: "Please double-check your email address.", confirmButtonColor: swalConfirm, background: swalBg, color: swalText });
      return;
    }
    Swal.fire({
      icon: "success", title: "Message Sent! 🎉",
      html: `Thank you, <b>${name}</b>!<br>We'll reply to <b>${email}</b> within 1–2 business days regarding "<b>${subject || "your inquiry"}</b>".`,
      confirmButtonColor: swalConfirm, confirmButtonText: "Great, thanks!",
      background: swalBg, color: swalText
    }).then(() => form.reset());
  });
}

/* ---------------------------------------------------------------
   26. HOME PAGE INITIALIZER (featured cards + category preview)
--------------------------------------------------------------- */
function initHomePage() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  renderCardGrid("featuredGrid", DESTINATIONS.slice(0, 8));
  renderCategoryGrid("homeCatGrid", cat => { window.location.href = `destinations.html?cat=${cat}`; });

  initSmartSearch({
    inputId: "homeSearchInput",
    suggestId: "homeSuggest",
    wrapSelector: ".search-wrap-rel",
    navigateOnSubmit: true,
    onApply: () => {} // home search just navigates on submit/suggestion click
  });
  document.getElementById("homeSuggest")?.querySelectorAll?.("[data-term]");
  // override suggestion click behaviour to navigate (home page only)
  const suggestBox = document.getElementById("homeSuggest");
  if (suggestBox) {
    suggestBox.addEventListener("click", e => {
      const item = e.target.closest("[data-term]");
      if (item) window.location.href = `destinations.html?q=${encodeURIComponent(item.dataset.term)}`;
    });
  }
  document.getElementById("homeSearchBtn")?.addEventListener("click", () => {
    const v = document.getElementById("homeSearchInput").value;
    window.location.href = `destinations.html?q=${encodeURIComponent(v)}`;
  });

  // Hero background auto-rotation
  initHeroSlider();
}

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1920&q=85", name: "Phuket", sub: "Island paradise of the Andaman Sea" },
  { img: "https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=1920&q=85", name: "Chiang Mai", sub: "Lanna culture in the northern mountains" },
  { img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=85", name: "Krabi", sub: "Dramatic limestone cliffs & turquoise water" }
];
function initHeroSlider() {
  const bg = document.getElementById("heroBg");
  const nameEl = document.getElementById("heroDestName");
  const subEl = document.getElementById("heroDestSub");
  if (!bg) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % HERO_SLIDES.length;
    bg.style.opacity = 0;
    setTimeout(() => {
      bg.style.backgroundImage = `url('${HERO_SLIDES[i].img}')`;
      if (nameEl) nameEl.textContent = HERO_SLIDES[i].name;
      if (subEl) subEl.textContent = HERO_SLIDES[i].sub;
      bg.style.opacity = 1;
    }, 500);
  }, 6000);
  // subtle parallax on scroll
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight) bg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
  }, { passive: true });
}

/* ---------------------------------------------------------------
   27. GLOBAL INIT
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  Theme.init();
  initLoadingScreen();
  initPageTransition();
  initNavbar();
  initCustomCursor();
  initRipple();
  initBackToTop();
  initFab();
  initModalFocusTrap();
  initQuoteBox();
  initCounters();
  ScrollReveal.init();

  initHomePage();
  initDestinationsPage();
  initGalleryFilters();
  renderGallery();
  initLightboxKeys();
  initWeatherToggle();
  renderWeather();
  initInteractiveMap();
  initTravelPlanner();
  initFAQ();
  initTestimonialSlider();
  renderBlog();
  initNewsletter();
  initContactForm();

  // Modal close on overlay click
  document.getElementById("destModal")?.addEventListener("click", e => { if (e.target.id === "destModal") closeDestinationModal(); });
  document.getElementById("blogModal")?.addEventListener("click", e => { if (e.target.id === "blogModal") closeBlogModal(); });
  document.getElementById("lightbox")?.addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
});