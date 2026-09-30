// Map quizzes beyond a country's first-level divisions: islands of Hawaii, islands of Denmark,
// the 48 ceremonial counties of England. Output: data/extra-maps.json (same division format as
// data/subdivisions.json) and data/geo/extra-<key>.json (shapes, shapeID = division id).
//
// Islands: the shapes are the island polygons of the country outline in world-atlas 1:10m
// (Natural Earth); each is named by the Wikidata island whose coordinates fall inside it.
// Counties: the Wikidata items and the OpenStreetMap boundaries they link to (P402).
const fs = require('fs');
const path = require('path');
const d3 = require('d3-geo');
const { feature } = require('topojson-client');
const mapshaper = require('mapshaper');
const { sparql, entities, labels, latestQuantity } = require('./wikidata');

const DATA = path.join(__dirname, '..', 'data');
const GEO = path.join(DATA, 'geo');
const OSM_CACHE = path.join(DATA, 'cache', 'osm');
const UA = 'geography-quiz-build/1.0 (static site data build)';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const SETS = [
  // parent: the division (ISO 3166-2) the set belongs to, for the page title ("Islands of Hawaii").
  { key: 'hawaii-islands', country: 'US', parent: 'US-HI', term: 'islands', kind: 'islands', atlasId: 840, box: [-161, 18, -154, 23],
    islandOf: 'Q30', skipNames: ['Maui Nui'] }, // Maui Nui: the prehistoric island that Molokaʻi was part of
  // Jutland is a peninsula: drawn for context, not asked.
  { key: 'denmark-islands', country: 'DK', term: 'islands', kind: 'islands', atlasId: 208, box: [7, 54, 16, 58], minKm2: 20, contextLargest: true,
    islandOf: 'Q35', addItems: ['Q26503', 'Q735905'] }, // Funen, Falster: missing from the island-class search
  { key: 'england-counties', country: 'GB', parent: 'GB-ENG', term: 'counties', kind: 'osm', clipAtlasId: 826,
    query: '?item wdt:P31 wd:Q180673.' },
];

const partsOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
const km2 = (g) => d3.geoArea(g) * 6371 * 6371;

async function osmPolygon(rel) {
  fs.mkdirSync(OSM_CACHE, { recursive: true });
  const file = path.join(OSM_CACHE, rel + '.json');
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(`https://polygons.openstreetmap.fr/get_geojson.py?id=${rel}&params=0`, { headers: { 'User-Agent': UA } });
      const text = await res.text();
      if (res.ok && text.startsWith('{')) { fs.writeFileSync(file, text); return JSON.parse(text); }
    } catch (e) { /* network error: retry */ }
    await fetch(`https://polygons.openstreetmap.fr/index.py?id=${rel}`, { headers: { 'User-Agent': UA } }).catch(() => {});
    await wait(3000 * attempt);
  }
  throw new Error('no OpenStreetMap polygon for relation ' + rel);
}

const atlas = () => {
  const topo = require('world-atlas/countries-10m.json');
  return feature(topo, topo.objects.countries).features;
};

async function islandSet(set) {
  const country = atlas().find((f) => Number(f.id) === set.atlasId);
  const [x0, y0, x1, y1] = set.box;
  let parts = partsOf(country.geometry).map((p) => ({ type: 'Polygon', coordinates: p }))
    .filter((g) => { const [x, y] = d3.geoCentroid(g); return x >= x0 && x <= x1 && y >= y0 && y <= y1; })
    .filter((g) => km2(g) >= (set.minKm2 || 0))
    .sort((a, b) => km2(b) - km2(a));
  let context = [];
  if (set.contextLargest) { context = parts.slice(0, 1); parts = parts.slice(1); }
  // Islands (instances of island or of a subclass up to two levels down) inside the map's box.
  const rows = await sparql(`SELECT ?item ?coord WHERE {
    SERVICE wikibase:box { ?item wdt:P625 ?coord.
      bd:serviceParam wikibase:cornerSouthWest "Point(${x0} ${y0})"^^geo:wktLiteral.
      bd:serviceParam wikibase:cornerNorthEast "Point(${x1} ${y1})"^^geo:wktLiteral. }
    ?item wdt:P17 wd:${set.islandOf}; wdt:P31/wdt:P279?/wdt:P279? wd:Q23442. }`);
  const cands = rows.map((r) => {
    const m = r.coord.match(/Point\(([-\d.]+) ([-\d.]+)\)/);
    return m && { item: r.item, at: [Number(m[1]), Number(m[2])] };
  }).filter(Boolean);
  if (set.addItems) {
    const ex = await entities(set.addItems);
    for (const q of set.addItems) {
      const v = ex[q] && ex[q].claims.P625 && ex[q].claims.P625[0].mainsnak.datavalue.value;
      if (v) cands.push({ item: q, at: [v.longitude, v.latitude] });
    }
  }
  const ent = await entities([...new Set(cands.map((c) => c.item))]);
  const skip = new Set(set.skipNames || []);
  const features = [];
  const divisions = [];
  const used = new Set();
  for (const g of parts) {
    // Islands whose coordinates fall inside this polygon.
    const inside = cands.filter((c) => !used.has(c.item) && !skip.has(labels(ent[c.item] || {}).en) && d3.geoContains(g, c.at));
    // The island whose recorded area (P2046) is closest to the polygon's; items without an area rank last.
    const fit = (c) => { const q = latestQuantity(ent[c.item], 'P2046'); return q && q.value > 0 ? Math.abs(Math.log(q.value / km2(g))) : 99; };
    const best = inside.sort((x, y) => fit(x) - fit(y))[0];
    if (!best) { console.log(`  ${set.key}: no Wikidata island inside the polygon at ${d3.geoCentroid(g).map((v) => v.toFixed(2))}, ${Math.round(km2(g))} km2; left out`); continue; }
    used.add(best.item);
    const id = `${set.key}-${best.item}`;
    features.push({ type: 'Feature', properties: { shapeID: id, shapeName: best.item }, geometry: g });
    const e = ent[best.item];
    const pop = latestQuantity(e, 'P1082');
    divisions.push({ id, iso: null, qid: best.item, name: labels(e), capital: null, capitalQid: null, population: pop ? { value: pop.value, year: pop.year } : null, area: Math.round(km2(g)) });
  }
  for (const [i, g] of context.entries()) features.push({ type: 'Feature', properties: { shapeID: `${set.key}-context-${i}`, context: true }, geometry: g });
  return { features, divisions, source: { license: 'Public domain', sourceName: 'Natural Earth (world-atlas 1:10m) and Wikidata' } };
}

async function osmSet(set) {
  const rows = await sparql(`SELECT ?item ?osm WHERE { ${set.query} FILTER NOT EXISTS { ?item wdt:P576 ?d } OPTIONAL { ?item wdt:P402 ?osm } }`);
  const byItem = {};
  for (const r of rows) byItem[r.item] = byItem[r.item] || r;
  const list = Object.values(byItem);
  const missing = list.filter((r) => !r.osm);
  if (missing.length) throw new Error(`${set.key}: no OpenStreetMap relation for ${missing.map((r) => r.item).join(', ')}`);
  const feats = [];
  for (const r of list) feats.push({ type: 'Feature', properties: { shapeID: `${set.key}-${r.item}`, qid: r.item }, geometry: await osmPolygon(r.osm) });
  const land = atlas().filter((f) => Number(f.id) === set.clipAtlasId);
  const res = await mapshaper.applyCommands('-i div.json -clip land.json -filter-slivers min-area=1km2 -o out.json format=geojson',
    { 'div.json': { type: 'FeatureCollection', features: feats }, 'land.json': { type: 'FeatureCollection', features: land } });
  const out = JSON.parse(res['out.json']);
  const kept = new Set(out.features.map((f) => f.properties.qid));
  const lost = list.filter((r) => !kept.has(r.item));
  if (lost.length) throw new Error(`${set.key}: shape outside the country for ${lost.map((r) => r.item).join(', ')}`);
  // The counties should tile the country: overlaps mean a relation is the wrong boundary.
  const total = out.features.reduce((s, f) => s + km2(f.geometry.type ? rewound(f.geometry) : f.geometry), 0);
  const ent = await entities(list.map((r) => r.item));
  const capEnt = await entities(list.map((r) => { const c = (ent[r.item].claims.P36 || [])[0]; return c && c.mainsnak.datavalue && c.mainsnak.datavalue.value.id; }).filter(Boolean));
  const divisions = list.map((r) => {
    const e = ent[r.item];
    const c = (e.claims.P36 || [])[0];
    const capId = c && c.mainsnak.datavalue && c.mainsnak.datavalue.value.id;
    const pop = latestQuantity(e, 'P1082');
    return { id: `${set.key}-${r.item}`, iso: null, qid: r.item, name: labels(e), capital: capId && capEnt[capId] ? labels(capEnt[capId]) : null, capitalQid: capId || null, population: pop ? { value: pop.value, year: pop.year } : null, area: null };
  });
  console.log(`  ${set.key}: summed area ${Math.round(total)} km2`);
  return { features: out.features, divisions, source: { license: 'Open Database License (ODbL) 1.0', sourceName: '© OpenStreetMap contributors' } };
}

// d3 wants clockwise outer rings; GeoJSON from mapshaper is counter-clockwise.
function rewound(g) {
  const flip = (rings) => rings.map((r) => [...r].reverse());
  return g.type === 'Polygon' ? { type: 'Polygon', coordinates: flip(g.coordinates) } : { type: 'MultiPolygon', coordinates: g.coordinates.map(flip) };
}

(async () => {
  const out = {};
  for (const set of SETS) {
    const r = set.kind === 'islands' ? await islandSet(set) : await osmSet(set);
    fs.writeFileSync(path.join(GEO, `extra-${set.key}.json`), JSON.stringify({ type: 'FeatureCollection', features: r.features }));
    out[set.key] = { country: set.country, parent: set.parent || null, term: set.term, source: r.source, divisions: r.divisions };
    console.log(`${set.key}: ${r.divisions.length} (${r.divisions.map((d) => d.name.en).join(', ')})`);
  }
  fs.writeFileSync(path.join(DATA, 'extra-maps.json'), JSON.stringify(out, null, 1));
})();
