// Portfolio content. Client names are fictional placeholders; numbers are sample data for the demo.
export const PERSON = {
  name: "Hamza Qureshi",
  role: "Data Analyst",
  city: "Lahore, Pakistan",
  email: "hello@hamzaqureshi.pk",
  phone: "+92 300 0000000",
  wa: "923000000000",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// small seeded random so charts look the same on every visit
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// 104 weekly points (2 years): flat-ish "before", then an improvement after the project went live (week 52)
function series({ seed, start, before, after, noise, season = 0, golive = 52, n = 104 }) {
  const r = rng(seed);
  const out = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    const drift = i < golive ? before : after;
    v += drift + (r() - 0.5) * noise;
    const s = Math.sin((i / 52) * Math.PI * 2) * season;
    out.push(+(v + s).toFixed(2));
  }
  return out;
}
function volume(seed, n = 104, base = 40, amp = 30) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => Math.round(base + Math.abs(Math.sin(i / 6)) * amp + r() * amp));
}
export function weekLabels(n = 104) {
  const d0 = new Date(2024, 0, 1);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(d0.getTime() + i * 7 * 864e5);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  });
}

export const CATEGORIES = ["Dashboards", "Forecasting", "SQL & Modelling", "Machine Learning", "Operations"];

export const PROJECTS = [
  {
    id: "kinara-retail",
    title: "Sales command centre for a 42-store retail chain",
    short: "Retail sales command centre",
    client: "Kinara Retail",
    industry: "Retail",
    category: "Dashboards",
    year: "2025",
    duration: "10 weeks",
    role: "Lead analyst (solo)",
    team: "CFO, 6 regional managers",
    tools: ["Power BI", "SQL Server", "Power Query", "DAX", "Excel"],
    img: "retail",
    summary: "Replaced 40+ weekly Excel files with one live Power BI command centre for sales, margin and stock across 42 stores.",
    headline: { label: "Weekly net sales", unit: "pkr-cr" },
    metric: { value: "3 days → 15 min", label: "time to weekly report" },
    before: { label: "Report turnaround", value: "3 days" },
    after: { label: "Report turnaround", value: "15 min" },
    problem: "Every Monday, each store manager emailed an Excel file. Head office spent three days stitching 40+ files together, and by Thursday the numbers were already stale. Two stores ran out of best-sellers almost every week, and nobody noticed until customers complained.",
    approach: [
      ["Mapped the questions first", "Sat with the CFO and regional managers to list the 12 questions they ask every week, before touching any data."],
      ["Built one source of truth", "Moved POS exports into SQL Server with a nightly job, cleaned 3 years of history and fixed 1,900 mismatched product codes."],
      ["Designed the model", "A star schema (sales, stock, product, store, calendar) so every number reconciles back to the ledger."],
      ["Shipped the command centre", "Five Power BI pages: overview, regions, store drill-down, product mix and a stock-out early-warning list."],
      ["Trained the team", "Two Urdu/English workshops so regional managers could filter and export on their own."],
    ],
    results: [["-31%", "stock-outs on top 200 SKUs"], ["15 min", "weekly report, down from 3 days"], ["+6.4%", "like-for-like sales in 2 quarters"]],
    quote: ["We stopped arguing about whose spreadsheet was right. Now the Monday meeting starts with decisions.", "Finance Director, Kinara Retail"],
    chart: { seed: 11, start: 6.1, before: 0.004, after: 0.022, noise: 0.42, season: 0.7 },
    split: [["Grocery", 41], ["Home & kitchen", 23], ["Apparel", 19], ["Personal care", 17]],
    keystats: [["Stores", "42"], ["SKUs tracked", "18.4k"], ["Rows / night", "2.1M"]],
  },
  {
    id: "dakhil-returns",
    title: "Cutting e-commerce returns with cohort analysis",
    short: "E-commerce returns analysis",
    client: "Dakhil Commerce",
    industry: "E-commerce",
    category: "SQL & Modelling",
    year: "2025",
    duration: "6 weeks",
    role: "Analyst, with 1 data engineer",
    team: "Ops head, category team",
    tools: ["BigQuery", "SQL", "Looker Studio", "Python", "Google Sheets"],
    img: "parcels",
    summary: "Found that 3 size charts and 1 courier zone caused half of all returns, and gave the ops team a weekly returns tracker.",
    headline: { label: "Return rate", unit: "pct", lowerIsBetter: true },
    metric: { value: "18.4% → 11.2%", label: "return rate" },
    before: { label: "Return rate", value: "18.4%" },
    after: { label: "Return rate", value: "11.2%" },
    problem: "Almost one in five orders was coming back, and each return cost about PKR 420 in courier and handling. The team blamed customers, couriers and suppliers, but nobody had looked at the data by product, size and city together.",
    approach: [
      ["Joined the messy tables", "Linked orders, returns, courier scans and product data in BigQuery: 1.3M orders over 18 months."],
      ["Cohorts by first order", "Tracked customers by the month they first ordered to separate new-buyer returns from repeat-buyer returns."],
      ["Found the drivers", "Three apparel size charts were wrong, and one courier zone marked parcels as refused without trying delivery."],
      ["Tested the fixes", "A/B tested new size guides on 30% of traffic for four weeks before rolling out."],
      ["Built the tracker", "A one-page Looker Studio report the ops team checks every Monday."],
    ],
    results: [["-39%", "returns in 2 quarters"], ["PKR 1.9 Cr", "yearly cost saved"], ["4.6 ★", "app rating, up from 4.1"]],
    quote: ["Hamza showed us the problem was in our own size charts. We would never have guessed.", "Head of Operations, Dakhil Commerce"],
    chart: { fit: [18.4, 11.2], seed: 23, start: 18.6, before: 0.005, after: -0.14, noise: 0.9, season: 0.6 },
    split: [["Wrong size", 38], ["Refused at door", 27], ["Damaged", 14], ["Changed mind", 21]],
    keystats: [["Orders analysed", "1.3M"], ["Cities", "64"], ["A/B test lift", "-22%"]],
  },
  {
    id: "noorani-opd",
    title: "Shorter OPD waiting times for a hospital network",
    short: "Hospital OPD wait times",
    client: "Noorani Health",
    industry: "Healthcare",
    category: "Operations",
    year: "2024",
    duration: "8 weeks",
    role: "Analyst & process consultant",
    team: "Medical director, 3 OPD managers",
    tools: ["Python", "pandas", "Tableau", "Excel", "SQL"],
    img: "hospital",
    summary: "Mapped 210k patient visits minute by minute and rebuilt the doctor roster so peak-hour queues fell by almost half.",
    headline: { label: "Average OPD wait (minutes)", unit: "min", lowerIsBetter: true },
    metric: { value: "74 → 41 min", label: "average wait" },
    before: { label: "Avg. wait", value: "74 min" },
    after: { label: "Avg. wait", value: "41 min" },
    problem: "Patients waited over an hour on average, and complaints were the top reason for bad reviews. Management wanted to hire more doctors, but nobody knew whether the problem was too few doctors or doctors in the wrong hours.",
    approach: [
      ["Timestamped every step", "Used token, billing and consultation logs to rebuild each visit: arrival, billing, vitals, doctor, pharmacy."],
      ["Found the bottleneck", "Queues peaked from 10 to 12 am, while 4 of 11 doctors started their shift at 11."],
      ["Simulated rosters", "Tested 6 roster options in Python before suggesting any change on the floor."],
      ["Live wait board", "A Tableau dashboard on the OPD screen showing queue length per department, updated every 5 minutes."],
    ],
    results: [["-45%", "average waiting time"], ["0", "new doctors hired"], ["+18%", "patients seen per day"]],
    quote: ["We were about to hire three more doctors. We only needed to change the start times.", "Medical Director, Noorani Health"],
    chart: { fit: [74, 41], seed: 37, start: 73, before: 0.02, after: -0.62, noise: 3.2, season: 2.5 },
    split: [["Waiting for doctor", 52], ["Billing queue", 21], ["Vitals", 15], ["Pharmacy", 12]],
    keystats: [["Visits analysed", "210k"], ["Departments", "14"], ["Roster options tested", "6"]],
  },
  {
    id: "rasta-forecast",
    title: "Demand forecasting for a nationwide distributor",
    short: "Inventory demand forecast",
    client: "Rasta Logistics",
    industry: "Logistics & FMCG",
    category: "Forecasting",
    year: "2025",
    duration: "12 weeks",
    role: "Analyst / forecaster",
    team: "Supply chain head, 2 planners",
    tools: ["Python", "Prophet", "SQL", "Power BI", "Excel"],
    img: "warehouse",
    summary: "Weekly SKU-by-warehouse forecasts that brought forecast error from 27% to under 10% and freed up warehouse space.",
    headline: { label: "Forecast error (MAPE %)", unit: "pct", lowerIsBetter: true },
    metric: { value: "27% → 9.8%", label: "forecast error" },
    before: { label: "Forecast error", value: "27%" },
    after: { label: "Forecast error", value: "9.8%" },
    problem: "Planners ordered stock from gut feeling and last year's sales. Some warehouses were overflowing while others ran out, especially around Ramadan and Eid when demand shifts by weeks every year.",
    approach: [
      ["Cleaned 4 years of dispatch data", "Removed one-off bulk orders and filled gaps from system outages."],
      ["Added a local calendar", "Built Ramadan, Eid, school-term and flood-season markers, because the Gregorian calendar alone misses them."],
      ["Forecast by SKU and warehouse", "Prophet models for 1,200 SKUs across 7 warehouses, retrained every Sunday."],
      ["Planner-friendly output", "Forecasts land in Excel and Power BI with a suggested order quantity and a confidence band."],
    ],
    results: [["9.8%", "forecast error, from 27%"], ["-22%", "excess stock held"], ["PKR 4.3 Cr", "working capital freed"]],
    quote: ["For the first time, our Eid stock was right in every city.", "Supply Chain Head, Rasta Logistics"],
    chart: { fit: [27, 9.8], seed: 41, start: 27.5, before: 0.0, after: -0.33, noise: 1.6, season: 1.8 },
    split: [["Beverages", 34], ["Snacks", 26], ["Household", 24], ["Dairy", 16]],
    keystats: [["SKUs", "1,200"], ["Warehouses", "7"], ["Model refresh", "Weekly"]],
  },
  {
    id: "jeb-churn",
    title: "Predicting churn for a mobile wallet app",
    short: "Mobile wallet churn model",
    client: "Jeb Wallet",
    industry: "Fintech",
    category: "Machine Learning",
    year: "2024",
    duration: "9 weeks",
    role: "Analyst, with growth team",
    team: "Growth lead, CRM manager",
    tools: ["Python", "scikit-learn", "XGBoost", "SQL", "Metabase"],
    img: "wallet",
    summary: "A churn-risk score for 900k users, used by the CRM team to send the right offer before a user goes quiet.",
    headline: { label: "Monthly churn rate", unit: "pct", lowerIsBetter: true },
    metric: { value: "7.9% → 5.1%", label: "monthly churn" },
    before: { label: "Monthly churn", value: "7.9%" },
    after: { label: "Monthly churn", value: "5.1%" },
    problem: "The wallet was adding users fast but losing almost 8% of them every month. Cashback offers went to everyone, so most of the budget went to people who would have stayed anyway.",
    approach: [
      ["Defined churn properly", "Agreed with the team: no transaction for 30 days, excluding users who only receive salary."],
      ["Built behaviour features", "Top-up patterns, failed payments, bill-pay usage and support tickets: 64 features per user."],
      ["Trained and explained the model", "XGBoost with 0.86 AUC, plus simple reason codes the CRM team can read."],
      ["Targeted offers", "Only the top 15% risk group gets cashback, with a hold-out group to measure real impact."],
    ],
    results: [["-35%", "monthly churn"], ["-48%", "cashback spend"], ["0.86", "model AUC"]],
    quote: ["We spend half as much on cashback and keep more users. That is the whole business case.", "Growth Lead, Jeb Wallet"],
    chart: { fit: [7.9, 5.1], seed: 53, start: 7.9, before: 0.002, after: -0.055, noise: 0.32, season: 0.25 },
    split: [["Low risk", 61], ["Medium risk", 24], ["High risk", 11], ["Already churned", 4]],
    keystats: [["Users scored", "900k"], ["Features", "64"], ["Scored", "Daily"]],
  },
  {
    id: "saya-oee",
    title: "Production efficiency dashboard for a textile mill",
    short: "Textile mill OEE dashboard",
    client: "Saya Textiles",
    industry: "Manufacturing",
    category: "Dashboards",
    year: "2024",
    duration: "7 weeks",
    role: "Lead analyst",
    team: "Plant manager, shift supervisors",
    tools: ["Power BI", "SQL", "Excel", "Power Automate"],
    img: "textile",
    summary: "Shift-by-shift OEE tracking for 180 looms, so supervisors see downtime reasons the same day instead of at month end.",
    headline: { label: "Overall equipment effectiveness (OEE %)", unit: "pct" },
    metric: { value: "58% → 71%", label: "loom OEE" },
    before: { label: "OEE", value: "58%" },
    after: { label: "OEE", value: "71%" },
    problem: "Downtime was written on paper registers and typed in at month end. By then, nobody remembered why loom 47 stopped for six hours on the 3rd.",
    approach: [
      ["Digitised the registers", "A simple tablet form for supervisors with 9 fixed downtime reasons."],
      ["Calculated OEE properly", "Availability × performance × quality per loom, per shift, matched with the production ledger."],
      ["Shift-end dashboard", "Power BI view on the floor TV and a WhatsApp summary to the plant manager after every shift."],
    ],
    results: [["+13 pts", "OEE in 5 months"], ["-38%", "unplanned downtime"], ["Same day", "downtime reasons, not month end"]],
    quote: ["Now the night shift knows its numbers before going home.", "Plant Manager, Saya Textiles"],
    chart: { fit: [58, 71], seed: 67, start: 57.5, before: 0.01, after: 0.25, noise: 1.5, season: 1.2 },
    split: [["Running", 71], ["Yarn breaks", 12], ["Maintenance", 10], ["Power outage", 7]],
    keystats: [["Looms", "180"], ["Shifts / day", "3"], ["Downtime reasons", "9"]],
  },
];

// rescale so the chart agrees with the before/after numbers shown on the page
function fit(vals, [b, a], golive = 52) {
  const mean = (x) => x.reduce((s, v) => s + v, 0) / x.length;
  const mb = mean(vals.slice(0, golive)), ma = mean(vals.slice(-8));
  const k = (a - b) / (ma - mb), c = b - k * mb;
  return vals.map((v) => +(k * v + c).toFixed(2));
}
PROJECTS.forEach((p) => {
  p.series = series(p.chart);
  if (p.chart.fit) p.series = fit(p.series, p.chart.fit);
  p.volume = volume(p.chart.seed + 7);
});

export const TOOLS = [
  ["SQL", "SQ", "#0e1726", "Window functions, CTEs, query tuning", "7 yrs"],
  ["Power BI", "PB", "#b58a12", "DAX, data modelling, RLS", "5 yrs"],
  ["Python", "Py", "#2b5b84", "pandas, scikit-learn, Prophet", "5 yrs"],
  ["Excel", "Xl", "#1d6b43", "Power Query, pivots, LAMBDA", "8 yrs"],
  ["Tableau", "Tb", "#2c4a7a", "LOD calcs, dashboard design", "3 yrs"],
  ["BigQuery", "BQ", "#3a64c8", "Partitioning, cost control", "3 yrs"],
  ["Looker Studio", "LS", "#4a6fd0", "Marketing & ops reports", "4 yrs"],
  ["dbt", "db", "#c2533c", "Tested, documented models", "2 yrs"],
  ["Airflow", "Af", "#1b7a8c", "Scheduled pipelines", "2 yrs"],
  ["Git", "Gt", "#9b3b2c", "Version control for analysis", "5 yrs"],
  ["Statistics", "Σ", "#4b3c88", "Testing, regression, sampling", "8 yrs"],
  ["Metabase", "Mb", "#4f7bb8", "Self-serve dashboards", "2 yrs"],
];
