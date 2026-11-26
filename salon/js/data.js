// "Zeenat Salon & Studio" (placeholder brand), a ladies salon in Lahore. Change services, prices, stylists here.
// Photos: Pexels. Keep service ids in step with api/server.js.
export const SALON = {
  name: "Zeenat",
  full: "Zeenat Salon & Studio",
  tagline: "Ladies salon & bridal studio",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "hello@zeenat.example",
  address: "22-C, Main Boulevard, Gulberg III, Lahore",
  hours: [["Mon to Sat", "11am to 9pm"], ["Sunday", "1pm to 8pm"], ["Bridal bookings", "From 7am by appointment"]],
  map: "https://maps.google.com/maps?q=Gulberg%20III%20Lahore&z=14&output=embed",
};

export const CATS = [["hair", "Hair"], ["makeup", "Makeup"], ["skin", "Skin & Facials"], ["hands", "Hands, Feet & Mehndi"]];

// price in PKR ("from" price). mins = appointment length.
export const SERVICES = [
  { id: "cut", cat: "hair", name: "Haircut & Blow-dry", price: 3500, mins: 60, img: "s-cut", note: "Includes wash and blow-dry", featured: true,
    items: [["Trim & blow-dry", 2500], ["Layer / step cut", 3500], ["Restyle & consultation", 4500], ["Kids cut (under 10)", 1500]] },
  { id: "colour", cat: "hair", name: "Colour & Highlights", price: 9000, mins: 150, img: "s-colour", note: "Includes cut and blow-dry", featured: true,
    items: [["Root touch-up", 6000], ["Global colour", 12000], ["Balayage / ombre", 22000], ["Highlights (full head)", 18000]] },
  { id: "keratin", cat: "hair", name: "Keratin & Protein", price: 18000, mins: 180, img: "s-keratin", note: "Frizz-free for up to 4 months", featured: true,
    items: [["Keratin (shoulder length)", 18000], ["Keratin (long hair)", 26000], ["Protein treatment", 12000], ["Rebonding", 22000]] },
  { id: "bridal", cat: "makeup", name: "Bridal Makeup", price: 45000, mins: 240, img: "s-bridal", note: "Barat, walima and nikah looks", featured: true,
    items: [["Nikah / mehndi look", 30000], ["Barat (signature)", 55000], ["Walima (soft glam)", 45000], ["Trial session", 10000]] },
  { id: "party", cat: "makeup", name: "Party Makeup & Hair", price: 9500, mins: 90, img: "s-party", note: "Makeup, hairstyle and lashes", featured: true,
    items: [["Party makeup", 9500], ["Party makeup + hairstyle", 13500], ["Hairstyle only", 4500], ["Hijab styling", 2500]] },
  { id: "facial", cat: "skin", name: "Facials", price: 5500, mins: 75, img: "s-facial", note: "With head and shoulder massage", featured: true,
    items: [["Express glow facial", 3500], ["Hydra facial", 8500], ["Whitening facial", 5500], ["Bridal glow (3 sittings)", 18000]] },
  { id: "nails", cat: "hands", name: "Mani-Pedi & Nails", price: 4000, mins: 75, img: "s-nails", note: "Classic, gel and nail art",
    items: [["Classic mani-pedi", 4000], ["Gel polish (hands)", 3000], ["Acrylic extensions", 6500], ["Paraffin hand treatment", 2500]] },
  { id: "mehndi", cat: "hands", name: "Mehndi", price: 3500, mins: 90, img: "s-mehndi", note: "Organic henna, Arabic & bridal designs",
    items: [["Simple (both hands)", 2000], ["Arabic design", 3500], ["Bridal hands & feet", 15000], ["Guest mehndi (per person)", 1500]] },
];

export const BRIDAL = [
  { id: "silver", name: "Nikah & Mehndi", price: 45000, items: ["Nikah or mehndi makeup", "Hairstyle & dupatta setting", "Lashes and jewellery setting", "Express glow facial a week before"] },
  { id: "gold", name: "Barat Signature", price: 75000, best: true, items: ["Signature barat makeup by our senior artist", "Hairstyle, dupatta & jewellery setting", "Trial session included", "Hydra facial + mani-pedi before the day", "Touch-up kit to take home"] },
  { id: "diamond", name: "Full Wedding (3 days)", price: 160000, items: ["Mehndi, barat and walima looks", "Two trial sessions", "Bridal glow facial (3 sittings)", "Bridal mehndi hands & feet", "On-location service available"] },
];

export const STYLISTS = [
  { id: "st-1", name: "Saba Naveed", role: "Creative Director", skill: "Bridal & editorial makeup" },
  { id: "st-2", name: "Ayesha Tariq", role: "Senior Makeup Artist", skill: "Barat & walima looks" },
  { id: "st-3", name: "Hina Rashid", role: "Hair Colour Expert", skill: "Balayage & highlights" },
  { id: "st-4", name: "Rabia Khan", role: "Senior Stylist", skill: "Cuts, keratin & rebonding" },
  { id: "st-5", name: "Amna Yousaf", role: "Skin Specialist", skill: "Facials & hydra facials" },
  { id: "st-6", name: "Mehwish Ali", role: "Mehndi & Nail Artist", skill: "Bridal mehndi & nail art" },
];

export const REVIEWS = [
  ["Sana R.", "My barat look was exactly what I showed them, and it stayed perfect till rukhsati.", 5],
  ["Fatima K.", "Best keratin in Lahore. Four months later my hair is still smooth.", 5],
  ["Mahnoor A.", "Hina apa did my balayage and everyone keeps asking where I got it done.", 5],
  ["Iqra S.", "Very hygienic, on time, and the staff is so polite. The hydra facial is worth it.", 5],
  ["Zara M.", "Booked party makeup for my sister's mehndi. Natural, glowing, not cakey at all.", 4],
  ["Hira B.", "Mehndi design for my wedding was beautiful and the colour came out so dark!", 5],
];

export const FAQ = [
  ["Do I need to book in advance?", "Yes, especially for weekends and bridal dates. Book online or on WhatsApp to keep your preferred stylist and time slot."],
  ["Is this a ladies-only salon?", "Yes. Zeenat is a ladies-only salon with an all-female team, so you can relax completely."],
  ["How early should I book my bridal makeup?", "Two to three months before the wedding, and book a trial session about two weeks before your event."],
  ["What products do you use?", "Professional brands such as MAC, Huda Beauty, Kryolan and L'Oréal Professionnel, plus organic henna for mehndi."],
  ["Do you offer home or venue service?", "Yes, for bridal and party bookings in Lahore. A travel charge applies depending on the area."],
];

export const img = (n) => `assets/img/${n}.webp`;
export const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");
export const serviceById = (id) => SERVICES.find((s) => s.id === id);
