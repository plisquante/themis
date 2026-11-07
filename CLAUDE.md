# CLAUDE.md — Themis sitesi

```
  ╔╦╗╦ ╦╔═╗╔╦╗╦╔═╗
   ║ ╠═╣║╣ ║║║║╚═╗   moderasyonun tanrıçası
   ╩ ╩ ╩╚═╝╩ ╩╩╚═╝   — cemo
```

Themis moderasyon eklentisinin (kod: `plisquante/ThemisCode`, özel repo) tanıtım sitesi ve wikisi. Eklenti ücretlidir;
kullanıcı dokümantasyonu yalnızca burada, `wiki/` altında tutulur. Siteden kod reposuna bağlantı verilmez. Tasarım ve altyapı
**cemo**'nun (Cem Ali) konseptidir ve birebir korunur. Metinler eklentinin gerçek özelliklerini anlatır.

## Kurallar

- **Tema ve altyapı değişmez.** Renkler, fontlar, logo animasyonu, arka plandaki 0/1'ler ve düzen zip'teki gibi kalır.
  1440px ve üstünde görünüm orijinalle birebir aynıdır; `css/style.css` sonundaki medya sorguları yalnızca dar ekranlar içindir.
- cemo'nun sorduğu dört değişiklik (fil dişi zemin, para gibi düşen logo, obfuscate kod arka planı, köşeli font)
  sorulduğunda kullanıcı **hiçbirini istemedi**. Kullanıcı açıkça istemeden uygulama.
- Animasyonlar yumuşak ama ağır değil (kullanıcı önce "çok hızlı ve keskin", sonra "fazla yavaş" dedi): zamana bağlı
  in-out eğriler, açılış ~2.2 sn, bölümler görününce bir kez 0.8 sn'de belirir, hover yumuşak geçer (~0.3 sn),
  sayaç 1.6 sn, CSS geçişleri .3–.35 sn. Kaydırmaya bağlı ani geçiş ekleme; süreleri bu aralıkta tut.
- Sitedeki her iddia eklentide gerçekten var olmalı. Rakamlar (22 komut, 20 REST uç noktası, 5 veritabanı)
  eklentiden sayılmıştır; eklenti değişirse burayı da güncelle. Uydurma istatistik yazma.
- Kullanıcı Türkçe konuşur. Site Türkçedir.

## Dosya yapısı

```
index.html          sayfa iskeleti ve metinler
404.html            GitHub Pages hata sayfası (yollar /themis/ ile başlar; özel alan adına geçilirse güncelle)
wiki/*.html         wiki sayfaları (Türkçe); kenar menüsü ve önceki/sonraki bağlantıları js/wiki.js PAGES listesinden
css/wiki.css        wiki düzeni (renkler ve fontlar style.css'ten)
js/wiki.js          wiki menüsü, kopyala düğmeleri, sakin 0/1 arka planı
css/style.css       tüm stiller, renk değişkenleri, @font-face ve dar ekran kuralları
js/main.js          arka plan canvas'ı, kartlar (CARDS), terminal (TERM), tüm animasyonlar
assets/logo.png     logo (900×900, yuvarlak, şeffaf); logo-128.png menü, favicon ve footer için
fonts/              TeX Gyre Pagella, Inter ve Unifont'un Latin + Türkçe alt kümeleri (woff2) ve lisansları
tests/smoke.cjs     tarayıcı testi: `node tests/smoke.cjs` (Playwright gerekir)
```

Build adımı yok. `index.html` herhangi bir statik sunucuyla yayınlanır (ör. `python3 -m http.server`).
**Önbellek:** GitHub Pages CSS/JS'yi 10 dakika önbellekte tutar; yeni sayfa eski stil dosyasıyla açılıp bozuk görünebilir.
Bu yüzden her sayfa `css/*.css?v=N` ve `js/*.js?v=N` ister. CSS ya da JS değişince `index.html`, `404.html` ve
`wiki/*.html` içindeki `?v=` değerini birlikte artır; smoke test hepsinin aynı olduğunu kontrol eder.
GitHub Pages yayını `.github/workflows/deploy.yml` ile `main` dalına her push'ta yapılır.

## Sayfa yapısı

1. **Nav**: sabit üst bar. Logo, "THEMIS", menü (bölümlere ve dokümantasyona bağlantı) ve "Sunucuna Ekle". Kaydırınca arka planı belirginleşir; okunan bölüm menüde vurgulanır.
2. **Hero** (`#hero`): logo (dönen kesikli halka ve nabız gibi atan glow), `THEMIS`, ayraç, "MODERASYONUN TANRIÇASI" ve iki buton.
3. **Özellikler** (`#features`): "Hiçbir suç terazide hafif gelmez." ve 3×2 kart. Kartlar `main.js` içindeki `CARDS` dizisinden üretilir; ikonlar `ICONS` içindeki 11×11 piksel desenlerinden çizilir.
4. **İstatistik şeridi** (`#stats`): üç kutu (komut, REST uç noktası, veritabanı); sayılar görününce sıfırdan sayar (`data-to`).
   Fiyat kutusu kullanıcının isteğiyle kaldırıldı; sitede fiyat gösterilmez. Sayı `<em class="n">` içindedir ve başlıklardaki
   gibi Pagella italik yazılır (kullanıcı istedi); etiket `.stat > span` (alt seçici `.stat span` sayıya da uyup fontunu bozmuştu).
5. **Nasıl çalışır** (`#how`): logodaki üç sembol, bir cezanın üç adımı (Göz Bağı: kayıt, Terazi: sicilin tartılması, Kılıç: yaptırım). Sağdaki terminal `TERM` dizisinden yazılır.
6. **SSS** (`#faq`): aynı adım kutularıyla sekiz soru (iki sütun; çift sayıda tut).
7. **Footer**: "Adalet kodda yazılıdır.", butonlar ve alt satır. Alt satırda **yalnızca** `© 2026 THEMIS` durur; ikili rakamlar
   ve "made by cemo" kullanıcının isteğiyle kaldırıldı (wiki footer'ında da: `© 2026 THEMIS · Lisans`). Geri ekleme.

## Wiki

19 sayfa: index, kurulum, proxy, sss, komutlar, yetkiler, sablonlar, koruma, raporlar, aktarma, yapilandirma, depolama, mesajlar,
rest-api, webhooklar, java-api, placeholderapi, surumler, lisans. Yeni sayfa: `wiki/<anahtar>.html` oluştur (mevcut
bir sayfayı kopyala, `data-page` değerini değiştir) ve `js/wiki.js` içindeki `PAGES` listesine ekle; smoke test ikisinin
eşleştiğini kontrol eder. Eklentide komut, ayar, yetki, mesaj ya da REST değişirse ilgili wiki sayfasını da güncelle.

Arka plan: tam ekran `<canvas id="bits">`. `drawBits(t, scrollY)` −28° açılı ızgarada 0/1 çizer; bitler kümeler halinde değişir, yeni değişen bit kısa bir an parlar.

## Animasyon mimarisi

- Tüm animasyon `main.js` içindeki **`render(t)`** fonksiyonunda, geçen süreye (`t`, saniye) bağlıdır. Bir `requestAnimationFrame` döngüsü her karede bu fonksiyonu çağırır.
- Kaydırmayla açılan öğeler `.reveal` sınıfını taşır; görünürlükleri her karede `getBoundingClientRect` ile hesaplanır.
- Kart hover efekti `mousemove` ile `window.__hover`'a yazılıp `render` içinde uygulanır.
- Yeni animasyonları da `render(t)` içine `t`'ye bağlı yaz; hepsi tek yerden yönetilsin.
- **Tarayıcı çevirisi**: yabancı ziyaretçiler sayfayı tarayıcının çevirisiyle okur. Çeviri metin düğümlerini yerinde değiştirir;
  bu yüzden `render` her karede `innerHTML` yazmaz. Terminal satırları bir kez kurulur ve yalnızca `hidden` ile açılır,
  sayaçlar yalnızca `.n` içindeki sayıyı değiştirir. Komutlar, kodlar, marka ve sayılar `translate="no"` taşır;
  wiki'deki her `<pre>` ve `<code>` da öyle. Smoke test bunları kontrol eder.

## Renkler ve fontlar

`css/style.css` → `:root`:

```css
--bg:#13110e; --cream:#efe3bd; --gold:#d9c58f; --gold-d:#a88d55;
--muted:#a59d88; --dim:#6f6858; --card:rgba(26,23,18,.82); --line:rgba(217,197,143,.16);
```

- Başlıklar: TeX Gyre Pagella (Palatino benzeri klasik serif)
- Gövde metni: Inter
- Etiketler, butonlar, terminal: Unifont

Fontlar `fonts/` klasöründen yüklenir, böylece site her bilgisayarda aynı görünür. Yeni bir karakter
(ör. başka bir dil) gerekirse alt kümeleri `pyftsubset` ile yeniden üret.

Tarz: **neoklasik konulu, sınırlı paletli pixel art madalyon** (logo), **Dark Academia ile hacker/terminal estetiğinin karışımı** (site).

---

## İleride istenirse: cemo'nun dört seçeneğinin uygulama notları

### 1. Fil dişi arka plan

- `--bg` için `#f6f1e3` veya `#fffff0` dene. Tüm palet ters dönmeli:
  metinler koyu (`#1a1712`), altın tonu kontrast için koyulaşmalı (ör. `#8a6d32`),
  kartlar `rgba(255,252,243,.85)` ve ince koyu kenarlık.
- `.hero::before`, `.vignette` ve `footer::before` gradyanları koyu renk üzerine kurulu. Açık renge çevir.
- `drawBits` içindeki `rgba(217,197,143,…)` / `rgba(239,227,189,…)` renkleri koyu kahve/siyah
  ve düşük opaklık olmalı. Rakamlar logoyu ve yazıyı bastırmamalı.
- Logonun dış halkası siyah, açık zeminde iyi durur. `drop-shadow`'u yumuşat.

### 2. Logo para gibi dönüp düşsün

- Açılışta (yaklaşık 0–2.2 sn) `#logo` için `perspective` ile `rotateX` kullan. Logo yukarıdan
  birkaç tur dönerek inmeli, yere değince 2–3 kez giderek azalan sekmeler ve sallanma (wobble) yapıp
  düz durmalı.
- Altına "masa" hissi için elips bir gölge ekle. Logo yükseldikçe gölge küçülüp soluklaşsın,
  indikçe büyüyüp koyulaşsın.
- `logo.png` tek yüzlü. Arka yüz için aynı görseli `backface-visibility` ile çift katman yap ya da
  kenar kalınlığı hissi için birkaç katmanı üst üste koy. Arka yüzde farklı bir tasarım isteyip
  istemediğini kullanıcıya sorabilirsin.
- Şu an `render` içinde logoya uygulanan basit fade/scale girişini bununla değiştir.
- Kullanıcı "x ekseni" dedi. CSS'te `rotateX` paranın takla atması (yazı-tura) anlamına gelir.
  Kendi ekseni etrafında fırıldak gibi dönmesini istiyorsa o `rotateY` olur. Emin değilsen sor.

### 3. 0/1 yerine obfuscate edilmiş kod

- `drawBits` fonksiyonunu değiştir. Izgara mantığı aynı kalabilir. Tek karakter yerine satır satır
  obfuscate edilmiş kod parçaları çizilebilir (hex dizileri, `_0x3fa2[...]` tarzı JS obfuscation,
  x86 asm benzeri satırlar vb.).
- Karakterler zamanla "karışıp çözülme" efektiyle değişebilir. Mevcut parlama efektini koru.
- Kodun kaynağını kullanıcıya sor: kendi kodunun obfuscate edilmiş hali mi, yoksa temsili/sahte kod mu?
- Okunabilirlik: hero ve kartların arkasındaki karartma maskeleri ön plandaki yazıyı korumaya devam etmeli.

### 4. Daha köşeli font

- İki yön var, hangisini istediğini sor:
  - **Pixel font** (logoyla birebir uyumlu): Press Start 2P, Silkscreen, Pixelify Sans, VT323
  - **Köşeli tekno font**: Chakra Petch, Orbitron, Rajdhani, Oxanium
- Klasik havayı korumak isterse başlıkta Cinzel kalıp etiketler ve butonlar pixel font olabilir.
- Türkçe karakterleri (İ, ı, ğ, ş, ç, ö, ü) desteklediğini mutlaka kontrol et.

---

## Bağlantılar

- Satın alma bağlantısı şimdilik `https://builtbybit.com/` (yer tutucu). Mağaza sayfası açılınca `index.html` ve `wiki/*.html` içindeki bütün `builtbybit` bağlantılarını güncelle.
- Dokümantasyon: `wiki/` (yayında `https://plisquante.github.io/themis/wiki/`). Eklentinin config.yml ve mesajları bu adrese bağlanır.
- Değişikliklerden sonra `node tests/smoke.cjs` çalıştır ve sayfayı tarayıcıda 390px ve 1440px genişlikte kontrol et.

## Skill'ler ve araçlar

Proje skill'leri `.claude/skills/` altında (kaynaklar `THIRD_PARTY.md`'de). MCP: `context7`, `serena` (`.mcp.json`).
