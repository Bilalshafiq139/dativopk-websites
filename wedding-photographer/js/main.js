import { SITE, SERVICES, PACKAGES, BUILDER, CATS, PHOTOS, STORIES, FILMS, TEAM, FAQ, QUOTES, CITIES, EVENT_TYPES, BUDGETS, SOURCES, PACKAGE_NAMES, img, rs, service } from "./data.js";

/* ---------- icons ---------- */
export const ICON = {
  arrow: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>`,
  left: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 8H3M7 4L3 8l4 4"/></svg>`,
  close: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>`,
  play: `<svg viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M0 0l12 7-12 7z"/></svg>`,
  tick: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 1.5l3 7.5 7.5 3-7.5 3-3 7.5-3-7.5L1.5 12 9 9z"/><rect x="7.2" y="7.2" width="9.6" height="9.6" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v7h4v-7h3l1-4h-4V8.6c0-.4.2-.6.6-.6z"/></svg>`,
  yt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8zM10 15.2V8.8l5.2 3.2z"/></svg>`,
  tt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.2c-1.5.1-2.8-.4-4-1.2v6.2c0 3.6-2.6 5.9-5.7 5.9-3.2 0-5.6-2.5-5.4-5.7.2-3 2.9-5.2 6.1-4.8v3.3c-1.3-.3-2.8.5-2.9 1.8-.1 1.2.9 2.2 2.1 2.2 1.3 0 2.3-.9 2.3-2.5V3z"/></svg>`,
  wa: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.2-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`,
};
export const waLink = (msg = `Assalam o Alaikum ${SITE.short} team! Mujhe apni shaadi ki photography ke liye date aur packages ke baare mein poochna hai.`) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const qs = (k) => new URLSearchParams(location.search).get(k);

/* ---------- Mughal arch shapes (SVG clip paths, objectBoundingBox units) ---------- */
const SPRING = 0.3;
const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]); };
const LEFT = [[0, SPRING], [0, SPRING * .45], [0.3, SPRING * .3], [0.5, 0]];
const RIGHT = [[0.5, 0], [0.7, SPRING * .3], [1, SPRING * .45], [1, SPRING]];
const f = (n) => +n.toFixed(4);
function archPath(cusp, s = 1) {
  const P = (x, y) => `${f(x * s)},${f(y * s)}`;
  if (!cusp) return `M${P(0, 1)}L${P(0, SPRING)}C${P(...LEFT[1])} ${P(...LEFT[2])} ${P(...LEFT[3])}C${P(...RIGHT[1])} ${P(...RIGHT[2])} ${P(...RIGHT[3])}L${P(1, 1)}Z`;
  const pts = [];
  [LEFT, RIGHT].forEach((c, ci) => { for (let i = ci ? 1 : 0; i <= 4; i++) pts.push(bez(...c, i / 4)); });
  let d = `M${P(0, 1)}L${P(...pts[0])}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy), k = 0.32;
    d += `Q${P((ax + bx) / 2 + dy / len * len * k, (ay + by) / 2 - dx / len * len * k)} ${P(bx, by)}`;
  }
  return d + `L${P(1, 1)}Z`;
}
function defs() {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("width", "0"); s.setAttribute("height", "0"); s.setAttribute("aria-hidden", "true");
  s.style.position = "absolute";
  s.innerHTML = `<defs><clipPath id="mehrab-clip" clipPathUnits="objectBoundingBox"><path d="${archPath(false)}"/></clipPath>
    <clipPath id="mehrab-cusp" clipPathUnits="objectBoundingBox"><path d="${archPath(true)}"/></clipPath></defs>`;
  document.body.prepend(s);
}
function frames() {
  document.querySelectorAll(".framed").forEach((el) => {
    if (el.querySelector(".frame-line")) return;
    const cusp = el.querySelector(".mehrab.cusp");
    el.insertAdjacentHTML("afterbegin", `<svg class="frame-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${archPath(!!cusp, 100)}"/></svg>`);
  });
}
// <div class="framed"><div class="mehrab"><img></div></div>
const arch = (name, alt = "", { cusp = false, lazy = true, cls = "" } = {}) => `<div class="framed ${cls}"><div class="mehrab${cusp ? " cusp" : ""}"><img src="${img(name)}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""}></div></div>`;

/* ---------- shell: header, menu, footer, WhatsApp ---------- */
const NAV = [["services.html", "Services"], ["packages.html", "Packages"], ["portfolio.html", "Portfolio"], ["stories.html", "Stories"], ["films.html", "Films"], ["about.html", "About"], ["contact.html", "Contact"]];
const page = document.body.dataset.page || "index";
const current = { story: "stories.html", index: "" }[page] ?? `${page}.html`;
const logo = () => `<span class="ur">${SITE.urdu}</span><span>${SITE.short}<small>Studio · ${SITE.city}</small></span>`;

function shell() {
  const head = document.createElement("header");
  head.className = "site-head";
  head.innerHTML = `<div class="wrap head-in">
      <a class="logo" href="index.html" aria-label="${SITE.name}, home">${logo()}</a>
      <nav class="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${h === current ? ' class="on" aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
      <a class="btn head-cta" href="contact.html">Check your date ${ICON.arrow}</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>
    </div>`;
  document.body.prepend(head);

  const menu = document.createElement("div");
  menu.className = "menu jaali";
  menu.setAttribute("aria-hidden", "true");
  menu.innerHTML = `<ol>${[["index.html", "Home"], ...NAV].map(([h, t]) => `<li><a href="${h}" tabindex="-1">${t}</a></li>`).join("")}</ol>
    <div class="menu-side">${arch("bride-red-rose", "Bride in red with a rose in her hair")}
      <p>${SITE.address}<br><a href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a> · <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a></p></div>`;
  head.after(menu);
  const burger = head.querySelector(".burger");
  const toggle = (open = !document.body.classList.contains("menu-open")) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", !open);
    menu.querySelectorAll("a").forEach((a) => (a.tabIndex = open ? 0 : -1));
  };
  burger.addEventListener("click", () => toggle());
  addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });

  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    head.classList.toggle("solid", y > 40);
    head.classList.toggle("hide", y > 500 && y > last && !document.body.classList.contains("menu-open"));
    last = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const foot = document.createElement("footer");
  foot.className = "site-foot jaali";
  foot.innerHTML = `<div class="wrap">
      <div class="foot-top">
        <div class="foot-brand"><a class="logo" href="index.html">${logo()}</a>
          <p>Wedding photography and films for Pakistani families, from Lahore to Karachi and everywhere in between. ${SITE.tagline}.</p>
          <a class="btn wa" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa} WhatsApp us</a></div>
        <div><h4>Shaadi coverage</h4><ul>${SERVICES.slice(0, 7).map((s) => `<li><a href="services.html#${s.slug}">${s.name}</a></li>`).join("")}</ul></div>
        <div><h4>Studio</h4><ul>${[["packages.html", "Packages & prices"], ["portfolio.html", "Portfolio"], ["stories.html", "Wedding stories"], ["films.html", "Films"], ["about.html", "About the team"], ["contact.html", "Book a date"]].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
        <div><h4>Visit</h4><ul>
          <li>${SITE.address}</li><li>${SITE.hours}</li>
          <li><a href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a></li><li><a href="mailto:${SITE.email}">${SITE.email}</a></li></ul></div>
      </div>
      <div class="foot-big" aria-hidden="true">${SITE.urdu}</div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ${SITE.name}, ${SITE.city}. Lahore · Islamabad · Karachi</span>
        <div class="socials"><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="#" aria-label="Facebook">${ICON.fb}</a><a href="#" aria-label="TikTok">${ICON.tt}</a><a href="#" aria-label="YouTube">${ICON.yt}</a></div>
      </div>
    </div>`;
  document.body.append(foot);

  const wa = document.createElement("a");
  wa.className = "wa-float"; wa.href = waLink(); wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("aria-label", "Chat on WhatsApp");
  wa.innerHTML = `${ICON.wa}<span>Date check karein</span>`;
  document.body.append(wa);
}

/* ---------- small reusable bits ---------- */
function seals() {
  document.querySelectorAll("[data-seal]").forEach((el, i) => {
    el.classList.add("seal");
    const text = el.dataset.seal || `Since ${SITE.since} ✦ 600+ shaadiyan ✦ Lahore · Karachi ✦ `;
    el.innerHTML = `<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="sp${i}" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0"/></defs><text><textPath href="#sp${i}" textLength="246" lengthAdjust="spacing">${esc(text)}</textPath></text></svg><span class="core"><span class="ur">${SITE.urdu}</span></span>`;
  });
}
function marquees() { document.querySelectorAll("[data-marquee] .marquee-track").forEach((t) => { t.innerHTML += t.innerHTML; }); }
function ornaments() { document.querySelectorAll(".orn").forEach((o) => { if (!o.innerHTML.trim()) o.innerHTML = ICON.star; }); }
function icons() { document.querySelectorAll("[data-icon]").forEach((el) => el.insertAdjacentHTML("beforeend", ICON[el.dataset.icon] || "")); }
function splitText() {
  document.querySelectorAll(".split").forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = part; w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.querySelectorAll(".w > span").forEach((s, i) => (s.style.transitionDelay = `${i * 0.06}s`));
  });
}
function reveal() {
  const els = document.querySelectorAll(".rv, .split, .reveal-img");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  els.forEach((e) => io.observe(e));
}
function parallax() {
  const items = [...document.querySelectorAll("[data-speed]")];
  if (!items.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  const run = () => {
    const vh = innerHeight;
    items.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * Number(el.dataset.speed)).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  run();
}

/* ---------- lightbox ---------- */
let lb, lbList = [], lbIndex = 0;
function lightbox() {
  lb = document.createElement("div");
  lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = `<span class="lb-count"></span><button class="x" aria-label="Close">${ICON.close}</button>
    <button class="lb-nav lb-prev" aria-label="Previous photo">${ICON.left}</button>
    <figure><img alt=""><figcaption><b></b><span></span></figcaption></figure>
    <button class="lb-nav lb-next" aria-label="Next photo">${ICON.arrow}</button>`;
  document.body.append(lb);
  const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
  lb.querySelector(".x").onclick = close;
  lb.querySelector(".lb-prev").onclick = () => showLb(lbIndex - 1);
  lb.querySelector(".lb-next").onclick = () => showLb(lbIndex + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") close(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });
  let sx = 0;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1)); });
}
function showLb(i) {
  lbIndex = (i + lbList.length) % lbList.length;
  const p = lbList[lbIndex];
  const im = lb.querySelector("img"); im.src = img(p.img); im.alt = p.title;
  lb.querySelector("b").textContent = p.title;
  lb.querySelector("figcaption span").textContent = p.place || "";
  lb.querySelector(".lb-count").textContent = `${String(lbIndex + 1).padStart(2, "0")} / ${String(lbList.length).padStart(2, "0")}`;
}
function openLb(list, i) { lbList = list; lb.classList.add("open"); document.body.style.overflow = "hidden"; showLb(i); lb.querySelector(".x").focus(); }
const shotHTML = (p, i, eager = false) => `<button class="shot rv" data-i="${i}" data-cat="${p.cat || ""}" aria-label="Open photo: ${esc(p.title)}">
  <img src="${img(p.img)}" alt="${esc(p.title)}" ${eager ? "" : 'loading="lazy"'}><figcaption><b>${esc(p.title)}</b><span>${esc(p.place || "")}</span></figcaption></button>`;
function bindShots(root, list) {
  root.addEventListener("click", (e) => {
    const s = e.target.closest(".shot"); if (!s) return;
    const vis = [...root.querySelectorAll(".shot:not(.hidden)")];
    openLb(vis.map((v) => list[v.dataset.i]), vis.indexOf(s));
  });
}

/* ---------- film player: a slideshow trailer made from the wedding's photos ---------- */
let pl, plTimer;
function player() {
  pl = document.createElement("div");
  pl.className = "player"; pl.setAttribute("role", "dialog"); pl.setAttribute("aria-modal", "true"); pl.setAttribute("aria-label", "Film preview");
  pl.innerHTML = `<button class="x" aria-label="Close">${ICON.close}</button><div><div class="screen"><div class="cap"><h3></h3><p></p></div><div class="bar"><i></i></div></div>
    <p class="note">Preview trailer. On the live site, the full film plays here from YouTube or Vimeo.</p></div>`;
  document.body.append(pl);
  const close = () => { pl.classList.remove("open"); clearInterval(plTimer); document.body.style.overflow = ""; };
  pl.querySelector(".x").onclick = close;
  pl.addEventListener("click", (e) => { if (e.target === pl) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && pl.classList.contains("open")) close(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-film]"); if (!t) return;
    e.preventDefault();
    const fm = FILMS.find((x) => x.slug === t.dataset.film) || FILMS[0];
    openFilm(fm);
  });
}
function openFilm(fm) {
  const screen = pl.querySelector(".screen");
  screen.querySelectorAll("img").forEach((i) => i.remove());
  fm.frames.forEach((n) => screen.insertAdjacentHTML("afterbegin", `<img src="${img(n)}" alt="">`));
  const imgs = [...screen.querySelectorAll("img")].reverse();
  pl.querySelector("h3").textContent = fm.title;
  pl.querySelector(".cap p").textContent = `${fm.kind} · ${fm.city} · ${fm.len}`;
  pl.classList.add("open"); document.body.style.overflow = "hidden";
  let i = 0, t0 = Date.now();
  const total = imgs.length * 4200, bar = pl.querySelector(".bar i");
  const show = () => { imgs.forEach((im, k) => im.classList.toggle("on", k === i)); };
  show();
  clearInterval(plTimer);
  plTimer = setInterval(() => {
    const el = (Date.now() - t0) % total;
    bar.style.width = (el / total * 100).toFixed(2) + "%";
    const n = Math.floor(el / 4200);
    if (n !== i) { i = n; show(); }
  }, 100);
  pl.querySelector(".x").focus();
}

/* ---------- home ---------- */
function homeQuotes() {
  const root = document.getElementById("quotes");
  if (!root) return;
  root.innerHTML = QUOTES.map((q, i) => `<figure class="quote${i ? "" : " on"}"><blockquote>${esc(q.q)}</blockquote><figcaption><b>${esc(q.who)}</b><span>${esc(q.what)}</span></figcaption></figure>`).join("");
  const dots = document.getElementById("q-dots");
  dots.innerHTML = QUOTES.map((_, i) => `<button aria-label="Show review ${i + 1}"${i ? "" : ' class="on"'}></button>`).join("");
  let i = 0, timer;
  const go = (n) => { i = (n + QUOTES.length) % QUOTES.length; root.querySelectorAll(".quote").forEach((q, k) => q.classList.toggle("on", k === i)); dots.querySelectorAll("button").forEach((d, k) => d.classList.toggle("on", k === i)); };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 6500); };
  dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; go([...dots.children].indexOf(b)); auto(); });
  auto();
}
function homeEvents() {
  const root = document.getElementById("events");
  if (!root) return;
  root.innerHTML = ["mehndi", "barat", "nikkah", "walima"].map((s, i) => {
    const v = service(s);
    return `<a class="ev rv rv-d${i}" href="services.html#${s}">${arch(v.img, v.name, { cusp: i % 2 === 1 })}
      <div class="over"><span class="ur">${v.urdu}</span><h3>${v.name}</h3><small>From ${rs(v.price)}</small></div></a>`;
  }).join("");
}
function packCards(id, cta = true) {
  const root = document.getElementById(id);
  if (!root) return;
  root.innerHTML = PACKAGES.map((p, i) => `<article class="pack rv rv-d${i}${p.featured ? " feat" : ""}">${p.featured ? '<span class="tag">Most booked</span>' : ""}
      <span class="ur">${p.urdu}</span><h3>${p.name}</h3><p class="for">${p.events} · ${esc(p.for)}</p>
      <div class="price">${rs(p.price)}<small>all-inclusive</small></div>
      <ul>${p.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      ${cta ? `<a class="btn${p.featured ? "" : " line"}" href="contact.html?pkg=${p.slug}">Book ${p.name} ${ICON.arrow}</a>` : ""}</article>`).join("");
}
function insta() {
  const root = document.getElementById("insta");
  if (!root) return;
  root.innerHTML = ["bride-jewels", "mehndi-marigold", "bride-red-rose", "groom-pagri", "bride-peach-veil", "couple-walk"].map((n) => `<a href="portfolio.html" aria-label="Open portfolio"><img src="${img(n)}" alt="" loading="lazy"></a>`).join("");
}

/* ---------- services ---------- */
function servicesPage() {
  const root = document.getElementById("svc-list");
  if (!root) return;
  document.getElementById("svc-nav").innerHTML = SERVICES.map((s) => `<a href="#${s.slug}">${s.name}</a>`).join("");
  root.innerHTML = SERVICES.map((s, i) => `<article class="svc" id="${s.slug}">
      <div class="svc-art rv">${arch(s.img, s.name, { cusp: i % 2 === 0 })}<div class="small"><img src="${img(s.alt)}" alt="" loading="lazy" data-speed="-0.05"></div></div>
      <div class="rv rv-d1"><span class="num">${String(i + 1).padStart(2, "0")} / ${String(SERVICES.length).padStart(2, "0")}</span>
        <h2>${s.name}</h2>${s.urdu ? `<div class="ur">${s.urdu}</div>` : ""}
        <p class="lead">${esc(s.line)}</p><p class="body">${esc(s.body)}</p>
        <ul class="ticks">${s.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="from"><span>Starting from</span><b>${rs(s.price)}</b><span>${s.unit}</span></div>
        <div class="btns"><a class="btn wine" href="contact.html?event=${s.slug}">Check availability ${ICON.arrow}</a>
          <a class="link" href="${waLink(`Assalam o Alaikum! ${s.name} coverage ke liye date aur price poochni thi.`)}" target="_blank" rel="noopener">Ask on WhatsApp ${ICON.arrow}</a></div></div>
    </article>`).join("");
  // highlight the chip of the section on screen
  const links = [...document.querySelectorAll("#svc-nav a")];
  const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  root.querySelectorAll(".svc").forEach((s) => io.observe(s));
}

/* ---------- packages + builder ---------- */
function packagesPage() {
  packCards("packs");
  const form = document.getElementById("builder");
  if (!form) return;
  form.querySelector("#b-events").innerHTML = BUILDER.events.map((e) => `<label class="opt"><input type="checkbox" name="ev" value="${e.slug}"${["barat", "walima"].includes(e.slug) ? " checked" : ""}><span><b>${e.name}</b><small>${rs(e.base)} with Essential team</small></span></label>`).join("");
  form.querySelector("#b-team").innerHTML = BUILDER.teams.map((t, i) => `<label class="opt"><input type="radio" name="team" value="${t.slug}"${i === 1 ? " checked" : ""}><span><b>${t.name}</b><small>${t.note}</small></span></label>`).join("");
  form.querySelector("#b-city").innerHTML = CITIES.map((c, i) => `<option value="${i}">${c.name}${c.travel ? ` (+ ${rs(c.travel)} travel)` : " (no travel charges)"}</option>`).join("");
  form.querySelector("#b-extras").innerHTML = BUILDER.extras.map((x) => `<label class="opt"><input type="checkbox" name="ex" value="${x.slug}"${x.slug === "film" ? " checked" : ""}><span><b>${x.name}</b><small>${rs(x.price)}${x.per ? " per event" : ""}</small></span></label>`).join("");
  document.getElementById("addons").innerHTML = [...BUILDER.extras.map((x) => [x.name + (x.per ? " (per event)" : ""), x.price]), ["Extra hour, full team", 12000], ["Raw files on a hard drive", 25000], ["Framed 20x30 print", 9500]]
    .map(([n, p]) => `<div><span>${esc(n)}</span><b>${rs(p)}</b></div>`).join("");

  const sum = document.getElementById("sum-list"), tot = document.getElementById("sum-total"), save = document.getElementById("sum-save");
  let state;
  const calc = () => {
    const fd = new FormData(form);
    const evs = BUILDER.events.filter((e) => fd.getAll("ev").includes(e.slug));
    const team = BUILDER.teams.find((t) => t.slug === fd.get("team"));
    const city = CITIES[Number(fd.get("city")) || 0];
    const exs = BUILDER.extras.filter((x) => fd.getAll("ex").includes(x.slug));
    const lines = evs.map((e) => [e.name, Math.round(e.base * team.mult / 1000) * 1000]);
    const evTotal = lines.reduce((s, l) => s + l[1], 0);
    const disc = evs.length >= 4 ? 0.12 : evs.length === 3 ? 0.08 : 0;
    const discount = Math.round(evTotal * disc / 1000) * 1000;
    exs.forEach((x) => lines.push([x.name + (x.per ? ` × ${evs.length || 1}` : ""), x.price * (x.per ? Math.max(1, evs.length) : 1)]));
    if (city.travel) lines.push([`Travel: ${city.name}`, city.travel]);
    const total = lines.reduce((s, l) => s + l[1], 0) - discount;
    state = { evs, team, city, exs, total, lines, discount };
    sum.innerHTML = evs.length ? lines.map(([n, p]) => `<li><span>${esc(n)}</span><b>${rs(p)}</b></li>`).join("") + (discount ? `<li><span>Bundle discount (${disc * 100}%)</span><b>− ${rs(discount)}</b></li>` : "") : `<li><span>Pick at least one event to see a price.</span></li>`;
    tot.textContent = rs(evs.length ? total : 0);
    save.textContent = evs.length < 3 && evs.length ? "Add a third event and save 8% on coverage." : discount ? `You save ${rs(discount)} with the bundle discount.` : "";
    document.getElementById("sum-team").textContent = `${team.name}: ${team.note}`;
  };
  form.addEventListener("change", calc); calc();
  document.getElementById("sum-wa").addEventListener("click", (e) => {
    e.preventDefault();
    if (!state.evs.length) return;
    const msg = `Assalam o Alaikum ${SITE.short}! Maine website pe apna package banaya hai:\n` +
      `Events: ${state.evs.map((x) => x.name).join(", ")}\nTeam: ${state.team.name} (${state.team.note})\nCity: ${state.city.name}\n` +
      (state.exs.length ? `Extras: ${state.exs.map((x) => x.name).join(", ")}\n` : "") + `Estimate: ${rs(state.total)}\n\nKya meri dates available hain?`;
    open(waLink(msg), "_blank", "noopener");
  });
  document.getElementById("sum-book").addEventListener("click", (e) => {
    e.preventDefault();
    if (!state.evs.length) return;
    const p = new URLSearchParams({ pkg: "custom", events: state.evs.map((x) => x.slug).join(","), city: state.city.name, est: state.total, extras: state.exs.map((x) => x.name).join(", ") });
    location.href = "contact.html?" + p;
  });
  const faq = document.getElementById("faq");
  if (faq) faq.innerHTML = FAQ.map(([q, a], i) => `<details${i ? "" : " open"}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
}

/* ---------- portfolio ---------- */
function portfolioPage() {
  const grid = document.getElementById("gallery"), filters = document.getElementById("filters");
  if (!grid) return;
  grid.innerHTML = PHOTOS.map((p, i) => shotHTML(p, i, i < 6)).join("");
  filters.innerHTML = `<button data-f="all" class="on">All<sup>${PHOTOS.length}</sup></button>` +
    CATS.map((c) => `<button data-f="${c.slug}">${c.name}<sup>${PHOTOS.filter((p) => p.cat === c.slug).length}</sup></button>`).join("");
  const apply = (fl) => {
    filters.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.f === fl));
    grid.querySelectorAll(".shot").forEach((s) => { s.classList.toggle("hidden", fl !== "all" && s.dataset.cat !== fl); s.classList.add("in"); });
  };
  filters.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; apply(b.dataset.f); history.replaceState(null, "", b.dataset.f === "all" ? "portfolio.html" : `portfolio.html?cat=${b.dataset.f}`); });
  const q = qs("cat");
  if (q && CATS.some((c) => c.slug === q)) apply(q);
  bindShots(grid, PHOTOS);
}

/* ---------- stories ---------- */
function storiesPage() {
  const root = document.getElementById("story-list");
  if (!root) return;
  root.innerHTML = STORIES.map((s, i) => `<a class="story-card" href="story.html?s=${s.slug}">
      <div class="pic rv">${arch(s.cover, s.couple, { cusp: i % 2 === 1, lazy: i > 0 })}</div>
      <div class="rv rv-d1"><span class="kicker">${esc(s.city)} · ${esc(s.date)}</span><h2>${esc(s.couple)}</h2>
        <div class="meta">${s.events.map((e) => `<span class="chip">${esc(e)}</span>`).join("")}<span class="chip">${esc(s.venue)}</span></div>
        <p class="lead">${esc(s.intro)}</p><span class="link">Read their story ${ICON.arrow}</span></div></a>`).join("");
}
function storyPage() {
  const root = document.getElementById("story");
  if (!root) return;
  const idx = Math.max(0, STORIES.findIndex((s) => s.slug === qs("s")));
  const s = STORIES[idx], next = STORIES[(idx + 1) % STORIES.length];
  const film = FILMS.find((x) => x.slug === s.slug);
  document.title = `${s.couple}: ${s.events.join(", ")} in ${s.city} | ${SITE.name}`;
  const gal = s.gallery.slice(1).map((g) => ({ img: g, title: s.couple, place: s.venue }));
  root.innerHTML = `
    <section class="night jaali page-hero" style="padding-bottom:70px"><div class="wrap">
      <div class="crumbs"><a href="index.html">Home</a><i></i><a href="stories.html">Stories</a><i></i><span>${esc(s.couple)}</span></div>
      <h1 class="h1 split" style="margin:26px 0 18px">${esc(s.couple)}</h1>
      <p class="lead rv">${esc(s.line)}</p>
      <div class="facts rv"><div><span>Events</span><b>${s.events.join(", ")}</b></div><div><span>City</span><b>${esc(s.city)}</b></div><div><span>Venue</span><b>${esc(s.venue)}</b></div><div><span>Date</span><b>${esc(s.date)}</b></div></div>
    </div></section>
    <div class="story-cover"><img src="${img(s.cover)}" alt="${esc(s.couple)}" data-speed="-0.1"></div>
    <section class="sec ivory"><div class="wrap story-body">
      <div class="rv"><span class="kicker">Their dastaan</span><p class="big" style="margin-top:20px">${esc(s.line)}</p></div>
      <div class="txt rv rv-d1"><p style="color:var(--ink);font-size:19px">${esc(s.intro)}</p>${s.story.map((p) => `<p>${esc(p)}</p>`).join("")}
        <blockquote>${esc(s.quote)}<cite>${esc(s.by)}</cite></blockquote></div>
    </div></section>
    <section class="ivory" style="padding-bottom:110px"><div class="wrap">
      <div class="story-gal" id="sg">${gal.map((g, i) => shotHTML(g, i)).join("")}</div>
      ${film ? `<a class="film-hero rv" href="#" data-film="${film.slug}" style="margin-top:40px"><img src="${img(film.poster)}" alt="" loading="lazy"><span class="play">${ICON.play}</span><div class="txt"><span class="kicker">${esc(film.kind)} · ${film.len}</span><h3>Watch ${esc(s.couple)}'s film</h3></div></a>` : ""}
      <div class="btns" style="margin-top:50px"><a class="btn wine" href="contact.html">Plan your shaadi with us ${ICON.arrow}</a><a class="link" href="stories.html">All stories ${ICON.arrow}</a></div>
    </div></section>
    <section class="night jaali"><a class="wrap next-story" href="story.html?s=${next.slug}"><div><span class="kicker">Next story</span><h2>${esc(next.couple)}</h2></div>${arch(next.cover, "")}</a></section>`;
  bindShots(root.querySelector("#sg"), gal);
}

/* ---------- films ---------- */
function filmsPage() {
  const root = document.getElementById("films");
  if (!root) return;
  root.innerHTML = FILMS.slice(1).map((fm, i) => `<button class="film rv rv-d${i % 3}" data-film="${fm.slug}" aria-label="Play ${esc(fm.title)} ${esc(fm.kind)}">
      <div class="pic"><img src="${img(fm.poster)}" alt="" loading="lazy"><span class="play">${ICON.play}</span><span class="len">${fm.len}</span></div>
      <h3>${esc(fm.title)}</h3><p>${esc(fm.kind)} · ${esc(fm.city)}</p></button>`).join("");
}

/* ---------- about ---------- */
function aboutPage() {
  const root = document.getElementById("team");
  if (!root) return;
  root.innerHTML = TEAM.map((t, i) => `<article class="member rv rv-d${i}">${arch(t.img, t.name, { cusp: i % 2 === 1 })}<h3>${esc(t.name)}</h3><b>${esc(t.role)}</b><p>${esc(t.note)}</p></article>`).join("");
}

/* ---------- contact / booking ---------- */
async function contactPage() {
  const form = document.getElementById("enquiry");
  if (!form) return;
  const { submitEnquiry, bookedDates } = await import("./store.js");
  const opt = (arr, first = "Choose one") => `<option value="">${first}</option>` + arr.map((o) => `<option>${esc(o)}</option>`).join("");
  form.querySelector("#types").innerHTML = EVENT_TYPES.map((t) => `<label><input type="checkbox" name="events" value="${t}"><span>${t}</span></label>`).join("");
  form.querySelector("#city").innerHTML = opt(CITIES.map((c) => c.name));
  form.querySelector("#package").innerHTML = opt(PACKAGE_NAMES);
  form.querySelector("#budget").innerHTML = opt(BUDGETS);
  form.querySelector("#source").innerHTML = opt(SOURCES);

  // prefill from links: ?event=barat, ?pkg=signature, or from the package builder
  const evMap = { mehndi: 0, barat: 1, nikkah: 2, walima: 3, bridal: 4, "pre-wedding": 5, engagement: 6, aqiqa: 7, corporate: 8 };
  const boxes = form.querySelectorAll("input[name=events]");
  const tick = (slug) => { if (slug in evMap) boxes[evMap[slug]].checked = true; };
  tick(qs("event"));
  (qs("events") || "").split(",").forEach(tick);
  const pkg = qs("pkg");
  if (pkg) {
    const p = { classic: "Classic", signature: "Signature", shahi: "Shahi", custom: "Custom" }[pkg];
    if (p) form.querySelector("#package").value = p;
    if (pkg === "classic") { tick("barat"); tick("walima"); }
    if (pkg === "signature") ["mehndi", "barat", "walima"].forEach(tick);
    if (pkg === "shahi") ["mehndi", "barat", "nikkah", "walima", "pre-wedding"].forEach(tick);
  }
  if (qs("city")) form.querySelector("#city").value = qs("city");
  if (qs("est")) form.querySelector("#message").value = `Package builder estimate: ${rs(qs("est"))}${qs("extras") ? `\nExtras: ${qs("extras")}` : ""}\n`;
  if (!form.querySelector("input[name=events]:checked")) boxes[1].checked = true;

  const date = form.querySelector("#date"), hint = form.querySelector("#date-hint");
  const d = new Date(); d.setDate(d.getDate() + 3);
  date.min = d.toISOString().slice(0, 10);
  let busy = [];
  bookedDates().then((b) => (busy = b));
  date.addEventListener("change", () => {
    const taken = busy.includes(date.value);
    hint.textContent = !date.value ? "" : taken ? "We already have a shaadi on this date. Send it anyway: our second team may be free." : "Alhamdulillah, this date is open.";
    hint.classList.toggle("warn", taken);
  });

  const read = () => {
    const fd = new FormData(form);
    const o = Object.fromEntries(fd);
    o.events = fd.getAll("events").join(", ");
    return o;
  };
  const summary = (o) => `Assalam o Alaikum ${SITE.short}! Main ${o.name || "..."} hoon.\nEvents: ${o.events || "-"}\nFirst event date: ${o.date || "not fixed yet"}\nCity: ${o.city || "-"}${o.venue ? `, ${o.venue}` : ""}\nGuests: ${o.guests || "-"}\nPackage: ${o.package || "-"}\nBudget: ${o.budget || "-"}${o.message ? `\n\n${o.message}` : ""}`;
  form.querySelector("#send-wa").addEventListener("click", () => open(waLink(summary(read())), "_blank", "noopener"));

  const err = form.querySelector(".form-err");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    const o = read();
    if (!o.name.trim() || o.phone.replace(/\D/g, "").length < 10) { err.textContent = "Please add your name and a phone or WhatsApp number we can reach you on."; return; }
    if (!o.events) { err.textContent = "Please pick at least one event."; return; }
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
    try {
      await submitEnquiry({ ...o, type: o.events });
      form.classList.add("sent");
      form.querySelector(".done-name").textContent = o.name.split(" ")[0];
      form.querySelector(".done-wa").href = waLink(`Assalam o Alaikum! Maine abhi website pe booking request bheji hai.\n\n${summary(o)}`);
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (x) { err.textContent = x.message; }
    btn.disabled = false;
  });
  form.querySelector(".again").addEventListener("click", () => { form.reset(); form.classList.remove("sent"); hint.textContent = ""; });
}

/* ---------- boot ---------- */
defs();
shell();
lightbox(); player();
homeEvents(); packCards("home-packs"); homeQuotes(); insta();
servicesPage(); packagesPage(); portfolioPage(); storiesPage(); storyPage(); filmsPage(); aboutPage(); contactPage();
frames(); seals(); marquees(); ornaments(); icons(); splitText();
reveal(); parallax();
document.querySelectorAll("[data-site]").forEach((el) => (el.textContent = SITE[el.dataset.site]));
document.querySelectorAll("[data-wa]").forEach((el) => { el.href = waLink(el.dataset.wa || undefined); el.target = "_blank"; el.rel = "noopener"; });
document.querySelectorAll("[data-rs]").forEach((el) => (el.textContent = rs(el.dataset.rs)));
