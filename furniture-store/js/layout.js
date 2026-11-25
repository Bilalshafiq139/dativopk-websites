// Shared header, bag drawer, footer, WhatsApp button, product cards and small helpers.
import { BRAND, WOODS, FABRICS, img, money, priceFor, dimsText, woodById } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const icon = {
  heart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  truck: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  wa: '<svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>',
};

const NAV = [["shop", "Shop", "shop.html"], ["rooms", "Rooms", "rooms.html"], ["craft", "Craft", "about.html"], ["delivery", "Delivery", "delivery.html"]];

function header(page) {
  return `
  <a class="skip" href="#main">Skip to content</a>
  <div class="announce"><span>Free delivery over ${money(BRAND.freeDeliveryOver)} · Free swatch box of all four woods</span></div>
  <header class="site-head" id="siteHead">
    <a class="logo" href="index.html" aria-label="${BRAND.name} home">lakri<span>&amp;co.</span></a>
    <nav class="pill-nav" aria-label="Main">
      ${NAV.map(([id, label, href]) => `<a href="${href}"${page === id ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>
    <div class="head-actions">
      <a class="icon-btn" href="saved.html" aria-label="Saved pieces">${icon.heart}<span class="dot-count" data-saved-count></span></a>
      <button class="bag-btn" type="button" data-open-bag>Bag <span class="bag-count" data-bag-count>0</span></button>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" data-menu>
        <span></span><span></span>
      </button>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" hidden>
    ${NAV.map(([, label, href]) => `<a href="${href}">${label}</a>`).join("")}
    <a href="saved.html">Saved</a><a href="cart.html">Bag</a>
  </div>`;
}

function footer() {
  return `
  <footer class="site-foot">
    <div class="foot-big" aria-hidden="true">lakri</div>
    <div class="wrap foot-grid">
      <div>
        <p class="foot-lead">Solid wood furniture, made to order in Chiniot and delivered across Pakistan.</p>
        <form class="news" data-news>
          <label class="mono" for="newsEmail">Workshop letters, once a month</label>
          <div class="news-row"><input id="newsEmail" type="email" placeholder="you@email.com" required><button class="btn btn-dark btn-sm">Join</button></div>
        </form>
      </div>
      <div><p class="mono">Shop</p><a href="shop.html?cat=seating">Seating</a><a href="shop.html?cat=tables">Tables &amp; desks</a><a href="shop.html?cat=storage">Storage</a><a href="shop.html?cat=beds">Beds</a><a href="rooms.html">Shop by room</a></div>
      <div><p class="mono">Help</p><a href="delivery.html">Delivery &amp; returns</a><a href="delivery.html#faq">FAQ</a><a href="delivery.html#contact">Contact us</a><a href="delivery.html#contact">Free swatch box</a></div>
      <div><p class="mono">Visit</p><p>${BRAND.showroom}<br>Mon to Sat, 11am to 8pm</p><p>${BRAND.workshop}</p><a href="${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></div>
    </div>
    <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} ${BRAND.name} · Demo store, all names and prices are placeholders</span><span><a href="admin.html">Store admin</a> · Photos: Pexels</span></div>
  </footer>
  <a class="wa-float" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon.wa}</a>
  <div class="drawer-scrim" data-close-bag hidden></div>
  <aside class="drawer" id="bagDrawer" aria-label="Your bag" aria-hidden="true">
    <div class="drawer-head"><h2>Your <em>bag</em> <span class="bag-count" data-bag-count>0</span></h2><button class="icon-btn" data-close-bag aria-label="Close bag">${icon.close}</button></div>
    <div class="drawer-body" id="drawerBody"></div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

export function toast(html) {
  const t = $("#toast"); if (!t) return;
  t.innerHTML = html; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 3200);
}

function renderDrawer() {
  const body = $("#drawerBody"); if (!body) return;
  const t = S.totals();
  if (!t.lines.length) {
    body.innerHTML = `<div class="empty"><p class="serif-lg">Nothing here <em>yet.</em></p><p>Every piece is made to order in your choice of wood.</p><a class="btn btn-dark" href="shop.html">Shop the collection ${icon.arrow}</a></div>`;
    return;
  }
  const pct = Math.min(100, (t.subtotal / BRAND.freeDeliveryOver) * 100);
  body.innerHTML = `
    <div class="free-bar"><p>${t.toFree ? `Add <b>${money(t.toFree)}</b> more for free delivery` : "Your order ships <b>free</b>"}</p><div class="bar"><span style="width:${pct}%"></span></div></div>
    <ul class="bag-lines">${t.lines.map(lineHtml).join("")}</ul>
    <div class="drawer-foot">
      <div class="row"><span>Subtotal</span><b>${money(t.subtotal)}</b></div>
      <p class="muted small">Delivery and white-glove set-up are chosen at checkout.</p>
      <a class="btn btn-dark btn-block" href="checkout.html">Check out ${icon.arrow}</a>
      <a class="btn btn-line btn-block" href="cart.html">View bag</a>
    </div>`;
}
export function lineHtml(l) {
  return `<li class="bag-line" data-key="${esc(l.key)}">
    <a href="product.html?id=${l.id}&wood=${l.wood}" class="bl-img"><img src="${img(l.p.img)}" alt="${esc(l.p.name)}"></a>
    <div class="bl-info">
      <span class="mono">${esc(l.p.type)}</span>
      <a href="product.html?id=${l.id}&wood=${l.wood}" class="bl-name">${esc(l.p.name)}</a>
      <span class="bl-opts"><i class="sw" style="background:${woodById(l.wood).color}"></i>${esc(l.woodName)}${l.fabricName ? ` · <i class="sw" style="background:${FABRICS.find((f) => f.name === l.fabricName)?.color}"></i>${esc(l.fabricName)}` : ""}</span>
      <span class="muted small">Made to order · ships in ${l.p.weeks} weeks</span>
      <div class="bl-row">
        <div class="qty"><button data-qty="-1" aria-label="Less">−</button><span>${l.qty}</span><button data-qty="1" aria-label="More">+</button></div>
        <button class="link-btn" data-remove>Remove</button>
      </div>
    </div>
    <b class="bl-price">${money(l.unit * l.qty)}</b>
  </li>`;
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
  const n = S.saved().length;
  $$("[data-saved-count]").forEach((e) => { e.textContent = n || ""; e.hidden = !n; });
  if ($("#bagDrawer")?.classList.contains("open")) renderDrawer();
}

/* ---------- product card ---------- */
export function card(p, opts = {}) {
  const wood = opts.wood || S.getWood();
  const isSaved = S.saved().includes(p.id);
  return `<article class="pcard" data-id="${p.id}">
    <a class="pc-img" href="product.html?id=${p.id}&wood=${wood}">
      <img src="${img(p.img)}" alt="${esc(p.name)} ${esc(p.type.toLowerCase())}" loading="lazy">
    </a>
    <button class="save-btn${isSaved ? " on" : ""}" data-save="${p.id}" aria-label="Save ${esc(p.name)}" aria-pressed="${isSaved}">${icon.heart}</button>
    <div class="pc-sw">
      <div class="woods" role="radiogroup" aria-label="Wood">${WOODS.map((w) => `<button role="radio" aria-checked="${w.id === wood}" class="wdot${w.id === wood ? " on" : ""}" style="--c:${w.color}" data-card-wood="${w.id}" title="${w.name}"></button>`).join("")}</div>
      ${p.fabric ? `<span class="muted small">+ ${FABRICS.length} fabrics</span>` : ""}
    </div>
    <span class="mono pc-type">${esc(p.type)}</span>
    <a class="pc-name" href="product.html?id=${p.id}&wood=${wood}">${esc(p.name)}</a>
    <span class="pc-dims">${dimsText(p.dims)}</span>
    <div class="pc-foot"><b class="pc-price">${money(priceFor(p, wood))}</b><span class="muted small">Ships in ${p.weeks} wk</span></div>
  </article>`;
}

function cardEvents() {
  document.addEventListener("click", (e) => {
    const sv = e.target.closest("[data-save]");
    if (sv) {
      e.preventDefault();
      const on = S.toggleSaved(sv.dataset.save);
      $$(`[data-save="${sv.dataset.save}"]`).forEach((b) => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      toast(on ? `Saved. <a href="saved.html">View saved</a>` : "Removed from saved");
      return;
    }
    const wd = e.target.closest("[data-card-wood]");
    if (wd) {
      const c = wd.closest(".pcard"), p = S.productById(c.dataset.id), w = wd.dataset.cardWood;
      $$(".wdot", c).forEach((b) => { b.classList.toggle("on", b === wd); b.setAttribute("aria-checked", b === wd); });
      $(".pc-price", c).textContent = money(priceFor(p, w));
      $$("a", c).forEach((a) => (a.href = `product.html?id=${p.id}&wood=${w}`));
    }
  });
}

/* ---------- reveal on scroll ---------- */
export function reveal(root = document) {
  const els = $$(".reveal:not(.in)", root);
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}

export async function init(page) {
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  syncCounts();
  window.addEventListener("store:change", syncCounts);
  window.addEventListener("storage", syncCounts);

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-bag]")) { e.preventDefault(); openBag(); }
    if (e.target.closest("[data-close-bag]")) closeBag();
    const line = e.target.closest(".bag-line");
    if (line) {
      const key = line.dataset.key;
      const q = e.target.closest("[data-qty]");
      if (q) { const cur = S.bag().find((x) => x.key === key); if (cur) S.setQty(key, cur.qty + Number(q.dataset.qty)); }
      if (e.target.closest("[data-remove]")) S.removeLine(key);
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#bagDrawer").classList.contains("open")) closeBag(); });

  const mb = $("[data-menu]"), mm = $("#mobileMenu");
  mb.addEventListener("click", () => { const open = mm.hidden; mm.hidden = !open; mb.setAttribute("aria-expanded", open); document.body.classList.toggle("menu-open", open); });

  const head = $("#siteHead");
  const onScroll = () => head.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  $("[data-news]").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("Thank you. The first letter comes next month."); });

  cardEvents();
  reveal();
  await S.loadOverrides();
}
