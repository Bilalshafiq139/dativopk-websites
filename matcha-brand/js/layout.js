// Shared header, cart drawer, footer, WhatsApp button, product cards, add-to-cart flight and scroll reveals.
import { BRAND, CATEGORIES, img, money } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const icon = {
  arrow: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  right: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>',
  cart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  chev: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  leaf: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M27.8 4.2C17 3.4 7.3 8 5.3 17c-.7 3.1-.2 6 1 8.4C4.6 27 3.6 28.2 3 29l1.6 1c.5-.7 1.4-1.8 3-3.3 2.3 1.6 5.4 2.3 8.6 1.6 9-2 13-12.2 11.6-24.1zM9 24.6c3.3-3.4 7.9-7.6 13.4-11.3l-1.1-1.6C15.6 15.5 11 19.8 7.6 23.3c-.6-1.8-.8-3.7-.4-5.8C8.9 10.2 16.6 6.2 25.8 6.2c.9 9.7-2.6 18-10 19.7-2.5.6-4.9.2-6.8-1.3z"/></svg>',
  wa: '<svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2.2C16.7 2.1 15.7 2 14.6 2 12.2 2 10.6 3.4 10.6 6v2H8v3h2.6v11H14V11h2.7l.4-3z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
  tt: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.1-2.8V9a6.3 6.3 0 1 0 5.4 6.2V8.6a7.7 7.7 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7z"/></svg>',
};
export const arrowBtn = (label, href, cls = "") => `<a class="btn ${cls}" href="${href}">${label}<span class="arr">${icon.arrow}</span></a>`;

const NAV = [["home", "Home", "index.html"], ["shop", "Shop", "shop.html"], ["about", "About", "about.html"], ["recipes", "Recipes", "recipes.html"], ["contact", "Contact", "contact.html"]];

function header(page) {
  const navItem = ([id, l, h]) => {
    const cur = page === id ? ' aria-current="page"' : "";
    if (id === "shop") return `<div class="dd"><a href="${h}"${cur}>${l} ${icon.chev}</a><div class="dd-menu">${CATEGORIES.map(([c, n]) => `<a href="shop.html?cat=${c}">${n}</a>`).join("")}<a href="shop.html">Shop all</a></div></div>`;
    if (id === "recipes") return `<div class="dd"><a href="${h}"${cur}>${l} ${icon.chev}</a><div class="dd-menu"><a href="recipes.html#iced">Iced drinks</a><a href="recipes.html#hot">Hot drinks</a><a href="recipes.html#bake">Baking</a><a href="recipes.html#guide">Brewing guide</a></div></div>`;
    return `<a href="${h}"${cur}>${l}</a>`;
  };
  return `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-head" id="siteHead"><div class="wrap head-in">
    <a class="logo" href="index.html" aria-label="${BRAND.full} home">${icon.leaf}${BRAND.name}</a>
    <nav class="main-nav" aria-label="Main">${NAV.map(navItem).join("")}</nav>
    <div class="head-actions">
      <button class="icon-btn cart-btn" type="button" data-open-cart aria-label="Open cart">${icon.cart}<span class="cart-count" data-cart-count data-n="0">0</span></button>
      <a class="btn btn-sm head-cta" href="shop.html?cat=drinks">Order now<span class="arr">${icon.arrow}</span></a>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" data-menu><span></span><span></span></button>
    </div>
  </div></header>
  <div class="mobile-menu" id="mobileMenu" hidden>${NAV.map(([, l, h]) => `<a href="${h}">${l}</a>`).join("")}<a href="cart.html">Cart</a></div>`;
}

function footer() {
  return `
  <footer class="site-foot">
    <div class="wrap foot-grid">
      <div>
        <h3>Newsletter signup</h3>
        <p>Get Rs 300 off your first order, plus new drinks, recipes and giveaways before anyone else.</p>
        <form class="news" data-news><label class="skip" for="newsEmail">Email</label><input id="newsEmail" type="email" placeholder="Enter your email" required>
          <button class="btn btn-yellow btn-sm" type="submit">Subscribe now<span class="arr">${icon.arrow}</span></button></form>
      </div>
      <div class="foot-cols">
        <div><h4>Navigation</h4><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">About</a><a href="recipes.html">Recipes</a><a href="contact.html">Contact</a></div>
        <div><h4>Help</h4><a href="contact.html#faq">Delivery areas</a><a href="contact.html#faq">Cash on delivery</a><a href="contact.html#faq">Returns</a><a href="cart.html">Your cart</a></div>
        <div><h4>Visit us</h4><p style="margin:0 0 6px">${BRAND.address}</p><p style="margin:0 0 22px">${BRAND.hours}</p>
          <h4>Follow us</h4><div class="socials"><a href="#" aria-label="Facebook">${icon.fb}</a><a href="#" aria-label="Instagram">${icon.ig}</a><a href="#" aria-label="TikTok">${icon.tt}</a><a href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon.wa.replace('width="28" height="28"', 'width="18" height="18"')}</a></div></div>
      </div>
    </div>
    <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} ${BRAND.full} · Demo website, names and prices are placeholders</span><a href="admin.html">Store admin</a><span>Photos: Pexels</span></div>
    <div class="foot-word" aria-hidden="true">${[...BRAND.name.toUpperCase()].map((c) => `<span>${c}</span>`).join("")}</div>
  </footer>
  <a class="wa-float" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon.wa}</a>
  <div class="drawer-scrim" data-close-cart hidden></div>
  <aside class="drawer" id="cartDrawer" aria-label="Your cart" aria-hidden="true">
    <div class="drawer-head"><h2>Your cart</h2><button class="icon-btn" data-close-cart aria-label="Close cart">${icon.close}</button></div>
    <div class="drawer-body" id="drawerBody"></div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

export function toast(html) {
  const t = $("#toast"); if (!t) return;
  t.innerHTML = html; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 3200);
}

export function lineHtml(l) {
  return `<li class="cart-line" data-id="${l.id}">
    <a href="product.html?id=${l.id}"><img src="${img(l.p.img)}" alt="${esc(l.p.name)}"></a>
    <div><a href="product.html?id=${l.id}" class="cl-name">${esc(l.p.name)}</a><span class="muted small">${esc(l.p.size)}</span>
      <div class="cl-row"><div class="qty sm"><button data-qty="-1" aria-label="Less">−</button><span>${l.qty}</span><button data-qty="1" aria-label="More">+</button></div><button class="link-btn" data-remove>Remove</button></div></div>
    <b>${money(l.unit * l.qty)}</b>
  </li>`;
}
export function freeBar(t) {
  const pct = Math.min(100, (t.subtotal / BRAND.freeDeliveryOver) * 100);
  return `<div class="free-bar"><p>${t.toFree ? `Add <b>${money(t.toFree)}</b> more for free delivery` : "Nice, your delivery is <b>free</b>"}</p><div class="bar"><span style="width:${pct}%"></span></div></div>`;
}
function renderDrawer() {
  const body = $("#drawerBody"); if (!body) return;
  const t = S.totals();
  if (!t.lines.length) { body.innerHTML = `<div class="empty"><h3>Your cart is empty</h3><p class="muted">A cold matcha is one tap away.</p>${arrowBtn("Shop drinks", "shop.html?cat=drinks")}</div>`; return; }
  body.innerHTML = `${freeBar(t)}<ul class="cart-lines">${t.lines.map(lineHtml).join("")}</ul>
    <div class="drawer-foot"><div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      <a class="btn btn-block" href="checkout.html">Checkout</a><a class="btn btn-line btn-block" href="cart.html">View cart</a></div>`;
}
export function openCart() {
  renderDrawer();
  const d = $("#cartDrawer"), s = $(".drawer-scrim");
  d.classList.add("open"); d.setAttribute("aria-hidden", "false");
  s.hidden = false; requestAnimationFrame(() => s.classList.add("show")); document.body.classList.add("lock");
}
function closeCart() {
  const d = $("#cartDrawer"), s = $(".drawer-scrim");
  d.classList.remove("open"); d.setAttribute("aria-hidden", "true");
  s.classList.remove("show"); setTimeout(() => (s.hidden = true), 400); document.body.classList.remove("lock");
}
function syncCounts() {
  const n = S.bagCount();
  $$("[data-cart-count]").forEach((e) => { e.textContent = n; e.dataset.n = n; });
  if ($("#cartDrawer")?.classList.contains("open")) renderDrawer();
}

// The product photo shrinks into a circle and flies in an arc into the cart button, which bounces.
export function flyToCart(fromEl, then) {
  const target = $(".cart-btn");
  const src = fromEl && (fromEl.tagName === "IMG" ? fromEl : fromEl.querySelector("img"));
  const done = () => { bump(); then && then(); };
  if (!target || !src || !src.animate || reduced()) { done(); return; }
  const a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
  const size = Math.min(a.width, a.height, 220);
  const ghost = src.cloneNode(); ghost.removeAttribute("loading"); ghost.className = "fly-ghost";
  Object.assign(ghost.style, { left: a.left + a.width / 2 - size / 2 + "px", top: a.top + a.height / 2 - size / 2 + "px", width: size + "px", height: size + "px" });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate([
    { transform: "translate(0,0) scale(1)", borderRadius: "20px" },
    { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 160}px) scale(.55) rotate(-14deg)`, borderRadius: "50%", offset: 0.45 },
    { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(10deg)`, borderRadius: "50%", opacity: 0.5 },
  ], { duration: 950, easing: "cubic-bezier(.55,0,.25,1)" });
  anim.onfinish = () => { ghost.remove(); done(); };
}
function bump() { $$(".cart-btn").forEach((b) => { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }); }

export function addWithFlight(id, fromEl, qty = 1, btn) {
  const p = S.productById(id);
  if (!p || p.status !== "active") { toast("Sorry, this one is sold out right now."); return; }
  if (btn) { btn.classList.add("added"); btn.innerHTML = `Added ${icon.check}`; }
  flyToCart(fromEl, () => {
    S.addToBag(id, qty);
    toast(`${esc(p.name)} added. <a href="#" data-open-cart>View cart</a>`);
    if (btn) setTimeout(() => { btn.classList.remove("added"); btn.innerHTML = "Add to cart"; }, 1400);
  });
}

/* ---------- product card ---------- */
export function card(p, i = 0, featured = false) {
  const sold = p.status === "soldout";
  const tags = [];
  if (sold) tags.push('<span class="tag tag-sold">Sold Out</span>');
  else if (p.tag) tags.push(`<span class="tag${/save/i.test(p.tag) ? " tag-sale" : /new/i.test(p.tag) ? " tag-new" : ""}">${esc(p.tag)}</span>`);
  if (!sold && p.old && !/save/i.test(p.tag)) tags.push(`<span class="tag tag-sale">Save ${Math.round((1 - p.price / p.old) * 100)}%</span>`);
  return `<article class="pcard${featured ? " featured" : ""}" style="--i:${i}" data-id="${p.id}">
    <a class="pc-media" href="product.html?id=${p.id}"><img src="${img(p.img)}" alt="${esc(p.name)}" loading="lazy"><span class="pc-tags">${tags.join("")}</span></a>
    <div class="pc-info"><a class="pc-name" href="product.html?id=${p.id}">${esc(p.name)}</a><div class="pc-price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</div></div>
    <button class="add-btn" data-add="${p.id}" ${sold ? "disabled" : ""}>${sold ? "Sold out" : "Add to cart"}</button>
  </article>`;
}

/* ---------- reveals: content is visible by default, JS adds the motion ---------- */
let io;
export function reveal(root = document) {
  const els = $$(".reveal:not(.in), .split-words:not(.in), [data-inview]:not(.in)", root);
  if (!("IntersectionObserver" in window) || reduced()) { els.forEach((e) => e.classList.add("in")); return; }
  document.documentElement.classList.add("js-reveal");
  io = io || new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}
// Split a heading into words that rise one after another.
export function splitWords(el) {
  if (!el || el.dataset.split) return;
  el.dataset.split = "1"; el.classList.add("split-words");
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
        const o = document.createElement("span"); o.className = "w"; const i = document.createElement("span"); i.textContent = w; o.appendChild(i); frag.appendChild(o);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && !n.classList.contains("w")) walk(n);
  });
  walk(el);
  $$(".w > span", el).forEach((s, i) => (s.style.transitionDelay = i * 0.07 + "s"));
}
// Big page titles: each letter rises in.
export function letters(el) {
  if (!el) return;
  el.innerHTML = [...el.textContent].map((c, i) => (c === " " ? " " : `<span class="ch" style="animation-delay:${i * 0.05}s">${esc(c)}</span>`)).join("");
}
// Smooth number count-up when visible.
export function countUp(el) {
  const end = Number(el.dataset.count), suffix = el.dataset.suffix || "";
  if (reduced()) { el.textContent = end.toLocaleString("en-PK") + suffix; return; }
  const t0 = performance.now(), dur = 1800;
  const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(end * e).toLocaleString("en-PK") + suffix; if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
export function onVisible(el, fn, margin = "0px 0px -10% 0px") {
  if (!el) return;
  if (!("IntersectionObserver" in window)) return fn(el);
  const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { fn(el); o.disconnect(); } }, { rootMargin: margin });
  o.observe(el);
}
// Sliding green pill behind the active tab.
export function tabPill(tabs) {
  let pill = $(".pill", tabs);
  if (!pill) { pill = document.createElement("span"); pill.className = "pill"; tabs.prepend(pill); }
  const on = $("button.on", tabs);
  if (on) { pill.style.left = on.offsetLeft + "px"; pill.style.width = on.offsetWidth + "px"; }
}

export async function init(page) {
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  syncCounts();
  addEventListener("store:change", syncCounts);
  addEventListener("storage", syncCounts);

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openCart(); }
    if (e.target.closest("[data-close-cart]")) closeCart();
    const line = e.target.closest(".cart-line");
    if (line) {
      const id = line.dataset.id, q = e.target.closest("[data-qty]");
      if (q) { const cur = S.bag().find((x) => x.id === id); if (cur) S.setQty(id, cur.qty + Number(q.dataset.qty)); }
      if (e.target.closest("[data-remove]")) S.removeLine(id);
    }
    const add = e.target.closest("[data-add]");
    if (add) { e.preventDefault(); const c = add.closest(".pcard"); addWithFlight(add.dataset.add, c ? $(".pc-media img", c) : null, 1, add); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#cartDrawer").classList.contains("open")) closeCart(); });

  const mb = $("[data-menu]"), mm = $("#mobileMenu");
  mb.addEventListener("click", () => { const open = mm.hidden; mm.hidden = !open; mb.setAttribute("aria-expanded", open); document.body.classList.toggle("menu-open", open); });
  const head = $("#siteHead");
  const onScroll = () => head.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $("[data-news]").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("Shukriya! Your Rs 300 code is on its way."); });
  onVisible($(".foot-word"), (el) => el.classList.add("in"), "0px");

  // smooth open/close for FAQ items
  $$(".faq details").forEach((d) => {
    const sum = $("summary", d), ans = $(".ans", d);
    sum.addEventListener("click", (e) => {
      if (reduced() || !ans.animate) return;
      e.preventDefault();
      if (d.open) { const a = ans.animate([{ height: ans.offsetHeight + "px" }, { height: "0px" }], { duration: 400, easing: "cubic-bezier(.2,.8,.2,1)" }); a.onfinish = () => (d.open = false); }
      else { d.open = true; const h = ans.offsetHeight; ans.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" }); }
    });
  });

  reveal();
  await S.loadOverrides();
}
