# Zarine · luxury handbag store (demo)

A multi-page eCommerce demo for a Lahore handbag label. "Zarine" is a placeholder brand; names, prices and contact details are samples.

Motion modelled on a reference landing page ("one model, every bag"):

1. **Loader**: a percentage counter and thin bar while the bag cards appear one by one and drift round the centre.
2. **Reveal**: at 100% the cards fly onto a diagonal arc, the model rises in and the headline words slide up behind her.
3. **Look change** (every few seconds, on a card click, the arrows or the arrow keys): cards, headline and price card dim and blur, a violet-pink light streak sweeps across the model while a soft glow blooms, the model's photo cross-fades (old look blurs away) to the same model carrying the next bag, the cards slide one slot along the arc, and the product text and price card rise back in.
4. **Add to bag**: the bag photo flies in an arc into the Bag button, which bounces and counts up.

The five hero photos are the same model from one Pexels studio series (photographer DHANNO), cut out with rembg and aligned to the same head size and position so the swap reads as one person.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Hero above, new edit, atelier story, shop by colour, lookbook, reviews |
| `shop.html` | 14 bags, filter by shape, sort by price or sale |
| `product.html?id=…` | Gallery with zoom, colour siblings, add to bag, WhatsApp order, sticky buy bar |
| `cart.html`, `checkout.html` | Bag, gift wrap, free delivery bar, COD / card / bank transfer |
| `wishlist.html` | Saved bags |
| `about.html`, `contact.html` | Atelier story, contact form, delivery FAQ |
| `admin.html` | Orders, products (price, stock, featured), messages. Password `admin123` |

## Run with Docker

```bash
docker compose up -d --build
```

Open http://localhost:8088 (admin at http://localhost:8088/admin.html). Orders and messages are saved in the `store-data` volume. Change the admin password with `ADMIN_PASSWORD=... docker compose up -d`.

Without Docker (any static server), the site runs in demo mode: orders and the admin panel work from the browser's local storage with sample data.

## Edit

- Products, prices, brand details: `js/data.js` (keep the prices in `api/server.js` in step).
- Sample admin data: `js/seed-data.js`.
- Photos: `assets/img/model` (hero cut-outs), `assets/img/bag` (product cut-outs), `assets/img/photo` (studio photos). All from Pexels.
