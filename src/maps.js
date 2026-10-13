// Turns boundary data into small, clickable SVG maps at build time.
// World and continent maps: Natural Earth 1:50m via world-atlas (public domain).
// Province/state maps: geoBoundaries ADM1 (see data/subdivisions.json for licences).
const fs = require('fs');
const path = require('path');
const d3 = require('d3-geo');
const { feature, neighbors } = require('topojson-client');
const mapshaper = require('mapshaper');
const wc = require('world-countries/countries.json');

const W = 1000;
const round = (n) => Math.round(n * 10) / 10;

// d3 expects clockwise outer rings; RFC 7946 GeoJSON is the opposite. Flip any
// polygon that d3 would read as "the whole globe minus this shape".
function rewind(f) {
  const flip = (poly) => poly.map((ring) => ring.slice().reverse());
  const g = f.geometry;
  if (!g) return f;
  if (g.type === 'Polygon' && d3.geoArea({ type: 'Polygon', coordinates: g.coordinates }) > 2 * Math.PI) g.coordinates = flip(g.coordinates);
  if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map((p) => (d3.geoArea({ type: 'Polygon', coordinates: p }) > 2 * Math.PI ? flip(p) : p));
  return f;
}

// Six map colours, as k0..k5 classes. The hex values are the fallback for a plain <img>;
// src/style.css defines the same colours (and dark-mode ones) as --m0..--m5.
const PALETTE = ['#F4A259', '#8CC084', '#E9C46A', '#F28DB2', '#5FB3A1', '#B497D6'];

// Greedy map colouring: neighbours never share a colour, and among the free colours
// each shape takes the least-used one so the palette stays balanced.
function colour(ids, adj) {
  const order = [...ids].sort((a, b) => (adj[b] || new Set()).size - (adj[a] || new Set()).size);
  const out = {};
  const used = PALETTE.map(() => 0);
  for (const id of order) {
    const taken = new Set([...(adj[id] || [])].map((n) => out[n]));
    const free = PALETTE.map((_, i) => i).filter((i) => !taken.has(i));
    const pool = free.length ? free : PALETTE.map((_, i) => i);
    const k = pool.reduce((a, b) => (used[b] < used[a] ? b : a));
    out[id] = k;
    used[k]++;
  }
  return out;
}

function adjacency(topo, object, keyOf) {
  const geoms = topo.objects[object].geometries;
  const adj = {};
  neighbors(geoms).forEach((list, i) => {
    const a = keyOf(geoms[i]);
    if (!a) return;
    adj[a] = adj[a] || new Set();
    for (const j of list) { const b = keyOf(geoms[j]); if (b && b !== a) adj[a].add(b); }
  });
  return adj;
}

// Mapshaper writes shapes without attributes as a bare GeometryCollection; always hand back features.
function asFeatures(o) {
  return o.geometries ? { type: 'FeatureCollection', features: o.geometries.map((g) => ({ type: 'Feature', properties: {}, geometry: g })) } : o;
}

async function simplify(geojson, pct) {
  const out = await mapshaper.applyCommands(`-i in.json -simplify ${pct}% keep-shapes -o out.json format=geojson`, { 'in.json': geojson });
  return asFeatures(JSON.parse(out['out.json']));
}

// ---------- World and continents ----------

const numToIso2 = Object.fromEntries(wc.map((c) => [c.ccn3, c.cca2]));
// Territories that UN-recognised borders place inside a member state.
const MERGE = { Somaliland: 'SO', 'N. Cyprus': 'CY' };
// Owner's decision for world and continent maps: Taiwan is shown and played as part of China.
const REASSIGN = { TW: 'CN' };
const isoOf = (num, name) => { const i = numToIso2[num]; return REASSIGN[i] || i || MERGE[name] || null; };
// Land moved between countries on world and continent maps (Natural Earth ids: 643 Russia,
// 804 Ukraine, 376 Israel, 760 Syria).
const WORLD_TRANSFERS = [
  { from: '643', to: '804', file: 'UKR', names: ['Autonomous Republic of Crimea', 'Sevastopol'] },
  { from: '376', to: '760', file: 'SYR', names: ['Quneitra'] },
];

// Kashmir (site owner's decision, see data/subdivision-overrides.js): the area in
// data/geo/kashmir.json is cut out of India and merged, with the Siachen Glacier, into Pakistan.
const geomOf = (res) => { const o = JSON.parse(res['out.json']); return o.geometries ? o.geometries[0] : o.features[0].geometry; };
const fcOf = (...fs) => ({ type: 'FeatureCollection', features: fs.map((f) => ({ type: 'Feature', properties: {}, geometry: f.geometry })) });
let worldRaw = null;
async function worldBase() {
  if (worldRaw) return worldRaw;
  const topo = require('world-atlas/countries-50m.json');
  const fc = feature(topo, topo.objects.countries);
  const file = path.join(__dirname, '..', 'data', 'geo', 'kashmir.json');
  if (fs.existsSync(file)) {
    const k = JSON.parse(fs.readFileSync(file, 'utf8'));
    const india = fc.features.find((f) => f.id === '356');
    const pak = fc.features.find((f) => f.id === '586');
    const siachen = fc.features.find((f) => f.properties.name === 'Siachen Glacier');
    india.geometry = geomOf(await mapshaper.applyCommands('-i a.json -erase k.json -filter-slivers min-area=100km2 -o out.json format=geojson', { 'a.json': fcOf(india), 'k.json': k }));
    pak.geometry = geomOf(await mapshaper.applyCommands('-i a.json -dissolve2 gap-fill-area=300km2 -o out.json format=geojson', { 'a.json': fcOf(pak, k.features[0], ...(siachen ? [siachen] : [])) }));
    fc.features = fc.features.filter((f) => f !== siachen);
  }
  // Owner's decisions for world and continent maps (2026-10-12): Crimea with Ukraine, the Golan
  // Heights with Syria (outlines from Ukraine's and Syria's own division maps).
  for (const t of WORLD_TRANSFERS) {
    const f = path.join(__dirname, '..', 'data', 'geo', `adm1-${t.file}.json`);
    if (!fs.existsSync(f)) continue;
    const src = JSON.parse(fs.readFileSync(f, 'utf8'));
    const area = { type: 'FeatureCollection', features: src.features.filter((x) => t.names.includes(x.properties.shapeName)) };
    if (area.features.length !== t.names.length) continue;
    const from = fc.features.find((x) => x.id === t.from);
    const to = fc.features.find((x) => x.id === t.to);
    from.geometry = geomOf(await mapshaper.applyCommands('-i a.json -erase k.json -filter-slivers min-area=100km2 -o out.json format=geojson', { 'a.json': fcOf(from), 'k.json': area }));
    to.geometry = geomOf(await mapshaper.applyCommands('-i a.json -dissolve2 gap-fill-area=300km2 -o out.json format=geojson', { 'a.json': fcOf(to, ...area.features) }));
  }
  return (worldRaw = fc);
}

// The world view shows everything at once, so it can drop more detail than a continent view.
const worldCache = {};
async function worldFeatures(pct) {
  if (worldCache[pct]) return worldCache[pct];
  const fc = await simplify(JSON.parse(JSON.stringify(await worldBase())), pct);
  for (const f of fc.features) {
    f.iso2 = isoOf(f.id, f.properties.name);
    rewind(f);
  }
  return (worldCache[pct] = fc.features);
}

// One colour per country, shared by the world map and every continent map.
let worldColours = null;
function countryColours() {
  if (worldColours) return worldColours;
  const topo = require('world-atlas/countries-50m.json');
  const keyOf = (g) => isoOf(g.id, g.properties && g.properties.name);
  const adj = adjacency(topo, 'countries', keyOf);
  const ids = [...new Set(topo.objects.countries.geometries.map(keyOf).filter(Boolean)), ...wc.map((c) => c.cca2)];
  return (worldColours = colour([...new Set(ids)], adj));
}

// Map views: lon/lat box to fit, and the projection centre longitude.
const VIEWS = {
  world: { projection: 'naturalEarth', height: 500 },
  africa: { box: [-26, -36, 60, 38], rotate: -17, height: 1000 },
  asia: { box: [25, -12, 150, 56], rotate: -88, height: 760 },
  europe: { box: [-25, 34, 45, 71.5], rotate: -10, height: 900 },
  'north-america': { box: [-170, 6, -50, 75], rotate: 100, height: 820 },
  'south-america': { box: [-85, -56, -33, 14], rotate: 60, height: 1150 },
  oceania: { box: [110, -50, 200, 5], rotate: -155, height: 760 },
  caribbean: { box: [-86, 9.5, -59, 27.5], rotate: 72, height: 640 },
};

function boxPoints([x0, y0, x1, y1]) {
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const x = x0 + ((x1 - x0) * i) / 8;
    const y = y0 + ((y1 - y0) * i) / 8;
    pts.push([x, y0], [x, y1], [x0, y], [x1, y]);
  }
  return { type: 'MultiPoint', coordinates: pts };
}

// Where a small country's dot goes instead of on the country, in dot radii (x right, y down).
// Bahrain sits next to Qatar's northern tip; north of it is open Gulf water.
const DOT_NUDGE = { BH: [0, -3.2] };

// countries: [{ iso2, area, latlng }] that are playable on this map.
async function continentSvg(viewKey, countries, view) {
  const v = view || VIEWS[viewKey];
  const H = v.height;
  const isWorld = v.projection === 'naturalEarth';
  // The world view fits the globe minus Antarctica; continent views fit their lon/lat box.
  const proj = (isWorld ? d3.geoNaturalEarth1() : d3.geoMercator().rotate([v.rotate, 0]))
    .fitExtent([[4, 4], [W - 4, H - 4]], boxPoints(isWorld ? [-179.9, -58, 179.9, 84] : v.box))
    .clipExtent([[0, 0], [W, H]]);
  const pathGen = d3.geoPath(proj).digits(1);
  const playable = new Map(countries.map((c) => [c.iso2, c]));

  const shapes = {};
  const ctx = [];
  for (const f of await worldFeatures(isWorld ? 10 : 30)) {
    if (isWorld && f.id === '010') continue; // Antarctica
    const d = pathGen(f);
    if (!d) continue;
    if (f.iso2 && playable.has(f.iso2)) (shapes[f.iso2] = shapes[f.iso2] || []).push(d);
    else ctx.push(d);
  }

  // Colours are presentation attributes so the file also looks right as a plain <img>;
  // the page CSS overrides them inside a quiz.
  const k = countryColours();
  let body = `<path class="ctx" fill="#EFE9DC" stroke="#fff" stroke-width=".5" d="${ctx.join('')}"/><g stroke="#fff" stroke-width=".7">`;
  const dots = [];
  const rings = [];
  const r = viewKey === 'world' ? 4 : 7;
  for (const c of countries) {
    const d = (shapes[c.iso2] || []).join('');
    const kc = k[c.iso2] || 0;
    if (d) body += `<path class="c k${kc}" fill="${PALETTE[kc]}" data-id="${c.iso2}" d="${d}"/>`;
    // Small or missing countries also get a dot inside a dashed ring so they can be found and tapped.
    if (!d || c.area < 3000) {
      const p = proj([c.latlng[1], c.latlng[0]]);
      if (p && p[0] >= 0 && p[0] <= W && p[1] >= 0 && p[1] <= H) {
        // A dot that would cover a small neighbour (Bahrain over Qatar) moves off into the sea,
        // with a short line back to the real spot.
        const nudge = !isWorld && DOT_NUDGE[c.iso2];
        const x = round(p[0] + (nudge ? nudge[0] * r : 0));
        const y = round(p[1] + (nudge ? nudge[1] * r : 0));
        if (nudge) rings.push(`<line class="ring" x1="${round(p[0])}" y1="${round(p[1])}" x2="${x}" y2="${y}" stroke-dasharray="none"/>`);
        rings.push(`<circle class="ring" cx="${x}" cy="${y}" r="${r * 2.2}"/>`);
        dots.push(`<circle class="c dot k${kc}" fill="${PALETTE[kc]}" data-id="${c.iso2}" cx="${x}" cy="${y}" r="${r}"/>`);
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">${body}</g>`
    + `<g fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 2">${rings.join('')}</g><g stroke="#fff" stroke-width="1">${dots.join('')}</g></svg>`;
}

// ---------- Provinces and states ----------

// How far (km) from the country's largest landmass a piece of land may lie and still be
// drawn on the main map. Farther pieces: a whole division becomes an inset box; a remote
// island belonging to a mainland division (Easter Island, for Chile) is left off.
// Parts further than this from the main landmass are drawn as insets (Spain: the Canary Islands).
// China: distances run from Xinjiang (the largest single shape), so Taiwan is about 3,850 km away.
const NEAR_KM = { RUS: 4200, IDN: 4000, CHN: 4500, USA: Infinity, ESP: 1200, 'x-spain-provinces': 1200 };
const MAX_BYTES = 70 * 1024;

// Returns { svg, ids } where ids are the divisions actually drawn (and so playable).
// key: ISO3 (reads data/geo/adm1-<ISO3>.json), or any key with opts.file for other map sets.
const geoFile = (key, file) => file || path.join(__dirname, '..', 'data', 'geo', `adm1-${key}.json`);
async function adm1Svg(iso3, divisions, { file } = {}) {
  const raw = JSON.parse(fs.readFileSync(geoFile(iso3, file), 'utf8'));
  // Simplify harder until the file is small enough to load quickly on a phone.
  let out;
  // Island and county sets start from coarser source data, so try them at full detail first.
  for (const pct of [...(iso3.startsWith('x-') ? [100, 50, 25] : []), 12, 7, 4, 2.5, 1.5, 1, 0.6]) {
    out = await adm1Render(iso3, divisions, await simplify(JSON.parse(JSON.stringify(raw)), pct));
    if (out.svg.length <= MAX_BYTES) break;
  }
  return out;
}

// A small card picture of the same map (continent page stamps): no insets, one path per colour.
const THUMB_BYTES = 9 * 1024;
async function adm1Thumb(iso3, divisions, { file } = {}) {
  const raw = JSON.parse(fs.readFileSync(geoFile(iso3, file), 'utf8'));
  let svg;
  for (const pct of [3, 1.5, 0.8, 0.4, 0.2]) {
    svg = await adm1Render(iso3, divisions, await simplify(JSON.parse(JSON.stringify(raw)), pct), { thumb: true });
    if (svg.length <= THUMB_BYTES) break;
  }
  return svg;
}

async function adm1Render(iso3, divisions, gj, { thumb = false } = {}) {
  // Neighbours come from the shared edges in a TopoJSON version of the same shapes.
  const topoOut = await mapshaper.applyCommands('-i in.json -o out.json format=topojson', { 'in.json': gj });
  const topo = JSON.parse(topoOut['out.json']);
  const idOf = (g) => g.properties && g.properties.shapeID;
  const k = colour(gj.features.map((f) => f.properties.shapeID), adjacency(topo, Object.keys(topo.objects)[0], idOf));
  gj.features.forEach(rewind);
  const byId = new Map(divisions.map((d) => [d.id, d]));
  const feats = gj.features.filter((f) => byId.has(f.properties.shapeID) && f.geometry);
  // Land that is shown but not asked about (Jutland on the Danish islands map).
  const context = gj.features.filter((f) => f.properties.context && f.geometry);

  const partsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
  let mainPart = null;
  let mainArea = 0;
  for (const f of feats) for (const p of partsOf(f.geometry)) {
    const a = d3.geoArea({ type: 'Polygon', coordinates: p });
    if (a > mainArea) { mainArea = a; mainPart = p; }
  }
  const mc = d3.geoCentroid({ type: 'Polygon', coordinates: mainPart });
  const limit = NEAR_KM[iso3] || 3500;
  const far = [];
  const near = [];
  for (const f of feats) {
    const parts = partsOf(f.geometry);
    const keep = parts.filter((p) => d3.geoDistance(mc, d3.geoCentroid({ type: 'Polygon', coordinates: p })) * 6371 <= limit);
    if (!keep.length) far.push(f);
    else near.push({ ...f, geometry: { type: 'MultiPolygon', coordinates: keep } });
  }
  const nearFc = { type: 'FeatureCollection', features: near };
  const [[x0, y0], [x1, y1]] = d3.geoBounds(nearFc);
  const cx = d3.geoCentroid(nearFc)[0];
  let proj;
  if (iso3 === 'USA') proj = d3.geoAlbersUsa();
  else {
    const lat0 = Math.max(-80, Math.min(80, y0));
    const lat1 = Math.max(-80, Math.min(80, y1));
    proj = Math.abs(lat1 - lat0) < 3 || Math.sign(lat0) !== Math.sign(lat1)
      ? d3.geoMercator().rotate([-cx, 0])
      : d3.geoConicConformal().rotate([-cx, 0]).parallels([lat0 + (lat1 - lat0) / 6, lat1 - (lat1 - lat0) / 6]);
  }
  if (thumb) {
    proj.fitExtent([[8, 8], [312, 182]], nearFc);
    const pt = d3.geoPath(proj).digits(0);
    const byColour = PALETTE.map(() => []);
    for (const f of near) byColour[k[f.properties.shapeID] || 0].push(pt(f) || '');
    const ctxD = context.map((f) => pt(f) || '').join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190">${ctxD ? `<path fill="#EFE9DC" fill-opacity=".6" d="${ctxD}"/>` : ''}`
      + byColour.map((ds, i) => (ds.join('') ? `<path fill="${PALETTE[i]}" stroke="#fff" stroke-width=".6" stroke-linejoin="round" d="${ds.join('')}"/>` : '')).join('') + '</svg>';
  }
  // Height follows the country's shape, within limits.
  proj.fitWidth(W - 8, nearFc);
  const b = d3.geoPath(proj).bounds(nearFc);
  let H = Math.ceil(Math.min(1300, Math.max(420, b[1][1] - b[0][1] + 8)));
  const insetH = far.length ? 150 : 0;
  proj.fitExtent([[4, 4], [W - 4, H - 4]], nearFc);
  const pg = d3.geoPath(proj).digits(1);

  const ctxD = context.map((f) => pg(f) || '').join('');
  let body = (ctxD ? `<path class="ctx" fill="#EFE9DC" stroke="#fff" stroke-width=".5" d="${ctxD}"/>` : '') + '<g stroke="#fff" stroke-width=".8">';
  const ids = [];
  const pathTag = (f, d) => `<path class="c k${k[f.properties.shapeID] || 0}" fill="${PALETTE[k[f.properties.shapeID] || 0]}" data-id="${f.properties.shapeID}" d="${d}"/>`;
  // Divisions too small to click (the City of London) also get a dot in a dashed ring, as on the continent maps.
  const dots = [];
  const rings = [];
  for (const f of near) {
    const d = pg(f);
    if (!d) continue;
    body += pathTag(f, d);
    ids.push(f.properties.shapeID);
    const [[bx0, by0], [bx1, by1]] = pg.bounds(f);
    if (Math.max(bx1 - bx0, by1 - by0) < 9) {
      const [x, y] = pg.centroid(f).map(round);
      const kc = k[f.properties.shapeID] || 0;
      rings.push(`<circle class="ring" cx="${x}" cy="${y}" r="15"/>`);
      dots.push(`<circle class="c dot k${kc}" fill="${PALETTE[kc]}" data-id="${f.properties.shapeID}" cx="${x}" cy="${y}" r="7"/>`);
    }
  }
  // Insets for overseas divisions.
  const bw = far.length ? Math.min(180, Math.floor((W - 8) / far.length)) : 0;
  far.forEach((f, i) => {
    const x = 4 + i * bw;
    const p = d3.geoMercator().fitExtent([[x + 8, H + 8], [x + bw - 8, H + insetH - 8]], f);
    const d = d3.geoPath(p).digits(1)(f);
    body += `<rect class="inset" fill="none" stroke="#fff" stroke-dasharray="4 3" x="${x + 2}" y="${H + 2}" width="${bw - 4}" height="${insetH - 4}" rx="6"/>`;
    if (d) { body += pathTag(f, d); ids.push(f.properties.shapeID); }
  });
  const extra = dots.length ? `<g fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 2">${rings.join('')}</g><g stroke="#fff" stroke-width="1">${dots.join('')}</g>` : '';
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H + insetH}" role="img">${body}</g>${extra}</svg>`, ids };
}

// ---------- Home page card art ----------

// Cartoon globes for the region cards: the region's countries in green, the rest of the land
// in sand, on a blue sphere with a thick outline. The World card gets a flat, colourful map.
// Region -> [longitude, latitude] the globe faces.
const ART_CENTRE = { africa: [18, 3], 'north-america': [-98, 38], 'south-america': [-60, -18], asia: [90, 30], oceania: [150, -20], europe: [16, 50] };
let artLand = null;
async function artFeatures() {
  if (artLand) return artLand;
  const topo = require('world-atlas/countries-110m.json');
  const fc = await simplify(feature(topo, topo.objects.countries), 12);
  fc.features.forEach((f) => { f.iso2 = isoOf(f.id, f.properties.name); rewind(f); });
  return (artLand = fc.features.filter((f) => f.id !== '010'));
}

// inRegion(iso2) -> true for countries to paint green.
async function regionArt(key, inRegion) {
  const feats = await artFeatures();
  if (key === 'world') {
    const k = countryColours();
    const proj = d3.geoNaturalEarth1().fitExtent([[10, 10], [310, 180]], { type: 'Sphere' });
    const pg = d3.geoPath(proj).digits(0);
    const byColour = PALETTE.map(() => []);
    for (const f of feats) byColour[k[f.iso2] || 0].push(pg(f));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190"><path d="${pg({ type: 'Sphere' })}" fill="#2F9BE3" stroke="#14202E" stroke-width="3"/>`
      + byColour.map((ds, i) => `<path fill="${PALETTE[i]}" stroke="#14202E" stroke-width=".4" d="${ds.join('')}"/>`).join('') + '</svg>';
  }
  const [lon, lat] = ART_CENTRE[key];
  const proj = d3.geoOrthographic().rotate([-lon, -lat]).fitExtent([[8, 8], [232, 232]], { type: 'Sphere' });
  const pg = d3.geoPath(proj).digits(0);
  const mine = [];
  const other = [];
  for (const f of feats) { const d = pg(f); if (d) (f.iso2 && inRegion(f.iso2) ? mine : other).push(d); }
  const sphere = pg({ type: 'Sphere' });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><radialGradient id="g" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`
    + `<path d="${sphere}" fill="#2F9BE3"/><path fill="#F7D46A" stroke="#C9A23E" stroke-width=".6" d="${other.join('')}"/><path fill="#6DB33F" stroke="#3F7F25" stroke-width=".6" d="${mine.join('')}"/>`
    + `<path d="${sphere}" fill="url(#g)"/><path d="${sphere}" fill="none" stroke="#14202E" stroke-width="5"/></svg>`;
}

// The capital-city star drawn over card maps.
function star(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.42 : r;
    pts.push(`${round(cx + rr * Math.cos(a))},${round(cy + rr * Math.sin(a))}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="#fff" stroke="#14202E" stroke-width="4" stroke-linejoin="round"/>`;
}
const addStar = (svg) => svg.replace('</svg>', star(160, 98, 62) + '</svg>');

// Continent page stamps: the continent's countries in the map colours (kind 'maps'), or in
// one colour under a big capital-city star (kind 'capitals').
async function continentThumb(viewKey, inScope, kind = 'maps') {
  const v = VIEWS[viewKey];
  const proj = d3.geoMercator().rotate([v.rotate, 0]).fitExtent([[6, 6], [314, 184]], boxPoints(v.box)).clipExtent([[0, 0], [320, 190]]);
  const pg = d3.geoPath(proj).digits(0);
  const k = countryColours();
  const byColour = PALETTE.map(() => []);
  const other = [];
  for (const f of await artFeatures()) {
    const d = pg(f);
    if (!d) continue;
    if (f.iso2 && inScope(f.iso2)) byColour[kind === 'maps' ? k[f.iso2] || 0 : 2].push(d);
    else other.push(d);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190"><path fill="#EFE9DC" fill-opacity=".45" d="${other.join('')}"/>`
    + byColour.map((ds, i) => (ds.length ? `<path fill="${PALETTE[i]}" stroke="#fff" stroke-width=".5" d="${ds.join('')}"/>` : '')).join('')
    + (kind === 'capitals' ? star(160, 98, 62) : '') + '</svg>';
}

// ---------- World games: physical features ----------

// Biomes get their own 14 nature colours (the 6-colour palette would repeat).
const BIOME_COLOURS = { b1: '#2E8B57', b2: '#8DB600', b3: '#6B8E23', b4: '#9ACD32', b5: '#3C7A5A', b6: '#5F8575', b7: '#E9C46A', b8: '#D4B96A', b9: '#7FB3A8', b10: '#B08968', b11: '#C9D6DF', b12: '#C08497', b13: '#F4D19B', b14: '#1B998B' };

// A world map (Natural Earth projection, 1000x500) with one game's features on top.
// game: { kind: 'poly'|'line'|'point', items: [{ id, at? }] }; geo: FeatureCollection with properties.id.
// art: a lighter version for the card image (no hit areas, less detail).
// Land as one outline (no country borders), which is all the physical games need.
const landCache = {};
async function landOutline(res, pct) {
  const k = res + pct;
  if (landCache[k]) return landCache[k];
  const topo = require(`world-atlas/land-${res}.json`);
  const f = feature(topo, topo.objects.land); // one MultiPolygon feature, not a collection
  const fc = await simplify(f.type === 'FeatureCollection' ? f : { type: 'FeatureCollection', features: [f] }, pct);
  fc.features.forEach(rewind);
  return (landCache[k] = fc.features);
}

const range = (a, b, step) => { const out = []; for (let x = a; x <= b; x += step) out.push(x); return out; };

// Simplify harder until the map fits the size budget (like the province maps).
async function physSvg(key, game, geo, opts = {}) {
  let out;
  for (const pct of opts.art ? [4, 2, 1, 0.5, 0.25] : [25, 12, 6, 3, 1.5, 0.8, 0.4, 0.2]) {
    out = await physRender(key, game, geo && JSON.parse(JSON.stringify(geo)), { ...opts, pct });
    if (out.length <= (opts.art ? 30 : 90) * 1024) break;
  }
  return out;
}

// Card images zoom in where each game's features cluster, so the cards don't all look alike.
// [west, south, east, north]
const ART_BOX = {
  seas: [-15, 25, 60, 68], straits: [-20, 28, 40, 62], lakes: [-125, 32, -65, 66], islands: [90, -12, 150, 25],
  archipelagos: [100, -25, 180, 25], regions: [-15, 20, 110, 72], ranges: [55, 20, 110, 52], cities: [60, -5, 145, 45],
  mountains: [65, 18, 105, 48], deserts: [-20, 5, 80, 45], volcanoes: [115, -12, 150, 45], rivers: [-20, -35, 55, 35],
  wonders: [-100, -30, 125, 50], 'ancient-wonders': [18, 25, 48, 41],
};
// Quiz maps that show one region instead of the world: the ancient wonders all lie between
// Greece and Mesopotamia, too close together to pick out on a world map.
const QUIZ_BOX = { 'ancient-wonders': [14, 23, 50, 43] };

async function physRender(key, game, geo, { art = false, pct }) {
  const W2 = art ? 320 : 1000;
  const H2 = art ? 190 : 500;
  const polar = key === 'continents' || key === 'biomes';
  const box = art ? ART_BOX[key] : QUIZ_BOX[key];
  const proj = (box ? d3.geoMercator().rotate([-(box[0] + box[2]) / 2, 0]) : d3.geoNaturalEarth1())
    .fitExtent([[4, 4], [W2 - 4, H2 - 4]], boxPoints(box || [-179.9, polar ? -85 : -58, 179.9, 84])).clipExtent([[0, 0], [W2, H2]]);
  const pg = d3.geoPath(proj).digits(art ? 0 : 1);
  const land = (await landOutline(art ? '110m' : '50m', art ? 40 : 6)).map((f) => pg(f)).join('');
  const colourOf = (id, i) => (BIOME_COLOURS[id] ? { cls: '', fill: BIOME_COLOURS[id] } : { cls: ` k${i % 6}`, fill: PALETTE[i % 6] });
  let body = `<rect width="${W2}" height="${H2}" fill="#5CC8EC"/><path d="${land}" fill="#EFE9DC" stroke="#fff" stroke-width=".4"/>`;
  const rings = [];
  const r = art ? 5 : 6;

  if (game.kind === 'point') {
    game.items.forEach((it, i) => {
      const p = proj(it.at);
      if (!p) return;
      const c = colourOf(it.id, i);
      rings.push(`<circle class="ring" fill="none" stroke="#fff" stroke-dasharray="3 2" cx="${round(p[0])}" cy="${round(p[1])}" r="${r * 2}"/>`);
      body += `<circle class="c dot${c.cls}" data-id="${it.id}" fill="${c.fill}" stroke="#14202E" stroke-width="1" cx="${round(p[0])}" cy="${round(p[1])}" r="${r}"/>`;
    });
    return svgWrap(W2, H2, rings.join('') + body, key);
  }

  if (!geo) return svgWrap(W2, H2, body);
  // Biomes are thousands of fragments; the small ones add bytes but can't be seen or tapped.
  // filter-slivers also fills the thousands of small holes (enclaves of other biomes).
  if (key === 'biomes') {
    const a = art ? 60000 : 15000;
    geo = asFeatures(JSON.parse((await mapshaper.applyCommands(`-i in.json -filter-islands min-area=${a}km2 remove-empty -filter-slivers min-area=${a}km2 -o out.json format=geojson`, { 'in.json': geo }))['out.json']));
    geo.features = geo.features.filter((f) => f.geometry);
  }
  const fc = await simplifyKeep(geo, game.kind === 'line' ? Math.min(100, pct * 3) : pct);
  fc.features.forEach(rewind);
  const index = Object.fromEntries(game.items.map((it, i) => [it.id, i]));
  for (const f of fc.features) {
    const id = f.properties.id;
    const i = index[id];
    if (i == null) continue;
    const c = colourOf(id, i);
    const d = pg(f);
    if (!d) continue;
    if (game.kind === 'line') {
      body += `<path class="c ln${c.cls}" data-id="${id}" fill="none" stroke="${c.fill}" stroke-width="${art ? 2.4 : 2.6}" stroke-linecap="round" d="${d}"/>`;
      if (!art) body += `<path class="c hit" data-id="${id}" fill="none" stroke="transparent" stroke-width="14" d="${d}"/>`;
      continue;
    }
    body += `<path class="c${c.cls}" data-id="${id}" fill="${c.fill}" stroke="#fff" stroke-width=".6" d="${d}"/>`;
    // Small shapes (islands, straits, lakes) also get a dot in a dashed ring to find and tap.
    const [[x0, y0], [x1, y1]] = pg.bounds(f);
    if ((x1 - x0) * (y1 - y0) < (art ? 20 : 180)) {
      const [cx, cy] = pg.centroid(f);
      if (Number.isFinite(cx)) {
        rings.push(`<circle class="ring" fill="none" stroke="#fff" stroke-dasharray="3 2" cx="${round(cx)}" cy="${round(cy)}" r="${r * 2}"/>`);
        body += `<circle class="c dot${c.cls}" data-id="${id}" fill="${c.fill}" stroke="#14202E" stroke-width="1" cx="${round(cx)}" cy="${round(cy)}" r="${r * 0.8}"/>`;
      }
    }
  }
  return svgWrap(W2, H2, body + rings.join(''), key);
}

function svgWrap(w, h, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img">${inner}</svg>`;
}

// Simplify, but keep every feature (tiny straits and lakes would otherwise vanish).
async function simplifyKeep(fc, pct) {
  const out = await mapshaper.applyCommands(`-i in.json -simplify ${pct}% keep-shapes -o out.json format=geojson`, { 'in.json': fc });
  return asFeatures(JSON.parse(out['out.json']));
}

// Latitude and longitude: a Pacific-centred world map (so the 180th meridian is inside the
// map) with the key lines drawn on it.
const LAT_LINES = [
  ['equator', 'lat', 0], ['tropic-cancer', 'lat', 23.44], ['tropic-capricorn', 'lat', -23.44],
  ['arctic-circle', 'lat', 66.56], ['antarctic-circle', 'lat', -66.56], ['prime-meridian', 'lon', 0], ['meridian-180', 'lon', 180],
];
async function latLongSvg({ art = false } = {}) {
  const W2 = art ? 320 : 1000;
  const H2 = art ? 190 : 520;
  const proj = d3.geoNaturalEarth1().rotate([-150, 0]).fitExtent([[6, 6], [W2 - 6, H2 - 6]], { type: 'Sphere' });
  const pg = d3.geoPath(proj).digits(art ? 0 : 1);
  const land = (await landOutline(art ? '110m' : '50m', art ? 40 : 6)).map((f) => pg(f)).join('');
  const grat = pg(d3.geoGraticule().step([30, 30])());
  let body = `<path d="${pg({ type: 'Sphere' })}" fill="#5CC8EC"/><path d="${grat}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/><path d="${land}" fill="#EFE9DC" stroke="#fff" stroke-width=".4"/>`;
  LAT_LINES.forEach(([id, type, v], i) => {
    const line = type === 'lat'
      ? { type: 'LineString', coordinates: range(-180, 180, 2).map((x) => [x, v]) }
      : { type: 'LineString', coordinates: range(-90, 90, 2).map((y) => [v === 180 ? 179.99 : v, y]) };
    const d = pg(line);
    body += `<path class="c ln k${i % 6}" data-id="${id}" fill="none" stroke="${PALETTE[i % 6]}" stroke-width="${art ? 2 : 3.2}" d="${d}"/>`;
    if (!art) body += `<path class="c hit" data-id="${id}" fill="none" stroke="transparent" stroke-width="16" d="${d}"/>`;
  });
  body += `<path d="${pg({ type: 'Sphere' })}" fill="none" stroke="#14202E" stroke-width="${art ? 2 : 3}"/>`;
  return svgWrap(W2, H2, body);
}

// Stamp art for the country games on the home page (320x190).
async function countryGameArt(key, { landlocked = new Set(), neighbours = [] } = {}) {
  const W2 = 320, H2 = 190;
  const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W2} ${H2}">${inner}</svg>`;
  if (key === 'currencies') {
    // A spread of coins with currency signs.
    const coins = [[70, 105, 42, '$'], [150, 80, 46, '€'], [235, 108, 40, '¥'], [110, 150, 30, '₹'], [200, 155, 28, '£']];
    return svg(coins.map(([x, y, r, s]) => `<circle cx="${x}" cy="${y + 4}" r="${r}" fill="#8A6A1F"/><circle cx="${x}" cy="${y}" r="${r}" fill="#F2C14E" stroke="#B8891E" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r - 8}" fill="none" stroke="#B8891E" stroke-width="1.5" stroke-dasharray="3 3"/><text x="${x}" y="${y + r * 0.36}" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${r}" fill="#7A5A12">${s}</text>`).join(''));
  }
  if (key === 'languages') {
    // "Hello" in several scripts, in speech bubbles.
    const b = [[18, 22, 120, 'Hello', '#FBF8F1'], [160, 14, 140, '你好', '#F2C14E'], [30, 82, 130, 'مرحبا', '#F28DB2'], [178, 76, 120, 'नमस्ते', '#8CC084'], [80, 138, 150, 'Hola · Привет', '#B497D6']];
    return svg(b.map(([x, y, w, s, fill]) => `<path d="M${x} ${y}h${w}a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10h-${w - 30}l-14 12v-12h-${16}a10 10 0 0 1-10-10v-26a10 10 0 0 1 10-10z" fill="${fill}" stroke="#152238" stroke-width="2"/><text x="${x + w / 2}" y="${y + 31}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="20" fill="#152238">${s}</text>`).join(''));
  }
  if (key === 'neighbours') {
    // France in gold, its neighbours in map colours, on a close-up of western Europe.
    const proj = d3.geoMercator().rotate([-8, 0]).fitExtent([[4, 4], [W2 - 4, H2 - 4]], boxPoints([-8, 40, 20, 53])).clipExtent([[0, 0], [W2, H2]]);
    const pg = d3.geoPath(proj).digits(0);
    const k = countryColours();
    let s = `<rect width="${W2}" height="${H2}" fill="#5CC8EC"/>`;
    for (const f of await worldFeatures(30)) {
      const d = pg(f);
      if (!d) continue;
      const fill = f.iso2 === 'FR' ? '#FFD166' : neighbours.includes(f.iso2) ? PALETTE[k[f.iso2] || 0] : '#EFE9DC';
      s += `<path d="${d}" fill="${fill}" stroke="#fff" stroke-width="${f.iso2 === 'FR' ? 2 : 1}"/>`;
    }
    return svg(s);
  }
  // World maps: landlocked countries in green, or the four hemispheres tinted.
  const feats = await artFeatures();
  const proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W2 - 8, H2 - 8]], { type: 'Sphere' });
  const pg = d3.geoPath(proj).digits(0);
  const sphere = pg({ type: 'Sphere' });
  let s = `<path d="${sphere}" fill="#5CC8EC"/>`;
  if (key === 'hemispheres') {
    const [cx, cy] = proj([0, 0]);
    s += `<clipPath id="sph"><path d="${sphere}"/></clipPath><g clip-path="url(#sph)" opacity=".35"><rect x="0" y="0" width="${cx}" height="${cy}" fill="#F28DB2"/><rect x="${cx}" y="0" width="${W2}" height="${cy}" fill="#F2C14E"/><rect x="0" y="${cy}" width="${cx}" height="${H2}" fill="#8CC084"/><rect x="${cx}" y="${cy}" width="${W2}" height="${H2}" fill="#B497D6"/></g>`;
    s += `<path fill="#EFE9DC" stroke="#fff" stroke-width=".4" d="${feats.map((f) => pg(f)).join('')}"/>`;
    s += `<path d="${pg({ type: 'LineString', coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]] })}" stroke="#A3195B" stroke-width="3" fill="none"/><path d="${pg({ type: 'LineString', coordinates: [[0, -90], [0, 0], [0, 90]] })}" stroke="#A3195B" stroke-width="3" fill="none"/>`;
  } else {
    s += `<path fill="#EFE9DC" stroke="#fff" stroke-width=".4" d="${feats.filter((f) => !landlocked.has(f.iso2)).map((f) => pg(f)).join('')}"/><path fill="#6DB33F" stroke="#fff" stroke-width=".6" d="${feats.filter((f) => landlocked.has(f.iso2)).map((f) => pg(f)).join('')}"/>`;
  }
  return svg(s + `<path d="${sphere}" fill="none" stroke="#14202E" stroke-width="2"/>`);
}

// ---------- Country outlines ("Guess the country") ----------
// One picture per country: its outline alone, Mercator centred on the country, as people know it
// from maps. Far-off pieces are left out so the shape stays recognisable (Alaska and Hawaii for the
// US, French Guiana for France): a piece stays if it has at least a quarter of the largest piece's
// area, or lies within 5 degrees of the box around those big pieces.
// prints (optional): { iso2: [{ id, at: [lon, lat] }] }. For each listed country it is filled in
// with a large printable outline (1000x700) with the capital(s) as dots, keyed by iso2.
async function countryShapes({ prints } = {}) {
  // Large countries are simplified (smaller files); small ones keep full 1:50m detail so a
  // small island does not collapse into a triangle.
  const collect = (feats) => {
    const by = {};
    for (const f of feats) {
      if (!f.iso2 || !f.geometry) continue;
      const g = f.geometry;
      (by[f.iso2] = by[f.iso2] || []).push(...(g.type === 'Polygon' ? [g.coordinates] : g.coordinates));
    }
    return by;
  };
  const coarse = collect(await worldFeatures(40));
  const fine = collect(await worldFeatures(100));
  const SMALL = 60000 / 6371 ** 2; // 60,000 km² in steradians
  const parts = {};
  for (const iso2 of Object.keys(fine)) {
    const area = fine[iso2].reduce((n, p) => n + d3.geoArea({ type: 'Polygon', coordinates: p }), 0);
    parts[iso2] = area < SMALL || !coarse[iso2] ? fine[iso2] : coarse[iso2];
  }
  const out = {};
  const W3 = 400, H3 = 300;
  for (const [iso2, list] of Object.entries(parts)) {
    const area = (p) => d3.geoArea({ type: 'Polygon', coordinates: p });
    const max = Math.max(...list.map(area));
    const big = list.filter((p) => area(p) >= max / 4);
    const [[x0, y0], [x1, y1]] = d3.geoBounds({ type: 'MultiPolygon', coordinates: big });
    const wrap = (lon) => (x0 > x1 && lon < x0 - 5 ? lon + 360 : lon);
    const keep = list.filter((p) => {
      if (big.includes(p)) return true;
      const [lon, lat] = d3.geoCentroid({ type: 'Polygon', coordinates: p });
      return lat >= y0 - 5 && lat <= y1 + 5 && wrap(lon) >= x0 - 5 && wrap(lon) <= (x0 > x1 ? x1 + 360 : x1) + 5;
    });
    const shape = { type: 'MultiPolygon', coordinates: keep };
    const [lon] = d3.geoCentroid({ type: 'MultiPolygon', coordinates: big });
    const proj = d3.geoMercator().rotate([-lon, 0]).fitExtent([[16, 16], [W3 - 16, H3 - 16]], shape);
    const d = d3.geoPath(proj).digits(0)(shape);
    // Outline first, fill on top: the fill hides lines between pieces of one country (Northern Cyprus).
    if (d) out[iso2] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W3} ${H3}"><defs><path id="s-${iso2}" d="${d}"/></defs><use href="#s-${iso2}" fill="none" stroke="#7A3A12" stroke-width="4" stroke-linejoin="round"/><use href="#s-${iso2}" fill="#E07A3F"/></svg>`;
    if (prints && prints[iso2]) {
      const PW = 1000, PH = 700;
      const pp = d3.geoMercator().rotate([-lon, 0]).fitExtent([[40, 40], [PW - 40, PH - 40]], shape);
      const pd = d3.geoPath(pp).digits(1)(shape);
      const dots = prints[iso2].map((k) => { const xy = pp(k.at); return xy ? `<circle class="c dot" data-id="${k.id}" cx="${round(xy[0])}" cy="${round(xy[1])}" r="9" fill="#E07A3F" stroke="#14202E" stroke-width="2"/>` : ''; }).join('');
      prints[iso2] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}" role="img"><rect width="${PW}" height="${PH}" fill="#D4E4EC"/><path class="land" d="${pd}" fill="#EFE9DC" stroke="#4A5A70" stroke-width="1.5" stroke-linejoin="round"/>${dots}</svg>`;
    }
  }
  return out;
}

// Which hemispheres each country's main landmass lies in: { iso2: { ns: 'N'|'S'|'B', ew: 'E'|'W'|'B' } }.
// "Main landmass" = the country's largest polygon, so overseas islands don't decide it.
async function hemispheres() {
  const fc = await worldBase();
  const byIso = {};
  for (const f of fc.features) {
    const iso2 = isoOf(f.id, f.properties.name);
    if (!iso2 || !f.geometry) continue;
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const p of polys) {
      const poly = rewind({ type: 'Feature', geometry: { type: 'Polygon', coordinates: p } });
      const a = d3.geoArea(poly);
      if (!byIso[iso2] || a > byIso[iso2].a) byIso[iso2] = { a, poly };
    }
  }
  const out = {};
  for (const [iso2, { poly }] of Object.entries(byIso)) {
    const [[w, s], [e, n]] = d3.geoBounds(poly);
    const ns = s >= 0 ? 'N' : n <= 0 ? 'S' : 'B';
    // w > e means the shape crosses the 180° line; otherwise check the 0° line.
    const ew = w > e ? 'B' : w >= 0 ? 'E' : e <= 0 ? 'W' : 'B';
    out[iso2] = { ns, ew };
  }
  return out;
}

// A world map for a country list page: the listed countries in orange, the rest pale, the Equator
// as a red line, and (shade 'N' or 'S') that hemisphere lightly tinted.
async function listMap(highlight, { shade = null, equator = true } = {}) {
  const W2 = 1000, H2 = 510;
  const proj = d3.geoNaturalEarth1().fitExtent([[6, 6], [W2 - 6, H2 - 6]], { type: 'Sphere' });
  const pg = d3.geoPath(proj).digits(0);
  const sphere = pg({ type: 'Sphere' });
  const feats = await worldFeatures(4);
  let on = '', off = '';
  for (const f of feats) { const d = pg(f); if (!d) continue; if (highlight.has(f.iso2)) on += d; else off += d; }
  const eq = pg({ type: 'LineString', coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]] });
  const [, ey] = proj([0, 0]);
  const band = shade === 'S' ? `<rect x="0" y="${round(ey)}" width="${W2}" height="${round(H2 - ey)}" fill="#1F5F8B" opacity=".14"/>`
    : shade === 'N' ? `<rect x="0" y="0" width="${W2}" height="${round(ey)}" fill="#1F5F8B" opacity=".14"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W2} ${H2}" role="img"><defs><clipPath id="sph"><path d="${sphere}"/></clipPath></defs>`
    + `<path d="${sphere}" fill="#BFE3F2"/><g clip-path="url(#sph)">${band}</g>`
    + `<path d="${off}" fill="#EFE9DC" stroke="#fff" stroke-width=".5"/><path d="${on}" fill="#E07A3F" stroke="#fff" stroke-width=".6"/>`
    + `${equator ? `<path d="${eq}" fill="none" stroke="#C0262D" stroke-width="2.5" stroke-dasharray="8 5"/>` : ''}<path d="${sphere}" fill="none" stroke="#14202E" stroke-width="1.5"/></svg>`;
}

// ---------- Groups of countries (organisations, regions, language lists) ----------
// A zoomed map view for a group: centred on its members, with a margin. A group spread over more
// than 120 degrees of longitude (G20, NATO, English-speaking...) returns null: it keeps the world map.
async function groupView(members) {
  const polys = {};
  for (const f of await worldFeatures(30)) {
    if (!f.iso2) continue;
    const g = f.geometry;
    const parts = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const coordinates of parts) {
      const geo = { type: 'Polygon', coordinates };
      const a = d3.geoArea(geo);
      if (!polys[f.iso2] || a > polys[f.iso2].a) polys[f.iso2] = { a, geo };
    }
  }
  // The main landmass of each country (not far islands); a dot position for the small ones.
  const geometries = members.map((c) => (c.area >= 3000 && polys[c.iso2] ? polys[c.iso2].geo : { type: 'Point', coordinates: [c.latlng[1], c.latlng[0]] }));
  const [[w, s], [e, n]] = d3.geoBounds({ type: 'GeometryCollection', geometries });
  const lonSpan = e >= w ? e - w : e - w + 360;
  if (lonSpan > 120 || n - s > 80) return null;
  const m = Math.max(3, 0.12 * Math.max(lonSpan, n - s));
  const view = { box: [w - m, s - m, w + lonSpan + m, Math.min(n + m, 80)], rotate: -(w + lonSpan / 2) };
  // As tall as the box needs at the map's width, within limits.
  const pts = boxPoints(view.box);
  const p0 = d3.geoMercator().rotate([view.rotate, 0]).fitWidth(W - 8, pts);
  const bb = d3.geoPath(p0).bounds(pts);
  view.height = Math.round(Math.min(Math.max(bb[1][1] - bb[0][1] + 8, 300), 1100));
  return view;
}

// The same zoomed view as a picture: the group in orange on a pale map (1000 x 510), for the page,
// the cards and the share image. Small countries get an orange dot.
async function listMapZoom(highlight, members, view) {
  const W2 = 1000, H2 = 510;
  const proj = d3.geoMercator().rotate([view.rotate, 0]).fitExtent([[6, 6], [W2 - 6, H2 - 6]], boxPoints(view.box)).clipExtent([[0, 0], [W2, H2]]);
  const pg = d3.geoPath(proj).digits(1);
  let on = '', off = '';
  for (const f of await worldFeatures(30)) { if (f.id === '010') continue; const d = pg(f); if (!d) continue; if (highlight.has(f.iso2)) on += d; else off += d; }
  let dots = '';
  for (const c of members) {
    if (c.area >= 3000) continue;
    const p = proj([c.latlng[1], c.latlng[0]]);
    if (p && p[0] >= 0 && p[0] <= W2 && p[1] >= 0 && p[1] <= H2) dots += `<circle cx="${round(p[0])}" cy="${round(p[1])}" r="9" fill="#E07A3F" stroke="#fff" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W2} ${H2}" role="img"><rect width="${W2}" height="${H2}" fill="#BFE3F2"/>`
    + `<path d="${off}" fill="#EFE9DC" stroke="#fff" stroke-width=".6"/><path d="${on}" fill="#E07A3F" stroke="#fff" stroke-width=".8"/>${dots}</svg>`;
}

module.exports = { groupView, listMapZoom, listMap, countryShapes, continentSvg, adm1Svg, adm1Thumb, continentThumb, addStar, regionArt, physSvg, latLongSvg, hemispheres, countryGameArt, LAT_LINES, VIEWS };
