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
    const hero = destination.heroImage;
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

function escapeHTMLText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHTMLAttribute(value) {
  return escapeHTMLText(value)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSafeGalleryImageSource(value) {
  const source = String(value || '').trim();
  return /^assets\/images\/provinces\/[a-z0-9-]+\/(?:hero|gallery-[1-5])\.webp$/.test(source)
    ? source
    : 'assets/images/provinces/bangkok/hero.webp';
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
    const openLabel = window.I18N?.t('gallery.openCollection') || 'เปิดคลังรูปภาพ';
    const safeCaptionText = escapeHTMLText(caption);
    const safeCaptionAttribute = escapeHTMLAttribute(caption);
    const safeSource = escapeHTMLAttribute(getSafeGalleryImageSource(image.src));

    return `
      <button
        class="gallery-item${featuredClass}"
        type="button"
        onclick="showPage('gallery')"
        aria-label="${escapeHTMLAttribute(openLabel)}: ${safeCaptionAttribute}"
      >
        <img
          src="${safeSource}"
          alt="${safeCaptionAttribute}"
          loading="lazy"
          decoding="async"
          width="900"
          height="600"
        >
        <div class="gallery-overlay" aria-hidden="true">
          <i class="fas fa-expand-alt"></i>
        </div>
        <div class="gallery-caption">${safeCaptionText}</div>
      </button>`;
  }).join('');
}
function toDestinationSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getDestinationBySlug(slug) {
  return destinations.find(item =>
    (item.provinceSlug || item.slug || toDestinationSlug(item.province || item.name)) === slug
  );
}

function renderCrossPageDestinationGrids() {
  const configured = Array.isArray(window.CROSS_PAGE_DESTINATION_SLUGS)
    ? window.CROSS_PAGE_DESTINATION_SLUGS
    : [];
  const selected = configured.map(getDestinationBySlug).filter(Boolean);
  const featured = selected.slice(0, 3);
  const container = document.getElementById('home-trip-grid');
  if (container) {
    container.innerHTML = featured.map(item => renderCard(item, 'home-trip-grid')).join('');
    container.dataset.rendered = 'true';
  }

  renderBudgetCalculator();
  renderTripAssistant();
}

function renderBudgetCalculator() {
  const form = document.getElementById('budget-form');
  if (!form) return;

  const read = name => Math.max(0, Number(form.elements[name]?.value) || 0);
  const calculate = () => {
    const travelers = Math.max(1, Math.round(read('travelers')));
    const days = Math.max(1, Math.round(read('days')));
    const nights = Math.round(read('nights'));
    const accommodation = read('room') * nights;
    const food = read('food') * travelers * days;
    const transport = read('transport') * travelers * days;
    const activities = read('activities') * travelers;
    const other = read('other');
    const total = accommodation + food + transport + activities + other;
    const language = window.I18N?.getLanguage?.() === 'en' ? 'en' : 'th';
    const format = value => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'th-TH', {
      style: 'currency', currency: 'THB', maximumFractionDigits: 0
    }).format(value);
    const label = key => window.I18N?.t(key) || key;

    document.getElementById('budget-total').textContent = format(total);
    document.getElementById('budget-per-person').textContent = `${format(total / travelers)} ${label('budget.perPerson')}`;
    document.getElementById('budget-breakdown').innerHTML = [
      ['budget.accommodation', accommodation],
      ['budget.food', food],
      ['budget.transport', transport],
      ['budget.activities', activities],
      ['budget.other', other]
    ].map(([key, value]) => `<div><span>${label(key)}</span><strong>${format(value)}</strong></div>`).join('');
  };

  if (form.dataset.bound !== 'true') {
    form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
    form.addEventListener('input', calculate);
    form.addEventListener('reset', () => requestAnimationFrame(calculate));
    form.dataset.bound = 'true';
  }
  calculate();
}

const TRIP_ASSISTANT_COPY = {
  th: {
    welcomeTitle: 'ลองบอกทริปที่อยากได้',
    welcomeBody: 'เช่น “เที่ยวภาคอีสาน 5 วัน” ระบบจะแปลงคำถามเป็นแผนรายวันและเชื่อมไปยังข้อมูลจังหวัดในเว็บไซต์',
    inputLabel: 'บอกทริปที่ต้องการ',
    inputPlaceholder: 'เช่น อยากเที่ยวภาคอีสาน 5 วัน ชอบธรรมชาติ',
    submit: 'วางแผนให้ฉัน', suggestions: 'ตัวอย่างคำถาม', day: 'วันที่',
    details: 'เปิดคู่มือจังหวัด', source: 'เส้นทางอ้างอิง', verified: 'ตรวจสอบแหล่งข้อมูลเมื่อ',
    exactMeta: 'เส้นทางแนะนำจากแหล่งทางการ',
    generatedMeta: 'แผนระดับจังหวัดจากข้อมูล 77 จังหวัดในโครงการ',
    pending: 'จังหวัดนี้ยังไม่มีข้อมูลสถานที่ย่อยที่ตรวจสอบแหล่งอ้างอิงแล้ว เปิดคู่มือจังหวัดเพื่อสำรวจภาพรวมและติดตามสถานะข้อมูล',
    verifiedStop: 'สถานที่ที่มีข้อมูลอ้างอิงในโครงการ',
    genericTitle: 'แผนเที่ยว {region} {days} วัน', allRegions: 'ประเทศไทย',
    budget: 'คุณระบุงบประมาณประมาณ {budget} บาท ระบบไม่เดาราคาให้ และได้ตั้งจำนวนวันในเครื่องคำนวณงบด้านล่างไว้แล้ว',
    noBudget: 'ระบบตั้งจำนวนวันในเครื่องคำนวณงบด้านล่างให้แล้ว คุณสามารถกรอกค่าใช้จ่ายจริงของตัวเองต่อได้',
    disclaimer: 'แผนนี้เป็นจุดเริ่มต้น ไม่ใช่การจองหรือข้อมูลแบบเรียลไทม์ โปรดตรวจเวลาเปิด ค่าเข้าชม สภาพอากาศ และการเดินทางล่าสุดก่อนออกเดินทาง',
    localOnly: 'ข้อความนี้ประมวลผลในเบราว์เซอร์และไม่ถูกส่งไปยังบริการ AI ภายนอก'
  },
  en: {
    welcomeTitle: 'Describe the trip you want',
    welcomeBody: 'Try “Plan a 5-day Northeast trip.” The planner turns your request into a day-by-day route linked to this site’s province guides.',
    inputLabel: 'Describe your trip',
    inputPlaceholder: 'e.g. Plan a 5-day nature trip in the Northeast',
    submit: 'Build my plan', suggestions: 'Example questions', day: 'Day',
    details: 'Open province guide', source: 'Route source', verified: 'Source checked',
    exactMeta: 'Suggested route adapted from an official source',
    generatedMeta: 'Province-level plan generated from the project’s 77-province dataset',
    pending: 'This province does not yet have a source-verified attraction record. Open its guide for an overview and transparent data status.',
    verifiedStop: 'Source-verified attraction in this project',
    genericTitle: '{days}-day {region} trip', allRegions: 'Thailand',
    budget: 'You mentioned a budget of about THB {budget}. The planner does not invent prices, and the trip length is ready in the budget calculator below.',
    noBudget: 'The trip length is ready in the budget calculator below, where you can enter your own real estimates.',
    disclaimer: 'This plan is a starting point, not a booking or live information. Confirm opening hours, admission, weather and current transport before travelling.',
    localOnly: 'Your message is processed in this browser and is not sent to an external AI service.'
  }
};

let lastTripAssistantQuery = '';

function getTripAssistantLanguage() {
  return window.I18N?.getLanguage?.() === 'en' || document.documentElement.lang === 'en' ? 'en' : 'th';
}

function formatTripCopy(template, variables = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? `{${key}}`);
}

function parseTripPlannerRequest(value) {
  const normalized = String(value || '')
    .replace(/[๐-๙]/g, digit => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(digit)))
    .replace(/[‐‑‒–—]/g, '-')
    .toLowerCase()
    .trim();
  const dayMatch = [
    /(\d{1,2})\s*วัน\b/i,
    /(\d{1,2})\s*-\s*day(?:s)?\b/i,
    /(\d{1,2})\s+day(?:s)?\b/i,
    /\btrip\s+for\s+(\d{1,2})\s+day(?:s)?\b/i
  ].map(pattern => normalized.match(pattern)).find(Boolean);
  const budgetMatch = normalized.match(/(?:งบ(?:ประมาณ)?|budget(?:\s+of)?)\s*(?:ประมาณ|ราว|about)?\s*(?:฿|thb)?\s*([\d,]+)/i);
  const regionPatterns = [
    ['northeast', /อีสาน|ตะวันออกเฉียงเหนือ|\bisan\b|north\s*east|northeast/],
    ['north', /ภาคเหนือ|ทางเหนือ|\bnorth(?:ern)?\b/],
    ['south', /ภาคใต้|ทางใต้|\bsouth(?:ern)?\b/],
    ['east', /ภาคตะวันออก|ทางตะวันออก|\beast(?:ern)?\b/],
    ['central', /ภาคกลาง|กรุงเทพ|\bcentral\b|bangkok/]
  ];
  const interestPatterns = [
    ['beach', /ทะเล|ชายหาด|เกาะ|beach|island|sea/],
    ['mountain', /ภูเขา|ดอย|mountain|hiking/],
    ['temple', /วัด|โบราณ|ประวัติศาสตร์|temple|history|historic/],
    ['nature', /ธรรมชาติ|น้ำตก|อุทยาน|nature|waterfall|park/],
    ['culture', /วัฒนธรรม|ชุมชน|อาหาร|culture|community|food/]
  ];

  return {
    raw: String(value || '').trim(),
    days: Math.min(10, Math.max(1, Number(dayMatch?.[1]) || 3)),
    region: regionPatterns.find(([, pattern]) => pattern.test(normalized))?.[0] || null,
    interest: interestPatterns.find(([, pattern]) => pattern.test(normalized))?.[0] || null,
    budget: budgetMatch ? Number(budgetMatch[1].replace(/,/g, '')) : null
  };
}

function getTripTemplate(request) {
  const templates = Array.isArray(window.TRIP_PLANNER_TEMPLATES) ? window.TRIP_PLANNER_TEMPLATES : [];
  return templates.find(template => template.region === request.region && template.days === request.days) || null;
}

function buildGenericTripDays(request, language) {
  const inRegion = destinations.filter(destination => !request.region || destination.region === request.region);
  const interestMatches = request.interest
    ? inRegion.filter(destination => normalizeCategoryList(destination).includes(request.interest))
    : [];
  const candidates = [...interestMatches, ...inRegion.filter(destination => !interestMatches.includes(destination))];
  const fallback = candidates.length ? candidates : destinations;

  return Array.from({ length: request.days }, (_, index) => {
    const destination = fallback[index % fallback.length];
    const attraction = destination?.primaryAttraction || null;
    return {
      day: index + 1,
      provinceSlug: destination?.provinceSlug || destination?.slug || '',
      province: destination?.province || destination?.name || '',
      stops: attraction?.name?.[language] ? [attraction.name[language]] : [],
      verifiedAttraction: Boolean(attraction)
    };
  });
}

function buildTripPlan(request) {
  const language = getTripAssistantLanguage();
  const copy = TRIP_ASSISTANT_COPY[language];
  const template = getTripTemplate(request);

  if (template) {
    return {
      title: template.title[language], meta: copy.exactMeta,
      days: template.itinerary.map(item => ({
        day: item.day, provinceSlug: item.provinceSlug, province: item.province[language],
        stops: item.stops[language], verifiedAttraction: true
      })),
      source: template.source, request
    };
  }

  const region = request.region ? normalizeRegionLabel(request.region) : copy.allRegions;
  return {
    title: formatTripCopy(copy.genericTitle, { region, days: request.days }),
    meta: copy.generatedMeta,
    days: buildGenericTripDays(request, language), source: null, request
  };
}

function createTripTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createTripMessage(kind) {
  const message = document.createElement('article');
  message.className = `trip-message trip-message-${kind}`;
  return message;
}

function renderTripAssistantWelcome(container, copy) {
  const message = createTripMessage('assistant');
  const icon = document.createElement('span');
  icon.className = 'trip-message-avatar';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<i class="fas fa-compass"></i>';
  const content = document.createElement('div');
  content.append(createTripTextElement('h3', '', copy.welcomeTitle));
  content.append(createTripTextElement('p', '', copy.welcomeBody));
  message.append(icon, content);
  container.replaceChildren(message);
}

function syncTripDaysToBudget(days) {
  const form = document.getElementById('budget-form');
  if (!form) return;
  form.elements.days.value = String(days);
  form.elements.nights.value = String(Math.max(0, days - 1));
  form.dispatchEvent(new Event('input', { bubbles: true }));
}

function renderTripPlan(plan) {
  const container = document.getElementById('trip-assistant-messages');
  if (!container) return;
  const language = getTripAssistantLanguage();
  const copy = TRIP_ASSISTANT_COPY[language];
  const userMessage = createTripMessage('user');
  userMessage.append(createTripTextElement('p', '', plan.request.raw));
  const response = createTripMessage('assistant');
  const icon = document.createElement('span');
  icon.className = 'trip-message-avatar';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<i class="fas fa-route"></i>';
  const content = document.createElement('div');
  content.className = 'trip-plan-response';
  content.append(createTripTextElement('h3', '', plan.title));
  content.append(createTripTextElement('p', 'trip-plan-meta', plan.meta));
  const grid = document.createElement('div');
  grid.className = 'trip-day-grid';

  plan.days.forEach(item => {
    const card = document.createElement('article');
    card.className = 'trip-day-card';
    card.append(createTripTextElement('span', 'trip-day-number', `${copy.day} ${item.day}`));
    card.append(createTripTextElement('h4', '', item.province));
    if (item.stops.length) {
      const list = document.createElement('ul');
      item.stops.forEach(stop => {
        const listItem = document.createElement('li');
        const marker = document.createElement('i');
        marker.className = 'fas fa-location-dot';
        marker.setAttribute('aria-hidden', 'true');
        listItem.append(marker, document.createTextNode(stop));
        list.append(listItem);
      });
      card.append(list);
      if (!plan.source && item.verifiedAttraction) card.append(createTripTextElement('p', 'trip-day-verification', copy.verifiedStop));
    } else {
      card.append(createTripTextElement('p', 'trip-day-pending', copy.pending));
    }
    if (item.provinceSlug) {
      const link = document.createElement('a');
      link.className = 'trip-day-link';
      link.href = `destinations/${item.provinceSlug}/`;
      link.append(document.createTextNode(copy.details));
      const arrow = document.createElement('i');
      arrow.className = 'fas fa-arrow-right';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow);
      card.append(link);
    }
    grid.append(card);
  });
  content.append(grid);

  if (plan.source) {
    const source = document.createElement('p');
    source.className = 'trip-plan-source';
    source.append(document.createTextNode(`${copy.source}: `));
    const link = document.createElement('a');
    link.href = plan.source.url;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = plan.source.name[language];
    source.append(link, document.createTextNode(` · ${copy.verified} ${plan.source.verifiedOn}`));
    content.append(source);
  }

  const budgetText = plan.request.budget
    ? formatTripCopy(copy.budget, { budget: new Intl.NumberFormat(language === 'en' ? 'en-US' : 'th-TH').format(plan.request.budget) })
    : copy.noBudget;
  content.append(createTripTextElement('p', 'trip-plan-budget', budgetText));
  content.append(createTripTextElement('p', 'trip-plan-disclaimer', copy.disclaimer));
  content.append(createTripTextElement('p', 'trip-plan-local', copy.localOnly));
  response.append(icon, content);
  container.replaceChildren(userMessage, response);
  syncTripDaysToBudget(plan.request.days);
}

function renderTripAssistant() {
  const form = document.getElementById('trip-assistant-form');
  const container = document.getElementById('trip-assistant-messages');
  const input = document.getElementById('trip-assistant-input');
  if (!form || !container || !input) return;
  const language = getTripAssistantLanguage();
  const copy = TRIP_ASSISTANT_COPY[language];
  const label = form.querySelector('label[for="trip-assistant-input"]');
  const buttonLabel = form.querySelector('button[type="submit"] span');
  if (label) label.textContent = copy.inputLabel;
  input.placeholder = copy.inputPlaceholder;
  if (buttonLabel) buttonLabel.textContent = copy.submit;
  document.querySelector('.trip-assistant-suggestions')?.setAttribute('aria-label', copy.suggestions);
  document.querySelectorAll('.trip-suggestion').forEach(button => {
    button.textContent = language === 'en' ? button.dataset.promptEn : button.dataset.promptTh;
  });

  if (lastTripAssistantQuery) {
    input.value = lastTripAssistantQuery;
    renderTripPlan(buildTripPlan(parseTripPlannerRequest(lastTripAssistantQuery)));
  } else {
    renderTripAssistantWelcome(container, copy);
  }

  if (form.dataset.bound === 'true') return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) { input.focus(); return; }
    lastTripAssistantQuery = query;
    renderTripPlan(buildTripPlan(parseTripPlannerRequest(query)));
  });
  document.querySelectorAll('.trip-suggestion').forEach(button => {
    button.addEventListener('click', () => {
      input.value = getTripAssistantLanguage() === 'en' ? button.dataset.promptEn : button.dataset.promptTh;
      form.requestSubmit();
    });
  });
  form.dataset.bound = 'true';
}

window.parseTripPlannerRequest = parseTripPlannerRequest;
window.buildTripPlan = buildTripPlan;
window.renderTripAssistant = renderTripAssistant;
document.addEventListener('languagechange', renderTripAssistant);

function renderDataCoverage() {
  const uniqueRegions = new Set(destinations.map(item => item.region).filter(Boolean));
  const curatedCount = destinations.filter(item => item.galleryCurated === true).length;
  const verifiedCount = Object.keys(window.VERIFIED_ATTRACTIONS || {}).length;
  const stats = [
    ['fa-map-marked-alt', destinations.length, window.I18N?.t('dashboard.destinations') || 'จังหวัดในฐานข้อมูล'],
    ['fa-images', galleryImages.length, window.I18N?.t('dashboard.images') || 'ภาพที่เชื่อมกับสถานที่'],
    ['fa-circle-check', curatedCount, window.I18N?.t('dashboard.curated') || 'จังหวัดที่คัดภาพแล้ว'],
    ['fa-layer-group', uniqueRegions.size, window.I18N?.t('dashboard.regions') || 'ภูมิภาคที่ครอบคลุม']
  ];
  const container = document.getElementById('dashboard-stats');
  if (container) {
    container.innerHTML = stats.map(([icon, value, label]) => `
      <article class="dash-stat" data-source="destinations">
        <div class="dash-icon"><i class="fas ${icon}"></i></div>
        <div><div class="dash-num">${value}</div><div class="dash-label">${label}</div></div>
      </article>`).join('');
  }

  const aboutDestinations = document.getElementById('about-destination-count');
  const aboutRegions = document.getElementById('about-region-count');
  const contactScope = document.getElementById('contact-data-scope');
  if (aboutDestinations) aboutDestinations.textContent = String(destinations.length);
  if (aboutRegions) aboutRegions.textContent = String(uniqueRegions.size);
  if (contactScope) {
    contactScope.textContent = window.I18N?.getLanguage() === 'en'
      ? `${destinations.length} provinces`
      : `${destinations.length} จังหวัด`;
  }

  const heroProvinceCount = document.getElementById('hero-province-count');
  const heroVerifiedCount = document.getElementById('hero-verified-count');
  const heroGalleryCount = document.getElementById('hero-gallery-count');
  if (heroProvinceCount) heroProvinceCount.textContent = String(destinations.length);
  if (heroVerifiedCount) heroVerifiedCount.textContent = String(verifiedCount);
  if (heroGalleryCount) heroGalleryCount.textContent = String(galleryImages.length);
}
window.__hydrateTravelData = function hydrateTravelData() {
  if (Array.isArray(window.DESTINATIONS) && window.DESTINATIONS.length) {
    destinations = window.DESTINATIONS.map(item =>
      normalizeIndexDestination(item)
    );
    const validDestinationIds = new Set(destinations.map(item => item.id));
    favorites = favorites.filter(id => validDestinationIds.has(id));
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
  renderCrossPageDestinationGrids();
  renderDataCoverage();
  if (currentPage === 'dashboard' && typeof window.Chart === 'function') {
    chartsInit = initCharts() !== false;
  }
};
// ===== STATE =====
let favorites = [];
try {
  const savedFavorites = JSON.parse(localStorage.getItem('tt_favs') || '[]');
  favorites = Array.isArray(savedFavorites)
    ? [...new Set(savedFavorites.map(Number).filter(Number.isInteger))]
    : [];
} catch (error) {
  localStorage.removeItem('tt_favs');
  console.warn('Invalid favorites data was cleared', error);
}
let activeFilter = '';
let showFavoritesOnly = false;
let currentPage = 'home';
let chartsInit = false;

function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.add('theme-switching');
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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.documentElement.classList.remove('theme-switching'));
  });
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
  const regionLabel = normalizeRegionLabel(d.region);
  const imageSource = d.heroImage || 'assets/images/provinces/bangkok/hero.webp';

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
          data-destination-id="${d.id}"
          onclick="toggleFav(${d.id},this)"
          aria-label="${window.I18N?.t(isFav ? 'favorite.removeLabel' : 'favorite.saveLabel') || (isFav ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด')}: ${d.name}"
          title="${window.I18N?.t(isFav ? 'favorite.removeLabel' : 'favorite.saveLabel') || (isFav ? 'นำออกจากรายการโปรด' : 'บันทึกสถานที่')}"
        >
          <i class="${isFav ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-region">${regionLabel}</div>
        <h3 class="card-title">${d.name}</h3>
        <p class="card-desc">${d.desc}</p>
        <div class="card-footer">
          <div class="card-rating">
            <i class="fas fa-location-dot" aria-hidden="true"></i>
            <span>${d.province || d.name}</span>
          </div>
          <a class="card-cta" href="destinations/${d.provinceSlug || d.slug}/">${window.I18N?.getLanguage() === 'en' ? 'Details' : 'รายละเอียด'}</a>
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
  const sorted = [...destinations].sort((a, b) => Number(a.id) - Number(b.id));

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
    const matchFavorite = !showFavoritesOnly || favorites.includes(destination.id);
    return matchRegion && matchSearch && matchFavorite;
  });

  const status = document.getElementById('destination-results-status');
  const noResults = document.getElementById('no-results');
  const tr = (key, variables, fallback) => window.I18N?.t(key, variables) || fallback;

  if (status) {
    status.textContent = showFavoritesOnly
      ? tr('favorite.status', { count: filtered.length, saved: favorites.length }, `แสดงรายการโปรด ${filtered.length} จาก ${favorites.length} รายการ`)
      : tr('destination.status', { count: filtered.length, total: destinations.length }, `แสดง ${filtered.length} จาก ${destinations.length} สถานที่`);
  }

  syncFavoritesFilterControl();

  if (filtered.length === 0) {
    el.innerHTML = '';
    if (noResults) {
      noResults.style.display = 'block';
      const title = document.getElementById('no-results-title');
      const description = document.getElementById('no-results-description');
      if (title) title.textContent = showFavoritesOnly
        ? tr('favorite.emptyTitle', {}, 'ยังไม่มีสถานที่โปรดที่ตรงกับตัวกรอง')
        : tr('destination.emptyTitle', {}, 'ไม่พบสถานที่ที่ค้นหา');
      if (description) description.textContent = showFavoritesOnly
        ? tr('favorite.emptyDescription', {}, 'กดรูปหัวใจบนการ์ดสถานที่เพื่อบันทึกไว้ดูภายหลัง')
        : tr('destination.emptyDescription', {}, 'ลองค้นหาด้วยคำอื่น หรือเลือกภูมิภาคอื่น');
    }
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

  const openLabel = window.I18N?.t('gallery.open') || 'เปิดรูปภาพ';
  el.innerHTML = galleryImages.map((img,i) => {
    const safeCaptionText = escapeHTMLText(img.cap);
    const safeCaptionAttribute = escapeHTMLAttribute(img.cap);
    const safeSource = escapeHTMLAttribute(getSafeGalleryImageSource(img.src));
    return `
      <button class="gallery-item fade-in" type="button" onclick="openLightbox(${i})" aria-label="${escapeHTMLAttribute(openLabel)}: ${safeCaptionAttribute}">
        <img src="${safeSource}" alt="${safeCaptionAttribute}" loading="lazy" decoding="async">
        <div class="gallery-overlay" aria-hidden="true"><i class="fas fa-expand-alt"></i></div>
        <div class="gallery-caption">${safeCaptionText}</div>
      </button>`;
  }).join('');

  el.dataset.rendered = 'true';
  observeFade();
}

// ===== INTERACTIONS =====
function syncFavoritesFilterControl() {
  const button = document.getElementById('favorites-filter');
  const label = document.getElementById('favorites-filter-label');
  if (!button || !label) return;

  label.textContent = window.I18N?.t('favorite.filter', { count: favorites.length }) || `รายการโปรด (${favorites.length})`;
  button.classList.toggle('active', showFavoritesOnly);
  button.setAttribute('aria-pressed', String(showFavoritesOnly));
  button.setAttribute('aria-label', window.I18N?.t('favorite.filterLabel') || 'แสดงเฉพาะรายการโปรด');
}

function syncFavoriteButtons(id) {
  const selector = id === undefined ? '.card-fav[data-destination-id]' : `.card-fav[data-destination-id="${id}"]`;
  document.querySelectorAll(selector).forEach(button => {
    const destinationId = Number(button.dataset.destinationId);
    const destination = destinations.find(item => item.id === destinationId);
    const liked = favorites.includes(destinationId);
    const label = window.I18N?.t(liked ? 'favorite.removeLabel' : 'favorite.saveLabel') || (liked ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด');
    button.innerHTML = `<i class="${liked ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>`;
    button.classList.toggle('liked', liked);
    button.setAttribute('aria-label', `${label}: ${destination?.name || ''}`.trim());
    button.setAttribute('title', label);
  });
}

function toggleFavoritesFilter() {
  showFavoritesOnly = !showFavoritesOnly;
  syncFavoritesFilterControl();
  filterCards();
}

function toggleFav(id) {
  const idx = favorites.indexOf(id);
  if (idx === -1) {
    favorites.push(id);
    Swal.fire({ toast:true, position:'top-end', icon:'success', title:window.I18N?.t('favorite.added') || 'เพิ่มในรายการโปรดแล้ว!', showConfirmButton:false, timer:1800, timerProgressBar:true });
  } else {
    favorites.splice(idx,1);
    Swal.fire({ toast:true, position:'top-end', icon:'info', title:window.I18N?.t('favorite.removed') || 'นำออกจากรายการโปรดแล้ว', showConfirmButton:false, timer:1800 });
  }
  try {
    localStorage.setItem('tt_favs', JSON.stringify(favorites));
  } catch (error) {
    console.warn('Favorites could not be saved', error);
  }
  syncFavoriteButtons(id);
  syncFavoritesFilterControl();
  if (currentPage === 'destinations' && showFavoritesOnly) filterCards();
}

function openModal(id) {
  const d = destinations.find(item => item.id === id);
  if (!d) return;

  const modal = document.getElementById('modal');
  if (modal) modal.dataset.destinationId = String(id);

  const tr = (key, fallback) => window.I18N?.t(key) || fallback;
  const language = window.I18N?.getLanguage() === 'en' ? 'en' : 'th';
  const attraction = d.primaryAttraction;
  const image = document.getElementById('modal-img');

  const modalImages = Array.isArray(d.galleryImages) && d.galleryImages.length
    ? d.galleryImages
    : [d.heroImage];

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

  const attractionDetails = attraction ? `
    <div class="modal-info-item"><i class="fas fa-location-dot"></i> ${tr('dialog.attraction', 'สถานที่ท่องเที่ยว')}: ${attraction.name[language]}</div>
    <div class="modal-info-item"><i class="fas fa-clock"></i> ${tr('dialog.hours', 'เวลาเปิด–ปิด')}: ${attraction.hours[language]}</div>
    <div class="modal-info-item"><i class="fas fa-ticket"></i> ${tr('dialog.admission', 'ค่าเข้าชม')}: ${attraction.admission[language]}</div>
    <div class="modal-info-actions">
      <a href="${attraction.googleMaps}" target="_blank" rel="noopener noreferrer"><i class="fas fa-map-location-dot"></i> ${tr('dialog.mapsShort', 'แผนที่')}</a>
      <a href="${attraction.officialSource}" target="_blank" rel="noopener noreferrer" title="${attraction.sourceLabel} · ${attraction.verifiedOn}"><i class="fas fa-circle-check"></i> ${tr('dialog.sourceShort', 'ข้อมูลอ้างอิง')}</a>
      <a href="${attraction.agoda}" target="_blank" rel="sponsored noopener noreferrer"><i class="fas fa-hotel"></i> ${tr('dialog.staysShort', 'ที่พัก')}</a>
    </div>` : `
    <div class="modal-info-item"><i class="fas fa-circle-info"></i> ${tr('dialog.pendingAttraction', 'ข้อมูลสถานที่เฉพาะกำลังรอตรวจสอบจากแหล่งทางการ')}</div>`;

  document.getElementById('modal-info').innerHTML = attractionDetails;

  openAccessibleOverlay(modal, '.modal-close');
}
function closeModal(e) { if (e.target.id==='modal') closeModalBtn(); }
function closeModalBtn() { closeAccessibleOverlay(document.getElementById('modal')); }

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
  openAccessibleOverlay(lightbox, 'button');
}

function lightboxNav(step) {
  openLightbox(currentLightboxIndex + step);
}

function closeLightbox(event) {
  if (event && event.target !== event.currentTarget) return;

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  closeAccessibleOverlay(lightbox);
}

const overlayOpeners = new WeakMap();

function getOverlayFocusables(overlay) {
  if (!overlay) return [];
  return [...overlay.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(element => !element.hidden && element.getClientRects().length > 0);
}

function syncOverlayScrollLock() {
  document.body.style.overflow = document.querySelector('.modal-overlay.open') ? 'hidden' : '';
}

function openAccessibleOverlay(overlay, initialFocusSelector) {
  if (!overlay) return;
  if (!overlay.classList.contains('open')) {
    overlayOpeners.set(overlay, document.activeElement);
  }
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  syncOverlayScrollLock();

  requestAnimationFrame(() => {
    const initial = overlay.querySelector(initialFocusSelector) || getOverlayFocusables(overlay)[0];
    initial?.focus();
  });
}

function closeAccessibleOverlay(overlay) {
  if (!overlay?.classList.contains('open')) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  syncOverlayScrollLock();

  const opener = overlayOpeners.get(overlay);
  overlayOpeners.delete(overlay);
  if (opener?.isConnected) requestAnimationFrame(() => opener.focus());
}

function trapOverlayFocus(event, overlay) {
  const focusables = getOverlayFocusables(overlay);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (!overlay.contains(document.activeElement)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

window.openAccessibleOverlay = openAccessibleOverlay;
window.closeAccessibleOverlay = closeAccessibleOverlay;

function filterCards() {
  const q = document.getElementById('main-search')?.value || '';
  renderDestCards(activeFilter, q);
}

function setFilter(region, btn) {
  activeFilter = region;

  document.querySelectorAll('.filter-btn:not(.favorites-filter)').forEach(button => {
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

  document.querySelectorAll('.filter-btn:not(.favorites-filter)').forEach(button => {
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
  document.querySelectorAll('.filter-btn:not(.favorites-filter)').forEach(button => {
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

  document.querySelectorAll('.filter-btn:not(.favorites-filter)').forEach(button => {
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
  promotions: 'ผู้ช่วยวางแผนทริป | Thailand Travel Guide',
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
        existing.remove();
        chartLibraryPromise = null;
        reject(new Error('Unable to load Chart.js'));
      }, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.dataset.chartLoader = 'true';
    script.integrity = 'sha512-CQBWl4fJHWbryGE+Pc7UAxWMUMNMWzWxF4SQo9CgkJIN1kx6djDQZjh3Y8SZ1d+6I+1zze6Z7kHXO7q3UyZAWw==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    script.onload = finish;
    script.onerror = () => {
      script.remove();
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
  if (typeof window.Chart === "undefined") {
    console.warn("Chart.js is unavailable; dashboard charts were skipped.");
    return false;
  }

  const colors = ["#1A7A8A", "#C9A84C", "#E8694A", "#2EADC0", "#8FAAB2"];
  const regionOrder = ["north", "central", "northeast", "east", "south"];
  const regionRows = regionOrder.map(region => {
    const items = destinations.filter(item => item.region === region);
    return {
      label: normalizeRegionLabel(region),
      destinations: items.length,
      images: items.reduce((total, item) => total + (Array.isArray(item.galleryImages) ? item.galleryImages.length : 0), 0)
    };
  });
  const categoryCounts = new Map();
  destinations.forEach(item => {
    normalizeCategoryList(item).forEach(category => {
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });
  });
  const categoryRows = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const createChart = (canvasId, config) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    if (typeof window.Chart.getChart === "function") {
      window.Chart.getChart(canvas)?.destroy();
    }
    try {
      return new window.Chart(canvas, config);
    } catch (error) {
      console.error(`Unable to render chart: ${canvasId}`, error);
      return null;
    }
  };

  createChart("lineChart", {
    type: "bar",
    data: {
      labels: regionRows.map(row => row.label),
      datasets: [{
        label: window.I18N?.t("dashboard.destinations") || "จังหวัดในฐานข้อมูล",
        data: regionRows.map(row => row.destinations),
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });

  createChart("doughnutChart", {
    type: "doughnut",
    data: {
      labels: categoryRows.map(([category]) => category),
      datasets: [{
        data: categoryRows.map(([, count]) => count),
        backgroundColor: categoryRows.map((_, index) => colors[index % colors.length]),
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { padding: 16, font: { family: "Sarabun" } } } },
      cutout: "65%"
    }
  });

  createChart("barChart", {
    type: "bar",
    data: {
      labels: regionRows.map(row => row.label),
      datasets: [{
        label: window.I18N?.t("dashboard.images") || "ภาพที่เชื่อมกับสถานที่",
        data: regionRows.map(row => row.images),
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
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
    const openOverlays = [...document.querySelectorAll('.modal-overlay.open')];
    const overlay = openOverlays[openOverlays.length - 1];

    if (event.key === 'Escape') {
      if (overlay?.id === 'modal') closeModalBtn();
      else if (overlay?.id === 'lightbox') closeLightbox();
      else if (overlay?.id === 'blog-modal') window.closeBlogArticleBtn?.();
      else closeMobile();
      return;
    }

    if (event.key === 'Tab' && overlay) {
      trapOverlayFocus(event, overlay);
      return;
    }

    if (overlay?.id !== 'lightbox') return;

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
