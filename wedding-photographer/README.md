# Dastaan Studio: Pakistani wedding photographer demo

A multi-page website for a wedding photography and films studio in Pakistan, with a package builder, WhatsApp-first booking and a small admin panel.
"Dastaan Studio" is a placeholder name. Change it (and phone, WhatsApp, email, address, prices, packages, stories) in `js/data.js`.

## Pages
- `index.html` home
- `services.html` 12 services: Mehndi, Barat, Nikkah, Walima, bridal, pre-wedding, engagement, aqiqa, corporate, drone, films, albums
- `packages.html` Classic / Signature / Shahi packages in PKR, a live package builder (events, team size, city travel, extras) that sends the estimate on WhatsApp, add-ons and FAQ
- `portfolio.html` filterable gallery with lightbox (`?cat=bridal|mehndi|barat|nikkah|walima|couples|events`)
- `stories.html` and `story.html?s=<slug>` wedding stories
- `films.html` films with a preview player
- `about.html` story, values, process, team
- `contact.html` booking request form (multi-event, city, venue, guests, package, budget) + "Send via WhatsApp"
- `admin.html` bookings desk: requests, quotes, advances, balance due, upcoming shaadiyan. Password: `admin123`

Inner pages are generated from `src/pages/*.html` plus `src/head.html`. After editing a page there, run `python src/build.py`.

## Run with Docker (port 8084)
```
docker compose up -d --build
```
Open http://localhost:8084 and http://localhost:8084/admin.html

Change the admin password with `ADMIN_PASSWORD=yourpass docker compose up -d --build`.
Booking requests are saved in the `bookings` Docker volume. Sample data is created on first start (set `SEED=false` on the api service to start empty).

## Without Docker
Open the folder with any static server. With no API, the site runs in "demo mode": requests and admin changes are kept in the browser (localStorage) with sample data.

## Photos
Free-licence photos from Unsplash (unsplash.com/license), saved in `assets/img`. Source links are in `assets/img/CREDITS.txt`.
