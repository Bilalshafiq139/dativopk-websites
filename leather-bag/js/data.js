// Catalogue for "Chamra Leather Co." (placeholder brand: one handmade leather briefcase, Sialkot/Lahore).
// One bag in two colours plus its own add-ons. All photos are one Pexels shoot series of the same briefcase.
// Keep prices in step with api/server.js.
export const BRAND = {
  name: "Chamra",
  full: "Chamra Leather Co.",
  tagline: "One bag. Made properly.",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "hello@chamra.example",
  address: "Studio: 18-C MM Alam Road, Gulberg III, Lahore",
  workshop: "Workshop: Kashmir Road, Sialkot",
  hours: "Mon to Sat, 11am to 8pm",
  freeDeliveryOver: 10000,
  delivery: 300,
};

export const BAG = {
  name: "The Sialkot Briefcase",
  blurb: "Full-grain vegetable-tanned leather, cut and stitched by hand in our Sialkot workshop. One bag, made to carry your laptop and papers every working day for the next twenty years.",
  details: [
    ["Size", "40 × 30 × 9 cm. Fits a 15.6 inch laptop, files and a charger."],
    ["Leather", "2.2 mm full-grain cowhide, vegetable-tanned in Kasur. It darkens and softens with use."],
    ["Hardware", "Solid brass lock with two keys, brass buckles and D-rings for the shoulder strap."],
    ["Stitching", "Waxed linen thread, saddle-stitched by hand: two needles, one thread, no machine."],
    ["Inside", "Two flat pockets, one padded laptop sleeve and a pen loop. Cotton-canvas lining."],
  ],
  delivery: "Free delivery all over Pakistan. Lahore in 1 day, other cities in 2 to 4 days. Cash on delivery, card or bank transfer. 14 day returns, and we repair any stitching or hardware for the first year at no cost.",
  care: "Wipe with a dry cloth. Twice a year, rub in a little leather balm (we include a tin). Keep it out of rain where you can; if it gets wet, let it dry at room temperature, never near a heater.",
};

// colour variants of the one bag share group "bag"
export const PRODUCTS = [
  { id: "tan", group: "bag", name: "The Sialkot Briefcase · Tan", colour: "Tan", hex: "#a5552a", price: 38500, old: 0, cat: "bag",
    imgs: ["tan-1", "tan-2", "tan-3", "tan-4", "tan-5", "tan-6"], tag: "Most loved",
    line: "Tan full-grain leather, brass hardware" },
  { id: "black", group: "bag", name: "The Sialkot Briefcase · Black", colour: "Black", hex: "#16161a", price: 38500, old: 0, cat: "bag",
    imgs: ["black-1", "black-2", "black-3", "black-4", "black-5", "black-6"], tag: "",
    line: "Black full-grain leather, brass hardware" },
  { id: "wallet", group: "", name: "Bifold card wallet", colour: "", hex: "", price: 5900, old: 0, cat: "addon",
    imgs: ["wallet-1", "wallet-2"], tag: "",
    line: "Same leather, six cards and notes" },
  { id: "gift", group: "", name: "Gift box & handwritten card", colour: "", hex: "", price: 1500, old: 0, cat: "addon",
    imgs: ["gift-1", "gift-2"], tag: "",
    line: "Wrapped in our box with a ribbon" },
  { id: "initials", group: "", name: "Hand-stamped initials", colour: "", hex: "", price: 1200, old: 0, cat: "addon",
    imgs: ["swatches", "stitch"], tag: "",
    line: "Up to 3 letters, gold or blind stamp" },
];

export const REVIEWS = [
  { title: "Gets better every month", text: "Bought the tan one a year ago. It has gone darker and softer, and people still ask me where it's from.", name: "Usman T.", city: "Lahore" },
  { title: "Proper craftsmanship", text: "You can see the hand stitching. Nothing like the mall bags that peel after six months. Worth every rupee.", name: "Mehwish A.", city: "Islamabad" },
  { title: "My daily office bag", text: "Laptop, files and lunch all fit. The brass lock feels solid. Delivered to Karachi in three days, COD.", name: "Faraz K.", city: "Karachi" },
];

export const FAQ = [
  ["Is it really made by hand?", "Yes. Each bag is cut, edged and saddle-stitched by one craftsman in our Sialkot workshop. It takes about two days, and his name is written inside your bag."],
  ["Which colour should I take?", "Tan ages the most: it turns a deep honey brown within a year. Black stays formal and hides marks. Both use the same leather and brass."],
  ["Does it fit my laptop?", "It fits laptops up to 15.6 inches (about 36 × 25 cm) in the padded sleeve, plus files and a charger."],
  ["Can I see it before buying?", "Yes. Visit our Gulberg studio, or order with cash on delivery and check it at your door."],
  ["What if something breaks?", "For the first year we repair stitching and hardware for free. After that we still repair it at cost, for as long as you own it."],
];

export const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");
