import { COURSES, pkr } from "./courses-data.js";
import * as store from "./store.js";

const $ = (id) => document.getElementById(id);
const byslug = Object.fromEntries(COURSES.map(c => [c.slug, c]));
const STATUS_LABEL = { new: "New", contacted: "Contacted", enrolled: "Enrolled", "not-interested": "Not interested" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

let data = [];
let openId = null;
let sceneStarted = false;

/* ---------- Views ---------- */
async function show() {
  if (store.loggedIn()) {
    try {
      data = await store.listEnrollments();
      $("login-view").hidden = true;
      $("dash-view").hidden = false;
      const demo = await store.isDemo();
      $("mode-badge").textContent = demo ? "Demo mode" : "Live";
      $("mode-badge").classList.toggle("demo", demo);
      $("reset-demo").hidden = !demo;
      render();
      return;
    } catch (e) { toast(e.message); }
  }
  $("dash-view").hidden = true;
  $("login-view").hidden = false;
  $("pw").focus();
  if (!sceneStarted) {
    sceneStarted = true;
    
  }
}

$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("login-err").textContent = "";
  try { await store.login($("pw").value); $("pw").value = ""; show(); }
  catch (err) { $("login-err").textContent = err.message; }
});
$("logout").addEventListener("click", () => { store.logout(); show(); });
$("reset-demo").addEventListener("click", async () => { store.resetDemo(); data = await store.listEnrollments(); render(); toast("Demo data reset"); });

/* ---------- Filters ---------- */
$("f-course").innerHTML = `<option value="">All courses</option>` + COURSES.map(c => `<option value="${c.slug}">${c.title}</option>`).join("");
["q", "f-course", "f-status"].forEach(id => $(id).addEventListener("input", renderTable));

function filtered() {
  const q = $("q").value.trim().toLowerCase();
  const fc = $("f-course").value, fs = $("f-status").value;
  return data.filter(d =>
    (!fc || d.course === fc) && (!fs || d.status === fs) &&
    (!q || [d.name, d.phone, d.email].some(v => String(v || "").toLowerCase().includes(q))));
}

/* ---------- Render ---------- */
function render() { renderKpis(); renderTrend(); renderBars(); renderTable(); }

function renderKpis() {
  const count = (s) => data.filter(d => d.status === s).length;
  const enrolled = data.filter(d => d.status === "enrolled");
  const revenue = enrolled.reduce((sum, d) => sum + (byslug[d.course]?.price || 0), 0);
  const conv = data.length ? Math.round((enrolled.length / data.length) * 100) : 0;
  const week = data.filter(d => Date.now() - new Date(d.createdAt) < 7 * 864e5).length;
  $("kpis").innerHTML = [
    ["Applications", data.length, `${week} in the last 7 days`],
    ["Awaiting a call", count("new"), "Follow up within 24 hours"],
    ["Enrolled", enrolled.length, `${conv}% conversion`],
    ["Fee revenue", pkr(revenue), "From enrolled students"],
  ].map(([l, v, s]) => `<div class="kpi"><span>${l}</span><b>${v}</b><small>${s}</small></div>`).join("");
}

function renderTrend() {
  const days = 14, buckets = Array(days).fill(0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  data.forEach(d => {
    const t = new Date(d.createdAt); t.setHours(0, 0, 0, 0);
    const diff = Math.round((today - t) / 864e5);
    if (diff >= 0 && diff < days) buckets[days - 1 - diff]++;
  });
  const max = Math.max(3, ...buckets), W = 600, H = 170, pad = 12;
  const pts = buckets.map((v, i) => [pad + (i * (W - pad * 2)) / (days - 1), H - pad - (v / max) * (H - pad * 2)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `${line} L${pts.at(-1)[0]} ${H} L${pts[0][0]} ${H} Z`;
  $("trend").innerHTML = `
    <defs>
      
      <linearGradient id="ta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151513" stop-opacity=".10"/><stop offset="1" stop-color="#151513" stop-opacity="0"/></linearGradient>
    </defs>
    ${[0.25, 0.5, 0.75].map(f => `<line x1="0" x2="${W}" y1="${H * f}" y2="${H * f}" stroke="rgba(21,21,19,.08)"/>`).join("")}
    <path d="${area}" fill="url(#ta)"/>
    <path d="${line}" fill="none" stroke="#151513" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#f3f0e8" stroke="#151513" stroke-width="1.5" vector-effect="non-scaling-stroke"><title>${buckets[i]} applications</title></circle>`).join("")}`;
  const total = buckets.reduce((a, b) => a + b, 0);
  $("trend-sub").textContent = `${total} applications in two weeks`;
  const start = new Date(today - (days - 1) * 864e5);
  $("trend-start").textContent = start.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function renderBars() {
  const counts = COURSES.map(c => [c, data.filter(d => d.course === c.slug).length]).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...counts.map(x => x[1]));
  $("bars").innerHTML = counts.map(([c, n]) => `
    <div class="bar-row"><span>${c.title}</span>
      <div class="bar-track"><div class="bar-fill" data-w="${(n / max) * 100}" style="background:${c.color}"></div></div>
      <b>${n}</b></div>`).join("");
  requestAnimationFrame(() => document.querySelectorAll(".bar-fill").forEach(b => b.style.width = b.dataset.w + "%"));
}

function renderTable() {
  const list = filtered();
  $("count").textContent = `Showing ${list.length} of ${data.length} applications`;
  if (!list.length) { $("rows").innerHTML = `<tr><td colspan="7" class="empty">No applications match these filters.</td></tr>`; return; }
  $("rows").innerHTML = list.map(d => {
    const c = byslug[d.course] || { title: d.course, color: "#a29fbf" };
    const when = new Date(d.createdAt);
    return `
    <tr class="row" data-id="${esc(d.id)}">
      <td><div class="who"><b>${esc(d.name)}</b><span>${esc(d.email)}</span></div></td>
      <td><a href="https://wa.me/92${esc(String(d.phone).replace(/\D/g, "").replace(/^0/, ""))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${esc(d.phone)}</a></td>
      <td><span class="course-pill" style="--c:${c.color}"><i></i>${esc(c.title)}</span></td>
      <td>${esc(d.timing)}</td>
      <td title="${when.toLocaleString()}">${when.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
      <td><select class="status-sel s-${esc(d.status)}" data-status="${esc(d.id)}" aria-label="Status">
        ${Object.entries(STATUS_LABEL).map(([v, l]) => `<option value="${v}" ${v === d.status ? "selected" : ""}>${l}</option>`).join("")}
      </select></td>
      <td><button class="icon-btn" data-del="${esc(d.id)}" aria-label="Delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg></button></td>
    </tr>
    ${openId === d.id ? `<tr class="detail"><td colspan="7"><b>Message:</b> ${esc(d.message) || "<i>No message</i>"}</td></tr>` : ""}`;
  }).join("");
}

/* ---------- Row actions ---------- */
$("rows").addEventListener("click", async (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    e.stopPropagation();
    const d = data.find(x => x.id === del.dataset.del);
    if (!confirm(`Delete the application from ${d?.name}?`)) return;
    try { await store.removeEnrollment(del.dataset.del); data = data.filter(x => x.id !== del.dataset.del); render(); toast("Application deleted"); }
    catch (err) { toast(err.message); }
    return;
  }
  if (e.target.closest("select, a")) return;
  const row = e.target.closest("tr.row");
  if (row) { openId = openId === row.dataset.id ? null : row.dataset.id; renderTable(); }
});

$("rows").addEventListener("change", async (e) => {
  const sel = e.target.closest("[data-status]");
  if (!sel) return;
  const d = data.find(x => x.id === sel.dataset.status);
  try {
    await store.setStatus(d.id, sel.value);
    d.status = sel.value;
    render();
    toast(`${d.name} marked as ${STATUS_LABEL[d.status]}`);
  } catch (err) { toast(err.message); }
});

/* ---------- CSV export ---------- */
$("export").addEventListener("click", () => {
  const cols = ["name", "phone", "email", "course", "timing", "status", "createdAt", "message"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...filtered().map(d => cols.map(k => q(k === "course" ? byslug[d.course]?.title || d.course : d[k])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 3000);
}

show();
