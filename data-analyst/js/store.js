// Data layer for project enquiries.
// With Docker running, everything goes to the real API (/api/...).
// Without a backend (static preview), it runs in "demo mode" using localStorage,
// pre-filled with sample enquiries, so the contact form and admin panel still work end to end.
import { makeSeed, STATUSES, TYPES, BUDGETS } from "./seed-data.js";
export { STATUSES, TYPES, BUDGETS };

const LS_KEY = "hq-analyst-messages";
const TOKEN_KEY = "hq-analyst-admin";
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

const pick = (d) => ({
  name: d.name, company: d.company || "", email: d.email || "", phone: d.phone || "",
  type: d.type || "Not sure yet", budget: d.budget || "", timeline: d.timeline || "",
  sources: d.sources || "", message: d.message || "",
});

export async function submitMessage(data) {
  const clean = pick(data);
  if (await hasApi()) {
    const r = await fetch("/api/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(clean) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not send your message");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), status: "new", quote: 0, notes: "", createdAt: new Date().toISOString(), ...clean });
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

export async function listMessages() {
  if (await hasApi()) {
    const r = await fetch("/api/messages", { headers: authHeaders() });
    if (r.status === 401) { logout(); throw new Error("Session expired"); }
    return r.json();
  }
  return [...demoList()];
}

export async function updateMessage(id, patch) {
  if (await hasApi()) {
    const r = await fetch("/api/messages/" + encodeURIComponent(id), { method: "PATCH", headers: authHeaders(), body: JSON.stringify(patch) });
    if (!r.ok) throw new Error("Update failed");
    return;
  }
  const it = demoList().find((x) => x.id === id);
  if (it) { Object.assign(it, patch); demoSave(); }
}

export async function removeMessage(id) {
  if (await hasApi()) {
    const r = await fetch("/api/messages/" + encodeURIComponent(id), { method: "DELETE", headers: authHeaders() });
    if (!r.ok) throw new Error("Delete failed");
    return;
  }
  memory = demoList().filter((x) => x.id !== id);
  demoSave();
}

export function resetDemo() { memory = makeSeed(); demoSave(); }
