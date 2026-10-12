# Passaggio di consegne — da leggere all'inizio della prossima chat

_Scritto il 12 ottobre 2026, a fine sessione cloud. Serve per riprendere il lavoro in un'altra chat (in locale), con accesso al browser per le operazioni web._

## Contesto

- **Progetto:** sito portfolio statico del pianista Davide Lombardi — `https://davidelombardipianoforte.biz/`
- **Repository:** `AeSoul0/mvp_davide`
- **Branch con tutto il lavoro recente:** `claude/amazing-ramanujan-7m80yu` (**non ancora unito a `main`**)
- **Stack:** HTML/CSS/JS vanilla + build custom in Node (`npm run build && npm run check`). Le pagine si modificano in `src/`; `index.html`, `privacy.html` e `404.html` nella root sono generati e non vanno modificati a mano.
- **Stato completo e storico delle modifiche:** vedi `STATO_PROGETTO.md`.

Per partire in locale:

```bash
git fetch origin
git checkout claude/amazing-ramanujan-7m80yu
git pull
npm run build && npm run check
```

## Cosa è già stato fatto (2 commit sul branch)

1. **Favicon e icone** generate dal logo firma "Davide" (oro su blu) + `site.webmanifest`.
2. **Media alleggeriti:** video Hero 22,7 → 9,6 MB (desktop) e 4,5 → 3,7 MB (mobile), senza traccia audio; `og-image.jpg` 616 → 43 KB in formato 1200×630; varianti `*-800.webp` con `srcset`.
3. **Privacy e indipendenza da servizi esterni:** font ospitati in locale (niente Google Fonts), copertina del player YouTube locale (`yt-cover.webp`), CSP ristretta a `'self'` (eccetto il frame `youtube-nocookie.com`).
4. **Nuove pagine:** `privacy.html` (collegata dal footer) e `404.html`.
5. **Build multi-pagina** (`scripts/pages.js`), sitemap con data stabile, check anche su `srcset`.
6. **Lighthouse in locale:** Desktop 100/100/100/100, Mobile 99/100/100/100.

## Cosa resta da fare (in ordine)

### 1. Pubblicare le modifiche
- [ ] Capire **quale hosting** pubblica il sito e **da quale branch** (probabilmente `main`).
- [ ] Aprire una pull request da `claude/amazing-ramanujan-7m80yu` verso `main` e unirla (dopo il via libera dell'utente).
- [ ] Controllare che il sito online mostri le modifiche (favicon nuova, link "Privacy" nel footer).

### 2. Verifiche sul sito pubblicato (servono browser/rete)
- [ ] L'hosting applica il file `_headers`? Verificare negli header di risposta che ci siano `Content-Security-Policy` e `Strict-Transport-Security` (Netlify e Cloudflare Pages sì, GitHub Pages no).
- [ ] Un indirizzo inesistente (es. `/prova-404`) mostra la pagina 404 personalizzata?
- [ ] I video YouTube partono dentro il sito? Provare il player nella sezione "Ascolta" (ID `8MBT3ncnnmY`) e le 4 note musicali nascoste (ID in `assets/js/main.js`, array `HIDDEN_TRACKS`). Se un video dice "riproduzione disattivata dal proprietario", va sostituito con uno incorporabile.
- [ ] Anteprima del link: incollare l'indirizzo del sito in WhatsApp o usare un validatore Open Graph per vedere che `og-image.jpg` compaia.

### 3. Registrare il sito su Google Search Console
L'utente vuole che sia fatto via web nella prossima chat. Serve l'account Google di Davide (o dell'utente), con accesso fatto dall'utente: non chiedere né inserire password.

- [ ] Andare su `https://search.google.com/search-console` → **Aggiungi proprietà**.
- [ ] **Metodo consigliato — "Dominio":** inserire `davidelombardipianoforte.biz` e aggiungere il record **TXT** `google-site-verification=…` nel pannello DNS del registrar del dominio (chiedere all'utente quale sia).
- [ ] **Alternativa — "Prefisso URL"** (`https://davidelombardipianoforte.biz/`) con **tag HTML**: aggiungere il `<meta name="google-site-verification" content="…">` in `src/components/head.html`, eseguire `npm run build && npm run check`, fare commit, pubblicare e poi cliccare **Verifica**. Il tag deve restare nel sito.
- [ ] Dopo la verifica: **Sitemap** → inviare `sitemap.xml` → stato atteso "Operazione riuscita".
- [ ] **Controllo URL** sulla home → **Richiedi indicizzazione**.

### 4. Decisioni ancora aperte dell'utente (non fare senza conferma)
- Copertina YouTube: ora è un fotogramma del video di sfondo; si può sostituire con la miniatura ufficiale (`https://img.youtube.com/vi/8MBT3ncnnmY/maxresdefault.jpg` → convertire in WebP → salvare come `assets/images/yt-cover.webp`, aggiornando `width`/`height` in `src/components/portfolio.html` se cambiano).
- Informativa privacy (`src/privacy.html`): testo base, da far rileggere a Davide; eventualmente aggiungere il nome dell'hosting.
- Statistiche visite: non presenti; se richieste, preferire Plausible o Cloudflare Web Analytics, aggiornando CSP in `_headers` e informativa privacy.
- Accorciare il video Hero: **escluso dall'utente**, non farlo.
