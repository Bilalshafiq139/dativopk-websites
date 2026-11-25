// Sample booking requests for demos. Dates are generated relative to "today" so the dashboard always looks alive.
// Self-contained on purpose: the API container uses this file too.
const FIRST = ["Ali", "Fatima", "Usman", "Ayesha", "Bilal", "Hira", "Hamza", "Zainab", "Omar", "Maryam", "Saad", "Iqra", "Danish", "Mahnoor", "Fahad", "Sana", "Kashif", "Noor", "Asad", "Rabia", "Talha", "Amna", "Hassan", "Mehwish", "Zara", "Waleed"];
const LAST = ["Khan", "Ahmed", "Malik", "Butt", "Chaudhry", "Sheikh", "Qureshi", "Raza", "Javed", "Iqbal", "Hussain", "Mirza", "Siddiqui", "Bhatti"];
const COMBOS = [
  ["Mehndi / Mayun", "Barat", "Walima"], ["Mehndi / Mayun", "Barat", "Walima"], ["Barat", "Walima"], ["Barat", "Walima"],
  ["Nikkah", "Walima"], ["Mehndi / Mayun", "Barat", "Nikkah", "Walima"], ["Barat"], ["Walima"], ["Nikkah"],
  ["Bridal shoot"], ["Pre-wedding"], ["Engagement / Mangni"], ["Aqiqa / Birthday"], ["Corporate event"],
];
const PRICE = { "Mehndi / Mayun": 85000, Barat: 120000, Nikkah: 60000, Walima: 110000, "Bridal shoot": 45000, "Pre-wedding": 55000, "Engagement / Mangni": 70000, "Aqiqa / Birthday": 35000, "Corporate event": 60000 };
const CITIES = ["Lahore", "Lahore", "Lahore", "Lahore", "Islamabad & Rawalpindi", "Islamabad & Rawalpindi", "Karachi", "Faisalabad", "Sialkot & Gujranwala", "Multan"];
const VENUES = {
  Lahore: ["Royal Palm", "Nishat Hotel", "Pearl Continental", "Falettis Hotel", "DHA farmhouse", "Bahria Town marquee", "Lahore Gymkhana", "Home, Model Town"],
  "Islamabad & Rawalpindi": ["Islamabad Club", "Serena Hotel", "Marquee, Bahria Enclave"],
  Karachi: ["Marriott", "Defence farmhouse", "Movenpick"],
  Faisalabad: ["Serena Faisalabad", "Canal Road marquee"],
  "Sialkot & Gujranwala": ["Cantt marquee", "Home"],
  Multan: ["Ramada Multan", "Home"],
};
const BUDGETS = ["Under Rs 1,50,000", "Rs 1,50,000 to 3,00,000", "Rs 3,00,000 to 6,00,000", "Rs 6,00,000 to 10,00,000", "Rs 10,00,000+", "Not sure yet"];
const SOURCES = ["Instagram", "Instagram", "Instagram", "Friend or family", "Friend or family", "Google", "Facebook", "TikTok", "Wedding planner"];
const MSG = [
  "Ladies-only Mehndi, need a woman photographer please.",
  "Approx 600 guests on Barat. Want drone for the arrival.",
  "Album for parents too. Can we visit the studio this weekend?",
  "Destination Nikkah, dates not fully fixed yet.",
  "We liked the Hira & Saad film, want something similar.",
  "Need same-day edit for Walima if possible.",
  "Small family event, mostly candid photos.",
  "Can you share the Signature package details on WhatsApp?",
  "",
];
export const STATUSES = ["new", "quoted", "booked", "completed", "declined"];

export function makeSeed(n = 48) {
  let s = 11;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = 0; i < n; i++) {
    const events = pick(COMBOS);
    const city = pick(CITIES);
    const shoot = new Date(today);
    shoot.setDate(shoot.getDate() + Math.round(rnd() * 100) - 35);
    const created = new Date(Math.min(Date.now(), shoot.getTime() - (5 + Math.floor(rnd() * 60)) * 864e5));
    created.setHours(10 + Math.floor(rnd() * 12), Math.floor(rnd() * 60));
    if (i < 5) created.setTime(Date.now() - (0.4 + rnd() * 40) * 3600e3);
    if (created.getTime() > Date.now()) created.setTime(Date.now() - (1 + rnd() * 30) * 3600e3);
    const past = shoot < today;
    let status;
    if (i < 5) status = "new";
    else if (past) status = rnd() < .8 ? "completed" : "declined";
    else status = rnd() < .5 ? "booked" : rnd() < .6 ? "quoted" : "new";
    const base = events.reduce((t, e) => t + PRICE[e], 0) * (events.length > 2 ? 1.4 : 1.15);
    const travel = { Lahore: 0, "Islamabad & Rawalpindi": 35000, Karachi: 75000, Faisalabad: 20000, "Sialkot & Gujranwala": 20000, Multan: 40000 }[city];
    const quote = status === "new" ? 0 : Math.round((base * (0.9 + rnd() * 0.5) + travel) / 5000) * 5000;
    const advance = status === "booked" ? Math.round(quote * (rnd() < .7 ? .3 : .5) / 1000) * 1000 : status === "completed" ? quote : 0;
    const name = pick(FIRST) + " " + pick(LAST);
    const pkg = events.length >= 3 ? (rnd() < .6 ? "Signature" : "Shahi") : events.length === 2 ? (rnd() < .6 ? "Classic" : "Custom") : "Custom";
    out.push({
      id: "seed-" + i, name,
      phone: "+92 3" + String(Math.floor(rnd() * 1e9)).padStart(9, "0").replace(/(\d{2})(\d{7})/, "$1 $2"),
      email: rnd() < .5 ? name.toLowerCase().replace(" ", ".") + "@gmail.com" : "",
      type: events.join(", "), date: iso(shoot), city, venue: pick(VENUES[city]),
      guests: events[0] === "Corporate event" ? 250 : Math.round((150 + rnd() * 750) / 50) * 50,
      package: pkg, budget: pick(BUDGETS), source: pick(SOURCES), message: pick(MSG),
      quote, advance, notes: status === "booked" ? (advance >= quote * .5 ? "50% received via bank transfer" : "30% advance received on JazzCash") : "",
      status, createdAt: created.toISOString(),
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
