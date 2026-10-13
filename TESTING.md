# OkuTrack — Manuel Test Senaryoları

Kontrolleri örnek kayıtlarla gerçekleştirin. JSON geri yükleme ve örnek veri yükleme mevcut kayıtları değiştirir.

| Senaryo | Beklenen sonuç |
| --- | --- |
| Öğrenci ekleme | Öğrenci listesi ve toplam öğrenci sayısı güncellenir |
| Kitap ekleme | Kitap listesi ve toplam kitap sayısı güncellenir |
| Okuma kaydı | Sayfa/dakika toplamları, günlük hedef ve grafik güncellenir |
| Öğrenci filtresi | Yalnızca seçili öğrencinin okuma geçmişi gösterilir |
| Öğrenci sıralaması | Toplam sayfaya göre azalan sıralama görünür |
| Öğrenci analizi | Sayfa, dakika, farklı kitap ve okuma günü doğru hesaplanır |
| Sayfayı yenileme | Kaydedilen veriler korunur |
| CSV dışa aktarma | Dosya indirilir; Excel'de Türkçe karakterler doğru görünür |
| JSON yedek/geri yükleme | Alınan yedek geri yüklendiğinde kayıtlar geri gelir |
| Örnek veri yükleme | Önce onay istenir; üç öğrenci, üç kitap ve yedi günlük kayıt oluşur |
| Mobil görünüm | Formlar, menüler ve göstergeler küçük ekranda kullanılabilir |

## Otomatik kontrolün kapsamı

GitHub Actions içindeki `ci.yml`, gömülü JavaScript'in sözdizimini ve gerekli arayüz öğelerinin varlığını kontrol eder. Bu kontrol, yukarıdaki akışları tarayıcıda çalıştırmaz.

## Önceki kullanıcı doğrulaması

12 Ekim 2026 tarihinde öğrenci/kitap ekleme, okuma kaydı, grafik ve hedef güncellemesi, veri kalıcılığı, demo yükleme, öğrenci analizi, CSV, JSON yedekleme/geri yükleme ve canlı demo erişimi kullanıcı tarafından çalışır olarak bildirildi.
