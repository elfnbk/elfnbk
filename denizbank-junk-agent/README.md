# Denizbank Junk Ajanı

Bu klasör, Gmail gelen kutusuna Denizbank'tan (info@e-posta.denizbank.com) yeni gelen mailleri her sabah 09:00'da sınıflandıran günlük ajanın kurallarını içerir. Ajan yalnızca son iki gün içinde gelen maillere bakar; daha eski maillere dokunmaz.

Kredi kartı işlem bilgilendirmesi, nakit çekim, EFT/havale para girişi, harcama iadesi ve otomatik ödeme talimatı gibi işlem bildirimleri kendiliğinden "İşlem Bilgilendirmeleri" etiketine taşınır ve gelen kutusundan kaldırılır; bu mailler Junk'a alınmaz. Gmail özel gelen kutusu sekmesi oluşturmaya izin vermediği için bu etiket sol menüde ayrı bir klasör olarak görünür. Aynı dizide yeni bir mesaj gelince dizi gelen kutusuna geri döner; ajan ertesi sabah onu yeniden taşır. Parola değişikliği, güvenlik uyarısı, ekstre ve son ödeme hatırlatması gibi bildirimler gelen kutusunda kalır. Kampanya mailleri yalnızca listelenir; Junk'a taşınmaları için tek bir toplu onay gerekir.

Kampanya mailleri ile işlem bildirimleri aynı adresten geldiği için mailler Spam'e işaretlenmez. Spam işareti Gmail'in bu adresi öğrenmesine ve zamanla önemli bildirimleri de Spam'e atmasına yol açabilir. Bunun yerine ajan ilgili etiketi ekler ve maili gelen kutusundan kaldırır (arşivler). Hiçbir mail silinmez; yanlış taşınan bir mail etiketinden bulunup gelen kutusuna geri alınabilir.

`classify.py` konu satırına göre KEEP, TRANSACTION, JUNK ve UNKNOWN kararı verir. Güvenlik kalıpları her zaman önceliklidir, hiçbir listeye uymayan mail taşınmaz. `agent_prompt.md`, Claude Code rutininin her gün çalıştırdığı talimattır ve kural listeleri `classify.py` ile aynıdır. Kurallarda değişiklik yapıldığında rutinin talimatının da güncellenmesi gerekir.

Kuralları yerelde denemek için:

```
python3 classify.py "Kredi Kartı İşlem Bilgilendirmesi"
```
