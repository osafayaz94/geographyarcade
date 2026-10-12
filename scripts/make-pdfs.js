// PDF downloads for every printable map page: page 1 the worksheet (numbered map + blank lines),
// page 2 the answer key. Saved next to each page as <name>-map-worksheet.pdf (the "Download PDF"
// button links there). Uses the installed Chrome through puppeteer-core.
// PDFs are cached in .cache/pdf/ by a hash of the page's HTML, so only changed pages are printed
// again. Run after the build: node scripts/make-pdfs.js [--limit=N]
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, '.cache', 'pdf');
const LIMIT = Number((process.argv.find((a) => a.startsWith('--limit=')) || '').slice(8)) || Infinity;
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium',
].find((p) => fs.existsSync(p));
const pdfName = (dir) => `${path.basename(dir)}-map-worksheet.pdf`;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

// Every printable map page in every language (not the hubs).
function pages() {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name === 'index.html' && /[\\/]printables[\\/](maps|countries|x)[\\/]/.test(f)) out.push(path.dirname(f));
    }
  };
  walk(DIST);
  return out;
}

(async () => {
  if (!CHROME) throw new Error('Chrome not found: set CHROME_PATH');
  fs.mkdirSync(CACHE, { recursive: true });
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    let f = path.join(DIST, p);
    if (p.endsWith('/')) f = path.join(f, 'index.html');
    fs.readFile(f, (err, data) => { if (err) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(data); });
  }).listen(0);
  const port = server.address().port;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'] });
  const list = pages().slice(0, LIMIT);
  let made = 0, cached = 0, failed = 0;
  const queue = list.slice();
  async function worker() {
    const tab = await browser.newPage();
    while (queue.length) {
      const dir = queue.shift();
      const html = fs.readFileSync(path.join(dir, 'index.html'));
      // The footer's "updated" date changes on every data run; the PDF doesn't show it.
      const hash = crypto.createHash('sha1').update(String(html).replace(/<footer[\s\S]*?<\/footer>/, '')).digest('hex').slice(0, 16);
      const rel = path.relative(DIST, dir).split(path.sep).join('/');
      const cacheFile = path.join(CACHE, rel.replace(/\//g, '__') + `.${hash}.pdf`);
      const target = path.join(dir, pdfName(dir));
      if (fs.existsSync(cacheFile)) { fs.copyFileSync(cacheFile, target); cached++; continue; }
      try {
        await tab.goto(`http://localhost:${port}/${rel}/#worksheet`, { waitUntil: 'networkidle0', timeout: 60000 });
        await tab.waitForSelector('.psheet svg', { timeout: 30000 });
        await tab.evaluate(() => { if (window.buildPrint) window.buildPrint(); });
        await tab.pdf({ path: target, preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false });
        // Drop older cached versions of this page, keep the new one.
        const prefix = rel.replace(/\//g, '__') + '.';
        for (const f of fs.readdirSync(CACHE)) if (f.startsWith(prefix)) fs.unlinkSync(path.join(CACHE, f));
        fs.copyFileSync(target, cacheFile);
        made++;
        if (made % 50 === 0) console.log(`  ${made} printed, ${cached} from cache, ${queue.length} left`);
      } catch (e) { failed++; console.log(`  FAILED ${rel}: ${e.message.split('\n')[0]}`); }
    }
    await tab.close();
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  await browser.close();
  server.close();
  console.log(`PDFs: ${made} printed, ${cached} from cache, ${failed} failed (${list.length} printable pages)`);
  if (failed > list.length * 0.02) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
