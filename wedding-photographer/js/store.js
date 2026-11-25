// Data layer for booking requests.
// With Docker running, everything goes to the real API (/api/...).
// Without a backend (static preview), it runs in "demo mode" using the browser's localStorage,
// pre-filled with sample data, so the enquiry form and admin panel still work end to end.
import { makeSeed, STATUSES } from "./seed-data.js";
export { STATUSES };

const LS_KEY = "dastaan-bookings";
const TOKEN_KEY = "dastaan-admin-token";
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
const json = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export async function isDemo() { return !(await hasApi()); }

const pickFields = (d) => ({
  name: d.name, phone: d.phone, email: d.email || "", type: d.type || "Other", date: d.date || "",
  city: d.city || "", venue: d.venue || "", guests: Number(d.guests) || 0, package: d.package || "",
  budget: d.budget || "", source: d.source || "", message: d.message || "",
  quote: Number(d.quote) || 0, advance: Number(d.advance) || 0, notes: d.notes || "",
});

export async function submitEnquiry(data) {
  const clean = pickFields(data);
  if (await hasApi()) {
    const r = await fetch("/api/enquiry", json("POST", clean));
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not send your enquiry");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), status: "new", createdAt: new Date().toISOString(), ...clean });
  demoSave();
}

// Dates that already have a booked shoot (shown on the enquiry form)
export async function bookedDates() {
  if (await hasApi()) {
    const r = await fetch("/api/booked-dates");
    return r.ok ? r.json() : [];
  }
  return [...new Set(demoList().filter((x) => x.status === "booked").map((x) => x.date))];
}

export async function login(password) {
  if (await hasApi()) {
    const r = await fetch("/api/login", json("POST", { password }));
    if (!r.ok) throw new Error("Wrong password");
    ss.set(TOKEN_KEY, (await r.json()).token);
    return;
  }
  if (password !== DEMO_PASSWORD) throw new Error("Wrong password");
  ss.set(TOKEN_KEY, "demo");
}
export const logout = () => ss.del(TOKEN_KEY);
export const loggedIn = () => !!token();

export async function listEnquiries() {
  if (await hasApi()) {
    const r = await fetch("/api/enquiries", { headers: authHeaders() });
    if (r.status === 401) { logout(); throw new Error("Session expired"); }
    return r.json();
  }
  return [...demoList()];
}

export async function updateEnquiry(id, patch) {
  if (await hasApi()) {
    const r = await fetch("/api/enquiries/" + encodeURIComponent(id), { method: "PATCH", headers: authHeaders(), body: JSON.stringify(patch) });
    if (!r.ok) throw new Error("Update failed");
    return;
  }
  const it = demoList().find((x) => x.id === id);
  if (it) { Object.assign(it, patch); demoSave(); }
}

export async function addEnquiry(data) {
  const clean = { ...pickFields(data), status: STATUSES.includes(data.status) ? data.status : "booked" };
  if (await hasApi()) {
    const r = await fetch("/api/enquiries", { method: "POST", headers: authHeaders(), body: JSON.stringify(clean) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not add");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), createdAt: new Date().toISOString(), ...clean });
  demoSave();
}

export async function removeEnquiry(id) {
  if (await hasApi()) {
    const r = await fetch("/api/enquiries/" + encodeURIComponent(id), { method: "DELETE", headers: authHeaders() });
    if (!r.ok) throw new Error("Delete failed");
    return;
  }
  memory = demoList().filter((x) => x.id !== id);
  demoSave();
}

export function resetDemo() { memory = makeSeed(); demoSave(); }
