# themis — website agent guide

Marketing + documentation site for the Themis moderation plugin (code lives in `ThemisCode`).
Built with Astro as a fully static site.

## Commands
- `npm install` then `npm run dev` (local), `npm run build` (outputs `dist/`), `npm run preview`.
- `npm test` — browser smoke test of `dist/` (45 checks: pages, demo, intro, languages). Needs Playwright.
- `npm run verify` — type check + build + smoke test. The plugin repo's `scripts/verify-all.sh` runs both repos.

## Design system
- Pixel-art identity taken from the Themis logo: burgundy, parchment and laurel gold.
- One theme. Every color is a token in `src/styles/tokens.css`; never hard-code colors in components.
- Motion: opening sequence (`Intro.astro`, first visit per session), wordmark assembly, scroll reveals
  (`data-reveal`, stagger with `--i`). All of it is skipped under `prefers-reduced-motion`.
- Translation: tr and en are native pages; other browser languages get the English page rendered by
  Google Translate (`googtrans` cookie, see `layouts/Base.astro`). Mark code and commands `translate="no"`.
- Fonts: Geist (headings/UI) and JetBrains Mono (body/code), self-hosted via @fontsource.
- Respect `prefers-reduced-motion`; keep the layout working at 360px width.
- Copy lives in `src/i18n/` (tr + en). Never hard-code UI strings in components.

## Skills & tools
Project skills are vendored in `.claude/skills/` (see `THIRD_PARTY.md`). For UI work use
`frontend-design`, `frontend-design-direction`, `design-system`, `frontend-a11y`, `seo`, then
verify with `webapp-testing` (Playwright screenshots). MCP: `context7`, `serena` in `.mcp.json`.
