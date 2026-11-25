import { SITE, CATEGORIES, DISHES, DRINKS, EVENTS, TEAM, REVIEWS, FAQ, DONENESS, CUTS, GALLERY, rs } from "./data.js";
import { submitBooking, bookedSlots } from "./store.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const img = (n) => `assets/img/${n}.webp`;
export const waLink = (msg = `Assalam o Alaikum, I'd like to ask about a table at ${SITE.full}.`) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

const WA = `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.2-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;
const ICON = {
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v7h4v-7h3l1-4h-4V8.6c0-.4.2-.6.6-.6z"/></svg>`,
};

const NAV = [
  ["index", "Home"], ["about", "About Us"], ["menu", "Menu"], ["cuts", "Steak Guide"], ["events", "Events"], ["gallery", "Gallery"], ["contact", "Contact"],
];

/* ---------- shell: header, footer, WhatsApp ---------- */
function shell(page) {
  const head = document.createElement("header");
  head.className = "site-head";
  head.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html" aria-label="${esc(SITE.full)} home">${esc(SITE.name)}<small>Steakhouse</small></a>
    <nav class="nav" id="nav">
      ${NAV.map(([p, l]) => `<a href="${p}.html" class="${page === p || (page === "dish" && p === "menu") ? "on" : ""}">${l}</a>`).join("")}
      <a class="btn" href="reservations.html">Reservations</a>
    </nav>
    <button class="burger" aria-label="Open menu" aria-controls="nav"><span></span><span></span><span></span></button>
  </div>`;
  document.body.prepend(head);
  const loader = document.createElement("div");
  loader.className = "loader"; loader.innerHTML = `<span>${esc(SITE.name)}</span>`;
  document.body.prepend(loader);

  $(".burger", head).addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".nav a", head).forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  const onScroll = () => head.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const foot = document.createElement("footer");
  foot.className = "site-foot";
  foot.innerHTML = `<div class="wrap">
    <div class="foot-grid">
      <div><h4>Location</h4><p>${esc(SITE.address)}</p><p><a href="contact.html" class="more" style="margin-top:8px">Get directions</a></p></div>
      <div><h4>Working Hours</h4>${SITE.hours.map(([d, h]) => `<p>${esc(d)}<br><span class="muted">${esc(h)}</span></p>`).join("")}</div>
      <div><h4>Reservations</h4><p><a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a></p><p><a href="mailto:${SITE.email}">${esc(SITE.email)}</a></p>
        <div class="social"><a href="#" aria-label="Instagram">${ICON.ig}</a><a href="#" aria-label="Facebook">${ICON.fb}</a><a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a></div></div>
      <div class="foot-brand"><a class="logo" href="index.html">${esc(SITE.name)}</a><p>Charcoal, oak and properly aged beef<br>in the heart of Gulberg since ${SITE.since}.</p></div>
    </div>
    <div class="foot-links">${NAV.map(([p, l]) => `<a href="${p}.html">${l}</a>`).join("")}<a href="reservations.html">Reservations</a><span class="r">© ${new Date().getFullYear()} ${esc(SITE.full)}. All meat is halal.</span></div>
  </div>`;
  document.body.append(foot);

  const wa = document.createElement("a");
  wa.className = "wa-float"; wa.href = waLink(); wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("aria-label", "Chat on WhatsApp");
  wa.innerHTML = `${WA}<span>Book on WhatsApp</span>`;
  document.body.append(wa);
}

/* ---------- motion: reveal on scroll + parallax ---------- */
function motion() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$(".rv").forEach((el) => io.observe(el));
  const par = $$("[data-par]");
  if (!par.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  const run = () => {
    const vh = innerHeight;
    par.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around centre
      const k = parseFloat(el.dataset.par);
      const rot = el.dataset.rot ? `rotate(${p * parseFloat(el.dataset.rot)}deg)` : "";
      el.style.transform = `translate3d(0, ${(p * k * 100).toFixed(1)}px, 0) ${rot}`;
    });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  run();
}

const deco = (kind, style, par = .4, rot = 0, cls = "") =>
  kind === "dust"
    ? `<img class="deco dust ${cls}" src="assets/img/dust-${Math.random() < .5 ? 1 : 2}.png" alt="" style="${style}" data-par="${par}" ${rot ? `data-rot="${rot}"` : ""}>`
    : `<img class="deco sprig ${cls}" src="assets/img/${kind}.svg" alt="" style="${style}" data-par="${par}" ${rot ? `data-rot="${rot}"` : ""}>`;

const pageHero = (script, title, text, bg, crumbs = "") => `<section class="page-hero">
  <div class="bg" style="background-image:url(${img(bg)})" data-par=".5"></div>
  <div class="wrap"><span class="script rv">${script}</span><h1 class="rv d1">${title}</h1>${text ? `<p class="rv d2">${text}</p>` : ""}
  <div class="crumbs rv d3"><a href="index.html">Home</a> &nbsp;/&nbsp; ${crumbs || title}</div></div></section>`;

const bookBanner = (title = "Book Your Table", bg = "interior") => `<section class="book-banner">
  <div class="bg" style="background-image:url(${img(bg)})" data-par=".6"></div>
  <div class="rv"><span class="script">Reservation</span><h2>${title}</h2><a class="btn" href="reservations.html">Online Booking</a></div></section>`;

const featureCard = ({ script, title, body, link, linkText, pic, flip, meta = "" }) => `<div class="feature ${flip ? "flip" : ""} rv">
  <div class="feature-img"><img src="${img(pic)}" alt="" data-par=".35"></div>
  <div class="feature-body"><span class="script">${script}</span><h2>${title}</h2>${body}
  <div class="feature-meta"><a class="more" href="${link}">${linkText}</a>${meta}</div></div></div>`;

const dishRow = (d) => `<a class="dish-row rv" href="dish.html?d=${d.slug}">
  <img src="${d.img}" alt="${esc(d.name)}" loading="lazy">
  <div><div class="t"><h3>${esc(d.name)}</h3><span class="dots"></span><span class="price">${rs(d.price)}</span></div>
  <p>${esc(d.line)} ${d.tags.slice(0, 1).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</p></div></a>`;

/* ---------- pages ---------- */
const PAGES = {
  index(main) {
    const z = [
      ["Appetizer", "Start with hand-cut beef tartare, cured yolk and toasted sourdough.", "beef-tartare", "tartare", "dust", false],
      ["Main Course", "Our 28-day dry-aged tomahawk, cooked over oak and carved at your table.", "tomahawk", "tomahawk", "", true],
      ["Side Dish", "A sharp garden salad with feta and pickled onion to complement your steak.", "garden-salad", "salad-dark", "dust", false],
      ["Dessert", "Finish your evening with a molten chocolate cake, baked to order.", "lava-cake", "lava-cake", "", true],
    ];
    main.innerHTML = `
    <section class="hero">
      ${deco("dust", "left:-120px;top:12%;width:420px", .3, 0, "hide-sm")}
      <div class="wrap">
        <div class="copy">
          <h1 class="rv">A Premium<br>And Authentic<br>Steakhouse</h1>
          <p class="rv d1">Dry-aged beef, a charcoal and oak grill, and a dining room made for long evenings in the heart of Gulberg.</p>
          <div class="actions rv d2"><a class="btn" href="reservations.html">Book A Table</a><a class="more" href="menu.html">View the menu</a></div>
        </div>
        <div class="hero-art rv z d1">
          <div class="hero-ring r2"></div><div class="hero-ring"></div>
          <div class="hero-plate" data-par="-.15" data-rot="-14"><img src="${img("hero-pan")}" alt="Ribeye in a cast-iron pan with rosemary"></div>
          ${deco("rosemary", "right:-4%;top:-4%;transform:rotate(30deg);width:110px", -.6, 20)}
          ${deco("thyme", "left:-8%;bottom:-2%;width:130px", .7, -30)}
          ${deco("dust", "right:-20%;bottom:-6%;width:380px;opacity:.7", .5)}
        </div>
      </div>
      <span class="scroll-cue">Scroll</span>
    </section>

    <section class="sec">
      ${deco("dust", "left:8%;top:40px;width:320px", .5, 0, "hide-sm")}
      ${deco("thyme", "right:6%;bottom:40px;width:120px;transform:rotate(-20deg)", -.5, 25, "hide-sm")}
      <div class="wrap">${featureCard({ script: "Discover", title: "Our Story", pic: "grill-smoke", link: "about.html", linkText: "More About Us",
        body: `<p>Get the best steakhouse experience in Lahore at ${esc(SITE.name)}. Whether you are joining us for a family dinner, a business meeting, a private party or just a quick lunch, our team will look after you with calm, warm service and food cooked over real fire.</p>` })}</div>
    </section>

    <section class="sec" style="padding-top:40px">
      <div class="wrap">
        <div class="menu-intro"><div class="sec-head rv l"><span class="script">Discover</span><h2>Our Menu</h2></div>
          <p class="rv r">Few things come close to the joy of a good steak. Rest assured that our chefs treat every cut with the respect it deserves. The open kitchen and our glass ageing room are a testimony to that.</p></div>
        ${z.map(([s, t, slug, pic, d, r], i) => `<div class="zig ${r ? "r" : ""}">
          <div class="plate-wrap">${d ? deco("dust", "left:-30%;top:10%;width:300px", .4) : ""}${i % 2 ? deco(i === 1 ? "rosemary" : "thyme", "right:-12%;top:-10%;width:100px", -.5, 30, "hide-sm") : ""}
            <a class="plate ${i === 1 ? "big" : ""} rv z" href="dish.html?d=${slug}" data-par="${i % 2 ? -.2 : .2}" data-rot="${i % 2 ? 12 : -12}"><img src="${img(pic)}" alt="" loading="lazy"></a></div>
          <div class="txt rv ${r ? "l" : "r"}"><span class="script">${s}</span><p>${t}</p><a class="more" href="dish.html?d=${slug}">See the dish</a></div></div>`).join("")}
        <div class="center rv" style="margin-top:70px"><a class="btn" href="menu.html">View Full Menu</a></div>
      </div>
    </section>

    <section class="sec">
      ${deco("dust", "right:6%;top:30px;width:340px", .5, 0, "hide-sm")}
      <div class="wrap">${featureCard({ script: "Discover", title: "Upcoming Events", pic: "dining-friends", link: "events.html", linkText: "More Events",
        body: `<p>Not only can you get the best steak in town, you can gather your family and friends for a long evening of good food, live music and the grill going on the terrace.</p>`,
        meta: `<div class="ev"><b>${esc(EVENTS[0].title)}</b>${esc(EVENTS[0].date)} | ${esc(EVENTS[0].time)}</div>` })}</div>
    </section>

    <section class="sec ingredients">
      <div class="wrap">
        <div class="sec-head center rv"><span class="script">Discover</span><h2>The Best Ingredients</h2>
          <p>We take enormous pride in sourcing our beef. Every cut comes from trusted farms, is halal certified, and is aged in house so it reaches you tender and full of flavour. That extra care is what makes our steaks hard to find anywhere else.</p></div>
        <div class="ing-stage">
          ${deco("rosemary", "left:2%;top:-14%;width:80px", .6, 25, "hide-sm")}
          ${deco("thyme", "right:0;bottom:-10%;width:100px", -.5, -25, "hide-sm")}
          ${deco("dust", "left:50%;top:50%;width:520px;margin:-180px 0 0 -260px;opacity:.55", .2)}
          <div class="meat rv z" data-par="-.1" data-rot="8"><img src="${img("raw-ribeye")}" alt="Raw dry-aged ribeye with sea salt and rosemary"></div>
          <span class="ing-chip rv" style="left:4%;top:44%">28-day dry aged</span>
          <span class="ing-chip rv d1" style="right:2%;top:30%">Halal certified</span>
          <span class="ing-chip rv d2" style="right:8%;bottom:12%">Charcoal & oak</span>
          <span class="ing-chip rv d3" style="left:10%;bottom:8%">Local farms</span>
        </div>
      </div>
    </section>

    <section class="sec tight"><div class="wrap">${reviews()}</div></section>
    ${bookBanner()}`;
    quotes(main);
  },

  about(main) {
    main.innerHTML = `${pageHero("Discover", "Our Story", `A steakhouse built around one fire, one ageing room and a team that loves feeding people.`, "grill-fire", "About Us")}
    <section class="sec"><div class="wrap">${featureCard({ script: "Since " + SITE.since, title: "Born on MM Alam Road", pic: "grill-steaks", link: "menu.html", linkText: "See the menu",
      body: `<p>${esc(SITE.name)} started as a twelve-table dining room with one charcoal grill and a simple idea: buy the best beef we could find, age it ourselves and cook it over real fire.</p><p>Nine years later the grill is bigger and the dining room is busier, but the idea has not changed. Every steak is still seasoned, cooked and rested by hand.</p>` })}</div></section>
    <section class="sec tight"><div class="wrap"><div class="stats rv">
      <div><b>28</b><span>Days of dry ageing</span></div><div><b>140</b><span>Seats on two floors</span></div>
      <div><b>12</b><span>Cuts on the menu</span></div><div><b>4.8</b><span>Google rating</span></div></div></div></section>
    <section class="sec"><div class="wrap">
      <div class="sec-head center rv"><span class="script">Our people</span><h2>The Kitchen Team</h2></div>
      <div class="cards-2">${TEAM.map((t, i) => `<article class="tile rv d${i + 1}"><div class="im"><img src="${t.img}" alt="${esc(t.name)}" loading="lazy"></div>
        <div class="bd"><span class="kicker">${esc(t.role)}</span><h3>${esc(t.name)}</h3><p>${esc(t.line)}</p></div></article>`).join("")}</div></div></section>
    <section class="sec" style="padding-top:20px"><div class="wrap">${featureCard({ script: "The craft", title: "Fire, Time & Rest", pic: "cuts-lineup", flip: true, link: "cuts.html", linkText: "Read our steak guide",
      body: `<p>We age whole ribs and loins in a glass room at exactly 2°C and 80% humidity. Water slowly leaves the meat, the flavour concentrates and natural enzymes make it more tender.</p><p>On the grill we use charcoal for heat and oak for flavour, then every steak rests for as long as it cooked before it reaches you.</p>` })}</div></section>
    <section class="sec tight"><div class="wrap">${reviews()}</div></section>
    ${bookBanner("Come Hungry", "bar")}`;
    quotes(main);
  },

  menu(main) {
    const cats = CATEGORIES;
    main.innerHTML = `${pageHero("Discover", "Our Menu", "Every dish has its own page with the story behind it, the portion and what to pair it with.", "cuts-tools", "Menu")}
    <nav class="cat-tabs" aria-label="Menu sections"><div class="wrap">${cats.map((c) => `<a href="#${c.slug}">${c.name}</a>`).join("")}</div></nav>
    <div class="wrap">${cats.map((c, i) => {
      const list = DISHES.filter((d) => d.cat === c.slug);
      return `<section class="cat-block" id="${c.slug}">
        <div class="cat-top"><span class="plate rv z" ${i % 2 ? 'style="order:0"' : ""}><img src="${c.img}" alt="" loading="lazy"></span>
        <div class="rv r"><span class="script">${c.script}</span><h2>${c.name}</h2><p>${c.line}</p></div></div>
        <div class="dish-list">${list.map(dishRow).join("")}
        ${c.slug === "drinks" ? DRINKS.map(([n, l, p]) => `<div class="dish-row rv" style="grid-template-columns:1fr"><div><div class="t"><h3>${esc(n)}</h3><span class="dots"></span><span class="price">${rs(p)}</span></div><p>${esc(l)}</p></div></div>`).join("") : ""}</div>
      </section>`;
    }).join("")}
    <p class="small muted center" style="margin:60px 0 0">Prices include tax. All meat is halal. Please tell us about any allergies when you order.</p></div>
    <div style="height:100px"></div>${bookBanner("Hungry Yet?", "fine-table")}`;
    // highlight current tab
    const tabs = $$(".cat-tabs a", main);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) tabs.forEach((t) => t.classList.toggle("on", t.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    $$(".cat-block", main).forEach((s) => io.observe(s));
  },

  dish(main) {
    const slug = new URLSearchParams(location.search).get("d");
    const d = DISHES.find((x) => x.slug === slug) || DISHES.find((x) => x.slug === "ribeye");
    const cat = CATEGORIES.find((c) => c.slug === d.cat);
    document.title = `${d.name} | ${SITE.full}`;
    const rel = DISHES.filter((x) => x.cat === d.cat && x.slug !== d.slug).concat(DISHES.filter((x) => x.cat !== d.cat && x.cat === "steaks")).slice(0, 3);
    main.innerHTML = `<section class="dish-hero">
      ${deco("dust", "left:-60px;top:24%;width:460px", .3, 0, "hide-sm")}
      <div class="wrap">
        <div style="position:relative;justify-self:center">${deco("rosemary", "right:-6%;top:-8%;width:110px", -.5, 25)}${deco("thyme", "left:-10%;bottom:-6%;width:120px", .6, -20, "hide-sm")}
          <span class="plate rv z" data-par="-.12" data-rot="-10"><img src="${d.img}" alt="${esc(d.name)}"></span></div>
        <div>
          <div class="crumbs rv" style="margin:0 0 18px"><a href="index.html">Home</a> / <a href="menu.html">Menu</a> / <a href="menu.html#${cat.slug}">${cat.name}</a></div>
          <span class="script rv">${cat.script}</span>
          <h1 class="rv d1">${esc(d.name)}</h1>
          <div class="price rv d1">${rs(d.price)} ${d.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <p class="rv d2">${esc(d.story)}</p>
          <div class="facts rv d2"><div><span>Portion</span><b>${esc(d.weight)}</b></div><div><span>Category</span><b>${cat.name.split(" ")[0]}</b></div><div><span>Pairs with</span><b>${esc(d.pair || "Our steaks")}</b></div></div>
          <div class="actions rv d3"><a class="btn solid" href="reservations.html?dish=${d.slug}">Reserve a Table</a>
            <a class="btn" href="${waLink(`Hi, I'd like to ask about the ${d.name} at ${SITE.name}.`)}" target="_blank" rel="noopener">${WA} Ask on WhatsApp</a></div>
        </div>
      </div></section>
    ${d.cat === "steaks" ? `<section class="sec tight"><div class="wrap"><div class="sec-head center rv"><span class="script">How would you like it?</span><h2>Choose Your Doneness</h2></div>${doneness()}</div></section>` : ""}
    <section class="sec"><div class="wrap"><div class="sec-head center rv"><span class="script">You may also like</span><h2>From the Same Kitchen</h2></div>
      <div class="related">${rel.map((r, i) => `<a class="rel rv d${i + 1}" href="dish.html?d=${r.slug}"><span class="plate"><img src="${r.img}" alt="" loading="lazy"></span><h3>${esc(r.name)}</h3><span class="price">${rs(r.price)}</span></a>`).join("")}</div>
      <div class="center rv" style="margin-top:60px"><a class="btn" href="menu.html">Back to the Menu</a></div></div></section>`;
  },

  cuts(main) {
    main.innerHTML = `${pageHero("The craft", "Steak Guide", "Not sure what to order? Here is how we think about cuts, ageing and doneness.", "cuts-lineup", "Steak Guide")}
    <section class="sec tight"><div class="wrap"><div class="sec-head rv"><span class="script">Know your cut</span><h2>Six Cuts, Six Characters</h2></div>
      <div class="cut-grid">${CUTS.map((c, i) => `<div class="cut rv d${i % 3}"><span class="n">0${i + 1}</span><h3>${c.name}</h3><p>${c.note}</p><p class="small" style="color:var(--copper);margin-top:8px">Best at: ${c.best}</p></div>`).join("")}</div></div></section>
    <section class="sec"><div class="wrap"><div class="sec-head center rv"><span class="script">Temperature</span><h2>Choose Your Doneness</h2><p>Our chefs use a probe thermometer for every steak. These are the core temperatures after resting.</p></div>${doneness()}</div></section>
    <section class="sec" style="padding-top:0">${deco("dust", "left:4%;top:0;width:320px", .4, 0, "hide-sm")}<div class="wrap">${featureCard({ script: "Dry ageing", title: "Why We Age Our Beef", pic: "raw-board", link: "dish.html?d=tomahawk", linkText: "Try the 28-day tomahawk",
      body: `<p>Fresh beef is good. Aged beef is great. In 28 days in our ageing room the meat loses around 15% of its water, which concentrates the flavour, while natural enzymes break down the tough fibres.</p><p>The result is a steak with a deeper, nutty flavour and a softer bite.</p>` })}</div></section>
    <section class="sec tight"><div class="wrap"><div class="sec-head center rv"><span class="script">Good to know</span><h2>Questions We Hear</h2></div><div class="faq" style="max-width:820px;margin:0 auto">${FAQ.map(([q, a]) => `<details class="rv"><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></div></section>
    ${bookBanner("Book Your Table", "sliced-steak")}`;
  },

  events(main) {
    main.innerHTML = `${pageHero("Discover", "Upcoming Events", "BBQ nights, masterclasses, family brunches and private dining for up to 22 guests.", "toast", "Events")}
    <section class="sec tight"><div class="wrap"><div class="cards-2">${EVENTS.map((e, i) => `<article class="tile rv d${i % 2 + 1}">
      <div class="im"><img src="${e.img}" alt="" loading="lazy"></div>
      <div class="bd"><span class="kicker">${esc(e.type)} · ${esc(e.date)}</span><h3>${esc(e.title)}</h3><p>${esc(e.line)}</p><p class="small muted">${esc(e.time)}</p>
      <a class="more" href="reservations.html?event=${e.slug}">Reserve for this event</a></div></article>`).join("")}</div></div></section>
    <section class="sec">${deco("thyme", "right:5%;top:10px;width:120px", -.5, 20, "hide-sm")}<div class="wrap">${featureCard({ script: "Private dining", title: "The Oak Room", pic: "fine-table", flip: true, link: waLink(`Hi, I'd like to ask about booking the private room at ${SITE.name}.`), linkText: "Ask on WhatsApp",
      body: `<p>Birthdays, anniversaries, client dinners and mehndi-night family dinners. Our private room seats up to 22 guests with its own server, a set menu of your choice and a screen for presentations.</p><p>Set menus start from Rs 7,500 per guest.</p>` })}</div></section>
    ${bookBanner("Plan Your Evening", "bar-warm")}`;
  },

  gallery(main) {
    main.innerHTML = `${pageHero("A look inside", "Gallery", "The dining room, the grill and a few plates we are proud of.", "interior-2", "Gallery")}
    <section class="sec tight"><div class="wrap"><div class="gallery">${GALLERY.map(([n, c], i) => `<figure class="rv d${i % 3}"><img src="${img(n)}" alt="${esc(c)}" loading="lazy"><figcaption>${esc(c)}</figcaption></figure>`).join("")}</div></div></section>
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo"><button aria-label="Close">×</button><div><img alt=""><p></p></div></div>
    ${bookBanner()}`;
    const lb = $(".lightbox", main);
    $$(".gallery figure", main).forEach((f) => f.addEventListener("click", () => { const i = $("img", f); $("img", lb).src = i.src; $("img", lb).alt = i.alt; $("p", lb).textContent = i.alt; lb.classList.add("on"); }));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "BUTTON") lb.classList.remove("on"); });
    addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("on"); });
  },

  contact(main) {
    main.innerHTML = `${pageHero("Say hello", "Contact", "Call, WhatsApp or drop by. We are on MM Alam Road, next to the main roundabout.", "bar", "Contact")}
    <section class="sec tight"><div class="wrap contact-grid">
      <div class="rv l"><span class="script">Find us</span><h2 style="font-size:34px">Visit ${esc(SITE.name)}</h2>
        <div class="info-list">
          <div><i>${ICON.pin}</i><div><h4>Address</h4><p>${esc(SITE.address)}</p></div></div>
          <div><i>${ICON.clock}</i><div><h4>Opening hours</h4>${SITE.hours.map(([d, h]) => `<p>${esc(d)}: <span class="muted">${esc(h)}</span></p>`).join("")}</div></div>
          <div><i>${ICON.phone}</i><div><h4>Reservations</h4><p><a href="tel:${SITE.phone.replace(/\s/g, "")}">${esc(SITE.phone)}</a></p></div></div>
          <div><i>${ICON.mail}</i><div><h4>Email</h4><p><a href="mailto:${SITE.email}">${esc(SITE.email)}</a></p></div></div>
        </div>
        <div class="actions" style="margin-top:34px"><a class="btn solid" href="reservations.html">Book a Table</a><a class="btn" href="${waLink()}" target="_blank" rel="noopener">${WA} WhatsApp</a></div>
      </div>
      <div class="rv r map-box" style="background:var(--bg-2) url(${img("bar")}) center/cover"><iframe class="map" title="Map" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=15&output=embed"></iframe><a class="btn solid map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}" target="_blank" rel="noopener">Open in Google Maps</a></div>
    </div></section>
    <section class="sec"><div class="wrap"><div class="sec-head center rv"><span class="script">Good to know</span><h2>Before You Visit</h2></div><div class="faq" style="max-width:820px;margin:0 auto">${FAQ.map(([q, a]) => `<details class="rv"><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></div></section>`;
  },

  reservations(main) {
    const qp = new URLSearchParams(location.search);
    const ev = EVENTS.find((e) => e.slug === qp.get("event"));
    const dish = DISHES.find((d) => d.slug === qp.get("dish"));
    const today = new Date(); const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const max = new Date(); max.setDate(max.getDate() + 60);
    main.innerHTML = `${pageHero("Reservation", "Book Your Table", "Pick a date, a time and how many of you are coming. We confirm every booking by call or WhatsApp.", "interior", "Reservations")}
    <section class="sec tight">${deco("dust", "left:2%;top:0;width:360px", .4, 0, "hide-sm")}<div class="wrap book-layout">
      <form class="form-card rv" id="book-form" novalidate>
        <span class="script">Online booking</span><h2>Reserve a Table</h2>
        <p class="small">Tables are held for 15 minutes after your booking time.</p>
        <div class="form-grid">
          <div class="field full"><label>Guests</label><div class="party" id="party">${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<button type="button" data-n="${n}" class="${n === 2 ? "on" : ""}">${n}</button>`).join("")}<button type="button" data-n="10">9+</button></div></div>
          <div class="field"><label for="date">Date</label><input id="date" type="date" min="${iso(today)}" max="${iso(max)}" value="${iso(today)}" required></div>
          <div class="field"><label for="area">Seating</label><select id="area">${SITE.areas.map((a) => `<option>${a}</option>`).join("")}</select></div>
          <div class="field full"><label>Time</label><div class="slots" id="slots"></div></div>
          <div class="field"><label for="name">Full name</label><input id="name" autocomplete="name" required></div>
          <div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" type="tel" autocomplete="tel" placeholder="03xx xxxxxxx" required></div>
          <div class="field"><label for="email">Email (optional)</label><input id="email" type="email" autocomplete="email"></div>
          <div class="field"><label for="occasion">Occasion</label><select id="occasion"><option value="">None</option>${["Birthday", "Anniversary", "Business dinner", "Date night", "Family dinner"].concat(EVENTS.map((e) => e.title)).map((o) => `<option ${ev && ev.title === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div class="field full"><label for="notes">Special requests</label><textarea id="notes" placeholder="High chair, allergies, a cake with a name...">${dish ? esc(`Would like to try the ${dish.name}.`) : ""}</textarea></div>
        </div>
        <button class="btn dark" type="submit" style="margin-top:28px">Request Booking</button>
        <p class="form-error" id="err" role="alert"></p>
      </form>
      <aside class="aside">
        <div class="box rv d1"><h3>Opening hours</h3>${SITE.hours.map(([d, h]) => `<div class="row"><span>${esc(d)}</span><span class="muted">${esc(h)}</span></div>`).join("")}</div>
        <div class="box rv d2"><h3>Large group?</h3><p class="small">For more than 10 guests or the private Oak Room, message us and we will send set menus.</p><a class="btn" href="${waLink(`Hi, I'd like to book for a large group at ${SITE.name}.`)}" target="_blank" rel="noopener">${WA} WhatsApp us</a></div>
        <div class="box rv d3"><h3>Good to know</h3><p class="small" style="margin:0">All meat is halal. Free valet parking. Smart casual dress code at dinner on weekends.</p></div>
      </aside>
    </div></section>`;
    bookingForm(main);
  },
};

function reviews() {
  return `<div class="quote rv"><span class="script">Kind words</span><div id="q-box">${REVIEWS.map(([t, n, s], i) => `<div ${i ? "hidden" : ""}><blockquote>“${esc(t)}”</blockquote><cite>${esc(n)} · ${esc(s)}</cite></div>`).join("")}</div>
  <div class="q-dots">${REVIEWS.map((_, i) => `<button class="${i ? "" : "on"}" aria-label="Review ${i + 1}"></button>`).join("")}</div></div>`;
}
function quotes(root) {
  const items = $$("#q-box > div", root), dots = $$(".q-dots button", root);
  if (!items.length) return;
  let i = 0; const show = (n) => { i = n; items.forEach((el, k) => (el.hidden = k !== n)); dots.forEach((d, k) => d.classList.toggle("on", k === n)); };
  dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
  setInterval(() => show((i + 1) % items.length), 7000);
}
function doneness() {
  return `<div class="doneness">${DONENESS.map(([n, t, d, c], i) => `<div class="don rv d${i % 3}"><i style="background:radial-gradient(circle, ${c} 45%, #7a4a35 46%)"></i><h3>${n}</h3><b>${t}</b><p>${d}</p></div>`).join("")}</div>`;
}

/* ---------- booking form ---------- */
function bookingForm(root) {
  const f = $("#book-form", root), err = $("#err", root), box = $("#slots", root), dateEl = $("#date", root);
  let guests = 2, time = "";
  $$("#party button", root).forEach((b) => b.addEventListener("click", () => { guests = +b.dataset.n; $$("#party button", root).forEach((x) => x.classList.toggle("on", x === b)); }));
  async function renderSlots() {
    const date = dateEl.value; time = "";
    if (!date) { box.innerHTML = ""; return; }
    const full = await bookedSlots(date);
    const now = new Date(); const isToday = date === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const hm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const btn = (s) => `<button type="button" class="slot" data-t="${s}" ${full.includes(s) || (isToday && s <= hm) ? "disabled" : ""}>${fmt(s)}</button>`;
    box.innerHTML = `<span class="slots-group">Lunch</span>${SITE.slots.filter((s) => s < "17:00").map(btn).join("")}<span class="slots-group">Dinner</span>${SITE.slots.filter((s) => s >= "17:00").map(btn).join("")}`;
    $$(".slot", box).forEach((b) => b.addEventListener("click", () => { time = b.dataset.t; $$(".slot", box).forEach((x) => x.classList.toggle("on", x === b)); }));
  }
  dateEl.addEventListener("change", renderSlots); renderSlots();
  f.addEventListener("submit", async (e) => {
    e.preventDefault(); err.textContent = "";
    const data = { name: $("#name", f).value.trim(), phone: $("#phone", f).value.trim(), email: $("#email", f).value.trim(), guests, date: dateEl.value, time, area: $("#area", f).value, occasion: $("#occasion", f).value, notes: $("#notes", f).value.trim() };
    if (!data.time) return (err.textContent = "Please choose a time.");
    if (data.name.length < 2) return (err.textContent = "Please enter your name.");
    if (data.phone.replace(/\D/g, "").length < 10) return (err.textContent = "Please enter a phone number we can reach you on.");
    const b = $("button[type=submit]", f); b.disabled = true; b.textContent = "Sending...";
    try {
      await submitBooking(data);
      const when = `${new Date(data.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at ${fmt(data.time)}`;
      f.classList.add("success");
      f.innerHTML = `<span class="script">Thank you</span><h2>See you soon, <em>${esc(data.name.split(" ")[0])}</em></h2>
        <p style="margin:16px 0">Your request for <b>${data.guests} ${data.guests === 1 ? "guest" : "guests"}</b> on <b>${esc(when)}</b> (${esc(data.area)}) is with our host team. We will call or WhatsApp you shortly to confirm.</p>
        <div class="actions"><a class="btn dark" href="${waLink(`Assalam o Alaikum, I just requested a table for ${data.guests} on ${when}. Name: ${data.name}.`)}" target="_blank" rel="noopener">${WA} Confirm faster on WhatsApp</a><a class="more" href="menu.html">Browse the menu</a></div>`;
      f.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (ex) { err.textContent = ex.message || "Something went wrong. Please call or WhatsApp us."; b.disabled = false; b.textContent = "Request Booking"; renderSlots(); }
  });
}
export const fmt = (t) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };

/* ---------- boot ---------- */
const page = document.body.dataset.page;
const main = $("#main");
shell(page);
(PAGES[page] || PAGES.index)(main);
motion();
const done = () => document.body.classList.add("loaded");
if (document.readyState === "complete") setTimeout(done, 300); else addEventListener("load", () => setTimeout(done, 200));
setTimeout(done, 2500);
