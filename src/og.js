// Social preview images (og:image): 1200x630 PNG cards built from the site's own artwork, one per
// kind of page (a continent's flags, a country's flag and outline, a province map...). No text in
// the image: the page title shows next to it on every platform that displays the card.
const { Resvg } = require('@resvg/resvg-js');

const W = 1200, H = 630;
const PAD = 44;
const uri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
// Every piece is drawn as an <image>, so ids inside one artwork never clash with another's.
const place = (svg, x, y, w, h) => `<image href="${uri(svg)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;

// The card: page-coloured margin, a rounded panel in the tile colour, the art inside it,
// and the site logo in the corner.
function frame(tile, inner, logo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="#EAF1EF"/>`
    + `<rect x="${PAD / 2}" y="${PAD / 2}" width="${W - PAD}" height="${H - PAD}" rx="28" fill="${tile}"/>`
    + inner
    + (logo ? place(logo, W - PAD / 2 - 92, H - PAD / 2 - 92, 72, 72) : '')
    + '</svg>';
}

// One artwork filling the panel.
const single = (svg, tile, logo) => frame(tile, place(svg, PAD, PAD, W - 2 * PAD, H - 2 * PAD), logo);

// Up to six small pictures (flags, outlines) on a 3 x 2 grid.
function grid(svgs, tile, logo) {
  const cols = 3, rows = 2, gap = 28;
  const cw = (W - 2 * PAD - (cols - 1) * gap) / cols;
  const ch = (H - 2 * PAD - (rows - 1) * gap) / rows;
  const cells = svgs.slice(0, 6).map((svg, i) => place(svg, PAD + (i % cols) * (cw + gap), PAD + Math.floor(i / cols) * (ch + gap), cw, ch));
  return frame(tile, cells.join(''), logo);
}

// Two pictures side by side (a country's flag and its outline).
function pair(a, b, tile, logo) {
  if (!b) return single(a, tile, logo);
  const w = (W - 3 * PAD) / 2;
  return frame(tile, place(a, PAD, PAD, w, H - 2 * PAD) + place(b, 2 * PAD + w, PAD, w, H - 2 * PAD), logo);
}

const png = (svg) => new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: false } }).render().asPng();

module.exports = { single, grid, pair, png, OG_W: W, OG_H: H };
