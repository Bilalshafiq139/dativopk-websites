// Hero: real photos of the pieces float on the page. On scroll an arch opens onto an empty room,
// and the pieces fly into it one by one, in a set order, until the room is furnished.
import { money, priceFor } from "./data.js";
import * as S from "./store.js";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const range = (p, a, b) => clamp((p - a) / (b - a));

// start: centre of the piece on screen (fractions of the viewport) + width as a fraction of viewport width
// end: centre x and bottom y on the room photo (fractions of the photo) + width as a fraction of the photo width
const PIECES = [
  { id: "gol", img: "cut-gol", ratio: 601 / 1200, order: 0,
    wide: { s: [0.47, 0.76, 0.08], e: [0.37, 0.905, 0.1] }, tall: { s: [0.24, 0.5, 0.2], e: [0.4, 0.9, 0.075] } },
  { id: "reet", img: "cut-reet", ratio: 609 / 1135, order: 1,
    wide: { s: [0.66, 0.58, 0.24], e: [0.26, 0.645, 0.2] }, tall: { s: [0.55, 0.36, 0.56], e: [0.335, 0.645, 0.13] } },
  { id: "sirhana", img: "cut-sirhana", ratio: 997 / 662, order: 2,
    wide: { s: [0.9, 0.72, 0.06], e: [0.395, 0.635, 0.045] }, tall: { s: [0.84, 0.52, 0.14], e: [0.43, 0.635, 0.032] } },
  { id: "saira", img: "cut-saira", ratio: 1206 / 1200, order: 3,
    wide: { s: [0.9, 0.4, 0.12], e: [0.17, 0.87, 0.17] }, tall: { s: [0.2, 0.2, 0.3], e: [0.3, 0.88, 0.12] } },
  { id: "noor", img: "cut-noor", ratio: 1329 / 984, order: 4,
    wide: { s: [0.68, 0.2, 0.09], e: [0.56, 0.8, 0.11] }, tall: { s: [0.82, 0.17, 0.22], e: [0.5, 0.8, 0.085] } },
];
const ROOM_RATIO = 2000 / 1333;

export function initHeroRoom(root) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sticky = root.querySelector(".h3-sticky");
  const arch = root.querySelector(".hp-arch");
  const roomImg = root.querySelector(".hp-room");
  const layer = root.querySelector(".hp-pieces");
  const copy = root.querySelector(".h3-copy"), title = root.querySelector(".h3-title"), cue = root.querySelector(".h3-scroll");
  const tagsEl = root.querySelector(".h3-tags");

  layer.innerHTML = PIECES.map((p) => {
    const pr = S.productById(p.id);
    return `<figure class="hp-piece" data-id="${p.id}"><span class="hp-shadow"></span><img src="assets/img/${p.img}.webp" alt="${pr.name} ${pr.type.toLowerCase()}" draggable="false"></figure>`;
  }).join("");
  PIECES.forEach((p) => { p.el = layer.querySelector(`[data-id="${p.id}"]`); p.seed = Math.random() * 10; });

  function drawTags() {
    const w = S.getWood();
    tagsEl.innerHTML = PIECES.map((p) => { const pr = S.productById(p.id); return `<a class="hotspot" href="product.html?id=${p.id}&wood=${w}" data-tag="${p.id}"><i></i><span>${pr.name} · ${money(priceFor(pr, w))}</span></a>`; }).join("");
  }
  drawTags();
  window.addEventListener("store:change", drawTags);

  // the room photo covers the stage; on tall screens it is shifted so the furnished corner stays in view
  let vw = 1, vh = 1, tall = false, room = { x: 0, y: 0, w: 1, h: 1 };
  function resize() {
    const r = sticky.getBoundingClientRect();
    vw = r.width; vh = r.height; tall = vw / vh < 0.9;
    if (vw / vh > ROOM_RATIO) { room.w = vw; room.h = vw / ROOM_RATIO; room.x = 0; room.y = (vh - room.h) * 0.75; }
    else { room.h = vh; room.w = vh * ROOM_RATIO; room.x = clamp(vw / 2 - (tall ? 0.38 : 0.42) * room.w, vw - room.w, 0); room.y = 0; }
    Object.assign(roomImg.style, { width: room.w + "px", height: room.h + "px", left: room.x + "px", top: room.y + "px" });
    PIECES.forEach((p) => { const L = tall ? p.tall : p.wide; p.baseW = L.e[2] * room.w; p.el.style.width = p.baseW + "px"; });
    draw(true);
  }

  let progress = 0, target = 0, mx = 0, my = 0, smx = 0, smy = 0;
  const forced = new URLSearchParams(location.search).get("p3d");
  function readScroll() {
    const r = root.getBoundingClientRect();
    target = clamp(-r.top / Math.max(1, r.height - innerHeight));
  }
  if (forced === null) { addEventListener("scroll", readScroll, { passive: true }); readScroll(); }
  else target = progress = clamp(Number(forced) || 0);
  root.addEventListener("pointermove", (e) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; });

  function draw(force) {
    const t = performance.now() / 1000;
    const p = progress;

    // copy out, title in
    const out = range(p, 0.02, 0.2);
    copy.style.opacity = 1 - out; copy.style.translate = `0 ${-out * 60}px`;
    copy.style.pointerEvents = out > 0.6 ? "none" : "";
    cue.style.opacity = 1 - range(p, 0, 0.08);
    const tin = range(p, 0.86, 0.97);
    title.style.opacity = tin; title.style.translate = `0 ${(1 - tin) * 20}px`;

    // the arch rises from the bottom, then opens to the whole screen
    const a1 = easeOut(range(p, 0.06, 0.3)), a2 = ease(range(p, 0.3, 0.62));
    const aw = (tall ? 0.62 : 0.3) * vw, ah = (tall ? 0.5 : 0.7) * vh * a1;
    const cx = (tall ? 0.5 : 0.5) * vw;
    const left = lerp(cx - aw / 2, 0, a2), right = lerp(vw - (cx + aw / 2), 0, a2);
    const top = lerp(vh - ah, 0, a2);
    const rad = lerp(aw / 2, 0, a2);
    arch.style.clipPath = `inset(${top}px ${right}px 0px ${left}px round ${rad}px ${rad}px 0 0)`;
    arch.style.visibility = a1 > 0.001 ? "visible" : "hidden";
    roomImg.style.scale = String(lerp(1.12, 1, ease(range(p, 0.06, 0.62))));

    // pieces fly in, in order
    PIECES.forEach((pc) => {
      const L = tall ? pc.tall : pc.wide;
      const a = 0.3 + pc.order * 0.085;
      const k = ease(range(p, a, a + 0.26));
      const sw = L.s[2] * vw, sh = sw * pc.ratio;
      const ew = L.e[2] * room.w, eh = ew * pc.ratio;
      const scx = L.s[0] * vw, scy = L.s[1] * vh;
      const ecx = room.x + L.e[0] * room.w, ecy = room.y + L.e[1] * room.h - eh / 2;
      const bob = reduce ? 0 : Math.sin(t * 1.2 + pc.seed) * 9 * (1 - k);
      const arc = -Math.sin(k * Math.PI) * 60;
      const x = lerp(scx, ecx, k) + smx * 14 * (1 - k) * (pc.order % 2 ? 1 : -1);
      const y = lerp(scy, ecy, k) + bob + arc + smy * 10 * (1 - k);
      const w = lerp(sw, ew, k);
      const ry = (1 - k) * (smx * 14 + Math.sin(t * 0.6 + pc.seed) * (reduce ? 0 : 6));
      const rx = (1 - k) * (-smy * 8 + 4);
      pc.el.style.transform = `translate3d(${x - pc.baseW / 2}px, ${y - (pc.baseW * pc.ratio) / 2}px, 0) scale(${w / pc.baseW}) rotateX(${rx}deg) rotateY(${ry}deg)`;
      pc.el.style.setProperty("--land", k.toFixed(3));
      pc.el.style.zIndex = String(Math.round(ecy));
      pc.k = k; pc.cx = x; pc.top = y - (w * pc.ratio) / 2;
    });

    const showTags = p > 0.92;
    tagsEl.classList.toggle("on", showTags);
    if (showTags || force) PIECES.forEach((pc) => {
      const el = tagsEl.querySelector(`[data-tag="${pc.id}"]`); if (!el) return;
      el.style.left = pc.cx + "px"; el.style.top = Math.max(70, pc.top + 6) + "px";
    });
  }

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  function loop() {
    if (visible) {
      progress += (target - progress) * (reduce ? 1 : 0.1);
      smx += (mx - smx) * 0.06; smy += (my - smy) * 0.06;
      draw();
    }
    requestAnimationFrame(loop);
  }
  addEventListener("resize", resize);
  resize();
  requestAnimationFrame(loop);
  root.classList.add("ready");
}
