# Chamra Leather Co. · single-product leather bag store (demo)

A one-product store for a handmade leather briefcase from Sialkot, in the style of Shopify's "Origin" theme: warm neutral background, serif type, one big product with colour options, detail photos and a dark reviews band. "Chamra" is a placeholder brand; prices are in PKR and contact details are samples.

## Pages
| Page | What it does |
|---|---|
| `index.html` | The product: photo gallery (zoom, swipe, arrows, thumbnails), Tan / Black colour switch that swaps the whole gallery, add to cart or order on WhatsApp, details accordion, statement, detail photos with parallax, features, lifestyle photos, reviews, workshop story, add-ons, FAQ, sticky add-to-cart bar |
| `craft.html` | How it's made in 4 steps, repair promise, studio photos, corporate gifting |
| `contact.html` | Studio map, hours, contact form (saved to admin) |
| `cart.html`, `checkout.html` | Cart with add-on suggestions, checkout with initials and gift note, COD / card / bank transfer |
| `admin.html` | Sales overview, orders with status and notes, product price and stock edits, messages. Password `admin123` |

## Run with Docker
Run `docker compose up -d --build`, then open http://localhost:8094 (admin at /admin.html). Without Docker the site runs in demo mode and saves to browser storage.

## Edit
Product, colours, prices, add-ons, reviews and FAQ are in `js/data.js` (keep prices in `api/server.js` in step). Sample admin data: `js/seed-data.js`.

## Photos
All photos are from one Pexels photo series of the same briefcase (free licence), so every picture matches.
