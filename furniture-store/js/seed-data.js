// Sample orders and messages for the admin panel. Used by the API (Docker) and by demo mode.
// Names and phone numbers are placeholders.
export const STATUSES = ["new", "confirmed", "in workshop", "dispatched", "delivered", "cancelled"];
export const MSG_STATUSES = ["new", "replied", "closed"];

const day = 864e5;
const ago = (d, h = 11) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();

const items = {
  noor: ["Noor", "Lounge chair", 145000],
  saira: ["Saira", "Armchair", 98000],
  reet: ["Reet", "3-seat sofa", 265000],
  gol: ["Gol", "Pouf", 32000],
  chand: ["Chand", "Coffee table", 68000],
  daal: ["Daal", "Dining chair", 28500],
  dastarkhwan: ["Dastarkhwan", "Dining table", 185000],
  neend: ["Neend", "Platform bed", 210000],
  roshan: ["Roshan", "Floor lamp", 24000],
  sandook: ["Sandook", "Sideboard", 142000],
  kaam: ["Kaam", "Writing desk", 76000],
  sirhana: ["Sirhana", "Bedside table", 22000],
};
const add = { oak: 0, sheesham: 0, walnut: 0.15, ebony: 0.08 };
const woodName = { oak: "Natural Oak", sheesham: "Sheesham", walnut: "American Walnut", ebony: "Ebonised Ash" };
const line = (id, wood, qty = 1, fabric = "") => {
  const [name, type, base] = items[id];
  return { id, name, type, wood: woodName[wood], fabric, qty, price: Math.round((base * (1 + add[wood])) / 500) * 500 };
};

function order(no, d, name, city, phone, lines, status, extra = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal >= 150000 ? 0 : 6500;
  const whiteGlove = extra.whiteGlove ? 9500 : 0;
  return {
    id: "LK-" + no, createdAt: ago(d), name, city, phone, email: name.split(" ")[0].toLowerCase() + "@example.com",
    address: extra.address || "House 12, Street 4, " + city, payment: extra.payment || "50% advance (bank transfer)",
    items: lines, subtotal, delivery, whiteGlove, total: subtotal + delivery + whiteGlove, status, notes: extra.notes || "",
  };
}

export function makeSeed() {
  const orders = [
    order(1042, 0, "Sana Javed", "Lahore", "0300 1112233", [line("noor", "walnut", 1, "Sage"), line("gol", "walnut", 1, "Sage")], "new", { whiteGlove: true }),
    order(1041, 1, "Umair Siddiqui", "Karachi", "0321 4455667", [line("dastarkhwan", "sheesham"), line("daal", "sheesham", 6)], "confirmed", { whiteGlove: true }),
    order(1040, 2, "Hira Baig", "Islamabad", "0333 9988776", [line("chand", "oak")], "new", { payment: "Cash on delivery" }),
    order(1039, 3, "Faisal Raza", "Lahore", "0345 2233445", [line("neend", "oak"), line("sirhana", "oak", 2)], "in workshop", { notes: "Needs to come apart for narrow stair." }),
    order(1038, 5, "Mariam Qadir", "Faisalabad", "0301 7788990", [line("reet", "ebony", 1, "Oat Linen")], "in workshop"),
    order(1037, 7, "Bilal Ahmed", "Rawalpindi", "0302 1122334", [line("kaam", "walnut"), line("roshan", "walnut")], "dispatched"),
    order(1036, 9, "Zainab Tariq", "Lahore", "0322 6655443", [line("saira", "sheesham", 2, "Terracotta")], "dispatched"),
    order(1035, 12, "Hassan Malik", "Karachi", "0331 5566778", [line("sandook", "walnut")], "delivered"),
    order(1034, 14, "Amna Sheikh", "Multan", "0300 9090909", [line("noor", "oak", 1, "Ivory Bouclé")], "delivered"),
    order(1033, 17, "Kamran Ali", "Islamabad", "0315 3434343", [line("dastarkhwan", "walnut"), line("daal", "walnut", 4)], "delivered", { whiteGlove: true }),
    order(1032, 20, "Nida Farooq", "Lahore", "0345 8787878", [line("gol", "sheesham", 2, "Haldi")], "cancelled", { notes: "Changed mind on colour, refunded advance." }),
    order(1031, 23, "Usman Chaudhry", "Sialkot", "0333 2121212", [line("neend", "walnut")], "delivered"),
    order(1030, 26, "Rabia Hussain", "Karachi", "0321 6767676", [line("chand", "ebony"), line("roshan", "ebony")], "delivered"),
    order(1029, 29, "Adeel Khan", "Peshawar", "0301 4545454", [line("reet", "oak", 1, "Ivory Bouclé"), line("noor", "oak", 1, "Ivory Bouclé")], "delivered", { whiteGlove: true }),
  ];
  const messages = [
    { id: "m5", createdAt: ago(0, 9), name: "Saad Rehman", email: "saad@example.com", phone: "0300 1231231", topic: "Swatch box", message: "Please send the free swatch box to Bahria Town, Lahore. Want to compare walnut and sheesham.", status: "new" },
    { id: "m4", createdAt: ago(1), name: "Fatima Noor", email: "fatima@example.com", phone: "0321 9876543", topic: "Custom size", message: "Can the Dastarkhwan be made 84 inches long for 8 people? What would the price be?", status: "new" },
    { id: "m3", createdAt: ago(3), name: "Interior Studio K", email: "studio.k@example.com", phone: "0333 5550001", topic: "Trade / bulk", message: "We are furnishing a boutique hotel in Murree, 22 rooms. Looking for trade pricing on Neend and Sirhana.", status: "replied" },
    { id: "m2", createdAt: ago(6), name: "Ali Zafar", email: "ali@example.com", phone: "", topic: "Delivery", message: "Do you deliver to Gilgit? And how long would it take?", status: "replied" },
    { id: "m1", createdAt: ago(11), name: "Sobia Aslam", email: "sobia@example.com", phone: "0345 1110000", topic: "Showroom visit", message: "Is the showroom open on Sunday?", status: "closed" },
  ];
  return { orders, messages, products: {} };
}
