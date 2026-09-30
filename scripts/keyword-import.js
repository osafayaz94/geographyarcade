/*
 * Maps an exported keyword list (e.g. a competitor's organic keywords from Ahrefs or Semrush)
 * onto this site's pages: `npm run keyword-import` (after `npm run build`).
 *   docs/keyword-map.csv   every keyword with volume, language, status and target page
 *   docs/keyword-gaps.csv  relevant keywords with no matching page yet, largest first
 *   docs/keyword-ideas-map.csv  the keyword ideas list (data/keywords/*.xlsx, no volumes) mapped the same way
 * Every .csv export in data/keywords is read; a keyword in more than one keeps its largest volume.
 * Status: mapped | gap | other-language (a language the site doesn't have) | not-relevant.
 * Nothing here is pasted into pages: pages rank through their titles, headings and content,
 * which are tuned for the biggest clusters in build.js and src/i18n.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { L, LANGS } = require('../src/i18n');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const KW = path.join(ROOT, 'data', 'keywords');
const SRCS = process.argv[2] ? [process.argv[2]] : fs.readdirSync(KW).filter((x) => x.endsWith('.csv')).map((x) => path.join(KW, x));
const IDEAS = fs.readdirSync(KW).filter((x) => x.endsWith('.xlsx')).map((x) => path.join(KW, x));
const countries = require('../data/countries.json');
const subs = require('../data/subdivisions.json');
const wc = require('world-countries/countries.json');

// ---------- Read the export (UTF-16 or UTF-8, tab or comma separated) ----------
function readExport(file) {
  const buf = fs.readFileSync(file);
  const text = (buf[0] === 0xff && buf[1] === 0xfe ? buf.toString('utf16le') : buf.toString('utf8')).replace(/^﻿/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const sep = lines[0].includes('\t') ? '\t' : ',';
  const head = lines[0].split(sep).map((h) => h.replace(/^"|"$/g, '').toLowerCase());
  const col = (name) => head.findIndex((h) => h === name);
  const iK = col('keyword'), iV = col('volume'), iLoc = col('top location code');
  return lines.slice(1).map((l) => { const c = l.split(sep).map((x) => x.replace(/^"|"$/g, '')); return { k: c[iK], vol: Number(c[iV]) || 0, loc: c[iLoc] || '' }; }).filter((r) => r.k);
}
const merged = new Map();
for (const file of SRCS) for (const r of readExport(file)) {
  const key = r.k.toLowerCase().trim();
  const had = merged.get(key);
  if (!had || r.vol > had.vol) merged.set(key, r);
}
const rows = [...merged.values()];

// ---------- Helpers ----------
const fold = (s) => ` ${s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `;
const hasWord = (k, w) => k.includes(` ${w} `);
const anyWord = (k, list) => list.some((w) => hasWord(k, w) || (w.endsWith('*') && new RegExp(` ${w.slice(0, -1)}\\p{L}*`, 'u').test(k)));

// Language of a keyword: from its words first, then from where it is searched.
const LANG_WORDS = {
  es: ['de', 'del', 'los', 'las', 'y', 'mapa', 'mapas', 'banderas', 'bandera', 'paises', 'capitales', 'juego', 'juegos', 'provincias', 'mundo', 'espana', 'adivina', 'comunidades', 'rios', 'mudo', 'interactivo*'],
  fr: ['du', 'des', 'le', 'la', 'carte', 'cartes', 'drapeau', 'drapeaux', 'pays', 'capitale', 'capitales', 'jeu', 'jeux', 'monde', 'geographie', 'departements', 'regions', 'france', 'devine'],
  de: ['der', 'die', 'und', 'karte', 'landkarte', 'flaggen', 'flagge', 'lander', 'hauptstadt', 'hauptstadte', 'spiel', 'spiele', 'welt', 'deutschland', 'bundeslander', 'bundesland', 'europakarte', 'weltkarte', 'erdkunde', 'staaten', 'kontinente', 'lernen'],
  pt: ['bandeiras', 'bandeira', 'paises do', 'capitais', 'jogo', 'jogos', 'do mundo', 'estados do brasil', 'mapa do'],
  pl: ['kraje', 'panstwa', 'stolice', 'flagi', 'gra', 'swiata', 'europy', 'polski', 'wojewodztwa', 'mapa polski', 'afryki', 'azji', 'geografia quiz', 'panstw', 'gry'],
  nl: ['kaart', 'landen', 'vlaggen', 'hoofdsteden', 'wereld', 'spel', 'provincies', 'topografie', 'van', 'aardrijkskunde', 'oefenen', 'deelstaten', 'duitsland', 'klas', 'duitse', 'het'],
  it: ['bandiere', 'capitali', 'cartina', 'regioni', 'italia', 'gioco', 'giochi', 'mondo'],
  hr: ['zastave', 'zastava', 'svijeta', 'sveta', 'karta', 'drzave', 'drzava', 'azija', 'azije', 'afrike', 'evrope', 'europe drzave', 'kontinenti', 'glavni gradovi'],
};
const LOC_LANG = { US: 'en', GB: 'en', CA: 'en', AU: 'en', IN: 'en', PH: 'en', IE: 'en', NZ: 'en', ZA: 'en', NG: 'en', MY: 'en', SG: 'en', PK: 'en', KE: 'en', ES: 'es', AR: 'es', MX: 'es', PE: 'es', CO: 'es', CL: 'es', EC: 'es', GT: 'es', PR: 'es', VE: 'es', UY: 'es', BO: 'es', CR: 'es', DO: 'es', PY: 'es', SV: 'es', HN: 'es', NI: 'es', PA: 'es', FR: 'fr', DE: 'de', AT: 'de', PL: 'pl', NL: 'nl', BR: 'pt', PT: 'pt', IT: 'it', RU: 'ru' };
function langOf(r, k) {
  if (/[؀-ۿ]/.test(r.k)) return /[ٹڈڑںےگکھ]/.test(r.k) ? 'ur' : 'ar';
  if (/[Ѐ-ӿ]/.test(r.k)) return 'ru';
  if (/[一-鿿]/.test(r.k)) return 'zh';
  if (/[ঀ-৿]/.test(r.k)) return 'bn';
  if (/[ऀ-ॿ]/.test(r.k)) return 'hi';
  if (/[ąćęłńśźż]/i.test(r.k)) return 'pl';
  if (/[äöüß]/i.test(r.k)) return 'de';
  let best = null, n = 0;
  for (const [l, ws] of Object.entries(LANG_WORDS)) { const c = ws.filter((w) => k.includes(` ${w.replace('*', '')}`)).length; if (c > n) { n = c; best = l; } }
  return best || LOC_LANG[r.loc] || 'en';
}

// Countries: names in every site language, English adjectives ("german flag"), French adjectives.
// Spanish adjectives for the countries searched that way most often.
const ADJ = { AR: ['argentinas', 'argentinos'], ES: ['espanolas', 'espanoles'], MX: ['mexicanos'], CO: ['colombianos'], PE: ['peruanos'], CL: ['chilenos'] };
const countryNames = [];
for (const c of countries) {
  const w = wc.find((x) => x.cca2 === c.iso2) || {};
  const names = new Set([...Object.values(c.name).filter(Boolean), c.slug.replace(/-/g, ' '), ...(w.altSpellings || []).filter((a) => a.length > 3),
    w.demonyms && w.demonyms.eng && w.demonyms.eng.m, w.demonyms && w.demonyms.fra && w.demonyms.fra.m, w.demonyms && w.demonyms.fra && w.demonyms.fra.f].filter(Boolean));
  for (const n of [...names, ...(ADJ[c.iso2] || [])]) { const f = fold(n).trim(); if (f.length > 2) countryNames.push([f, c]); }
}
countryNames.sort((a, b) => b[0].length - a[0].length);
const findCountry = (k) => { const hit = countryNames.find(([n]) => k.includes(` ${n} `)); return hit ? hit[1] : null; };

// Continents in every language (adjectives included). "America" alone means both Americas.
const CONT = [
  ['north-america', ['north america', 'north american', 'america del norte', 'norteamerica', 'amerique du nord', 'nordamerika', 'america do norte', 'ameryka polnocna', 'noord amerika', 'central america', 'centroamerica', 'caribbean', 'caribe']],
  ['south-america', ['south america', 'south american', 'america del sur', 'sudamerica', 'suramerica', 'latinoamerica', 'amerique du sud', 'sudamerika', 'america do sul', 'ameryka poludniowa', 'zuid amerika']],
  ['africa', ['افريقيا', 'أفريقيا', 'africa', 'african', 'afrique', 'africain', 'africaine', 'afrika', 'afryka', 'afryki', 'africana', 'africanos']],
  ['asia', ['اسيا', 'آسيا', 'asia', 'asian', 'asie', 'asien', 'azja', 'azji', 'azie', 'asiatico', 'asiaticos']],
  ['europe', ['اوروبا', 'أوروبا', 'europaquiz', 'europe', 'european', 'europa', 'europeen', 'europeenne', 'europy', 'europeo', 'europeos', 'europese']],
  ['oceania', ['oceania', 'oceanie', 'ozeanien', 'oceanie', 'oceanië', 'australia and oceania', 'australien']],
  ['north-america', ['america', 'americas', 'amerique', 'amerika', 'ameryka']],
];
const findCont = (k) => { for (const [id, ws] of CONT) if (ws.some((w) => k.includes(` ${fold(w).trim()} `))) return id; return null; };

const T = {
  flag: ['flag', 'flags', 'flaggenquiz', 'flaggenraten', 'fahnen', 'flagquiz', 'flaggquiz', 'falgs', 'flagen', 'baderas', 'banderes', 'landerflaggen', 'bandera', 'banderas', 'drapeau', 'drapeaux', 'flagge', 'flaggen', 'bandeira', 'bandeiras', 'flaga', 'flagi', 'vlag', 'vlaggen', 'bandiera', 'bandiere', 'флаг*', 'اعلام', 'علم', '国旗', 'झंडा', 'पतका', 'পতাকা', 'جھنڈا', 'banner'],
  capital: ['capital', 'capitals', 'capitales', 'capitale', 'capitals', 'hauptstadt', 'hauptstadte', 'capitais', 'stolice', 'stolica', 'hoofdsteden', 'hoofdstad', 'capitali', 'столиц*', 'عواصم', 'عاصمة', '首都', 'राजधानी', 'রাজধানী', 'دارالحکومت'],
  map: ['map', 'maps', 'mapgame', 'wo liegt', 'where in the world', 'mapa', 'mapas', 'carte', 'cartes', 'karte', 'landkarte', 'kaart', 'cartina', 'mapy', 'карта', 'خريطة', '地图', 'नक्शा', 'blank', 'mudo', 'muda', 'muette', 'interactive', 'interactivo', 'interactivos', 'labeled', 'political'],
  country: ['countries', 'country', 'landerquiz', 'landerraten', 'europaquiz', 'paises', 'pais', 'pays', 'lander', 'land', 'kraje', 'panstwa', 'landen', 'paesi', 'nations', 'страны', 'دول'],
  prov: ['province', 'provinces', 'provincias', 'provincia', 'bundeslander', 'bundesland', 'departements', 'departamentos', 'regiones', 'regions', 'region', 'comunidades', 'autonomas', 'counties', 'county', 'prefectures', 'wojewodztwa', 'provincies', 'regioni', 'cantons', 'canton', 'kantone', 'oblasts', 'estados', 'states'],
  game: ['quiz', 'quizz', 'game', 'games', 'juego', 'juegos', 'jeu', 'jeux', 'spiel', 'spiele', 'jogo', 'jogos', 'gra', 'gry', 'spel', 'gioco', 'test', 'trivia', 'guess', 'guesser', 'adivina', 'devine', 'errate', 'practice', 'learn', 'aprender', 'apprendre', 'lernen', 'online', 'play'],
};
const NOT_RELEVANT = ['unblocked', 'city guesser', 'geoguessr', 'globle', 'worldle', 'seterra', 'sporcle', 'didactalia', 'poki', 'crazy games', 'coolmath', 'geo rankle', 'rankle', 'oceanofgame', 'ocean of game', 'wordle', 'kahoot', 'quizlet', 'minecraft', 'roblox', 'flagle', 'travle', 'geotastic', 'lizard point', 'lizardpoint', 'mapchart', 'google earth', 'google maps', 'national geographic', 'nat geo', 'world geography games', 'geography games com', 'quizizz', 'qizizz', 'quizziz', 'wuizziz', 'quizzzz', 'quizzz', 'cityguesser', 'city guessr', 'world gessur', 'world guessor', 'worldguessr', 'world guesser', 'gamesunblocked', 'what city', 'which city', 'country guesser'];

const PHYS = [['rivers', /\b(river|rivers|rio|rios|fleuve|fluss|flusse|rzek)\b/], ['lakes', /\b(lake|lakes|lago|lagos|lac|see|seen|jezior)\b/], ['mountains', /\b(mountain|mountains|montana|montanas|montagne|berg|berge|gor|gory)\b/], ['ranges', /\b(ranges|cordillera|gebirge|mountain range)\b/], ['oceans', /\b(ocean|oceans|oceano|oceanos|ozean|oceany)\b/], ['seas', /\b(sea|seas|mar|mares|mer|meer|morza)\b/], ['deserts', /\b(desert|deserts|desierto|wuste)\b/], ['volcanoes', /\b(volcano|volcanoes|volcan|vulkan)\b/], ['islands', /\b(island|islands|isla|islas|ile|insel|inseln|wyspy)\b/], ['continents', /\b(continent|continents|continentes|kontinent|kontinente|kontynenty)\b/], ['latlong', /\b(latitude|longitude|latitud|longitud|equator|ecuador linea)\b/], ['biomes', /\b(biome|biomes|bioma|biomas|biom|biome)\b/], ['solar', /\b(planet|planets|planetas|solar system|sistema solar)\b/]];
const PHYS_PATH = { rivers: 'world/rivers/', lakes: 'world/lakes/', mountains: 'world/mountains/', ranges: 'world/mountain-ranges/', oceans: 'world/oceans/', seas: 'world/seas/', deserts: 'world/deserts/', volcanoes: 'world/volcanoes/', islands: 'world/islands/', continents: 'world/continents/', biomes: 'world/biomes/', latlong: 'world/latitude-and-longitude/', solar: 'world/solar-system/' };

// ---------- Classify ----------
function classify(r, forceLang) {
  const k = fold(r.k);
  const lang = forceLang || langOf(r, k);
  const o = { keyword: r.k, volume: r.vol, lang, status: 'gap', url: '', cluster: '' };
  if (NOT_RELEVANT.some((w) => k.includes(` ${fold(w).trim()} `))) { o.status = 'not-relevant'; o.cluster = 'Other brands'; return o; }
  if (!LANGS.includes(lang)) { o.status = 'other-language'; o.cluster = `Language not on site (${lang})`; return o; }
  const is = (t) => anyWord(k, T[t]);
  let p = null;
  const usa = /\b(50 states|us states?|u s states|united states|usa|american states|state capitals|states and capitals|estados unidos|etats unis|vereinigten staaten|usa bundesstaaten|us state|etat unis|etats unis)\b/.test(k) || ((hasWord(k, 'states') || hasWord(k, 'state')) && !findCountry(k));
  // "Bundesländer" on its own means Germany's.
  const c = findCountry(k) || (hasWord(k, 'bundeslander') ? countries.find((x) => x.iso2 === 'DE') : null);
  const cont = findCont(k);
  const phys = PHYS.find(([, re]) => re.test(k));
    // Games with their own page (state flags, counties of England, the Caribbean, Hawaii, Swiss cantons).
  const special = [
    [/\bstate flags?\b/, 'countries/united-states/flags-quiz/', 'US states'],
    [/\b(english|england|uk|british) count(y|ies)\b|\bcounties of (england|the uk)\b|^counties quiz$/, 'countries/united-kingdom/england-counties/', 'Provinces and states'],
    [/\bhawaii(an)? islands?\b|\bislands of hawaii\b/, 'countries/united-states/hawaii-islands/', 'Provinces and states'],
    [/\bdanish islands\b|\bislands of denmark\b/, 'countries/denmark/islands/', 'Provinces and states'],
    [/\bkanton|\bcantons? suisses?\b|\bswiss cantons?\b/, 'countries/switzerland/map-quiz/', 'Provinces and states'],
  ];
  const sp = special.find(([re]) => re.test(k));
  // Country outlines, continent facts, and the currency, language and other country games.
  const shape = /\b(guess the country|guess country|country shapes?|shapes? of (the )?countr\w*|countr\w* (by )?(shape|outline)s?|outlines?|silhouettes?|siluetas?|forma de (los )?pais\w*|umriss\w*|landerumriss\w*)\b/.test(k) && !is('flag');
  const howMany = /\b(how many countr\w*|number of countr\w*|cuantos paises|combien de pays|wie viele lander|quantos paises|quanti paesi)\b/.test(k);
  const currency = /\b(currenc\w*|monedas?|monnaies?|wahrung\w*|moedas?|valute?)\b/.test(k);
  const language = /\b(languages?|idiomas?|langues?|sprachen|lingue|spoken)\b/.test(k) && !/\b(sign|programming|learn (a |the )?(english|spanish|french))\b/.test(k);
  const game = [[/\blandlocked\b|\bsin salida al mar\b|\benclaves?\b|\bbinnenstaat\w*/, 'games/landlocked/'], [/\bneighbou?r\w*|\bbordering\b|\bborders?\b|\bvecinos\b|\bnachbar\w*/, 'games/neighbours/'], [/\bhemispher\w*|\bhemisferio\w*|\bhemisphere\w*/, 'games/hemispheres/']].find(([re]) => re.test(k));
  if (sp && !p) { p = sp[1]; o.cluster = sp[2]; }
  else if (shape) { p = `guess-the-country/${cont && cont !== 'americas' ? cont : 'world'}/`; o.cluster = 'Guess the country (shapes)'; }
  else if (c && c.iso2 === 'ES' && /\bprovinc\w*/.test(k)) { p = is('capital') ? 'countries/spain/province-capitals/' : 'countries/spain/provinces/'; o.cluster = 'Provinces and states'; }
  else if (howMany && !c) { p = cont && cont !== 'americas' ? `${cont}/` : 'world/'; o.cluster = 'Continent facts'; }
  else if ((currency || language) && !c) { const g = currency ? 'currencies' : 'languages'; p = cont && cont !== 'americas' ? `games/${g}/${cont}/` : `games/${g}/`; o.cluster = currency ? 'Currencies' : 'Languages'; }
  else if (game && !c) { p = game[1]; o.cluster = 'Country games'; }
  else if (/\b(caribbean|caribe|caraibes|karibik)\b/.test(k) && !/\bislands?\b|\bislas\b/.test(k)) { p = is('capital') ? 'capitals/caribbean/' : is('flag') ? 'flags/caribbean/' : 'maps/caribbean/'; o.cluster = 'Continent maps and countries'; }
  else if (usa && !is('flag')) { p = is('capital') ? 'countries/united-states/capitals-quiz/' : 'countries/united-states/map-quiz/'; o.cluster = 'US states'; }
  else if (c) {
    const prov = subs[c.iso2];
    const capQuiz = prov && prov.divisions.filter((d) => d.capital).length >= 4;
    if (is('prov') && prov) { p = is('capital') && capQuiz ? `countries/${c.slug}/capitals-quiz/` : `countries/${c.slug}/map-quiz/`; o.cluster = 'Provinces and states'; }
    else if (is('map') && prov && !is('flag') && !is('capital')) { p = `countries/${c.slug}/map-quiz/`; o.cluster = 'Country maps'; }
    else { p = `countries/${c.slug}/`; o.cluster = 'Countries'; }
  } else if (phys) { p = PHYS_PATH[phys[0]]; o.cluster = 'World games'; }
  else if (cont) {
    if (is('flag')) { p = `flags/${cont}/`; o.cluster = 'Flags'; }
    else if (is('capital')) { p = `capitals/${cont}/`; o.cluster = 'Capitals'; }
    else if (is('map') || is('country') || is('game')) { p = `maps/${cont}/`; o.cluster = 'Continent maps and countries'; }
    else { p = `${cont}/`; o.cluster = 'Regions'; }
  } else if (is('flag')) { p = is('game') ? 'flags/world/' : 'flags/'; o.cluster = 'Flags'; }
  else if (is('capital')) { p = is('game') ? 'capitals/world/' : 'capitals/'; o.cluster = 'Capitals'; }
  else if (is('map') || (is('country') && is('game'))) { p = 'maps/world/'; o.cluster = 'World map and countries'; }
  else if (is('country')) { p = 'countries/'; o.cluster = 'Countries of the world'; }
  else if (/\b(geograph|geografia|geografie|geographie|erdkunde|aardrijkskunde|geo)\w*/.test(k) || is('game')) { p = ''; o.cluster = 'Geography games (home)'; }
  if (p !== null) {
    const u = (lang === 'en' ? '/' : `/${lang}/`) + p;
    if (fs.existsSync(path.join(DIST, u, 'index.html'))) { o.status = 'mapped'; o.url = u; }
    else { o.cluster = o.cluster || 'Unmatched'; o.url = u; o.status = 'gap'; }
  } else o.cluster = 'Unmatched topic';
  return o;
}
const out = rows.map((r) => classify(r));

// ---------- Write ----------
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const write = (file, list) => fs.writeFileSync(path.join(ROOT, 'docs', file), '﻿' + ['keyword,volume,language,status,cluster,target_url'].concat(list.map((o) => [o.keyword, o.volume, o.lang, o.status, o.cluster, o.url].map(esc).join(','))).join('\n') + '\n');
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
out.sort((a, b) => b.volume - a.volume);
write('keyword-map.csv', out);
write('keyword-gaps.csv', out.filter((o) => o.status === 'gap'));

const sum = (list) => list.reduce((s, o) => s + o.volume, 0);
const by = (key) => { const m = {}; for (const o of out) { const g = o[key]; m[g] = m[g] || []; m[g].push(o); } return Object.entries(m).sort((a, b) => sum(b[1]) - sum(a[1])); };
console.log(`${out.length} keywords, ${sum(out).toLocaleString()} monthly searches in total.`);
for (const [s, list] of by('status')) console.log(`  ${s}: ${list.length} keywords, ${sum(list).toLocaleString()} searches`);
console.log('\nMapped, by cluster:');
for (const [c, list] of by('cluster')) if (list[0].status === 'mapped' || list.some((o) => o.status === 'mapped')) console.log(`  ${c}: ${list.filter((o) => o.status === 'mapped').length} keywords, ${sum(list.filter((o) => o.status === 'mapped')).toLocaleString()}`);
console.log('\nBy language (mapped):');
for (const [l, list] of by('lang')) { const m = list.filter((o) => o.status === 'mapped'); if (m.length) console.log(`  ${l}: ${m.length} keywords, ${sum(m).toLocaleString()}`); }
console.log('\nOther languages:', by('lang').filter(([, l]) => l[0].status === 'other-language').map(([l, list]) => `${l} ${list.length}/${sum(list).toLocaleString()}`).join(', '));
console.log('\nTop gaps:\n  ' + out.filter((o) => o.status === 'gap').slice(0, 40).map((o) => `${o.keyword} (${o.volume}, ${o.lang}, ${o.cluster})`).join('\n  '));

// ---------- Keyword ideas (spreadsheet: Keyword, Cluster, Intent, Language, ...; no volumes) ----------
const { readXlsx } = require('./read-xlsx');
const LANG_CODE = { english: 'en', spanish: 'es', french: 'fr', german: 'de', italian: 'it', portuguese: 'pt', dutch: 'nl', polish: 'pl' };
const ideas = [];
for (const file of IDEAS) {
  const sheet = readXlsx(file, 2);
  const h = sheet[0].map((x) => String(x).toLowerCase());
  const iK = h.indexOf('keyword'), iL = h.indexOf('language'), iI = h.indexOf('intent'), iC = h.indexOf('cluster');
  for (const row of sheet.slice(1)) {
    if (!row[iK]) continue;
    const o = classify({ k: row[iK], vol: 0, loc: '' }, LANG_CODE[String(row[iL]).toLowerCase()]);
    ideas.push({ ...o, intent: row[iI] || '', theirs: row[iC] || '' });
  }
}
if (ideas.length) {
  const order = { mapped: 0, gap: 1, 'other-language': 2, 'not-relevant': 3 };
  ideas.sort((a, b) => order[a.status] - order[b.status] || a.cluster.localeCompare(b.cluster) || a.keyword.localeCompare(b.keyword));
  fs.writeFileSync(path.join(ROOT, 'docs', 'keyword-ideas-map.csv'), '﻿' + ['keyword,language,intent,idea_cluster,status,cluster,target_url'].concat(ideas.map((o) => [o.keyword, o.lang, o.intent, o.theirs, o.status, o.cluster, o.url].map(esc).join(','))).join('\n') + '\n');
  const count = (st) => ideas.filter((o) => o.status === st).length;
  console.log(`\nKeyword ideas: ${ideas.length} (mapped ${count('mapped')}, gap ${count('gap')}, other language ${count('other-language')}, not relevant ${count('not-relevant')})`);
  const cl = {};
  for (const o of ideas.filter((x) => x.status === 'mapped')) cl[o.cluster] = (cl[o.cluster] || 0) + 1;
  console.log('  mapped by cluster: ' + Object.entries(cl).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${n}`).join(', '));
  const gaps = {};
  for (const o of ideas.filter((x) => x.status === 'gap')) gaps[o.theirs] = (gaps[o.theirs] || 0) + 1;
  console.log('  gaps by idea cluster: ' + Object.entries(gaps).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([c, n]) => `${c} ${n}`).join(', '));
}
