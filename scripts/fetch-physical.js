// Builds data for the physical-geography games on the World page:
//   data/physical.json          games -> items (id, names in every site language, point coords)
//   data/geo/phys-<game>.json   shapes for polygon and line games
// Sources: Natural Earth 1:50m/1:10m (public domain, names in all site languages),
// Wikidata (CC0) for rivers, mountains and volcanoes, RESOLVE Ecoregions 2017 (CC BY 4.0) for biomes.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const mapshaper = require('mapshaper');
const { cachedFetch, sparql, entities, labels } = require('./wikidata');

const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const DATA = path.join(__dirname, '..', 'data');
const GEO = path.join(DATA, 'geo');
const LANGS = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur', 'de', 'id', 'it', 'ja', 'ko'];
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Natural Earth stores names as name_xx or NAME_XX.
function neNames(p) {
  const get = (l) => p['name_' + l] || p['NAME_' + l.toUpperCase()] || null;
  const o = {};
  for (const l of LANGS) o[l] = get(l);
  o.en = o.en || p.name || p.NAME;
  return o;
}
const prop = (p, k) => (p[k] != null ? p[k] : p[k.toUpperCase()]);

// Wikidata labels in every site language for a list of QIDs.
async function wdNames(qids) {
  const ent = await entities(qids);
  const out = {};
  for (const q of qids) if (ent[q]) out[q] = labels(ent[q]);
  // Urdu, Russian and Portuguese are not in the entity fetch; get them as plain labels.
  for (let i = 0; i < qids.length; i += 50) {
    const d = await cachedFetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=ur|ru|pt-br|pt|de|id|it|ja|ko&ids=${qids.slice(i, i + 50).join('|')}`);
    for (const [q, e] of Object.entries(d.entities || {})) {
      const L = e.labels || {};
      out[q] = out[q] || {};
      out[q].ur = L.ur && L.ur.value; out[q].ru = L.ru && L.ru.value; out[q].pt = (L['pt-br'] || L.pt || {}).value; out[q].de = L.de && L.de.value;
      for (const l of ['id', 'it', 'ja', 'ko']) out[q][l] = L[l] && L[l].value;
    }
  }
  return out;
}

// How well known a place is: the number of Wikipedia language editions with an article on it.
async function fame(qids) {
  const out = {};
  const list = [...new Set(qids.filter(Boolean))];
  for (let i = 0; i < list.length; i += 150) {
    const rows = await sparql(`SELECT ?i ?n WHERE { VALUES ?i { ${list.slice(i, i + 150).map((q) => 'wd:' + q).join(' ')} } ?i wikibase:sitelinks ?n. }`);
    for (const r of rows) out[r.i] = Number(r.n);
  }
  return out;
}
const qidOf = (f) => f.properties.wikidataid || f.properties.WIKIDATAID || null;

// Names: Wikidata's where it has them (fuller, e.g. "Lake Superior" not "Superior"),
// otherwise Natural Earth's.
async function namesFor(feats) {
  const wd = await wdNames(feats.map(qidOf).filter(Boolean));
  return feats.map((f) => {
    const ne = neNames(f.properties);
    const w = wd[qidOf(f)] || {};
    const o = {};
    for (const l of LANGS) o[l] = w[l] || ne[l];
    return o;
  });
}

// Merge features that share an English name into one (a range drawn in two pieces).
function mergeByName(feats) {
  const by = new Map();
  for (const f of feats) {
    const n = f.properties.name_en || f.properties.NAME_EN || f.properties.name;
    if (!by.has(n)) { by.set(n, { ...f, geometry: { ...f.geometry } }); continue; }
    const g = by.get(n).geometry;
    const polys = (x) => (x.type === 'Polygon' ? [x.coordinates] : x.coordinates);
    by.get(n).geometry = { type: 'MultiPolygon', coordinates: [...polys(g), ...polys(f.geometry)] };
  }
  return [...by.values()];
}

const games = {};
function save(key, kind, items, features) {
  // Every item needs an English name; other languages fall back to English at build time.
  items = items.filter((it) => it.name && it.name.en);
  const ids = new Set();
  for (const it of items) { let id = it.id || slug(it.name.en); while (ids.has(id)) id += '-2'; it.id = id; ids.add(id); }
  games[key] = { kind, items };
  if (features) {
    const byId = new Map(items.map((it) => [it.feature, it.id]));
    const fc = { type: 'FeatureCollection', features: features.filter((f) => byId.has(f)).map((f) => ({ type: 'Feature', properties: { id: byId.get(f) }, geometry: f.geometry })) };
    fs.writeFileSync(path.join(GEO, `phys-${key}.json`), JSON.stringify(fc));
    items.forEach((it) => delete it.feature);
  }
  console.log(`${key}: ${items.length} (${items.slice(0, 8).map((i) => i.name.en).join(', ')}${items.length > 8 ? ', ...' : ''})`);
}

// Take the best-ranked features of one class: lowest scalerank first, then largest.
function pick(features, cls, limit, extra = () => true) {
  const d3 = require('d3-geo');
  return features
    .filter((f) => cls.includes(prop(f.properties, 'featurecla')) && (f.properties.name_en || f.properties.NAME_EN || f.properties.name) && extra(f))
    .sort((a, b) => (prop(a.properties, 'scalerank') - prop(b.properties, 'scalerank')) || (d3.geoArea(b) - d3.geoArea(a)))
    .slice(0, limit);
}

// The Seven Wonders: a fixed list, so each is named by its Wikidata item (checked 2026-10-05).
// New Seven Wonders: chosen in 2007 in a poll run by the New7Wonders Foundation, with the Great
// Pyramid of Giza (the only ancient wonder still standing) as an honorary eighth.
const WONDERS = {
  wonders: ['Q12501', 'Q5788', 'Q79961', 'Q676203', 'Q5859', 'Q10285', 'Q9141', 'Q37200'],
  'ancient-wonders': ['Q37200', 'Q41931', 'Q43018', 'Q46239', 'Q45368', 'Q41553', 'Q43244'],
};
async function wonders() {
  const all = [...new Set(Object.values(WONDERS).flat())];
  const rows = await sparql(`SELECT ?i ?c WHERE { VALUES ?i { ${all.map((q) => 'wd:' + q).join(' ')} } ?i wdt:P625 ?c. }`);
  const at = {};
  for (const r of rows) { const m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.c); if (m && !at[r.i]) at[r.i] = [Number(m[1]), Number(m[2])]; }
  const names = await wdNames(all);
  for (const [key, qids] of Object.entries(WONDERS)) {
    const missing = qids.filter((q) => !at[q]);
    if (missing.length) throw new Error(`${key}: no coordinates for ${missing.join(', ')}`);
    save(key, 'point', qids.map((q) => ({ id: q.toLowerCase(), name: names[q], at: at[q] })));
  }
}

// `--only-wonders`: refresh just the wonders in an existing data/physical.json.
if (process.argv.includes('--only-wonders')) {
  Object.assign(games, JSON.parse(fs.readFileSync(path.join(DATA, 'physical.json'), 'utf8')));
  wonders().then(() => fs.writeFileSync(path.join(DATA, 'physical.json'), JSON.stringify(games, null, 1)));
} else (async () => {
  await wonders();
  const marine = (await cachedFetch(NE + 'ne_50m_geography_marine_polys.geojson')).features;
  const regions = (await cachedFetch(NE + 'ne_50m_geography_regions_polys.geojson')).features;
  const lakes = (await cachedFetch(NE + 'ne_50m_lakes.geojson')).features;
  const places = (await cachedFetch(NE + 'ne_50m_populated_places.geojson')).features;
  const elev = (await cachedFetch(NE + 'ne_50m_geography_regions_elevation_points.geojson')).features;

  // Polygon games from Natural Earth. Where a class holds more places than a quiz needs,
  // keep the best-known ones (most Wikipedia editions).
  const d3 = require('d3-geo');
  const polyGame = async (key, feats, skip = []) => {
    const names = await namesFor(feats);
    const keep = feats.map((f, i) => ({ name: names[i], feature: f })).filter((it) => !skip.includes(it.name.en));
    save(key, 'poly', keep, keep.map((it) => it.feature));
  };
  // Island items such as "Madagascar (island)" have few articles because Wikipedia writes about
  // the country; when a place shares its English name with a country, use the country's count.
  const countryQid = Object.fromEntries(require('../data/countries.json').map((c) => [c.name.en, c.qid]));
  const famous = async (feats, n) => {
    const cq = (f) => countryQid[f.properties.name_en || f.properties.NAME_EN || f.properties.name];
    const fm = await fame([...feats.map(qidOf), ...feats.map(cq)]);
    const score = (f) => Math.max(fm[qidOf(f)] || 0, fm[cq(f)] || 0);
    return feats.sort((a, b) => score(b) - score(a)).slice(0, n);
  };
  const notAntarctic = (f) => d3.geoCentroid(f)[1] > -60;
  const named = (f) => f.properties.name_en || f.properties.NAME_EN || f.properties.name;
  await polyGame('continents', pick(regions, ['Continent'], 10));
  await polyGame('seas', pick(marine, ['sea'], 40));
  await polyGame('straits', pick(marine, ['strait', 'channel'], 20));
  await polyGame('lakes', pick(lakes, ['Lake', 'Alkaline Lake'], 35));
  await polyGame('islands', await famous(pick(regions, ['Island'], 80), 40));
  // Natural Earth files some single islands as island groups.
  await polyGame('archipelagos', await famous(pick(regions, ['Island group'], 85), 36), ['Guam', 'Oahu', 'Tahiti', 'Grande Comore', 'Okinawa Island', 'Hawaii']);
  // "Regions": named areas that are not countries, e.g. Siberia, Patagonia, the Deccan Plateau.
  await polyGame('regions', await famous(pick(regions, ['Geoarea', 'Pen/cape', 'Peninsula', 'Plateau', 'Plain', 'Basin'], 200, notAntarctic), 35));
  await polyGame('ranges', await famous(mergeByName(pick(regions, ['Range/mtn'], 129, notAntarctic)), 40));
  // Natural Earth also files Punjab and the Caatinga (semi-arid scrub) as deserts; they are not.
  await polyGame('deserts', await famous(pick(regions, ['Desert'], 35, (f) => !['Punjab', 'Caatinga'].includes(named(f))), 30));

  // Oceans: Natural Earth splits the Pacific and Atlantic into north and south; merge them.
  const OCEANS = { Q98: /Pacific/, Q97: /Atlantic/, Q1239: /Indian/, Q788: /Arctic/, Q7354: /Southern/ };
  const oceanFeats = [];
  const oceanNames = await wdNames(Object.keys(OCEANS));
  const oceanItems = [];
  for (const [q, re] of Object.entries(OCEANS)) {
    const parts = marine.filter((f) => f.properties.featurecla === 'ocean' && re.test(f.properties.name_en || f.properties.name));
    const merged = JSON.parse((await mapshaper.applyCommands('-i in.json -dissolve -o out.json format=geojson', { 'in.json': { type: 'FeatureCollection', features: parts } }))['out.json']);
    const f = { type: 'Feature', properties: {}, geometry: merged.geometries ? merged.geometries[0] : merged.features[0].geometry };
    oceanFeats.push(f);
    oceanItems.push({ name: oceanNames[q], feature: f });
  }
  save('oceans', 'poly', oceanItems, oceanFeats);

  // Cities: the 60 largest by population. (Natural Earth gives Amaravati a metro population it doesn't have.)
  const cities = places.filter((f) => f.properties.POP_MAX && f.properties.NAME_EN !== 'Amaravati').sort((a, b) => b.properties.POP_MAX - a.properties.POP_MAX).slice(0, 60);
  const cityNames = await namesFor(cities);
  save('cities', 'point', cities.map((f, i) => ({ name: cityNames[i], at: f.geometry.coordinates })));

  // Mountains: Natural Earth peaks, ranked by how many Wikipedias cover them.
  const peaks = elev.filter((f) => f.properties.featurecla === 'mountain' && f.properties.wikidataid);
  const pe = await entities(peaks.map((f) => f.properties.wikidataid));
  const links = (q) => (pe[q] && pe[q].sitelinks ? Object.keys(pe[q].sitelinks).length : 0);
  // entities() asks for enwiki sitelinks only, so rank by a separate sitelink count query.
  const counts = {};
  const rows = await sparql(`SELECT ?i ?n WHERE { VALUES ?i { ${peaks.map((f) => 'wd:' + f.properties.wikidataid).join(' ')} } ?i wikibase:sitelinks ?n. }`);
  for (const r of rows) counts[r.i] = Number(r.n);
  const topPeaks = peaks.sort((a, b) => (counts[b.properties.wikidataid] || links(b.properties.wikidataid)) - (counts[a.properties.wikidataid] || links(a.properties.wikidataid))).slice(0, 25);
  const peakNames = await namesFor(topPeaks);
  save('mountains', 'point', topPeaks.map((f, i) => ({ name: peakNames[i], at: f.geometry.coordinates })));

  // Volcanoes: Wikidata, well-known ones only (covered by 60+ Wikipedias), with coordinates.
  const vrows = await sparql('SELECT DISTINCT ?v ?c ?n WHERE { ?v wdt:P31/wdt:P279* wd:Q8072; wdt:P625 ?c; wikibase:sitelinks ?n. FILTER(?n > 55) FILTER NOT EXISTS { ?v wdt:P31 wd:Q23442 } } ORDER BY DESC(?n)');
  const seen = new Set();
  const vol = [];
  for (const r of vrows) {
    if (seen.has(r.v)) continue;
    seen.add(r.v);
    const m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.c);
    if (m) vol.push({ q: r.v, at: [Number(m[1]), Number(m[2])] });
  }
  const vn = await wdNames(vol.slice(0, 30).map((v) => v.q));
  save('volcanoes', 'point', vol.slice(0, 30).map((v) => ({ name: vn[v.q], at: v.at })));

  // Rivers: Natural Earth 1:10m centrelines merged by name; the 30 longest. Names from Wikidata.
  const rivers = (await cachedFetch(NE + 'ne_10m_rivers_lake_centerlines.geojson')).features.filter((f) => f.properties.featurecla === 'River' && f.properties.scalerank <= 4 && f.properties.name);
  // Natural Earth names stretches of one river separately (the Jinsha is the upper Yangtze)
  // and uses local names; map them to the river's English name before merging.
  const RIVER = { Huang: 'Yellow River', Amazonas: 'Amazon River', 'Solimões': 'Amazon River', Lancang: 'Mekong', Jinsha: 'Yangtze', 'Chang Jiang': 'Yangtze', Tongtian: 'Yangtze',
    Nu: 'Salween', Negro: 'Rio Negro', 'White Nile': 'Nile', 'Victoria Nile': 'Nile', 'Mountain Nile': 'Nile', Ertis: 'Irtysh', Firat: 'Euphrates', 'Al Furat': 'Euphrates', Dihang: 'Brahmaputra', Lualaba: 'Congo River', Congo: 'Congo River' };
  const byName = {};
  for (const f of rivers) { const n = RIVER[f.properties.name] || f.properties.name; (byName[n] = byName[n] || []).push(f); }
  const lengths = Object.entries(byName).map(([n, fs2]) => [n, fs2.reduce((s, f) => s + d3.geoLength(f), 0)]).sort((a, b) => b[1] - a[1]).slice(0, 30);
  const riverItems = [];
  const riverFeats = [];
  for (const [n] of lengths) {
    const base = n.replace(/"/g, '').replace(/ River$/, '');
    const r = await sparql(`SELECT ?i ?s WHERE { VALUES ?l { "${base}"@en "${base} River"@en "River ${base}"@en "Rio ${base}"@en } ?i rdfs:label|skos:altLabel ?l; wdt:P31/wdt:P279* wd:Q4022; wikibase:sitelinks ?s. } ORDER BY DESC(?s) LIMIT 1`);
    const lines = byName[n].flatMap((f) => (f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates));
    const feat = { type: 'Feature', properties: {}, geometry: { type: 'MultiLineString', coordinates: lines } };
    riverItems.push({ q: r[0] && r[0].i, en: n, feature: feat });
    riverFeats.push(feat);
  }
  const rn = await wdNames(riverItems.map((r) => r.q).filter(Boolean));
  save('rivers', 'line', riverItems.map((r) => ({ name: (r.q && rn[r.q]) || { en: r.en }, feature: r.feature })), riverFeats);

  // Biomes: RESOLVE Ecoregions 2017 dissolved by biome. Names are translated in src/i18n.js.
  const zip = path.join(DATA, 'cache', 'Ecoregions2017.zip');
  if (!fs.existsSync(zip)) {
    console.log('Downloading RESOLVE Ecoregions 2017 (142 MB, once)...');
    const res = await fetch('https://storage.googleapis.com/teow2016/Ecoregions2017.zip');
    fs.writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  }
  const bioOut = path.join(DATA, 'cache', 'biomes.json');
  if (!fs.existsSync(bioOut)) {
    execFileSync(process.execPath, [require.resolve('mapshaper/bin/mapshaper'), '-i', zip, '-simplify', '2%', 'keep-shapes', '-dissolve', 'BIOME_NUM', 'copy-fields=BIOME_NAME', '-filter', 'BIOME_NAME != "N/A"', '-o', bioOut, 'format=geojson'], { stdio: 'inherit', maxBuffer: 1 << 30 });
  }
  const bio = JSON.parse(fs.readFileSync(bioOut, 'utf8')).features;
  save('biomes', 'poly', bio.map((f) => ({ id: 'b' + f.properties.BIOME_NUM, name: { en: f.properties.BIOME_NAME }, feature: f })), bio);

  fs.writeFileSync(path.join(DATA, 'physical.json'), JSON.stringify(games, null, 1));
})();
