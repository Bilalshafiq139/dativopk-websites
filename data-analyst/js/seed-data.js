// Sample project enquiries for the admin panel (used by the browser demo mode and by the API on first start).
export const STATUSES = ["new", "replied", "call booked", "proposal sent", "won", "lost"];
export const TYPES = ["Dashboard build", "Forecasting", "Deep-dive analysis", "Analytics partner", "Training / workshop", "Not sure yet"];
export const BUDGETS = ["Under PKR 150k", "PKR 150k – 300k", "PKR 300k – 600k", "PKR 600k+"];

const SAMPLE = [
  ["Ayesha Siddiqui", "Bloom Skincare", "Dashboard build", "PKR 150k – 300k", "Shopify + Meta Ads", "We sell on our website and Daraz. Want one dashboard for sales, ad spend and ROAS instead of 4 tabs.", "won", 1800000 / 10],
  ["Usman Tariq", "Tariq Pharma Distributors", "Forecasting", "PKR 300k – 600k", "ERP (Oracle), Excel", "Need monthly demand forecast for ~600 SKUs across 5 depots. Ramadan season is always a mess.", "proposal sent", 420000],
  ["Sana Javed", "CityCare Clinics", "Deep-dive analysis", "PKR 150k – 300k", "Clinic software exports", "Why are no-shows so high on Mondays? We have 3 branches in Lahore.", "call booked", 160000],
  ["Faisal Mahmood", "Mahmood Textiles", "Dashboard build", "PKR 300k – 600k", "SQL Server, paper registers", "Saw your OEE case study. We have 240 looms in Faisalabad, similar problem.", "replied", 380000],
  ["Hira Aslam", "Daakghar Couriers", "Analytics partner", "PKR 600k+", "PostgreSQL, Metabase", "Looking for a part-time senior analyst 6–8 days a month for at least 6 months.", "new", 0],
  ["Omar Farooq", "Farooq Motors", "Deep-dive analysis", "Under PKR 150k", "Excel", "Which of our 4 showrooms is actually profitable after discounts?", "won", 110000],
  ["Mehwish Raza", "LearnHub Pakistan", "Training / workshop", "Under PKR 150k", "Power BI", "2-day Power BI workshop for 12 people in our finance team, in Urdu.", "won", 95000],
  ["Bilal Ahmed", "Chai Wala Co.", "Dashboard build", "PKR 150k – 300k", "POS (Foodics), Google Sheets", "11 cafes, want daily sales by item and hour on my phone.", "new", 0],
  ["Zainab Khan", "Noor Fashion", "Deep-dive analysis", "PKR 150k – 300k", "Shopify, courier portals", "Our COD orders get refused a lot. Which cities and products?", "proposal sent", 175000],
  ["Kamran Shah", "Shah Builders", "Not sure yet", "Under PKR 150k", "Excel", "We track sales of plots in Excel. Not sure what is possible, can we talk?", "replied", 0],
  ["Rabia Nadeem", "GreenLeaf Agri", "Forecasting", "PKR 300k – 600k", "SAP, weather data", "Fertiliser demand forecast by district, linked to crop calendar.", "call booked", 450000],
  ["Imran Qadir", "QuickMart", "Dashboard build", "PKR 300k – 600k", "SQL Server", "18 grocery stores, want something like your retail command centre.", "won", 340000],
  ["Nida Hussain", "Hussain & Co. Chartered Accountants", "Analytics partner", "PKR 150k – 300k", "QuickBooks, Excel", "Monthly management reports for 6 of our SME clients.", "lost", 0],
  ["Adeel Siddiq", "Zoom Fitness", "Deep-dive analysis", "Under PKR 150k", "Gym software", "Why do members cancel after 3 months?", "new", 0],
  ["Sadia Iqbal", "EduSmart Schools", "Dashboard build", "PKR 150k – 300k", "Google Sheets", "Fee collection and attendance dashboard for 4 campuses.", "replied", 0],
  ["Haris Malik", "Malik Logistics", "Forecasting", "PKR 600k+", "TMS, PostgreSQL", "Truck utilisation forecasting across Karachi–Lahore route.", "proposal sent", 650000],
  ["Fatima Zahra", "Sukoon Home", "Not sure yet", "Under PKR 150k", "Instagram, WhatsApp orders", "Small home decor brand. Is my business too small for analytics?", "replied", 0],
  ["Asad Mirza", "Mirza Electronics", "Dashboard build", "PKR 150k – 300k", "Excel, Daraz seller center", "Inventory and sales dashboard across 3 shops and online.", "lost", 0],
  ["Maryam Akhtar", "HealthPlus Labs", "Deep-dive analysis", "PKR 150k – 300k", "LIMS exports", "Test turnaround times are slipping. Need to find where.", "call booked", 190000],
  ["Junaid Arif", "PayNow (startup)", "Analytics partner", "PKR 300k – 600k", "BigQuery, Mixpanel", "Seed-stage fintech, need analytics set up before Series A.", "new", 0],
  ["Saima Butt", "Butt Sweets", "Dashboard build", "Under PKR 150k", "POS, Excel", "7 sweet shops in Lahore, Eid sales planning.", "won", 135000],
  ["Waqas Anwar", "Anwar Steel", "Forecasting", "PKR 300k – 600k", "ERP", "Raw material price and demand forecast.", "replied", 0],
];

export function makeSeed() {
  const now = Date.now();
  return SAMPLE.map((s, i) => {
    const [name, company, type, budget, sources, message, status, quote] = s;
    const first = name.split(" ")[0].toLowerCase();
    return {
      id: "seed-" + (i + 1),
      name, company, type, budget, sources, message, status,
      quote: Math.round(quote) || 0,
      email: `${first}@${company.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}.pk`,
      phone: "+92 3" + String(10 + ((i * 7) % 40)).padStart(2, "0") + " " + String(1000000 + i * 48271 % 8999999).slice(0, 7),
      timeline: ["This month", "Next 1–2 months", "Just exploring"][i % 3],
      notes: status === "won" ? "Signed. Kick-off call done." : "",
      createdAt: new Date(now - (i * 2.6 + 0.4) * 864e5).toISOString(),
    };
  });
}
