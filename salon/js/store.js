// Appointments and call-back requests go to the API when the site runs in Docker.
// Without an API (static preview) everything runs in "demo mode" on localStorage with sample data.
import { makeSeed, APPT_STATUSES, MSG_STATUSES } from "./seed-data.js";
export { APPT_STATUSES, MSG_STATUSES };
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };

let apiAvailable;
export async function hasApi() {
  if (apiAvailable !== undefined) return apiAvailable;
  try { const r = await fetch("/api/health", { cache: "no-store" }); apiAvailable = r.ok && (r.headers.get("content-type") || "").includes("json"); } catch { apiAvailable = false; }
  return apiAvailable;
}
export const isDemo = async () => !(await hasApi());
let memDb = null;
function db() { if (memDb) return memDb; memDb = ls.get("zs-demo-db", null); if (!memDb || !Array.isArray(memDb.appointments)) { memDb = makeSeed(); save(); } return memDb; }
const save = () => ls.set("zs-demo-db", memDb);
async function post(path, body, demo) {
  if (await hasApi()) { const r = await fetch("/api" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || "Could not send, please WhatsApp us."); return j; }
  return demo();
}
// Busy slots for a day (so the booking page can grey them out).
export async function busySlots(dateStr) {
  let list;
  if (await hasApi()) { try { list = await (await fetch("/api/busy?date=" + encodeURIComponent(dateStr))).json(); } catch { list = []; } }
  else list = db().appointments.filter((x) => x.status !== "cancelled" && x.date.slice(0, 10) === dateStr).map((x) => ({ date: x.date, stylist: x.stylist }));
  return list;
}
export const book = (d) => post("/appointments", d, () => { const x = db(); const last = Math.max(800, ...x.appointments.map((y) => Number(String(y.id).split("-")[1]) || 0)); const o = { id: "ZS-" + (last + 1), createdAt: new Date().toISOString(), status: "new", notes: "", ...d }; x.appointments.unshift(o); save(); return o; });
export const callback = (d) => post("/messages", d, () => { const x = db(); x.messages.unshift({ id: "m" + Date.now(), createdAt: new Date().toISOString(), status: "new", ...d }); save(); return { ok: true }; });

let mem = null;
const tok = { get() { try { return sessionStorage.getItem("zs-admin") || mem; } catch { return mem; } }, set(v) { mem = v; try { sessionStorage.setItem("zs-admin", v); } catch {} }, del() { mem = null; try { sessionStorage.removeItem("zs-admin"); } catch {} } };
const auth = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + (tok.get() || "") });
export const loggedIn = () => !!tok.get();
export const logout = () => tok.del();
export async function login(pw) {
  if (await hasApi()) { const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }); if (!r.ok) throw new Error("Wrong password"); tok.set((await r.json()).token); return; }
  if (pw !== "admin123") throw new Error("Wrong password"); tok.set("demo");
}
async function af(path, opts = {}) { const r = await fetch("/api" + path, { ...opts, headers: auth() }); if (r.status === 401) { logout(); throw new Error("Session expired"); } if (!r.ok) throw new Error("Request failed"); return r.json(); }
export async function adminData() { if (await hasApi()) { const [appointments, messages] = await Promise.all([af("/admin/appointments"), af("/admin/messages")]); return { appointments, messages }; } const x = db(); return { appointments: x.appointments, messages: x.messages }; }
export async function update(kind, id, patch) { if (await hasApi()) return af(`/admin/${kind}/` + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) }); const x = db(); const o = x[kind].find((y) => y.id === id); Object.assign(o, patch); save(); return o; }
export function resetDemo() { memDb = makeSeed(); save(); }
