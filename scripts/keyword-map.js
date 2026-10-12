// Keyword map: search phrasings people use, per language, mapped to the page that answers them.
// 195 countries x 6 intents (capital, area, population, continent, map, flag) x 17 languages, plus
// the real queries from a Search Console export (matched to a country page by name where possible).
// Writes docs/keyword-map.csv. These guide titles, FAQ wording and new pages; they are not stuffed
// into pages. Usage: node scripts/keyword-map.js [search-console-export.xlsx]
const fs = require('fs');
const path = require('path');
const { L, LANGS } = require('../src/i18n');
const nameFixes = require('../data/name-fixes');
const countries = require('../data/countries.json');
const subs = require('../data/subdivisions.json');
const { domain } = require('../site.config');

// Phrasings per language, from the forms seen in Search Console (word order as people type them).
const T = {
  en: ['{c} capital', '{c} area', '{c} population', 'which continent is {c} in', '{c} map', '{c} flag'],
  zh: ['{c}首都', '{c}面积', '{c}人口', '{c}属于哪个洲', '{c}地图', '{c}国旗'],
  hi: ['{c} की राजधानी', '{c} का क्षेत्रफल', '{c} की जनसंख्या', '{c} किस महाद्वीप में है', '{c} का नक्शा', '{c} का झंडा'],
  es: ['capital de {c}', 'superficie de {c}', 'población de {c}', 'en qué continente está {c}', 'mapa de {c}', 'bandera de {c}'],
  ar: ['عاصمة {c}', 'مساحة {c}', 'عدد سكان {c}', '{c} في اي قارة', 'خريطة {c}', 'علم {c}'],
  fr: ['capitale {c}', 'superficie {c}', 'population {c}', '{c} continent', 'carte {c}', 'drapeau {c}'],
  de: ['{c} hauptstadt', '{c} fläche', '{c} einwohner', 'auf welchem kontinent liegt {c}', '{c} karte', '{c} flagge'],
  bn: ['{c} এর রাজধানীর নাম কি', '{c} আয়তন কত', '{c} জনসংখ্যা কত', '{c} কোন মহাদেশে অবস্থিত', '{c} মানচিত্র', '{c} পতাকা'],
  pt: ['capital de {c}', 'área de {c}', 'população de {c}', '{c} fica em qual continente', 'mapa de {c}', 'bandeira de {c}'],
  ru: ['{c} столица', '{c} площадь', '{c} население', '{c} на каком континенте', '{c} карта', '{c} флаг'],
  ur: ['{c} کا دارالحکومت', '{c} کا رقبہ', '{c} کی آبادی', '{c} کس براعظم میں ہے', '{c} کا نقشہ', '{c} کا جھنڈا'],
  id: ['ibu kota {c}', 'luas {c}', 'jumlah penduduk {c}', '{c} terletak di benua', 'peta {c}', 'bendera {c}'],
  it: ['capitale {c}', 'superficie {c}', 'popolazione {c}', '{c} in quale continente si trova', 'cartina {c}', 'bandiera {c}'],
  ja: ['{c} 首都', '{c} 面積', '{c} 人口', '{c} 何大陸', '{c} 地図', '{c} 国旗'],
  ko: ['{c} 수도', '{c} 면적', '{c} 인구', '{c} 어느 대륙', '{c} 지도', '{c} 국기'],
  pl: ['{c} stolica', '{c} powierzchnia', '{c} ludność', '{c} na jakim kontynencie', '{c} mapa', '{c} flaga'],
  nl: ['hoofdstad {c}', 'oppervlakte {c}', 'inwoners {c}', '{c} welk continent', 'kaart {c}', 'vlag {c}'],
};
const INTENTS = ['capital', 'area', 'population', 'continent', 'map', 'flag'];
const LATIN = new Set(['en', 'es', 'fr', 'de', 'pt', 'id', 'it', 'pl', 'nl']);
const name = (c, l) => (nameFixes[c.iso2] && nameFixes[c.iso2][l]) || c.name[l] || c.name.en;
const pageUrl = (l, p) => `${domain}/${l === 'en' ? '' : l + '/'}${p}`;
const target = (c, l, intent) => {
  const hasDiv = subs[c.iso2] && subs[c.iso2].divisions.length > 1;
  if (intent === 'printable' && hasDiv) return pageUrl(l, `printables/countries/${c.slug}/`);
  return pageUrl(l, intent === 'map' && hasDiv ? `countries/${c.slug}/map-quiz/` : `countries/${c.slug}/`);
};

const rows = [['keyword', 'language', 'intent', 'target_url', 'source', 'impressions', 'clicks', 'position']];
const seen = new Set();
for (const l of LANGS) for (const c of countries) INTENTS.forEach((intent, i) => {
  let kw = T[l][i].replace('{c}', name(c, l));
  if (LATIN.has(l)) kw = kw.toLowerCase();
  const key = l + '|' + kw;
  if (seen.has(key)) return;
  seen.add(key);
  rows.push([kw, l, intent, target(c, l, intent), 'pattern', '', '', '']);
});
const patterns = rows.length - 1;

// Real queries from a Search Console export: matched to a country page when a country's name in
// one of the languages appears in the query.
let gsc = 0;
const file = process.argv[2];
if (file && fs.existsSync(file)) {
  const AdmZip = require('adm-zip');
  const { readXlsx } = require('./read-xlsx');
  const wb = new AdmZip(file).getEntry('xl/workbook.xml').getData().toString('utf8');
  const sheetNames = [...wb.matchAll(/<sheet [^>]*name="([^"]+)"/g)].map((m) => m[1]);
  const qRows = readXlsx(file, sheetNames.indexOf('Queries') + 1).slice(1);
  const names = [];
  for (const c of countries) for (const l of LANGS) names.push({ c, l, n: name(c, l).toLowerCase() });
  names.sort((a, b) => b.n.length - a.n.length);
  const intentOf = (q) => (/capital|hauptstadt|столиц|عاصم|রাজধানী|राजधानी|首都|수도|stolic|hoofdstad|ibu ?kota/i.test(q) ? 'capital'
    : /area|superficie|fläche|площад|مساحة|আয়তন|क्षेत्रफल|面积|面積|면적|powierzchni|oppervlakte|luas/i.test(q) ? 'area'
      : /population|einwohner|населен|سكان|জনসংখ্যা|जनसंख्या|人口|인구|ludno|inwoners|penduduk|popola|habitantes|população/i.test(q) ? 'population'
        : /continent|kontinent|континент|قارة|মহাদেশ|महाद्वीप|洲|大陸|대륙|benua/i.test(q) ? 'continent'
          : /pdf|print|druck|imprim|vierge|blank|blind|worksheet/i.test(q) ? 'printable'
            : /map|karte|carte|mapa|карт|خريط|মানচিত্র|नक्शा|地图|地図|지도|kaart|peta|cartina/i.test(q) ? 'map'
              : /quiz|test|kuis|викторин|اختبار|কুইজ|क्विज़|测验|クイズ|퀴즈/i.test(q) ? 'quiz'
                : /flag|flagge|drapeau|bandera|bandeira|флаг|علم|পতাকা|झंडा|国旗|국기|flaga|vlag|bendera|bandiera/i.test(q) ? 'flag' : 'other');
  for (const [q, clicks, impr, , pos] of qRows) {
    const lq = String(q).toLowerCase();
    const m = names.find((x) => x.n.length > 2 && lq.includes(x.n));
    const intent = intentOf(lq);
    const url = m ? target(m.c, m.l, intent) : '';
    rows.push([q, m ? m.l : '', intent, url, 'search-console', Number(impr) || 0, Number(clicks) || 0, Number(pos) ? Number(pos).toFixed(1) : '']);
    gsc++;
  }
}
const cell = (v) => (/[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v));
fs.mkdirSync(path.join(__dirname, '..', 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'keyword-map.csv'), '﻿' + rows.map((r) => r.map(cell).join(',')).join('\n') + '\n');
console.log(`docs/keyword-map.csv: ${patterns} pattern keywords (${countries.length} countries x ${INTENTS.length} intents x ${LANGS.length} languages) + ${gsc} Search Console queries = ${rows.length - 1} rows`);
