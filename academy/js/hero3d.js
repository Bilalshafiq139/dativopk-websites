import * as THREE from "three";

/**
 * Gallery-style 3D illustrations, one meaningful scene per programme.
 * Matte "clay" materials on the ivory page, soft studio light, real contact shadow.
 *
 *   initScene(canvas, { shape: "hero" | <course slug>, tint })   -> live, animated
 *   snapshot(shape, tint, w, h)                                  -> dataURL still image
 */
const C = { paper: "#f3f0e8", clay: "#e4ddcf", clay2: "#d6cebd", ink: "#1b1b19", ink2: "#3b3a35", muted: "#8a857a", green: "#5e7153" };

/* ---------------- helpers ---------------- */
function mat(color, rough = 0.85, opts = {}) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: rough, metalness: 0, ...opts });
}
function roundedSlab(w, h, depth, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const bevel = Math.min(0.04, depth / 3);
  const g = new THREE.ExtrudeGeometry(s, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 16 });
  g.translate(0, 0, -(depth - bevel * 2) / 2);
  return g;
}
/** A flat plane carrying a 2D drawing (text, UI). draw(ctx, W, H) */
function panel(w, h, draw, px = 512) {
  const cv = document.createElement("canvas");
  cv.width = px; cv.height = Math.round(px * (h / w));
  const ctx = cv.getContext("2d");
  draw(ctx, cv.width, cv.height);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
}
function rr(ctx, x, y, w, h, r, fill) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); }
const FONT = (size, weight = 500) => `${weight} ${size}px Inter, "Segoe UI", Arial, sans-serif`;
const SERIF = (size) => `${size}px "Instrument Serif", Georgia, serif`;

function heartShape(s = 1) {
  const h = new THREE.Shape();
  h.moveTo(0, -0.9 * s);
  h.bezierCurveTo(-1.6 * s, -0.1 * s, -1.0 * s, 1.15 * s, 0, 0.45 * s);
  h.bezierCurveTo(1.0 * s, 1.15 * s, 1.6 * s, -0.1 * s, 0, -0.9 * s);
  return h;
}
function starShape(r1, r2, n = 4) {
  const s = new THREE.Shape();
  for (let i = 0; i <= n * 2; i++) {
    const r = i % 2 ? r2 : r1, a = (i / (n * 2)) * Math.PI * 2 + Math.PI / 2;
    i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return s;
}
const extrude = (shape, depth) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }); g.center(); return g; };

/* ---------------- scene builders ----------------
   each gets (g = THREE.Group, tint) and returns tick(t) */
const BUILDERS = {
  /* Home: graduation cap resting on a stack of books */
  hero(g, tint) {
    const books = [["#2f2e2a", 3.1, 0.42], [tint, 2.8, 0.38], [C.clay2, 3.0, 0.46]];
    let y = -2.05;
    books.forEach(([col, w, h], i) => {
      const b = new THREE.Group();
      const cover = new THREE.Mesh(roundedSlab(w, 2.1, h, 0.06), mat(col, 0.8));
      cover.rotation.x = -Math.PI / 2;
      const pages = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, h * 0.72, 2.0), mat("#f6f2e8", 0.95));
      pages.position.x = 0.06;
      b.add(cover, pages);
      b.position.y = y + h / 2; b.rotation.y = [0.12, -0.18, 0.05][i];
      y += h;
      g.add(b);
    });
    const cap = new THREE.Group();
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 2.5), mat(C.ink, 0.6));
    board.rotation.y = Math.PI / 4;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.6, 64, 1, true), mat(C.ink, 0.6, { side: THREE.DoubleSide }));
    crown.position.y = -0.32;
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 24), mat(tint, 0.6));
    button.position.y = 0.06;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.25, 12), mat(tint, 0.6));
    cord.position.set(0.62, -0.5, 0.62);
    const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.38, 24), mat(tint, 0.7));
    tassel.position.set(0.62, -1.2, 0.62);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12), mat(tint, 0.6));
    arm.rotation.z = Math.PI / 2; arm.rotation.y = -Math.PI / 4; arm.position.set(0.31, 0.06, 0.31);
    cap.add(board, crown, button, cord, tassel, arm);
    cap.position.set(0.1, y + 0.62, 0); cap.rotation.set(0.08, 0.3, -0.1);
    g.add(cap);
    return (t) => { cap.position.y = y + 0.62 + Math.sin(t * 1.1) * 0.07; cap.rotation.y = 0.3 + Math.sin(t * 0.5) * 0.15; tassel.rotation.z = Math.sin(t * 1.6) * 0.15; };
  },

  /* Data Analytics: bar chart with a trend line and a pie */
  "data-analytics"(g, tint) {
    const base = new THREE.Mesh(roundedSlab(4.4, 2.6, 0.18, 0.18), mat(C.clay2));
    base.rotation.x = -Math.PI / 2; base.position.y = -1.96; g.add(base);
    const heights = [0.9, 1.4, 1.15, 1.9, 2.5];
    const bars = heights.map((h, i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1, 0.46), mat(i === 4 ? tint : C.clay));
      m.position.set(-1.6 + i * 0.72, -1.87, -0.2); m.userData.h = h; g.add(m); return m;
    });
    const pts = heights.map((h, i) => new THREE.Vector3(-1.6 + i * 0.72, -1.87 + h + 0.45, 0.05));
    const line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.03, 8), mat(C.ink, 0.5));
    g.add(line);
    pts.forEach(p => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), mat(C.ink, 0.5)); d.position.copy(p); g.add(d); });
    const pieA = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.22, 64, 1, false, 0, Math.PI * 1.4), mat(C.clay));
    const pieB = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.22, 64, 1, false, Math.PI * 1.4, Math.PI * 0.6), mat(C.ink, 0.6));
    pieB.position.set(0.08, 0.06, 0.05);
    const pie = new THREE.Group(); pie.add(pieA, pieB); pie.position.set(1.4, -1.75, 0.85); pie.rotation.x = 0.15; g.add(pie);
    g.rotation.y = -0.35;
    return (t) => {
      const k = Math.min(1, t / 1.6), e = 1 - Math.pow(1 - k, 3);
      bars.forEach((b, i) => { const h = b.userData.h * (0.94 + Math.sin(t * 0.8 + i) * 0.06) * e + 0.001; b.scale.y = h; b.position.y = -1.87 + h / 2; });
      line.visible = k > 0.95; pie.rotation.y = t * 0.3;
    };
  },

  /* Machine Learning: a small neural network with signals flowing */
  "machine-learning"(g, tint) {
    const layers = [3, 5, 5, 2];
    const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => new THREE.Vector3((li - 1.5) * 1.55, (i - (n - 1) / 2) * 0.78, 0)));
    const edges = [];
    for (let l = 0; l < nodes.length - 1; l++) nodes[l].forEach(a => nodes[l + 1].forEach(b => edges.push([a, b])));
    const lg = new THREE.BufferGeometry().setFromPoints(edges.flat());
    g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: C.ink, transparent: true, opacity: 0.28 })));
    nodes.forEach((layer, li) => layer.forEach(p => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(li === 3 ? 0.24 : 0.2, 40, 40), mat(li === 3 ? tint : (li === 0 ? C.ink2 : C.clay)));
      m.position.copy(p); m.castShadow = true; g.add(m);
    }));
    const pulses = Array.from({ length: 10 }, (_, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), mat(tint, 0.5, { emissive: new THREE.Color(tint), emissiveIntensity: 0.3 }));
      m.userData = { e: edges[(i * 7) % edges.length], o: i / 10 }; g.add(m); return m;
    });
    g.position.y = 0.1;
    return (t) => {
      pulses.forEach((p, i) => {
        const k = (t * 0.45 + p.userData.o) % 1;
        if (k < 0.02) p.userData.e = edges[Math.floor(Math.random() * edges.length)];
        p.position.lerpVectors(p.userData.e[0], p.userData.e[1], k);
      });
      g.rotation.y = Math.sin(t * 0.35) * 0.45;
    };
  },

  /* Meta Ads: phone showing a sponsored post, with likes floating up */
  "meta-ads"(g, tint) {
    const phone = new THREE.Group();
    phone.add(new THREE.Mesh(roundedSlab(1.9, 3.7, 0.2, 0.3), mat(C.ink, 0.45)));
    const screen = panel(1.72, 3.5, (c, W, H) => {
      c.fillStyle = "#faf8f3"; c.fillRect(0, 0, W, H);
      c.fillStyle = C.ink; c.font = FONT(26, 600); c.fillText("9:41", 34, 46);
      // post header
      c.beginPath(); c.arc(60, 120, 26, 0, 7); c.fillStyle = tint; c.fill();
      c.fillStyle = C.ink; c.font = FONT(24, 600); c.fillText("Nexora Academy", 100, 114);
      c.fillStyle = C.muted; c.font = FONT(19); c.fillText("Sponsored", 100, 140);
      // creative
      rr(c, 24, 170, W - 48, 470, 14, "#e8e1d3");
      c.fillStyle = C.ink; c.font = SERIF(64); c.fillText("Learn skills", 56, 360); c.font = `italic ${SERIF(64)}`; c.fillText("that pay.", 56, 430);
      rr(c, 56, 470, 210, 54, 27, C.ink); c.fillStyle = "#fff"; c.font = FONT(22, 600); c.fillText("Enroll now", 96, 505);
      // actions
      c.fillStyle = tint; c.font = FONT(30); c.fillText("♥", 30, 690); c.fillStyle = C.ink; c.fillText("💬", 80, 690);
      c.font = FONT(22, 600); c.fillText("2,431 likes", 30, 740);
      c.fillStyle = C.ink2; c.font = FONT(20); ["Winter intake is open. Small batches,", "live mentors, real projects."].forEach((l, i) => c.fillText(l, 30, 780 + i * 30));
      rr(c, 24, 860, W - 48, 160, 14, "#ece6da");
    }, 512);
    screen.position.z = 0.111; phone.add(screen);
    phone.rotation.set(-0.08, 0.32, 0.05);
    g.add(phone);
    g.position.x = -0.2;
    const hearts = [0, 1, 2].map(i => {
      const h = new THREE.Mesh(extrude(heartShape(0.28 + i * 0.06), 0.14), mat(i === 1 ? C.ink : tint, 0.6));
      h.rotation.z = Math.PI; h.userData.o = i / 3; g.add(h); return h;
    });
    const bubble = panel(1.6, 0.52, (c, W, H) => { rr(c, 0, 0, W, H, H / 2, C.ink); c.fillStyle = "#fff"; c.font = FONT(H * 0.36, 600); c.textAlign = "center"; c.fillText("+312 new leads", W / 2, H * 0.63); }, 420);
    bubble.position.set(-1.75, 1.2, 0.4); bubble.rotation.y = 0.3; g.add(bubble);
    return (t) => {
      hearts.forEach((h, i) => { const k = (t * 0.25 + h.userData.o) % 1; h.position.set(1.35 + Math.sin(k * 6 + i) * 0.2, -1.2 + k * 3.2, 0.4); h.scale.setScalar(Math.sin(k * Math.PI)); h.rotation.y = t; });
      phone.rotation.y = 0.32 + Math.sin(t * 0.4) * 0.12; bubble.position.y = 1.2 + Math.sin(t * 0.9) * 0.08;
    };
  },

  /* Google Ads: search bar with a sponsored result and a cursor clicking it */
  "google-ads"(g, tint) {
    const bar = new THREE.Group();
    bar.add(new THREE.Mesh(roundedSlab(4.2, 0.8, 0.18, 0.4), mat("#faf8f3", 0.9)));
    const txt = panel(3.9, 0.66, (c, W, H) => {
      c.fillStyle = "#faf8f3"; c.fillRect(0, 0, W, H);
      c.strokeStyle = C.muted; c.lineWidth = 6; c.beginPath(); c.arc(60, H / 2 - 4, 22, 0, 7); c.stroke(); c.beginPath(); c.moveTo(76, H / 2 + 12); c.lineTo(94, H / 2 + 30); c.stroke();
      c.fillStyle = C.ink; c.font = FONT(H * 0.36); c.fillText("best digital marketing course", 130, H * 0.62);
      c.fillStyle = C.ink; c.fillRect(130 + c.measureText("best digital marketing course").width + 8, H * 0.3, 4, H * 0.42);
    }, 900);
    txt.position.z = 0.092; bar.add(txt);
    bar.position.set(0, 1.25, 0); g.add(bar);
    const card = (y, ad, z) => {
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(roundedSlab(3.9, 1.05, 0.12, 0.12), mat(ad ? "#ffffff" : C.clay, 0.9)));
      const p = panel(3.7, 0.9, (c, W, H) => {
        c.fillStyle = ad ? "#ffffff" : C.clay; c.fillRect(0, 0, W, H);
        if (ad) { c.fillStyle = C.ink; c.font = FONT(H * 0.17, 700); c.fillText("Sponsored", 10, H * 0.24); }
        c.fillStyle = C.muted; c.font = FONT(H * 0.16); c.fillText(ad ? "nexora.academy › google-ads" : "example.com › blog", ad ? 225 : 10, H * 0.24);
        c.fillStyle = ad ? tint : C.ink2; c.font = FONT(H * 0.22, 600); c.fillText(ad ? "Google Ads Course | Nexora Academy" : "10 tips for online marketing", 10, H * 0.58);
        c.fillStyle = C.muted; c.font = FONT(H * 0.16); c.fillText(ad ? "6 weeks · Live mentors · Certificate · Enroll today" : "A beginner's guide to getting started", 10, H * 0.86);
      }, 900);
      p.position.z = 0.062; grp.add(p);
      grp.position.set(0, y, z); g.add(grp); return grp;
    };
    const adCard = card(0.05, true, 0.15);
    card(-1.15, false, 0);
    const arrow = new THREE.Shape(); arrow.moveTo(0, 0); arrow.lineTo(0, -0.62); arrow.lineTo(0.15, -0.48); arrow.lineTo(0.27, -0.72); arrow.lineTo(0.37, -0.67); arrow.lineTo(0.25, -0.44); arrow.lineTo(0.45, -0.44); arrow.closePath();
    const cursor = new THREE.Mesh(extrude(arrow, 0.06), mat(C.ink, 0.5)); g.add(cursor);
    g.rotation.set(-0.12, -0.28, 0);
    return (t) => {
      const k = (t * 0.35) % 1, press = k > 0.55 && k < 0.65;
      cursor.position.set(1.9 - Math.min(k, 0.55) * 1.6, -0.7 + Math.min(k, 0.55) * 0.8, 0.45 + (press ? -0.06 : 0));
      adCard.position.z = press ? 0.08 : 0.15; adCard.scale.setScalar(press ? 0.985 : 1);
    };
  },

  /* UI/UX: a tablet with a wireframe, and design components lifting off it */
  "ui-ux-design"(g, tint) {
    const tab = new THREE.Group();
    tab.add(new THREE.Mesh(roundedSlab(3.6, 2.6, 0.16, 0.22), mat(C.ink, 0.45)));
    const scr = panel(3.36, 2.38, (c, W, H) => {
      c.fillStyle = "#faf8f3"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(27,27,25,.08)"; c.lineWidth = 1;
      for (let x = 0; x < W; x += 24) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
      for (let y = 0; y < H; y += 24) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      rr(c, 30, 24, 120, 20, 6, C.ink); [0, 1, 2].forEach(i => rr(c, W - 260 + i * 80, 28, 56, 12, 6, C.clay2));
      rr(c, 30, 80, W * 0.48, 34, 6, C.ink2); rr(c, 30, 126, W * 0.38, 34, 6, C.ink2);
      rr(c, 30, 180, W * 0.42, 12, 6, C.clay2); rr(c, 30, 200, W * 0.34, 12, 6, C.clay2);
      rr(c, 30, 236, 130, 40, 20, tint);
      rr(c, W * 0.58, 80, W * 0.36, 200, 12, "#e8e1d3");
      [0, 1, 2].forEach(i => rr(c, 30 + i * ((W - 60) / 3 + 0), 310, (W - 80) / 3, 110, 10, "#ece6da"));
    }, 800);
    scr.position.z = 0.081; tab.add(scr);
    tab.rotation.x = -0.5; tab.position.y = -0.8; g.add(tab);
    const btn = new THREE.Mesh(roundedSlab(0.9, 0.3, 0.1, 0.15), mat(tint, 0.6));
    const cardM = new THREE.Mesh(roundedSlab(1.2, 0.9, 0.08, 0.08), mat("#ffffff", 0.9));
    const swatches = [C.ink, tint, C.clay2, C.green].map((col, i) => { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 48), mat(col, 0.7)); s.rotation.x = Math.PI / 2; s.position.set(-1.65 + i * 0.42, 1.55, 0); g.add(s); return s; });
    btn.position.set(-0.9, 0.55, 0.6); cardM.position.set(1.05, 0.75, 0.4); cardM.rotation.set(-0.2, -0.3, 0.06);
    g.add(btn, cardM);
    const pen = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 24), mat(C.clay, 0.7));
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 24), mat(C.ink, 0.5)); tip.position.y = -0.92; tip.rotation.x = Math.PI;
    pen.add(body, tip); pen.position.set(1.85, -0.2, 0.6); pen.rotation.z = 0.5; g.add(pen);
    return (t) => {
      btn.position.y = 0.55 + Math.sin(t * 0.9) * 0.1; cardM.position.y = 0.75 + Math.sin(t * 0.7 + 1) * 0.1;
      swatches.forEach((s, i) => { s.position.y = 1.55 + Math.sin(t * 1.1 + i * 0.6) * 0.06; });
      pen.rotation.z = 0.5 + Math.sin(t * 0.8) * 0.08; g.rotation.y = Math.sin(t * 0.3) * 0.2;
    };
  },

  /* Generative AI: a chat between a person and an AI assistant */
  "artificial-intelligence"(g, tint) {
    const bubble = (w, h, col, draw, x, y, z, tailLeft) => {
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(roundedSlab(w, h, 0.16, 0.22), mat(col, 0.8)));
      const tail = new THREE.Shape(); tail.moveTo(0, 0); tail.lineTo(tailLeft ? -0.28 : 0.28, -0.3); tail.lineTo(tailLeft ? 0.2 : -0.2, 0); tail.closePath();
      const tm = new THREE.Mesh(new THREE.ExtrudeGeometry(tail, { depth: 0.14, bevelEnabled: false }), mat(col, 0.8));
      tm.position.set(tailLeft ? -w / 2 + 0.35 : w / 2 - 0.35, -h / 2 + 0.02, -0.07); grp.add(tm);
      const p = panel(w - 0.3, h - 0.2, draw, 700); p.position.z = 0.081; grp.add(p);
      grp.position.set(x, y, z); g.add(grp); return grp;
    };
    const q = bubble(3.0, 0.8, C.ink, (c, W, H) => { c.fillStyle = C.ink; c.fillRect(0, 0, W, H); c.fillStyle = "#f3f0e8"; c.font = FONT(H * 0.27); c.fillText("Write an ad caption for my bakery", 6, H * 0.6); }, 0.6, 1.05, 0, false);
    const a = bubble(3.3, 1.5, "#faf8f3", (c, W, H) => {
      c.fillStyle = "#faf8f3"; c.fillRect(0, 0, W, H);
      c.fillStyle = tint; c.font = FONT(H * 0.13, 700); c.fillText("✦  AI ASSISTANT", 6, H * 0.18);
      c.fillStyle = C.ink; c.font = SERIF(H * 0.2); c.fillText("“Fresh from the oven, every", 6, H * 0.45); c.fillText("morning. Taste the difference.”", 6, H * 0.66);
      rr(c, 6, H * 0.8, W * 0.3, H * 0.08, H * 0.04, C.clay2); rr(c, W * 0.34, H * 0.8, W * 0.2, H * 0.08, H * 0.04, C.clay2);
    }, -0.45, -0.4, 0.2, true);
    const star = new THREE.Mesh(extrude(starShape(0.5, 0.14), 0.16), mat(tint, 0.55));
    star.position.set(1.75, -0.65, 0.55); g.add(star);
    const small = new THREE.Mesh(extrude(starShape(0.22, 0.06), 0.1), mat(C.ink, 0.55));
    small.position.set(-2.1, 1.2, 0.3); g.add(small);
    const dots = [0, 1, 2].map(i => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), mat(C.muted)); d.position.set(-1.55 + i * 0.22, -1.55, 0.3); g.add(d); return d; });
    g.rotation.y = 0.15;
    return (t) => {
      star.rotation.z = t * 0.6; star.rotation.y = Math.sin(t) * 0.4; small.rotation.z = -t * 0.8;
      q.position.y = 1.05 + Math.sin(t * 0.8) * 0.06; a.position.y = -0.4 + Math.sin(t * 0.8 + 1) * 0.06;
      dots.forEach((d, i) => { d.position.y = -1.55 + Math.max(0, Math.sin(t * 4 - i * 0.7)) * 0.12; });
    };
  },
};

/* ---------------- stage (lights, camera, shadow) ---------------- */
function buildStage(renderer, shape, tint) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.4, 12.5);
  camera.lookAt(0, -0.2, 0);

  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xb9b1a2, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-4, 7, 6); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
  key.shadow.radius = 6; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xfff1e0, 0.8); rim.position.set(5, 2, -4); scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2.06; ground.receiveShadow = true;
  scene.add(ground);

  const pivot = new THREE.Group(); scene.add(pivot);
  const g = new THREE.Group(); pivot.add(g);
  const tick = (BUILDERS[shape] || BUILDERS.hero)(g, tint);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = !o.material.map; } });
  return { scene, camera, pivot, tick };
}

export function initScene(canvas, { shape = "hero", tint = "#9c4a2f" } = {}) {
  if (!canvas) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { scene, camera, pivot, tick } = buildStage(renderer, shape, tint);

  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener("pointermove", e => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  resize(); new ResizeObserver(resize).observe(canvas);
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const t = reduced ? 3 : clock.getElapsedTime();
    cur.x += (target.x - cur.x) * 0.04; cur.y += (target.y - cur.y) * 0.04;
    tick(t);
    pivot.rotation.y = cur.x * 0.22; pivot.rotation.x = cur.y * 0.06;
    pivot.position.y = Math.sin(t * 0.6) * 0.05;
    renderer.render(scene, camera);
  })();
}

/** Render a still image of a scene (used for course thumbnails). */
let shotRenderer;
export function snapshot(shape, tint, w = 480, h = 360) {
  try {
    shotRenderer ||= new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch { return null; }
  shotRenderer.setPixelRatio(1);
  shotRenderer.setSize(w, h, false);
  const { scene, camera, tick } = buildStage(shotRenderer, shape, tint);
  camera.aspect = w / h; camera.position.set(0, 1.1, 9.6); camera.lookAt(0, -0.25, 0); camera.updateProjectionMatrix();
  tick(3);
  shotRenderer.render(scene, camera);
  const url = shotRenderer.domElement.toDataURL("image/png");
  scene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); [].concat(o.material).forEach(m => { m.map?.dispose(); m.dispose(); }); } });
  return url;
}
