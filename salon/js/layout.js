// Shared header (hides on scroll down), footer, WhatsApp button, reveals, FAQ, call-back form.
import { SALON } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const WA = '<svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>';
export const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const NAV = [["home", "Home", "index.html"], ["services", "Services & Rates", "services.html"], ["bridal", "Bridal", "bridal.html"], ["stylists", "Our Team", "stylists.html"], ["gallery", "Gallery", "gallery.html"], ["contact", "Contact", "contact.html"]];
const LOGO = `<a class="logo" href="index.html" aria-label="${SALON.full} home"><b>Zeenat</b><small>Salon &amp; Studio</small></a>`;

export function init(page) {
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Skip to content</a>
  <header class="site-head" id="head"><div class="wrap head-in">${LOGO}
    <nav class="main-nav" aria-label="Main">${NAV.map(([id, l, h]) => `<a href="${h}"${id === page ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
    <a class="head-wa" href="${SALON.whatsapp}" target="_blank" rel="noopener">${WA} ${SALON.phone}</a>
    <a class="btn btn-sm head-cta" href="book.html">Book now</a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false" data-menu><span></span><span></span></button>
  </div></header>
  <div class="mobile-menu" id="mm" hidden>${NAV.map(([, l, h]) => `<a href="${h}">${l}</a>`).join("")}<a href="book.html">Book an appointment</a></div>`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="site-foot"><div class="wrap">
    <div class="foot-top">
      <div>${LOGO}<p style="margin-top:18px">Your hair is your confidence and the first thing people notice. That's why Lahore trusts us with more than just a haircut.</p></div>
      <div><h4>Visit</h4><a href="services.html">Services & rates</a><a href="bridal.html">Bridal packages</a><a href="stylists.html">Our team</a><a href="gallery.html">Gallery</a><a href="book.html">Book appointment</a></div>
      <div><h4>Hours</h4>${SALON.hours.map(([d, h]) => `<span style="display:block;margin-bottom:8px">${d}: ${h}</span>`).join("")}</div>
      <div><h4>Contact</h4><a href="${SALON.whatsapp}" target="_blank" rel="noopener">${SALON.phone}</a><a href="mailto:${SALON.email}">${SALON.email}</a><span>${SALON.address}</span></div>
    </div>
    <div class="foot-word" aria-hidden="true">Zeenat</div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${SALON.full}. Demo website, names and prices are placeholders. Photos: Pexels.</span><a href="admin.html">Staff login</a></div>
  </div></footer>
  <a class="wa-float" href="${SALON.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA.replace(/22/g, "28")}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`);
  const head = $("#head"); let last = scrollY;
  const onScroll = () => { const y = scrollY; head.classList.toggle("solid", y > 40); head.classList.toggle("hide", y > 500 && y > last && !document.body.classList.contains("menu-open")); last = y; };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const mb = $("[data-menu]"), mm = $("#mm");
  mb.onclick = () => { const o = mm.hidden; mm.hidden = !o; mb.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o); head.classList.add("solid"); };
  $$(".faq details").forEach((d) => {
    const ans = $(".ans", d);
    $("summary", d).addEventListener("click", (e) => {
      if (reduced() || !ans.animate) return; e.preventDefault();
      if (d.open) { const a = ans.animate([{ height: ans.offsetHeight + "px" }, { height: "0px" }], { duration: 380, easing: "ease-in-out" }); a.onfinish = () => (d.open = false); }
      else { d.open = true; const h = ans.offsetHeight; ans.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 480, easing: "cubic-bezier(.2,.75,.15,1)" }); }
    });
  });
  const cb = $("#cbForm");
  if (cb) cb.addEventListener("submit", async (e) => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(cb));
    if (d.name.trim().length < 2 || !/^[0-9+\-\s]{10,16}$/.test(d.phone.trim())) { $(".err", cb).textContent = "Please add your name and a valid mobile number."; return; }
    try { await S.callback({ name: d.name, phone: d.phone, topic: d.topic, message: "Call-back request from the website" }); cb.innerHTML = `<div class="ok" style="padding:10px"><div class="tick">✓</div><h3 style="color:#fff">Shukriya, ${esc(d.name.split(" ")[0])}!</h3><p style="margin:8px 0 0">We'll call you back within the hour.</p></div>`; }
    catch (er) { $(".err", cb).textContent = er.message; }
  });
  reveal();
}
export function toast(h) { const t = $("#toast"); t.innerHTML = h; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); }
let io;
export function reveal(root = document) {
  const els = $$(".reveal:not(.in)", root);
  if (!("IntersectionObserver" in window) || reduced()) return els.forEach((e) => e.classList.add("in"));
  document.documentElement.classList.add("js-reveal");
  io = io || new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((e) => io.observe(e));
}
export function parallax(sel = ".about .photo img") {
  if (reduced()) return;
  const imgs = $$(sel);
  const f = () => imgs.forEach((im) => { const r = im.parentElement.getBoundingClientRect(), k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; if (Math.abs(k) < 1.3) im.style.transform = `scale(1.12) translateY(${(k * -40).toFixed(1)}px)`; });
  addEventListener("scroll", f, { passive: true }); f();
}
export function countUp(el) {
  const end = Number(el.dataset.count), dec = Number(el.dataset.dec || 0), suf = el.dataset.suffix || "";
  if (reduced()) { el.textContent = end.toFixed(dec) + suf; return; }
  const t0 = performance.now(); const tick = (t) => { const k = Math.min(1, (t - t0) / 1800); el.textContent = (end * (1 - Math.pow(1 - k, 4))).toFixed(dec) + suf; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
}
export function onVisible(el, fn) { if (!el) return; const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { fn(el); o.disconnect(); } }); o.observe(el); }
// Shared blocks used on several pages
export const faqHtml = (FAQ) => `<div class="faq">${FAQ.map(([q, a], i) => `<details class="reveal" style="--i:${i}"${i === 0 ? " open" : ""}><summary>${esc(q)}<i aria-hidden="true"></i></summary><div class="ans"><p>${esc(a)}</p></div></details>`).join("")}</div>`;
export const callbackHtml = () => `<div class="callback reveal"><img src="assets/img/cta.webp" alt="" loading="lazy">
  <div><h2>Not sure what <em>suits you</em> best?</h2><p style="margin-top:16px;color:rgba(255,255,255,.8)">Leave your number and a senior stylist will call you back with honest advice. No pressure, no hidden costs.</p></div>
  <form class="cb-form" id="cbForm" novalidate><input name="name" placeholder="Your name" autocomplete="name" aria-label="Your name"><input name="phone" placeholder="Mobile number (03xx xxxxxxx)" autocomplete="tel" aria-label="Mobile number">
    <select name="topic" aria-label="Topic"><option>Hair</option><option>Bridal makeup</option><option>Party makeup</option><option>Skin & facials</option><option>Mehndi & nails</option></select>
    <p class="err" style="color:#ffb4a8"></p><button class="btn">Call me back</button></form></div>`;
