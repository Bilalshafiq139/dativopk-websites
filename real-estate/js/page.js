// Writes the shared <head> bits for inner pages is not needed (each page has its own head);
// this module only builds the simple page header used by inner pages.
import { $, blurWords, reveal } from "./layout.js";
export function pageHead(el, { crumb, title, text }) {
  el.innerHTML = `<div class="wrap"><p class="crumbs"><a href="index.html">Home</a> / ${crumb}</p>
    <div class="sec-head"><h1 data-blur>${title}</h1><p class="reveal">${text}</p></div></div>`;
  blurWords($("[data-blur]", el)); reveal(el);
}
