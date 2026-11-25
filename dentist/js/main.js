import { CLINIC, TREATMENTS, DOCTORS, REVIEWS, TIMES, STATS, WHY, OFFER, FAQ, FAQ_GROUPS, BLOG, RESULTS, pkr, waLink } from "./data.js";
import { submitBooking, bookedSlots } from "./store.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const page = document.body.dataset.page;
const tel = () => "tel:" + CLINIC.phone.replace(/\s/g, "");
document.documentElement.classList.add("js");

export const WA_SVG = `<svg class="wa-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>`;
const ICON = {
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`,
  cal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M9 9c0-1 1-2 3-2s3 1 3 2c0 2-1 3-1 6h-4c0-3-1-4-1-6Z"/></svg>`,
  smile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>`,
};
const LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 9c-6 0-9 5-9 11 0 8 4 11 5 18 .6 4 2 7 4.5 7S18 41 19 37c.8-3 2-5 5-5s4.2 2 5 5c1 4 1.5 8 3.5 8s3.9-3 4.5-7c1-7 5-10 5-18 0-6-3-11-9-11-4 0-6 2-9 2s-5-2-9-2Z" fill="#fff" stroke="#0d6b65" stroke-width="2.2"/><path d="M14 22c3 4 7 6 10 6s7-2 10-6" fill="none" stroke="#f2b544" stroke-width="2.6" stroke-linecap="round"/></svg>`;

/* ---------- open / closed today ---------- */
function todayStatus() {
  const now = new Date(), d = now.getDay();
  const row = d === 0 ? 2 : d === 6 ? 1 : 0;
  return { row };
}

/* ---------- shared chrome ---------- */
function chrome() {
  const links = [["index.html", "Home", "home"], ["clinic.html", "About Us", "clinic"], ["treatments.html", "Services", "treatments treatment"], ["new-patients.html", "New Patients", "newpatients"], ["results.html", "Results", "results"], ["reviews.html", "Reviews", "reviews"], ["faqs.html", "FAQs", "faqs"], ["blog.html", "Blog", "blog post"], ["book.html", "Contact", "book"]];
  const nav = links.map(([h, t, p]) => `<a href="${h}"${p.split(" ").includes(page) ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  $("#site-top").innerHTML = `
  <div class="util"><div class="wrap">
    <span>Family &amp; cosmetic dentistry in Gulberg, Lahore <span class="hide-sm">· Mon to Sat, from 10:00</span></span>
    <span class="soc hide-sm">Follow us <a href="#" aria-label="Facebook">${ICON.fb}</a><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_SVG}</a></span>
  </div></div>
  <header class="site-head"><div class="wrap head-main">
    <a class="logo" href="index.html" aria-label="${esc(CLINIC.name)} home">${LOGO}<span><b>${esc(CLINIC.short)} Dental</b><small>Studio</small></span></a>
    <div class="head-info">
      <a class="hi mail" href="mailto:${CLINIC.email}"><i>${ICON.mail}</i><span>Email address<b>${esc(CLINIC.email)}</b></span></a>
      <a class="hi" href="${tel()}"><i>${ICON.phone}</i><span>Call now<b>${esc(CLINIC.phone)}</b></span></a>
      <a class="btn" href="book.html">Book Appointment <span class="arr">→</span></a>
    </div>
    <button class="menu-btn" aria-expanded="false" aria-controls="mnav">Menu</button>
  </div>
  <nav class="mobile-nav" id="mnav" aria-label="Mobile">${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}<a class="btn" href="book.html">Book Appointment</a></nav>
  </header>
  <div class="navbar"><div class="wrap"><nav class="nav" aria-label="Main">${nav}</nav></div></div>`;
  const mb = $(".menu-btn"), mn = $("#mnav");
  mb.addEventListener("click", () => { const o = mn.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.textContent = o ? "Close" : "Menu"; });
  mn.addEventListener("click", e => { if (e.target.closest("a")) { mn.classList.remove("open"); mb.textContent = "Menu"; } });

  $("#site-foot").innerHTML = `
  <footer class="foot">
    <div class="wrap foot-grid">
      <div><a class="logo" href="index.html">${LOGO}<span><b>${esc(CLINIC.short)} Dental</b><small>Studio</small></span></a><p style="margin-top:14px">Gentle family and cosmetic dentistry in Gulberg, with honest prices and same-day help when you are in pain.</p></div>
      <div><h4>Quick links</h4><a href="index.html">Home</a><a href="clinic.html">About us</a><a href="treatments.html">Our services</a><a href="new-patients.html">New patients</a><a href="results.html">Before &amp; after</a><a href="reviews.html">Reviews</a><a href="faqs.html">FAQs</a><a href="blog.html">Blog</a><a href="book.html">Contact</a></div>
      <div><h4>Our services</h4>${TREATMENTS.map(t => `<a href="treatment.html?t=${t.slug}">${esc(t.name)}</a>`).join("")}</div>
      <div><h4>Contact info</h4><p>Phone: <a style="display:inline;color:var(--ink);font-weight:600" href="${tel()}">${esc(CLINIC.phone)}</a><br>Email: <b>${esc(CLINIC.email)}</b><br>Address: <b>${esc(CLINIC.address)}</b></p><h4 style="margin-top:18px">Office hours</h4><p>${CLINIC.hours.map(h => `${esc(h[0])}: ${esc(h[1])}`).join("<br>")}</p></div>
    </div>
    <div class="foot-bar"><div class="wrap"><span>© ${new Date().getFullYear()} ${esc(CLINIC.name)}. All rights reserved.</span><span>PMDC registered practitioners</span></div></div>
  </footer>
  <a class="wa-float" href="${waLink(`Assalam o Alaikum, I'd like to ask about an appointment at ${CLINIC.name}.`)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_SVG}<span>WhatsApp us</span></a>`;

  $$("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa || ""); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-tel]").forEach(a => { a.href = tel(); if (!a.textContent.trim()) a.textContent = CLINIC.phone; });
  $$("[data-clinic]").forEach(el => {
    const k = el.dataset.clinic; el.textContent = CLINIC[k];
    if (k === "phone" && el.tagName === "A") el.href = tel();
    if (k === "email" && el.tagName === "A") el.href = "mailto:" + CLINIC.email;
  });
  $$("[data-icon]").forEach(el => { el.innerHTML = ICON[el.dataset.icon] || ""; });
}

/* ---------- reveal on scroll ---------- */
function reveal() {
  const els = $$(".rv");
  if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
  els.forEach(e => { if (e.getBoundingClientRect().top < innerHeight) e.classList.add("in"); else io.observe(e); });
}

/* ---------- shared pieces ---------- */
const feeRows = () => TREATMENTS.map(t => `<tr><td><a href="treatment.html?t=${t.slug}">${esc(t.name)}</a></td><td class="dur">${esc(t.visits)}</td><td class="num">${pkr(t.from)}</td></tr>`).join("");
const member = d => `<div class="member"><span class="ini">${esc(d.initials)}</span><div><b>${esc(d.name)}</b><small>${esc(d.role)} | ${esc(d.focus)}</small></div></div>`;
function hoursTable() {
  const st = todayStatus();
  return `<table class="hours"><tbody>${CLINIC.hours.map((h, i) => `<tr${i === st.row ? ' class="today"' : ""}><td>${esc(h[0])}</td><td>${esc(h[1])}</td></tr>`).join("")}</tbody></table>`;
}

function reviewsCarousel(root) {
  const track = $(".rv-track", root), dots = $(".dots", root);
  track.innerHTML = REVIEWS.map(r => `<article class="rv-card"><div class="stars" aria-label="5 stars">★★★★★</div><p>“${esc(r.q)}”</p><footer><span class="av">${esc(r.who[0])}</span><span><b>${esc(r.who)}</b><small>${esc(r.what)}</small></span><span class="g" aria-hidden="true">G</span></footer></article>`).join("");
  dots.innerHTML = REVIEWS.map((_, i) => `<button aria-label="Review ${i + 1}"></button>`).join("");
  const cards = $$(".rv-card", track), n = cards.length;
  let i = 0, timer;
  const show = () => {
    cards.forEach((c, k) => {
      let d = (k - i + n) % n; if (d > n / 2) d -= n;
      c.className = "rv-card" + (Math.abs(d) <= 2 ? ` pos-${d}` : "");
      c.setAttribute("aria-hidden", d !== 0);
    });
    $$("button", dots).forEach((b, k) => b.classList.toggle("on", k === i));
  };
  const go = (k) => { i = (k + n) % n; show(); clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); };
  $("[data-prev]", root).onclick = () => go(i - 1);
  $("[data-next]", root).onclick = () => go(i + 1);
  $$("button", dots).forEach((b, k) => b.onclick = () => go(k));
  go(0);
}

function beforeAfter() {
  $$(".ba").forEach(ba => {
    const r = $("input", ba);
    const set = () => ba.style.setProperty("--x", r.value + "%");
    r.addEventListener("input", set); set();
  });
}

/* ---------- shared fillers ---------- */
const fill = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; return el; };
const postCard = b => `<a class="post rv" href="post.html?p=${b.slug}"><div class="ph"><img src="${b.img}" alt=""></div><div class="bd"><div class="meta"><span class="tag">${esc(b.tag)}</span><span>${esc(b.date)}</span></div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p><span class="rm">Read more →</span></div></a>`;
const baCard = r => `<div class="ba-wrap rv"><div class="ba"><img src="${r.before}" alt="Before: ${esc(r.title)}"><img class="after" src="${r.after}" alt="After: ${esc(r.title)}"><span class="handle"></span><input type="range" min="0" max="100" value="50" aria-label="Compare before and after: ${esc(r.title)}"></div><div class="ba-cap"><span>Before</span><span>After</span></div><p class="small muted"><b style="color:var(--teal-ink)">${esc(r.title)}.</b> ${esc(r.note)}</p></div>`;
const reviewCard = r => `<article class="rv-static rv"><div class="stars" aria-label="5 stars">★★★★★</div><p>“${esc(r.q)}”</p><footer><span class="av">${esc(r.who[0])}</span><span><b>${esc(r.who)}</b><small>${esc(r.what)}</small></span><span class="g" aria-hidden="true">G</span></footer></article>`;
const incGrid = () => OFFER.items.map(([b, s]) => `<div class="inc"><div><b>${esc(b)}</b><span>${esc(s)}</span></div></div>`).join("") + `<div class="inc wide"><div><b>Who it is for</b><span>${esc(OFFER.who)}</span></div></div>`;
const faqList = (list, openLast) => list.map((f, i) => `<details${(openLast ? i === list.length - 1 : i === 0) ? " open" : ""}><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");

/* ---------- pages ---------- */
const pages = {
  home() {
    fill("#stats", STATS.map(([n, s, l]) => `<div class="s"><b>${n}<sup>${s}</sup></b><span>${l}</span></div>`).join(""));
    reviewsCarousel($("#reviews"));
    fill("#svc-grid", TREATMENTS.map(t => `<a class="svc rv" href="treatment.html?t=${t.slug}"><img src="${t.img}" alt=""><h3>${esc(t.name)}</h3><p>${esc(t.line)}</p><span class="more">Learn more →</span></a>`).join(""));
    fill("#team", DOCTORS.map(member).join(""));
    fill("#why-list", WHY.map(w => `<li>${esc(w)}</li>`).join(""));
    fill("#inc-grid", incGrid());
    fill("#ba-grid", RESULTS.map(baCard).join(""));
    fill("#blog-list", BLOG.map(postCard).join(""));
    beforeAfter();
    const frame = $("#hero-3d");
    if (frame) import("./hero3d.js").then(m => m.mount(frame)).catch(() => {});
  },

  newpatients() {
    fill("#inc-grid", incGrid());
    fill("#np-faq", faqList(FAQ_GROUPS[0][1].concat(FAQ_GROUPS[2][1].slice(0, 2))));
  },

  results() {
    fill("#ba-grid", RESULTS.map(baCard).join(""));
    beforeAfter();
    fill("#res-reviews", REVIEWS.slice(0, 3).map(reviewCard).join(""));
  },

  reviews() {
    fill("#stats", STATS.map(([n, s, l]) => `<div class="s"><b>${n}<sup>${s}</sup></b><span>${l}</span></div>`).join(""));
    fill("#review-grid", REVIEWS.map(reviewCard).join(""));
  },

  faqs() {
    fill("#faq-groups", FAQ_GROUPS.map(([g, list]) => `<section class="faq-group rv"><h2>${esc(g)}</h2><div class="faq">${faqList(list)}</div></section>`).join(""));
  },

  blog() { fill("#blog-list", BLOG.map(postCard).join("")); },

  post() {
    const slug = new URLSearchParams(location.search).get("p");
    const b = BLOG.find(x => x.slug === slug) || BLOG[0];
    const t = TREATMENTS.find(x => x.slug === b.link);
    document.title = `${b.title} | ${CLINIC.name}`;
    fill("#post", `
      <section class="page-head"><div class="wrap td-hero">
        <div><div class="crumbs"><a href="blog.html">Blog</a> / ${esc(b.tag)}</div><h1 style="margin:10px 0 14px;font-size:clamp(34px,4.4vw,54px)">${esc(b.title)}</h1><p class="lede">${esc(b.text)}</p><p class="small muted">${esc(b.date)} · ${esc(b.read)} · By ${esc(DOCTORS[0].name)}</p></div>
        <div class="t-img"><img src="${b.img}" alt=""></div>
      </div></section>
      <section class="sec"><div class="wrap article-grid">
        <article class="article">${b.body.map(([h, p]) => `${h ? `<h2>${esc(h)}</h2>` : ""}<p>${esc(p)}</p>`).join("")}</article>
        <aside>
          ${t ? `<div class="aside-card"><span class="eyebrow">Related service</span><h3 style="margin:6px 0 8px">${esc(t.name)}</h3><p class="small muted">${esc(t.line)}</p><a class="btn sm" href="treatment.html?t=${t.slug}">Learn more →</a></div>` : ""}
          <div class="aside-card"><h3>Have a question?</h3><p class="small muted">Ask our dentists on WhatsApp. We usually reply within the hour.</p><a class="btn teal sm" href="${waLink(`Hi, I read "${b.title}" and have a question.`)}" target="_blank" rel="noopener">${WA_SVG} Ask on WhatsApp</a></div>
        </aside>
      </div></section>
      <section class="sec tight"><div class="wrap"><div class="sec-head center"><span class="eyebrow">Keep reading</span><h2>More <em>dental tips</em></h2></div><div class="blog">${BLOG.filter(x => x !== b).map(postCard).join("")}</div></div></section>`);
  },

  treatments() {
    $("#t-rows").innerHTML = TREATMENTS.map((t, i) => `
      <article class="t-row rv" id="${t.slug}">
        <div class="t-img"><img src="${t.img}" alt="Illustration for ${esc(t.name)}" loading="lazy"></div>
        <div>
          <span class="num">Service ${String(i + 1).padStart(2, "0")}</span>
          <h2>${esc(t.name)}</h2>
          <div class="meta"><div>From<b>${pkr(t.from)}</b></div><div>Time<b>${esc(t.duration)}</b></div><div>Visits<b>${esc(t.visits)}</b></div></div>
          <p class="lede">${esc(t.intro)}</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px"><a class="btn teal sm" href="treatment.html?t=${t.slug}">Learn more</a><a class="btn sm" href="book.html?t=${t.slug}">Book now</a></div>
        </div>
      </article>`).join("");
    $("#fee-rows").innerHTML = feeRows();
  },

  treatment() {
    const slug = new URLSearchParams(location.search).get("t");
    const idx = Math.max(0, TREATMENTS.findIndex(x => x.slug === slug));
    const t = TREATMENTS[idx], nx = TREATMENTS[(idx + 1) % TREATMENTS.length];
    document.title = `${t.name} | ${CLINIC.name}`;
    $("#td").innerHTML = `
      <section class="page-head"><div class="wrap td-hero">
        <div>
          <div class="crumbs"><a href="treatments.html">Services</a> / ${esc(t.name)}</div>
          <h1 style="margin:10px 0 16px">${esc(t.name)}</h1>
          <p class="lede">${esc(t.line)}</p>
          <div class="facts"><div><span>Starting from</span><b>${pkr(t.from)}</b></div><div><span>Time</span><b>${esc(t.duration)}</b></div><div><span>Visits</span><b>${esc(t.visits)}</b></div></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:24px">
            <a class="btn" href="book.html?t=${t.slug}">Book this treatment <span class="arr">→</span></a>
            <a class="btn outline" href="${waLink(`Hi, I'd like to ask about ${t.name}.`)}" target="_blank" rel="noopener">${WA_SVG} Ask on WhatsApp</a>
          </div>
        </div>
        <div class="t-img"><img src="${t.img}" alt="Illustration for ${esc(t.name)}"></div>
      </div></section>
      <section class="sec"><div class="wrap two-col">
        <div><span class="eyebrow">What it is</span><h2 style="margin-top:6px">About <em>${esc(t.name.toLowerCase())}</em></h2></div>
        <div><p class="lede" style="font-size:18px;color:var(--ink)">${esc(t.intro)}</p></div>
      </div></section>
      <section class="sec tight"><div class="wrap"><div class="panel mint two-col">
        <div><span class="eyebrow">Who it is for</span><h3 style="margin:6px 0 16px">Is this right for you?</h3><ul class="checks">${t.forWho.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div><span class="eyebrow">How it works</span><h3 style="margin:6px 0 16px">Step by step</h3><ol class="steps">${t.steps.map(s => `<li><div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div></li>`).join("")}</ol></div>
      </div></div></section>
      <section class="sec tight"><div class="wrap"><div class="panel sand faq-grid">
        <div><span class="eyebrow">FAQs</span><h2 style="margin-top:6px">Got questions? <em>We have answers</em></h2></div>
        <div class="faq">${t.faq.map((f, i) => `<details${i ? "" : " open"}><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("")}</div>
      </div>
      <a class="next-t" href="treatment.html?t=${nx.slug}"><span><span class="label">Next service</span><br><b>${esc(nx.name)}</b></span><span style="font-size:28px">→</span></a></div></section>`;
  },

  clinic() {
    $("#doc-rows").innerHTML = DOCTORS.map(d => `
      <article class="doc-row rv">
        ${member(d)}
        <div><h3 style="font-size:26px;margin-bottom:4px">${esc(d.name)}</h3><div class="muted" style="margin-bottom:16px">${esc(d.role)}</div><p class="note">“${esc(d.note)}”</p></div>
        <dl><dt>Focus</dt><dd>${esc(d.focus)}</dd><dt>Training</dt><dd>${esc(d.creds)}</dd><dt>Practising</dt><dd>${d.years} years</dd><dt>Book</dt><dd><a class="link" href="book.html?d=${d.slug}">With ${esc(d.name.split(" ").slice(0, 2).join(" "))} →</a></dd></dl>
      </article>`).join("");
  },

  book() { bookingForm(); },
};

/* ---------- home quick booking form ---------- */
function quickForm() {
  const f = $("#quick-form"); if (!f) return;
  $("#q-service").innerHTML = `<option value="">Select service</option>` + TREATMENTS.map(t => `<option>${esc(t.name)}</option>`).join("") + `<option>Tooth pain / emergency</option><option>New patient special</option>`;
  $("#q-time").innerHTML = TIMES.map(t => `<option>${t}</option>`).join("");
  const d = new Date(); d.setDate(d.getDate() + (d.getDay() === 6 ? 2 : 1));
  const iso = x => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  $("#q-date").min = iso(new Date()); $("#q-date").value = iso(d);
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f).entries());
    const err = $("#q-err"); err.textContent = "";
    if (!data.name.trim()) return err.textContent = "Please enter your name.";
    if (!/^[+\d][\d\s-]{8,}$/.test(data.phone || "")) return err.textContent = "Please enter a valid phone number.";
    if (!data.treatment) return err.textContent = "Please select a service.";
    if (new Date(data.date + "T00:00").getDay() === 0) return err.textContent = "We are closed on Sundays. Please pick another day.";
    const btn = $("button[type=submit]", f); btn.disabled = true; btn.textContent = "Sending…";
    try {
      await submitBooking({ ...data, doctor: "Any" });
      f.innerHTML = `<h3>Thank you, <em>${esc(data.name.split(" ")[0])}!</em></h3><p class="small" style="margin:10px 0 18px">Your request for ${esc(data.treatment)} on ${esc(data.date)} at ${esc(data.time)} is with our front desk. We will call or WhatsApp you to confirm.</p><a class="btn teal" href="${waLink(`Assalam o Alaikum, I just requested ${data.treatment} on ${data.date} at ${data.time}. Name: ${data.name}.`)}" target="_blank" rel="noopener">${WA_SVG} Confirm faster on WhatsApp</a>`;
    } catch (ex) { err.textContent = ex.message || "Something went wrong. Please call or WhatsApp us."; btn.disabled = false; btn.textContent = "Book An Appointment →"; }
  });
}

/* ---------- booking page ---------- */
function bookingForm() {
  const f = $("#book-form");
  const q = new URLSearchParams(location.search);
  $("#f-treatment").innerHTML = `<option value="">Choose a treatment</option>` + TREATMENTS.map(t => `<option value="${esc(t.name)}"${t.slug === q.get("t") ? " selected" : ""}>${esc(t.name)}</option>`).join("") + `<option${q.get("offer") ? " selected" : ""}>New patient special</option><option>Not sure yet, need advice</option><option>Tooth pain / emergency</option>`;
  $("#f-doctor").innerHTML = `<option value="Any">First available dentist</option>` + DOCTORS.map(d => `<option value="${esc(d.name)}"${d.slug === q.get("d") ? " selected" : ""}>${esc(d.name)} · ${esc(d.focus)}</option>`).join("");
  $("#hours").innerHTML = hoursTable();

  const date = $("#f-date");
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const start = new Date(); if (start.getHours() >= 18) start.setDate(start.getDate() + 1);
  if (start.getDay() === 0) start.setDate(start.getDate() + 1);
  date.min = iso(new Date()); date.value = iso(start);
  const max = new Date(); max.setDate(max.getDate() + 60); date.max = iso(max);

  async function renderTimes() {
    const d = new Date(date.value + "T00:00");
    const err = $("#date-err"), box = $("#times");
    if (isNaN(d)) { box.innerHTML = ""; return; }
    if (d.getDay() === 0) { err.textContent = "We are closed on Sundays. Please pick another day, or WhatsApp us for an emergency."; box.innerHTML = ""; return; }
    err.textContent = "";
    const taken = await bookedSlots(date.value, $("#f-doctor").value).catch(() => []);
    const now = new Date();
    const list = TIMES.filter(t => d.getDay() !== 6 || t < "16:00");
    box.innerHTML = list.map(t => {
      const past = date.value === iso(now) && t <= `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dis = past || taken.includes(t);
      return `<label class="chip"><input type="radio" name="time" value="${t}" ${dis ? "disabled" : ""} required><span>${t}</span></label>`;
    }).join("");
  }
  date.addEventListener("change", renderTimes);
  $("#f-doctor").addEventListener("change", renderTimes);
  renderTimes();

  f.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f).entries());
    const err = $("#form-err");
    err.textContent = "";
    if (!data.treatment) { err.textContent = "Please choose a treatment."; return; }
    if (!data.time) { err.textContent = "Please choose a time."; return; }
    if (!(data.name || "").trim()) { err.textContent = "Please enter your name."; return; }
    if (!/^[+\d][\d\s-]{8,}$/.test(data.phone || "")) { err.textContent = "Please enter a valid phone number."; return; }
    const btn = $("button[type=submit]", f); btn.disabled = true; btn.textContent = "Sending…";
    try {
      await submitBooking(data);
      const day = new Date(data.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
      const msg = `Assalam o Alaikum, I just requested an appointment at ${CLINIC.name}: ${data.treatment}, ${day} at ${data.time}. Name: ${data.name}.`;
      $("#form-wrap").innerHTML = `<div class="form-card done-card">
        <span class="eyebrow">Request received</span>
        <h2>Thank you, <em>${esc(data.name.split(" ")[0])}.</em></h2>
        <p class="lede">We will call or WhatsApp you within working hours to confirm. Nothing is final until we confirm.</p>
        <ul class="summary"><li><span>Treatment</span><span>${esc(data.treatment)}</span></li><li><span>Dentist</span><span>${esc(data.doctor === "Any" ? "First available" : data.doctor)}</span></li><li><span>Requested time</span><span>${esc(day)}, ${esc(data.time)}</span></li><li><span>Phone</span><span>${esc(data.phone)}</span></li></ul>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><a class="btn teal" href="${waLink(msg)}" target="_blank" rel="noopener">${WA_SVG} Confirm faster on WhatsApp</a><a class="link" href="index.html">Back to home</a></div>
      </div>`;
      scrollTo({ top: $("#form-wrap").offsetTop - 100 });
    } catch (ex) {
      err.textContent = ex.message || "Something went wrong. Please call or WhatsApp us.";
      btn.disabled = false; btn.textContent = "Request appointment";
    }
  });
}

chrome();
pages[page]?.();
reveal();
