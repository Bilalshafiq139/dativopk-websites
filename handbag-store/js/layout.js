// Shared header, bag drawer, footer, WhatsApp button, product cards, add-to-bag flight and reveals.
import { BRAND, img, bagImg, photo, money } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const icon = {
  heart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
  wa: '<svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>',
};

const NAV = [["home", "Home", "index.html"], ["shop", "Shop", "shop.html"], ["atelier", "Atelier", "about.html"], ["contact", "Contact", "contact.html"]];

function header(page) {
  return `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-head" id="siteHead">
    <a class="logo" href="index.html" aria-label="${BRAND.name} home">ZARINE</a>
    <nav class="dot-nav" aria-label="Main">${NAV.map(([id, l, h]) => `<a href="${h}"${page === id ? ' aria-current="page"' : ""}>${l}</a>`).join('<i aria-hidden="true"></i>')}</nav>
    <div class="head-actions">
      <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${icon.heart}<span class="dot-count" data-wish-count hidden></span></a>
      <button class="bag-btn" type="button" data-open-bag>Bag <span class="bag-count" data-bag-count>0</span></button>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" data-menu><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" hidden>${NAV.map(([, l, h]) => `<a href="${h}">${l}</a>`).join("")}<a href="wishlist.html">Wishlist</a><a href="cart.html">Bag</a></div>`;
}

function footer() {
  return `
  <footer class="site-foot">
    <div class="wrap foot-grid">
      <div>
        <div class="logo logo-lg">ZARINE</div>
        <p class="muted">${BRAND.tagline}. Cash on delivery across Pakistan.</p>
        <form class="news" data-news><label class="label" for="newsEmail">New arrivals, first</label>
          <div class="news-row"><input id="newsEmail" type="email" placeholder="you@email.com" required><button class="btn btn-dark btn-sm">Join</button></div></form>
      </div>
      <div><p class="label">Shop</p><a href="shop.html">All bags</a><a href="shop.html?cat=tote">Totes</a><a href="shop.html?cat=crossbody">Crossbody</a><a href="shop.html?cat=hobo">Hobo bags</a><a href="shop.html?cat=top-handle">Top-handle</a></div>
      <div><p class="label">Help</p><a href="contact.html#faq">Delivery &amp; returns</a><a href="contact.html#faq">Cash on delivery</a><a href="contact.html">Contact us</a><a href="wishlist.html">Wishlist</a></div>
      <div><p class="label">Studio</p><p>${BRAND.studio}</p><p>Mon to Sat, 12pm to 9pm</p><a href="${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></div>
    </div>
    <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} ${BRAND.name} · Demo store, names and prices are placeholders</span><span><a href="admin.html">Store admin</a> · Photos: Pexels</span></div>
  </footer>
  <a class="wa-float" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon.wa}</a>
  <div class="drawer-scrim" data-close-bag hidden></div>
  <aside class="drawer" id="bagDrawer" aria-label="Your bag" aria-hidden="true">
    <div class="drawer-head"><h2>Your bag <span class="bag-count" data-bag-count>0</span></h2><button class="icon-btn" data-close-bag aria-label="Close bag">${icon.close}</button></div>
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
  return `<li class="bag-line" data-id="${l.id}">
    <a href="product.html?id=${l.id}" class="bl-img"><img src="${bagImg(l.p)}" alt="${esc(l.p.name)}"></a>
    <div class="bl-info">
      <a href="product.html?id=${l.id}" class="bl-name">${esc(l.p.name)}</a>
      <span class="muted small"><i class="sw" style="background:${l.p.hex}"></i> ${esc(l.p.colour)} · ${esc(l.p.type)}</span>
      <div class="bl-row"><div class="qty"><button data-qty="-1" aria-label="Less">−</button><span>${l.qty}</span><button data-qty="1" aria-label="More">+</button></div><button class="link-btn" data-remove>Remove</button></div>
    </div>
    <b class="bl-price">${money(l.unit * l.qty)}</b>
  </li>`;
}
function renderDrawer() {
  const body = $("#drawerBody"); if (!body) return;
  const t = S.totals();
  if (!t.lines.length) { body.innerHTML = `<div class="empty"><p class="display-sm">Your bag is empty</p><p class="muted">Every Zarine bag ships in 1 to 4 days.</p><a class="btn btn-dark" href="shop.html">Shop bags ${icon.arrow}</a></div>`; return; }
  const pct = Math.min(100, (t.subtotal / BRAND.freeDeliveryOver) * 100);
  body.innerHTML = `
    <div class="free-bar"><p>${t.toFree ? `Add <b>${money(t.toFree)}</b> for free delivery` : "Your order ships <b>free</b>"}</p><div class="bar"><span style="width:${pct}%"></span></div></div>
    <ul class="bag-lines">${t.lines.map(lineHtml).join("")}</ul>
    <div class="drawer-foot"><div class="row"><span>Subtotal</span><b>${money(t.subtotal)}</b></div>
      <a class="btn btn-dark btn-block" href="checkout.html">Checkout ${icon.arrow}</a><a class="btn btn-line btn-block" href="cart.html">View bag</a></div>`;
}
export function openBag() {
  renderDrawer();
  $("#bagDrawer").classList.add("open"); $("#bagDrawer").setAttribute("aria-hidden", "false");
  $(".drawer-scrim").hidden = false; document.body.classList.add("lock");
}
function closeBag() {
  $("#bagDrawer").classList.remove("open"); $("#bagDrawer").setAttribute("aria-hidden", "true");
  $(".drawer-scrim").hidden = true; document.body.classList.remove("lock");
}
function syncCounts() {
  $$("[data-bag-count]").forEach((e) => (e.textContent = S.bagCount()));
  const n = S.wished().length;
  $$("[data-wish-count]").forEach((e) => { e.textContent = n || ""; e.hidden = !n; });
  if ($("#bagDrawer")?.classList.contains("open")) renderDrawer();
}

// The product photo shrinks and flies in an arc into the Bag button, which then bounces and counts up.
export function flyToBag(fromEl, then) {
  const target = $(".bag-btn");
  const src = fromEl && (fromEl.tagName === "IMG" ? fromEl : fromEl.querySelector("img"));
  const done = () => { bump(); then && then(); };
  if (!target || !src || !src.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) { done(); return; }
  const a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
  const size = Math.min(Math.max(a.width, a.height), 240);
  const ghost = src.cloneNode(); ghost.removeAttribute("loading"); ghost.className = "fly-ghost";
  Object.assign(ghost.style, { left: a.left + a.width / 2 - size / 2 + "px", top: a.top + a.height / 2 - size / 2 + "px", width: size + "px", height: size + "px" });
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate([
    { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
    { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 140}px) scale(.6) rotate(-10deg)`, opacity: 1, offset: 0.45 },
    { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(4deg)`, opacity: 0.4 },
  ], { duration: 900, easing: "cubic-bezier(.55,0,.25,1)" });
  anim.onfinish = () => { ghost.remove(); done(); };
}
function bump() { $$(".bag-btn").forEach((b) => { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }); }

/* ---------- product card ---------- */
export function card(p, i = 0) {
  const w = S.wished().includes(p.id);
  const hover = photo(p.gallery[0]);
  return `<article class="pcard reveal" style="--i:${i % 4}" data-id="${p.id}">
    <a class="pc-media" href="product.html?id=${p.id}">
      <img class="pc-a" src="${bagImg(p)}" alt="${esc(p.name)}" loading="lazy">
      <img class="pc-b" src="${hover}" alt="" loading="lazy">
      ${p.tag ? `<span class="pc-tag">${esc(p.tag)}</span>` : ""}
    </a>
    <button class="wish-btn${w ? " on" : ""}" data-wish="${p.id}" aria-label="Save ${esc(p.name)}" aria-pressed="${w}">${icon.heart}</button>
    <button class="quick-add" data-quick-add="${p.id}">Add to bag ${icon.plus}</button>
    <div class="pc-info">
      <div><a class="pc-name" href="product.html?id=${p.id}">${esc(p.name)}</a><span class="muted small"><i class="sw" style="background:${p.hex}"></i> ${esc(p.colour)}</span></div>
      <div class="pc-price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
    </div>
  </article>`;
}

/* ---------- reveals: content is visible by default, JS adds the motion ---------- */
export function reveal(root = document) {
  const els = $$(".reveal:not(.in)", root);
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("in")); return; }
  document.documentElement.classList.add("js-reveal");
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
  els.forEach((e) => io.observe(e));
}
// Split a heading into words that rise one after another.
export function splitWords(el) {
  if (!el || el.dataset.split) return;
  el.dataset.split = "1";
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
  $$(".w > span", el).forEach((s, i) => (s.style.transitionDelay = i * 0.06 + "s"));
}

export async function init(page) {
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  syncCounts();
  addEventListener("store:change", syncCounts);
  addEventListener("storage", syncCounts);

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-bag]")) { e.preventDefault(); openBag(); }
    if (e.target.closest("[data-close-bag]")) closeBag();
    const line = e.target.closest(".bag-line");
    if (line) {
      const id = line.dataset.id, q = e.target.closest("[data-qty]");
      if (q) { const cur = S.bag().find((x) => x.id === id); if (cur) S.setQty(id, cur.qty + Number(q.dataset.qty)); }
      if (e.target.closest("[data-remove]")) S.removeLine(id);
    }
    const wb = e.target.closest("[data-wish]");
    if (wb) {
      e.preventDefault();
      const on = S.toggleWish(wb.dataset.wish);
      $$(`[data-wish="${wb.dataset.wish}"]`).forEach((b) => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      toast(on ? `Saved to wishlist. <a href="wishlist.html">View</a>` : "Removed from wishlist");
    }
    const qa = e.target.closest("[data-quick-add]");
    if (qa) {
      e.preventDefault();
      const p = S.productById(qa.dataset.quickAdd), c = qa.closest(".pcard");
      qa.innerHTML = `Added ${icon.check}`;
      flyToBag(c ? c.querySelector(".pc-a") : null, () => {
        S.addToBag(p.id);
        toast(`${esc(p.name)} added. <a href="#" data-open-bag>View bag</a>`);
        setTimeout(() => (qa.innerHTML = `Add to bag ${icon.plus}`), 1200);
      });
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#bagDrawer").classList.contains("open")) closeBag(); });

  const mb = $("[data-menu]"), mm = $("#mobileMenu");
  mb.addEventListener("click", () => { const open = mm.hidden; mm.hidden = !open; mb.setAttribute("aria-expanded", open); document.body.classList.toggle("menu-open", open); });
  const head = $("#siteHead");
  const onScroll = () => head.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $("[data-news]").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("Thank you. You'll hear about new bags first."); });

  reveal();
  await S.loadOverrides();
}
