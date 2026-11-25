// All editable content in one place: brand, contact, batches, plans, curriculum.
export const SITE = {
  name: "Gridline",
  tagline: "Excel, Data Analytics, Machine Learning & Meta Ads",
  phone: "+92 300 0000000",
  whatsapp: "923000000000",
  email: "hello@gridline.pk",
  address: "3rd floor, 21-C Main Boulevard, Gulberg III, Lahore",
  hours: "Mon to Sat, 10:00 to 19:00",
  nextBatch: "12 January",
  seats: 24,
};

export const BATCHES = [
  { id: "jan-weekend", label: "Weekend cohort, starts 12 Jan (Sat & Sun, 11:00 to 14:00)" },
  { id: "jan-evening", label: "Weekday evenings, starts 14 Jan (Tue & Thu, 19:30 to 21:30)" },
  { id: "self-paced", label: "Self-paced, start any day" },
];

export const PLANS = [
  {
    id: "self", name: "Self-paced", price: "From Rs 12,000", per: "one time, per course",
    line: "Recorded lessons and practice files. Learn at your own pace.",
    items: ["Every recorded lesson, lifetime access", "Practice workbooks for every lesson", "Monthly live Q&A call", "Certificate on capstone submission"],
  },
  {
    id: "cohort", name: "Live cohort", price: "From Rs 26,000", per: "6 to 12 weeks, per course", featured: true,
    line: "Small live batches with feedback on your work every week.",
    items: ["Live classes twice a week, max 24 students", "Weekly assignments reviewed by a mentor", "Capstone project on real data", "Everything in Self-paced", "Portfolio review and interview prep"],
  },
  {
    id: "team", name: "Teams", price: "Custom", per: "on-site or online",
    line: "For finance, sales and ops teams who live in spreadsheets.",
    items: ["Curriculum shaped around your own files", "Training at your office or online", "Progress report per participant", "Templates your team keeps using"],
  },
];

// The four chapters of the story are the four parts of the course.
export const PARTS = [
  {
    n: "01", title: "Cells & formulas", weeks: "Weeks 1 and 2", fx: "=SUMIFS(Sales, Region, \"North\")",
    blurb: "The ground floor. Clean tables, references that don't break, and the formulas that do 80% of daily work.",
    lessons: ["Tables, ranges and absolute vs. relative references", "SUM, AVERAGE, COUNTIFS, SUMIFS", "IF, IFS, AND, OR and nested logic", "Text and date functions: TEXT, LEFT, XMATCH, EOMONTH", "Data validation, named ranges and clean structure"],
    project: "Monthly sales register that totals itself",
  },
  {
    n: "02", title: "Lookups & pivots", weeks: "Weeks 3 and 4", fx: "=XLOOKUP(A2, Products[ID], Products[Price])",
    blurb: "Joining data from different sheets and turning thousands of rows into a summary in seconds.",
    lessons: ["VLOOKUP, INDEX/MATCH and XLOOKUP", "Dynamic arrays: FILTER, SORT, UNIQUE", "PivotTables, grouping, calculated fields", "Slicers and timelines", "Power Query: import, clean and append files"],
    project: "Region and product summary from 3 messy files",
  },
  {
    n: "03", title: "Charts & storytelling", weeks: "Weeks 5 and 6", fx: "Insert ▸ Combo chart ▸ Secondary axis",
    blurb: "Picking the right chart, removing the noise, and making the number that matters impossible to miss.",
    lessons: ["Choosing a chart for the question", "Combo, waterfall and variance charts", "Conditional formatting that means something", "Dynamic chart titles and labels", "Data storytelling for managers"],
    project: "One-page performance report for a manager",
  },
  {
    n: "04", title: "Dashboards & automation", weeks: "Weeks 7 and 8", fx: "=CALCULATE([Revenue], SAMEPERIODLASTYEAR(Date))",
    blurb: "Everything comes together: a live, interactive dashboard that refreshes with one click.",
    lessons: ["Data model and relationships with Power Pivot", "DAX measures: CALCULATE, time intelligence", "Interactive dashboard layout and KPIs", "Refresh automation and a first look at Power BI", "Presenting your dashboard"],
    project: "Capstone: a full sales dashboard on real data",
  },
];

export const FAQS = [
  ["Which Excel version do I need?", "Excel 2021 or Microsoft 365 on Windows is best. Mac works for most lessons; we share alternatives where Power Pivot is not available."],
  ["I only know the basics. Is this for me?", "Yes. Week one starts from clean tables and references. If you already use VLOOKUP daily, you will move fast through part one."],
  ["Are classes recorded?", "Every live class is recorded and shared the same night, so a missed class is never a lost class."],
  ["Can I pay in instalments?", "Live cohort fees can be paid in two parts: half at enrolment, half in week four."],
  ["Do I get a certificate?", "Yes, after you submit the capstone dashboard and it passes mentor review."],
];

// The academy's courses. Each course page tells its story in five scroll steps.
export const COURSES = [
  {
    next: "12 Jan", schedule: "Sat & Sun, 11:00 to 14:00", seatsLeft: 9, outcomes: ["Formulas, lookups and PivotTables", "Charts managers understand", "A live, one-click dashboard"], id: "excel", page: "excel.html", name: "Advanced Excel", long: "Advanced Excel for Data Analysis", weeks: 8, self: 14500, cohort: 32000,
    steps: ["Blank sheet", "Formulas", "Lookups & pivots", "Chart", "Dashboard"],
    line: "From your first formula to a live dashboard.",
  },
  {
    next: "19 Jan", schedule: "Tue & Thu, 19:30 to 21:30", seatsLeft: 14, outcomes: ["Clean messy data in repeatable steps", "SQL for real business questions", "Power BI reports with clear insights"], id: "analytics", page: "data-analytics.html", name: "Data Analytics", long: "Data Analytics with SQL & Power BI", weeks: 10, self: 18000, cohort: 38000, story: "analytics",
    steps: ["Raw data", "Clean", "Query", "Visualise", "Report"],
    line: "Turn messy data into decisions people act on.",
    chapters: [
      ["Messy data<span class=\"hl\">.</span>", "Every real dataset arrives like this: duplicates, blanks, three spellings of the same city. Step one is seeing the problems."],
      ["Then it's clean<span class=\"hl\">.</span>", "Power Query and Python clean it in repeatable steps, so next month's file is fixed with one click."],
      ["Then you ask it<span class=\"hl\">.</span>", "SQL turns 48,000 rows into a clear answer: which city, how many orders, how much revenue."],
      ["Then you show it<span class=\"hl\">.</span>", "Charts that make the pattern obvious: Karachi leads, and weekends are where the orders are."],
      ["Then they decide<span class=\"hl\">.</span>", "The finished product: a short report with three insights and a recommendation a manager can act on today."],
    ],
    parts: [["Data foundations", "Spreadsheets to databases, data types, tidy data"], ["Cleaning with Power Query & Python", "pandas, duplicates, missing values, joins"], ["SQL for analysis", "SELECT, GROUP BY, JOINs, window functions"], ["Power BI & storytelling", "Data model, DAX basics, report design, presenting insights"]],
    tools: ["SQL", "Power Query", "Python (pandas)", "Power BI", "Excel"],
  },
  {
    next: "2 Feb", schedule: "Sat, 10:00 to 14:00", seatsLeft: 5, outcomes: ["Python and pandas for data work", "Train and evaluate real models", "Deploy a model people can use"], id: "ml", page: "machine-learning.html", name: "Machine Learning", long: "Practical Machine Learning with Python", weeks: 12, self: 22000, cohort: 45000, story: "ml",
    steps: ["Dataset", "Explore", "Train", "Evaluate", "Predict"],
    line: "Build models that predict, and explain them in plain words.",
    chapters: [
      ["A dataset<span class=\"hl\">.</span>", "Five thousand customers, a few columns, and one question: who is about to leave? Every model starts by loading and reading the data."],
      ["Then a pattern<span class=\"hl\">.</span>", "Plot it and the story appears: customers who leave are new and on high bills. Exploring first saves weeks later."],
      ["Then it learns<span class=\"hl\">.</span>", "Train a gradient boosting model and watch the error fall as it learns from 4,000 examples."],
      ["Then you test it<span class=\"hl\">.</span>", "89% accuracy on customers it never saw, a confusion matrix you can explain, and the features that matter most."],
      ["Then it predicts<span class=\"hl\">.</span>", "The finished product: a model that scores a new customer in milliseconds and tells the team what to do next."],
    ],
    parts: [["Python & data for ML", "NumPy, pandas, visualisation, statistics you actually need"], ["Supervised learning", "Regression, classification, trees, gradient boosting"], ["Evaluation & features", "Train/test split, cross-validation, metrics, feature engineering"], ["Deploying a model", "Saving models, a simple API, a prediction app, capstone"]],
    tools: ["Python", "Jupyter", "pandas", "scikit-learn", "Streamlit"],
  },
  {
    next: "14 Jan", schedule: "Mon & Wed, 19:30 to 21:30", seatsLeft: 11, outcomes: ["Pixel, tracking and audiences set up right", "Creatives and A/B tests that convert", "Lead campaigns with client-ready reports"], id: "ads", page: "meta-ads.html", name: "Meta Ads", long: "Meta Ads for Leads & Sales", weeks: 6, self: 12000, cohort: 26000, story: "ads",
    steps: ["Objective", "Audience", "Creative", "Budget", "Results"],
    line: "Run Facebook & Instagram campaigns that bring leads, not just likes.",
    chapters: [
      ["Pick the goal<span class=\"hl\">.</span>", "Every campaign starts with one objective. Choose Leads and the platform hunts for people who sign up, not just people who scroll."],
      ["Then the people<span class=\"hl\">.</span>", "Location, age and interests shape an audience big enough to scale and narrow enough to convert."],
      ["Then the ad<span class=\"hl\">.</span>", "Copy, headline and a clear call to action, with two versions ready to test against each other."],
      ["Then the budget<span class=\"hl\">.</span>", "Rs 3,000 a day, a 14-day schedule and an A/B split. Publish, and the campaign goes live."],
      ["Then the results<span class=\"hl\">.</span>", "The finished product: 412 leads at Rs 102 each, a clear winning ad, and a report you can show a client."],
    ],
    parts: [["Account & tracking setup", "Business Manager, Pixel, Conversions API, events"], ["Audiences & objectives", "Custom, lookalike and interest audiences, choosing objectives"], ["Creatives that convert", "Hooks, copy, reels, A/B testing"], ["Budgets, scaling & reporting", "Bidding, CBO, scaling rules, client reports"]],
    tools: ["Ads Manager", "Meta Pixel", "Canva", "Lead forms", "Looker Studio"],
  },
];
export const courseById = id => COURSES.find(c => c.id === id);
