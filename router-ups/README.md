# Jugnu Power · 3D online store for WiFi router UPS (demo)

A multi-page 3D store for a mini UPS that keeps WiFi routers and fiber ONTs running through load-shedding. "Jugnu Power" is a placeholder brand; prices are in PKR and contact details are samples.

## 3D
- **Home:** a real-time Three.js scene of a desk, wall socket and WiFi router. Scrolling plays a load-shedding evening in five steps:
  1. The power is on and the WiFi works.
  2. The light goes, the room goes dark, the router dies and the WiFi signal turns red.
  3. Jugnu drops onto the desk and the cables re-route. Glowing current flows through them while it charges.
  4. The light goes again. The UPS switches to amber battery mode and the WiFi stays on. A live chip shows the battery percentage and the time on battery.
  5. The power comes back.
  Fireflies (jugnu) appear in the dark, and the camera follows the mouse.
- **Product page:** a rotatable, zoomable 3D model of each product. Its "Simulate load-shedding" switch dims the light and turns on the battery LEDs.
- **Models:** every product is built in code (`js/model.js`) from Three.js shapes and canvas-printed labels, so there are no model files. The product pictures in `assets/img/p-*.webp` are renders of the same models, made with `studio.html?id=mini&view=0` (an internal tool, not linked).
- **Library:** Three.js r169 is vendored in `js/vendor/`, so the Docker build works offline.
- **Fallback:** without WebGL or with reduced motion, the story shows as plain text sections and the product page shows the photos.

## Pages
| Page | What it does |
|---|---|
| `index.html` | 3D load-shedding story, compatible ISPs, stats, who it's for, product range, setup steps, reviews, FAQ |
| `shop.html` | All products with category filter, quick add to cart |
| `product.html?id=…` | 3D viewer and renders, specs, backup time by device, what's in the box |
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
- 3D product looks (size, colour, ports) are in each product's `model` field.

## Photos
The lifestyle photos are from Pexels (free licence). The product images are original renders.
