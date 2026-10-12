// Countries whose capital list on Wikidata (P36) misses a capital that common sources name, or puts
// them in an order that doesn't match common use. The first capital is the quiz answer.
// Writes data/capital-fixes.json: { ISO2: [{ qid, name: {lang: label} }], _coords: { QID: [lon, lat] } }.
// Run: node scripts/fetch-capital-fixes.js (part of `npm run fetch`).
const fs = require('fs');
const path = require('path');
const { sparql } = require('./wikidata');

const FIXES = {
  LK: ['Q41963', 'Q35381'], // Sri Jayawardenepura Kotte (official), Colombo (executive and commercial)
  BO: ['Q2907', 'Q1491'], // Sucre (constitutional), La Paz (seat of government)
  SZ: ['Q3904', 'Q101418'], // Mbabane (administrative), Lobamba (royal and legislative)
  GQ: ['Q3818', 'Q1140136'], // Malabo (seat of government), Ciudad de la Paz (designated capital)
};
const LANGS = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'de', 'bn', 'pt', 'ru', 'ur', 'id', 'it', 'ja', 'ko', 'pl', 'nl'];

(async () => {
  const qids = [...new Set(Object.values(FIXES).flat())];
  const rows = await sparql(`SELECT ?i ?l ?lang ?coord WHERE { VALUES ?i { ${qids.map((q) => 'wd:' + q).join(' ')} }
    OPTIONAL { ?i wdt:P625 ?coord. } ?i rdfs:label ?l . BIND(LANG(?l) AS ?lang) FILTER(?lang IN (${LANGS.map((l) => `"${l}"`).join(',')}, "zh-hans")) }`);
  const names = {}, coords = {};
  for (const r of rows) {
    const l = r.lang === 'zh-hans' ? 'zh' : r.lang;
    names[r.i] = names[r.i] || {};
    if (!names[r.i][l] || r.lang === 'zh-hans') names[r.i][l] = r.l;
    const m = r.coord && /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.coord);
    if (m) coords[r.i] = [Number(m[1]), Number(m[2])]; // [lon, lat], like data/capital-coords.json
  }
  const out = { _coords: coords };
  for (const [iso2, list] of Object.entries(FIXES)) {
    out[iso2] = list.map((q) => {
      if (!names[q] || !names[q].en) throw new Error(`${iso2}: no English label for ${q}`);
      return { qid: q, name: names[q] };
    });
    console.log(iso2, out[iso2].map((k) => `${k.name.en} (${k.qid}, ${Object.keys(k.name).length} langs, ${coords[k.qid] ? 'coords' : 'NO coords'})`).join(' | '));
  }
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'capital-fixes.json'), JSON.stringify(out, null, 1));
})();
