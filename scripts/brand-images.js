// Profile pictures and cover images for social accounts (Pinterest, Facebook, YouTube, X,
// LinkedIn), written to brand/. Run after a build: `node scripts/brand-images.js`.
// Uses the site logo, the world map from dist/maps/world.svg and the site colours.
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const root = path.join(__dirname, '..');
const out = path.join(root, 'brand');
fs.mkdirSync(out, { recursive: true });

const LOGO_INNER = '<circle cx="16" cy="16" r="14" fill="#1F5F8B"/><path d="M8 11c3-3 7-1 9 1s1 5-2 6-3 5 0 7M20 6c-1 3 1 5 4 5s4 3 3 6" fill="none" stroke="#B9CC8E" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="21" r="3" fill="#A3195B"/>';
const logo = (x, y, size) => `<g transform="translate(${x} ${y}) scale(${size / 32})">${LOGO_INNER}</g>`;
const uri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const world = fs.readFileSync(path.join(root, 'dist', 'maps', 'world.svg'), 'utf8');
const worldVB = (world.match(/viewBox="([^"]+)"/) || [])[1].split(/\s+/).map(Number);

const INK = '#152238', PAPER = '#EAF1EF', SEA = '#1F5F8B', MAG = '#A3195B';
const FONT = "'Segoe UI', 'Arial', sans-serif";

function render(name, svg, w) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } }).render().asPng();
  fs.writeFileSync(path.join(out, name), png);
  console.log(name);
}

// Square profile pictures: the logo alone, and the logo on the page colour (some platforms crop
// to a circle, so the logo keeps a margin).
function square(name, size, bg) {
  const m = size * 0.12;
  render(name, `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}${logo(m, m, size - 2 * m)}</svg>`, size);
}

// A cover: the world map on the right, logo, name and tagline on the left. `safe` is the
// central area some platforms keep on every screen (YouTube), where the text must stay.
function cover(name, W, H, safe) {
  const s = safe || { x: 0, y: 0, w: W, h: H };
  // Text on the left 54%, the map in the space to its right, never under the text.
  const lx = s.x + s.h * 0.12;
  const textW = s.w * 0.54 - (lx - s.x);
  const title = Math.min(s.h * 0.17, textW / 9.4);
  const sub = title * 0.5;
  const lsize = Math.min(s.h * 0.3, title * 1.8);
  const ty = s.y + s.h * 0.38;
  const areaX = s.x + s.w * 0.56, areaW = s.w * 0.42;
  let mapH = s.h * 0.9;
  let mapW = mapH * worldVB[2] / worldVB[3];
  if (mapW > areaW) { mapW = areaW; mapH = mapW * worldVB[3] / worldVB[2]; }
  const mapX = areaX + (areaW - mapW) / 2;
  const mapY = s.y + (s.h - mapH) / 2;
  return render(name, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${PAPER}"/>`
    + `<image href="${uri(world)}" x="${mapX}" y="${mapY}" width="${mapW}" height="${mapH}" opacity=".75" preserveAspectRatio="xMidYMid meet"/>`
    + logo(lx, ty - lsize * 0.95, lsize)
    + `<text x="${lx}" y="${ty + title * 0.95}" font-family="${FONT}" font-weight="800" font-size="${title}" fill="${INK}">Geography Arcade</text>`
    + `<text x="${lx}" y="${ty + title * 0.95 + sub * 1.7}" font-family="${FONT}" font-weight="600" font-size="${sub}" fill="${SEA}">Free geography quizzes and printable maps</text>`
    + `<text x="${lx}" y="${ty + title * 0.95 + sub * 3.1}" font-family="${FONT}" font-weight="700" font-size="${sub * 0.9}" fill="${MAG}">geographyarcade.com</text>`
    + '</svg>', W);
}

// A centred cover for platforms that zoom in and crop to the middle (Pinterest): the world map
// faint across the whole image, logo, name and tagline in the centre.
function centred(name, W, H) {
  const mapW = W * 1.05, mapH = mapW * worldVB[3] / worldVB[2];
  const title = H * 0.08, sub = title * 0.46, lsize = H * 0.15;
  return render(name, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${PAPER}"/>`
    + `<image href="${uri(world)}" x="${(W - mapW) / 2}" y="${(H - mapH) / 2}" width="${mapW}" height="${mapH}" opacity=".28" preserveAspectRatio="xMidYMid meet"/>`
    + logo(W / 2 - lsize / 2, H * 0.27, lsize)
    + `<text x="${W / 2}" y="${H * 0.57}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${title}" fill="${INK}">Geography Arcade</text>`
    + `<text x="${W / 2}" y="${H * 0.57 + sub * 1.9}" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="${sub}" fill="${SEA}">Free geography quizzes and printable maps</text>`
    + `<text x="${W / 2}" y="${H * 0.57 + sub * 3.4}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${sub * 0.9}" fill="${MAG}">geographyarcade.com</text>`
    + '</svg>', W);
}

square('logo-512.png', 512);
centred('pinterest-cover-centred-1600x900.png', 1600, 900);
square('logo-512-background.png', 512, PAPER);
square('logo-1024-background.png', 1024, PAPER);
cover('pinterest-cover-1600x900.png', 1600, 900);
cover('facebook-cover-1640x624.png', 1640, 624);
cover('x-header-1500x500.png', 1500, 500, { x: 0, y: 60, w: 1500, h: 380 });
cover('linkedin-cover-1128x191.png', 1128, 191);
cover('youtube-banner-2560x1440.png', 2560, 1440, { x: 507, y: 508, w: 1546, h: 423 });
