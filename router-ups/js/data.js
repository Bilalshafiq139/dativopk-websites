// Catalogue for "Jugnu Power" (placeholder brand: WiFi router backup / mini UPS, Lahore).
// Product and lifestyle photos: Pexels (free licence), stored in assets/img.
// Keep prices in step with api/server.js.
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

export const CATEGORIES = [["ups", "Router UPS"], ["station", "Power Station"], ["acc", "Cables & add-ons"]];

// Routers & ONTs people in Pakistan plug in. watts = typical draw, v = input voltage.
export const DEVICES = [
  { id: "tplink", name: "TP-Link / Tenda WiFi router", v: "12V or 9V", watts: 6 },
  { id: "ptcl", name: "PTCL Flash Fiber ONT", v: "12V", watts: 7 },
  { id: "nayatel", name: "Nayatel fiber ONT", v: "12V", watts: 7 },
  { id: "storm", name: "StormFiber router", v: "12V", watts: 8 },
  { id: "mesh", name: "Mesh WiFi node (Deco, Google)", v: "12V", watts: 9 },
  { id: "4g", name: "Zong / Jazz 4G device", v: "9V or 12V", watts: 5 },
  { id: "cam", name: "CCTV camera / DVR", v: "12V", watts: 10 },
  { id: "laptop", name: "Laptop (USB-C)", v: "USB-C PD", watts: 30 },
];


// wh = usable battery energy. outs = output sockets. sold: true shows "Sold out".
export const PRODUCTS = [
  { id: "mini", name: "Jugnu Mini", line: "10,400 mAh router UPS", cat: "ups", price: 4499, old: 4999, tag: "Best Seller",
    wh: 38, mah: "10,400 mAh", outs: ["12V 2A", "9V 2A", "5V USB"], hours: "4 to 6 hours", weight: "230 g", switch: "0 ms",
    blurb: "The one most homes need. Router keeps running for up to 6 hours of load-shedding.",
    desc: "Plug it between the wall and your router. When the light goes, Jugnu switches over in 0 milliseconds, so your router never restarts, your Zoom call never drops and your game never disconnects. It recharges by itself once the power is back.",
    box: ["Jugnu Mini", "12V DC cable", "9V DC cable", "Wall adapter 12V 2A", "User guide in Urdu & English"] },
  { id: "pro", name: "Jugnu Pro Duo", line: "Router + fiber ONT, two 12V outputs", cat: "ups", price: 7499, old: 0, tag: "For fiber",
    wh: 67, mah: "18,000 mAh", outs: ["12V 2A", "12V 2A", "9V 2A", "5V USB"], hours: "5 to 8 hours (both devices)", weight: "380 g", switch: "0 ms",
    blurb: "Two 12V outputs for PTCL Flash Fiber, Nayatel and StormFiber homes: ONT and router on one unit.",
    desc: "Fiber homes have two boxes: the ONT from your ISP and your WiFi router. Pro Duo powers both from one battery, with two full 12V 2A outputs, so the internet line and the WiFi stay up together.",
    box: ["Jugnu Pro Duo", "2 × 12V DC cables", "9V DC cable", "Wall adapter 12V 3A", "Wall mount screws"] },
  { id: "max", name: "Jugnu Max", line: "30,000 mAh, all-night backup + USB-C", cat: "ups", price: 11999, old: 13499, tag: "Longest backup",
    wh: 111, mah: "30,000 mAh", outs: ["12V 3A", "9V 2A", "USB-C PD 65W", "5V USB"], hours: "10 to 14 hours", weight: "640 g", switch: "0 ms",
    blurb: "For long outages and night shifts: router all night, and a 65W USB-C port for your phone or laptop.",
    desc: "Max is for the 8 to 12 hour days and for freelancers on night shifts. The 12V 3A output runs a router or mesh node all night, and the USB-C PD port charges a phone or a USB-C laptop at the same time.",
    box: ["Jugnu Max", "12V & 9V DC cables", "USB-C to USB-C cable", "Wall adapter 12V 3A", "Carry pouch"] },
  { id: "lite", name: "Jugnu Lite", line: "6,000 mAh, for 9V & 12V routers", cat: "ups", price: 2999, old: 0, tag: "Budget",
    wh: 22, mah: "6,000 mAh", outs: ["12V 1.5A", "9V 1.5A"], hours: "2 to 3 hours", weight: "160 g", switch: "0 ms",
    blurb: "Covers one round of load-shedding for a single router. Small enough to stick behind it.",
    desc: "If your area has one or two hours of load-shedding at a time, Lite is enough. It is the size of a deck of cards and comes with a 3M pad to stick it on the back of the router.",
    box: ["Jugnu Lite", "12V DC cable", "9V DC cable", "3M mounting pad"] },
  { id: "station", name: "Jugnu Station 300", line: "300 Wh LiFePO4 power station", cat: "station", price: 64999, old: 72000, tag: "Home office",
    wh: 288, mah: "307 Wh LiFePO4", outs: ["2 × AC 300W", "12V DC", "2 × USB-A", "USB-C 100W"], hours: "30+ hours for a router", weight: "3.6 kg", switch: "15 ms (UPS mode)",
    blurb: "Router, laptop, LED light and a fan for a full work day without UPS or generator noise.",
    desc: "A silent, battery-only power station for the work-from-home desk. LiFePO4 cells last 3000+ cycles. Run the router for more than a day, or the router, a laptop and a 30W DC fan through a full outage. Charge it from the wall or from a solar panel.",
    box: ["Jugnu Station 300", "AC charging cable", "Car charging cable", "Solar input cable (MC4)"] },
  { id: "boost", name: "USB to 12V boost cable", line: "Run a router from any power bank", cat: "acc", price: 799, old: 0, tag: "",
    wh: 0, mah: "-", outs: ["12V 1A"], hours: "Depends on your power bank", weight: "40 g", switch: "-",
    blurb: "Already have a power bank? This cable steps 5V up to 12V for your router.",
    desc: "A 1 metre cable with a small boost circuit inside. Plug the USB end into any 2A power bank and the DC end into your router. Comes with 5.5×2.1 and 5.5×2.5 tips.",
    box: ["Boost cable 5V→12V", "2 DC tips"] },
  { id: "split", name: "DC Y-splitter cable", line: "One 12V output to two devices", cat: "acc", price: 549, old: 0, tag: "",
    wh: 0, mah: "-", outs: ["2 × 12V"], hours: "-", weight: "30 g", switch: "-",
    blurb: "Power your ONT and router from one 12V port (Mini and Max).",
    desc: "Pure copper 5.5×2.1 Y cable, 60 cm. Use it when your ONT and router together draw less than 2A, which is true for most fiber setups.",
    box: ["Y-splitter cable"] },
];

export const REVIEWS = [
  { name: "Hamza R.", city: "Lahore, Johar Town", text: "Two hours of load-shedding every evening and my router used to die right when my US client called. Mini has not missed a call in three months.", stars: 5 },
  { name: "Sana K.", city: "Karachi, Gulshan", text: "Ordered Pro Duo for PTCL fiber. Both boxes stay on, internet doesn't even blink when K-Electric cuts the power.", stars: 5 },
  { name: "Usman A.", city: "Faisalabad", text: "My kids' online classes no longer stop in the middle. Delivered in two days, cash on delivery.", stars: 5 },
  { name: "Ayesha M.", city: "Islamabad, G-13", text: "Max runs my mesh WiFi all night and charges my phone. I took it to the village for Eid too.", stars: 4 },
];

export const FAQ = [
  ["Will it work with my router?", "Almost certainly. Most routers and ONTs in Pakistan take 12V or 9V DC through a round 5.5mm pin. Check the small label under your router: if it says 12V 1A, 12V 1.5A, 9V 0.6A or similar, Jugnu works. Not sure? Send us a photo of the label on WhatsApp."],
  ["Does the router restart when the light goes?", "No. Jugnu sits between the adapter and the router all the time, so there is no switch-over gap. The router doesn't notice that the power went."],
  ["Is it safe to keep plugged in 24/7?", "Yes. It has overcharge, over-discharge, short-circuit and temperature protection, and it stops charging when the battery is full."],
  ["Will my internet work if the whole area's power is off?", "Your router will stay on. Whether the internet works also depends on your ISP's equipment in the street. Fiber (PTCL, Nayatel, StormFiber) and 4G usually keep working; some old copper DSL lines go down with the area."],
  ["How long does it take to charge?", "Mini and Lite charge fully in 3 to 4 hours. Pro and Max in 5 to 6 hours. Station 300 in 2 hours from the wall."],
  ["Warranty and returns?", "One year replacement warranty on all units and 7 day returns if it doesn't fit your router. Cash on delivery all over Pakistan."],
];

export const STEPS = [
  ["Unplug your router's adapter", "Take the round pin out of the back of your router. Leave the adapter in the wall."],
  ["Adapter into Jugnu", "Plug the router's own adapter, or the one in our box, into Jugnu's DC IN port."],
  ["Jugnu into the router", "Use the matching 12V or 9V cable from Jugnu's output to the router. Same voltage as the router label."],
  ["Done", "The light turns green when it is charging. From now on, load-shedding is just a dark room, not a dead internet."],
];

export const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");
// rough backup time in hours: 85% usable, at the given load in watts
export const backupHours = (wh, watts) => (wh * 0.85) / Math.max(1, watts);
