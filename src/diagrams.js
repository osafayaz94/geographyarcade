// Labelled science diagrams for the World games, drawn in SVG (1000 wide). Every part a player
// can click is an element with class "c" and data-id; decoration has neither, so it can't be clicked.
// Colours are fill attributes; the quiz CSS recolours parts once answered.

const W = 1000;
const wrap = (h, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" role="img">${inner}</svg>`;
const part = (id, fill, shape) => shape.replace(/^<(\w+)/, `<$1 class="c" data-id="${id}" fill="${fill}"`);

// A thick arrow from (x1,y1) to (x2,y2) as one filled polygon (so it can be recoloured).
function arrow(x1, y1, x2, y2, w = 18) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const head = w * 1.6, hw = w * 1.15;
  const bx = x2 - ux * head, by = y2 - uy * head;
  const pts = [
    [x1 + nx * w / 2, y1 + ny * w / 2], [bx + nx * w / 2, by + ny * w / 2], [bx + nx * hw, by + ny * hw], [x2, y2],
    [bx - nx * hw, by - ny * hw], [bx - nx * w / 2, by - ny * w / 2], [x1 - nx * w / 2, y1 - ny * w / 2],
  ];
  return `<polygon stroke="#fff" stroke-width="2" points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}"/>`;
}
const cloud = (x, y, s = 1) => `<path d="M${x - 60 * s} ${y + 20 * s}a${30 * s} ${30 * s} 0 0 1 ${20 * s}-${45 * s}a${38 * s} ${38 * s} 0 0 1 ${70 * s}-${12 * s}a${30 * s} ${30 * s} 0 0 1 ${50 * s} ${22 * s}a${24 * s} ${24 * s} 0 0 1 -${6 * s} ${35 * s}z"/>`;

// ---------- Layers of the Earth: a globe with a quarter cut away ----------
function earth() {
  const cx = 500, cy = 262, R = 230;
  const layers = [['crust', '#8D6E63', 230], ['upper-mantle', '#F28C28', 212], ['lower-mantle', '#E4572E', 168], ['outer-core', '#F9C22E', 108], ['inner-core', '#FFF1A8', 52]];
  let s = `<rect width="${W}" height="524" fill="#BEE9F7"/>`;
  for (const [id, fill, r] of layers) s += part(id, fill, `<circle stroke="#fff" stroke-width="1.5" cx="${cx}" cy="${cy}" r="${r}"/>`);
  // The uncut three quarters of the surface: ocean and land, decoration only.
  const cover = `M${cx + R} ${cy}A${R} ${R} 0 1 1 ${cx} ${cy - R}L${cx} ${cy}Z`;
  s += `<clipPath id="cov"><path d="${cover}"/></clipPath><g clip-path="url(#cov)" pointer-events="none"><circle cx="${cx}" cy="${cy}" r="${R}" fill="#2E86DE"/>`
    + `<g fill="#6AB04C"><path d="M300 150c40-30 110-25 130 10s-10 70-50 80-60 50-100 40-40-100 20-130z"/><path d="M330 320c50-10 90 20 95 60s-30 70-70 70-60-30-60-70 5-55 35-60z"/><path d="M520 330c40 0 80 30 80 60s-30 55-60 55-50-25-50-55 0-60 30-60z"/></g>`
    + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#eshade)"/></g>`;
  s += `<radialGradient id="eshade" cx=".3" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#14202E" stroke-width="4" pointer-events="none"/>`;
  return wrap(524, s);
}

// ---------- Layers of the atmosphere: bands from the ground up (not to scale) ----------
function atmosphere() {
  const bands = [['exosphere', '#1B1F4B', 0, 92], ['thermosphere', '#283A8C', 92, 192], ['mesosphere', '#3E5FC4', 192, 292], ['stratosphere', '#5A8EE0', 292, 402], ['troposphere', '#8CC6F2', 402, 468]];
  let s = '';
  for (const [id, fill, y0, y1] of bands) s += part(id, fill, `<rect x="0" y="${y0}" width="${W}" height="${y1 - y0}"/>`);
  s += part('ozone-layer', '#B497D6', `<rect stroke="#fff" stroke-width="1" x="0" y="328" width="${W}" height="26" rx="4"/>`);
  // Decoration: ground, a cloud, a plane, meteors and a satellite.
  s += `<g pointer-events="none"><path d="M0 470Q500 440 1000 470V520H0Z" fill="#6AB04C"/><g fill="#fff" opacity=".9">${cloud(170, 440, 0.55)}${cloud(760, 438, 0.45)}</g>`
    + `<path d="M560 425l40-6 14-10h8l-6 12 24-3 6-6h6l-4 10 4 10h-6l-6-6-24-3 6 12h-8l-14-10z" fill="#fff" opacity=".9"/>`
    + `<g stroke="#FFD166" stroke-width="3" stroke-linecap="round"><path d="M300 215l40 30"/><path d="M640 230l30 22"/></g>`
    + `<g transform="translate(820 40)" fill="#CFD8DC"><rect x="-8" y="-8" width="16" height="16"/><rect x="-40" y="-4" width="28" height="8" fill="#4FC3F7"/><rect x="12" y="-4" width="28" height="8" fill="#4FC3F7"/></g>`
    // Approximate heights of the boundaries (they vary with latitude and season).
    + `<g fill="#fff" font-family="system-ui,sans-serif" font-size="15" font-weight="700" text-anchor="end">`
    + `<text x="990" y="398">≈ 12 km</text><text x="990" y="288">≈ 50 km</text><text x="990" y="188">≈ 85 km</text><text x="990" y="88">≈ 600 km</text></g></g>`;
  return wrap(520, s);
}

// ---------- The water cycle ----------
function water() {
  let s = `<rect width="${W}" height="520" fill="#BFE8FF"/>`;
  s += `<g pointer-events="none"><circle cx="890" cy="80" r="44" fill="#FFD54F"/><g stroke="#FFD54F" stroke-width="5" stroke-linecap="round"><path d="M890 18v-14M890 142v14M828 80h-14M952 80h14M846 36l-10-10M934 124l10 10M846 124l-10 10M934 36l10-10"/></g>`
    + `<path d="M0 430L120 240L200 290L300 130L420 300L520 262L640 405V520H0Z" fill="#6AB04C"/><path d="M270 178L300 130L330 178L315 170L300 184L285 170Z" fill="#fff"/>`
    + `<rect x="0" y="478" width="600" height="42" fill="#A1887F"/>`
    + `<g fill="#5D4037"><rect x="506" y="352" width="8" height="30"/><rect x="546" y="356" width="8" height="28"/></g><g fill="#2E7D32"><circle cx="510" cy="345" r="20"/><circle cx="550" cy="349" r="18"/></g>`
    + `<g fill="#B0BEC5">${cloud(380, 90, 0.9)}</g></g>`;
  s += part('collection', '#2E86DE', `<path stroke="#fff" stroke-width="2" d="M600 405L1000 392V520H560Z"/>`);
  s += part('runoff', '#4FC3F7', `<path stroke="#fff" stroke-width="1.5" d="M318 190C360 260 420 280 470 330S560 390 612 402L600 416C548 402 470 362 452 342S350 270 306 196Z"/>`);
  s += part('condensation', '#FFFFFF', cloud(770, 150, 1.05).replace('<path', '<path stroke="#90A4AE" stroke-width="2"'));
  s += part('precipitation', '#1E88E5', `<path d="${[[330, 125], [360, 150], [390, 128], [420, 152], [345, 180], [375, 200], [405, 178], [435, 200]].map(([x, y]) => `M${x} ${y}q6 12 0 18q-6-6 0-18z`).join('')}" stroke="#1E88E5" stroke-width="6" stroke-linejoin="round"/>`);
  // Arrows: several arrows make up one part, so each is tagged with the same id.
  const arrows = (id, fill, list) => list.map(([a, b, c, d]) => part(id, fill, arrow(a, b, c, d))).join('');
  s += arrows('evaporation', '#F4A259', [[720, 385, 720, 250], [800, 382, 800, 240], [880, 380, 880, 250]]);
  s += arrows('transpiration', '#FF8A65', [[520, 318, 540, 232], [560, 322, 590, 240]]);
  s += arrows('infiltration', '#7E57C2', [[160, 440, 160, 510], [260, 420, 260, 505]]);
  return wrap(520, s);
}

// ---------- Climate change: the greenhouse effect and its main human causes ----------
function climate() {
  let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1F4B"/><stop offset=".25" stop-color="#5A8EE0"/><stop offset="1" stop-color="#BFE8FF"/></linearGradient></defs><rect width="${W}" height="520" fill="url(#sky)"/>`;
  s += `<g pointer-events="none"><circle cx="80" cy="70" r="48" fill="#FFD54F"/><rect x="0" y="440" width="${W}" height="80" fill="#7CB342"/>`
    + `<g fill="#9E9E9E" opacity=".85"><circle cx="190" cy="300" r="22"/><circle cx="215" cy="270" r="26"/><circle cx="245" cy="240" r="30"/><circle cx="455" cy="410" r="10"/><circle cx="475" cy="400" r="13"/></g>`
    + `<g fill="#2E7D32"><circle cx="860" cy="385" r="26"/><circle cx="905" cy="395" r="22"/></g><g fill="#5D4037"><rect x="856" y="405" width="8" height="35"/><rect x="901" y="412" width="8" height="28"/></g></g>`;
  s += part('greenhouse-gases', '#B497D6', `<rect stroke="#fff" stroke-width="1.5" opacity=".92" x="0" y="118" width="${W}" height="40" rx="6"/>`);
  s += part('sunlight', '#FFC233', arrow(120, 105, 330, 430, 20));
  s += part('heat-trapped', '#E4572E', arrow(600, 162, 660, 432, 20));
  s += part('heat-escaping', '#F4A259', arrow(760, 432, 830, 26, 20));
  s += part('factories', '#607D8B', `<path stroke="#fff" stroke-width="2" d="M130 440V380L175 400V380L220 400V340H240V300H262V400H280V440Z"/>`);
  s += part('transport', '#1E88E5', `<path stroke="#fff" stroke-width="2" d="M340 440V420L355 395H415L432 420H440V440H428A12 12 0 0 1 404 440H372A12 12 0 0 1 348 440Z"/>`);
  s += part('livestock', '#FFFFFF', `<path stroke="#37474F" stroke-width="3" d="M520 405C520 390 540 382 575 384C600 385 610 392 612 402L630 396L636 410L618 418C615 425 606 430 596 430V440H588V430H552V440H544V430C530 428 520 420 520 405Z"/>`);
  s += part('deforestation', '#8D6E63', `<path stroke="#fff" stroke-width="2" d="M700 440V420H716V440ZM740 440V424H756V440ZM778 440V418H794V440ZM690 452L800 436L804 446L694 462Z"/>`);
  return wrap(520, s);
}

const DIAGRAMS = {
  earth: { svg: earth, parts: ['crust', 'upper-mantle', 'lower-mantle', 'outer-core', 'inner-core'] },
  atmosphere: { svg: atmosphere, parts: ['troposphere', 'stratosphere', 'ozone-layer', 'mesosphere', 'thermosphere', 'exosphere'] },
  water: { svg: water, parts: ['evaporation', 'condensation', 'precipitation', 'transpiration', 'runoff', 'infiltration', 'collection'] },
  climate: { svg: climate, parts: ['sunlight', 'heat-escaping', 'heat-trapped', 'greenhouse-gases', 'factories', 'transport', 'livestock', 'deforestation'] },
};

module.exports = { DIAGRAMS };
