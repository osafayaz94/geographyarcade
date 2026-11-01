// Keeps last month's province data for a country whose fresh download failed (a source down for a day,
// as happened for Singapore on 1 November 2026), so one country can't block the whole monthly update.
// Runs after stabilize.js and before guard.js: node scripts/keep-missing.js <folder with last month's data/*.json>
// A country taken out on purpose (`skip` in data/subdivision-overrides.js) stays out. A country is kept
// only when its map shapes (data/geo/adm1-<ISO3>.json, restored from the cache) are still there;
// otherwise the guard stops the update as before.
const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2];
if (!baseDir) throw new Error('usage: node scripts/keep-missing.js <baseline folder>');
const DATA = path.join(__dirname, '..', 'data');
const read = (dir, f) => (fs.existsSync(path.join(dir, f)) ? JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) : null);
const oldS = read(baseDir, 'subdivisions.json') || {};
const newS = read(DATA, 'subdivisions.json') || {};
const overrides = require('../data/subdivision-overrides');
const iso3Of = Object.fromEntries((read(DATA, 'countries.json') || []).map((c) => [c.iso2, c.iso3]));
const kept = [];
for (const iso2 of Object.keys(oldS)) {
  if (newS[iso2]) continue;
  const iso3 = iso3Of[iso2];
  if (overrides[iso3] && overrides[iso3].skip) continue;
  if (!iso3 || !fs.existsSync(path.join(DATA, 'geo', `adm1-${iso3}.json`))) continue;
  newS[iso2] = oldS[iso2];
  kept.push(iso2);
}
if (kept.length) {
  fs.writeFileSync(path.join(DATA, 'subdivisions.json'), JSON.stringify(newS, null, 1));
  console.log(`Province data kept from last month (fresh download failed): ${kept.join(', ')}`);
} else console.log('No province data missing.');
