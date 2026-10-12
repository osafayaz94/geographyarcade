// Population for every country from the World Bank (SP.POP.TOTL), the latest year it has, so all
// countries compare like with like (Wikidata's figures range over many years: India's was from
// 2020 while China's was from 2025, which put China first in the "most populous" list).
// Writes data/population.json: { ISO3: { value, year } }. Countries the World Bank doesn't cover
// (Vatican City) keep their Wikidata figure. Run: node scripts/fetch-population.js
const fs = require('fs');
const path = require('path');

(async () => {
  const r = await fetch('https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&mrnev=1&per_page=400');
  if (!r.ok) throw new Error('World Bank API: HTTP ' + r.status);
  const [, rows] = await r.json();
  const out = {};
  for (const x of rows || []) if (x.value && /^[A-Z]{3}$/.test(x.countryiso3code)) out[x.countryiso3code] = { value: x.value, year: Number(x.date) };
  const countries = require('../data/countries.json');
  const missing = countries.filter((c) => !out[c.iso3]).map((c) => c.iso3);
  const years = {};
  for (const c of countries) if (out[c.iso3]) years[out[c.iso3].year] = (years[out[c.iso3].year] || 0) + 1;
  if (Object.keys(out).length < 150) throw new Error('World Bank returned too few countries: ' + Object.keys(out).length);
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'population.json'), JSON.stringify(out, null, 1));
  console.log(`World Bank population: ${countries.length - missing.length} of ${countries.length} countries, years ${JSON.stringify(years)}; keeping Wikidata for: ${missing.join(' ') || 'none'}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
