import { sparkline } from "./charts.js";

export function projectCard(p) {
  const tail = p.series.slice(36);
  return `<a class="p-card rv" href="project.html?id=${p.id}" data-cat="${p.category}">
    <div class="img"><img src="assets/img/${p.img}.webp" alt="${p.short}" loading="lazy"><span class="tag">${p.category}</span><span class="go"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0e1726" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>
    <div class="body">
      <span class="ind">${p.industry} · ${p.year}</span>
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
      <div class="metric"><div><b>${p.metric.value}</b><small>${p.metric.label}</small></div>${sparkline(tail)}</div>
    </div>
  </a>`;
}
