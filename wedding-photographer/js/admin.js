import { SITE, CITIES, EVENT_TYPES, PACKAGE_NAMES, rs } from "./data.js";
import * as store from "./store.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lakh = (n) => n >= 1e7 ? (n / 1e7).toFixed(2).replace(/\.?0+$/, "") + " cr" : n >= 1e5 ? (n / 1e5).toFixed(1).replace(/\.0$/, "") + " lakh" : rs(n);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtDate = (s) => s ? new Date(s + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date yet";
const ago = (s) => { const m = Math.max(1, Math.round((Date.now() - new Date(s)) / 6e4)); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const LABEL = { new: "New", quoted: "Quoted", booked: "Booked", completed: "Completed", declined: "Declined" };
const TITLE = { all: "All requests", new: "New requests", quoted: "Waiting on the family", booked: "Booked shaadiyan", completed: "Completed", declined: "Declined" };

let all = [], tab = "all", openId = null;

function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 2200); }

async function boot() {
  const demo = await store.isDemo();
  $("#demo-hint").hidden = !demo;
  $("#demo-badge").hidden = !demo;
  $("#reset-demo").hidden = !demo;
  if (!store.loggedIn()) { $("#login-view").hidden = false; $("#app").hidden = true; $("#pw").focus(); return; }
  $("#login-view").hidden = true; $("#app").hidden = false;
  $("#today").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  await load();
}

async function load() {
  try { all = await store.listEnquiries(); }
  catch { $("#app").hidden = true; $("#login-view").hidden = false; return; }
  render();
}

function render() {
  const today = iso(new Date());
  const in30 = iso(new Date(Date.now() + 30 * 864e5));
  const newOnes = all.filter((x) => x.status === "new");
  const upcoming = all.filter((x) => x.status === "booked" && x.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const bookedValue = all.filter((x) => x.status === "booked").reduce((s, x) => s + (Number(x.quote) || 0), 0);
  const balance = all.filter((x) => x.status === "booked").reduce((s, x) => s + Math.max(0, (Number(x.quote) || 0) - (Number(x.advance) || 0)), 0);
  const advances = all.filter((x) => x.status === "booked").reduce((s, x) => s + (Number(x.advance) || 0), 0);
  const quotedValue = all.filter((x) => x.status === "quoted").reduce((s, x) => s + (Number(x.quote) || 0), 0);
  const decided = all.filter((x) => ["booked", "completed", "declined"].includes(x.status));
  const won = decided.filter((x) => x.status !== "declined").length;

  $("#kpis").innerHTML = `
    <div class="kpi hot"><span>New requests</span><b>${newOnes.length}</b><small>${newOnes.filter((x) => Date.now() - new Date(x.createdAt) < 864e5).length} in the last 24 hours</small></div>
    <div class="kpi"><span>Shaadiyan in next 30 days</span><b>${upcoming.filter((x) => x.date <= in30).length}</b><small>${upcoming.length} booked in total</small></div>
    <div class="kpi"><span>Booked value</span><b>${lakh(bookedValue)}</b><small>${rs(advances)} advance received</small></div>
    <div class="kpi"><span>Balance to collect</span><b>${lakh(balance)}</b><small>Win rate ${decided.length ? Math.round((won / decided.length) * 100) : 0}% · ${lakh(quotedValue)} quoted</small></div>`;

  const counts = Object.fromEntries(store.STATUSES.map((s) => [s, all.filter((x) => x.status === s).length]));
  document.querySelectorAll(".rail nav button").forEach((b) => {
    b.classList.toggle("on", b.dataset.t === tab);
    b.dataset.n = b.dataset.t === "all" ? all.length : counts[b.dataset.t];
  });
  $("#list-title").textContent = TITLE[tab];

  const q = $("#q").value.trim().toLowerCase(), cf = $("#city-f").value;
  const rows = all.filter((x) => (tab === "all" || x.status === tab) && (!cf || x.city === cf) &&
    (!q || [x.name, x.phone, x.venue, x.city, x.email, x.type].join(" ").toLowerCase().includes(q)));
  $("#rows").innerHTML = rows.map((x) => {
    const evs = (x.type || "").split(", ").filter(Boolean);
    return `<tr data-id="${esc(x.id)}" tabindex="0">
      <td>${x.status === "new" ? '<span class="new-dot" title="New"></span>' : ""}<b>${esc(x.name)}</b><small>${esc(x.phone)} · ${ago(x.createdAt)}</small></td>
      <td><div class="ev-chips">${evs.slice(0, 3).map((e) => `<span>${esc(e.split(" /")[0])}</span>`).join("")}${evs.length > 3 ? `<span>+${evs.length - 3}</span>` : ""}</div><small>${esc(x.city || "-")}${x.venue ? " · " + esc(x.venue) : ""}</small></td>
      <td>${fmtDate(x.date)}</td>
      <td>${x.quote ? `<b>${rs(x.quote)}</b><small>${x.advance ? `${rs(x.advance)} advance` : "No advance yet"}</small>` : `<small>${esc(x.budget || "No budget given")}</small>`}</td>
      <td><span class="st st-${x.status}">${LABEL[x.status]}</span></td></tr>`;
  }).join("");
  $("#empty").hidden = rows.length > 0;

  $("#upcoming").innerHTML = upcoming.slice(0, 6).map((x) => {
    const d = new Date(x.date + "T00:00");
    return `<li data-id="${esc(x.id)}"><div class="day"><b>${d.getDate()}</b><span>${d.toLocaleDateString("en-GB", { month: "short" })}</span></div><div><b>${esc(x.name)}</b><small>${esc((x.type || "").replace(/ \/ \w+/g, ""))} · ${esc(x.city)}</small></div></li>`;
  }).join("") || `<li class="none">No booked shaadiyan coming up.</li>`;

  const bars = (key, el) => {
    const c = {}; all.forEach((x) => { const k = x[key] || "Other"; c[k] = (c[k] || 0) + 1; });
    const list = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6), max = list[0]?.[1] || 1;
    $(el).innerHTML = list.map(([k, n]) => `<div class="bar"><div><span>${esc(k)}</span><b>${n}</b></div><i style="--w:${(n / max) * 100}%"></i></div>`).join("");
  };
  bars("city", "#cities"); bars("source", "#sources");
  if (openId) openDrawer(openId);
}

function openDrawer(id) {
  const x = all.find((e) => e.id === id);
  if (!x) return closeAll();
  openId = id;
  const first = x.name.split(" ")[0];
  const wa = `https://wa.me/${x.phone.replace(/\D/g, "").replace(/^0/, "92")}?text=${encodeURIComponent(`Assalam o Alaikum ${first}! ${SITE.name} se baat kar rahe hain. Aap ki ${x.type}${x.date ? " (" + fmtDate(x.date) + ")" : ""} ki request ka shukriya.`)}`;
  const bal = Math.max(0, (Number(x.quote) || 0) - (Number(x.advance) || 0));
  $("#d-body").innerHTML = `
    <span class="kicker">${esc(x.package || "Custom")} · ${esc(x.city || "City not given")}</span>
    <h2 id="d-name">${esc(x.name)}</h2>
    <small class="muted">Request received ${new Date(x.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>
    <div class="ev-chips big">${(x.type || "").split(", ").map((e) => `<span>${esc(e)}</span>`).join("")}</div>
    <div class="d-meta">
      <div><span>Phone</span><a href="tel:${esc(x.phone.replace(/\s/g, ""))}">${esc(x.phone)}</a></div>
      <div><span>Email</span>${x.email ? `<a href="mailto:${esc(x.email)}">${esc(x.email)}</a>` : "-"}</div>
      <div><span>First event</span>${fmtDate(x.date)}</div>
      <div><span>Venue</span>${esc(x.venue || "-")}</div>
      <div><span>Guests</span>${x.guests ? Number(x.guests).toLocaleString("en-IN") : "-"}</div>
      <div><span>Budget</span>${esc(x.budget || "-")}</div>
      <div><span>Found us on</span>${esc(x.source || "-")}</div>
      <div><span>Balance due</span><b>${x.quote ? rs(bal) : "-"}</b></div>
    </div>
    ${x.message ? `<p class="d-msg">&ldquo;${esc(x.message)}&rdquo;</p>` : ""}
    <span class="d-label">Status</span>
    <div class="status-pick">${store.STATUSES.map((s) => `<button data-s="${s}" class="${x.status === s ? "on" : ""}">${LABEL[s]}</button>`).join("")}</div>
    <div class="two">
      <label><span class="d-label">Quote (Rs)</span><input type="number" id="d-quote" min="0" step="1000" value="${x.quote || ""}" placeholder="e.g. 550000"></label>
      <label><span class="d-label">Advance received (Rs)</span><input type="number" id="d-adv" min="0" step="1000" value="${x.advance || ""}" placeholder="e.g. 165000"></label>
    </div>
    <label><span class="d-label">Private notes</span>
    <textarea id="d-notes" rows="3" placeholder="Advance via JazzCash, ladies-only Mehndi, family list...">${esc(x.notes || "")}</textarea></label>
    <div class="d-actions">
      <button class="btn" id="d-save">Save</button>
      <a class="btn wa" href="${wa}" target="_blank" rel="noopener">Reply on WhatsApp</a>
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
$("#city-f").innerHTML += CITIES.map((c) => `<option>${c.name}</option>`).join("");
$("#city-f").addEventListener("change", render);
$("#add-city").innerHTML = CITIES.map((c) => `<option>${c.name}</option>`).join("");
$("#add-pkg").innerHTML = PACKAGE_NAMES.map((c) => `<option>${c}</option>`).join("");
$("#add-events").innerHTML = EVENT_TYPES.map((t, i) => `<label><input type="checkbox" name="events" value="${t}"${i === 1 ? " checked" : ""}><span>${t}</span></label>`).join("");
document.querySelector(".rail nav").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { tab = b.dataset.t; render(); } });
$("#rows").addEventListener("click", (e) => { const r = e.target.closest("tr"); if (r) openDrawer(r.dataset.id); });
$("#rows").addEventListener("keydown", (e) => { if (e.key === "Enter") { const r = e.target.closest("tr"); if (r) openDrawer(r.dataset.id); } });
$("#upcoming").addEventListener("click", (e) => { const r = e.target.closest("li[data-id]"); if (r) openDrawer(r.dataset.id); });
document.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeAll(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
$("#d-body").addEventListener("click", async (e) => {
  const s = e.target.closest("[data-s]");
  if (s) { await store.updateEnquiry(openId, { status: s.dataset.s }); toast(`Marked as ${LABEL[s.dataset.s].toLowerCase()}`); return load(); }
  if (e.target.id === "d-save") { await store.updateEnquiry(openId, { quote: Number($("#d-quote").value) || 0, advance: Number($("#d-adv").value) || 0, notes: $("#d-notes").value }); toast("Saved"); return load(); }
  if (e.target.id === "d-del" && confirm("Delete this request? This cannot be undone.")) { await store.removeEnquiry(openId); closeAll(); toast("Request deleted"); return load(); }
});
$("#add-btn").onclick = () => { const m = $("#add-modal"); m.classList.add("open"); m.setAttribute("aria-hidden", "false"); m.querySelector("input").focus(); };
$("#add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#add-err").textContent = "";
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd);
  data.type = fd.getAll("events").join(", ");
  if (!data.type) { $("#add-err").textContent = "Pick at least one event."; return; }
  try { await store.addEnquiry(data); e.target.reset(); closeAll(); toast("Booking added"); load(); }
  catch (x) { $("#add-err").textContent = x.message; }
});

boot();
