// Pinterest RSS feed: one new printable-map pin a day, published by Pinterest itself
// (pinterest.com > Settings > Bulk create Pins > Auto-publish > Connect RSS feed).
//
//   node scripts/pin-feed.js images   make a 1000x1500 pin image for every country printable that has
//                                     none yet (brand/pins/c-<slug>.png) and the list brand/pins/feed.json
//   node scripts/pin-feed.js feed [--out file]   write the feed (default dist/pins/printables.xml)
//
// The feed shows the pins whose day has come (one a day from START, largest countries first), newest
// first, at most 30. The build writes it with the site, and .github/workflows/pinterest-feed.yml
// rewrites and uploads it every day, so a new pin appears daily without a site rebuild.
// The 20 printables in scripts/pin-images.js are left out: they are pinned by CSV already.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const pinsDir = path.join(root, 'brand', 'pins');
const DOMAIN = require(path.join(root, 'site.config')).domain;
const START = '2026-11-23'; // first feed pin; the CSV batches run alongside (one extra pin a day)
const FEED_URL = `${DOMAIN}/pins/printables.xml`;

function images() {
  const { Resvg } = require('@resvg/resvg-js');
  const W = 1000, H = 1500;
  const INK = '#152238', PAPER = '#EAF1EF', SEA = '#1F5F8B', MAG = '#A3195B', LINE = '#C5D3D0';
  const FONT = "'Segoe UI', Arial, sans-serif";
  const LOGO = '<circle cx="16" cy="16" r="14" fill="#1F5F8B"/><path d="M8 11c3-3 7-1 9 1s1 5-2 6-3 5 0 7M20 6c-1 3 1 5 4 5s4 3 3 6" fill="none" stroke="#B9CC8E" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="21" r="3" fill="#A3195B"/>';
  const uri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // Pages already pinned by the CSV (scripts/pin-images.js).
  const pinned = new Set([...fs.readFileSync(path.join(__dirname, 'pin-images.js'), 'utf8').matchAll(/\['[a-z-]+', '(countries\/[a-z-]+)'/g)].map((m) => m[1]));
  const countries = require(path.join(root, 'data', 'countries.json'))
    .filter((c) => !pinned.has(`countries/${c.slug}`) && fs.existsSync(path.join(dist, 'printables', 'countries', c.slug, 'index.html')))
    .sort((a, b) => ((b.population && b.population.value) || 0) - ((a.population && a.population.value) || 0));
  const list = [];
  for (const c of countries) {
    const html = fs.readFileSync(path.join(dist, 'printables', 'countries', c.slug, 'index.html'), 'utf8');
    const heading = html.match(/<h1>([^<:]+)/)[1].trim().replace(/&amp;/g, '&'); // "Prefectures of Japan"
    // Countries without divisions only have a one-shape outline map: it makes a dull pin, so skip it.
    if (!heading.includes(' of ')) continue;
    const meta = html.match(/<meta name="description" content="([^"]+)"/)[1].replace(/&amp;/g, '&');
    const slug = `c-${c.slug}`;
    const title = `${heading}: Free Printable Map, Blank and Answer Key`;
    const desc = `${meta} Great for geography class, homeschool and quiz practice. No sign-up.`;
    if (title.length > 100 || desc.length > 500) throw new Error(`${slug}: title or description too long for Pinterest`);
    list.push({ slug, page: `countries/${c.slug}`, title, desc });
    const file = path.join(pinsDir, `${slug}.png`);
    if (fs.existsSync(file)) continue;
    const cut = heading.indexOf(' of ');
    const lines = cut > 0 ? [heading.slice(0, cut + 3), heading.slice(cut + 4)] : [heading];
    const longest = Math.max(...lines.map((l) => l.length));
    const big = Math.min(lines.length > 1 ? 96 : 110, Math.floor(1650 / longest));
    const titleY = lines.length > 1 ? 240 : 280;
    const map = fs.readFileSync(path.join(dist, html.match(/data-src="\/([^"]+)"/)[1]), 'utf8');
    const vb = map.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    const card = { x: 50, y: 400, w: 900, h: 840 }, pad = 30;
    let mw = card.w - 2 * pad, mh = mw * vb[3] / vb[2];
    if (mh > card.h - 2 * pad) { mh = card.h - 2 * pad; mw = mh * vb[2] / vb[3]; }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
      + `<rect width="${W}" height="${H}" fill="${PAPER}"/>`
      + `<text x="${W / 2}" y="120" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="44" letter-spacing="6" fill="${MAG}">FREE PRINTABLE</text>`
      + lines.map((l, i) => `<text x="${W / 2}" y="${titleY + i * big * 1.05}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${big}" fill="${INK}">${esc(l)}</text>`).join('')
      + `<rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="28" fill="#fff" stroke="${LINE}" stroke-width="2"/>`
      + `<image href="${uri(map)}" x="${card.x + (card.w - mw) / 2}" y="${card.y + (card.h - mh) / 2}" width="${mw}" height="${mh}" preserveAspectRatio="xMidYMid meet"/>`
      + `<text x="${W / 2}" y="1318" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="38" fill="${SEA}">Blank map · Worksheet · Answer key</text>`
      + `<g transform="translate(290 1365) scale(2.4)">${LOGO}</g>`
      + `<text x="375" y="1418" font-family="${FONT}" font-weight="700" font-size="44" fill="${INK}">geographyarcade.com</text>`
      + '</svg>';
    fs.writeFileSync(file, new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } }).render().asPng());
  }
  fs.writeFileSync(path.join(pinsDir, 'feed.json'), JSON.stringify(list, null, 1) + '\n');
  console.log(`${list.length} country pins listed in brand/pins/feed.json`);
}

function feed(out) {
  const list = JSON.parse(fs.readFileSync(path.join(pinsDir, 'feed.json'), 'utf8'));
  const day = (i) => new Date(Date.parse(START + 'T00:00:00Z') + i * 864e5);
  const now = Date.now();
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const due = list.map((p, i) => ({ ...p, date: day(i) })).filter((p) => p.date.getTime() <= now).reverse().slice(0, 30);
  const items = due.map((p) => {
    const img = `${DOMAIN}/img/pins/${p.slug}.png`;
    const size = fs.existsSync(path.join(pinsDir, `${p.slug}.png`)) ? fs.statSync(path.join(pinsDir, `${p.slug}.png`)).size : 0;
    return `<item><title>${esc(p.title)}</title><link>${DOMAIN}/printables/${p.page}/</link><guid isPermaLink="false">${p.slug}</guid>`
      + `<pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.desc)}</description>`
      + `<enclosure url="${img}" type="image/png" length="${size}"/><media:content url="${img}" medium="image" type="image/png"/></item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom"><channel>`
    + `<title>Geography Arcade: free printable maps</title><link>${DOMAIN}/printables/</link>`
    + `<atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>`
    + `<description>Free printable country maps: blank, worksheet and answer key.</description><language>en</language>\n${items}\n</channel></rss>\n`;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, xml);
  console.log(`${out}: ${due.length} pins (of ${list.length}), next one ${due.length < list.length ? day(list.length - (list.length - due.length)).toISOString().slice(0, 10) : 'none'}`);
}

const [cmd] = process.argv.slice(2);
const outArg = process.argv.indexOf('--out');
if (cmd === 'images') images();
else if (cmd === 'feed') feed(outArg > 0 ? process.argv[outArg + 1] : path.join(dist, 'pins', 'printables.xml'));
else console.log('Usage: node scripts/pin-feed.js images | feed [--out file]');
