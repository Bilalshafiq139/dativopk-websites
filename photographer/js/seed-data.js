// Sample photoshoot enquiries for demos. Dates are generated relative to "today" so the dashboard always looks alive.
// Self-contained on purpose: the API container uses this file too.
const FIRST = ["Ali", "Fatima", "Usman", "Ayesha", "Bilal", "Hira", "Hamza", "Zainab", "Omar", "Maryam", "Saad", "Iqra", "Danish", "Mahnoor", "Fahad", "Sana", "Kashif", "Noor", "Asad", "Rabia", "Talha", "Amna", "Hassan", "Mehwish"];
const LAST = ["Khan", "Ahmed", "Malik", "Butt", "Chaudhry", "Sheikh", "Qureshi", "Raza", "Javed", "Iqbal", "Hussain", "Mirza"];
const TYPES = ["Portrait session", "Portrait session", "Wedding / Mehndi / Valima", "Wedding / Mehndi / Valima", "Pre-wedding / couple", "Fashion & editorial", "Product & commercial", "Product & commercial", "Event"];
const PLACES = ["Studio, DHA", "Studio, DHA", "Gulberg, Lahore", "Johar Town", "Nishat Hotel", "Pearl Continental", "Bagh-e-Jinnah", "Lake City", "Islamabad", "Bahria Town", "Walled City", "Model Town"];
const BUDGETS = ["Under PKR 50,000", "PKR 50,000 to 150,000", "PKR 150,000 to 300,000", "PKR 300,000+", "Not sure yet"];
const SOURCES = ["Instagram", "Instagram", "Instagram", "Friend or family", "Google", "Facebook", "WhatsApp"];
const MSG = {
  "Portrait session": ["Birthday shoot for my 30th, want something moody.", "Need professional headshots for LinkedIn.", "Graduation portraits with my parents.", "Maternity shoot, around 32 weeks."],
  "Wedding / Mehndi / Valima": ["Mehndi and Baraat, around 400 guests each.", "Only Nikkah and Valima, small family event.", "Three events, need photos and a highlight film.", "Destination wedding in Islamabad, two days."],
  "Pre-wedding / couple": ["Pre-wedding shoot, we like golden hour and old buildings.", "Engagement shoot, want it to feel natural."],
  "Fashion & editorial": ["Eid lawn collection lookbook, 12 outfits.", "Campaign for a new jewellery line.", "Bridal couture shoot with 2 models."],
  "Product & commercial": ["40 product photos for our skincare store.", "Menu photos for a new cafe in Gulberg.", "Shoes on colour backgrounds for Instagram ads.", "Perfume bottles, need hero shots for the website."],
  "Event": ["Company annual dinner, 3 hours.", "Book launch at a cafe, 2 hours."],
};
const PRICE = { "Portrait session": [25000, 40000], "Wedding / Mehndi / Valima": [180000, 450000], "Pre-wedding / couple": [45000, 70000], "Fashion & editorial": [60000, 140000], "Product & commercial": [35000, 120000], "Event": [40000, 80000] };
export const STATUSES = ["new", "quoted", "booked", "completed", "declined"];

export function makeSeed(n = 46) {
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = 0; i < n; i++) {
    const type = pick(TYPES);
    const shoot = new Date(today);
    shoot.setDate(shoot.getDate() + Math.round(rnd() * 80) - 30);
    const created = new Date(Math.min(Date.now(), shoot.getTime() - (3 + Math.floor(rnd() * 40)) * 864e5));
    created.setHours(9 + Math.floor(rnd() * 13), Math.floor(rnd() * 60));
    if (i < 5) created.setTime(Date.now() - (0.5 + rnd() * 40) * 3600e3);
    if (created.getTime() > Date.now()) created.setTime(Date.now() - (1 + rnd() * 30) * 3600e3);
    const past = shoot < today;
    let status;
    if (i < 5) status = "new";
    else if (past) status = rnd() < .78 ? "completed" : "declined";
    else status = rnd() < .5 ? "booked" : rnd() < .6 ? "quoted" : "new";
    const [lo, hi] = PRICE[type];
    const quote = status === "new" ? 0 : Math.round((lo + rnd() * (hi - lo)) / 5000) * 5000;
    const name = pick(FIRST) + " " + pick(LAST);
    out.push({
      id: "seed-" + i, name,
      phone: "+92 3" + String(Math.floor(rnd() * 1e9)).padStart(9, "0").replace(/(\d{2})(\d{7})/, "$1 $2"),
      email: rnd() < .6 ? name.toLowerCase().replace(" ", ".") + "@gmail.com" : "",
      type, date: iso(shoot), location: type === "Product & commercial" ? "Studio, DHA" : pick(PLACES),
      budget: pick(BUDGETS), source: pick(SOURCES), message: pick(MSG[type]),
      quote, notes: status === "booked" ? "Advance received" : "", status, createdAt: created.toISOString(),
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
