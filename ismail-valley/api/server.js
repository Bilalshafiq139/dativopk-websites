// Tiny dependency-free API: plot booking requests, messages and plot status edits. Data is a JSON file in a Docker volume.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeSeed, BOOK_STATUSES, MSG_STATUSES } from "./seed-data.js";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const FILE = path.join(DATA_DIR, "store.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const PLOT_ID = /^[ABCM]-\d{3}$/;

fs.mkdirSync(DATA_DIR, { recursive: true });
let db;
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { db = process.env.SEED === "false" ? { bookings: [], messages: [], plots: {} } : makeSeed(); save(); }
db.plots ||= {};
function save() { fs.writeFileSync(FILE + ".tmp", JSON.stringify(db, null, 2)); fs.renameSync(FILE + ".tmp", FILE); }
const sign = (e) => crypto.createHmac("sha256", SECRET).update(String(e)).digest("hex");
const makeToken = () => { const e = Date.now() + 12 * 36e5; return `${e}.${sign(e)}`; };
function authed(req) { const [e, s] = (req.headers.authorization || "").replace("Bearer ", "").split("."); if (!e || !s || Number(e) < Date.now()) return false; const g = sign(e); return s.length === g.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(g)); }
const send = (res, c, b) => { res.writeHead(c, { "Content-Type": "application/json" }); res.end(JSON.stringify(b)); };
const clean = (v, m = 300) => String(v ?? "").trim().slice(0, m);
const readBody = (req) => new Promise((ok, no) => { let raw = ""; req.on("data", (c) => { raw += c; if (raw.length > 50000) { no(new Error("big")); req.destroy(); } }); req.on("end", () => { try { ok(raw ? JSON.parse(raw) : {}); } catch (e) { no(e); } }); });
const hits = new Map();
const limited = (ip) => { const now = Date.now(), a = (hits.get(ip) || []).filter((t) => now - t < 60000); a.push(now); hits.set(ip, a); return a.length > 8; };

http.createServer(async (req, res) => {
  const p = new URL(req.url, "http://x").pathname.replace(/^\/api/, "");
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  try {
    if (req.method === "GET" && p === "/health") return send(res, 200, { ok: true });
    if (req.method === "GET" && p === "/plots") return send(res, 200, db.plots);
    if (req.method === "POST" && (p === "/bookings" || p === "/messages")) {
      if (limited(ip)) return send(res, 429, { error: "Too many requests, please call us instead." });
      const b = await readBody(req);
      const base = { createdAt: new Date().toISOString(), name: clean(b.name, 80), phone: clean(b.phone, 30), status: "new" };
      if (!base.name || !base.phone) return send(res, 400, { error: "Please add your name and phone number." });
      if (p === "/bookings") {
        const last = Math.max(500, ...db.bookings.map((x) => Number(String(x.id).split("-")[1]) || 0));
        const o = { id: "IV-" + (last + 1), ...base, plot: PLOT_ID.test(b.plot) ? b.plot : "", size: Number(b.size) || 0, city: clean(b.city, 60), plan: clean(b.plan, 60), visit: clean(b.visit, 60), message: clean(b.message, 2000), notes: "" };
        db.bookings.unshift(o); save(); return send(res, 201, o);
      }
      const m = { id: crypto.randomUUID(), ...base, email: clean(b.email, 120), topic: clean(b.topic, 60) || "General", message: clean(b.message, 3000) };
      if (!m.message) return send(res, 400, { error: "Please write a message." });
      db.messages.unshift(m); save(); return send(res, 201, { ok: true });
    }
    if (req.method === "POST" && p === "/login") {
      const b = await readBody(req); const a = Buffer.from(String(b.password || "")), e = Buffer.from(ADMIN_PASSWORD);
      if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return send(res, 401, { error: "Wrong password" });
      return send(res, 200, { token: makeToken() });
    }
    if (p.startsWith("/admin/")) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const [, , kind, raw] = p.split("/"); const id = decodeURIComponent(raw || "");
      if (req.method === "GET" && (kind === "bookings" || kind === "messages") && !id) return send(res, 200, db[kind]);
      if (req.method === "PATCH") {
        const b = await readBody(req);
        if (kind === "plots") { if (!PLOT_ID.test(id) || !["available", "booked", "sold"].includes(b.status)) return send(res, 400, { error: "Bad request" }); db.plots[id] = b.status; save(); return send(res, 200, db.plots); }
        const lists = { bookings: BOOK_STATUSES, messages: MSG_STATUSES };
        if (lists[kind]) {
          const o = db[kind].find((x) => x.id === id); if (!o) return send(res, 404, { error: "Not found" });
          if (b.status !== undefined) { if (!lists[kind].includes(b.status)) return send(res, 400, { error: "Bad status" }); o.status = b.status; }
          if (b.notes !== undefined) o.notes = clean(b.notes, 1000);
          save(); return send(res, 200, o);
        }
      }
    }
    send(res, 404, { error: "Not found" });
  } catch { send(res, 400, { error: "Bad request" }); }
}).listen(PORT, () => console.log(`API on :${PORT}`));
