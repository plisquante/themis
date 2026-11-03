import type { Dict } from './types';
import { templateYaml, storageYaml, limitsYaml, webhookYaml, gradleSample, javaSample, eventsSample, restSample, webhookSample } from './code';
import { esc } from './util';

const pre = (s: string) => `<pre><code>${esc(s)}</code></pre>`;

export const en: Dict = {
  meta: {
    title: 'Themis — moderation for Minecraft servers',
    description: 'Bans, mutes, warnings, escalation ladders, alt detection, a REST API and signed webhooks. The moderation plugin for Paper 1.21 – 26.x.',
  },
  nav: { features: 'Features', demo: 'Demo', developers: 'Developers', pricing: 'Pricing', docs: 'Docs', buy: 'Buy', language: 'Language', menu: 'Menu' },
  lang: { label: 'Choose language', translated: 'Translated by Google', original: 'Show original' },
  ticker: ['/ban', 'escalation ladders', '/mute', 'REST API', '/warn', 'live stream', '/punish', 'Discord webhooks', '/history', 'alt detection', '/check', 'Redis sync', '/case', 'PlaceholderAPI'],
  hero: {
    pill: 'Themis 1.0 is out — move from LiteBans or AdvancedBan with one command',
    pillHref: 'docs/#migration',
    title: 'Keep the scales level.',
    lead: '/ban and /mute the way they should have been. Escalation ladders, instant network sync, alt detection and an API that is fully open to developers.',
    cta: 'Get Themis — $20',
    demo: 'Try it in your browser',
    stats: [
      { value: '5', label: 'databases: H2, SQLite, MySQL, MariaDB, PostgreSQL' },
      { value: '<1 ms', label: 'chat checks; never touch the database' },
      { value: '16', label: 'REST endpoints, described in OpenAPI 3.1' },
    ],
  },
  demo: {
    title: 'Use it before you buy it',
    lead: 'This is the plugin\'s real command syntax. Type a command or pick one below, then watch the player\'s screen, the live API stream and the Discord log on the right.',
    placeholder: '/ban Steve 7d x-ray',
    run: 'Run',
    reset: 'Reset',
    chips: ['/mute Alex 30m spam', '/punish Steve spam', '/punish Steve spam', '/history Steve', '/check Alex', '/ban Notch 7d x-ray -s', '/unmute Alex', '/case'],
    tabs: { screen: 'Player screen', stream: 'Live API stream', discord: 'Discord' },
    screenIdle: 'Punish a player and what they see appears here.',
    streamIdle: 'GET /v1/stream connected. Waiting for events…',
    discordIdle: 'Webhook connected. Waiting for the first punishment.',
    hint: '↑ / ↓ history · Tab completes · /help lists commands',
  },
  features: {
    title: 'Everything a moderation team needs',
    lead: 'Themis is built around the flows staff use every day: fast decisions, consistent punishments, nothing off the record.',
    items: [
      { icon: 'ladder', title: 'Escalation ladders', body: 'Type /punish Steve spam. Themis checks the player\'s record and applies the next step. Old offences are forgotten after the time you choose.' },
      { icon: 'network', title: 'Instant across the network', body: 'Every server shares one record on MySQL, MariaDB or PostgreSQL. With Redis or plain SQL sync, bans, kicks and mutes apply everywhere within a second.' },
      { icon: 'eye', title: 'Alt detection', body: 'IP history and a linked-account graph. The moment a banned player\'s second account joins, staff get a clickable alert.' },
      { icon: 'hash', title: 'Case codes', body: 'Every punishment has a short code like #7KQ2MX. The same code works in appeals, /case, /editcase, the API and Discord.' },
      { icon: 'shield', title: 'Rank limits', body: 'Helpers mute for 2 hours at most, moderators ban for 30 days. Permanent punishments are their own permission. Nobody oversteps.' },
      { icon: 'api', title: 'REST API and live stream', body: 'Scoped tokens, rate limits, idempotency, CORS and Server-Sent Events. Connect your panel, bot or website.' },
      { icon: 'hook', title: 'Signed webhooks', body: 'Ready-made Discord embeds and HMAC-SHA256 signed JSON for your own backend. Failed deliveries retry automatically.' },
      { icon: 'chat', title: 'Hover and click everywhere', body: 'Hover a history line for details, click a code to open the case. Fully customisable with MiniMessage, English and Turkish included.' },
    ],
  },
  ladder: {
    title: 'The same offence gets the same punishment',
    lead: 'Ladders make sure everyone on the team applies the same rules. This is the default "spam" ladder from config.yml.',
    offence: 'Add offence',
    reset: 'Start over',
    template: 'spam · forgotten after 30 days',
    steps: [
      { label: 'Warning', detail: 'valid 7 days' },
      { label: 'Mute', detail: '30 minutes' },
      { label: 'Mute', detail: '2 hours' },
      { label: 'Mute', detail: '1 day' },
      { label: 'Ban', detail: '3 days' },
    ],
    current: 'Next punishment',
  },
  dev: {
    title: 'Fully open to developers',
    lead: 'The Themis API is not a hook bolted on later; the plugin itself runs on it. MIT licensed, platform independent, versioned.',
    docs: 'API docs',
    copy: 'Copy',
    copied: 'Copied',
    points: [
      { title: 'Java API', body: 'Services, builders, cancellable and mutable events, your own templates, metadata on every punishment.' },
      { title: 'REST + SSE', body: '{data} / {error} envelope, OpenAPI 3.1, X-RateLimit headers, Idempotency-Key and a live event stream.' },
      { title: 'Webhooks', body: 'Stripe-style signatures: t=<time>,v1=<hmac>. Timestamps protect against replays.' },
    ],
  },
  compare: {
    title: 'Why Themis',
    lead: 'Most ban plugins issue the punishment and stop there. Themis covers your team\'s whole workflow.',
    themis: 'Themis',
    typical: 'Typical ban plugin',
    rows: [
      { label: 'Escalation ladders with decay', themis: 'Yes', typical: 'No, or manual' },
      { label: 'Per-rank duration limits', themis: 'Yes', typical: 'Rarely' },
      { label: 'REST API', themis: '16 endpoints, scoped tokens', typical: 'No' },
      { label: 'Live event stream (SSE)', themis: 'Yes', typical: 'No' },
      { label: 'Signed webhooks + Discord', themis: 'HMAC + embeds', typical: 'Discord only, unsigned' },
      { label: 'Java events', themis: 'Cancellable and mutable', typical: 'Informational only' },
      { label: 'Network sync', themis: 'SQL or Redis', typical: 'Separate proxy plugin' },
      { label: 'Alt alerts', themis: 'On join, clickable', typical: 'Manual lookup' },
      { label: 'Setup', themis: 'Zero config (H2)', typical: 'Database required' },
    ],
  },
  install: {
    title: 'Live in five minutes',
    lead: 'Drop in the jar and start the server. Defaults are ready for a single server; for a network, fill in the database lines.',
    steps: [
      { title: 'Put the jar in plugins/', body: 'Paper 1.21 – 26.x, Java 21+. Required libraries download automatically on first start.' },
      { title: 'Give your team permissions', body: 'themis.staff grants every moderation command. Add themis.limit.helper for helpers.' },
      { title: 'Bring your old punishments', body: '/themis import litebans <jdbc-url> <user> <password> — records, durations and revocations are kept.' },
    ],
  },
  pricing: {
    title: 'One price, everything included',
    lead: 'No subscription, no "pro edition". Buy it once and every 1.x update is yours.',
    price: '$20',
    per: 'one-time · per network license',
    buy: 'Buy Themis',
    note: 'Use it on every server you own. The developer API is MIT licensed.',
    includes: ['Every command and escalation ladder', 'REST API, live stream and webhooks', 'Network sync (SQL / Redis)', 'LiteBans, AdvancedBan and vanilla import', 'English and Turkish messages', 'All 1.x updates and support'],
    faqTitle: 'Questions',
    faq: [
      { q: 'Do I need Velocity or BungeeCord?', a: 'No. Install Themis on every Paper server and point them at the same database; sync works over SQL or Redis.' },
      { q: 'Is Folia supported?', a: 'Not yet. Paper 1.21 to 26.x and Paper forks such as Purpur are supported.' },
      { q: 'What happens to my existing bans?', a: '/themis import brings over vanilla, LiteBans and AdvancedBan data with durations and states intact.' },
      { q: 'Can I change the messages?', a: 'Every message lives in messages_en.yml in MiniMessage format; colours change in one place.' },
    ],
  },
  footer: {
    tagline: 'Keep the scales level.',
    product: 'Product',
    resources: 'Resources',
    legal: 'Legal',
    license: 'License',
    changelog: 'Changelog',
    support: 'Support',
    rights: 'All rights reserved.',
  },
  docs: {
    title: 'Documentation',
    lead: 'Everything you need to know about Themis, from installation to the API.',
    toc: 'Contents',
    back: 'Home',
    sections: [
      { id: 'install', title: 'Installation', html: `<p>Themis runs on Paper 1.21 through 26.x with Java 21+.</p>
<ol><li>Put <code>Themis-1.0.0.jar</code> in <code>plugins/</code> and start the server.</li>
<li>On first start the database drivers download automatically and <code>plugins/Themis/config.yml</code> is created.</li>
<li>The default storage is embedded H2; a single server needs no further setup.</li>
<li>Give your team <code>themis.staff</code>, admins <code>themis.*</code>.</li></ol>` },
      { id: 'commands', title: 'Commands', html: '{{commands}}<p>Durations: <code>30s 10m 2h 7d 2w 1mo 1y</code>, combinable (<code>1d12h</code>) or <code>perm</code>. Flags: <code>-s</code> silent, <code>-p</code> public, <code>-ip</code> IP punishment, <code>-r</code> replace the existing one, <code>-scope=survival</code> that server only.</p>' },
      { id: 'permissions', title: 'Permissions', html: '{{permissions}}' },
      { id: 'storage', title: 'Storage and networks', html: `<p>When several servers share one record, use MySQL, MariaDB or PostgreSQL and give each server its own <code>server-name</code>. <code>sync.mode: SQL</code> needs no extra software (it polls the database); <code>REDIS</code> is instant.</p>${pre(storageYaml)}` },
      { id: 'templates', title: 'Escalation ladders', html: `<p>A template is a list of steps. The number of times a player was punished through it decides the next step; the last step repeats. <code>decay</code> controls when old offences are forgotten. Step format: <code>&lt;ban|mute|warn|kick|note&gt; [duration|perm] [ip]</code>.</p>${pre(templateYaml)}<p>Usage: <code>/punish Steve spam</code>. Permission: <code>themis.template.spam</code>.</p>` },
      { id: 'limits', title: 'Rank limits', html: `<p>Cap the longest duration a staff member can issue, per group. With several groups the most generous one applies.</p>${pre(limitsYaml)}` },
      { id: 'rest', title: 'REST API', html: `<p>Set <code>rest-api.enabled: true</code> and create a token in game: <code>/themis token create panel read,write,stream</code>. The token is shown once; only its SHA-256 hash is stored.</p>${pre(restSample)}
<p>Scopes: <code>read</code>, <code>write</code>, <code>stream</code>, <code>admin</code>. Every endpoint and schema is at <code>GET /v1/openapi.json</code>. IP addresses are masked by default (<code>84.12.x.x</code>).</p>
<table><thead><tr><th>Endpoint</th><th>Description</th></tr></thead><tbody>
<tr><td><code>GET /v1/health</code></td><td>Status and version (no token)</td></tr>
<tr><td><code>GET /v1/punishments</code></td><td>Filters: target, ip, issuer, type, status, template, search, since, until, limit, offset</td></tr>
<tr><td><code>POST /v1/punishments</code></td><td>Issue (supports Idempotency-Key)</td></tr>
<tr><td><code>GET|PATCH|DELETE /v1/punishments/{id|code}</code></td><td>Read, edit, revoke</td></tr>
<tr><td><code>GET /v1/players/{name|uuid}</code></td><td>Profile, active ban/mute, counts; /punishments, /alts, /ips</td></tr>
<tr><td><code>POST /v1/templates/{key}/apply</code></td><td>Next step of a ladder</td></tr>
<tr><td><code>GET /v1/stream</code></td><td>Server-Sent Events: punishment.issued, .revoked, .edited, .expired</td></tr>
<tr><td><code>GET /v1/stats</code></td><td>Active / 24h / 7d / all-time per type</td></tr></tbody></table>` },
      { id: 'webhooks', title: 'Webhooks', html: `<p>The <code>DISCORD</code> format posts a ready-made embed to a Discord webhook URL. The <code>THEMIS</code> format sends signed JSON; failed deliveries retry 5 times with backoff. Test with <code>/themis webhook test</code>.</p>${pre(webhookYaml)}<p>Verifying the signature:</p>${pre(webhookSample)}` },
      { id: 'java-api', title: 'Java API', html: `<p><code>themis-api</code> is MIT licensed and has no Bukkit dependency. Add <code>softdepend: [Themis]</code> to your <code>plugin.yml</code>.</p>${pre(gradleSample)}${pre(javaSample)}${pre(eventsSample)}
<p>Events: <code>PunishmentIssueEvent</code> (cancellable, mutable), <code>PunishmentIssuedEvent</code>, <code>PunishmentRevokeEvent</code>, <code>PunishmentRevokedEvent</code>, <code>PunishmentEditedEvent</code>, <code>PunishmentExpiredEvent</code>, <code>PlayerBlockedEvent</code>, <code>AltJoinEvent</code>. Every storage call returns a <code>CompletableFuture</code>; never <code>join()</code> on the main thread.</p>` },
      { id: 'placeholders', title: 'PlaceholderAPI', html: `<p><code>%themis_muted%</code>, <code>%themis_mute_reason%</code>, <code>%themis_mute_remaining%</code>, <code>%themis_mute_code%</code>, <code>%themis_warnings%</code>, <code>%themis_punishments%</code>, <code>%themis_bans%</code>, <code>%themis_mutes%</code></p>` },
      { id: 'migration', title: 'Migrating from other plugins', html: `<ul><li><code>/themis import vanilla</code> — banned-players.json and banned-ips.json</li>
<li><code>/themis import litebans jdbc:mysql://host:3306/litebans user password [prefix]</code></li>
<li><code>/themis import advancedban jdbc:mysql://host:3306/advancedban user password</code></li></ul>
<p>Imported records keep their durations, states and revokers, and are tagged with <code>imported_from</code> in metadata.</p>` },
    ],
  },
};
