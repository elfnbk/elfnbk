const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'file://' + path.resolve('proposal_h.html');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Resolve soft hyphens: breaks.json lists, in PDF reading order, each word prefix at which the
  // print layout breaks a line, with the word before it on that line. Those soft hyphens become
  // visible hyphens and all others are removed, so the PDF keeps the same line breaks but
  // carries no invisible U+00AD characters. Table cells are read across columns in the PDF,
  // so a match may come from the next few pending breaks rather than strictly the first.
  const breaks = JSON.parse(require('fs').readFileSync('breaks.json', 'utf8'));
  const n = await page.evaluate((breaks) => {
    const letters = s => s.replace(/[^A-Za-z\u00C0-\u017F]/g, '');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) if (walker.currentNode.data.includes('\u00ad')) nodes.push(walker.currentNode);
    const pending = breaks.map((b, i) => ({ pre: b[0], prev: b[1], prev2: b[2], i }));
    let kept = 0;
    for (const node of nodes) {
      const d = node.data; let out = '';
      for (let i = 0; i < d.length; i++) {
        if (d[i] !== '\u00ad') { out += d[i]; continue; }
        const ws = out.split(/\s+/), prefix = letters(ws[ws.length - 1].split('-').pop());
        const prev = letters(ws[ws.length - 2] || ''), prev2 = letters(ws[ws.length - 3] || '');
        const hit = pending.slice(0, node.parentElement.closest('td') ? 4 : 1).findIndex(b => b.pre === prefix && (b.prev === null || b.prev === prev) && (b.prev2 === null || b.prev2 === prev2));
        if (hit >= 0) { pending.splice(hit, 1); out += '-'; kept++; }
      }
      node.data = out;
    }
    return [kept, pending];
  }, breaks);
  if (n[1].length) { console.error('unmatched hyphen breaks:', JSON.stringify(n[1])); process.exit(1); }
  console.log('line-end hyphens kept:', n[0]);
  const footer = '<div style="width:100%;font-family:Poppins,sans-serif;font-size:10.5pt;margin:0 72pt 21pt;text-align:right;color:#000;"><span class="pageNumber"></span></div>';
  await page.pdf({ path: 'body.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true,
    displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: footer, margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' } });
  await page.addStyleTag({ content: 'body > section:not(.cover){display:none !important}' });
  await page.pdf({ path: 'cover.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true, pageRanges: '1' });
  await browser.close();
})();
