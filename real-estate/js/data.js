// Listings for "Arz Estate" (placeholder brand). Change listings, prices and photos here.
// Photos: Pexels. Keep ids in step with api/server.js (LISTING_IDS).
export const BRAND = {
  name: "Arz Estate",
  phone: "+92 300 0000000",
  whatsapp: "https://wa.me/923000000000",
  email: "sales@arzestate.example",
  office: "Office 4, 2nd Floor, Y Block Commercial, DHA Phase 3, Lahore",
  hours: "Mon to Sat, 10am to 7pm",
};

export const PURPOSES = [["buy", "Buy"], ["rent", "Rent"], ["new", "New developments"], ["commercial", "Commercial"]];
export const CITIES = ["Lahore", "Islamabad", "Karachi"];
export const TYPES = ["House", "Villa", "Apartment", "Office", "Plaza"];

const G = { house: ["i-living", "i-kitchen", "i-bed"], villa: ["i-living2", "i-kitchen2", "i-bed2"], lux: ["i-lounge", "i-kitchen", "i-bed2"], apt: ["i-tv", "i-kitchen2", "i-bed"] };

// price in PKR. For rent, price is per month.
export const LISTINGS = [
  { id: "noor", title: "Noor Villa", city: "Lahore", area: "DHA Phase 6", type: "House", purpose: "buy", price: 125000000, size: "2 Kanal", sqft: 9000, floors: 2, beds: 6, baths: 7, tag: "Featured",
    gallery: G.lux, agent: "ag-1", year: 2023,
    desc: "A corner two-kanal home on a 60-foot road with a double-height lounge, Italian marble floors, a home cinema and a basement gym. Solar system and full backup installed.",
    features: ["Corner plot", "Basement", "Home cinema", "Solar 15 kW", "Servant quarter", "Lawn"] },
  { id: "serenity", title: "Serenity House", city: "Lahore", area: "Gulberg III", type: "House", purpose: "buy", price: 89000000, size: "1 Kanal", sqft: 4500, floors: 3, beds: 5, baths: 6, tag: "",
    gallery: G.house, agent: "ag-2", year: 2022,
    desc: "A white modern home minutes from MM Alam Road with a rooftop terrace, open kitchen and a separate drawing room with its own entrance.",
    features: ["Rooftop terrace", "Open kitchen", "Separate drawing room", "Car porch for 3", "Gas connection"] },
  { id: "margalla", title: "Margalla Retreat", city: "Islamabad", area: "E-7", type: "Villa", purpose: "buy", price: 180000000, size: "2 Kanal", sqft: 9500, floors: 2, beds: 6, baths: 7, tag: "Featured",
    gallery: G.villa, agent: "ag-3", year: 2021,
    desc: "A villa at the foot of the Margalla Hills with a 15-metre pool, palm courtyard and floor-to-ceiling glass that opens the lounge onto the garden.",
    features: ["Swimming pool", "Hill view", "Courtyard", "Staff quarters", "Central air"] },
  { id: "palm", title: "Palm Court", city: "Karachi", area: "Bahria Town Karachi", type: "Villa", purpose: "buy", price: 62000000, size: "500 Sq. Yd.", sqft: 4500, floors: 2, beds: 5, baths: 5, tag: "",
    gallery: G.villa, agent: "ag-4", year: 2023,
    desc: "A sunny family villa with a private pool and lawn, in a gated block close to the Grand Jamia Mosque and the theme park.",
    features: ["Private pool", "Gated block", "Lawn", "Double kitchen", "Near park"] },
  { id: "seabreeze", title: "Sea Breeze Villa", city: "Karachi", area: "DHA Phase 8", type: "Villa", purpose: "buy", price: 97500000, size: "1000 Sq. Yd.", sqft: 7200, floors: 2, beds: 6, baths: 6, tag: "New",
    gallery: G.lux, agent: "ag-4", year: 2024,
    desc: "Clean white lines, a red feature wall and a pool deck a few minutes from Seaview. Built in 2024 with imported fittings throughout.",
    features: ["Pool deck", "Near Seaview", "Imported fittings", "Smart home", "Generator"] },
  { id: "lantern", title: "Lantern House", city: "Lahore", area: "DHA Phase 7", type: "House", purpose: "buy", price: 110000000, size: "1 Kanal", sqft: 5200, floors: 3, beds: 5, baths: 6, tag: "",
    gallery: G.lux, agent: "ag-1", year: 2024,
    desc: "Warm wood, black frames and layered lighting make this home glow at night. A lift, basement lounge and a terrace garden.",
    features: ["Lift", "Basement lounge", "Terrace garden", "Designer lighting", "Solar"] },
  { id: "cube", title: "Stone Cube", city: "Islamabad", area: "F-7/2", type: "House", purpose: "buy", price: 140000000, size: "1 Kanal", sqft: 5000, floors: 2, beds: 4, baths: 5, tag: "",
    gallery: G.house, agent: "ag-3", year: 2022,
    desc: "An architect-designed concrete home on a quiet lane in F-7, a walk from Jinnah Super. Private, calm and very well built.",
    features: ["Architect designed", "Quiet lane", "Walk to Jinnah Super", "Double glazing"] },
  { id: "pearl", title: "White Pearl", city: "Islamabad", area: "Bahria Enclave", type: "House", purpose: "buy", price: 48000000, size: "10 Marla", sqft: 2800, floors: 2, beds: 4, baths: 4, tag: "",
    gallery: G.house, agent: "ag-6", year: 2023,
    desc: "A bright ten-marla home with hill views, a modern kitchen and a large terrace. Ideal first home for a young family.",
    features: ["Hill view", "Terrace", "Modern kitchen", "Gated society"] },
  { id: "azure", title: "Azure Residence", city: "Karachi", area: "Clifton Block 4", type: "House", purpose: "buy", price: 74000000, size: "500 Sq. Yd.", sqft: 4800, floors: 2, beds: 5, baths: 5, tag: "",
    gallery: G.villa, agent: "ag-4", year: 2021,
    desc: "A sleek corner home in Clifton with a pool, a covered terrace and a guest suite on the ground floor.",
    features: ["Pool", "Guest suite", "Corner", "Covered terrace"] },
  { id: "shalimar", title: "Shalimar Mansion", city: "Lahore", area: "DHA Phase 5", type: "Villa", purpose: "buy", price: 220000000, size: "4 Kanal", sqft: 16000, floors: 3, beds: 8, baths: 9, tag: "Exclusive",
    gallery: G.lux, agent: "ag-1", year: 2020,
    desc: "A four-kanal estate with a grand portico, a garage for six cars, a rooftop garden and landscaped lawns front and back.",
    features: ["4 Kanal", "6-car garage", "Rooftop garden", "Elevator", "Guest annexe"] },
  { id: "skyline", title: "Skyline Apartment", city: "Lahore", area: "Gulberg II", type: "Apartment", purpose: "rent", price: 350000, size: "2,400 sq ft", sqft: 2400, floors: 1, beds: 3, baths: 3, tag: "Furnished",
    gallery: G.apt, agent: "ag-2", year: 2022,
    desc: "A fully furnished 14th-floor apartment with city views, a gym and pool in the building, and two parking spaces.",
    features: ["Furnished", "City view", "Gym & pool", "2 parking", "24/7 security"] },
  { id: "harbour", title: "Harbour Tower Flat", city: "Karachi", area: "Clifton Block 2", type: "Apartment", purpose: "rent", price: 280000, size: "2,100 sq ft", sqft: 2100, floors: 1, beds: 3, baths: 3, tag: "",
    gallery: G.apt, agent: "ag-4", year: 2021,
    desc: "A three-bedroom sea-facing flat with a large balcony, backup power and a children's play area in the building.",
    features: ["Sea facing", "Balcony", "Backup power", "Play area"] },
  { id: "arz-heights", title: "Arz Heights", city: "Lahore", area: "Bahria Town Lahore", type: "Apartment", purpose: "new", price: 19500000, size: "From 1,250 sq ft", sqft: 1250, floors: 1, beds: 2, baths: 2, tag: "Installments",
    gallery: G.apt, agent: "ag-5", year: 2027,
    desc: "Our own 18-floor development. Book with 20% down and pay the rest in 36 monthly installments. Possession in December 2027.",
    features: ["20% down payment", "36 installments", "Rooftop pool", "Possession Dec 2027", "LDA approved"] },
  { id: "blue-avenue", title: "Blue Avenue Office", city: "Islamabad", area: "Blue Area", type: "Office", purpose: "commercial", price: 1200000, size: "6,000 sq ft", sqft: 6000, floors: 1, beds: 0, baths: 4, tag: "For rent",
    gallery: ["l-mm-plaza", "i-tv", "i-lounge"], agent: "ag-5", year: 2019,
    desc: "A full office floor on Jinnah Avenue with glass frontage, central air, a reception and 12 parking spaces.",
    features: ["Full floor", "Jinnah Avenue", "Central air", "12 parking"] },
  { id: "mm-plaza", title: "MM Alam Commercial", city: "Lahore", area: "MM Alam Road", type: "Plaza", purpose: "commercial", price: 350000000, size: "1 Kanal, 6 floors", sqft: 26000, floors: 6, beds: 0, baths: 12, tag: "",
    gallery: ["l-mm-plaza", "l-blue-avenue", "i-lounge"], agent: "ag-5", year: 2018,
    desc: "A six-floor commercial building on MM Alam Road with a ground-floor showroom, five office floors and rental income in place.",
    features: ["Rental income", "Showroom", "Main boulevard", "Lift", "Basement parking"] },
];

// purpose === "rent" or office rent show per month
export const perMonth = (l) => l.purpose === "rent" || l.id === "blue-avenue";

export const INVEST = [
  { id: "inv-1", title: "Gulberg Greens Farmhouse", area: "Islamabad / Gulberg Greens", sqft: 12000, floors: 2, beds: 6, baths: 6, invest: 2500000, irr: 14, ret: 3900000,
    desc: "A furnished farmhouse rented for weddings and events. Own a share and earn from bookings every month." },
  { id: "inv-2", title: "DHA Rental Villa", area: "Lahore / DHA Phase 6", sqft: 5200, floors: 2, beds: 5, baths: 5, invest: 1500000, irr: 12, ret: 2200000,
    desc: "A short-stay villa for overseas Pakistanis and families visiting Lahore, managed by our team." },
  { id: "inv-3", title: "Seaview Holiday Home", area: "Karachi / DHA Phase 8", sqft: 3800, floors: 2, beds: 4, baths: 4, invest: 3500000, irr: 15, ret: 5600000,
    desc: "A holiday home near the sea with a pool, booked most weekends of the year." },
];

export const AGENTS = [
  { id: "ag-1", name: "Faisal Mahmood", role: "Senior property consultant", city: "Lahore", rating: 5.0, reviews: 120, phone: "+92 300 1110001", deals: 214 },
  { id: "ag-2", name: "Sana Rauf", role: "Residential agent", city: "Lahore", rating: 4.9, reviews: 80, phone: "+92 300 1110002", deals: 132 },
  { id: "ag-3", name: "Usman Tariq", role: "Luxury homes, Islamabad", city: "Islamabad", rating: 4.8, reviews: 88, phone: "+92 300 1110003", deals: 156 },
  { id: "ag-4", name: "Hina Siddiqui", role: "Karachi branch manager", city: "Karachi", rating: 4.9, reviews: 102, phone: "+92 300 1110004", deals: 190 },
  { id: "ag-5", name: "Ahmed Khan", role: "Commercial & new projects", city: "Lahore", rating: 4.7, reviews: 76, phone: "+92 300 1110005", deals: 98 },
  { id: "ag-6", name: "Ayesha Nadeem", role: "Rentals & first homes", city: "Islamabad", rating: 4.8, reviews: 64, phone: "+92 300 1110006", deals: 87 },
];

export const img = (n) => `assets/img/${n}.webp`;
export const cover = (l) => img("l-" + l.id);
export const agentById = (id) => AGENTS.find((a) => a.id === id);
// PKR in crore / lakh, the way buyers in Pakistan read prices
export function pkr(n, short = false) {
  if (n >= 1e7) { const v = n / 1e7; return (short ? "" : "PKR ") + (Number.isInteger(v) ? v : v.toFixed(v < 10 ? 2 : 1).replace(/\.?0+$/, "")) + " Crore"; }
  if (n >= 1e5) { const v = n / 1e5; return (short ? "" : "PKR ") + (Number.isInteger(v) ? v : v.toFixed(1).replace(/\.0$/, "")) + " Lakh"; }
  return "PKR " + Math.round(n).toLocaleString("en-PK");
}
export const priceLabel = (l, p = l.price) => pkr(p) + (perMonth(l) ? " / month" : "");
