// Tiny dependency-free API for Arz Estate: leads (viewings, price questions), contact messages,
// "post a property" submissions and listing edits. Data is a JSON file in a Docker volume.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeSeed, LEAD_STATUSES, MSG_STATUSES, SUB_STATUSES } from "./seed-data.js";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const FILE = path.join(DATA_DIR, "store.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

// Must match the ids in js/data.js
const LISTING_IDS = new Set(["noor", "serenity", "margalla", "palm", "seabreeze", "lantern", "cube", "pearl", "azure", "shalimar", "skyline", "harbour", "arz-heights", "blue-avenue", "mm-plaza"]);

fs.mkdirSync(DATA_DIR, { recursive: true });
let db;
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); }
catch { db = process.env.SEED === "false" ? { leads: [], messages: [], submissions: [], listings: {} } : makeSeed(); save(); }
db.listings ||= {}; db.submissions ||= [];
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
function limited(ip) { const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 60000); arr.push(now); hits.set(ip, arr); return arr.length > 8; }
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e);

http.createServer(async (req, res) => {
  const p = new URL(req.url, "http://x").pathname.replace(/^\/api/, "");
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
  try {
    if (req.method === "GET" && p === "/health") return send(res, 200, { ok: true });
    if (req.method === "GET" && p === "/listings") return send(res, 200, db.listings);

    if (req.method === "POST" && ["/leads", "/messages", "/submissions"].includes(p)) {
      if (limited(ip)) return send(res, 429, { error: "Too many requests, please WhatsApp us instead." });
      const b = await readBody(req);
      const base = { createdAt: new Date().toISOString(), name: clean(b.name, 80), phone: clean(b.phone, 30), email: clean(b.email, 120), status: "new" };
      if (!base.name || !base.phone && !emailOk(base.email)) return send(res, 400, { error: "Please add your name and a phone number or email." });
      if (p === "/leads") {
        if (!LISTING_IDS.has(b.listing)) return send(res, 400, { error: "Unknown property" });
        const last = Math.max(3000, ...db.leads.map((x) => Number(String(x.id).split("-")[1]) || 0));
        const o = { id: "AE-" + (last + 1), ...base, listing: b.listing, listingTitle: clean(b.listingTitle, 80), kind: clean(b.kind, 40) || "Enquiry",
          date: clean(b.date, 20), time: clean(b.time, 20), message: clean(b.message, 2000), notes: "", agent: "" };
        db.leads.unshift(o); save(); return send(res, 201, o);
      }
      if (p === "/messages") {
        const m = { id: crypto.randomUUID(), ...base, topic: clean(b.topic, 60) || "General", message: clean(b.message, 3000) };
        if (!m.message) return send(res, 400, { error: "Please write a message." });
        db.messages.unshift(m); save(); return send(res, 201, { ok: true });
      }
      const s = { id: crypto.randomUUID(), ...base, city: clean(b.city, 40), area: clean(b.area, 80), type: clean(b.type, 40), purpose: clean(b.purpose, 40),
        size: clean(b.size, 40), price: Math.max(0, Math.min(1e11, Number(b.price) || 0)), details: clean(b.details, 3000) };
      db.submissions.unshift(s); save(); return send(res, 201, { ok: true });
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
      if (req.method === "GET" && ["leads", "messages", "submissions"].includes(kind) && !id) return send(res, 200, db[kind]);
      if (req.method === "PATCH") {
        const b = await readBody(req);
        const lists = { leads: LEAD_STATUSES, messages: MSG_STATUSES, submissions: SUB_STATUSES };
        if (lists[kind]) {
          const o = db[kind].find((x) => x.id === id); if (!o) return send(res, 404, { error: "Not found" });
          if (b.status !== undefined) { if (!lists[kind].includes(b.status)) return send(res, 400, { error: "Bad status" }); o.status = b.status; }
          if (b.notes !== undefined) o.notes = clean(b.notes, 1000);
          if (b.agent !== undefined) o.agent = clean(b.agent, 60);
          save(); return send(res, 200, o);
        }
        if (kind === "listings") {
          if (!LISTING_IDS.has(id)) return send(res, 404, { error: "Not found" });
          const cur = db.listings[id] || {};
          if (b.price !== undefined) cur.price = Math.max(10000, Math.min(1e11, Math.round(Number(b.price) || 0))) || undefined;
          if (b.status !== undefined) cur.status = ["sold", "hidden", "reserved"].includes(b.status) ? b.status : "available";
          if (b.featured !== undefined) cur.featured = !!b.featured;
          db.listings[id] = cur; save(); return send(res, 200, db.listings);
        }
      }
    }
    send(res, 404, { error: "Not found" });
  } catch { send(res, 400, { error: "Bad request" }); }
}).listen(PORT, () => console.log(`API on :${PORT}`));
