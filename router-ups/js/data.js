// Catalogue for "Jugnu Power" (placeholder brand: one WiFi router UPS, Lahore).
// One product in two sizes, a ready kit and its own accessories. All product photos are one Pexels series
// of the same device, adapter, plug and cable, so every picture matches. Keep prices in step with api/server.js.
export const BRAND = {
  name: "Jugnu",
  full: "Jugnu Power",
  tagline: "Bijli jaye, WiFi na jaye.",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "hello@jugnu.example",
  address: "Office 12, Hafeez Centre, Gulberg III, Lahore",
  hours: "Mon to Sat, 10am to 8pm",
  freeDeliveryOver: 6000,
  delivery: 250,
};

export const CATEGORIES = [["ups", "Jugnu UPS"], ["acc", "Accessories"]];

// Routers & ONTs people in Pakistan plug in. watts = typical draw, v = input voltage.
export const DEVICES = [
  { id: "tplink", name: "TP-Link / Tenda WiFi router", v: "12V or 9V", watts: 6 },
  { id: "ptcl", name: "PTCL Flash Fiber ONT", v: "12V", watts: 7 },
  { id: "nayatel", name: "Nayatel fiber ONT", v: "12V", watts: 7 },
  { id: "storm", name: "StormFiber router", v: "12V", watts: 8 },
  { id: "mesh", name: "Mesh WiFi node (Deco, Google)", v: "12V", watts: 9 },
  { id: "4g", name: "Zong / Jazz 4G device", v: "9V or 12V", watts: 5 },
  { id: "cam", name: "CCTV camera", v: "12V", watts: 6 },
];

// The one device. Both sizes share the same aluminium body.
export const SPEC = {
  outs: ["12V 2A DC", "9V 2A DC", "5V USB"], input: "12V DC IN", switch: "0 ms", body: "Graphite aluminium, 150 × 70 × 22 mm",
  protect: "Overcharge, over-discharge, short-circuit, temperature",
};

// variant: products that are the same Jugnu in another size share a group, so the product page shows a size switch.
export const PRODUCTS = [
  { id: "j10", group: "jugnu", size: "10,400 mAh", name: "Jugnu Mini UPS 10K", line: "10,400 mAh · one router", cat: "ups", price: 4499, old: 4999, tag: "Best Seller",
    wh: 38, mah: "10,400 mAh", hours: "4 to 6 hours", weight: "230 g",
    blurb: "Keeps one WiFi router running for up to 6 hours of load-shedding.",
    desc: "Plug it between the wall and your router. When the light goes, Jugnu switches over in 0 milliseconds, so your router never restarts, your Zoom call never drops and your game never disconnects. It recharges by itself when the power is back.",
    box: ["Jugnu Mini UPS", "12V DC cable", "9V DC cable", "User guide in Urdu & English"] },
  { id: "j20", group: "jugnu", size: "20,000 mAh", name: "Jugnu Mini UPS 20K", line: "20,000 mAh · router + fiber box", cat: "ups", price: 6999, old: 7499, tag: "Longer backup",
    wh: 74, mah: "20,000 mAh", hours: "8 to 11 hours", weight: "360 g",
    blurb: "The same Jugnu with double the battery, for long outages or a router and fiber box together.",
    desc: "The same graphite Jugnu, with twice the cells inside. Enough for a router through the night, or a router and a PTCL / Nayatel fiber box together through the longest load-shedding (use the 12V and 9V outputs, or the Y-cable).",
    box: ["Jugnu Mini UPS 20,000 mAh", "12V DC cable", "9V DC cable", "User guide in Urdu & English"] },
  { id: "kit", group: "", size: "", name: "Jugnu Load-shedding Kit", line: "Jugnu 20,000 + adapter + plug + cable", cat: "ups", price: 8299, old: 9046, tag: "Save Rs 747",
    wh: 74, mah: "20,000 mAh", hours: "8 to 11 hours", weight: "450 g",
    blurb: "Everything in one box: the 20,000 mAh Jugnu, its fast wall adapter, a 3-pin plug and a spare cable.",
    desc: "The complete set for a new setup or a gift. The 20,000 mAh Jugnu, the matching 12V wall adapter so your router's old adapter stays free, a Pakistani 3-pin plug converter and a spare braided cable.",
    box: ["Jugnu Mini UPS 20,000 mAh", "Jugnu 12V wall adapter", "3-pin plug converter", "Braided DC cable", "User guide"] },
  { id: "adapter", group: "", size: "", name: "Jugnu 12V wall adapter", line: "Charges Jugnu in 3 hours", cat: "acc", price: 999, old: 0, tag: "",
    wh: 0, mah: "-", hours: "-", weight: "70 g",
    blurb: "The matching charger for Jugnu: 12V 2A, short-circuit and surge protected.",
    desc: "If your router's own adapter is weak or lost, use this one. It charges Jugnu fully in about 3 hours (10,400 mAh) or 5 hours (20,000 mAh) and runs cool all day.",
    box: ["12V 2A wall adapter"] },
  { id: "plug", group: "", size: "", name: "3-pin plug converter", line: "For Pakistani wall sockets", cat: "acc", price: 299, old: 0, tag: "",
    wh: 0, mah: "-", hours: "-", weight: "25 g",
    blurb: "Clips onto the Jugnu adapter so it fits the big 3-pin sockets in older homes.",
    desc: "A solid clip-on converter for the 3-pin sockets common in Pakistani homes and offices. It clicks onto the Jugnu wall adapter and stays firmly in the socket.",
    box: ["3-pin plug converter"] },
  { id: "cable", group: "", size: "", name: "Braided DC cable", line: "Spare 12V / 9V cable, 1 m", cat: "acc", price: 449, old: 0, tag: "",
    wh: 0, mah: "-", hours: "-", weight: "35 g",
    blurb: "A spare braided cable from Jugnu to your router, or to a second device.",
    desc: "Nylon-braided, 1 metre, with metal ends. Comes with 5.5×2.1 and 5.5×2.5 tips so it fits almost every router and fiber box in Pakistan.",
    box: ["Braided DC cable", "2 DC tips"] },
];

export const REVIEWS = [
  { name: "Hamza R.", city: "Lahore, Johar Town", text: "Two hours of load-shedding every evening and my router used to die right when my US client called. Jugnu has not missed a call in three months.", stars: 5 },
  { name: "Sana K.", city: "Karachi, Gulshan", text: "Took the 20,000 one for PTCL fiber. Both boxes stay on, the internet doesn't even blink when K-Electric cuts the power.", stars: 5 },
  { name: "Usman A.", city: "Faisalabad", text: "My kids' online classes no longer stop in the middle. Delivered in two days, cash on delivery.", stars: 5 },
  { name: "Ayesha M.", city: "Islamabad, G-13", text: "Bought the kit for my parents. Small, looks neat behind the router, and they didn't need any help setting it up.", stars: 4 },
];

export const FAQ = [
  ["Will it work with my router?", "Almost certainly. Most routers and ONTs in Pakistan take 12V or 9V DC through a round 5.5mm pin. Check the small label under your router: if it says 12V 1A, 12V 1.5A, 9V 0.6A or similar, Jugnu works. Not sure? Send us a photo of the label on WhatsApp."],
  ["Which size should I buy?", "10,400 mAh covers one router for 4 to 6 hours. Take 20,000 mAh if your load-shedding is longer, or if you also want to power a fiber box (ONT). The backup calculator shows the hours for your own setup."],
  ["Does the router restart when the light goes?", "No. Jugnu sits between the adapter and the router all the time, so there is no switch-over gap. The router doesn't notice that the power went."],
  ["Is it safe to keep plugged in 24/7?", "Yes. It has overcharge, over-discharge, short-circuit and temperature protection, and it stops charging when the battery is full."],
  ["Will my internet work if the whole area's power is off?", "Your router will stay on. Whether the internet works also depends on your ISP's equipment in the street. Fiber (PTCL, Nayatel, StormFiber) and 4G usually keep working; some old copper DSL lines go down with the area."],
  ["Warranty and returns?", "One year replacement warranty and 7 day returns if it doesn't fit your router. Cash on delivery all over Pakistan."],
];

export const STEPS = [
  ["Unplug your router's adapter", "Take the round pin out of the back of your router. Leave the adapter in the wall."],
  ["Adapter into Jugnu", "Plug the router's own adapter, or the Jugnu wall adapter, into Jugnu's DC IN port."],
  ["Jugnu into the router", "Use the matching 12V or 9V cable from Jugnu's output to the router. Same voltage as the router label."],
  ["Done", "The light turns green when it is charging. From now on, load-shedding is just a dark room, not a dead internet."],
];

export const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");
// rough backup time in hours: 85% usable, at the given load in watts
export const backupHours = (wh, watts) => (wh * 0.85) / Math.max(1, watts);
