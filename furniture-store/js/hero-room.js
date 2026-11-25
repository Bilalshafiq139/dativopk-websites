// Hero: the pieces of a real furnished room float on the page. On scroll an arch opens onto the
// same room, empty, and each piece flies back to the exact spot it was photographed in.
// At the end the original photo fades in, so the light and shadows are the real ones.
import { money, priceFor } from "./data.js";
import * as S from "./store.js";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const range = (p, a, b) => clamp((p - a) / (b - a));

const ROOM_RATIO = 2400 / 1350;
// end: where the piece sits in the room photo (left, top, width as fractions of the photo)
// start: where it floats at first (centre x, centre y as fractions of the screen, width as a fraction of screen width)
const PIECES = [
  { id: "reet", img: "fly-reet", label: "Sofa", end: [0.2125, 0.74398, 0.39193], ratio: 0.31, order: 0, tag: true,
    wide: [0.68, 0.62, 0.34], tall: [0.5, 0.36, 0.78] },
  { id: "sandook", img: "fly-sandook", label: "Sideboard", end: [0.61068, 0.68657, 0.20729], ratio: 0.7852, order: 1, tag: true,
    wide: [0.88, 0.36, 0.15], tall: [0.74, 0.16, 0.34] },
  { id: "plant", img: "fly-plant", label: "Plant", end: [0.1362, 0.75139, 0.07734], ratio: 1.532, order: 2,
    wide: [0.5, 0.8, 0.055], tall: [0.18, 0.18, 0.15] },
  { id: "lamp", img: "fly-lamp", label: "Pendant lamp", end: [0.07734, 0.32963, 0.05469], ratio: 1.1286, order: 3,
    wide: [0.74, 0.18, 0.05], tall: [0.2, 0.47, 0.13] },
];

export function initHeroRoom(root) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sticky = root.querySelector(".h3-sticky");
  const arch = root.querySelector(".hp-arch");
  const roomBox = root.querySelector(".hp-roombox");
  const full = root.querySelector(".hp-full");
  const layer = root.querySelector(".hp-pieces");
  const copy = root.querySelector(".h3-copy"), title = root.querySelector(".h3-title"), cue = root.querySelector(".h3-scroll");
  const tagsEl = root.querySelector(".h3-tags");

  layer.innerHTML = PIECES.map((p) => `<figure class="hp-piece" data-id="${p.id}"><img src="assets/img/${p.img}.webp" alt="${p.label}" draggable="false"></figure>`).join("");
  PIECES.forEach((p) => { p.el = layer.querySelector(`[data-id="${p.id}"]`); p.seed = Math.random() * 10; });

  function drawTags() {
    const w = S.getWood();
    tagsEl.innerHTML = PIECES.filter((p) => p.tag).map((p) => { const pr = S.productById(p.id); return `<a class="hotspot" href="product.html?id=${p.id}&wood=${w}" data-tag="${p.id}"><i></i><span>${pr.name} ${pr.type.toLowerCase()} · ${money(priceFor(pr, w))}</span></a>`; }).join("");
  }
  drawTags();
  window.addEventListener("store:change", drawTags);

  // the room photo is anchored to the bottom of the stage; the wall colour fills anything above it
  let vw = 1, vh = 1, tall = false, room = { x: 0, y: 0, w: 1, h: 1 };
  function resize() {
    const r = sticky.getBoundingClientRect();
    vw = r.width; vh = r.height; tall = vw / vh < 0.9;
    if (tall) { room.w = vw / 0.6; }
    else { room.w = Math.max(vw, vh * ROOM_RATIO) * 1.02; }
    room.h = room.w / ROOM_RATIO;
    room.x = vw / 2 - 0.48 * room.w;
    room.y = vh - room.h * (tall ? 0.97 : 0.985);
    Object.assign(roomBox.style, { width: room.w + "px", height: room.h + "px", left: room.x + "px", top: room.y + "px" });
    PIECES.forEach((p) => { p.baseW = p.end[2] * room.w; p.el.style.width = p.baseW + "px"; });
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

    const out = range(p, 0.02, 0.2);
    copy.style.opacity = 1 - out; copy.style.translate = `0 ${-out * 60}px`;
    copy.style.pointerEvents = out > 0.6 ? "none" : "";
    cue.style.opacity = 1 - range(p, 0, 0.08);
    const tin = range(p, 0.88, 0.98);
    title.style.opacity = tin; title.style.translate = `0 ${(1 - tin) * 20}px`;

    // arch rises, then opens to the whole screen
    const a1 = easeOut(range(p, 0.06, 0.3)), a2 = ease(range(p, 0.3, 0.6));
    const aw = (tall ? 0.66 : 0.32) * vw, ah = (tall ? 0.56 : 0.74) * vh * a1;
    const left = lerp(vw / 2 - aw / 2, 0, a2), right = lerp(vw / 2 - aw / 2, 0, a2);
    const top = lerp(vh - ah, 0, a2), rad = lerp(aw / 2, 0, a2);
    arch.style.clipPath = `inset(${top}px ${right}px 0px ${left}px round ${rad}px ${rad}px 0 0)`;
    arch.style.visibility = a1 > 0.001 ? "visible" : "hidden";
    roomBox.style.scale = String(lerp(1.08, 1, ease(range(p, 0.06, 0.6))));
    full.style.opacity = easeOut(range(p, 0.86, 0.97));

    PIECES.forEach((pc) => {
      const L = tall ? pc.tall : pc.wide;
      const a = 0.32 + pc.order * 0.1;
      const k = ease(range(p, a, a + 0.26));
      const sw = L[2] * vw;
      const ew = pc.end[2] * room.w, eh = ew * pc.ratio;
      const scx = L[0] * vw, scy = L[1] * vh;
      const ecx = room.x + pc.end[0] * room.w + ew / 2, ecy = room.y + pc.end[1] * room.h + eh / 2;
      const bob = reduce ? 0 : Math.sin(t * 1.2 + pc.seed) * 9 * (1 - k);
      const lift = pc.id === "lamp" ? 0 : -Math.sin(k * Math.PI) * 50;
      const x = lerp(scx, ecx, k) + smx * 16 * (1 - k) * (pc.order % 2 ? 1 : -1);
      const y = lerp(scy, ecy, k) + bob + lift + smy * 10 * (1 - k);
      const w = lerp(sw, ew, k);
      const ry = (1 - k) * (smx * 14 + (reduce ? 0 : Math.sin(t * 0.6 + pc.seed) * 6));
      const rx = (1 - k) * (-smy * 8 + 4);
      const s = w / pc.baseW;
      pc.el.style.transform = `translate3d(${x - pc.baseW / 2}px, ${y - (pc.baseW * pc.ratio) / 2}px, 0) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`;
      pc.el.style.setProperty("--land", k.toFixed(3));
      // once the real photo has faded in, the cut-out steps aside so the photo shows its true shadows
      pc.el.style.opacity = String(1 - easeOut(range(p, 0.9, 0.97)) * (k > 0.99 ? 1 : 0));
      pc.cx = x; pc.top = y - (w * pc.ratio) / 2;
    });

    const showTags = p > 0.93;
    tagsEl.classList.toggle("on", showTags);
    if (showTags || force) PIECES.filter((pc) => pc.tag).forEach((pc) => {
      const el = tagsEl.querySelector(`[data-tag="${pc.id}"]`); if (!el) return;
      el.style.left = pc.cx + "px"; el.style.top = Math.max(70, pc.top + 4) + "px";
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
}
