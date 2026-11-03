<p align="center"><img src="public/logo.png" width="120" alt="Themis"></p>

# themis — website

Marketing and documentation site for the **Themis** moderation plugin (plugin code:
[`plisquante/ThemisCode`](https://github.com/plisquante/ThemisCode)).

Static [Astro](https://astro.build) site, Turkish (`/`) and English (`/en/`).

## What's on it

- **Opening sequence**: the seal blooms in with rings and sparks, the curtains part, and the **THEMIS** wordmark —
  pixel Roman capitals gilded from parchment to burgundy with a 3D pixel extrusion — assembles from flying pixels,
  followed by a light sweep. Plays once per session; skipped with a click/key or under reduced motion.
- **Live demo**: a browser console that understands the plugin's real command syntax (`/ban`, `/mute`, `/punish … spam`,
  `/history`, `/check`, `/alts`, `/case`, …) and shows the player's screen, the REST `/v1/stream` events and the Discord
  embed side by side. It types its first commands by itself when scrolled into view.
- Scroll reveals, counters, a command ticker, interactive escalation ladder, developer code tabs (Java API, events,
  REST, webhook verification, SSE), comparison table, install steps, pricing + FAQ and a full docs page.
- **Languages**: Turkish (`/`) and English (`/en/`) are written by hand. Visitors are routed by browser language on
  their first visit; any other language (German, Spanish, Russian, Arabic, Japanese, …) is translated automatically by
  Google Translate from the English page, with a "Show original" switch. Code and commands are never translated.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm test          # browser smoke test of dist/ (needs Playwright + Chromium)
```

Copy lives in `src/i18n/` (`tr.ts`, `en.ts`, `demo.ts`, shared samples in `code.ts`). Colors are tokens in
`src/styles/tokens.css`. Purchase / GitHub / Discord links are in `src/i18n/index.ts`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`
(enable *Settings → Pages → Source: GitHub Actions*). For a custom domain set `SITE_URL` and `BASE_PATH=/`.
