// Shared header, footer, WhatsApp button, toast, scroll reveals and product cards.
import { BRAND, rs } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const img = (n) => `assets/img/${n}.webp`;

const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  wa: '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.1l-1 1.3c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.4Z"/></svg>',
};
export { ICON };

const NAV = [["shop", "Shop", "shop.html"], ["calculator", "Backup calculator", "calculator.html"], ["guide", "Install guide", "guide.html"], ["contact", "Contact", "contact.html"]];

function header(page) {
  return `<a class="skip" href="#main">Skip to content</a>
  <header class="hdr" id="hdr"><div class="wrap">
    <a class="logo" href="index.html" aria-label="${BRAND.full} home"><i></i>jugnu<small>power</small></a>
    <nav class="nav" aria-label="Main">${NAV.map(([k, t, h]) => `<a href="${h}" class="${k === page ? "on" : ""}">${t}</a>`).join("")}</nav>
    <div class="hdr-act">
      <a class="btn btn-ghost btn-sm" href="${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a>
      <a class="cart-btn" href="cart.html" aria-label="Cart">${ICON.cart}<b id="cartCount"></b></a>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span></button>
    </div>
  </div></header>
  <div class="mobile-menu" id="mm" hidden>${[["home", "Home", "index.html"], ...NAV].map(([, t, h]) => `<a href="${h}">${t}</a>`).join("")}
    <a class="btn btn-lime" href="${BRAND.whatsapp}" target="_blank" rel="noopener">Ask on WhatsApp</a></div>`;
}
function footer() {
  return `<footer class="ftr"><div class="wrap">
    <div class="ftr-grid">
      <div><a class="logo" href="index.html"><i></i>jugnu<small>power</small></a>
        <p class="muted" style="margin-top:18px;max-width:300px">Mini UPS and backup power for WiFi routers, made for Pakistani load-shedding. Cash on delivery across Pakistan.</p></div>
      <div><h4>Shop</h4><a href="product.html?id=j10">Jugnu 10,400 mAh</a><a href="product.html?id=j20">Jugnu 20,000 mAh</a><a href="product.html?id=kit">Load-shedding kit</a><a href="shop.html?cat=acc">Accessories</a></div>
      <div><h4>Help</h4><a href="calculator.html">Backup calculator</a><a href="guide.html">Install guide</a><a href="guide.html#faq">FAQ & warranty</a><a href="contact.html">Contact</a></div>
      <div><h4>Talk to us</h4><a href="${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp ${BRAND.phone}</a><a href="mailto:${BRAND.email}">${BRAND.email}</a><p class="muted" style="margin-top:8px">${BRAND.address}<br>${BRAND.hours}</p></div>
    </div>
    <div class="ftr-big" aria-hidden="true">jugnu<span>.</span>power</div>
    <div class="ftr-low"><span>© ${new Date().getFullYear()} ${BRAND.full}. Demo store.</span><span>1 year warranty · 7 day returns · COD</span><a href="admin.html">Admin</a></div>
  </div></footer>
  <a class="wa" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

let toastT;
export function toast(html) {
  const t = $("#toast"); t.innerHTML = `<i></i><span>${html}</span>`; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3200);
}
export function syncCount(bump) {
  const c = $("#cartCount"); if (!c) return;
  const n = S.bagCount(); c.textContent = n || "";
  if (bump) { c.parentElement.classList.remove("bump"); void c.offsetWidth; c.parentElement.classList.add("bump"); }
}
export function addToCart(id, qty = 1) {
  if (!S.addToBag(id, qty)) { toast("Sorry, this one is sold out right now."); return false; }
  syncCount(true); toast(`Added to cart. <a href="cart.html">View cart</a>`); return true;
}

// Split heading text into words that slide up when revealed.
export function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(" "); return; }
          const s = document.createElement("span"); s.className = "w"; s.innerHTML = `<span style="--d:${i++}">${esc(w)}</span>`; frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("w")) walk(n);
    });
  };
  walk(el); el.classList.add("split");
}

export function reveal(root = document) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  $$(".reveal, .split", root).forEach((el) => io.observe(el));
}

export function countUp(el) {
  const end = Number(el.dataset.count), dec = Number(el.dataset.dec || 0), t0 = performance.now(), dur = 1600;
  const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = (end * e).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

// Gentle 3D tilt on hover for cards (desktop only).
export function tilt(root = document) {
  if (matchMedia("(hover:none)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  $$(".pcard", root).forEach((c) => {
    c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`; });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });
}

export function cardHtml(p, i = 0) {
  const sold = p.status === "soldout";
  const specs = p.cat === "acc" ? [] : [p.mah, p.hours];
  return `<article class="pcard reveal" style="--i:${i % 3}">
    <a class="pcard-img" href="product.html?id=${p.id}">${p.tag ? `<span class="pill"><i></i>${esc(p.tag)}</span>` : ""}${sold ? '<span class="pill sold">Sold out</span>' : ""}
      <img src="${img("p-" + p.id)}" alt="${esc(p.name)}" loading="lazy" width="900" height="740"></a>
    <div class="pcard-body">
      <a href="product.html?id=${p.id}"><h3>${esc(p.name)}</h3></a>
      <p class="line">${esc(p.line)}</p>
      ${specs.length ? "" : ""}<div class="specs">${specs.map((s, k) => `<span class="spec">${k === 1 ? "<b>⚡</b> " : ""}${esc(s)}</span>`).join("")}</div>
      <div class="price-row"><span class="price">${rs(p.price)}${p.old ? `<s>${rs(p.old)}</s>` : ""}</span>
        <button class="add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart" ${sold ? "disabled" : ""}>${ICON.plus}</button></div>
    </div></article>`;
}
export function bindAdd(root = document) {
  root.addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) { e.preventDefault(); addToCart(b.dataset.add); } });
}

// Theme preview: ?theme=light loads css/light.css and keeps it while browsing (this tab only).
export function applyTheme() {
  const q = new URLSearchParams(location.search).get("theme");
  try { if (q) sessionStorage.setItem("jg-theme", q); } catch {}
  let t = q; try { t = q || sessionStorage.getItem("jg-theme"); } catch {}
  if (t === "light" && !document.getElementById("lightcss")) {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.id = "lightcss"; l.href = "css/light.css?v=1"; document.head.append(l);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#f3f3ef");
  }
}
applyTheme();

export function init(page) {
  document.documentElement.classList.add("js-reveal");
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  const hdr = $("#hdr"), mm = $("#mm"), burger = $("#burger");
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY; hdr.classList.toggle("solid", y > 30);
    hdr.classList.toggle("hide", y > 400 && y > lastY && mm.hidden); lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.onclick = () => { const open = mm.hidden; mm.hidden = !open; burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : ""; };
  addEventListener("store:change", () => syncCount());
  syncCount();
  S.loadOverrides();
  $$("h1.split-me, h2.split-me").forEach(splitWords);
  reveal();
  $$("[data-count]").forEach((el) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { countUp(el); io.disconnect(); } }); io.observe(el); });
}
