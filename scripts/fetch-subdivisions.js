// Builds data/subdivisions.json and data/geo/adm1-<ISO3>.json for the 100 largest
// countries by area, plus the extra countries listed in site.config.js. Boundaries: geoBoundaries
// gbOpen ADM1 (first-level divisions), or Wikidata + OpenStreetMap where those are out of date.
// Names in every site language, capitals, population and area: Wikidata, joined on the ISO 3166-2 code.
const fs = require('fs');
const path = require('path');
const { cachedFetch, sparql, entities, labels, qidValues, latestQuantity } = require('./wikidata');
const overrides = require('../data/subdivision-overrides');
const mapshaper = require('mapshaper');
const { feature } = require('topojson-client');

const DATA = path.join(__dirname, '..', 'data');
const GEO = path.join(DATA, 'geo');
fs.mkdirSync(GEO, { recursive: true });

const countries = require('../data/countries.json');
const { provinceCountries, extraProvinceCountries = [] } = require('../site.config');
// Walk down the list by area; skipped countries (see overrides) are replaced by the next largest.
// Countries in extraProvinceCountries are added on top of that count.
const BY_AREA = [...countries].sort((a, b) => b.area - a.area);
const EXTRA = new Set(extraProvinceCountries);

// Some sources store UTF-8 names that were decoded as Latin-1 ("RegiÃ³n"). Undo that.
const fixText = (s) => (s && /Ã.|Â./.test(s) ? Buffer.from(s, 'latin1').toString('utf8') : s);

const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/\b(province|provincia|region|state|oblast|governorate|department|departement|departamento|district|county|prefecture|territory|republic|of|the|autonomous|municipality|city|capital|federal|estado|krai|kray|wilayah|mintaqah|muhafazah|velayat|vilayati|viloyati|region de|oblysy)\b/g, '')
  .replace(/[^a-z]/g, '');

// India's Jammu and Kashmir + Ladakh shapes, minus land China holds (Aksai Chin) and minus
// Pakistan's existing divisions (Ladakh as India draws it also covers Gilgit-Baltistan).
// Also saved as data/geo/kashmir.json for the world and continent maps (src/maps.js).
async function kashmirFeature(pakGj, spec) {
  const srcFile = path.join(GEO, 'kashmir-source.json');
  if (!fs.existsSync(srcFile)) throw new Error('kashmir-source.json missing: India must be fetched before Pakistan');
  const topo = require('world-atlas/countries-50m.json');
  const china = feature(topo, topo.objects.countries).features.filter((f) => f.id === '156');
  const res = await mapshaper.applyCommands(
    '-i src.json -dissolve -erase china.json -erase pak.json -filter-slivers min-area=100km2 -o out.json format=geojson',
    { 'src.json': JSON.parse(fs.readFileSync(srcFile, 'utf8')), 'china.json': { type: 'FeatureCollection', features: china }, 'pak.json': pakGj },
  );
  // A dissolve leaves no attributes, so mapshaper returns a bare GeometryCollection.
  const out = JSON.parse(res['out.json']);
  const geometry = out.geometries ? out.geometries[0] : out.features[0].geometry;
  const k = { type: 'Feature', properties: { shapeName: spec.name, shapeID: spec.id, shapeISO: null }, geometry };
  fs.writeFileSync(path.join(GEO, 'kashmir.json'), JSON.stringify({ type: 'FeatureCollection', features: [k] }));
  return k;
}

// ---------- Current divisions from Wikidata + OpenStreetMap ----------
// For countries whose divisions changed after the newest geoBoundaries release (see
// source: 'osm' in the overrides): the list of divisions is the country's current
// "contains administrative territorial entity" (P150) statements on Wikidata, and each
// shape is the OpenStreetMap relation Wikidata links to (P402), cut to the coastline.
const OSM_CACHE = path.join(DATA, 'cache', 'osm');
const UA = 'geography-quiz-build/1.0 (static site data build)';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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
    // The service builds a relation's polygon on first request: ask for it, then retry.
    await fetch(`https://polygons.openstreetmap.fr/index.py?id=${rel}`, { headers: { 'User-Agent': UA } }).catch(() => {});
    await wait(3000 * attempt);
  }
  // Fallback: Nominatim's copy of the same relation (one request, per its usage policy).
  const res = await fetch(`https://nominatim.openstreetmap.org/lookup?format=json&polygon_geojson=1&osm_ids=R${rel}`, { headers: { 'User-Agent': UA } });
  const hit = res.ok && (await res.json())[0];
  if (hit && hit.geojson && /Polygon/.test(hit.geojson.type)) { fs.writeFileSync(file, JSON.stringify(hit.geojson)); return hit.geojson; }
  throw new Error(`no OpenStreetMap polygon for relation ${rel}`);
}

const currentDivisions = (parent) => sparql(`SELECT ?item ?iso ?osm WHERE {
  wd:${parent} p:P150 ?st. ?st ps:P150 ?item. ?st wikibase:rank ?rk. FILTER(?rk != wikibase:DeprecatedRank)
  FILTER NOT EXISTS { ?st pq:P582 ?end } FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }
  OPTIONAL { ?item wdt:P300 ?iso } OPTIONAL { ?item wdt:P402 ?osm } }`);

async function osmDivisions(c, ov, report) {
  let rows = await currentDivisions(c.qid);
  // nested: the country's P150 is a coarser tier (Malawi's 3 regions); use their divisions.
  if (ov.nested) {
    const parents = [...new Set(rows.map((r) => r.item))];
    rows = [];
    for (const p of parents) rows.push(...await currentDivisions(p));
  }
  const byItem = {};
  for (const r of rows) byItem[r.item] = byItem[r.item] || r;
  // osm: { QID: relation } where Wikidata has no OpenStreetMap link, or a stale one.
  for (const r of Object.values(byItem)) {
    if (r.osm && !/^\d+$/.test(r.osm)) r.osm = null; // malformed value on Wikidata
    if (ov.osm && ov.osm[r.item]) r.osm = String(ov.osm[r.item]);
  }
  const drop = new Set(ov.drop || []);
  const list = Object.values(byItem).filter((r) => !drop.has(r.iso) && !drop.has(r.item) && (!ov.requireIso || r.iso));
  const missing = list.filter((r) => !r.osm);
  if (missing.length) throw new Error(`no OpenStreetMap relation on Wikidata for ${missing.map((r) => r.item).join(', ')}`);
  const features = [];
  for (const r of list) {
    const geometry = await osmPolygon(r.osm);
    features.push({ type: 'Feature', properties: { shapeName: r.iso || r.item, shapeISO: r.iso || null, shapeID: `${c.iso3}-${r.item}`, qid: r.item }, geometry });
  }
  // OSM boundaries of coastal divisions often run out to sea: cut them to the land.
  const topo = require('world-atlas/countries-10m.json');
  const wcRow = require('world-countries/countries.json').find((x) => x.cca3 === c.iso3);
  const land = feature(topo, topo.objects.countries).features.filter((f) => Number(f.id) === Number(wcRow.ccn3));
  if (!land.length) throw new Error('no land outline to clip OpenStreetMap shapes');
  const res = await mapshaper.applyCommands(
    '-i div.json -clip land.json -filter-slivers min-area=2km2 -o out.json format=geojson',
    { 'div.json': { type: 'FeatureCollection', features }, 'land.json': { type: 'FeatureCollection', features: land } },
  );
  const out = JSON.parse(res['out.json']);
  // A division that disappears when cut to the country's land had a wrong or stale relation.
  const kept = new Set((out.features || []).map((f) => f.properties.qid));
  const lost = list.filter((r) => !kept.has(r.item));
  if (lost.length) throw new Error(`OpenStreetMap shape outside the country for ${lost.map((r) => `${r.item} (relation ${r.osm})`).join(', ')}: add the right relation under osm in the overrides`);
  report.push(`  ${c.iso3}: ${list.length} divisions from Wikidata P150 + OpenStreetMap`);
  return out;
}

(async () => {
  const report = [];
  const out = {};
  const skipped = [];
  let byArea = 0;
  for (const c of BY_AREA) {
    const extra = EXTRA.has(c.iso3);
    if (!extra && byArea >= provinceCountries) continue;
    const ov = overrides[c.iso3] || {};
    if (ov.skip) { skipped.push(`${c.iso3} ${c.name.en}: ${ov.skip}`); continue; }
    let m;
    let gj;
    if (ov.source === 'osm') {
      try { gj = await osmDivisions(c, ov, report); } catch (e) { skipped.push(`${c.iso3} ${c.name.en}: ${e.message}`); continue; }
      m = { boundaryType: 'OpenStreetMap', boundaryYearRepresented: new Date().getFullYear(), boundaryLicense: 'Open Database License (ODbL) 1.0', boundarySource: '© OpenStreetMap contributors' };
    } else {
      try {
        const meta = await cachedFetch(`https://www.geoboundaries.org/api/current/${ov.source || 'gbOpen'}/${c.iso3}/${ov.level || 'ADM1'}/`);
        m = Array.isArray(meta) ? meta[0] : meta;
      } catch (e) { skipped.push(`${c.iso3} ${c.name.en}: no boundary data (${e.message})`); continue; }
      gj = await cachedFetch(m.simplifiedGeometryGeoJSON);
    }
    const drop = new Set(ov.drop || []);
    for (const f of gj.features) {
      f.properties.shapeName = fixText(f.properties.shapeName);
      const code = ov.iso && ov.iso[f.properties.shapeName];
      if (code) f.properties.shapeISO = code;
    }
    // Kashmir (site policy, see data/subdivision-overrides.js): keep India's Jammu and Kashmir
    // and Ladakh shapes before they are dropped, then add the area to Pakistan.
    if (ov.exportKashmir) {
      const src = gj.features.filter((f) => ov.exportKashmir.includes(f.properties.shapeName));
      fs.writeFileSync(path.join(GEO, 'kashmir-source.json'), JSON.stringify({ type: 'FeatureCollection', features: src }));
    }
    if (ov.addKashmir) gj.features.push(await kashmirFeature(gj, ov.addKashmir));
    gj.features = gj.features.filter((f) => !drop.has(f.properties.shapeName) && !drop.has(f.properties.shapeISO));
    const feats = gj.features;
    if (feats.length < 2) { skipped.push(`${c.iso3} ${c.name.en}: fewer than 2 divisions`); continue; }

    // Wikidata candidates: every item carrying one of the ISO 3166-2 codes, plus first-level
    // divisions of the country (P150) as a fallback for rows without a code.
    const codes = feats.map((f) => f.properties.shapeISO).filter((s) => s && /^[A-Z]{2}-/.test(s));
    const byCode = {};
    if (codes.length) {
      const rows = await sparql(`SELECT ?code ?item WHERE { VALUES ?code { ${codes.map((x) => '"' + x + '"').join(' ')} } ?item wdt:P300 ?code. }`);
      for (const r of rows) (byCode[r.code] = byCode[r.code] || []).push(r.item);
    }
    const p150 = await sparql(`SELECT ?item WHERE { wd:${c.qid} wdt:P150 ?item. }`);
    const candIds = [...Object.values(byCode).flat(), ...p150.map((r) => r.item), ...Object.values(ov.qid || {}), ...feats.map((f) => f.properties.qid).filter(Boolean)];
    const ent = await entities(candIds);
    const live = (id) => ent[id] && !ent[id].missing && !(ent[id].claims && ent[id].claims.P576);

    const subs = [];
    for (const f of feats) {
      const p = f.properties;
      let qid = (ov.qid && ov.qid[p.shapeName]) || p.qid;
      if (!qid && p.shapeISO && byCode[p.shapeISO]) qid = byCode[p.shapeISO].find(live) || byCode[p.shapeISO][0];
      if (!qid) {
        const target = norm(p.shapeName);
        qid = p150.map((r) => r.item).find((id) => live(id) && [ent[id].labels.en && ent[id].labels.en.value, ent[id].labels.fr && ent[id].labels.fr.value, ent[id].labels.es && ent[id].labels.es.value]
          .some((l) => l && (norm(l) === target || (target.length > 3 && (norm(l).includes(target) || target.includes(norm(l)))))));
      }
      subs.push({ shapeName: p.shapeName, shapeISO: p.shapeISO || null, shapeID: p.shapeID, qid: qid || null });
    }

    // Capitals of the subdivisions.
    const capIds = subs.flatMap((s) => (s.qid ? qidValues(ent[s.qid], 'P36').slice(0, 1) : []));
    const capEnt = await entities(capIds);

    const list = subs.map((s) => {
      const e = s.qid && ent[s.qid];
      const name = e ? labels(e) : { en: s.shapeName };
      if (!name.en) name.en = s.shapeName;
      const capId = e && !ov.noCapitals ? qidValues(e, 'P36')[0] : null;
      const cap = capId && capEnt[capId] ? labels(capEnt[capId]) : null;
      const pop = e ? latestQuantity(e, 'P1082') : null;
      const area = e ? latestQuantity(e, 'P2046') : null;
      // Area must be in km² (Q712226); ignore other units rather than guess conversions.
      const areaKm = area && /Q712226$/.test(area.unit) ? area.value : null;
      const o = { id: s.shapeID, iso: s.shapeISO, qid: s.qid, name, capital: cap, capitalQid: capId || null,
        population: pop ? { value: pop.value, year: pop.year } : null, area: areaKm };
      // The added Kashmir unit: Wikidata's area for the former state includes land drawn
      // elsewhere on this map, so leave it blank rather than show a figure that doesn't match.
      if (ov.addKashmir && s.shapeID === ov.addKashmir.id) { o.area = null; Object.assign(o.name, ov.addKashmir.names || {}); }
      return o;
    });

    // Two boundaries joined to the same Wikidata item means one join is wrong.
    const seenQ = {};
    for (const s of list) if (s.qid) (seenQ[s.qid] = seenQ[s.qid] || []).push(s.name.en);
    for (const [q, names] of Object.entries(seenQ)) if (names.length > 1) report.push(`  DUPLICATE ${c.iso3} ${q}: ${names.join(' / ')}`);
    const noQid = list.filter((s) => !s.qid).length;
    const noCap = list.filter((s) => !s.capital).length;
    report.push(`${c.iso3} ${c.name.en}: ${list.length} divisions (${m.boundaryType}, ${m.boundaryYearRepresented}), unmatched ${noQid}, no capital ${noCap}, license ${m.boundaryLicense}`);
    if (!extra) byArea++;
    out[c.iso2] = { iso3: c.iso3, source: { year: m.boundaryYearRepresented, license: m.boundaryLicense, sourceName: m.boundarySource }, divisions: list };
    fs.writeFileSync(path.join(GEO, `adm1-${c.iso3}.json`), JSON.stringify(gj));
  }
  fs.writeFileSync(path.join(DATA, 'subdivisions.json'), JSON.stringify(out, null, 1));
  const text = report.join('\n') + '\n\nSkipped:\n' + skipped.join('\n');
  fs.writeFileSync(path.join(DATA, 'subdivisions-report.txt'), text);
  console.log(text);
})();
