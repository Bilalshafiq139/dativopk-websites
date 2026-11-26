// Home page story with real photos: a load-shedding evening told in five scenes while you scroll.
// Each photo is a depth layer: it zooms slowly, tilts in 3D with the mouse and crossfades into the next.
// The power cut is a flicker and a blackout over the lit room.
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const range = (p, a, b) => clamp((p - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;

// [photo, fade in start, fully in, fade out start, gone, focus x%, focus y%]
const SCENES = [
  ["h-evening", -1, 0, 0.27, 0.31, 25, 45],
  ["h-candle", 0.25, 0.3, 0.37, 0.41, 60, 45],
  ["h-mini", 0.38, 0.42, 0.56, 0.6, 70, 55],
  ["h-glow", 0.57, 0.61, 0.79, 0.83, 50, 60],
  ["wfh-night", 0.8, 0.85, 2, 3, 50, 50],
];

export function startStory({ root, section, onBeat, onHud }) {
  root.innerHTML = SCENES.map(([img, , , , , fx, fy], i) => `<div class="ph" data-i="${i}"><img src="assets/img/${img}.webp" alt="" style="object-position:${fx}% ${fy}%" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`).join("")
    + '<div class="blackout"></div>';
  const layers = [...root.querySelectorAll(".ph")], black = root.querySelector(".blackout");
  let mx = 0, my = 0, tx = 0, ty = 0, last = -1, lastPower = true, flash = 0, visible = true;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(section);
  const progress = () => { const r = section.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  let room = 1;

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const p = progress();
    tx = lerp(tx, mx, 0.06); ty = lerp(ty, my, 0.06);

    const beat = p < 0.15 ? 0 : p < 0.36 ? 1 : p < 0.56 ? 2 : p < 0.8 ? 3 : 4;
    if (beat !== last) { last = beat; onBeat(beat); }
    const power = !(p > 0.19 && p < 0.4) && !(p > 0.6 && p < 0.8);
    const hasUps = p >= 0.4;
    const battery = hasUps && !power;
    if (power !== lastPower) { flash = 1; lastPower = power; root.classList.remove("flicker"); void root.offsetWidth; root.classList.add("flicker"); }
    flash *= 0.9;

    layers.forEach((el, i) => {
      const [, a, b, c, d] = SCENES[i];
      const o = Math.min(range(p, a, b), 1 - range(p, c, d));
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.001 ? "visible" : "hidden";
      if (o <= 0.001) return;
      const k = range(p, a, d === 3 ? 1.05 : d);
      const s = reduce ? 1.02 : 1.09 - 0.08 * k;
      el.style.transform = `perspective(1400px) rotateY(${(tx * 4).toFixed(2)}deg) rotateX(${(-ty * 3).toFixed(2)}deg) translate3d(${(-tx * 24).toFixed(1)}px, ${(-ty * 18).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
    });

    // the first scene is the lit room: the cut darkens it before the candle arrives
    room = lerp(room, power ? 1 : 0, 0.12);
    const cut1 = range(p, 0.19, 0.22);
    layers[0].querySelector("img").style.filter = `brightness(${(1 - 0.82 * cut1).toFixed(3)}) saturate(${(1 - 0.5 * cut1).toFixed(3)})`;
    black.style.opacity = (cut1 * (1 - range(p, 0.25, 0.3)) * 0.55).toFixed(3);

    const drain = range(p, 0.6, 0.8);
    onHud({ p, power, routerOn: power || hasUps, hasUps, battery, room, flash, drain, beat });
  }
  requestAnimationFrame(frame);
  return true;
}
