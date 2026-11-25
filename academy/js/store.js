// Data layer for enrollments.
// With Docker running, everything goes to the real API (/api/...).
// Without a backend (e.g. static preview), it falls back to "demo mode" in the browser's localStorage,
// pre-filled with sample data, so the admin panel still works end to end.
import { makeSeed } from "./seed-data.js";

const LS_KEY = "nexora-enrollments";
const TOKEN_KEY = "nexora-admin-token";
const DEMO_PASSWORD = "admin123";

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
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
let memory = null;
function demoList() {
  if (memory) return memory;
  const raw = ls.get(LS_KEY);
  try { memory = raw ? JSON.parse(raw) : null; } catch { memory = null; }
  if (!memory) { memory = makeSeed(); demoSave(); }
  return memory;
}
function demoSave() { ls.set(LS_KEY, JSON.stringify(memory)); }

const ss = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return memToken; } },
  set(k, v) { memToken = v; try { sessionStorage.setItem(k, v); } catch {} },
  del(k) { memToken = null; try { sessionStorage.removeItem(k); } catch {} },
};
let memToken = null;
const token = () => ss.get(TOKEN_KEY) || "";
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + token() });

export async function isDemo() { return !(await hasApi()); }

export async function submitEnrollment(data) {
  if (await hasApi()) {
    const r = await fetch("/api/enroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not submit");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), status: "new", createdAt: new Date().toISOString(), ...data });
  demoSave();
}

export async function login(password) {
  if (await hasApi()) {
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!r.ok) throw new Error("Wrong password");
    ss.set(TOKEN_KEY, (await r.json()).token);
    return;
  }
  if (password !== DEMO_PASSWORD) throw new Error("Wrong password");
  ss.set(TOKEN_KEY, "demo");
}
export const logout = () => ss.del(TOKEN_KEY);
export const loggedIn = () => !!token();

export async function listEnrollments() {
  if (await hasApi()) {
    const r = await fetch("/api/enrollments", { headers: authHeaders() });
    if (r.status === 401) { logout(); throw new Error("Session expired"); }
    return r.json();
  }
  return [...demoList()];
}

export async function setStatus(id, status) {
  if (await hasApi()) {
    const r = await fetch("/api/enrollments/" + encodeURIComponent(id), { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }) });
    if (!r.ok) throw new Error("Update failed");
    return;
  }
  const it = demoList().find(x => x.id === id);
  if (it) { it.status = status; demoSave(); }
}

export async function removeEnrollment(id) {
  if (await hasApi()) {
    const r = await fetch("/api/enrollments/" + encodeURIComponent(id), { method: "DELETE", headers: authHeaders() });
    if (!r.ok) throw new Error("Delete failed");
    return;
  }
  memory = demoList().filter(x => x.id !== id);
  demoSave();
}

export function resetDemo() { memory = makeSeed(); demoSave(); }
