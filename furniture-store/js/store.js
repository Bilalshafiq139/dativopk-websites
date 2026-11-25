// Bag, saved pieces and wood preference live in the browser (localStorage).
// Orders, messages and product edits go to the API when the site runs in Docker.
// With no API (static preview) it runs in "demo mode" on localStorage with sample data,
// so checkout and the admin panel still work end to end.
import { PRODUCTS, BRAND, priceFor, woodById, fabricById } from "./data.js";
import { makeSeed, STATUSES, MSG_STATUSES } from "./seed-data.js";
export { STATUSES, MSG_STATUSES };

const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const emit = () => window.dispatchEvent(new CustomEvent("store:change"));

/* ---------- wood preference ---------- */
export const getWood = () => ls.get("lakri-wood", "oak");
export function setWood(id) { ls.set("lakri-wood", id); emit(); }

/* ---------- product overrides (admin edits) ---------- */
let overrides = ls.get("lakri-products-cache", {});
export function products() {
  return PRODUCTS.map((p) => {
    const o = overrides[p.id] || {};
    return { ...p, price: o.price || p.price, status: o.status || "active", featured: o.featured ?? ["noor", "reet", "chand", "dastarkhwan"].includes(p.id) };
  });
}
export const visibleProducts = () => products().filter((p) => p.status !== "paused");
export const productById = (id) => products().find((p) => p.id === id);
export async function loadOverrides() {
  if (await hasApi()) {
    try { const r = await fetch("/api/products"); if (r.ok) { overrides = await r.json(); ls.set("lakri-products-cache", overrides); } } catch {}
  } else {
    overrides = demoDb().products || {};
  }
  emit();
}

/* ---------- bag ---------- */
export const bag = () => ls.get("lakri-bag", []);
const saveBag = (b) => { ls.set("lakri-bag", b); emit(); };
export function addToBag(id, wood, fabric = "", qty = 1) {
  const b = bag(), key = [id, wood, fabric].join("|");
  const f = b.find((x) => x.key === key);
  if (f) f.qty = Math.min(20, f.qty + qty); else b.push({ key, id, wood, fabric, qty });
  saveBag(b);
}
export function setQty(key, qty) { const b = bag(); const f = b.find((x) => x.key === key); if (f) f.qty = Math.max(1, Math.min(20, qty)); saveBag(b); }
export function removeLine(key) { saveBag(bag().filter((x) => x.key !== key)); }
export const clearBag = () => saveBag([]);
export const bagCount = () => bag().reduce((s, x) => s + x.qty, 0);
export function bagLines() {
  return bag().map((x) => {
    const p = productById(x.id);
    if (!p) return null;
    return { ...x, p, unit: priceFor(p, x.wood), woodName: woodById(x.wood).name, fabricName: x.fabric ? fabricById(x.fabric).name : "" };
  }).filter(Boolean);
}
export function totals(whiteGlove = false) {
  const lines = bagLines();
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const delivery = subtotal === 0 || subtotal >= BRAND.freeDeliveryOver ? 0 : BRAND.delivery;
  const wg = whiteGlove && subtotal ? BRAND.whiteGlove : 0;
  return { lines, subtotal, delivery, whiteGlove: wg, total: subtotal + delivery + wg, toFree: Math.max(0, BRAND.freeDeliveryOver - subtotal) };
}

/* ---------- saved ---------- */
export const saved = () => ls.get("lakri-saved", []);
export function toggleSaved(id) { const s = saved(); const i = s.indexOf(id); i >= 0 ? s.splice(i, 1) : s.push(id); ls.set("lakri-saved", s); emit(); return i < 0; }

/* ---------- API / demo db ---------- */
let apiAvailable;
export async function hasApi() {
  if (apiAvailable !== undefined) return apiAvailable;
  try {
    const r = await fetch("/api/health", { cache: "no-store" });
    apiAvailable = r.ok && (r.headers.get("content-type") || "").includes("json");
  } catch { apiAvailable = false; }
  return apiAvailable;
}
export const isDemo = async () => !(await hasApi());

let memDb = null;
function demoDb() {
  if (memDb) return memDb;
  memDb = ls.get("lakri-demo-db", null);
  if (!memDb || !Array.isArray(memDb.orders)) { memDb = makeSeed(); demoSave(); }
  return memDb;
}
const demoSave = () => ls.set("lakri-demo-db", memDb);

export async function placeOrder(form, whiteGlove) {
  const t = totals(whiteGlove);
  if (!t.lines.length) throw new Error("Your bag is empty");
  const payload = {
    ...form,
    items: t.lines.map((l) => ({ id: l.id, name: l.p.name, type: l.p.type, wood: l.woodName, fabric: l.fabricName, qty: l.qty, price: l.unit })),
    whiteGlove: !!whiteGlove,
  };
  let result;
  if (await hasApi()) {
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Could not place the order");
    result = j;
  } else {
    const db = demoDb();
    const last = Math.max(1000, ...db.orders.map((o) => Number(String(o.id).split("-")[1]) || 0));
    result = { id: "LK-" + (last + 1), createdAt: new Date().toISOString(), status: "new", notes: "", ...payload,
      subtotal: t.subtotal, delivery: t.delivery, whiteGlove: t.whiteGlove, total: t.total };
    db.orders.unshift(result); demoSave();
  }
  ls.set("lakri-last-order", result);
  clearBag();
  return result;
}
export const lastOrder = () => ls.get("lakri-last-order", null);

export async function sendMessage(data) {
  const m = { name: data.name, email: data.email, phone: data.phone || "", topic: data.topic || "General", message: data.message };
  if (await hasApi()) {
    const r = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(m) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Could not send");
    return;
  }
  const db = demoDb(); db.messages.unshift({ id: "m" + Date.now(), createdAt: new Date().toISOString(), status: "new", ...m }); demoSave();
}

/* ---------- admin ---------- */
let memToken = null;
const tok = { get() { try { return sessionStorage.getItem("lakri-admin") || memToken; } catch { return memToken; } },
  set(v) { memToken = v; try { sessionStorage.setItem("lakri-admin", v); } catch {} },
  del() { memToken = null; try { sessionStorage.removeItem("lakri-admin"); } catch {} } };
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
  if (await hasApi()) {
    const [orders, messages] = await Promise.all([adminFetch("/admin/orders"), adminFetch("/admin/messages")]);
    return { orders, messages };
  }
  const db = demoDb(); return { orders: db.orders, messages: db.messages };
}
export async function updateOrder(id, patch) {
  if (await hasApi()) return adminFetch("/admin/orders/" + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) });
  const db = demoDb(); const o = db.orders.find((x) => x.id === id); Object.assign(o, patch); demoSave(); return o;
}
export async function updateMessage(id, patch) {
  if (await hasApi()) return adminFetch("/admin/messages/" + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) });
  const db = demoDb(); const m = db.messages.find((x) => x.id === id); Object.assign(m, patch); demoSave(); return m;
}
export async function updateProduct(id, patch) {
  if (await hasApi()) { overrides = await adminFetch("/admin/products/" + encodeURIComponent(id), { method: "PATCH", body: JSON.stringify(patch) }); }
  else { const db = demoDb(); db.products = db.products || {}; db.products[id] = { ...(db.products[id] || {}), ...patch }; demoSave(); overrides = db.products; }
  ls.set("lakri-products-cache", overrides); emit();
}
export function resetDemo() { memDb = makeSeed(); demoSave(); overrides = {}; ls.set("lakri-products-cache", {}); emit(); }
