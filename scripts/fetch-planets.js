// Builds data/planets.json: the 8 planets with names in every site language (Wikidata labels)
// and fixed facts. Diameters are equatorial, from the NASA Planetary Fact Sheet
// (https://nssdc.gsfc.nasa.gov/planetary/factsheet/).
const fs = require('fs');
const path = require('path');
const { cachedFetch } = require('./wikidata');

const PLANETS = [
  { id: 'mercury', qid: 'Q308', type: 'rocky', diameter: 4879 },
  { id: 'venus', qid: 'Q313', type: 'rocky', diameter: 12104 },
  { id: 'earth', qid: 'Q2', type: 'rocky', diameter: 12756 },
  { id: 'mars', qid: 'Q111', type: 'rocky', diameter: 6792 },
  { id: 'jupiter', qid: 'Q319', type: 'gas', diameter: 142984 },
  { id: 'saturn', qid: 'Q193', type: 'gas', diameter: 120536 },
  { id: 'uranus', qid: 'Q324', type: 'ice', diameter: 51118 },
  { id: 'neptune', qid: 'Q332', type: 'ice', diameter: 49528 },
];
// Labels that don't match the style of the rest of their language (Hindi adds "ग्रह" only to Mars).
const FIX = { mars: { hi: 'मंगल' } };
// Site language -> Wikidata label languages, in order of preference.
const LANG = { en: ['en'], zh: ['zh-hans', 'zh-cn', 'zh'], hi: ['hi'], es: ['es'], ar: ['ar'], fr: ['fr'], bn: ['bn'], pt: ['pt-br', 'pt'], ru: ['ru'], ur: ['ur'], de: ['de'] };

(async () => {
  const langs = [...new Set(Object.values(LANG).flat())].join('|');
  const data = await cachedFetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=${langs}&ids=${PLANETS.map((p) => p.qid).join('|')}`);
  const missing = [];
  const out = PLANETS.map((p, i) => {
    const labels = data.entities[p.qid].labels;
    const name = {};
    for (const [l, keys] of Object.entries(LANG)) {
      const k = keys.find((x) => labels[x]);
      name[l] = k ? labels[k].value : null;
      if (!name[l]) missing.push(`${p.id} (${l})`);
    }
    Object.assign(name, FIX[p.id] || {});
    return { ...p, order: i + 1, name };
  });
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'planets.json'), JSON.stringify(out, null, 1));
  console.log(out.map((p) => Object.values(p.name).join(' / ')).join('\n'));
  if (missing.length) console.log('Missing: ' + missing.join(', '));
})();
