// Builds data/countries.json: the 193 UN member states plus the two observer
// states (Vatican City, Palestine), with names and capitals in all site languages.
// Sources: world-countries (ISO codes, region, area, borders) and Wikidata (names, capitals, population).
const fs = require('fs');
const path = require('path');
const wc = require('world-countries/countries.json');
const { sparql, entities, labels, qidValues, latestQuantity } = require('./wikidata');

const OUT = path.join(__dirname, '..', 'data', 'countries.json');
const OBSERVERS = ['VA', 'PS'];

function continentOf(c) {
  if (c.region === 'Americas') return c.subregion === 'South America' ? 'south-america' : 'north-america';
  return { Africa: 'africa', Asia: 'asia', Europe: 'europe', Oceania: 'oceania' }[c.region];
}

function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

(async () => {
  const base = wc.filter((c) => (c.unMember && c.independent !== false) || OBSERVERS.includes(c.cca2));
  const isoList = base.map((c) => '"' + c.cca2 + '"').join(' ');
  const rows = await sparql(`SELECT ?iso ?c WHERE { VALUES ?iso { ${isoList} } ?c wdt:P297 ?iso. }`);
  // A few ISO codes sit on more than one item (old states, redirects).
  // Keep the candidate that is a live item with a capital claim.
  const candEnt = await entities(rows.map((r) => r.c));
  const qidByIso = {};
  for (const r of rows) {
    const e = candEnt[r.c];
    if (!e || e.missing !== undefined || e.id !== r.c) continue;
    const hasCap = e.claims && e.claims.P36 && !(e.claims.P576);
    if (!qidByIso[r.iso] || hasCap) qidByIso[r.iso] = r.c;
  }
  const countryEnt = candEnt;
  const capitalIds = [];
  for (const q of Object.values(qidByIso)) capitalIds.push(...qidValues(countryEnt[q], 'P36'));
  const capEnt = await entities(capitalIds);

  const byCca3 = Object.fromEntries(wc.map((c) => [c.cca3, c]));
  const warnings = [];
  const countries = base.map((c) => {
    const qid = qidByIso[c.cca2];
    const ent = countryEnt[qid];
    if (!ent) warnings.push('No Wikidata item for ' + c.cca2);
    const name = labels(ent);
    name.en = c.name.common;
    const pop = latestQuantity(ent, 'P1082');

    // Capitals: world-countries gives the English list; Wikidata gives the translations.
    const wdCaps = qidValues(ent, 'P36').map((id) => ({ id, name: labels(capEnt[id]), coords: capEnt[id] }));
    const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/^city of /, '').replace(/[^a-z]/g, '');
    let capitals = (c.capital || []).map((en) => {
      const m = wdCaps.find((w) => w.name.en && (norm(w.name.en).includes(norm(en)) || norm(en).includes(norm(w.name.en))));
      return m ? { qid: m.id, name: m.name } : null;
    }).filter(Boolean);
    if (!capitals.length && wdCaps.length) {
      // No spelling match: trust Wikidata's current capital and report it for review.
      if (!wdCaps[0].name.en && c.capital && c.capital[0]) wdCaps[0].name.en = c.capital[0];
      capitals = [{ qid: wdCaps[0].id, name: wdCaps[0].name }];
      warnings.push(`${c.name.common}: capital "${(c.capital || []).join(', ')}" replaced by Wikidata's "${wdCaps[0].name.en}"`);
    }
    if (!capitals.length) warnings.push(`${c.name.common}: no capital found`);

    return {
      iso2: c.cca2,
      iso3: c.cca3,
      qid,
      slug: slugify(c.name.common),
      name,
      official: c.name.official,
      capitals,
      continent: continentOf(c),
      subregion: c.subregion,
      area: c.area,
      population: pop ? { value: pop.value, year: pop.year } : null,
      landlocked: c.landlocked,
      borders: (c.borders || []).map((b) => byCca3[b] && byCca3[b].cca2).filter(Boolean),
      languages: Object.values(c.languages || {}),
      currencies: Object.entries(c.currencies || {}).map(([code, v]) => ({ code, name: v.name, symbol: v.symbol })),
      latlng: c.latlng,
      unMember: !!c.unMember,
    };
  });

  for (const c of countries) for (const l of Object.keys(c.name)) if (!c.name[l]) warnings.push(`${c.name.en}: missing ${l} name`);
  fs.writeFileSync(OUT, JSON.stringify(countries, null, 1));
  console.log(`Wrote ${countries.length} countries to data/countries.json`);
  if (warnings.length) console.log('Warnings:\n  ' + warnings.join('\n  '));
})();
