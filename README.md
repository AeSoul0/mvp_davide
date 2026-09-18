# Davide Lombardi — Pianist Portfolio (v1.0)

<div align="left">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
</div>

Un portfolio professionale dal design minimalista e dalle altissime prestazioni, progettato per il pianista classico Davide Lombardi. Il progetto utilizza un'architettura statica senza framework pesanti, garantendo sicurezza, velocità di caricamento e un'esperienza utente (UX) estremamente curata.

## 🌟 Funzionalità (v1.0)

- **Architettura SSG Custom:** Nessun framework JS lato client. Uno script leggero (`build.js`) inietta i componenti HTML in `index.html`.
- **Ottimizzazione Performance Extreme:** 
  - Video hero generati ad hoc con versioni ridotte per il Mobile (`480p`).
  - Immagini unicamente in formato `WebP` di nuova generazione.
  - Iframe YouTube posticipati (Lazy-loaded YouTube Facade Pattern) per non bloccare il thread principale.
- **Hardening di Sicurezza:**
  - Nessuno stile inline (`unsafe-inline` rimosso).
  - Implementazione completa delle intestazioni di sicurezza (CSP, HSTS, Referrer-Policy, Permissions-Policy) tramite `_headers`.
  - Utilizzo di `youtube-nocookie.com` per la privacy.
- **UX Premium & Accessibilità:**
  - Layout editoriale per la galleria fotografica e la sezione masterclass.
  - Navigazione da tastiera completa con Focus Trap nativo sul menu mobile.
  - Microinterazioni, animazioni basate su IntersectionObserver e rispetto del `prefers-reduced-motion`.
- **Musical Easter Eggs:** Cliccando sulle note nascoste, un mini-player audio si avvierà riproducendo composizioni famose di Čajkovskij, Brahms, Rachmaninov e Mozart.

## 🚀 Guida all'Uso

L'unico requisito è **Node.js**. Non ci sono `node_modules` massicci da scaricare.

### Build e Verifica

1. Modifica i file sorgente in `src/components/`.
2. Compila il sito:
   ```bash
   npm run build
   ```
3. Avvia lo script di verifica per assicurarti che tutti gli asset necessari siano pronti per il server:
   ```bash
   npm run check
   ```

### Local Development

Poiché il sito sfrutta YouTube e policy restrittive, **non aprire `index.html` via `file:///`**. Usa un server HTTP locale:
- **VS Code:** Estensione *Live Server*
- **Python:** `python -m http.server 8000`
- **Node:** `npx serve .`

## 📁 Struttura del Progetto

```
├── _headers                # Security & Cache headers per Netlify/Cloudflare
├── assets/
│   ├── css/style.css       # Main stylesheet (utility CSS e layout)
│   ├── js/main.js          # Logica JS essenziale (Facciata YT, Focus Trap, Observer)
│   ├── images/             # Immagini in formato ottimizzato .webp
│   └── video/              # Video Hero (.mp4 desktop e mobile) e poster frame
├── src/
│   ├── index.html          # Template master
│   └── components/         # Partials HTML
├── build.js                # Compilatore SSG
├── check.js                # QA Script post-build
├── robots.txt              # Indicizzazione bot
├── sitemap.xml             # Sitemap per SEO
├── index.html              # OUTPUT GENERATO (non modificare)
└── README.md
```

## 🛠 Deploy

Il progetto è ottimizzato per essere distribuito come sito statico su **Netlify** o **Cloudflare Pages**.
- **Build command:** `npm run build && npm run check`
- **Publish directory:** `/` (cartella root)

## 👨‍💻 Sviluppato da

Ideato e sviluppato da **[ÆSoul](https://github.com/AeSoul0)**.
