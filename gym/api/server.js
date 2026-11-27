// Tiny dependency-free API for Fajr Athletic Club: free-trial bookings, membership sign-ups, messages and an admin login.
// Data is a JSON file in a Docker volume.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeSeed, STATUSES } from "./seed-data.js";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const FILE = path.join(DATA_DIR, "club.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const PROGRAMS = ["strength", "conditioning", "climb", "mobility", "ladies", "pt"];
const PLANS = ["day", "monthly", "quarter", "annual"];

fs.mkdirSync(DATA_DIR, { recursive: true });
let db;
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { db = process.env.SEED === "false" ? { trials: [], joins: [], messages: [] } : makeSeed(); save(); }
function save() { fs.writeFileSync(FILE + ".tmp", JSON.stringify(db, null, 2)); fs.renameSync(FILE + ".tmp", FILE); }

const sign = (exp) => crypto.createHmac("sha256", SECRET).update(String(exp)).digest("hex");
const makeToken = () => { const exp = Date.now() + 12 * 3600 * 1000; return `${exp}.${sign(exp)}`; };
function authed(req) {
  const [exp, sig] = (req.headers.authorization || "").replace("Bearer ", "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = sign(exp); return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}
const send = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
const clean = (v, max = 300) => String(v ?? "").trim().slice(0, max);
const readBody = (req) => new Promise((resolve, reject) => { let raw = ""; req.on("data", (c) => { raw += c; if (raw.length > 30000) { reject(new Error("too large")); req.destroy(); } }); req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } }); });
const hits = new Map();
const limited = (ip) => { const now = Date.now(), a = (hits.get(ip) || []).filter((t) => now - t < 60000); a.push(now); hits.set(ip, a); return a.length > 8; };
const phoneOk = (p) => /^[0-9+\-\s]{10,16}$/.test(p);
const nextId = (list, prefix) => prefix + "-" + (Math.max(100, ...list.map((x) => Number(String(x.id).split("-")[1]) || 0)) + 1);

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x"), p = url.pathname.replace(/^\/api/, "");
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  try {
    if (req.method === "GET" && p === "/health") return send(res, 200, { ok: true });
    if (req.method === "GET" && p === "/taken") { const d = clean(url.searchParams.get("date"), 10); return send(res, 200, db.trials.filter((t) => t.date === d && t.status !== "cancelled").map((t) => t.time)); }
    if (req.method === "POST" && ["/trials", "/joins", "/messages"].includes(p)) {
      if (limited(ip)) return send(res, 429, { error: "Too many requests, please WhatsApp us instead." });
      const b = await readBody(req), base = { createdAt: new Date().toISOString(), status: "new", notes: "", name: clean(b.name, 80), phone: clean(b.phone, 30) };
      if (base.name.length < 2) return send(res, 400, { error: "Please add your name." });
      if (p === "/trials") {
        const t = { ...base, goal: clean(b.goal, 60), program: clean(b.program, 20), date: clean(b.date, 10), time: clean(b.time, 5) };
        if (!phoneOk(t.phone) || !PROGRAMS.includes(t.program) || !/^\d{4}-\d{2}-\d{2}$/.test(t.date) || !/^\d{2}:\d{2}$/.test(t.time)) return send(res, 400, { error: "Please choose a class, day and time and add your mobile number." });
        if (db.trials.some((x) => x.date === t.date && x.time === t.time && x.program === t.program && x.status !== "cancelled" && x.phone === t.phone)) return send(res, 409, { error: "You already booked this class." });
        const out = { id: nextId(db.trials, "TR"), ...t }; db.trials.unshift(out); save(); return send(res, 201, out);
      }
      if (p === "/joins") {
        const j = { ...base, plan: clean(b.plan, 20), payment: clean(b.payment, 40) || "Cash at the desk" };
        if (!phoneOk(j.phone) || !PLANS.includes(j.plan)) return send(res, 400, { error: "Please choose a plan and add your mobile number." });
        const out = { id: nextId(db.joins, "MB"), ...j }; db.joins.unshift(out); save(); return send(res, 201, out);
      }
      const m = { ...base, topic: clean(b.topic, 60) || "General", message: clean(b.message, 3000) };
      if (m.message.length < 3) return send(res, 400, { error: "Please write a message." });
      const out = { id: nextId(db.messages, "MS"), ...m }; db.messages.unshift(out); save(); return send(res, 201, out);
    }
    if (req.method === "POST" && p === "/login") {
      const b = await readBody(req), a = Buffer.from(String(b.password || "")), e = Buffer.from(ADMIN_PASSWORD);
      if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return send(res, 401, { error: "Wrong password" });
      return send(res, 200, { token: makeToken() });
    }
    if (p.startsWith("/admin/")) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const [, , kind, rawId] = p.split("/"); const id = decodeURIComponent(rawId || "");
      if (!["trials", "joins", "messages"].includes(kind)) return send(res, 404, { error: "Not found" });
      if (req.method === "GET" && !id) return send(res, 200, db[kind]);
      if (req.method === "PATCH" && id) {
        const b = await readBody(req), x = db[kind].find((r) => r.id === id); if (!x) return send(res, 404, { error: "Not found" });
        if (b.status !== undefined) { if (!STATUSES[kind].includes(b.status)) return send(res, 400, { error: "Bad status" }); x.status = b.status; }
        if (b.notes !== undefined) x.notes = clean(b.notes, 1000);
        save(); return send(res, 200, x);
      }
    }
    send(res, 404, { error: "Not found" });
  } catch { send(res, 400, { error: "Bad request" }); }
}).listen(PORT, () => console.log(`API on :${PORT}`));
