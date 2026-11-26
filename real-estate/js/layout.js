// Shared header, footer, WhatsApp button, listing cards, blur reveals and small helpers.
import { BRAND, PURPOSES, cover, priceLabel, perMonth } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const icon = {
  area: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9V4h5M20 15v5h-5M4 4l7 7M20 20l-7-7"/></svg>',
  floor: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 20h5v-5h5v-5h5V5h3"/></svg>',
  bed: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18v-6h18v6M3 18v2M21 18v2M5 12V7h14v5M8 12V9h3v3M13 12V9h3v3"/></svg>',
  bath: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3zM6 12V5a2 2 0 0 1 4 0"/></svg>',
  heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  chev: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  left: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 6-6 6 6 6"/></svg>',
  right: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6 6 6-6 6"/></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  at: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>',
  dl: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v12M6 11l6 6 6-6M5 20h14"/></svg>',
  plus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  post: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11 12 4l9 7M5 10v10h14V10M12 13v5M9.5 15.5h5"/></svg>',
  check: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/></svg>',
  wa: '<svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>',
};

const logoHtml = (cls = "logo") => `<a class="${cls}" href="index.html" aria-label="${BRAND.name} home"><span>Arz</span><span>Estate</span></a>`;
const NAV = [["properties", "Properties", "properties.html"], ["invest", "Investments", "invest.html"], ["agents", "Agents", "agents.html"], ["about", "Company", "about.html"], ["contact", "Contact", "contact.html"]];

function header(page) {
  const item = ([id, l, h]) => {
    const cur = page === id ? ' aria-current="page"' : "";
    if (id === "properties") return `<div class="dd"><a href="${h}"${cur}>${l} ${icon.chev}</a><div class="dd-menu">${PURPOSES.map(([p, n]) => `<a href="properties.html?purpose=${p}">${n}</a>`).join("")}<a href="saved.html">Saved homes</a></div></div>`;
    if (id === "invest") return `<a href="${h}"${cur}>${l} <span class="badge-new">New</span></a>`;
    if (id === "about") return `<div class="dd"><a href="${h}"${cur}>${l} ${icon.chev}</a><div class="dd-menu"><a href="about.html">About us</a><a href="agents.html">Our agents</a><a href="contact.html#faq">FAQ</a></div></div>`;
    return `<a href="${h}"${cur}>${l}</a>`;
  };
  return `<a class="skip" href="#main">Skip to content</a>
  <header class="site-head" id="siteHead"><div class="wrap head-in">
    ${logoHtml()}
    <nav class="main-nav" aria-label="Main">${NAV.map(item).join("")}</nav>
    <div class="head-actions">
      <a class="icon-btn saved-link" href="saved.html" aria-label="Saved homes">${icon.heart}<b data-saved-count data-n="0">0</b></a>
      <a class="btn btn-line btn-sm" href="post.html">${icon.post} Post a property</a>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" data-menu><span></span><span></span></button>
    </div>
  </div></header>
  <div class="mobile-menu" id="mobileMenu" hidden><a href="index.html">Home</a>${NAV.map(([, l, h]) => `<a href="${h}">${l}</a>`).join("")}<a href="saved.html">Saved homes</a><a href="post.html">Post a property</a></div>`;
}

function footer() {
  return `<footer class="site-foot"><div class="wrap">
    <div class="foot-grid">
      <div>${logoHtml()}</div>
      <div><a href="mailto:${BRAND.email}">${BRAND.email}</a><a href="tel:${BRAND.phone.replace(/\s/g, "")}">${BRAND.phone}</a><span class="muted" style="display:block;max-width:260px;margin-top:10px">${BRAND.office}</span></div>
      <div><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">YouTube</a><a href="#">LinkedIn</a><a href="${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${BRAND.name}. Demo website, listings and prices are placeholders. Photos: Pexels.</span><span><a href="admin.html">Agent login</a> · <a href="contact.html#faq">Privacy policy</a></span></div>
  </div></footer>
  <a class="wa-float" href="${BRAND.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon.wa}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

export function toast(html) {
  const t = $("#toast"); if (!t) return;
  t.innerHTML = html; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 3200);
}

export const specs = (l) => `<div class="specs"><span>${icon.area}${l.sqft.toLocaleString("en-PK")} ft²</span><span>${icon.floor}${l.floors} floor${l.floors > 1 ? "s" : ""}</span>${l.beds ? `<span>${icon.bed}${l.beds} beds</span>` : ""}<span>${icon.bath}${l.baths} bath${l.baths > 1 ? "s" : ""}</span></div>`;

export function card(l, i = 0) {
  const on = S.saved().includes(l.id);
  const tag = l.status === "sold" ? '<span class="lc-tag dark">Sold</span>' : l.status === "reserved" ? '<span class="lc-tag dark">Reserved</span>' : l.tag ? `<span class="lc-tag">${esc(l.tag)}</span>` : "";
  return `<article class="lcard${l.status === "sold" ? " sold" : ""}" style="--i:${i}">
    <a class="lc-media" href="property.html?id=${l.id}"><img src="${cover(l)}" alt="${esc(l.title)}, ${esc(l.area)}" loading="lazy">${tag}</a>
    <button class="save-btn${on ? " on" : ""}" data-save="${l.id}" aria-pressed="${on}" aria-label="Save ${esc(l.title)}">${icon.heart}</button>
    <div class="lc-body"><div class="lc-top"><a class="lc-title" href="property.html?id=${l.id}">${esc(l.title)}</a><span class="lc-price">${priceLabel(l).replace("PKR ", "Rs ").replace(" / month", "/mo")}</span></div>
      <div class="lc-loc">Pakistan/${esc(l.city)}/${esc(l.area)}</div>${specs(l)}</div>
  </article>`;
}

/* reveals: content is visible by default, JS adds the motion */
let io;
export function reveal(root = document) {
  const els = $$(".reveal:not(.in), .blur-words:not(.in), [data-inview]:not(.in)", root);
  if (!("IntersectionObserver" in window) || reduced()) { els.forEach((e) => e.classList.add("in")); return; }
  document.documentElement.classList.add("js-reveal");
  io = io || new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}
// Words come into focus one after another (the blur-in from the reference video).
export function blurWords(el) {
  if (!el || el.dataset.split) return;
  el.dataset.split = "1"; el.classList.add("blur-words");
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
        const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el);
  $$(".w", el).forEach((s, i) => (s.style.transitionDelay = (Number(el.dataset.delay || 0) + i * 0.08) + "s"));
}
export function onVisible(el, fn, margin = "0px 0px -10% 0px") {
  if (!el) return;
  if (!("IntersectionObserver" in window)) return fn(el);
  const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { fn(el); o.disconnect(); } }, { rootMargin: margin });
  o.observe(el);
}
// Count from 0 to the target; numbers tick like the reference video.
export function countUp(el, fmt = (v) => Math.round(v).toLocaleString("en-PK")) {
  const end = Number(el.dataset.count);
  if (reduced()) { el.textContent = fmt(end); return; }
  const t0 = performance.now(), dur = 2000;
  const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(end * e); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function syncSaved() { const n = S.saved().length; $$("[data-saved-count]").forEach((e) => { e.textContent = n; e.dataset.n = n; }); }

export async function init(page) {
  document.body.insertAdjacentHTML("afterbegin", header(page));
  document.body.insertAdjacentHTML("beforeend", footer());
  syncSaved(); addEventListener("store:change", syncSaved); addEventListener("storage", syncSaved);
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-save]"); if (!b) return;
    e.preventDefault();
    const on = S.toggleSaved(b.dataset.save);
    $$(`[data-save="${b.dataset.save}"]`).forEach((x) => { x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); x.classList.remove("pop"); void x.offsetWidth; x.classList.add("pop"); });
    toast(on ? `Saved. <a href="saved.html">See saved homes</a>` : "Removed from saved homes");
  });
  const mb = $("[data-menu]"), mm = $("#mobileMenu");
  mb.addEventListener("click", () => { const open = mm.hidden; mm.hidden = !open; mb.setAttribute("aria-expanded", open); document.body.classList.toggle("menu-open", open); });
  const head = $("#siteHead");
  const onScroll = () => head.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $$("[data-blur]").forEach(blurWords);
  reveal();
  await S.loadOverrides();
}
export { perMonth };
