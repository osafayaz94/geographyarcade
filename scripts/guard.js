// Safety check for the automatic monthly update: compares freshly fetched data with the previous
// month's copy and fails (so nothing is published) when something looks broken rather than
// merely updated: countries or divisions disappearing, division counts jumping, lists emptying.
// Usage: node scripts/guard.js <folder with last month's data/*.json>
const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2];
if (!baseDir) throw new Error('usage: node scripts/guard.js <baseline folder>');
const DATA = path.join(__dirname, '..', 'data');
const load = (dir, f) => (fs.existsSync(path.join(dir, f)) ? JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) : null);
// Without last month's files every comparison below would pass vacuously.
for (const f of ['countries.json', 'subdivisions.json', 'physical.json']) {
  if (!fs.existsSync(path.join(baseDir, f))) throw new Error(`baseline ${path.join(baseDir, f)} not found`);
}
const problems = [];
const notes = [];

// Countries: all 195 present, each with a name and capital.
const oldC = load(baseDir, 'countries.json') || [];
const newC = load(DATA, 'countries.json') || [];
if (newC.length !== 195) problems.push(`countries.json has ${newC.length} countries, expected 195`);
const oldCap = new Set(oldC.filter((c) => c.capitals && c.capitals.length).map((c) => c.iso2));
for (const c of newC) {
  if (!c.name || !c.name.en) problems.push(`${c.iso2}: no English name`);
  if (oldCap.has(c.iso2) && !(c.capitals && c.capitals.length)) problems.push(`${c.iso2}: capital disappeared`);
}
const popCount = (list) => list.filter((c) => c.population && c.population.value).length;
if (popCount(newC) < popCount(oldC) - 3) problems.push(`population missing for ${popCount(oldC) - popCount(newC)} more countries than last month`);

// Provinces: no country dropped; division counts may change (reforms) but not wildly.
const oldS = load(baseDir, 'subdivisions.json') || {};
const newS = load(DATA, 'subdivisions.json') || {};
for (const iso2 of Object.keys(oldS)) {
  if (!newS[iso2]) { problems.push(`${iso2}: province data disappeared`); continue; }
  const a = oldS[iso2].divisions.length;
  const b = newS[iso2].divisions.length;
  if (b !== a) (Math.abs(b - a) > Math.max(3, a * 0.3) ? problems : notes).push(`${iso2}: divisions ${a} -> ${b}`);
  const caps = (s) => s.divisions.filter((d) => d.capital).length;
  if (caps(newS[iso2]) < caps(oldS[iso2]) * 0.7) problems.push(`${iso2}: divisions with a capital fell from ${caps(oldS[iso2])} to ${caps(newS[iso2])}`);
}
for (const iso2 of Object.keys(newS)) if (!oldS[iso2]) notes.push(`${iso2}: province data added`);

// World games, extra maps and division flags: lists may grow, but not shrink much.
const shrink = (label, a, b) => { if (b < a * 0.9) problems.push(`${label}: ${a} -> ${b}`); else if (a !== b) notes.push(`${label}: ${a} -> ${b}`); };
const oldP = load(baseDir, 'physical.json') || {};
const newP = load(DATA, 'physical.json') || {};
for (const k of Object.keys(oldP)) shrink(`physical ${k}`, (oldP[k].items || []).length, ((newP[k] || {}).items || []).length);
const oldX = load(baseDir, 'extra-maps.json') || {};
const newX = load(DATA, 'extra-maps.json') || {};
for (const k of Object.keys(oldX)) shrink(`extra map ${k}`, oldX[k].divisions.length, ((newX[k] || {}).divisions || []).length);
const oldF = load(baseDir, 'division-flags.json') || {};
const newF = load(DATA, 'division-flags.json') || {};
for (const k of Object.keys(oldF)) if (!newF[k]) notes.push(`flags ${k}: not refreshed this month (kept last month's)`);

if (notes.length) console.log('Changes since last month:\n  ' + notes.join('\n  '));
if (problems.length) {
  console.error(`\nNot publishing: ${problems.length} problem(s) with the new data:\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log('Data check passed.');
