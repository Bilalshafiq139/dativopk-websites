// Shared engine for the course stories: an app window that changes one fixed step per scroll.
// An app is { el, stages, setStage(n), width, narrowWidth }.
export function runStory({ mount, story, app, onStage = () => {} }) {
  mount.appendChild(app.el);
  let current = -1;
  const STEP = () => window.innerHeight * 0.85;
  function set(n) {
    if (n === current) return;
    current = n;
    app.setStage(n);
    onStage(n);
  }
  function read() {
    const top = -story.getBoundingClientRect().top;
    set(Math.max(0, Math.min(app.stages - 1, Math.floor((top + STEP() * 0.35) / STEP()))));
  }
  function fit() {
    const box = mount.getBoundingClientRect();
    const narrow = box.width < 700;
    app.el.classList.toggle("narrow", narrow);
    const s = Math.min(1.15, box.width / ((narrow ? app.narrowWidth : app.width) + 2), box.height / 512);
    app.el.style.setProperty("--s", s.toFixed(3));
  }
  window.addEventListener("scroll", read, { passive: true });
  window.addEventListener("resize", () => { fit(); read(); });
  fit(); read();
  return { goTo(n) { window.scrollTo({ top: story.offsetTop + n * STEP() + 2, behavior: "smooth" }); } };
}

// small helpers for the apps
export const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
export function typer(el) {
  let t;
  return (text, delay = 250, speed = 16) => {
    clearInterval(t); el.textContent = "";
    let k = 0;
    setTimeout(() => { clearInterval(t); t = setInterval(() => { el.textContent = text.slice(0, ++k); if (k >= text.length) clearInterval(t); }, speed); }, delay);
  };
}
// window chrome shared by all apps
export function chrome({ icon, name, note, tabs }) {
  const el = h("div", "app s0");
  el.innerHTML = `
    <div class="app-title"><span class="app-logo">${icon}</span><span class="app-name">${name}</span><span class="app-note">${note}</span><span class="xl-win"><i></i><i></i><i></i></span></div>
    <div class="app-tabs">${tabs.map((t, i) => `<span data-i="${i}"><b>${i + 1}</b>${t}</span>`).join("")}</div>
    <div class="app-body"></div>
    <div class="app-status"><span class="st"></span><span class="st2"></span></div>`;
  const tabEls = [...el.querySelectorAll(".app-tabs span")];
  return {
    el, body: el.querySelector(".app-body"),
    status(a, b = "") { el.querySelector(".st").textContent = a; el.querySelector(".st2").textContent = b; },
    stage(n) {
      el.className = el.className.replace(/\bs\d\b/, "s" + n);
      tabEls.forEach((t, i) => { t.classList.toggle("on", i === n); t.classList.toggle("done", i < n); });
    },
  };
}
