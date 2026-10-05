// Coordinates of every national capital (Wikidata P625), for the outline printables of countries
// without a province map: data/capital-coords.json  { "<capital QID>": [lon, lat] }.
const fs = require('fs');
const path = require('path');
const { sparql } = require('./wikidata');

(async () => {
  const countries = require('../data/countries.json');
  const qids = [...new Set(countries.flatMap((c) => c.capitals.map((k) => k.qid)).filter(Boolean))];
  const out = {};
  for (let i = 0; i < qids.length; i += 100) {
    const rows = await sparql(`SELECT ?i ?c WHERE { VALUES ?i { ${qids.slice(i, i + 100).map((q) => 'wd:' + q).join(' ')} } ?i wdt:P625 ?c. }`);
    for (const r of rows) {
      const m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.c);
      if (m && !out[r.i]) out[r.i] = [Number(m[1]), Number(m[2])];
    }
  }
  const missing = qids.filter((q) => !out[q]);
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'capital-coords.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(`Capital coordinates: ${Object.keys(out).length} of ${qids.length}${missing.length ? `; missing ${missing.join(', ')}` : ''}`);
})();
