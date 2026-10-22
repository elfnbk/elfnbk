"""Denizbank mail sınıflandırıcı.

Konu satırına göre dört karar verir:
  KEEP        - güvenlik, ödeme ve hesap bildirimi; gelen kutusunda kalır
  TRANSACTION - işlem bilgilendirmesi; "İşlem Bilgilendirmeleri" etiketine
                taşınır ve gelen kutusundan kaldırılır
  JUNK        - kampanya, reklam, kutlama; otomatik olarak Junk'a taşınır
  UNKNOWN     - hiçbir listeye uymaz; dokunulmaz, raporda gösterilir

Öncelik sırası: SECURITY (KEEP) > TRANSACTION > diğer KEEP > JUNK > UNKNOWN.

Kullanım:
  python3 classify.py "Konu satırı"            -> tek konu
  python3 classify.py --tsv < threads.tsv      -> id<TAB>konu satırları
"""
import re
import sys

# Gelen kutusunda kalması gereken güvenlik ve ödeme bildirimleri; her zaman önceliklidir.
SECURITY_PATTERNS = [
    r"parola",
    r"şifre",
    r"güvenli",
    r"dolandırıcı",
    r"doğrulama",
    r"(?<!para )giriş",
    r"son ödeme",
    r"borç",
    r"gecikme",
    r"itiraz",
    r"iptal",
    r"sözleşme",
    r"teslim",
    r"hatırlatma",
    r"ekstre",
    r"hesap özeti",
    r"ücretlerde değişiklik",
    r"\bhk\.",
]

# "İşlem Bilgilendirmeleri" etiketine taşınan işlem bilgilendirmeleri.
TRANSACTION_PATTERNS = [
    r"işlem bilgilendirme",
    r"nakit çekil",
    r"harcama iadesi",
    r"talimat",
    r"dekont",
    r"emri bildirim",
    r"yatırıldı",
    r"para girişi",
    r"dijital slip",
    r"hesap hareketleri",
]

# Güvenlik ya da işlem listesine girmeyen genel bildirimler gelen kutusunda kalır.
KEEP_PATTERNS = [
    r"bildirim",
    r"bilgilendirme",
]

JUNK_PATTERNS = [
    r"bonus",
    r"indirim",
    r"taksit",
    r"fırsat",
    r"kampanya",
    r"halka arz",
    r"kutlu olsun",
    r"bayram",
    r"ayrıcalı",
    r"sürpriz",
    r"kültür",
    r"değerlensin",
    r"keşfedin",
    r"kazan",
    r"hediye",
    r"çekiliş",
    r"harcınız",
    r"temassız",
    r"kartsız",
    r"qr kod",
    r"\d[\d.]* tl",
    r"ön onaylı",
    r"krediniz hazır",
    r"kurtaran hesap",
    r"deniz'de",
    r"deniz'in",
    r"anma günü",
    r"yatırım",
    r"fon'da",
    r"portföy",
    r"uçuş mili",
    r"analizleri",
    r"sigortası",
    r"\bbes\b",
    r"fon biriktiren",
    r"keyfini",
    r"deniztrader",
]


def normalize(text: str) -> str:
    # Python'un lower() fonksiyonu "İ" harfini "i̇" yapar; önce Türkçe eşlemeleri uygula.
    text = text.replace("İ", "i").replace("I", "ı")
    text = text.replace("’", "'").replace("̇", "")
    return re.sub(r"\s+", " ", text.lower()).strip()


def classify(subject: str) -> str:
    s = normalize(subject)
    if any(re.search(p, s) for p in SECURITY_PATTERNS):
        return "KEEP"
    if any(re.search(p, s) for p in TRANSACTION_PATTERNS):
        return "TRANSACTION"
    if any(re.search(p, s) for p in KEEP_PATTERNS):
        return "KEEP"
    if any(re.search(p, s) for p in JUNK_PATTERNS):
        return "JUNK"
    return "UNKNOWN"


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--tsv":
        for line in sys.stdin:
            line = line.rstrip("\n")
            if not line:
                continue
            thread_id, subject = line.split("\t", 1)
            print(f"{classify(subject)}\t{thread_id}\t{subject}")
    else:
        print(classify(" ".join(sys.argv[1:])))
