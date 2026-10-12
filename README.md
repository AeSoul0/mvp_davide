# Davide Lombardi — Pianist Portfolio (v1.0)

<div align="left">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
</div>

Portfolio professionale statico progettato per il pianista classico Davide Lombardi.

Il progetto utilizza un'architettura HTML/CSS/JavaScript senza framework frontend, con un piccolo generatore statico custom che assembla i componenti HTML sorgente nelle pagine finali (`index.html`, `privacy.html`, `404.html`).

L'obiettivo è mantenere il progetto semplice, veloce, facilmente manutenibile e adatto al deployment come sito statico.

## 🌟 Funzionalità

### Architettura

- **SSG custom minimale:** `scripts/build.js` trasforma ogni pagina `src/*.html` nella pagina omonima della root, risolvendo i componenti di `src/components/`.
- **Nessun framework frontend:** il sito utilizza HTML, CSS e JavaScript vanilla.
- **Output statico:** le pagine generate sono direttamente pubblicabili.
- **QA automatico:** `scripts/check.js` verifica file obbligatori, componenti, riferimenti locali e sincronizzazione tra sorgenti e output.

### Performance

- Video Hero con versione desktop e mobile, ricompressi senza traccia audio (il video è sempre muto) e con `faststart` per l'avvio immediato.
- Poster statico per il video Hero.
- Immagini principalmente in formato WebP, con varianti `-800.webp` servite tramite `srcset`/`sizes` agli schermi più piccoli.
- Immagine Open Graph (`og-image.jpg`) 1200×630, ottimizzata in JPEG progressivo.
- Font ospitati in locale (solo sottoinsiemi latin e latin-ext) con `preload` dei due principali.
- Copertina del player YouTube servita in locale (`yt-cover.webp`).
- YouTube caricato tramite facade: l'iframe viene creato solo quando l'utente interagisce.
- Animazioni gestite tramite `IntersectionObserver`.
- Supporto a `prefers-reduced-motion`.

### Sicurezza

- Content Security Policy definita in `vercel.json` (header HTTP applicati da Vercel).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy`.
- `Strict-Transport-Security`.
- `Permissions-Policy`.
- `frame-ancestors 'none'`.
- Utilizzo di `youtube-nocookie.com`.
- Nessuna dipendenza runtime esterna.

### Accessibilità

- Navigazione da tastiera.
- Menu mobile con `aria-expanded` e `aria-hidden`.
- Menu mobile reso `inert` quando chiuso.
- Focus management sul menu mobile.
- Focus trap durante la navigazione da tastiera.
- Chiusura del menu con `Escape`.
- Elementi interattivi dotati di label accessibili.
- Supporto a `prefers-reduced-motion`.

### Musical Easter Eggs

Le note nascoste presenti nella pagina possono attivare un mini-player basato su YouTube.

> **Nota importante per i video YouTube**: Se modifichi gli ID dei video in `main.js` o in `portfolio.html`, assicurati che l'autore del video su YouTube abbia esplicitamente **consentito l'incorporamento (embedding)**. Molti video musicali protetti da copyright bloccano l'incorporamento, causando un errore di riproduzione nel player integrato sul sito.

Le tracce configurate includono composizioni di:

- Čajkovskij
- Rachmaninov
- Mozart

## 🚀 Requisiti

L'unico requisito necessario per build e QA è:

- **Node.js**

Non sono presenti dipendenze npm runtime obbligatorie.

## 🛠 Build e verifica

Dopo aver modificato i sorgenti:

```bash
npm run build
```

Il comando esegue:

```text
scripts/build.js
```

che legge:

```text
src/*.html          (index, privacy, 404)
src/components/
```

e genera nella root:

```text
index.html
privacy.html
404.html
sitemap.xml         (la data <lastmod> cambia solo se la pagina è cambiata davvero)
```

Successivamente esegui:

```bash
npm run check
```

Il comando esegue:

```text
scripts/check.js
```

e verifica:

- presenza dei file obbligatori;
- presenza dei componenti HTML;
- coerenza del build;
- sincronizzazione tra `src/` e le pagine generate;
- riferimenti locali a file mancanti (inclusi quelli in `srcset`);
- presenza degli asset principali.

### Comando completo

Per una verifica completa:

```bash
npm run build && npm run check
```

## 💻 Sviluppo locale

Non è consigliato aprire direttamente `index.html` tramite `file:///`, soprattutto per le funzionalità che utilizzano YouTube e per le policy di sicurezza.

Utilizza invece un server HTTP locale.

### Python

```bash
python -m http.server 8000
```

Poi apri:

```text
http://localhost:8000
```

### Node

Con un server statico disponibile:

```bash
npx serve .
```

### VS Code

Puoi utilizzare un'estensione come **Live Server**.

## 📁 Struttura del progetto

```text
├── vercel.json                    (header HTTP e CSP per Vercel)
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── fonts/                     (Inter e Playfair Display, ospitati in locale)
│   │   └── *.woff2
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   ├── favicon.ico            (16/32/48 px, generata dal logo firma)
│   │   ├── apple-touch-icon.png   (180 px)
│   │   ├── icon-192.png / icon-512.png
│   │   ├── og-image.jpg           (1200×630)
│   │   ├── yt-cover.webp          (copertina del player YouTube)
│   │   ├── *.webp
│   │   └── *-800.webp             (varianti per srcset)
│   └── video/
│       ├── hero-chopin.mp4
│       ├── hero-mobile.mp4
│       └── hero-poster.webp
│
├── scripts/
│   ├── build.js
│   ├── check.js
│   └── pages.js                   (funzioni condivise da build e check)
│
├── src/
│   ├── index.html
│   ├── privacy.html
│   ├── 404.html
│   └── components/
│       ├── head.html
│       ├── nav.html
│       ├── hero.html
│       ├── portfolio.html
│       ├── resume.html
│       ├── footer.html
│       ├── simple-head.html       (intestazione di privacy e 404)
│       └── simple-footer.html
│
├── .gitignore
├── .vercelignore
├── 404.html
├── index.html
├── privacy.html
├── package.json
├── robots.txt
├── site.webmanifest
├── sitemap.xml
└── README.md
```

### Ruolo dei file principali

| File | Funzione |
|---|---|
| `src/index.html` | Template principale |
| `src/privacy.html`, `src/404.html` | Informativa privacy e pagina "non trovata" |
| `src/components/*.html` | Componenti HTML riutilizzabili |
| `scripts/build.js` | Generatore dell'HTML finale |
| `scripts/check.js` | Controlli automatici |
| `scripts/pages.js` | Elenco e assemblaggio delle pagine (usato da build e check) |
| `index.html`, `privacy.html`, `404.html` | Output generato, non modificare manualmente |
| `assets/fonts/` | Font ospitati in locale (nessuna richiesta a Google) |
| `assets/css/style.css` | Stili principali |
| `assets/js/main.js` | Interazioni e logica frontend |
| `vercel.json` | Header HTTP e policy di sicurezza (letti da Vercel) |
| `robots.txt` | Regole per i crawler |
| `site.webmanifest` | Manifest con le icone (Android / "aggiungi a schermata Home") |
| `sitemap.xml` | Sitemap XML |
| `package.json` | Script npm del progetto |

## 🔄 Workflow consigliato

Modifica sempre i sorgenti in:

```text
src/
assets/
scripts/
```

Per la struttura HTML, modifica principalmente:

```text
src/components/
```

Dopo ogni modifica significativa:

```bash
npm run build
npm run check
```

Non modificare manualmente:

```text
index.html
privacy.html
404.html
```

perché sono file generati dal build.

## 🌐 Deploy

Il sito è pubblicato su **Vercel**, con deploy automatico a ogni push su `main` (indirizzo principale: `https://www.davidelombardipianoforte.biz/`; il dominio senza `www` reindirizza lì).

- Vercel pubblica la root del repository così com'è: prima del push esegui `npm run build && npm run check` e fai commit anche dei file generati.
- `vercel.json` contiene gli header HTTP e i rimandi di `/favicon.ico` e `/apple-touch-icon.png`.
- `.vercelignore` esclude dalla pubblicazione sorgenti e strumenti (`src/`, `scripts/`, `.github/`, `README.md`).
- Il DNS del dominio è gestito da **Wix** (`ns4/ns5.wixdns.net`).

### Google Search Console

La proprietà `https://www.davidelombardipianoforte.biz/` è verificata tramite il meta tag `google-site-verification` in `src/components/head.html`. **Non rimuoverlo**: senza il tag la proprietà perde la verifica. La sitemap `sitemap.xml` è inviata in Search Console.

## 🔐 Note sulla sicurezza

Le policy principali sono definite in:

```text
vercel.json
```

La Content Security Policy consente esclusivamente le origini necessarie al funzionamento del sito. Stili e font sono serviti solo dal sito stesso (`'self'`); l'unica origine esterna per i frame è:

```text
https://www.youtube-nocookie.com
```

Al caricamento della pagina il sito non contatta alcun servizio esterno: YouTube viene caricato solo dopo un clic dell'utente.

Le modifiche alla CSP devono essere effettuate con attenzione perché possono impedire il caricamento di font, iframe o risorse esterne.

## 📊 Performance Budget (Lighthouse)

Durante lo sviluppo, si raccomanda di mantenere i seguenti punteggi Lighthouse (Desktop) come guardrail:

- **Performance:** ≥ 90
- **Accessibility:** ≥ 95
- **Best Practices:** ≥ 95
- **SEO:** ≥ 95

## 🤖 CI / CD (GitHub Actions)

Il progetto include un workflow in `.github/workflows/ci.yml` che esegue automaticamente `npm run build` e `npm run check` ad ogni push e pull request sul branch `main`. Questo garantisce che non vengano integrati codici rotti o file desincronizzati.

## 🧪 QA

Il controllo automatico può essere eseguito con:

```bash
npm run check
```

Per verificare anche che l'output sia aggiornato rispetto ai sorgenti:

```bash
npm run build && npm run check
```

Questo workflow riduce il rischio di pubblicare un `index.html` non sincronizzato con i componenti presenti in `src/`.

## 📄 Licenza

Il progetto non definisce attualmente una licenza open source esplicita.

## 👨‍💻 Sviluppato da

Ideato e sviluppato da **[ÆSoul](https://github.com/AeSoul0)**.
