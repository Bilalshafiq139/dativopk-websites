# Gridline: Advanced Data Analytics & Excel (demo site 6)

A scroll-story course website. One 3D object (96 spreadsheet cells) transforms as you scroll:
one cell → a sheet with =SUM → lookup/pivot summary blocks → a bar chart → a finished dashboard.

## Run with Docker
```
docker compose up -d --build
```
- Site: http://localhost:8085
- Admin: http://localhost:8085/admin.html (password `admin123`, change with `ADMIN_PASSWORD=... docker compose up -d`)
- Leads are stored in the `leads` Docker volume (JSON file). Sample data is created on first start (set `SEED=false` to start empty).

## Run without Docker (preview)
Any static server works, e.g. `npx serve .` or `python -m http.server 8085`.
Forms and the admin panel then run in "demo mode" and save to the browser only.

## Where to change things
- Brand, phone, WhatsApp, address, plans, prices, curriculum, FAQs: `js/data.js`
- Colours and fonts: top of `css/style.css` (`:root`)
- The 3D story (stages, camera, colours): `js/story3d.js`
- Three.js r160 is vendored in `js/vendor` (no CDN needed).
