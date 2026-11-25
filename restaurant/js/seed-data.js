// Sample reservations for demos. Dates are generated relative to "today" so the dashboard always looks alive.
// Self-contained on purpose: the API container uses this file too.
const FIRST = ["Ali", "Fatima", "Usman", "Ayesha", "Bilal", "Hira", "Hamza", "Zainab", "Omar", "Maryam", "Saad", "Iqra", "Danish", "Mahnoor", "Fahad", "Sana", "Kashif", "Noor", "Asad", "Rabia", "Talha", "Amna", "Hassan", "Mehwish"];
const LAST = ["Khan", "Ahmed", "Malik", "Butt", "Chaudhry", "Sheikh", "Qureshi", "Raza", "Javed", "Iqbal", "Hussain", "Mirza"];
const SLOTS = ["13:00", "13:30", "14:00", "14:30", "15:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];
const AREAS = ["Main dining hall", "Main dining hall", "Main dining hall", "Grill counter", "Terrace", "Terrace", "Private room"];
const OCC = ["", "", "", "", "Birthday", "Anniversary", "Business dinner", "Date night", "Family dinner", "Friday BBQ Night"];
const NOTES = ["", "", "", "", "Window table if possible", "High chair needed", "Nut allergy", "Birthday cake at 9:30, name: Sara", "Prefers quiet corner", "Wheelchair access", "Will pre-order the tomahawk"];
export const STATUSES = ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"];

export function makeSeed(n = 64) {
  let s = 11;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const out = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const now = new Date(), nowHM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + (i < 14 ? 0 : Math.round(rnd() * 24) - 12));
    const time = rnd() < .72 ? pick(SLOTS.slice(5)) : pick(SLOTS.slice(0, 5));
    const past = d < today || (d.getTime() === today.getTime() && time < nowHM);
    const isToday = d.getTime() === today.getTime();
    let status;
    if (past) status = isToday && rnd() < .5 ? "seated" : rnd() < .8 ? "completed" : rnd() < .5 ? "no-show" : "cancelled";
    else status = isToday ? (rnd() < .8 ? "confirmed" : "pending") : rnd() < .55 ? "confirmed" : "pending";
    const name = pick(FIRST) + " " + pick(LAST);
    const guests = pick([2, 2, 2, 3, 4, 4, 4, 5, 6, 8, 10]);
    const created = new Date(d); created.setDate(created.getDate() - 1 - Math.floor(rnd() * 8)); created.setHours(10 + Math.floor(rnd() * 12), Math.floor(rnd() * 60));
    out.push({
      id: "seed-" + i, name,
      phone: "+92 3" + String(Math.floor(rnd() * 1e9)).padStart(9, "0").replace(/(\d{2})(\d{7})/, "$1 $2"),
      email: rnd() < .4 ? name.toLowerCase().replace(" ", ".") + "@gmail.com" : "",
      guests, date: iso(d), time, area: guests >= 10 ? "Private room" : pick(AREAS), occasion: pick(OCC), notes: pick(NOTES),
      table: status === "seated" || status === "completed" ? "T" + (1 + Math.floor(rnd() * 24)) : "",
      status, createdAt: created.toISOString(),
    });
  }
  return out.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
