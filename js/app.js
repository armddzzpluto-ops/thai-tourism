/* Core SPA application module */
// ===== DATA =====
let destinations = [];
let galleryImages = [];

function normalizeCategoryList(destination) {
  if (Array.isArray(destination.category) && destination.category.length) return destination.category;
  if (Array.isArray(destination.categories) && destination.categories.length) return destination.categories;
  if (destination.category) return [destination.category];
  return [];
}

function normalizeTagList(destination) {
  if (Array.isArray(destination.tags) && destination.tags.length) return destination.tags;
  if (Array.isArray(destination.activities) && destination.activities.length) return destination.activities.slice(0, 4);
  return [];
}

function normalizeRegionLabel(region) {
  const keys = {
    north: 'region.north',
    central: 'region.central',
    northeast: 'region.northeast',
    east: 'region.east',
    south: 'region.south'
  };

  const fallback = {
    north: 'ภาคเหนือ',
    central: 'ภาคกลาง',
    northeast: 'ภาคอีสาน',
    east: 'ภาคตะวันออก',
    south: 'ภาคใต้'
  };

  const key = keys[region];

  return key
    ? (window.I18N?.t(key) || fallback[region])
    : (region || '');
}

function normalizeIndexDestination(destination) {
  const normalized = { ...destination };
  normalized.category = normalizeCategoryList(destination);
  normalized.tags = normalizeTagList(destination);
  normalized.badge = destination.badge || normalizeRegionLabel(destination.region) || (window.I18N?.getLanguage() === 'en' ? 'Recommended' : 'แนะนำ');
  normalized.desc = destination.desc || destination.description || '';
  normalized.longDesc = destination.longDesc || destination.description || destination.desc || '';
  normalized.weather = destination.weather || destination.openingHours || (window.I18N?.getLanguage() === 'en' ? 'Not specified' : 'ไม่ระบุ');
  normalized.best = destination.best || destination.entry || destination.ticketInfo || (window.I18N?.getLanguage() === 'en' ? 'Not specified' : 'ไม่ระบุ');
  normalized.distance = destination.distance || destination.province || destination.officialLocation || (window.I18N?.getLanguage() === 'en' ? 'Not specified' : 'ไม่ระบุ');
  normalized.galleryImages = Array.isArray(destination.galleryImages) ? destination.galleryImages : [];
  normalized.galleryCaptions = Array.isArray(destination.galleryCaptions) ? destination.galleryCaptions : [];
  normalized.galleryCurated = destination.galleryCurated === true;
  normalized.searchKeywords = Array.isArray(destination.searchKeywords) ? destination.searchKeywords : [];
  normalized.keywords = Array.isArray(destination.keywords) ? destination.keywords : [];
  return normalized;
}

function buildGalleryFromDestinations() {
  const items = [];
  const seen = new Set();

  destinations.forEach(destination => {
    const hero = destination.heroImage || destination.img;
    const gallery = Array.isArray(destination.galleryImages)
      ? destination.galleryImages
      : [];

    const sources = gallery.length ? gallery : [hero];

    sources.forEach((src, index) => {
      if (!src || seen.has(src)) return;

      const galleryCaption = index > 0
        ? destination.galleryCaptions[index - 1]
        : '';

      seen.add(src);
      items.push({
        src,
        cap: galleryCaption || destination.caption || destination.name,
        destinationId: destination.id,
        region: destination.region,
        province: destination.province,
        curated: destination.galleryCurated === true,
        isHero: index === 0
      });
    });
  });

  return items;
}

function getHomeGalleryPreview(limit = 5) {
  const selected = [];
  const selectedDestinations = new Set();

  // Prefer newly curated gallery photos so the home preview does not
  // repeat the same hero images already used by destination cards.
  for (const image of galleryImages) {
    const destinationKey = image.destinationId || image.cap;

    if (!image.curated || image.isHero) continue;
    if (selectedDestinations.has(destinationKey)) continue;

    selectedDestinations.add(destinationKey);
    selected.push(image);

    if (selected.length === limit) return selected;
  }

  for (const image of galleryImages) {
    if (selected.includes(image)) continue;

    selected.push(image);
    if (selected.length === limit) break;
  }

  return selected;
}

function renderHomeGalleryPreview() {
  const container = document.getElementById('home-gallery-preview');
  if (!container) return;

  const preview = getHomeGalleryPreview(5);

  if (!preview.length) {
    container.innerHTML = `
      <div class="empty-state home-gallery-empty">
        <i class="fas fa-images"></i>
        ${window.I18N?.t('empty.gallery') || 'ยังไม่มีรูปภาพสำหรับแสดง'}
      </div>`;
    return;
  }

  container.innerHTML = preview.map((image, index) => {
    const caption = image.cap || (window.I18N?.getLanguage() === 'en' ? 'Destination in Thailand' : 'สถานที่ท่องเที่ยวในประเทศไทย');
    const featuredClass = index === 0 ? ' is-featured' : '';

    return `
      <button
        class="gallery-item${featuredClass}"
        type="button"
        onclick="showPage('gallery')"
        aria-label="${window.I18N?.t('gallery.openCollection') || 'เปิดคลังรูปภาพ'}: ${caption}"
      >
        <img
          src="${image.src}"
          alt="${caption}"
          loading="lazy"
          decoding="async"
          width="900"
          height="600"
        >
        <div class="gallery-overlay" aria-hidden="true">
          <i class="fas fa-expand-alt"></i>
        </div>
        <div class="gallery-caption">${caption}</div>
      </button>`;
  }).join('');
}
function toPromoProvinceSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hydratePromotionCardsFromSharedData() {
  const cards = document.querySelectorAll('.dest-card[data-promo-province]');

  cards.forEach(card => {
    const provinceSlug = card.getAttribute('data-promo-province');
    if (!provinceSlug) return;

    const destination = destinations.find(item => {
      const destinationSlug = item.provinceSlug || item.slug ||
        toPromoProvinceSlug(item.province || item.name);
      return destinationSlug === provinceSlug;
    });

    if (!destination) {
      console.warn(`Promotion destination not found: ${provinceSlug}`);
      return;
    }

    const image = card.querySelector('.card-img-wrap img');
    const imageSource = destination.heroImage || destination.img;

    if (image && imageSource) {
      image.src = imageSource;
      image.alt = destination.caption || `${destination.name} ${destination.province || ''}`.trim();
    }

    const regionElement = card.querySelector('.card-region');

    if (regionElement) {
      regionElement.textContent =
        `${destination.province || destination.name} - ` +
        normalizeRegionLabel(destination.region);
    }
  });
}
window.__hydrateTravelData = function hydrateTravelData() {
  if (Array.isArray(window.DESTINATIONS) && window.DESTINATIONS.length) {
    destinations = window.DESTINATIONS.map(item =>
      normalizeIndexDestination(item)
    );
    window.destinations = destinations;
  } else {
    destinations = [];
    galleryImages = [];
    window.destinations = destinations;
    window.galleryImages = galleryImages;
    console.error('Shared destination data is missing');
    return;
  }

  galleryImages = buildGalleryFromDestinations();
  window.galleryImages = galleryImages;

  if (!galleryImages.length) {
    console.warn('No destination gallery images were generated');
  }

  renderHomeGalleryPreview();
  hydratePromotionCardsFromSharedData();
};
// ===== STATE =====
let favorites = [];
try {
  const savedFavorites = JSON.parse(localStorage.getItem('tt_favs') || '[]');
  favorites = Array.isArray(savedFavorites) ? savedFavorites : [];
} catch (error) {
  localStorage.removeItem('tt_favs');
  console.warn('Invalid favorites data was cleared', error);
}
let activeFilter = '';
let currentPage = 'home';
let chartsInit = false;

function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);

  const btn = document.getElementById('theme-toggle');

  if (btn) {
    btn.innerHTML = next === 'dark'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
  }

  document.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme: next }
  }));

  window.I18N?.syncControls();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  try {
    localStorage.setItem('tt_theme', next);
  } catch (error) {
    console.warn('Theme preference could not be saved', error);
  }

  applyTheme(next);
}

// ===== RENDER FUNCTIONS =====
function renderCard(d, containerId) {
  const isFav = favorites.includes(d.id);
  const rating = Number(d.rating) || 0;
  const reviews = Number(d.reviews) || 0;
  const stars = '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  const regionLabel = normalizeRegionLabel(d.region);
  const imageSource = d.heroImage || d.img || 'assets/images/destinations/bangkok.webp';

  return `
    <article class="dest-card fade-in" data-name="${d.name}" data-region="${d.region}" data-category="${d.category.join(',')}">
      <div class="card-img-wrap">
        <img
          src="${imageSource}"
          alt="${d.caption || d.name}"
          loading="lazy"
          decoding="async"
          width="800"
          height="520"
        >
        <span class="card-badge">${d.badge}</span>
        <button
          class="card-fav ${isFav ? 'liked' : ''}"
          type="button"
          onclick="toggleFav(${d.id},this)"
          aria-label="${window.I18N?.t(isFav ? 'favorite.removeLabel' : 'favorite.saveLabel') || (isFav ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด')}: ${d.name}"
          title="${window.I18N?.t('favorite.saveLabel') || 'บันทึกสถานที่'}"
        >
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-region">${regionLabel}</div>
        <h3 class="card-title">${d.name}</h3>
        <p class="card-desc">${d.desc}</p>
        <div class="card-footer">
          <div class="card-rating">
            <span class="stars" aria-hidden="true">${stars}</span>
            <span>${rating.toFixed(1)} (${reviews.toLocaleString()})</span>
          </div>
          <button class="card-cta" type="button" onclick="openModal(${d.id})">${window.I18N?.getLanguage() === 'en' ? 'Details' : 'รายละเอียด'}</button>
        </div>
      </div>
    </article>`;
}
function normalizeRegionFilter(region) {
  const map = {
    'ภาคเหนือ': 'north',
    'ภาคกลาง': 'central',
    'ภาคอีสาน': 'northeast',
    'ภาคตะวันออก': 'east',
    'ภาคใต้': 'south'
  };
  return map[region] || region || '';
}

function matchesDestinationSearch(destination, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const values = [
    destination.name,
    destination.province,
    destination.region,
    destination.desc,
    destination.longDesc,
    destination.weather,
    destination.best,
    destination.distance,
    ...(destination.tags || []),
    ...(destination.category || []),
    ...(destination.keywords || []),
    ...(destination.searchKeywords || [])
  ];
  return values.filter(Boolean).some(value => String(value).toLowerCase().includes(q));
}

function getFeaturedDestinations(limit = 6) {
  const sorted = [...destinations].sort((a, b) => {
    const ratingDifference = (Number(b.rating) || 0) - (Number(a.rating) || 0);
    if (ratingDifference !== 0) return ratingDifference;
    return (Number(b.reviews) || 0) - (Number(a.reviews) || 0);
  });

  const regionOrder = ['north', 'central', 'northeast', 'east', 'south'];
  const selected = [];
  const selectedIds = new Set();

  regionOrder.forEach(region => {
    const match = sorted.find(item =>
      item.region === region && !selectedIds.has(item.id)
    );

    if (match) {
      selected.push(match);
      selectedIds.add(match.id);
    }
  });

  for (const destination of sorted) {
    if (selected.length >= limit) break;
    if (selectedIds.has(destination.id)) continue;

    selected.push(destination);
    selectedIds.add(destination.id);
  }

  return selected.slice(0, limit);
}

function renderHomeCards() {
  const container = document.getElementById('home-cards');
  if (!container) return;

  if (container.dataset.rendered === 'true' && container.children.length) {
    observeFade();
    return;
  }

  container.innerHTML = getFeaturedDestinations(6)
    .map(destination => renderCard(destination, 'home-cards'))
    .join('');

  container.dataset.rendered = 'true';
  observeFade();
}
function renderDestCards(filter = '', search = '') {
  const el = document.getElementById('dest-cards');
  if (!el) return;

  const q = String(search || '').toLowerCase().trim();
  const normalizedFilter = normalizeRegionFilter(filter);
  const filtered = destinations.filter(destination => {
    const matchRegion = !normalizedFilter || destination.region === normalizedFilter;
    const matchSearch = matchesDestinationSearch(destination, q);
    return matchRegion && matchSearch;
  });

  const status = document.getElementById('destination-results-status');
  const noResults = document.getElementById('no-results');
  const isEnglish = document.documentElement.lang === 'en';

  if (status) {
    status.textContent = isEnglish
      ? `Showing ${filtered.length} of ${destinations.length} destinations`
      : `แสดง ${filtered.length} จาก ${destinations.length} สถานที่`;
  }

  if (filtered.length === 0) {
    el.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';
  el.innerHTML = filtered.map(destination => renderCard(destination, 'dest-cards')).join('');
  observeFade();
}

function renderGallery() {
  const el = document.getElementById('gallery-grid');
  if (!el) return;

  if (el.dataset.rendered === 'true' && el.children.length) {
    observeFade();
    return;
  }

  el.innerHTML = galleryImages.map((img,i) => `
    <button class="gallery-item fade-in" type="button" onclick="openLightbox(${i})" aria-label="${window.I18N?.t('gallery.open') || 'เปิดรูปภาพ'}: ${img.cap}">
      <img src="${img.src}" alt="${img.cap}" loading="lazy" decoding="async">
      <div class="gallery-overlay" aria-hidden="true"><i class="fas fa-expand-alt"></i></div>
      <div class="gallery-caption">${img.cap}</div>
    </button>`).join('');

  el.dataset.rendered = 'true';
  observeFade();
}

// ===== INTERACTIONS =====
function toggleFav(id, btn) {
  const idx = favorites.indexOf(id);
  if (idx === -1) {
    favorites.push(id);
    btn.innerHTML = '❤️'; btn.classList.add('liked');
    Swal.fire({ toast:true, position:'top-end', icon:'success', title:window.I18N?.t('favorite.added') || 'เพิ่มในรายการโปรดแล้ว!', showConfirmButton:false, timer:1800, timerProgressBar:true });
  } else {
    favorites.splice(idx,1);
    btn.innerHTML = '🤍'; btn.classList.remove('liked');
    Swal.fire({ toast:true, position:'top-end', icon:'info', title:window.I18N?.t('favorite.removed') || 'นำออกจากรายการโปรดแล้ว', showConfirmButton:false, timer:1800 });
  }
  try {
    localStorage.setItem('tt_favs', JSON.stringify(favorites));
  } catch (error) {
    console.warn('Favorites could not be saved', error);
  }
}

function openModal(id) {
  const d = destinations.find(item => item.id === id);
  if (!d) return;

  const modal = document.getElementById('modal');
  if (modal) modal.dataset.destinationId = String(id);

  const tr = (key, fallback) => window.I18N?.t(key) || fallback;
  const image = document.getElementById('modal-img');

  const modalImages = Array.isArray(d.galleryImages) && d.galleryImages.length
    ? d.galleryImages
    : [d.heroImage || d.img];

  image.src = modalImages[0];
  image.alt = d.caption || d.name;

  const modalGallery = document.getElementById('modal-gallery');
  modalGallery.replaceChildren();

  modalImages.forEach((src, index) => {
    const button = document.createElement('button');
    const thumbnail = document.createElement('img');
    const caption = index > 0
      ? (d.galleryCaptions[index - 1] || d.caption || d.name)
      : (d.caption || d.name);

    button.type = 'button';
    button.className = 'modal-gallery-thumb';
    button.classList.toggle('active', index === 0);
    button.setAttribute('aria-label', `${tr('gallery.show', 'แสดงรูป')} ${index + 1}: ${caption}`);

    thumbnail.src = src;
    thumbnail.alt = caption;
    thumbnail.loading = 'lazy';
    thumbnail.decoding = 'async';
    button.appendChild(thumbnail);

    button.addEventListener('click', () => {
      image.src = src;
      image.alt = caption;
      modalGallery.querySelectorAll('.modal-gallery-thumb').forEach(item => {
        item.classList.toggle('active', item === button);
      });
    });

    modalGallery.appendChild(button);
  });

  document.getElementById('modal-region').textContent = normalizeRegionLabel(d.region);
  document.getElementById('modal-title').textContent = d.name;
  document.getElementById('modal-desc').textContent = d.longDesc;
  document.getElementById('modal-tags').innerHTML =
    d.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');

  document.getElementById('modal-info').innerHTML = `
    <div class="modal-info-item"><i class="fas fa-thermometer-half"></i> ${tr('dialog.temperature', 'อุณหภูมิ')}: ${d.weather}</div>
    <div class="modal-info-item"><i class="fas fa-calendar-alt"></i> ${tr('dialog.bestTime', 'ช่วงเวลาดีที่สุด')}: ${d.best}</div>
    <div class="modal-info-item"><i class="fas fa-road"></i> ${tr('dialog.distance', 'ระยะทาง')}: ${d.distance}</div>
    <div class="modal-info-item"><i class="fas fa-star"></i> ${tr('dialog.rating', 'คะแนน')}: ${d.rating}/5.0</div>
    <div class="modal-info-item"><i class="fas fa-map-location-dot"></i> <a href="${d.googleMaps}" target="_blank" rel="noopener noreferrer">${tr('dialog.maps', 'แผนที่ Google Maps')}</a></div>
    <div class="modal-info-item"><i class="fas fa-globe"></i> <a href="${d.officialWebsite}" target="_blank" rel="noopener noreferrer">${tr('dialog.official', 'เว็บไซต์การท่องเที่ยวทางการ')}</a></div>`;

  modal?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) { if (e.target.id==='modal') closeModalBtn(); }
function closeModalBtn() { document.getElementById('modal').classList.remove('open'); document.body.style.overflow = ''; }

let currentLightboxIndex = 0;

function openLightbox(index) {
  if (!galleryImages.length) return;

  currentLightboxIndex = ((index % galleryImages.length) + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentLightboxIndex];
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.dataset.imageIndex = String(currentLightboxIndex);
  const preview = document.getElementById('lightbox-img');

  preview.src = image.src;
  preview.alt = image.cap;
  document.getElementById('lightbox-cap').textContent =
    `${image.cap} (${currentLightboxIndex + 1}/${galleryImages.length})`;
  lightbox?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function lightboxNav(step) {
  openLightbox(currentLightboxIndex + step);
}

function closeLightbox(event) {
  if (event && event.target !== event.currentTarget) return;

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function filterCards() {
  const q = document.getElementById('main-search').value;
  renderDestCards(activeFilter, q);
}

function setFilter(region, btn) {
  activeFilter = region;

  document.querySelectorAll('.filter-btn').forEach(button => {
    const active = button === btn;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  filterCards();
}

function filterDest(cat) {
  const map = {
    'ทะเล': { search: 'ทะเล' },
    'วัด': { search: 'วัด' },
    'ธรรมชาติ': { search: 'ธรรมชาติ' },
    'ภูเขา': { search: 'ภูเขา' },
    'วัฒนธรรม': { search: 'วัฒนธรรม' },
    'ภาคเหนือ': { filter: 'ภาคเหนือ' },
    'ภาคกลาง': { filter: 'ภาคกลาง' },
    'ภาคใต้': { filter: 'ภาคใต้' },
    'ภาคอีสาน': { filter: 'ภาคอีสาน' },
    'ภาคตะวันออก': { filter: 'ภาคตะวันออก' },
    '': { filter: '', search: '' }
  };

  const next = map[cat] || { search: cat };
  activeFilter = next.filter ?? '';

  document.querySelectorAll('.filter-btn').forEach(button => {
    const shouldActivate = next.filter
      ? button.dataset.filterValue === cat
      : button.dataset.filterValue === '';

    button.classList.toggle('active', shouldActivate);
    button.setAttribute('aria-pressed', String(shouldActivate));
  });

  const search = document.getElementById('main-search');
  if (search) search.value = next.search ?? '';

  showPage('destinations');
}
function focusHomeSearch() {
  const search = document.getElementById('quick-search');
  const searchSection = document.querySelector('#page-home > .search-bar-wrap');

  if (searchSection) {
    searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setTimeout(() => search?.focus(), 450);
}

function doQuickSearch() {
  const source = document.getElementById('quick-search');
  const query = source ? source.value.trim() : '';
  const destinationSearch = document.getElementById('main-search');

  activeFilter = '';
  document.querySelectorAll('.filter-btn').forEach(button => {
    const active = button.dataset.filterValue === '';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (destinationSearch) destinationSearch.value = query;

  showPage('destinations');

  requestAnimationFrame(() => destinationSearch?.focus());
}

function quickFill(value) {
  const search = document.getElementById('quick-search');
  if (search) search.value = value;
  doQuickSearch();
}

function showDest(name) {
  activeFilter = '';

  const search = document.getElementById('main-search');
  if (search) search.value = name;

  document.querySelectorAll('.filter-btn').forEach(button => {
    const active = button.dataset.filterValue === '';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  showPage('destinations');
}

// ===== NAVIGATION =====
const PAGE_META = {
  home: 'Thailand Travel Guide | ท่องเที่ยวไทย',
  destinations: 'สถานที่ท่องเที่ยว | Thailand Travel Guide',
  promotions: 'โปรโมชั่น | Thailand Travel Guide',
  gallery: 'คลังรูปภาพ | Thailand Travel Guide',
  about: 'เกี่ยวกับเรา | Thailand Travel Guide',
  contact: 'ติดต่อ | Thailand Travel Guide',
  dashboard: 'แดชบอร์ด | Thailand Travel Guide'
};

let chartLibraryPromise = null;

function isRealChartLibrary() {
  return typeof window.Chart === 'function'
    && typeof window.Chart.getChart === 'function'
    && typeof window.Chart.register === 'function';
}

function ensureChartLibrary() {
  if (isRealChartLibrary()) return Promise.resolve(window.Chart);
  if (chartLibraryPromise) return chartLibraryPromise;

  chartLibraryPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-chart-loader]');

    const finish = () => {
      if (isRealChartLibrary()) {
        resolve(window.Chart);
      } else {
        chartLibraryPromise = null;
        reject(new Error('Chart.js loaded without a valid Chart API'));
      }
    };

    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener('error', () => {
        chartLibraryPromise = null;
        reject(new Error('Unable to load Chart.js'));
      }, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    script.async = true;
    script.dataset.chartLoader = 'true';
    script.onload = finish;
    script.onerror = () => {
      chartLibraryPromise = null;
      reject(new Error('Unable to load Chart.js'));
    };
    document.head.appendChild(script);
  });

  return chartLibraryPromise;
}

function getPageFromHash() {
  const page = window.location.hash.replace(/^#/, '').trim();
  return PAGE_META[page] ? page : 'home';
}

function updatePageHistory(page, replace = false) {
  const nextHash = `#${page}`;
  const method = replace ? 'replaceState' : 'pushState';

  if (window.location.hash !== nextHash || replace) {
    window.history[method]({ page }, '', nextHash);
  }
}

function showPage(page, options = {}) {
  const {
    updateHistory = true,
    replaceHistory = false,
    scrollToTop = true
  } = options;

  const target = document.getElementById('page-' + page);
  if (!target) {
    console.warn(`Unknown page requested: ${page}`);
    return;
  }

  document.querySelectorAll('.page').forEach(element => {
    element.classList.toggle('active', element === target);
  });

  document.querySelectorAll('.nav-links a, .mobile-menu a[data-page]').forEach(link => {
    const active = link.dataset.page === page;
    link.classList.toggle('active', active);

    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  currentPage = page;
  closeMobile();

  if (scrollToTop) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  if (page === 'home') {
    renderHomeCards();
  }

  if (page === 'destinations') {
    const search = document.getElementById('main-search')?.value || '';
    renderDestCards(activeFilter, search);
  }

  if (page === 'gallery') {
    renderGallery();
  }

  if (page === 'dashboard' && !chartsInit) {
    setTimeout(async () => {
      try {
        await ensureChartLibrary();
        chartsInit = initCharts() !== false;
      } catch (error) {
        console.error('Dashboard charts could not be loaded', error);
      }
    }, 0);
  }

  document.title = window.I18N?.pageTitle(page) || PAGE_META[page] || PAGE_META.home;

  if (updateHistory) {
    updatePageHistory(page, replaceHistory);
  }

  requestAnimationFrame(observeFade);
}

function openDestinationSearch() {
  showPage('destinations');
  requestAnimationFrame(() => document.getElementById('main-search')?.focus());
}

// ===== MOBILE =====
function setMobileMenuState(open) {
  const menu = document.getElementById('mobileMenu');
  const button = document.getElementById('hamburger');

  if (!menu || !button) return;

  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  button.classList.toggle('open', open);
  document.body.classList.toggle('mobile-menu-open', open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', window.I18N?.t(open ? 'menu.close' : 'menu.open') || (open ? 'ปิดเมนู' : 'เปิดเมนู'));
}

function toggleMobile() {
  const menu = document.getElementById('mobileMenu');
  setMobileMenuState(!menu?.classList.contains('open'));
}

function closeMobile() {
  setMobileMenuState(false);
}

// ===== CONTACT =====
function submitContact(event) {
  event?.preventDefault();

  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('cf-name');
  const emailInput = document.getElementById('cf-email');
  const messageInput = document.getElementById('cf-message');
  const fields = [nameInput, emailInput, messageInput];

  fields.forEach(field => field.setAttribute('aria-invalid', String(!field.validity.valid)));

  if (!form.checkValidity()) {
    const firstInvalid = fields.find(field => !field.validity.valid);
    firstInvalid?.focus();

    Swal.fire({
      icon: 'warning',
      title: window.I18N?.t('validation.title') || 'กรุณาตรวจสอบข้อมูล',
      text: firstInvalid?.validity.typeMismatch
        ? (window.I18N?.t('validation.email') || 'กรุณากรอกอีเมลให้ถูกต้อง')
        : (window.I18N?.t('validation.required') || 'ชื่อ อีเมล และข้อความจำเป็นต้องกรอก'),
      confirmButtonColor: 'var(--teal-mid)'
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: window.I18N?.t('validation.success') || 'ตรวจสอบแบบฟอร์มเรียบร้อย',
    text: (window.I18N?.t('validation.thanks') || 'ขอบคุณ {name} นี่เป็นแบบฟอร์มตัวอย่าง จึงยังไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์').replace('{name}', nameInput.value.trim()),
    confirmButtonColor: 'var(--teal-deep)',
    confirmButtonText: window.I18N?.t('dialog.ok') || 'รับทราบ'
  }).then(() => {
    form.reset();
    fields.forEach(field => field.removeAttribute('aria-invalid'));
  });
}

// ===== CHARTS =====
function initCharts() {
  if (typeof window.Chart === 'undefined') {
    console.warn('Chart.js is unavailable; dashboard charts were skipped.');
    return false;
  }

  const teal = '#1A7A8A';
  const gold = '#C9A84C';
  const coral = '#E8694A';
  const tealL = '#2EADC0';
  const isEnglish = document.documentElement.lang === 'en';
  const months = isEnglish ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] : ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  const createChart = (canvasId, config) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    if (typeof window.Chart.getChart === 'function') {
      const existing = window.Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    try {
      return new window.Chart(canvas, config);
    } catch (error) {
      console.error(`Unable to render chart: ${canvasId}`, error);
      return null;
    }
  };

  createChart('lineChart', {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: isEnglish ? 'Visitors (millions)' : 'จำนวนนักท่องเที่ยว (ล้านคน)',
        data: [2.8,2.4,3.1,3.8,2.9,2.1,2.3,2.5,2.7,4.2,4.8,4.6],
        borderColor: teal,
        backgroundColor: 'rgba(26,122,138,0.08)',
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: teal,
        tension: 0.4,
        fill: true
      }, {
        label: isEnglish ? 'Previous year' : 'ปีก่อนหน้า',
        data: [2.2,2.0,2.7,3.2,2.5,1.8,2.0,2.2,2.4,3.8,4.2,4.1],
        borderColor: gold,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        borderDash: [5,5],
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });

  createChart('doughnutChart', {
    type: 'doughnut',
    data: {
      labels: isEnglish ? ['South','Central','North','Northeast','East'] : ['ภาคใต้','ภาคกลาง','ภาคเหนือ','ภาคอีสาน','ภาคตะวันออก'],
      datasets: [{
        data: [42,28,18,7,5],
        backgroundColor: [teal,gold,coral,tealL,'#8FAAB2'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, font: { family: 'Sarabun' } }
        }
      },
      cutout: '65%'
    }
  });

  createChart('barChart', {
    type: 'bar',
    data: {
      labels: isEnglish ? ['Bangkok','Phuket','Chiang Mai','Pattaya','Krabi','Koh Samui','Hua Hin','Kanchanaburi'] : ['กรุงเทพฯ','ภูเก็ต','เชียงใหม่','พัทยา','กระบี่','เกาะสมุย','หัวหิน','กาญจนบุรี'],
      datasets: [{
        label: isEnglish ? 'Visitors (millions)' : 'ผู้เยี่ยมชม (ล้านคน)',
        data: [22.5,14.2,11.8,8.4,6.9,5.3,4.1,3.7],
        backgroundColor: [teal,gold,coral,tealL,teal,gold,coral,tealL],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false }, ticks: { font: { family: 'Sarabun' } } }
      }
    }
  });

  return true;
}

// ===== FADE IN OBSERVER =====
let fadeObserver = null;

function observeFade() {
  const pending = document.querySelectorAll('.fade-in:not(.visible)');
  if (!pending.length) return;

  if (!('IntersectionObserver' in window)) {
    pending.forEach(element => element.classList.add('visible'));
    return;
  }

  if (!fadeObserver) {
    fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px 100px 0px'
    });
  }

  pending.forEach(element => fadeObserver.observe(element));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(localStorage.getItem('tt_theme') || 'light');

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  renderHomeCards();
  observeFade();

  document.querySelectorAll('a[onclick]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });

  const initialPage = getPageFromHash();

  showPage(initialPage, {
    updateHistory: true,
    replaceHistory: true,
    scrollToTop: false
  });

  window.addEventListener('popstate', () => {
    showPage(getPageFromHash(), {
      updateHistory: false,
      scrollToTop: true
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobile();

    const lightbox = document.getElementById('lightbox');
    if (!lightbox?.classList.contains('open')) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      lightboxNav(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      lightboxNav(1);
    }
  });

  document.addEventListener('click', event => {
    const menu = document.getElementById('mobileMenu');
    const button = document.getElementById('hamburger');

    if (!menu?.classList.contains('open')) return;
    if (menu.contains(event.target) || button?.contains(event.target)) return;

    closeMobile();
  });
});
