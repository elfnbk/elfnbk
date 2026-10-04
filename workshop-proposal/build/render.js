const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'file://' + path.resolve('proposal_h.html');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const footer = '<div style="width:100%;font-family:Poppins,sans-serif;font-size:10.5pt;margin:0 72pt 21pt;text-align:right;color:#000;"><span class="pageNumber"></span></div>';
  await page.pdf({ path: 'body.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true,
    displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: footer, margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' } });
  await page.addStyleTag({ content: 'body > section:not(.cover){display:none !important}' });
  await page.pdf({ path: 'cover.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true, pageRanges: '1' });
  await browser.close();
})();
