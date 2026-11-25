// Gridline: one object, five chapters.
// 96 spreadsheet cells that start as a single cell and, as you scroll, become a sheet,
// a pivot summary, a bar chart and finally a finished dashboard.
import * as THREE from "./vendor/three.module.js";

const COL = { paper: 0xeeeae0, ink: 0x15352c, sun: 0xf0a73a, white: 0xfbf9f3 };
const N = 96, COLS = 12, ROWS = 8, STAGES = 5;
const DASH_Y = 5.2; // dashboard board centre height

/* ---------- geometry: a soft rounded cube (no addons needed) ---------- */
function roundedBox(w, h, d, r, steps = 3) {
  const seg = steps * 4;
  const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
  const pos = g.attributes.position, nor = g.attributes.normal;
  const half = new THREE.Vector3(w / 2, h / 2, d / 2);
  const inner = half.clone().subScalar(r), neg = inner.clone().negate();
  const v = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  const remap = (u, hh) => {
    // BoxGeometry spaces vertices evenly; push the outer ones into the rounded band
    const a = Math.abs(u) / hh, i = Math.round(a * steps * 2), k = steps;
    const inn = (hh - r) / hh;
    const m = i <= k ? (i / k) * inn : inn + ((i - k) / k) * (r / hh);
    return Math.sign(u) * m * hh;
  };
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.set(remap(v.x, half.x), remap(v.y, half.y), remap(v.z, half.z));
    c.copy(v).clamp(neg, inner);
    n.copy(v).sub(c);
    if (n.lengthSq() < 1e-9) n.fromBufferAttribute(nor, i); else n.normalize();
    v.copy(c).addScaledVector(n, r);
    pos.setXYZ(i, v.x, v.y, v.z); nor.setXYZ(i, n.x, n.y, n.z);
  }
  return g;
}

/* ---------- deterministic randomness ---------- */
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/* ---------- the five states ---------- */
const S = Array.from({ length: STAGES }, () => Array.from({ length: N }, () => ({
  p: new THREE.Vector3(), s: new THREE.Vector3(1, 1, 1), r: new THREE.Vector3(), c: new THREE.Color(),
})));
const delay = Array.from({ length: N }, () => rnd());
const cellOf = i => ({ c: i % COLS, r: Math.floor(i / COLS) });
const HERO = 3 * COLS + 5;           // the first cell everything grows from
const TOTAL = 7 * COLS + 3;          // =SUM() result cell (D8)
const tint = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);

// 1 - The sheet (computed first, stage 0 depends on it)
for (let i = 0; i < N; i++) {
  const { c, r } = cellOf(i), st = S[1][i];
  const head = r === 0 || c === 0, range = c === 3 && r >= 1 && r <= 6;
  st.p.set((c - 5.5) * 1.08, 0.15, (r - 3.5) * 1.08);
  st.s.set(1, 0.3, 1);
  st.c.set(head ? COL.ink : COL.white);
  if (range) st.c.copy(tint(COL.white, COL.sun, 0.45));
  if (i === TOTAL) { st.c.set(COL.sun); st.s.set(1, 1.15, 1); st.p.y = 0.575; }
}
// 0 - One cell. Everything else waits above, out of frame.
for (let i = 0; i < N; i++) {
  const st = S[0][i], sh = S[1][i];
  if (i === HERO) { st.p.set(0, 1.25, 0); st.s.set(2.3, 2.3, 2.3); st.c.set(COL.sun); continue; }
  st.p.set(sh.p.x * 1.4, 16 + rnd() * 8, sh.p.z * 1.4);
  st.s.setScalar(0.001); st.c.set(COL.white);
  st.r.set(rnd() * 3, rnd() * 3, rnd() * 3);
}
S[1][HERO].c.set(COL.sun); // the hero cell stays highlighted in the sheet

// 2 - Lookups & pivot: cells regroup into four summary blocks of different size
{
  const order = [...Array(N).keys()].sort((a, b) => delay[a] - delay[b]);
  const sizes = [30, 18, 24, 24], colors = [COL.ink, COL.white, COL.ink, COL.sun];
  let k = 0;
  sizes.forEach((size, g) => {
    for (let j = 0; j < size; j++, k++) {
      const i = order[k], st = S[2][i];
      const x = j % 3, z = Math.floor(j / 3) % 2, y = Math.floor(j / 6);
      st.p.set((g - 1.5) * 4.6 + (x - 1) * 1.04, 0.5 + y * 1.04, (z - 0.5) * 1.04);
      st.s.setScalar(1); st.c.set(colors[g]);
      if (g === 1 && y === Math.floor((size - 1) / 6)) st.c.set(COL.sun); // the matched row (lookup hit)
    }
  });
}

// 3 - Chart: twelve months, cells stacked into bars
const BARS = [3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 13, 15];
{
  let k = 0;
  BARS.forEach((h, b) => {
    for (let l = 0; l < h; l++, k++) {
      const st = S[3][k];
      st.p.set((b - 5.5) * 1.3, 0.47 + l * 0.98, 0);
      st.s.setScalar(0.92);
      st.c.set(b === 11 ? COL.sun : COL.ink);
    }
  });
}

// 4 - Dashboard: KPI tiles, line, bars and a donut on an upright board
const kpiCentres = [];
{
  const flat = 0.34, z = 0.05 + flat / 2;
  let k = 0;
  const put = (x, y, sx, sy, color, rz = 0) => {
    const st = S[4][k++]; st.p.set(x, DASH_Y + y, z); st.s.set(sx, sy, flat); st.c.set(color); st.r.set(0, 0, rz);
  };
  // 4 KPI tiles, 6 cells each (3 x 2)
  [-5.25, -1.75, 1.75, 5.25].forEach((cx, t) => {
    kpiCentres.push(new THREE.Vector3(cx, DASH_Y + 2.75, z + flat / 2));
    for (let j = 0; j < 6; j++) {
      const x = j % 3, y = Math.floor(j / 3);
      put(cx + (x - 1) * 1.04, 2.75 + (y - 0.5) * 0.74, 1.0, 0.7, t === 3 ? COL.sun : COL.white);
    }
  });
  // trend line, 22 dots
  for (let j = 0; j < 22; j++) {
    const x = -7 + j * (14 / 21), t = j / 21;
    const y = 0.75 + Math.sin(t * 5.2) * 0.32 + t * 0.85 - 0.2;
    put(x, y, 0.3, 0.3, COL.sun);
  }
  // bars, 34 cells
  [2, 3, 3, 4, 5, 4, 6, 7].forEach((h, b) => {
    for (let l = 0; l < h; l++) put(-6.6 + b * 0.82, -3.85 + l * 0.48, 0.66, 0.42, b === 7 ? COL.sun : COL.white);
  });
  // donut, 16 cells
  for (let j = 0; j < 16; j++) {
    const a = Math.PI / 2 - (j / 16) * Math.PI * 2;
    put(4.6 + Math.cos(a) * 1.55, -2.15 + Math.sin(a) * 1.55, 0.56, 0.42, j < 5 ? COL.sun : COL.white, a + Math.PI / 2);
  }
}

// cameras and framing per stage: position, target, scene shift (fraction of width), frame width
const CAM = [
  { p: [0, 4.6, 12], t: [0, 2.75, 0], shift: 0.0, w: 8, h: 9.5 },
  { p: [0, 14.5, 9.5], t: [0, 0, 0.3], shift: -0.19, w: 14.5, h: 10.5 },
  { p: [-6, 8.5, 14], t: [0, 2, 0], shift: 0.19, w: 19, h: 10 },
  { p: [4, 6.5, 17.5], t: [0, 7.4, 0], shift: -0.19, w: 17, h: 22 },
  { p: [0, DASH_Y + 1.4, 21], t: [0, DASH_Y + 1.25, 0], shift: 0.0, w: 18.5, h: 16.5 },
];
const LIFT = [0, 3, 2.2, 2.6]; // arc height during each transition
const SPIN = [0, 1.2, 0.8, 0.6];

/* ---------- helpers ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

export function initStory({ canvas, story, tags = [], onStage = () => {} }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0bd, 2.1));
  const sun = new THREE.DirectionalLight(0xfff6e8, 2.3);
  sun.position.set(7, 16, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 60 });
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02; sun.shadow.radius = 5;
  sun.target.position.set(0, 2, 0); scene.add(sun, sun.target);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.1 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0 });
  const cells = new THREE.InstancedMesh(roundedBox(1, 1, 1, 0.13), mat, N);
  cells.castShadow = true; cells.receiveShadow = true;
  cells.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < N; i++) cells.setColorAt(i, S[0][i].c);
  scene.add(cells);

  // the "box" of the story: the dashboard board rises up from the floor
  const board = new THREE.Mesh(roundedBox(16.4, 9.6, 0.4, 0.22), new THREE.MeshStandardMaterial({ color: COL.ink, roughness: 0.7 }));
  board.castShadow = true; board.receiveShadow = true; scene.add(board);

  const dummy = new THREE.Object3D(), col = new THREE.Color(), tv = new THREE.Vector3();
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3();
  let W = 1, H = 1, aspect = 1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height); aspect = W / H;
    renderer.setSize(W, H, false);
    camera.aspect = aspect; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let target = 0, current = 0, last = -1, mx = 0, my = 0, smx = 0, smy = 0, running = true, stageNow = -1;

  function readScroll() {
    const r = story.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    target = clamp(-r.top / Math.max(1, total)) * (STAGES - 1);
  }
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("pointermove", e => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; }, { passive: true });
  readScroll();
  current = target;

  new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) loop(); }, { threshold: 0 }).observe(story);

  function frame(time) {
    current = reduce ? target : lerp(current, target, 0.085);
    if (Math.abs(current - target) < 0.0005) current = target;
    smx = lerp(smx, mx, 0.05); smy = lerp(smy, my, 0.05);

    const P = clamp(current, 0, STAGES - 1);
    const seg = Math.min(STAGES - 2, Math.floor(P));
    const tRaw = P - seg;
    const tt = clamp((tRaw - 0.1) / 0.8);
    const A = S[seg], B = S[seg + 1];
    const idle = Math.max(0, 1 - P * 2.5); // hero cell breathing, fades as soon as the story starts

    for (let i = 0; i < N; i++) {
      const d = seg === 0 ? delay[i] * 0.55 : delay[i] * 0.35;
      const ti = ease(clamp((tt - d) / (1 - (seg === 0 ? 0.55 : 0.35))));
      const a = A[i], b = B[i];
      if (seg === 0 && i !== HERO) {
        // falling like a dropped object: gravity on y, eased landing in x/z
        const fall = clamp((tt - d) / 0.45);
        dummy.position.set(lerp(a.p.x, b.p.x, ease(fall)), lerp(a.p.y, b.p.y, fall * fall), lerp(a.p.z, b.p.z, ease(fall)));
        dummy.rotation.set(lerp(a.r.x, b.r.x, fall), lerp(a.r.y, b.r.y, fall), lerp(a.r.z, b.r.z, fall));
        dummy.scale.copy(b.s).multiplyScalar(clamp(fall * 3));
        col.copy(b.c);
      } else {
        dummy.position.lerpVectors(a.p, b.p, ti);
        dummy.position.y += Math.sin(Math.PI * ti) * LIFT[seg] * (0.6 + delay[i] * 0.8);
        dummy.rotation.set(lerp(a.r.x, b.r.x, ti), lerp(a.r.y, b.r.y, ti) + Math.sin(Math.PI * ti) * SPIN[seg], lerp(a.r.z, b.r.z, ti));
        // turning from lying flat (floor) to upright (board) for the dashboard
        if (seg === 3) dummy.rotation.x += 0;
        dummy.scale.lerpVectors(a.s, b.s, ti);
        col.lerpColors(a.c, b.c, clamp((ti - 0.3) / 0.4));
      }
      if (i === HERO && idle > 0) {
        dummy.position.y += Math.sin(time * 0.0012) * 0.18 * idle;
        dummy.rotation.y += Math.sin(time * 0.0006) * 0.35 * idle;
        dummy.rotation.x += Math.sin(time * 0.0009) * 0.08 * idle;
      }
      dummy.updateMatrix();
      cells.setMatrixAt(i, dummy.matrix);
      cells.setColorAt(i, col);
    }
    cells.instanceMatrix.needsUpdate = true;
    cells.instanceColor.needsUpdate = true;

    // board: hidden until the last transition, then it tips up from the floor
    const bt = seg === 3 ? ease(clamp((tt - 0.05) / 0.6)) : 0;
    board.visible = bt > 0.001;
    board.scale.setScalar(Math.max(0.001, bt));
    board.rotation.x = -Math.PI / 2 * (1 - bt);
    board.position.set(0, lerp(0.25, DASH_Y, bt), lerp(2, -0.2, bt));

    // camera
    const ct = ease(clamp(tRaw));
    const ca = CAM[seg], cb = CAM[seg + 1];
    const mobile = aspect < 1.1;
    const fit = (c) => {
      const d = Math.hypot(c.p[0] - c.t[0], c.p[1] - c.t[1], c.p[2] - c.t[2]);
      const vh = 2 * Math.tan(THREE.MathUtils.degToRad(16)) * d;
      const vw = vh * aspect * (mobile ? 0.92 : 1 - 2 * Math.abs(c.shift));
      return Math.max(c.w / vw, (c.h * (mobile ? 1.38 : 1)) / vh);
    };
    const fa = fit(ca), fb = fit(cb);
    for (let k = 0; k < 3; k++) {
      const pa = ca.t[k] + (ca.p[k] - ca.t[k]) * fa, pb = cb.t[k] + (cb.p[k] - cb.t[k]) * fb;
      camPos.setComponent(k, lerp(pa, pb, ct));
      camTgt.setComponent(k, lerp(ca.t[k], cb.t[k], ct));
    }
    camPos.x += smx * 1.6; camPos.y -= smy * 0.9;
    camera.position.copy(camPos); camera.lookAt(camTgt);
    const shift = mobile ? 0 : lerp(ca.shift, cb.shift, ct);
    // on phones the text sits at the bottom, so lift the object into the upper part of the screen
    const vshift = mobile ? lerp(ca.shift === 0 ? 0.02 : 0.15, cb.shift === 0 ? 0.02 : 0.15, ct) : 0;
    camera.setViewOffset(W, H, -shift * W, vshift * H, W, H);

    renderer.render(scene, camera);

    // HTML labels pinned to 3D points
    tags.forEach(tag => {
      const s = Math.abs(P - tag.stage);
      const o = clamp(1 - (s - 0.12) * 4);
      if (o <= 0) { tag.el.style.opacity = 0; return; }
      tv.copy(tag.world).project(camera);
      tag.el.style.opacity = o;
      tag.el.style.transform = `translate(${((tv.x + 1) / 2) * W}px, ${((1 - tv.y) / 2) * H}px)`;
    });

    const sn = Math.round(P);
    if (sn !== stageNow) { stageNow = sn; onStage(sn); }
    story.style.setProperty("--p", (P / (STAGES - 1)).toFixed(4));
    story.style.setProperty("--P", P.toFixed(4));
  }

  function loop(time = performance.now()) {
    if (!running) return;
    frame(time);
    requestAnimationFrame(loop);
  }
  loop();

  // world positions other scripts may pin labels to
  return {
    points: {
      hero: new THREE.Vector3(0, 2.6, 0),
      total: new THREE.Vector3(S[1][TOTAL].p.x, 1.2, S[1][TOTAL].p.z),
      range: new THREE.Vector3(S[1][3 + COLS].p.x, 0.4, S[1][3 + COLS].p.z),
      pivot: [0, 1, 2, 3].map(g => new THREE.Vector3((g - 1.5) * 4.6, 0, 1.4)),
      lastBar: new THREE.Vector3((11 - 5.5) * 1.3, 15 * 0.98 + 0.4, 0),
      kpis: kpiCentres,
    },
    Vector3: THREE.Vector3,
  };
}
