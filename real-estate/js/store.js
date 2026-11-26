// Saved homes live in the browser. Leads, messages, property submissions and listing edits go to the API
// when the site runs in Docker. Without an API (static preview) it runs in "demo mode" on localStorage.
import { LISTINGS } from "./data.js";
import { makeSeed, LEAD_STATUSES, MSG_STATUSES, SUB_STATUSES } from "./seed-data.js";
export { LEAD_STATUSES, MSG_STATUSES, SUB_STATUSES };

const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const emit = () => window.dispatchEvent(new CustomEvent("store:change"));

/* ---------- listings with admin edits ---------- */
let overrides = ls.get("ae-listings-cache", {});
export function listings() {
  return LISTINGS.map((l) => { const o = overrides[l.id] || {}; return { ...l, price: o.price || l.price, status: o.status || "available", featured: o.featured ?? !!l.tag }; });
}
export const visible = () => listings().filter((l) => l.status !== "hidden");
export const byId = (id) => listings().find((l) => l.id === id);
export async function loadOverrides() {
  if (await hasApi()) { try { const r = await fetch("/api/listings"); if (r.ok) { overrides = await r.json(); ls.set("ae-listings-cache", overrides); } } catch {} }
  else overrides = demoDb().listings || {};
  emit();
}

/* ---------- saved homes ---------- */
export const saved = () => ls.get("ae-saved", []);
export function toggleSaved(id) { const s = saved(); const i = s.indexOf(id); i >= 0 ? s.splice(i, 1) : s.push(id); ls.set("ae-saved", s); emit(); return i < 0; }

/* ---------- API / demo db ---------- */
let apiAvailable;
export async function hasApi() {
  if (apiAvailable !== undefined) return apiAvailable;
  try { const r = await fetch("/api/health", { cache: "no-store" }); apiAvailable = r.ok && (r.headers.get("content-type") || "").includes("json"); }
  catch { apiAvailable = false; }
  return apiAvailable;
}
export const isDemo = async () => !(await hasApi());
let memDb = null;
function demoDb() {
  if (memDb) return memDb;
  memDb = ls.get("ae-demo-db", null);
  if (!memDb || !Array.isArray(memDb.leads)) { memDb = makeSeed(); demoSave(); }
  return memDb;
}
const demoSave = () => ls.set("ae-demo-db", memDb);
async function post(path, body, demo) {
  if (await hasApi()) {
    const r = await fetch("/api" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Could not send, please WhatsApp us instead.");
    return j;
  }
  return demo();
}
// A viewing request, price question or installment plan request for one listing.
export function sendLead(d) {
  const l = byId(d.listing);
  return post("/leads", d, () => {
    const db = demoDb();
    const last = Math.max(3000, ...db.leads.map((x) => Number(String(x.id).split("-")[1]) || 0));
    const o = { id: "AE-" + (last + 1), createdAt: new Date().toISOString(), listingTitle: l ? l.title : "", status: "new", notes: "", agent: "", ...d };
    db.leads.unshift(o); demoSave(); return o;
  });
}
export function sendMessage(d) {
  return post("/messages", d, () => { const db = demoDb(); db.messages.unshift({ id: "m" + Date.now(), createdAt: new Date().toISOString(), status: "new", ...d }); demoSave(); return { ok: true }; });
}
export function sendSubmission(d) {
  return post("/submissions", d, () => { const db = demoDb(); db.submissions.unshift({ id: "s" + Date.now(), createdAt: new Date().toISOString(), status: "new", ...d }); demoSave(); return { ok: true }; });
}

/* ---------- admin ---------- */
let memToken = null;
const tok = { get() { try { return sessionStorage.getItem("ae-admin") || memToken; } catch { return memToken; } },
  set(v) { memToken = v; try { sessionStorage.setItem("ae-admin", v); } catch {} },
  del() { memToken = null; try { sessionStorage.removeItem("ae-admin"); } catch {} } };
const auth = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + (tok.get() || "") });
export const loggedIn = () => !!tok.get();
export const logout = () => tok.del();
export async function login(password) {
  if (await hasApi()) {
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!r.ok) throw new Error("Wrong password");
    tok.set((await r.json()).token); return;
  }
  if (password !== "admin123") throw new Error("Wrong password");
  tok.set("demo");
}
async function adminFetch(path, opts = {}) {
  const r = await fetch("/api" + path, { ...opts, headers: auth() });
  if (r.status === 401) { logout(); throw new Error("Session expired"); }
  if (!r.ok) throw new Error("Request failed");
  return r.json();
}
export async function adminData() {
  if (await hasApi()) { const [leads, messages, submissions] = await Promise.all(["leads", "messages", "submissions"].map((k) => adminFetch("/admin/" + k))); return { leads, messages, submissions }; }
  const db = demoDb(); return { leads: db.leads, messages: db.messages, submissions: db.submissions };
}
export async function updateItem(kind, id, patch) {
  if (await hasApi()) return adminFetch(`/admin/${kind}/` + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) });
  const db = demoDb(); const o = db[kind].find((x) => x.id === id); Object.assign(o, patch); demoSave(); return o;
}
export async function updateListing(id, patch) {
  if (await hasApi()) overrides = await adminFetch("/admin/listings/" + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) });
  else { const db = demoDb(); db.listings = db.listings || {}; db.listings[id] = { ...(db.listings[id] || {}), ...patch }; demoSave(); overrides = db.listings; }
  ls.set("ae-listings-cache", overrides); emit();
}
export function resetDemo() { memDb = makeSeed(); demoSave(); overrides = {}; ls.set("ae-listings-cache", {}); emit(); }
