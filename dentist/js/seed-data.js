// Sample appointments for demos. Dates are generated relative to "today" so the dashboard always looks alive.
const FIRST = ["Ali", "Fatima", "Usman", "Ayesha", "Bilal", "Hira", "Hamza", "Zainab", "Omar", "Maryam", "Saad", "Iqra", "Danish", "Mahnoor", "Fahad", "Sana", "Kashif", "Noor", "Asad", "Rabia", "Talha", "Amna", "Hassan", "Mehwish"];
const LAST = ["Khan", "Ahmed", "Malik", "Butt", "Chaudhry", "Sheikh", "Qureshi", "Raza", "Javed", "Iqbal", "Hussain", "Mirza"];
const TREAT = ["Check-up & cleaning", "Check-up & cleaning", "Check-up & cleaning", "Teeth whitening", "Clear aligners", "Dental implants", "Root canal treatment", "Root canal treatment", "Veneers & smile design", "Tooth pain / emergency"];
const DOCS = ["Dr. Ayesha Malik", "Dr. Hamza Qureshi", "Dr. Sana Javed"];
const TIMES = ["10:00", "10:45", "11:30", "12:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45", "18:30", "19:15"];
const NOTES = ["", "", "", "First visit", "Sensitive tooth on the left side", "Prefers evening", "Nervous patient, please go slow", "Follow-up after scaling", "Wants a quote first", ""];

export function makeSeed(n = 46) {
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const out = [], used = new Set();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; out.length < n && i < n * 6; i++) {
    const off = Math.round(rnd() * 30) - 16 + (i < 6 ? 16 - Math.round(rnd() * 16) + (i < 4 ? -Math.round(rnd() * 0) : 0) : 0);
    const d = new Date(today); d.setDate(d.getDate() + (i < 5 ? 0 : off));
    if (d.getDay() === 0) continue;
    let time = pick(TIMES); if (d.getDay() === 6 && time >= "16:00") time = "11:30";
    const doctor = pick(DOCS), key = iso(d) + time + doctor;
    if (used.has(key)) continue; used.add(key);
    const now = new Date(), nowHM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const past = d < today || (d.getTime() === today.getTime() && time < nowHM);
    const status = past ? (rnd() < .78 ? "completed" : rnd() < .5 ? "no-show" : "cancelled") : d.getTime() === today.getTime() ? (rnd() < .75 ? "confirmed" : "pending") : (rnd() < .55 ? "confirmed" : "pending");
    const name = pick(FIRST) + " " + pick(LAST);
    const created = new Date(d); created.setDate(created.getDate() - 1 - Math.floor(rnd() * 9)); created.setHours(9 + Math.floor(rnd() * 11), Math.floor(rnd() * 60));
    out.push({
      id: "seed-" + out.length, name, phone: "+92 3" + String(Math.floor(rnd() * 1e9)).padStart(9, "0").replace(/(\d{2})(\d{7})/, "$1 $2"),
      email: rnd() < .5 ? name.toLowerCase().replace(" ", ".") + "@gmail.com" : "",
      treatment: pick(TREAT), doctor: rnd() < .2 ? "Any" : doctor, date: iso(d), time,
      notes: pick(NOTES), status, createdAt: created.toISOString(),
    });
  }
  return out.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
