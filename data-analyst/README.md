# Hamza Qureshi: data analyst portfolio demo

A multi-page personal portfolio for a data analyst, with case studies that open into interactive dashboards, and a small admin panel for project enquiries.
"Hamza Qureshi", the client names (Kinara Retail, Dakhil Commerce, etc.) and all figures are placeholders. Change them in `js/data.js` (person, projects, tools) and `js/seed-data.js` (sample enquiries).

## Pages
- `index.html` home: hero, stats, featured case studies, services with PKR prices, before/after slider, process, testimonials
- `projects.html` case studies with category filter
- `project.html?id=<slug>` case study: dashboard (line chart with range buttons, before/after, breakdown donut), problem, approach, results
- `skills.html` skills radar, proficiency meters, toolbox, usage heatmap, certifications
- `about.html` story, experience timeline, education ("Download CV" prints the page as a PDF)
- `contact.html` project brief form, WhatsApp, availability calendar, FAQ
- `admin.html` enquiries inbox: KPIs, weekly chart, status, quotes, notes. Password: `admin123`

## Run with Docker (port 8086)
```
docker compose up -d --build
```
Open http://localhost:8086 and http://localhost:8086/admin.html

Change the admin password with `ADMIN_PASSWORD=yourpass docker compose up -d --build`.
Enquiries are saved in the `messages` Docker volume. Sample data is created on first start (set `SEED=false` on the api service to start empty).

## Without Docker
Open the folder with any static server. With no API, the site runs in "demo mode": enquiries and admin changes are kept in the browser (localStorage) with sample data.

## Photos
Free-licence photos from Pexels (pexels.com/license), saved in `assets/img` as WebP.
