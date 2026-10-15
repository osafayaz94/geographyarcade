// PDF downloads for every printable map page, one per version: <name>-blank-map.pdf,
// <name>-map-worksheet.pdf (numbered map + blank lines), <name>-labeled-map.pdf and
// <name>-map-answer-key.pdf, saved next to the page (its "Download PDF" buttons link there). Uses the installed Chrome through puppeteer-core.
// PDFs are cached in .cache/pdf/ by a hash of the page's HTML, so only changed pages are printed
// again. Run after the build: node scripts/make-pdfs.js [--limit=N] [--only=text]
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, '.cache', 'pdf');
// --only=text: just the pages whose path contains the text (for testing).
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const LIMIT = Number((process.argv.find((a) => a.startsWith('--limit=')) || '').slice(8)) || Infinity;
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium',
].find((p) => fs.existsSync(p));
// Same names as pdfFile() in build.js.
const MODES = { blank: 'blank-map', worksheet: 'map-worksheet', labeled: 'labeled-map', answers: 'map-answer-key' };
const PRINT_JS = fs.existsSync(path.join(DIST, 'print.js')) ? fs.readFileSync(path.join(DIST, 'print.js')) : '';
const pdfName = (dir, mode) => `${path.basename(dir)}-${MODES[mode]}.pdf`;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

// Every printable map page in every language (not the hubs).
function pages() {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name === 'index.html' && /[\\/]printables[\\/](maps|countries|organizations)[\\/]/.test(f)) out.push(path.dirname(f));
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
  // Chrome is started only when a page really needs printing (a run with everything cached never needs it),
  // and a start that times out (it happens on busy CI machines) is tried again.
  let browserPromise = null;
  const getBrowser = () => {
    if (!browserPromise) {
      browserPromise = (async () => {
        for (let attempt = 1; ; attempt++) {
          try {
            return await puppeteer.launch({ executablePath: CHROME, headless: true, timeout: 120000, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
          } catch (e) {
            if (attempt >= 4) throw e;
            console.log(`  Chrome did not start (${e.message.split('\n')[0]}), trying again (${attempt}/3)`);
            await new Promise((r) => setTimeout(r, 5000 * attempt));
          }
        }
      })();
    }
    return browserPromise;
  };
  const list = pages().filter((d) => !ONLY || d.split(path.sep).join('/').includes(ONLY)).slice(0, LIMIT);
  let made = 0, cached = 0, failed = 0;
  const queue = list.slice();
  async function worker() {
    let tab = null;
    while (queue.length) {
      const dir = queue.shift();
      const html = fs.readFileSync(path.join(dir, 'index.html'));
      // The footer's "updated" date changes on every data run; the PDF doesn't show it.
      // The print script decides what each version contains, so it is part of the cache key too.
      const hash = crypto.createHash('sha1').update(String(html).replace(/<footer[\s\S]*?<\/footer>/, '')).update(PRINT_JS).digest('hex').slice(0, 16);
      const rel = path.relative(DIST, dir).split(path.sep).join('/');
      const prefix = rel.replace(/\//g, '__') + '.';
      const cacheOf = (mode) => path.join(CACHE, `${prefix}${hash}.${mode}.pdf`);
      const modes = Object.keys(MODES);
      if (modes.every((m) => fs.existsSync(cacheOf(m)))) { for (const m of modes) fs.copyFileSync(cacheOf(m), path.join(dir, pdfName(dir, m))); cached++; continue; }
      try {
        if (!tab) tab = await (await getBrowser()).newPage();
        await tab.goto(`http://localhost:${port}/${rel}/#worksheet`, { waitUntil: 'networkidle0', timeout: 60000 });
        await tab.waitForSelector('.psheet svg', { timeout: 30000 });
        const done = [];
        for (const m of modes) {
          await tab.evaluate((mode) => { window.buildPrint(mode); }, m);
          const target = path.join(dir, pdfName(dir, m));
          await tab.pdf({ path: target, preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false });
          done.push([m, target]);
        }
        // Drop older cached versions of this page, keep the new ones.
        for (const f of fs.readdirSync(CACHE)) if (f.startsWith(prefix)) fs.unlinkSync(path.join(CACHE, f));
        for (const [m, target] of done) fs.copyFileSync(target, cacheOf(m));
        made++;
        if (made % 50 === 0) console.log(`  ${made} printed, ${cached} from cache, ${queue.length} left`);
      } catch (e) { failed++; console.log(`  FAILED ${rel}: ${e.message.split('\n')[0]}`); }
    }
    if (tab) await tab.close();
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  if (browserPromise) await (await browserPromise).close();
  server.close();
  console.log(`PDFs: ${made} printed, ${cached} from cache, ${failed} failed (${list.length} printable pages)`);
  if (failed > list.length * 0.02) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
