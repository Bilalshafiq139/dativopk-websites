// Content for "Fajr Athletic Club" (placeholder brand: strength & conditioning gym, Lahore).
// All photos are one Pexels shoot of the same misty warehouse gym, so the film story stays consistent.
export const CLUB = {
  name: "Fajr",
  full: "Fajr Athletic Club",
  tagline: "Your first chapter starts at 5.",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "hello@fajr.example",
  address: "Warehouse 7, Industrial Estate, Kot Lakhpat, Lahore",
  hours: [["Mon to Sat", "5:00 am to 11:00 pm"], ["Sunday", "7:00 am to 2:00 pm"], ["Ladies only", "Daily 11:00 am to 2:00 pm"]],
  map: "https://www.google.com/maps?q=Kot+Lakhpat+Industrial+Estate+Lahore&output=embed",
};

// The film on the home page. time = clock shown top-left. sub = subtitle lines.
export const CHAPTERS = [
  { n: "01", title: "The arrival", time: "05:02", img: "lockers-w", pos: "50% 50%", sub: ["Nobody is watching.", "That's the point."] },
  { n: "02", title: "Warm-up", time: "05:10", img: "rope-feet", pos: "50% 60%", sub: ["Two hundred skips.", "Breath finds its rhythm."] },
  { n: "03", title: "The grind", time: "05:24", img: "ropes", pos: "50% 45%", sub: ["Thirty seconds on. Ten off.", "Again. And again."] },
  { n: "04", title: "The climb", time: "05:41", img: "pullup", pos: "50% 35%", sub: ["The bar doesn't care how you feel.", "You go up anyway."] },
  { n: "05", title: "Breaking point", time: "05:58", img: "tired", pos: "45% 50%", sub: ["This is where most people stop.", "This is where you begin."] },
  { n: "06", title: "Stillness", time: "06:15", img: "bench", pos: "50% 50%", sub: ["Heart rate falls.", "Something in you doesn't."] },
  { n: "07", title: "First light", time: "06:30", img: "empty", pos: "50% 50%", sub: ["Lahore is waking up.", "You already won the day."] },
];

export const PROGRAMS = [
  { id: "strength", name: "Strength", img: "bar-hands", len: "60 min", level: "All levels", text: "Barbell basics done properly: squat, press, deadlift. Small groups, coached every rep, tracked every week." },
  { id: "conditioning", name: "Conditioning", img: "bike", len: "45 min", level: "Intermediate", text: "Air bikes, battle ropes and sleds in timed intervals. Short, brutal, and the fastest way to get fit." },
  { id: "climb", name: "Bodyweight & Climb", img: "climb", len: "50 min", level: "All levels", text: "Rope, rings and pull-up bar. From your first dead hang to your first muscle-up." },
  { id: "mobility", name: "Mobility & Recovery", img: "stretch", len: "40 min", level: "Everyone", text: "Stretching, breath work and soft-tissue work. The session that keeps the other five possible." },
  { id: "ladies", name: "Ladies Strength", img: "skipping-w", len: "60 min", level: "All levels", text: "Women-only strength and conditioning with female coaches, daily 11 am to 2 pm." },
  { id: "pt", name: "1-to-1 Coaching", img: "massage", len: "60 min", level: "Personal", text: "A coach, a plan written for you, nutrition guidance and a check-in every week on WhatsApp." },
];

export const COACHES = [
  { id: "amir", name: "Amir Siddiqui", role: "Head coach · Strength", img: "p-amir", years: 11, quote: "Show up at five, and the rest of the day can't beat you." },
  { id: "sara", name: "Sara Malik", role: "Ladies programme lead", img: "p-sara", years: 7, quote: "Strong is a skill. We practise it daily." },
  { id: "zain", name: "Zain Ahmed", role: "Conditioning", img: "p-zain", years: 6, quote: "Breathe. Then go one more round." },
  { id: "hina", name: "Hina Qureshi", role: "Mobility & recovery", img: "p-hina", years: 9, quote: "Recovery is training too." },
  { id: "bilal", name: "Bilal Raza", role: "Bodyweight & climb", img: "p-bilal", years: 5, quote: "First the hang. Then the pull. Then the climb." },
  { id: "maya", name: "Maya Khan", role: "1-to-1 coach · Nutrition", img: "p-maya", years: 8, quote: "Small habits, every single day." },
];

// Membership "tickets"
export const PLANS = [
  { id: "day", name: "Day pass", price: 1500, per: "one day", perks: ["Open gym and any class", "Towel and locker"], tag: "" },
  { id: "monthly", name: "Monthly", price: 12000, per: "month", perks: ["Unlimited classes", "Open gym 5 am to 11 pm", "Monthly body scan"], tag: "Most chosen" },
  { id: "quarter", name: "Quarterly", price: 32000, per: "3 months", perks: ["Everything in Monthly", "1 personal session a month", "Fajr T-shirt"], tag: "Save Rs 4,000" },
  { id: "annual", name: "Annual", price: 110000, per: "year", perks: ["Everything in Quarterly", "2 freeze months", "Bring a friend free on Sundays"], tag: "Best value" },
];

// weekly timetable: day -> list of [time, programId, coachId]
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const SCHEDULE = {
  Mon: [["05:00", "strength", "amir"], ["06:15", "conditioning", "zain"], ["11:00", "ladies", "sara"], ["18:00", "strength", "amir"], ["19:30", "climb", "bilal"], ["21:00", "mobility", "hina"]],
  Tue: [["05:00", "conditioning", "zain"], ["06:15", "climb", "bilal"], ["11:00", "ladies", "sara"], ["18:00", "conditioning", "zain"], ["19:30", "strength", "amir"], ["21:00", "mobility", "hina"]],
  Wed: [["05:00", "strength", "amir"], ["06:15", "mobility", "hina"], ["11:00", "ladies", "sara"], ["18:00", "climb", "bilal"], ["19:30", "conditioning", "zain"]],
  Thu: [["05:00", "conditioning", "zain"], ["06:15", "strength", "amir"], ["11:00", "ladies", "sara"], ["18:00", "strength", "amir"], ["19:30", "climb", "bilal"], ["21:00", "mobility", "hina"]],
  Fri: [["05:00", "strength", "amir"], ["06:15", "conditioning", "zain"], ["11:00", "ladies", "sara"], ["17:00", "conditioning", "zain"], ["18:30", "mobility", "hina"]],
  Sat: [["07:00", "strength", "amir"], ["08:30", "climb", "bilal"], ["11:00", "ladies", "sara"], ["17:00", "conditioning", "zain"]],
  Sun: [["08:00", "mobility", "hina"], ["09:30", "conditioning", "zain"], ["11:00", "ladies", "sara"]],
};

export const STORIES = [
  { name: "Usman, 34", text: "Lost 14 kg in five months. The 5 am class is the only meeting I have never missed.", stat: "−14 kg" },
  { name: "Ayesha, 27", text: "First pull-up at 26. Now I climb the rope. The ladies' slot made it easy to start.", stat: "1st pull-up" },
  { name: "Kamran, 41", text: "My back pain is gone. Amir fixed my deadlift in the first week.", stat: "140 kg deadlift" },
];

export const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");
export const programById = (id) => PROGRAMS.find((p) => p.id === id);
export const coachById = (id) => COACHES.find((c) => c.id === id);
