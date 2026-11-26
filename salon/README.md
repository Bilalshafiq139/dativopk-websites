# Zeenat Salon & Studio · ladies salon & bridal studio website (demo)

A multi-page website for a ladies salon in Lahore. "Zeenat" is a placeholder brand; team names, prices and contact details are samples. Prices are in PKR.

Layout modelled on a Framer salon template (full-photo hero, service photo cards, real-results gallery, stylists carousel, Google reviews, FAQ, call-back form), adapted for the Pakistani market: bridal makeup, mehndi, keratin, ladies-only team. Photos from Pexels.

## Motion
- Hero photo zooms out on load while the headline lines slide up; rating and brides counters count up.
- Header turns solid on scroll and hides when scrolling down, shows when scrolling up.
- Service cards zoom their photo and spin the arrow on hover; sections fade up on scroll; the about photo has parallax.
- Stylists carousel auto-plays, with arrows and swipe; reviews scroll in two endless rows (pause on hover).
- FAQ opens and closes smoothly; bridal and gallery photos open in a lightbox; booking steps slide in with a progress bar.

## Pages
| Page | What it does |
|---|---|
| `index.html` | Hero, about, services, results, stylists, reviews, FAQ, call-back form |
| `services.html` | Full rate list by category (hair, makeup, skin, hands/feet/mehndi) |
| `bridal.html` | Three bridal packages, bride gallery, bridal FAQ |
| `stylists.html` | Team with "book with" buttons |
| `gallery.html` | Filterable gallery with lightbox |
| `book.html` | 4-step booking: service, stylist, date & time (booked slots crossed out), details |
| `contact.html` | Map, hours, contact form |
| `admin.html` | Staff dashboard: today & upcoming, revenue by service, all appointments with status/notes, call-back requests. Password `admin123` |

## Run with Docker
`docker compose up -d --build` then open http://localhost:8092 (dashboard at /admin.html). Without Docker it runs in demo mode (browser storage).

## Edit
Services, prices, packages, team, reviews, FAQ: `js/data.js` (keep service ids in `api/server.js` in step). Sample dashboard data: `js/seed-data.js`.
