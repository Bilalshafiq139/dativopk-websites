// Sample enquiries and enrolments for demos. Dates are relative to "today" so the admin panel always looks alive.
const FIRST = ["Ali", "Fatima", "Usman", "Ayesha", "Hira", "Hamza", "Zainab", "Omar", "Maryam", "Saad", "Iqra", "Danish", "Mahnoor", "Fahad", "Sana", "Kashif", "Noor", "Asad", "Rabia", "Talha", "Amna", "Hassan", "Mehwish", "Areeb"];
const LAST = ["Khan", "Ahmed", "Malik", "Butt", "Chaudhry", "Sheikh", "Qureshi", "Raza", "Javed", "Iqbal", "Hussain", "Mirza"];
const PLANS = ["cohort", "cohort", "cohort", "self", "self", "team"];
const COURSES = ["excel", "excel", "excel", "analytics", "analytics", "ml", "ads", "ads"];
const BATCH = { cohort: ["jan-weekend", "jan-weekend", "jan-evening"], self: ["self-paced"], team: [""] };
const LEVEL = ["Beginner", "Uses basic formulas", "Uses basic formulas", "Uses VLOOKUP & pivots", "Advanced"];
const ROLE = ["Accounts officer", "Sales coordinator", "Student, BBA", "Supply chain analyst", "HR executive", "Business owner", "Fresh graduate", "Finance associate", "Marketing executive"];
const NOTES = ["", "", "", "Wants instalments", "Asked about Mac support", "Company may sponsor", "Called twice, prefers WhatsApp", "Needs invoice for office", ""];
const STATUS = ["new", "new", "contacted", "contacted", "enrolled", "paid", "paid", "paid", "dropped"];

export function makeSeed(n = 38) {
  let s = 9;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(); d.setHours(9 + Math.floor(rnd() * 12), Math.floor(rnd() * 60), 0, 0);
    d.setDate(d.getDate() - Math.floor(Math.pow(rnd(), 1.4) * 40));
    const plan = pick(PLANS), name = pick(FIRST) + " " + pick(LAST);
    const contact = rnd() < .22;
    const age = (Date.now() - d.getTime()) / 864e5;
    let status = pick(STATUS); if (age < 2) status = rnd() < .7 ? "new" : "contacted";
    out.push({
      id: "seed-" + i, source: contact ? "contact" : "enroll", course: pick(COURSES), name,
      phone: "+92 3" + String(Math.floor(rnd() * 1e9)).padStart(9, "0").replace(/(\d{2})(\d{7})/, "$1 $2"),
      email: name.toLowerCase().replace(" ", ".") + (rnd() < .6 ? "@gmail.com" : "@outlook.com"),
      plan: contact ? "" : plan, batch: contact ? "" : pick(BATCH[plan]), level: pick(LEVEL), role: pick(ROLE),
      message: contact ? pick(["Is there a weekend batch in Karachi?", "Can you train our finance team of 12?", "Is the ML course OK without a CS degree?", "What is the fee for students?"]) : "",
      notes: pick(NOTES), status: contact && status === "paid" ? "contacted" : status, createdAt: d.toISOString(),
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
