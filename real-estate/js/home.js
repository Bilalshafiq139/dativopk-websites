// Home page motion: hero image unmask, live search grid, auto-playing process steps, agents carousel,
// counting stats with growing bars, investment offers and the photo stack that slides apart on scroll.
import { init, $, $$, esc, card, reveal, onVisible, countUp, reduced, icon, specs } from "./layout.js";
import { AGENTS, INVEST, img, pkr } from "./data.js";
import { mountSearch, filter, toQuery } from "./search.js";
import * as S from "./store.js";

await init("home");

/* hero: image unmasks from a centred frame and settles from a slow zoom */
const hero = $("#hero"), hImg = $(".hero-img img", hero);
const go = () => requestAnimationFrame(() => hero.classList.add("ready"));
hImg.complete ? go() : (hImg.onload = hImg.onerror = go);
setTimeout(go, 1500);
onVisible($("[data-count]", hero), (el) => setTimeout(() => countUp(el), 1500), "0px");
if (!reduced()) addEventListener("scroll", () => { if (scrollY < 900) hImg.style.objectPosition = `center ${60 - scrollY * 0.03}%`; }, { passive: true });

/* search + grid: tabs and filters update the grid right away */
const grid = $("#grid");
const f = { purpose: "buy", city: "", type: "", price: "", size: "", beds: "", sort: "new" };
function draw() {
  const list = filter(S.visible(), f).slice(0, 6);
  grid.classList.remove("grid-anim"); void grid.offsetWidth;
  grid.innerHTML = list.map((l, i) => card(l, i)).join("") || `<div class="empty"><p class="h3">No homes match these filters yet</p><p class="muted">Clear a filter or tell us what you need and we will find it.</p><a class="btn" href="contact.html">Ask an agent</a></div>`;
  grid.classList.add("grid-anim");
  $("#gridTitle").textContent = { buy: "New properties", rent: "Homes for rent", new: "New developments", commercial: "Commercial properties" }[f.purpose];
  $("#seeAll").href = "properties.html?" + toQuery(f);
}
mountSearch($("#search"), f, { onChange: draw, onSubmit: (q) => (location.href = "properties.html?" + toQuery(q)) });
addEventListener("store:change", draw);
draw();

/* process: four steps play one after another, photo cross-fades out of a blur */
const STEPS = [
  { t: "Request & requirements", h: "Tell us what you need", p: "A short call with an agent about your budget, area, family size and timeline. We note every must-have.", img: "step-1" },
  { t: "Property selection", h: "Property selection", p: "Your agent sends a tailored list of verified listings with photos, floor plans, video tours and in-person viewings.", img: "step-2", plan: true },
  { t: "Legal support", h: "Legal support", p: "Our legal team checks the title, NOC, society dues and transfer papers, so there are no surprises.", img: "step-3" },
  { t: "Key transfer", h: "Key transfer", p: "We handle the token, payment schedule and society transfer, then hand you the keys to your new home.", img: "step-4" },
];
const media = $("#pMedia"), plan = $("#pPlan");
media.insertAdjacentHTML("afterbegin", STEPS.map((s, i) => `<img class="pm" data-i="${i}" src="${img(s.img)}" alt="" loading="lazy">`).join(""));
$("#pSteps").innerHTML = STEPS.map((s, i) => `<button data-i="${i}"><i></i>${esc(s.t)}</button>`).join("");
let si = -1, sTimer;
function step(i) {
  si = (i + STEPS.length) % STEPS.length; const s = STEPS[si];
  $("#pText").innerHTML = `<h3>${esc(s.h)}</h3><p>${esc(s.p)}</p><a class="btn btn-line btn-sm" href="contact.html">Get consultation</a>`;
  $$(".pm", media).forEach((m) => m.classList.toggle("on", Number(m.dataset.i) === si));
  $$("#pSteps button").forEach((b) => b.classList.toggle("on", Number(b.dataset.i) === si));
  plan.classList.toggle("in", !!s.plan);
  clearTimeout(sTimer); if (!reduced()) sTimer = setTimeout(() => step(si + 1), 5000);
}
$("#pSteps").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) step(Number(b.dataset.i)); });
onVisible($("#process"), () => step(1), "0px");

/* agents carousel */
const track = $("#agTrack");
track.innerHTML = AGENTS.map((a) => `<article class="agent"><div class="ag-photo"><img src="${img(a.id)}" alt="${esc(a.name)}" loading="lazy"><span class="logo"><span>Arz</span><span>Estate</span></span></div>
  <div class="ag-body"><b>${esc(a.name)}</b><small>${esc(a.role)}</small><div class="ag-rate">${a.rating.toFixed(1)} <span>/ ${a.reviews} reviews</span></div>
  <div class="ag-actions"><a class="btn btn-sm" href="tel:${a.phone.replace(/\s/g, "")}">${esc(a.phone.slice(0, 11))}…</a><a class="icon-btn" href="agents.html#${a.id}" aria-label="Contact ${esc(a.name)}">${icon.at}</a></div></div></article>`).join("");
let ai = 0;
const perView = () => (innerWidth <= 760 ? 1 : innerWidth <= 1000 ? 2 : 4);
function slide(d) {
  const max = Math.max(0, AGENTS.length - perView()); ai = Math.max(0, Math.min(max, ai + d));
  const c = track.children[ai]; track.style.transform = `translateX(${-c.offsetLeft}px)`;
}
$("#agPrev").onclick = () => slide(-1); $("#agNext").onclick = () => slide(1);
addEventListener("resize", () => slide(0));
let tx = null; track.addEventListener("pointerdown", (e) => (tx = e.clientX)); track.addEventListener("pointerup", (e) => { if (tx !== null && Math.abs(e.clientX - tx) > 40) slide(e.clientX < tx ? 1 : -1); tx = null; });

/* stats: numbers count up while the bars grow */
$$("[data-bars]").forEach((b) => (b.innerHTML = b.dataset.bars.split(",").map((h, k) => `<i style="--h:${h}%;--k:${k}"></i>`).join("")));
onVisible($("#stats"), (el) => {
  el.classList.add("in");
  $$("[data-count]", el).forEach((n) => countUp(n, (v) => (n.hasAttribute("data-rs") ? "Rs " + Math.round(v).toLocaleString("en-IN") : Math.round(v) + (n.dataset.suffix || ""))));
});

/* investment offers */
$("#offers").innerHTML = INVEST.map((o, i) => `<article class="offer reveal" style="--i:${i}"><div class="om"><img src="${img("l-" + o.id)}" alt="${esc(o.title)}" loading="lazy"></div>
  <div class="ob"><h3>${esc(o.title)}</h3><div class="lc-loc">Pakistan/${esc(o.area)}</div>${specs(o)}<p>${esc(o.desc)}</p>
    <div class="btns"><a class="btn btn-sm" href="invest.html#${o.id}">Book now</a><a class="btn btn-line btn-sm" href="invest.html#${o.id}" data-brochure>Download brochure ${icon.dl}</a></div></div>
  <div class="on"><div><b>${pkr(o.invest)}</b><small>Invest</small></div><div><b>${o.irr}%</b><small>IRR</small></div><div><b>${pkr(o.ret)}</b><small>Return</small></div></div></article>`).join("");

/* photo stack: the back photos slide out from behind the front one as you scroll */
const stack = $("#stack");
if (!reduced()) {
  const f2 = () => {
    const r = stack.getBoundingClientRect(); const k = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.9)));
    stack.style.setProperty("--x1", `${-30 - k * 120}%`); stack.style.setProperty("--x2", `${-10 - k * 50}%`);
    stack.style.setProperty("--o1", (0.2 + k * 0.4).toFixed(2)); stack.style.setProperty("--o2", (0.4 + k * 0.6).toFixed(2)); stack.style.setProperty("--b1", `${(1 - k) * 6 + 1}px`);
  };
  addEventListener("scroll", f2, { passive: true }); f2();
}

/* rating stars */
$$("#rating .rstars i").forEach((i) => (i.innerHTML = icon.star));
reveal();
