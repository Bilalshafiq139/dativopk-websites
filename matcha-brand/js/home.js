// Home page motion: hero intro + parallax, product tabs, splash droplets, benefit slider, barista reveal, review fan.
import { init, $, $$, card, reveal, splitWords, countUp, onVisible, tabPill, reduced, icon, esc } from "./layout.js";
import { CATEGORIES, img } from "./data.js";
import * as S from "./store.js";

await init("home");
const hero = $("#hero");

/* ---------- hero: letters rise, model rises, then mouse + scroll parallax ---------- */
const start = () => requestAnimationFrame(() => hero.classList.add("ready"));
const heroImg = $(".hero-model img");
heroImg.complete ? start() : (heroImg.onload = heroImg.onerror = start);
setTimeout(start, 1600);
onVisible($("[data-count]", hero), (el) => setTimeout(() => countUp(el), 1300), "0px");

if (!reduced()) {
  const layers = $$("[data-depth]", hero);
  let mx = 0, my = 0, cx = 0, cy = 0, sy = 0, raf;
  const loop = () => {
    cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
    layers.forEach((l) => {
      const d = Number(l.dataset.depth);
      const scroll = l.classList.contains("hero-word") ? sy * 0.35 : l.classList.contains("hero-model") ? sy * -0.08 : sy * 0.2;
      l.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d + scroll).toFixed(2)}px`;
    });
    $(".hero-copy").style.translate = `0 ${(sy * 0.18).toFixed(1)}px`;
    $(".hero-copy").style.opacity = Math.max(0, 1 - sy / 520);
    raf = Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; kick(); });
  hero.addEventListener("pointerleave", () => { mx = my = 0; kick(); });
  addEventListener("scroll", () => { sy = Math.min(scrollY, 900); kick(); }, { passive: true });
}

/* ---------- ticker ---------- */
const words = ["Ceremonial grade", "Whisked to order", "Delivered across Lahore", "Shipped nationwide", "Cash on delivery", "No added sugar"];
const once = words.map((w) => `<span>${w} ${icon.leaf}</span>`).join("");
$("#ticker").innerHTML = once + once;

/* ---------- headings ---------- */
$$("[data-split]").forEach(splitWords);

/* ---------- product tabs ---------- */
const tabs = $("#homeTabs"), grid = $("#homeGrid");
const homeCats = [["all", "Signature Blends"], ...CATEGORIES.filter(([c]) => c !== "kits")];
let cat = "all";
tabs.innerHTML = homeCats.map(([c, n]) => `<button role="tab" data-cat="${c}" class="${c === cat ? "on" : ""}" aria-selected="${c === cat}">${n}</button>`).join("");
function drawGrid() {
  let list = S.visibleProducts();
  list = cat === "all" ? list.filter((p) => ["iced-latte", "ceremonial", "strawberry", "starter", "hojicha", "culinary"].includes(p.id)) : list.filter((p) => p.cat === cat);
  grid.classList.remove("grid-anim"); void grid.offsetWidth;
  grid.innerHTML = list.slice(0, 6).map((p, i) => card(p, i, cat === "all" && i === 0)).join("");
  grid.classList.add("grid-anim");
}
tabs.addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]"); if (!b || b.dataset.cat === cat) return;
  cat = b.dataset.cat;
  $$("button", tabs).forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
  tabPill(tabs); drawGrid();
});
// The first card stays green until another card is hovered, like a highlighted pick.
grid.addEventListener("pointerover", (e) => { const c = e.target.closest(".pcard"); if (c) $$(".pcard.featured", grid).forEach((f) => f !== c && f.classList.remove("featured")); });
drawGrid();
requestAnimationFrame(() => tabPill(tabs));
addEventListener("resize", () => tabPill(tabs));
document.fonts && document.fonts.ready.then(() => tabPill(tabs));
addEventListener("store:change", () => { if (!grid.querySelector(".add-btn.added")) drawGrid(); });

/* ---------- splash: droplets burst out of the glass, glass floats with scroll ---------- */
const drops = $("#drops");
if (!reduced()) {
  drops.innerHTML = [...Array(18)].map((_, i) => {
    const a = (i / 18) * Math.PI * 2 + Math.random() * 0.4, r = 140 + Math.random() * 160;
    return `<i style="left:${48 + Math.random() * 6}%;top:${28 + Math.random() * 10}%;--s:${6 + Math.random() * 14}px;--x:${(Math.cos(a) * r).toFixed(0)}px;--y:${(Math.sin(a) * r * 0.8 - 60).toFixed(0)}px;--d:${(Math.random() * 3.6).toFixed(2)}s"></i>`;
  }).join("");
  const sImg = $("#splash img");
  addEventListener("scroll", () => {
    const r = $("#splash").getBoundingClientRect(), k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    if (Math.abs(k) < 1.2) sImg.style.transform = `translateY(${(k * 60).toFixed(1)}px) rotate(${(k * -8).toFixed(2)}deg)`;
  }, { passive: true });
}

/* ---------- yellow benefit slider ---------- */
const SLIDES = [
  { t: "Sustained natural energy", img: "y-glass", h: ["Boost your energy levels and", "focus for a long time to come."] },
  { t: "Antioxidant rich", img: "y-strawberry", h: ["Packed with catechins that help", "your body feel its very best."] },
  { t: "Calm, never jittery", img: "y-layer", h: ["L-theanine smooths the caffeine,", "so there is no afternoon crash."] },
];
const stage = $("#yStage"), next = $("#yNext");
stage.innerHTML = SLIDES.map((s, i) => `<div class="y-slide" data-i="${i}"><img src="${img(s.img)}" alt="${esc(s.t)}"></div>`).join("");
let yi = -1, yTimer;
function showSlide(i) {
  const prev = yi; yi = (i + SLIDES.length) % SLIDES.length;
  $$(".y-slide", stage).forEach((el, k) => { el.classList.toggle("on", k === yi); el.classList.toggle("out", k === prev); });
  const s = SLIDES[yi];
  $("#yTitle").textContent = s.t; $("#yNum").textContent = String(yi + 1).padStart(2, "0");
  $("#yNum").animate && $("#yNum").animate([{ transform: "translateY(60%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" });
  $("#yText").innerHTML = s.h.map((l, k) => `<span class="line"><span style="animation-delay:${0.1 + k * 0.1}s">${esc(l)}</span></span>`).join("");
  next.classList.remove("run"); void next.offsetWidth; next.classList.add("run");
  clearTimeout(yTimer); if (!reduced()) yTimer = setTimeout(() => showSlide(yi + 1), 5500);
}
next.addEventListener("click", () => showSlide(yi + 1));
onVisible($("#ycard"), () => showSlide(0), "0px");

/* ---------- barista circle + script ---------- */
onVisible($("#barista"), (el) => el.classList.add("in"), "0px 0px -15% 0px");

/* ---------- reviews: fanned cards that rotate ---------- */
const REVIEWS = [
  { q: "Premium quality with an authentic Japanese flavour.", n: "Areeba Khan", r: "Medical student", a: "av-1" },
  { q: "The smoothest matcha I've tasted. It's now part of my morning routine.", n: "Hamza Siddiqui", r: "Food blogger", a: "av-3" },
  { q: "Clean energy without the afternoon crash.", n: "Mehak Ali", r: "Product designer", a: "av-2" },
  { q: "The starter kit was the best gift I gave this Eid.", n: "Saad Rehman", r: "Architect", a: "av-4" },
  { q: "Strawberry cloud is unreal. Delivery took 30 minutes.", n: "Hira Batool", r: "Content creator", a: "av-5" },
];
const tst = $("#tst");
tst.innerHTML = REVIEWS.map((r) => `<figure class="tcard"><img src="${img(r.a)}" alt="" loading="lazy"><q>${esc(r.q)}</q><div class="stars" aria-label="5 stars">★★★★★</div><b>${esc(r.n)}</b><small>${esc(r.r)}</small></figure>`).join("");
let ti = 1;
function fan() {
  const n = REVIEWS.length;
  $$(".tcard", tst).forEach((c, k) => { let d = (k - ti + n) % n; if (d > n / 2) d -= n; c.dataset.pos = Math.max(-2, Math.min(2, d)); });
}
const go = (d) => { ti = (ti + d + REVIEWS.length) % REVIEWS.length; fan(); };
$("#tPrev").onclick = () => go(-1); $("#tNext").onclick = () => go(1);
tst.addEventListener("click", (e) => { const c = e.target.closest(".tcard"); if (c && c.dataset.pos !== "0") go(Number(c.dataset.pos)); });
let sx = null;
tst.addEventListener("pointerdown", (e) => (sx = e.clientX));
tst.addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 40) go(e.clientX < sx ? 1 : -1); sx = null; });
fan();

reveal();
