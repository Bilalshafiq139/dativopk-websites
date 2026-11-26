// Sample booking requests and messages for the admin panel (placeholders).
export const BOOK_STATUSES = ["new", "called", "site visit", "token paid", "booked", "cancelled"];
export const MSG_STATUSES = ["new", "replied", "closed"];
const day = 864e5;
const ago = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
let n = 520;
const b = (d, plot, size, name, phone, plan, status, extra = {}) => ({ id: "IV-" + n--, createdAt: ago(d, extra.h || 12), plot, size, name, phone, city: extra.city || "Faisalabad", plan, visit: extra.visit || "", message: extra.message || "", status, notes: extra.notes || "" });
export function makeSeed() {
  return {
    bookings: [
      b(0, "C-004", 5, "Muhammad Asif", "0300 7766554", "1.5 year installments", "new", { h: 15, message: "Is this plot near the park?" }),
      b(0, "C-017", 3, "Rubina Kausar", "0321 6655443", "1.5 year installments", "new", { h: 11, visit: "Saturday" }),
      b(1, "C-009", 7, "Haji Abdul Rehman", "0333 5544332", "Full payment", "site visit", { visit: "Sunday 11am" }),
      b(2, "A-006", 10, "Zeeshan Akram", "0345 4433221", "Full payment", "token paid", { notes: "Token Rs 2 lakh received." }),
      b(3, "C-021", 5, "Nabeel Anwar (Dubai)", "+971 50 000 0000", "1.5 year installments", "called", { city: "Dubai" }),
      b(5, "M-002", 3, "Tariq Traders", "0301 3322110", "Full payment", "booked", { notes: "Shop for grocery store." }),
      b(8, "B-011", 7, "Saima Bibi", "0302 2211009", "1.5 year installments", "booked"),
      b(12, "C-030", 3, "Imran Ali", "0315 1100998", "1.5 year installments", "cancelled", { notes: "Budget issue." }),
    ],
    messages: [
      { id: "m2", createdAt: ago(0, 10), name: "Kashif M.", email: "kashif@example.com", phone: "0300 1112223", topic: "NOC / approval", message: "Is Ismail Valley approved by FDA? Please share the NOC number.", status: "new" },
      { id: "m1", createdAt: ago(3), name: "Amna S.", email: "amna@example.com", phone: "", topic: "Construction", message: "Can we start construction in Block B now?", status: "replied" },
    ],
    plots: {},
  };
}
