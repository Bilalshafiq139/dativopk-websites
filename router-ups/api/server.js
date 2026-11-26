// Tiny dependency-free API for the store: orders, contact messages and product edits.
// Data is a JSON file in a Docker volume. Prices are re-checked on the server from the catalogue.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeSeed, STATUSES, MSG_STATUSES } from "./seed-data.js";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const FILE = path.join(DATA_DIR, "store.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

// Prices must match js/data.js. Product edits in admin override these.
const BASE = { j10: 4499, j20: 6999, kit: 8299, adapter: 999, plug: 299, cable: 449 };
const SOLD_OUT = new Set([]); // default stock state, admin can change it
const FREE_OVER = 6000, DELIVERY = 250;

fs.mkdirSync(DATA_DIR, { recursive: true });
let db;
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); }
catch { db = process.env.SEED === "false" ? { orders: [], messages: [], products: {} } : makeSeed(); save(); }
db.products ||= {};
function save() { fs.writeFileSync(FILE + ".tmp", JSON.stringify(db, null, 2)); fs.renameSync(FILE + ".tmp", FILE); }

const sign = (exp) => crypto.createHmac("sha256", SECRET).update(String(exp)).digest("hex");
const makeToken = () => { const exp = Date.now() + 12 * 3600 * 1000; return `${exp}.${sign(exp)}`; };
function authed(req) {
  const [exp, sig] = (req.headers.authorization || "").replace("Bearer ", "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = sign(exp);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

const send = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
const clean = (v, max = 300) => String(v ?? "").trim().slice(0, max);
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 50000) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
  });
}
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 8;
}
const priceOf = (id) => db.products[id]?.price || BASE[id];

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const p = url.pathname.replace(/^\/api/, "");
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  try {
    if (req.method === "GET" && p === "/health") return send(res, 200, { ok: true });
    if (req.method === "GET" && p === "/products") return send(res, 200, db.products);

    if (req.method === "POST" && p === "/orders") {
      if (limited(ip)) return send(res, 429, { error: "Too many requests, please WhatsApp us instead." });
      const b = await readBody(req);
      const items = (Array.isArray(b.items) ? b.items : []).slice(0, 30)
        .filter((i) => BASE[i.id] && (db.products[i.id]?.status || (SOLD_OUT.has(i.id) ? "soldout" : "active")) === "active")
        .map((i) => ({ id: i.id, name: clean(i.name, 40), qty: Math.max(1, Math.min(10, Number(i.qty) || 1)), price: priceOf(i.id) }));
      const o = { name: clean(b.name, 80), phone: clean(b.phone, 30), email: clean(b.email, 120), city: clean(b.city, 60),
        address: clean(b.address, 300), notes: clean(b.notes, 1000), payment: clean(b.payment, 60) || "Cash on delivery" };
      if (!items.length || !o.name || !o.phone || !/^\S+@\S+\.\S+$/.test(o.email) || !o.city || !o.address)
        return send(res, 400, { error: "Please fill in your details and add at least one item." });
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const delivery = subtotal >= FREE_OVER ? 0 : DELIVERY;
      const last = Math.max(1000, ...db.orders.map((x) => Number(String(x.id).split("-")[1]) || 0));
      const order = { id: "JG-" + (last + 1), createdAt: new Date().toISOString(), ...o, items, subtotal, delivery, total: subtotal + delivery, notes: o.notes, status: "new" };
      db.orders.unshift(order); save();
      return send(res, 201, order);
    }

    if (req.method === "POST" && p === "/messages") {
      if (limited(ip)) return send(res, 429, { error: "Too many requests, please WhatsApp us instead." });
      const b = await readBody(req);
      const m = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), name: clean(b.name, 80), email: clean(b.email, 120),
        phone: clean(b.phone, 30), topic: clean(b.topic, 60) || "General", message: clean(b.message, 3000), status: "new" };
      if (!m.name || !/^\S+@\S+\.\S+$/.test(m.email) || !m.message) return send(res, 400, { error: "Name, email and message are required" });
      db.messages.unshift(m); save();
      return send(res, 201, { ok: true });
    }

    if (req.method === "POST" && p === "/login") {
      const b = await readBody(req);
      const a = Buffer.from(String(b.password || "")), e = Buffer.from(ADMIN_PASSWORD);
      if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return send(res, 401, { error: "Wrong password" });
      return send(res, 200, { token: makeToken() });
    }

    if (p.startsWith("/admin/")) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const [, , kind, rawId] = p.split("/");
      const id = decodeURIComponent(rawId || "");
      if (req.method === "GET" && kind === "orders" && !id) return send(res, 200, db.orders);
      if (req.method === "GET" && kind === "messages" && !id) return send(res, 200, db.messages);
      if (req.method === "PATCH") {
        const b = await readBody(req);
        if (kind === "orders") {
          const o = db.orders.find((x) => x.id === id); if (!o) return send(res, 404, { error: "Not found" });
          if (b.status !== undefined) { if (!STATUSES.includes(b.status)) return send(res, 400, { error: "Bad status" }); o.status = b.status; }
          if (b.notes !== undefined) o.notes = clean(b.notes, 1000);
          save(); return send(res, 200, o);
        }
        if (kind === "messages") {
          const m = db.messages.find((x) => x.id === id); if (!m) return send(res, 404, { error: "Not found" });
          if (!MSG_STATUSES.includes(b.status)) return send(res, 400, { error: "Bad status" });
          m.status = b.status; save(); return send(res, 200, m);
        }
        if (kind === "products") {
          if (!BASE[id]) return send(res, 404, { error: "Not found" });
          const cur = db.products[id] || {};
          if (b.price !== undefined) cur.price = Math.max(100, Math.min(300000, Math.round(Number(b.price) || BASE[id])));
          if (b.status !== undefined) cur.status = ["paused", "soldout"].includes(b.status) ? b.status : "active";
          if (b.featured !== undefined) cur.featured = !!b.featured;
          db.products[id] = cur; save(); return send(res, 200, db.products);
        }
      }
    }
    send(res, 404, { error: "Not found" });
  } catch {
    send(res, 400, { error: "Bad request" });
  }
}).listen(PORT, () => console.log(`API on :${PORT}`));
