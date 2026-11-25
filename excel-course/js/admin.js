import { PLANS, BATCHES, COURSES, courseById } from "./data.js";
import * as store from "./store.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const planName = id => PLANS.find(p => p.id === id)?.name || "";
const fee = l => { const c = courseById(l.course) || COURSES[0]; return l.plan === "self" ? c.self : l.plan === "cohort" ? c.cohort : 0; };
const cname = id => courseById(id)?.name || "";
const batchShort = { "jan-weekend": "Jan weekend", "jan-evening": "Jan evening", "self-paced": "Self-paced" };
const LABEL = { new: "New", contacted: "Contacted", enrolled: "Enrolled", paid: "Paid", dropped: "Dropped" };
let all = [];

async function boot() {
  const demo = await store.isDemo();
  $("#demo-hint").hidden = !demo; $("#demo-badge").hidden = !demo; $("#reset").hidden = !demo;
  if (store.loggedIn()) return showApp();
  $("#login-view").hidden = false;
  $("#pw").focus();
}
$("#login-form").addEventListener("submit", async e => {
  e.preventDefault();
  try { await store.login($("#pw").value); $("#login-view").hidden = true; showApp(); }
  catch (err) { $("#login-err").textContent = err.message; }
});
$("#logout").addEventListener("click", () => { store.logout(); location.reload(); });
$("#reset").addEventListener("click", async () => { if (confirm("Replace all data in this browser with fresh sample data?")) { store.resetDemo(); await load(); } });

async function showApp() {
  $("#app").hidden = false;
  $("#f-status").insertAdjacentHTML("beforeend", store.STATUSES.map(s => `<option value="${s}">${LABEL[s]}</option>`).join(""));
  await load();
}
async function load() {
  try { all = await store.listLeads(); }
  catch (e) { alert(e.message); location.reload(); return; }
  render();
}

function render() {
  const now = Date.now(), day = 864e5;
  const week = all.filter(l => now - new Date(l.createdAt) < 7 * day);
  const paid = all.filter(l => l.status === "paid");
  const revenue = paid.reduce((s, l) => s + fee(l), 0);
  const fresh = all.filter(l => l.status === "new");
  const conv = all.length ? Math.round(all.filter(l => ["enrolled", "paid"].includes(l.status)).length / all.length * 100) : 0;
  $("#kpis").innerHTML = `
    <div class="kpi hot"><span>Waiting for a call</span><b>${fresh.length}</b><small>new leads, oldest first in the list</small></div>
    <div class="kpi"><span>Leads this week</span><b>${week.length}</b><small>${all.length} in total</small></div>
    <div class="kpi"><span>Paid seats</span><b>${paid.length}</b><small>${conv}% of leads enrol</small></div>
    <div class="kpi"><span>Fees collected</span><b>Rs ${(revenue / 1000).toFixed(0)}k</b><small>from paid seats</small></div>`;

  // last 14 days
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 13 + i); return d; });
  const counts = days.map(d => all.filter(l => { const c = new Date(l.createdAt); c.setHours(0, 0, 0, 0); return c.getTime() === d.getTime(); }).length);
  const max = Math.max(1, ...counts);
  $("#lead-sum").textContent = counts.reduce((a, b) => a + b, 0) + " leads";
  $("#bars").innerHTML = days.map((d, i) => `<div class="b${i === 13 ? " today" : ""}" title="${d.toDateString()}: ${counts[i]}"><u>${counts[i] || ""}</u><i style="height:${counts[i] / max * 100}%"></i><em>${d.getDate()}</em></div>`).join("");

  // seats
  $("#seats").innerHTML = ["jan-weekend", "jan-evening"].map(b => {
    const taken = all.filter(l => l.batch === b && ["enrolled", "paid"].includes(l.status));
    const p = taken.filter(l => l.status === "paid").length, e = taken.length - p;
    return `<div class="seat"><div class="seat-h"><b>${batchShort[b]}</b><span class="muted">${taken.length} / 24 · ${p} paid</span></div>
      <div class="seat-track">${[...Array(24)].map((_, i) => `<i class="${i < p ? "paid" : i < p + e ? "on" : ""}"></i>`).join("")}</div></div>`;
  }).join("");

  // pipeline
  const colors = { new: "var(--sun)", contacted: "var(--white)", enrolled: "#7d9188", paid: "var(--ink)", dropped: "var(--paper)" };
  const pc = store.STATUSES.map(s => [s, all.filter(l => l.status === s).length]).filter(([, n]) => n);
  $("#pipe").innerHTML = pc.map(([s, n]) => `<div style="flex:${n};background:${colors[s]};color:${s === "paid" ? "var(--paper)" : "var(--ink)"}" title="${LABEL[s]}: ${n}">${n}</div>`).join("");
  $("#pipe").insertAdjacentHTML("afterend", "");
  document.querySelector(".pipe-legend")?.remove();
  $("#pipe").insertAdjacentHTML("afterend", `<div class="pipe-legend">${pc.map(([s, n]) => `<span style="--c:${colors[s]}">${LABEL[s]} ${n}</span>`).join("")}</div>`);

  renderRows();
}

function renderRows() {
  const q = $("#q").value.trim().toLowerCase(), fs = $("#f-status").value, src = $("#f-source").value;
  const order = { new: 0, contacted: 1, enrolled: 2, paid: 3, dropped: 4 };
  const list = all.filter(l => (!fs || l.status === fs) && (!src || l.source === src) &&
    (!q || [l.name, l.phone, l.email, l.role].join(" ").toLowerCase().includes(q)))
    .sort((a, b) => (order[a.status] - order[b.status]) || (a.status === "new" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)));
  $("#empty").hidden = list.length > 0;
  $("#rows").innerHTML = list.map(l => {
    const d = new Date(l.createdAt);
    return `<tr data-id="${esc(l.id)}">
      <td><span class="nm">${esc(l.name)}</span>${l.source === "contact" ? '<span class="src">Contact</span>' : ""}<span class="sub">${esc(l.phone)}${l.role ? " · " + esc(l.role) : ""}</span></td>
      <td>${l.source === "contact" ? `<span class="sub" style="margin:0;max-width:30ch">“${esc(l.message)}”</span>` : `<b>${esc(cname(l.course))}</b><span class="sub">${esc(planName(l.plan))}${l.batch ? " · " + esc(batchShort[l.batch] || "") : ""}</span>`}</td>
      <td class="hide-sm">${esc(l.level)}</td>
      <td class="hide-sm">${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}<span class="sub">${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></td>
      <td><select class="st" data-s="${l.status}" aria-label="Status">${store.STATUSES.map(s => `<option value="${s}"${s === l.status ? " selected" : ""}>${LABEL[s]}</option>`).join("")}</select></td>
      <td><button class="icon-btn open">Open</button></td>
    </tr>`;
  }).join("");
}
["#q", "#f-status", "#f-source"].forEach(s => $(s).addEventListener("input", renderRows));

$("#rows").addEventListener("change", async e => {
  const sel = e.target.closest(".st"); if (!sel) return;
  const id = sel.closest("tr").dataset.id;
  sel.dataset.s = sel.value;
  await store.updateLead(id, { status: sel.value });
  all.find(l => l.id === id).status = sel.value;
  render();
});
$("#rows").addEventListener("click", e => {
  if (!e.target.closest(".open")) return;
  openLead(all.find(l => l.id === e.target.closest("tr").dataset.id));
});

const dlg = $("#dlg");
function openLead(l) {
  $("#dlg-title").textContent = l.name;
  const wa = "https://wa.me/" + l.phone.replace(/\D/g, "").replace(/^0/, "92") + "?text=" + encodeURIComponent(`Assalam o Alaikum ${l.name.split(" ")[0]}, this is Gridline about your enquiry for the Excel & Data Analytics course.`);
  $("#dlg-body").innerHTML = `<dl>
      <dt>Phone</dt><dd>${esc(l.phone)} · <a class="wa-mini" href="${wa}" target="_blank" rel="noopener">WhatsApp →</a></dd>
      <dt>Email</dt><dd>${esc(l.email) || "—"}</dd>
      <dt>Source</dt><dd>${l.source === "contact" ? "Contact form" : "Seat request"}</dd>
      ${l.course ? `<dt>Course</dt><dd>${esc(courseById(l.course)?.long || l.course)}</dd>` : ""}
      ${l.plan ? `<dt>Plan</dt><dd>${esc(planName(l.plan))}, ${esc(batchShort[l.batch] || "")}</dd>` : ""}
      <dt>Level</dt><dd>${esc(l.level) || "—"}</dd>
      <dt>Role</dt><dd>${esc(l.role) || "—"}</dd>
      ${l.message ? `<dt>Message</dt><dd>${esc(l.message)}</dd>` : ""}
    </dl>
    <div class="field"><label for="d-notes">Notes</label><textarea id="d-notes" rows="3">${esc(l.notes)}</textarea></div>
    <p><button type="button" class="linkbtn" id="d-del">Delete this lead</button></p>`;
  $("#dlg-save").onclick = async ev => { ev.preventDefault(); await store.updateLead(l.id, { notes: $("#d-notes").value }); l.notes = $("#d-notes").value; dlg.close(); };
  $("#d-del").onclick = async () => { if (!confirm("Delete " + l.name + "?")) return; await store.removeLead(l.id); dlg.close(); load(); };
  dlg.showModal();
}

$("#new-btn").addEventListener("click", () => {
  $("#dlg-title").textContent = "Add a lead";
  $("#dlg-body").innerHTML = `
    <div class="two"><div class="field"><label for="n-name">Name</label><input id="n-name" required></div>
    <div class="field"><label for="n-phone">Phone</label><input id="n-phone" required></div></div>
    <div class="field"><label for="n-email">Email</label><input id="n-email" type="email"></div>
    <div class="field"><label for="n-course">Course</label><select id="n-course">${COURSES.map(c => `<option value="${c.id}">${c.long}</option>`).join("")}</select></div>
    <div class="two"><div class="field"><label for="n-plan">Plan</label><select id="n-plan">${PLANS.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}</select></div>
    <div class="field"><label for="n-batch">Batch</label><select id="n-batch">${BATCHES.map(b => `<option value="${b.id}">${batchShort[b.id]}</option>`).join("")}</select></div></div>
    <div class="field"><label for="n-status">Status</label><select id="n-status">${store.STATUSES.map(s => `<option value="${s}"${s === "contacted" ? " selected" : ""}>${LABEL[s]}</option>`).join("")}</select></div>
    <div class="field"><label for="n-notes">Notes</label><textarea id="n-notes" rows="2" placeholder="e.g. walk-in, paid cash"></textarea></div>`;
  $("#n-plan").value = "cohort";
  $("#dlg-save").onclick = async ev => {
    ev.preventDefault();
    const name = $("#n-name").value.trim(), phone = $("#n-phone").value.trim();
    if (!name || !phone) { alert("Name and phone are required"); return; }
    await store.addLead({ source: "enroll", course: $("#n-course").value, name, phone, email: $("#n-email").value.trim(), plan: $("#n-plan").value, batch: $("#n-batch").value, level: "", role: "", message: "", status: $("#n-status").value, notes: $("#n-notes").value });
    dlg.close(); load();
  };
  dlg.showModal();
});

$("#csv-btn").addEventListener("click", () => {
  const cols = ["createdAt", "source", "course", "name", "phone", "email", "plan", "batch", "level", "role", "status", "message", "notes"];
  const csv = [cols.join(",")].concat(all.map(l => cols.map(c => `"${String(l[c] ?? "").replace(/"/g, '""')}"`).join(","))).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `gridline-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(a.href);
});

boot();
