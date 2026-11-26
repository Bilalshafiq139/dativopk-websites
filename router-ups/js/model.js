// Procedural 3D models for Jugnu Power: mini UPS units, the power station, DC cables, a WiFi router
// and a wall switchboard. Everything is built from Three.js primitives plus canvas textures for the
// printed labels, so there are no model files to load. Each product picks a model with PRODUCT.model.
import * as THREE from "./vendor/three.module.min.js";
import { RoundedBoxGeometry } from "./vendor/addons/RoundedBoxGeometry.js";

export const C = { lime: 0xc8ff3d, amber: 0xffb02e, cyan: 0x46d4ff, red: 0xff3b3b, green: 0x3dff8a };
const FONT = '"Space Grotesk", "Segoe UI", Arial, sans-serif';

/* ---------- small helpers ---------- */
function canvasTex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d"); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
let glowTex;
function glowSprite(color, size) {
  glowTex ||= canvasTex(128, 128, (g) => {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.18, "rgba(255,255,255,.55)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  const m = new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const s = new THREE.Sprite(m); s.scale.setScalar(size); return s;
}
const plastic = (color, rough = 0.42, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4, ...extra });
const metal = (color = 0xb9c0c8, rough = 0.3) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 1 });
const shadowAll = (o) => o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });

// An LED: a small lens + a halo sprite. set(color, strength 0..1)
function led(r = 0.022) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x15181d, emissive: 0x000000, roughness: 0.2 });
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.012, 20), mat);
  lens.rotation.x = Math.PI / 2;
  const halo = glowSprite(0xffffff, r * 9); halo.position.z = 0.01; halo.material.opacity = 0;
  const g = new THREE.Group(); g.add(lens, halo);
  g.userData.set = (color, k = 1) => {
    mat.emissive.set(color); mat.emissiveIntensity = 2.2 * k; mat.color.set(k > 0.05 ? color : 0x15181d).multiplyScalar(k > 0.05 ? 0.4 : 1);
    halo.material.color.set(color); halo.material.opacity = 0.85 * k;
  };
  return g;
}

// A 5.5mm DC barrel socket, facing +z.
function dcJack() {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 28), plastic(0x0b0c0f, 0.5));
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.022, 24), new THREE.MeshStandardMaterial({ color: 0x020203, roughness: 1 }));
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.026, 12), metal());
  [ring, hole, pin].forEach((m) => { m.rotation.x = Math.PI / 2; g.add(m); });
  hole.position.z = 0.002; pin.position.z = 0.004;
  return g;
}
function usbPort(wide = 0.13) {
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new RoundedBoxGeometry(wide, 0.05, 0.02, 2, 0.008), metal(0xa8afb8, 0.35));
  const inner = new THREE.Mesh(new THREE.BoxGeometry(wide * 0.84, 0.032, 0.022), new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 1 }));
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(wide * 0.7, 0.01, 0.024), plastic(0x1e63ff, 0.5));
  tongue.position.y = 0.006; g.add(outer, inner, tongue); return g;
}
function usbC() {
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new RoundedBoxGeometry(0.085, 0.032, 0.02, 3, 0.015), metal(0xa8afb8, 0.35));
  const inner = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.02, 0.022, 3, 0.009), new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 1 }));
  g.add(outer, inner); return g;
}

/* ---------- mini UPS ---------- */
// p: { w,h,d, color, panel, accent, text, leds, ports:[...], badge }
export function buildUPS(p) {
  const { w = 1.7, h = 0.42, d = 1.15, color = 0x1a1d22, accent = C.lime, text = "#e9eef4", leds = 4, ports = ["12V", "9V", "USB"] } = p;
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, Math.min(h, d) * 0.22), plastic(color, p.rough ?? 0.38));
  g.add(body);
  // accent band around the base
  const band = new THREE.Mesh(new RoundedBoxGeometry(w * 1.004, h * 0.07, d * 1.004, 4, h * 0.03), plastic(accent, 0.3, { emissive: accent, emissiveIntensity: 0.05 }));
  band.position.y = -h * 0.36; g.add(band);
  // rubber feet
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.025, 20), plastic(0x0a0a0c, 0.9));
    f.position.set(sx * (w / 2 - 0.16), -h / 2 - 0.01, sz * (d / 2 - 0.14)); g.add(f);
  }
  // printed front face
  const fw = w * 0.9, fh = h * 0.62, fz = d / 2 + 0.0015;
  const portX = ports.map((_, i) => fw / 2 - 0.13 - (ports.length - 1 - i) * 0.21);
  const face = canvasTex(1024, Math.round(1024 * fh / fw), (c, W, H) => {
    c.clearRect(0, 0, W, H);
    const px = (x) => (x / fw + 0.5) * W;
    c.fillStyle = text; c.globalAlpha = 0.85; c.textAlign = "center"; c.textBaseline = "top";
    c.font = `600 ${H * 0.13}px ${FONT}`;
    ports.forEach((t, i) => c.fillText(t === "USB" ? "5V USB" : t === "USB-C" ? "PD 65W" : t === "AC" ? "AC OUT" : t + " ⎓", px(portX[i]), H * 0.8));
    c.textAlign = "left"; c.fillText("POWER", px(-fw / 2 + 0.03), H * 0.8);
    c.globalAlpha = 0.5; c.font = `500 ${H * 0.1}px ${FONT}`;
    c.fillText("BATTERY", px(-fw / 2 + 0.25), H * 0.8);
  });
  const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), new THREE.MeshStandardMaterial({ map: face, transparent: true, roughness: 0.6 }));
  facePlane.position.set(0, h * 0.02, fz); g.add(facePlane);
  // power button with a light ring
  const btn = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x111, emissive: accent, emissiveIntensity: 1 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.008, 12, 40), ringMat);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.025, 32), plastic(color, 0.25));
  cap.rotation.x = Math.PI / 2; btn.add(ring, cap);
  const btnHalo = glowSprite(accent, 0.28); btnHalo.material.opacity = 0.5; btn.add(btnHalo);
  btn.position.set(-fw / 2 + 0.1, h * 0.06, fz + 0.008); g.add(btn);
  // battery LEDs
  const ledObjs = [];
  for (let i = 0; i < leds; i++) {
    const L = led(0.016); L.position.set(-fw / 2 + 0.27 + i * 0.065, h * 0.06, fz + 0.004); g.add(L); ledObjs.push(L);
  }
  // output ports
  const portPos = {};
  ports.forEach((t, i) => {
    const P = t === "USB" ? usbPort(0.12) : t === "USB-C" ? usbC() : dcJack();
    P.position.set(portX[i], h * 0.06, fz + 0.008); g.add(P); portPos[t] = P.position.clone();
  });
  // top wordmark
  const top = canvasTex(1024, 512, (c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.fillStyle = text; c.globalAlpha = 0.9; c.font = `700 ${H * 0.2}px ${FONT}`; c.textBaseline = "middle"; c.textAlign = "center";
    c.fillText(p.badge || "jugnu", W / 2 + H * 0.06, H * 0.47);
    const tw = c.measureText(p.badge || "jugnu").width;
    c.globalAlpha = 1; c.fillStyle = "#" + new THREE.Color(accent).getHexString();
    c.beginPath(); c.arc(W / 2 - tw / 2 - H * 0.04, H * 0.4, H * 0.035, 0, 7); c.fill();
    c.globalAlpha = 0.45; c.fillStyle = text; c.font = `500 ${H * 0.06}px ${FONT}`;
    c.fillText(p.sub || "WiFi BACKUP · LITHIUM", W / 2, H * 0.68);
  });
  const topPlane = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, w * 0.35), new THREE.MeshStandardMaterial({ map: top, transparent: true, roughness: 0.5 }));
  topPlane.rotation.x = -Math.PI / 2; topPlane.position.set(0, h / 2 + 0.002, 0); g.add(topPlane);
  shadowAll(g); facePlane.castShadow = topPlane.castShadow = false;

  // state machine for the lights
  let mode = "mains", level = 1;
  g.userData = {
    ports: portPos, backPort: new THREE.Vector3(0, 0, -d / 2), size: { w, h, d },
    setMode(m) { mode = m; }, setLevel(v) { level = Math.max(0, Math.min(1, v)); },
    update(t) {
      const lit = Math.ceil(level * leds - 0.001);
      const col = mode === "battery" ? C.amber : C.green;
      ledObjs.forEach((L, i) => {
        let k = i < lit ? 1 : 0.0;
        if (mode === "charging" && i === lit - 1) k = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 5));
        if (mode === "battery" && i === lit - 1) k = 0.25 + 0.75 * (Math.sin(t * 3.5) > -0.2 ? 1 : 0.2);
        if (mode === "off") k = 0;
        L.userData.set(col, k);
      });
      const rc = mode === "battery" ? C.amber : mode === "off" ? 0x000000 : accent;
      ringMat.emissive.set(rc); btnHalo.material.color.set(rc); btnHalo.material.opacity = mode === "off" ? 0 : 0.45;
    },
  };
  g.userData.update(0);
  return g;
}

/* ---------- portable power station ---------- */
export function buildStation(p) {
  const { w = 1.9, h = 1.3, d = 1.15, color = 0x23272e, accent = C.lime } = p;
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, 0.16), plastic(color, 0.5));
  body.position.y = h / 2; g.add(body);
  // two-tone cap
  const cap = new THREE.Mesh(new RoundedBoxGeometry(w * 1.01, h * 0.2, d * 1.01, 5, 0.12), plastic(0x0f1114, 0.35));
  cap.position.y = h * 0.92; g.add(cap);
  const stripe = new THREE.Mesh(new RoundedBoxGeometry(w * 1.012, 0.03, d * 1.012, 3, 0.012), plastic(accent, 0.3, { emissive: accent, emissiveIntensity: 0.15 }));
  stripe.position.y = h * 0.81; g.add(stripe);
  // handle
  const hmat = plastic(0x0f1114, 0.4);
  for (const sx of [-1, 1]) { const post = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.2, 0.22, 3, 0.05), hmat); post.position.set(sx * w * 0.36, h + 0.08, 0); g.add(post); }
  const bar = new THREE.Mesh(new RoundedBoxGeometry(w * 0.86, 0.11, 0.22, 4, 0.05), hmat); bar.position.set(0, h + 0.2, 0); g.add(bar);
  // display
  const fz = d / 2 + 0.002;
  let pct = 92;
  const scrCanvas = document.createElement("canvas"); scrCanvas.width = 512; scrCanvas.height = 256;
  const scr = new THREE.CanvasTexture(scrCanvas); scr.colorSpace = THREE.SRGBColorSpace;
  const drawScreen = (mode) => {
    const c = scrCanvas.getContext("2d"), W = 512, H = 256;
    c.fillStyle = "#06080a"; c.fillRect(0, 0, W, H);
    c.fillStyle = mode === "battery" ? "#ffb02e" : "#c8ff3d"; c.font = `700 120px ${FONT}`; c.textBaseline = "middle";
    c.fillText(pct + "%", 30, 110);
    c.font = `500 34px ${FONT}`; c.fillStyle = "#9aa6b5";
    c.fillText(mode === "battery" ? "OUTPUT  ·  18h 40m left" : "INPUT 230V · charging", 32, 205);
    c.strokeStyle = "#2a3038"; c.lineWidth = 4; c.strokeRect(370, 50, 110, 60);
    c.fillStyle = mode === "battery" ? "#ffb02e" : "#c8ff3d"; c.fillRect(376, 56, 98 * pct / 100, 48);
    scr.needsUpdate = true;
  };
  drawScreen("mains");
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31), new THREE.MeshStandardMaterial({ map: scr, emissiveMap: scr, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.15 }));
  screen.position.set(-w * 0.2, h * 0.58, fz + 0.012); g.add(screen);
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.39, 0.02, 3, 0.03), plastic(0x050607, 0.2)); bezel.position.set(-w * 0.2, h * 0.58, fz - 0.006); g.add(bezel);
  // AC sockets (universal)
  for (let i = 0; i < 2; i++) {
    const s = new THREE.Group();
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.3, 0.03, 4, 0.06), plastic(0xe7e9ec, 0.45));
    s.add(plate);
    const holeM = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1 });
    [[-0.06, 0.04], [0.06, 0.04], [0, -0.07]].forEach(([x, y]) => { const hl = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.032, 16), holeM); hl.rotation.x = Math.PI / 2; hl.position.set(x, y, 0.002); s.add(hl); });
    s.position.set(w * 0.08 + i * 0.36, h * 0.25, fz); g.add(s);
  }
  // USB + DC + power button
  [-0.36, -0.2].forEach((x) => { const u = usbPort(0.12); u.position.set(-w * 0.2 + x + 0.2, h * 0.22, fz + 0.008); g.add(u); });
  const dc = dcJack(); dc.position.set(-w * 0.2 + 0.26, h * 0.22, fz + 0.008); g.add(dc);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x111, emissive: accent, emissiveIntensity: 1 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.01, 12, 40), ringMat); ring.position.set(w * 0.38, h * 0.47, fz + 0.006); g.add(ring);
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.025, 32), plastic(0x111316, 0.3)); btn.rotation.x = Math.PI / 2; btn.position.copy(ring.position); g.add(btn);
  // label
  const lab = canvasTex(1024, 256, (c, W, H) => {
    c.fillStyle = "#e9eef4"; c.font = `700 ${H * 0.42}px ${FONT}`; c.textBaseline = "middle"; c.fillText("jugnu", 40, H * 0.5);
    c.fillStyle = "#c8ff3d"; c.beginPath(); c.arc(20, H * 0.4, H * 0.06, 0, 7); c.fill();
    c.globalAlpha = 0.5; c.fillStyle = "#e9eef4"; c.font = `500 ${H * 0.18}px ${FONT}`; c.fillText("STATION 300 · LiFePO4", 460, H * 0.52);
  });
  const labP = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.21), new THREE.MeshStandardMaterial({ map: lab, transparent: true })); labP.position.set(w * 0.22, h * 0.67, fz); g.add(labP);
  // side vents
  for (const sx of [-1, 1]) for (let i = 0; i < 7; i++) {
    const v = new THREE.Mesh(new RoundedBoxGeometry(0.02, 0.05, d * 0.6, 2, 0.008), new THREE.MeshStandardMaterial({ color: 0x050607 }));
    v.position.set(sx * (w / 2 + 0.002), h * 0.3 + i * 0.065, 0); g.add(v);
  }
  shadowAll(g);
  let mode = "mains";
  g.userData = { size: { w, h, d }, ports: { "12V": dc.position.clone() }, backPort: new THREE.Vector3(0, h * 0.3, -d / 2),
    setMode(m) { if (m !== mode) { mode = m; drawScreen(m); } }, setLevel(v) { pct = Math.round(v * 100); drawScreen(mode); },
    update() { ringMat.emissive.set(mode === "battery" ? C.amber : accent); } };
  return g;
}

/* ---------- DC cables (accessories) ---------- */
export function buildCable(p) {
  const g = new THREE.Group();
  const black = plastic(p.color || 0x111316, 0.55);
  const pts = [];
  for (let i = 0; i <= 160; i++) { const t = i / 160, a = t * Math.PI * 2 * 3.2; const r = 0.55 + 0.05 * Math.sin(t * 9); pts.push(new THREE.Vector3(Math.cos(a) * r, 0.06 + t * 0.22 + Math.sin(a * 0.5) * 0.02, Math.sin(a) * r * 0.75)); }
  const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 600, 0.028, 10), black); g.add(coil);
  const plug = (label) => {
    const pg = new THREE.Group();
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.28, 24), black);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.13, 20), metal(0xc9ced4, 0.25));
    tip.position.y = 0.2; pg.add(boot, tip);
    if (label) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.03, 24), plastic(label, 0.4)); b.position.y = -0.06; pg.add(b); }
    return pg;
  };
  const end1 = plug(p.accent || C.lime); end1.position.set(0.9, 0.12, 0.25); end1.rotation.set(0, 0, -Math.PI / 2.2); g.add(end1);
  if (p.split) {
    const e2 = plug(C.cyan), e3 = plug(C.cyan);
    e2.position.set(-0.85, 0.12, 0.45); e2.rotation.set(0.2, 0, Math.PI / 2.1);
    e3.position.set(-0.8, 0.12, -0.2); e3.rotation.set(-0.3, 0, Math.PI / 2.2); g.add(e2, e3);
    const joint = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.1, 0.14, 3, 0.04), black); joint.position.set(-0.55, 0.1, 0.12); g.add(joint);
  } else {
    // USB-A end with a boost module
    const mod = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.1, 0.16, 3, 0.04), black); mod.position.set(-0.75, 0.1, 0.25); g.add(mod);
    const lab = canvasTex(256, 64, (c) => { c.fillStyle = "#c8ff3d"; c.font = `700 40px ${FONT}`; c.textBaseline = "middle"; c.fillText(p.label || "5V→12V", 14, 34); });
    const lp = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.065), new THREE.MeshBasicMaterial({ map: lab, transparent: true })); lp.rotation.x = -Math.PI / 2; lp.position.set(-0.75, 0.152, 0.25); g.add(lp);
    const usb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.12), metal(0xc9ced4, 0.3)); usb.position.set(-1.0, 0.1, 0.25); g.add(usb);
  }
  // leads joining the coil to the plugs / module
  g.updateMatrixWorld(true);
  const lead = (a, b) => {
    const m = a.clone().lerp(b, 0.5); m.y = Math.min(a.y, b.y) - 0.01;
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, m, b]), 40, 0.028, 10), black));
  };
  const base = (o, y = -0.14) => o.localToWorld(new THREE.Vector3(0, y, 0));
  lead(pts[0], base(end1));
  if (p.split) {
    const j = new THREE.Vector3(-0.55, 0.1, 0.12);
    lead(pts[pts.length - 1], j.clone().add(new THREE.Vector3(0.1, 0, 0)));
    g.children.filter((c) => c.isGroup && c !== end1).forEach((e) => lead(j.clone().add(new THREE.Vector3(-0.1, 0, 0)), base(e)));
  } else lead(pts[pts.length - 1], new THREE.Vector3(-0.58, 0.1, 0.25));
  shadowAll(g);
  g.userData = { size: { w: 2.2, h: 0.4, d: 1.4 }, update() {}, setMode() {}, setLevel() {} };
  return g;
}

/* ---------- WiFi router (scene prop) ---------- */
export function buildRouter(p = {}) {
  const { w = 1.95, h = 0.3, d = 1.3, color = 0xf2f3f5 } = p;
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, 0.12), plastic(color, 0.32));
  g.add(body);
  const vents = canvasTex(1024, 640, (c, W, H) => {
    c.clearRect(0, 0, W, H); c.fillStyle = "rgba(20,24,30,.16)";
    for (let y = 0; y < 9; y++) for (let x = 0; x < 16; x++) { if ((x + y) % 2) continue; c.beginPath(); c.roundRect(150 + x * 46, 110 + y * 46, 30, 12, 6); c.fill(); }
    c.fillStyle = "rgba(20,24,30,.55)"; c.font = `600 44px ${FONT}`; c.textAlign = "center"; c.fillText("AX3000 · DUAL BAND", W / 2, 590);
  });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, d * 0.85), new THREE.MeshStandardMaterial({ map: vents, transparent: true, roughness: 0.5 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h / 2 + 0.002; g.add(top);
  // front status LEDs
  const leds = [];
  for (let i = 0; i < 5; i++) { const L = led(0.014); L.position.set(-0.3 + i * 0.15, 0, d / 2 + 0.003); g.add(L); leds.push(L); }
  // antennas
  const amat = plastic(color, 0.32);
  const ants = [];
  [-0.75, -0.25, 0.25, 0.75].forEach((x, i) => {
    const a = new THREE.Group();
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 20), amat); hinge.rotation.z = Math.PI / 2; a.add(hinge);
    const rod = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 1.1, 8, 20), amat); rod.position.y = 0.6; a.add(rod);
    a.position.set(x * w / 2, h * 0.2, -d / 2 - 0.02); a.rotation.z = -x * 0.22; a.rotation.x = -0.12; g.add(a); ants.push(a);
  });
  const feet = new THREE.Mesh(new RoundedBoxGeometry(w * 0.8, 0.04, d * 0.7, 2, 0.02), plastic(0xd4d7db, 0.6)); feet.position.y = -h / 2 - 0.015; g.add(feet);
  shadowAll(g); top.castShadow = false;
  let online = true;
  g.userData = {
    size: { w, h, d }, backPort: new THREE.Vector3(w * 0.3, 0, -d / 2 + 0.02),
    setOnline(v) { online = v; },
    update(t) {
      const cols = [C.green, C.green, C.cyan, C.cyan, C.cyan];
      leds.forEach((L, i) => {
        let k = online ? 1 : 0;
        if (online && i >= 2) k = 0.55 + 0.45 * (Math.sin(t * (9 + i * 3) + i) > 0.3 ? 1 : 0.4); // data blink
        L.userData.set(cols[i], k * 0.55);
      });
    },
  };
  return g;
}

/* ---------- wall switchboard with a Pakistani-style 3-pin socket ---------- */
export function buildSwitchboard() {
  const g = new THREE.Group();
  const plate = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.62, 0.06, 4, 0.05), plastic(0xf3f2ee, 0.5)); g.add(plate);
  const sw = (x, on) => { const s = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.32, 0.05, 3, 0.03), plastic(0xfaf9f6, 0.4)); s.position.set(x, 0.02, 0.04); s.rotation.x = on ? -0.12 : 0.12; g.add(s); };
  sw(-0.42, true); sw(-0.18, false);
  const holeM = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 });
  [[0.2, 0.08, 0.035], [0.4, 0.08, 0.035], [0.3, -0.12, 0.045]].forEach(([x, y, r]) => { const hh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.07, 18), holeM); hh.rotation.x = Math.PI / 2; hh.position.set(x, y, 0.01); g.add(hh); });
  const neon = led(0.018); neon.position.set(-0.3, -0.22, 0.034); g.add(neon);
  // plug pushed in
  const plug = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.3, 0.16, 3, 0.05), plastic(0x15171a, 0.5)); plug.position.set(0.3, -0.02, 0.11); g.add(plug);
  shadowAll(g);
  g.userData = { plugPos: new THREE.Vector3(0.3, -0.12, 0.18), setPower(on) { neon.userData.set(C.red, on ? 1 : 0); } };
  g.userData.setPower(true);
  return g;
}

/* ---------- cable between two points with a "current" pulse ---------- */
let flowTex;
export function buildFlowCable(points, color = 0x0e1013, radius = 0.028) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);
  const g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, radius, 12), plastic(color, 0.6)); tube.castShadow = true; g.add(tube);
  flowTex ||= canvasTex(256, 8, (c, W, H) => {
    const gr = c.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.7, "rgba(255,255,255,.15)"); gr.addColorStop(0.92, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
  });
  const tex = flowTex.clone(); tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(Math.max(2, curve.getLength() * 2.2), 1); tex.needsUpdate = true;
  const glowMat = new THREE.MeshBasicMaterial({ map: tex, color: C.lime, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, radius * 1.6, 10), glowMat); g.add(glow);
  g.userData = { curve, setFlow(k, color) { glowMat.opacity = k; if (color) glowMat.color.set(color); }, update(t, speed = 0.9) { tex.offset.x = -t * speed; } };
  return g;
}

/* ---------- WiFi signal arcs ---------- */
export function buildWifi() {
  const g = new THREE.Group(); const arcs = [];
  [0.22, 0.4, 0.58].forEach((r) => {
    const m = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    const a = new THREE.Mesh(new THREE.TorusGeometry(r, 0.022, 10, 60, Math.PI * 0.5), m);
    a.rotation.z = Math.PI / 4; g.add(a); arcs.push(a);
  });
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), new THREE.MeshBasicMaterial({ color: C.cyan })); g.add(dot);
  const halo = glowSprite(C.cyan, 0.5); g.add(halo);
  let strength = 1;
  g.userData = {
    setStrength(v) { strength = v; },
    update(t) {
      arcs.forEach((a, i) => { const ph = (t * 1.4 - i * 0.35) % 1.5; a.material.opacity = strength * (0.25 + 0.75 * Math.max(0, 1 - Math.abs(ph - 0.5) * 1.6)); a.material.color.set(strength > 0.1 ? C.cyan : C.red); });
      dot.material.color.set(strength > 0.1 ? C.cyan : C.red); halo.material.opacity = 0.35 + 0.4 * strength;
      halo.material.color.set(strength > 0.1 ? C.cyan : C.red);
    },
  };
  return g;
}

/* ---------- pick a model for a product ---------- */
export function buildProduct(m) {
  if (m.kind === "station") return buildStation(m);
  if (m.kind === "cable") return buildCable(m);
  return buildUPS(m);
}

/* ---------- shared renderer setup ---------- */
import { RoomEnvironment } from "./vendor/addons/RoomEnvironment.js";
export function makeRenderer(canvas, { alpha = true } = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, preserveDrawingBuffer: false, powerPreference: "high-performance" });
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  return r;
}
export function studioEnv(renderer, scene) {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
}
export { THREE };
