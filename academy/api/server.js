// Tiny dependency-free API for enrollments. Data is stored in a JSON file (Docker volume).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { makeSeed } from "./seed-data.js";

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "./data";
const FILE = path.join(DATA_DIR, "enrollments.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const STATUSES = ["new", "contacted", "enrolled", "not-interested"];

fs.mkdirSync(DATA_DIR, { recursive: true });
let db = [];
try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); }
catch { db = process.env.SEED === "false" ? [] : makeSeed(); save(); }
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
    req.on("data", c => { raw += c; if (raw.length > 20000) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
  });
}

// very small rate limit for the public form
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 10;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const p = url.pathname.replace(/^\/api/, "");
  try {
    if (req.method === "GET" && p === "/health") return send(res, 200, { ok: true });

    if (req.method === "POST" && p === "/enroll") {
      const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;
      if (limited(ip)) return send(res, 429, { error: "Too many requests" });
      const b = await readBody(req);
      const item = {
        id: crypto.randomUUID(),
        name: clean(b.name, 80), phone: clean(b.phone, 30), email: clean(b.email, 120),
        course: clean(b.course, 60), timing: clean(b.timing, 40), message: clean(b.message, 1000),
        status: "new", createdAt: new Date().toISOString(),
      };
      if (!item.name || !item.phone || !item.course) return send(res, 400, { error: "Name, phone and course are required" });
      db.unshift(item); save();
      return send(res, 201, { ok: true });
    }

    if (req.method === "POST" && p === "/login") {
      const b = await readBody(req);
      const a = Buffer.from(String(b.password || "")), e = Buffer.from(ADMIN_PASSWORD);
      if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return send(res, 401, { error: "Wrong password" });
      return send(res, 200, { token: makeToken() });
    }

    if (p.startsWith("/enrollments")) {
      if (!authed(req)) return send(res, 401, { error: "Unauthorized" });
      const id = decodeURIComponent(p.split("/")[2] || "");
      if (req.method === "GET" && !id) return send(res, 200, db);
      const i = db.findIndex(x => x.id === id);
      if (i < 0) return send(res, 404, { error: "Not found" });
      if (req.method === "PATCH") {
        const b = await readBody(req);
        if (!STATUSES.includes(b.status)) return send(res, 400, { error: "Bad status" });
        db[i].status = b.status; save();
        return send(res, 200, db[i]);
      }
      if (req.method === "DELETE") { db.splice(i, 1); save(); return send(res, 200, { ok: true }); }
    }
    send(res, 404, { error: "Not found" });
  } catch (e) {
    send(res, 400, { error: "Bad request" });
  }
}).listen(PORT, () => console.log(`API on :${PORT}`));
