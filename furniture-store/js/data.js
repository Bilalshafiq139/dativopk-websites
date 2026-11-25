// Catalogue for "Lakri & Co." (placeholder brand). Change names, prices and photos here.
export const BRAND = {
  name: "Lakri & Co.",
  short: "lakri",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "hello@lakri.example",
  showroom: "Plot 14, Gulberg III, Lahore",
  workshop: "Workshop: Chiniot, Punjab",
  freeDeliveryOver: 150000,
  delivery: 6500,
  whiteGlove: 9500,
};

// Every piece is made in all four woods. "add" is the price change for that wood.
export const WOODS = [
  { id: "oak", name: "Natural Oak", short: "Oak", color: "#d8b48a", add: 0, img: "wood-oak", note: "Pale, calm and even. Our lightest wood, finished in a hard matt oil." },
  { id: "sheesham", name: "Sheesham", short: "Sheesham", color: "#b27a45", add: 0, img: "wood-sheesham", note: "Punjab's own rosewood, bought from growers near our Chiniot workshop. Warm, golden, and very hard." },
  { id: "walnut", name: "American Walnut", short: "Walnut", color: "#6d4532", add: 0.15, img: "wood-walnut", note: "Deep chocolate grain that turns richer with light. Imported and slow-dried for six months." },
  { id: "ebony", name: "Ebonised Ash", short: "Ebonised", color: "#2c2826", add: 0.08, img: "wood-ebony", note: "Ash stained to near black, so the grain still shows through. Sharp in a pale room." },
];

export const FABRICS = [
  { id: "ivory", name: "Ivory Bouclé", color: "#ece6da" },
  { id: "oat", name: "Oat Linen", color: "#d9cdb6" },
  { id: "rose", name: "Rose Clay", color: "#d9aaa0" },
  { id: "terracotta", name: "Terracotta", color: "#b8613f" },
  { id: "mustard", name: "Haldi", color: "#c99a3a" },
  { id: "sage", name: "Sage", color: "#9aa58a" },
  { id: "indigo", name: "Neel Indigo", color: "#2f3a5c" },
  { id: "charcoal", name: "Charcoal", color: "#3a3836" },
];

export const CATEGORIES = [
  { id: "seating", name: "Seating" },
  { id: "tables", name: "Tables & desks" },
  { id: "storage", name: "Storage" },
  { id: "beds", name: "Beds" },
  { id: "lighting", name: "Lighting" },
  { id: "accents", name: "Mirrors & accents" },
];

export const ROOMS = [
  { id: "living", name: "Living", img: "room-living", title: "A living room, <em>one piece</em> at a time.",
    hotspots: [{ p: "reet", x: 12, y: 78 }, { p: "gol", x: 41, y: 73 }, { p: "daal", x: 76, y: 66 }] },
  { id: "dining", name: "Dining", img: "room-dining", title: "A table that <em>gathers</em> people.",
    hotspots: [{ p: "dastarkhwan", x: 52, y: 66 }, { p: "daal", x: 37, y: 72 }] },
  { id: "bedroom", name: "Bedroom", img: "room-bedroom", title: "Quiet wood for <em>slow</em> mornings.",
    hotspots: [{ p: "neend", x: 50, y: 66 }, { p: "sirhana", x: 20, y: 64 }] },
  { id: "work", name: "Work", img: "room-work", title: "A desk you <em>want</em> to sit at.",
    hotspots: [{ p: "kaam", x: 55, y: 70 }] },
];

const P = (o) => ({ fabric: false, gallery: [o.img], ...o });
export const PRODUCTS = [
  P({ id: "noor", name: "Noor", type: "Lounge chair", cat: "seating", room: "living", price: 145000, dims: [31, 33, 29], weeks: 3, img: "p-noor", fabric: true,
    gallery: ["p-noor", "detail-boucle", "room-living"], blurb: "A low timber frame holding a deep, soft upholstered seat.",
    story: "Noor started as a sketch of the chair our ustad's father sat in every evening. We kept the low seat and the wide arms, and shaped the arms from solid wood so they stay cool and smooth where your hands rest." }),
  P({ id: "saira", name: "Saira", type: "Armchair", cat: "seating", room: "living", price: 98000, dims: [28, 32, 30], weeks: 3, img: "p-saira", fabric: true,
    gallery: ["p-saira", "detail-chair", "craftsman"], blurb: "An open timber armchair with loose, zip-off cushions.",
    story: "A reading chair with a reclined back and arms wide enough for a cup of chai. The cushions zip off for washing, and the frame is held with hand-cut joints, no metal brackets." }),
  P({ id: "reet", name: "Reet", type: "3-seat sofa", cat: "seating", room: "living", price: 265000, dims: [88, 38, 29], weeks: 6, img: "p-reet", fabric: true,
    gallery: ["p-reet", "room-living2", "detail-boucle"], blurb: "A deep, soft sofa on a solid timber plinth.",
    story: "Reet is built on a kiln-dried hardwood frame, with pocket springs and a feather-wrapped seat. The plinth is solid wood, so the sofa sits low and never wobbles on uneven floors." }),
  P({ id: "gol", name: "Gol", type: "Pouf", cat: "seating", room: "living", price: 32000, dims: [22, 22, 16], weeks: 2, img: "p-gol", fabric: true,
    gallery: ["p-gol", "detail-pouf"], blurb: "A round, firm pouf on a thin wooden ring.",
    story: "A footrest, an extra seat, or a place to put a tray. Gol has a firm foam core and a solid wood base ring that keeps it off the floor." }),
  P({ id: "chand", name: "Chand", type: "Coffee table", cat: "tables", room: "living", price: 68000, dims: [43, 43, 14], weeks: 3, img: "p-chand",
    gallery: ["p-chand", "detail-table", "wood-oak"], blurb: "A round low table with a hand-fluted base.",
    story: "The base is cut into fluted ribs by hand, one at a time, then oiled so the light catches every edge. The top is 1.5 inch solid timber." }),
  P({ id: "daal", name: "Daal", type: "Dining chair", cat: "seating", room: "dining", price: 28500, dims: [19, 21, 31], weeks: 4, img: "p-daal",
    gallery: ["p-daal", "room-dining"], blurb: "A curved back rail that holds you without a cushion.",
    story: "Daal's back rail is carved from one thick piece so it curves around you. Sold one at a time, so you can mix woods around a table." }),
  P({ id: "dastarkhwan", name: "Dastarkhwan", type: "Dining table", cat: "tables", room: "dining", price: 185000, dims: [72, 36, 30], weeks: 5, img: "p-dastarkhwan",
    gallery: ["p-dastarkhwan", "room-dining", "workshop"], blurb: "Seats six, made from three wide boards.",
    story: "Named after the cloth every family spreads for a meal. Three wide boards, book-matched, on tapered legs that leave room for every knee." }),
  P({ id: "neend", name: "Neend", type: "Platform bed", cat: "beds", room: "bedroom", price: 210000, dims: [64, 84, 40], weeks: 6, img: "p-neend",
    gallery: ["p-neend", "room-bedroom"], blurb: "A low queen bed with a thick timber headboard.",
    story: "A slatted platform, so no box spring is needed, and a headboard thick enough to lean on with a book. Comes apart into four pieces for narrow stairs." }),
  P({ id: "roshan", name: "Roshan", type: "Floor lamp", cat: "lighting", room: "living", price: 24000, dims: [14, 14, 62], weeks: 2, img: "p-roshan",
    gallery: ["p-roshan"], blurb: "A turned wooden stem with a linen shade.",
    story: "The stem is turned on a lathe in Chiniot, the shade is hand-stitched linen. Warm 2700K bulb included." }),
  P({ id: "sandook", name: "Sandook", type: "Sideboard", cat: "storage", room: "dining", price: 142000, dims: [70, 18, 30], weeks: 5, img: "p-sandook",
    gallery: ["p-sandook"], blurb: "Four soft-close doors on splayed legs.",
    story: "Room for plates, files or a record player. Doors are soft-close, shelves move, and the back has a cut-out for cables." }),
  P({ id: "kaam", name: "Kaam", type: "Writing desk", cat: "tables", room: "work", price: 76000, dims: [48, 24, 30], weeks: 4, img: "p-kaam",
    gallery: ["p-kaam", "room-work"], blurb: "A slim desk with a hidden cable tray.",
    story: "Big enough for a laptop, a notebook and a lamp. A tray under the top hides chargers and cables." }),
  P({ id: "taaq", name: "Taaq", type: "Arch mirror", cat: "accents", room: "bedroom", price: 38000, dims: [24, 1.5, 60], weeks: 3, img: "p-taaq",
    gallery: ["p-taaq"], blurb: "A tall arched mirror in a solid wood frame.",
    story: "Shaped like the niches in old Lahore havelis. Lean it on the wall or hang it with the cleat included." }),
  P({ id: "sirhana", name: "Sirhana", type: "Bedside table", cat: "storage", room: "bedroom", price: 22000, dims: [18, 16, 22], weeks: 3, img: "p-sirhana",
    gallery: ["p-sirhana"], blurb: "One drawer, one open shelf, rounded edges.",
    story: "The drawer runs on wooden runners and closes with a soft push. Corners are rounded so knees in the dark are safe." }),
  P({ id: "peerhi", name: "Peerhi", type: "Counter stool", cat: "seating", room: "work", price: 16500, dims: [15, 15, 26], weeks: 2, img: "p-peerhi",
    gallery: ["p-peerhi"], blurb: "A sturdy stool with a footrest ring.",
    story: "Our take on the low peerhi every kitchen has, raised to counter height. The seat is dished so it is comfortable without a cushion." }),
  P({ id: "rakh", name: "Rakh", type: "Low console", cat: "storage", room: "living", price: 58000, dims: [48, 14, 30], weeks: 4, img: "p-console",
    gallery: ["p-console", "tools"], blurb: "A low two-door console for a hallway or under a TV.",
    story: "Narrow enough for an entrance, long enough for a TV. Two doors, one shelf, and a top made to hold keys and a vase." }),
];

export const TESTIMONIALS = [
  { q: "The Dastarkhwan table arrived on the exact Friday they said. Two men carried it up four floors and set it up. It is the best thing in our flat.", n: "Ayesha R.", c: "DHA, Karachi" },
  { q: "I ordered swatches of all four woods first. Picked walnut, and the Noor chair looks even better than the photos.", n: "Hamid S.", c: "F-7, Islamabad" },
  { q: "Simple, solid furniture without the showroom markup. The WhatsApp team sent me workshop photos while my bed was being made.", n: "Mehreen K.", c: "Gulberg, Lahore" },
];

export const FAQ = [
  ["How long does delivery take?", "Every piece is made to order in our Chiniot workshop. Lead time is shown on each product, usually 2 to 6 weeks, plus 2 to 4 days on the road."],
  ["Which cities do you deliver to?", "We deliver to every city in Pakistan. Lahore, Karachi, Islamabad and Rawalpindi have our own vans; other cities go with a trusted freight partner."],
  ["Can I see the woods before I order?", "Yes. Order a free swatch box with all four woods and our fabrics, or visit the Gulberg showroom."],
  ["How do I pay?", "Pay 50% advance by bank transfer or card, and the rest on delivery. Cash on delivery is available for pieces under Rs 50,000."],
  ["What if it doesn't fit?", "Measure with our 'Will it fit?' filter first. If it still doesn't work, you have 30 days to return it in its original condition."],
  ["Is there a warranty?", "10 years on every frame and joint. If a joint opens, we fix it."],
];

export const img = (name) => `assets/img/${name}.webp`;
export const money = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");
export const woodById = (id) => WOODS.find((w) => w.id === id) || WOODS[0];
export const fabricById = (id) => FABRICS.find((f) => f.id === id) || FABRICS[0];
export const priceFor = (p, woodId) => Math.round((p.price * (1 + woodById(woodId).add)) / 500) * 500;
export const dimsText = (d) => `${d[0]}″ W · ${d[1]}″ D · ${d[2]}″ H`;
