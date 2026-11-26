// Booking requests, messages and plot status edits go to the API when the site runs in Docker.
// Without an API (static preview) everything runs in "demo mode" on localStorage.
import { PLOTS } from "./data.js";
import { makeSeed, BOOK_STATUSES, MSG_STATUSES } from "./seed-data.js";
export { BOOK_STATUSES, MSG_STATUSES };
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const emit = () => dispatchEvent(new CustomEvent("store:change"));

let overrides = ls.get("iv-plots-cache", {});
export const plots = () => PLOTS.map((p) => ({ ...p, status: overrides[p.id] || p.status }));
export const plotById = (id) => plots().find((p) => p.id === id);
export async function loadOverrides() {
  if (await hasApi()) { try { const r = await fetch("/api/plots"); if (r.ok) { overrides = await r.json(); ls.set("iv-plots-cache", overrides); } } catch {} }
  else overrides = demoDb().plots || {};
  emit();
}

let apiAvailable;
export async function hasApi() {
  if (apiAvailable !== undefined) return apiAvailable;
  try { const r = await fetch("/api/health", { cache: "no-store" }); apiAvailable = r.ok && (r.headers.get("content-type") || "").includes("json"); } catch { apiAvailable = false; }
  return apiAvailable;
}
export const isDemo = async () => !(await hasApi());
let memDb = null;
function demoDb() { if (memDb) return memDb; memDb = ls.get("iv-demo-db", null); if (!memDb || !Array.isArray(memDb.bookings)) { memDb = makeSeed(); save(); } return memDb; }
const save = () => ls.set("iv-demo-db", memDb);
async function post(path, body, demo) {
  if (await hasApi()) { const r = await fetch("/api" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || "Could not send, please call or WhatsApp us."); return j; }
  return demo();
}
export const sendBooking = (d) => post("/bookings", d, () => { const db = demoDb(); const last = Math.max(500, ...db.bookings.map((x) => Number(String(x.id).split("-")[1]) || 0)); const o = { id: "IV-" + (last + 1), createdAt: new Date().toISOString(), status: "new", notes: "", ...d }; db.bookings.unshift(o); save(); return o; });
export const sendMessage = (d) => post("/messages", d, () => { const db = demoDb(); db.messages.unshift({ id: "m" + Date.now(), createdAt: new Date().toISOString(), status: "new", ...d }); save(); return { ok: true }; });

let mem = null;
const tok = { get() { try { return sessionStorage.getItem("iv-admin") || mem; } catch { return mem; } }, set(v) { mem = v; try { sessionStorage.setItem("iv-admin", v); } catch {} }, del() { mem = null; try { sessionStorage.removeItem("iv-admin"); } catch {} } };
const auth = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + (tok.get() || "") });
export const loggedIn = () => !!tok.get();
export const logout = () => tok.del();
export async function login(pw) {
  if (await hasApi()) { const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }); if (!r.ok) throw new Error("Wrong password"); tok.set((await r.json()).token); return; }
  if (pw !== "admin123") throw new Error("Wrong password"); tok.set("demo");
}
async function af(path, opts = {}) { const r = await fetch("/api" + path, { ...opts, headers: auth() }); if (r.status === 401) { logout(); throw new Error("Session expired"); } if (!r.ok) throw new Error("Request failed"); return r.json(); }
export async function adminData() { if (await hasApi()) { const [bookings, messages] = await Promise.all([af("/admin/bookings"), af("/admin/messages")]); return { bookings, messages }; } const db = demoDb(); return { bookings: db.bookings, messages: db.messages }; }
export async function updateItem(kind, id, patch) { if (await hasApi()) return af(`/admin/${kind}/` + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) }); const db = demoDb(); const o = db[kind].find((x) => x.id === id); Object.assign(o, patch); save(); return o; }
export async function setPlot(id, status) {
  if (await hasApi()) overrides = await af("/admin/plots/" + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify({ status }) });
  else { const db = demoDb(); db.plots = db.plots || {}; db.plots[id] = status; save(); overrides = db.plots; }
  ls.set("iv-plots-cache", overrides); emit();
}
export function resetDemo() { memDb = makeSeed(); save(); overrides = {}; ls.set("iv-plots-cache", {}); emit(); }
