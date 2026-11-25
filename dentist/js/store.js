// Data layer for appointments.
// With Docker running, everything goes to the real API (/api/...).
// Without a backend (static preview), it runs in "demo mode" using the browser's localStorage,
// pre-filled with sample data, so the booking form and admin panel still work end to end.
import { makeSeed } from "./seed-data.js";

const LS_KEY = "mehr-appointments";
const TOKEN_KEY = "mehr-admin-token";
const DEMO_PASSWORD = "admin123";
export const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no-show"];

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

export async function submitBooking(data) {
  const clean = {
    name: data.name, phone: data.phone, email: data.email || "", treatment: data.treatment,
    doctor: data.doctor || "Any", date: data.date, time: data.time, notes: data.notes || "",
  };
  if (await hasApi()) {
    const r = await fetch("/api/book", json("POST", clean));
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not send your request");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), status: "pending", createdAt: new Date().toISOString(), ...clean });
  demoSave();
}

// Times already taken on a date (for a given dentist, or fully booked across all dentists).
export async function bookedSlots(date, doctor = "Any") {
  if (await hasApi()) {
    const r = await fetch(`/api/slots?date=${encodeURIComponent(date)}&doctor=${encodeURIComponent(doctor)}`);
    return r.ok ? r.json() : [];
  }
  return takenFrom(demoList(), date, doctor);
}
export function takenFrom(list, date, doctor) {
  const active = list.filter(a => a.date === date && !["cancelled", "no-show"].includes(a.status));
  if (doctor && doctor !== "Any") return active.filter(a => a.doctor === doctor).map(a => a.time);
  const counts = {};
  active.forEach(a => { counts[a.time] = (counts[a.time] || 0) + 1; });
  return Object.keys(counts).filter(t => counts[t] >= 3);
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

export async function listAppointments() {
  if (await hasApi()) {
    const r = await fetch("/api/appointments", { headers: authHeaders() });
    if (r.status === 401) { logout(); throw new Error("Session expired"); }
    return r.json();
  }
  return [...demoList()];
}

export async function updateAppointment(id, patch) {
  if (await hasApi()) {
    const r = await fetch("/api/appointments/" + encodeURIComponent(id), { method: "PATCH", headers: authHeaders(), body: JSON.stringify(patch) });
    if (!r.ok) throw new Error("Update failed");
    return;
  }
  const it = demoList().find(x => x.id === id);
  if (it) { Object.assign(it, patch); demoSave(); }
}

export async function addAppointment(data) {
  if (await hasApi()) {
    const r = await fetch("/api/appointments", { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not add");
    return;
  }
  demoList().unshift({ id: "local-" + Date.now(), createdAt: new Date().toISOString(), status: "confirmed", ...data });
  demoSave();
}

export async function removeAppointment(id) {
  if (await hasApi()) {
    const r = await fetch("/api/appointments/" + encodeURIComponent(id), { method: "DELETE", headers: authHeaders() });
    if (!r.ok) throw new Error("Delete failed");
    return;
  }
  memory = demoList().filter(x => x.id !== id);
  demoSave();
}

export function resetDemo() { memory = makeSeed(); demoSave(); }
