// Sample enrollments so the admin panel never looks empty in a demo.
// Used by the API on first start, and by the browser "demo mode" when no API is running.
const FIRST = ["Ali", "Ayesha", "Hamza", "Fatima", "Usman", "Zainab", "Bilal", "Hira", "Ahmed", "Maryam", "Saad", "Iqra", "Hassan", "Sana", "Omer", "Areeba", "Danish", "Mahnoor", "Fahad", "Noor", "Taha", "Amna", "Rehan", "Kinza", "Shahzaib", "Laiba", "Waqas", "Eman"];
const LAST = ["Khan", "Ahmed", "Malik", "Raza", "Shah", "Iqbal", "Butt", "Chaudhry", "Qureshi", "Siddiqui", "Hussain", "Javed", "Aslam", "Mirza"];
const COURSES = ["data-analytics", "machine-learning", "meta-ads", "google-ads", "ui-ux-design", "artificial-intelligence"];
const TIMINGS = ["Weekend", "Weekday evening", "Self-paced"];
const STATUSES = ["new", "new", "contacted", "contacted", "enrolled", "enrolled", "enrolled", "not-interested"];
const MESSAGES = [
  "I am a fresh graduate and want to start freelancing.",
  "Is there an installment option?",
  "I work 9 to 5, can I manage weekend classes?",
  "Want to switch my career to tech.",
  "Running a small business, need to learn ads for my brand.",
  "",
  "Do you give job placement help?",
  "Already know some Python, which batch is best for me?",
  "",
];

export function makeSeed(now = Date.now()) {
  let s = 42;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const list = [];
  for (let i = 0; i < 28; i++) {
    const first = FIRST[i % FIRST.length];
    const last = pick(LAST);
    const created = now - Math.floor(rnd() * 30 * 24 * 3600 * 1000);
    list.push({
      id: "seed-" + (i + 1),
      name: `${first} ${last}`,
      phone: "03" + String(Math.floor(rnd() * 1e9)).padStart(9, "0"),
      email: `${first}.${last}${Math.floor(rnd() * 90 + 10)}@gmail.com`.toLowerCase(),
      course: pick(COURSES),
      timing: pick(TIMINGS),
      message: pick(MESSAGES),
      status: pick(STATUSES),
      createdAt: new Date(created).toISOString(),
    });
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
