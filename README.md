# OkuTrack — Öğrenci Okuma Takip ve Analiz

Öğrencilerin kitap okuma alışkanlıklarını kaydetmek, günlük hedeflerini takip etmek ve okuma performanslarını analiz etmek için geliştirilen, mobil uyumlu web uygulaması.

**[Canlı demoyu aç](https://alidanis61615.github.io/Ogrenci-Okuma-Takip-Sistemi-/) · [Test senaryoları](TESTING.md) · [MIT lisansı](LICENSE)**

[![Code quality](https://github.com/alidanis61615/Ogrenci-Okuma-Takip-Sistemi-/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alidanis61615/Ogrenci-Okuma-Takip-Sistemi-/actions/workflows/ci.yml)

## Özellikler

| Alan | İşlevler |
| --- | --- |
| Kayıt yönetimi | Öğrenci ve kitap ekleme/silme; tarih, sayfa ve dakika ile okuma kaydı |
| İstatistikler | Öğrenci/kitap sayısı, toplam sayfa ve dakika, öğrenci sıralaması |
| Hedef ve grafik | Günlük sayfa hedefi, ilerleme çubuğu ve son 7 günlük okuma grafiği |
| Öğrenci analizi | Toplam sayfa, okuma süresi, farklı kitap ve okuma günü sayısı |
| Raporlama | Excel'de açılabilen CSV okuma raporu |
| Veri yönetimi | localStorage ile kayıt saklama; JSON yedek indirme/geri yükleme |
| Demo | Onayla yüklenen örnek öğrenci, kitap ve okuma kayıtları |

## Bir dakikalık demo

1. **[Canlı uygulamayı](https://alidanis61615.github.io/Ogrenci-Okuma-Takip-Sistemi-/)** açın.
2. **Örnek verileri yükle** seçeneğiyle demo kayıtlarını oluşturun.
3. Öğrenci sıralamasını ve son 7 günlük grafiği inceleyin.
4. Bir öğrenci seçerek detay analizini açın.
5. CSV raporunu ve JSON yedeğini indirin.

Örnek veri yükleme ve JSON geri yükleme mevcut tarayıcı kayıtlarının yerini alır. Kayıtlarınız varsa önce JSON yedeğini alın.

## Kullanım

Önce öğrenci ve kitap ekleyin. Okuma kaydında öğrenci, kitap, tarih, sayfa ve dakika bilgilerini girin. Günlük hedefi belirleyerek ilerlemeyi takip edin; öğrenci filtresi ile geçmiş kayıtları inceleyin.

## Teknolojiler ve yapı

- **HTML5 ve CSS3:** Mobil uyumlu arayüz ve formlar.
- **Vanilla JavaScript:** Kayıt yönetimi, öğrenci analizi, grafik ve rapor üretimi.
- **Web Storage API:** Tarayıcıda localStorage ile veri saklama.
- **CSV / JSON:** Rapor dışa aktarma ve yedekleme.
- **GitHub Pages:** Kurulum gerektirmeyen canlı demo.
- **GitHub Actions:** JavaScript sözdizimi ve Node/jsdom ile 22 davranış testi.

Arayüz `index.html`, stiller `styles.css`, veri ve yedek kuralları `core.js`, ekran/depolama akışı `app.js` içindedir. Uygulamayı kullanmak için paket kurulumu gerekmez; otomatik testler için Node.js ve `npm ci --ignore-scripts` kullanılır.

## Teknik incelemeye hızlı başlangıç

| İnceleme | Kaynak / akış |
| --- | --- |
| Kayıt yönetimi ve kalıcı veri | [`app.js`](app.js): `save()`, `render()` ve localStorage |
| Öğrenci bazında hesaplamalar ve grafik | [Öğrenci analizi](core.js): `analysis()` · [Grafik](app.js): `render()` |
| CSV ve JSON veri aktarımı | [CSV / JSON işlemleri](core.js): `toCSV()`, `parseBackup()` ve `restoreBackup()` |
| Yedek kontrolü | [`validateState()`](core.js): sayılar, takvim tarihleri, benzersiz kimlikler ve kayıt ilişkileri |
| Otomatik ve manuel doğrulama | [CI iş akışı](.github/workflows/ci.yml) · [Manuel test rehberi](TESTING.md) |

## Yerelde çalıştırma

```bash
git clone https://github.com/alidanis61615/Ogrenci-Okuma-Takip-Sistemi-.git
cd Ogrenci-Okuma-Takip-Sistemi-
```

`index.html` dosyasını modern bir tarayıcıda açın. Yerel kullanım ve canlı demo farklı tarayıcı depolama alanları kullanır; kayıt taşımak için JSON yedek alın.

## Doğrulama

12 Ekim 2026 tarihinde kullanıcı tarafından öğrenci/kitap ekleme, okuma kaydı, grafik ve hedef güncellemesi, sayfa yenilemede veri korunması, demo verileri, öğrenci analizi, CSV indirme, JSON yedekleme/geri yükleme ve GitHub Pages erişimi çalışır olarak bildirildi.

Otomatik kontroller JavaScript sözdizimini ve 22 davranış testini çalıştırır. Node testleri veri/yedek kurallarını, jsdom testleri ise formlar, analiz, yeniden yükleme ve depolama hata akışlarını denetler. Gerçek tarayıcıdaki mobil görünüm ve dosya indirme kontrolleri için [TESTING.md](TESTING.md) kullanılır.

## Veri ve kapsam

Kayıtlar yalnızca kullanılan tarayıcıda tutulur. Kullanıcı hesabı, sunucu veritabanı, çok kullanıcılı erişim veya cihazlar arasında eşitleme bulunmaz. Tarayıcı verileri silindiğinde kayıtlar kaybolabilir; JSON yedekleme bu nedenle önemlidir.

Kimlik doğrulama, sunucu veritabanı, sınıf yönetimi ve PDF raporları sonraki geliştirme hedefleridir.

**Geliştirici:** [Ali Danış](https://github.com/alidanis61615) · Mobil Teknolojileri mezunu, Yazılım Geliştirici

## Kod yapısı ve otomatik testler

- `core.js`: yedek doğrulama, kayıt ilişkileri, öğrenci analizi ve CSV üretimi.
- `app.js`: formlar, görünüm ve tarayıcı depolama akışı.
- `styles.css`: responsive arayüz.
- `test/`: Node test runner ve jsdom ile 22 davranış testi.

```bash
npm ci --ignore-scripts
npm run check
npm test
```

Yedek yükleme; tam sayıları, gerçek takvim tarihlerini, benzersiz kimlikleri ve öğrenci/kitap ilişkilerini doğrular. Geçersiz veya 2 MB sınırını aşan JSON mevcut kayıtların üzerine yazılmaz. Tarayıcı depolama hatasında ekran kaydedilmemiş veriyi başarılı göstermemiş olur. Başlangıçtaki kayıtlar okunamıyorsa orijinal içerik korunur ve kurtarma indirmesi sunulur.

Testler; öğrenci/kitap/okuma oluşturma, sayfa hedefi, öğrenci analizi, yeniden yükleme, bozuk yedek, kayıt kotası, ilişkili kayıtların silinmesi ve CSV formül korumasını kapsar.
