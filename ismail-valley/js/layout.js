// Shared header, footer, concept notice, WhatsApp button, reveals and the booking modal.
import { SOCIETY, blockById, sizeLabel, plotPrice, pkr } from "./data.js";
import * as S from "./store.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const LOGO = '<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#c9a24b"/><path d="M12 46h40M18 46V30l14-11 14 11v16" fill="none" stroke="#0f3d2e" stroke-width="3.5" stroke-linejoin="round"/><path d="M28 46v-9h8v9" fill="none" stroke="#0f3d2e" stroke-width="3.5"/></svg>';
const WA = '<svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>';
const NAV = [["home", "Home", "index.html"], ["plots", "Plots & Master Plan", "plots.html"], ["plan", "Payment Plan", "payment-plan.html"], ["gallery", "Gallery", "gallery.html"], ["about", "About", "about.html"], ["contact", "Contact", "contact.html"]];

export function init(page) {
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Skip to content</a>
  <div class="concept"><b>Concept website</b> prepared for ${SOCIETY.name} by DATIVOPK. Rates and plot numbers are illustrative. Photos: Ismail Valley Facebook page and property listings.</div>
  <header class="site-head" id="head"><div class="wrap head-in">
    <a class="logo" href="index.html" aria-label="${SOCIETY.name} home">${LOGO}<span><b>${SOCIETY.name}</b><small>Faisalabad</small></span></a>
    <nav class="main-nav" aria-label="Main">${NAV.map(([id, l, h]) => `<a href="${h}"${id === page ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
    <a class="btn btn-sm head-cta" href="plots.html">Book a plot</a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false" data-menu><span></span><span></span></button>
  </div></header>
  <div class="mobile-menu" id="mm" hidden>${NAV.map(([, l, h]) => `<a href="${h}">${l}</a>`).join("")}</div>`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="site-foot"><div class="wrap">
    <div class="foot-grid">
      <div><a class="logo" href="index.html">${LOGO}<span><b>${SOCIETY.name}</b><small>Faisalabad</small></span></a><p style="margin-top:16px;max-width:300px">A private residential society on ${SOCIETY.address.replace(", Punjab", "")}, developed by ${SOCIETY.developer}.</p></div>
      <div><h4>Explore</h4><a href="plots.html">Available plots</a><a href="plots.html#map">Master plan</a><a href="payment-plan.html">Payment plan</a><a href="gallery.html">Gallery</a></div>
      <div><h4>Society</h4><a href="about.html">About & management</a><a href="about.html#amenities">Amenities</a><a href="contact.html">Site office</a><a href="admin.html">Staff login</a></div>
      <div><h4>Contact</h4><a href="tel:${SOCIETY.phone.replace(/\s/g, "")}">${SOCIETY.phone}</a><a href="mailto:${SOCIETY.email}">${SOCIETY.email}</a><span>${SOCIETY.hours}</span></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${SOCIETY.name}. Concept website by DATIVOPK, not the official site.</span><span>Real photos from the society's public page and listings; amenity photos are illustrative.</span></div>
  </div></footer>
  <a class="wa-float" href="${SOCIETY.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div class="modal" id="bookModal" aria-hidden="true"><div class="card" role="dialog" aria-modal="true" aria-labelledby="bmT"><button class="x" data-close aria-label="Close">✕</button><div id="bmBody"></div></div></div>`);
  const head = $("#head"), solid = () => head.classList.toggle("solid", scrollY > 30 || !document.querySelector(".hero, .page-hero"));
  addEventListener("scroll", solid, { passive: true }); solid();
  const mb = $("[data-menu]"), mm = $("#mm");
  mb.onclick = () => { const o = mm.hidden; mm.hidden = !o; mb.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o); };
  const modal = $("#bookModal");
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) closeBooking(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeBooking(); });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-book]"); if (b) { e.preventDefault(); openBooking(b.dataset.book || ""); } });
  reveal();
  return S.loadOverrides();
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
export function onVisible(el, fn) { if (!el) return; const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { fn(el); o.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" }); o.observe(el); }
export function countUp(el) {
  const end = Number(el.dataset.count), suf = el.dataset.suffix || "";
  if (reduced()) { el.textContent = end.toLocaleString("en-PK") + suf; return; }
  const t0 = performance.now(); const tick = (t) => { const k = Math.min(1, (t - t0) / 1800); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 4))).toLocaleString("en-PK") + suf; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
}
export function parallax() {
  if (reduced()) return;
  const imgs = $$(".frame img");
  const f = () => imgs.forEach((im) => { const r = im.parentElement.getBoundingClientRect(), k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; if (Math.abs(k) < 1.3) im.style.transform = `scale(1.12) translateY(${(k * -36).toFixed(1)}px)`; });
  addEventListener("scroll", f, { passive: true }); f();
}

/* booking modal: a plot or a general booking request */
export function openBooking(plotId) {
  const p = plotId ? S.plotById(plotId) : null;
  const b = p && blockById(p.block);
  $("#bmBody").innerHTML = `<p class="eyebrow">${p ? "Plot " + esc(p.id) : "Booking request"}</p><h2 id="bmT" style="font-size:32px">${p ? `${sizeLabel(p.size)} ${p.type.toLowerCase()} plot, ${esc(b.name)}` : "Book your plot"}</h2>
    ${p ? `<div class="kv"><div><small>Price</small>${pkr(plotPrice(p))}</div><div><small>Status</small><span class="status ${p.status}">${p.status}</span></div><div><small>Location</small>${p.corner ? "Corner" : p.park ? "Park facing" : "Standard"}</div><div><small>Rate</small>${pkr(b.rate)} / marla</div></div>` : `<p class="muted" style="margin-top:10px">Tell us the size you want and our sales team will call you with available plots.</p>`}
    <form id="bf" novalidate class="form2" style="margin-top:14px">
      <div class="field"><label for="bn">Name</label><input id="bn" name="name" autocomplete="name"></div>
      <div class="field"><label for="bp">Mobile (WhatsApp)</label><input id="bp" name="phone" autocomplete="tel" placeholder="03xx xxxxxxx"></div>
      ${p ? "" : `<div class="field"><label for="bs">Plot size</label><select id="bs" name="size">${[3, 5, 7, 10, 20].map((s) => `<option value="${s}">${sizeLabel(s)}</option>`).join("")}</select></div>`}
      <div class="field"><label for="bc">City</label><input id="bc" name="city" value="Faisalabad"></div>
      <div class="field ${p ? "" : "full"}"><label for="bpl">Payment</label><select id="bpl" name="plan"><option>1.5 year installments</option><option>Full payment</option></select></div>
      <div class="field"><label for="bv">Site visit</label><select id="bv" name="visit"><option value="">No visit needed</option><option>This Saturday</option><option>This Sunday</option><option>Weekday, call me</option></select></div>
      <div class="field full"><label for="bm">Message (optional)</label><textarea id="bm" name="message"></textarea></div>
      <p id="berr" class="small full" style="color:#b3261e;margin:0 0 8px"></p>
      <button class="btn btn-green full">${p ? "Request this plot" : "Send booking request"}</button>
    </form>`;
  $("#bf").addEventListener("submit", async (e) => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
    if (d.name.trim().length < 2 || !/^[0-9+\-\s]{10,16}$/.test(d.phone.trim())) { $("#berr").textContent = "Please add your name and a valid mobile number."; return; }
    try {
      const o = await S.sendBooking({ ...d, plot: p ? p.id : "", size: p ? p.size : Number(d.size) });
      $("#bmBody").innerHTML = `<div class="ok"><div class="tick">✓</div><h2 style="font-size:30px">Request received</h2><p class="muted" style="margin-top:10px">Shukriya ${esc(d.name.split(" ")[0])}! Our sales team will call you within the hour${d.visit ? " to arrange your site visit" : ""}. Reference <b>${esc(o.id || "")}</b>.</p><button class="btn" data-close style="margin-top:10px">Close</button></div>`;
    } catch (er) { $("#berr").textContent = er.message; }
  });
  const m = $("#bookModal"); m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.classList.add("lock");
  setTimeout(() => $("#bn")?.focus(), 300);
}
function closeBooking() { const m = $("#bookModal"); if (!m?.classList.contains("open")) return; m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); }
