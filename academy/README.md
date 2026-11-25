# Nexora Academy (demo website)

Multi-page 3D academy website. Static HTML/CSS/JS + Three.js, served by nginx in Docker.

## Run with Docker
```
docker compose up -d --build
```
Open http://localhost:8080

Admin panel: http://localhost:8080/admin.html (password `admin123`).
Change the password: set `ADMIN_PASSWORD=yourpassword` in a `.env` file next to docker-compose.yml, then `docker compose up -d`.
Enrollments are saved in the Docker volume `enrollments` (they survive restarts). On first start it is filled with 28 sample students for demos; set `SEED=false` on the api service to start empty.

Stop: `docker compose down`

## Run without Docker (quick preview)
```
python -m http.server 8080
```
(Opening index.html directly by double-click will not work, because the JS uses modules.)
Without Docker the site runs in **demo mode**: the form and admin panel save to the browser only.

## Pages
- index.html: home with 3D hero
- courses.html: all courses
- course.html?c=<slug>: course detail (one template, data driven)
- about.html: about and mentors
- contact.html: enrollment form and contact
- admin.html: admin panel (login, stats, enrollments table, status, CSV export)

## Services (docker-compose)
- web: nginx serving the site, proxies /api to the api service
- api: small Node.js API (api/server.js), no dependencies, stores data in a JSON file

## Editing content
- Academy name, phone, WhatsApp, email: `js/courses-data.js` (ACADEMY)
- Courses, prices, curriculum: `js/courses-data.js` (COURSES)
- Colors and fonts: top of `css/style.css` (:root)
