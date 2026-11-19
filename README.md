# Maxmet – website

A one-page static site for Maxmet Ab / Maxmet Oy / Maxmet Ltd (metal workshop in Luoma, Kirkkonummi).
It is plain HTML, CSS and JS with no build step and no framework.

```
index.html        all markup (Swedish text is written in directly, so it works without JS and gets indexed)
css/style.css     all styles (mobile-first)
js/images.js      ← EVERY PHOTO: slot, URL, alt text in SV/FI/EN
js/i18n.js        ← ALL TEXT in Swedish, Finnish and English
js/main.js        language switch, image slots, gallery + lightbox, form, sticky call bar, scroll fade-ins
_headers          Cloudflare Pages headers (security + caching)
robots.txt, sitemap.xml, favicon.svg
```

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `?lang=fi` or `?lang=en` to open the page in another language.

## Deploy to Cloudflare Pages

- **Git:** connect the repo in Cloudflare Pages. Framework preset: *None*. Build command: *(empty)*. Output directory: `/`.
- **Or direct upload:**

```bash
npx wrangler pages deploy . --project-name maxmet
```

## Things to fill in before launch (search for `TODO`)

| What | Where |
|---|---|
| Phone number (`+358 00 000 0000`) | `index.html`: 10 places, all listed in the next section |
| Email address (`info@maxmet.fi` is a placeholder) | `index.html` (contact + footer + JSON-LD) |
| Y-tunnus / FO-nummer (`0000000-0`) | `index.html` footer, and optionally the JSON-LD |
| Contact person name and role | `js/i18n.js` → `contact.personName` (in all 3 languages), plus the Swedish fallback in `index.html` |
| Final service list | the services section in `index.html` + `services.*` keys in `js/i18n.js` |
| Form endpoint | `index.html` → `<form action="https://formspree.io/f/YOUR_FORM_ID">` |
| Domain (`https://maxmet.fi/` placeholder) | `index.html` head (canonical, hreflang, og:url, JSON-LD), `robots.txt`, `sitemap.xml` |

### Phone number – every place it appears

The placeholder is `+358 00 000 0000`. Links use `tel:+358000000000` (no spaces). Every place is marked with a `TODO phone` comment in `index.html`:

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

To find them all at once:

```bash
grep -n "358000000000\|00 000 0000" index.html
```

Find and replace both strings across the file and you're done.

### Form
- **Formspree:** create a form, then replace `YOUR_FORM_ID`. The form already sends via `fetch` and shows success and error messages in the current language.
- **Cloudflare:** point `action` to a Pages Function, e.g. `/api/quote` (`functions/api/quote.js`), that emails or stores the request.
- While the action still contains `YOUR_FORM_ID`, submitting shows a "not connected yet" notice instead of sending.

## Replacing photos

Open `js/images.js` and change the `src` of a slot. Each `// TEMP` line marks a stock photo that should be replaced.

- Use a full URL or a local file, e.g. put photos in `img/` and use `src: "img/railing-1.jpg"`.
- Any size or orientation works, phone photos included. Every frame has a fixed aspect ratio and crops with `object-fit: cover`.
- If an important part of a photo gets cropped away, add `position: "50% 30%"` to that slot (horizontal %, vertical %).
- The gallery takes any number of photos. Add or remove entries in the `gallery` array.
- Recommended size for local photos: about 2000 px wide for the hero and 1200–1600 px for the rest. Save as JPG or WebP at roughly 75–80 % quality.
- Remember to update the alt text (`sv`, `fi`, `en`).
- Also replace the share image (`og:image`) in `index.html` with a 1200×630 photo.

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

All text lives in `js/i18n.js`. Swedish is also written directly in `index.html` for SEO and no-JS visitors, so when you change Swedish copy, update both places.

## Quality checks (last run)

- **Lighthouse (mobile):** Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- **Phone widths:** tested at 360, 375, 390 and 430px.
  - No horizontal scroll and no text under 15px.
  - Every tap target is at least 44×44px.
  - The hero heading, lead and both buttons fit on the first screen, including a 375×667 iPhone SE.
- **Buttons and fields:** buttons are 52px tall; form fields are 52px tall with 16px text, so iOS doesn't zoom in.
- **Motion:** respects `prefers-reduced-motion`.
