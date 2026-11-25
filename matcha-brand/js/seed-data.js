// Sample orders and messages for the admin panel. Used by the API (Docker) and by demo mode.
// Names and phone numbers are placeholders.
export const STATUSES = ["new", "confirmed", "preparing", "out for delivery", "delivered", "cancelled"];
export const MSG_STATUSES = ["new", "replied", "closed"];

const day = 864e5;
const ago = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
const ITEMS = {
  "iced-latte": ["Signature Iced Matcha Latte", 1150], strawberry: ["Strawberry Cloud Matcha", 1350], mango: ["Mango Matcha Sunrise", 1350],
  "hot-latte": ["Hot Ceremonial Latte", 950], ceremonial: ["Ceremonial Grade Matcha", 4800], hojicha: ["Roasted Hojicha Powder", 2900],
  chasen: ["Bamboo Whisk (Chasen)", 2400], chawan: ["Handmade Chawan Bowl", 3900], starter: ["Matcha Starter Kit", 9500],
  cheesecake: ["Matcha Basque Cheesecake", 1100], mousse: ["Matcha Mousse Cake", 1250],
};
const line = (id, qty = 1) => ({ id, name: ITEMS[id][0], qty, price: ITEMS[id][1] });
function order(no, d, name, city, phone, lines, status, extra = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal >= 5000 ? 0 : 250;
  return { id: "KY-" + no, createdAt: ago(d, extra.h || 12), name, city, phone, email: name.split(" ")[0].toLowerCase() + "@example.com",
    address: extra.address || "House 14, Street 3, " + (city === "Lahore" ? "DHA Phase 5" : "Block B") + ", " + city, payment: extra.payment || "Cash on delivery",
    items: lines, subtotal, delivery, total: subtotal + delivery, status, notes: extra.notes || "" };
}
export function makeSeed() {
  const orders = [
    order(1248, 0, "Hania Aslam", "Lahore", "0300 4455112", [line("iced-latte", 2), line("cheesecake")], "new", { h: 15 }),
    order(1247, 0, "Ali Raza", "Lahore", "0321 7788123", [line("strawberry"), line("mango")], "preparing", { h: 13, payment: "Card" }),
    order(1246, 0, "Sana Javed", "Karachi", "0333 1200456", [line("starter")], "confirmed", { h: 10, notes: "Birthday gift, please add a card: Happy birthday Mehr!" }),
    order(1245, 1, "Omar Farooq", "Lahore", "0345 9087654", [line("iced-latte", 3), line("mousse")], "out for delivery"),
    order(1244, 1, "Ayesha Malik", "Islamabad", "0301 5566778", [line("ceremonial"), line("chasen")], "delivered", { payment: "Bank transfer" }),
    order(1243, 2, "Bilal Ahmed", "Lahore", "0322 3344556", [line("hot-latte", 2), line("cheesecake", 2)], "delivered"),
    order(1242, 3, "Zara Sheikh", "Rawalpindi", "0300 1122990", [line("hojicha"), line("chawan")], "delivered"),
    order(1241, 4, "Fahad Iqbal", "Lahore", "0331 6677889", [line("mango", 2)], "delivered"),
    order(1240, 5, "Mahnoor Tariq", "Faisalabad", "0302 8899001", [line("starter")], "delivered", { payment: "Card" }),
    order(1239, 7, "Usman Khalid", "Lahore", "0315 4433221", [line("strawberry")], "cancelled", { notes: "Customer cancelled, outside delivery radius." }),
    order(1238, 9, "Iqra Nadeem", "Multan", "0345 2211334", [line("ceremonial", 2)], "delivered"),
    order(1237, 12, "Hamza Butt", "Lahore", "0333 9988776", [line("iced-latte", 4), line("mousse")], "delivered"),
    order(1236, 16, "Noor Fatima", "Karachi", "0300 6655443", [line("chasen"), line("hojicha")], "delivered"),
    order(1235, 22, "Saad Qureshi", "Lahore", "0321 1234321", [line("hot-latte"), line("cheesecake")], "delivered"),
  ];
  const messages = [
    { id: "m4", createdAt: ago(0, 11), name: "Mariam S.", email: "mariam@example.com", phone: "0300 1110022", topic: "Events & catering", message: "Can you set up a matcha bar for a 60-person office event in Gulberg next month?", status: "new" },
    { id: "m3", createdAt: ago(1), name: "Daniyal R.", email: "daniyal@example.com", phone: "", topic: "Wholesale", message: "We run a cafe in Islamabad. What is your price for 1 kg of ceremonial matcha?", status: "new" },
    { id: "m2", createdAt: ago(3), name: "Kinza F.", email: "kinza@example.com", phone: "0333 7654321", topic: "Product question", message: "Is the hojicha okay to drink at night? I am sensitive to caffeine.", status: "replied" },
    { id: "m1", createdAt: ago(8), name: "Hassan P.", email: "hassan@example.com", phone: "", topic: "Delivery", message: "Do you deliver drinks to Bahria Town?", status: "closed" },
  ];
  return { orders, messages, products: {} };
}
