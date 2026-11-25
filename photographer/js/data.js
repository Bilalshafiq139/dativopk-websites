// All studio content lives here: name, contact, portfolio, projects, services and journal.
// Change things in this one file and every page updates.
export const SITE = {
  first: "Zoya",
  last: "Malik",
  name: "Zoya Malik",
  studio: "Zoya Malik Studio",
  role: "Portrait & wedding photographer",
  city: "Lahore",
  phone: "+92 300 1234567",
  whatsapp: "923001234567", // international format, no + or spaces
  email: "hello@zoyamalik.studio",
  address: "Studio 4, 27-C Main Boulevard, DHA Phase 6, Lahore",
  instagram: "@zoyamalik.studio",
  since: 2015,
};

const I = (n) => `assets/img/${n}.webp`;
export const img = I;

export const CATS = [
  { slug: "portrait", name: "Portraits", count: 58 },
  { slug: "wedding", name: "Weddings", count: 26 },
  { slug: "fashion", name: "Fashion", count: 31 },
  { slug: "commercial", name: "Commercial", count: 74 },
];

// Portfolio gallery: every photo on the Portfolio page
export const PHOTOS = [
  { img: "red-turban", cat: "portrait", title: "Red turban", place: "Studio, DHA" },
  { img: "bride-green", cat: "wedding", title: "Mehndi bride", place: "Gulberg, Lahore" },
  { img: "street-shades", cat: "fashion", title: "Born to break", place: "Ichhra street wall" },
  { img: "tv-orange", cat: "commercial", title: "Signal, still life", place: "Studio, DHA" },
  { img: "sunflower-curls", cat: "portrait", title: "Men with flowers I", place: "Studio, DHA" },
  { img: "couple-lights", cat: "wedding", title: "Baraat night", place: "Nishat Hotel" },
  { img: "red-field", cat: "fashion", title: "Red season", place: "Bedian Road fields" },
  { img: "perfume-gold", cat: "commercial", title: "Amber & glass", place: "Studio, DHA" },
  { img: "red-hair", cat: "portrait", title: "Copper", place: "Model Town" },
  { img: "couple-river", cat: "wedding", title: "By the river", place: "Murree" },
  { img: "buttons-1", cat: "fashion", title: "Buttons, look 1", place: "Studio, DHA" },
  { img: "sneakers", cat: "commercial", title: "Run club drop", place: "Studio, DHA" },
  { img: "green-sweater-2", cat: "portrait", title: "Forest green", place: "Jilani Park" },
  { img: "bride-pink", cat: "wedding", title: "Valima glow", place: "Pearl Continental" },
  { img: "leather-street", cat: "fashion", title: "Old city leather", place: "Anarkali" },
  { img: "tv-kitchen", cat: "commercial", title: "Kitchen broadcast", place: "On location" },
  { img: "yellow-beanie", cat: "portrait", title: "Mustard", place: "Changa Manga" },
  { img: "henna-hands", cat: "wedding", title: "Hands, henna, gold", place: "Johar Town" },
  { img: "orange-jacket", cat: "fashion", title: "Orange on green", place: "Bagh-e-Jinnah" },
  { img: "camera-orange", cat: "commercial", title: "Instant pastel", place: "Studio, DHA" },
  { img: "black-hat", cat: "portrait", title: "Hide and seek", place: "Studio, DHA" },
  { img: "couple-walk", cat: "wedding", title: "First walk", place: "Nathia Gali" },
  { img: "suit-shades", cat: "fashion", title: "Sharp", place: "MM Alam Road" },
  { img: "tv-lab", cat: "commercial", title: "Repair shop", place: "Hall Road" },
  { img: "red-beanie", cat: "portrait", title: "Pines", place: "Ayubia" },
  { img: "bride-red", cat: "wedding", title: "Rukhsati red", place: "Defence, Lahore" },
  { img: "buttons-2", cat: "fashion", title: "Buttons, look 2", place: "Studio, DHA" },
  { img: "cap-eyes", cat: "portrait", title: "Morning light", place: "Gulberg" },
  { img: "couple-kiss", cat: "wedding", title: "Sherwani & dupatta", place: "Studio, DHA" },
  { img: "red-hat", cat: "portrait", title: "Winter sky", place: "Islamabad" },
  { img: "sunflower-man", cat: "portrait", title: "Men with flowers II", place: "Sheikhupura" },
  { img: "beach-walk", cat: "portrait", title: "Shoreline", place: "Kund Malir" },
];

// Case studies: projects.html lists them, project.html?p=slug shows one
export const PROJECTS = [
  {
    slug: "born-to-break", title: "Born to break", kicker: "Experimental project", cat: "fashion",
    client: "Personal series", date: "21.10.2026", place: "Ichhra, Anarkali & MM Alam Road",
    cover: "street-shades", gallery: ["street-shades", "leather-street", "suit-shades", "cap-eyes", "black-hat"],
    line: "I bring joy and creativity with every photo.",
    intro: "A street series about young men in Lahore who dress loud on purpose. Painted walls, borrowed sunglasses, and no plan beyond the next corner.",
    story: [
      "We walked from Ichhra to Anarkali with one camera, one 35 mm lens and no lights. Every frame was made with whatever the street gave us: a mural, a shop shutter, the last ten minutes of sun.",
      "The rule for the series was simple. Nobody poses twice. If a pose worked, we threw it away and found the next one. That is how the shots stay unpredictable.",
    ],
    quote: "I stopped asking people to stand still. The city moves, so the photos should too.",
  },
  {
    slug: "men-with-flowers", title: "Men with flowers", kicker: "Personal portraits", cat: "portrait",
    client: "Exhibited at Alhamra Arts Council", date: "04.06.2026", place: "Sheikhupura sunflower fields",
    cover: "sunflower-curls", gallery: ["sunflower-curls", "sunflower-man", "green-sweater", "green-sweater-2"],
    line: "Soft portraits of men holding something gentle.",
    intro: "A portrait series that started as a joke between friends and ended up on gallery walls. Men, flowers, and the quiet that happens when nobody tells them to smile.",
    story: [
      "Sunflowers in Sheikhupura only peak for about two weeks. We shot at 6 am on four mornings in a row, while the petals still faced east.",
      "Twelve portraits from the series were printed on cotton rag paper and shown at Alhamra in June.",
    ],
    quote: "The hardest part was getting them to stop laughing. The best frames came right after.",
  },
  {
    slug: "red-season", title: "Red season", kicker: "Fashion editorial", cat: "fashion",
    client: "Kaarvan Clothing, winter lookbook", date: "12.01.2026", place: "Bedian Road & Ayubia",
    cover: "red-field", gallery: ["red-field", "red-hill", "orange-jacket", "red-beanie", "red-hat"],
    line: "One colour, five looks, two cities.",
    intro: "A winter lookbook built around a single colour. Red coats, red knits and red hats against dry fields and green pines.",
    story: [
      "Kaarvan wanted a lookbook that felt like a road trip, so we drove. Day one was the open fields off Bedian Road, day two was the pine forest in Ayubia.",
      "We kept the styling simple and let the landscape do the work. The full lookbook went live with 46 retouched images and 12 short reels.",
    ],
    quote: "Red reads from a hundred metres away. That was the whole idea.",
  },
  {
    slug: "ayesha-hamza", title: "Ayesha & Hamza", kicker: "Wedding story", cat: "wedding",
    client: "Mehndi, Baraat & Valima", date: "18.12.2025", place: "Lahore & Nathia Gali",
    cover: "couple-lights", gallery: ["couple-lights", "bride-green", "henna-hands", "couple-river", "bride-pink", "couple-walk", "couple-kiss", "bride-red"],
    line: "Three days, two cities, one very loud family.",
    intro: "A three-day wedding covered by a team of three: Mehndi in Johar Town, Baraat at Nishat, and a quiet couple shoot in Nathia Gali the morning after the Valima.",
    story: [
      "We met Ayesha and Hamza twice before the wedding to plan the timeline, family lists and the photos their parents really wanted.",
      "On the day, one photographer stayed with the bride, one with the groom, and one floated. The album was delivered in 21 days with 640 edited photos and a 4 minute highlight film.",
    ],
    quote: "We barely noticed them on the day, and then the photos made my mother cry. Twice.",
  },
  {
    slug: "still-life", title: "Still life for small brands", kicker: "Product photography", cat: "commercial",
    client: "Loom & Co, Attar House, Run Club PK", date: "02.09.2026", place: "Studio, DHA Phase 6",
    cover: "tv-orange", gallery: ["tv-orange", "perfume-gold", "sneakers", "tv-kitchen", "camera-orange", "tv-lab"],
    line: "Capturing the perfect frame for your product.",
    intro: "Product photos for three Lahore brands that sell mostly on Instagram. Bold colour backdrops, hard light, and one hero object per frame.",
    story: [
      "Every brand got a mood board first, then a test shot, then the full day. Colours were picked to match their feed, not ours.",
      "Each client received 30 to 60 retouched images in square, 4:5 and story sizes, ready to post.",
    ],
    quote: "Our click-through on ads went up the week we switched to these photos.",
  },
  {
    slug: "buttons", title: "Buttons", kicker: "Studio portraits", cat: "fashion",
    client: "Personal series", date: "15.03.2026", place: "Studio, DHA Phase 6",
    cover: "buttons-1", gallery: ["buttons-1", "buttons-2", "red-turban", "black-hat"],
    line: "Colour, texture and a lot of patience.",
    intro: "A studio series about covering and revealing: hands over eyes, hats over faces, two hundred buttons stitched into hair.",
    story: [
      "Styling took four hours. The shoot took forty minutes. That is normal for a concept like this.",
      "We used one large softbox and a painted canvas backdrop, so every frame feels like a painting more than a photograph.",
    ],
    quote: "Sometimes the most interesting part of a face is the part you hide.",
  },
];

export const SERVICES = [
  {
    slug: "portrait", name: "Portrait session", img: "red-turban", price: "PKR 25,000", unit: "per session",
    line: "Personal portraits, headshots and birthday shoots, in the studio or outside.",
    items: ["90 minutes, up to 2 outfits", "Studio or one outdoor location in Lahore", "25 retouched photos", "Private online gallery", "Delivered in 7 days"],
  },
  {
    slug: "wedding", name: "Wedding coverage", img: "couple-lights", price: "PKR 180,000", unit: "from, per event", featured: true,
    line: "Mehndi, Baraat, Nikkah and Valima, covered by a lead photographer and a second shooter.",
    items: ["2 photographers, up to 6 hours", "600+ edited photos per event", "Highlight film on request", "Pre-wedding planning call", "Printed album option", "Delivered in 21 days"],
  },
  {
    slug: "fashion", name: "Fashion & editorial", img: "red-field", price: "PKR 60,000", unit: "per half day",
    line: "Lookbooks, campaigns and designer collections with art direction included.",
    items: ["Mood board and shot list", "Studio or location", "40 retouched images", "Web and print sizes", "Usage rights for 12 months"],
  },
  {
    slug: "commercial", name: "Product & commercial", img: "perfume-gold", price: "PKR 3,500", unit: "per image",
    line: "Product photos for Instagram stores, menus, catalogues and ads.",
    items: ["Colour backdrops or white background", "Square, 4:5 and story crops", "Minimum 10 images", "Same-week delivery", "Monthly content plans available"],
  },
];

export const STEPS = [
  ["Say hello", "Send an enquiry or WhatsApp us with your date, the type of shoot and a rough budget."],
  ["Plan together", "We share a quote, a mood board and a timeline. A small advance books your date."],
  ["Shoot day", "We handle light, direction and the awkward bits. You just show up as yourself."],
  ["Your gallery", "Edited photos arrive in a private online gallery, ready to download and print."],
];

export const TESTIMONIALS = [
  { q: "We barely noticed Zoya on the day, and then the photos made my mother cry. Twice.", who: "Ayesha R.", what: "Wedding, December 2025" },
  { q: "Our click-through on ads went up the week we switched to these photos. Booking again for Eid.", who: "Hamid S.", what: "Founder, Attar House" },
  { q: "I hate being photographed. This is the first time I liked every single picture of myself.", who: "Saad K.", what: "Portrait session" },
];

export const POSTS = [
  {
    slug: "prepare-portrait", title: "How to prepare for a portrait session", tag: "Tips", date: "18 Nov 2026", read: "4 min", img: "cap-eyes",
    excerpt: "What to wear, what to bring, and why you should sleep early the night before.",
    body: [
      "Most people walk into a portrait session nervous. That is normal, and it disappears in about ten minutes. A little preparation makes those ten minutes shorter.",
      "Pick outfits in solid colours. Busy prints fight with your face for attention. Bring one outfit you love and one you feel brave in.",
      "Sleep early, drink water, and skip the new haircut the day before. Give a fresh cut a week to settle.",
      "On the day, bring music you like. We will play it in the studio. People always look more like themselves when their own songs are on.",
    ],
  },
  {
    slug: "golden-hour-lahore", title: "Six golden-hour spots in Lahore", tag: "Locations", date: "02 Nov 2026", read: "5 min", img: "orange-jacket",
    excerpt: "Our favourite places for soft evening light, from Bagh-e-Jinnah to the Bedian Road fields.",
    body: [
      "Golden hour in Lahore lasts about forty minutes in winter and a little less in summer. These are the places we keep going back to.",
      "Bagh-e-Jinnah for old trees and long paths. Jilani Park for open lawns. The fields off Bedian Road for dry grass and wide skies.",
      "The Walled City for texture and colour, early in the morning before the crowds. Lake City for water and reflections. And any rooftop in Gulberg for the skyline.",
      "Most of these need permission or an early start. We handle both when you book an outdoor session.",
    ],
  },
  {
    slug: "couple-outfits", title: "What to wear for a couple shoot", tag: "Weddings", date: "21 Oct 2026", read: "3 min", img: "couple-walk",
    excerpt: "Matching is out. Complementing is in. A simple guide to colours that look good together.",
    body: [
      "You do not need to match. You need to look like you belong in the same photo.",
      "Pick one main colour each and keep them in the same family: warm with warm, cool with cool. Deep red and cream. Olive and rust. Navy and grey.",
      "For pre-wedding shoots, bring one traditional and one casual outfit. The change halfway through gives your album a nice rhythm.",
    ],
  },
  {
    slug: "product-photos-instagram", title: "Product photos that actually sell on Instagram", tag: "Business", date: "07 Oct 2026", read: "6 min", img: "tv-orange",
    excerpt: "One hero object, one bold colour and a crop made for the phone. That is most of the secret.",
    body: [
      "People scroll fast. Your product has about half a second to stop them.",
      "Use a single strong background colour that fits your brand. Put one product in the frame, not five. Shoot for 4:5 first, because that is what the feed shows.",
      "Plan a set, not a single photo: a hero shot, a detail shot, a scale shot with a hand, and a lifestyle shot. That covers a full week of posts.",
    ],
  },
  {
    slug: "film-and-digital", title: "Why we still carry a film camera to weddings", tag: "Behind the scenes", date: "19 Sep 2026", read: "4 min", img: "camera-orange",
    excerpt: "Thirty-six frames, no screen to check, and the photos families love the most.",
    body: [
      "At every wedding one of us carries a small film camera with a single roll of 36 frames.",
      "Without a screen to check, you shoot differently. You wait. You only press the button when something real happens.",
      "Those frames come back a week later, slightly grainy and warm, and they are almost always the ones that end up framed on a wall.",
    ],
  },
];

export const SHOOT_TYPES = ["Portrait session", "Wedding / Mehndi / Valima", "Pre-wedding / couple", "Fashion & editorial", "Product & commercial", "Event", "Other"];
export const BUDGETS = ["Under PKR 50,000", "PKR 50,000 to 150,000", "PKR 150,000 to 300,000", "PKR 300,000+", "Not sure yet"];
export const SOURCES = ["Instagram", "Friend or family", "Google", "Facebook", "WhatsApp", "Other"];
