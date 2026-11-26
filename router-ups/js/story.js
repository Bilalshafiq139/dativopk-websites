// Home page 3D story built from real photos of Jugnu.
// The device, its adapter and plug are cut out of one photo shoot and placed on a 3D stage (CSS perspective).
// Scrolling moves them through five scenes: hero, exploded kit with callouts, the evening load-shedding,
// WiFi still on in the dark, and a final product shot. The mouse tilts the stage.
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const range = (p, a, b) => clamp((p - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (t) => t * t * (3 - 2 * t);

// keyframes: [progress, {x, y (% of stage), z (px), rx, ry, rz (deg), s (scale), o (opacity)}]
const K = {
  dev: [
    [0.00, { x: 0, y: 2, z: 0, rx: 18, ry: -14, rz: -24, s: 1, o: 1 }],
    [0.14, { x: 0, y: 0, z: 40, rx: 8, ry: 18, rz: -14, s: 0.98, o: 1 }],
    [0.28, { x: -2, y: 14, z: 0, rx: 4, ry: 8, rz: -8, s: 0.78, o: 1 }],
    [0.40, { x: -2, y: 14, z: 0, rx: 4, ry: 8, rz: -8, s: 0.78, o: 1 }],
    [0.48, { x: 18, y: 30, z: -40, rx: 34, ry: -6, rz: -18, s: 0.48, o: 1 }],
    [0.78, { x: 20, y: 30, z: -40, rx: 34, ry: -10, rz: -20, s: 0.5, o: 1 }],
    [0.88, { x: 2, y: 4, z: 20, rx: 14, ry: -20, rz: -30, s: 0.92, o: 1 }],
    [1.00, { x: 2, y: 4, z: 30, rx: 10, ry: 12, rz: -22, s: 0.94, o: 1 }],
  ],
  adapter: [
    [0.00, { x: 70, y: -70, z: -200, rx: 0, ry: 30, rz: 40, s: 0.5, o: 0 }],
    [0.16, { x: 70, y: -70, z: -200, rx: 0, ry: 30, rz: 40, s: 0.5, o: 0 }],
    [0.28, { x: 32, y: -8, z: 40, rx: 6, ry: -16, rz: 12, s: 0.62, o: 1 }],
    [0.40, { x: 32, y: -8, z: 40, rx: 6, ry: -16, rz: 12, s: 0.62, o: 1 }],
    [0.48, { x: 70, y: -60, z: -200, rx: 0, ry: 30, rz: 40, s: 0.5, o: 0 }],
  ],
  plug: [
    [0.00, { x: -70, y: -70, z: -200, rx: 0, ry: -30, rz: -40, s: 0.4, o: 0 }],
    [0.18, { x: -70, y: -70, z: -200, rx: 0, ry: -30, rz: -40, s: 0.4, o: 0 }],
    [0.30, { x: -30, y: -14, z: 20, rx: 8, ry: 18, rz: -14, s: 0.5, o: 1 }],
    [0.40, { x: -30, y: -14, z: 20, rx: 8, ry: 18, rz: -14, s: 0.5, o: 1 }],
    [0.48, { x: -70, y: -60, z: -200, rx: 0, ry: -30, rz: -40, s: 0.4, o: 0 }],
  ],
};
function at(keys, p) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, b] = keys[i], [p0, a] = keys[i - 1];
    if (p <= p1) { const k = smooth((p - p0) / (p1 - p0)); const o = {}; for (const key in a) o[key] = lerp(a[key], b[key], k); return o; }
  }
  return keys[keys.length - 1][1];
}

export function startStory({ root, section, onBeat, onHud }) {
  root.innerHTML = `
    <div class="ph" data-ph="0"><img src="assets/img/h-evening.webp" alt="" style="object-position:30% 45%"></div>
    <div class="ph" data-ph="1"><img src="assets/img/h-glow.webp" alt="" style="object-position:50% 60%" loading="lazy"></div>
    <div class="blackout"></div>
    <div class="stage stage-bg"><div class="spot"></div><div class="glow" id="glow"></div></div>
    <div class="stage" id="stage">
      <div class="obj" data-o="plug"><img src="assets/img/c-plug.webp" alt=""></div>
      <div class="obj" data-o="adapter"><img src="assets/img/c-adapter.webp" alt=""></div>
      <div class="obj" data-o="dev"><div class="floor"></div><img src="assets/img/c-dev.webp" alt=""></div>
      <div class="callouts" id="call">
        <span style="--x:22%;--y:40%"><b>12V · 9V · USB</b>outputs for any router</span>
        <span style="--x:-30%;--y:26%"><b>10,400 / 20,000 mAh</b>lithium cells inside</span>
        <span style="--x:12%;--y:-30%"><b>Own 12V adapter</b>charges in 3 hours</span>
        <span style="--x:-30%;--y:-38%"><b>3-pin plug</b>for Pakistani sockets</span>
      </div>
    </div>`;
  const ph = [...root.querySelectorAll(".ph")], black = root.querySelector(".blackout");
  const objs = [...root.querySelectorAll(".obj")], stage = root.querySelector("#stage"), glow = root.querySelector("#glow"), call = root.querySelector("#call");
  let mx = 0, my = 0, tx = 0, ty = 0, last = -1, lastPower = true, flash = 0, visible = true, W = 1, H = 1;
  const size = () => { const r = stage.getBoundingClientRect(); W = r.width; H = r.height; };
  size(); addEventListener("resize", size);
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(section);
  const progress = () => { const r = section.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  let room = 1;

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const p = progress(), sec = t / 1000;
    tx = lerp(tx, mx, 0.06); ty = lerp(ty, my, 0.06);
    const beat = p < 0.16 ? 0 : p < 0.42 ? 1 : p < 0.6 ? 2 : p < 0.8 ? 3 : 4;
    if (beat !== last) { last = beat; onBeat(beat); }
    const power = !(p > 0.5 && p < 0.8);
    const battery = !power;
    if (power !== lastPower) { flash = 1; lastPower = power; root.classList.remove("flicker"); void root.offsetWidth; root.classList.add("flicker"); }
    flash *= 0.9;

    // background photos: studio → evening room → lights out → WiFi glow in the dark → studio
    const o0 = Math.min(range(p, 0.42, 0.47), 1 - range(p, 0.58, 0.62));
    const o1 = Math.min(range(p, 0.58, 0.62), 1 - range(p, 0.8, 0.85));
    ph[0].style.opacity = o0; ph[1].style.opacity = o1;
    const cut = range(p, 0.5, 0.53);
    ph[0].querySelector("img").style.filter = `brightness(${(1 - 0.85 * cut).toFixed(3)}) saturate(${(1 - 0.5 * cut).toFixed(3)})`;
    [0, 1].forEach((i) => { ph[i].style.transform = `scale(${(1.08 - 0.06 * range(p, i ? 0.58 : 0.42, i ? 0.85 : 0.62)).toFixed(4)}) translate3d(${(-tx * 18).toFixed(1)}px, ${(-ty * 12).toFixed(1)}px, 0)`; });
    black.style.opacity = (cut * (1 - range(p, 0.58, 0.62)) * 0.45).toFixed(3);
    root.classList.toggle("dark", p > 0.42 && p < 0.85);

    // 3D objects
    const float = reduce ? 0 : Math.sin(sec * 1.1) * 8;
    objs.forEach((el) => {
      const k = at(K[el.dataset.o], p);
      const rx = k.rx - ty * 10, ry = k.ry + tx * 16;
      el.style.opacity = k.o.toFixed(3);
      el.style.transform = `translate(-50%,-50%) translate3d(${(k.x / 100 * W).toFixed(1)}px, ${(k.y / 100 * H + (el.dataset.o === "dev" ? float : float * 0.6)).toFixed(1)}px, ${k.z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${k.rz.toFixed(2)}deg) scale(${k.s.toFixed(4)})`;
      if (el.dataset.o === "dev") glow.style.transform = `translate(-50%,-50%) translate(${(k.x / 100 * W).toFixed(1)}px, ${(k.y / 100 * H + 30).toFixed(1)}px) scale(${k.s.toFixed(3)})`;
    });
    glow.className = "glow" + (battery ? " amber" : "");
    glow.style.opacity = battery ? (0.75 + 0.25 * Math.sin(sec * 3)).toFixed(3) : p > 0.42 && p < 0.85 ? "0.25" : "1";
    call.style.opacity = Math.min(range(p, 0.24, 0.3), 1 - range(p, 0.4, 0.44)).toFixed(3);

    room = lerp(room, power ? 1 : 0, 0.12);
    const drain = range(p, 0.5, 0.8);
    onHud({ p, power, routerOn: true, hasUps: true, battery, room, flash, drain, beat });
  }
  requestAnimationFrame(frame);
  return true;
}
