// Pinterest pin images (1000x1500) for the printable maps, plus brand/pins/pins.csv in Pinterest's
// bulk-upload format. Run after a build: `node scripts/pin-images.js`. The build copies brand/pins/
// to /img/pins/ so the CSV's media URLs work once deployed.
// Counts in titles are only used where they are not disputed (Africa 54, the 50 US states...).
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'brand', 'pins');
fs.mkdirSync(out, { recursive: true });
const DOMAIN = require(path.join(root, 'site.config')).domain;

const W = 1000, H = 1500;
const INK = '#152238', PAPER = '#EAF1EF', SEA = '#1F5F8B', MAG = '#A3195B', LINE = '#C5D3D0';
const FONT = "'Segoe UI', Arial, sans-serif";
const LOGO = '<circle cx="16" cy="16" r="14" fill="#1F5F8B"/><path d="M8 11c3-3 7-1 9 1s1 5-2 6-3 5 0 7M20 6c-1 3 1 5 4 5s4 3 3 6" fill="none" stroke="#B9CC8E" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="21" r="3" fill="#A3195B"/>';
const uri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const WORLD = 'Printable World Maps', CONT = 'Printable Maps of Continents', CTRY = 'Printable Country Maps';
const VERSIONS = 'Choose a blank outline map, a numbered worksheet, a labelled map or the answer key, then print it or save it as a PDF.';
const PINS = [
  ['world', 'maps/world', ['World Map'], WORLD, 'Free Printable World Map: Blank, Worksheet and Answer Key',
    `Free printable map of the world with every country border. ${VERSIONS} Great for geography lessons, homework and test revision. No sign-up needed.`],
  ['africa', 'maps/africa', ['Map of Africa'], CONT, 'Free Printable Map of Africa: All 54 Countries, Blank and Labelled',
    `Learn the 54 countries of Africa with this free printable map. ${VERSIONS} Made for classrooms, homeschool and quiz practice. No sign-up.`],
  ['asia', 'maps/asia', ['Map of Asia'], CONT, 'Free Printable Map of Asia: Blank Map, Worksheet and Answer Key',
    `Free printable map of Asia with country borders, from Turkey to Japan. ${VERSIONS} Ideal for geography class and revision. No sign-up.`],
  ['europe', 'maps/europe', ['Map of Europe'], CONT, 'Free Printable Map of Europe: Blank, Labelled and Worksheet',
    `Free printable map of Europe with every country border. ${VERSIONS} Perfect for geography lessons, homework and map tests. No sign-up.`],
  ['north-america', 'maps/north-america', ['Map of', 'North America'], CONT, 'Free Printable Map of North America: 23 Countries, Blank and Labelled',
    `Learn the 23 countries of North America, including Central America and the Caribbean. ${VERSIONS} No sign-up.`],
  ['south-america', 'maps/south-america', ['Map of', 'South America'], CONT, 'Free Printable Map of South America: 12 Countries, Blank and Labelled',
    `Learn the 12 countries of South America with this free printable map. ${VERSIONS} Great for class, homework and quizzes. No sign-up.`],
  ['oceania', 'maps/oceania', ['Map of Oceania'], CONT, 'Free Printable Map of Oceania: Australia and the Pacific Islands',
    `Free printable map of Oceania: Australia, New Zealand and the Pacific island countries. ${VERSIONS} No sign-up.`],
  ['caribbean', 'maps/caribbean', ['Map of the', 'Caribbean'], CONT, 'Free Printable Map of the Caribbean: Blank Map and Answer Key',
    `Free printable map of the Caribbean island countries. ${VERSIONS} Good for geography class and travel lovers. No sign-up.`],
  ['us-states', 'countries/united-states', ['Map of the', '50 US States'], CTRY, 'Free Printable Map of the 50 US States: Blank, Worksheet, Answer Key',
    `Learn all 50 US states (plus Washington, D.C.) with this free printable map. ${VERSIONS} Great for school, homeschool and state quizzes. No sign-up.`],
  ['canada', 'countries/canada', ['Provinces of', 'Canada'], CTRY, 'Free Printable Map of Canada: 10 Provinces and 3 Territories',
    `Learn Canada's 10 provinces and 3 territories with this free printable map. ${VERSIONS} No sign-up.`],
  ['india', 'countries/india', ['States of India'], CTRY, 'Free Printable Map of India: States and Union Territories',
    `Free printable map of the states and union territories of India. ${VERSIONS} Made for geography class and exam revision. No sign-up.`],
  ['australia', 'countries/australia', ['States of', 'Australia'], CTRY, 'Free Printable Map of Australia: States and Territories',
    `Learn the states and territories of Australia with this free printable map. ${VERSIONS} No sign-up.`],
  ['mexico', 'countries/mexico', ['States of Mexico'], CTRY, 'Free Printable Map of Mexico: All 32 States',
    `Learn the 32 federal entities of Mexico (31 states and Mexico City) with this free printable map. ${VERSIONS} No sign-up.`],
  ['brazil', 'countries/brazil', ['States of Brazil'], CTRY, 'Free Printable Map of Brazil: 26 States and the Federal District',
    `Learn the 26 states of Brazil and the Federal District with this free printable map. ${VERSIONS} No sign-up.`],
  ['china', 'countries/china', ['Provinces of', 'China'], CTRY, 'Free Printable Map of China: Provinces and Regions',
    `Free printable map of the provinces, autonomous regions and municipalities of China. ${VERSIONS} No sign-up.`],
  ['united-kingdom', 'countries/united-kingdom', ['Map of the UK'], CTRY, 'Free Printable Map of the UK: England, Scotland, Wales and N. Ireland',
    `Free printable map of the four countries of the United Kingdom. ${VERSIONS} Great for young learners. No sign-up.`],
  ['germany', 'countries/germany', ['States of', 'Germany'], CTRY, 'Free Printable Map of Germany: All 16 States',
    `Learn the 16 states (Bundesländer) of Germany with this free printable map. ${VERSIONS} No sign-up.`],
  ['france', 'countries/france', ['Regions of', 'France'], CTRY, 'Free Printable Map of France: 13 Regions',
    `Learn the 13 regions of mainland France with this free printable map. ${VERSIONS} No sign-up.`],
  ['italy', 'countries/italy', ['Regions of Italy'], CTRY, 'Free Printable Map of Italy: All 20 Regions',
    `Learn the 20 regions of Italy with this free printable map. ${VERSIONS} Great for class and travel planning. No sign-up.`],
  ['spain', 'countries/spain', ['Regions of Spain'], CTRY, 'Free Printable Map of Spain: Autonomous Communities',
    `Free printable map of the 17 autonomous communities of Spain, plus Ceuta and Melilla. ${VERSIONS} No sign-up.`],
];

function pin([slug, page, lines, , , ]) {
  const html = fs.readFileSync(path.join(dist, 'printables', page, 'index.html'), 'utf8');
  const src = html.match(/data-src="\/([^"]+)"/)[1];
  const map = fs.readFileSync(path.join(dist, src), 'utf8');
  const vb = map.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const card = { x: 50, y: 400, w: 900, h: 840 };
  const pad = 30;
  let mw = card.w - 2 * pad, mh = mw * vb[3] / vb[2];
  if (mh > card.h - 2 * pad) { mh = card.h - 2 * pad; mw = mh * vb[2] / vb[3]; }
  const mx = card.x + (card.w - mw) / 2, my = card.y + (card.h - mh) / 2;
  const big = lines.length > 1 ? 96 : lines[0].length > 13 ? 100 : 118;
  const titleY = lines.length > 1 ? 240 : 280;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${PAPER}"/>`
    + `<text x="${W / 2}" y="120" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="44" letter-spacing="6" fill="${MAG}">FREE PRINTABLE</text>`
    + lines.map((l, i) => `<text x="${W / 2}" y="${titleY + i * big * 1.05}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${big}" fill="${INK}">${esc(l)}</text>`).join('')
    + `<rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="28" fill="#fff" stroke="${LINE}" stroke-width="2"/>`
    + `<image href="${uri(map)}" x="${mx}" y="${my}" width="${mw}" height="${mh}" preserveAspectRatio="xMidYMid meet"/>`
    + `<text x="${W / 2}" y="1318" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="38" fill="${SEA}">Blank map · Worksheet · Answer key</text>`
    + `<g transform="translate(290 1365) scale(2.4)">${LOGO}</g>`
    + `<text x="375" y="1418" font-family="${FONT}" font-weight="700" font-size="44" fill="${INK}">geographyarcade.com</text>`
    + '</svg>';
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } }).render().asPng();
  fs.writeFileSync(path.join(out, `${slug}.png`), png);
}

const csvCell = (s) => '"' + String(s).replace(/"/g, '""') + '"';
const rows = [['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords']];
for (const p of PINS) {
  pin(p);
  const [slug, page, , board, title, desc] = p;
  if (title.length > 100 || desc.length > 500) throw new Error(`${slug}: title or description too long for Pinterest`);
  rows.push([title, `${DOMAIN}/img/pins/${slug}.png`, board, '', desc, `${DOMAIN}/printables/${page}/`, '', 'printable map, blank map, geography worksheet, map quiz']);
  console.log(slug);
}
fs.writeFileSync(path.join(out, 'pins.csv'), rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n');
console.log(`${PINS.length} pins and pins.csv in brand/pins/`);
