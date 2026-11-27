// Sample trials, sign-ups and messages for the admin panel (API and demo mode). Names and numbers are placeholders.
export const STATUSES = {
  trials: ["new", "confirmed", "attended", "joined", "no-show", "cancelled"],
  joins: ["new", "paid", "active", "frozen", "cancelled"],
  messages: ["new", "replied", "closed"],
};
export const MSG_STATUSES = STATUSES.messages;
const day = 864e5;
const iso = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
const dstr = (offset) => { const x = new Date(Date.now() + offset * day); return x.toISOString().slice(0, 10); };
export function makeSeed() {
  const trials = [
    ["TR-148", 0, "Hamza Tariq", "0300 4455112", "Lose weight", "strength", 1, "05:00", "new"],
    ["TR-147", 0, "Ayesha Noor", "0321 7788123", "Get stronger", "ladies", 1, "11:00", "new"],
    ["TR-146", 1, "Fahad Ali", "0333 1200456", "Train for an event", "conditioning", 2, "18:00", "confirmed"],
    ["TR-145", 1, "Mahnoor Rizvi", "0345 9087654", "Fix back pain", "mobility", 2, "21:00", "confirmed"],
    ["TR-144", 3, "Usman Butt", "0301 5566778", "Lose weight", "strength", -1, "05:00", "joined"],
    ["TR-143", 4, "Sana Iqbal", "0322 3344556", "Get stronger", "climb", -2, "19:30", "attended"],
    ["TR-142", 5, "Kamran Shah", "0300 1122990", "Get stronger", "strength", -3, "18:00", "no-show"],
    ["TR-141", 6, "Zara Ahmed", "0331 6677889", "Feel better", "ladies", -4, "11:00", "joined"],
  ].map(([id, d, name, phone, goal, program, off, time, status]) => ({ id, createdAt: iso(d), name, phone, goal, program, date: dstr(off), time, status, notes: "" }));
  const joins = [
    ["MB-212", 0, "Usman Butt", "0301 5566778", "monthly", "Cash at the desk", "new"],
    ["MB-211", 1, "Zara Ahmed", "0331 6677889", "quarter", "Bank transfer", "paid"],
    ["MB-210", 3, "Omar Farooq", "0302 8899001", "annual", "Card", "active"],
    ["MB-209", 6, "Hira Saleem", "0315 4433221", "monthly", "Cash at the desk", "active"],
    ["MB-208", 9, "Bilal Hassan", "0345 2211334", "monthly", "JazzCash", "frozen"],
  ].map(([id, d, name, phone, plan, payment, status]) => ({ id, createdAt: iso(d), name, phone, plan, payment, status, notes: "" }));
  const messages = [
    { id: "MS-104", createdAt: iso(0, 10), name: "Rabia K.", phone: "0300 1110022", topic: "Ladies timing", message: "Is the 11 am ladies class taught by a female coach? Can I bring my sister?", status: "new" },
    { id: "MS-103", createdAt: iso(1), name: "Adeel M.", phone: "0333 5544332", topic: "Corporate", message: "We want memberships for 15 staff from our office in Kot Lakhpat. Any company rate?", status: "new" },
    { id: "MS-102", createdAt: iso(3), name: "Saad R.", phone: "", topic: "Personal training", message: "Do you do 1-to-1 sessions at 4:30 am? I work early.", status: "replied" },
  ];
  return { trials, joins, messages };
}
