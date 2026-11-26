// Sample appointments and call-back requests for the admin panel (placeholders).
export const APPT_STATUSES = ["new", "confirmed", "completed", "no-show", "cancelled"];
export const MSG_STATUSES = ["new", "called", "closed"];
const day = 864e5;
const at = (d, h, m = 0) => { const x = new Date(Date.now() + d * day); x.setHours(h, m, 0, 0); return x.toISOString(); };
let n = 860;
const a = (created, when, service, sub, stylist, name, phone, status, price, extra = {}) =>
  ({ id: "ZS-" + n--, createdAt: at(created, 11), date: when, service, sub, stylist, name, phone, status, price, notes: extra.notes || "", message: extra.message || "" });
export function makeSeed() {
  return {
    appointments: [
      a(0, at(0, 16), "colour", "Balayage / ombre", "Hina Rashid", "Mahnoor Aslam", "0300 4455112", "confirmed", 22000),
      a(0, at(0, 18, 30), "party", "Party makeup + hairstyle", "Ayesha Tariq", "Zoya Iqbal", "0321 7788123", "new", 13500, { message: "Mehndi function at 8pm." }),
      a(0, at(1, 12), "keratin", "Keratin (long hair)", "Rabia Khan", "Sidra Malik", "0333 1200456", "new", 26000),
      a(-1, at(1, 15), "facial", "Hydra facial", "Amna Yousaf", "Iqra Nadeem", "0345 9087654", "confirmed", 8500),
      a(-2, at(2, 7), "bridal", "Barat (signature)", "Saba Naveed", "Hania Sheikh", "0301 5566778", "confirmed", 55000, { notes: "Trial done. Red lehnga, gold jewellery." }),
      a(-2, at(3, 14), "mehndi", "Bridal hands & feet", "Mehwish Ali", "Hania Sheikh", "0301 5566778", "confirmed", 15000),
      a(-3, at(-1, 13), "cut", "Layer / step cut", "Rabia Khan", "Ayesha Khan", "0322 3344556", "completed", 3500),
      a(-4, at(-2, 17), "nails", "Acrylic extensions", "Mehwish Ali", "Komal Aziz", "0300 1122990", "completed", 6500),
      a(-5, at(-3, 12), "colour", "Root touch-up", "Hina Rashid", "Saima Tariq", "0331 6677889", "no-show", 6000),
      a(-6, at(-4, 16), "party", "Party makeup", "Ayesha Tariq", "Nimra Hassan", "0302 8899001", "completed", 9500),
      a(-8, at(-6, 11), "facial", "Whitening facial", "Amna Yousaf", "Laiba Qureshi", "0315 4433221", "completed", 5500),
      a(-9, at(-7, 15), "keratin", "Protein treatment", "Rabia Khan", "Rabia Shah", "0345 2211334", "cancelled", 12000),
    ],
    messages: [
      { id: "m3", createdAt: at(0, 10), name: "Sana Rehman", phone: "0300 1110022", topic: "Bridal package", message: "Wedding on 14 Feb. Please call about the full wedding package.", status: "new" },
      { id: "m2", createdAt: at(-1, 15), name: "Fiza Ali", phone: "0333 7654321", topic: "Hair colour", message: "Which colour suits brown skin? I want ash brown.", status: "called" },
      { id: "m1", createdAt: at(-5, 12), name: "Maria K.", phone: "0321 9988776", topic: "Home service", message: "Do you come to DHA Phase 6 for party makeup?", status: "closed" },
    ],
  };
}
