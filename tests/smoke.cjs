#!/usr/bin/env node
// End-to-end smoke test for the built site. Usage: npm run build && npm test
// Serves dist/ (with GitHub Pages-like 404 handling), then drives Chromium through every page and the demo.
// Pass --offline to skip the live Google Translate check.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('playwright is not installed. Run: npm i -g playwright && npx playwright install chromium');
  process.exit(2);
}

const OFFLINE = process.argv.includes('--offline');
const PORT = 4400 + Math.floor(Math.random() * 400);
const BASE = `http://localhost:${PORT}`;
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? '  ✓' : '  ✗'} ${name}${ok ? '' : '  → ' + detail}`); };
const IGNORED = [/sandboxed and lacks the 'allow-same-origin'/, /translate\.google|gstatic|googleapis/i];

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
function serve(root, port) {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, path.normalize(p));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      return res.end(fs.readFileSync(path.join(root, '404.html')));
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(port);
}

async function waitForServer(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('preview server did not start');
}

async function page(browser, { locale = 'tr-TR', width = 1280, height = 800, storage = {}, intro = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, locale });
  await ctx.addInitScript(([s, i]) => {
    try {
      if (window.top !== window) return;
      for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
      if (!i) sessionStorage.setItem('themis-intro', '1');
    } catch {}
  }, [storage, intro]);
  const p = await ctx.newPage();
  p.errors = [];
  p.on('pageerror', (e) => p.errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !IGNORED.some((r) => r.test(m.text()))) p.errors.push(m.text()); });
  return p;
}

(async () => {
  const server = serve(path.join(__dirname, '..', 'dist'), PORT);
  let browser;
  try {
    await waitForServer(BASE + '/');
    browser = await chromium.launch();

    console.log('Pages');
    for (const route of ['/', '/en/', '/docs/', '/en/docs/']) {
      for (const width of [360, 1440]) {
        const p = await page(browser, { width, storage: { 'themis-lang': route.startsWith('/en') ? 'en' : 'tr' } });
        const res = await p.goto(BASE + route, { waitUntil: 'networkidle' });
        await p.waitForTimeout(400);
        const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        check(`${route} @${width}px loads`, res.status() === 200, `status ${res.status()}`);
        check(`${route} @${width}px has no horizontal scroll`, overflow <= 0, `${overflow}px`);
        check(`${route} @${width}px has no console errors`, p.errors.length === 0, p.errors.join(' | '));
        await p.context().close();
      }
    }
    const nf = await fetch(BASE + '/does-not-exist/');
    check('404 page is served', nf.status === 404, `status ${nf.status}`);

    console.log('Demo');
    const d = await page(browser, { storage: { 'themis-lang': 'en' } });
    await d.goto(BASE + '/en/', { waitUntil: 'networkidle' });
    const input = d.locator('#demo input');
    await input.click(); // stops autoplay
    const run = async (cmd) => { await input.fill(cmd); await input.press('Enter'); await d.waitForTimeout(60); };
    const log = () => d.locator('#demo .log').innerText();
    for (const c of ['/mute Alex 30m spam', '/unmute Alex', '/ban Steve 1d test', '/unban Steve', '/warn Notch language', '/unwarn Notch',
      '/punish jeb_ spam', '/punish jeb_ spam', '/history jeb_', '/check Alex', '/alts Steve', '/case', '/kick Notch afk', '/nope', '/tempban Steve soon']) await run(c);
    const text = await log();
    check('mute + unmute work', /Alex was muted/.test(text) && /Alex was unmuted/.test(text), text.slice(-400));
    check('ban + unban work', /Steve was banned/.test(text) && /Steve was unbanned/.test(text));
    check('warn + unwarn work', /Notch was warned/.test(text) && /warning on Notch was removed/.test(text));
    check('ladder escalates warn → mute', /jeb_ was warned/.test(text) && /jeb_ was muted by Console for 30m/.test(text));
    check('history, check and alts render', /History of jeb_/.test(text) && /Overview of Alex/.test(text) && /Accounts linked to Steve/.test(text));
    check('unknown command and bad duration are reported', /Unknown command/.test(text) && /is not a duration/.test(text));
    await d.locator('[data-tab="stream"]').click();
    check('live stream pane shows events', (await d.locator('[data-pane="stream"] .frame').count()) > 0);
    await d.locator('[data-tab="discord"]').click();
    check('discord pane shows embeds', (await d.locator('[data-pane="discord"] .embed').count()) > 0);
    check('demo raised no errors', d.errors.length === 0, d.errors.join(' | '));
    await d.context().close();

    console.log('Intro and motion');
    const i = await page(browser, { storage: { 'themis-lang': 'tr' }, intro: true });
    await i.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    check('intro plays on first visit', await i.evaluate(() => document.documentElement.classList.contains('intro-play')));
    await i.waitForTimeout(2700);
    check('intro removes itself', (await i.locator('[data-intro]').count()) === 0);
    check('wordmark settles', await i.evaluate(() => document.querySelector('.wm')?.classList.contains('settled')));
    await i.context().close();
    const r = await browser.newContext({ reducedMotion: 'reduce', locale: 'tr-TR' });
    const rp = await r.newPage();
    await rp.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    check('reduced motion skips the intro', !(await rp.evaluate(() => document.documentElement.classList.contains('intro-play'))));
    await r.close();

    console.log('Languages');
    const en = await page(browser, { locale: 'en-US' });
    await en.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await en.waitForURL(/\/en\/$/, { timeout: 5000 }).catch(() => {});
    check('English browser lands on /en/', en.url().endsWith('/en/'), en.url());
    await en.context().close();
    const trp = await page(browser, { locale: 'tr-TR' });
    await trp.goto(BASE + '/en/docs/', { waitUntil: 'domcontentloaded' });
    await trp.waitForURL(/\/docs\/$/, { timeout: 5000 }).catch(() => {});
    check('Turkish browser lands on the Turkish page', !trp.url().includes('/en/') && trp.url().endsWith('/docs/'), trp.url());
    await trp.context().close();
    const de = await page(browser, { locale: 'de-DE' });
    await de.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await de.waitForURL(/\/en\/$/, { timeout: 5000 }).catch(() => {});
    const cookie = await de.evaluate(() => document.cookie);
    check('German browser gets the English page with googtrans=/en/de', de.url().endsWith('/en/') && cookie.includes('googtrans=/en/de'), `${de.url()} ${cookie}`);
    if (!OFFLINE) {
      await de.waitForTimeout(4000);
      const lang = await de.evaluate(() => document.documentElement.lang);
      check('Google Translate renders German', lang === 'de', `html lang=${lang}`);
      check('code stays untranslated', (await de.locator('.wm').getAttribute('translate')) === 'no');
    }
    await de.locator('[data-gt-badge] button').click();
    await de.waitForLoadState('domcontentloaded');
    await de.waitForTimeout(500);
    check('"Show original" turns translation off', !(await de.evaluate(() => document.cookie)).includes('googtrans=/en/de'));
    await de.context().close();
    const pick = await page(browser, { storage: { 'themis-lang': 'tr' } });
    await pick.goto(BASE + '/', { waitUntil: 'networkidle' });
    await pick.locator('[data-lang-picker] summary').click();
    await pick.locator('[data-lang-pick="en"]').first().click();
    await pick.waitForURL(/\/en\/$/, { timeout: 5000 }).catch(() => {});
    check('language picker switches to English', pick.url().endsWith('/en/'), pick.url());
    await pick.context().close();
  } catch (e) {
    check('smoke test completed', false, e.stack || String(e));
  } finally {
    if (browser) await browser.close();
    server.close();
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();
