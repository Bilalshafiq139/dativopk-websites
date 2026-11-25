// All studio content lives here: name, contact, services, packages, portfolio, stories and films.
// Change things in this one file and every page updates.
export const SITE = {
  name: "Dastaan Studio",
  short: "Dastaan",
  urdu: "داستان",
  tagline: "Har shaadi ek dastaan hai",
  city: "Lahore",
  phone: "+92 321 4567890",
  whatsapp: "923214567890", // international format, no + or spaces
  email: "shaadi@dastaan.studio",
  address: "2nd Floor, 88-B MM Alam Road, Gulberg III, Lahore",
  hours: "Daily, 12 pm to 9 pm (Friday from 3 pm)",
  instagram: "@dastaan.studio",
  since: 2014,
};

export const img = (n) => `assets/img/${n}.webp`;

// Rupees in the Pakistani lakh style: Rs 2,95,000
export const rs = (n) => "Rs " + Math.round(Number(n) || 0).toLocaleString("en-IN");

export const CITIES = [
  { name: "Lahore", note: "Home base, no travel charges", travel: 0 },
  { name: "Islamabad & Rawalpindi", note: "Team on the road the night before", travel: 35000 },
  { name: "Faisalabad", note: "Same-day travel", travel: 20000 },
  { name: "Sialkot & Gujranwala", note: "Same-day travel", travel: 20000 },
  { name: "Multan", note: "Travel and one night stay", travel: 40000 },
  { name: "Karachi", note: "Flights and hotel for the team", travel: 75000 },
  { name: "Destination", note: "Hunza, Murree, Skardu, Dubai: quoted per trip", travel: 120000 },
];

// Every event / service. Used on services.html, packages builder, contact form and admin.
export const SERVICES = [
  {
    slug: "mehndi", name: "Mehndi & Mayun", urdu: "مہندی", img: "mehndi-bride-green", alt: "mehndi-marigold",
    price: 85000, unit: "per event",
    line: "Dholki, rasmein, dance floor and every yellow and green detail.",
    body: "Mehndi nights are loud, colourful and over fast. We plan the rasm with your family, keep one camera on the stage and one on the dance floor, and catch the hands, the thaals and the cousins who rehearsed for weeks.",
    items: ["Up to 5 hours of coverage", "Rasm, entry and dance performances", "Detail shots: henna, thaal, jewellery", "350+ edited photos", "Online gallery to share with family"],
  },
  {
    slug: "barat", name: "Barat", urdu: "بارات", img: "groom-garden", alt: "baraat-fireworks",
    price: 120000, unit: "per event", featured: true,
    line: "The arrival, the dhol, the rukhsati. The day everyone remembers.",
    body: "The groom's arrival, the stage, the family photos and the quiet rukhsati at the end. We send one photographer with the bride from the salon onward, so the getting-ready moments are covered before the hall even fills up.",
    items: ["Up to 6 hours, salon to rukhsati", "Bride and groom covered separately", "Stage and family group plan", "500+ edited photos", "Couple portraits at the venue"],
  },
  {
    slug: "nikkah", name: "Nikkah", urdu: "نکاح", img: "nikkah-couple", alt: "ring-hands",
    price: 60000, unit: "per ceremony",
    line: "Quiet, respectful coverage of the most important ten minutes.",
    body: "Whether it is at home, in a masjid or at the venue, Nikkah coverage is calm and discreet. We work with the families on what can be photographed, stay out of the way, and keep every signature, dua and first look.",
    items: ["Up to 3 hours", "Discreet, no-flash option for masjid", "Signing, dua and family moments", "200+ edited photos", "Can be added to a Barat or Walima"],
  },
  {
    slug: "walima", name: "Walima", urdu: "ولیمہ", img: "walima-silver", alt: "couple-lights",
    price: 110000, unit: "per event",
    line: "Softer colours, calmer couple, and the best family portraits.",
    body: "By the Walima the nerves are gone, which makes it the best event for portraits. We plan a 20 minute couple session outside the hall and a proper family photo line so nobody is missed.",
    items: ["Up to 5 hours", "20 minute couple portrait session", "Family and friends group lists", "450+ edited photos", "Stage décor and table details"],
  },
  {
    slug: "bridal", name: "Bridal shoot", urdu: "دلہن", img: "bride-lantern", alt: "bride-jewels",
    price: 45000, unit: "per session",
    line: "Your jora, your jewellery, photographed like a magazine cover.",
    body: "A dedicated bridal portrait session before the event or on a separate day: in our studio, at a heritage location like the Walled City, or at your salon. Ideal for brides who want unhurried portraits of the outfit they spent months choosing.",
    items: ["90 minutes, studio or one location", "Lighting set-up for jewellery and embroidery", "30 retouched portraits", "One large print included", "Ready in 7 days"],
  },
  {
    slug: "pre-wedding", name: "Pre-wedding shoot", urdu: "", img: "couple-arches", alt: "couple-lane",
    price: 55000, unit: "per session",
    line: "Golden hour at a fort, a garden or the hills, before the madness starts.",
    body: "A relaxed couple session a few weeks before the wedding. Great for save-the-dates, the welcome board at the venue and getting comfortable in front of the camera before the big day.",
    items: ["2 hours, up to 2 outfits", "Location scouting included", "40 edited photos + 1 short reel", "Save-the-date design option", "Lahore Fort, Shalimar or Bagh-e-Jinnah"],
  },
  {
    slug: "engagement", name: "Engagement & Mangni", urdu: "منگنی", img: "engagement-couple", alt: "ring-hands",
    price: 70000, unit: "per event",
    line: "Ring ceremony, family exchanges and the first official photos together.",
    body: "Mangni and ring ceremonies are smaller and more personal. We keep the coverage light and natural, with a short couple session if the families are happy with it.",
    items: ["Up to 4 hours", "Ring exchange and rasm coverage", "300+ edited photos", "Short highlight reel option", "Couple portraits"],
  },
  {
    slug: "aqiqa", name: "Aqiqa & birthdays", urdu: "عقیقہ", img: "birthday-baby", alt: "boy-waistcoat",
    price: 35000, unit: "per event",
    line: "Small family dawats, first birthdays and the cake that did not survive.",
    body: "Aqiqa dawats, first birthdays and family get-togethers, photographed by one photographer who is good with children and grandparents alike.",
    items: ["Up to 3 hours", "Family portraits and candid coverage", "200 edited photos", "Studio mini-session option", "Ready in 7 days"],
  },
  {
    slug: "corporate", name: "Corporate events", urdu: "", img: "conference-hall", alt: "corporate-dinner",
    price: 60000, unit: "half day",
    line: "Launches, conferences, annual dinners and award nights.",
    body: "Clean, on-brand photos of your event, with fast turnaround for social media. Same-evening selects are available so your team can post while the event is still trending.",
    items: ["4 hours (full day Rs 1,00,000)", "Speakers, guests, branding and venue", "Same-evening 30 selects", "Full set in 72 hours", "Invoice with NTN"],
  },
  {
    slug: "drone", name: "Drone coverage", urdu: "", img: "drone-water", alt: "drone-forest",
    price: 30000, unit: "per event",
    line: "Aerial shots of the venue, the barat arrival and the fireworks.",
    body: "Licensed drone operator with a DJI Mavic 3 Pro. Aerial photos and video of the venue, the baraat procession and the fireworks, edited into your films. Indoor flights are possible in larger marquees.",
    items: ["Licensed operator", "Aerial photos and 4K video", "Used inside your highlight film", "Weather and venue permitting"],
  },
  {
    slug: "films", name: "Highlight films", urdu: "", img: "videographer-stage", alt: "cinema-camera",
    price: 65000, unit: "per wedding",
    line: "A 4 to 7 minute cinematic film, plus a full documentary of every event.",
    body: "Our films are cut like short movies, with your own vows, speeches and family voices instead of only music. Every film comes with a 60 second Instagram teaser and the full-length event documentary.",
    items: ["4 to 7 minute cinematic highlight", "60 second Instagram teaser", "Full-length documentary per event", "Licensed music", "Delivered in 6 to 8 weeks"],
  },
  {
    slug: "albums", name: "Albums & prints", urdu: "", img: "album", alt: "walima-ivory",
    price: 25000, unit: "from",
    line: "Hand-bound albums made in Lahore, designed by us, approved by you.",
    body: "Layflat albums with Italian leather or velvet covers, printed on archival paper. You get a digital proof to approve before we print, and parents' copies at a reduced price.",
    items: ["30 page layflat from Rs 25,000", "60 page premium from Rs 48,000", "Leather, velvet or fabric covers", "Parents' copies at 40% off", "Ready in 3 to 4 weeks after approval"],
  },
];
export const service = (slug) => SERVICES.find((s) => s.slug === slug);

export const PACKAGES = [
  {
    slug: "classic", name: "Classic", urdu: "کلاسک", price: 295000, events: "2 events",
    for: "Barat + Walima, or Nikkah + Walima",
    items: ["1 photographer + 1 videographer per event", "1,000+ edited photos", "4 minute highlight film", "Full event documentaries", "1 layflat album, 40 pages", "Online gallery for family"],
  },
  {
    slug: "signature", name: "Signature", urdu: "خاص", price: 550000, events: "3 events", featured: true,
    for: "Mehndi + Barat + Walima",
    items: ["2 photographers + 2 videographers", "Bridal shoot included", "Drone at Barat", "1,800+ edited photos", "6 minute cinematic film + teaser", "Same-night Instagram teaser", "2 albums: couple + parents"],
  },
  {
    slug: "shahi", name: "Shahi", urdu: "شاہی", price: 950000, events: "4 events + Nikkah",
    for: "The full shaadi, start to finish",
    items: ["3 photographers + 3 videographers", "Pre-wedding and bridal shoots", "Drone at every event", "Same-day edit played at Walima", "5 Instagram reels", "3 albums + framed prints", "All raw files on a drive"],
  },
];

// Package builder on packages.html
export const BUILDER = {
  events: [
    { slug: "mehndi", name: "Mehndi / Mayun", base: 85000 },
    { slug: "barat", name: "Barat", base: 120000 },
    { slug: "nikkah", name: "Nikkah", base: 60000 },
    { slug: "walima", name: "Walima", base: 110000 },
    { slug: "engagement", name: "Mangni / Engagement", base: 70000 },
  ],
  teams: [
    { slug: "duo", name: "Essential", note: "1 photographer + 1 videographer", mult: 1 },
    { slug: "team", name: "Full team", note: "2 photographers + 2 videographers", mult: 1.55 },
    { slug: "grand", name: "Grand", note: "3 photographers + 3 videographers", mult: 2.1 },
  ],
  extras: [
    { slug: "drone", name: "Drone at each event", per: "event", price: 30000 },
    { slug: "film", name: "Cinematic highlight film", price: 65000 },
    { slug: "sde", name: "Same-day edit", price: 90000 },
    { slug: "bridal", name: "Bridal shoot", price: 45000 },
    { slug: "prewed", name: "Pre-wedding shoot", price: 55000 },
    { slug: "album", name: "Premium album (60 pages)", price: 48000 },
    { slug: "parents", name: "Parents' album", price: 28000 },
    { slug: "reels", name: "5 Instagram reels", price: 35000 },
  ],
};

export const CATS = [
  { slug: "bridal", name: "Bridal" },
  { slug: "mehndi", name: "Mehndi" },
  { slug: "barat", name: "Barat" },
  { slug: "nikkah", name: "Nikkah" },
  { slug: "walima", name: "Walima" },
  { slug: "couples", name: "Couples" },
  { slug: "events", name: "Events" },
];

// Portfolio gallery
export const PHOTOS = [
  { img: "bride-lantern", cat: "bridal", title: "Diya light", place: "Studio, Gulberg" },
  { img: "mehndi-marigold", cat: "mehndi", title: "Genda phool", place: "Model Town, Lahore" },
  { img: "couple-trees", cat: "barat", title: "Barat day", place: "Royal Palm, Lahore" },
  { img: "couple-arches", cat: "couples", title: "Through the arches", place: "Lahore Fort" },
  { img: "nikkah-couple", cat: "nikkah", title: "After the signatures", place: "DHA Phase 5" },
  { img: "walima-silver", cat: "walima", title: "Silver Walima", place: "Pearl Continental" },
  { img: "bride-emerald", cat: "bridal", title: "Emerald hall", place: "Falettis Hotel" },
  { img: "mehndi-friends", cat: "mehndi", title: "Cousins' crew", place: "Bahria Town" },
  { img: "baraat-fireworks", cat: "barat", title: "Atishbazi", place: "Raiwind Road farmhouse" },
  { img: "couple-lights", cat: "couples", title: "Fairy lights", place: "Johar Town" },
  { img: "ring-hands", cat: "nikkah", title: "The ring", place: "Gulberg" },
  { img: "walima-teal", cat: "walima", title: "Feroza", place: "Islamabad Club" },
  { img: "bride-red-rose", cat: "bridal", title: "Gulab", place: "Studio, Gulberg" },
  { img: "mehndi-hands", cat: "mehndi", title: "Five hands", place: "Faisalabad" },
  { img: "groom-pagri", cat: "barat", title: "Kulla", place: "Sialkot" },
  { img: "couple-fountain", cat: "couples", title: "By the fountain", place: "Shalimar Gardens" },
  { img: "stage-red", cat: "events", title: "The stage, before", place: "Nishat Hotel" },
  { img: "bride-jali", cat: "bridal", title: "Jaali", place: "Walled City" },
  { img: "mehndi-bride-flowers", cat: "mehndi", title: "Behind the hands", place: "DHA Phase 6" },
  { img: "sherwani-white", cat: "barat", title: "Sherwani, unworn", place: "Gulberg" },
  { img: "walima-ivory", cat: "walima", title: "Ivory", place: "Karachi Marriott" },
  { img: "couple-jharokha", cat: "couples", title: "Jharokha room", place: "Haveli, Androon Lahore" },
  { img: "bride-teal-lights", cat: "bridal", title: "Peacock", place: "Karachi" },
  { img: "henna-hands-dark", cat: "mehndi", title: "Dark henna", place: "Studio, Gulberg" },
  { img: "groom-car", cat: "barat", title: "Barat car", place: "Gujranwala" },
  { img: "couple-indoor", cat: "nikkah", title: "Qubool hai", place: "Lahore Gymkhana" },
  { img: "bride-pink", cat: "walima", title: "Gulabi", place: "Multan" },
  { img: "couple-lane", cat: "couples", title: "Lane in Jilani Park", place: "Racecourse Park" },
  { img: "conference-hall", cat: "events", title: "Tech summit", place: "Expo Centre, Lahore" },
  { img: "bride-chandelier", cat: "bridal", title: "Chandelier", place: "Avari, Lahore" },
  { img: "mehndi-bride-green", cat: "mehndi", title: "Hara jora", place: "Bahria Town" },
  { img: "groom-mehndi", cat: "barat", title: "Before the sehra", place: "Gulberg" },
  { img: "couple-autumn", cat: "couples", title: "Autumn in Changa Manga", place: "Changa Manga" },
  { img: "birthday-baby", cat: "events", title: "Pehli salgirah", place: "Studio, Gulberg" },
  { img: "bride-window", cat: "bridal", title: "Waiting", place: "DHA Phase 8" },
  { img: "hands-bangles", cat: "nikkah", title: "Choorian", place: "Cantt, Lahore" },
  { img: "couple-palms", cat: "couples", title: "Palm walk", place: "Lawrence Gardens" },
  { img: "stage-gold", cat: "events", title: "Gold stage", place: "Karachi" },
  { img: "bride-fountain", cat: "bridal", title: "Steps", place: "Bagh-e-Jinnah" },
  { img: "aqiqa-dawat", cat: "events", title: "Aqiqa dawat", place: "Shadman" },
];

// Wedding stories: stories.html lists them, story.html?s=slug shows one
export const STORIES = [
  {
    slug: "hira-saad", couple: "Hira & Saad", city: "Lahore", venue: "Royal Palm & Lahore Fort", date: "December 2025",
    events: ["Mehndi", "Barat", "Walima"], cover: "couple-arches", film: "couple-lights",
    gallery: ["couple-arches", "mehndi-marigold", "couple-trees", "bride-lantern", "couple-lights", "walima-silver", "ring-hands", "couple-lane"],
    line: "A December shaadi with a morning shoot at the Fort.",
    intro: "Three events in four days, a family of 900 guests, and one very calm bride. Hira and Saad asked for photos that felt like old Lahore, so we planned their couple portraits inside the Lahore Fort at sunrise, before the Walima.",
    story: [
      "We met Hira and Saad twice before the wedding: once to plan the timeline with both mothers, and once to walk the Fort and pick the arches we would use.",
      "On the Barat our team of five split up: two with the bride at the salon and then the stage, two with the groom from his house to the hall, and our drone pilot outside for the arrival and the atishbazi.",
      "The album went to print 24 days after the Walima, with 1,640 edited photos and a 6 minute film that both families have now watched more times than they will admit.",
    ],
    quote: "Our parents keep the album on the coffee table. Guests ask for it before they ask for chai.",
    by: "Hira, bride",
  },
  {
    slug: "amna-hamza", couple: "Amna & Hamza", city: "Islamabad", venue: "Islamabad Club & Monal", date: "March 2026",
    events: ["Nikkah", "Walima"], cover: "nikkah-couple", film: "couple-indoor",
    gallery: ["nikkah-couple", "couple-indoor", "walima-teal", "hands-bangles", "couple-fountain", "bride-teal-sofa"],
    line: "A small Nikkah in the morning, a big Walima at night.",
    intro: "Amna and Hamza kept their Nikkah to forty people at home in F-7, then invited everyone else to a Walima at the Islamabad Club. We covered both, plus a quick sunset session in the Margalla hills.",
    story: [
      "The Nikkah was in the family lawn with the maulvi sahib under a white canopy. We shot without flash and kept to the edges, which both families appreciated.",
      "For the Walima, Amna chose a feroza jora, so we picked locations with warm light to make the colour sing.",
    ],
    quote: "We barely noticed them on the day. Then the photos came and my nani cried.",
    by: "Amna, bride",
  },
  {
    slug: "zara-ali", couple: "Zara & Ali", city: "Karachi", venue: "Marriott & Clifton beach", date: "January 2026",
    events: ["Mehndi", "Barat", "Walima"], cover: "walima-ivory", film: "bride-teal-lights",
    gallery: ["walima-ivory", "bride-teal-lights", "mehndi-friends", "groom-car", "stage-gold", "couple-shawl"],
    line: "Our team flew to Karachi for a three-day wedding by the sea.",
    intro: "Zara found us on Instagram and asked if we travel. We do. Four of us flew to Karachi for a Mehndi at a Defence farmhouse, a Barat at the Marriott and a seaside couple shoot at Clifton.",
    story: [
      "Travel, hotel and equipment for Karachi weddings are quoted upfront, so there were no surprises on the final invoice.",
      "The Mehndi had a choreographed entry by eleven cousins. We used two video cameras on gimbals and a third on a tripod so nobody would be cut out.",
    ],
    quote: "Worth every rupee of flying them in. The film is better than our favourite drama.",
    by: "Ali, groom",
  },
  {
    slug: "maryam-usman", couple: "Maryam & Usman", city: "Faisalabad", venue: "Serena Hotel Faisalabad", date: "October 2025",
    events: ["Mehndi", "Barat"], cover: "mehndi-bride-green", film: "mehndi-hands",
    gallery: ["mehndi-bride-green", "mehndi-hands", "henna-hands-dark", "groom-pagri", "baraat-fireworks", "bride-maroon"],
    line: "A Mehndi so colourful we had to rethink our editing.",
    intro: "Maryam's family went all-in on yellow, green and marigolds. It is the most colourful Mehndi we have shot, and one of our favourite Barats, with a traditional ghori and dhol wala outside the hall.",
    story: [
      "Bright Mehndi décor can turn skin tones orange in photos. We set a custom colour profile for this wedding so the décor stays bright and faces stay natural.",
      "The Barat was a proper Punjabi arrival, with the groom on a decorated ghori and the dhol playing for forty minutes. Our drone got the whole procession in one take.",
    ],
    quote: "They understood our family and our rasmein. Nothing felt staged.",
    by: "Usman, groom",
  },
  {
    slug: "sana-bilal", couple: "Sana & Bilal", city: "Naran", venue: "Saif-ul-Malook & River Kunhar", date: "June 2026",
    events: ["Pre-wedding"], cover: "couple-palms", film: "couple-road",
    gallery: ["couple-palms", "couple-road", "couple-autumn", "couple-walk", "couple-trees"],
    line: "A pre-wedding shoot in the north, two days and a lot of jeep rides.",
    intro: "Sana and Bilal wanted their pre-wedding photos somewhere that was not a garden in Lahore. So we drove north: a riverside session on the Kunhar, and sunrise near Saif-ul-Malook.",
    story: [
      "Destination shoots are planned around weather and light. We kept a spare day in the plan, and needed it.",
      "The photos became their save-the-date, the welcome board at the venue and a 40 second reel that was shared more than 20,000 times.",
    ],
    quote: "Best two days of our engagement. The photos are a bonus.",
    by: "Sana",
  },
];

export const FILMS = [
  { slug: "hira-saad", title: "Hira & Saad", kind: "Wedding film", len: "6:12", city: "Lahore", poster: "couple-lights", frames: ["couple-lights", "mehndi-marigold", "couple-trees", "couple-arches", "walima-silver"] },
  { slug: "zara-ali", title: "Zara & Ali", kind: "Wedding film", len: "5:40", city: "Karachi", poster: "bride-teal-lights", frames: ["bride-teal-lights", "mehndi-friends", "groom-car", "walima-ivory", "couple-shawl"] },
  { slug: "maryam-usman", title: "Maryam & Usman", kind: "Mehndi teaser", len: "1:00", city: "Faisalabad", poster: "mehndi-hands", frames: ["mehndi-hands", "mehndi-bride-green", "henna-hands-dark", "baraat-fireworks"] },
  { slug: "amna-hamza", title: "Amna & Hamza", kind: "Nikkah film", len: "3:48", city: "Islamabad", poster: "couple-indoor", frames: ["couple-indoor", "nikkah-couple", "hands-bangles", "walima-teal"] },
  { slug: "sana-bilal", title: "Sana & Bilal", kind: "Pre-wedding reel", len: "0:42", city: "Naran", poster: "couple-road", frames: ["couple-road", "couple-palms", "couple-autumn", "couple-walk"] },
  { slug: "tech-summit", title: "Lahore Tech Summit", kind: "Corporate recap", len: "2:30", city: "Lahore", poster: "conference-hall", frames: ["conference-hall", "corporate-audience", "corporate-dinner"] },
];

export const TEAM = [
  { name: "Faiza Qureshi", role: "Founder, lead photographer", note: "12 years, 600+ weddings", img: "photographer-woman" },
  { name: "Sadia Rehman", role: "Lead, bridal & women's coverage", note: "Covers the bride's side and ladies-only events", img: "photographer-back" },
  { name: "Umer Javed", role: "Head of films", note: "Directs every highlight film", img: "videographer-stage" },
  { name: "Hassan Ali", role: "Drone pilot & second shooter", note: "Licensed operator", img: "drone-forest" },
];

export const FAQ = [
  ["How do we book a date?", "Send us your dates on WhatsApp or through the booking form. We confirm availability the same day. A 30% advance locks the date, 50% is due one week before the first event, and the rest on delivery."],
  ["Do you send a woman photographer for the bride?", "Yes. Sadia leads our bridal side and ladies-only events. Just tell us when you book and we will plan the team around it."],
  ["Do you travel outside Lahore?", "All the time. Islamabad, Faisalabad, Sialkot, Multan and Karachi have fixed travel charges listed above. Destination weddings in the north or abroad are quoted per trip."],
  ["When do we get our photos and films?", "Sneak peeks within 48 hours, the full photo gallery in 3 to 4 weeks, albums 3 to 4 weeks after you approve the design, and films in 6 to 8 weeks."],
  ["Can we get the raw, unedited files?", "Raw files are included in the Shahi package and can be added to any other package for Rs 25,000 on a hard drive."],
  ["What if the event runs late?", "Extra hours are Rs 12,000 per hour for the team. We never leave in the middle of a rasm, and we tell you before the extra time starts."],
  ["Can we pay in instalments?", "Yes: advance, pre-event and delivery, by bank transfer, Raast, JazzCash or Easypaisa. Cash is fine too, against a signed receipt."],
];

export const QUOTES = [
  { q: "Our parents keep the album on the coffee table. Guests ask for it before they ask for chai.", who: "Hira & Saad", what: "Mehndi, Barat & Walima, Lahore" },
  { q: "They sent a woman photographer for my side, which made my mother very happy and me very relaxed.", who: "Amna & Hamza", what: "Nikkah & Walima, Islamabad" },
  { q: "Worth every rupee of flying them to Karachi. The film is better than our favourite drama.", who: "Zara & Ali", what: "Three events, Karachi" },
  { q: "Same-evening photos for our launch, on brand, and nobody had to chase them.", who: "Ayesha K.", what: "Marketing lead, Lahore Tech Summit" },
];

// Options used on the booking form and admin
export const EVENT_TYPES = ["Mehndi / Mayun", "Barat", "Nikkah", "Walima", "Bridal shoot", "Pre-wedding", "Engagement / Mangni", "Aqiqa / Birthday", "Corporate event"];
export const BUDGETS = ["Under Rs 1,50,000", "Rs 1,50,000 to 3,00,000", "Rs 3,00,000 to 6,00,000", "Rs 6,00,000 to 10,00,000", "Rs 10,00,000+", "Not sure yet"];
export const SOURCES = ["Instagram", "Facebook", "Friend or family", "Google", "TikTok", "Wedding planner", "Other"];
export const PACKAGE_NAMES = ["Classic", "Signature", "Shahi", "Custom", "Not sure yet"];
