// Sample orders and messages for the admin panel. Used by the API (Docker) and by demo mode.
// Names and phone numbers are placeholders.
export const STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "returned", "cancelled"];
export const MSG_STATUSES = ["new", "replied", "closed"];

const day = 864e5;
const ago = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
const ITEMS = {
  mini: ["Jugnu Mini", 4499], pro: ["Jugnu Pro Duo", 7499], max: ["Jugnu Max", 11999], lite: ["Jugnu Lite", 2999],
  station: ["Jugnu Station 300", 64999], boost: ["USB to 12V boost cable", 799], split: ["DC Y-splitter cable", 549],
};
const line = (id, qty = 1) => ({ id, name: ITEMS[id][0], qty, price: ITEMS[id][1] });
function order(no, d, name, city, phone, lines, status, extra = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal >= 6000 ? 0 : 250;
  return { id: "JG-" + no, createdAt: ago(d, extra.h || 12), name, city, phone, email: name.split(" ")[0].toLowerCase() + "@example.com",
    address: extra.address || "House 21, Street 6, " + (city === "Lahore" ? "Johar Town" : "Block C") + ", " + city, payment: extra.payment || "Cash on delivery",
    items: lines, subtotal, delivery, total: subtotal + delivery, status, notes: extra.notes || "" };
}
export function makeSeed() {
  const orders = [
    order(2318, 0, "Hamza Rauf", "Lahore", "0300 4455112", [line("mini")], "new", { h: 16, notes: "Router is TP-Link Archer C6, 12V. Please confirm cable." }),
    order(2317, 0, "Sana Khalid", "Karachi", "0321 7788123", [line("pro"), line("split")], "confirmed", { h: 13, payment: "Bank transfer" }),
    order(2316, 0, "Usman Ali", "Faisalabad", "0333 1200456", [line("mini", 2)], "packed", { h: 10, notes: "One for home, one for the shop." }),
    order(2315, 1, "Ayesha Malik", "Islamabad", "0345 9087654", [line("max")], "shipped", { payment: "Card" }),
    order(2314, 1, "Bilal Ahmed", "Lahore", "0301 5566778", [line("station")], "shipped", { payment: "Bank transfer", notes: "Freelancer, wants solar cable too." }),
    order(2313, 2, "Zara Sheikh", "Rawalpindi", "0322 3344556", [line("lite"), line("boost")], "delivered"),
    order(2312, 3, "Fahad Iqbal", "Multan", "0300 1122990", [line("pro")], "delivered"),
    order(2311, 4, "Mahnoor Tariq", "Lahore", "0331 6677889", [line("mini")], "delivered"),
    order(2310, 5, "Omar Farooq", "Peshawar", "0302 8899001", [line("max"), line("split")], "delivered", { payment: "Card" }),
    order(2309, 6, "Iqra Nadeem", "Gujranwala", "0315 4433221", [line("mini")], "returned", { notes: "Router needed 19V (Huawei). Refunded." }),
    order(2308, 8, "Hassan Butt", "Lahore", "0345 2211334", [line("pro", 2)], "delivered"),
    order(2307, 10, "Noor Fatima", "Karachi", "0333 9988776", [line("lite")], "cancelled", { notes: "Customer not reachable." }),
    order(2306, 13, "Saad Qureshi", "Sialkot", "0300 6655443", [line("mini"), line("boost")], "delivered"),
    order(2305, 18, "Kinza Riaz", "Lahore", "0321 1234321", [line("max")], "delivered"),
  ];
  const messages = [
    { id: "m4", createdAt: ago(0, 11), name: "Daniyal R.", email: "daniyal@example.com", phone: "0300 1110022", topic: "Which model?", message: "I have Nayatel ONT and a TP-Link Deco mesh (2 units). Load-shedding is 3 hours. Which one should I buy?", status: "new" },
    { id: "m3", createdAt: ago(1), name: "Shahid Traders", email: "shahid@example.com", phone: "0333 5544332", topic: "Wholesale / dealer", message: "We have a computer shop in Hall Road. Need 50 pieces of Mini every month. Dealer price?", status: "new" },
    { id: "m2", createdAt: ago(3), name: "Mariam S.", email: "mariam@example.com", phone: "", topic: "Order help", message: "My order JG-2302 came, the green light is on but the router is off when I unplug the wall. Help?", status: "replied" },
    { id: "m1", createdAt: ago(7), name: "Ali Hamid", email: "ali@example.com", phone: "0345 6677001", topic: "Warranty", message: "Battery lasted 3 hours only. Is that normal for a 12V 1.5A router on Lite?", status: "closed" },
  ];
  return { orders, messages, products: {} };
}
