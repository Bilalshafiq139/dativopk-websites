// Concept website for Ismail Valley, Daewoo Road, Faisalabad (developer: Mehar Estate Developers).
// Prepared by DATIVOPK as a pitch. Rates, plot numbers, plans and photos are ILLUSTRATIVE and must be
// replaced with the developer's own figures, photos and team pictures before going live.
export const SOCIETY = {
  name: "Ismail Valley",
  developer: "Mehar Estate Developers",
  city: "Faisalabad",
  address: "Main Daewoo Road, Faisalabad, Punjab",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "info@ismailvalley.example",
  hours: "Site office open every day, 10am to 7pm",
  mapQuery: "Ismail Valley, Daewoo Road, Faisalabad",
};

// rate = PKR per marla. Block C rate taken from a public Zameen ad (Rs 9.5 lakh / marla); others are placeholders.
export const BLOCKS = [
  { id: "A", name: "Block A", note: "Developed, possession", rate: 1150000, status: "Possession", color: "#2f6b4f" },
  { id: "B", name: "Block B", note: "Developed, possession", rate: 1050000, status: "Possession", color: "#3f8462" },
  { id: "C", name: "Block C (New Extension)", note: "Booking open on installments", rate: 950000, status: "Booking open", color: "#c9a24b" },
  { id: "M", name: "Commercial", note: "Main boulevard shops", rate: 2400000, status: "Limited", color: "#8a5a2b" },
];
export const SIZES = [3, 5, 7, 10, 20]; // marla (20 marla = 1 kanal)
export const sizeLabel = (m) => (m === 20 ? "1 Kanal" : `${m} Marla`);

export const AMENITIES = [
  ["Grand gate & boundary wall", "A secure main gate on Daewoo Road with a full boundary wall and guarded entry."],
  ["Wide carpeted roads", "A 100-foot main boulevard and 30 to 40-foot carpeted streets with street lights."],
  ["Jamia mosque", "A central jamia mosque within walking distance of every block."],
  ["Parks & jogging track", "Green belts, family parks, a children's play area and a jogging track."],
  ["Underground utilities", "Underground electricity, water supply, sewerage and gas connections."],
  ["Commercial area", "Shops, a grocery market and daily needs on the main boulevard."],
  ["24/7 security", "CCTV at gates and boulevards, with a security team round the clock."],
  ["Schools & clinic", "Plots reserved for a school and a dispensary inside the society."],
];

export const DISTANCES = [["Motorway M-4 interchange", "10 min"], ["Faisalabad city centre", "20 min"], ["Allama Iqbal Airport", "25 min"], ["Daewoo terminal", "8 min"], ["Sargodha Road", "15 min"]];

// Management: placeholders until the developer sends real names and photos.
export const TEAM = [
  { role: "Chairman", name: "Name to be added", initials: "CH" },
  { role: "Chief Executive", name: "Name to be added", initials: "CE" },
  { role: "Director Sales & Marketing", name: "Name to be added", initials: "DS" },
  { role: "Project Manager", name: "Name to be added", initials: "PM" },
];

// Generate a believable plot inventory, the same every time.
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
export const PLOTS = (() => {
  const r = rng(42), out = [];
  const plan = { A: [5, 7, 10, 20], B: [3, 5, 7, 10], C: [3, 5, 7, 10], M: [3, 5] };
  for (const b of ["A", "B", "C", "M"]) {
    const n = b === "C" ? 36 : b === "M" ? 12 : 24;
    for (let i = 1; i <= n; i++) {
      const size = plan[b][Math.floor(r() * plan[b].length)];
      const corner = r() < 0.15, park = !corner && r() < 0.15;
      const x = r();
      const status = b === "C" || b === "M" ? (x < 0.6 ? "available" : x < 0.85 ? "booked" : "sold") : (x < 0.25 ? "available" : x < 0.4 ? "booked" : "sold");
      out.push({ id: `${b}-${String(i).padStart(3, "0")}`, block: b, no: i, size, corner, park, status, type: b === "M" ? "Commercial" : "Residential" });
    }
  }
  return out;
})();
export const blockById = (id) => BLOCKS.find((b) => b.id === id);
// Corner and park-facing plots carry a 10% premium, as is common in Faisalabad societies.
export const plotPrice = (p) => Math.round(blockById(p.block).rate * p.size * (p.corner || p.park ? 1.1 : 1));

export const img = (n) => `assets/img/${n}.webp`;
export function pkr(n) {
  if (n >= 1e7) { const v = n / 1e7; return "Rs " + (+v.toFixed(2)) + " Crore"; }
  if (n >= 1e5) { const v = n / 1e5; return "Rs " + (+v.toFixed(2)) + " Lakh"; }
  return "Rs " + Math.round(n).toLocaleString("en-PK");
}
export const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-IN");
