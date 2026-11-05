#!/usr/bin/env node
// Browser smoke test for the static site. Run from the repo root: node tests/smoke.cjs
// Serves the folder itself, then checks every width, the fonts, the links and the animated parts.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('playwright is not installed: npm i -g playwright && npx playwright install chromium');
  process.exit(2);
}

const ROOT = path.join(__dirname, '..');
const PORT = 4700 + Math.floor(Math.random() * 200);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT);

const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? '  ✓' : '  ✗'} ${name}${ok ? '' : '  → ' + detail}`); };

(async () => {
  const browser = await chromium.launch();
  try {
    console.log('Widths');
    for (const width of [360, 390, 768, 1280, 1440, 1920]) {
      const p = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [], failed = [];
      p.on('pageerror', (e) => errors.push(e.message));
      p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      p.on('requestfailed', (r) => failed.push(r.url()));
      p.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
      await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(500);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(`@${width}px no horizontal scroll`, overflow <= 0, `${overflow}px`);
      check(`@${width}px no errors or missing files`, !errors.length && !failed.length, [...errors, ...failed].join(' | '));
      await p.close();
    }

    console.log('Page');
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const fonts = await p.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
    for (const f of ['TeX Gyre Pagella', 'Inter', 'Unifont']) check(`font ${f} loads`, fonts.includes(f), fonts.join(', '));
    check('six feature cards', (await p.locator('#grid .card').count()) === 6);
    const anchors = await p.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.querySelector(h)));
    check('every in-page link has a target', anchors.length === 0, anchors.join(', '));
    const external = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => !h.startsWith('#') && !h.startsWith('https://')));
    check('external links use https', external.length === 0, external.join(', '));
    const noAlt = await p.evaluate(() => [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length);
    check('every image has alt', noAlt === 0, `${noAlt} without alt`);
    check('one h1', (await p.locator('h1').count()) === 1);

    console.log('Motion');
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 300) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(40); }
    await p.locator('#stats').scrollIntoViewIfNeeded();
    await p.waitForTimeout(2200);
    const stats = await p.evaluate(() => [...document.querySelectorAll('.stat b')].map((b) => [b.dataset.to, b.firstChild.textContent]));
    check('stats count up to their targets', stats.every(([to, v]) => Number(v) === Number(to)), JSON.stringify(stats));
    await p.locator('.term').scrollIntoViewIfNeeded();
    await p.waitForTimeout(6500);
    check('terminal finishes its script', (await p.locator('#term').innerText()).includes('adalet yerini buldu'));
    const hidden = await p.evaluate(() => [...document.querySelectorAll('.reveal')].filter((e) => e.getBoundingClientRect().bottom < innerHeight && Number(e.style.opacity) < 0.95).length);
    check('scrolled-past sections are visible', hidden === 0, `${hidden} still hidden`);
    await p.evaluate(() => scrollTo(0, document.getElementById('faq').offsetTop));
    await p.waitForTimeout(300);
    check('nav marks SSS while reading the FAQ', await p.evaluate(() => document.querySelectorAll('#navlinks li')[4].classList.contains('on')));
    await p.close();
  } catch (e) {
    check('smoke test completed', false, e.stack || String(e));
  } finally {
    await browser.close();
    server.close();
  }
  const failed = results.filter((r) => !r).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
})();
