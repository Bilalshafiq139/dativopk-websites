// Free-trial bookings, membership sign-ups and messages.
// With the API (Docker) they go to the server; without it (static preview) they live in localStorage
// with sample data, so the admin panel still works end to end.
import { makeSeed, STATUSES, MSG_STATUSES } from "./seed-data.js";
export { STATUSES, MSG_STATUSES };

const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let apiAvailable;
export async function hasApi() {
  if (apiAvailable !== undefined) return apiAvailable;
  try { const r = await fetch("/api/health", { cache: "no-store" }); apiAvailable = r.ok && (r.headers.get("content-type") || "").includes("json"); }
  catch { apiAvailable = false; }
  return apiAvailable;
}
export const isDemo = async () => !(await hasApi());
let mem = null;
function db() {
  if (mem) return mem;
  mem = ls.get("fj-demo-db", null);
  if (!mem || !Array.isArray(mem.trials)) { mem = makeSeed(); save(); }
  return mem;
}
const save = () => ls.set("fj-demo-db", mem);
const post = async (path, body) => {
  const r = await fetch("/api" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Could not send, please WhatsApp us.");
  return j;
};

// kind: "trials" | "joins" | "messages"
export async function submit(kind, data) {
  const rec = { ...data };
  if (await hasApi()) return post("/" + kind, rec);
  const d = db(); const prefix = kind === "trials" ? "TR" : kind === "joins" ? "MB" : "MS";
  const last = Math.max(100, ...d[kind].map((x) => Number(String(x.id).split("-")[1]) || 0));
  const out = { id: prefix + "-" + (last + 1), createdAt: new Date().toISOString(), status: "new", notes: "", ...rec };
  d[kind].unshift(out); save(); return out;
}
// taken trial slots for a date, so the form can grey them out
export async function takenSlots(date) {
  if (await hasApi()) { try { return await (await fetch("/api/taken?date=" + encodeURIComponent(date))).json(); } catch { return []; } }
  return db().trials.filter((t) => t.date === date && t.status !== "cancelled").map((t) => t.time);
}

/* admin */
let memTok = null;
const tok = { get() { try { return sessionStorage.getItem("fj-admin") || memTok; } catch { return memTok; } },
  set(v) { memTok = v; try { sessionStorage.setItem("fj-admin", v); } catch {} }, del() { memTok = null; try { sessionStorage.removeItem("fj-admin"); } catch {} } };
export const loggedIn = () => !!tok.get();
export const logout = () => tok.del();
export async function login(password) {
  if (await hasApi()) { const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); if (!r.ok) throw new Error("Wrong password"); tok.set((await r.json()).token); return; }
  if (password !== "admin123") throw new Error("Wrong password");
  tok.set("demo");
}
async function af(path, opts = {}) {
  const r = await fetch("/api" + path, { ...opts, headers: { "Content-Type": "application/json", Authorization: "Bearer " + (tok.get() || "") } });
  if (r.status === 401) { logout(); throw new Error("Session expired"); }
  if (!r.ok) throw new Error("Request failed");
  return r.json();
}
export async function adminData() {
  if (await hasApi()) { const [trials, joins, messages] = await Promise.all([af("/admin/trials"), af("/admin/joins"), af("/admin/messages")]); return { trials, joins, messages }; }
  const d = db(); return { trials: d.trials, joins: d.joins, messages: d.messages };
}
export async function update(kind, id, patch) {
  if (await hasApi()) return af(`/admin/${kind}/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
  const d = db(); const x = d[kind].find((r) => r.id === id); Object.assign(x, patch); save(); return x;
}
export function resetDemo() { mem = makeSeed(); save(); }
