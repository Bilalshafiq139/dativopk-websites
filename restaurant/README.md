# Ember & Oak Steakhouse (demo website)

Premium multi-page steakhouse website in a dark, copper and serif style, with a table reservation form, a WhatsApp button and a small host-stand admin panel. Static HTML/CSS/JS served by nginx, plus a tiny Node API, all in Docker.

## Run with Docker
```
docker compose up -d --build
```
Open http://localhost:8082 (academy uses 8080 and dentist uses 8081, so all three can run together).

Admin panel: http://localhost:8082/admin.html (password `admin123`).
Change the password: put `ADMIN_PASSWORD=yourpassword` in a `.env` file next to docker-compose.yml, then `docker compose up -d`.
Reservations are saved in the Docker volume `reservations`. On first start it is filled with 64 sample bookings (past, today and upcoming) for demos; set `SEED=false` on the api service to start empty.
`TABLES_PER_SLOT` (default 6) is how many bookings one time slot takes before it shows as full.

Stop: `docker compose down`

## Run without Docker (quick preview)
```
python -m http.server 8082
```
Without Docker the site runs in **demo mode**: bookings and the admin panel save to the browser only.

## Pages
- index.html: home (hero, our story, menu zig-zag, events, ingredients, reviews, book banner)
- about.html: story, numbers, kitchen team, the craft
- menu.html: full menu by category with prices
- dish.html?d=<slug>: every dish has its own page (story, portion, pairing, doneness guide, related dishes)
- cuts.html: steak guide (cuts, doneness, dry ageing, FAQ)
- events.html: events and private dining
- gallery.html: photo gallery with lightbox
- contact.html: address, hours, map, FAQ
- reservations.html: table booking (guests, date, live time slots, seating, occasion)
- admin.html: host stand (today's KPIs, tonight by time, 7-day covers, confirm / seat / done / no-show / cancel, table numbers, WhatsApp confirmation, walk-ins, search, filters, CSV export)

## Editing for a real client
- Name, phone, WhatsApp, address, hours, time slots, seating areas: `js/data.js` (SITE). Also page titles in the .html files and the logo text in admin.html.
- Menu, prices, events, team, reviews, FAQ: `js/data.js`
- Colours and fonts: top of `css/style.css` (:root)
- Photos are in assets/img. They are free-licence photos from Unsplash (unsplash.com/license: free for commercial use, no attribution required). Swap in the client's own photos with the same file names.
- The flour dust and herb sprigs (`dust-*.png`, `rosemary.svg`, `thyme.svg`) were generated for this project.

Design direction inspired by a steakhouse homepage concept on Dribbble; all text, code and images here are our own or freely licensed.
