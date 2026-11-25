# Lakri & Co.: furniture eCommerce store demo

A Shopify-style online store for a solid-wood furniture brand, with a store admin panel.
"Lakri & Co.", the people, phone numbers and prices are placeholders. Change the catalogue in `js/data.js` (brand, woods, fabrics, products, rooms, FAQ) and the sample orders in `js/seed-data.js`.

## Pages
- `index.html` home: hero, shop-the-room photo with price tags, four-wood selector, collection, story, reviews, swatch-box offer
- `shop.html` all pieces: room tabs, category, "Will it fit?" width filter, sort, shop-in-wood switch
- `product.html?id=<id>` product: gallery with zoom, wood + fabric swatches (price changes with wood), add to bag, buy now, delivery date, "Will it fit?" visual, story/spec/care
- `rooms.html` shop by room (living, dining, bedroom, work)
- `about.html` craft story, the four woods, how a piece is made
- `delivery.html` delivery rates by city, returns, FAQ, contact form
- `saved.html` saved pieces (heart button)
- `cart.html` bag page with free-delivery bar and white-glove option; a slide-out bag drawer works on every page
- `checkout.html` delivery details, payment choice (50% advance / card / COD under Rs 50,000), order confirmation
- `admin.html` store admin: sales overview, orders (status, notes), products (price, pause, featured), messages. Password: `admin123`

## Run with Docker (port 8087)
```
docker compose up -d --build
```
Open http://localhost:8087 and http://localhost:8087/admin.html

Change the admin password with `ADMIN_PASSWORD=yourpass docker compose up -d --build`.
Orders and messages are saved in the `store-data` Docker volume. Sample data is created on first start (set `SEED=false` on the api service to start empty). The API re-checks every price on the server.

## Without Docker
Open the folder with any static server. With no API the store runs in "demo mode": bag, orders and admin changes are kept in the browser (localStorage) with sample data.

## Photos
Free-licence photos from Pexels (pexels.com/license), saved in `assets/img` as WebP.
