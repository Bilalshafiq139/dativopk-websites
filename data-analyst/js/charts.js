// Tiny dependency-free SVG charts: line + area with hover, volume bars, sparkline, donut, radar.
const NS = "http://www.w3.org/2000/svg";
export const INK = "#0e1726";
export const LIME = "#b3e04b";
export const PALETTE = ["#0e1726", "#5f7f2a", "#b3e04b", "#a7b1c2"];

export function fmt(v, unit) {
  if (unit === "pkr-cr") return "PKR " + v.toFixed(2) + " Cr";
  if (unit === "pct") return v.toFixed(1) + "%";
  if (unit === "min") return Math.round(v) + " min";
  return Math.round(v).toLocaleString();
}

function scale(vals, h, pad) {
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const lo = min - span * pad, hi = max + span * pad;
  return { lo, hi, y: (v) => h - ((v - lo) / (hi - lo)) * h };
}

export function sparkline(vals, { w = 110, h = 38, color = INK, fill = true } = {}) {
  const s = scale(vals, h - 4, 0.08);
  const step = w / (vals.length - 1);
  const pts = vals.map((v, i) => [i * step, s.y(v) + 2]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
  const id = "sg" + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LIME}" stop-opacity=".45"/><stop offset="1" stop-color="${LIME}" stop-opacity="0"/></linearGradient></defs>
    ${fill ? `<path d="${d}L${w} ${h}L0 ${h}Z" fill="url(#${id})"/>` : ""}
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
  </svg>`;
}

// Interactive line chart. el = container (position:relative). Returns {update(vals, labels)}
export function lineChart(el, { values, labels, unit, marker = null, markerLabel = "Project live" }) {
  el.innerHTML = "";
  const svg = document.createElementNS(NS, "svg");
  el.appendChild(svg);
  const tip = document.createElement("div");
  tip.className = "tip";
  el.appendChild(tip);
  let state = {};

  function draw(vals, labs, mark) {
    const W = el.clientWidth || 700, H = el.clientHeight || 320;
    const padR = 64, padB = 26, w = W - padR, h = H - padB;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const s = scale(vals, h, 0.12);
    const step = w / (vals.length - 1);
    const pts = vals.map((v, i) => [i * step, s.y(v)]);
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
    let grid = "";
    for (let g = 0; g <= 4; g++) {
      const y = (h / 4) * g, v = s.hi - ((s.hi - s.lo) / 4) * g;
      grid += `<line x1="0" x2="${w}" y1="${y}" y2="${y}" stroke="#e7eae5" stroke-dasharray="3 4"/>
        <text x="${w + 10}" y="${y + 4}" font-size="11" fill="#8a92a1" font-family="JetBrains Mono, monospace">${fmt(v, unit).replace("PKR ", "")}</text>`;
    }
    let xl = "";
    const every = Math.max(1, Math.round(vals.length / 6));
    for (let i = 0; i < vals.length; i += every) {
      const parts = labs[i].split(" ");
      xl += `<text x="${i * step}" y="${H - 6}" font-size="11" fill="#8a92a1" text-anchor="${i ? "middle" : "start"}">${parts[1]} ${parts[2].slice(2)}</text>`;
    }
    let mk = "";
    if (mark != null && mark > 0 && mark < vals.length) {
      const x = mark * step;
      mk = `<rect x="${x}" y="0" width="${w - x}" height="${h}" fill="#c8f169" opacity=".09"/>
        <line x1="${x}" x2="${x}" y1="0" y2="${h}" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>
        <g transform="translate(${x + 8},14)"><rect width="${markerLabel.length * 6.6 + 16}" height="22" rx="11" fill="${INK}"/><text x="8" y="15" font-size="11" fill="#c8f169" font-family="Inter Tight, sans-serif" font-weight="600">${markerLabel}</text></g>`;
    }
    svg.innerHTML = `
      <defs><linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3e04b" stop-opacity=".38"/><stop offset="1" stop-color="#b3e04b" stop-opacity="0"/></linearGradient></defs>
      ${grid}${mk}
      <path d="${d}L${w} ${h}L0 ${h}Z" fill="url(#lg-area)"/>
      <path d="${d}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" class="line-path"/>
      ${xl}
      <line class="cross" x1="0" x2="0" y1="0" y2="${h}" stroke="${INK}" stroke-dasharray="3 3" opacity="0"/>
      <circle class="dot" r="5" fill="#fff" stroke="${INK}" stroke-width="2" opacity="0"/>
      <rect class="hit" x="0" y="0" width="${w}" height="${h}" fill="transparent"/>`;
    const path = svg.querySelector(".line-path");
    const len = path.getTotalLength ? path.getTotalLength() : 0;
    if (len) {
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 1.2s ease";
      path.style.strokeDashoffset = 0;
    }
    state = { vals, labs, pts, step, w, h, W };
  }

  function move(ev) {
    const r = svg.getBoundingClientRect();
    const sx = (state.W / r.width);
    const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
    const i = Math.max(0, Math.min(state.vals.length - 1, Math.round((x * sx) / state.step)));
    const [px, py] = state.pts[i];
    svg.querySelector(".cross").setAttribute("x1", px);
    svg.querySelector(".cross").setAttribute("x2", px);
    svg.querySelector(".cross").setAttribute("opacity", ".5");
    const dot = svg.querySelector(".dot");
    dot.setAttribute("cx", px); dot.setAttribute("cy", py); dot.setAttribute("opacity", "1");
    tip.innerHTML = `<small>${state.labs[i]}</small>${fmt(state.vals[i], unit)}`;
    tip.style.left = (px / sx) + "px";
    tip.style.top = (py / sx) + "px";
    tip.style.opacity = 1;
  }
  function leave() {
    tip.style.opacity = 0;
    svg.querySelector(".cross")?.setAttribute("opacity", "0");
    svg.querySelector(".dot")?.setAttribute("opacity", "0");
  }
  svg.addEventListener("mousemove", move);
  svg.addEventListener("touchmove", move, { passive: true });
  svg.addEventListener("mouseleave", leave);

  let cur = [values, labels, marker];
  draw(...cur);
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => draw(...cur), 150); });
  return { update(v, l, m, u) { if (u) unit = u; cur = [v, l, m]; draw(v, l, m); } };
}

export function volumeBars(el, vals, mark = null) {
  const W = el.clientWidth || 700, H = el.clientHeight || 70, padR = 64, w = W - padR;
  const max = Math.max(...vals), bw = w / vals.length;
  let s = "";
  vals.forEach((v, i) => {
    const bh = (v / max) * (H - 4);
    const on = mark != null && i >= mark;
    s += `<rect x="${(i * bw + bw * 0.15).toFixed(1)}" y="${(H - bh).toFixed(1)}" width="${(bw * 0.7).toFixed(1)}" height="${bh.toFixed(1)}" rx="1.5" fill="${on ? "#0e1726" : "#d6dbd3"}"/>`;
  });
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
}

export function donut(parts, { size = 140, stroke = 22, colors = PALETTE } = {}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, total = parts.reduce((a, p) => a + p[1], 0);
  let off = 0, arcs = "";
  parts.forEach((p, i) => {
    const len = (p[1] / total) * c;
    arcs += `<circle r="${r}" cx="${size / 2}" cy="${size / 2}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${stroke}" stroke-dasharray="${(len - 2).toFixed(2)} ${(c - len + 2).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
    off += len;
  });
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Breakdown">${arcs}
    <text x="50%" y="48%" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="20" font-weight="600" fill="#0e1726">${parts[0][1]}%</text>
    <text x="50%" y="62%" text-anchor="middle" font-size="10" fill="#5d6677">${parts[0][0]}</text></svg>`;
}

export function radar(items, { size = 420 } = {}) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 70, n = items.length;
  const pt = (i, f) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
  };
  let rings = "";
  [0.25, 0.5, 0.75, 1].forEach((f) => {
    rings += `<polygon points="${items.map((_, i) => pt(i, f).join(",")).join(" ")}" fill="none" stroke="#dfe3dc"/>`;
  });
  let spokes = "", labels = "";
  items.forEach(([name, v], i) => {
    const [x, y] = pt(i, 1);
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e7eae5"/>`;
    const [lx, ly] = pt(i, 1.2);
    labels += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#1a2333" font-weight="500">${name}</text>
      <text x="${lx}" y="${ly + 16}" text-anchor="middle" font-size="11" fill="#5d6677" font-family="JetBrains Mono, monospace">${v}</text>`;
  });
  const poly = items.map(([, v], i) => pt(i, v / 100).join(",")).join(" ");
  const dots = items.map(([, v], i) => { const [x, y] = pt(i, v / 100); return `<circle cx="${x}" cy="${y}" r="4.5" fill="#0e1726" stroke="#c8f169" stroke-width="2"/>`; }).join("");
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Skills radar">${rings}${spokes}
    <polygon points="${poly}" fill="rgba(179,224,75,.28)" stroke="#0e1726" stroke-width="2" stroke-linejoin="round"/>${dots}${labels}</svg>`;
}
