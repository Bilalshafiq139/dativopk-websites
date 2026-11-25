// Home hero, studied from the reference motion:
// 1. Loader: a % counter and bar while the bag cards appear one by one and orbit the centre.
// 2. At 100%: the cards fly from the ring onto a diagonal arc, the model rises in, the headline words rise.
// 3. Changing the look: the page dims, a neon light streak sweeps across the model, the model changes bag,
//    the cards slide one step along the arc, and the product text and price card come back in.
import { LOOKS, img, bagImg, money } from "./data.js";
import * as S from "./store.js";
import { $, $$, esc, flyToBag, toast, icon } from "./layout.js";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Arc slots: x, y (centre, % of stage), scale, z (below 5 = behind the model)
const SLOTS_WIDE = { "-3": [-6, 22, 0.86, 2], "-2": [5, 28, 0.92, 3], "-1": [16, 35, 0.96, 4], 0: [28.5, 43, 1.08, 8], 1: [42, 50, 0.96, 3], 2: [64, 70, 0.98, 8], 3: [77, 80, 0.94, 7], 4: [91, 88, 0.9, 6] };
const SLOTS_TALL = { "-3": [-30, 62, 0.8, 2], "-2": [-12, 64, 0.84, 3], "-1": [8, 67, 0.9, 4], 0: [27, 71, 1.04, 8], 1: [48, 66, 0.86, 3], 2: [70, 73, 0.92, 8], 3: [90, 76, 0.88, 7], 4: [112, 79, 0.84, 6] };

export function initHero(root) {
  const cardsEl = $(".hx-cards", root), modelsEl = $(".hx-models", root), loader = $(".hx-loader", root);
  const pct = $(".hx-pct", root), bar = $(".hx-bar i", root);
  const info = $(".hx-info", root), pcard = $(".hx-pcard", root), swoosh = $(".hx-swoosh", root);
  const N = LOOKS.length, CARDS = N * 2;
  let active = 0, busy = false, timer = null, ready = false;

  modelsEl.innerHTML = LOOKS.map((p, i) => `<img class="hx-model${i === 0 ? " on" : ""}" data-i="${i}" src="${img("model/" + p.look)}" alt="Model carrying the ${esc(p.name)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join("");
  cardsEl.innerHTML = Array.from({ length: CARDS }, (_, k) => {
    const p = LOOKS[k % N];
    return `<button class="hx-card" data-k="${k}" data-look="${k % N}" aria-label="Show ${esc(p.name)}"><img src="${bagImg(p)}" alt="" draggable="false"><span>${esc(p.short)}</span></button>`;
  }).join("");
  const cards = $$(".hx-card", cardsEl), models = $$(".hx-model", modelsEl);

  let tall = innerWidth < 900;
  addEventListener("resize", () => { tall = innerWidth < 900; if (ready) placeCards(); });

  // ---------- arc placement ----------
  let mx = 0, my = 0;
  function slotOf(k) { let s = (((k - active) % CARDS) + CARDS) % CARDS; if (s > CARDS / 2) s -= CARDS; return s; }
  function placeCards(instant) {
    const SL = tall ? SLOTS_TALL : SLOTS_WIDE;
    cards.forEach((c, k) => {
      const s = clamp(slotOf(k), -3, 4), [x, y, sc, z] = SL[s];
      const px = mx * (s === 0 ? 6 : 10) * (s % 2 ? -1 : 1), py = my * 6;
      c.style.transition = instant ? "none" : "";
      c.style.left = x + "%"; c.style.top = y + "%";
      c.style.transform = `translate(-50%,-50%) translate(${px}px,${py}px) scale(${sc})`;
      c.style.zIndex = z;
      c.classList.toggle("is-sel", s === 0);
      c.style.opacity = Math.abs(slotOf(k)) > 4 ? 0 : 1;
    });
  }
  root.addEventListener("pointermove", (e) => {
    if (!ready || tall) return;
    mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
    cancelAnimationFrame(placeCards._r); placeCards._r = requestAnimationFrame(() => placeCards());
  });

  // ---------- product text ----------
  function renderInfo() {
    const p = S.productById(LOOKS[active % N].id);
    const w = S.wished().includes(p.id);
    info.innerHTML = `
      <p class="label hx-l"><span>${String((active % N) + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}</span> ${esc(p.type)}</p>
      <h2 class="hx-l"><span>${esc(p.name)}</span></h2>
      <p class="muted hx-l"><span>${esc(p.blurb)}</span></p>
      <p class="hx-price hx-l"><span>${money(p.price)}${p.old ? ` <s>${money(p.old)}</s>` : ""}</span></p>
      <div class="hx-actions hx-l"><span><button class="btn btn-dark" data-hero-add>Add to bag</button><button class="link-plus${w ? " on" : ""}" data-wish="${p.id}" aria-pressed="${w}">${w ? "In wishlist" : "Add to wishlist"} ${icon.plus}</button></span></div>`;
    pcard.innerHTML = `<p class="small">${esc(p.name)}</p><a href="product.html?id=${p.id}" class="hx-pimg"><img src="${bagImg(p)}" alt="${esc(p.name)}"></a><div class="hx-prow"><span>Price</span><b>${money(p.price)}</b></div>`;
    pcard.href = "product.html?id=" + p.id;
  }
  info.addEventListener("click", (e) => {
    if (!e.target.closest("[data-hero-add]")) return;
    const p = S.productById(LOOKS[active % N].id);
    flyToBag($("img", pcard), () => { S.addToBag(p.id); toast(`${esc(p.name)} added. <a href="#" data-open-bag>View bag</a>`); });
  });
  addEventListener("store:change", () => { if (ready && !busy) { const b = $("[data-wish]", info); if (b) { const on = S.wished().includes(b.dataset.wish); b.classList.toggle("on", on); b.innerHTML = `${on ? "In wishlist" : "Add to wishlist"} ${icon.plus}`; } } });

  // ---------- the look change ----------
  const lookOf = () => active % N;
  cardsEl.addEventListener("click", (e) => {
    const c = e.target.closest(".hx-card"); if (!c) return;
    const k = Number(c.dataset.k);
    if (slotOf(k) === 0) { location.href = "product.html?id=" + LOOKS[lookOf()].id; return; }
    goCard(k); restart();
  });
  async function goCard(k) {
    if (busy || !ready) return;
    busy = true;
    root.classList.add("switching");
    if (!reduce) { swoosh.classList.remove("run"); void swoosh.getBoundingClientRect(); swoosh.classList.add("run"); }
    await wait(reduce ? 0 : 380);
    try {
      active = k;
      models.forEach((m) => m.classList.toggle("on", Number(m.dataset.i) === lookOf()));
      placeCards();
      await wait(reduce ? 0 : 420);
      renderInfo();
    } finally {
      root.classList.remove("switching");
      await wait(reduce ? 0 : 700);
      busy = false;
    }
  }
  const next = () => goCard((active + 1) % CARDS), prev = () => goCard((active - 1 + CARDS) % CARDS);
  $(".hx-next", root).addEventListener("click", () => { next(); restart(); });
  $(".hx-prev", root).addEventListener("click", () => { prev(); restart(); });
  root.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { next(); restart(); } if (e.key === "ArrowLeft") { prev(); restart(); } });
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (!document.hidden && !root.matches(":hover")) next(); }, 5200); }

  // ---------- loader: counter, orbiting cards, then everything settles ----------
  async function boot() {
    const quick = (() => { try { return sessionStorage.getItem("zr-intro") === "1"; } catch { return false; } })();
    const minMs = reduce ? 0 : quick ? 900 : 2600;
    const preload = Promise.all(LOOKS.map((p) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = img("model/" + p.look); }))
      .concat(LOOKS.map((p) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = bagImg(p); }))));
    let loaded = false; preload.then(() => (loaded = true));
    const t0 = performance.now();
    root.classList.add("loading");
    let shown = 0, angle = 0, last = t0;
    await new Promise((resolve) => {
      function tick(now) {
        const dt = now - last; last = now;
        const timeP = clamp((now - t0) / Math.max(1, minMs), 0, 1);
        const target = loaded ? timeP : Math.min(timeP, 0.9);
        shown += (target - shown) * (1 - Math.pow(0.86, Math.min(dt, 200) / 16.7));
        if (loaded && timeP >= 1 && (shown > 0.97 || now - t0 > minMs + 1200)) shown = 1;
        const v = Math.round(shown * 100);
        pct.textContent = v + "%"; bar.style.width = v + "%";
        // ring of cards, appearing one by one and drifting round the centre
        angle += dt * 0.00012;
        const R = tall ? [36, 18] : [20, 22];
        cards.forEach((c, k) => {
          const a = angle * Math.PI * 2 + (k / CARDS) * Math.PI * 2;
          const appear = clamp(shown * CARDS * 1.25 - k, 0, 1);
          c.style.transition = "none";
          c.style.left = 50 + Math.cos(a) * R[0] + "%"; c.style.top = 46 + Math.sin(a) * R[1] + "%";
          c.style.transform = `translate(-50%,-50%) scale(${0.62 + appear * 0.1})`;
          c.style.opacity = appear; c.style.zIndex = 6;
          c.classList.toggle("is-sel", k === 0 && appear > 0.9);
        });
        if (shown >= 1) resolve(); else requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    try { sessionStorage.setItem("zr-intro", "1"); } catch {}
    renderInfo();
    root.classList.remove("loading"); root.classList.add("revealed");
    await wait(30);
    ready = true;
    cards.forEach((c, k) => (c.style.transitionDelay = (reduce ? 0 : k * 0.04) + "s"));
    placeCards();
    setTimeout(() => cards.forEach((c) => (c.style.transitionDelay = "")), 1400);
    restart();
  }
  boot();
}
