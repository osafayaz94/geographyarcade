// After `fetch-subdivisions --only=...` (which fetches names in 7 languages): put back every language
// from a backup of data/subdivisions.json, and fetch all 17 languages (SPARQL) for divisions and
// capitals the backup didn't have. Usage: node scripts/fill-division-names.js <backup.json> IN RU ...
const fs = require('fs');
const path = require('path');
const { sparql } = require('./wikidata');
const LANGS = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'de', 'bn', 'pt', 'ru', 'ur', 'id', 'it', 'ja', 'ko', 'pl', 'nl'];
const [backup, ...isos] = process.argv.slice(2);
const file = path.join(__dirname, '..', 'data', 'subdivisions.json');
const subs = JSON.parse(fs.readFileSync(file, 'utf8'));
const old = JSON.parse(fs.readFileSync(backup, 'utf8'));

(async () => {
  const need = new Set();
  for (const iso of isos) {
    const oldBy = Object.fromEntries(((old[iso] || {}).divisions || []).map((d) => [d.qid, d]));
    for (const d of subs[iso].divisions) {
      const o = oldBy[d.qid];
      if (o) {
        d.name = { ...d.name, ...o.name };
        if (d.capital && o.capital && d.capitalQid === o.capitalQid) d.capital = { ...d.capital, ...o.capital };
      }
      if (Object.keys(d.name).length < LANGS.length && d.qid) need.add(d.qid);
      if (d.capital && Object.keys(d.capital).length < LANGS.length && d.capitalQid) need.add(d.capitalQid);
    }
  }
  const lab = {};
  const ids = [...need];
  for (let i = 0; i < ids.length; i += 300) {
    const rows = await sparql(`SELECT ?i ?l ?lang WHERE { VALUES ?i { ${ids.slice(i, i + 300).map((q) => 'wd:' + q).join(' ')} } ?i rdfs:label ?l. BIND(LANG(?l) AS ?lang) FILTER(?lang IN (${LANGS.map((l) => `"${l}"`).join(',')}, "zh-hans")) }`);
    for (const r of rows) { const l = r.lang === 'zh-hans' ? 'zh' : r.lang; lab[r.i] = lab[r.i] || {}; if (!lab[r.i][l] || r.lang === 'zh-hans') lab[r.i][l] = r.l; }
  }
  const fill = (obj, q) => { if (obj && lab[q]) for (const l of LANGS) if (lab[q][l] && !obj[l]) obj[l] = lab[q][l]; };
  for (const iso of isos) for (const d of subs[iso].divisions) { fill(d.name, d.qid); fill(d.capital, d.capitalQid); }
  fs.writeFileSync(file, JSON.stringify(subs, null, 1));
  for (const iso of isos) {
    const short = subs[iso].divisions.filter((d) => Object.keys(d.name).length < LANGS.length).map((d) => `${d.name.en}(${Object.keys(d.name).length})`);
    console.log(`${iso}: ${subs[iso].divisions.length} divisions; fewer than ${LANGS.length} languages: ${short.join(', ') || 'none'}`);
  }
})();
