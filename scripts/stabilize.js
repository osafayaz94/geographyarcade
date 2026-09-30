// Protects the site from glitches and vandalism in freshly fetched Wikidata names.
// Runs after `npm run fetch`, before the guard, in the monthly update:
//   node scripts/stabilize.js <folder with last month's data/*.json>
//
// For every name (country, capital, province and province capital, in every language):
//   - a value that became empty keeps last month's value;
//   - a changed value is held back for a month: it is used only if the next monthly run
//     fetches the same new value again (bad edits are usually reverted within days).
// Held-back changes are kept in data/pending-names.json, committed with the data.
// Numbers (population, area) are taken as fetched; the guard checks them.
const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2];
if (!baseDir) throw new Error('usage: node scripts/stabilize.js <baseline folder>');
const DATA = path.join(__dirname, '..', 'data');
const read = (dir, f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const PENDING_FILE = path.join(DATA, 'pending-names.json');
const pending = fs.existsSync(PENDING_FILE) ? JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8')) : {};
const stillPending = {};
const log = { healed: [], held: [], accepted: [] };

// oldNames / newNames: { lang: value }. Returns the names to publish.
function settle(key, oldNames, newNames) {
  if (!oldNames) return newNames; // new item: nothing to compare with
  if (!newNames) return oldNames;
  const out = { ...newNames };
  for (const lang of new Set([...Object.keys(oldNames), ...Object.keys(newNames)])) {
    const was = oldNames[lang];
    const now = newNames[lang];
    const k = `${key}|${lang}`;
    if (!was) continue; // a name newly added in this language: take it
    if (!now) { out[lang] = was; log.healed.push(`${k}: kept "${was}" (fetched empty)`); continue; }
    if (now === was) continue;
    if (pending[k] === now) { log.accepted.push(`${k}: "${was}" -> "${now}"`); continue; }
    out[lang] = was;
    stillPending[k] = now;
    log.held.push(`${k}: "${was}" -> "${now}" (held until next month)`);
  }
  return out;
}

// Countries: names and capitals (matched by Wikidata id).
const oldC = Object.fromEntries(read(baseDir, 'countries.json').map((c) => [c.iso2, c]));
const countries = read(DATA, 'countries.json');
for (const c of countries) {
  const o = oldC[c.iso2];
  if (!o) continue;
  c.name = settle(`country ${c.iso2} name`, o.name, c.name);
  const oldCaps = Object.fromEntries((o.capitals || []).map((k) => [k.qid, k]));
  for (const k of c.capitals || []) if (oldCaps[k.qid]) k.name = settle(`country ${c.iso2} capital ${k.qid}`, oldCaps[k.qid].name, k.name);
  // A capital that vanished from the fetch (not replaced by a new one) is kept.
  if (!(c.capitals && c.capitals.length) && o.capitals && o.capitals.length) {
    c.capitals = o.capitals;
    log.healed.push(`country ${c.iso2} capitals: kept last month's (fetched none)`);
  }
}
fs.writeFileSync(path.join(DATA, 'countries.json'), JSON.stringify(countries, null, 1));

// Provinces: names and capitals (matched by division id).
const oldS = read(baseDir, 'subdivisions.json');
const subs = read(DATA, 'subdivisions.json');
for (const [iso2, s] of Object.entries(subs)) {
  if (!oldS[iso2]) continue;
  const oldD = Object.fromEntries(oldS[iso2].divisions.map((d) => [d.id, d]));
  for (const d of s.divisions) {
    const o = oldD[d.id];
    if (!o) continue;
    d.name = settle(`${iso2} ${d.id} name`, o.name, d.name);
    if (o.capital && !d.capital) { d.capital = o.capital; log.healed.push(`${iso2} ${d.id} capital: kept last month's (fetched none)`); }
    else if (o.capital && d.capital && o.capitalQid === d.capitalQid) d.capital = settle(`${iso2} ${d.id} capital`, o.capital, d.capital);
  }
}
fs.writeFileSync(path.join(DATA, 'subdivisions.json'), JSON.stringify(subs, null, 1));

fs.writeFileSync(PENDING_FILE, JSON.stringify(stillPending, null, 1) + '\n');
for (const [label, list] of Object.entries(log)) if (list.length) console.log(`${label} (${list.length}):\n  ${list.join('\n  ')}`);
console.log(`Names checked: ${log.healed.length} kept from last month, ${log.held.length} held back, ${log.accepted.length} accepted after a month.`);
