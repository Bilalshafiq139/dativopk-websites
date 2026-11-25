# Mehr Dental Studio (demo website)

Premium multi-page dentist clinic website with a live 3D tooth, booking form, WhatsApp button and a small front-desk admin panel. Static HTML/CSS/JS + Three.js served by nginx, plus a tiny Node API, all in Docker.

## Run with Docker
```
docker compose up -d --build
```
Open http://localhost:8081  (the academy demo uses 8080, so both can run together)

Admin panel: http://localhost:8081/admin.html (password `admin123`).
Change the password: put `ADMIN_PASSWORD=yourpassword` in a `.env` file next to docker-compose.yml, then `docker compose up -d`.
Appointments are saved in the Docker volume `appointments`. On first start it is filled with ~46 sample appointments (past, today and upcoming) for demos; set `SEED=false` on the api service to start empty.

Stop: `docker compose down`

## Run without Docker (quick preview)
```
python -m http.server 8081
```
Without Docker the site runs in **demo mode**: bookings and the admin panel save to the browser only.

## Pages
- index.html: home (3D hero, first visit, treatments, aligner feature, fees, dentists, reviews, hours and map)
- treatments.html: all treatments and the fee guide
- treatment.html?t=<slug>: treatment detail (one template, data driven)
- clinic.html: story, dentists, hygiene and technology
- book.html: appointment request (treatment, dentist, date, free time slots)
- admin.html: front desk (today's chairs, 7-day load, confirm / done / no-show, search, filters, WhatsApp confirmation, add walk-ins, CSV export)

## Editing for a real client
- Clinic name, phone, WhatsApp, address, hours: `js/data.js` (CLINIC). Also the wordmark text in admin.html and the page titles.
- Treatments, prices, FAQs, doctors, reviews: `js/data.js`
- Doctor photos: put a photo in assets/img and replace the initials block (`portrait()` in js/main.js) with an `<img>`.
- Colours and fonts: top of `css/style.css` (:root)
- Images in assets/img are original 3D renders made from `js/models.js` (no stock photos). `render.html` is the tool used to render them; it is not part of the Docker image.
