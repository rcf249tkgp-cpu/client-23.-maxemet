# Maxmet – website

A one-page static site for Maxmet Ab / Maxmet Oy / Maxmet Ltd (metal workshop in Luoma, Kirkkonummi).
It is plain HTML, CSS and JS with no build step and no framework.

```
public/                ← THE WEBSITE (this folder is what Cloudflare publishes)
  index.html           all markup (Swedish text is written in directly, so it works without JS and gets indexed)
  404.html             "page not found" page (SV/FI/EN)
  css/style.css        all styles (mobile-first)
  js/images.js         ← EVERY PHOTO: slot, URL, alt text in SV/FI/EN
  js/i18n.js           ← ALL TEXT in Swedish, Finnish and English
  js/main.js           language switch, image slots, gallery + lightbox, form, sticky call bar, scroll fade-ins
  _headers             Cloudflare headers (security + caching)
  robots.txt, sitemap.xml, favicon.svg
wrangler.jsonc         Cloudflare Workers config (serves ./public as static assets, no build step)
package.json           shortcuts: npm run dev / npm run deploy (no dependencies to install)
README.md              this file (not published)
```

## Run locally

Use Cloudflare's own local server (`wrangler dev`), which applies `_headers` and the 404 page exactly like production:

```bash
npm run dev
```

Then open http://localhost:8788. Any static server works too:

```bash
python3 -m http.server 8000 --directory public
```

## Deploy to Cloudflare

The site runs as a **Cloudflare Worker with static assets** (Worker name `client-23--maxemet`). `wrangler.jsonc` tells Cloudflare to serve the `public/` folder as it is. There is no build step and nothing to install.

### Automatic deploys (current setup)

The Worker is connected to this GitHub repo through **Workers Builds**, and every push to the configured branch redeploys. The build settings in the Cloudflare dashboard (**Workers & Pages → client-23--maxemet → Settings → Build**) should be:
- **Build command:** empty.
- **Deploy command:** `npx wrangler deploy` (the default).
- **Root directory:** `/`.

The deploy uses `wrangler.jsonc`:

```jsonc
{
  "name": "client-23--maxemet",
  "compatibility_date": "2025-11-01",
  "assets": { "directory": "./public", "not_found_handling": "404-page" }
}
```

If you rename the Worker in the dashboard, change `name` here too. Otherwise the build fails with a name mismatch.

### Manual deploy from your computer

```bash
npx wrangler@4 login
```

```bash
npm run deploy
```

### Custom domain

Go to **Worker → Settings → Domains & Routes → Add → Custom domain**, e.g. `maxmet.fi` and `www.maxmet.fi`. Then replace the `https://maxmet.fi/` placeholders (see the table below) with the real domain.

### What Cloudflare will do (checked locally with `wrangler dev`)
- `/` serves the site. `/index.html` redirects to `/`, and `?lang=fi` / `?lang=en` work.
- Unknown URLs return a real **404** with the branded `404.html` page (`not_found_handling: "404-page"`), which is marked noindex.
- Security headers are added to every page: HSTS, nosniff, frame protection, Referrer-Policy, Permissions-Policy.
- CSS/JS are cached for 10 minutes. The file names have no version, so a short cache means changes show up right after a deploy.
- `README.md`, `wrangler.jsonc` and `package.json` are **not** published, because only `public/` is.

## Things to fill in before launch (search for `TODO`)

| What | Where |
|---|---|
| Phone number (`+358 00 000 0000`) | `public/index.html` (10 places) + `public/404.html` (1), all listed in the next section |
| Email address (`info@maxmet.fi` is a placeholder) | `public/index.html` (contact + footer + JSON-LD) |
| Y-tunnus / FO-nummer (`0000000-0`) | `public/index.html` footer, and optionally the JSON-LD |
| Contact person name and role | `public/js/i18n.js` → `contact.personName` (in all 3 languages), plus the Swedish fallback in `public/index.html` |
| Final service list | the services section in `public/index.html` + `services.*` keys in `public/js/i18n.js` |
| Form endpoint | `public/index.html` → `<form action="https://formspree.io/f/YOUR_FORM_ID">` |
| Domain (`https://maxmet.fi/` placeholder) | `public/index.html` head (canonical, hreflang, og:url, JSON-LD), `public/robots.txt`, `public/sitemap.xml` |

### Phone number – every place it appears

The placeholder is `+358 00 000 0000`. Links use `tel:+358000000000` (no spaces). Every place is marked with a `TODO phone` comment in `public/index.html`:

| # | Where | What to change |
|---|---|---|
| 1 | `<head>` JSON-LD → `"telephone"` | `+358401234567` format |
| 2 | Header, desktop: number link next to "Begär offert" (`.nav-phone`) | `href` + visible number |
| 3 | Header, mobile: round phone button (`.header-call`) | `href` + `data-number` (number shown on tablets) |
| 4 | Mobile menu, bottom: "Ring direkt" button | `href` |
| 5 | Hero: "Ring oss" button | `href` |
| 6 | Contact list: Telefon | `href` + visible number |
| 7 | Contact: "Ring direkt" button | `href` |
| 8 | Footer | `href` + visible number |
| 9 | Sticky call bar (phones): "Ring" button | `href` |
| 10 | HTML comment above the header | the note itself |
| 11 | `public/404.html`: phone button | `href` + visible number |

To find them all at once:

```bash
grep -rn "358000000000\|00 000 0000" public/
```

Find and replace both strings across the file and you're done.

### Form
- **Formspree:** create a form, then replace `YOUR_FORM_ID`. The form already sends via `fetch` and shows success and error messages in the current language.
- **Cloudflare:** add a Worker script (`main` in `wrangler.jsonc`) that handles `POST /api/quote` and emails or stores the request, then point `action` to `/api/quote`.
- While the action still contains `YOUR_FORM_ID`, submitting shows a "not connected yet" notice instead of sending.

## Replacing photos

Open `public/js/images.js` and change the `src` of a slot. Each `// TEMP` line marks a stock photo that should be replaced.

- Use a full URL or a local file, e.g. put photos in `public/img/` and use `src: "img/railing-1.jpg"`.
- Any size or orientation works, phone photos included. Every frame has a fixed aspect ratio and crops with `object-fit: cover`.
- If an important part of a photo gets cropped away, add `position: "50% 30%"` to that slot (horizontal %, vertical %).
- The gallery takes any number of photos. Add or remove entries in the `gallery` array.
- Recommended size for local photos: about 2000 px wide for the hero and 1200–1600 px for the rest. Save as JPG or WebP at roughly 75–80 % quality.
- Remember to update the alt text (`sv`, `fi`, `en`).
- Also replace the share image (`og:image`) in `public/index.html` with a 1200×630 photo.

## Call options

Everywhere "Begär offert" appears, a call option sits next to it:

- **Header, desktop:** the phone number plus the "Begär offert" button.
- **Header, phone/tablet:** a round orange phone button next to the menu button (on tablets it also shows the number).
- **Mobile menu:** "Ring direkt" and "Begär offert" at the bottom.
- **Hero:** "Ring oss" (primary) and "Begär offert" (secondary).
- **Contact section:** "Ring direkt" and "Skicka e-post" buttons.
- **Sticky call bar (phones under 768px):** "Ring" and "Begär offert".
  - It appears after you scroll past the hero.
  - It hides while the contact section is on screen or the menu is open.
  - It sits above the iPhone home bar (`env(safe-area-inset-bottom)`).
  - The footer has extra bottom padding, so the bar never covers it.

Service cards are links. Tapping one jumps to the form and pre-fills the message with "Förfrågan gäller: <service>". It never overwrites text the visitor already typed.

## Editing text

All text lives in `public/js/i18n.js`. Swedish is also written directly in `public/index.html` for SEO and no-JS visitors, so when you change Swedish copy, update both places.

## Quality checks (last run)

- **Lighthouse (mobile):** Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- **Phone widths:** tested at 360, 375, 390 and 430px.
  - No horizontal scroll and no text under 15px.
  - Every tap target is at least 44×44px.
  - The hero heading, lead and both buttons fit on the first screen, including a 375×667 iPhone SE.
- **Buttons and fields:** buttons are 52px tall; form fields are 52px tall with 16px text, so iOS doesn't zoom in.
- **Motion:** respects `prefers-reduced-motion`.
