import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = relative => fs.readFileSync(path.join(root, relative), "utf8").replace(/^\uFEFF/, "");
const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const context = { window: {}, console, URL, setTimeout, clearTimeout };
vm.createContext(context);
vm.runInContext(read("js/image-curation-data.js"), context);
vm.runInContext(read("js/data.js"), context);
vm.runInContext(read("js/translations.js"), context);

const destinations = context.window.DESTINATIONS;
const translations = context.window.TRANSLATIONS;
const thaiNames = translations.thaiNames;
const provinceTh = translations.provinceTh;
const categoryTh = translations.categoryTh;
const siteRoot = "https://armddzzpluto-ops.github.io/thai-tourism";
const destinationRoot = path.join(root, "destinations");
const regionTh = { north: "ภาคเหนือ", central: "ภาคกลาง", northeast: "ภาคอีสาน", east: "ภาคตะวันออก", south: "ภาคใต้" };

if (!Array.isArray(destinations) || destinations.length !== 77) {
  throw new Error(`Expected 77 destination records, found ${destinations?.length ?? 0}`);
}

fs.mkdirSync(destinationRoot, { recursive: true });
const expectedDirectories = new Set();

for (const [index, destination] of destinations.entries()) {
  const slug = destination.provinceSlug || destination.slug;
  if (!slug) throw new Error(`Destination ${destination.id} has no stable slug`);
  expectedDirectories.add(slug);

  const thaiName = thaiNames[index] || provinceTh[destination.province] || destination.name;
  const thaiProvince = provinceTh[destination.province] || thaiName;
  const thaiCategory = categoryTh[destination.category]?.label || "วัฒนธรรม";
  const thaiDescription = `${thaiName} เป็นจุดหมายด้าน${thaiCategory}ในจังหวัด${thaiProvince} เหมาะสำหรับใช้วางแผนการเดินทางและตรวจสอบข้อมูลสถานที่จากแหล่งอ้างอิง`;
  const canonical = `${siteRoot}/destinations/${slug}/`;
  const image = `../../${destination.heroImage}`;
  const attraction = destination.primaryAttraction;
  const gallery = Array.isArray(destination.galleryImages) && destination.galleryImages.length
    ? destination.galleryImages
    : [destination.heroImage];

  const attractionHtml = attraction ? `
        <section class="detail-panel" aria-labelledby="verified-heading">
          <h2 id="verified-heading" data-th="ข้อมูลสถานที่ที่ตรวจสอบแล้ว" data-en="Verified attraction information">ข้อมูลสถานที่ที่ตรวจสอบแล้ว</h2>
          <dl class="detail-facts">
            <div><dt data-th="สถานที่ท่องเที่ยว" data-en="Attraction">สถานที่ท่องเที่ยว</dt><dd data-th="${escapeHtml(attraction.name.th)}" data-en="${escapeHtml(attraction.name.en)}">${escapeHtml(attraction.name.th)}</dd></div>
            <div><dt data-th="เวลาเปิด–ปิด" data-en="Opening hours">เวลาเปิด–ปิด</dt><dd data-th="${escapeHtml(attraction.hours.th)}" data-en="${escapeHtml(attraction.hours.en)}">${escapeHtml(attraction.hours.th)}</dd></div>
            <div><dt data-th="ค่าเข้าชม" data-en="Admission">ค่าเข้าชม</dt><dd data-th="${escapeHtml(attraction.admission.th)}" data-en="${escapeHtml(attraction.admission.en)}">${escapeHtml(attraction.admission.th)}</dd></div>
          </dl>
          <div class="detail-actions">
            <a href="${escapeHtml(attraction.googleMaps)}" target="_blank" rel="noopener noreferrer" data-th="เปิด Google Maps" data-en="Open Google Maps">เปิด Google Maps</a>
            <a href="${escapeHtml(attraction.officialSource)}" target="_blank" rel="noopener noreferrer" data-th="แหล่งข้อมูลทางการ" data-en="Official source">แหล่งข้อมูลทางการ</a>
            <a href="${escapeHtml(attraction.agoda)}" target="_blank" rel="sponsored noopener noreferrer" data-th="ค้นหาที่พักบน Agoda" data-en="Find stays on Agoda">ค้นหาที่พักบน Agoda</a>
          </div>
          <p class="verified-date"><span data-th="ตรวจสอบล่าสุด" data-en="Last verified">ตรวจสอบล่าสุด</span>: ${escapeHtml(attraction.verifiedOn)}</p>
        </section>` : `
        <section class="detail-panel" aria-labelledby="verified-heading">
          <h2 id="verified-heading" data-th="สถานะข้อมูลสถานที่" data-en="Attraction data status">สถานะข้อมูลสถานที่</h2>
          <p data-th="ข้อมูลสถานที่เฉพาะ เวลาเปิด–ปิด และค่าเข้าชมกำลังรอตรวจสอบจากแหล่งทางการ จึงยังไม่แสดงข้อมูลคาดเดา" data-en="Specific attraction, opening-hour and admission data are awaiting verification from an official source, so no estimated details are shown.">ข้อมูลสถานที่เฉพาะ เวลาเปิด–ปิด และค่าเข้าชมกำลังรอตรวจสอบจากแหล่งทางการ จึงยังไม่แสดงข้อมูลคาดเดา</p>
          <div class="detail-actions"><a href="${escapeHtml(destination.googleMaps)}" target="_blank" rel="noopener noreferrer" data-th="ค้นหาจังหวัดบน Google Maps" data-en="Find the province on Google Maps">ค้นหาจังหวัดบน Google Maps</a></div>
        </section>`;

  const galleryHtml = gallery.map((source, imageIndex) => {
    const caption = imageIndex === 0
      ? (destination.caption || destination.name)
      : (destination.galleryCaptions?.[imageIndex - 1] || destination.caption || destination.name);
    return `<figure><img src="../../${escapeHtml(source)}" alt="${escapeHtml(caption)}" loading="${imageIndex === 0 ? "eager" : "lazy"}" decoding="async"><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
  }).join("\n          ");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    alternateName: thaiName,
    description: destination.desc,
    url: canonical,
    image: gallery.map(source => `${siteRoot}/${source}`),
    containedInPlace: { "@type": "AdministrativeArea", name: destination.province }
  }).replaceAll("<", "\\u003c");

  const html = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(thaiName)} (${escapeHtml(destination.name)}) | Thailand Travel Guide</title>
  <meta name="description" content="${escapeHtml(thaiDescription)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(thaiName)} (${escapeHtml(destination.name)})">
  <meta property="og:description" content="${escapeHtml(thaiDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteRoot}/${escapeHtml(destination.heroImage)}">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/destination-detail.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw==" crossorigin="anonymous" referrerpolicy="no-referrer">
  <script type="application/ld+json">${jsonLd}</script>
  <script defer src="../../js/destination-detail.js"></script>
</head>
<body class="destination-detail-page">
  <header class="detail-header">
    <a class="detail-brand" href="../../#home" aria-label="Thailand Travel Guide home"><span class="detail-brand-icon" aria-hidden="true"><i class="fas fa-spa"></i></span>Thailand<span>Travel</span></a>
    <nav aria-label="Destination navigation">
      <a href="../../#destinations" data-th="สถานที่ทั้งหมด" data-en="All destinations">สถานที่ทั้งหมด</a>
      <button id="detail-language" type="button" aria-label="Switch language">EN</button>
    </nav>
  </header>
  <main>
    <section class="detail-hero">
      <img src="${image}" alt="${escapeHtml(destination.caption || destination.name)}" fetchpriority="high">
      <div class="detail-hero-overlay"></div>
      <div class="detail-hero-content">
        <a href="../../#destinations" data-th="← กลับไปหน้าสถานที่" data-en="← Back to destinations">← กลับไปหน้าสถานที่</a>
        <p data-th="จังหวัด${escapeHtml(thaiProvince)} · ${escapeHtml(thaiCategory)}" data-en="${escapeHtml(destination.province)} · ${escapeHtml(destination.category)}">จังหวัด${escapeHtml(thaiProvince)} · ${escapeHtml(thaiCategory)}</p>
        <h1 data-th="${escapeHtml(thaiName)}" data-en="${escapeHtml(destination.name)}">${escapeHtml(thaiName)}</h1>
      </div>
    </section>
    <div class="detail-layout">
      <article class="detail-content">
        <section class="detail-panel">
          <h2 data-th="เกี่ยวกับจุดหมายนี้" data-en="About this destination">เกี่ยวกับจุดหมายนี้</h2>
          <p data-th="${escapeHtml(thaiDescription)}" data-en="${escapeHtml(destination.longDesc || destination.desc)}">${escapeHtml(thaiDescription)}</p>
        </section>
        ${attractionHtml}
        <section class="detail-panel" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" data-th="รูปภาพที่เชื่อมกับสถานที่" data-en="Images linked to this destination">รูปภาพที่เชื่อมกับสถานที่</h2>
          <div class="detail-gallery">${galleryHtml}</div>
        </section>
      </article>
      <aside class="detail-sidebar">
        <div class="detail-panel">
          <h2 data-th="ข้อมูลจังหวัด" data-en="Province information">ข้อมูลจังหวัด</h2>
          <dl class="detail-facts">
            <div><dt data-th="จังหวัด" data-en="Province">จังหวัด</dt><dd data-th="${escapeHtml(thaiProvince)}" data-en="${escapeHtml(destination.province)}">${escapeHtml(thaiProvince)}</dd></div>
            <div><dt data-th="ภูมิภาค" data-en="Region">ภูมิภาค</dt><dd data-th="${escapeHtml(regionTh[destination.region] || destination.region)}" data-en="${escapeHtml(destination.region)}">${escapeHtml(regionTh[destination.region] || destination.region)}</dd></div>
          </dl>
        </div>
      </aside>
    </div>
  </main>
  <footer><p>© 2026 Thailand Travel Guide · <a href="https://github.com/armddzzpluto-ops/thai-tourism">GitHub</a></p></footer>
</body>
</html>`;

  const outputDirectory = path.join(destinationRoot, slug);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, "index.html"), html, "utf8");
}

const sitemapUrls = [siteRoot + "/", ...destinations.map(destination =>
  `${siteRoot}/destinations/${destination.provinceSlug || destination.slug}/`
)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");

for (const entry of fs.readdirSync(destinationRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && !expectedDirectories.has(entry.name)) {
    fs.rmSync(path.join(destinationRoot, entry.name), { recursive: true, force: true });
  }
}

console.log(`Generated ${destinations.length} destination detail pages and sitemap.xml.`);
