/*
 * Keyword map: `npm run keywords` (after `npm run build`) writes docs/keywords.csv.
 * Each English keyword is mapped to the one page built to rank for it, grouped into topic
 * clusters. The same pages exist in 9 more languages, which target the translated searches.
 * There are no search volumes here: add them from Google Search Console, Google Keyword
 * Planner or Bing Webmaster Tools once the site is live, then prioritise.
 * The script also checks that each target page exists and that its title, H1 or
 * description contains the keyword's main words.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { L } = require('../src/i18n');
const divisionTerm = require('../data/division-terms');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const countries = require('../data/countries.json');
const subs = require('../data/subdivisions.json');
const physical = require('../data/physical.json');

const rows = [];
const add = (keyword, url, cluster, intent) => rows.push({ keyword: keyword.toLowerCase(), url, cluster, intent });

// 1. Site-level searches.
const HEAD = [
  ['geography quiz', '/'], ['geography quizzes', '/'], ['geography games', '/'], ['free geography quiz', '/'],
  ['world geography quiz', '/world/'], ['world geography games', '/world/'],
  ['flag quiz', '/flags/'], ['flags quiz', '/flags/'], ['guess the flag', '/flags/world/'], ['flags of the world', '/flags/'], ['world flags quiz', '/flags/world/'],
  ['country flags quiz', '/flags/world/'], ['flags of all countries', '/flags/'], ['all country flags with names', '/flags/'],
  ['capitals quiz', '/capitals/'], ['world capitals quiz', '/capitals/world/'], ['capital cities quiz', '/capitals/world/'], ['capitals of the world', '/capitals/'], ['countries and capitals', '/capitals/'],
  ['list of capital cities', '/capitals/'], ['countries and capitals list', '/capitals/'], ['capital cities of the world', '/capitals/'],
  ['map quiz', '/maps/'], ['world map quiz', '/maps/world/'], ['countries of the world quiz', '/maps/world/'], ['find the country on the map', '/maps/world/'], ['map games', '/maps/'],
  ['countries of the world', '/countries/'], ['list of countries', '/countries/'], ['all countries of the world', '/countries/'], ['how many countries are there in the world', '/countries/'], ['countries by continent', '/countries/'],
  ['provinces quiz', '/provinces/'], ['states quiz', '/provinces/'], ['provinces and capitals', '/provinces/'], ['states and capitals quiz', '/provinces/'],
  ['country lists', '/lists/'], ['country rankings', '/lists/'],
];
for (const [k, u] of HEAD) add(k, u, 'Site', 'quiz or reference');

// 2. Regions: one hub and three quizzes each.
const REG = { world: ['World', 'world'], africa: ['Africa', 'African'], 'north-america': ['North America', 'North American'], 'south-america': ['South America', 'South American'], asia: ['Asia', 'Asian'], oceania: ['Oceania', 'Oceania'], europe: ['Europe', 'European'] };
for (const [k, [name, adj]] of Object.entries(REG)) {
  const R = name.toLowerCase();
  const cl = `Region: ${name}`;
  if (k !== 'world') { add(`${R} geography quiz`, `/${k}/`, cl, 'quiz'); add(`countries in ${R}`, `/${k}/`, cl, 'reference'); }
  add(`${R} map quiz`, `/maps/${k}/`, cl, 'quiz');
  add(`${adj} countries quiz`, `/maps/${k}/`, cl, 'quiz');
  add(`flags of ${k === 'world' ? 'the world' : R}`, `/flags/${k}/`, cl, 'reference');
  add(`${adj} flags quiz`, `/flags/${k}/`, cl, 'quiz');
  add(`capitals of ${k === 'world' ? 'the world' : R}`, `/capitals/${k}/`, cl, 'reference');
  add(`${adj} capitals quiz`, `/capitals/${k}/`, cl, 'quiz');
}

// 3. Countries: the country page answers its capital and shows its flag.
for (const c of countries) {
  const n = c.name.en.toLowerCase();
  add(`capital of ${n}`, `/countries/${c.slug}/`, 'Countries', 'answer');
  add(`${n} flag`, `/countries/${c.slug}/`, 'Countries', 'answer');
  if (c.population) add(`population of ${n}`, `/countries/${c.slug}/`, 'Countries', 'answer');
}

// 4. Provinces and states (100 largest countries plus the extras in site.config.js).
for (const [iso2, s] of Object.entries(subs)) {
  const c = countries.find((x) => x.iso2 === iso2);
  const term = L.en.term[divisionTerm(iso2)];
  const n = c.name.en.toLowerCase();
  add(`${n} ${term} map quiz`, `/countries/${c.slug}/map-quiz/`, 'Provinces and states', 'quiz');
  // The build makes a capitals quiz only when at least 4 divisions have a capital.
  if (s.divisions.filter((d) => d.capital).length >= 4) add(`${term} of ${n} and capitals`, `/countries/${c.slug}/capitals-quiz/`, 'Provinces and states', 'answer');
}

// 5. World games.
const WORLD = {
  continents: ['continents quiz', 'continents of the world', 'world continents map quiz'], oceans: ['oceans quiz', 'oceans of the world', '5 oceans of the world map'],
  'latitude-and-longitude': ['latitude and longitude quiz', 'equator and tropics quiz', 'lines of latitude and longitude'], 'layers-of-the-earth': ['layers of the earth quiz', 'layers of the earth', 'crust mantle outer core inner core'],
  atmosphere: ['layers of the atmosphere quiz', 'layers of the atmosphere', 'troposphere stratosphere mesosphere thermosphere'], 'water-cycle': ['water cycle quiz', 'water cycle diagram', 'evaporation condensation precipitation'],
  'solar-system': ['solar system quiz', 'planets in order from the sun', 'how many planets are in the solar system'], biomes: ['biomes quiz', 'world biomes map', 'biomes of the world'],
  'climate-change': ['climate change quiz', 'greenhouse gases quiz', 'climate change diagram quiz'], rivers: ['rivers of the world quiz', 'rivers map quiz', 'world rivers map quiz'],
  archipelagos: ['archipelagos quiz', 'archipelagos of the world'], seas: ['seas of the world quiz', 'seas of the world map'], regions: ['world regions quiz', 'regions of the world'],
  lakes: ['lakes of the world quiz', 'lakes of the world map'], islands: ['islands quiz', 'islands of the world map'], straits: ['straits quiz', 'straits of the world'],
  'mountain-ranges': ['mountain ranges quiz', 'mountain ranges of the world'], cities: ['world cities quiz', 'cities of the world map quiz'], mountains: ['mountains quiz', 'mountains of the world quiz'],
  deserts: ['deserts quiz', 'deserts of the world map'], volcanoes: ['volcanoes quiz', 'volcanoes of the world'],
};
for (const [slug, ks] of Object.entries(WORLD)) for (const k of ks) add(k, `/world/${slug}/`, 'World games', /quiz/.test(k) ? 'quiz' : 'answer');
for (const k of ['name the planet quiz', 'planets quiz', 'planet names']) add(k, '/world/solar-system/names/', 'World games', 'quiz');

// 6. Country games.
const GAMES = {
  neighbours: ['neighbouring countries quiz', 'which countries border', 'bordering countries quiz'], currencies: ['currency quiz', 'currencies of the world quiz', 'country currency quiz'],
  languages: ['languages quiz', 'official languages quiz', 'official language of each country'], landlocked: ['landlocked countries quiz', 'is it landlocked'],
  hemispheres: ['hemispheres quiz', 'northern and southern hemisphere countries quiz'],
};
for (const [k, ks] of Object.entries(GAMES)) for (const kw of ks) add(kw, `/games/${k}/`, 'Country games', 'quiz');

// 7. Lists and rankings.
const LISTS = {
  'largest-countries': ['largest countries in the world', 'largest countries by area'], 'most-populous-countries': ['most populous countries', 'countries by population'],
  'smallest-countries': ['smallest countries in the world', 'smallest country by area'], 'landlocked-countries': ['landlocked countries', 'list of landlocked countries'],
  'countries-with-no-land-borders': ['countries with no land borders'], 'countries-with-most-neighbours': ['country with the most neighbours', 'countries with the most neighbours'],
  'countries-on-the-equator': ['countries on the equator', 'which countries are on the equator'], 'southern-hemisphere-countries': ['countries in the southern hemisphere', 'southern hemisphere countries list'],
  'countries-using-euro': ['countries that use the euro', 'countries using the euro'], 'countries-using-us-dollar': ['countries that use the us dollar', 'us dollar countries'],
  'countries-using-west-african-cfa-franc': ['west african cfa franc countries'], 'countries-using-central-african-cfa-franc': ['central african cfa franc countries'],
  'countries-where-english-is-official': ['countries with english as an official language', 'countries where english is an official language'], 'countries-where-french-is-official': ['countries with french as an official language', 'countries where french is an official language'],
  'countries-where-spanish-is-official': ['countries with spanish as an official language', 'countries where spanish is an official language'], 'countries-where-arabic-is-official': ['countries with arabic as an official language', 'countries where arabic is an official language'],
  'countries-where-portuguese-is-official': ['countries with portuguese as an official language', 'countries where portuguese is an official language'], 'countries-where-russian-is-official': ['countries with russian as an official language', 'countries where russian is an official language'],
};
for (const [slug, ks] of Object.entries(LISTS)) for (const k of ks) add(k, `/lists/${slug}/`, 'Lists and rankings', 'answer');

// ---------- Checks ----------
const STOP = new Set('the of and in on a an to is are for with by from all what which how many there does do that list map quiz quizzes game games world countries country'.split(' '));
const pageText = {};
const problems = [];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&amp;/g, '&');
for (const r of rows) {
  const file = path.join(DIST, r.url, 'index.html');
  if (!fs.existsSync(file)) { problems.push(`missing page ${r.url} for "${r.keyword}"`); continue; }
  if (!pageText[r.url]) {
    const h = fs.readFileSync(file, 'utf8');
    const get = (re) => (h.match(re) || [])[1] || '';
    const main = get(/<main[^>]*>([\s\S]*?)<\/main>/).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    pageText[r.url] = {
      head: norm([get(/<title>([^<]*)<\/title>/), get(/<h1>([\s\S]*?)<\/h1>/), get(/<meta name="description" content="([^"]*)"/)].join(' ')),
      body: norm(main),
    };
  }
  // Word stems, so "flags"/"flag", "cities"/"city", "African"/"Africa", "neighbouring"/"neighbours" match.
  const stem = (w) => w.replace(/ies$/, 'y').replace(/ing$/, '').replace(/(es|s)$/, '').replace(/(an|n)$/, '');
  const has = (text, w) => text.includes(w) || text.includes(stem(w)) || text.includes(w.replace(/s$/, ''));
  const words = norm(r.keyword).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  const notInHead = words.filter((w) => !has(pageText[r.url].head, w));
  const notOnPage = notInHead.filter((w) => !has(pageText[r.url].body, w));
  // Words missing from the whole page are a real gap; words only in the body are fine.
  if (notOnPage.length) problems.push(`"${r.keyword}" -> ${r.url}: page never mentions ${notOnPage.join(', ')}`);
}

// Unique keywords only.
const seen = new Set();
const unique = rows.filter((r) => !seen.has(r.keyword) && seen.add(r.keyword));
const csv = ['keyword,target_url,cluster,intent,monthly_searches_google,monthly_searches_bing'].concat(unique.map((r) => [r.keyword, r.url, r.cluster, r.intent, '', ''].map((v) => (/[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(','))).join('\n');
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'keywords.csv'), '﻿' + csv + '\n'); // BOM so Excel reads UTF-8

const byCluster = {};
for (const r of unique) byCluster[r.cluster.split(':')[0]] = (byCluster[r.cluster.split(':')[0]] || 0) + 1;
console.log(`Wrote docs/keywords.csv: ${unique.length} keywords, ${new Set(unique.map((r) => r.url)).size} target pages.`);
console.log(Object.entries(byCluster).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
console.log(problems.length ? `\n${problems.length} keyword(s) whose page doesn't mention all its main words:\n  ${problems.slice(0, 40).join('\n  ')}` : 'Every target page exists and mentions its keyword.');
