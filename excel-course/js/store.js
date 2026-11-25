// Data layer for enquiries/enrolments.
// With Docker running, everything goes to the real API (/api/...).
// Without a backend (static preview) it runs in "demo mode" on localStorage with sample data,
// so the forms and admin panel still work end to end.
import { makeSeed } from "./seed-data.js";

const LS_KEY = "gridline-leads-v2", TOKEN_KEY = "gridline-admin-token", DEMO_PASSWORD = "admin123";
export const STATUSES = ["new", "contacted", "enrolled", "paid", "dropped"];

let apiAvailable;
async function hasApi() {
  if (apiAvailable !== undefined) return apiAvailable;
  try {
    const r = await fetch("/api/health", { cache: "no-store" });
    apiAvailable = r.ok && (r.headers.get("content-type") || "").includes("json");
  } catch { apiAvailable = false; }
  return apiAvailable;
}
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
let memory = null;
function demoList() {
  if (memory) return memory;
  try { memory = JSON.parse(ls.get(LS_KEY) || "null"); } catch { memory = null; }
  if (!Array.isArray(memory)) { memory = makeSeed(); demoSave(); }
  return memory;
}
function demoSave() { ls.set(LS_KEY, JSON.stringify(memory)); }

let memToken = null;
const ss = {
  get(k) { try { return sessionStorage.getItem(k) || memToken; } catch { return memToken; } },
  set(k, v) { memToken = v; try { sessionStorage.setItem(k, v); } catch {} },
  del(k) { memToken = null; try { sessionStorage.removeItem(k); } catch {} },
};
const token = () => ss.get(TOKEN_KEY) || "";
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + token() });

export async function isDemo() { return !(await hasApi()); }

export async function submitLead(data) {
  if (await hasApi()) {
    const r = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not send. Please try WhatsApp.");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), status: "new", notes: "", createdAt: new Date().toISOString(), ...data });
  demoSave();
}

export async function login(password) {
  if (await hasApi()) {
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!r.ok) throw new Error("Wrong password");
    ss.set(TOKEN_KEY, (await r.json()).token); return;
  }
  if (password !== DEMO_PASSWORD) throw new Error("Wrong password");
  ss.set(TOKEN_KEY, "demo");
}
export const logout = () => ss.del(TOKEN_KEY);
export const loggedIn = () => !!token();

export async function listLeads() {
  if (await hasApi()) {
    const r = await fetch("/api/admin/leads", { headers: authHeaders() });
    if (r.status === 401) { logout(); throw new Error("Session expired"); }
    return r.json();
  }
  return [...demoList()];
}
export async function updateLead(id, patch) {
  if (await hasApi()) {
    const r = await fetch("/api/admin/leads/" + encodeURIComponent(id), { method: "PATCH", headers: authHeaders(), body: JSON.stringify(patch) });
    if (!r.ok) throw new Error("Update failed"); return;
  }
  const it = demoList().find(x => x.id === id); if (it) { Object.assign(it, patch); demoSave(); }
}
export async function addLead(data) {
  if (await hasApi()) {
    const r = await fetch("/api/admin/leads", { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not add"); return;
  }
  demoList().unshift({ id: "local-" + Date.now(), createdAt: new Date().toISOString(), notes: "", ...data }); demoSave();
}
export async function removeLead(id) {
  if (await hasApi()) {
    const r = await fetch("/api/admin/leads/" + encodeURIComponent(id), { method: "DELETE", headers: authHeaders() });
    if (!r.ok) throw new Error("Delete failed"); return;
  }
  memory = demoList().filter(x => x.id !== id); demoSave();
}
export function resetDemo() { memory = makeSeed(); demoSave(); }
