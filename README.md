# 📚 OkuTrack — Öğrenci Okuma Takip ve Analiz Sistemi

**[🚀 Canlı uygulamayı aç](https://alidanis61615.github.io/Ogrenci-Okuma-Takip-Sistemi-/)** · **[Kaynak kodları](https://github.com/alidanis61615/Ogrenci-Okuma-Takip-Sistemi-)**

![HTML5](https://img.shields.io/badge/HTML5-web-E34F26) ![CSS3](https://img.shields.io/badge/CSS3-responsive-1572B6) ![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E) ![License](https://img.shields.io/badge/license-MIT-blue)


Öğrencilerin kitap okuma alışkanlıklarını kaydetmek, günlük hedeflerini takip etmek ve okuma performanslarını analiz etmek için geliştirilmiş, mobil uyumlu web uygulaması.

## Özellikler
- Öğrenci ekleme ve silme
- Kitap ekleme ve silme
- Öğrenci ve kitap bazında tarihli okuma kaydı (sayfa / dakika)
- Öğrenciye göre okuma geçmişini filtreleme
- Toplam öğrenci, kitap, sayfa ve dakika istatistikleri
- Son 7 günün okuma grafiği
- Öğrencilerin toplam sayfa sayısına göre performans sıralaması
- Öğrenci bazında toplam sayfa, okuma süresi, farklı kitap ve okuma günü analizi
- Excel ile açılabilen CSV okuma raporu
- Tek tıkla örnek portföy verileri oluşturma (mevcut verileri değiştirmeden önce onay)
- Günlük sayfa hedefi ve ilerleme çubuğu
- Tarayıcıda kalıcı veri saklama (localStorage)
- JSON yedek indirme ve geri yükleme
- Mobil uyumlu, sade arayüz

## Kullanılan teknolojiler
HTML5, CSS3, Vanilla JavaScript, Web Storage API.

## Çalıştırma
`index.html` dosyasını modern bir tarayıcıda açın. Paket kurulumu ve sunucu gerektirmez.

## Canlı demo
[OkuTrack uygulamasını tarayıcıda aç](https://alidanis61615.github.io/Ogrenci-Okuma-Takip-Sistemi-/). Kurulum gerektirmez. **Örnek verileri yükle** ile test kayıtları oluşturulabilir.

## GitHub Pages
Depo, `main` dalının kök dizinindeki `index.html` üzerinden GitHub Pages ile yayınlanabilir.

## Kullanım
1. Önce öğrenci ve kitap ekleyin.
2. Okuma kaydında öğrenci, kitap, tarih, sayfa ve dakika girin.
3. Günlük hedefi belirleyin ve grafiklerden gelişimi inceleyin.
4. Verileri JSON dosyası olarak yedekleyin.

## Veri gizliliği ve sınırlamalar
Bu sürümde hesap sistemi veya sunucu veritabanı yoktur. Kayıtlar yalnızca kullanılan tarayıcının localStorage alanında tutulur. Tarayıcı verileri silinirse kayıtlar kaybolabilir; yedekleme önerilir. Aynı cihazda farklı kullanıcılar için erişim kontrolü sunulmaz. Gerçek öğrenci kişisel verilerini izin ve uygun güvenlik tedbirleri olmadan kullanmayın.

## Gelecek geliştirmeler
Kimlik doğrulama, sunucu tabanlı veritabanı, sınıf yönetimi, PDF raporlama ve kapsamlı otomatik testler.

## Geliştirici
[Ali Danış](https://github.com/alidanis61615)

> Portföy amaçlı geliştirilen eğitim teknolojisi projesidir.

## Portföy demosunu deneme
Uygulamayı açın ve **Örnek verileri yükle** butonuna basın. Onay sonrasında üç örnek öğrenci, üç kitap ve yedi günlük örnek okuma kayıtları oluşturulur. Öğrenci sıralamasını, grafik ve CSV raporunu inceleyin.

**Uyarı:** Örnek veri yükleme, mevcut tarayıcı kayıtlarının yerini alır. Gerçek kayıtlarınız varsa önce JSON yedeğini indirin.

## Doğrulanan kullanıcı senaryoları (12 Ekim 2026)
Kullanıcı tarafından öğrenci/kitap ekleme, okuma kaydı, grafik ve hedef güncellemesi, sayfa yenilemede veri korunması, demo veri yükleme, öğrenci analizi, CSV indirme, JSON yedekleme ve GitHub Pages erişimi çalışır olarak bildirildi. Bunlar kullanıcı testleridir; kapsamlı otomatik uçtan uca test yerine geçmez.

## Manuel test senaryoları
- Öğrenci eklenince öğrenci sayısı artmalı.
- Kitap eklenince kitap sayısı artmalı.
- Okuma kaydı eklenince toplam sayfa, dakika ve grafik güncellenmeli.
- Sayfa yenilendiğinde kayıtlar korunmalı.
- Öğrenci sıralaması sayfa toplamına göre azalan sırada olmalı.
- CSV dosyası indirilebilmeli ve Türkçe karakterler doğru görünmeli.
- Öğrenci seçildiğinde detay analizindeki dört gösterge doğru hesaplanmalı.
- JSON yedek geri yükleme sonrasında veriler korunmalı.
- Örnek veri yükleme öncesinde onay istenmeli.
