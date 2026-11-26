// Draws an illustrative master plan as SVG: Daewoo Road, the main gate, a boulevard, four blocks of plots,
// a central park and mosque. Every plot is clickable and coloured by its live status.
import { BLOCKS } from "./data.js";

// block region: x, y, cols, rows, plot w/h, gap
const REG = {
  A: { x: 60, y: 60, cols: 8, rows: 3, w: 46, h: 46 },
  B: { x: 560, y: 60, cols: 8, rows: 3, w: 46, h: 46 },
  C: { x: 600, y: 300, cols: 9, rows: 4, w: 38, h: 38 },
  M: { x: 560, y: 505, cols: 6, rows: 2, w: 30, h: 32 },
};
export function planSvg(plots, { animate = true } = {}) {
  const parts = [];
  parts.push(`<rect x="0" y="0" width="1000" height="640" rx="18" fill="#e9e3d2"/>`);
  parts.push(`<rect class="road" x="0" y="580" width="1000" height="42"/><text class="lbl" x="24" y="607">DAEWOO ROAD</text>`);
  parts.push(`<rect class="road" x="480" y="30" width="40" height="560"/><text class="lbl" x="512" y="300" transform="rotate(-90 512 300)">MAIN BOULEVARD</text>`);
  parts.push(`<rect class="road" x="40" y="246" width="920" height="28"/>`);
  parts.push(`<rect x="470" y="560" width="60" height="22" rx="4" fill="#0f3d2e"/><text x="500" y="575" text-anchor="middle" style="font:700 10px Manrope,sans-serif;fill:#c9a24b">GATE</text>`);
  parts.push(`<rect class="green" x="70" y="300" width="230" height="150" rx="16"/><text class="lbl" x="185" y="380" text-anchor="middle">CENTRAL PARK</text>`);
  parts.push(`<rect x="330" y="300" width="120" height="110" rx="12" fill="#d8cfb6"/><circle cx="390" cy="345" r="18" fill="#fbfaf6"/><text class="lbl" x="390" y="395" text-anchor="middle">JAMIA MOSQUE</text>`);
  parts.push(`<rect class="green" x="70" y="470" width="230" height="90" rx="14"/><text class="lbl" x="185" y="520" text-anchor="middle">GREEN BELT</text>`);
  for (const b of BLOCKS) {
    const r = REG[b.id], list = plots.filter((p) => p.block === b.id);
    parts.push(`<text class="lbl" x="${r.x}" y="${r.y - 10}" style="fill:${b.color}">${b.name.toUpperCase()}</text>`);
    list.forEach((p, i) => {
      const c = i % r.cols, row = Math.floor(i / r.cols);
      const x = r.x + c * (r.w + 4), y = r.y + row * (r.h + 4) + (row >= 2 && b.id !== "M" ? 10 : 0);
      parts.push(`<rect class="plot ${p.status}${animate ? " grow" : ""}" data-plot="${p.id}" x="${x}" y="${y}" width="${r.w}" height="${r.h}" rx="4" style="animation-delay:${(i * 18) % 900}ms"><title>${p.id} · ${p.size} marla · ${p.status}</title></rect>`);
    });
  }
  return `<svg viewBox="0 0 1000 640" role="img" aria-label="Illustrative master plan of Ismail Valley">${parts.join("")}</svg>`;
}
