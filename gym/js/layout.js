// Shared header, footer, film grain, reveals and WhatsApp button.
import { CLUB } from "./data.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const img = (n) => `assets/img/${n}.webp`;
const WA = '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.1l-1 1.3c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.4Z"/></svg>';
const NAV = [["programs", "Programs", "programs.html"], ["coaches", "Coaches", "coaches.html"], ["membership", "Membership", "membership.html"], ["contact", "Visit", "contact.html"]];

export function init(page, { solid = false } = {}) {
  document.documentElement.classList.add("js");
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Skip to content</a><div class="grain" aria-hidden="true"></div>
  <header class="hdr ${solid ? "solid" : ""}" id="hdr"><div class="wrap">
    <a class="logo" href="index.html" aria-label="${CLUB.full} home"><b>FAJR</b><small>Athletic Club</small></a>
    <nav class="nav" aria-label="Main">${NAV.map(([k, t, h]) => `<a href="${h}" class="${k === page ? "on" : ""}">${t}</a>`).join("")}</nav>
    <a class="btn btn-amber btn-sm" href="trial.html">Free trial</a>
    <button class="burger" id="burger" aria-label="Menu"><span></span></button>
  </div></header>
  <div class="mm" id="mm" hidden><button class="x" id="mmx" aria-label="Close">×</button><a href="index.html">Home</a>${NAV.map(([, t, h]) => `<a href="${h}">${t}</a>`).join("")}<a href="trial.html" style="color:var(--amber)">Book a free trial</a></div>`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="ftr"><div class="wrap">
    <div class="ftr-grid">
      <div><a class="logo" href="index.html"><b>FAJR</b><small>Athletic Club</small></a><p class="muted" style="margin-top:20px;max-width:320px">Strength and conditioning in a warehouse in Lahore. Doors open at 5 am.</p></div>
      <div><h4>Train</h4><a href="programs.html">Programs & timetable</a><a href="coaches.html">Coaches</a><a href="membership.html">Membership</a><a href="trial.html">Free trial</a></div>
      <div><h4>Club</h4><a href="contact.html">Visit us</a><a href="contact.html">Corporate plans</a><a href="programs.html#ladies">Ladies hours</a><a href="admin.html">Staff login</a></div>
      <div><h4>Find us</h4><p class="muted" style="font-size:14.5px">${CLUB.address}</p>${CLUB.hours.map(([a, b]) => `<p class="muted" style="font-size:14px;margin-top:6px">${a}: ${b}</p>`).join("")}<a href="${CLUB.whatsapp}" target="_blank" rel="noopener" style="margin-top:10px">WhatsApp ${CLUB.phone}</a></div>
    </div>
    <div class="ftr-low"><span>© ${new Date().getFullYear()} ${CLUB.full}. Demo website.</span><span>Photos: one shoot, one gym, one morning.</span></div>
  </div></footer><a class="wa" href="${CLUB.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a>`);
  const hdr = $("#hdr"); let lastY = 0;
  addEventListener("scroll", () => { const y = scrollY; if (!solid) hdr.classList.toggle("solid", y > innerHeight * 0.9 || document.body.dataset.solid === "1"); hdr.classList.toggle("hide", y > 300 && y > lastY && !document.body.dataset.film); lastY = y; }, { passive: true });
  $("#burger").onclick = () => { $("#mm").hidden = false; };
  $("#mmx").onclick = () => { $("#mm").hidden = true; };
  reveal();
}
export function reveal(root = document) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  $$(".reveal", root).forEach((el) => io.observe(el));
}
// drag-to-scroll for the film strip
export function dragScroll(el) {
  let down = false, sx = 0, sl = 0;
  el.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = el.scrollLeft; el.classList.add("drag"); });
  addEventListener("pointerup", () => { down = false; el.classList.remove("drag"); });
  el.addEventListener("pointermove", (e) => { if (down) el.scrollLeft = sl - (e.clientX - sx); });
}
