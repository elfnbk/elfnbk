import re, pyphen
dic = pyphen.Pyphen(lang='en_US', left=3, right=3)
src = open('proposal.html', encoding='utf-8').read()
head, body = src.split('<body>', 1)
def hy(m):
    w = m.group(0)
    if len(w) < 7 or not w.isascii() or w[0].isupper(): return w
    return dic.inserted(w, hyphen='­')
def text(seg):
    return re.sub(r'[A-Za-z]+', hy, seg)
# hyphenate text nodes only inside td (not class l), p, figcaption, .cap
out = []; pos = 0
for m in re.finditer(r'<(td(?![^>]*class="l")|p|figcaption|div class="cap")[^>]*>(.*?)</(td|p|figcaption|div)>', body, re.S):
    out.append(body[pos:m.start(2)])
    inner = m.group(2)
    inner = re.sub(r'(>|^)([^<]+)', lambda t: t.group(1) + text(t.group(2)), inner)
    out.append(inner); pos = m.end(2)
out.append(body[pos:])
open('proposal_h.html', 'w', encoding='utf-8').write(head + '<body>' + ''.join(out))
