// The search panel (Buy / Rent / New developments / Commercial + filters), shared by home and properties pages.
import { PURPOSES, CITIES, TYPES, pkr } from "./data.js";
import { $, $$, icon } from "./layout.js";

const PRICE = {
  buy: [["", "Any price"], ["0-50000000", "Up to 5 Crore"], ["50000000-100000000", "5 to 10 Crore"], ["100000000-200000000", "10 to 20 Crore"], ["200000000-", "Above 20 Crore"]],
  rent: [["", "Any rent"], ["0-300000", "Up to 3 Lakh / mo"], ["300000-", "Above 3 Lakh / mo"]],
  new: [["", "Any price"], ["0-25000000", "Up to 2.5 Crore"], ["25000000-", "Above 2.5 Crore"]],
  commercial: [["", "Any price"], ["0-5000000", "Rent, up to 50 Lakh / mo"], ["5000000-", "Sale, above 50 Lakh"]],
};
const SIZE = [["", "All sizes (ft²)"], ["0-3000", "Up to 3,000 ft²"], ["3000-6000", "3,000 to 6,000 ft²"], ["6000-", "Above 6,000 ft²"]];
const BEDS = [["", "Any beds"], ["2", "2+ beds"], ["3", "3+ beds"], ["4", "4+ beds"], ["5", "5+ beds"]];

export const readQuery = () => { const q = new URLSearchParams(location.search); return { purpose: q.get("purpose") || "buy", city: q.get("city") || "", type: q.get("type") || "", price: q.get("price") || "", size: q.get("size") || "", beds: q.get("beds") || "", sort: q.get("sort") || "new" }; };
const inRange = (v, r) => { if (!r) return true; const [a, b] = r.split("-"); return v >= Number(a || 0) && (b === "" || b === undefined ? true : v <= Number(b)); };
export function filter(list, f) {
  return list.filter((l) => l.purpose === f.purpose && (!f.city || l.city === f.city) && (!f.type || l.type === f.type) && inRange(l.price, f.price) && inRange(l.sqft, f.size) && (!f.beds || l.beds >= Number(f.beds)));
}
export const toQuery = (f) => new URLSearchParams(Object.entries(f).filter(([k, v]) => v && !(k === "sort" && v === "new"))).toString();

export function mountSearch(root, f, { onChange, onSubmit, submitLabel = "Show properties" }) {
  const opt = (arr, v) => arr.map(([k, n]) => `<option value="${k}"${k === v ? " selected" : ""}>${n}</option>`).join("");
  root.innerHTML = `<div class="stabs" role="tablist">${PURPOSES.map(([p, n]) => `<button type="button" role="tab" data-p="${p}" class="${p === f.purpose ? "on" : ""}" aria-selected="${p === f.purpose}">${n}</button>`).join("")}</div>
  <form class="sbox" novalidate>
    <div class="frow">
      <label><span class="skip">City</span><select class="sel" name="city">${opt([["", "All cities"], ...CITIES.map((c) => [c, c])], f.city)}</select></label>
      <label><span class="skip">Type</span><select class="sel" name="type">${opt([["", "Any property"], ...TYPES.map((c) => [c, c])], f.type)}</select></label>
      <label><span class="skip">Price</span><select class="sel" name="price"></select></label>
      <label><span class="skip">Size</span><select class="sel" name="size">${opt(SIZE, f.size)}</select></label>
    </div>
    <div class="more-row" hidden>
      <label><span class="skip">Bedrooms</span><select class="sel" name="beds">${opt(BEDS, f.beds)}</select></label>
    </div>
    <div class="fbar"><button type="button" class="more-btn" data-more>${icon.plus} More options</button>
      <span style="display:flex;gap:16px;align-items:center"><button type="button" class="clear-btn" data-clear>${icon.trash} Clear filters</button><button class="btn" type="submit">${submitLabel}</button></span></div>
  </form>`;
  const form = $("form", root);
  const setPrice = () => { form.price.innerHTML = opt(PRICE[f.purpose], f.price); };
  setPrice();
  if (f.beds) $(".more-row", root).hidden = false;
  const read = () => { const d = Object.fromEntries(new FormData(form)); Object.assign(f, d); return f; };
  $$(".stabs button", root).forEach((b) => b.addEventListener("click", () => {
    $$(".stabs button", root).forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
    f.purpose = b.dataset.p; f.price = ""; setPrice(); onChange && onChange(read());
  }));
  form.addEventListener("change", () => onChange && onChange(read()));
  $("[data-more]", root).addEventListener("click", () => { const r = $(".more-row", root); r.hidden = !r.hidden; if (!r.hidden && r.animate) r.animate([{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "ease-out" }); });
  $("[data-clear]", root).addEventListener("click", () => { form.reset(); [...form.elements].forEach((el) => { if (el.tagName === "SELECT") el.value = ""; }); Object.assign(f, { city: "", type: "", price: "", size: "", beds: "" }); onChange && onChange(f); });
  form.addEventListener("submit", (e) => { e.preventDefault(); onSubmit && onSubmit(read()); });
  return f;
}
export { pkr };
