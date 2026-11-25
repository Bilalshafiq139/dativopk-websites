// Procedural clay-style dental models (no external assets).
// Used by the live hero scene and by the offline renderer that produced assets/img/*.webp
import * as THREE from "three";

export const PALETTE = {
  enamel: 0xf1ebe1,
  enamelWarm: 0xe9dfcf,
  gum: 0xc9a096,
  pine: 0x24443c,
  titanium: 0xc4c6c2,
  clay: 0xcbb8a2,
  ink: 0x1c2422,
};

export const clay = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...extra });

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Crown of a molar: a sphere reshaped into a squarish crown with four cusps and a central fissure.
function molarCrown(seg = 96) {
  const g = new THREE.SphereGeometry(1, seg, seg);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const r = Math.hypot(v.x, v.z), th = Math.atan2(v.z, v.x);
    let s = 1 + 0.07 * Math.cos(4 * th);                       // squarish outline
    if (v.y < 0) s *= 1 - 0.32 * Math.pow(-v.y, 1.6);          // narrow towards the neck
    else s *= 1 + 0.05 * Math.sin(Math.PI * v.y);              // slight bulge
    let y = v.y;
    if (y > 0) {
      y = 0.42 * y;
      const cusp = Math.pow(0.5 + 0.5 * Math.cos(4 * th - Math.PI), 2.2); // four lobes
      y += 0.26 * cusp * smooth(0.15, 0.75, r) * smooth(0.98, 0.55, r);
      y -= 0.16 * Math.exp(-(r * r) / 0.06);                   // central pit
      const groove = Math.pow(Math.abs(Math.sin(2 * th)), 0.6); // fissures between cusps
      y -= 0.05 * (1 - groove) * smooth(0.05, 0.5, r) * smooth(0.95, 0.6, r);
    } else {
      y = 0.95 * y;
    }
    p.setXYZ(i, v.x * s, y, v.z * s);
  }
  g.computeVertexNormals();
  return g;
}

function root(length, radius, bendX = 0, bendZ = 0, seg = 48) {
  const g = new THREE.CylinderGeometry(radius, radius * 0.18, length, seg, 40, false);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = 0.5 - v.y / length; // 0 at top, 1 at tip
    // round the tip
    const tipShrink = t > 0.85 ? Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.85) / 0.15, 2))) : 1;
    p.setXYZ(i, v.x * (0.25 + 0.75 * tipShrink) + bendX * t * t, v.y, v.z * (0.25 + 0.75 * tipShrink) + bendZ * t * t);
  }
  g.translate(0, -length / 2, 0);
  g.computeVertexNormals();
  return g;
}

export function makeMolar({ color = PALETTE.enamel, roots = true } = {}) {
  const grp = new THREE.Group();
  const mat = clay(color, { roughness: 0.62 });
  const crown = new THREE.Mesh(molarCrown(), mat);
  crown.castShadow = true; crown.receiveShadow = true;
  grp.add(crown);
  if (roots) {
    const defs = [[-0.38, 0.12, -0.25, 0.05], [0.38, 0.12, 0.25, 0.05], [0, -0.38, 0, -0.18]];
    for (const [x, z, bx, bz] of defs) {
      const r = new THREE.Mesh(root(1.75, 0.36, bx, bz), mat);
      r.position.set(x, -0.45, z);
      r.castShadow = true;
      grp.add(r);
    }
  }
  return grp;
}

// Incisor: shovel-shaped crown (wide flat edge, narrow neck) with one root.
export function makeIncisor({ color = PALETTE.enamel, scale = 1, withRoot = true } = {}) {
  const grp = new THREE.Group();
  const g = new THREE.SphereGeometry(1, 72, 72);
  const p = g.attributes.position, v = new THREE.Vector3();
  const sq = (a, e) => Math.sign(a) * Math.pow(Math.abs(a), e);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const yN = v.y;
    const w = 0.34 + 0.32 * smooth(-1, 0.35, yN);              // narrow neck -> wide edge
    const d = 0.36 * (1 - 0.6 * smooth(-0.2, 1, yN));            // thin towards the edge
    const x = sq(v.x, 0.55) * w;
    const z = (v.z > 0 ? 0.85 : 1) * v.z * d;
    const y = yN > 0 ? 1.15 * sq(yN, 0.35) * 0.9 : yN * 1.05;
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  const mat = clay(color, { roughness: 0.6 });
  const crown = new THREE.Mesh(g, mat);
  crown.castShadow = true; crown.receiveShadow = true;
  grp.add(crown);
  if (withRoot) {
    const r = new THREE.Mesh(root(2.1, 0.3, 0, -0.08), mat);
    r.position.y = -0.6; r.castShadow = true;
    grp.add(r);
  }
  grp.scale.setScalar(scale);
  return grp;
}

// Implant: crown on an abutment and a threaded titanium screw.
export function makeImplant() {
  const grp = new THREE.Group();
  const crown = makeMolar({ roots: false });
  crown.position.y = 0.95;
  grp.add(crown);
  const ti = new THREE.MeshStandardMaterial({ color: 0xc4c6c2, roughness: 0.42, metalness: 0.35 });
  const abut = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.5, 48), ti);
  abut.position.y = 0.05; abut.castShadow = true; grp.add(abut);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.26, 2.1, 48), ti);
  body.position.y = -1.2; body.castShadow = true; grp.add(body);
  for (let i = 0; i < 11; i++) {
    const t = i / 10, rr = 0.42 - 0.15 * t;
    const thread = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.055, 12, 64), ti);
    thread.rotation.x = Math.PI / 2 + 0.08;
    thread.position.y = -0.3 - t * 1.85;
    thread.castShadow = true;
    grp.add(thread);
  }
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), ti);
  tip.position.y = -2.25; grp.add(tip);
  return grp;
}

// Dental arch (U-shaped row of teeth), optional clear aligner shell over it.
export function makeArch({ aligner = false, gum = true, stained = false, missing = [], crooked = false } = {}) {
  const grp = new THREE.Group();
  const n = 12;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) * 2 - 1;            // -1..1
    const x = t * 2.9, z = -2.4 * t * t + 1.3; // parabola
    pts.push(new THREE.Vector3(x, 0, z));
  }
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) * 2 - 1, a = Math.abs(t);
    const prev = pts[Math.max(0, i - 1)], next = pts[Math.min(n - 1, i + 1)];
    const dir = next.clone().sub(prev).normalize();
    if (missing.includes(i)) continue;
    const stains = [0xd8c28e, 0xcdb27a, 0xe0cfa0, 0xc9a873, 0xd6bd86];
    const color = stained ? stains[i % stains.length] : PALETTE.enamel;
    let tooth;
    if (a < 0.5) tooth = makeIncisor({ scale: a < 0.2 ? 0.5 : 0.44, withRoot: false, color });
    else { tooth = makeMolar({ roots: false, color }); tooth.scale.setScalar(0.36 + 0.1 * a); }
    tooth.position.copy(pts[i]);
    tooth.position.y = a < 0.5 ? 0.38 : 0.2;
    const ang = Math.atan2(dir.z, dir.x);
    tooth.rotation.y = -ang;
    if (a < 0.5) tooth.rotation.x = -0.1;
    if (crooked) { const k = Math.sin(i * 12.9898) * 43758.5453 % 1; tooth.rotation.y += k * 0.5; tooth.rotation.z += k * 0.18; tooth.position.z += k * 0.12; }
    grp.add(tooth);
  }
  if (gum) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p.x * 1.02, -0.18, p.z)));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.5, 32, false), clay(PALETTE.gum, { roughness: 0.7 }));
    tube.scale.y = 0.6; tube.castShadow = true; tube.receiveShadow = true;
    grp.add(tube);
  }
  if (aligner) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p.x, 0.45, p.z)));
    const shell = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, 0.58, 40, false),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.12, transmission: 0.0, transparent: true, opacity: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, depthWrite: false }));
    shell.scale.set(1.0, 0.95, 1.0);
    grp.add(shell);
  }
  return grp;
}

// Dental mirror: straight handle, short neck and an angled round mirror head.
export function makeMirror() {
  const grp = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xd2d3cf, roughness: 0.35, metalness: 0.3 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 4, 32), steel);
  handle.position.y = 2; handle.castShadow = true; grp.add(handle);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.09, 0.9, 16), steel);
  neck.position.y = 4.45; neck.castShadow = true; grp.add(neck);
  const head = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.09, 48), steel);
  rim.castShadow = true; head.add(rim);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.33, 48), new THREE.MeshStandardMaterial({ color: 0xe9efec, roughness: 0.08, metalness: 0.6 }));
  glass.rotation.x = -Math.PI / 2; glass.position.y = 0.05; head.add(glass);
  head.position.set(0, 5.05, 0.15); head.rotation.x = 0.9; grp.add(head);
  return grp;
}

// Toothbrush: handle, neck, head and bristle tufts.
export function makeToothbrush({ color = 0x0e6b66 } = {}) {
  const grp = new THREE.Group();
  const plastic = new THREE.MeshStandardMaterial({ color, roughness: 0.45 });
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 3.6, 8, 32), plastic);
  handle.scale.z = 0.7; handle.castShadow = true; grp.add(handle);
  const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 1.0, 8, 24), plastic);
  neck.position.y = 2.6; neck.castShadow = true; grp.add(neck);
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.75, 8, 24), plastic);
  head.position.y = 3.55; head.scale.z = 0.55; head.castShadow = true; grp.add(head);
  const bristle = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.8 });
  for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) {
    const tuft = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.5, 12), bristle);
    tuft.rotation.x = Math.PI / 2; tuft.position.set(c ? 0.09 : -0.09, 3.2 + r * 0.14, 0.33); tuft.castShadow = true;
    grp.add(tuft);
  }
  return grp;
}

// Standard soft "studio" lighting + shadow catcher.
export function stage(scene, { shadow = 0.12, floorY = -2 } = {}) {
  scene.add(new THREE.HemisphereLight(0xfffaf2, 0xd9cfc2, 1.25));
  const key = new THREE.DirectionalLight(0xfff4e6, 2.1);
  key.position.set(4, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 10;
  key.shadow.blurSamples = 20;
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 30 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe6efe9, 0.9);
  rim.position.set(-6, 3, -5);
  scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: shadow }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = floorY; floor.receiveShadow = true;
  scene.add(floor);
  return { key, floor };
}
