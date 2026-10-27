# Attraction verification — 2026-10-28

Verification covers attraction identity and province plus explicitly attributed visiting hours. It does not certify live operating status, ticket prices, numeric coordinates, or province photographs. Google Maps links are name searches, not surveyed pins.

| Province | Attraction | Official source | Evidence / limitations |
| --- | --- | --- | --- |
| chiang-rai | วัดร่องขุ่น / Wat Rong Khun, Chiang Rai | [DASTA](https://cbtthailand.dasta.or.th/webapp/relattraction/content/727/) | DASTA confirms identity and location. Its hours lack a recent update date; omit exact hours. |
| sukhothai | อุทยานประวัติศาสตร์สุโขทัย / Sukhothai Historical Park | [Tourism Authority of Thailand, Japan](https://www.thailandtravel.or.jp/sukhothai-historical-park/) | TAT Japan identifies the park and dates hours to August 2026. Fees vary by zone; do not generalize them to every visitor. The global TAT URL returned 404 during review, so use the readable Japan office page. |
| buri-ram | อุทยานประวัติศาสตร์พนมรุ้ง / Phanom Rung Historical Park, Buri Ram | [Tourism Authority of Thailand, Japan](https://www.thailandtravel.or.jp/phanom-rung-historical-park/) | TAT Japan confirms identity, address and listed hours. Do not apply its quoted overseas visitor ticket rate to Thai citizens. |
| phra-nakhon-si-ayutthaya | วัดมหาธาตุ พระนครศรีอยุธยา / Wat Mahathat, Phra Nakhon Si Ayutthaya | [Phra Nakhon Si Ayutthaya Provincial Office](https://go.ayutthaya.go.th/tourist-attraction/wat-mahathat-phra-nakhon-si-ayutthaya/) | Provincial tourism page confirms the specific temple in Ayutthaya. No hours or fees given; do not reproduce dubious machine-translated historical dates. |
| kanchanaburi | สะพานข้ามแม่น้ำแคว / Bridge over the River Kwai, Kanchanaburi | [Tourism Authority of Thailand, Malaysia](https://tourismthailand.my/home/bridge-over-the-river-kwai) | TAT Malaysia identifies the bridge and Kanchanaburi address and lists 24-hour access; no ticket tariff is established. |

## Image audit

Reviewed the existing metadata for all five provinces. Chiang Rai captions are too broad to establish Wat Rong Khun. Sukhothai galleries include military exercise material; Buri Ram includes GPP charts and a school; Ayutthaya includes a balloon event and Ban Pho; Kanchanaburi includes unrelated community/religious scenes. These remain province assets, with no new attraction-image link or verification claim. A separate curation batch is needed. No binary image was changed.

## Remaining work

- 67 provinces still have no source-reviewed attraction record.
- Re-check fees, current hours and precise image identity with venue evidence before enriching these fields.

## Validation

- `npm run build:destinations` regenerated all 77 pages; only the five target HTML files changed.
- `npm run check` passed.
- `npm run test:e2e -- --workers=4` passed all 160 scenarios across Desktop, Notebook, Tablet and Mobile, including the new bilingual/light-dark detail panel, map query and reload assertions.
- Representative Thai mobile and English desktop panels were visually inspected; no text overflow was observed. External assets are stubbed in automated browser tests.
- `git diff --check` passed. The original checkout's five user-modified binary assets were preserved untouched.
