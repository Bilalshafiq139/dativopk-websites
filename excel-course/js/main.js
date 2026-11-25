import { SITE, PLANS, PARTS, BATCHES, FAQS, COURSES, courseById } from "./data.js";
import { submitLead } from "./store.js";

const page = document.body.dataset.page;
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mark = `<span class="logo-mark" aria-hidden="true">${"<i></i>".repeat(9)}</span>`;
const waLink = (text = "Hi, I'd like to know about your courses.") => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- shared header and footer ---------- */
const NAV = [["index.html", "Home", "home"], ["courses.html", "Courses", "courses"], ["pricing.html", "Pricing", "pricing"], ["about.html", "About", "about"], ["contact.html", "Contact", "contact"]];
const navPage = ["course", "excel", "curriculum"].includes(page) ? "courses" : page;
const course = page === "course" ? courseById(document.body.dataset.course) : null;
if (course) buildCoursePage(course);
document.body.insertAdjacentHTML("afterbegin", `
<header class="site-head" id="head">
  <a class="logo" href="index.html" aria-label="${SITE.name} home">${mark}${SITE.name}</a>
  <nav class="nav" id="nav">${NAV.map(([h, t, p]) => `<a href="${h}"${p === navPage ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
  <a class="btn sun" href="pricing.html#enroll">Enroll now <span class="arr">→</span></a>
  <button class="menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
</header>`);
document.body.insertAdjacentHTML("beforeend", `
<footer class="site-foot">
  <div class="wrap">
    <p class="big display">Learn it once.<br><a href="pricing.html#enroll" class="hl">Use it every day.</a></p>
    <div class="foot-grid">
      <div><a class="logo" href="index.html">${mark}${SITE.name}</a><p style="opacity:.7;max-width:32ch;margin-top:16px">${SITE.tagline}. Small live batches in Lahore and online.</p></div>
      <div><span class="label">Courses</span>${COURSES.map(c => `<a href="${c.page}">${c.name}</a>`).join("")}<a href="pricing.html">Pricing</a></div>
      <div><span class="label">Talk to us</span><a href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${SITE.email}">${SITE.email}</a></div>
      <div><span class="label">Visit</span><span style="opacity:.85">${SITE.address}</span><br><span style="opacity:.6;font-size:14px">${SITE.hours}</span></div>
    </div>
    <div class="foot-base"><span>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span><span>Next batch: ${SITE.nextBatch} · ${SITE.seats} seats</span></div>
  </div>
</footer>
<a class="wa" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><span>Questions? WhatsApp us</span>
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8h0c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.1 1.3 15.1 0 12 0 5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7c1.7.9 3.7 1.4 5.7 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.4z"/></svg></a>`);

const head = $("#head");
const storyEl = document.querySelector(".story");
const onScroll = () => head.classList.toggle("solid", storyEl ? window.scrollY > storyEl.offsetHeight - 40 : window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
$("#menu-btn").addEventListener("click", e => {
  const open = document.body.classList.toggle("menu-open");
  e.currentTarget.setAttribute("aria-expanded", open);
});
$("#nav").addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("menu-open"); });

/* ---------- reveal ---------- */
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));
}

/* ---------- forms ---------- */
function wireForm(form, source) {
  const msg = $(".form-msg", form);
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (!d.name?.trim() || !d.phone?.trim()) { msg.textContent = "Please add your name and phone number."; msg.className = "form-msg err"; return; }
    if (d.phone.replace(/\D/g, "").length < 10) { msg.textContent = "That phone number looks short."; msg.className = "form-msg err"; return; }
    const btn = $("button[type=submit]", form); btn.disabled = true; msg.textContent = "Sending…"; msg.className = "form-msg";
    try {
      await submitLead({ source, course: d.course || "", name: d.name.trim(), phone: d.phone.trim(), email: (d.email || "").trim(), plan: d.plan || "", batch: d.batch || "", level: d.level || "", role: (d.role || "").trim(), message: (d.message || "").trim() });
      form.innerHTML = `<div class="done"><div class="tick">✓</div><h3>${source === "enroll" ? "Seat request received." : "Message received."}</h3><p class="muted" style="max-width:44ch;margin:12px auto 22px">We'll call or WhatsApp you within one working day${source === "enroll" ? " to confirm your seat and share payment details" : ""}.</p><a class="btn ghost" href="${waLink(`Hi, I just submitted the form on your website. My name is ${d.name.trim()}.`)}" target="_blank" rel="noopener">Speed it up on WhatsApp</a></div>`;
    } catch (err) {
      btn.disabled = false; msg.textContent = err.message; msg.className = "form-msg err";
    }
  });
}

/* ---------- pages ---------- */
if (page === "excel") {
  $("#parts").innerHTML = PARTS.map(p => `<li class="rv"><span class="n">${p.n}</span><h3>${p.title}</h3><span class="muted w">${p.weeks}</span><span class="f">${esc(p.fx)}</span><span class="go">→</span><a href="curriculum.html#part-${p.n}" aria-label="${p.title}"></a></li>`).join("");
  initHome();
}
if (course) initCourseStory(course);
if (page === "courses") renderCourseRows($("#course-list"), true);
if (page === "curriculum") {
  $("#weeks").innerHTML = PARTS.map(p => `
  <article class="week rv" id="part-${p.n}">
    <div class="side"><div class="n">${p.n}</div><span class="label">${p.weeks}</span></div>
    <div>
      <h2>${p.title}</h2>
      <code class="fxline">${esc(p.fx)}</code>
      <p class="blurb">${p.blurb}</p>
      <ul class="lessons">${p.lessons.map(l => `<li>${l}</li>`).join("")}</ul>
      <div class="deliver"><span class="label">You build</span>${p.project}</div>
    </div>
  </article>`).join("");
}
if (page === "pricing") {
  $("#plans").innerHTML = PLANS.map(p => `
  <div class="plan${p.featured ? " featured" : ""}">
    <span class="label">${p.per}</span>
    <h3 style="margin-top:14px">${p.name}${p.featured ? '<span class="badge">Most chosen</span>' : ""}</h3>
    <p class="tagline muted">${p.line}</p>
    <div class="price">${p.price}</div>
    <ul>${p.items.map(i => `<li>${i}</li>`).join("")}</ul>
    <a class="btn${p.featured ? "" : " ghost"}" href="#enroll" data-plan="${p.id}">${p.id === "team" ? "Ask for a quote" : "Choose " + p.name} <span class="arr">→</span></a>
  </div>`).join("");
  $("#plan").innerHTML = PLANS.map(p => `<option value="${p.id}">${p.name} (${p.price})</option>`).join("");
  $("#batch").innerHTML = BATCHES.map(b => `<option value="${b.id}">${b.label}</option>`).join("");
  $("#plan").value = "cohort";
  $("#course").innerHTML = COURSES.map(c => `<option value="${c.id}">${c.long}</option>`).join("");
  const want = new URLSearchParams(location.search).get("course");
  if (courseById(want)) $("#course").value = want;
  $("#fees").innerHTML = `<thead><tr><th>Course</th><th>Length</th><th>Self-paced</th><th>Live cohort</th></tr></thead><tbody>${COURSES.map(c => `<tr><td><a href="${c.page}">${c.long}</a></td><td>${c.weeks} weeks</td><td>Rs ${c.self.toLocaleString("en-US")}</td><td><b>Rs ${c.cohort.toLocaleString("en-US")}</b></td></tr>`).join("")}</tbody>`;
  document.querySelectorAll("[data-plan]").forEach(a => a.addEventListener("click", () => {
    $("#plan").value = a.dataset.plan;
    if (a.dataset.plan === "self") $("#batch").value = "self-paced";
  }));
  $("#faq").innerHTML = FAQS.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("");
  wireForm($("#enroll-form"), "enroll");
}
if (page === "contact") {
  $("#info").innerHTML = `
    <li><span class="label">Call</span><a href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a></li>
    <li><span class="label">WhatsApp</span><a href="${waLink()}" target="_blank" rel="noopener">Chat with an advisor →</a></li>
    <li><span class="label">Email</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
    <li><span class="label">Campus</span><span>${SITE.address}</span></li>
    <li><span class="label">Hours</span><span>${SITE.hours}</span></li>`;
  wireForm($("#contact-form"), "contact");
}
reveal();

/* ---------- home: the scroll story ---------- */
async function initHome() {
  const story = $("#story");
  const chapters = [...document.querySelectorAll(".chapter")];
  const bars = [...document.querySelectorAll(".rail b")], railLabel = $(".rail span");
  const names = ["Blank sheet", "Formulas", "Lookups & pivots", "Chart", "Dashboard"];
  const { initSheetStory } = await import("./sheet-story.js");
  const api = initSheetStory({
    mount: $("#xl-mount"), story,
    onStage: n => {
      chapters.forEach(c => c.classList.toggle("on", Number(c.dataset.stage) === n));
      bars.forEach((b, i) => b.classList.toggle("on", i === n));
      railLabel.textContent = names[n];
      story.style.setProperty("--P", n);
    },
  });
  bars.forEach((b, i) => b.addEventListener("click", () => api.goTo(i)));
}

/* ---------- course list (home + courses page) ---------- */
function renderCourseRows(el, big = false) {
  if (!el) return;
  el.innerHTML = COURSES.map((c, i) => `<li class="rv"><span class="n">0${i + 1}</span><div><h3>${c.long}</h3><p class="muted" style="margin:6px 0 0">${c.line}</p></div>
    <span class="flow">${c.steps.map(s => `<i>${s}</i>`).join("")}</span><span class="muted w">${c.weeks} weeks · from Rs ${c.self.toLocaleString("en-US")}</span><span class="go">→</span><a href="${c.page}" aria-label="${c.long}"></a></li>`).join("");
}

/* ---------- course pages: story + details, built from data ---------- */
function buildCoursePage(c) {
  const main = document.querySelector("main");
  main.innerHTML = `
  <section class="story sheet-story" id="story" aria-label="${c.long} in five steps">
    <div class="stage">
      <div class="xl-mount" id="xl-mount"></div>
      ${c.chapters.map(([t, p], i) => `<div class="chapter ${i === 0 ? "c0x" : "side left"}${i === 0 ? " on" : ""}" data-stage="${i}">
        ${i === 0 ? `<span class="label">${c.long}</span><h1 class="display big">${t}</h1>` : `<span class="step">Step ${i} of 4 · ${c.steps[i]}</span><h2 class="display big">${t}</h2>`}
        <p>${p}</p>
        ${i === 0 ? `<div class="lede"><span>${c.weeks} weeks · live or self-paced</span><span>Lahore campus &amp; online</span><span>Scroll to see the whole course</span></div>` : ""}
        ${i === 4 ? `<div class="ctas"><a class="btn sun" href="pricing.html?course=${c.id}#enroll">Reserve a seat <span class="arr">→</span></a><a class="btn ghost" href="#details">What you learn</a></div>` : ""}
      </div>`).join("")}
      <div class="rail" aria-label="Story steps">${c.steps.map((s, i) => `<b${i === 0 ? ' class="on"' : ""} title="${s}"></b>`).join("")}<span>${c.steps[0]}</span></div>
      <div class="scroll-hint" aria-hidden="true">Scroll<i></i></div>
    </div>
  </section>
  <section class="block" id="details">
    <div class="wrap">
      <div class="split"><h2 class="display big rv">What you<br>learn<span class="hl">.</span></h2>
        <div class="rv"><p class="statement">${c.weeks} weeks, four parts, and one capstone you can show in an interview.</p><div class="tools">${c.tools.map(t => `<span>${t}</span>`).join("")}</div></div></div>
      <ol class="parts">${c.parts.map(([t, d], i) => `<li class="rv"><span class="n">0${i + 1}</span><h3>${t}</h3><span class="muted w">Weeks ${Math.round(i * c.weeks / 4) + 1}–${Math.round((i + 1) * c.weeks / 4)}</span><span class="f">${d}</span><span class="go"></span></li>`).join("")}</ol>
    </div>
  </section>
  <section class="block quote">
    <div class="wrap batch">
      <div><span class="label" style="color:rgba(238,234,224,.6)">Fee</span>
        <h2 class="display big" style="margin-top:16px;color:var(--paper)">Rs ${c.cohort.toLocaleString("en-US")}<span class="hl">.</span></h2>
        <div class="facts" style="color:var(--paper)"><div><span style="color:rgba(238,234,224,.6)">Live cohort</span>${c.weeks} weeks, max 24 seats</div><div><span style="color:rgba(238,234,224,.6)">Self-paced</span>Rs ${c.self.toLocaleString("en-US")}</div><div><span style="color:rgba(238,234,224,.6)">Next batch</span>${SITE.nextBatch}</div></div></div>
      <a class="btn sun" href="pricing.html?course=${c.id}#enroll" style="font-size:17px;padding:18px 30px">Reserve a seat <span class="arr">→</span></a>
    </div>
  </section>`;
}
async function initCourseStory(c) {
  const story = $("#story");
  const chapters = [...document.querySelectorAll(".chapter")];
  const bars = [...document.querySelectorAll(".rail b")], railLabel = $(".rail span");
  const mod = await import(`./stories/${c.story}.js`);
  const api = mod.init({
    mount: $("#xl-mount"), story,
    onStage: n => {
      chapters.forEach(ch => ch.classList.toggle("on", Number(ch.dataset.stage) === n));
      bars.forEach((b, i) => b.classList.toggle("on", i === n));
      railLabel.textContent = c.steps[n];
      story.style.setProperty("--P", n);
    },
  });
  bars.forEach((b, i) => b.addEventListener("click", () => api.goTo(i)));
}

/* ---------- home page ---------- */
const ICONS = {
  excel: `<svg viewBox="0 0 120 80"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="108" height="68" rx="4"/><path d="M6 22H114M6 38H114M6 54H114M34 6V74M62 6V74M90 6V74"/></g><rect x="63" y="39" width="26" height="14" class="a"/></svg>`,
  analytics: `<svg viewBox="0 0 120 80"><g fill="currentColor"><rect x="10" y="44" width="16" height="30"/><rect x="34" y="30" width="16" height="44"/><rect x="58" y="38" width="16" height="36"/></g><rect x="82" y="12" width="16" height="62" class="a"/><path d="M6 75H114" stroke="currentColor" stroke-width="2"/></svg>`,
  ml: `<svg viewBox="0 0 120 80"><g fill="currentColor">${[[14, 60], [24, 50], [36, 58], [30, 40], [48, 46], [70, 22], [84, 30], [96, 16], [90, 40], [104, 28]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5"${i > 4 ? ' class="a"' : ""}/>`).join("")}</g><path d="M10 70L110 8" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/></svg>`,
  ads: `<svg viewBox="0 0 120 80"><g fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="60" cy="40" r="32"/><circle cx="60" cy="40" r="20"/></g><circle cx="60" cy="40" r="9" class="a"/></svg>`,
};
function buildHome() {
  const fmt = n => n.toLocaleString("en-US");
  $("#home-courses").innerHTML = COURSES.map(c => `
    <a class="ccard rv" href="${c.page}">
      <div class="ic">${ICONS[c.id]}</div>
      <span class="label">${c.weeks} weeks · next batch ${c.next}</span>
      <h3>${c.long}</h3>
      <p>${c.line}</p>
      <ul>${c.outcomes.map(o => `<li>${o}</li>`).join("")}</ul>
      <div class="ccard-f"><span>From <b>Rs ${fmt(c.self)}</b></span><span class="go">View course →</span></div>
    </a>`).join("");
  $("#hero-list").innerHTML = COURSES.map(c => `<a href="${c.page}"><span>${c.name}</span><em>${c.weeks} wks</em><i>→</i></a>`).join("");
  $("#batches").innerHTML = `<thead><tr><th>Course</th><th>Starts</th><th>Schedule</th><th>Seats left</th><th></th></tr></thead><tbody>${COURSES.map(c => `<tr><td><a href="${c.page}">${c.long}</a></td><td><b>${c.next}</b></td><td>${c.schedule}</td><td><span class="seats${c.seatsLeft <= 6 ? " low" : ""}">${c.seatsLeft} of 24</span></td><td><a class="btn sm ghost" href="pricing.html?course=${c.id}#enroll">Enroll</a></td></tr>`).join("")}</tbody>`;
}

if (page === "home") { buildHome(); reveal(); }
