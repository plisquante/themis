# themis — website agent guide

Marketing + documentation site for the Themis moderation plugin (code lives in `ThemisCode`).
Built with Astro as a fully static site.

## Commands
- `npm install` then `npm run dev` (local), `npm run build` (outputs `dist/`), `npm run preview`.

## Design system
- Pixel-art identity taken from the Themis logo: burgundy, parchment and laurel gold.
- Themes are CSS custom-property sets in `src/styles/themes.css`, selected via
  `data-theme` on `<html>`; press `T` to cycle. Every new color must be a token.
- Fonts: Geist (headings/UI) and JetBrains Mono (body/code), self-hosted via @fontsource.
- Respect `prefers-reduced-motion`; keep the layout working at 360px width.
- Copy lives in `src/i18n/` (tr + en). Never hard-code UI strings in components.

## Skills & tools
Project skills are vendored in `.claude/skills/` (see `THIRD_PARTY.md`). For UI work use
`frontend-design`, `frontend-design-direction`, `design-system`, `frontend-a11y`, `seo`, then
verify with `webapp-testing` (Playwright screenshots). MCP: `context7`, `serena` in `.mcp.json`.
