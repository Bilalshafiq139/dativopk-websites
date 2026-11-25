import { SITE, SHOOT_TYPES } from "./data.js";
import * as store from "./store.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pkr = (n) => "PKR " + Number(n || 0).toLocaleString("en-PK");
const short = (n) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(n);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtDate = (s) => s ? new Date(s + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date yet";
const ago = (s) => { const m = Math.round((Date.now() - new Date(s)) / 6e4); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const LABEL = { new: "New", quoted: "Quoted", booked: "Booked", completed: "Completed", declined: "Declined" };

let all = [], tab = "all", openId = null;

function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 2200); }

async function boot() {
  const demo = await store.isDemo();
  $("#demo-hint").hidden = !demo;
  $("#demo-badge").hidden = !demo;
  $("#reset-demo").hidden = !demo;
  if (!store.loggedIn()) { $("#login-view").hidden = false; $("#pw").focus(); return; }
  $("#login-view").hidden = true; $("#app").hidden = false;
  $("#today").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  await load();
}

async function load() {
  try { all = await store.listEnquiries(); }
  catch { $("#app").hidden = true; $("#login-view").hidden = false; return; }
  render();
}

function render() {
  const today = iso(new Date());
  const now = new Date(), monthKey = today.slice(0, 7);
  const in30 = iso(new Date(now.getTime() + 30 * 864e5));
  const newOnes = all.filter((x) => x.status === "new");
  const upcoming = all.filter((x) => x.status === "booked" && x.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const monthValue = all.filter((x) => ["booked", "completed"].includes(x.status) && x.date.startsWith(monthKey)).reduce((s, x) => s + (Number(x.quote) || 0), 0);
  const decided = all.filter((x) => x.status !== "new" && x.status !== "quoted");
  const won = decided.filter((x) => x.status !== "declined").length;
  const quotedValue = all.filter((x) => x.status === "quoted").reduce((s, x) => s + (Number(x.quote) || 0), 0);
  $("#kpis").innerHTML = `
    <div class="kpi hot"><span>New enquiries</span><b>${newOnes.length}</b><small>${newOnes.filter((x) => Date.now() - new Date(x.createdAt) < 864e5).length} in the last 24 hours</small></div>
    <div class="kpi"><span>Shoots in next 30 days</span><b>${upcoming.filter((x) => x.date <= in30).length}</b><small>${upcoming.length} booked in total</small></div>
    <div class="kpi"><span>Booked this month</span><b>${short(monthValue)}</b><small>${pkr(monthValue)}</small></div>
    <div class="kpi"><span>Win rate</span><b>${decided.length ? Math.round((won / decided.length) * 100) : 0}%</b><small>${pkr(quotedValue)} waiting on quotes</small></div>`;

  const counts = Object.fromEntries(store.STATUSES.map((s) => [s, all.filter((x) => x.status === s).length]));
  $("#status-tabs").innerHTML = [["all", "All", all.length], ...store.STATUSES.map((s) => [s, LABEL[s], counts[s]])]
    .map(([k, t, n]) => `<button role="tab" data-t="${k}" class="${tab === k ? "on" : ""}" aria-selected="${tab === k}">${t}<sup>${n}</sup></button>`).join("");

  const q = $("#q").value.trim().toLowerCase(), tf = $("#type-f").value;
  const rows = all.filter((x) => (tab === "all" || x.status === tab) && (!tf || x.type === tf) &&
    (!q || [x.name, x.phone, x.location, x.email].join(" ").toLowerCase().includes(q)));
  $("#rows").innerHTML = rows.map((x) => `<tr data-id="${esc(x.id)}">
      <td>${x.status === "new" ? '<span class="new-dot"></span>' : ""}<b style="display:inline">${esc(x.name)}</b><small>${esc(x.phone)} · ${ago(x.createdAt)}</small></td>
      <td>${esc(x.type)}<small>${esc(x.location || "-")}</small></td>
      <td>${fmtDate(x.date)}</td>
      <td>${x.quote ? `<b>${pkr(x.quote)}</b>` : ""}<small>${esc(x.budget || "No budget given")}</small></td>
      <td><span class="st st-${x.status}">${LABEL[x.status]}</span></td></tr>`).join("");
  $("#empty").hidden = rows.length > 0;

  $("#upcoming").innerHTML = upcoming.slice(0, 6).map((x) => {
    const d = new Date(x.date + "T00:00");
    return `<li data-id="${esc(x.id)}"><div class="day"><b>${d.getDate()}</b><span>${d.toLocaleDateString("en-GB", { month: "short" })}</span></div><div><b>${esc(x.name)}</b><small>${esc(x.type)} · ${esc(x.location)}</small></div></li>`;
  }).join("") || `<li class="none">No booked shoots coming up.</li>`;

  const bars = (key, el) => {
    const c = {}; all.forEach((x) => { const k = x[key] || "Other"; c[k] = (c[k] || 0) + 1; });
    const list = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6), max = list[0]?.[1] || 1;
    $(el).innerHTML = list.map(([k, n]) => `<div class="bar"><div><span>${esc(k)}</span><b>${n}</b></div><i style="--w:${(n / max) * 100}%"></i></div>`).join("");
  };
  bars("source", "#sources"); bars("type", "#types");
  if (openId) openDrawer(openId);
}

function openDrawer(id) {
  const x = all.find((e) => e.id === id);
  if (!x) return closeAll();
  openId = id;
  const wa = `https://wa.me/${x.phone.replace(/\D/g, "").replace(/^0/, "92")}?text=${encodeURIComponent(`Assalam o Alaikum ${x.name.split(" ")[0]}, this is ${SITE.first} from ${SITE.studio}. Thank you for your enquiry about a ${x.type.toLowerCase()}${x.date ? " on " + fmtDate(x.date) : ""}.`)}`;
  $("#d-body").innerHTML = `
    <span class="kicker">${esc(x.type)}</span>
    <h2 id="d-name">${esc(x.name)}</h2>
    <small style="color:var(--muted)">Enquiry received ${new Date(x.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>
    <div class="d-meta">
      <div><span>Phone</span><a href="tel:${esc(x.phone.replace(/\s/g, ""))}">${esc(x.phone)}</a></div>
      <div><span>Email</span>${x.email ? `<a href="mailto:${esc(x.email)}">${esc(x.email)}</a>` : "-"}</div>
      <div><span>Shoot date</span>${fmtDate(x.date)}</div>
      <div><span>Location</span>${esc(x.location || "-")}</div>
      <div><span>Budget</span>${esc(x.budget || "-")}</div>
      <div><span>Found us on</span>${esc(x.source || "-")}</div>
    </div>
    ${x.message ? `<p class="d-msg">&ldquo;${esc(x.message)}&rdquo;</p>` : ""}
    <span class="d-label">Status</span>
    <div class="status-pick">${store.STATUSES.map((s) => `<button data-s="${s}" class="${x.status === s ? "on" : ""}">${LABEL[s]}</button>`).join("")}</div>
    <span class="d-label">Quote (PKR)</span>
    <input type="number" id="d-quote" min="0" step="1000" value="${x.quote || ""}" placeholder="e.g. 180000">
    <span class="d-label">Private notes</span>
    <textarea id="d-notes" rows="3" placeholder="Advance received, outfit ideas, family list...">${esc(x.notes || "")}</textarea>
    <div class="d-actions">
      <button class="btn ink" id="d-save">Save</button>
      <a class="btn" href="${wa}" target="_blank" rel="noopener">Reply on WhatsApp</a>
      <button class="btn danger" id="d-del">Delete</button>
    </div>`;
  const d = $("#drawer"); d.classList.add("open"); d.setAttribute("aria-hidden", "false");
}
function closeAll() { openId = null; document.querySelectorAll(".drawer").forEach((d) => { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); }); }

/* events */
$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#login-err").textContent = "";
  try { await store.login($("#pw").value); boot(); }
  catch (x) { $("#login-err").textContent = x.message; }
});
$("#logout").onclick = () => { store.logout(); location.reload(); };
$("#reset-demo").onclick = () => { store.resetDemo(); load(); toast("Sample data restored"); };
$("#q").addEventListener("input", render);
$("#type-f").innerHTML += SHOOT_TYPES.map((t) => `<option>${t}</option>`).join("");
$("#add-type").innerHTML = SHOOT_TYPES.map((t) => `<option>${t}</option>`).join("");
$("#type-f").addEventListener("change", render);
$("#status-tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { tab = b.dataset.t; render(); } });
$("#rows").addEventListener("click", (e) => { const r = e.target.closest("tr"); if (r) openDrawer(r.dataset.id); });
$("#upcoming").addEventListener("click", (e) => { const r = e.target.closest("li[data-id]"); if (r) openDrawer(r.dataset.id); });
document.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeAll(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
$("#d-body").addEventListener("click", async (e) => {
  const s = e.target.closest("[data-s]");
  if (s) { await store.updateEnquiry(openId, { status: s.dataset.s }); toast(`Marked as ${LABEL[s.dataset.s].toLowerCase()}`); return load(); }
  if (e.target.id === "d-save") { await store.updateEnquiry(openId, { quote: Number($("#d-quote").value) || 0, notes: $("#d-notes").value }); toast("Saved"); return load(); }
  if (e.target.id === "d-del" && confirm("Delete this enquiry? This cannot be undone.")) { await store.removeEnquiry(openId); closeAll(); toast("Enquiry deleted"); return load(); }
});
$("#add-btn").onclick = () => { const m = $("#add-modal"); m.classList.add("open"); m.setAttribute("aria-hidden", "false"); m.querySelector("input").focus(); };
$("#add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#add-err").textContent = "";
  try { await store.addEnquiry(Object.fromEntries(new FormData(e.target))); e.target.reset(); closeAll(); toast("Booking added"); load(); }
  catch (x) { $("#add-err").textContent = x.message; }
});

boot();
