# Stato del progetto — log

_Ultimo aggiornamento: 12 ottobre 2026_

## In sintesi

Il sito è **completo per ciò che deve fare**: è un portfolio statico di una pagina che presenta Davide Lombardi, mostra performance, esperienze, formazione e permette di contattarlo (email, WhatsApp, social).
Build e controlli automatici (`npm run build && npm run check`) passano.

Le rifiniture facoltative individuate sono state completate (vedi sezione 4), tranne quelle che richiedono una tua decisione o un tuo account. Nessuna blocca la pubblicazione.

---

## ✅ Fatto in questo intervento

### 1. Logo nella scheda del browser (favicon)

Le icone erano dei segnaposto vuoti da 1×1 pixel. Ora sono generate dal logo firma "Davide" (oro su blu):

| File | Uso | Dimensioni |
|---|---|---|
| `assets/images/favicon.ico` | Scheda del browser | 16, 32 e 48 px (tratto ispessito per restare leggibile) |
| `assets/images/apple-touch-icon.png` | Icona su iPhone/iPad ("Aggiungi a Home") | 180 px |
| `assets/images/icon-192.png`, `icon-512.png` | Android / manifest | 192 e 512 px |
| `site.webmanifest` | Collega le icone per Android | — |

### 2. Ottimizzazione video e immagini (alleggerimento del sito)

| File | Prima | Dopo | Note |
|---|---|---|---|
| `hero-chopin.mp4` (video desktop) | 22,7 MB | 9,6 MB (−58%) | Rimossa la traccia audio (il video è sempre muto), ricompressione H.264, `faststart` |
| `hero-mobile.mp4` (video mobile) | 4,5 MB | 3,7 MB (−17%) | Stessa procedura |
| `og-image.jpg` (anteprima su WhatsApp/social) | 616 KB | 43 KB | JPEG progressivo, 1200×630 (vedi sezione 4) |
| Immagini galleria/esperienze | — | — | Aggiunte versioni da 800 px (`*-800.webp`, circa −45%) servite automaticamente a telefoni e riquadri piccoli tramite `srcset` |

La qualità visiva dei video è praticamente identica all'originale (SSIM 0,994).

È stato provato anche il formato AV1, ma il guadagno era minimo (desktop −17%, mobile peggiore), quindi si è mantenuto solo H.264, compatibile con tutti i browser.

### 3. Controlli automatici e documentazione

`scripts/check.js` ora verifica anche le nuove icone, il manifest e i file indicati in `srcset`. Il README è aggiornato (struttura file, ottimizzazioni, rimosso Brahms dall'elenco brani perché non più presente).

---

### 4. Secondo intervento — completamento delle rifiniture

| Attività | Stato | Dettagli |
|---|---|---|
| Font ospitati in locale | ✅ | Inter e Playfair Display in `assets/fonts/` (solo latin + latin-ext, ~228 KB in tutto, il browser scarica solo i sottoinsiemi che servono). Rimossi i link a Google Fonts; la CSP ora consente stili e font solo dal sito. |
| Informativa privacy | ✅ | Nuova pagina `privacy.html`, collegata dal footer. |
| Pagina 404 | ✅ | Nuova pagina `404.html` con link alla home (Vercel la serve in automatico per gli indirizzi inesistenti). |
| Foto `image_extra2_1.webp` sfocata | ✅ | Spostata in un riquadro a metà larghezza; a tutta larghezza ora c'è `image_2.webp` (1400 px), che ha la risoluzione giusta. |
| Copertina video YouTube | ✅ | Sostituita da `yt-cover.webp` locale (24 KB), un fotogramma di Davide al pianoforte. Al caricamento della pagina il sito non contatta più nessun server esterno. |
| `og-image.jpg` in formato 1200×630 | ✅ | Ridimensionata (contenuto centrato, nessun testo tagliato), 43 KB; aggiunti i meta `og:image:width/height`. |
| Titolo nascosto per la galleria | ✅ | Aggiunto `<h2 class="sr-only">Galleria fotografica</h2>`. |
| `sitemap.xml` stabile | ✅ | La data cambia solo se la pagina è cambiata davvero; la sitemap include anche `privacy.html`. |
| Build multi-pagina | ✅ | `scripts/build.js` e `scripts/check.js` gestiscono tutte le pagine di `src/` (logica comune in `scripts/pages.js`). |
| Lighthouse | ✅ | Test in locale: **Desktop 100 / 100 / 100 / 100**, **Mobile 99 / 100 / 100 / 100** (Performance / Accessibilità / Best Practices / SEO). |

---

## 🔶 Cosa resta (richiede una tua decisione o un tuo account)

1. **Accorciare il video Hero** — escluso per scelta.
2. **Copertina del video YouTube**: ora è un fotogramma del video di sfondo, non la miniatura ufficiale del video Čajkovskij. Se preferisci quella originale: apri `https://img.youtube.com/vi/8MBT3ncnnmY/maxresdefault.jpg`, convertila in WebP e salvala come `assets/images/yt-cover.webp` (stesso nome, nessuna modifica al codice; aggiorna solo `width`/`height` in `src/components/portfolio.html` se le dimensioni cambiano).
3. **Informativa privacy**: è un testo base scritto sulla situazione reale del sito (nessun cookie, YouTube solo dopo il clic, contatti via email/WhatsApp). Va riletta da Davide ed eventualmente da un professionista; se vuoi, si può indicare il nome del fornitore di hosting nella sezione "Dati di navigazione".
4. **Statistiche visite**: non aggiunte. Richiedono di scegliere un servizio e creare un account (consigliati Plausible o Cloudflare Web Analytics, senza cookie). Una volta scelto, servono lo script/token e l'aggiornamento di CSP e informativa privacy.

---

### 5. Terzo intervento — pubblicazione e verifiche sul sito online

- **Hosting:** Vercel, con deploy automatico a ogni push su `main`. Il dominio senza `www` reindirizza a `https://www.davidelombardipianoforte.biz/`.
- **Header di sicurezza:** Vercel ignora il file `_headers`, quindi in produzione CSP e gli altri header non erano mai stati applicati. Ora sono in `vercel.json` (e `_headers` è stato rimosso).
- **Indirizzo principale:** canonical, `og:url`, dati strutturati, `sitemap.xml` e `robots.txt` usano ora `https://www.davidelombardipianoforte.biz/` (prima puntavano alla versione senza `www`, che è solo un reindirizzamento).
- **`/favicon.ico` e `/apple-touch-icon.png`** nella root reindirizzano alle icone in `assets/images/` (alcuni browser e Google le cercano lì).
- Branch di lavoro uniti in `main` ed eliminati.

Verificato sul sito pubblicato (12 ottobre 2026):

| Controllo | Esito |
|---|---|
| Header `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` | ✅ presenti |
| Indirizzo inesistente (`/prova-404`) | ✅ risponde 404 con la pagina personalizzata |
| Favicon nuova, link "Privacy" nel footer, `privacy.html` | ✅ |
| Font locali, immagini, video Hero | ✅ caricati, nessuna violazione CSP |
| Player YouTube principale (`8MBT3ncnnmY`) | ✅ si avvia dentro il sito |
| Note nascoste (`6Nrexs0g6lk`, `8MBT3ncnnmY`, `pWPiNt8J3I4`, `J02j_bjTO7k`) | ✅ tutti incorporabili, riproduzione verificata |
| Tutti i file locali referenziati dalle pagine | ✅ rispondono 200 |

## 🔍 Da fare con il tuo account

**Google Search Console** (serve l'accesso all'account Google di Davide o tuo):

1. Vai su `https://search.google.com/search-console` → **Aggiungi proprietà**.
2. **Consigliato — "Dominio":** inserisci `davidelombardipianoforte.biz` e aggiungi il record **TXT** `google-site-verification=…` nel pannello DNS del dominio (copre sia `www` sia la versione senza).
   **Alternativa — "Prefisso URL"** `https://www.davidelombardipianoforte.biz/` con **tag HTML**: aggiungi il `<meta name="google-site-verification" content="…">` in `src/components/head.html`, poi `npm run build && npm run check`, commit e push su `main`, quindi **Verifica**. Il tag deve restare nel sito.
3. Dopo la verifica: **Sitemap** → invia `sitemap.xml` (stato atteso "Operazione riuscita").
4. **Controllo URL** sulla home → **Richiedi indicizzazione**.
