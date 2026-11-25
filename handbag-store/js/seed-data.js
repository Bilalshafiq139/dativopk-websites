// Sample orders and messages for the admin panel. Used by the API (Docker) and by demo mode.
// Names and phone numbers are placeholders.
export const STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"];
export const MSG_STATUSES = ["new", "replied", "closed"];

const day = 864e5;
const ago = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
const ITEMS = {
  gulnar: ["Gulnar Structured Tote", 18500], asmaan: ["Asmaan Work Tote", 21000], raat: ["Raat Zip Camera Bag", 12900],
  baadal: ["Baadal Pleated Hobo", 11500], jamun: ["Jamun Pleated Hobo", 11500], phool: ["Phool Quilted Tote", 16900],
  kajal: ["Kajal Dome Satchel", 16500], chandni: ["Chandni Flap Top-Handle", 17900], gulab: ["Gulab Barrel Bag", 9800],
};
const line = (id, qty = 1) => ({ id, name: ITEMS[id][0], qty, price: ITEMS[id][1] });
function order(no, d, name, city, phone, lines, status, extra = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = subtotal >= 20000 ? 0 : 350;
  const giftWrap = extra.gift ? 500 : 0;
  return { id: "ZR-" + no, createdAt: ago(d), name, city, phone, email: name.split(" ")[0].toLowerCase() + "@example.com",
    address: extra.address || "House 21, Block C, " + city, payment: extra.payment || "Cash on delivery",
    items: lines, subtotal, delivery, giftWrap, total: subtotal + delivery + giftWrap, status, notes: extra.notes || "" };
}
export function makeSeed() {
  const orders = [
    order(2218, 0, "Maham Rizvi", "Lahore", "0300 4455112", [line("phool")], "new", { gift: true }),
    order(2217, 0, "Ayesha Khan", "Karachi", "0321 7788123", [line("gulnar"), line("raat")], "new", { payment: "Card" }),
    order(2216, 1, "Fatima Zahra", "Islamabad", "0333 1200456", [line("asmaan")], "confirmed"),
    order(2215, 1, "Zoya Iqbal", "Lahore", "0345 9087654", [line("chandni"), line("jamun")], "packed", { gift: true, notes: "Deliver before Friday, wedding gift." }),
    order(2214, 2, "Rabia Shah", "Faisalabad", "0301 5566778", [line("baadal", 2)], "shipped"),
    order(2213, 3, "Mehwish Ali", "Rawalpindi", "0322 3344556", [line("phool"), line("asmaan")], "shipped", { payment: "Bank transfer" }),
    order(2212, 4, "Iqra Nadeem", "Multan", "0300 1122990", [line("kajal")], "delivered"),
    order(2211, 6, "Saba Tariq", "Karachi", "0331 6677889", [line("gulnar")], "delivered"),
    order(2210, 8, "Komal Aziz", "Lahore", "0302 8899001", [line("gulab", 2)], "delivered", { gift: true }),
    order(2209, 10, "Nimra Hassan", "Peshawar", "0315 4433221", [line("raat")], "cancelled", { notes: "Customer changed colour, reordered as Gulnar." }),
    order(2208, 13, "Hira Butt", "Sialkot", "0345 2211334", [line("chandni"), line("jamun")], "delivered"),
    order(2207, 17, "Amna Javed", "Islamabad", "0333 9988776", [line("asmaan"), line("raat")], "delivered", { payment: "Card" }),
    order(2206, 21, "Sidra Malik", "Lahore", "0300 6655443", [line("gulnar")], "delivered"),
    order(2205, 26, "Laiba Qureshi", "Hyderabad", "0321 1234321", [line("kajal"), line("phool")], "delivered"),
  ];
  const messages = [
    { id: "m4", createdAt: ago(0, 10), name: "Mariam S.", email: "mariam@example.com", phone: "0300 1110022", topic: "Bulk / corporate", message: "We need 40 Phool totes for a corporate Eid gift. Can you add our logo tag?", status: "new" },
    { id: "m3", createdAt: ago(1), name: "Usman R.", email: "usman@example.com", phone: "", topic: "Gift", message: "Can the Chandni flap bag be delivered to my wife's office in DHA on a set date?", status: "new" },
    { id: "m2", createdAt: ago(4), name: "Kinza F.", email: "kinza@example.com", phone: "0333 7654321", topic: "Colours", message: "Will Baadal come in black for winter?", status: "replied" },
    { id: "m1", createdAt: ago(9), name: "Nadia P.", email: "nadia@example.com", phone: "", topic: "Studio visit", message: "Is the Gulberg studio open on Sunday?", status: "closed" },
  ];
  return { orders, messages, products: {} };
}
