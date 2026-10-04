# Denizbank Junk Ajanı

Bu klasör, Gmail gelen kutusuna Denizbank'tan (info@e-posta.denizbank.com) gelen kampanya, reklam ve kutlama maillerini "Junk" etiketine taşıyan günlük ajanın kurallarını içerir. Kart harcaması, nakit çekim, harcama iadesi, otomatik ödeme talimatı, döviz emri, parola değişikliği ve güvenlik uyarısı gibi bildirimler gelen kutusunda kalır.

Kampanya mailleri ile işlem bildirimleri aynı adresten geldiği için mailler Spam'e işaretlenmez. Spam işareti Gmail'in bu adresi öğrenmesine ve zamanla önemli bildirimleri de Spam'e atmasına yol açabilir. Bunun yerine ajan "Junk" etiketini ekler ve maili gelen kutusundan kaldırır (arşivler). Hiçbir mail silinmez; yanlış taşınan bir mail Gmail'de "Junk" etiketinden bulunup gelen kutusuna geri alınabilir.

`classify.py` konu satırına göre KEEP, JUNK ve UNKNOWN kararı verir. KEEP kalıpları her zaman önceliklidir, iki listeye de uymayan mail taşınmaz. `agent_prompt.md`, Claude Code rutininin her gün çalıştırdığı talimattır ve kural listeleri `classify.py` ile aynıdır. Kurallarda değişiklik yapıldığında rutinin talimatının da güncellenmesi gerekir.

Kuralları yerelde denemek için:

```
python3 classify.py "Market Alışverişlerinize 500 TL bonus!"
```
