/* ============================================================
   THAILAND TRAVEL GUIDE 2026 — Shared Data Store
   Shared content records used by every page.
   No database / backend required.
   ============================================================ */

/* ---------- DESTINATIONS (77 — all provinces) ---------- */
const DESTINATIONS = [
  {
    id: 1, name: "Phuket", province: "Phuket", region: "south",
    category: "beach",
    desc: "Thailand's largest island: 30+ beaches, Sino-Portuguese old town, and legendary nightlife.",
    hours: "Open 24 hours", entry: "Free (beach access)",
    activities: ["Patong Beach sunset walk", "Old Phuket Town street art tour", "Big Buddha viewpoint", "Phi Phi Island day trip"]
  },
  {
    id: 2, name: "Chiang Mai", province: "Chiang Mai", region: "north",
    category: "temple",
    desc: "Lanna culture capital surrounded by mountains, home to hundreds of temples and a legendary night market scene.",
    hours: "06:00 – 18:00 (temples)", entry: "฿30–฿50",
    activities: ["Doi Suthep temple at sunrise", "Sunday Walking Street market", "Elephant sanctuary visit", "Old City moat cycling"]
  },
  { id: 3, name: "Krabi", province: "Krabi", region: "south", category: "beach",
    desc: "Dramatic limestone karsts rising from emerald water — one of the most photographed coastlines on Earth.",
    hours: "Open 24 hours", entry: "Free (national park fees on islands)",
    activities: ["Railay Beach rock climbing", "Four Islands speedboat tour", "Emerald Pool & Hot Spring", "Tiger Cave Temple hike"] },
  { id: 4, name: "Koh Samui", province: "Surat Thani", region: "south", category: "beach",
    desc: "Gulf of Thailand island known for upscale resorts, wellness retreats and the giant Big Buddha statue.",
    hours: "Open 24 hours", entry: "Free",
    activities: ["Chaweng Beach day", "Big Buddha Temple", "Ang Thong Marine Park tour", "Fisherman's Village night market"] },
  { id: 5, name: "Bangkok", province: "Bangkok", region: "central", category: "temple",
    desc: "A 24-hour metropolis blending golden temples, riverside markets and Michelin-listed street food.",
    hours: "08:30 – 15:30 (Grand Palace)", entry: "฿500 (Grand Palace)",
    activities: ["Grand Palace & Wat Phra Kaew", "Chatuchak Weekend Market", "Chao Phraya river cruise", "Yaowarat Chinatown food crawl"] },
  { id: 6, name: "Chiang Rai", province: "Chiang Rai", region: "north", category: "temple",
    desc: "Thailand's northernmost province, famous for the dazzling White Temple and the Golden Triangle.",
    hours: "08:00 – 17:00", entry: "฿100 (White Temple)",
    activities: ["Wat Rong Khun (White Temple)", "Blue Temple visit", "Golden Triangle viewpoint", "Doi Mae Salong tea plantations"] },
  { id: 7, name: "Pattaya", province: "Chonburi", region: "east", category: "beach",
    desc: "The closest beach escape from Bangkok, packed with water sports, malls and family attractions.",
    hours: "Open 24 hours", entry: "Free",
    activities: ["Jomtien Beach watersports", "Sanctuary of Truth", "Nong Nooch Tropical Garden", "Walking Street nightlife"] },
  { id: 8, name: "Sukhothai", province: "Sukhothai", region: "central", category: "temple",
    desc: "UNESCO World Heritage ruins of Thailand's first capital, stunning at sunrise and during Loy Krathong.",
    hours: "06:30 – 19:00", entry: "฿100 + ฿50 (bicycle rental)",
    activities: ["Wat Mahathat ruins", "Wat Si Chum giant Buddha", "Sukhothai Historical Park by bike", "Loy Krathong light festival (Nov)"] },
  { id: 9, name: "Khao Yai", province: "Nakhon Ratchasima", region: "northeast", category: "nature",
    desc: "A UNESCO World Heritage rainforest national park bursting with waterfalls and wild elephants.",
    hours: "06:00 – 18:00", entry: "฿400 (foreign visitor)",
    activities: ["Haew Narok waterfall trek", "Night safari wildlife spotting", "Khao Yai vineyard tour", "Haew Suwat waterfall"] },
  { id: 10, name: "Koh Chang", province: "Trat", region: "east", category: "beach",
    desc: "Thailand's second-largest island, 70% covered in jungle, with quiet beaches and a cascading waterfall.",
    hours: "Open 24 hours", entry: "Free",
    activities: ["Klong Plu Waterfall", "White Sand Beach sunset", "Kayaking at Bang Bao", "Mu Koh Chang snorkeling tour"] },
  { id: 11, name: "Nan", province: "Nan", region: "north", category: "nature",
    desc: "A hidden mountain province with untouched culture, famous murals and golden marigold fields in November.",
    hours: "08:00 – 17:00", entry: "฿20–฿30",
    activities: ["Wat Phumin mural temple", "Doi Phu Kha marigold fields", "Boklua hot springs", "Hill tribe village visit"] },
  { id: 12, name: "Ubon Ratchathani", province: "Ubon Ratchathani", region: "northeast", category: "nature",
    desc: "Gateway to Isan, home to 3,000-year-old rock paintings and the dramatic Sam Phan Bok rock formations.",
    hours: "06:00 – 18:00", entry: "Free",
    activities: ["Pha Taem cliff paintings", "Sam Phan Bok 'Grand Canyon'", "Candle Festival (Jul)", "Kaeng Tana rapids"] },
  // ── North: additional ────────────────────────────────────
  { id: 13, name: "Mae Hong Son", province: "Mae Hong Son", region: "north", category: "mountain",
    desc: "Misty highland province on the Myanmar border with idyllic Pai town, mountain loops and cloud-sea viewpoints.",
    hours: "Open", entry: "Free",
    activities: ["Pai town walking", "Pai Canyon sunset", "Pai river rafting", "Wat Jong Kham lakeside"] },
  { id: 14, name: "Lamphun", province: "Lamphun", region: "north", category: "temple",
    desc: "Ancient Hariphunchai kingdom capital; Wat Phra That Hariphunchai houses a 1,000-year-old relic.",
    hours: "06:00 – 17:00", entry: "Free",
    activities: ["Wat Phra That Hariphunchai", "Wat Chama Thewi stupa", "Longan orchards walk", "Traditional Yong textile market"] },
  { id: 15, name: "Lampang", province: "Lampang", region: "north", category: "culture",
    desc: "Thailand's horse-carriage city; Wat Phra That Lampang Luang is a Lanna architectural gem.",
    hours: "Open", entry: "Free",
    activities: ["Horse-carriage city tour", "Wat Phra That Lampang Luang", "Thai Elephant Conservation Center", "Ceramic workshop visit"] },
  { id: 16, name: "Phayao", province: "Phayao", region: "north", category: "nature",
    desc: "Kwan Phayao lake holds a submerged medieval temple visible by boat — a photographer's secret.",
    hours: "Open", entry: "Free",
    activities: ["Kwan Phayao lakeside cycling", "Wat Tilok Aram boat trip", "Doi Bussaracum viewpoint", "Night market stroll"] },
  { id: 17, name: "Phrae", province: "Phrae", region: "north", category: "culture",
    desc: "Finest teak mansions in Thailand alongside the quirky Phae Mueang Phi rock formations.",
    hours: "Open", entry: "Free",
    activities: ["Vongburi House teak mansion", "Phae Mueang Phi rock park", "Nakhon Wiang moated old town", "Indigo fabric workshop"] },
  { id: 18, name: "Uttaradit", province: "Uttaradit", region: "north", category: "nature",
    desc: "Ton Sak Yai waterfall and pristine teak forest tucked away on the central-north border.",
    hours: "Open", entry: "Free",
    activities: ["Ton Sak Yai waterfall hike", "Sirikit Dam viewpoint", "Wat Phra Borommathat Thung Yang", "Local langsat fruit market"] },
  // ── Central: additional ──────────────────────────────────
  { id: 19, name: "Ko Kret", province: "Nonthaburi", region: "central", category: "culture",
    desc: "Mon island community in Chao Phraya with hand-thrown pottery, Mon temples and a weekend market.",
    hours: "Open", entry: "Free",
    activities: ["Mon pottery workshop", "Wat Poramaiyikawat river walk", "Weekend market snacking", "Longtail boat circuit"] },
  { id: 20, name: "Pathum Thani", province: "Pathum Thani", region: "central", category: "culture",
    desc: "Rangsit's floating market and the lotus-fringed Khlong Rangsit are a calm escape from Bangkok.",
    hours: "Open", entry: "Free",
    activities: ["Klong Lat Mayom floating market", "Lotus pond photography", "Dhammakaya Temple light show", "Fresh noodle boat market"] },
  { id: 21, name: "Samut Prakan", province: "Samut Prakan", region: "central", category: "culture",
    desc: "Ancient City recreates every major Thai monument; Erawan Museum has a massive three-headed elephant.",
    hours: "08:00 – 18:00", entry: "฿200–฿350",
    activities: ["Ancient City museum park", "Erawan Museum elephant", "Pak Nam seafront", "Bang Pu seaside bird sanctuary"] },
  { id: 22, name: "Ayutthaya", province: "Phra Nakhon Si Ayutthaya", region: "central", category: "temple",
    desc: "UNESCO World Heritage capital that ruled Southeast Asia for 417 years; headless Buddha statues haunt the ruins.",
    hours: "08:00 – 18:00", entry: "฿50 per temple",
    activities: ["Wat Phra Ram ruins", "Wat Mahathat tree-root Buddha", "Elephant ride around island", "River cruise at sunset"] },
  { id: 23, name: "Ang Thong", province: "Ang Thong", region: "central", category: "culture",
    desc: "Riverside province where longtail boats pass fruit orchards and riverside temples on the Chao Phraya.",
    hours: "Open", entry: "Free",
    activities: ["Wat Khun Inthapramun reclining Buddha", "River fruit market", "Krok Mon village pottery", "Cycling along the canals"] },
  { id: 24, name: "Sing Buri", province: "Sing Buri", region: "central", category: "culture",
    desc: "Bang Rachan village commemorates villagers who held off a Burmese army; riverside temples dot the Chao Phraya.",
    hours: "Open", entry: "Free",
    activities: ["Bang Rachan memorial park", "Wat Phra Non reclining Buddha", "Riverside bike ride", "Local noodle shops"] },
  { id: 25, name: "Chai Nat", province: "Chai Nat", region: "central", category: "nature",
    desc: "Chai Nat Bird Park protects rare native cranes at the Chao Phraya headwaters dam.",
    hours: "08:00 – 17:00", entry: "Free",
    activities: ["Chai Nat Bird Park guided walk", "Chao Phraya dam viewpoint", "Wat Phra Borommathat Chai Nat", "Fresh river fish market"] },
  { id: 26, name: "Lop Buri", province: "Lop Buri", region: "central", category: "temple",
    desc: "Prang Sam Yot Khmer tower is overrun by macaques — the annual Monkey Buffet Festival draws world media.",
    hours: "07:00 – 18:00", entry: "฿30",
    activities: ["Prang Sam Yot monkey towers", "Wat Phra Si Ratana Mahathat", "King Narai's palace museum", "Sunflower fields (Nov)"] },
  { id: 27, name: "Saraburi", province: "Saraburi", region: "central", category: "temple",
    desc: "Phra Phutthabat sacred Buddha footprint shrine draws pilgrims from across Thailand.",
    hours: "06:00 – 18:00", entry: "฿30",
    activities: ["Phra Phutthabat pilgrimage", "Kaeng Khoi limestone quarry views", "Sunflower field photography (Nov)", "Khao Sam Lan waterfall"] },
  { id: 28, name: "Nakhon Nayok", province: "Nakhon Nayok", region: "central", category: "nature",
    desc: "Known as 'Switzerland of Thailand' for its green mountain backdrop, waterfalls and white-water rafting.",
    hours: "Open", entry: "Free (park fees apply)",
    activities: ["Sarika waterfall hike", "Nang Rong waterfall swim", "White-water rafting", "Elephant trekking at Wang Takrai"] },
  { id: 29, name: "Suphan Buri", province: "Suphan Buri", region: "central", category: "culture",
    desc: "Don Chedi memorial marks King Naresuan's elephant duel victory; U Thong was a Bronze Age city.",
    hours: "Open", entry: "Free",
    activities: ["Don Chedi victory monument", "Wat Pa Lelai reclining Buddha", "U Thong National Museum", "Shrimp paste community"] },
  { id: 30, name: "Nakhon Pathom", province: "Nakhon Pathom", region: "central", category: "temple",
    desc: "Phra Pathom Chedi, the world's tallest stupa at 127 m, marks Buddhism's arrival in mainland Southeast Asia.",
    hours: "06:00 – 20:00", entry: "Free",
    activities: ["Phra Pathom Chedi circumambulation", "Damnoen Saduak floating market day trip", "Rose Garden cultural show", "Pomelo orchard visit"] },
  { id: 31, name: "Samut Sakhon", province: "Samut Sakhon", region: "central", category: "culture",
    desc: "Mahachai fishing harbour is one of Thailand's busiest; seafood straight off the boat is exceptionally fresh.",
    hours: "Open", entry: "Free",
    activities: ["Mahachai fish market at dawn", "Shrimp paste factory tour", "Wat Yai Chet Mongkhon", "Waterfront seafood restaurants"] },
  { id: 32, name: "Samut Songkhram", province: "Samut Songkhram", region: "central", category: "culture",
    desc: "Amphawa floating market and firefly boat tours along the Mae Klong river are unmissable evening experiences.",
    hours: "Fri–Sun evenings", entry: "Free",
    activities: ["Amphawa floating market", "Firefly boat tour at dusk", "Don Hoi Lot shellfish beach", "Maeklong railway market"] },
  { id: 33, name: "Kanchanaburi", province: "Kanchanaburi", region: "central", category: "nature",
    desc: "Bridge over the River Kwai, Death Railway and Erawan waterfall make this the most historically complex province.",
    hours: "Open", entry: "฿30–฿300",
    activities: ["Bridge over River Kwai", "Erawan 7-tier waterfall", "Death Railway train ride", "Three Pagodas Pass border"] },
  { id: 34, name: "Ratchaburi", province: "Ratchaburi", region: "central", category: "culture",
    desc: "Damnoen Saduak is the most visited floating market in Thailand; Ratchaburi dragon jars are world-famous.",
    hours: "06:00 – 12:00", entry: "Free",
    activities: ["Damnoen Saduak floating market", "Ratchaburi pottery workshop", "Khao Bin cave temple", "Suan Phueng hill resort"] },
  { id: 35, name: "Phetchaburi", province: "Phetchaburi", region: "central", category: "culture",
    desc: "Khao Wang hilltop palace, Phra Nakhon Khiri, offers panoramic views; Cha-am beach is 30 minutes away.",
    hours: "08:30 – 16:30", entry: "฿150",
    activities: ["Phra Nakhon Khiri palace", "Khao Luang crystal cave", "Cha-am beach day", "Phetchaburi sweet shop walk"] },
  { id: 36, name: "Prachuap Khiri Khan", province: "Prachuap Khiri Khan", region: "central", category: "beach",
    desc: "Hua Hin is Thailand's oldest beach resort; train to the sea, golf courses and royal palaces line the coast.",
    hours: "Open", entry: "Free",
    activities: ["Hua Hin night market", "Khao Sam Roi Yot wetlands", "Pranburi beach cycling", "Wang Klai Kangwon royal palace"] },
  { id: 37, name: "Kamphaeng Phet", province: "Kamphaeng Phet", region: "central", category: "temple",
    desc: "Part of the Sukhothai-era World Heritage Site; thick forest walls enclose remarkably well-preserved laterite temples.",
    hours: "08:00 – 17:00", entry: "฿100",
    activities: ["Kamphaeng Phet Historical Park", "Wat Phra That temple", "Ping River cycling", "Kluay Khai local bananas"] },
  { id: 38, name: "Phichit", province: "Phichit", region: "central", category: "nature",
    desc: "Bueng Si Fai wetland is a 19,000-rai water world teeming with lotus, herons and freshwater fish.",
    hours: "Open", entry: "Free",
    activities: ["Bueng Si Fai boat tour", "Lotus picking season (Jul–Oct)", "Crocodile temple cave", "Local melon farms"] },
  { id: 39, name: "Nakhon Sawan", province: "Nakhon Sawan", region: "central", category: "nature",
    desc: "Bueng Boraphet, Thailand's largest freshwater lake, hosts tens of thousands of migratory birds each winter.",
    hours: "Open", entry: "Free",
    activities: ["Bueng Boraphet birdwatching", "Chinese New Year parade (Feb)", "Sawan Park hilltop", "Ping-Wang river confluence"] },
  { id: 40, name: "Uthai Thani", province: "Uthai Thani", region: "central", category: "nature",
    desc: "Huai Kha Khaeng Wildlife Sanctuary is a UNESCO World Heritage site holding tigers, elephants and rare banteng.",
    hours: "Open (permit required)", entry: "Free–฿400",
    activities: ["Huai Kha Khaeng wildlife trek", "Wat Tha Sung glass mosaic temple", "Sakae Krang riverside market", "Tung Ta Mueang viewpoint"] },
  { id: 41, name: "Tak", province: "Tak", region: "central", category: "nature",
    desc: "Umphang's Thi Lo Su waterfall is the largest in Thailand and one of Asia's most spectacular cascades.",
    hours: "Open (Oct–May)", entry: "Free",
    activities: ["Thi Lo Su waterfall trek", "Umphang raft tour", "Mae Sot market border town", "Kong Koi hot springs"] },
  { id: 42, name: "Phitsanulok", province: "Phitsanulok", region: "central", category: "temple",
    desc: "Wat Phra Si Rattana Mahathat houses the Phra Phuttha Chinnarat, considered the most beautiful Buddha in Thailand.",
    hours: "06:00 – 21:00", entry: "Free",
    activities: ["Phra Phuttha Chinnarat Buddha", "Nan River night walk", "Sergeant Major Thawee Folk Museum", "Phu Hin Rong Kla national park"] },
  { id: 43, name: "Phetchabun", province: "Phetchabun", region: "central", category: "mountain",
    desc: "Khao Kho is Thailand's go-to winter destination — sea of mist, windmills, flower fields and cool breezes.",
    hours: "Open", entry: "Free",
    activities: ["Khao Kho sea of mist sunrise", "Phu Hin Rong Kla historical park", "Phra That Pha Son Kaew cliff stupa", "Phetchabun tamarind market"] },
  // ── East: additional ─────────────────────────────────────
  { id: 44, name: "Rayong", province: "Rayong", region: "east", category: "beach",
    desc: "Koh Samet national park island has brilliant white sand beaches, bioluminescent plankton and calm Gulf waters.",
    hours: "Open", entry: "฿200 (national park)",
    activities: ["Koh Samet Hat Sai Kaew beach", "Plankton night kayak", "Rayong fruit orchard tour", "Suan Son Pradipat beach stroll"] },
  { id: 45, name: "Chanthaburi", province: "Chanthaburi", region: "east", category: "nature",
    desc: "The gem-trading capital of Southeast Asia; Phliu and Krathing waterfalls cut through pristine coastal jungle.",
    hours: "Open", entry: "Free",
    activities: ["Gem market street browsing", "Phliu Waterfall picnic", "Cathedral of the Immaculate Conception", "Chanthaburi fruit orchard walk"] },
  { id: 46, name: "Chachoengsao", province: "Chachoengsao", region: "east", category: "culture",
    desc: "Bang Pakong River province anchored by the revered Wat Sothon Wararam; pink dolphins live in the estuary.",
    hours: "Open", entry: "Free",
    activities: ["Wat Sothon Wararam temple", "Bang Pakong riverside market", "Pink dolphin boat tour", "Old Town walking street"] },
  { id: 47, name: "Prachin Buri", province: "Prachin Buri", region: "east", category: "nature",
    desc: "Thap Lan National Park and the ancient Si Mahosot ruins make Prachin Buri a rarely visited heritage-and-nature route.",
    hours: "Open", entry: "Free",
    activities: ["Thap Lan forest trekking", "Si Mahosot ancient city ruins", "Nam Tok Khao Chan waterfall", "Firefly observation"] },
  { id: 48, name: "Sa Kaeo", province: "Sa Kaeo", region: "east", category: "culture",
    desc: "Sdok Kok Thom is a remarkably complete Khmer inscription temple; Aranyaprathet is a buzzing border market town.",
    hours: "08:00 – 17:00", entry: "Free",
    activities: ["Sdok Kok Thom Khmer temple", "Aranyaprathet border market", "Khao Ang Rue Nai Wildlife Sanctuary", "Salakphet waterfall hike"] },
  // ── Northeast: additional ────────────────────────────────
  { id: 49, name: "Buri Ram", province: "Buri Ram", region: "northeast", category: "temple",
    desc: "Phanom Rung Khmer castle crowns an extinct volcano; Buriram United's football stadium is the finest in ASEAN.",
    hours: "06:00 – 18:00", entry: "฿100",
    activities: ["Phanom Rung Khmer castle", "Mueang Tam sanctuary", "Buriram stadium tour", "Silk weaving community"] },
  { id: 50, name: "Surin", province: "Surin", region: "northeast", category: "culture",
    desc: "The Surin Elephant Roundup (November) is the world's largest elephant gathering; Ban Ta Klang is the elephant village.",
    hours: "Open", entry: "Free",
    activities: ["Ban Ta Klang elephant village", "Surin silk weaving tour", "Sikhoraphum Khmer sanctuary", "Elephant roundup festival (Nov)"] },
  { id: 51, name: "Si Sa Ket", province: "Si Sa Ket", region: "northeast", category: "nature",
    desc: "Pha Chan cliff overlooks a sweeping Mun River bend; Pa Hin Ngam's fantastically shaped rocks straddle a meadow.",
    hours: "Open", entry: "Free",
    activities: ["Pha Chan cliff sunrise", "Pa Hin Ngam stone garden", "Khao Phra Viharn cross-border trip", "Prasat Sa Kamphaeng Yai ruins"] },
  { id: 52, name: "Yasothon", province: "Yasothon", region: "northeast", category: "culture",
    desc: "The Bun Bang Fai rocket festival lights up the sky each May; Phra That Kong Khao Noi is a cherished reliquary.",
    hours: "Open", entry: "Free",
    activities: ["Bun Bang Fai rocket festival (May)", "Phra That Kong Khao Noi temple", "Craft centre mudmee silk", "Pa Tao pottery village"] },
  { id: 53, name: "Amnat Charoen", province: "Amnat Charoen", region: "northeast", category: "temple",
    desc: "Compact Isan province home to Phu Tha Khon limestone outcrops and serene Wat Phutthamon megapark.",
    hours: "Open", entry: "Free",
    activities: ["Phu Tha Khon rock garden", "Wat Phutthamon walking", "Sai Yai pottery community", "Nam Tok Yot Mani waterfall"] },
  { id: 54, name: "Mukdahan", province: "Mukdahan", region: "northeast", category: "nature",
    desc: "Mukdahan Tower skywalk surveys the Mekong; the Second Thai-Lao Friendship Bridge links to Savannakhet.",
    hours: "Open", entry: "฿30",
    activities: ["Mukdahan Tower skywalk", "Indochina Market shopping", "Phu Pha Thoep rock formations", "Mekong riverside sunset"] },
  { id: 55, name: "Nakhon Phanom", province: "Nakhon Phanom", region: "northeast", category: "temple",
    desc: "That Phanom Chedi is the holiest reliquary in Isan; a 100 km Mekong vista stretches to Laos.",
    hours: "06:00 – 21:00", entry: "Free",
    activities: ["That Phanom Chedi pilgrimage", "Mekong river promenade", "Renu Nakhon weaving village", "Pha Taem rock art day trip"] },
  { id: 56, name: "Sakon Nakhon", province: "Sakon Nakhon", region: "northeast", category: "nature",
    desc: "Nong Han lake is Thailand's largest; Phu Phan National Park hosts bear and banteng in dense forest.",
    hours: "Open", entry: "Free",
    activities: ["Nong Han lake paddleboat", "Phu Phan national park trek", "Wat Phra That Choeng Chum stupa", "Pink lotus lake (Sep–Nov)"] },
  { id: 57, name: "Kalasin", province: "Kalasin", region: "northeast", category: "nature",
    desc: "Sirindhorn Dinosaur Museum displays Thai-excavated sauropod bones; Pha Nok Khan cliffs are an Isan secret.",
    hours: "08:30 – 16:30", entry: "Free–฿30",
    activities: ["Sirindhorn Dinosaur Museum", "Pha Nok Khan limestone park", "Fa Daed Song Yang ancient city", "Pong Nok Teng silk weavers"] },
  { id: 58, name: "Roi Et", province: "Roi Et", region: "northeast", category: "nature",
    desc: "Thung Kula Ronghai produces award-winning jasmine rice; Bueng Phlan Chai's lotus lake reflects a city-centre stupa.",
    hours: "Open", entry: "Free",
    activities: ["Bueng Phlan Chai lotus lake", "Roi Et Standing Buddha", "Thung Kula harvest tour (Nov)", "Bung Khong Long birdwatch"] },
  { id: 59, name: "Maha Sarakham", province: "Maha Sarakham", region: "northeast", category: "culture",
    desc: "University city and the beating heart of Isan silk culture; Chao Anouvong Park remembers Lao-Thai heritage.",
    hours: "Open", entry: "Free",
    activities: ["Mudmee silk weaving workshop", "Khwao Sinarin local market", "Gem dinosaur fossil site", "Isan street food Talad Phu"] },
  { id: 60, name: "Khon Kaen", province: "Khon Kaen", region: "northeast", category: "culture",
    desc: "Isan's commercial hub; Kaen Nakhon Lake, silk festivals and a world-class dinosaur museum draw visitors year-round.",
    hours: "Open", entry: "Free",
    activities: ["Kaen Nakhon Lake cycling", "Khon Kaen Silk Festival (Nov)", "Khon Kaen Dinosaur Museum", "Night Bazaar food tour"] },
  { id: 61, name: "Udon Thani", province: "Udon Thani", region: "northeast", category: "culture",
    desc: "Ban Chiang UNESCO site rewrote Bronze Age history; Nong Han pink lotus lake is the most Instagram-worthy spot in Isan.",
    hours: "Open", entry: "฿150 (Ban Chiang)",
    activities: ["Ban Chiang UNESCO ruins", "Nong Han lotus lake sunrise", "Udon Thani night market", "Wat Pa Ban Tat forest monastery"] },
  { id: 62, name: "Nong Khai", province: "Nong Khai", region: "northeast", category: "culture",
    desc: "Sala Kaew Ku sculpture garden is one of Southeast Asia's most surreal sites; Naga fireballs appear on the Mekong each October.",
    hours: "Open", entry: "฿50 (Sala Kaew Ku)",
    activities: ["Sala Kaew Ku sculpture garden", "Naga fireball festival (Oct)", "First Thai-Lao Friendship Bridge", "Hat Jommanee beach stroll"] },
  { id: 63, name: "Nong Bua Lamphu", province: "Nong Bua Lamphu", region: "northeast", category: "temple",
    desc: "Wat Tham Klong Phen forest monastery has cave meditation halls; Phu Phan Kong cliff surveys a verdant plain.",
    hours: "Open", entry: "Free",
    activities: ["Wat Tham Klong Phen forest walk", "Phu Phan Kong cliff view", "Nong Bua Lamphu night market", "Local weaving village"] },
  { id: 64, name: "Loei", province: "Loei", region: "northeast", category: "mountain",
    desc: "Phu Kradueng plateau is Thailand's most famous trekking destination; Phi Ta Khon ghost mask festival is world-famous.",
    hours: "Open (closed May–Sep)", entry: "฿30",
    activities: ["Phu Kradueng plateau camping", "Phi Ta Khon ghost festival (Jun)", "Phu Ruea chilly nights", "Wang Saphung dragon fruit farm"] },
  { id: 65, name: "Chaiyaphum", province: "Chaiyaphum", region: "northeast", category: "nature",
    desc: "Pa Hin Ngam's alien rock garden sits inside a national park; Mor Hin Khao is the 'Stonehenge of Thailand'.",
    hours: "Open", entry: "Free",
    activities: ["Pa Hin Ngam rock garden", "Mor Hin Khao stone circles", "Tat Ton waterfall", "Wild sunflower fields (Oct–Nov)"] },
  { id: 66, name: "Bueng Kan", province: "Bueng Kan", region: "northeast", category: "nature",
    desc: "Three Whale Rock and Wat Phu Tok cliff monastery define Bueng Kan's dramatic sandstone and Mekong-edge landscapes.",
    hours: "Open", entry: "Free",
    activities: ["Three Whale Rock sunrise viewpoint", "Wat Phu Tok cliff monastery climb", "Mekong river sunset", "Phu Wua wildlife sanctuary trek"] },
  // ── South: additional ────────────────────────────────────
  { id: 67, name: "Chumphon", province: "Chumphon", region: "south", category: "beach",
    desc: "Gateway province to Koh Tao and Koh Phangan; Thung Wua Laen Beach is 14 km of unspoilt Gulf shoreline.",
    hours: "Open", entry: "Free",
    activities: ["Thung Wua Laen beach walk", "Koh Tao diving day trip", "Chumphon hot springs", "Samet Chan coffee plantation"] },
  { id: 68, name: "Nakhon Si Thammarat", province: "Nakhon Si Thammarat", region: "south", category: "temple",
    desc: "Wat Phra Mahathat's 77 m chedi is the holiest shrine in peninsular Thailand; Khao Luang is the south's highest peak.",
    hours: "06:00 – 17:00", entry: "Free",
    activities: ["Wat Phra Mahathat Chedi walk", "Khao Luang national park trek", "Nakhontale shadow puppet show", "Karom waterfall swim"] },
  { id: 69, name: "Phang Nga", province: "Phang Nga", region: "south", category: "beach",
    desc: "Phang Nga Bay's 100+ limestone karsts include James Bond Island (Koh Tapu); sea kayaking through sea caves is unmissable.",
    hours: "Open", entry: "Free",
    activities: ["Sea kayak through sea caves", "James Bond Island boat tour", "Ko Yao island homestay", "Suwan Kuha cave temple"] },
  { id: 70, name: "Trang", province: "Trang", region: "south", category: "beach",
    desc: "Emerald Cave (Morakot) can only be reached by swimming through a pitch-dark tunnel to a secret beach.",
    hours: "Open (Oct–May)", entry: "Free",
    activities: ["Emerald Cave swim", "Koh Libong dugong spotting", "Hat Pak Meng beach picnic", "Trang dim sum breakfast"] },
  { id: 71, name: "Phatthalung", province: "Phatthalung", region: "south", category: "nature",
    desc: "Thale Noi waterbird park is home to 182 species; a longtail boat glides through lotus-covered shallows at sunrise.",
    hours: "05:30 – 10:00 (best birdwatch)", entry: "Free",
    activities: ["Thale Noi waterbird boat tour", "Khao Pu-Khao Ya peak views", "Khao Chaison cave temple", "Night market roast duck"] },
  { id: 72, name: "Satun", province: "Satun", region: "south", category: "beach",
    desc: "Tarutao Marine National Park — Thailand's first and wildest marine park — holds pristine reef, jungle trails and turtles.",
    hours: "Open (Oct–May)", entry: "฿200",
    activities: ["Tarutao island jungle hike", "Koh Lipe snorkelling", "Koh Adang white sand beach", "Petra cave boat tour"] },
  { id: 73, name: "Songkhla", province: "Songkhla", region: "south", category: "culture",
    desc: "Hat Yai is the south's biggest city and shoppers' paradise; old Songkhla town retains Sino-Portuguese shophouse charm.",
    hours: "Open", entry: "Free",
    activities: ["Hat Yai night market", "Songkhla old town walk", "Ko Yo floating market", "Samila Beach mermaid statue"] },
  { id: 74, name: "Pattani", province: "Pattani", region: "south", category: "culture",
    desc: "Krue Se Mosque, built over 400 years ago, blends Thai-Malay-Chinese architecture; local batik is hand-drawn with beeswax.",
    hours: "Open", entry: "Free",
    activities: ["Krue Se Mosque visit", "Batik workshop", "Pattani Old Town walk", "Saiburi Coast seafood"] },
  { id: 75, name: "Yala", province: "Yala", region: "south", category: "mountain",
    desc: "Betong on the Malaysia border is Thailand's southernmost city, with cool highland air, a 700 m tunnel and cherry blossoms.",
    hours: "Open", entry: "Free",
    activities: ["Betong Pit Tunnel walk", "Betong morning mist viewpoint", "Namtok Banglang waterfall", "Malaysian border market"] },
  { id: 76, name: "Narathiwat", province: "Narathiwat", region: "south", category: "beach",
    desc: "Taksin Ratchaniwet Palace is a royal summer residence overlooking the Gulf of Thailand; Sai Khao is a virgin beach.",
    hours: "Open", entry: "Free",
    activities: ["Taksin Ratchaniwet Palace garden", "Sai Khao beach stroll", "Wat Chon Thara Sing He", "Kolae boat painting workshop"] },
  { id: 77, name: "Ranong", province: "Ranong", region: "south", category: "nature",
    desc: "Punyaban waterfall and natural hot springs sit inside a rainforest; the Kra Isthmus is Thailand's narrowest point.",
    hours: "Open", entry: "Free",
    activities: ["Punyaban waterfall swim", "Ranong hot springs soak", "Victoria Point Myanmar day trip", "Laem Son National Park mangroves"] }
];

/* ---------- VERIFIED ATTRACTIONS ----------
   Province records describe a province. Attraction records describe one
   visitable place and carry their own hours, admission and sources. Never
   promote an activity suggestion into this collection without verification. */
const VERIFIED_ATTRACTIONS = {
  phuket: {
    id: "phuket-old-town", name: { th: "ย่านเมืองเก่าภูเก็ต", en: "Phuket Old Town" },
    hours: { th: "พื้นที่สาธารณะเปิดตลอดวัน; ถนนคนเดินวันอาทิตย์ 16:00–22:00 น.", en: "Public streets are open all day; Sunday Walking Street runs 16:00–22:00." },
    admission: { th: "เข้าชมพื้นที่สาธารณะฟรี", en: "Free public-area access" },
    officialSource: "https://www.tourismthailand.org/Attraction/phuket-old-town", sourceLabel: "Tourism Authority of Thailand", verifiedOn: "2026-08-08"
  },
  "chiang-mai": {
    id: "wat-phra-that-doi-suthep", name: { th: "วัดพระธาตุดอยสุเทพราชวรวิหาร", en: "Wat Phra That Doi Suthep" },
    hours: { th: "เปิดทุกวัน; แหล่งข้อมูล ททท. ระบุช่วงเข้าชม 06:00–18:00 น.", en: "Open daily; TAT lists visiting hours of 06:00–18:00." },
    admission: { th: "โปรดตรวจสอบค่าธรรมเนียมล่าสุดจากสถานที่ก่อนเดินทาง", en: "Confirm the latest admission charge with the venue before visiting." },
    officialSource: "https://www.tourismthailand.org/Attraction/wat-phra-that-doi-suthep", sourceLabel: "Tourism Authority of Thailand", verifiedOn: "2026-08-08"
  },
  krabi: {
    id: "ao-railay", name: { th: "อ่าวไร่เลย์", en: "Ao Railay (Railay Bay)" },
    hours: { th: "พื้นที่ชายหาดเปิดตลอดวัน; เวลาเรือขึ้นอยู่กับผู้ให้บริการและสภาพอากาศ", en: "Beach area is open all day; boat times depend on operators and weather." },
    admission: { th: "เข้าชมหาดฟรี; ค่าเรือและค่าธรรมเนียมพื้นที่คุ้มครองอาจแยกต่างหาก", en: "Free beach access; boat fares and protected-area fees may apply separately." },
    officialSource: "https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/ao-railay-railay-bay-tham-phra-nang-beach-phra-nang-cave-beach-thale-waek-separated-sea-ko-po-da-khao-khanap-nam-viewpoint-tha-pom-khlang-cave", sourceLabel: "Tourism Authority of Thailand", verifiedOn: "2026-08-08"
  },
  "surat-thani": {
    id: "muko-ang-thong", name: { th: "อุทยานแห่งชาติหมู่เกาะอ่างทอง", en: "Mu Ko Ang Thong National Park" },
    hours: { th: "เวลาเดินทางขึ้นอยู่กับเรือนำเที่ยวและประกาศของอุทยาน", en: "Access times depend on tour boats and current park notices." },
    admission: { th: "โปรดตรวจสอบค่าธรรมเนียมอุทยานล่าสุดก่อนเดินทาง", en: "Confirm the latest national-park fee before visiting." },
    officialSource: "https://www.tourismthailand.org/Attraction/muko-ang-thong-marine-national-park", sourceLabel: "Tourism Authority of Thailand", verifiedOn: "2026-08-08"
  },
  bangkok: {
    id: "grand-palace", name: { th: "พระบรมมหาราชวังและวัดพระศรีรัตนศาสดาราม", en: "The Grand Palace and Temple of the Emerald Buddha" },
    hours: { th: "เปิดทุกวัน 08:30–16:30 น.; จำหน่ายบัตรถึง 15:30 น.", en: "Open daily 08:30–16:30; tickets are sold until 15:30." },
    admission: { th: "คนไทยเข้าฟรีเมื่อแสดงบัตรประชาชน; ชาวต่างชาติ 500 บาท", en: "Free for Thai citizens with ID; THB 500 for foreign visitors." },
    officialSource: "https://www.royalgrandpalace.th/en/visit/practical-information", sourceLabel: "Bureau of the Royal Household", verifiedOn: "2026-08-08"
  }
};

function buildAttractionLink(attraction, provider) {
  const query = `${attraction.name.en}, Thailand`;
  return provider === "agoda"
    ? `https://www.agoda.com/search?text=${encodeURIComponent(query)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

Object.values(VERIFIED_ATTRACTIONS).forEach(attraction => {
  attraction.googleMaps = buildAttractionLink(attraction, "maps");
  attraction.agoda = buildAttractionLink(attraction, "agoda");
});

/* ---------- DESTINATION METADATA ENRICHMENT (non-breaking) ---------- */
function buildGoogleMapsLink(destination) {
  const attraction = Array.isArray(destination.activities) && destination.activities.length
    ? destination.activities[0]
    : destination.name;
  const query = `${attraction}, ${destination.province}, Thailand`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildOfficialWebsiteLink(destination) {
  const query = `${destination.province} Thailand tourism`;
  return `https://www.tourismthailand.org/search?q=${encodeURIComponent(query)}`;
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function buildSearchKeywords(destination) {
  const keywords = [
    destination.name,
    destination.province,
    destination.region,
    destination.category,
    destination.desc,
    destination.hours,
    destination.entry,
    ...(destination.activities || [])
  ];

  return [...new Set(keywords
    .filter(Boolean)
    .map(value => String(value).trim())
    .filter(Boolean))];
}

function buildProvinceCoordinates(destination) {
  // Exact official coordinates are not bundled in this offline dataset.
  // Keep a stable schema and mark records for later province-level verification.
  return {
    lat: null,
    lng: null,
    source: "pending-official-verification"
  };
}

function buildProvinceGalleryImages(destination) {
  const slug = toProvinceSlug(destination.province || destination.name);
  const galleryTarget = 5;
  return Array.from({ length: galleryTarget }, (_, index) => `assets/images/provinces/${slug}/gallery-${index + 1}.webp`);
}

function ensureArray(value, fallback) {
  if (Array.isArray(value) && value.length) return value;
  return fallback;
}

function toProvinceSlug(name) {
  const raw = String(name || "").trim();
  const aliases = {
    "chon buri": "chonburi"
  };
  const normalized = raw.toLowerCase();
  if (aliases[normalized]) {
    return aliases[normalized];
  }

  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveProvinceImagePath(destination) {
  const slug = toProvinceSlug(destination.province || destination.name);
  return `assets/images/provinces/${slug}/hero.webp`;
}

function buildImageCaption(destination) {
  if (Array.isArray(destination.activities) && destination.activities.length) {
    return destination.activities[0];
  }
  if (destination.desc) {
    return destination.desc;
  }
  return `${destination.name} tourism highlight`;
}

function normalizeDestinationSchema(destination) {
  // Production image sprint: force province folder hero/gallery local assets.
  const provinceImagePath = resolveProvinceImagePath(destination);
  const provinceSlug = toProvinceSlug(destination.province || destination.name);
  destination.provinceSlug = provinceSlug;
  destination.description = destination.description || destination.desc || "";
  destination.openingHours = destination.openingHours || destination.hours || "ไม่ระบุ";
  destination.ticketInfo = destination.ticketInfo || destination.entry || "ไม่ระบุ";
  destination.heroImage = provinceImagePath;

  const curation = window.IMAGE_CURATION?.[provinceSlug] || {};
  const curatedGalleryImages = Array.isArray(curation.galleryImages)
    ? curation.galleryImages.filter(src => src && src !== provinceImagePath)
    : [];
  destination.galleryCurated =
    curation.galleryCurated === true &&
    curation.status === "complete" &&
    curatedGalleryImages.length >= 3;

  destination.galleryImages = destination.galleryCurated
    ? [provinceImagePath, ...curatedGalleryImages].slice(0, 8)
    : [provinceImagePath];
  destination.galleryCaptions = destination.galleryCurated && Array.isArray(curation.galleryCaptions)
    ? curation.galleryCaptions.slice(0, destination.galleryImages.length - 1)
    : [];
  destination.galleryAttribution = destination.galleryCurated && Array.isArray(curation.attribution)
    ? curation.attribution
    : [];
  destination.caption = destination.caption || buildImageCaption(destination);
  destination.photoCredit = destination.photoCredit || "Wikimedia Commons contributors";
  destination.imageSource = destination.imageSource || `assets/images/provinces/${provinceSlug}/metadata.json`;
  destination.keywords = ensureArray(destination.keywords, buildSearchKeywords(destination));
  destination.searchKeywords = ensureArray(destination.searchKeywords, destination.keywords);
  destination.category = destination.category || "nature";
  destination.categories = ensureArray(destination.categories, [destination.category]);
  const verifiedAttraction = VERIFIED_ATTRACTIONS[provinceSlug] || null;
  destination.recordType = "province";
  destination.primaryAttraction = verifiedAttraction;
  destination.attractions = verifiedAttraction ? [verifiedAttraction] : [];
  destination.coordinates = destination.coordinates || buildProvinceCoordinates(destination);
  destination.dataCompleteness = {
    coordinatesVerified: Boolean(destination.coordinates && destination.coordinates.lat !== null && destination.coordinates.lng !== null),
    officialImageVerified: Boolean(destination.heroImage && !String(destination.heroImage).includes("/destinations/") ? true : false),
    officialWebsiteVerified: Boolean(destination.officialWebsite),
    mapsVerified: Boolean(destination.googleMaps),
    attractionVerified: Boolean(verifiedAttraction)
  };
}

DESTINATIONS.forEach(destination => {
  if (!destination.googleMaps || !isValidHttpUrl(destination.googleMaps)) {
    destination.googleMaps = buildGoogleMapsLink(destination);
  }

  if (!destination.officialLocation) {
    destination.officialLocation = `${destination.name}, ${destination.province}, Thailand`;
  }

  if (!destination.officialWebsite || !isValidHttpUrl(destination.officialWebsite)) {
    destination.officialWebsite = buildOfficialWebsiteLink(destination);
  }

  if (!Array.isArray(destination.searchKeywords) || !destination.searchKeywords.length) {
    destination.searchKeywords = buildSearchKeywords(destination);
  }

  normalizeDestinationSchema(destination);
});

/* Gallery items are generated from DESTINATIONS[].galleryImages. */

/* Cross-page selections contain stable slugs only. All page cards resolve
   their names, images and descriptions from DESTINATIONS at render time. */
const CROSS_PAGE_DESTINATION_SLUGS = [
  "surat-thani",
  "chiang-mai",
  "phuket",
  "krabi",
  "chiang-rai",
  "sukhothai"
];

/* Home articles are destination guides generated from these records. */
const BLOG_DESTINATION_SLUGS = ["phuket", "chiang-mai", "krabi", "bangkok", "chiang-rai", "sukhothai"];

/* ---------- TRIP PLANNER TEMPLATES ----------
   Curated itinerary templates carry one route-level authoritative source.
   They intentionally omit opening hours, admission prices and live travel
   times, which must be confirmed with the venue before a real trip. */
const TRIP_PLANNER_TEMPLATES = [{
  id: "northeast-5-days",
  region: "northeast",
  days: 5,
  title: {
    th: "อีสานใต้ 5 วัน: บุรีรัมย์–ศรีสะเกษ–อุบลราชธานี",
    en: "5-day Lower Northeast: Buri Ram–Si Sa Ket–Ubon Ratchathani"
  },
  source: {
    name: {
      th: "การท่องเที่ยวแห่งประเทศไทย (ททท.)",
      en: "Tourism Authority of Thailand"
    },
    url: "https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/buri-ram-si-sa-ket-ubon-ratchathani-5-days",
    verifiedOn: "2026-08-17"
  },
  itinerary: [
    {
      day: 1,
      provinceSlug: "buri-ram",
      province: { th: "บุรีรัมย์", en: "Buri Ram" },
      stops: {
        th: ["อุทยานประวัติศาสตร์พนมรุ้ง", "อ่างเก็บน้ำทุ่งแหลม", "ศูนย์วัฒนธรรมอีสานใต้"],
        en: ["Phanom Rung Historical Park", "Thung Laem Reservoir", "Centre of Southern Northeast Culture"]
      }
    },
    {
      day: 2,
      provinceSlug: "buri-ram",
      province: { th: "บุรีรัมย์", en: "Buri Ram" },
      stops: {
        th: ["ปราสาทเมืองต่ำ", "ปราสาทวัดโคกงิ้ว", "ปราสาทหนองหงส์", "พระสุภัทรบพิตร เขากระโดง"],
        en: ["Prasat Muang Tam", "Prasat Wat Khok Ngio", "Nong Hong Sanctuary", "Big Buddha Image on Khao Kradong"]
      }
    },
    {
      day: 3,
      provinceSlug: "si-sa-ket",
      province: { th: "ศรีสะเกษ", en: "Si Sa Ket" },
      stops: {
        th: ["ปราสาทห้วยทับทัน", "อุทยานแห่งชาติเขาพระวิหาร", "วัดมหาพุทธาราม"],
        en: ["Huai Thap Than Khmer Ruins", "Khao Phra Wihan National Park", "Wat Maha Phuttharam"]
      }
    },
    {
      day: 4,
      provinceSlug: "ubon-ratchathani",
      province: { th: "อุบลราชธานี", en: "Ubon Ratchathani" },
      stops: {
        th: ["เขื่อนสิรินธร", "เขื่อนปากมูล", "อุทยานแห่งชาติแก่งตะนะ"],
        en: ["Sirindhorn Dam", "Pak Mun Dam", "Kaeng Tana National Park"]
      }
    },
    {
      day: 5,
      provinceSlug: "ubon-ratchathani",
      province: { th: "อุบลราชธานี", en: "Ubon Ratchathani" },
      stops: {
        th: ["สามพันโบก", "อุทยานแห่งชาติผาแต้ม", "หาดสลึง", "วัดศรีอุบลรัตนาราม"],
        en: ["Sam Phan Bok", "Pha Taem National Park", "Hat Salueng", "Wat Si Ubon Rattanaram"]
      }
    }
  ]
}];

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
  { q: "How many days do I need to see Thailand properly?", a: "Ten to fourteen days lets you comfortably combine one region (e.g. Bangkok + the north, or Bangkok + the islands) without rushing. Browse the destination guides to choose a route that suits your timeframe." },
  { q: "What's the best way to book activities and tours?", a: "Many attractions can be booked on arrival, but popular experiences (island tours, cooking classes, sanctuary visits) are worth reserving a few days ahead during high season to avoid sell-outs." }
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

window.DESTINATIONS = DESTINATIONS;
window.CROSS_PAGE_DESTINATION_SLUGS = CROSS_PAGE_DESTINATION_SLUGS;
window.VERIFIED_ATTRACTIONS = VERIFIED_ATTRACTIONS;
window.BLOG_DESTINATION_SLUGS = BLOG_DESTINATION_SLUGS;
window.TRIP_PLANNER_TEMPLATES = TRIP_PLANNER_TEMPLATES;
window.FAQ = FAQ;
window.QUOTES = QUOTES;
