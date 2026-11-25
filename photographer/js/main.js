import { SITE, CATS, PHOTOS, PROJECTS, POSTS, SHOOT_TYPES, BUDGETS, SOURCES, img } from "./data.js";

/* ---------- icons ---------- */
export const ICON = {
  arrow: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>`,
  down: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 2v11M4 9l4 4 4-4"/></svg>`,
  up: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12L12 4M5 4h7v7"/></svg>`,
  left: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 8H3M7 4L3 8l4 4"/></svg>`,
  close: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>`,
  play: `<svg viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M0 0l12 7-12 7z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v7h4v-7h3l1-4h-4V8.6c0-.4.2-.6.6-.6z"/></svg>`,
  yt: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8zM10 15.2V8.8l5.2 3.2z"/></svg>`,
  aperture: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="50" cy="50" r="46"/><path d="M50 4l21 40M96 50L52 52M73 90L47 52M27 90l22-38M4 50l44-1M27 10l22 40"/></svg>`,
  tick: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>`,
};
const WA = `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.2-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;
export const waLink = (msg = `Assalam o Alaikum ${SITE.first}, I'd like to ask about a photoshoot.`) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const NAV = [
  ["about.html", "About"], ["portfolio.html", "Portfolio"], ["projects.html", "Projects"],
  ["services.html", "Services"], ["journal.html", "Journal"], ["contact.html", "Contact"],
];
const page = document.body.dataset.page || "index";
const current = { project: "projects.html", post: "journal.html", index: "" }[page] ?? `${page}.html`;

/* ---------- shell ---------- */
function shell() {
  const head = document.createElement("header");
  head.className = "site-head";
  head.innerHTML = `<div class="wrap head-in">
      <a class="logo" href="index.html" aria-label="${SITE.name}, home"><span class="star"></span>${SITE.first}</a>
      <nav class="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${h === current ? ' class="on" aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
      <a class="btn head-cta" href="contact.html">Book a shoot ${ICON.arrow}</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>
    </div>`;
  document.body.prepend(head);

  const menu = document.createElement("div");
  menu.className = "menu";
  menu.setAttribute("aria-hidden", "true");
  menu.innerHTML = `<ol>${[["index.html", "Home"], ...NAV].map(([h, t]) => `<li><a href="${h}" tabindex="-1">${t}</a></li>`).join("")}</ol>
    <div class="menu-side"><img src="${img("photog-yellow")}" alt="${SITE.name} holding her camera" loading="lazy">
      <p>${SITE.address}<br><a href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p></div>`;
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });

  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    head.classList.toggle("solid", y > 60);
    head.classList.toggle("hide", y > 400 && y > last && !document.body.classList.contains("menu-open"));
    last = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const foot = document.createElement("footer");
  foot.className = "site-foot dark";
  foot.innerHTML = `<div class="marquee on-dark" data-marquee><div class="marquee-track">${["Art Direction", "Wedding Stories", "Portraits", "Retouching", "Branding", "Product Shoots", "Editorial"].map((w) => `<span>${w}</span><span class="star"></span>`).join("")}</div></div>
    <div class="wrap">
      <div class="foot-grid">
        <div><h4><span class="star"></span>Studio</h4><div class="pills">
          ${[["about.html", "About"], ["portfolio.html", "Portfolio"], ["projects.html", "Projects"], ["journal.html", "Journal"]].map(([h, t]) => `<a class="pill${h === current ? " on" : ""}" href="${h}">${t}${h === "projects.html" ? ICON.up : ""}</a>`).join("")}</div></div>
        <div><h4><span class="star"></span>Discover</h4><div class="pills">
          ${CATS.map((c) => `<a class="pill" href="portfolio.html?cat=${c.slug}">${c.name}</a>`).join("")}<a class="pill" href="services.html">Pricing</a></div></div>
        <div><h4><span class="star"></span>Contact</h4><div class="pills">
          <a class="pill" href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a><a class="pill on" href="mailto:${SITE.email}">${SITE.email}${ICON.up}</a></div></div>
        <div><h4><span class="star"></span>Newsletter</h4>
          <form class="news" novalidate><label class="sr" for="nl" hidden>Email</label><input id="nl" type="email" placeholder="Put your e-mail" required><button type="submit">Subscribe ${ICON.up}</button></form>
          <p class="news-msg" role="status"></p></div>
      </div>
      <div class="foot-bottom">
        <a class="logo" href="index.html"><span class="star"></span>${SITE.first}</a>
        <span class="label">© ${new Date().getFullYear()} ${SITE.studio}, ${SITE.city}. All rights reserved</span>
        <div class="socials"><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="#" aria-label="Facebook">${ICON.fb}</a><a href="#" aria-label="YouTube">${ICON.yt}</a></div>
      </div>
    </div>`;
  document.body.append(foot);
  foot.querySelector(".news").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = e.target.querySelector("input"), msg = foot.querySelector(".news-msg");
    if (!/^\S+@\S+\.\S+$/.test(i.value)) { msg.textContent = "Please enter a valid email."; return; }
    msg.textContent = "Thank you. New work lands in your inbox once a month."; i.value = "";
  });

  const wa = document.createElement("a");
  wa.className = "wa-float"; wa.href = waLink(); wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("aria-label", "Chat on WhatsApp");
  wa.innerHTML = `${WA}<span>Chat on WhatsApp</span>`;
  document.body.append(wa);
}

/* ---------- reusable bits ---------- */
export const badgeSVG = (text = "Shoot for the moon ✦ shoot for the moon ✦ ") => `
  <svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="bp" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text><textPath href="#bp">${text}</textPath></text></svg>
  <span class="play">${ICON.play}</span>`;
function badges() { document.querySelectorAll("[data-badge]").forEach((b) => { b.classList.add("badge"); b.innerHTML = badgeSVG(); }); }
function marquees() { document.querySelectorAll("[data-marquee] .marquee-track").forEach((t) => { t.innerHTML += t.innerHTML; }); }
function apertures() { document.querySelectorAll("[data-aperture]").forEach((a) => { a.innerHTML = ICON.aperture; }); }
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
    el.querySelectorAll(".w > span").forEach((s, i) => (s.style.transitionDelay = `${i * 0.05}s`));
  });
}
function reveal() {
  const els = document.querySelectorAll(".rv, .split, .mask");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => io.observe(e));
}
function parallax() {
  const items = [...document.querySelectorAll("[data-speed]")];
  if (!items.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  const run = () => {
    const vh = innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.speed);
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
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
  lb.innerHTML = `<span class="lb-count"></span><button class="lb-btn lb-close" aria-label="Close">${ICON.close}</button>
    <button class="lb-btn lb-prev" aria-label="Previous photo">${ICON.left}</button>
    <figure><img alt=""><figcaption><b></b><span></span></figcaption></figure>
    <button class="lb-btn lb-next" aria-label="Next photo">${ICON.arrow}</button>`;
  document.body.append(lb);
  const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
  lb.querySelector(".lb-close").onclick = close;
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
function openLb(list, i) { lbList = list; lb.classList.add("open"); document.body.style.overflow = "hidden"; showLb(i); lb.querySelector(".lb-close").focus(); }
const shotHTML = (p, i, eager = false) => `<button class="shot rv" data-i="${i}" data-cat="${p.cat || ""}" aria-label="Open ${esc(p.title)}">
  <img src="${img(p.img)}" alt="${esc(p.title)}" ${eager ? "" : 'loading="lazy"'}><figcaption><b>${esc(p.title)}</b><span>${esc(p.place || "")}</span></figcaption></button>`;
function bindShots(root, list) { root.addEventListener("click", (e) => { const s = e.target.closest(".shot"); if (s) openLb(list.filter((_, i) => !root.querySelector(`.shot[data-i="${i}"]`)?.classList.contains("hidden")), visibleIndex(root, s)); }); }
function visibleIndex(root, s) { return [...root.querySelectorAll(".shot:not(.hidden)")].indexOf(s); }

/* ---------- home: project slider ---------- */
function slider() {
  const el = document.querySelector(".slider");
  if (!el) return;
  const slides = [...el.querySelectorAll(".slide")], dots = [...el.querySelectorAll(".slider-ctrl span")];
  let i = 0, timer;
  const go = (n) => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle("on", k === i)); dots.forEach((d, k) => d.classList.toggle("on", k === i)); };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); };
  dots.forEach((d, k) => d.addEventListener("click", () => { go(k); auto(); }));
  let sx = null;
  el.addEventListener("pointerdown", (e) => { if (e.target.closest("a")) return; sx = e.clientX; el.classList.add("dragging"); });
  addEventListener("pointerup", (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; el.classList.remove("dragging"); if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); auto(); } });
  const dot = el.querySelector(".drag-dot");
  if (dot && matchMedia("(pointer:fine)").matches) {
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); dot.style.left = e.clientX - r.left - 46 + "px"; dot.style.top = e.clientY - r.top - 46 + "px"; });
  }
  go(0); auto();
}

/* ---------- page renderers ---------- */
function portfolioPage() {
  const grid = document.getElementById("gallery"), filters = document.getElementById("filters");
  if (!grid) return;
  grid.innerHTML = PHOTOS.map((p, i) => shotHTML(p, i, i < 6)).join("");
  filters.innerHTML = `<button data-f="all" class="on">All<sup>${PHOTOS.length}</sup></button>` +
    CATS.map((c) => `<button data-f="${c.slug}">${c.name}<sup>${PHOTOS.filter((p) => p.cat === c.slug).length}</sup></button>`).join("");
  const apply = (f) => {
    filters.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
    grid.querySelectorAll(".shot").forEach((s) => { s.classList.toggle("hidden", f !== "all" && s.dataset.cat !== f); s.classList.add("in"); });
  };
  filters.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; apply(b.dataset.f); history.replaceState(null, "", b.dataset.f === "all" ? "portfolio.html" : `portfolio.html?cat=${b.dataset.f}`); });
  const q = new URLSearchParams(location.search).get("cat");
  if (q && CATS.some((c) => c.slug === q)) apply(q);
  bindShots(grid, PHOTOS);
}

function projectsPage() {
  const list = document.getElementById("proj-list");
  if (!list) return;
  list.innerHTML = PROJECTS.map((p, i) => `<a class="proj-row rv" href="project.html?p=${p.slug}">
      <span class="num">${String(i + 1).padStart(2, "0")}</span>
      <div><h2>${esc(p.title)}</h2><span class="label">${esc(p.kicker)} · ${esc(p.date)}</span></div>
      <p>${esc(p.intro)}</p>
      <div class="thumb"><img src="${img(p.cover)}" alt="${esc(p.title)}" loading="lazy"></div></a>`).join("");
}

function projectPage() {
  const root = document.getElementById("project");
  if (!root) return;
  const slug = new URLSearchParams(location.search).get("p");
  const idx = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug));
  const p = PROJECTS[idx], next = PROJECTS[(idx + 1) % PROJECTS.length];
  document.title = `${p.title} | ${SITE.studio}`;
  const gal = p.gallery.filter((g, i) => i || g !== p.cover).map((g) => ({ img: g, title: p.title, place: p.place }));
  root.innerHTML = `
    <section class="green proj-head"><div class="wrap">
      <div class="crumbs"><a href="index.html">Home</a><span class="star"></span><a href="projects.html">Projects</a><span class="star"></span><span>${esc(p.title)}</span></div>
      <span class="kicker">${esc(p.kicker)}</span>
      <h1 class="split" style="font-size:clamp(48px,7.4vw,108px);margin-top:20px;max-width:12ch">${esc(p.title)}</h1>
      <div class="proj-meta rv"><div><span>Client</span><b>${esc(p.client)}</b></div><div><span>Date</span><b>${esc(p.date)}</b></div><div><span>Location</span><b>${esc(p.place)}</b></div><div><span>Photos</span><b>${p.gallery.length} selected</b></div></div>
    </div></section>
    <div class="proj-cover"><img src="${img(p.cover)}" alt="${esc(p.title)}" data-speed="-0.12"></div>
    <section class="sec paper"><div class="wrap proj-body">
      <div class="rv"><span class="kicker">The story</span><p class="big" style="margin-top:18px">${esc(p.line)}</p></div>
      <div class="rv rv-d1"><p class="lead" style="max-width:none;color:var(--ink);font-size:18px">${esc(p.intro)}</p>
        <div class="story" style="margin-top:20px">${p.story.map((s) => `<p>${esc(s)}</p>`).join("")}</div>
        <blockquote class="proj-quote">${esc(p.quote)}</blockquote></div>
    </div></section>
    <section class="paper" style="padding-bottom:110px"><div class="wrap"><div class="proj-gallery" id="pg">${gal.map((g, i) => shotHTML(g, i)).join("")}</div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:50px"><a class="btn" href="contact.html?type=${encodeURIComponent(p.cat)}">Book a similar shoot ${ICON.arrow}</a><a class="btn ink" href="projects.html">All projects ${ICON.arrow}</a></div></div></section>
    <section class="green"><a class="wrap next-proj" href="project.html?p=${next.slug}"><div><span class="kicker">Next project</span><h2>${esc(next.title)}</h2></div><div class="arch"><img src="${img(next.cover)}" alt="" loading="lazy"></div></a></section>`;
  bindShots(root.querySelector("#pg"), gal);
}

function journalPage() {
  const root = document.getElementById("journal");
  if (!root) return;
  const [f, ...rest] = POSTS;
  const meta = (p) => `<div class="post-meta"><b>${esc(p.tag)}</b><span>${esc(p.date)}</span><span>${esc(p.read)} read</span></div>`;
  root.innerHTML = `<a class="post-feat rv" href="post.html?p=${f.slug}"><div class="img"><img src="${img(f.img)}" alt="" ></div>
      <div><span class="kicker">Latest story</span><h2>${esc(f.title)}</h2><p class="lead">${esc(f.excerpt)}</p>${meta(f)}<span class="link" style="margin-top:28px">Read the story ${ICON.arrow}</span></div></a>
    <div class="post-grid">${rest.map((p, i) => `<a class="post-card rv rv-d${i % 2}" href="post.html?p=${p.slug}"><div class="img"><img src="${img(p.img)}" alt="" loading="lazy"></div>
      <span class="kicker">${esc(p.tag)}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p>${meta(p)}</a>`).join("")}</div>`;
}

function postPage() {
  const root = document.getElementById("post");
  if (!root) return;
  const slug = new URLSearchParams(location.search).get("p");
  const idx = Math.max(0, POSTS.findIndex((p) => p.slug === slug));
  const p = POSTS[idx], next = POSTS[(idx + 1) % POSTS.length];
  document.title = `${p.title} | Journal | ${SITE.studio}`;
  root.innerHTML = `
    <section class="green page-hero"><div class="wrap" style="padding-bottom:70px">
      <div class="crumbs"><a href="index.html">Home</a><span class="star"></span><a href="journal.html">Journal</a><span class="star"></span><span>${esc(p.tag)}</span></div>
      <h1 class="split" style="font-size:clamp(40px,5.6vw,80px);max-width:16ch">${esc(p.title)}</h1>
      <div class="post-meta" style="color:rgba(243,237,223,.7)"><b>${esc(p.tag)}</b><span>${esc(p.date)}</span><span>${esc(p.read)} read</span><span>By ${SITE.name}</span></div>
    </div></section>
    <section class="paper" style="padding-bottom:110px"><div class="article-cover"><img src="${img(p.img)}" alt="" data-speed="-0.08"></div>
      <article class="wrap article">${p.body.map((b) => `<p class="rv">${esc(b)}</p>`).join("")}
        <div style="margin-top:50px;padding-top:30px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center">
          <a class="btn" href="contact.html">Book a session ${ICON.arrow}</a><a class="link" href="post.html?p=${next.slug}">Next: ${esc(next.title)} ${ICON.arrow}</a></div>
      </article></section>`;
}

async function contactPage() {
  const form = document.getElementById("enquiry");
  if (!form) return;
  const { submitEnquiry, bookedDates } = await import("./store.js");
  const sel = (id, opts) => { form.querySelector(id).innerHTML = `<option value="">Choose one</option>` + opts.map((o) => `<option>${o}</option>`).join(""); };
  form.querySelector("#types").innerHTML = SHOOT_TYPES.map((t, i) => `<label><input type="radio" name="type" value="${t}"${i === 0 ? " checked" : ""}><span>${t}</span></label>`).join("");
  sel("#budget", BUDGETS); sel("#source", SOURCES);
  const typeQ = new URLSearchParams(location.search).get("type");
  const map = { portrait: 0, wedding: 1, fashion: 3, commercial: 4 };
  if (typeQ in map) form.querySelectorAll("input[name=type]")[map[typeQ]].checked = true;
  const date = form.querySelector("#date"), hint = form.querySelector("#date-hint");
  const d = new Date(); d.setDate(d.getDate() + 2);
  date.min = d.toISOString().slice(0, 10);
  let busy = [];
  bookedDates().then((b) => (busy = b));
  date.addEventListener("change", () => {
    const taken = busy.includes(date.value);
    hint.textContent = !date.value ? "" : taken ? "We already have a shoot that day. Send the enquiry anyway and we will try to fit you in." : "Good news, this date is open.";
    hint.classList.toggle("warn", taken);
  });
  const err = form.querySelector(".form-err");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    const fd = Object.fromEntries(new FormData(form));
    if (!fd.name.trim() || fd.phone.replace(/\D/g, "").length < 10) { err.textContent = "Please add your name and a phone number we can reach you on."; return; }
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
    try {
      await submitEnquiry(fd);
      form.classList.add("sent");
      form.querySelector(".done-name").textContent = fd.name.split(" ")[0];
      form.querySelector(".done-wa").href = waLink(`Hi ${SITE.first}, I just sent an enquiry for a ${fd.type}${fd.date ? " on " + fd.date : ""}. My name is ${fd.name}.`);
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (x) { err.textContent = x.message; }
    btn.disabled = false;
  });
  form.querySelector(".again").addEventListener("click", () => { form.reset(); form.classList.remove("sent"); hint.textContent = ""; });
}

/* ---------- boot ---------- */
shell();
lightbox();
portfolioPage(); projectsPage(); projectPage(); journalPage(); postPage(); contactPage();
badges(); marquees(); apertures(); icons(); splitText();
slider(); reveal(); parallax();
document.querySelectorAll("[data-site]").forEach((el) => (el.textContent = SITE[el.dataset.site]));
document.querySelectorAll("[data-wa]").forEach((el) => (el.href = waLink(el.dataset.wa || undefined)));
