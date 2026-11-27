// Sample orders and messages for the admin panel. Used by the API (Docker) and by demo mode.
// Names and phone numbers are placeholders.
export const STATUSES = ["new", "confirmed", "in workshop", "shipped", "delivered", "returned", "cancelled"];
export const MSG_STATUSES = ["new", "replied", "closed"];

const day = 864e5;
const ago = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
const ITEMS = {
  tan: ["The Sialkot Briefcase · Tan", 38500], black: ["The Sialkot Briefcase · Black", 38500],
  wallet: ["Bifold card wallet", 5900], gift: ["Gift box & handwritten card", 1500], initials: ["Hand-stamped initials", 1200],
};
const line = (id, qty = 1) => ({ id, name: ITEMS[id][0], qty, price: ITEMS[id][1] });
function order(no, d, name, city, phone, lines, status, extra = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal >= 10000 ? 0 : 300;
  return { id: "CH-" + no, createdAt: ago(d, extra.h || 12), name, city, phone, email: name.split(" ")[0].toLowerCase() + "@example.com",
    address: extra.address || "House 7, Street 12, " + (city === "Lahore" ? "DHA Phase 6" : "Block F") + ", " + city, payment: extra.payment || "Cash on delivery",
    items: lines, subtotal, delivery, total: subtotal + delivery, status, notes: extra.notes || "" };
}
export function makeSeed() {
  const orders = [
    order(1428, 0, "Usman Tariq", "Lahore", "0300 4455112", [line("tan"), line("initials")], "new", { h: 15, notes: "Initials: U.T. in gold." }),
    order(1427, 0, "Mehwish Akram", "Islamabad", "0321 7788123", [line("black"), line("gift")], "confirmed", { h: 12, payment: "Card", notes: "Gift for husband, card: Happy 10th anniversary!" }),
    order(1426, 1, "Faraz Khan", "Karachi", "0333 1200456", [line("tan")], "in workshop", { payment: "Bank transfer" }),
    order(1425, 1, "Ayesha Rauf", "Lahore", "0345 9087654", [line("wallet", 2)], "shipped"),
    order(1424, 2, "Hamza Butt", "Sialkot", "0301 5566778", [line("black"), line("wallet")], "shipped"),
    order(1423, 3, "Sana Javed", "Multan", "0322 3344556", [line("tan"), line("gift"), line("initials")], "delivered", { payment: "Card" }),
    order(1422, 5, "Bilal Qureshi", "Lahore", "0300 1122990", [line("black")], "delivered"),
    order(1421, 7, "Zainab Ali", "Faisalabad", "0331 6677889", [line("tan")], "delivered"),
    order(1420, 9, "Omar Siddiqui", "Islamabad", "0302 8899001", [line("black"), line("initials")], "delivered", { payment: "Bank transfer" }),
    order(1419, 12, "Hira Nadeem", "Karachi", "0315 4433221", [line("wallet")], "returned", { notes: "Wanted a slimmer wallet. Refunded." }),
    order(1418, 16, "Kamran Shah", "Peshawar", "0345 2211334", [line("tan")], "delivered"),
    order(1417, 21, "Nida Fatima", "Lahore", "0333 9988776", [line("black")], "cancelled", { notes: "Customer not reachable." }),
  ];
  const messages = [
    { id: "m4", createdAt: ago(0, 11), name: "Adeel R.", email: "adeel@example.com", phone: "0300 1110022", topic: "Corporate gifting", message: "We need 25 black briefcases with our logo stamped for our directors. Timeline and price?", status: "new" },
    { id: "m3", createdAt: ago(1), name: "Saba K.", email: "saba@example.com", phone: "", topic: "Visit the studio", message: "Can I see both colours at your Gulberg studio on Saturday?", status: "new" },
    { id: "m2", createdAt: ago(4), name: "Junaid M.", email: "junaid@example.com", phone: "0333 7654321", topic: "Repair", message: "My briefcase from 2025 has a loose buckle. How do I send it for repair?", status: "replied" },
    { id: "m1", createdAt: ago(9), name: "Rabia H.", email: "rabia@example.com", phone: "", topic: "Product question", message: "Will a 16 inch MacBook Pro fit?", status: "closed" },
  ];
  return { orders, messages, products: {} };
}
