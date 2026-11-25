import { ACADEMY, COURSES, pkr } from "./courses-data.js";
import { submitEnrollment } from "./store.js";

const page = document.body.dataset.page;
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const pad = (n) => String(n).padStart(2, "0");

/* ---------- Header ---------- */
const links = [["courses.html", "Programmes", "courses"], ["about.html", "About", "about"], ["contact.html", "Contact", "contact"]];
document.getElementById("site-header").innerHTML = `
  <div class="container nav">
    <a href="index.html" class="wordmark" aria-label="${ACADEMY.name}, home">${ACADEMY.short}<small>Academy</small></a>
    <ul class="nav-links" id="nav-links">
      ${links.map(([h, l, k]) => `<li><a href="${h}" class="${page === k || (page === "course" && k === "courses") ? "active" : ""}">${l}</a></li>`).join("")}
    </ul>
    <div class="nav-right">
      <a href="contact.html#apply" class="btn btn-sm">Apply</a>
      <button class="menu-btn" id="menu-btn" aria-expanded="false">Menu</button>
    </div>
  </div>`;
const menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("click", () => {
  const open = document.getElementById("nav-links").classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "Close" : "Menu";
});

/* ---------- Footer ---------- */
document.getElementById("site-footer").innerHTML = `
  <div class="container">
    <div class="foot-top">
      <div><p>${ACADEMY.tagline}</p><a href="contact.html#apply" class="ulink" style="color:var(--paper)">Apply for the winter intake</a></div>
      <div><h4>Programmes</h4><ul>${COURSES.map(c => `<li><a href="course.html?c=${c.slug}">${c.title}</a></li>`).join("")}</ul></div>
      <div><h4>Academy</h4><ul>
        <li><a href="about.html">About</a></li><li><a href="courses.html">All programmes</a></li>
        <li><a href="contact.html">Contact</a></li><li><a href="admin.html">Staff login</a></li></ul></div>
      <div><h4>Visit</h4><ul>
        <li>${ACADEMY.city}</li>
        <li><a href="tel:${ACADEMY.phone.replace(/\s/g, "")}">${ACADEMY.phone}</a></li>
        <li><a href="mailto:${ACADEMY.email}">${ACADEMY.email}</a></li>
        <li><a href="https://wa.me/${ACADEMY.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li></ul></div>
    </div>
    <div class="foot-mark" aria-hidden="true">${ACADEMY.short}</div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${ACADEMY.name}</span><span>Lahore · Online</span></div>
  </div>`;
document.body.insertAdjacentHTML("beforeend", `
  <a class="wa-float" href="https://wa.me/${ACADEMY.whatsapp}?text=${encodeURIComponent("Hi, I'd like to know more about your programmes.")}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>
    <span class="wa-label">Chat with us</span>
  </a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`);

/* ---------- Programme index ---------- */
function indexRow(c, i) {
  return `<li class="reveal"><a href="course.html?c=${c.slug}">
    <span class="num">${pad(i + 1)}</span>
    <span class="thumb" data-thumb="${c.slug}" aria-hidden="true"></span>
    <span class="title">${c.title}</span>
    <p>${c.tagline}</p>
    <span class="c-dur muted small">${c.duration}</span>
    <span class="c-fee small">${pkr(c.price)}</span>
    ${ARROW}
  </a></li>`;
}
document.querySelectorAll("[data-index]").forEach(el => {
  const skip = el.dataset.skip;
  el.innerHTML = COURSES.map((c, i) => [c, i]).filter(([c]) => c.slug !== skip).map(([c, i]) => indexRow(c, i)).join("");
});

/* ---------- Course detail ---------- */
if (page === "course") {
  const slug = new URLSearchParams(location.search).get("c");
  const idx = Math.max(0, COURSES.findIndex(x => x.slug === slug));
  const c = COURSES[idx];
  document.title = `${c.title} | ${ACADEMY.name}`;
  document.getElementById("c-crumb").textContent = c.title;
  document.getElementById("c-num").textContent = `Programme ${pad(idx + 1)} / ${pad(COURSES.length)}`;
  document.getElementById("c-title").textContent = c.title;
  document.getElementById("c-tag").textContent = c.tagline;
  document.getElementById("c-spec").innerHTML = [["Duration", c.duration], ["Level", c.level], ["Format", c.mode], ["Fee", pkr(c.price)]]
    .map(([k, v]) => `<div><span class="label">${k}</span><b>${v}</b></div>`).join("");
  document.getElementById("c-outcomes").innerHTML = c.outcomes.map(o => `<li class="reveal">${o}</li>`).join("");
  document.getElementById("c-weeks").innerHTML = c.modules.map((m, i) => `<li class="reveal"><span>Week ${pad(i + 1)}</span><span>${m}</span></li>`).join("");
  document.getElementById("c-tools").innerHTML = c.tools.map(t => `<span class="tag">${t}</span>`).join("");
  document.querySelectorAll("[data-apply]").forEach(a => a.href = `contact.html?c=${c.slug}#apply`);
  document.getElementById("bar-title").textContent = `${c.title} · ${pkr(c.price)}`;
  document.getElementById("c-index").dataset.skip = c.slug;
  const list = document.getElementById("c-index");
  list.innerHTML = COURSES.map((x, i) => [x, i]).filter(([x]) => x.slug !== c.slug).map(([x, i]) => indexRow(x, i)).join("");
  import("./hero3d.js").then(m => m.initScene(document.getElementById("course-canvas"), { shape: c.slug, tint: c.color })).catch(() => {});

  const bar = document.getElementById("apply-bar");
  const heroEl = document.querySelector(".course-hero");
  const footer = document.getElementById("site-footer");
  const updateBar = () => {
    const past = heroEl.getBoundingClientRect().bottom < 0;
    const atFoot = footer.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle("show", past && !atFoot);
  };
  window.addEventListener("scroll", updateBar, { passive: true });
}

/* ---------- Programme thumbnails (rendered from the 3D scenes) ---------- */
const thumbs = document.querySelectorAll("[data-thumb]");
if (thumbs.length) {
  const cache = {};
  import("./hero3d.js").then(({ snapshot }) => {
    let i = 0;
    const next = () => {
      const el = thumbs[i++];
      if (!el) return;
      const c = COURSES.find(x => x.slug === el.dataset.thumb);
      const url = cache[c.slug] ||= snapshot(c.slug, c.color, 520, 390);
      if (url) el.innerHTML = `<img src="${url}" alt="" loading="lazy">`;
      setTimeout(next, 30);
    };
    next();
  }).catch(() => {});
}

/* ---------- Testimonials ---------- */
const QUOTES = [
  ["The Power BI project was the exact thing my interviewer asked about. I started as a junior analyst two months after the course ended.", "Ayesha Khan", "Data Analyst, Lahore"],
  ["I was spending money on Facebook ads without a plan. Within one batch my clients' cost per lead fell by almost half.", "Hamza Ali", "Freelance media buyer"],
  ["My mentor reviewed every screen I designed. The case study from the final project brought me my first two clients.", "Sara Ahmed", "Product designer"],
];
const qEl = document.getElementById("quote");
if (qEl) {
  let qi = 0;
  const show = (i) => {
    qi = (i + QUOTES.length) % QUOTES.length;
    qEl.style.opacity = 0;
    setTimeout(() => {
      const [q, n, r] = QUOTES[qi];
      qEl.textContent = `“${q}”`;
      document.getElementById("quote-name").innerHTML = `<b>${n}</b> <span class="muted">· ${r}</span>`;
      document.getElementById("quote-count").textContent = `${pad(qi + 1)} / ${pad(QUOTES.length)}`;
      qEl.style.opacity = 1;
    }, 250);
  };
  document.getElementById("q-prev").onclick = () => show(qi - 1);
  document.getElementById("q-next").onclick = () => show(qi + 1);
  show(0);
}

/* ---------- Enrollment form ---------- */
const select = document.getElementById("course-select");
if (select) {
  select.innerHTML = `<option value="">Choose a programme</option>` + COURSES.map(c => `<option value="${c.slug}">${c.title}</option>`).join("");
  const pre = new URLSearchParams(location.search).get("c");
  if (pre) select.value = pre;
}
export function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 4200);
}
document.querySelectorAll("form[data-enroll]").forEach(form => {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    const label = btn.innerHTML;
    const data = Object.fromEntries(new FormData(form));
    btn.disabled = true; btn.textContent = "Sending…";
    try {
      await submitEnrollment(data);
      form.reset();
      toast(`Thank you, ${String(data.name).split(" ")[0]}. Our admissions team will call you within a day.`);
    } catch {
      toast("Something went wrong. Please try again, or message us on WhatsApp.");
    } finally { btn.disabled = false; btn.innerHTML = label; }
  });
});

/* ---------- Motion ---------- */
requestAnimationFrame(() => document.body.classList.add("loaded"));
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
