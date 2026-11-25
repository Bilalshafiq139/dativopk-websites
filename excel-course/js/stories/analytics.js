// Data Analytics story: raw data → cleaning → SQL → chart → insight report
import { runStory, chrome, typer } from "../story-core.js";

const RAW = [
  ["1001", ["2026-03-02"], ["lahore", "Lahore"], ["Ali Raza"], ["4500"]],
  ["1002", ["03/02/2026", "2026-03-02"], ["LHR", "Lahore"], ["Sana M."], ["12000"]],
  ["1002", ["03/02/2026"], ["LHR"], ["Sana M."], ["12000"], "dup"],
  ["1003", ["2026-03-03"], ["Karachi "], ["", "Unknown"], ["8200"]],
  ["1004", ["2026-03-03"], ["karachi", "Karachi"], ["Omar"], ["7,800 PKR", "7800"]],
  ["1005", ["2026-03-04"], ["Islamabad"], ["Hira"], ["3100"]],
  ["1005", ["2026-03-04"], ["Islamabad"], ["Hira"], ["3100"], "dup"],
  ["1006", ["2026/03/05", "2026-03-05"], ["KHI", "Karachi"], ["Zainab"], ["15400"]],
];
const RES = [["Karachi", "19,840", "98.6M", "4,970"], ["Lahore", "16,210", "71.2M", "4,392"], ["Islamabad", "7,430", "38.9M", "5,235"], ["Other", "4,690", "31.4M", "6,695"]];
const SQL = `SELECT city,
       COUNT(*)    AS orders,
       SUM(amount) AS revenue,
       AVG(amount) AS avg_order
FROM   orders_clean
GROUP  BY city
ORDER  BY revenue DESC;`;
const STATUS = [
  ["orders_raw.csv · 48,210 rows", "7 problems highlighted"],
  ["orders_clean · 47,962 rows", "248 duplicates removed"],
  ["Query ran in 0.42 s", "4 rows returned"],
  ["Chart: revenue by city", "Data refreshed today"],
  ["Q1 Sales Review · ready", "Shared with 3 managers"],
];

export function init({ mount, story, onStage }) {
  const c = chrome({ icon: "▤", name: "Analyst Workbench", note: "orders · Q1 2026", tabs: ["Raw data", "Clean", "Query", "Visualise", "Report"] });
  c.el.classList.add("da");
  const cell = (v, i) => {
    const raw = v[0], clean = v[1] ?? v[0], bad = v[1] !== undefined;
    return `<td class="${bad ? "fix" : ""}"><span class="r">${raw || "<i>(blank)</i>"}</span><span class="c">${clean}</span></td>`;
  };
  c.body.innerHTML = `
  <div class="da-table">
    <table><thead><tr><th>order_id</th><th>date</th><th>city</th><th>customer</th><th>amount</th></tr></thead>
    <tbody>${RAW.map(r => `<tr class="${r[5] || ""}"><td>${r[0]}</td>${r.slice(1, 5).map(cell).join("")}</tr>`).join("")}</tbody></table>
    <p class="da-more">… 48,202 more rows</p>
  </div>
  <aside class="da-steps"><b>Applied steps</b>${["Source: orders_raw.csv", "Removed duplicates", "Trimmed &amp; proper-cased city", "Mapped LHR / KHI to city names", "Fixed date format", "Filled blank customers", "Changed amount to number"].map((s, i) => `<span style="--d:${i * 120}ms">${s}</span>`).join("")}</aside>
  <div class="da-sql"><div class="ed"><div class="ln">${SQL.split("\n").map((_, i) => `<i>${i + 1}</i>`).join("")}</div><pre class="code"></pre></div>
    <table class="res"><thead><tr><th>city</th><th>orders</th><th>revenue</th><th>avg_order</th></tr></thead><tbody>${RES.map((r, i) => `<tr style="--d:${i * 90}ms">${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
  <div class="da-chart">
    <div class="pane"><small>Revenue by city (Rs)</small>${RES.map((r, i) => `<div class="hb"><span>${r[0]}</span><i style="--w:${(parseFloat(r[2]) / 98.6 * 100).toFixed(0)}%;--d:${i * 100}ms"${i === 0 ? ' class="top"' : ""}></i><em>${r[2]}</em></div>`).join("")}</div>
    <div class="pane"><small>Orders by weekday</small><div class="cols">${[["Mon", 52], ["Tue", 48], ["Wed", 50], ["Thu", 55], ["Fri", 61], ["Sat", 84], ["Sun", 79]].map(([d, v], i) => `<div><i style="--h:${v}%;--d:${i * 60}ms"${i > 4 ? ' class="top"' : ""}></i><span>${d}</span></div>`).join("")}</div></div>
  </div>
  <div class="da-report">
    <div class="rh"><div><small>Report</small><b>Q1 Sales Review</b></div><span>Prepared by: You · 2 pages</span></div>
    <div class="ins">
      <div><b>41%</b><p>of revenue comes from <strong>Karachi</strong>, with only 30% of the ad spend.</p></div>
      <div><b>2.3×</b><p>Repeat customers spend 2.3 times more than first-time buyers.</p></div>
      <div><b>+28%</b><p>Orders jump on <strong>weekends</strong>, but support staff is lowest then.</p></div>
    </div>
    <div class="rec"><small>Recommendation</small>Move 30% of the ad budget to weekend campaigns in Karachi and launch a repeat-buyer offer.</div>
  </div>`;
  const code = c.body.querySelector(".code");
  const type = typer(code);
  return runStory({
    mount, story, onStage,
    app: {
      el: c.el, stages: 5, width: 820, narrowWidth: 560,
      setStage(n) { c.stage(n); c.status(...STATUS[n]); if (n === 2) type(SQL, 300, 12); },
    },
  });
}
