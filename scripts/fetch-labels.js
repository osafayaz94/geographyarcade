// Adds names in extra site languages (Urdu, Russian, Portuguese, German) to data/countries.json and
// data/subdivisions.json. Runs after the other fetch scripts and asks Wikidata for labels
// only, which is far quicker than re-downloading every entity.
const fs = require('fs');
const path = require('path');
const { cachedFetch } = require('./wikidata');

const EXTRA = { ur: ['ur'], ru: ['ru'], pt: ['pt-br', 'pt'], de: ['de'] };
const DATA = path.join(__dirname, '..', 'data');
const cFile = path.join(DATA, 'countries.json');
const sFile = path.join(DATA, 'subdivisions.json');
const countries = JSON.parse(fs.readFileSync(cFile, 'utf8'));
const subs = JSON.parse(fs.readFileSync(sFile, 'utf8'));

(async () => {
  const ids = new Set();
  for (const c of countries) { ids.add(c.qid); for (const k of c.capitals) ids.add(k.qid); }
  for (const s of Object.values(subs)) for (const d of s.divisions) { ids.add(d.qid); ids.add(d.capitalQid); }
  const list = [...ids].filter(Boolean);
  const langs = Object.values(EXTRA).flat().join('|');
  const lab = {};
  for (let i = 0; i < list.length; i += 50) {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=${langs}&ids=${list.slice(i, i + 50).join('|')}`;
    const data = await cachedFetch(url);
    for (const [id, e] of Object.entries(data.entities || {})) lab[id] = e.labels || {};
  }
  const pick = (qid, l) => { const e = lab[qid]; if (!e) return null; for (const k of EXTRA[l]) if (e[k]) return e[k].value; return null; };
  const fill = (obj, qid) => { if (!obj) return; for (const l of Object.keys(EXTRA)) { const v = pick(qid, l); if (v && !obj[l]) obj[l] = v; } };

  const missing = [];
  for (const c of countries) {
    fill(c.name, c.qid);
    for (const k of c.capitals) fill(k.name, k.qid);
    for (const l of Object.keys(EXTRA)) if (!c.name[l]) missing.push(`${c.name.en} (${l})`);
  }
  let divMissing = 0;
  for (const s of Object.values(subs)) for (const d of s.divisions) {
    fill(d.name, d.qid);
    fill(d.capital, d.capitalQid);
    for (const l of Object.keys(EXTRA)) if (!d.name[l]) divMissing++;
  }
  fs.writeFileSync(cFile, JSON.stringify(countries, null, 1));
  fs.writeFileSync(sFile, JSON.stringify(subs, null, 1));
  console.log(`Labels for ${list.length} items. Countries missing a name: ${missing.join(', ') || 'none'}. Division names falling back to English: ${divMissing}.`);
})();
