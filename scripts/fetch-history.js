// Names (17 languages) and Wikipedia links of the civilizations in data/history.js, from Wikidata.
// Writes data/history.json. The areas themselves are fixed data (data/history-areas.json).
// Run: node scripts/fetch-history.js (part of `npm run fetch`).
const fs = require('fs');
const path = require('path');
const { sparql } = require('./wikidata');
const CIVS = require('../data/history');
const LANGS = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'de', 'bn', 'pt', 'ru', 'ur', 'id', 'it', 'ja', 'ko', 'pl', 'nl'];
const clean = (s) => s.replace(/\s*[–—]\s*/g, '-'); // house style: no dashes in page copy

(async () => {
  const ids = CIVS.map((c) => 'wd:' + c.qid).join(' ');
  const labels = await sparql(`SELECT ?i ?l ?lang WHERE { VALUES ?i { ${ids} } ?i rdfs:label ?l. BIND(LANG(?l) AS ?lang) FILTER(?lang IN (${LANGS.map((l) => `"${l}"`).join(',')}, "zh-hans")) }`);
  const links = await sparql(`SELECT ?i ?s WHERE { VALUES ?i { ${ids} } VALUES ?site { ${LANGS.map((l) => `<https://${l}.wikipedia.org/>`).join(' ')} } ?s schema:about ?i; schema:isPartOf ?site. }`);
  const out = {};
  for (const c of CIVS) {
    const name = {};
    for (const r of labels) {
      if (r.i !== c.qid) continue;
      const l = r.lang === 'zh-hans' ? 'zh' : r.lang;
      if (!name[l] || r.lang === 'zh-hans') name[l] = clean(r.l);
    }
    const wiki = {};
    for (const r of links) { if (r.i === c.qid) { const m = String(r.s).match(/^https:\/\/([a-z]+)\.wikipedia\.org\//); if (m) wiki[m[1]] = r.s; } }
    out[c.key] = { name: { ...name, ...(c.name || {}) }, wiki };
    const miss = LANGS.filter((l) => !out[c.key].name[l]);
    console.log(`${c.key}: ${out[c.key].name.en} | names ${17 - miss.length}/17${miss.length ? ' missing ' + miss.join(',') : ''} | wiki ${Object.keys(wiki).length}`);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'history.json'), JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), civs: out }, null, 1));
})().catch((e) => { console.error(e.message); process.exit(1); });
