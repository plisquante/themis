// Code samples shared by both languages.
export const javaSample = `ThemisApi themis = Themis.api();

themis.punishments().issue(PunishmentRequest.builder(PunishmentType.MUTE)
        .target(Target.player(uuid, "Steve"))
        .issuer(Actor.plugin("AntiSpam"))
        .duration(Duration.ofMinutes(10))
        .reason("Chat flood")
        .meta("detector", "flood-v2")
        .build())
    .thenAccept(r -> getLogger().info("Case #" + r.punishment().code()));`;

export const eventsSample = `// Veto or rewrite any punishment before it is stored
themis.events().subscribe(this, PunishmentIssueEvent.class, e -> {
    if (e.request().reason().isBlank()) e.cancel("A reason is required");
});

// Network-wide reactions (e.remote() = issued on another server)
themis.events().subscribe(this, PunishmentIssuedEvent.class, e ->
    leaderboard.onPunished(e.punishment()));`;

export const restSample = `curl -X POST https://mc.example.com:8787/v1/punishments \\
  -H "Authorization: Bearer thm_9f2c…" \\
  -H "Idempotency-Key: ticket-4411" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "ban",
    "target": { "name": "Steve" },
    "duration": "7d",
    "reason": "X-ray",
    "issuer": "Website"
  }'`;

export const restResponse = `HTTP/1.1 201 Created
X-RateLimit-Remaining: 119

{ "data": { "id": 4182, "code": "7KQ2MX", "type": "ban",
    "status": "active", "duration": "1w", "permanent": false,
    "target": { "name": "Steve", "ip": "84.12.x.x" },
    "issuer": { "name": "panel:Website", "type": "api" } } }`;

export const webhookSample = `import crypto from 'node:crypto';

// X-Themis-Signature: t=1730650000,v1=5c1f…
export function verify(header, rawBody, secret) {
  const { t, v1 } = Object.fromEntries(header.split(',').map(p => p.split('=')));
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(\`\${t}.\${rawBody}\`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}`;

export const streamSample = `const es = new EventSource('/v1/stream'); // via your proxy, adds the token
es.addEventListener('punishment.issued', (e) => {
  const { punishment } = JSON.parse(e.data);
  feed.prepend(\`\${punishment.target.name} · \${punishment.type}\`);
});`;

export const gradleSample = `repositories { maven("https://jitpack.io") }
dependencies { compileOnly("com.github.plisquante:ThemisCode:1.0.0") }`;

export const templateYaml = `templates:
  spam:
    name: "Spam / flood"
    reason: "Spamming"
    decay: 30d
    steps: ["warn 7d", "mute 30m", "mute 2h", "mute 1d", "ban 3d"]
  evasion:
    name: "Punishment evasion"
    reason: "Evading a punishment"
    steps: ["ban perm ip"]`;

export const storageYaml = `storage:
  type: MARIADB        # H2, SQLITE, MYSQL, MARIADB, POSTGRESQL
  host: db.internal
  port: 3306
  database: themis
  username: themis
  password: "…"

sync:
  mode: REDIS          # NONE, SQL, REDIS
  redis-uri: "redis://redis.internal:6379"`;

export const limitsYaml = `limits:
  helper:              # permission themis.limit.helper
    mute: 2h
    ban: 1d
  moderator:
    mute: 7d
    ban: 30d`;

export const webhookYaml = `webhooks:
  - name: discord-log
    enabled: true
    url: "https://discord.com/api/webhooks/…"
    format: DISCORD
    events: ["punishment.issued", "punishment.revoked"]
  - name: backend
    enabled: true
    url: "https://example.com/themis"
    format: THEMIS
    secret: "whsec_…"
    events: ["*"]`;

export interface CommandDoc { cmd: string; perm: string; tr: string; en: string }

export const commands: CommandDoc[] = [
  { cmd: '/ban <player> [duration] [reason] [-s] [-ip] [-r]', perm: 'themis.command.ban', tr: 'Yasakla. Süre yoksa kalıcı.', en: 'Ban. Permanent without a duration.' },
  { cmd: '/tempban <player> <duration> [reason]', perm: 'themis.command.ban', tr: 'Süre zorunlu yasak.', en: 'Ban that requires a duration.' },
  { cmd: '/ipban <player|ip> [duration] [reason]', perm: 'themis.command.ipban', tr: 'IP yasağı; aynı IP\'deki her hesabı kapsar.', en: 'IP ban; covers every account on that IP.' },
  { cmd: '/mute, /tempmute, /ipmute', perm: 'themis.command.mute', tr: 'Sohbeti ve engelli komutları kapatır.', en: 'Blocks chat and blocked commands.' },
  { cmd: '/warn <player> [duration] [reason]', perm: 'themis.command.warn', tr: 'Uyarı; isteğe bağlı süreli.', en: 'Warning, optionally expiring.' },
  { cmd: '/kick <player> [reason]', perm: 'themis.command.kick', tr: 'Sunucudan atar (ağ genelinde).', en: 'Kicks (network-wide with sync).' },
  { cmd: '/note <player> <text>', perm: 'themis.command.note', tr: 'Sadece yetkililerin gördüğü not.', en: 'Staff-only note.' },
  { cmd: '/unban, /unmute, /unwarn <player|ip|#code> [reason]', perm: 'themis.command.unban …', tr: 'Cezayı kaldırır.', en: 'Revokes a punishment.' },
  { cmd: '/punish <player> <template> [extra]', perm: 'themis.command.punish', tr: 'Şablon merdiveninin sıradaki basamağı.', en: 'Next step of an escalation ladder.' },
  { cmd: '/history <player> [page] [type]', perm: 'themis.command.history', tr: 'Sayfalı, üzerine gelinince detay gösteren sicil.', en: 'Paginated history with hover details.' },
  { cmd: '/staffhistory <staff> [page]', perm: 'themis.command.staffhistory', tr: 'Bir yetkilinin verdiği cezalar.', en: 'Punishments issued by a staff member.' },
  { cmd: '/check <player>', perm: 'themis.command.check', tr: 'Durum, sicil, IP ve hesaplar tek ekranda.', en: 'Status, record, IP and alts on one screen.' },
  { cmd: '/alts <player>', perm: 'themis.command.alts', tr: 'Aynı IP\'yi paylaşan hesaplar.', en: 'Accounts sharing an IP.' },
  { cmd: '/case <#code>', perm: 'themis.command.case', tr: 'Tek bir dosyanın tüm detayı.', en: 'Full detail of one case.' },
  { cmd: '/editcase <#code> reason|duration <value>', perm: 'themis.command.edit', tr: 'Sebep ya da süre düzenleme.', en: 'Edit reason or duration.' },
  { cmd: '/themis about|reload|templates|token|import|webhook', perm: 'themis.command.admin', tr: 'Yönetim.', en: 'Administration.' },
];

export const permissions: { node: string; tr: string; en: string }[] = [
  { node: 'themis.staff', tr: 'Yönetim dışındaki tüm moderasyon komutları.', en: 'Every moderation command except admin.' },
  { node: 'themis.*', tr: 'Her şey.', en: 'Everything.' },
  { node: 'themis.<type>.permanent', tr: 'Kalıcı ban/mute verebilme.', en: 'Issue permanent bans/mutes.' },
  { node: 'themis.limit.<group>', tr: 'config\'teki süre sınırı grubuna bağlar.', en: 'Applies a duration-limit group from the config.' },
  { node: 'themis.limit.bypass', tr: 'Süre sınırlarını yok sayar.', en: 'Ignores duration limits.' },
  { node: 'themis.exempt.<type>', tr: 'Oyuncuyu o ceza türünden muaf tutar.', en: 'Makes a player immune to that type.' },
  { node: 'themis.template.<key> / themis.template.*', tr: 'Şablon kullanımı.', en: 'Use templates.' },
  { node: 'themis.notify / .silent / .alts', tr: 'Duyuru, sessiz ceza ve kaçak uyarıları.', en: 'Broadcasts, silent punishments, evasion alerts.' },
  { node: 'themis.check.ip', tr: 'Maskesiz IP görme.', en: 'See unmasked IPs.' },
];
