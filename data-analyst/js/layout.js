// Shared header, footer, WhatsApp button and scroll reveal for every page.
import { PERSON } from "./data.js";

const page = document.body.dataset.page || "";
const LINKS = [["index.html", "Home", "home"], ["projects.html", "Case studies", "projects"], ["skills.html", "Skills & tools", "skills"], ["about.html", "About & CV", "about"], ["contact.html", "Contact", "contact"]];
const MARK = `<svg viewBox="0 0 20 20" fill="#0e1726" aria-hidden="true"><rect x="2" y="11" width="3.4" height="7" rx="1"/><rect x="8.3" y="6" width="3.4" height="12" rx="1"/><rect x="14.6" y="2" width="3.4" height="16" rx="1"/></svg>`;
export const WA_ICON = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.8-1.6l-.4-.2-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9 0-5.9 4.9-10.6 10.9-10.6s10.9 4.8 10.9 10.6-4.9 10.6-10.9 10.6zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;
export const waLink = (msg = "Hi Hamza, I saw your portfolio and would like to discuss a data project.") =>
  `https://wa.me/${PERSON.wa}?text=${encodeURIComponent(msg)}`;

const head = `
<div class="topbar"><div class="wrap">
  <span><span class="dot"></span><b>Available for new projects</b> <span class="hide-m">· next start date: January 2027</span></span>
  <span class="hide-m">${PERSON.city} · Replies within 24 hours</span>
</div></div>
<header class="site-head"><div class="wrap">
  <a class="brand" href="index.html"><span class="brand-mark">${MARK}</span><span>${PERSON.name}<small>${PERSON.role}</small></span></a>
  <nav class="nav" id="nav">${LINKS.map(([h, t, k]) => `<a href="${h}"${k === page ? ' class="active" aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
  <div class="head-cta">
    <a class="btn btn-ghost" href="about.html#cv">Download CV</a>
    <a class="btn btn-lime" href="contact.html">Start a project <span class="arr">→</span></a>
    <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</div></header>`;

const foot = `
<footer class="site-foot${document.body.dataset.flush ? " flush" : ""}"><div class="wrap">
  <div class="foot-grid">
    <div>
      <a class="brand" href="index.html"><span class="brand-mark">${MARK}</span><span style="color:#fff">${PERSON.name}<small>${PERSON.role}</small></span></a>
      <p class="foot-big">Turning messy data into <em>clear decisions.</em></p>
      <p>Dashboards, forecasting and analysis for retail, e-commerce, health and manufacturing teams in Pakistan and the Gulf.</p>
    </div>
    <div><h4>Pages</h4>${LINKS.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</div>
    <div><h4>Case studies</h4><a href="project.html?id=kinara-retail">Retail command centre</a><a href="project.html?id=dakhil-returns">E-commerce returns</a><a href="project.html?id=noorani-opd">Hospital wait times</a><a href="project.html?id=rasta-forecast">Demand forecasting</a><a href="project.html?id=jeb-churn">Wallet churn model</a></div>
    <div><h4>Contact</h4><a href="mailto:${PERSON.email}">${PERSON.email}</a><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp ${PERSON.phone}</a><a href="contact.html">Project enquiry form</a><span style="display:block;padding:4px 0">${PERSON.city}</span></div>
  </div>
  <div class="foot-bottom"><span>© 2026 ${PERSON.name}. Client names are kept private; figures shown with permission or rounded.</span><span><a href="admin.html">Admin</a> · Photos: Pexels</span></div>
</div></footer>
<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><span class="tip">Chat on WhatsApp</span>${WA_ICON}</a>`;

document.body.insertAdjacentHTML("afterbegin", head);
document.body.insertAdjacentHTML("beforeend", foot);

const burger = document.querySelector(".burger"), nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});

export function reveal(root = document) {
  const els = root.querySelectorAll(".rv:not(.in)");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach((e) => io.observe(e));
}
reveal();
