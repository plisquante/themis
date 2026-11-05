<p align="center"><img src="assets/logo-128.png" width="96" alt="Themis"></p>

# themis — site

Themis moderasyon eklentisinin tanıtım sitesi (eklenti kodu: [`plisquante/ThemisCode`](https://github.com/plisquante/ThemisCode)).
Tasarım ve altyapı: **cemo**.

Build adımı yok: düz HTML, CSS ve JavaScript.

```bash
python3 -m http.server 8000     # http://localhost:8000
node tests/smoke.cjs            # tarayıcı testi (Playwright + Chromium gerekir)
```

| Dosya | İçerik |
| --- | --- |
| `index.html` | sayfa ve metinler |
| `css/style.css` | stiller, renkler, fontlar, dar ekran kuralları |
| `js/main.js` | arka plan, kartlar, terminal, animasyonlar |
| `assets/` | logo |
| `fonts/` | TeX Gyre Pagella, Inter, Unifont (Latin + Türkçe alt kümeleri) ve lisansları |

## Yayın

`.github/workflows/deploy.yml`, `main` dalına her push'ta siteyi GitHub Pages'e yükler
(Settings → Pages → Source: GitHub Actions).

## Lisanslar

- Fontlar: TeX Gyre Pagella (GUST Font License), Inter (SIL OFL 1.1), Unifont (SIL OFL 1.1 / GPL + font istisnası). Metinleri `fonts/` içinde.
