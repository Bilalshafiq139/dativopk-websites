# Jugnu Power · online store for WiFi router UPS (demo)

A multi-page store for a mini UPS that keeps WiFi routers and fiber ONTs running through load-shedding. "Jugnu Power" is a placeholder brand; prices are in PKR and contact details are samples.

## Motion and depth
- **Home:** a scroll story told with real full-screen photos.
  - Each photo is a depth layer that zooms slowly, tilts in 3D with the mouse and crossfades into the next.
  - The scenes are: an evening at the laptop, the power cut (flicker and blackout), a candle, Jugnu plugged in, and the WiFi still glowing in a dark room.
  - Live chips show mains on or off, WiFi online or offline, and the battery percentage with the time on battery.
- **Product page:** a photo gallery that tilts and zooms with the pointer and can be swiped on phones. Its "Simulate load-shedding" switch dims the photo and adds an amber glow.
- **Cards:** product cards tilt in 3D on hover, sections slide up on scroll, and the numbers count up.

## Pages
| Page | What it does |
|---|---|
| `index.html` | Photo scroll story, compatible ISPs, stats, who it's for, product range, setup steps, reviews, FAQ |
| `shop.html` | All products with category filter, quick add to cart |
| `product.html?id=…` | Photo gallery, specs, backup time by device, what's in the box |
| `calculator.html` | Tick your devices and set your longest load-shedding; it compares every unit and marks the smallest one that covers you |
| `guide.html` | 4-step install guide, voltage-label check, fiber (ONT and router) setup, FAQ and warranty |
| `contact.html` | Map, hours, contact form (saved to admin) |
| `cart.html`, `checkout.html` | Cart with free-delivery bar, checkout with COD, card, Easypaisa or JazzCash |
| `admin.html` | Sales overview, orders with status and notes, product price and stock edits, messages. Password `admin123` |

## Run with Docker
Run `docker compose up -d --build`, then open http://localhost:8093 (the admin is at /admin.html). Without Docker the site runs in demo mode and saves to browser storage.

## Edit
- Products, prices, devices, FAQ and reviews are in `js/data.js`. Keep the prices in `api/server.js` in step.
- Sample admin data is in `js/seed-data.js`.
- The story scenes and their photos are in `js/story.js`.

## Photos
All photos are from Pexels (free licence). The product photos are stock power banks and power stations used as stand-ins; a real client would swap in photos of their own products.
