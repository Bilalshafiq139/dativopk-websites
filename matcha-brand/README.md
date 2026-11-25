# Koya Matcha Bar · matcha cafe & brand website (demo)

A multi-page website and online store for a Lahore matcha bar that also sells matcha powder, kits and teaware across Pakistan. "Koya" is a placeholder brand; names, prices and contact details are samples.

Layout modelled on a Dribbble shot (green hero with a giant brand word, product tabs, "why you'll love matcha", yellow benefit card, fanned reviews, FAQ, green footer with the brand word). All photos are our own picks from Pexels, not the designer's images.

## Motion

1. **Hero**: the letters K O Y A rise out of a mask one by one, the model rises up in front of them, the headline lines slide up, the reviews counter counts to 5,000+. A soft bubble pattern drifts behind.
2. **Depth**: moving the mouse shifts the letters, the model and the bubbles by different amounts (parallax); scrolling moves the word slower than the model and fades the headline.
3. **Product tabs**: a green pill slides to the chosen tab and the cards rise in one after another. Hovering a card fills it green from the bottom (the highlighted-card look from the design), zooms the photo and turns the price yellow.
4. **Add to cart**: the product photo flies in an arc into the cart button, which bounces; the cart drawer slides in.
5. **Why matcha**: green droplets burst out of the glass on a loop, the glass drifts and tilts as you scroll, the line icons draw themselves when the cards come into view.
6. **Benefit card**: auto slider (/01 to /03) with a timer ring on the arrow button; each drink swings in and bobs, the caption lines slide up.
7. **Barista**: the green circle pops, matcha powder blooms behind it, the barista rises into the circle and "Fresh Blend" writes itself in.
8. **Reviews**: fanned, tilted cards; arrows, a click or a swipe rotates the fan.
9. **FAQ**: smooth open and close. **Footer**: the giant KOYA rises in. Every page title rises in letter by letter.

All motion turns off for visitors who set "reduce motion".

## Pages

| Page | What it does |
|---|---|
| `index.html` | Hero, product tabs, why matcha, benefit slider, barista, reviews, FAQ |
| `shop.html` | 12 items in 5 categories, sort by price or sale, sold-out state |
| `product.html?id=…` | Gallery with zoom, quantity, add to cart, WhatsApp order |
| `cart.html`, `checkout.html` | Cart, free delivery bar, COD / card / Easypaisa / JazzCash, delivery time |
| `about.html` | Story, counters, leaf-to-cup steps, events, promise |
| `recipes.html` | Recipe cards with a pop-up recipe, brewing guide |
| `contact.html` | Contact form, WhatsApp, delivery FAQ |
| `admin.html` | Orders (status, notes), menu (price, in stock / sold out / hidden), messages. Password `admin123` |

## Run with Docker

```bash
docker compose up -d --build
```

Open http://localhost:8089 (admin at http://localhost:8089/admin.html). Orders and messages are saved in the `store-data` volume. Change the admin password with `ADMIN_PASSWORD=... docker compose up -d`.

Without Docker (any static server), the site runs in demo mode: orders and the admin panel work from the browser's local storage with sample data.

## Edit

- Products, prices, brand details: `js/data.js` (keep the prices in `api/server.js` in step).
- Sample admin data: `js/seed-data.js`.
- Photos: `assets/img` (Pexels; cut-outs made with rembg).
