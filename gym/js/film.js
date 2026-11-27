// The home page "film": a 5 am training session told in chapters while you scroll.
// Black screen and a clock, then letterbox bars open on the gym; each chapter crossfades a full-screen
// photo with a slow push-in, a chapter title, subtitles and a running timecode. Ends on a call to action.
import { CHAPTERS } from "./data.js";
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (t) => t * t * (3 - 2 * t);
const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;

export function startFilm(root) {
  const n = CHAPTERS.length, U = n + 2; // intro + chapters + ending
  root.style.height = U * 100 + "vh";
  const stick = root.querySelector(".film-stick");
  stick.insertAdjacentHTML("afterbegin", CHAPTERS.map((c, i) => `<div class="shot" data-i="${i}"><img src="assets/img/${c.img}.webp" alt="" style="object-position:${c.pos}" ${i > 1 ? 'loading="lazy"' : ""}></div>`).join(""));
  const shots = [...stick.querySelectorAll(".shot")];
  const $ = (s) => stick.querySelector(s);
  const top = $(".bar.top"), bot = $(".bar.bot"), intro = $(".intro"), chap = $(".chap"), subs = $(".subs"), tl = $(".hud.tl"), tr = $(".hud.tr"), reel = $(".reel"), end = $(".film-end");
  const timeEl = $("#tc"), reelBar = $(".reel i");
  document.body.dataset.film = "1";

  // intro typewriter
  const line = "Lahore is asleep.", out = $("#introLine");
  let k = 0; const type = () => { out.textContent = line.slice(0, ++k); if (k < line.length) setTimeout(type, 70 + Math.random() * 60); };
  setTimeout(type, 700);

  let cur = -1, mx = 0, my = 0, tx = 0, ty = 0, visible = true;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  function setChapter(c) {
    if (c === cur) return; cur = c;
    shots.forEach((s, i) => s.classList.toggle("on", i === c));
    chap.classList.remove("on");
    subs.querySelectorAll("p").forEach((p) => p.classList.remove("on"));
    if (c < 0) return;
    const ch = CHAPTERS[c];
    setTimeout(() => {
      chap.innerHTML = `<span class="kicker">Chapter ${ch.n} &nbsp;/&nbsp; ${String(n).padStart(2, "0")}</span><h2>${ch.title}</h2>`;
      subs.innerHTML = ch.sub.map((s) => `<p>${s}</p>`).join("");
      tr.innerHTML = `<b>${ch.n}</b> / ${String(n).padStart(2, "0")} &nbsp;·&nbsp; ${ch.title}`;
      requestAnimationFrame(() => chap.classList.add("on"));
    }, 220);
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const r = root.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
    const x = p * (U - 1);
    tx = lerp(tx, mx, 0.05); ty = lerp(ty, my, 0.05);

    // letterbox: closed at the start, opens to cinema bars during the film
    const open = ease(clamp(x / 0.9));
    const vh = innerHeight, small = vh * 0.09, h = lerp(vh / 2, small, open);
    top.style.transform = `translateY(${-(vh / 2 - h)}px)`; bot.style.transform = `translateY(${vh / 2 - h}px)`;
    intro.style.opacity = String(clamp(1 - x / 0.5));

    const c = x < 0.55 ? -1 : Math.min(n - 1, Math.floor(x - 0.55));
    setChapter(c);
    const inFilm = c >= 0 && x < n + 0.55;
    [tl, tr, reel].forEach((el) => el.classList.toggle("on", inFilm));
    const ended = x >= n + 0.55;
    end.classList.toggle("on", ended);
    chap.style.opacity = subs.style.opacity = ended ? "0" : "1";
    if (c >= 0) {
      const t = clamp(x - 0.55 - c);
      const ch = CHAPTERS[c], next = CHAPTERS[c + 1];
      const m = lerp(toMin(ch.time), next ? toMin(next.time) : toMin(ch.time) + 12, t);
      timeEl.textContent = fmt(m) + ":" + String(Math.floor((m % 1) * 60)).padStart(2, "0");
      const ps = subs.querySelectorAll("p");
      if (ps[0]) ps[0].classList.toggle("on", t > 0.12 && t < 0.92);
      if (ps[1]) ps[1].classList.toggle("on", t > 0.42 && t < 0.92);
      const s = reduce ? 1.04 : 1.14 - 0.1 * t;
      shots[c].querySelector("img").style.transform = `scale(${s.toFixed(4)}) translate3d(${(-tx * 18).toFixed(1)}px,${(-ty * 12).toFixed(1)}px,0)`;
      reelBar.style.width = (clamp((x - 0.55) / n) * 100).toFixed(2) + "%";
    }
    shots[n - 1].querySelector("img").style.filter = x >= n + 0.55 ? "saturate(.6) brightness(.45)" : "";
    document.body.dataset.solid = p >= 0.999 ? "1" : "";
  }
  requestAnimationFrame(frame);
  return true;
}
