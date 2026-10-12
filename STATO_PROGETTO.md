# Stato del progetto — log

_Ultimo aggiornamento: 12 ottobre 2026_

## In sintesi

Il sito è **completo per ciò che deve fare**: è un portfolio statico di una pagina che presenta Davide Lombardi, mostra performance, esperienze, formazione e permette di contattarlo (email, WhatsApp, social).
Build e controlli automatici (`npm run build && npm run check`) passano.

Restano solo rifiniture **facoltative** (elencate sotto per priorità). Nessuna blocca la pubblicazione.

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
| `og-image.jpg` (anteprima su WhatsApp/social) | 616 KB | 60 KB | JPEG progressivo |
| Immagini galleria/esperienze | — | — | Aggiunte versioni da 800 px (`*-800.webp`, circa −45%) servite automaticamente a telefoni e riquadri piccoli tramite `srcset` |

La qualità visiva dei video è praticamente identica all'originale (SSIM 0,994).

È stato provato anche il formato AV1, ma il guadagno era minimo (desktop −17%, mobile peggiore), quindi si è mantenuto solo H.264, compatibile con tutti i browser.

### 3. Controlli automatici e documentazione

`scripts/check.js` ora verifica anche le nuove icone, il manifest e i file indicati in `srcset`. Il README è aggiornato (struttura file, ottimizzazioni, rimosso Brahms dall'elenco brani perché non più presente).

---

## 🔶 Cosa si potrebbe ancora fare (facoltativo)

### Priorità media

1. **Accorciare il video Hero.** Dura oltre 5 minuti, ma come sfondo ne bastano 20–40 secondi in loop. Un taglio ridurrebbe il peso di un ulteriore ~90%. È una scelta di contenuto: va deciso quale estratto usare.
2. **Privacy / GDPR.** Il sito carica i font da Google Fonts (l'indirizzo IP del visitatore arriva a Google) e incorpora video YouTube. Consigliato:
   - ospitare i font in locale (`assets/fonts/`), eliminando la richiesta a Google;
   - aggiungere una breve informativa privacy (anche solo una sezione o una pagina `privacy.html`).
3. **Pagina 404.** Manca una `404.html`; chi sbaglia indirizzo vede la pagina d'errore generica dell'hosting.

### Priorità bassa

4. **Immagine `image_extra2_1.webp`** (prima foto della galleria) è larga solo 933 px ma viene mostrata a tutta larghezza (fino a 1200 px): su schermi grandi appare leggermente sfocata. Serve un originale a risoluzione più alta.
5. **Copertina del video YouTube** viene scaricata dai server YouTube (`maxresdefault.jpg`, ~100–200 KB). Si può salvare una copia WebP locale più leggera.
6. **`og-image.jpg`** ha proporzioni 1376×768; il formato ideale per i social è 1200×630 (1,91:1). Funziona comunque, ma può venire ritagliata.
7. **Galleria senza titolo**: la sezione `#gallery` non ha un'intestazione (anche nascosta, `sr-only`) per gli screen reader.
8. **`sitemap.xml`** cambia data a ogni build anche senza modifiche reali, creando differenze inutili nei commit.
9. **Statistiche visite**: non è presente nessun sistema di analytics (scelta voluta? Se servono, preferire soluzioni senza cookie come Plausible o Cloudflare Web Analytics, aggiornando la CSP).

### Da verificare dopo la pubblicazione

- Che l'hosting legga il file `_headers` (Netlify e Cloudflare Pages sì; GitHub Pages no).
- Punteggio Lighthouse rispetto al budget del README (Performance ≥ 90, le altre ≥ 95).
- Che tutti i video YouTube (player principale e note nascoste) siano ancora incorporabili.
- Registrazione del sito su Google Search Console e invio della `sitemap.xml`.
