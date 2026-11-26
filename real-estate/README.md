# Arz Estate · real estate agency website (demo)

A multi-page property website for an agency in Lahore, Islamabad and Karachi. "Arz Estate" is a placeholder brand; listings, agents, prices and contact details are samples. Prices are in PKR (Crore / Lakh).

Layout and motion modelled on a Dribbble real estate shot (quiet white panels on warm grey, large grotesk headings). Photos are our own picks from Pexels.

## Motion

1. **Blur-in text**: headings come into focus word by word; panels and cards rise out of a blur as you scroll.
2. **Hero**: the house photo unmasks from a centred frame and settles from a slow zoom; info chips slide in; the "homes sold" counter counts up.
3. **Search**: Buy / Rent / New developments / Commercial tabs and filters update the listing grid instantly, with cards fading in one after another.
4. **How it works**: four steps play one after another with a progress line; the photo cross-fades out of a blur and a floor plan card slides in on "Property selection".
5. **Agents**: carousel with arrows and swipe.
6. **Investment stats**: numbers tick up (Rs 8,20,00,000 in lakh grouping) while bar charts grow.
7. **Photo stack**: two photos slide out from behind the front photo as you scroll.
8. **Reviews**: rating stars pop in one by one.

All motion turns off for visitors who set "reduce motion".

## Pages

| Page | What it does |
|---|---|
| `index.html` | Hero, search + new properties, how it works, agents, investment stats and offers, smart selection |
| `properties.html` | 15 listings, filters by purpose, city, type, price, size, beds; sort; shareable URL |
| `property.html?id=…` | Gallery with lightbox, facts, features, installment calculator, book a viewing / ask / installment plan |
| `saved.html` | Homes saved with the heart button |
| `invest.html` | Stats, investment offers, book an investment call |
| `agents.html` | Six agents, filter by city |
| `about.html`, `contact.html` | Company story, counters, values; contact form and FAQ |
| `post.html` | Two-step "post a property" form for owners |
| `admin.html` | Agent dashboard: leads (status, agent, notes, WhatsApp), listings (price, available / reserved / sold / hidden, featured), submitted properties, messages. Password `admin123` |

## Run with Docker

```bash
docker compose up -d --build
```

Open http://localhost:8090 (dashboard at http://localhost:8090/admin.html). Data is saved in the `store-data` volume. Change the password with `ADMIN_PASSWORD=... docker compose up -d`.

Without Docker (any static server), the site runs in demo mode: forms and the dashboard work from the browser's local storage with sample data.

## Edit

- Listings, agents, investment offers, brand details: `js/data.js` (keep listing ids in `api/server.js` in step).
- Sample dashboard data: `js/seed-data.js`.
- Photos: `assets/img` (Pexels).
