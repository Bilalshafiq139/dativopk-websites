// "Shop the room": a photo with clickable price tags on each piece.
import { img, money, priceFor } from "./data.js";
import * as S from "./store.js";
import { esc, toast, openBag } from "./layout.js";

export function roomStage(el, room, withTitle = false) {
  const wood = S.getWood();
  const spots = room.hotspots.map((h) => ({ ...h, p: S.productById(h.p) })).filter((h) => h.p && h.p.status !== "paused");
  el.innerHTML = `<img src="${img(room.img)}" alt="${esc(room.name)} room styled with Lakri furniture">
    ${withTitle ? `<div class="room-title"><h2>${room.title}</h2><p>Tap a piece to see it.</p></div>` : ""}
    ${spots.map((h) => `<button class="hotspot" style="left:${h.x}%;top:${h.y}%" data-spot="${h.p.id}" aria-label="${esc(h.p.name)}, ${money(priceFor(h.p, wood))}"><i></i><span>${esc(h.p.name)} · ${money(priceFor(h.p, wood))}</span></button>`).join("")}`;
  el.onclick = (e) => {
    const add = e.target.closest("[data-pop-add]");
    if (add) {
      const p = S.productById(add.dataset.popAdd);
      S.addToBag(p.id, S.getWood(), p.fabric ? "ivory" : "");
      toast(`${esc(p.name)} added to your bag. <a href="#" data-open-bag>View bag</a>`);
      el.querySelector(".pop")?.remove();
      return;
    }
    const b = e.target.closest("[data-spot]");
    el.querySelector(".pop")?.remove();
    if (!b) return;
    const p = S.productById(b.dataset.spot), w = S.getWood();
    const pop = document.createElement("div");
    pop.className = "pop";
    const x = Math.min(82, Math.max(18, parseFloat(b.style.left)));
    const y = parseFloat(b.style.top);
    pop.style.left = x + "%";
    pop.style.top = (y > 55 ? `calc(${y}% - 330px)` : `calc(${y}% + 14px)`);
    pop.innerHTML = `<img src="${img(p.img)}" alt=""><div class="pp-b"><span class="mono">${esc(p.type)}</span><b style="font-family:var(--serif);font-size:22px;font-weight:400">${esc(p.name)}</b><span class="muted small">${esc(p.blurb)}</span>
      <div class="pp-row"><b>${money(priceFor(p, w))}</b><span style="display:flex;gap:6px"><a class="btn btn-line btn-sm" href="product.html?id=${p.id}&wood=${w}">View</a><button class="btn btn-dark btn-sm" data-pop-add="${p.id}">Add</button></span></div></div>`;
    el.appendChild(pop);
  };
}
