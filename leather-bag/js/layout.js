// Shared header, footer, cart count, toast, reveals and the WhatsApp button.
import { BRAND, rs } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const img = (n) => `assets/img/${n}.webp`;

export const ICON = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  wa: '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.1l-1 1.3c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.4Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};

const NAV = [["shop", "Shop", "product.html"], ["craft", "Our craft", "craft.html"], ["addons", "Add-ons", "index.html#addons"], ["contact", "Visit & contact", "contact.html"]];
const ANN = ["Free delivery across Pakistan", "Cash on delivery · 14 day returns", "Made by hand in Sialkot · 1 year free repairs"];

function header(page) {
  return `<a class="skip" href="#main">Skip to content</a>
  <div class="announce" aria-live="off"><span id="ann">${ANN[0]}</span></div>
  <header class="hdr" id="hdr"><div class="wrap">
    <nav class="nav" aria-label="Main">${NAV.map(([k, t, h]) => `<a href="${h}" class="${k === page ? "on" : ""}">${t}</a>`).join("")}</nav>
    <button class="icon-btn burger" id="burger" aria-label="Menu">${ICON.menu}</button>
    <a class="logo" href="index.html" aria-label="${BRAND.full} home">Chamra<small>Leather Co.</small></a>
    <div class="hdr-act">
      <a class="icon-btn wa-link" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp" style="color:#1f8f4d">${ICON.wa.replace("<svg", '<svg fill="currentColor"')}</a>
      <a class="icon-btn" href="cart.html" aria-label="Cart">${ICON.bag}<b id="cartCount"></b></a>
    </div>
  </div></header>
  <div class="mobile-menu" id="mm" hidden><button class="icon-btn close" id="mmClose" aria-label="Close">${ICON.close}</button>
    <a href="index.html">Home</a><a href="product.html">The briefcase</a>${NAV.slice(1).map(([, t, h]) => `<a href="${h}">${t}</a>`).join("")}<a href="cart.html">Cart</a></div>`;
}
function footer() {
  return `<footer class="ftr"><div class="wrap">
    <div class="ftr-grid">
      <div><a class="logo" href="index.html">Chamra</a><p class="muted" style="margin-top:14px;max-width:300px">One leather briefcase, cut and stitched by hand in Sialkot. Delivered free across Pakistan.</p></div>
      <div><h4>Shop</h4><a href="product.html?c=tan">Briefcase · Tan</a><a href="product.html?c=black">Briefcase · Black</a><a href="index.html#addons">Wallet & add-ons</a><a href="cart.html">Cart</a></div>
      <div><h4>About</h4><a href="craft.html">Our craft</a><a href="product.html#faq">FAQ</a><a href="contact.html">Visit the studio</a><a href="contact.html">Corporate gifting</a></div>
      <div><h4>Talk to us</h4><a href="${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp ${BRAND.phone}</a><a href="mailto:${BRAND.email}">${BRAND.email}</a><p class="muted" style="margin-top:8px;font-size:14px">${BRAND.address}<br>${BRAND.workshop}<br>${BRAND.hours}</p></div>
    </div>
    <div class="ftr-low"><span>© ${new Date().getFullYear()} ${BRAND.full}. Demo store.</span><span>Prices in PKR · COD available</span><a href="admin.html">Admin</a></div>
  </div></footer>
  <a class="wa" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

let tt;
export function toast(html) { const t = $("#toast"); t.innerHTML = html; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 3200); }
export function syncCount(bump) {
  const c = $("#cartCount"); if (!c) return; c.textContent = S.bagCount() || "";
  if (bump) { const b = c.parentElement; b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}
export function addToCart(id, qty = 1) {
  if (!S.addToBag(id, qty)) { toast("Sorry, this one is sold out right now."); return false; }
  syncCount(true); toast(`Added to your cart.<a href="cart.html">View cart</a>`); return true;
}

// Wrap each word of a heading so the words rise in one after another.
export function splitWords(el) {
  let i = 0;
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) { f.append(" "); return; } const s = document.createElement("span"); s.className = "rise"; s.innerHTML = `<span style="--d:${i++}">${esc(w)}</span>`; f.append(s); });
      n.replaceWith(f);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el); el.classList.add("split");
}
export function reveal(root = document) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  $$(".reveal, .split", root).forEach((el) => io.observe(el));
}
// slow vertical drift for images marked data-parallax
export function parallax() {
  const els = $$("[data-parallax]"); if (!els.length || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const tick = () => { els.forEach((el) => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; el.style.transform = `translate3d(0,${(k * -60 - 40).toFixed(1)}px,0)`; }); requestAnimationFrame(tick); };
  tick();
}

export function init(page) {
  document.documentElement.classList.add("js");
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  const hdr = $("#hdr"), mm = $("#mm");
  let lastY = 0;
  addEventListener("scroll", () => { const y = scrollY; hdr.classList.toggle("solid", y > 40); hdr.classList.toggle("hide", y > 500 && y > lastY); lastY = y; }, { passive: true });
  $("#burger").onclick = () => { mm.hidden = false; document.body.style.overflow = "hidden"; };
  $("#mmClose").onclick = () => { mm.hidden = true; document.body.style.overflow = ""; };
  let a = 0; const ann = $("#ann");
  setInterval(() => { ann.style.transition = "opacity .4s"; ann.style.opacity = 0; setTimeout(() => { a = (a + 1) % ANN.length; ann.textContent = ANN[a]; ann.style.opacity = 1; }, 400); }, 4200);
  addEventListener("store:change", () => syncCount());
  syncCount(); S.loadOverrides();
  $$("h1.split-me, h2.split-me").forEach(splitWords);
  reveal(); parallax();
}
export { rs };
