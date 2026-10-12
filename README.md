# 📚 OkuTrack — Öğrenci Okuma Takip ve Analiz Sistemi

Öğrencilerin kitap okuma alışkanlıklarını kaydetmek, günlük hedeflerini takip etmek ve okuma performanslarını analiz etmek için geliştirilmiş, mobil uyumlu web uygulaması.

## Özellikler
- Öğrenci ekleme ve silme
- Kitap ekleme ve silme
- Öğrenci ve kitap bazında tarihli okuma kaydı (sayfa / dakika)
- Öğrenciye göre okuma geçmişini filtreleme
- Toplam öğrenci, kitap, sayfa ve dakika istatistikleri
- Son 7 günün okuma grafiği
- Öğrencilerin toplam sayfa sayısına göre performans sıralaması
- Excel ile açılabilen CSV okuma raporu
- Günlük sayfa hedefi ve ilerleme çubuğu
- Tarayıcıda kalıcı veri saklama (localStorage)
- JSON yedek indirme ve geri yükleme
- Mobil uyumlu, sade arayüz

## Kullanılan teknolojiler
HTML5, CSS3, Vanilla JavaScript, Web Storage API.

## Çalıştırma
`index.html` dosyasını modern bir tarayıcıda açın. Paket kurulumu ve sunucu gerektirmez.

## GitHub Pages
Repository > Settings > Pages > Build and deployment > Deploy from a branch > main / (root) > Save.

## Kullanım
1. Önce öğrenci ve kitap ekleyin.
2. Okuma kaydında öğrenci, kitap, tarih, sayfa ve dakika girin.
3. Günlük hedefi belirleyin ve grafiklerden gelişimi inceleyin.
4. Verileri JSON dosyası olarak yedekleyin.

## Veri gizliliği ve sınırlamalar
Bu sürümde hesap sistemi veya sunucu veritabanı yoktur. Kayıtlar yalnızca kullanılan tarayıcının localStorage alanında tutulur. Tarayıcı verileri silinirse kayıtlar kaybolabilir; yedekleme önerilir. Aynı cihazda farklı kullanıcılar için erişim kontrolü sunulmaz. Gerçek öğrenci kişisel verilerini izin ve uygun güvenlik tedbirleri olmadan kullanmayın.

## Gelecek geliştirmeler
Kimlik doğrulama, sunucu tabanlı veritabanı, sınıf yönetimi, CSV/PDF raporlama ve otomatik testler.

## Geliştirici
[Ali Danış](https://github.com/alidanis61615)

> Portföy amaçlı geliştirilen eğitim teknolojisi projesidir.
