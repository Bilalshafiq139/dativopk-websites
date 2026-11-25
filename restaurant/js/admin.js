import { SITE } from "./data.js";
import { STATUSES, isDemo, login, logout, loggedIn, listReservations, updateReservation, addReservation, removeReservation, resetDemo } from "./store.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmt = (t) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };
const dayLabel = (s) => { const t = iso(new Date()); const tm = new Date(); tm.setDate(tm.getDate() + 1); if (s === t) return "Today"; if (s === iso(tm)) return "Tomorrow"; return new Date(s + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); };
const ACTIVE = (r) => !["cancelled", "no-show"].includes(r.status);

let all = [], range = "today", demo = false;

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200); }

async function start() {
  demo = await isDemo();
  if (!loggedIn()) {
    $("#login-view").hidden = false; $("#demo-hint").hidden = !demo;
    $("#login-form").addEventListener("submit", async (e) => {
      e.preventDefault(); $("#login-err").textContent = "";
      try { await login($("#pw").value); $("#login-view").hidden = true; boot(); } catch (ex) { $("#login-err").textContent = ex.message; }
    });
    return;
  }
  boot();
}

function boot() {
  $("#app").hidden = false;
  $("#demo-badge").hidden = !demo; $("#reset-demo").hidden = !demo;
  $("#today").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  $("#status-filter").innerHTML += STATUSES.map((s) => `<option value="${s}">${s[0].toUpperCase() + s.slice(1)}</option>`).join("");
  $("#add-time").innerHTML = SITE.slots.map((s) => `<option value="${s}">${fmt(s)}</option>`).join("");
  $("#add-area").innerHTML = SITE.areas.map((a) => `<option>${a}</option>`).join("");
  $("#logout").onclick = () => { logout(); location.reload(); };
  $("#reset-demo").onclick = async () => { resetDemo(); await load(); toast("Sample data restored"); };
  $$("#range button").forEach((b) => b.addEventListener("click", () => { range = b.dataset.r; $$("#range button").forEach((x) => x.classList.toggle("on", x === b)); render(); }));
  $("#status-filter").onchange = render; $("#search").oninput = render;
  $("#export").onclick = exportCsv;
  $("#add-btn").onclick = () => { const f = $("#add-form"); f.reset(); f.date.value = iso(new Date()); $("#add-err").textContent = ""; $("#add-dlg").showModal(); };
  $("#add-form").addEventListener("submit", async (e) => {
    if (e.submitter?.value !== "save") return;
    e.preventDefault();
    const f = e.target, data = Object.fromEntries(new FormData(f));
    if (!data.name || !data.phone) return ($("#add-err").textContent = "Name and phone are required");
    try { await addReservation(data); $("#add-dlg").close(); await load(); toast("Booking added"); } catch (ex) { $("#add-err").textContent = ex.message; }
  });
  $("#rows").addEventListener("click", onRowClick);
  $("#rows").addEventListener("change", async (e) => {
    if (!e.target.matches(".tbl-in")) return;
    await updateReservation(e.target.dataset.id, { table: e.target.value.trim().slice(0, 8) }); await load(); toast("Table saved");
  });
  load();
}

async function load() {
  try { all = await listReservations(); } catch (ex) { toast(ex.message); setTimeout(() => location.reload(), 1200); return; }
  render();
}

function render() {
  const today = iso(new Date());
  const tod = all.filter((r) => r.date === today);
  const act = tod.filter(ACTIVE);
  const covers = act.reduce((n, r) => n + Number(r.guests || 0), 0);
  const seated = tod.filter((r) => r.status === "seated").reduce((n, r) => n + Number(r.guests || 0), 0);
  const pending = all.filter((r) => r.status === "pending" && r.date >= today).length;
  const noshow = all.filter((r) => r.date < today && r.date >= iso(new Date(Date.now() - 30 * 864e5)));
  const nsRate = noshow.length ? Math.round((noshow.filter((r) => r.status === "no-show").length / noshow.length) * 100) : 0;
  $("#kpis").innerHTML = [
    ["Bookings today", act.length, `${tod.length - act.length} cancelled / no-show`],
    ["Covers today", covers, "guests expected", "hl"],
    ["Seated now", seated, "guests at tables"],
    ["To confirm", pending, "pending requests", pending ? "hl" : ""],
    ["No-show rate", nsRate + "%", "last 30 days"],
  ].map(([l, v, s, c]) => `<div class="kpi ${c || ""}"><span>${l}</span><b>${v}</b><small>${s}</small></div>`).join("");

  // timeline for today
  $("#tl-date").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  $("#timeline").innerHTML = SITE.slots.map((s) => {
    const list = act.filter((r) => r.time === s);
    const cv = list.reduce((n, r) => n + Number(r.guests || 0), 0);
    return `<div class="tl-row"><span class="t">${fmt(s)}</span><div class="chips">${list.map((r) => `<span class="chip ${r.status}" title="${esc(r.area)}">${esc(r.name.split(" ")[0])} · ${r.guests}${r.table ? " · " + esc(r.table) : ""}</span>`).join("") || '<span class="muted" style="font-size:12px">·</span>'}</div><span class="cv">${cv ? cv + " covers" : ""}</span></div>`;
  }).join("");

  // 7-day covers
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return iso(d); });
  const cvs = days.map((d) => all.filter((r) => r.date === d && ACTIVE(r)).reduce((n, r) => n + Number(r.guests || 0), 0));
  const mx = Math.max(10, ...cvs);
  $("#bars").innerHTML = days.map((d, i) => `<div class="bar"><i style="height:${(cvs[i] / mx) * 100}%"></i><b>${cvs[i]}</b><span>${i === 0 ? "Today" : new Date(d + "T00:00").toLocaleDateString("en-GB", { weekday: "short" })}</span></div>`).join("");

  // table
  const st = $("#status-filter").value, q = $("#search").value.trim().toLowerCase();
  let rows = all.filter((r) => range === "all" || (range === "today" ? r.date === today : range === "upcoming" ? r.date > today : r.date < today));
  if (st) rows = rows.filter((r) => r.status === st);
  if (q) rows = rows.filter((r) => [r.name, r.phone, r.notes, r.occasion, r.email].join(" ").toLowerCase().includes(q));
  rows.sort((a, b) => (range === "past" ? -1 : 1) * (a.date + a.time).localeCompare(b.date + b.time));
  $("#empty").hidden = rows.length > 0;
  $("#rows").innerHTML = rows.map((r) => {
    const msg = `Assalam o Alaikum ${r.name.split(" ")[0]}, your table for ${r.guests} at ${SITE.full} is confirmed for ${dayLabel(r.date)} at ${fmt(r.time)}. We look forward to seeing you!`;
    const btns = [];
    if (r.status === "pending") btns.push(["confirmed", "Confirm"]);
    if (["pending", "confirmed"].includes(r.status)) btns.push(["seated", "Seat"], ["no-show", "No-show"], ["cancelled", "Cancel"]);
    if (r.status === "seated") btns.push(["completed", "Done"]);
    return `<tr>
      <td><div class="when">${dayLabel(r.date)}</div><div class="sm">${fmt(r.time)}</div></td>
      <td><div class="nm">${esc(r.name)}</div><div class="sm">${esc(r.phone)}${r.email ? "<br>" + esc(r.email) : ""}</div></td>
      <td>${r.guests}</td>
      <td class="sm">${esc(r.area)}</td>
      <td class="sm">${r.occasion ? `<b style="color:var(--copper)">${esc(r.occasion)}</b><br>` : ""}${esc(r.notes)}</td>
      <td><input class="tbl-in" data-id="${esc(r.id)}" value="${esc(r.table || "")}" placeholder="–" aria-label="Table"></td>
      <td><span class="pill ${r.status}">${r.status}</span></td>
      <td><div class="acts">${btns.map(([s, l]) => `<button data-id="${esc(r.id)}" data-s="${s}">${l}</button>`).join("")}
        <a class="wa" href="https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "92")}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">WhatsApp</a>
        <button data-id="${esc(r.id)}" data-del="1" title="Delete">✕</button></div></td></tr>`;
  }).join("");
}

async function onRowClick(e) {
  const b = e.target.closest("button[data-id]"); if (!b) return;
  if (b.dataset.del) { if (!confirm("Delete this reservation?")) return; await removeReservation(b.dataset.id); await load(); return toast("Deleted"); }
  await updateReservation(b.dataset.id, { status: b.dataset.s }); await load(); toast("Marked " + b.dataset.s);
}

function exportCsv() {
  const cols = ["date", "time", "name", "phone", "email", "guests", "area", "occasion", "notes", "table", "status", "createdAt"];
  const csv = [cols.join(",")].concat(all.map((r) => cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(","))).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `reservations-${iso(new Date())}.csv`; a.click();
}

start();
