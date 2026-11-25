// 3D hero: the pieces float on the page, then fly into a room one by one as you scroll.
// Built from simple shapes in Three.js, so it needs no 3D model files.
import * as THREE from "./vendor/three.module.js";
import { RoundedBoxGeometry } from "./vendor/RoundedBoxGeometry.js";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";
import { money, priceFor, woodById } from "./data.js";
import * as S from "./store.js";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const range = (p, a, b) => clamp((p - a) / (b - a));

export function initHero3D(root) {
  const canvas = root.querySelector("canvas");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    root.classList.add("no3d");
    return;
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  /* ---------- textures ---------- */
  function canvasTex(w, h, draw, repeat = 1) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat);
    return t;
  }
  const boucleBump = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#808080"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 1.5 + Math.random() * 3.2;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
  }, 3);
  const grain = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) {
      const y = Math.random() * h, a = 0.03 + Math.random() * 0.08;
      g.strokeStyle = `rgba(90,60,30,${a})`; g.lineWidth = 0.6 + Math.random() * 2.4;
      g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 70 + i) * 3 + Math.random() * 1.5);
      g.stroke();
    }
  });
  const stone = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#e8dfd2"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(150,125,100,${Math.random() * 0.12})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 2); }
    g.strokeStyle = "rgba(160,140,115,.35)"; g.lineWidth = 2;
    for (let x = 0; x <= w; x += 256) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  }, 3);

  /* ---------- materials ---------- */
  const woodTone = (id) => new THREE.Color(woodById(id).color).multiplyScalar(0.72);
  const wood = new THREE.MeshStandardMaterial({ color: woodTone(S.getWood()), map: grain, roughness: 0.5, metalness: 0, envMapIntensity: 0.6 });
  const boucle = new THREE.MeshStandardMaterial({ color: "#e4d9c6", roughness: 1, bumpMap: boucleBump, bumpScale: 1.3, envMapIntensity: 0.35 });
  const linen = new THREE.MeshStandardMaterial({ color: "#f1e7d6", roughness: 0.95, side: THREE.DoubleSide, emissive: "#ffcf8a", emissiveIntensity: 0.18 });
  const fade = (m) => { m.transparent = true; m.opacity = 0; return m; };
  const wallMat = fade(new THREE.MeshStandardMaterial({ color: "#e9dccb", roughness: 1, envMapIntensity: 0.3 }));
  const archWallMat = fade(new THREE.MeshStandardMaterial({ color: "#e6d8c5", roughness: 1, side: THREE.DoubleSide, envMapIntensity: 0.3 }));
  const floorMat = fade(new THREE.MeshStandardMaterial({ color: "#e2d3bf", map: stone, roughness: 0.8, envMapIntensity: 0.3 }));
  const slatMat = fade(new THREE.MeshStandardMaterial({ color: "#a06a3a", map: grain, roughness: 0.6 }));
  const roomMats = [wallMat, archWallMat, floorMat, slatMat];

  const rb = (w, h, d, r = 0.06, seg = 4) => new RoundedBoxGeometry(w, h, d, seg, r);
  const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m; };

  /* ---------- furniture (origin = floor centre of each piece) ---------- */
  function sofa() {
    const g = new THREE.Group();
    g.add(mesh(rb(2.3, 0.14, 0.92, 0.04), wood, 0, 0.07, 0));
    g.add(mesh(rb(2.24, 0.34, 0.86, 0.14), boucle, 0, 0.31, 0.02));
    g.add(mesh(rb(1.0, 0.18, 0.66, 0.09), boucle, -0.5, 0.55, 0.1));
    g.add(mesh(rb(1.0, 0.18, 0.66, 0.09), boucle, 0.5, 0.55, 0.1));
    g.add(mesh(rb(2.24, 0.5, 0.3, 0.14), boucle, 0, 0.66, -0.3));
    g.add(mesh(rb(0.3, 0.44, 0.9, 0.14), boucle, -1.0, 0.5, 0.01));
    g.add(mesh(rb(0.3, 0.44, 0.9, 0.14), boucle, 1.0, 0.5, 0.01));
    return g;
  }
  function lounge() {
    const g = new THREE.Group();
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.03, 0.42), new THREE.Vector3(0, 0.03, -0.1), new THREE.Vector3(0, 0.12, -0.34),
      new THREE.Vector3(0, 0.34, -0.3), new THREE.Vector3(0, 0.32, 0.1), new THREE.Vector3(0, 0.3, 0.32),
    ]);
    [-0.33, 0.33].forEach((x) => { const t = mesh(new THREE.TubeGeometry(path, 40, 0.035, 10), wood, x, 0, 0); g.add(t); });
    g.add(mesh(rb(0.78, 0.07, 0.12, 0.03), wood, 0, 0.04, 0.38));
    const seat = mesh(rb(0.7, 0.2, 0.62, 0.09), boucle, 0, 0.42, 0.04); seat.rotation.x = -0.1; g.add(seat);
    const back = mesh(rb(0.7, 0.62, 0.2, 0.09), boucle, 0, 0.78, -0.28); back.rotation.x = -0.32; g.add(back);
    return g;
  }
  function lamp() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 40), wood, 0, 0.02, 0));
    const pts = [];
    for (let i = 0; i <= 24; i++) { const y = (i / 24) * 1.45; pts.push(new THREE.Vector2(0.028 + 0.012 * Math.sin(i * 1.3) + (i % 6 === 0 ? 0.014 : 0), y)); }
    g.add(mesh(new THREE.LatheGeometry(pts, 24), wood, 0, 0.04, 0));
    const shade = mesh(new THREE.CylinderGeometry(0.16, 0.25, 0.32, 40, 1, true), linen, 0, 1.55, 0); shade.castShadow = false; g.add(shade);
    const bulb = new THREE.PointLight("#ffc27a", 0.0, 3, 2); bulb.position.y = 1.5; g.add(bulb); g.userData.bulb = bulb;
    return g;
  }
  function coffeeTable() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.07, 64), wood, 0, 0.46, 0));
    const ribs = 26;
    for (let i = 0; i < ribs; i++) {
      const a = (i / ribs) * Math.PI * 2;
      g.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.43, 10), wood, Math.cos(a) * 0.3, 0.215, Math.sin(a) * 0.3));
    }
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.43, 32), wood, 0, 0.215, 0));
    return g;
  }
  function pouf() {
    const g = new THREE.Group();
    const s = mesh(new THREE.SphereGeometry(0.34, 48, 24), boucle, 0, 0.2, 0); s.scale.set(1, 0.52, 1); g.add(s);
    const ring = mesh(new THREE.TorusGeometry(0.28, 0.025, 10, 48), wood, 0, 0.04, 0); ring.rotation.x = Math.PI / 2; g.add(ring);
    return g;
  }

  /* ---------- pieces: start (floating) and end (in the room), with their order ---------- */
  const PIECES = [
    { id: "chand", make: coffeeTable, end: [0.1, 0, 0.2, 0], order: 0, tag: [0, 0.6, 0] },
    { id: "gol", make: pouf, end: [-1.5, 0, 0.7, 0], order: 1, tag: [0, 0.45, 0] },
    { id: "reet", make: sofa, end: [-0.1, 0, -1.55, 0], order: 2, tag: [0, 1.05, 0] },
    { id: "roshan", make: lamp, end: [-1.75, 0, -2.0, 0], order: 3, tag: [0, 1.85, 0] },
    { id: "noor", make: lounge, end: [1.85, 0, -0.2, -0.75], order: 4, tag: [0, 1.15, 0] },
  ];
  const START = {
    wide: { noor: [3.0, 2.55, 0.4, 0.5, 1.0], roshan: [4.3, 1.15, -0.4, 0, 0.95], reet: [2.35, 0.05, 0.2, -0.35, 0.95], chand: [-0.25, -0.95, 1.2, 0.2, 0.9], gol: [1.0, -1.25, 1.8, 0, 0.9] },
    tall: { noor: [0.9, 2.05, 0, 0.5, 0.8], roshan: [-1.05, 1.2, -0.6, 0, 0.72], reet: [0.15, 0.25, 0.6, -0.35, 0.75], chand: [-0.85, -0.75, 1.2, 0.2, 0.72], gol: [1.0, -0.85, 1.6, 0, 0.72] },
  };
  const furniture = new THREE.Group(); scene.add(furniture);
  PIECES.forEach((p) => { p.obj = p.make(); p.obj.userData.id = p.id; furniture.add(p.obj); p.seed = Math.random() * 10; });

  /* ---------- room ---------- */
  const room = new THREE.Group(); scene.add(room);
  const W = 7.6, D = 6.4, H = 3.5;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, 12), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.z = 2.6; floor.receiveShadow = true; room.add(floor);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat); back.position.set(0, H / 2, -3.4); back.receiveShadow = true; room.add(back);
  // left wall with an arch opening
  const shape = new THREE.Shape(); shape.moveTo(-D / 2, 0); shape.lineTo(D / 2, 0); shape.lineTo(D / 2, H); shape.lineTo(-D / 2, H); shape.lineTo(-D / 2, 0);
  const hole = new THREE.Path(); const aw = 0.8, ah = 1.9, ac = -1.0;
  hole.moveTo(ac - aw, 0); hole.lineTo(ac - aw, ah); hole.absarc(ac, ah, aw, Math.PI, 0, true); hole.lineTo(ac + aw, 0); hole.lineTo(ac - aw, 0);
  shape.holes.push(hole);
  const left = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.25, bevelEnabled: false, curveSegments: 32 }), archWallMat);
  left.rotation.y = Math.PI / 2; left.position.set(-W / 2, 0, -0.2); left.receiveShadow = true; left.castShadow = true; room.add(left);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3), fade(new THREE.MeshBasicMaterial({ color: "#f6dcb4" })));
  glow.rotation.y = Math.PI / 2; glow.position.set(-W / 2 - 0.6, 1.4, 0.8); room.add(glow); roomMats.push(glow.material);
  // right wall of wooden slats, which rise one by one
  const slats = [];
  const slatGeo = new THREE.BoxGeometry(0.07, H, 0.09);
  for (let z = -3.3; z <= 2.8; z += 0.17) { const s = mesh(slatGeo, slatMat, W / 2 - 0.05, H / 2, z); s.castShadow = false; room.add(s); slats.push(s); }
  const rightMat = wallMat.clone(); roomMats.push(rightMat);
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), rightMat); rightWall.rotation.y = -Math.PI / 2; rightWall.position.set(W / 2 + 0.05, H / 2, -0.2); room.add(rightWall);

  /* ---------- light ---------- */
  scene.add(new THREE.HemisphereLight("#fff3e2", "#b9a184", 0.7));
  const sun = new THREE.DirectionalLight("#ffd9a8", 2.6);
  sun.position.set(5, 6, 3); sun.castShadow = true;
  const sm = innerWidth < 700 ? 1024 : 2048;
  sun.shadow.mapSize.set(sm, sm); sun.shadow.radius = 6; sun.shadow.bias = -0.0005;
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 25 });
  scene.add(sun);
  // soft contact shadow for the floating pieces (before the floor exists)
  const shadowTex = canvasTex(128, 128, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, "rgba(60,40,20,.35)"); gr.addColorStop(1, "rgba(60,40,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  PIECES.forEach((p) => {
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; scene.add(sh); p.blob = sh;
  });

  /* ---------- hotspot tags ---------- */
  const tagsEl = root.querySelector(".h3-tags");
  function drawTags() {
    const w = S.getWood();
    tagsEl.innerHTML = PIECES.map((p) => { const pr = S.productById(p.id); return `<a class="hotspot" href="product.html?id=${p.id}&wood=${w}" data-tag="${p.id}"><i></i><span>${pr.name} · ${money(priceFor(pr, w))}</span></a>`; }).join("");
  }
  drawTags();
  window.addEventListener("store:change", () => { wood.color.copy(woodTone(S.getWood())); drawTags(); });

  /* ---------- layout ---------- */
  let tall = false, vw = 1, vh = 1;
  function resize() {
    const r = root.querySelector(".h3-sticky").getBoundingClientRect();
    vw = r.width; vh = r.height;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    tall = camera.aspect < 0.9;
    camera.fov = tall ? 52 : 35;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize); resize();

  /* ---------- scroll + pointer ---------- */
  let progress = 0, target = 0, mx = 0, my = 0, smx = 0, smy = 0;
  function readScroll() {
    const r = root.getBoundingClientRect();
    const total = r.height - innerHeight;
    target = clamp(-r.top / Math.max(1, total));
  }
  const forced = new URLSearchParams(location.search).get("p3d");
  if (forced === null) { addEventListener("scroll", readScroll, { passive: true }); readScroll(); }
  else { target = progress = clamp(Number(forced) || 0); }
  root.addEventListener("pointermove", (e) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; });

  const v3 = new THREE.Vector3();
  const copy = root.querySelector(".h3-copy"), title = root.querySelector(".h3-title"), cue = root.querySelector(".h3-scroll");

  function frame(t) {
    t /= 1000;
    progress += (target - progress) * (reduce ? 1 : 0.09);
    const p = progress;
    smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05;

    // overlay copy
    const out = range(p, 0.02, 0.2);
    copy.style.opacity = 1 - out; copy.style.translate = `0 ${-out * 60}px`;
    copy.style.pointerEvents = out > 0.6 ? "none" : "";
    cue.style.opacity = 1 - range(p, 0, 0.08);
    const tin = range(p, 0.82, 0.95);
    title.style.opacity = tin; title.style.transform = `translateY(${(1 - tin) * 20}px)`;

    // camera: from looking at the floating pieces to standing in the room
    const cp = ease(range(p, 0.15, 0.85));
    const start = tall ? { x: 0, y: 0.2, z: 10.5, lx: 0, ly: -0.6 } : { x: 0.3, y: 1.2, z: 9.5, lx: 0.3, ly: 1.0 };
    const end = tall ? { x: 0.1, y: 2.1, z: 8.4, lx: 0, ly: 0.95 } : { x: 0, y: 2.3, z: 7.4, lx: 0, ly: 0.85 };
    camera.position.set(lerp(start.x, end.x, cp) + smx * 0.25 * (1 - cp * 0.6), lerp(start.y, end.y, cp) - smy * 0.15, lerp(start.z, end.z, cp));
    camera.lookAt(lerp(start.lx, end.lx, cp), lerp(start.ly, end.ly, cp), -0.6 * cp);

    // room builds itself: floor, back wall, arch wall, then the slats one by one
    floorMat.opacity = easeOut(range(p, 0.18, 0.4));
    wallMat.opacity = easeOut(range(p, 0.3, 0.52));
    rightMat.opacity = easeOut(range(p, 0.62, 0.78));
    archWallMat.opacity = easeOut(range(p, 0.36, 0.56));
    glow.material.opacity = 0.9 * easeOut(range(p, 0.45, 0.62));
    slatMat.opacity = easeOut(range(p, 0.48, 0.58));
    slats.forEach((s, i) => { const k = easeOut(range(p, 0.48 + i * 0.005, 0.62 + i * 0.005)); s.scale.y = Math.max(0.001, k); s.position.y = (H * k) / 2; });
    roomMats.forEach((m) => { m.depthWrite = m.opacity > 0.98; m.visible = m.opacity > 0.01; });

    // pieces fly in, in order
    const set = tall ? START.tall : START.wide;
    PIECES.forEach((pc) => {
      const [sx, sy, sz, sr, ss] = set[pc.id];
      const a = 0.16 + pc.order * 0.085;
      const k = ease(range(p, a, a + 0.28));
      const bob = reduce ? 0 : Math.sin(t * 1.1 + pc.seed) * 0.08 * (1 - k);
      const spin = reduce ? 0 : Math.sin(t * 0.5 + pc.seed) * 0.18 * (1 - k);
      const arc = Math.sin(k * Math.PI) * 0.6;
      const o = pc.obj;
      o.position.set(lerp(sx, pc.end[0], k), lerp(sy, pc.end[1], k) + bob + arc, lerp(sz, pc.end[2], k));
      o.rotation.y = lerp(sr + spin + smx * 0.3, pc.end[3], k);
      o.rotation.x = (1 - k) * (0.12 + smy * 0.06);
      o.rotation.z = (1 - k) * Math.sin(pc.seed) * 0.06;
      o.scale.setScalar(lerp(ss, 1, k));
      pc.blob.position.set(o.position.x, o.position.y - 0.3 + 0.31 * k, o.position.z);
      pc.blob.material.opacity = (1 - floorMat.opacity) * 0.9;
      pc.blob.scale.setScalar(o.scale.x * (1 - 0.15 * bob));
      if (o.userData.bulb) o.userData.bulb.intensity = 1.2 * k;
    });

    // tags follow their pieces once they have landed
    const showTags = p > 0.9;
    tagsEl.classList.toggle("on", showTags);
    if (showTags) {
      PIECES.forEach((pc) => {
        const el = tagsEl.querySelector(`[data-tag="${pc.id}"]`); if (!el) return;
        v3.set(...pc.tag).applyMatrix4(pc.obj.matrixWorld).project(camera);
        el.style.left = ((v3.x + 1) / 2) * 100 + "%"; el.style.top = ((1 - v3.y) / 2) * 100 + "%";
      });
    }
    renderer.render(scene, camera);
  }

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  renderer.setAnimationLoop((t) => { if (visible) frame(t); });
  root.classList.add("ready");
}
