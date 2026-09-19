# Davide Lombardi — Pianist Portfolio (v1.0)

<div align="left">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
</div>

Portfolio professionale statico progettato per il pianista classico Davide Lombardi.

Il progetto utilizza un'architettura HTML/CSS/JavaScript senza framework frontend, con un piccolo generatore statico custom che assembla i componenti HTML sorgente nell'`index.html` finale.

L'obiettivo è mantenere il progetto semplice, veloce, facilmente manutenibile e adatto al deployment come sito statico.

## 🌟 Funzionalità

### Architettura

- **SSG custom minimale:** `scripts/build.js` assembla i componenti HTML presenti in `src/components/` nell'`index.html`.
- **Nessun framework frontend:** il sito utilizza HTML, CSS e JavaScript vanilla.
- **Output statico:** il file `index.html` generato è direttamente pubblicabile.
- **QA automatico:** `scripts/check.js` verifica file obbligatori, componenti, riferimenti locali e sincronizzazione tra sorgenti e output.

### Performance

- Video Hero con versione desktop e mobile.
- Poster statico per il video Hero.
- Immagini principalmente in formato WebP.
- YouTube caricato tramite facade: l'iframe viene creato solo quando l'utente interagisce.
- Animazioni gestite tramite `IntersectionObserver`.
- Supporto a `prefers-reduced-motion`.

### Sicurezza

- Content Security Policy definita in `_headers`.
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

Le tracce configurate includono composizioni di:

- Čajkovskij
- Brahms
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
src/index.html
src/components/
```

e genera:

```text
index.html
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
- sincronizzazione tra `src/` e `index.html`;
- riferimenti locali a file mancanti;
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
├── _headers
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── *.webp
│   └── video/
│       ├── hero-chopin.mp4
│       ├── hero-mobile.mp4
│       └── hero-poster.webp
│
├── scripts/
│   ├── build.js
│   └── check.js
│
├── src/
│   ├── index.html
│   └── components/
│       ├── head.html
│       ├── nav.html
│       ├── hero.html
│       ├── portfolio.html
│       ├── resume.html
│       └── footer.html
│
├── .gitignore
├── index.html
├── package.json
├── robots.txt
├── sitemap.xml
└── README.md
```

### Ruolo dei file principali

| File | Funzione |
|---|---|
| `src/index.html` | Template principale |
| `src/components/*.html` | Componenti HTML riutilizzabili |
| `scripts/build.js` | Generatore dell'HTML finale |
| `scripts/check.js` | Controlli automatici |
| `index.html` | Output generato, non modificare manualmente |
| `assets/css/style.css` | Stili principali |
| `assets/js/main.js` | Interazioni e logica frontend |
| `_headers` | Header HTTP e policy di sicurezza |
| `robots.txt` | Regole per i crawler |
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
```

perché è un file generato dal build.

## 🌐 Deploy

Il progetto è pensato per essere distribuito come sito statico.

Build command:

```bash
npm run build && npm run check
```

Publish directory:

```text
/
```

Il deployment deve pubblicare la root del repository, dove si trova l'`index.html` generato.

## 🔐 Note sulla sicurezza

Le policy principali sono definite in:

```text
_headers
```

La Content Security Policy consente esclusivamente le origini necessarie al funzionamento del sito, incluse:

```text
https://fonts.googleapis.com
https://fonts.gstatic.com
https://www.youtube-nocookie.com
```

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
