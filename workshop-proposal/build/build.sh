set -e
python3 hyph.py
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
node render.js
python3 - <<'PY'
from pypdf import PdfReader, PdfWriter
b=PdfReader('body.pdf'); c=PdfReader('cover.pdf')
w=PdfWriter(); w.add_page(c.pages[0])
for p in b.pages[1:]: w.add_page(p)
w.add_metadata({'/Title':'(Imaginary) Lands of Border: What Line Contains'})
w.write('../ImaginaryLandsOfBorder_WorkshopProposal_v6.pdf'); print('pages',len(b.pages))
PY
