/* ============================================================
   THAILAND TRAVEL GUIDE 2026 — Shared Data Store
   All mock data lives here so every page renders from one
   single source of truth. No database / backend required.
   ============================================================ */

/* ---------- DESTINATIONS (77 — all provinces) ---------- */
const DESTINATIONS = [
  {
    id: 1, name: "Phuket", province: "Phuket", region: "south",
    category: "beach", rating: 4.8, reviews: 2341, tourists: "9.2M",
    price: "Free entry",
    img: "assets/images/destinations/phuket.webp",
    desc: "Thailand's largest island: 30+ beaches, Sino-Portuguese old town, and legendary nightlife.",
    hours: "Open 24 hours", entry: "Free (beach access)",
    activities: ["Patong Beach sunset walk", "Old Phuket Town street art tour", "Big Buddha viewpoint", "Phi Phi Island day trip"]
  },
  {
    id: 2, name: "Chiang Mai", province: "Chiang Mai", region: "north",
    category: "temple", rating: 4.9, reviews: 3102, tourists: "6.4M", price: "Varies by site",
    img: "assets/images/destinations/chiang-mai.webp",
    desc: "Lanna culture capital surrounded by mountains, home to hundreds of temples and a legendary night market scene.",
    hours: "06:00 – 18:00 (temples)", entry: "฿30–฿50",
    activities: ["Doi Suthep temple at sunrise", "Sunday Walking Street market", "Elephant sanctuary visit", "Old City moat cycling"]
  },
  { id: 3, name: "Krabi", province: "Krabi", region: "south", category: "beach", rating: 4.7, reviews: 1876, tourists: "5.1M", price: "Free",
    img: "assets/images/destinations/krabi.webp",
    desc: "Dramatic limestone karsts rising from emerald water — one of the most photographed coastlines on Earth.",
    hours: "Open 24 hours", entry: "Free (national park fees on islands)",
    activities: ["Railay Beach rock climbing", "Four Islands speedboat tour", "Emerald Pool & Hot Spring", "Tiger Cave Temple hike"] },
  { id: 4, name: "Koh Samui", province: "Surat Thani", region: "south", category: "beach", rating: 4.6, reviews: 1543, tourists: "3.8M", price: "Free",
    img: "assets/images/destinations/gulf-beach.webp",
    desc: "Gulf of Thailand island known for upscale resorts, wellness retreats and the giant Big Buddha statue.",
    hours: "Open 24 hours", entry: "Free",
    activities: ["Chaweng Beach day", "Big Buddha Temple", "Ang Thong Marine Park tour", "Fisherman's Village night market"] },
  { id: 5, name: "Bangkok", province: "Bangkok", region: "central", category: "temple", rating: 4.5, reviews: 5234, tourists: "22.5M", price: "฿200–฿500",
    img: "assets/images/destinations/bangkok.webp",
    desc: "A 24-hour metropolis blending golden temples, riverside markets and Michelin-listed street food.",
    hours: "08:30 – 15:30 (Grand Palace)", entry: "฿500 (Grand Palace)",
    activities: ["Grand Palace & Wat Phra Kaew", "Chatuchak Weekend Market", "Chao Phraya river cruise", "Yaowarat Chinatown food crawl"] },
  { id: 6, name: "Chiang Rai", province: "Chiang Rai", region: "north", category: "temple", rating: 4.7, reviews: 987, tourists: "2.3M", price: "฿100",
    img: "assets/images/destinations/chiang-rai.webp",
    desc: "Thailand's northernmost province, famous for the dazzling White Temple and the Golden Triangle.",
    hours: "08:00 – 17:00", entry: "฿100 (White Temple)",
    activities: ["Wat Rong Khun (White Temple)", "Blue Temple visit", "Golden Triangle viewpoint", "Doi Mae Salong tea plantations"] },
  { id: 7, name: "Pattaya", province: "Chonburi", region: "east", category: "beach", rating: 4.3, reviews: 2109, tourists: "8.9M", price: "Free",
    img: "assets/images/destinations/beach-resort.webp",
    desc: "The closest beach escape from Bangkok, packed with water sports, malls and family attractions.",
    hours: "Open 24 hours", entry: "Free",
    activities: ["Jomtien Beach watersports", "Sanctuary of Truth", "Nong Nooch Tropical Garden", "Walking Street nightlife"] },
  { id: 8, name: "Sukhothai", province: "Sukhothai", region: "central", category: "temple", rating: 4.6, reviews: 756, tourists: "1.1M", price: "฿100",
    img: "assets/images/destinations/historical.webp",
    desc: "UNESCO World Heritage ruins of Thailand's first capital, stunning at sunrise and during Loy Krathong.",
    hours: "06:30 – 19:00", entry: "฿100 + ฿50 (bicycle rental)",
    activities: ["Wat Mahathat ruins", "Wat Si Chum giant Buddha", "Sukhothai Historical Park by bike", "Loy Krathong light festival (Nov)"] },
  { id: 9, name: "Khao Yai", province: "Nakhon Ratchasima", region: "central", category: "nature", rating: 4.5, reviews: 1234, tourists: "1.5M", price: "฿400",
    img: "assets/images/destinations/jungle.webp",
    desc: "A UNESCO World Heritage rainforest national park bursting with waterfalls and wild elephants.",
    hours: "06:00 – 18:00", entry: "฿400 (foreign visitor)",
    activities: ["Haew Narok waterfall trek", "Night safari wildlife spotting", "Khao Yai vineyard tour", "Haew Suwat waterfall"] },
  { id: 10, name: "Koh Chang", province: "Trat", region: "east", category: "beach", rating: 4.4, reviews: 867, tourists: "0.9M", price: "Free",
    img: "assets/images/destinations/tropical-coast.webp",
    desc: "Thailand's second-largest island, 70% covered in jungle, with quiet beaches and a cascading waterfall.",
    hours: "Open 24 hours", entry: "Free",
    activities: ["Klong Plu Waterfall", "White Sand Beach sunset", "Kayaking at Bang Bao", "Mu Koh Chang snorkeling tour"] },
  { id: 11, name: "Nan", province: "Nan", region: "north", category: "nature", rating: 4.8, reviews: 543, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "A hidden mountain province with untouched culture, famous murals and golden marigold fields in November.",
    hours: "08:00 – 17:00", entry: "฿20–฿30",
    activities: ["Wat Phumin mural temple", "Doi Phu Kha marigold fields", "Boklua hot springs", "Hill tribe village visit"] },
  { id: 12, name: "Ubon Ratchathani", province: "Ubon Ratchathani", region: "northeast", category: "nature", rating: 4.5, reviews: 432, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Gateway to Isan, home to 3,000-year-old rock paintings and the dramatic Sam Phan Bok rock formations.",
    hours: "06:00 – 18:00", entry: "Free",
    activities: ["Pha Taem cliff paintings", "Sam Phan Bok 'Grand Canyon'", "Candle Festival (Jul)", "Kaeng Tana rapids"] },
  // ── North: additional ────────────────────────────────────
  { id: 13, name: "Mae Hong Son", province: "Mae Hong Son", region: "north", category: "mountain", rating: 4.7, reviews: 621, tourists: "0.6M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Misty highland province on the Myanmar border with three-pagodas pass and idyllic Pai town.",
    hours: "Open", entry: "Free",
    activities: ["Pai town walking", "Three Pagodas pass view", "Pai river rafting", "Wat Jong Kham lakeside"] },
  { id: 14, name: "Lamphun", province: "Lamphun", region: "north", category: "temple", rating: 4.4, reviews: 312, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "Ancient Hariphunchai kingdom capital; Wat Phra That Hariphunchai houses a 1,000-year-old relic.",
    hours: "06:00 – 17:00", entry: "Free",
    activities: ["Wat Phra That Hariphunchai", "Wat Chama Thewi stupa", "Longan orchards walk", "Traditional Yong textile market"] },
  { id: 15, name: "Lampang", province: "Lampang", region: "north", category: "culture", rating: 4.3, reviews: 289, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "Thailand's horse-carriage city; Wat Phra That Lampang Luang is a Lanna architectural gem.",
    hours: "Open", entry: "Free",
    activities: ["Horse-carriage city tour", "Wat Phra That Lampang Luang", "Thai Elephant Conservation Center", "Ceramic workshop visit"] },
  { id: 16, name: "Phayao", province: "Phayao", region: "north", category: "nature", rating: 4.4, reviews: 267, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Kwan Phayao lake holds a submerged medieval temple visible by boat — a photographer's secret.",
    hours: "Open", entry: "Free",
    activities: ["Kwan Phayao lakeside cycling", "Wat Tilok Aram boat trip", "Doi Bussaracum viewpoint", "Night market stroll"] },
  { id: 17, name: "Phrae", province: "Phrae", region: "north", category: "culture", rating: 4.3, reviews: 198, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Finest teak mansions in Thailand alongside the quirky Phae Mueang Phi rock formations.",
    hours: "Open", entry: "Free",
    activities: ["Vongburi House teak mansion", "Phae Mueang Phi rock park", "Nakhon Wiang moated old town", "Indigo fabric workshop"] },
  { id: 18, name: "Uttaradit", province: "Uttaradit", region: "north", category: "nature", rating: 4.2, reviews: 178, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Ton Sak Yai waterfall and pristine teak forest tucked away on the central-north border.",
    hours: "Open", entry: "Free",
    activities: ["Ton Sak Yai waterfall hike", "Sirikit Dam viewpoint", "Wat Phra Borommathat Thung Yang", "Local langsat fruit market"] },
  // ── Central: additional ──────────────────────────────────
  { id: 19, name: "Ko Kret", province: "Nonthaburi", region: "central", category: "culture", rating: 4.1, reviews: 423, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Mon island community in Chao Phraya with hand-thrown pottery, Mon temples and a weekend market.",
    hours: "Open", entry: "Free",
    activities: ["Mon pottery workshop", "Wat Poramaiyikawat river walk", "Weekend market snacking", "Longtail boat circuit"] },
  { id: 20, name: "Pathum Thani", province: "Pathum Thani", region: "central", category: "culture", rating: 3.9, reviews: 312, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Rangsit's floating market and the lotus-fringed Khlong Rangsit are a calm escape from Bangkok.",
    hours: "Open", entry: "Free",
    activities: ["Klong Lat Mayom floating market", "Lotus pond photography", "Dhammakaya Temple light show", "Fresh noodle boat market"] },
  { id: 21, name: "Samut Prakan", province: "Samut Prakan", region: "central", category: "culture", rating: 4.1, reviews: 387, tourists: "0.5M", price: "฿200",
    img: "assets/images/destinations/historical.webp",
    desc: "Ancient City recreates every major Thai monument; Erawan Museum has a massive three-headed elephant.",
    hours: "08:00 – 18:00", entry: "฿200–฿350",
    activities: ["Ancient City museum park", "Erawan Museum elephant", "Pak Nam seafront", "Bang Pu seaside bird sanctuary"] },
  { id: 22, name: "Ayutthaya", province: "Phra Nakhon Si Ayutthaya", region: "central", category: "temple", rating: 4.7, reviews: 1876, tourists: "3.5M", price: "฿50",
    img: "assets/images/destinations/historical.webp",
    desc: "UNESCO World Heritage capital that ruled Southeast Asia for 417 years; headless Buddha statues haunt the ruins.",
    hours: "08:00 – 18:00", entry: "฿50 per temple",
    activities: ["Wat Phra Ram ruins", "Wat Mahathat tree-root Buddha", "Elephant ride around island", "River cruise at sunset"] },
  { id: 23, name: "Ang Thong", province: "Ang Thong", region: "central", category: "culture", rating: 4.0, reviews: 187, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Riverside province where longtail boats pass fruit orchards and riverside temples on the Chao Phraya.",
    hours: "Open", entry: "Free",
    activities: ["Wat Khun Inthapramun reclining Buddha", "River fruit market", "Krok Mon village pottery", "Cycling along the canals"] },
  { id: 24, name: "Sing Buri", province: "Sing Buri", region: "central", category: "culture", rating: 4.0, reviews: 156, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/historical.webp",
    desc: "Bang Rachan village commemorates villagers who held off a Burmese army; riverside temples dot the Chao Phraya.",
    hours: "Open", entry: "Free",
    activities: ["Bang Rachan memorial park", "Wat Phra Non reclining Buddha", "Riverside bike ride", "Local noodle shops"] },
  { id: 25, name: "Chai Nat", province: "Chai Nat", region: "central", category: "nature", rating: 4.0, reviews: 143, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Chai Nat Bird Park protects rare native cranes at the Chao Phraya headwaters dam.",
    hours: "08:00 – 17:00", entry: "Free",
    activities: ["Chai Nat Bird Park guided walk", "Chao Phraya dam viewpoint", "Wat Phra Borommathat Chai Nat", "Fresh river fish market"] },
  { id: 26, name: "Lop Buri", province: "Lop Buri", region: "central", category: "temple", rating: 4.2, reviews: 534, tourists: "0.6M", price: "฿30",
    img: "assets/images/destinations/historical.webp",
    desc: "Prang Sam Yot Khmer tower is overrun by macaques — the annual Monkey Buffet Festival draws world media.",
    hours: "07:00 – 18:00", entry: "฿30",
    activities: ["Prang Sam Yot monkey towers", "Wat Phra Si Ratana Mahathat", "King Narai's palace museum", "Sunflower fields (Nov)"] },
  { id: 27, name: "Saraburi", province: "Saraburi", region: "central", category: "temple", rating: 4.2, reviews: 298, tourists: "0.3M", price: "฿30",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "Phra Phutthabat sacred Buddha footprint shrine draws pilgrims from across Thailand.",
    hours: "06:00 – 18:00", entry: "฿30",
    activities: ["Phra Phutthabat pilgrimage", "Kaeng Khoi limestone quarry views", "Sunflower field photography (Nov)", "Khao Sam Lan waterfall"] },
  { id: 28, name: "Nakhon Nayok", province: "Nakhon Nayok", region: "central", category: "nature", rating: 4.3, reviews: 356, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Known as 'Switzerland of Thailand' for its green mountain backdrop, waterfalls and white-water rafting.",
    hours: "Open", entry: "Free (park fees apply)",
    activities: ["Sarika waterfall hike", "Nang Rong waterfall swim", "White-water rafting", "Elephant trekking at Wang Takrai"] },
  { id: 29, name: "Suphan Buri", province: "Suphan Buri", region: "central", category: "culture", rating: 4.1, reviews: 267, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/historical.webp",
    desc: "Don Chedi memorial marks King Naresuan's elephant duel victory; U Thong was a Bronze Age city.",
    hours: "Open", entry: "Free",
    activities: ["Don Chedi victory monument", "Wat Pa Lelai reclining Buddha", "U Thong National Museum", "Shrimp paste community"] },
  { id: 30, name: "Nakhon Pathom", province: "Nakhon Pathom", region: "central", category: "temple", rating: 4.2, reviews: 445, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/historical.webp",
    desc: "Phra Pathom Chedi, the world's tallest stupa at 127 m, marks Buddhism's arrival in mainland Southeast Asia.",
    hours: "06:00 – 20:00", entry: "Free",
    activities: ["Phra Pathom Chedi circumambulation", "Damnoen Saduak floating market day trip", "Rose Garden cultural show", "Pomelo orchard visit"] },
  { id: 31, name: "Samut Sakhon", province: "Samut Sakhon", region: "central", category: "culture", rating: 4.0, reviews: 234, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Mahachai fishing harbour is one of Thailand's busiest; seafood straight off the boat is exceptionally fresh.",
    hours: "Open", entry: "Free",
    activities: ["Mahachai fish market at dawn", "Shrimp paste factory tour", "Wat Yai Chet Mongkhon", "Waterfront seafood restaurants"] },
  { id: 32, name: "Samut Songkhram", province: "Samut Songkhram", region: "central", category: "culture", rating: 4.4, reviews: 876, tourists: "0.8M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Amphawa floating market and firefly boat tours along the Mae Klong river are unmissable evening experiences.",
    hours: "Fri–Sun evenings", entry: "Free",
    activities: ["Amphawa floating market", "Firefly boat tour at dusk", "Don Hoi Lot shellfish beach", "Maeklong railway market"] },
  { id: 33, name: "Kanchanaburi", province: "Kanchanaburi", region: "central", category: "nature", rating: 4.5, reviews: 1123, tourists: "1.4M", price: "฿30",
    img: "assets/images/destinations/jungle.webp",
    desc: "Bridge over the River Kwai, Death Railway and Erawan waterfall make this the most historically complex province.",
    hours: "Open", entry: "฿30–฿300",
    activities: ["Bridge over River Kwai", "Erawan 7-tier waterfall", "Death Railway train ride", "Three Pagodas Pass border"] },
  { id: 34, name: "Ratchaburi", province: "Ratchaburi", region: "central", category: "culture", rating: 4.2, reviews: 567, tourists: "0.6M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Damnoen Saduak is the most visited floating market in Thailand; Ratchaburi dragon jars are world-famous.",
    hours: "06:00 – 12:00", entry: "Free",
    activities: ["Damnoen Saduak floating market", "Ratchaburi pottery workshop", "Khao Bin cave temple", "Suan Phueng hill resort"] },
  { id: 35, name: "Phetchaburi", province: "Phetchaburi", region: "central", category: "culture", rating: 4.3, reviews: 489, tourists: "0.5M", price: "฿150",
    img: "assets/images/destinations/historical.webp",
    desc: "Khao Wang hilltop palace, Phra Nakhon Khiri, offers panoramic views; Cha-am beach is 30 minutes away.",
    hours: "08:30 – 16:30", entry: "฿150",
    activities: ["Phra Nakhon Khiri palace", "Khao Luang crystal cave", "Cha-am beach day", "Phetchaburi sweet shop walk"] },
  { id: 36, name: "Prachuap Khiri Khan", province: "Prachuap Khiri Khan", region: "central", category: "beach", rating: 4.4, reviews: 987, tourists: "1.2M", price: "Free",
    img: "assets/images/destinations/beach-resort.webp",
    desc: "Hua Hin is Thailand's oldest beach resort; train to the sea, golf courses and royal palaces line the coast.",
    hours: "Open", entry: "Free",
    activities: ["Hua Hin night market", "Khao Sam Roi Yot wetlands", "Pranburi beach cycling", "Wang Klai Kangwon royal palace"] },
  { id: 37, name: "Kamphaeng Phet", province: "Kamphaeng Phet", region: "central", category: "temple", rating: 4.2, reviews: 298, tourists: "0.3M", price: "฿100",
    img: "assets/images/destinations/historical.webp",
    desc: "Part of the Sukhothai-era World Heritage Site; thick forest walls enclose remarkably well-preserved laterite temples.",
    hours: "08:00 – 17:00", entry: "฿100",
    activities: ["Kamphaeng Phet Historical Park", "Wat Phra That temple", "Ping River cycling", "Kluay Khai local bananas"] },
  { id: 38, name: "Phichit", province: "Phichit", region: "central", category: "nature", rating: 3.9, reviews: 134, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Bueng Si Fai wetland is a 19,000-rai water world teeming with lotus, herons and freshwater fish.",
    hours: "Open", entry: "Free",
    activities: ["Bueng Si Fai boat tour", "Lotus picking season (Jul–Oct)", "Crocodile temple cave", "Local melon farms"] },
  { id: 39, name: "Nakhon Sawan", province: "Nakhon Sawan", region: "central", category: "nature", rating: 4.0, reviews: 267, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Bueng Boraphet, Thailand's largest freshwater lake, hosts tens of thousands of migratory birds each winter.",
    hours: "Open", entry: "Free",
    activities: ["Bueng Boraphet birdwatching", "Chinese New Year parade (Feb)", "Sawan Park hilltop", "Ping-Wang river confluence"] },
  { id: 40, name: "Uthai Thani", province: "Uthai Thani", region: "central", category: "nature", rating: 4.3, reviews: 312, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Huai Kha Khaeng Wildlife Sanctuary is a UNESCO World Heritage site holding tigers, elephants and rare banteng.",
    hours: "Open (permit required)", entry: "Free–฿400",
    activities: ["Huai Kha Khaeng wildlife trek", "Wat Tha Sung glass mosaic temple", "Sakae Krang riverside market", "Tung Ta Mueang viewpoint"] },
  { id: 41, name: "Tak", province: "Tak", region: "central", category: "nature", rating: 4.5, reviews: 534, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Umphang's Thi Lo Su waterfall is the largest in Thailand and one of Asia's most spectacular cascades.",
    hours: "Open (Oct–May)", entry: "Free",
    activities: ["Thi Lo Su waterfall trek", "Umphang raft tour", "Mae Sot market border town", "Kong Koi hot springs"] },
  { id: 42, name: "Phitsanulok", province: "Phitsanulok", region: "central", category: "temple", rating: 4.4, reviews: 578, tourists: "0.6M", price: "Free",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "Wat Phra Si Rattana Mahathat houses the Phra Phuttha Chinnarat, considered the most beautiful Buddha in Thailand.",
    hours: "06:00 – 21:00", entry: "Free",
    activities: ["Phra Phuttha Chinnarat Buddha", "Nan River night walk", "Sergeant Major Thawee Folk Museum", "Phu Hin Rong Kla national park"] },
  { id: 43, name: "Phetchabun", province: "Phetchabun", region: "central", category: "mountain", rating: 4.4, reviews: 678, tourists: "0.7M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Khao Kho is Thailand's go-to winter destination — sea of mist, windmills, flower fields and cool breezes.",
    hours: "Open", entry: "Free",
    activities: ["Khao Kho sea of mist sunrise", "Phu Hin Rong Kla historical park", "Phra That Pha Son Kaew cliff stupa", "Phetchabun tamarind market"] },
  // ── East: additional ─────────────────────────────────────
  { id: 44, name: "Rayong", province: "Rayong", region: "east", category: "beach", rating: 4.4, reviews: 789, tourists: "0.9M", price: "Free",
    img: "assets/images/destinations/gulf-beach.webp",
    desc: "Koh Samet national park island has brilliant white sand beaches, bioluminescent plankton and calm Gulf waters.",
    hours: "Open", entry: "฿200 (national park)",
    activities: ["Koh Samet Hat Sai Kaew beach", "Plankton night kayak", "Rayong fruit orchard tour", "Suan Son Pradipat beach stroll"] },
  { id: 45, name: "Chanthaburi", province: "Chanthaburi", region: "east", category: "nature", rating: 4.3, reviews: 456, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/tropical-coast.webp",
    desc: "The gem-trading capital of Southeast Asia; Phliu and Krathing waterfalls cut through pristine coastal jungle.",
    hours: "Open", entry: "Free",
    activities: ["Gem market street browsing", "Phliu Waterfall picnic", "Cathedral of the Immaculate Conception", "Chanthaburi fruit orchard walk"] },
  { id: 46, name: "Chachoengsao", province: "Chachoengsao", region: "east", category: "culture", rating: 4.0, reviews: 312, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Bang Pakong River province anchored by the revered Wat Sothon Wararam; pink dolphins live in the estuary.",
    hours: "Open", entry: "Free",
    activities: ["Wat Sothon Wararam temple", "Bang Pakong riverside market", "Pink dolphin boat tour", "Old Town walking street"] },
  { id: 47, name: "Prachin Buri", province: "Prachin Buri", region: "east", category: "nature", rating: 4.0, reviews: 189, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Thap Lan National Park and the Prachin Buri Khmer ruin of Prasat Muang Singh are rarely visited gems.",
    hours: "Open", entry: "Free",
    activities: ["Thap Lan forest trekking", "Prasat Muang Singh ruins", "Nam Tok Khao Chan waterfall", "Firefly observation"] },
  { id: 48, name: "Sa Kaeo", province: "Sa Kaeo", region: "east", category: "culture", rating: 4.1, reviews: 234, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/historical.webp",
    desc: "Sdok Kok Thom is a remarkably complete Khmer inscription temple; Aranyaprathet is a buzzing border market town.",
    hours: "08:00 – 17:00", entry: "Free",
    activities: ["Sdok Kok Thom Khmer temple", "Aranyaprathet border market", "Khao Ang Rue Nai Wildlife Sanctuary", "Salakphet waterfall hike"] },
  // ── Northeast: additional ────────────────────────────────
  { id: 49, name: "Buri Ram", province: "Buri Ram", region: "northeast", category: "temple", rating: 4.5, reviews: 678, tourists: "0.7M", price: "Free",
    img: "assets/images/destinations/historical.webp",
    desc: "Phanom Rung Khmer castle crowns an extinct volcano; Buriram United's football stadium is the finest in ASEAN.",
    hours: "06:00 – 18:00", entry: "฿100",
    activities: ["Phanom Rung Khmer castle", "Mueang Tam sanctuary", "Buriram stadium tour", "Silk weaving community"] },
  { id: 50, name: "Surin", province: "Surin", region: "northeast", category: "culture", rating: 4.4, reviews: 534, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "The Surin Elephant Roundup (November) is the world's largest elephant gathering; Ban Ta Klang is the elephant village.",
    hours: "Open", entry: "Free",
    activities: ["Ban Ta Klang elephant village", "Surin silk weaving tour", "Sikhoraphum Khmer sanctuary", "Elephant roundup festival (Nov)"] },
  { id: 51, name: "Si Sa Ket", province: "Si Sa Ket", region: "northeast", category: "nature", rating: 4.3, reviews: 289, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Pha Chan cliff overlooks a sweeping Mun River bend; Pa Hin Ngam's fantastically shaped rocks straddle a meadow.",
    hours: "Open", entry: "Free",
    activities: ["Pha Chan cliff sunrise", "Pa Hin Ngam stone garden", "Khao Phra Viharn cross-border trip", "Prasat Sa Kamphaeng Yai ruins"] },
  { id: 52, name: "Yasothon", province: "Yasothon", region: "northeast", category: "culture", rating: 4.1, reviews: 198, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "The Bun Bang Fai rocket festival lights up the sky each May; Phra That Kong Khao Noi is a cherished reliquary.",
    hours: "Open", entry: "Free",
    activities: ["Bun Bang Fai rocket festival (May)", "Phra That Kong Khao Noi temple", "Craft centre mudmee silk", "Pa Tao pottery village"] },
  { id: 53, name: "Amnat Charoen", province: "Amnat Charoen", region: "northeast", category: "temple", rating: 4.0, reviews: 145, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "Compact Isan province home to Phu Tha Khon limestone outcrops and serene Wat Phutthamon megapark.",
    hours: "Open", entry: "Free",
    activities: ["Phu Tha Khon rock garden", "Wat Phutthamon walking", "Sai Yai pottery community", "Nam Tok Yot Mani waterfall"] },
  { id: 54, name: "Mukdahan", province: "Mukdahan", region: "northeast", category: "nature", rating: 4.2, reviews: 267, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Mukdahan Tower skywalk surveys the Mekong; the Second Thai-Lao Friendship Bridge links to Savannakhet.",
    hours: "Open", entry: "฿30",
    activities: ["Mukdahan Tower skywalk", "Indochina Market shopping", "Phu Pha Thoep rock formations", "Mekong riverside sunset"] },
  { id: 55, name: "Nakhon Phanom", province: "Nakhon Phanom", region: "northeast", category: "temple", rating: 4.4, reviews: 398, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "That Phanom Chedi is the holiest reliquary in Isan; a 100 km Mekong vista stretches to Laos.",
    hours: "06:00 – 21:00", entry: "Free",
    activities: ["That Phanom Chedi pilgrimage", "Mekong river promenade", "Renu Nakhon weaving village", "Pha Taem rock art day trip"] },
  { id: 56, name: "Sakon Nakhon", province: "Sakon Nakhon", region: "northeast", category: "nature", rating: 4.2, reviews: 289, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Nong Han lake is Thailand's largest; Phu Phan National Park hosts bear and banteng in dense forest.",
    hours: "Open", entry: "Free",
    activities: ["Nong Han lake paddleboat", "Phu Phan national park trek", "Wat Phra That Choeng Chum stupa", "Pink lotus lake (Sep–Nov)"] },
  { id: 57, name: "Kalasin", province: "Kalasin", region: "northeast", category: "nature", rating: 4.2, reviews: 234, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Sirindhorn Dinosaur Museum displays Thai-excavated sauropod bones; Pha Nok Khan cliffs are an Isan secret.",
    hours: "08:30 – 16:30", entry: "Free–฿30",
    activities: ["Sirindhorn Dinosaur Museum", "Pha Nok Khan limestone park", "Fa Daed Song Yang ancient city", "Pong Nok Teng silk weavers"] },
  { id: 58, name: "Roi Et", province: "Roi Et", region: "northeast", category: "nature", rating: 4.1, reviews: 198, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Thung Kula Ronghai produces award-winning jasmine rice; Bueng Phlan Chai's lotus lake reflects a city-centre stupa.",
    hours: "Open", entry: "Free",
    activities: ["Bueng Phlan Chai lotus lake", "Roi Et Standing Buddha", "Thung Kula harvest tour (Nov)", "Bung Khong Long birdwatch"] },
  { id: 59, name: "Maha Sarakham", province: "Maha Sarakham", region: "northeast", category: "culture", rating: 3.9, reviews: 156, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "University city and the beating heart of Isan silk culture; Chao Anouvong Park remembers Lao-Thai heritage.",
    hours: "Open", entry: "Free",
    activities: ["Mudmee silk weaving workshop", "Khwao Sinarin local market", "Gem dinosaur fossil site", "Isan street food Talad Phu"] },
  { id: 60, name: "Khon Kaen", province: "Khon Kaen", region: "northeast", category: "culture", rating: 4.2, reviews: 456, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Isan's commercial hub; Kaen Nakhon Lake, silk festivals and a world-class dinosaur museum draw visitors year-round.",
    hours: "Open", entry: "Free",
    activities: ["Kaen Nakhon Lake cycling", "Khon Kaen Silk Festival (Nov)", "Khon Kaen Dinosaur Museum", "Night Bazaar food tour"] },
  { id: 61, name: "Udon Thani", province: "Udon Thani", region: "northeast", category: "culture", rating: 4.3, reviews: 534, tourists: "0.6M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Ban Chiang UNESCO site rewrote Bronze Age history; Nong Han pink lotus lake is the most Instagram-worthy spot in Isan.",
    hours: "Open", entry: "฿150 (Ban Chiang)",
    activities: ["Ban Chiang UNESCO ruins", "Nong Han lotus lake sunrise", "Udon Thani night market", "Wat Pa Ban Tat forest monastery"] },
  { id: 62, name: "Nong Khai", province: "Nong Khai", region: "northeast", category: "culture", rating: 4.3, reviews: 387, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Sala Kaew Ku sculpture garden is one of Southeast Asia's most surreal sites; Naga fireballs appear on the Mekong each October.",
    hours: "Open", entry: "฿50 (Sala Kaew Ku)",
    activities: ["Sala Kaew Ku sculpture garden", "Naga fireball festival (Oct)", "First Thai-Lao Friendship Bridge", "Hat Jommanee beach stroll"] },
  { id: 63, name: "Nong Bua Lamphu", province: "Nong Bua Lamphu", region: "northeast", category: "temple", rating: 4.0, reviews: 167, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Wat Tham Klong Phen forest monastery has cave meditation halls; Phu Phan Kong cliff surveys a verdant plain.",
    hours: "Open", entry: "Free",
    activities: ["Wat Tham Klong Phen forest walk", "Phu Phan Kong cliff view", "Nong Bua Lamphu night market", "Local weaving village"] },
  { id: 64, name: "Loei", province: "Loei", region: "northeast", category: "mountain", rating: 4.6, reviews: 678, tourists: "0.7M", price: "฿30",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Phu Kradueng plateau is Thailand's most famous trekking destination; Phi Ta Khon ghost mask festival is world-famous.",
    hours: "Open (closed May–Sep)", entry: "฿30",
    activities: ["Phu Kradueng plateau camping", "Phi Ta Khon ghost festival (Jun)", "Phu Ruea chilly nights", "Wang Saphung dragon fruit farm"] },
  { id: 65, name: "Chaiyaphum", province: "Chaiyaphum", region: "northeast", category: "nature", rating: 4.2, reviews: 312, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Pa Hin Ngam's alien rock garden sits inside a national park; Mor Hin Khao is the 'Stonehenge of Thailand'.",
    hours: "Open", entry: "Free",
    activities: ["Pa Hin Ngam rock garden", "Mor Hin Khao stone circles", "Tat Ton waterfall", "Wild sunflower fields (Oct–Nov)"] },
  { id: 66, name: "Bueng Kan", province: "Bueng Kan", region: "northeast", category: "nature", rating: 4.4, reviews: 423, tourists: "0.4M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Nong Kung Si pink lotus lake explodes with colour July–November; Wat Phu Tok cliff monastery defies gravity.",
    hours: "Open", entry: "Free",
    activities: ["Nong Kung Si lotus lake boat", "Wat Phu Tok cliff monastery climb", "Mekong river sunset", "Phu Wua wildlife sanctuary trek"] },
  // ── South: additional ────────────────────────────────────
  { id: 67, name: "Chumphon", province: "Chumphon", region: "south", category: "beach", rating: 4.3, reviews: 456, tourists: "0.5M", price: "Free",
    img: "assets/images/destinations/gulf-beach.webp",
    desc: "Gateway province to Koh Tao and Koh Phangan; Thung Wua Laen Beach is 14 km of unspoilt Gulf shoreline.",
    hours: "Open", entry: "Free",
    activities: ["Thung Wua Laen beach walk", "Koh Tao diving day trip", "Chumphon hot springs", "Samet Chan coffee plantation"] },
  { id: 68, name: "Nakhon Si Thammarat", province: "Nakhon Si Thammarat", region: "south", category: "temple", rating: 4.4, reviews: 567, tourists: "0.6M", price: "Free",
    img: "assets/images/destinations/mountain-temple.webp",
    desc: "Wat Phra Mahathat's 77 m chedi is the holiest shrine in peninsular Thailand; Khao Luang is the south's highest peak.",
    hours: "06:00 – 17:00", entry: "Free",
    activities: ["Wat Phra Mahathat Chedi walk", "Khao Luang national park trek", "Nakhontale shadow puppet show", "Karom waterfall swim"] },
  { id: 69, name: "Phang Nga", province: "Phang Nga", region: "south", category: "beach", rating: 4.7, reviews: 987, tourists: "1.2M", price: "Free",
    img: "assets/images/destinations/andaman.webp",
    desc: "Phang Nga Bay's 100+ limestone karsts include James Bond Island (Koh Tapu); sea kayaking through sea caves is unmissable.",
    hours: "Open", entry: "Free",
    activities: ["Sea kayak through sea caves", "James Bond Island boat tour", "Ko Yao island homestay", "Suwan Kuha cave temple"] },
  { id: 70, name: "Trang", province: "Trang", region: "south", category: "beach", rating: 4.5, reviews: 678, tourists: "0.7M", price: "Free",
    img: "assets/images/destinations/andaman.webp",
    desc: "Emerald Cave (Morakot) can only be reached by swimming through a pitch-dark tunnel to a secret beach.",
    hours: "Open (Oct–May)", entry: "Free",
    activities: ["Emerald Cave swim", "Koh Libong dugong spotting", "Hat Pak Meng beach picnic", "Trang dim sum breakfast"] },
  { id: 71, name: "Phatthalung", province: "Phatthalung", region: "south", category: "nature", rating: 4.1, reviews: 234, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/river-isan.webp",
    desc: "Thale Noi waterbird park is home to 182 species; a longtail boat glides through lotus-covered shallows at sunrise.",
    hours: "05:30 – 10:00 (best birdwatch)", entry: "Free",
    activities: ["Thale Noi waterbird boat tour", "Khao Pu-Khao Ya peak views", "Khao Chaison cave temple", "Night market roast duck"] },
  { id: 72, name: "Satun", province: "Satun", region: "south", category: "beach", rating: 4.6, reviews: 567, tourists: "0.6M", price: "฿200",
    img: "assets/images/destinations/andaman.webp",
    desc: "Tarutao Marine National Park — Thailand's first and wildest marine park — holds pristine reef, jungle trails and turtles.",
    hours: "Open (Oct–May)", entry: "฿200",
    activities: ["Tarutao island jungle hike", "Koh Lipe snorkelling", "Koh Adang white sand beach", "Petra cave boat tour"] },
  { id: 73, name: "Songkhla", province: "Songkhla", region: "south", category: "culture", rating: 4.3, reviews: 789, tourists: "1.0M", price: "Free",
    img: "assets/images/destinations/beach-resort.webp",
    desc: "Hat Yai is the south's biggest city and shoppers' paradise; old Songkhla town retains Sino-Portuguese shophouse charm.",
    hours: "Open", entry: "Free",
    activities: ["Hat Yai night market", "Songkhla old town walk", "Ko Yo floating market", "Samila Beach mermaid statue"] },
  { id: 74, name: "Pattani", province: "Pattani", region: "south", category: "culture", rating: 4.0, reviews: 189, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/floating-market.webp",
    desc: "Krue Se Mosque, built over 400 years ago, blends Thai-Malay-Chinese architecture; local batik is hand-drawn with beeswax.",
    hours: "Open", entry: "Free",
    activities: ["Krue Se Mosque visit", "Batik workshop", "Pattani Old Town walk", "Saiburi Coast seafood"] },
  { id: 75, name: "Yala", province: "Yala", region: "south", category: "mountain", rating: 4.3, reviews: 267, tourists: "0.2M", price: "Free",
    img: "assets/images/destinations/mountain-valley.webp",
    desc: "Betong on the Malaysia border is Thailand's southernmost city, with cool highland air, a 700 m tunnel and cherry blossoms.",
    hours: "Open", entry: "Free",
    activities: ["Betong Pit Tunnel walk", "Betong morning mist viewpoint", "Namtok Banglang waterfall", "Malaysian border market"] },
  { id: 76, name: "Narathiwat", province: "Narathiwat", region: "south", category: "beach", rating: 4.0, reviews: 145, tourists: "0.1M", price: "Free",
    img: "assets/images/destinations/gulf-beach.webp",
    desc: "Taksin Ratchaniwet Palace is a royal summer residence overlooking the Gulf of Thailand; Sai Khao is a virgin beach.",
    hours: "Open", entry: "Free",
    activities: ["Taksin Ratchaniwet Palace garden", "Sai Khao beach stroll", "Wat Chon Thara Sing He", "Kolae boat painting workshop"] },
  { id: 77, name: "Ranong", province: "Ranong", region: "south", category: "nature", rating: 4.2, reviews: 312, tourists: "0.3M", price: "Free",
    img: "assets/images/destinations/jungle.webp",
    desc: "Punyaban waterfall and natural hot springs sit inside a rainforest; the Kra Isthmus is Thailand's narrowest point.",
    hours: "Open", entry: "Free",
    activities: ["Punyaban waterfall swim", "Ranong hot springs soak", "Victoria Point Myanmar day trip", "Laem Son National Park mangroves"] }
];

/* ---------- CATEGORIES ---------- */
const CATEGORIES = [
  { key: "beach",    label: "Beach",      icon: "🏖️" },
  { key: "island",   label: "Island",     icon: "🏝️" },
  { key: "mountain", label: "Mountain",   icon: "⛰️" },
  { key: "waterfall",label: "Waterfall",  icon: "💧" },
  { key: "temple",   label: "Temple",     icon: "⛩️" },
  { key: "nature",   label: "Nature",     icon: "🌿" }
];

/* ---------- REGIONS (for interactive map) ---------- */
const REGIONS = [
  { key: "north",     label: "North",      icon: "⛰️", provinces: "Chiang Mai · Chiang Rai · Nan" },
  { key: "central",   label: "Central",    icon: "🏛️", provinces: "Bangkok · Sukhothai · Nakhon Ratchasima" },
  { key: "northeast", label: "Northeast",  icon: "🌾", provinces: "Ubon Ratchathani · Isan" },
  { key: "east",      label: "East",       icon: "🌊", provinces: "Chonburi · Trat" },
  { key: "south",     label: "South",      icon: "🏝️", provinces: "Phuket · Krabi · Surat Thani" }
];

/* ---------- GALLERY IMAGES (12) ---------- */
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80", cap: "Andaman sunset, southern Thailand", tall: true, region: "south" },
  { src: "https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=800&q=80", cap: "Temple courtyard, Chiang Mai", region: "north" },
  { src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", cap: "Limestone cliffs, Krabi", region: "south" },
  { src: "https://images.unsplash.com/photo-1508009603885-50cf7c8a4d60?w=800&q=80", cap: "Bangkok skyline at dusk", tall: true, region: "central" },
  { src: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80", cap: "Phuket beachfront", region: "south" },
  { src: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80", cap: "Koh Samui coconut grove", region: "south" },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", cap: "Sukhothai Historical Park", tall: true, region: "central" },
  { src: "https://images.unsplash.com/photo-1620804900661-1b4cde0d70ff?w=800&q=80", cap: "White Temple, Chiang Rai", region: "north" },
  { src: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=800&q=80", cap: "Khao Yai rainforest canopy", region: "central" },
  { src: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80", cap: "Koh Chang jungle coastline", tall: true, region: "east" },
  { src: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80", cap: "Nan valley morning mist", region: "north" },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", cap: "Doi Suthep golden hour", region: "north" }
];

/* ---------- TESTIMONIALS / REVIEWS (10) ---------- */
const REVIEWS = [
  { name: "Emma Carter", loc: "United Kingdom", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=b6e3f4", rating: 5, place: "Phuket", text: "The most organized travel guide I used for planning my Thailand trip. The destination details were spot on and saved us hours of research." },
  { name: "Liam Chen", loc: "Singapore", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&backgroundColor=c0aede", rating: 5, place: "Chiang Mai", text: "Chiang Mai recommendations were perfect — Doi Suthep at sunrise was exactly as described. Loved the travel planner tool too." },
  { name: "Sophia Rossi", loc: "Italy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=ffd5dc", rating: 4, place: "Krabi", text: "Krabi's limestone cliffs took my breath away. Wish the entry fee info was a touch more detailed, but overall a fantastic resource." },
  { name: "Noah Müller", loc: "Germany", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah&backgroundColor=d1d4f9", rating: 5, place: "Bangkok", text: "Used the dashboard to understand the busiest months before booking — avoided the crowds completely. Brilliant idea for a project." },
  { name: "Ava Johnson", loc: "Australia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava&backgroundColor=ffdfbf", rating: 5, place: "Koh Samui", text: "Beautiful site, genuinely felt like browsing a real commercial travel platform. The gallery alone sold me on visiting Samui." },
  { name: "Lucas Martin", loc: "France", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=c0aede", rating: 4, place: "Chiang Rai", text: "The White Temple guide was accurate down to opening hours. Only wish there were more hidden gem suggestions nearby." },
  { name: "Mia Wilson", loc: "Canada", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=ffd5dc", rating: 5, place: "Pattaya", text: "Took my family to Pattaya based on this guide's family-friendly tags — Nong Nooch Garden was a massive hit with the kids." },
  { name: "Ethan Kim", loc: "South Korea", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan&backgroundColor=b6e3f4", rating: 5, place: "Khao Yai", text: "Loved the interactive map for picking a region. Khao Yai's night safari was an unexpected highlight of our whole trip." },
  { name: "Isabella Garcia", loc: "Spain", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=ffdfbf", rating: 4, place: "Koh Chang", text: "Quiet, jungle-covered, exactly what we wanted after busy Bangkok. The travel planner itinerary matched our pace perfectly." },
  { name: "James Anderson", loc: "United States", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d1d4f9", rating: 5, place: "Nan", text: "Nan was a name I'd never heard of before this site. Genuinely one of the most peaceful places I've ever traveled to — thank you!" }
];

/* ---------- BLOG ARTICLES (6) ---------- */
const BLOG = [
  {
    id: 1, cat: "Beaches", title: "Best Beaches in Thailand for Every Type of Traveler",
    img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=700&q=80",
    excerpt: "From the party shores of Patong to the untouched sands of Koh Chang, here's how to pick the right beach for your style of trip.",
    readtime: "6 min read", date: "May 2026",
    body: `<p>Thailand's coastline stretches across two very different seas — the Andaman in the west and the Gulf of Thailand in the east — and each has its own personality.</p>
    <h4>For nightlife lovers</h4>
    <p>Patong Beach in Phuket and Pattaya's Jomtien strip deliver the liveliest beach scenes, with beach clubs running well past sunset.</p>
    <h4>For quiet escapes</h4>
    <p>Koh Chang and Koh Lanta remain comparatively undeveloped, with long stretches of sand that rarely feel crowded even in high season.</p>
    <h4>For postcard scenery</h4>
    <p>Railay Beach in Krabi is only reachable by longtail boat, hemmed in by limestone cliffs that make it one of the most photographed beaches in Southeast Asia.</p>`
  },
  {
    id: 2, cat: "Mountains", title: "Top Mountains and Highlands Worth the Climb",
    img: "https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=700&q=80",
    excerpt: "Thailand's north isn't just temples — misty highland peaks, tea plantations and cool-season trekking await beyond Chiang Mai.",
    readtime: "5 min read", date: "April 2026",
    body: `<p>While Thailand is best known for its beaches, the northern highlands offer a completely different kind of adventure.</p>
    <h4>Doi Inthanon</h4>
    <p>Thailand's highest peak sits inside a national park filled with cloud forest trails, twin pagodas and dramatic waterfalls.</p>
    <h4>Doi Mae Salong</h4>
    <p>A former Kuomintang settlement turned tea-growing village, this ridge near Chiang Rai is at its best during the cool season from November to February.</p>
    <h4>Doi Phu Kha, Nan</h4>
    <p>Golden marigold fields blanket this remote mountain park each November, drawing photographers from across the country.</p>`
  },
  {
    id: 3, cat: "Hidden Gems", title: "Hidden Gems: Provinces Most Tourists Skip",
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=700&q=80",
    excerpt: "Skip the crowds entirely. These lesser-known provinces offer the same natural beauty without the queues.",
    readtime: "7 min read", date: "March 2026",
    body: `<p>Beyond the well-trodden Bangkok–Chiang Mai–Phuket triangle lies a quieter version of Thailand.</p>
    <h4>Nan</h4>
    <p>Tucked against the Laos border, Nan's old murals and mountain scenery rarely appear on first-time itineraries — which is exactly its appeal.</p>
    <h4>Ubon Ratchathani</h4>
    <p>Home to 3,000-year-old rock art at Pha Taem and the dramatic Sam Phan Bok canyon, this Isan province feels worlds away from the tourist trail.</p>
    <h4>Trat & Koh Chang</h4>
    <p>Thailand's second-largest island remains 70% jungle, with beaches that still feel genuinely undiscovered.</p>`
  },
  {
    id: 4, cat: "Travel Tips", title: "Essential Travel Tips for First-Time Visitors",
    img: "https://images.unsplash.com/photo-1508009603885-50cf7c8a4d60?w=700&q=80",
    excerpt: "Practical advice on timing, transport and etiquette to help your first Thailand trip go smoothly.",
    readtime: "8 min read", date: "February 2026",
    body: `<p>A little preparation goes a long way when traveling around Thailand for the first time.</p>
    <h4>Best time to visit</h4>
    <p>November through February brings the coolest, driest weather across most of the country — the sweet spot for both beaches and temples.</p>
    <h4>Getting around</h4>
    <p>Domestic flights are cheap and frequent between major hubs; for shorter regional hops, overnight trains and buses are comfortable and scenic.</p>
    <h4>Temple etiquette</h4>
    <p>Cover shoulders and knees before entering any temple, and always remove shoes before stepping inside a main hall.</p>`
  },
  {
    id: 5, cat: "Culture", title: "Understanding Thai Festivals Worth Planning Around",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80",
    excerpt: "From floating lanterns to water fights, these festivals can turn a good trip into an unforgettable one.",
    readtime: "5 min read", date: "January 2026",
    body: `<p>Timing a trip around a major festival adds a layer of culture no regular sightseeing day can match.</p>
    <h4>Loy Krathong</h4>
    <p>Held on the full moon of the twelfth lunar month, this festival of floating lanterns is at its most magical in Sukhothai and Chiang Mai.</p>
    <h4>Songkran</h4>
    <p>Thai New Year in mid-April turns entire cities into good-natured water fights — pack a dry bag for your phone.</p>
    <h4>Ubon Candle Festival</h4>
    <p>Every July, Ubon Ratchathani parades enormous hand-carved wax sculptures through the streets.</p>`
  },
  {
    id: 6, cat: "Food", title: "A Street Food Crawl Worth Building a Trip Around",
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80",
    excerpt: "Bangkok's street food scene is Michelin-recognized for good reason. Here's where to start.",
    readtime: "6 min read", date: "December 2025",
    body: `<p>Some of the best meals in Thailand cost less than a coffee back home and come from a cart, not a restaurant.</p>
    <h4>Yaowarat, Chinatown</h4>
    <p>Bangkok's Chinatown lights up after dark with seafood grills, noodle stalls and dessert carts lining the main strip.</p>
    <h4>Chiang Mai's Sunday Walking Street</h4>
    <p>Northern specialties like khao soi and sai oua sausage are easy to find amid the handicraft stalls.</p>
    <h4>Local market mornings</h4>
    <p>Arrive at any provincial market before 8am for the freshest fruit, coffee and breakfast noodle soups.</p>`
  }
];

/* ---------- FAQ (10) ---------- */
const FAQ = [
  { q: "Do I need a visa to visit Thailand?", a: "Many nationalities can enter Thailand visa-free for stays of up to 30–60 days depending on country of origin. Always check the latest requirements with the Thai embassy before booking, as policies change periodically." },
  { q: "What is the best time of year to visit?", a: "November to February is generally considered the best window — cooler temperatures and minimal rainfall across most regions. March to May is hot season, and June to October brings the southwest monsoon with regional variation." },
  { q: "Is Thailand safe for solo travelers?", a: "Thailand is one of Southeast Asia's most visited and tourist-friendly countries. As with anywhere, use common sense: keep valuables secure, use licensed transport, and stay aware of your surroundings at night." },
  { q: "How do I get around between cities?", a: "Domestic flights connect major hubs quickly and affordably. For a more scenic option, overnight trains and long-distance buses are comfortable, well-priced, and a great way to see the countryside." },
  { q: "What currency is used and can I use cards?", a: "The Thai Baht (฿) is the official currency. Cards are widely accepted in cities and tourist areas, but it's wise to carry cash for markets, street food, and rural destinations." },
  { q: "Do I need travel insurance?", a: "While not always legally required, travel insurance covering medical care and trip interruption is strongly recommended, particularly if you plan on motorbiking, diving, or trekking." },
  { q: "What should I wear when visiting temples?", a: "Cover your shoulders and knees, and bring shoes that are easy to slip on and off, since footwear must be removed before entering most temple buildings." },
  { q: "Is the tap water safe to drink?", a: "Tap water is generally not recommended for drinking. Bottled and filtered water is inexpensive and widely available throughout the country." },
  { q: "How many days do I need to see Thailand properly?", a: "Ten to fourteen days lets you comfortably combine one region (e.g. Bangkok + the north, or Bangkok + the islands) without rushing. Use our Travel Planner tool to generate a sample itinerary for your timeframe." },
  { q: "What's the best way to book activities and tours?", a: "Many attractions can be booked on arrival, but popular experiences (island tours, cooking classes, sanctuary visits) are worth reserving a few days ahead during high season to avoid sell-outs." }
];

/* ---------- WEATHER (mock, 4 cities) ---------- */
const WEATHER = [
  { city: "Bangkok",    province: "Central Thailand", tempC: 34, condition: "Sunny",        icon: "☀️", humidity: "62%", wind: "11 km/h" },
  { city: "Chiang Mai", province: "Northern Thailand", tempC: 27, condition: "Partly Cloudy", icon: "⛅", humidity: "58%", wind: "8 km/h" },
  { city: "Phuket",     province: "Southern Thailand", tempC: 31, condition: "Scattered Showers", icon: "🌦️", humidity: "74%", wind: "15 km/h" },
  { city: "Krabi",      province: "Southern Thailand", tempC: 30, condition: "Sunny",        icon: "☀️", humidity: "70%", wind: "13 km/h" }
];

/* ---------- TRAVEL QUOTES ---------- */
const QUOTES = [
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Travel far enough, you meet yourself.", author: "David Mitchell" },
  { text: "Once a year, go someplace you've never been before.", author: "Dalai Lama" },
  { text: "Thailand is proof that paradise can be found, not just imagined.", author: "Travel Editor's Note" },
  { text: "Jobs fill your pocket, but adventures fill your soul.", author: "Jaime Lyn Beatty" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Wherever you go becomes a part of you somehow.", author: "Anita Desai" }
];

/* ---------- TRAVEL STYLE OPTIONS (planner) ---------- */
const TRAVEL_STYLES = [
  { key: "adventure",  label: "Adventure",  icon: "🧗" },
  { key: "nature",     label: "Nature",     icon: "🌿" },
  { key: "family",     label: "Family",     icon: "👨‍👩‍👧" },
  { key: "luxury",     label: "Luxury",     icon: "💎" },
  { key: "backpacker", label: "Backpacker", icon: "🎒" }
];

const BUDGET_OPTIONS = [
  { key: "budget",  label: "Budget (฿)" },
  { key: "mid",     label: "Mid-range (฿฿)" },
  { key: "luxury",  label: "Luxury (฿฿฿)" }
];

/* ---------- ITINERARY ACTIVITY BANK (used by Travel Planner) ----------
   Organized by style so the generator can mix-and-match realistic days */
const ITINERARY_BANK = {
  adventure: [
    "Rock climbing session at a local crag",
    "Jungle zipline canopy tour",
    "White-water kayaking on a nearby river",
    "Sunrise summit trek",
    "Cave exploration with a local guide",
    "Off-road ATV trail ride"
  ],
  nature: [
    "Guided waterfall trek",
    "Sunrise birdwatching walk",
    "National park nature trail",
    "Mangrove forest kayak tour",
    "Botanical garden stroll",
    "Sunset viewpoint hike"
  ],
  family: [
    "Visit to a wildlife or elephant sanctuary",
    "Tropical garden and butterfly park",
    "Beach day with watersport rentals",
    "Local cultural show and dinner",
    "Aquarium or science museum visit",
    "Easy bicycle tour of the old town"
  ],
  luxury: [
    "Private spa and wellness treatment",
    "Fine dining tasting menu",
    "Private longtail boat charter",
    "Rooftop sunset cocktails",
    "Private guided temple tour",
    "Resort infinity pool relaxation"
  ],
  backpacker: [
    "Free walking tour of the old town",
    "Street food crawl",
    "Hostel rooftop sunset social",
    "Local songthaew ride to a viewpoint",
    "Budget market shopping",
    "Public bus day-trip to a nearby town"
  ]
};

const MEAL_SUGGESTIONS = [
  "Breakfast at a local market stall",
  "Lunch of khao soi or pad thai at a family-run shop",
  "Dinner street food crawl",
  "Riverside dinner with local specialties",
  "Rooftop dinner with city views",
  "Traditional Thai breakfast (jok or khao tom)"
];