# Onkar Kawade — Portfolio

A fully static, single-page portfolio for an MBBS student, built with a soft glassmorphism aesthetic.

## Preview

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

The pharmacology study notes live in `antiepileptic-drugs.html` and can be opened directly in a browser.

## What's included

- Responsive glass navigation with mobile menu
- Dark and light themes, saved in `localStorage`
- Animated aurora background, ECG line, and gentle floating cards
- Scroll reveals, active-section navigation, and a subtle pointer glow
- Copy-to-clipboard email button
- Accessible focus states, skip link, semantic sections, and reduced-motion support
- No frameworks, build step, or JavaScript dependencies

## Files

```text
.
├── index.html
├── styles.css
├── script.js
├── antiepileptic-drugs.html
├── robots.txt
├── assets/
│   └── favicon.svg
└── README.md
```

## Pharmacology notes

`antiepileptic-drugs.html` is a self-contained, glassmorphism study page based on the antiepileptic drugs chapter of KD Tripathi's *Essentials of Medical Pharmacology*. It includes classification, mechanisms, drug profiles, drugs of choice, status epilepticus, adverse effects, interactions, and quick-review questions. It has its own dark/light theme toggle and print styles; no build step is required.

> These notes are an educational aid only. Verify all doses and protocols against the current textbook and institutional guidelines before clinical use.

## Make it yours

1. **Email address** — replace both `onkar.kawade@example.com` values in `index.html`:
   - the two `mailto:` links in the contact section
   - the visible email link
   - the `data-copy-email` attribute
2. **College / university** — add your institution to the "At a glance" card and the education timeline.
3. **Social links** — add your LinkedIn, Instagram, or other profiles near the contact section if you want them displayed.
4. **Personal details** — update the interests, focus areas, and journey copy in `index.html` as your experience grows.
5. **Portrait** — the monogram card is intentionally image-free. To use a photo, add it to `assets/` and replace the `.medallion-inner` contents with an `<img>`.
6. **Meta description** — update the description in the `<head>` for search engines and link previews.

## Fonts

The site loads **Manrope** and **Instrument Serif** from Google Fonts. If you need a fully offline build, download those font files and self-host them, or remove the Google Fonts links and the page will fall back to system fonts.
