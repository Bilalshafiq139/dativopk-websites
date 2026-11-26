# Ismail Valley · concept website (pitch, not published)

A concept website prepared by DATIVOPK for Ismail Valley, a private housing society on Main Daewoo Road, Faisalabad (developer: Mehar Estate Developers).
It is **not** the official site. Rates, plot numbers, the master plan layout and all photos are illustrative stock content until the developer provides their own figures, photos, logo and team pictures with permission.

Pages: home, plots & interactive master plan (filter, click a plot, request it), payment plan calculator (25% down + 18 installments, schedule table), gallery, about & management (placeholders), contact with map, staff dashboard (`admin.html`, password `admin123`: booking requests, plot inventory status that updates the map, messages).

Run: `docker compose up -d --build` then open http://localhost:8091. Without Docker it runs in demo mode (browser storage).

Before going live: replace `js/data.js` rates/blocks/team, swap `assets/img` with the society's own photos, remove the concept bar in `js/layout.js`, and remove `noindex` from the page heads.

## Photo sources (prototype only)
`assets/img/real/`: main gate from the public Ismail Valley Facebook page; houses and interiors from public property listings on jaageer.com and zameen.com (some carry the portal's faint watermark). Use only for a private pitch; before going live get the developer's own original photos and permission.
`assets/img/` (other files): Pexels stock, used only for illustrative amenities and the master plan background.
