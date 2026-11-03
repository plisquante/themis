<p align="center"><img src="public/logo.png" width="120" alt="Themis"></p>

# themis — website

Marketing and documentation site for the **Themis** moderation plugin (plugin code:
[`plisquante/ThemisCode`](https://github.com/plisquante/ThemisCode)).

Static [Astro](https://astro.build) site, Turkish (`/`) and English (`/en/`).

## What's on it

- Pixel-art **THEMIS** wordmark banded in the seal's burgundy → parchment, over a pixel field that reacts to the cursor.
- **Live demo**: a browser console that understands the plugin's real command syntax (`/ban`, `/mute`, `/punish … spam`,
  `/history`, `/check`, `/alts`, `/case`, …) and shows the player's screen, the REST `/v1/stream` events and the Discord
  embed side by side.
- Interactive escalation-ladder walkthrough, developer code tabs (Java API, events, REST, webhook verification, SSE),
  comparison table, install steps, pricing + FAQ.
- **9 themes** (Themis, Parchment, Marble, Laurel, Bronze, Tokyo Night, Gruvbox, Nord, Catppuccin Latte). Press **T** to
  cycle; the choice is remembered. First visit follows the system light/dark preference.
- Full docs page: install, commands, permissions, storage & sync, ladders, rank limits, REST API, webhooks, Java API,
  PlaceholderAPI, migration.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
```

Copy lives in `src/i18n/` (`tr.ts`, `en.ts`, `demo.ts`, shared samples in `code.ts`). Colors are tokens in
`src/styles/themes.css`. Purchase / GitHub / Discord links are in `src/i18n/index.ts`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`
(enable *Settings → Pages → Source: GitHub Actions*). For a custom domain set `SITE_URL` and `BASE_PATH=/`.
