// Meta Ads story in an Ads Manager style window: objective → audience → creative → budget → results
import { runStory, chrome } from "../story-core.js";

const STATUS = [
  ["Draft · Campaign", "Objective: Leads"],
  ["Draft · Ad set", "Audience size 1.1M – 1.3M"],
  ["Draft · Ad", "2 creatives for A/B test"],
  ["Published", "Budget Rs 3,000 / day · 14 days"],
  ["Active · day 14", "412 leads at Rs 102 each"],
];
export function init({ mount, story, onStage }) {
  const c = chrome({ icon: "◎", name: "Ads Manager", note: "Gridline Academy · ad account", tabs: ["Objective", "Audience", "Creative", "Budget", "Results"] });
  c.el.classList.add("ad");
  const days = [8, 12, 15, 14, 22, 27, 25, 31, 34, 30, 38, 41, 46, 52];
  const mx = Math.max(...days);
  const line = days.map((v, i) => `${(i * 23 + 8).toFixed(0)} ${(92 - v / mx * 80).toFixed(1)}`).join("L");
  c.body.innerHTML = `
  <nav class="ad-tree"><span class="t0">▣ Campaign<small>Excel · Jan leads</small></span><span class="t1">▤ Ad set<small>Lahore + Karachi</small></span><span class="t2">▢ Ad<small>A/B: 2 creatives</small></span></nav>
  <div class="ad-main">
    <section class="p p0"><h4>Choose a campaign objective</h4>
      <div class="obj">${[["Awareness", "Show ads to people most likely to remember them"], ["Traffic", "Send people to your website"], ["Engagement", "Get more messages and likes"], ["Leads", "Collect sign-ups for your course"], ["App promotion", "Get people to install your app"], ["Sales", "Find people likely to buy"]].map(([t, d], i) => `<div class="${i === 3 ? "pick" : ""}" style="--d:${i * 60}ms"><b>${t}</b><span>${d}</span></div>`).join("")}</div>
      <label class="fld">Campaign name<span>Excel course · January leads</span></label></section>
    <section class="p p1"><h4>Audience</h4>
      <div class="two"><div>
        <label class="fld">Locations<span class="chips"><i>Lahore +25 km</i><i>Karachi +25 km</i></span></label>
        <label class="fld">Age<span class="range"><i></i><b>22 – 40</b></span></label>
        <label class="fld">Detailed targeting<span class="chips">${["Microsoft Excel", "Data analysis", "Accounting", "Business administration", "Job seekers"].map((t, i) => `<i style="--d:${i * 80}ms">${t}</i>`).join("")}</span></label></div>
        <div class="meter"><small>Audience definition</small><div class="dial"><svg viewBox="0 0 120 70"><path class="bg" d="M10 62A50 50 0 0 1 110 62"/><path class="fg" pathLength="1" d="M10 62A50 50 0 0 1 110 62"/></svg></div><b>Defined</b><span>Estimated size<br><strong>1.1M – 1.3M</strong> people</span></div></div></section>
    <section class="p p2"><h4>Ad creative</h4>
      <div class="two"><div>
        <label class="fld">Primary text<span>Copy-pasting for hours? In 8 weeks, go from your first formula to a live dashboard.</span></label>
        <label class="fld">Headline<span>From formulas to dashboards</span></label>
        <label class="fld">Call to action<span>Sign up ▾</span></label>
        <div class="ab"><i class="on">A · Story</i><i>B · Price</i></div></div>
        <div class="phone"><div class="post-h"><span class="av">G</span><div><b>Gridline Academy</b><small>Sponsored</small></div></div>
          <p>Copy-pasting for hours? In 8 weeks, go from your first formula to a live dashboard.</p>
          <div class="img"><div class="bars">${[30, 45, 40, 62, 80].map((v, i) => `<i style="--h:${v}%;--d:${i * 80}ms"></i>`).join("")}</div><b>Excel → live dashboards</b></div>
          <div class="post-f"><div><small>GRIDLINE.PK</small><b>From formulas to dashboards</b></div><span>Sign up</span></div></div></div></section>
    <section class="p p3"><h4>Budget &amp; schedule</h4>
      <div class="two"><div>
        <label class="fld">Daily budget<span class="big">Rs 3,000</span></label>
        <label class="fld">Schedule<span>1 Jan – 14 Jan · runs all day</span></label>
        <label class="fld">A/B test<span class="tog"><i></i>On · split 50 / 50 between creatives</span></label></div>
        <div class="sum"><small>Summary</small><p>Total spend <b>Rs 42,000</b></p><p>Estimated leads <b>18 – 35 / day</b></p><button>Publish</button><span class="pill">● Active</span></div></div></section>
    <section class="p p4"><div class="k4">${[["Leads", "412"], ["Cost per lead", "Rs 102"], ["CTR", "2.8%"], ["Reach", "186k"]].map(([k, v], i) => `<div${i === 1 ? ' class="hot"' : ""}><small>${k}</small><b>${v}</b></div>`).join("")}</div>
      <div class="two r"><div class="lc"><small>Leads per day</small><svg viewBox="0 0 320 100"><path class="ax" d="M0 94H320"/><path class="ln" pathLength="1" d="M${line}"/></svg></div>
        <table><thead><tr><th>Ad</th><th>Leads</th><th>CPL</th></tr></thead><tbody><tr class="win"><td>A · Story <em>winner</em></td><td>268</td><td>Rs 94</td></tr><tr><td>B · Price</td><td>144</td><td>Rs 117</td></tr></tbody></table></div></section>
  </div>`;
  return runStory({
    mount, story, onStage,
    app: { el: c.el, stages: 5, width: 820, narrowWidth: 560, setStage(n) { c.stage(n); c.status(...STATUS[n]); } },
  });
}
