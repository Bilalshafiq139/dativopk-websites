// The home-page story: a real-looking Excel window that moves one clear step per scroll.
// 0 empty sheet (A1) → 1 data + =SUM → 2 XLOOKUP + PivotTable → 3 chart → 4 finished dashboard.

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ROWS = 12;
const fmt = n => n.toLocaleString("en-US");

const DATA = [
  ["Jan", "N", "Printer", 14, 18500], ["Jan", "S", "Laptop", 3, 142000],
  ["Feb", "E", "Monitor", 9, 41000], ["Feb", "W", "Printer", 11, 18500],
  ["Mar", "N", "Laptop", 4, 142000], ["Mar", "E", "Printer", 16, 18500],
  ["Apr", "S", "Monitor", 7, 41000], ["Apr", "W", "Laptop", 2, 142000],
];
const TOTAL = DATA.reduce((s, r) => s + r[3] * r[4], 0); // 2,692,500
const REGIONS = [["North", "N"], ["South", "S"], ["East", "E"], ["West", "W"]].map(([name, code]) => {
  const v = DATA.filter(r => r[1] === code).reduce((s, r) => s + r[3] * r[4], 0);
  return { name, code, v, pct: (v / TOTAL * 100).toFixed(1) + "%" };
});

const STAGES = [
  { tab: "Home", sheet: "Sales", ref: "A1", fx: "", cmds: ["Paste", "Bold", "Fill colour", "Number format", "Sort & Filter"], status: "Ready" },
  { tab: "Formulas", sheet: "Sales", ref: "F10", fx: "=SUM(F2:F9)", cmds: ["AutoSum", "Recently Used", "Math & Trig", "Lookup & Reference", "Name Manager"], status: `Sum: ${fmt(TOTAL)}   Count: 8` },
  { tab: "Data", sheet: "Pivot", ref: "B11", fx: "=XLOOKUP(B10, Codes[Code], Codes[Region])", cmds: ["Get Data", "Refresh All", "PivotTable", "Remove Duplicates", "Data Validation"], status: "Ready" },
  { tab: "Insert", sheet: "Pivot", ref: "Chart 1", fx: "=SERIES(Pivot!$B$3, Pivot!$A$4:$A$7, Pivot!$B$4:$B$7, 1)", cmds: ["PivotChart", "Recommended Charts", "Column", "Line", "Slicer"], status: "Ready" },
  { tab: "View", sheet: "Dashboard", ref: "A1", fx: "Sales Dashboard · Jan to Apr", cmds: ["Gridlines  ☐", "Headings  ☐", "Freeze Panes", "Zoom 100%", "New Window"], status: "Ready · Refreshed just now" },
];

// cell contents per stage: { "A1": [text, className] }
function cellsFor(stage) {
  const c = {};
  if (stage === 0) return c;
  if (stage === 1) {
    ["Month", "Region", "Product", "Units", "Price", "Sales"].forEach((h, i) => (c[COLS[i] + 1] = [h, "hd"]));
    DATA.forEach((r, i) => {
      const row = i + 2;
      c["A" + row] = [r[0]]; c["B" + row] = [r[1], "ctr"]; c["C" + row] = [r[2]];
      c["D" + row] = [r[3], "num"]; c["E" + row] = [fmt(r[4]), "num"]; c["F" + row] = [fmt(r[3] * r[4]), "num calc"];
    });
    c.A10 = ["Total", "b"]; c.D10 = [DATA.reduce((s, r) => s + r[3], 0), "num b"]; c.F10 = [fmt(TOTAL), "num b total"];
    return c;
  }
  // pivot sheet (stages 2 and 3)
  c.A1 = ["Sales by region", "b ov"];
  ["Row Labels", "Sum of Sales", "% of Total"].forEach((h, i) => (c[COLS[i] + 3] = [h, "pv-h"]));
  REGIONS.forEach((r, i) => { const row = 4 + i; c["A" + row] = [r.name, "pv"]; c["B" + row] = [fmt(r.v), "num pv"]; c["C" + row] = [r.pct, "num pv"]; });
  c.A8 = ["Grand Total", "pv-t"]; c.B8 = [fmt(TOTAL), "num pv-t"]; c.C8 = ["100.0%", "num pv-t"];
  if (stage === 2) {
    c.A10 = ["Region code", "lk-l"]; c.B10 = ["E", "lk-in ctr"];
    c.A11 = ["Region name", "lk-l"]; c.B11 = ["East", "lk-out"];
  }
  return c;
}

function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

export function initSheetStory({ mount, story, onStage = () => {} }) {
  /* ---------- window chrome ---------- */
  const win = el("div", "xl s0");
  win.innerHTML = `
    <div class="xl-title"><span class="xl-logo">X</span><span class="xl-name">Sales_2026.xlsx</span><span class="xl-saved">Saved</span><span class="xl-win"><i></i><i></i><i></i></span></div>
    <div class="xl-tabs">${["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View"].map(t => `<span data-t="${t}">${t}</span>`).join("")}</div>
    <div class="xl-cmds"></div>
    <div class="xl-fbar"><span class="xl-ref"></span><span class="xl-fx">fx</span><span class="xl-formula"></span></div>
    <div class="xl-body">
      <div class="xl-grid"></div>
      <div class="xl-pane"><b>PivotTable Fields</b><small>Choose fields to add to report:</small>
        <label><i class="on"></i>Region</label><label><i></i>Month</label><label><i></i>Product</label><label><i></i>Units</label><label><i class="on"></i>Sales</label>
        <div class="xl-areas"><span>Rows</span><em>Region</em><span>Values</span><em>Sum of Sales</em></div></div>
      <div class="xl-chart"></div>
      <div class="xl-dash"></div>
    </div>
    <div class="xl-sheets">${["Sales", "Pivot", "Dashboard"].map(s => `<span data-s="${s}">${s}</span>`).join("")}<span class="plus">+</span></div>
    <div class="xl-status"><span class="xl-st"></span><span class="xl-zoom">— ▢ ＋ 100%</span></div>`;
  mount.appendChild(win);

  /* ---------- grid ---------- */
  const grid = win.querySelector(".xl-grid");
  grid.appendChild(el("div", "corner"));
  COLS.forEach(c => grid.appendChild(el("div", "ch", c)));
  const cells = {};
  for (let r = 1; r <= ROWS; r++) {
    grid.appendChild(el("div", "rh", r));
    COLS.forEach(c => { const d = el("div", "cell"); d.dataset.ref = c + r; cells[c + r] = d; grid.appendChild(d); });
  }
  const sel = el("div", "sel"); grid.appendChild(sel);

  /* ---------- chart (stage 3) ---------- */
  const max = Math.max(...REGIONS.map(r => r.v));
  win.querySelector(".xl-chart").innerHTML = `
    <div class="ch-title">Sales by region</div>
    <div class="ch-plot">
      ${[0, 1, 2, 3].map(i => `<span class="gl" style="bottom:${i * 33.3}%"></span>`).join("")}
      ${REGIONS.map((r, i) => `<div class="bar${i === 0 ? " top" : ""}" style="--h:${(r.v / max * 92).toFixed(1)}%;--d:${i * 90}ms"><em>${(r.v / 1e6).toFixed(2)}M</em><i></i><span>${r.name}</span></div>`).join("")}
    </div>`;

  /* ---------- dashboard (stage 4) ---------- */
  const months = [["Jan", 685000], ["Feb", 572500], ["Mar", 864000], ["Apr", 571000]];
  const pts = months.map(([, v], i) => [20 + i * 93, 92 - (v - 500000) / 400000 * 80]);
  const products = [["Laptop", 1278000], ["Printer", 758500], ["Monitor", 656000]];
  let acc = 0;
  const C = 2 * Math.PI * 34;
  const arcs = products.map(([n, v], i) => { const f = v / TOTAL; const a = `<circle r="34" cx="50" cy="50" class="arc a${i}" stroke-dasharray="${(f * C).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-acc * C).toFixed(1)}"/>`; acc += f; return a; }).join("");
  win.querySelector(".xl-dash").innerHTML = `
    <div class="d-head"><div><b>Sales Dashboard</b><small>Jan to Apr 2026 · all regions</small></div>
      <div class="slicer"><span>Region</span><i class="on">All</i><i>North</i><i>South</i><i>East</i><i>West</i></div></div>
    <div class="d-kpis">
      <div class="k hot"><small>Revenue</small><b>Rs 2.69M</b><em>▲ 18.4% vs last year</em></div>
      <div class="k"><small>Units sold</small><b>66</b><em>8 orders</em></div>
      <div class="k"><small>Avg. order</small><b>Rs 336.6k</b><em>▲ 6.1%</em></div>
      <div class="k"><small>Top region</small><b>North</b><em>30.7% of sales</em></div>
    </div>
    <div class="d-row">
      <div class="d-card wide"><small>Monthly sales</small>
        <svg viewBox="0 0 320 110" class="line"><path class="grid" d="M0 92H320M0 52H320M0 12H320"/>
          <path class="area" d="M${pts.map(p => p.join(" ")).join("L")}L${pts[3][0]} 100L${pts[0][0]} 100Z"/>
          <path class="stroke" pathLength="1" d="M${pts.map(p => p.join(" ")).join("L")}"/>
          ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="4"/><text x="${x}" y="108">${months[i][0]}</text>`).join("")}</svg></div>
      <div class="d-card"><small>By region</small>
        <div class="hbars">${REGIONS.map((r, i) => `<div><span>${r.name}</span><i style="--w:${(r.v / max * 100).toFixed(0)}%;--d:${i * 80}ms"${i === 0 ? ' class="top"' : ""}></i></div>`).join("")}</div></div>
      <div class="d-card"><small>By product</small>
        <div class="donut"><svg viewBox="0 0 100 100">${arcs}</svg><ul>${products.map(([n, v], i) => `<li class="l${i}">${n} <b>${(v / TOTAL * 100).toFixed(0)}%</b></li>`).join("")}</ul></div></div>
    </div>`;

  /* ---------- stage switching ---------- */
  const cmds = win.querySelector(".xl-cmds"), refEl = win.querySelector(".xl-ref"), fEl = win.querySelector(".xl-formula"), stEl = win.querySelector(".xl-st");
  const COLW = [80, 86, 88, 66, 96, 104, 128, 136], ROWH = 26, HEADW = 36, HEADH = 24;
  const place = ref => {
    const m = /^([A-H])(\d+)$/.exec(ref); if (!m) { sel.style.opacity = 0; return; }
    const ci = COLS.indexOf(m[1]), r = Number(m[2]);
    sel.style.opacity = 1;
    sel.style.transform = `translate(${HEADW + COLW.slice(0, ci).reduce((a, b) => a + b, 0) - 1}px, ${HEADH + (r - 1) * ROWH - 1}px)`;
    sel.style.width = COLW[ci] + 1 + "px";
  };
  let typing, current = -1;

  function setStage(n) {
    if (n === current) return;
    const prev = current; current = n;
    win.className = "xl s" + n + (win.classList.contains("narrow") ? " narrow" : "");
    const st = STAGES[n];
    win.querySelectorAll(".xl-tabs span").forEach(t => t.classList.toggle("on", t.dataset.t === st.tab));
    win.querySelectorAll(".xl-sheets span").forEach(t => t.classList.toggle("on", t.dataset.s === st.sheet));
    cmds.innerHTML = st.cmds.map((c, i) => `<span${i === 0 && n ? ' class="hit"' : ""}>${c}</span>`).join("");
    refEl.textContent = st.ref; stEl.textContent = st.status;

    // cells: fade the new content in row by row
    const content = cellsFor(n);
    Object.entries(cells).forEach(([ref, d]) => {
      const v = content[ref];
      const row = Number(ref.slice(1)), col = COLS.indexOf(ref[0]);
      d.className = "cell" + (v ? " has " + (v[1] || "") : "");
      d.textContent = v ? v[0] : "";
      d.style.setProperty("--d", (n === 1 ? row * 70 + col * 18 : row * 40) + "ms");
      d.classList.remove("in"); void d.offsetWidth; if (v) d.classList.add("in");
    });
    place(st.ref);

    clearInterval(typing);
    let k = 0; fEl.textContent = "";
    setTimeout(() => {
      typing = setInterval(() => { fEl.textContent = st.fx.slice(0, ++k); if (k >= st.fx.length) clearInterval(typing); }, 18);
    }, n === 1 ? 650 : 250);
    onStage(n, prev);
  }

  /* ---------- scroll → step (every step is the same scroll distance) ---------- */
  const STEP = () => window.innerHeight * 0.85;
  function read() {
    const top = -story.getBoundingClientRect().top;
    const n = Math.max(0, Math.min(STAGES.length - 1, Math.floor((top + STEP() * 0.35) / STEP())));
    setStage(n);
  }
  window.addEventListener("scroll", read, { passive: true });
  window.addEventListener("resize", () => { fit(); read(); });

  // scale the window to the space available
  function fit() {
    const box = mount.getBoundingClientRect();
    const narrow = box.width < 700;
    win.classList.toggle("narrow", narrow);
    const s = Math.min(1.15, box.width / (narrow ? 562 : 822), box.height / 512);
    win.style.setProperty("--s", s.toFixed(3));
  }
  fit(); read();

  return {
    goTo(n) { window.scrollTo({ top: story.offsetTop + n * STEP() + 2, behavior: "smooth" }); },
    count: STAGES.length,
  };
}
