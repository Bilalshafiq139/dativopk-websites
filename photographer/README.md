# Zoya Malik Studio: photographer portfolio demo

A multi-page portfolio site for a portrait, wedding and product photographer, with a small admin panel for shoot enquiries.
"Zoya Malik" is a placeholder name. Change it (and phone, WhatsApp, email, address, prices, projects, blog posts) in `js/data.js`.

## Pages
- `index.html` home
- `about.html` story, stats, process, studio
- `portfolio.html` filterable gallery with lightbox (`?cat=portrait|wedding|fashion|commercial`)
- `projects.html` and `project.html?p=<slug>` case studies
- `services.html` packages, prices in PKR, FAQ
- `journal.html` and `post.html?p=<slug>` blog
- `contact.html` shoot enquiry form (shows if the date already has a booked shoot)
- `admin.html` studio desk: enquiries, status, quotes, notes, upcoming shoots. Password: `admin123`

## Run with Docker (port 8083)
```
docker compose up -d --build
```
Open http://localhost:8083 and http://localhost:8083/admin.html

Change the admin password with `ADMIN_PASSWORD=yourpass docker compose up -d --build`.
Enquiries are saved in the `enquiries` Docker volume. Sample data is created on first start (set `SEED=false` on the api service to start empty).

## Without Docker
Open the folder with any static server. With no API, the site runs in "demo mode": enquiries and admin changes are kept in the browser (localStorage) with sample data.

## Photos
Free-licence photos from Unsplash (unsplash.com/license), saved in `assets/img`.
