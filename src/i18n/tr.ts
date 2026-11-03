import type { Dict } from './types';
import { templateYaml, storageYaml, limitsYaml, webhookYaml, gradleSample, javaSample, eventsSample, restSample, webhookSample } from './code';
import { esc } from './util';

const pre = (s: string) => `<pre><code>${esc(s)}</code></pre>`;

export const tr: Dict = {
  meta: {
    title: 'Themis — Minecraft sunucuları için moderasyon',
    description: 'Ban, mute, uyarı, ceza merdivenleri, kaçak hesap tespiti, REST API ve imzalı webhook\'lar. Paper 1.21 – 26.x için moderasyon eklentisi.',
  },
  nav: { features: 'Özellikler', demo: 'Demo', developers: 'Geliştiriciler', pricing: 'Fiyat', docs: 'Belgeler', buy: 'Satın al', theme: 'Temayı değiştir (T)', language: 'English', menu: 'Menü' },
  hero: {
    pill: 'Themis 1.0 çıktı — LiteBans ve AdvancedBan\'dan tek komutla geçiş',
    pillHref: 'docs/#migration',
    title: 'Sunucunda adalet, terazide.',
    lead: '/ban ve /mute\'un olması gerektiği hâli. Ceza merdivenleri, ağ genelinde anlık senkron, kaçak hesap tespiti ve geliştiricilere tamamen açık bir API.',
    cta: 'Themis\'i edinin — $20',
    demo: 'Tarayıcıda deneyin',
    stats: [
      { value: '5', label: 'veritabanı: H2, SQLite, MySQL, MariaDB, PostgreSQL' },
      { value: '<1 ms', label: 'sohbet kontrolü; veritabanına dokunmaz' },
      { value: '16', label: 'REST uç noktası, OpenAPI 3.1 ile' },
    ],
  },
  demo: {
    title: 'Satın almadan önce kullanın',
    lead: 'Bu, eklentinin gerçek komut söz dizimi. Bir komut yazın ya da aşağıdakilerden birini seçin; oyuncunun ekranını, canlı API akışını ve Discord kaydını yan panelden izleyin.',
    placeholder: '/ban Steve 7d x-ray',
    run: 'Çalıştır',
    reset: 'Sıfırla',
    chips: ['/mute Alex 30m spam', '/punish Steve spam', '/punish Steve spam', '/history Steve', '/check Alex', '/ban Notch 7d x-ray -s', '/unmute Alex', '/case'],
    tabs: { screen: 'Oyuncu ekranı', stream: 'Canlı API akışı', discord: 'Discord' },
    screenIdle: 'Bir oyuncuyu cezalandırın; onun ne gördüğü burada belirir.',
    streamIdle: 'GET /v1/stream bağlı. Olay bekleniyor…',
    discordIdle: 'Webhook bağlı. İlk cezayı bekliyor.',
    hint: '↑ / ↓ geçmiş · Tab tamamlama · /help tüm komutlar',
  },
  features: {
    title: 'Bir moderasyon ekibinin ihtiyacı olan her şey',
    lead: 'Themis, yetkililerin her gün kullandığı akışlar etrafında tasarlandı: hızlı karar, tutarlı ceza, kayıt dışı hiçbir şey.',
    items: [
      { icon: 'ladder', title: 'Ceza merdivenleri', body: '/punish Steve spam yazın; Themis oyuncunun geçmişine bakar ve sıradaki basamağı uygular. Eski suçlar istediğiniz süre sonra unutulur.' },
      { icon: 'network', title: 'Ağ genelinde anlık', body: 'MySQL, MariaDB veya PostgreSQL ile tüm sunucular aynı sicili paylaşır. Redis ya da yalnızca SQL ile ban, kick ve mute her sunucuda saniyesinde geçerli.' },
      { icon: 'eye', title: 'Kaçak hesap tespiti', body: 'IP geçmişi ve bağlı hesap grafiği. Yasaklı bir oyuncunun ikinci hesabı girdiği an yetkililere tıklanabilir bir uyarı düşer.' },
      { icon: 'hash', title: 'Dosya numaraları', body: 'Her cezanın kısa bir kodu var: #7KQ2MX. İtirazlarda, /case ve /editcase\'de, API\'de ve Discord\'da aynı kod.' },
      { icon: 'shield', title: 'Rütbe sınırları', body: 'Helper en fazla 2 saat mute, moderatör 30 gün ban. Kalıcı ceza ayrı bir yetki. Kimse yetkisini aşamaz.' },
      { icon: 'api', title: 'REST API ve canlı akış', body: 'Kapsamlı anahtarlar, hız sınırı, idempotency, CORS ve Server-Sent Events. Panelinizi, botunuzu, sitenizi bağlayın.' },
      { icon: 'hook', title: 'İmzalı webhook\'lar', body: 'Discord için hazır embed\'ler, kendi sunucunuz için HMAC-SHA256 imzalı JSON. Başarısız gönderimler otomatik tekrar denenir.' },
      { icon: 'chat', title: 'Hover ve tıklama her yerde', body: 'Sicil satırının üzerine gelin, detay açılır; koda tıklayın, dosya açılır. MiniMessage ile tamamen özelleştirilebilir, Türkçe hazır.' },
    ],
  },
  ladder: {
    title: 'Aynı suça her seferinde aynı ceza',
    lead: 'Merdivenler, ekipteki herkesin aynı kuralı uygulamasını sağlar. Aşağıdaki şablon config.yml\'deki varsayılan "spam" merdiveni.',
    offence: 'Suç ekle',
    reset: 'Baştan',
    template: 'spam · 30 günde unutulur',
    steps: [
      { label: 'Uyarı', detail: '7 gün geçerli' },
      { label: 'Mute', detail: '30 dakika' },
      { label: 'Mute', detail: '2 saat' },
      { label: 'Mute', detail: '1 gün' },
      { label: 'Ban', detail: '3 gün' },
    ],
    current: 'Sıradaki ceza',
  },
  dev: {
    title: 'Geliştiricilere tamamen açık',
    lead: 'Themis API\'si sonradan eklenmiş bir kanca değil; eklentinin kendisi de aynı API\'yi kullanıyor. MIT lisanslı, platformdan bağımsız, sürümlü.',
    docs: 'API belgeleri',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    points: [
      { title: 'Java API', body: 'Servisler, builder\'lar, iptal edilebilir ve değiştirilebilir olaylar, kendi şablonlarınız, her cezada metadata.' },
      { title: 'REST + SSE', body: '{data} / {error} zarfı, OpenAPI 3.1, X-RateLimit başlıkları, Idempotency-Key ve canlı olay akışı.' },
      { title: 'Webhook', body: 'Stripe tarzı imza: t=<zaman>,v1=<hmac>. Tekrar saldırısına karşı zaman damgası.' },
    ],
  },
  compare: {
    title: 'Neden Themis',
    lead: 'Çoğu ban eklentisi ceza verir ve orada durur. Themis ekibinizin iş akışının tamamını kapsar.',
    themis: 'Themis',
    typical: 'Tipik ban eklentisi',
    rows: [
      { label: 'Ceza merdivenleri ve unutma süresi', themis: 'Var', typical: 'Yok ya da elle' },
      { label: 'Rütbe başına süre sınırı', themis: 'Var', typical: 'Nadiren' },
      { label: 'REST API', themis: '16 uç nokta, kapsamlı anahtarlar', typical: 'Yok' },
      { label: 'Canlı olay akışı (SSE)', themis: 'Var', typical: 'Yok' },
      { label: 'İmzalı webhook + Discord', themis: 'HMAC + embed', typical: 'Sadece Discord, imzasız' },
      { label: 'Java olayları', themis: 'İptal edilebilir ve değiştirilebilir', typical: 'Sadece bilgi amaçlı' },
      { label: 'Ağ senkronu', themis: 'SQL veya Redis', typical: 'Ayrı proxy eklentisi' },
      { label: 'Kaçak hesap uyarısı', themis: 'Giriş anında, tıklanabilir', typical: 'Komutla sorgu' },
      { label: 'Kurulum', themis: 'Sıfır ayar (H2)', typical: 'Veritabanı şart' },
    ],
  },
  install: {
    title: 'Beş dakikada yayında',
    lead: 'Jar\'ı atın, sunucuyu başlatın. Varsayılan ayarlar tek sunucu için hazır; ağ için veritabanı satırlarını doldurun.',
    steps: [
      { title: 'Jar\'ı plugins/ klasörüne atın', body: 'Paper 1.21 – 26.x, Java 21+. Gerekli kütüphaneler ilk açılışta otomatik iner.' },
      { title: 'Ekibinize yetki verin', body: 'themis.staff tüm moderasyon komutlarını verir. Helper\'lar için themis.limit.helper ekleyin.' },
      { title: 'Eski cezalarınızı taşıyın', body: '/themis import litebans <jdbc-url> <kullanıcı> <şifre> — sicil, süreler ve kaldırılanlar korunur.' },
    ],
  },
  pricing: {
    title: 'Tek fiyat, her şey dahil',
    lead: 'Abonelik yok, "pro sürüm" yok. Bir kez alın, tüm 1.x güncellemeleri sizin.',
    price: '$20',
    per: 'tek seferlik · ağ başına lisans',
    buy: 'Themis\'i satın al',
    note: 'Sahibi olduğunuz tüm sunucularda kullanabilirsiniz. Geliştirici API\'si MIT lisanslıdır.',
    includes: ['Tüm komutlar ve ceza merdivenleri', 'REST API, canlı akış ve webhook\'lar', 'Ağ senkronu (SQL / Redis)', 'LiteBans, AdvancedBan ve vanilla aktarımı', 'Türkçe ve İngilizce mesajlar', 'Tüm 1.x güncellemeleri ve destek'],
    faqTitle: 'Sık sorulanlar',
    faq: [
      { q: 'Velocity veya BungeeCord gerekiyor mu?', a: 'Hayır. Her Paper sunucusuna Themis kurup aynı veritabanını gösterin; senkron SQL ya da Redis ile çalışır.' },
      { q: 'Folia destekleniyor mu?', a: 'Henüz değil. Paper 1.21 ile 26.x arası ve Purpur gibi Paper çatalları destekleniyor.' },
      { q: 'Mevcut banlarım ne olacak?', a: '/themis import ile vanilla, LiteBans ve AdvancedBan verileri sürelerini ve durumlarını koruyarak aktarılır.' },
      { q: 'Mesajları değiştirebilir miyim?', a: 'Her mesaj messages_tr.yml içinde MiniMessage biçiminde; renkler tek bir yerden değişir.' },
    ],
  },
  themes: {
    title: 'Bu site de temalı',
    lead: 'Themis\'in rengi logodaki bordo ve parşömenden geliyor. Klavyede T\'ye basarak ya da aşağıdan bir tema seçerek siteyi değiştirin.',
  },
  footer: {
    tagline: 'Sunucunda adalet, terazide.',
    product: 'Ürün',
    resources: 'Kaynaklar',
    legal: 'Yasal',
    license: 'Lisans',
    changelog: 'Sürüm notları',
    support: 'Destek',
    rights: 'Tüm hakları saklıdır.',
  },
  docs: {
    title: 'Belgeler',
    lead: 'Kurulumdan API\'ye kadar Themis hakkında bilmeniz gereken her şey.',
    toc: 'İçindekiler',
    back: 'Ana sayfa',
    sections: [
      { id: 'install', title: 'Kurulum', html: `<p>Themis, Paper 1.21 ile 26.x arası sürümlerde ve Java 21+ ile çalışır.</p>
<ol><li><code>Themis-1.0.0.jar</code> dosyasını <code>plugins/</code> klasörüne koyun ve sunucuyu başlatın.</li>
<li>İlk açılışta veritabanı sürücüleri otomatik indirilir ve <code>plugins/Themis/config.yml</code> oluşur.</li>
<li>Varsayılan depolama gömülü H2'dir; tek sunucu için başka ayar gerekmez.</li>
<li>Ekibinize <code>themis.staff</code> verin. Yöneticiler için <code>themis.*</code>.</li></ol>` },
      { id: 'commands', title: 'Komutlar', html: '{{commands}}<p>Süreler: <code>30s 10m 2h 7d 2w 1mo 1y</code>, birleştirilebilir (<code>1d12h</code>) ya da <code>perm</code>. Bayraklar: <code>-s</code> sessiz, <code>-p</code> herkese açık, <code>-ip</code> IP cezası, <code>-r</code> mevcut cezayı değiştir, <code>-scope=survival</code> sadece o sunucu.</p>' },
      { id: 'permissions', title: 'Yetkiler', html: '{{permissions}}' },
      { id: 'storage', title: 'Depolama ve ağ', html: `<p>Birden çok sunucu aynı sicili paylaşacaksa MySQL, MariaDB veya PostgreSQL kullanın ve her sunucuya farklı bir <code>server-name</code> verin. <code>sync.mode: SQL</code> ek yazılım istemez (veritabanını yoklar); <code>REDIS</code> anlıktır.</p>${pre(storageYaml)}` },
      { id: 'templates', title: 'Ceza merdivenleri', html: `<p>Her şablon bir basamak listesidir. Oyuncu o şablondan kaç kez ceza aldıysa bir sonraki basamak uygulanır; son basamak tekrar eder. <code>decay</code> eski suçların ne zaman unutulacağını belirler. Basamak biçimi: <code>&lt;ban|mute|warn|kick|note&gt; [süre|perm] [ip]</code>.</p>${pre(templateYaml)}<p>Kullanım: <code>/punish Steve spam</code>. Yetki: <code>themis.template.spam</code>.</p>` },
      { id: 'limits', title: 'Rütbe sınırları', html: `<p>Bir yetkilinin verebileceği en uzun süreyi grup bazında sınırlayın. Oyuncu birden çok gruptaysa en cömert olanı geçerlidir.</p>${pre(limitsYaml)}` },
      { id: 'rest', title: 'REST API', html: `<p><code>rest-api.enabled: true</code> yapın ve oyunda bir anahtar oluşturun: <code>/themis token create panel read,write,stream</code>. Anahtar yalnızca bir kez gösterilir; veritabanında sadece SHA-256 özeti saklanır.</p>${pre(restSample)}
<p>Kapsamlar: <code>read</code>, <code>write</code>, <code>stream</code>, <code>admin</code>. Tüm uç noktalar ve şemalar <code>GET /v1/openapi.json</code> adresinde. IP adresleri varsayılan olarak maskelenir (<code>84.12.x.x</code>).</p>
<table><thead><tr><th>Uç nokta</th><th>Açıklama</th></tr></thead><tbody>
<tr><td><code>GET /v1/health</code></td><td>Durum ve sürüm (anahtarsız)</td></tr>
<tr><td><code>GET /v1/punishments</code></td><td>Filtreler: target, ip, issuer, type, status, template, search, since, until, limit, offset</td></tr>
<tr><td><code>POST /v1/punishments</code></td><td>Ceza ver (Idempotency-Key destekli)</td></tr>
<tr><td><code>GET|PATCH|DELETE /v1/punishments/{id|kod}</code></td><td>Oku, düzenle, kaldır</td></tr>
<tr><td><code>GET /v1/players/{ad|uuid}</code></td><td>Profil, aktif ban/mute, sayılar; /punishments, /alts, /ips</td></tr>
<tr><td><code>POST /v1/templates/{key}/apply</code></td><td>Merdivenin sıradaki basamağı</td></tr>
<tr><td><code>GET /v1/stream</code></td><td>Server-Sent Events: punishment.issued, .revoked, .edited, .expired</td></tr>
<tr><td><code>GET /v1/stats</code></td><td>Tür başına aktif / 24 saat / 7 gün / toplam</td></tr></tbody></table>` },
      { id: 'webhooks', title: 'Webhook\'lar', html: `<p><code>DISCORD</code> biçimi bir Discord webhook URL\'sine hazır embed gönderir. <code>THEMIS</code> biçimi imzalı JSON gönderir; başarısız gönderimler 5 kez, artan aralıklarla tekrar denenir. Test için <code>/themis webhook test</code>.</p>${pre(webhookYaml)}<p>İmzayı doğrulama:</p>${pre(webhookSample)}` },
      { id: 'java-api', title: 'Java API', html: `<p><code>themis-api</code> MIT lisanslıdır ve Bukkit\'e bağlı değildir. <code>plugin.yml</code> dosyanıza <code>softdepend: [Themis]</code> ekleyin.</p>${pre(gradleSample)}${pre(javaSample)}${pre(eventsSample)}
<p>Olaylar: <code>PunishmentIssueEvent</code> (iptal edilebilir, değiştirilebilir), <code>PunishmentIssuedEvent</code>, <code>PunishmentRevokeEvent</code>, <code>PunishmentRevokedEvent</code>, <code>PunishmentEditedEvent</code>, <code>PunishmentExpiredEvent</code>, <code>PlayerBlockedEvent</code>, <code>AltJoinEvent</code>. Tüm depolama çağrıları <code>CompletableFuture</code> döner; ana thread\'de <code>join()</code> çağırmayın.</p>` },
      { id: 'placeholders', title: 'PlaceholderAPI', html: `<p><code>%themis_muted%</code>, <code>%themis_mute_reason%</code>, <code>%themis_mute_remaining%</code>, <code>%themis_mute_code%</code>, <code>%themis_warnings%</code>, <code>%themis_punishments%</code>, <code>%themis_bans%</code>, <code>%themis_mutes%</code></p>` },
      { id: 'migration', title: 'Diğer eklentilerden geçiş', html: `<ul><li><code>/themis import vanilla</code> — banned-players.json ve banned-ips.json</li>
<li><code>/themis import litebans jdbc:mysql://host:3306/litebans kullanıcı şifre [önek]</code></li>
<li><code>/themis import advancedban jdbc:mysql://host:3306/advancedban kullanıcı şifre</code></li></ul>
<p>Aktarılan kayıtlar süreleri, durumları ve kaldıranlarıyla korunur ve metadata\'da <code>imported_from</code> ile işaretlenir.</p>` },
    ],
  },
};
