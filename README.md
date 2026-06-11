# Polaris Concierge — Landing Page

Private Jet Charter | Müller Ressel GbR, Hamburg

## Struktur

```
polaris/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── hero-bg.js
└── img/
    ├── logo.png
    ├── founder-max.jpg
    ├── founder-elwin.jpg
    └── jet-bg.webp
```

## Setup

1. Bilder in `/img/` hochladen (logo.png, founder-max.jpg, founder-elwin.jpg, jet-bg.webp)
2. In `js/main.js` WhatsApp-Nummer, Telefon und E-Mail prüfen
3. Google Ads Conversion ID in `index.html` eintragen wenn bereit
4. Für GitHub Pages: Settings → Pages → Branch: main → / (root)

## Kontakt

info@polaris-concierge.de  
+49 1521 4869594

## V2 Motion Layer (GSAP)

Neu in dieser Version: Preloader (Boarding Sequence), Hero Line Reveal, Departures Ticker, Count Up Zahlen, Scroll Reveals, Showcase Bildmaske, Magnetic Buttons, Lenis Smooth Scroll.

Geladen per CDN in index.html: GSAP 3.12.5 + ScrollTrigger (cdnjs), Lenis 1.1.14 (unpkg).
Ohne diese Libs (oder mit prefers-reduced-motion) bleibt die Seite voll funktionsfähig und statisch sichtbar. hero-bg.js ist unverändert.
