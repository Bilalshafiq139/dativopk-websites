// Tiny dependency-free API: appointments, busy slots, call-back requests. Data is a JSON file in a Docker volume.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeSeed, APPT_STATUSES, MSG_STATUSES } from "./seed-data.js";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const FILE = path.join(DATA_DIR, "store.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const SERVICE_IDS = new Set(["cut", "colour", "keratin", "bridal", "party", "facial", "nails", "mehndi", "bridal-package"]);

fs.mkdirSync(DATA_DIR, { recursive: true });
let db;
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { db = process.env.SEED === "false" ? { appointments: [], messages: [] } : makeSeed(); save(); }
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
  const u = new URL(req.url, "http://x"), p = u.pathname.replace(/^\/api/, "");
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  try {
    if (req.method === "GET" && p === "/health") return send(res, 200, { ok: true });
    if (req.method === "GET" && p === "/busy") { const d = clean(u.searchParams.get("date"), 10); return send(res, 200, db.appointments.filter((x) => x.status !== "cancelled" && String(x.date).slice(0, 10) === d).map((x) => ({ date: x.date, stylist: x.stylist }))); }
    if (req.method === "POST" && (p === "/appointments" || p === "/messages")) {
      if (limited(ip)) return send(res, 429, { error: "Too many requests, please WhatsApp us instead." });
      const b = await readBody(req);
      const base = { createdAt: new Date().toISOString(), name: clean(b.name, 80), phone: clean(b.phone, 30), status: "new" };
      if (!base.name || !/^[0-9+\-\s]{10,16}$/.test(base.phone)) return send(res, 400, { error: "Please add your name and a valid mobile number." });
      if (p === "/appointments") {
        if (!SERVICE_IDS.has(b.service) || isNaN(Date.parse(b.date))) return send(res, 400, { error: "Please choose a service and a time." });
        const last = Math.max(800, ...db.appointments.map((x) => Number(String(x.id).split("-")[1]) || 0));
        const o = { id: "ZS-" + (last + 1), ...base, service: b.service, sub: clean(b.sub, 80), stylist: clean(b.stylist, 60), date: new Date(b.date).toISOString(), price: Math.max(0, Math.min(1e6, Number(b.price) || 0)), message: clean(b.message, 1000), notes: "" };
        db.appointments.unshift(o); save(); return send(res, 201, o);
      }
      const m = { id: crypto.randomUUID(), ...base, topic: clean(b.topic, 60) || "General", message: clean(b.message, 2000) };
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
      const lists = { appointments: APPT_STATUSES, messages: MSG_STATUSES };
      if (!lists[kind]) return send(res, 404, { error: "Not found" });
      if (req.method === "GET" && !id) return send(res, 200, db[kind]);
      if (req.method === "PATCH") {
        const b = await readBody(req); const o = db[kind].find((x) => x.id === id); if (!o) return send(res, 404, { error: "Not found" });
        if (b.status !== undefined) { if (!lists[kind].includes(b.status)) return send(res, 400, { error: "Bad status" }); o.status = b.status; }
        if (b.notes !== undefined) o.notes = clean(b.notes, 1000);
        save(); return send(res, 200, o);
      }
    }
    send(res, 404, { error: "Not found" });
  } catch { send(res, 400, { error: "Bad request" }); }
}).listen(PORT, () => console.log(`API on :${PORT}`));
