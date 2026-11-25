import { TREATMENTS, DOCTORS, TIMES } from "./data.js";
import { STATUSES, isDemo, login, logout, loggedIn, listAppointments, updateAppointment, addAppointment, removeAppointment, resetDemo } from "./store.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const TODAY = iso(new Date());
const fmtDay = s => new Date(s + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const LABEL = { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled", "no-show": "No-show" };
const shortDoc = d => d === "Any" ? "Any dentist" : d.replace("Dr. ", "Dr ");
const waNum = p => String(p).replace(/\D/g, "").replace(/^0/, "92");

let data = [], tab = "upcoming", demo = false;

function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2200);
}

async function boot() {
  demo = await isDemo();
  $("#demo-hint").hidden = !demo;
  if (!loggedIn()) return showLogin();
  try { data = await listAppointments(); } catch { return showLogin(); }
  $("#login-view").hidden = true; $("#app").hidden = false;
  $("#demo-badge").hidden = !demo; $("#reset-wrap").hidden = !demo;
  $("#today-label").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  render();
}

function showLogin() {
  $("#app").hidden = true; $("#login-view").hidden = false;
  $("#pw").focus();
}

$("#login-form").addEventListener("submit", async e => {
  e.preventDefault();
  $("#login-err").textContent = "";
  try { await login($("#pw").value); $("#pw").value = ""; boot(); }
  catch (ex) { $("#login-err").textContent = ex.message; }
});
$("#logout").onclick = () => { logout(); showLogin(); };

/* ---------- render ---------- */
function render() { kpis(); today(); bars(); mix(); table(); }

function kpis() {
  const t = data.filter(a => a.date === TODAY && !["cancelled", "no-show"].includes(a.status));
  const pend = data.filter(a => a.status === "pending" && a.date >= TODAY);
  const wk = new Date(); wk.setDate(wk.getDate() + 7);
  const week = data.filter(a => a.date >= TODAY && a.date < iso(wk) && !["cancelled", "no-show"].includes(a.status));
  const m = new Date(); m.setDate(m.getDate() - 30);
  const past = data.filter(a => a.date < TODAY && a.date >= iso(m));
  const shows = past.filter(a => a.status === "completed").length;
  const rate = past.length ? Math.round(shows / past.length * 100) : 0;
  const k = [
    ["Today", t.length, `${t.filter(a => a.status === "completed").length} done so far`],
    ["Needs confirming", pend.length, pend.length ? "Call or WhatsApp these" : "All confirmed"],
    ["Next 7 days", week.length, "booked visits"],
    ["Attendance", rate + "%", "last 30 days"],
  ];
  $("#kpis").innerHTML = k.map(([a, b, c]) => `<div class="kpi"><span>${a}</span><b>${b}</b><small>${c}</small></div>`).join("");
}

function today() {
  const list = data.filter(a => a.date === TODAY).sort((a, b) => a.time.localeCompare(b.time));
  $("#today-count").textContent = list.length ? `${list.length} appointment${list.length > 1 ? "s" : ""}` : "";
  $("#today-list").innerHTML = list.length ? list.map(a => `
    <li class="${["completed", "cancelled", "no-show"].includes(a.status) ? "done" : ""}">
      <span class="t">${a.time}</span>
      <div class="p"><b>${esc(a.name)}</b><div>${esc(a.treatment)} · ${esc(shortDoc(a.doctor))}</div></div>
      <div class="acts">
        ${a.status === "pending" ? `<button class="mini go" data-set="confirmed" data-id="${a.id}">Confirm</button>` : ""}
        ${a.status === "confirmed" ? `<button class="mini go" data-set="completed" data-id="${a.id}">Mark done</button><button class="mini" data-set="no-show" data-id="${a.id}">No-show</button>` : ""}
        ${["completed", "cancelled", "no-show"].includes(a.status) ? `<span class="pill">${LABEL[a.status]}</span>` : ""}
      </div>
    </li>`).join("") : `<li class="nothing">No appointments today.</li>`;
}

function bars() {
  const days = [];
  for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() + i); days.push(d); }
  const counts = days.map(d => data.filter(a => a.date === iso(d) && !["cancelled", "no-show"].includes(a.status)).length);
  const max = Math.max(4, ...counts);
  $("#bars").innerHTML = days.map((d, i) => `<div class="bar${d.getDay() === 0 ? " sun" : ""}" title="${fmtDay(iso(d))}: ${counts[i]}"><b>${d.getDay() === 0 ? "–" : counts[i]}</b><i style="height:${counts[i] / max * 100}%"></i><span>${i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" })}</span></div>`).join("");
}

function mix() {
  const m = new Date(); m.setDate(m.getDate() - 30);
  const recent = data.filter(a => a.date >= iso(m));
  const c = {};
  recent.forEach(a => { c[a.treatment] = (c[a.treatment] || 0) + 1; });
  const rows = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(1, ...rows.map(r => r[1]));
  $("#mix").innerHTML = rows.map(([t, n]) => `<li>${esc(t)}<em>${n}</em><i style="--w:${n / max * 100}%"></i></li>`).join("");
}

function filtered() {
  const q = $("#q").value.trim().toLowerCase(), doc = $("#f-doc").value, st = $("#f-status").value;
  let list = data.filter(a => {
    if (tab === "upcoming" && (a.date < TODAY || ["cancelled", "no-show", "completed"].includes(a.status))) return false;
    if (tab === "pending" && a.status !== "pending") return false;
    if (tab === "past" && a.date >= TODAY) return false;
    if (doc && a.doctor !== doc) return false;
    if (st && a.status !== st) return false;
    if (q && !(`${a.name} ${a.phone} ${a.email}`.toLowerCase().includes(q))) return false;
    return true;
  });
  const asc = tab === "upcoming" || tab === "pending";
  return list.sort((a, b) => asc ? (a.date + a.time).localeCompare(b.date + b.time) : (b.date + b.time).localeCompare(a.date + a.time));
}

function table() {
  const counts = {
    upcoming: data.filter(a => a.date >= TODAY && !["cancelled", "no-show", "completed"].includes(a.status)).length,
    pending: data.filter(a => a.status === "pending").length,
  };
  $$("#tabs button").forEach(b => {
    const n = counts[b.dataset.tab];
    b.innerHTML = b.textContent.replace(/\d+$/, "").trim() + (n !== undefined ? `<span class="n">${n}</span>` : "");
  });
  const list = filtered();
  $("#empty").hidden = list.length > 0;
  $("#rows").innerHTML = list.map(a => {
    const msg = `Assalam o Alaikum ${a.name.split(" ")[0]}, this is Mehr Dental Studio confirming your appointment on ${fmtDay(a.date)} at ${a.time} (${a.treatment}). Please reply YES to confirm.`;
    return `<tr class="${a.date === TODAY ? "is-today" : ""}">
      <td class="when"><b>${fmtDay(a.date)}</b><span>${a.time}</span></td>
      <td><b style="font-weight:500">${esc(a.name)}</b><div class="sub">${esc(a.phone)}</div>${a.notes ? `<div class="note">${esc(a.notes)}</div>` : ""}</td>
      <td>${esc(a.treatment)}</td>
      <td>${esc(shortDoc(a.doctor))}</td>
      <td><select class="status" data-id="${a.id}" data-s="${a.status}" aria-label="Status for ${esc(a.name)}">${STATUSES.map(s => `<option value="${s}"${s === a.status ? " selected" : ""}>${LABEL[s]}</option>`).join("")}</select></td>
      <td><div class="row-acts"><a class="mini" href="https://wa.me/${waNum(a.phone)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" title="Send confirmation on WhatsApp">WhatsApp</a><button class="mini" data-del="${a.id}" title="Delete" aria-label="Delete appointment">✕</button></div></td>
    </tr>`;
  }).join("");
}

/* ---------- events ---------- */
async function setStatus(id, status) {
  try {
    await updateAppointment(id, { status });
    const a = data.find(x => x.id === id); if (a) a.status = status;
    render(); toast(`Marked as ${LABEL[status].toLowerCase()}`);
  } catch (e) { toast(e.message); }
}
document.addEventListener("click", async e => {
  const s = e.target.closest("[data-set]");
  if (s) return setStatus(s.dataset.id, s.dataset.set);
  const d = e.target.closest("[data-del]");
  if (d) {
    const a = data.find(x => x.id === d.dataset.del);
    if (!a) return;
    if (!d.dataset.armed) { d.dataset.armed = "1"; d.textContent = "Delete?"; d.classList.add("go"); setTimeout(() => { if (d.isConnected) { delete d.dataset.armed; d.textContent = "✕"; d.classList.remove("go"); } }, 3000); return; }
    try { await removeAppointment(a.id); data = data.filter(x => x.id !== a.id); render(); toast("Deleted"); } catch (ex) { toast(ex.message); }
  }
});
document.addEventListener("change", e => { if (e.target.matches("select.status")) setStatus(e.target.dataset.id, e.target.value); });
$$("#tabs button").forEach(b => b.addEventListener("click", () => {
  tab = b.dataset.tab;
  $$("#tabs button").forEach(x => x.setAttribute("aria-selected", x === b));
  table();
}));
["#q", "#f-doc", "#f-status"].forEach(s => $(s).addEventListener("input", table));
$("#f-doc").innerHTML += DOCTORS.map(d => `<option>${esc(d.name)}</option>`).join("") + `<option value="Any">Any dentist</option>`;
$("#f-status").innerHTML += STATUSES.map(s => `<option value="${s}">${LABEL[s]}</option>`).join("");

$("#export").onclick = () => {
  const cols = ["date", "time", "name", "phone", "email", "treatment", "doctor", "status", "notes", "createdAt"];
  const csv = [cols.join(",")].concat(filtered().map(a => cols.map(c => `"${String(a[c] ?? "").replace(/"/g, '""')}"`).join(","))).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `appointments-${TODAY}.csv` });
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("#reset").onclick = async (e) => { const b = e.currentTarget; if (!b.dataset.armed) { b.dataset.armed = "1"; b.textContent = "Click again to reset"; return; } delete b.dataset.armed; b.textContent = "Reset demo data"; resetDemo(); data = await listAppointments(); render(); toast("Demo data reset"); };

/* new appointment dialog */
const dlg = $("#dlg");
$("#n-treat").innerHTML = TREATMENTS.map(t => `<option>${esc(t.name)}</option>`).join("") + "<option>Tooth pain / emergency</option>";
$("#n-doc").innerHTML = DOCTORS.map(d => `<option>${esc(d.name)}</option>`).join("");
$("#n-time").innerHTML = TIMES.map(t => `<option>${t}</option>`).join("");
$("#new-btn").onclick = () => { $("#new-form").reset(); $("#n-date").value = TODAY; $("#n-err").textContent = ""; dlg.showModal(); $("#n-name").focus(); };
$("#n-cancel").onclick = () => dlg.close();
$("#new-form").addEventListener("submit", async e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target).entries());
  if (!d.name.trim() || !d.phone.trim()) { $("#n-err").textContent = "Name and phone are required."; return; }
  try {
    await addAppointment({ ...d, email: "", status: "confirmed" });
    data = await listAppointments(); dlg.close(); render(); toast("Appointment added");
  } catch (ex) { $("#n-err").textContent = ex.message; }
});

boot();
