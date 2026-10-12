// Static site generator: node build.js -> dist/
const fs = require('fs');
const path = require('path');
const config = require('./site.config');
const { L, LANGS, CONT_KEYS, t } = require('./src/i18n');
const { listMap, countryShapes, continentSvg, adm1Svg, adm1Thumb, continentThumb, addStar, regionArt, physSvg, latLongSvg, hemispheres, countryGameArt, LAT_LINES } = require('./src/maps');
const { T, tt } = require('./src/terms');
for (const l of LANGS) if (T[l]) Object.assign(T[l], { 'g.shapes': t(l, 'hubShapes'), 'l.cfa.t': L[l].s.cfaTitle, 'l.cfa.a': L[l].s.cfaAnswer, 'g.wonders': L[l].s.gWonders, 'l.north.t': L[l].s.northT, 'l.north.a': L[l].s.northA, 'g.ancient-wonders': L[l].s.gAncient });
const { DIAGRAMS } = require('./src/diagrams');
const { planetSvg, solarSystemSvg } = require('./src/planets');
const { SCENES } = require('./src/scenes');
const og = require('./src/og');
const divisionTerm = require('./data/division-terms');
const nameFixes = require('./data/name-fixes');

const DIST = path.join(__dirname, 'dist');
const DOMAIN = config.domain.replace(/\/$/, '');
const SITE = config.siteName;
const TODAY = new Date().toISOString().slice(0, 10);
// Last-modified dates: each page keeps the date its content last changed (data/lastmod.json holds
// a hash of every page's content and that date). Pages write LASTMOD where the date goes; page()
// swaps in the real one. Rebuilding an unchanged page keeps its old date, so sitemap lastmod and
// dateModified stay trustworthy.
const crypto = require('crypto');
const LASTMOD = '0000-LASTMOD';
const LASTMOD_TEXT = '@@LASTMOD_TEXT@@';
const lastmodFile = path.join(__dirname, 'data', 'lastmod.json');
const lastmodPrev = fs.existsSync(lastmodFile) ? JSON.parse(fs.readFileSync(lastmodFile, 'utf8')) : {};
const lastmodNext = {};
const pageDate = {}; // lang -> path -> date, for the sitemaps
// The publisher, on every page that names one.
// sameAs: the site's official profiles elsewhere (site.config.js socialProfiles).
const ORG = { '@type': 'Organization', '@id': `${DOMAIN}/#organization`, name: SITE, url: DOMAIN + '/', logo: { '@type': 'ImageObject', url: DOMAIN + '/logo.png', width: 512, height: 512 }, ...(config.contactEmail ? { email: config.contactEmail } : {}), ...(config.socialProfiles && config.socialProfiles.length ? { sameAs: config.socialProfiles } : {}) };
const DATA_DATE = fs.statSync(path.join(__dirname, 'data', 'countries.json')).mtime.toISOString().slice(0, 10);

// ---------- Data ----------
const countries = require('./data/countries.json');
for (const c of countries) Object.assign(c.name, nameFixes[c.iso2] || {});
const dataFixes = require('./data/currency-language-fixes');
for (const c of countries) if (dataFixes.currencies[c.iso2]) c.currencies = dataFixes.currencies[c.iso2].map(([code, name]) => ({ code, name }));
// Population: World Bank, one year for every country (scripts/fetch-population.js); Wikidata only
// where the World Bank has no figure (Vatican City).
const wbPop = fs.existsSync(path.join(__dirname, 'data', 'population.json')) ? require('./data/population.json') : {};
for (const c of countries) if (wbPop[c.iso3]) c.population = { value: wbPop[c.iso3].value, year: wbPop[c.iso3].year };
// Capitals Wikidata's export misses or orders differently from common sources (first = quiz answer).
const capFixes = fs.existsSync(path.join(__dirname, 'data', 'capital-fixes.json')) ? require('./data/capital-fixes.json') : {};
for (const c of countries) if (capFixes[c.iso2]) c.capitals = capFixes[c.iso2];
const subsFile = path.join(__dirname, 'data', 'subdivisions.json');
const subdivisions = fs.existsSync(subsFile) ? require(subsFile) : {};
const byIso = Object.fromEntries(countries.map((c) => [c.iso2, c]));
// Borders count only the countries on this site (the source also lists territories such as
// Hong Kong and Macau as China's neighbours).
for (const c of countries) c.borders = c.borders.filter((b) => byIso[b]);
const areaRank = Object.fromEntries([...countries].sort((a, b) => b.area - a.area).map((c, i) => [c.iso2, i + 1]));
// The fetch script already picked which countries get province pages (largest first,
// skipping ones with outdated boundary data), so take whatever it saved.
const provCountries = [...countries].sort((a, b) => b.area - a.area)
  .filter((c) => subdivisions[c.iso2] && subdivisions[c.iso2].divisions.length > 1);
const hasProv = new Set(provCountries.map((c) => c.iso2));
// Capital coordinates (scripts/fetch-capital-coords.js), for the outline printables of countries
// without a province map; COUNTRY_PRINTS lists the countries that got one (filled in main()).
const capCoords = { ...(fs.existsSync(path.join(__dirname, 'data', 'capital-coords.json')) ? require('./data/capital-coords.json') : {}), ...(capFixes._coords || {}) };
const COUNTRY_PRINTS = new Set();
// Sentences say "the N largest countries": count only those, not the smaller extras.
const EXTRA_PROV = new Set(config.extraProvinceCountries || []);
const provLargest = provCountries.filter((c) => !EXTRA_PROV.has(c.iso3));
const hasCapQuiz = (c) => subdivisions[c.iso2].divisions.filter((d) => d.capital).length >= 4;
// The Caribbean: a map, capitals and flags quiz of its own (the 13 island states), shown with North America.
const CARIBBEAN = new Set(['AG', 'BS', 'BB', 'CU', 'DM', 'DO', 'GD', 'HT', 'JM', 'KN', 'LC', 'VC', 'TT']);
const inScope = (scope) => (scope === 'world' ? countries : scope === 'caribbean' ? countries.filter((c) => CARIBBEAN.has(c.iso2)) : countries.filter((c) => c.continent === scope));
const QUIZ_SCOPES = [...CONT_KEYS, 'caribbean'];

// Flags of first-level divisions (scripts/fetch-division-flags.js): US state flags and more.
const flagsFile = path.join(__dirname, 'data', 'division-flags.json');
const divisionFlags = fs.existsSync(flagsFile) ? require(flagsFile) : {};
const flagCountries = Object.keys(divisionFlags).filter((iso2) => hasProv.has(iso2) && subdivisions[iso2].divisions.every((d) => divisionFlags[iso2][d.id]));
// Map quizzes beyond first-level divisions (scripts/fetch-extra-maps.js): islands of Hawaii and
// Denmark, counties of England, provinces of Spain. slug: the page under the country; region:
// continent page shown on; capSlug: capitals quiz page, for sets with capitals.
const extraFile = path.join(__dirname, 'data', 'extra-maps.json');
const extraMaps = fs.existsSync(extraFile) ? require(extraFile) : {};
const EXTRA_SETS = [
  { key: 'hawaii-islands', slug: 'hawaii-islands', region: 'north-america' },
  { key: 'denmark-islands', slug: 'islands', region: 'europe' },
  { key: 'england-counties', slug: 'england-counties', region: 'europe' },
  { key: 'spain-provinces', slug: 'provinces', capSlug: 'province-capitals', region: 'europe', strip: true },
].filter((x) => extraMaps[x.key] && byIso[extraMaps[x.key].country]).map((x) => ({ ...x, ...extraMaps[x.key], c: byIso[extraMaps[x.key].country] }));
// Wikidata names some provinces "Province of X" or "provincia de X"; the quiz already says they are provinces.
// Chinese, Japanese and Korean keep their suffix (省, 県, 주), which is part of the name there.
const PROVINCE_WORD = /^(provincia de |provincia di |provincia |province of |province de |province d'|provinz |provinsi |província de |صوبہ |محافظة |مقاطعة )|( province| prov\.| प्रान्त| प्रांत| প্রদেশ)$/i;
for (const x of EXTRA_SETS.filter((e) => e.strip)) {
  for (const d of x.divisions) for (const l of Object.keys(d.name)) if (d.name[l]) d.name[l] = d.name[l].replace(PROVINCE_WORD, '').replace(/^\p{Ll}/u, (ch) => ch.toUpperCase());
}

// ---------- Helpers ----------
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Place names fall back to English; dashes inside names ("Taita–Taveta") become hyphens (house style).
const nm = (obj, lang) => ((obj && (obj[lang] || obj.en)) || '').replace(/\s*[–—]\s*/g, '-');
const cName = (c, lang) => nm(c.name, lang);
const capOf = (c, lang) => (c.capitals[0] ? nm(c.capitals[0].name, lang) : '');
const capsOf = (c, lang) => c.capitals.map((k) => nm(k.name, lang));
const url = (lang, p = '') => (lang === 'en' ? '/' : `/${lang}/`) + p;
const abs = (lang, p) => DOMAIN + url(lang, p);
const num = (lang, n) => new Intl.NumberFormat(L[lang].locale).format(Math.round(n));
const dateFmt = (lang, d) => new Intl.DateTimeFormat(L[lang].locale, { dateStyle: 'long' }).format(new Date(d + 'T12:00:00Z'));
const collator = {};
const sortBy = (lang, list, f) => { collator[lang] = collator[lang] || new Intl.Collator(L[lang].locale); return [...list].sort((a, b) => collator[lang].compare(f(a), f(b))); };
const listJoin = (lang, items) => new Intl.ListFormat(L[lang].locale, { type: 'conjunction' }).format(items);
const term = (c, lang, cap) => L[lang][cap ? 'Term' : 'term'][divisionTerm(c.iso2)];
const flagSrc = (iso2) => `/flags/${iso2.toLowerCase()}.svg`;
const jsonScript = (id, data) => `<script type="application/json" id="${id}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// Minify: a space before ":" is kept, because in "html:not(.lat) :is(h1)" it is the descendant combinator.
const CSS = fs.readFileSync(path.join(__dirname, 'src', 'style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':').replace(/;}/g, '}');
const APP_VERSION = require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, 'src', 'app.js'))).digest('hex').slice(0, 8);
const PRINT_VERSION = require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, 'src', 'print.js'))).digest('hex').slice(0, 8);
// Google Analytics (src/ga.js), only when site.config.js has a Measurement ID.
if (config.gaId && !/^G-[A-Z0-9]+$/.test(config.gaId)) throw new Error('site.config.js gaId must look like G-XXXXXXXXXX');
const GA_JS = fs.readFileSync(path.join(__dirname, 'src', 'ga.js'), 'utf8').replace("'__GA_ID__'", `'${config.gaId}'`);
const GA_VERSION = require('crypto').createHash('md5').update(GA_JS).digest('hex').slice(0, 8);
const SEARCH_VERSION =require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, 'src', 'search.js'))).digest('hex').slice(0, 8);
const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#1F5F8B"/><path d="M8 11c3-3 7-1 9 1s1 5-2 6-3 5 0 7M20 6c-1 3 1 5 4 5s4 3 3 6" fill="none" stroke="#B9CC8E" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="21" r="3" fill="#A3195B"/></svg>';

const sitemap = Object.fromEntries(LANGS.map((l) => [l, []]));

// Social preview card for a page, chosen from its path (cards are made in main(), see makeOgCards).
const OG = new Set();
function ogName(p) {
  let m;
  if (p === '') return 'home';
  if ((m = p.match(/^printables\/maps\/([a-z-]+)\/$/))) return `maps-${m[1]}`;
  if ((m = p.match(/^printables\/countries\/([a-z0-9-]+)\/(?:([a-z0-9-]+)\/)?$/))) {
    const c = countries.find((x) => x.slug === m[1]);
    if (!c) return 'home';
    const x = m[2] && EXTRA_SETS.find((e) => e.c === c && e.slug === m[2]);
    return x ? `x-${x.key}` : `prov-${c.iso2.toLowerCase()}`;
  }
  if ((m = p.match(/^(flags|capitals|maps|guess-the-country)\/(?:([a-z-]+)\/)?$/))) return `${m[1]}-${m[2] || 'world'}`;
  if ((m = p.match(/^([a-z-]+)\/$/)) && REGIONS.some((r) => r.key === m[1])) return `region-${m[1]}`;
  if ((m = p.match(/^countries\/([a-z0-9-]+)\/(?:([a-z0-9-]+)\/)?$/))) {
    const c = countries.find((x) => x.slug === m[1]);
    if (!c) return 'home';
    if (!m[2]) return `country-${c.iso2.toLowerCase()}`;
    const x = EXTRA_SETS.find((e) => e.c === c && (e.slug === m[2] || e.capSlug === m[2]));
    return x ? `x-${x.key}` : `prov-${c.iso2.toLowerCase()}`;
  }
  if ((m = p.match(/^games\/([a-z]+)\//))) return `game-${m[1]}`;
  if ((m = p.match(/^world\/([a-z-]+)\//))) { const g = WORLD_GAMES.find((x) => gamePath(x) === `world/${m[1]}/`); if (g) return `wg-${g.key}`; }
  return 'home';
}
function ogFor(p) {
  const n = ogName(p);
  if (OG.has(n)) return n;
  const country = n.startsWith('prov-') && `country-${n.slice(5)}`;
  return country && OG.has(country) ? country : 'home';
}
// Builds every card from artwork already written to dist/ (run before the pages).
function makeOgCards() {
  const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');
  const flagDir = path.join(path.dirname(require.resolve('flag-icons/package.json')), 'flags', '4x3');
  const flag = (iso2) => fs.readFileSync(path.join(flagDir, `${iso2.toLowerCase()}.svg`), 'utf8');
  const logo = LOGO.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true"', '');
  const pop = (c) => (c.population && c.population.value) || 0;
  const cards = [['home', og.single(read('img/world.svg'), '#C97B2C', logo)]];
  for (const r of REGIONS) cards.push([`region-${r.key}`, og.single(read(`img/${r.key}.svg`), r.tile, logo)]);
  for (const sc of QUIZ_SCOPES) {
    const list = inScope(sc);
    cards.push([`maps-${sc}`, og.single(read(sc === 'world' ? 'img/games/countries.svg' : `img/c/${sc}.svg`), '#2B5F73', logo)]);
    cards.push([`capitals-${sc}`, og.single(read(sc === 'world' ? 'img/games/capitals.svg' : `img/c/${sc}-capitals.svg`), '#3F4A5A', logo)]);
    cards.push([`flags-${sc}`, og.grid([...list].sort((a, b) => pop(b) - pop(a)).slice(0, 6).map((c) => flag(c.iso2)), '#6B5CA5', logo)]);
    cards.push([`guess-the-country-${sc}`, og.grid([...list].filter(hasShape).sort((a, b) => b.area - a.area).slice(0, 6).map((c) => SHAPES[c.iso2]), '#2B5F73', logo)]);
  }
  for (const c of countries) cards.push([`country-${c.iso2.toLowerCase()}`, og.pair(flag(c.iso2), SHAPES[c.iso2], '#2B5F73', logo)]);
  for (const c of provCountries) cards.push([`prov-${c.iso2.toLowerCase()}`, og.single(read(`img/p/${c.iso2.toLowerCase()}.svg`), '#2B5F73', logo)]);
  for (const x of EXTRA_SETS) cards.push([`x-${x.key}`, og.single(read(`img/x/${x.key}.svg`), '#2B5F73', logo)]);
  for (const g of COUNTRY_GAMES) cards.push([`game-${g.key}`, og.single(read(`img/games/${g.key}.svg`), g.tile, logo)]);
  for (const g of WORLD_GAMES.filter((x) => x.type !== 'link')) cards.push([`wg-${g.key}`, og.single(read(`img/games/${g.key}.svg`), g.tile, logo)]);
  for (const [name, svg] of cards) { write(`img/og/${name}.png`, og.png(svg)); OG.add(name); }
}

// The one inline script on any page: the web-font link's onload handler. The Content Security
// Policy in .htaccess allows exactly this code by its hash and no other inline script.
const FONT_ONLOAD = "this.media='all'";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-hashes' 'sha256-${crypto.createHash('sha256').update(FONT_ONLOAD).digest('base64')}'` + (config.gaId ? ' https://www.googletagmanager.com' : ''),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:" + (config.gaId ? ' https://*.google-analytics.com https://*.googletagmanager.com' : ''),
  "connect-src 'self'" + (config.gaId ? ' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com' : ''),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

// One page in one language. `p` is the language-free path, e.g. "flags/africa/".
// Search results cut descriptions near 160 characters: a longer one loses its closing sentence
// (the facts come first in every description), as long as a useful sentence remains.
function fitDescription(d) {
  if (!d || d.length <= 160) return d;
  const cut = d.replace(/([.。।۔])\s*[^.。।۔]+[.。।۔]\s*$/u, '$1');
  return cut.length >= 70 ? cut : d;
}
function page(lang, p, { title, desc, body, crumbs = [], jsonld = [], preload, script = false, printJs = false, nav, noindex = false }) {
  desc = fitDescription(desc);
  // Site owner's decision (2026-10-12): quiz answers are not shown on the pages. Every answer block
  // is an "answers" heading followed by one table or one list.
  body = body.replace(/<h2 id="answers">[^<]*<\/h2>\s*(?:<div class="tbl"><table>[\s\S]*?<\/table><\/div>|<ul class="links">[\s\S]*?<\/ul>)/g, '');
  const Ls = L[lang];
  // The site name is added only where the whole title stays within 60 characters (search results cut longer ones).
  const fullTitle = (title + ' | ' + SITE).length <= 60 ? title + ' | ' + SITE : title;
  const alts = noindex ? '' : LANGS.map((l) => `<link rel="alternate" hreflang="${L[l].hreflang}" href="${abs(l, p)}">`).join('')
    + `<link rel="alternate" hreflang="x-default" href="${abs('en', p)}">`;
  const langMenu = noindex ? '' : `<details class="lang"><summary aria-label="${esc(t(lang, 'language'))}">${esc(Ls.native)}</summary><ul>${LANGS.map((l) => `<li><a href="${url(l, p)}" hreflang="${L[l].hreflang}" lang="${L[l].hreflang}"${l === lang ? ' aria-current="true"' : ''}>${esc(L[l].native)}</a></li>`).join('')}</ul></details>`;
  const crumbList = [{ name: t(lang, 'breadcrumbHome'), p: '' }, ...crumbs];
  const ld = [...jsonld];
  if (crumbs.length) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbList.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(lang, c.p) })) });
  const navItems = [['navFlags', 'flags/'], ['navCapitals', 'capitals/'], ['navMaps', 'maps/'], ['navProvinces', 'provinces/'], ['navCountries', 'countries/'], ['navPrint', 'printables/']];
  // Web fonts load without blocking: Bricolage Grotesque for Latin-script headings, and the
  // language's own font where the system one is poor (Nastaliq for Urdu).
  const family = Ls.latin ? 'Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800' : Ls.gfont;
  const font = family
    // Nastaliq is much taller than any fallback, so a late swap would shift the page: use it only
    // if it arrives in time (it is cached for every later page view).
    ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${family}&display=${Ls.gfont ? 'optional' : 'swap'}" media="print" onload="${FONT_ONLOAD}">`
    : '';
  const html = `<!doctype html>
<html lang="${Ls.hreflang}" dir="${Ls.dir}"${Ls.latin ? ' class="lat"' : ''} data-root="/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '' : `<link rel="canonical" href="${abs(lang, p)}">`}
${alts}
<meta name="robots" content="${noindex ? 'noindex' : 'index,follow,max-snippet:-1,max-image-preview:large'}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(SITE)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${abs(lang, p)}"><meta property="og:locale" content="${Ls.locale.replace('-', '_')}"><meta property="og:image" content="${DOMAIN}/img/og/${ogFor(p)}.png"><meta property="og:image:width" content="${og.OG_W}"><meta property="og:image:height" content="${og.OG_H}"><meta property="og:image:alt" content="${esc(title)}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#EAF1EF" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0E1A24" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${config.googleVerification ? `<meta name="google-site-verification" content="${esc(config.googleVerification)}">` : ''}${config.bingVerification ? `<meta name="msvalidate.01" content="${esc(config.bingVerification)}">` : ''}${config.pinterestVerification ? `<meta name="p:domain_verify" content="${esc(config.pinterestVerification)}">` : ''}
${preload ? `<link rel="preload" as="image" href="${preload}" fetchpriority="high">` : ''}
${font}
<style>${CSS}</style>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('')}
</head>
<body>
<a class="skip" href="#main">${esc(t(lang, 'skip'))}</a>
<header class="top"><div class="wrap">
<a class="brand" href="${url(lang)}">${LOGO}${esc(SITE)}</a>
<nav class="nav" aria-label="${esc(t(lang, 'navHome'))}">${navItems.map(([k, h]) => `<a href="${url(lang, h)}"${nav === h ? ' aria-current="page"' : ''}>${esc(t(lang, k))}</a>`).join('')}</nav>
<form class="search" role="search" action="${url(lang, 'search/')}" data-idx="/search/${lang}.json" data-none="${esc(t(lang, 'searchNone'))}"><input type="search" name="q" placeholder="${esc(t(lang, 'searchPh'))}" aria-label="${esc(t(lang, 'search'))}" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="sr-${lang}" aria-autocomplete="list"><ul class="sr" id="sr-${lang}" role="listbox" hidden></ul></form>
${langMenu}
</div></header>
<main id="main" class="wrap">
${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbList.map((c, i) => (i < crumbList.length - 1 ? `<a href="${url(lang, c.p)}">${esc(c.name)}</a> / ` : esc(c.name))).join('')}</nav>` : ''}
${body}
</main>
<footer><div class="wrap">
<a href="${url(lang)}">${esc(SITE)}</a>${navItems.map(([k, h]) => `<a href="${url(lang, h)}">${esc(t(lang, k))}</a>`).join('')}<a href="${url(lang, 'world/')}">${esc(tt(lang, 'worldGames'))}</a><a href="${url(lang, 'lists/')}">${esc(tt(lang, 'l.related'))}</a><a href="${url(lang, 'about/')}">${esc(t(lang, 'navAbout'))}</a><a href="${url(lang, 'about-us/')}">${esc((PAGES[lang] || PAGES.en).navUs)}</a><a href="${url(lang, 'privacy/')}">${esc((PAGES[lang] || PAGES.en).navPrivacy)}</a>
<span>${esc(t(lang, 'updated', { d: LASTMOD_TEXT }))}</span>
</div></footer>
${script ? `<script src="/app.js?v=${APP_VERSION}" defer></script>` : ''}${printJs ? `<script src="/print.js?v=${PRINT_VERSION}" defer></script>` : ''}<script src="/search.js?v=${SEARCH_VERSION}" defer></script>${config.gaId ? `<script src="/ga.js?v=${GA_VERSION}" defer></script>` : ''}
</body>
</html>`;
  let date = TODAY;
  if (!noindex) {
    const key = `${lang}:${p}`;
    const hash = crypto.createHash('sha1').update([title, desc, body, JSON.stringify(jsonld)].join('\n')).digest('hex').slice(0, 16);
    date = lastmodPrev[key] && lastmodPrev[key].h === hash ? lastmodPrev[key].d : TODAY;
    lastmodNext[key] = { h: hash, d: date };
    (pageDate[lang] = pageDate[lang] || {})[p] = date;
  }
  const out = html.split(LASTMOD).join(date).split(LASTMOD_TEXT).join(esc(dateFmt(lang, date)));
  write(path.join(lang === 'en' ? '' : lang, p, 'index.html'), out);
  if (!noindex) { sitemap[lang].push(p); searchEntry(lang, p, title); }
}

// ---------- Site search ----------
// Every indexable page goes into /search/<lang>.json as [title, url, rank, flag, alias]:
// rank 0 = playable game or quiz, 1 = hub, 2 = country page, 3 = everything else.
// Country pages also carry the English name, so "pakistan" finds them in every language.
const SEARCH = Object.fromEntries(LANGS.map((l) => [l, []]));
const bySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));
function searchEntry(lang, p, title) {
  if (!p || p === 'about/') return;
  const m = p.match(/^countries\/([^/]+)\/(.*)$/);
  const c = m && bySlug[m[1]];
  let rank = 3;
  if (/^(world|games)\/.+/.test(p) || /^(flags|capitals|maps)\/.+/.test(p) || (m && m[2])) rank = 0;
  else if (/^[a-z-]+\/$/.test(p) && p !== 'countries/') rank = 1;
  else if (c) rank = 2;
  // Province quizzes also answer to the generic words, so "provinces of Spain" finds Spain's regions.
  const alias = [c && lang !== 'en' ? c.name.en : '', m && m[2] ? ['provinces', 'states', 'regions'].map((k) => L[lang].term[k]).join(' ') : ''].join(' ').trim();
  const row = [title, url(lang, p), rank];
  if (c || alias) row.push(c ? c.iso2.toLowerCase() : '');
  if (alias) row.push(alias);
  SEARCH[lang].push(row);
}
function searchPage(lang) {
  const p = 'search/';
  const title = t(lang, 'searchTitle');
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(t(lang, 'searchDesc'))}</p>`
    + `<form class="search big" role="search" action="${url(lang, p)}" data-idx="/search/${lang}.json" data-none="${esc(t(lang, 'searchNone'))}" data-results="${esc(t(lang, 'searchResults', { q: '%s' }))}"><input type="search" name="q" placeholder="${esc(t(lang, 'searchPh'))}" aria-label="${esc(t(lang, 'search'))}" autocomplete="off"></form>`
    + '<p class="note" id="search-count" aria-live="polite"></p><ul class="links results" id="search-results"></ul>';
  page(lang, p, { title, desc: t(lang, 'searchDesc'), body, noindex: true, crumbs: [{ name: title, p }] });
}

function faqBlock(lang, qa) {
  const body = `<section class="faq"><h2>${esc(t(lang, 'faqTitle'))}</h2>${qa.map(([q, a]) => `<details open><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return { body, ld };
}

const QUIZ_STRINGS = ['progress', 'score', 'time', 'right', 'wrong', 'triesLeft', 'done', 'best', 'mistakes', 'restart', 'qFlag', 'qCapital', 'qFind', 'zoomIn', 'zoomOut', 'zoomReset', 'loading', 'mapHint', 'start'];
const quizStrings = (lang) => Object.fromEntries(QUIZ_STRINGS.map((k) => [k, t(lang, k)]));

function quizLd(lang, p, name, desc, about) {
  return { '@context': 'https://schema.org', '@type': 'Quiz', name, description: desc, url: abs(lang, p), inLanguage: L[lang].hreflang, isAccessibleForFree: true, learningResourceType: 'Quiz', educationalUse: 'practice', about: { '@type': 'Thing', name: about }, dateModified: LASTMOD, publisher: ORG };
}

// cover: the picture behind the Start button on quizzes without a map, the same art as the
// quiz's card: { img, tile } for one picture, or { flags: [src...], tile } for a grid of flags.
const coverImg = (img, tile) => ({ img, tile });
const coverFlags = (flags, tile = '#6B5CA5') => ({ flags: flags.slice(0, 6), tile });
function gameShell(lang, data, cover) {
  // Map quizzes: the frame is sized from the map's aspect ratio; app.js loads the map into it.
  const [w, h] = data.ar ? data.ar.split('/').map(Number) : [];
  const startBox = `<button class="btn start" type="button">${esc(t(lang, 'start'))}</button><span class="note">${esc(t(lang, 'progress', { i: 1, n: data.items.length }))}</span>`;
  const art = cover && (cover.flags
    ? `<div class="cflags">${cover.flags.map((src) => `<img src="${src}" alt="" width="64" height="48">`).join('')}</div>`
    : `<img src="${cover.img}" alt="" width="320" height="190">`);
  const inner = data.ar
    ? `<div class="map" style="--ar:${data.ar};--arn:${(w / h).toFixed(3)}"><div class="maploading">${esc(t(lang, 'loading'))}</div></div><noscript><p>${esc(t(lang, 'noJs'))}</p></noscript>`
    : cover
      ? `<div class="cover" style="--tile:${cover.tile}">${art}<div class="cstart">${startBox}</div></div><noscript><p>${esc(t(lang, 'noJs'))}</p></noscript>`
      : `<div class="intro">${startBox}</div><noscript><p>${esc(t(lang, 'noJs'))}</p></noscript>`;
  return `<section class="game" id="game" aria-label="${esc(data.title)}"><div class="stage">${inner}</div></section>${jsonScript('quiz-data', data)}`;
}

// ---------- Continent quizzes ----------
const MAP_AR = {};
const MAP_IDS = {}; // ISO2 -> ids of divisions drawn on the province map
// dir: the pages' folder. hub: the string key of the hub page's title.
const QUIZ_TYPES = [
  { type: 'flags', dir: 'flags', hub: 'hubFlags', key: 'flagsQuiz', desc: 'flagsDesc', about: 'typeFlags' },
  { type: 'capitals', dir: 'capitals', hub: 'hubCapitals', key: 'capitalsQuiz', desc: 'capitalsDesc', about: 'typeCapitals' },
  { type: 'maps', dir: 'maps', hub: 'hubMaps', key: 'mapsQuiz', desc: 'mapsDesc', about: 'typeMaps' },
  { type: 'shapes', dir: 'guess-the-country', hub: 'hubShapes', key: 'shapesQuiz', desc: 'shapesDesc', about: 'typeShapes' },
];
// Country outlines (src/maps.js countryShapes), filled in main(). Countries under 1,000 km² are
// left out of the shapes quizzes: their outlines are too small to recognise.
let SHAPES = {};
const SHAPE_MIN_KM2 = 1000;
const hasShape = (c) => SHAPES[c.iso2] && c.area >= SHAPE_MIN_KM2;
const quizList = (q, scope) => (q.type === 'shapes' ? inScope(scope).filter(hasShape) : inScope(scope));
const shapeSrc = (iso2) => `/img/shapes/${iso2.toLowerCase()}.svg`;
// Six recognisable outlines for card and cover pictures: the largest countries in the list.
const bigShapes = (list) => [...list].filter(hasShape).sort((a, b) => b.area - a.area).slice(0, 6).map((c) => shapeSrc(c.iso2));

// Quick facts about a continent (or the world), worked out from the country data.
// Populations are rounded to three significant figures ("about 211,000,000"): the sources differ by year.
const approx = (v) => { const p = 10 ** Math.max(0, Math.floor(Math.log10(v)) - 2); return Math.round(v / p) * p; };
const areaFmt = (lang, a) => new Intl.NumberFormat(L[lang].locale, { maximumFractionDigits: a < 10 ? 2 : 0 }).format(a);
function contFacts(lang, scope, { landlocked = true, learn = true } = {}) {
  const list = inScope(scope);
  const v = { in: L[lang].in[scope], of: L[lang].of[scope] };
  const byA = [...list].sort((a, b) => b.area - a.area);
  const byPop = list.filter((c) => c.population).sort((a, b) => b.population.value - a.population.value);
  const qa = [
    [t(lang, 'qContCount', v), t(lang, 'aContCount', { ...v, n: list.length })],
    [t(lang, 'qContLargest', v), t(lang, 'aContLargest', { ...v, c: cName(byA[0], lang), a: areaFmt(lang, byA[0].area), s: cName(byA[byA.length - 1], lang), b: areaFmt(lang, byA[byA.length - 1].area) })],
  ];
  if (byPop.length > 1) qa.push([t(lang, 'qContPop', v), t(lang, 'aContPop', { ...v, c: cName(byPop[0], lang), p: num(lang, approx(byPop[0].population.value)), s: cName(byPop[byPop.length - 1], lang), q: num(lang, approx(byPop[byPop.length - 1].population.value)) })]);
  if (landlocked) {
    const ll = sortBy(lang, list.filter((c) => c.landlocked), (c) => cName(c, lang));
    qa.push([t(lang, 'qContLandlocked', v), ll.length ? t(lang, 'aContLandlocked', { ...v, n: ll.length, list: listJoin(lang, ll.map((c) => cName(c, lang))) }) : t(lang, 'aContNoLandlocked', v)]);
  }
  if (learn) qa.push([t(lang, 'qContLearn', v), t(lang, 'aContLearn', v)]);
  return qa;
}
const quizTitle = (lang, type, scope) => t(lang, QUIZ_TYPES.find((q) => q.type === type).key, { of: L[lang].of[scope], cont: L[lang].cont[scope] });

function answerTable(lang, list, type) {
  const rows = sortBy(lang, list, (c) => cName(c, lang)).map((c) => `<tr>${type === 'flags' ? `<td><img src="${flagSrc(c.iso2)}" alt="${esc(t(lang, 'flagAlt', { c: cName(c, lang) }))}" width="32" height="24" loading="lazy"></td>` : type === 'shapes' ? `<td><img class="shape" src="${shapeSrc(c.iso2)}" alt="" width="32" height="24" loading="lazy"></td>` : ''}<td><a href="${url(lang, `countries/${c.slug}/`)}">${esc(cName(c, lang))}</a></td><td>${esc(capsOf(c, lang).join(', '))}</td></tr>`).join('');
  return `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><div class="tbl"><table><thead><tr>${type === 'flags' ? `<th>${esc(t(lang, 'thFlag'))}</th>` : type === 'shapes' ? `<th>${esc(t(lang, 'typeShapes'))}</th>` : ''}<th>${esc(t(lang, 'thCountry'))}</th><th>${esc(t(lang, 'thCapital'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function relatedQuizzes(lang, exclude) {
  const links = [];
  for (const q of QUIZ_TYPES) for (const s of CONT_KEYS) if (`${q.dir}/${s}/` !== exclude) links.push(`<li><a href="${url(lang, `${q.dir}/${s}/`)}">${esc(quizTitle(lang, q.type, s))}</a></li>`);
  return `<h2>${esc(t(lang, 'related'))}</h2><ul class="links">${links.join('')}</ul>`;
}

// Title of a province quiz ('map' or 'cap'), with the high-volume US wording where a language has one.
const seo = (lang, key) => (L[lang].seo || {})[key];
function provQuizTitle(lang, c, kind) {
  if (c.iso2 === 'US' && seo(lang, kind === 'map' ? 'usMap' : 'usCap')) return seo(lang, kind === 'map' ? 'usMap' : 'usCap');
  return t(lang, kind === 'map' ? 'provMapQuiz' : 'provCapQuiz', { c: cName(c, lang), term: term(c, lang), Term: term(c, lang, true) });
}

function continentQuiz(lang, q, scope) {
  const p = `${q.dir}/${scope}/`;
  const list = quizList(q, scope);
  // The world map and world flags quizzes carry the site's biggest searches; some languages title them for those.
  const title = (scope === 'world' && seo(lang, { maps: 'mapsWorld', flags: 'flagsWorld' }[q.type])) || quizTitle(lang, q.type, scope);
  const desc = t(lang, q.desc, { n: list.length, of: L[lang].of[scope] });
  const items = list.map((c) => ({ id: c.iso2, n: cName(c, lang), ...(q.type === 'capitals' ? { a: capOf(c, lang), ...(SHAPES[c.iso2] ? { s: 1 } : {}) } : {}) }));
  const data = { type: q.type === 'maps' ? 'map' : q.type === 'shapes' ? 'flags' : q.type, key: `${q.type}-${scope}-${lang}`, title, items, s: quizStrings(lang) };
  // Outlines use the picture quiz engine, with the outline in place of the flag.
  if (q.type === 'shapes') { data.imgBase = 'img/shapes/'; data.s.qFlag = t(lang, 'qShape'); }
  if (q.type === 'capitals') data.picBase = 'img/shapes/';
  if (q.type === 'maps') { data.map = `/maps/${scope}.svg`; data.ar = MAP_AR[scope]; }
  const qa = [];
  if (q.type === 'flags') qa.push([t(lang, 'qFlagsFaq', { of: L[lang].of[scope] }), t(lang, 'aFlags', { n: list.length, of: L[lang].of[scope] })]);
  if (q.type === 'maps') qa.push([t(lang, 'qMapFaq'), t(lang, 'aMap')], ...contFacts(lang, scope, { landlocked: false, learn: false }));
  if (q.type === 'shapes') qa.push([t(lang, 'qShapesFaq'), t(lang, 'aShapes', { of: L[lang].of[scope] })]);
  // Two sample capital answers help answer engines pick the page up for "capital of X" queries.
  qa.push([t(lang, 'qScoreFaq'), t(lang, 'aScore')]);
  const faq = faqBlock(lang, qa);
  const pop = (c) => (c.population && c.population.value) || 0;
  const cover = q.type === 'flags' ? coverFlags([...list].sort((a, b) => pop(b) - pop(a)).map((c) => flagSrc(c.iso2)))
    : q.type === 'capitals' ? coverImg(scope === 'world' ? '/img/games/capitals.svg' : `/img/c/${scope}-capitals.svg`, '#3F4A5A')
    : q.type === 'shapes' ? coverFlags(bigShapes(list), '#2B5F73') : null;
  const body = `${printAside(lang, printFor((pr) => pr.kind === 'scope' && pr.s === scope))}<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data, cover)}${answerTable(lang, list, q.type)}${faq.body}${relatedQuizzes(lang, p)}`;
  page(lang, p, {
    title, desc, body, script: true, nav: `${q.dir}/`,
    crumbs: [{ name: t(lang, q.hub), p: `${q.dir}/` }, { name: title, p }],
    jsonld: [quizLd(lang, p, title, desc, t(lang, q.about)), faq.ld],
  });
}

// A stamp card for one continent quiz: map or capitals picture, or six flags or outlines.
// eager: the first cards on a page load at once (they are above the fold).
function quizStamp(lang, q, scope, eager) {
  const list = quizList(q, scope);
  const pop = (c) => (c.population && c.population.value) || 0;
  const denom = `<span class="denom">${num(lang, list.length)}</span>`;
  const lazy = eager ? '' : ' loading="lazy"';
  const six = (srcs, tile) => `<span class="art flags" style="--tile:${tile}">${denom}${srcs.map((src) => `<img src="${src}" alt="" width="64" height="48"${lazy}>`).join('')}</span>`;
  const pic = (src, tile) => `<span class="art" style="--tile:${tile}">${denom}<img src="${src}" alt="" width="320" height="190"${lazy}></span>`;
  const art = q.type === 'flags' ? six([...list].sort((a, b) => pop(b) - pop(a)).slice(0, 6).map((c) => flagSrc(c.iso2)), '#6B5CA5')
    : q.type === 'shapes' ? six(bigShapes(list), '#2B5F73')
    : q.type === 'capitals' ? pic(scope === 'world' ? '/img/games/capitals.svg' : `/img/c/${scope}-capitals.svg`, '#3F4A5A')
    : pic(scope === 'world' ? '/img/games/countries.svg' : `/img/c/${scope}.svg`, '#2B5F73');
  return `<a class="stamp" href="${url(lang, `${q.dir}/${scope}/`)}"><span class="perf">${art}<span class="cap">${esc(quizTitle(lang, q.type, scope))}</span></span></a>`;
}

function hubPage(lang, q) {
  const p = `${q.dir}/`;
  const hubKey = q.hub;
  const title = t(lang, hubKey);
  const desc = t(lang, hubKey + 'Desc', { n: quizList(q, 'world').length });
  const scopes = `<nav class="stamps" aria-label="${esc(title)}">${QUIZ_SCOPES.map((s, i) => quizStamp(lang, q, s, i < 2)).join('')}</nav>`;
  let extra = '';
  if (q.type === 'flags') extra = `<h2>${esc(t(lang, 'allFlags', { n: countries.length }))}</h2><ul class="links">${sortBy(lang, countries, (c) => cName(c, lang)).map((c) => `<li><img src="${flagSrc(c.iso2)}" alt="" width="28" height="21" loading="lazy"><a href="${url(lang, `countries/${c.slug}/`)}">${esc(cName(c, lang))}</a></li>`).join('')}</ul>`;
  if (q.type === 'capitals') extra = `<h2>${esc(t(lang, 'allCapitals', { n: countries.length }))}</h2>` + answerTable(lang, countries, 'capitals').replace(/^<h2[^>]*>.*?<\/h2>/, '');
  if (q.type === 'shapes') extra = faqBlock(lang, [[t(lang, 'qShapesFaq'), t(lang, 'aShapes', { of: L[lang].of.world })], ...contFacts(lang, 'world', { landlocked: false, learn: false }).slice(0, 2)]).body;
  if (q.type === 'maps') extra = `<h2>${esc(t(lang, 'provTitle'))}</h2><ul class="links">${provCountries.map((c) => `<li><a href="${url(lang, `countries/${c.slug}/map-quiz/`)}">${esc(provQuizTitle(lang, c, 'map'))}</a></li>`).join('')}</ul>`;
  page(lang, p, { title, desc, nav: p, crumbs: [{ name: title, p }], body: `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${scopes}${extra}` });
}

// ---------- Regions (home page cards and their hub pages) ----------
// tile: the card's background colour. scopes: which quiz scopes the hub lists.
const REGIONS = [
  { key: 'world', tile: '#C97B2C', scopes: ['world'] },
  { key: 'africa', tile: '#C9A13B', scopes: ['africa'] },
  { key: 'north-america', tile: '#2F6F6A', scopes: ['north-america'] },
  { key: 'south-america', tile: '#9A5B3F', scopes: ['south-america'] },
  { key: 'asia', tile: '#6E8B3D', scopes: ['asia'] },
  { key: 'oceania', tile: '#3C7F9E', scopes: ['oceania'] },
  { key: 'europe', tile: '#A9474A', scopes: ['europe'] },
];
const CARD_FLAGS = ['br', 'jp', 'za', 'ca', 'pk', 'fr'];

// ---------- World games (the card grid on /world/) ----------
// type: link (an existing quiz), phys (map of Natural Earth/Wikidata features), diagram,
// latlong, solar. slug: the page path under /world/.
const physical = fs.existsSync(path.join(__dirname, 'data', 'physical.json')) ? require('./data/physical.json') : {};
// Wikidata labels are public edits. A name in a non-Latin script with stray Latin words mixed in
// (the Hindi label for Kilimanjaro read "किलिमंजार hiahwjamaja" in Oct 2026) is dropped, so the
// page shows the English name, unless a checked replacement is listed here.
const PHYS_NAME_FIXES = { 'mount-kilimanjaro': { hi: 'किलिमंजारो पर्वत' } };
const NON_LATIN = ['hi', 'bn', 'ur', 'ar', 'ru', 'zh', 'ja', 'ko'];
const mixedScript = (v) => /[a-z]{3,}/.test(v) && /[^\x00-\x7F]/.test(v);
for (const g of Object.values(physical)) for (const it of g.items) {
  Object.assign(it.name, PHYS_NAME_FIXES[it.id] || {});
  for (const l of NON_LATIN) if (it.name[l] && mixedScript(it.name[l]) && !(PHYS_NAME_FIXES[it.id] || {})[l]) delete it.name[l];
}
const planets = require('./data/planets.json');
const WORLD_GAMES = [
  { key: 'countries', type: 'link', href: 'maps/world/', tile: '#C97B2C' },
  { key: 'capitals', type: 'link', href: 'capitals/world/', tile: '#3F4A5A' },
  { key: 'flags', type: 'link', href: 'flags/world/', tile: '#6B5CA5' },
  { key: 'shapes', type: 'link', href: 'guess-the-country/world/', tile: '#2B5F73' },
  { key: 'wonders', type: 'phys', slug: 'seven-wonders-of-the-world', tile: '#C9A13B' },
  { key: 'ancient-wonders', type: 'phys', slug: 'seven-wonders-of-the-ancient-world', tile: '#9A5B3F' },
  { key: 'continents', type: 'phys', tile: '#2F8F83' },
  { key: 'oceans', type: 'phys', tile: '#2B5F73' },
  { key: 'latlong', type: 'latlong', slug: 'latitude-and-longitude', tile: '#3C7FB0' },
  { key: 'earth', type: 'diagram', slug: 'layers-of-the-earth', tile: '#7FB4C6' },
  { key: 'atmosphere', type: 'diagram', slug: 'atmosphere', tile: '#2D3E7A' },
  { key: 'water', type: 'diagram', slug: 'water-cycle', tile: '#6E9E4E' },
  { key: 'solar', type: 'solar', slug: 'solar-system', tile: '#1A1F3D' },
  { key: 'biomes', type: 'phys', tile: '#3E7B55' },
  { key: 'climate', type: 'diagram', slug: 'climate-change', tile: '#C98A4E' },
  { key: 'rivers', type: 'phys', tile: '#3A6EA5' },
  { key: 'archipelagos', type: 'phys', tile: '#A84440' },
  { key: 'seas', type: 'phys', tile: '#2D5E6E' },
  { key: 'regions', type: 'phys', tile: '#B5575A' },
  { key: 'lakes', type: 'phys', tile: '#B8733A' },
  { key: 'islands', type: 'phys', tile: '#7E9B3A' },
  { key: 'straits', type: 'phys', tile: '#2F6F6A' },
  { key: 'ranges', type: 'phys', slug: 'mountain-ranges', tile: '#7D6553' },
  { key: 'cities', type: 'phys', tile: '#B8602E' },
  { key: 'mountains', type: 'phys', tile: '#56709A' },
  { key: 'deserts', type: 'phys', tile: '#C9A13B' },
  { key: 'volcanoes', type: 'phys', tile: '#8E3B46' },
].filter((g) => g.type !== 'phys' || physical[g.key]);
const gamePath = (g) => (g.type === 'link' ? g.href : `world/${g.slug || g.key}/`);
const PHYS_SOURCE = { wonders: 'Wikidata', 'ancient-wonders': 'Wikidata', biomes: 'RESOLVE Ecoregions 2017 (CC BY 4.0)', rivers: 'Natural Earth, Wikidata', mountains: 'Natural Earth, Wikidata', volcanoes: 'Wikidata', cities: 'Natural Earth' };

// The items a world game asks about, named in one language.
function gameItems(g, lang) {
  if (g.type === 'phys') return physical[g.key].items.map((it) => ({ id: it.id, n: g.key === 'biomes' ? tt(lang, it.id) : nm(it.name, lang) }));
  if (g.type === 'diagram') return DIAGRAMS[g.key].parts.map((id) => ({ id, n: tt(lang, 'd.' + id) }));
  if (g.type === 'latlong') return LAT_LINES.map(([id]) => ({ id, n: tt(lang, 'd.' + id) }));
  if (g.type === 'solar') return planets.map((p) => ({ id: p.id, n: nm(p.name, lang) }));
  return [];
}

function worldGame(lang, g) {
  const p = gamePath(g);
  const label = tt(lang, 'g.' + g.key);
  const items = gameItems(g, lang);
  const isMap = g.type === 'phys' || g.type === 'latlong';
  const title = tt(lang, 'physTitle', { g: label });
  // The wonders have their own descriptions (the ancient ones are on a regional map, not the world map).
  const desc = g.key === 'wonders' ? t(lang, 'descWonders') : g.key === 'ancient-wonders' ? t(lang, 'descAncient') : tt(lang, isMap ? 'physDescMap' : 'physDescDiagram', { g: label, n: items.length });
  const data = { type: 'map', key: `w-${g.key}-${lang}`, title, map: `/maps/w/${g.key}.svg`, ar: MAP_AR['w-' + g.key], items, s: quizStrings(lang) };
  const crumbs = [{ name: L[lang].cont.world, p: 'world/' }, { name: label, p }];
  let table;
  let qa = [[t(lang, 'qMapFaq'), t(lang, 'aMap')], [t(lang, 'qScoreFaq'), t(lang, 'aScore')]];
  // The Great Pyramid (q37200) is on the New Seven Wonders map as the honorary eighth, not one of the seven.
  if (g.key === 'wonders') qa.unshift([t(lang, 'qWonders'), t(lang, 'aWonders', { list: listJoin(lang, items.filter((x) => x.id !== 'q37200').map((x) => x.n)) })]);
  if (g.key === 'ancient-wonders') qa.unshift([t(lang, 'qAncient'), t(lang, 'aAncient', { list: listJoin(lang, items.map((x) => x.n)) })]);
  let extra = '';
  if (g.type === 'solar') {
    // Facts table (NASA diameters) and the planet quick answers.
    const pn = (x) => nm(x.name, lang);
    table = `<div class="tbl"><table><thead><tr><th class="num">${esc(tt(lang, 'thOrder'))}</th><th>${esc(t(lang, 'thName'))}</th><th>${esc(tt(lang, 'thType'))}</th><th class="num">${esc(tt(lang, 'thDiameter'))}</th></tr></thead><tbody>${planets.map((x) => `<tr><td class="num">${x.order}</td><td><img src="/img/planets/${x.id}.svg" alt="" width="24" height="24" loading="lazy" style="display:inline;vertical-align:middle;box-shadow:none"> ${esc(pn(x))}</td><td>${esc(tt(lang, 'type.' + x.type))}</td><td class="num">${num(lang, x.diameter)}</td></tr>`).join('')}</tbody></table></div>`;
    const big = planets.reduce((a, b) => (b.diameter > a.diameter ? b : a));
    qa = [[tt(lang, 'qPlanetsCount'), tt(lang, 'aPlanetsCount', { list: listJoin(lang, planets.map(pn)) })], [tt(lang, 'qLargest'), tt(lang, 'aLargest', { p: pn(big), d: num(lang, big.diameter) })], [tt(lang, 'qClosest'), tt(lang, 'aClosest', { p: pn(planets[0]) })], [tt(lang, 'qFarthest'), tt(lang, 'aFarthest', { p: pn(planets[7]) })], ...qa];
    extra = `<div class="cta"><a class="btn" href="${url(lang, p + 'names/')}">${esc(tt(lang, 'planetNames'))}</a></div>`;
  } else {
    table = `<div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thName'))}</th></tr></thead><tbody>${sortBy(lang, items, (x) => x.n).map((x) => `<tr><td>${esc(x.n)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  const note = g.type === 'diagram' || g.type === 'solar' ? `<p class="note">${esc(tt(lang, 'notToScale'))}</p>` : '';
  const src = g.type === 'phys' ? `<p class="note">${esc(tt(lang, 'source', { s: PHYS_SOURCE[g.key] || 'Natural Earth' }))}</p>` : g.type === 'solar' ? `<p class="note">${esc(tt(lang, 'source', { s: 'NASA Planetary Fact Sheet' }))}</p>` : '';
  const faq = faqBlock(lang, qa);
  const others = WORLD_GAMES.filter((x) => x !== g).slice(0, 12);
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data)}${note}${extra}<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2>${table}${src}${faq.body}`
    + `<h2>${esc(t(lang, 'related'))}</h2><ul class="links">${others.map((x) => `<li><a href="${url(lang, gamePath(x))}">${esc(tt(lang, 'g.' + x.key))}</a></li>`).join('')}<li><a href="${url(lang, 'world/')}">${esc(tt(lang, 'worldGames'))}</a></li></ul>`;
  page(lang, p, { title, desc, body, script: true, crumbs, jsonld: [quizLd(lang, p, title, desc, label), faq.ld] });

  if (g.type === 'solar') planetNamesPage(lang, p, crumbs);
}

// "Which planet is this?": the picture quiz engine with planet images instead of flags.
function planetNamesPage(lang, base, crumbs) {
  const p = base + 'names/';
  const title = tt(lang, 'planetNames');
  const desc = tt(lang, 'planetNamesDesc');
  const s = { ...quizStrings(lang), qFlag: tt(lang, 'qPlanet') };
  const data = { type: 'flags', key: `planets-${lang}`, title, imgBase: 'img/planets/', items: planets.map((x) => ({ id: x.id, n: nm(x.name, lang) })), s };
  const table = `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><div class="tbl"><table><tbody>${planets.map((x) => `<tr><td><img src="/img/planets/${x.id}.svg" alt="" width="40" height="40" loading="lazy" style="box-shadow:none;width:40px;height:40px"></td><td>${esc(nm(x.name, lang))}</td></tr>`).join('')}</tbody></table></div>`;
  const big = planets.reduce((a, b) => (b.diameter > a.diameter ? b : a));
  const faq = faqBlock(lang, [[tt(lang, 'qPlanetsCount'), tt(lang, 'aPlanetsCount', { list: listJoin(lang, planets.map((x) => nm(x.name, lang))) })], [tt(lang, 'qLargest'), tt(lang, 'aLargest', { p: nm(big.name, lang), d: num(lang, big.diameter) })], [t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
  page(lang, p, { title, desc, script: true, crumbs: [...crumbs, { name: title, p }], jsonld: [quizLd(lang, p, title, desc, tt(lang, 'g.solar')), faq.ld],
    body: `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data, coverImg('/img/games/solar.svg', WORLD_GAMES.find((x) => x.key === 'solar').tile))}${table}${faq.body}<p><a href="${url(lang, base)}">${esc(tt(lang, 'g.solar'))}</a></p>` });
}

function worldGameCards(lang) {
  return `<nav class="stamps" aria-label="${esc(tt(lang, 'worldGames'))}">${WORLD_GAMES.map((g, i) => {
    const count = g.key === 'shapes' ? countries.filter(hasShape).length : g.type === 'link' ? countries.length : gameItems(g, lang).length;
    const denom = `<span class="denom">${num(lang, count)}</span>`;
    const art = g.key === 'flags'
      ? `<span class="art flags" style="--tile:${g.tile}">${denom}${['mx', 'br', 'jp', 'ng', 'in', 'ca'].map((f) => `<img src="${flagSrc(f)}" alt="" width="64" height="48" loading="lazy">`).join('')}</span>`
      : `<span class="art" style="--tile:${g.tile}">${denom}<img src="/img/games/${g.key}.svg" alt="" width="320" height="190"${i === 0 ? ' fetchpriority="high"' : i < 2 ? '' : ' loading="lazy"'}></span>`;
    return `<a class="stamp" href="${url(lang, gamePath(g))}"><span class="perf">${art}<span class="cap">${esc(tt(lang, 'g.' + g.key))}</span></span></a>`;
  }).join('')}</nav>`;
}
const inRegion = (r, c) => r.key === 'world' || r.scopes.includes(c.continent);

function regionHub(lang, r) {
  const p = r.key + '/';
  const rn = L[lang].cont[r.key];
  const title = t(lang, 'regionTitle', { r: rn, of: L[lang].of[r.key] });
  const desc = t(lang, 'regionDesc', { of: L[lang].of[r.key] });
  let body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>`;
  // The World page is a grid of every world game, like the home page cards.
  if (r.key === 'world') body += `<h2>${esc(tt(lang, 'worldGames'))}</h2>${worldGameCards(lang)}<p><a href="${url(lang, 'world/solar-system/names/')}">${esc(tt(lang, 'planetNames'))}</a></p>`;
  const provs = provCountries.filter((c) => inRegion(r, c));
  if (r.key !== 'world') {
    // Stamps like the home page: countries, capitals and flags of the continent, then one
    // map quiz per country with province data (alphabetical), each with its own small map.
    let n = 0;
    const stamp = (href, art, cap) => `<a class="stamp" href="${href}"><span class="perf">${art}<span class="cap">${esc(cap)}</span></span></a>`;
    const img = (src, tile, count) => `<span class="art" style="--tile:${tile}"><span class="denom">${num(lang, count)}</span><img src="${src}" alt="" width="320" height="190"${n++ < 2 ? '' : ' loading="lazy"'}></span>`;
    const cards = [];
    for (const s of [...r.scopes, ...(r.key === 'north-america' ? ['caribbean'] : [])]) {
      const list = inScope(s);
      const pop = (c) => (c.population && c.population.value) || 0;
      const flags = [...list].sort((a, b) => pop(b) - pop(a)).slice(0, 6);
      cards.push(stamp(url(lang, `maps/${s}/`), img(`/img/c/${s}.svg`, '#2B5F73', list.length), quizTitle(lang, 'maps', s)));
      cards.push(stamp(url(lang, `capitals/${s}/`), img(`/img/c/${s}-capitals.svg`, '#3F4A5A', list.length), quizTitle(lang, 'capitals', s)));
      cards.push(stamp(url(lang, `flags/${s}/`), `<span class="art flags" style="--tile:#6B5CA5"><span class="denom">${num(lang, list.length)}</span>${flags.map((c) => `<img src="${flagSrc(c.iso2)}" alt="" width="64" height="48" loading="lazy">`).join('')}</span>`, quizTitle(lang, 'flags', s)));
      const shaped = list.filter(hasShape);
      cards.push(stamp(url(lang, `guess-the-country/${s}/`), `<span class="art flags" style="--tile:#2B5F73"><span class="denom">${num(lang, shaped.length)}</span>${bigShapes(shaped).map((src) => `<img src="${src}" alt="" width="64" height="48" loading="lazy">`).join('')}</span>`, quizTitle(lang, 'shapes', s)));
      if (s !== 'caribbean') for (const g of COUNTRY_GAMES.filter((x) => CONT_GAMES.includes(x.key))) cards.push(stamp(url(lang, `games/${g.key}/${s}/`), img(`/img/games/${g.key}.svg`, g.tile, contGameItems(g, lang, s).length), contGameTitle(lang, g, s)));
    }
    for (const c of sortBy(lang, provs, (x) => cName(x, lang))) {
      const count = subdivisions[c.iso2].divisions.length;
      cards.push(stamp(url(lang, `countries/${c.slug}/map-quiz/`), img(`/img/p/${c.iso2.toLowerCase()}.svg`, '#2B5F73', count), provQuizTitle(lang, c, 'map')));
      if (c.iso2 === 'US') cards.push(stamp(url(lang, `countries/${c.slug}/capitals-quiz/`), img('/img/p/us-capitals.svg', '#3F4A5A', count), provQuizTitle(lang, c, 'capitals')));
      if (flagCountries.includes(c.iso2)) {
        const meta = divisionFlags[c.iso2];
        const six = subdivisions[c.iso2].divisions.slice(0, 6);
        cards.push(stamp(url(lang, flagQuizPath(c)), `<span class="art flags" style="--tile:#6B5CA5"><span class="denom">${num(lang, count)}</span>${six.map((d) => `<img src="/img/dflags/${c.iso2.toLowerCase()}/${meta[d.id].file}" alt="" width="64" height="48" loading="lazy">`).join('')}</span>`, flagQuizTitle(lang, c)));
      }
      for (const x of EXTRA_SETS.filter((e) => e.c === c && e.region === r.key)) {
        cards.push(stamp(url(lang, extraPath(x)), img(`/img/x/${x.key}.svg`, '#2B5F73', x.divisions.length), extraTitle(lang, x)));
        if (extraHasCap(x)) cards.push(stamp(url(lang, extraCapPath(x)), img(`/img/x/${x.key}-capitals.svg`, '#3F4A5A', x.divisions.filter((d) => d.capital).length), extraCapTitle(lang, x)));
      }
    }
    body += `<nav class="stamps" aria-label="${esc(title)}">${cards.join('')}</nav>`;
  } else if (provs.length) {
    body += `<h2>${esc(t(lang, 'provTitle'))}</h2><ul class="links">${provs.map((c) => `<li><img src="${flagSrc(c.iso2)}" alt="" width="28" height="21" loading="lazy"><a href="${url(lang, `countries/${c.slug}/map-quiz/`)}">${esc(provQuizTitle(lang, c, 'map'))}</a></li>`).join('')}</ul>`;
  }
  if (r.key !== 'world') {
    const list = sortBy(lang, countries.filter((c) => inRegion(r, c)), (c) => cName(c, lang));
    body += `<h2>${esc(t(lang, 'countriesTitle'))}: ${esc(rn)}</h2><ul class="links">${list.map((c) => `<li><img src="${flagSrc(c.iso2)}" alt="" width="28" height="21" loading="lazy"><a href="${url(lang, `countries/${c.slug}/`)}">${esc(cName(c, lang))}</a></li>`).join('')}</ul>`;
  }
  const facts = faqBlock(lang, contFacts(lang, r.key, { landlocked: r.key !== 'world' }));
  body += facts.body.replace(`<h2>${esc(t(lang, 'faqTitle'))}</h2>`, `<h2>${esc(t(lang, 'factsTitle'))}</h2>`);
  body += `<h2>${esc(t(lang, 'related'))}</h2><ul class="links">${REGIONS.filter((x) => x !== r).map((x) => `<li><a href="${url(lang, x.key + '/')}">${esc(t(lang, 'cardCta', { r: L[lang].cont[x.key] }))}</a></li>`).join('')}</ul>`;
  page(lang, p, { title, desc, body, crumbs: [{ name: rn, p }], jsonld: [facts.ld], preload: r.key === 'world' ? '/img/games/countries.svg' : undefined });
}

// ---------- Country games (second row of stamps on the home page) ----------
const COUNTRY_GAMES = [
  { key: 'neighbours', tile: '#A9474A' },
  { key: 'currencies', tile: '#C9A13B' },
  { key: 'languages', tile: '#3C7F9E' },
  { key: 'landlocked', tile: '#6E8B3D' },
  { key: 'hemispheres', tile: '#2D3E7A' },
];
let HEMI = {}; // filled in main() from the map data
// Currency and language quizzes also come in one version per continent (games/currencies/europe/).
const CONT_GAMES = ['currencies', 'languages'];
const contGameTitle = (lang, g, scope) => t(lang, g.key === 'currencies' ? 'contTitleCurrencies' : 'contTitleLanguages', { of: L[lang].of[scope] });
function contGameItems(g, lang, scope) {
  const ids = new Set(inScope(scope).map((c) => c.iso2));
  return countryGameItems(g, lang).filter((it) => ids.has(it.id));
}
const ROUND = 20;

// A small seeded shuffle so wrong options are the same on every build (stable pages).
function seeded(list, seed) {
  let x = seed;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  return list.map((v) => [rnd(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
}
const hash = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 100000, 7);
const currencyOf = (lang, c) => currencyNames(lang, c).map((s) => s.replace(/\s*\([A-Z]{3}\)$/, ''));

// How common each language is as an official language, so each country is asked about its
// most distinctive one (Urdu for Pakistan, not English).
let langCountCache = null;
function langCount() {
  if (langCountCache) return langCountCache;
  langCountCache = {};
  for (const c of countries) for (const code of Object.keys(wcLangs[c.iso2] || {})) langCountCache[code] = (langCountCache[code] || 0) + 1;
  return langCountCache;
}

function countryGameItems(g, lang) {
  const nameOf = (c) => cName(c, lang);
  if (g.key === 'neighbours') {
    return countries.filter((c) => c.borders.length).map((c) => {
      const nb = c.borders.map((b) => byIso[b]).filter(Boolean);
      const others = seeded(countries.filter((x) => x !== c && x.continent === c.continent && !c.borders.includes(x.iso2)), hash(c.iso2));
      const opts = [...nb, ...others.slice(0, Math.max(3, 8 - nb.length))];
      return { id: c.iso2, n: nameOf(c), p: tt(lang, 'qNeighbours', { c: nameOf(c) }), o: opts.map(nameOf), a: nb.map(nameOf) };
    });
  }
  if (g.key === 'currencies') {
    return countries.filter((c) => c.currencies.length).map((c) => {
      const mine = currencyOf(lang, c);
      const pool = seeded(countries.filter((x) => x !== c && x.currencies.length), hash(c.iso2)).map((x) => currencyOf(lang, x)[0]).filter((x) => !mine.includes(x));
      const wrong = [...new Set(pool)].slice(0, 3);
      return { id: c.iso2, n: nameOf(c), p: tt(lang, 'qCurrency', { c: nameOf(c) }), o: [mine[0], ...wrong], a: mine[0] };
    });
  }
  if (g.key === 'languages') {
    return countries.filter((c) => Object.keys(wcLangs[c.iso2] || {}).length).map((c) => {
      const codes = Object.keys(wcLangs[c.iso2]);
      const pickCode = [...codes].sort((a, b) => langCount()[a] - langCount()[b])[0];
      const all = langNamesFor(lang, c.iso2);
      const answer = langNamesFor(lang, c.iso2, [pickCode])[0];
      const pool = seeded(countries.filter((x) => x !== c), hash(c.iso2)).flatMap((x) => langNamesFor(lang, x.iso2)).filter((x) => !all.includes(x));
      return { id: c.iso2, n: nameOf(c), p: tt(lang, 'qLanguage', { c: nameOf(c) }), o: [answer, ...[...new Set(pool)].slice(0, 3)], a: answer };
    });
  }
  if (g.key === 'landlocked') {
    return countries.map((c) => ({ id: c.iso2, n: nameOf(c), p: tt(lang, 'qLandlocked', { c: nameOf(c) }), o: [t(lang, 'yes'), t(lang, 'no')], a: t(lang, c.landlocked ? 'yes' : 'no') }));
  }
  if (g.key === 'hemispheres') {
    const word = { N: 'optNorth', S: 'optSouth', E: 'optEast', W: 'optWest', B: 'optBoth' };
    return countries.filter((c) => HEMI[c.iso2]).flatMap((c) => [
      { id: c.iso2 + '-ns', n: nameOf(c), p: tt(lang, 'qNS', { c: nameOf(c) }), o: ['optNorth', 'optSouth', 'optBoth'].map((k) => tt(lang, k)), a: tt(lang, word[HEMI[c.iso2].ns]) },
      { id: c.iso2 + '-ew', n: nameOf(c), p: tt(lang, 'qEW', { c: nameOf(c) }), o: ['optEast', 'optWest', 'optBoth'].map((k) => tt(lang, k)), a: tt(lang, word[HEMI[c.iso2].ew]) },
    ]);
  }
  return [];
}

function countryGame(lang, g, scope = 'world') {
  const world = scope === 'world';
  const home = `games/${g.key}/`;
  const p = world ? home : `${home}${scope}/`;
  const label = tt(lang, 'g.' + g.key);
  const items = world ? countryGameItems(g, lang) : contGameItems(g, lang, scope);
  const title = world ? tt(lang, 'physTitle', { g: label }) : contGameTitle(lang, g, scope);
  const desc = world ? tt(lang, 'desc.' + g.key) : t(lang, g.key === 'currencies' ? 'contDescCurrencies' : 'contDescLanguages', { of: L[lang].of[scope], n: items.length });
  const scoped = world ? countries : inScope(scope);
  const data = { type: g.key === 'neighbours' ? 'multi' : g.key === 'landlocked' ? 'tf' : 'mc', key: world ? `g-${g.key}-${lang}` : `g-${g.key}-${scope}-${lang}`, title, items, s: { ...quizStrings(lang), check: tt(lang, 'check'), timeLeft: tt(lang, 'timeLeft') } };
  if (g.key === 'landlocked') data.seconds = 60; else data.limit = ROUND;
  // Answer table: one row per country.
  const rows = sortBy(lang, scoped, (c) => cName(c, lang)).map((c) => {
    const cell = {
      neighbours: () => c.borders.map((b) => byIso[b]).filter(Boolean).map((b) => cName(b, lang)).join(', ') || t(lang, 'none'),
      currencies: () => currencyOf(lang, c).join(', '),
      languages: () => langNamesFor(lang, c.iso2).join(', '),
      landlocked: () => t(lang, c.landlocked ? 'yes' : 'no'),
      hemispheres: () => (HEMI[c.iso2] ? `${tt(lang, { N: 'optNorth', S: 'optSouth', B: 'optBoth' }[HEMI[c.iso2].ns])}</td><td>${tt(lang, { E: 'optEast', W: 'optWest', B: 'optBoth' }[HEMI[c.iso2].ew])}` : '</td><td>'),
    }[g.key]();
    return `<tr><td><a href="${url(lang, `countries/${c.slug}/`)}">${esc(cName(c, lang))}</a></td><td>${g.key === 'hemispheres' ? cell.split('</td><td>').map(esc).join('</td><td>') : esc(cell)}</td></tr>`;
  }).join('');
  const head = { neighbours: ['thNeighbours'], currencies: ['thCurrency'], languages: ['thLanguages'], landlocked: ['thLandlocked'], hemispheres: ['thNS', 'thEW'] }[g.key].map((k) => `<th>${esc(tt(lang, k))}</th>`).join('');
  const table = `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thCountry'))}</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  // Quick answers worked out from the data.
  const qa = [];
  if (g.key === 'neighbours') {
    const max = Math.max(...countries.map((c) => c.borders.length));
    qa.push([tt(lang, 'qMostNeighbours'), tt(lang, 'aMostNeighbours', { n: max, list: listJoin(lang, countries.filter((c) => c.borders.length === max).map((c) => cName(c, lang))) })]);
  }
  if (g.key === 'landlocked') {
    const ll = countries.filter((c) => c.landlocked);
    qa.push([tt(lang, 'qLandlockedCount'), tt(lang, 'aLandlockedCount', { n: ll.length, total: countries.length, list: listJoin(lang, ll.slice(0, 4).map((c) => cName(c, lang))) })]);
  }
  if (!world) qa.push(contFacts(lang, scope, { landlocked: false, learn: false })[0]);
  qa.push([t(lang, 'qScoreFaq'), t(lang, 'aScore')]);
  const faq = faqBlock(lang, qa);
  const note = g.key === 'hemispheres' ? `<p class="note">${esc(tt(lang, 'hemiNote'))}</p>` : '';
  const others = COUNTRY_GAMES.filter((x) => x !== g);
  // The same game for each continent (or, on a continent page, the world version and the other continents).
  const versions = CONT_GAMES.includes(g.key) ? [...(world ? [] : [[home, tt(lang, 'physTitle', { g: label })]]), ...CONT_KEYS.filter((s) => s !== 'world' && s !== scope).map((s) => [`${home}${s}/`, contGameTitle(lang, g, s)])] : [];
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data, coverImg(`/img/games/${g.key}.svg`, g.tile))}${note}${table}${faq.body}`
    + (versions.length ? `<h2>${esc(t(lang, 'related'))}</h2><ul class="links">${versions.map(([h, n]) => `<li><a href="${url(lang, h)}">${esc(n)}</a></li>`).join('')}</ul>` : '')
    + `<h2>${esc(tt(lang, 'moreGames'))}</h2><ul class="links">${others.map((x) => `<li><a href="${url(lang, `games/${x.key}/`)}">${esc(tt(lang, 'g.' + x.key))}</a></li>`).join('')}<li><a href="${url(lang, 'world/')}">${esc(tt(lang, 'worldGames'))}</a></li></ul>`
    + (world ? listLinks(lang, LISTS.filter((l) => l.game === p)) : '');
  page(lang, p, { title, desc, body, script: true, crumbs: world ? [{ name: label, p }] : [{ name: label, p: home }, { name: title, p }], jsonld: [quizLd(lang, p, title, desc, label), faq.ld] });
}

function countryGameStamps(lang) {
  return `<nav class="stamps" aria-label="${esc(tt(lang, 'moreGames'))}">${COUNTRY_GAMES.map((g) => {
    const n = g.key === 'landlocked' ? '60s' : num(lang, g.key === 'neighbours' ? countries.filter((c) => c.borders.length).length : countries.length);
    return `<a class="stamp" href="${url(lang, `games/${g.key}/`)}"><span class="perf"><span class="art" style="--tile:${g.tile}"><span class="denom">${n}</span><img src="/img/games/${g.key}.svg" alt="" width="320" height="190" loading="lazy"></span><span class="cap">${esc(tt(lang, 'g.' + g.key))}</span></span></a>`;
  }).join('')}</nav>`;
}

// ---------- Lists and rankings (topic pages that answer "which countries..." searches) ----------
// kind "rank": ordered by a value; "set": countries that match, largest first.
const byArea = (a, b) => b.area - a.area;
const CUR_NAMES = { pl: { XOF: 'zachodnioafrykański frank CFA', XAF: 'środkowoafrykański frank CFA' }, nl: { XOF: 'West-Afrikaanse CFA-frank', XAF: 'Centraal-Afrikaanse CFA-frank' } };
// List pages that also explain their line or hemisphere and show a map (shade: hemisphere tinted).
const HEMI_LISTS = { south: { x: 'hemiSouthX', shade: 'S' }, north: { x: 'hemiNorthX', shade: 'N' }, equator: { x: 'hemiEquatorX', shade: null } };
const LISTS = [
  { key: 'largest', slug: 'largest-countries', kind: 'rank', rows: () => [...countries].sort(byArea), value: (lang, c) => num(lang, c.area), th: 'thArea', game: 'maps/world/' },
  { key: 'populous', slug: 'most-populous-countries', kind: 'rank', rows: () => countries.filter((c) => c.population).sort((a, b) => b.population.value - a.population.value), value: (lang, c) => num(lang, c.population.value), th: 'thPopulation', game: 'countries/' },
  { key: 'smallest', slug: 'smallest-countries', kind: 'rank', rows: () => [...countries].sort((a, b) => a.area - b.area), value: (lang, c) => num(lang, c.area), th: 'thArea', game: 'maps/world/' },
  { key: 'landlocked', slug: 'landlocked-countries', kind: 'set', rows: () => countries.filter((c) => c.landlocked).sort(byArea), game: 'games/landlocked/' },
  { key: 'noborders', slug: 'countries-with-no-land-borders', kind: 'set', rows: () => countries.filter((c) => !c.borders.length).sort(byArea), game: 'games/neighbours/' },
  { key: 'neighbours', slug: 'countries-with-most-neighbours', kind: 'rank', rows: () => countries.filter((c) => c.borders.length).sort((a, b) => b.borders.length - a.borders.length || byArea(a, b)), value: (lang, c) => num(lang, c.borders.length), thT: 'thNeighbours', game: 'games/neighbours/' },
  { key: 'equator', slug: 'countries-on-the-equator', kind: 'set', rows: () => countries.filter((c) => HEMI[c.iso2] && HEMI[c.iso2].ns === 'B').sort(byArea), game: 'games/hemispheres/' },
  { key: 'south', slug: 'southern-hemisphere-countries', kind: 'set', rows: () => countries.filter((c) => HEMI[c.iso2] && HEMI[c.iso2].ns === 'S').sort(byArea), game: 'games/hemispheres/' },
  { key: 'north', slug: 'northern-hemisphere-countries', kind: 'set', rows: () => countries.filter((c) => HEMI[c.iso2] && HEMI[c.iso2].ns === 'N').sort(byArea), game: 'games/hemispheres/' },
  // Both CFA francs together: people search for "the CFA franc" and how many countries use it.
  { key: 'cfa', slug: 'countries-using-cfa-franc', kind: 'set', rows: () => countries.filter((c) => c.currencies.some((x) => x.code === 'XOF' || x.code === 'XAF')).sort(byArea), game: 'games/currencies/',
    vars: () => ({ w: countries.filter((c) => c.currencies.some((x) => x.code === 'XOF')).length, m: countries.filter((c) => c.currencies.some((x) => x.code === 'XAF')).length }) },
  ...[['EUR', 'euro'], ['USD', 'us-dollar'], ['XOF', 'west-african-cfa-franc'], ['XAF', 'central-african-cfa-franc']].map(([code, s]) => ({
    key: 'cur', code, slug: `countries-using-${s}`, kind: 'set', rows: () => countries.filter((c) => c.currencies.some((x) => x.code === code)).sort(byArea), game: 'games/currencies/',
    // English runs names like "Euro" inside a sentence, so use normal lower-case forms there.
    // Polish and Dutch: the built-in names don't tell the two CFA francs apart.
    x: (lang) => (lang === 'en' ? { EUR: 'euro', USD: 'US dollar', XOF: 'West African CFA franc', XAF: 'Central African CFA franc' }[code] : (CUR_NAMES[lang] || {})[code] || currencyNames(lang, { currencies: [{ code, name: code }] })[0].replace(/\s*\([A-Z]{3}\)$/, '')),
  })),
  ...[['eng', 'english'], ['fra', 'french'], ['spa', 'spanish'], ['ara', 'arabic'], ['por', 'portuguese'], ['rus', 'russian']].map(([code, s]) => ({
    key: 'lang', code, slug: `countries-where-${s}-is-official`, kind: 'set', rows: () => countries.filter((c) => Object.keys(wcLangs[c.iso2] || {}).includes(code)).sort(byArea), game: 'games/languages/',
    x: (lang) => (lang === 'en' ? { eng: 'English', fra: 'French', spa: 'Spanish', ara: 'Arabic', por: 'Portuguese', rus: 'Russian' }[code] : langNamesFor(lang, '--', [code])[0] || code),
  })),
];
const listPath = (l) => `lists/${l.slug}/`;
const listTitle = (lang, l) => tt(lang, `l.${l.key}.t`, { x: l.x ? l.x(lang) : '' });

function listPage(lang, l) {
  const p = listPath(l);
  const rows = l.rows();
  const title = listTitle(lang, l);
  const nameOf = (c) => cName(c, lang);
  // The answer sentence: the top entry and a few after it (for a tie at the top, everyone tied).
  const top = rows[0];
  const topName = l.key === 'neighbours' ? listJoin(lang, rows.filter((c) => c.borders.length === top.borders.length).map(nameOf)) : nameOf(top);
  const nextList = l.key === 'equator' ? rows : l.kind === 'rank' ? rows.slice(1, 3) : rows.slice(0, 4);
  const answer = tt(lang, `l.${l.key}.a`, { ...(l.vars ? l.vars() : {}), top: topName, v: l.value ? l.value(lang, top) : '', next: listJoin(lang, nextList.map(nameOf)), n: rows.length, x: l.x ? l.x(lang) : '' });
  // The meta description names at most three countries so it fits in a search result.
  const short = tt(lang, `l.${l.key}.a`, { ...(l.vars ? l.vars() : {}), top: topName, v: l.value ? l.value(lang, top) : '', next: listJoin(lang, nextList.slice(0, 3).map(nameOf)), n: rows.length, x: l.x ? l.x(lang) : '' });
  const desc = `${short} ${tt(lang, 'l.more')}`;
  // The search-result title also says how many countries, and what else is on the page:
  // searchers ask "how many countries..." (the visible heading stays short).
  const hemiList = !!HEMI_LISTS[l.key];
  const seoTitle = l.kind === 'set' ? t(lang, hemiList ? 'lTM' : 'lTN', { t: title, n: num(lang, rows.length) }) : title;
  const valueHead = l.th ? t(lang, l.th) : l.thT ? tt(lang, l.thT) : '';
  const table = `<div class="tbl"><table><thead><tr><th class="num">${esc(tt(lang, 'l.rank'))}</th><th>${esc(t(lang, 'thFlag'))}</th><th>${esc(t(lang, 'thCountry'))}</th><th>${esc(t(lang, 'thCapital'))}</th>${valueHead ? `<th class="num">${esc(valueHead)}</th>` : ''}</tr></thead><tbody>${rows.map((c, i) => `<tr><td class="num">${i + 1}</td><td><img src="${flagSrc(c.iso2)}" alt="" width="32" height="24" loading="lazy"></td><td><a href="${url(lang, `countries/${c.slug}/`)}">${esc(nameOf(c))}</a></td><td>${esc(capsOf(c, lang).join(', '))}</td>${valueHead ? `<td class="num">${l.value(lang, c)}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;
  const gameName = { 'maps/world/': quizTitle(lang, 'maps', 'world'), 'countries/': t(lang, 'countriesTitle') }[l.game] || tt(lang, 'g.' + l.game.split('/')[1]);
  const others = LISTS.filter((x) => x !== l).map((x) => `<li><a href="${url(lang, listPath(x))}">${esc(listTitle(lang, x))}</a></li>`).join('');
  // Hemisphere and Equator lists: what the line or half is, a map of the countries, the
  // countries continent by continent, and a map quiz to find them.
  const hemi = HEMI_LISTS[l.key];
  let extra = '';
  if (hemi) {
    const groups = CONT_KEYS.filter((k) => k !== 'world').map((k) => [k, sortBy(lang, rows.filter((c) => c.continent === k), nameOf)]).filter(([, g]) => g.length);
    const byCont = `<h2>${esc(t(lang, 'byCont'))}</h2>` + groups.map(([k, g]) => `<h3>${esc(L[lang].cont[k])} (${num(lang, g.length)})</h3><p>${g.map((c) => `<a href="${url(lang, `countries/${c.slug}/`)}">${esc(nameOf(c))}</a>`).join(', ')}</p>`).join('');
    const qTitle = t(lang, 'listQuiz', { n: rows.length });
    const data = { type: 'map', key: `list-${l.key}-${lang}`, title: qTitle, map: '/maps/world.svg', ar: MAP_AR.world, items: rows.map((c) => ({ id: c.iso2, n: nameOf(c) })), s: quizStrings(lang) };
    extra = `<p>${esc(t(lang, hemi.x))}</p><figure class="lmap"><img src="/img/lists/${l.key}.svg" alt="${esc(title)}" width="1000" height="510"><figcaption class="note">${esc(t(lang, 'mapLegend'))}</figcaption></figure>`
      + byCont + `<h2 id="quiz">${esc(qTitle)}</h2>${gameShell(lang, data)}`;
  }
  const body = `<h1>${esc(title)}</h1><p class="answer">${esc(answer)}</p>${extra}<div class="cta"><a class="btn" href="${url(lang, l.game)}">${esc(gameName)}</a></div>${table}<h2>${esc(tt(lang, 'l.related'))}</h2><ul class="links">${others}</ul>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ItemList', name: title, description: answer, numberOfItems: rows.length, itemListOrder: l.kind === 'rank' ? 'https://schema.org/ItemListOrderDescending' : 'https://schema.org/ItemListUnordered', itemListElement: rows.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: nameOf(c), url: abs(lang, `countries/${c.slug}/`) })) };
  page(lang, p, { title: seoTitle, desc, body, script: !!hemi, crumbs: [{ name: tt(lang, 'l.hub.t'), p: 'lists/' }, { name: title, p }], jsonld: [ld] });
}

function listsHub(lang) {
  const p = 'lists/';
  const title = tt(lang, 'l.hub.t');
  const desc = tt(lang, 'l.hub.d');
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p><ul class="links">${LISTS.map((l) => `<li><a href="${url(lang, listPath(l))}">${esc(listTitle(lang, l))}</a> <small class="note">${num(lang, l.rows().length)}</small></li>`).join('')}</ul>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ItemList', name: title, itemListElement: LISTS.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: listTitle(lang, l), url: abs(lang, listPath(l)) })) };
  page(lang, p, { title, desc, body, crumbs: [{ name: title, p }], jsonld: [ld] });
}

// The lists a country belongs to (every country is in the two big rankings).
function listsFor(c) {
  return LISTS.filter((l) => (l.kind === 'rank' ? ['largest', 'populous'].includes(l.key) : l.rows().includes(c)));
}
function listLinks(lang, lists) {
  return `<h2>${esc(tt(lang, 'l.related'))}</h2><ul class="links">${lists.map((l) => `<li><a href="${url(lang, listPath(l))}">${esc(listTitle(lang, l))}</a></li>`).join('')}</ul>`;
}

// ---------- Home ----------
function home(lang) {
  const n = countries.length;
  const m = provCountries.length;
  const title = t(lang, 'homeTitle');
  const desc = t(lang, 'homeDesc', { n, m });
  const prov = provCountries.slice(0, 30).map((c) => `<li><img src="${flagSrc(c.iso2)}" alt="" width="28" height="21" loading="lazy"><a href="${url(lang, `countries/${c.slug}/`)}">${esc(cName(c, lang))}</a></li>`).join('');
  const faq = faqBlock(lang, [[t(lang, 'qMapFaq'), t(lang, 'aMap')], [t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
  // One card per region hub, then Country flags as the 7th.
  const cards = REGIONS.map((r, i) => `<a class="stamp" href="${url(lang, r.key + '/')}"><span class="perf"><span class="art" style="--tile:${r.tile}"><span class="denom">${num(lang, countries.filter((c) => inRegion(r, c)).length)}</span><img src="/img/${r.key}.svg" alt="" width="${r.key === 'world' ? 320 : 240}" height="${r.key === 'world' ? 190 : 240}"${i < 4 ? '' : ' loading="lazy"'}></span><span class="cap">${esc(t(lang, 'cardCta', { r: L[lang].cont[r.key] }))}</span></span></a>`).join('')
    + `<a class="stamp" href="${url(lang, 'flags/')}"><span class="perf"><span class="art flags" style="--tile:#6B5CA5"><span class="denom">${num(lang, countries.length)}</span>${CARD_FLAGS.map((f) => `<img src="${flagSrc(f)}" alt="" width="64" height="48" loading="lazy">`).join('')}</span><span class="cap">${esc(t(lang, 'cardFlags'))}</span></span></a>`;
  const body = `<section class="home-head"><h1>${esc(t(lang, 'homeH1'))}</h1><p class="lede">${esc(t(lang, 'homeIntro', { n, m }))}</p></section>
<nav class="stamps" aria-label="${esc(t(lang, 'indexTitle'))}">${cards}</nav>
<h2>${esc(tt(lang, 'moreGames'))}</h2>${countryGameStamps(lang)}
${listLinks(lang, LISTS)}
<h2>${esc(t(lang, 'provTitle'))}</h2><p>${esc(t(lang, 'provIntro', { n: m }))}</p><ul class="links">${prov}</ul><div class="cta"><a class="btn ghost" href="${url(lang, 'provinces/')}">${esc(t(lang, 'provTitle'))}: ${provCountries.length}</a><a class="btn ghost" href="${url(lang, 'countries/')}">${esc(t(lang, 'countriesTitle'))}: ${n}</a></div>
${faq.body}`;
  page(lang, '', {
    title, desc, body, preload: '/img/world.svg',
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: abs(lang, ''), inLanguage: L[lang].hreflang, description: desc, publisher: ORG }, faq.ld],
  });
}

// ---------- Countries ----------
function countriesIndex(lang) {
  const p = 'countries/';
  const title = t(lang, 'countriesTitle');
  const desc = t(lang, 'countriesDesc', { n: countries.length });
  let body = `<h1>${esc(title)}</h1><p class="lede">${esc(t(lang, 'countriesIntro', { n: countries.length }))}</p>`;
  for (const s of CONT_KEYS.slice(1)) {
    const list = sortBy(lang, inScope(s), (c) => cName(c, lang));
    body += `<h2 id="${s}">${esc(L[lang].cont[s])} <small class="note">${list.length}</small></h2><div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thFlag'))}</th><th>${esc(t(lang, 'thCountry'))}</th><th>${esc(t(lang, 'thCapital'))}</th><th class="num">${esc(t(lang, 'thArea'))}</th><th class="num">${esc(t(lang, 'thPopulation'))}</th></tr></thead><tbody>${list.map((c) => `<tr><td><img src="${flagSrc(c.iso2)}" alt="" width="32" height="24" loading="lazy"></td><td><a href="${url(lang, `countries/${c.slug}/`)}">${esc(cName(c, lang))}</a></td><td>${esc(capsOf(c, lang).join(', '))}</td><td class="num">${num(lang, c.area)}</td><td class="num">${c.population ? num(lang, c.population.value) : ''}</td></tr>`).join('')}</tbody></table></div>`;
  }
  page(lang, p, { title, desc, body, nav: p, crumbs: [{ name: title, p }] });
}

// Official languages come as ISO 639-3 codes; Intl names the ones it knows, English otherwise.
const wcLangs = Object.fromEntries(require('world-countries/countries.json').map((x) => [x.cca2, dataFixes.languages[x.cca2] || x.languages || {}]));
function langNames(lang, c) {
  const dn = new Intl.DisplayNames([L[lang].locale], { type: 'language', fallback: 'none' });
  return Object.entries(wcLangs[c.iso2]).map(([code, en]) => {
    if (lang === 'en') return en;
    try { return dn.of(code) || en; } catch (e) { return en; }
  });
}
// A country's official languages (or just the given ISO 639-3 codes), named in the page language.
function langNamesFor(lang, iso2, codes) {
  const dn = new Intl.DisplayNames([L[lang].locale], { type: 'language', fallback: 'none' });
  const map = wcLangs[iso2] || {};
  return (codes || Object.keys(map)).map((code) => {
    if (lang === 'en') return map[code];
    try { return dn.of(code) || map[code]; } catch (e) { return map[code]; }
  });
}

function currencyNames(lang, c) {
  const dn = new Intl.DisplayNames([L[lang].locale], { type: 'currency', fallback: 'none' });
  // Intl adds years to some currency names, e.g. "Sierra Leonean Leone (1964–2022)": drop them.
  return c.currencies.map((x) => { let n; try { n = dn.of(x.code); } catch (e) {} return `${(n || x.name).replace(/\s*[(（][^)）]*\d{4}[^)）]*[)）]/, '').replace(/\s*[–—]\s*/g, '-')} (${x.code})`; });
}

function countryPage(lang, c) {
  const p = `countries/${c.slug}/`;
  const name = cName(c, lang);
  const caps = capsOf(c, lang);
  const sub = hasProv.has(c.iso2) ? subdivisions[c.iso2] : null;
  const divs = sub ? sortBy(lang, sub.divisions, (d) => nm(d.name, lang)) : [];
  const tm = term(c, lang);
  const title = t(lang, 'countryTitleFacts', { c: name });
  // Search Console (Oct 2026): people search a country's area, capital, population and continent,
  // so the title names them and the description gives the answers.
  const factsDesc = c.area && c.population ? t(lang, 'countryDescFacts', { c: name, cap: caps.join(', '), a: areaFmt(lang, c.area), p: num(lang, approx(c.population.value)), cont: L[lang].cont[c.continent] }) : null;
  // Search results cut descriptions near 160 characters: drop the closing sentence if needed.
  const fitDesc = (d) => (d && d.length > 158 ? d.replace(/([.。।۔])\s*[^.。।۔]+[.。।۔]\s*$/u, '$1') : d);
  const desc = fitDesc(factsDesc) || (sub ? t(lang, 'countryDescMap', { c: name, cap: caps.join(', '), n: divs.length, term: tm }) : t(lang, 'countryDesc', { c: name, cap: caps.join(', ') }));
  const capSentence = caps.length > 1 ? t(lang, 'capitalsAre', { c: name, caps: listJoin(lang, caps) }) : t(lang, 'capitalIs', { c: name, cap: caps[0] });
  const cont = L[lang].cont[c.continent];
  const pop = c.population ? (c.population.year ? t(lang, 'popSource', { pop: num(lang, c.population.value), year: c.population.year }) : t(lang, 'popSourceNoYear', { pop: num(lang, c.population.value) })) : '';
  const borders = c.borders.map((b) => byIso[b]).filter(Boolean);
  const kv = [
    [t(lang, 'fCapital'), esc(caps.join(', '))],
    [t(lang, 'fContinent'), `<a href="${url(lang, `countries/#${c.continent}`)}">${esc(cont)}</a>`],
    [t(lang, 'fArea'), `${num(lang, c.area)} km²`],
    pop && [t(lang, 'fPopulation'), esc(pop)],
    c.languages.length && [t(lang, 'fLanguages'), esc(langNames(lang, c).join(', '))],
    c.currencies.length && [t(lang, 'fCurrency'), esc(currencyNames(lang, c).join(', '))],
    [t(lang, 'fBorders'), borders.length ? borders.map((b) => `<a href="${url(lang, `countries/${b.slug}/`)}">${esc(cName(b, lang))}</a>`).join(', ') : esc(t(lang, 'none'))],
    [t(lang, 'fLandlocked'), esc(t(lang, c.landlocked ? 'yes' : 'no'))],
  ].filter(Boolean);

  const qa = [
    [t(lang, 'qCapitalFaq', { c: name }), capSentence],
    [t(lang, 'qContFaq', { c: name }), t(lang, 'inCont', { c: name, cont })],
    [t(lang, 'qAreaFaq', { c: name }), t(lang, 'aArea', { c: name, area: num(lang, c.area), rank: areaRank[c.iso2], n: countries.length })],
  ];
  if (c.population) qa.push([t(lang, 'qPopFaq', { c: name }), wbPop[c.iso3] ? pg(lang).aPopWB.replace('{c}', name).replace('{pop}', num(lang, c.population.value)).replace('{year}', c.population.year) : c.population.year ? t(lang, 'aPop', { c: name, pop: num(lang, c.population.value), year: c.population.year }) : t(lang, 'aPopNoYear', { c: name, pop: num(lang, c.population.value) })]);
  if (sub) qa.push([t(lang, 'qDivFaq', { c: name, term: tm }), t(lang, 'aDiv', { c: name, n: divs.length, term: tm, list: listJoin(lang, divs.slice(0, 3).map((d) => nm(d.name, lang))) })]);
  qa.push([t(lang, 'qBordersFaq', { c: name }), borders.length ? t(lang, 'aBorders', { c: name, list: listJoin(lang, borders.map((b) => cName(b, lang))) }) : t(lang, 'aNoBorders', { c: name })]);
  const faq = faqBlock(lang, qa);

  const quizLinks = QUIZ_TYPES.map((q) => `<a class="btn ghost" href="${url(lang, `${q.dir}/${c.continent}/`)}">${esc(quizTitle(lang, q.type, c.continent))}</a>`).join('');
  let divBlock = '';
  if (sub) {
    divBlock = `<h2 id="divisions">${esc(t(lang, 'divTitle', { Term: term(c, lang, true), term: tm, c: name }))}</h2><p>${esc(t(lang, 'divCount', { c: name, n: divs.length, term: tm }))}</p>
<div class="cta"><a class="btn" href="${url(lang, `${p}map-quiz/`)}">${esc(t(lang, 'playProvMap', { term: tm }))}</a>${hasCapQuiz(c) ? `<a class="btn ghost" href="${url(lang, `${p}capitals-quiz/`)}">${esc(t(lang, 'playProvCap', { term: tm }))}</a>` : ''}${flagCountries.includes(c.iso2) ? `<a class="btn ghost" href="${url(lang, flagQuizPath(c))}">${esc(flagQuizTitle(lang, c))}</a>` : ''}${extraLinks(lang, EXTRA_SETS.filter((x) => x.c === c)).map(([h, n]) => `<a class="btn ghost" href="${url(lang, h)}">${esc(n)}</a>`).join('')}</div>
<p><img src="/maps/p/${c.iso2.toLowerCase()}.svg" alt="${esc(t(lang, 'divTitle', { Term: term(c, lang, true), term: tm, c: name }))}" width="1000" height="${MAP_AR['p-' + c.iso2].split('/')[1]}" loading="lazy" style="background:var(--ocean);border-radius:14px"></p>
${printVersions(lang, [printFor((pr) => pr.kind === 'prov' && pr.c === c), ...EXTRA_SETS.filter((x) => x.c === c).map((x) => printFor((pr) => pr.kind === 'extra' && pr.x === x))])}
<div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thName'))}</th><th>${esc(t(lang, 'divCapital'))}</th><th class="num">${esc(t(lang, 'thPopulation'))}</th><th class="num">${esc(t(lang, 'thArea'))}</th></tr></thead><tbody>${divs.map((d) => `<tr><td>${esc(nm(d.name, lang))}</td><td>${esc(nm(d.capital, lang))}</td><td class="num">${d.population ? num(lang, d.population.value) : ''}</td><td class="num">${d.area ? num(lang, d.area) : ''}</td></tr>`).join('')}</tbody></table></div>`;
  }

  const body = `<h1>${esc(name)}</h1><p class="answer">${esc(capSentence)} ${esc(t(lang, 'inCont', { c: name, cont }))}</p>
<div class="facts"><dl class="kv">${kv.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl><img class="flagbig" src="${flagSrc(c.iso2)}" alt="${esc(t(lang, 'flagAlt', { c: name }))}" width="300" height="225" fetchpriority="high"></div>
<h2>${esc(t(lang, 'playCountryQuizzes', { cont }))}</h2><div class="cta">${quizLinks}</div>
${divBlock}${sub ? '' : printVersions(lang, [printFor((pr) => pr.kind === 'country' && pr.c === c)])}${faq.body}
<h2>${esc(tt(lang, 'moreGames'))}</h2><ul class="links">${COUNTRY_GAMES.map((g) => `<li><a href="${url(lang, `games/${g.key}/`)}">${esc(tt(lang, 'g.' + g.key))}</a></li>`).join('')}</ul>
${listLinks(lang, listsFor(c))}`;

  // Entities, linked to Wikidata so search engines and AI assistants can match them:
  // the country, its capital(s) and its provinces or states.
  const wd = (q) => (q ? [`https://www.wikidata.org/wiki/${q}`] : undefined);
  const ld = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: abs(lang, p), inLanguage: L[lang].hreflang, dateModified: LASTMOD,
    about: {
      '@type': 'Country', name, alternateName: c.name.en !== name ? c.name.en : undefined, sameAs: wd(c.qid), containedInPlace: { '@type': 'Continent', name: cont },
      containsPlace: sub ? divs.map((d) => ({ '@type': 'AdministrativeArea', name: nm(d.name, lang), sameAs: wd(d.qid) })) : undefined,
    },
    mentions: c.capitals.map((k) => ({ '@type': 'City', name: nm(k.name, lang), sameAs: wd(k.qid) })),
    primaryImageOfPage: { '@type': 'ImageObject', url: DOMAIN + flagSrc(c.iso2) },
  };
  page(lang, p, { title, desc, body, preload: flagSrc(c.iso2), nav: 'countries/', crumbs: [{ name: t(lang, 'countriesTitle'), p: 'countries/' }, { name, p }], jsonld: [ld, faq.ld] });
}

// ---------- Provinces ----------
function provinceQuizzes(lang, c) {
  const sub = subdivisions[c.iso2];
  const name = cName(c, lang);
  const tm = term(c, lang);
  const base = `countries/${c.slug}/`;
  const divs = sortBy(lang, sub.divisions, (d) => nm(d.name, lang));
  const crumbsBase = [{ name: t(lang, 'countriesTitle'), p: 'countries/' }, { name, p: base }];
  const table = `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thName'))}</th><th>${esc(t(lang, 'divCapital'))}</th></tr></thead><tbody>${divs.map((d) => `<tr><td>${esc(nm(d.name, lang))}</td><td>${esc(nm(d.capital, lang))}</td></tr>`).join('')}</tbody></table></div>`;
  const other = (p2, key) => `<h2>${esc(t(lang, 'related'))}</h2><ul class="links">${key === 'provCapQuiz' && !hasCapQuiz(c) ? '' : `<li><a href="${url(lang, p2)}">${esc(provQuizTitle(lang, c, key === 'provMapQuiz' ? 'map' : 'cap'))}</a></li>`}<li><a href="${url(lang, base)}">${esc(name)}</a></li>${QUIZ_TYPES.map((q) => `<li><a href="${url(lang, `${q.dir}/${c.continent}/`)}">${esc(quizTitle(lang, q.type, c.continent))}</a></li>`).join('')}</ul>`;

  // Map quiz
  {
    const p = base + 'map-quiz/';
    const onMap = divs.filter((d) => MAP_IDS[c.iso2].has(d.id));
    const title = provQuizTitle(lang, c, 'map');
    const desc = (c.iso2 === 'US' && seo(lang, 'usMapDesc')) || t(lang, 'provMapDesc', { c: name, n: onMap.length, term: tm });
    const data = { type: 'pmap', key: `pmap-${c.iso2}-${lang}`, title, map: `/maps/p/${c.iso2.toLowerCase()}.svg`, ar: MAP_AR['p-' + c.iso2], items: onMap.map((d) => ({ id: d.id, n: nm(d.name, lang) })), s: quizStrings(lang) };
    const faq = faqBlock(lang, [[t(lang, 'qDivFaq', { c: name, term: tm }), t(lang, 'aDiv', { c: name, n: divs.length, term: tm, list: listJoin(lang, divs.slice(0, 3).map((d) => nm(d.name, lang))) })], [t(lang, 'qMapFaq'), t(lang, 'aMap')], [t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
    page(lang, p, { title, desc, script: true, nav: 'provinces/', crumbs: [...crumbsBase, { name: title, p }], jsonld: [quizLd(lang, p, title, desc, name), faq.ld],
      body: `${printAside(lang, printFor((pr) => pr.kind === 'prov' && pr.c === c))}<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data)}${table}${faq.body}${other(base + 'capitals-quiz/', 'provCapQuiz')}` });
  }
  // Capitals quiz (only where enough divisions have a capital to make a quiz)
  if (hasCapQuiz(c)) {
    const p = base + 'capitals-quiz/';
    const withCap = divs.filter((d) => d.capital);
    const title = provQuizTitle(lang, c, 'cap');
    // People also land here searching for the country's own capital: answer that first.
    const caps = capsOf(c, lang);
    const own = caps.length === 1 ? t(lang, 'capitalIs', { c: name, cap: caps[0] }) + ' ' : '';
    const desc = own + ((c.iso2 === 'US' && seo(lang, 'usCapDesc')) || t(lang, 'provCapDesc', { c: name, n: withCap.length, term: tm }));
    const data = { type: 'pcap', key: `pcap-${c.iso2}-${lang}`, title, picMap: `/maps/p/${c.iso2.toLowerCase()}.svg`, items: withCap.map((d) => ({ id: d.id, n: nm(d.name, lang), a: nm(d.capital, lang) })), s: quizStrings(lang) };
    const faq = faqBlock(lang, [[t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
    page(lang, p, { title, desc, script: true, nav: 'provinces/', crumbs: [...crumbsBase, { name: title, p }], jsonld: [quizLd(lang, p, title, desc, name), faq.ld],
      body: `${printAside(lang, printFor((pr) => pr.kind === 'prov' && pr.c === c))}<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data, coverImg(`/img/p/${c.iso2.toLowerCase()}-capitals.svg`, '#3F4A5A'))}${table}${faq.body}${other(base + 'map-quiz/', 'provMapQuiz')}` });
  }
}

// ---------- Division flag quizzes (US state flags...) ----------
// The six smallest flag files (SVG before PNG), so the cover picture loads fast.
const flagBytes = (c, d) => fs.statSync(path.join(__dirname, 'data', 'division-flags', c.iso2.toLowerCase(), divisionFlags[c.iso2][d.id].file)).size;
const lightestFlags = (c) => [...subdivisions[c.iso2].divisions].sort((x, y) => flagBytes(c, x) - flagBytes(c, y)).slice(0, 6);
const flagQuizPath = (c) => `countries/${c.slug}/flags-quiz/`;
function flagQuizTitle(lang, c) {
  if (c.iso2 === 'US' && seo(lang, 'usFlags')) return seo(lang, 'usFlags');
  return t(lang, 'provFlagQuiz', { c: cName(c, lang), term: term(c, lang), Term: term(c, lang, true) });
}
function divisionFlagQuiz(lang, c) {
  const p = flagQuizPath(c);
  const name = cName(c, lang);
  const meta = divisionFlags[c.iso2];
  const divs = sortBy(lang, subdivisions[c.iso2].divisions, (d) => nm(d.name, lang));
  const title = flagQuizTitle(lang, c);
  const desc = t(lang, 'provFlagDesc', { c: name, term: term(c, lang), Term: term(c, lang, true), n: divs.length });
  const base = `img/dflags/${c.iso2.toLowerCase()}/`;
  const data = { type: 'flags', key: `dflags-${c.iso2}-${lang}`, title, imgBase: base, items: divs.map((d) => ({ id: d.id, n: nm(d.name, lang), img: meta[d.id].file })), s: { ...quizStrings(lang), qFlag: t(lang, 'qDivFlag') } };
  const answers = `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><ul class="links">${divs.map((d) => `<li><img class="df" src="/${base}${meta[d.id].file}" alt="${esc(t(lang, 'flagAlt', { c: nm(d.name, lang) }))}" width="28" height="21" loading="lazy">${esc(nm(d.name, lang))}</li>`).join('')}</ul>`;
  // Each image's author and licence, as Wikimedia Commons asks.
  const credits = `<details class="note credits"><summary>${esc(t(lang, 'flagCredits'))}: Wikimedia Commons</summary><ul>${divs.map((d) => { const m = meta[d.id]; return `<li>${esc(nm(d.name, lang))}: <a href="${esc(m.page)}" rel="nofollow">${esc(m.commons)}</a>${m.author ? ', ' + esc(m.author) : ''}${m.license ? ' (' + esc(m.license) + ')' : ''}</li>`; }).join('')}</ul></details>`;
  const faq = faqBlock(lang, [[t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
  const related = `<h2>${esc(t(lang, 'related'))}</h2><ul class="links"><li><a href="${url(lang, `countries/${c.slug}/map-quiz/`)}">${esc(provQuizTitle(lang, c, 'map'))}</a></li>${hasCapQuiz(c) ? `<li><a href="${url(lang, `countries/${c.slug}/capitals-quiz/`)}">${esc(provQuizTitle(lang, c, 'cap'))}</a></li>` : ''}<li><a href="${url(lang, `countries/${c.slug}/`)}">${esc(name)}</a></li></ul>`;
  page(lang, p, { title, desc, script: true, nav: 'provinces/', crumbs: [{ name: t(lang, 'countriesTitle'), p: 'countries/' }, { name, p: `countries/${c.slug}/` }, { name: title, p }],
    jsonld: [quizLd(lang, p, title, desc, name), faq.ld], body: `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data, coverFlags(lightestFlags(c).map((d) => `/${base}${meta[d.id].file}`)))}${answers}${credits}${faq.body}${related}` });
}

// ---------- Printable maps (/printables/) ----------
// One page per quiz map: the map in black and white (src/print.js numbers each place) with the
// list of names, as a blank map, a worksheet or an answer key, ready to print or save as PDF.
function printList() {
  const out = [];
  for (const s of QUIZ_SCOPES) out.push({ kind: 'scope', s, p: `printables/maps/${s}/`, src: `/maps/${s}.svg`, ar: MAP_AR[s], thumb: s === 'world' ? '/img/games/countries.svg' : `/img/c/${s}.svg`, quiz: `maps/${s}/` });
  for (const c of provCountries) out.push({ kind: 'prov', c, p: `printables/countries/${c.slug}/`, src: `/maps/p/${c.iso2.toLowerCase()}.svg`, ar: MAP_AR['p-' + c.iso2], thumb: `/img/p/${c.iso2.toLowerCase()}.svg`, quiz: `countries/${c.slug}/map-quiz/` });
  for (const c of countries.filter((x) => COUNTRY_PRINTS.has(x.iso2))) out.push({ kind: 'country', c, p: `printables/countries/${c.slug}/`, src: `/maps/c/${c.iso2.toLowerCase()}.svg`, ar: '1000/700', thumb: shapeSrc(c.iso2), quiz: `capitals/${c.continent}/` });
  for (const x of EXTRA_SETS) out.push({ kind: 'extra', x, p: `printables/countries/${x.c.slug}/${x.slug}/`, src: `/maps/x/${x.key}.svg`, ar: MAP_AR['x-' + x.key], thumb: `/img/x/${x.key}.svg`, quiz: extraPath(x) });
  return out;
}
let PRINTS = null;
const printsOf = () => (PRINTS = PRINTS || printList());
const printFor = (match) => printsOf().find(match);
function printInfo(lang, pr) {
  if (pr.kind === 'scope') {
    const items = inScope(pr.s).map((c) => ({ id: c.iso2, n: cName(c, lang) }));
    return { items, title: t(lang, 'printTitle', { of: L[lang].of[pr.s] }), desc: pr.s === 'world' ? t(lang, 'printDescWorld') : t(lang, 'printDesc', { of: L[lang].of[pr.s], n: items.length }) };
  }
  if (pr.kind === 'country') {
    const items = pr.c.capitals.filter((k) => capCoords[k.qid]).map((k) => ({ id: k.qid, n: nm(k.name, lang) }));
    return { items, title: t(lang, 'printCountryTitle', { c: cName(pr.c, lang) }), desc: t(lang, 'printCountryDesc', { c: cName(pr.c, lang), cap: listJoin(lang, capsOf(pr.c, lang)) }) };
  }
  const isX = pr.kind === 'extra';
  const divs = isX ? pr.x.divisions.filter((d) => MAP_IDS['x-' + pr.x.key].has(d.id)) : subdivisions[pr.c.iso2].divisions.filter((d) => MAP_IDS[pr.c.iso2].has(d.id));
  const items = divs.map((d) => ({ id: d.id, n: nm(d.name, lang) }));
  const v = isX ? { c: extraPlace(lang, pr.x), term: L[lang].term[pr.x.term], Term: L[lang].Term[pr.x.term] } : { c: cName(pr.c, lang), term: term(pr.c, lang), Term: term(pr.c, lang, true) };
  return { items, title: t(lang, 'printProvTitle', v), desc: t(lang, 'printProvDesc', { ...v, n: items.length }) };
}
// The small "Printable map" box at the top right of a quiz page.
function printAside(lang, pr) {
  if (!pr) return '';
  return `<a class="paside" href="${url(lang, pr.p)}"><img src="${pr.thumb}" alt="" width="160" height="96" loading="lazy"><span>${esc(t(lang, 'printLink'))}</span></a>`;
}
// The printable maps of a country page, each with its four versions as direct links.
function printVersions(lang, prints) {
  const list = prints.filter(Boolean);
  if (!list.length) return '';
  const modes = [['blank', 'modeBlank'], ['worksheet', 'modeWorksheet'], ['labeled', 'modeLabeled'], ['answers', 'modeAnswers']];
  return `<h2>${esc(t(lang, 'printHubTitle'))}</h2>` + list.map((pr) => `<div class="pver"><a class="pver-t" href="${url(lang, pr.p)}"><img src="${pr.thumb}" alt="" width="120" height="72" loading="lazy"><span>${esc(printInfo(lang, pr).title)}</span></a><span class="pver-l">${modes.map(([m, k]) => `<a href="${url(lang, pr.p)}#${m}">${esc(t(lang, k))}</a>`).join('')}</span></div>`).join('');
}
// "About this printable map": what each version is for and how to use it. Maps with more than
// 80 places number only the places big enough for a number (see src/print.js), so their text
// gives no count.
function printAbout(lang, pr, n) {
  const how = pr.kind === 'country' ? t(lang, 'pAboutCountry')
    : n > 80 ? t(lang, 'pAboutMany') + (pr.kind === 'scope' && pr.s === 'world' ? ' ' + t(lang, 'pAboutSmall') : '')
    : t(lang, 'pAboutN', { n });
  return `<section class="pabout"><h2>${esc(t(lang, 'pAboutH'))}</h2><p>${esc(how)}</p><p>${esc(t(lang, 'pAboutUse'))}</p>`
    + `<p><a href="${url(lang, pr.quiz)}">${esc(t(lang, 'pAboutQuiz'))}</a></p></section>`;
}
function printPage(lang, pr) {
  const { items, title, desc } = printInfo(lang, pr);
  const list = sortBy(lang, items, (x) => x.n);
  const [w, h] = (pr.ar || '1000/600').split('/').map(Number);
  const modes = ['blank', 'worksheet', 'labeled', 'answers'].map((m) => `<button type="button" data-mode="${m}" aria-pressed="${m === 'worksheet'}">${esc(t(lang, { blank: 'modeBlank', worksheet: 'modeWorksheet', labeled: 'modeLabeled', answers: 'modeAnswers' }[m]))}</button>`).join('');
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>`
    + `<div class="pctl"><div class="seg" role="group" aria-label="${esc(title)}">${modes}</div><button class="btn" type="button" data-print>${esc(t(lang, 'printBtn'))}</button><a class="btn ghost" href="${url(lang, pr.quiz)}">${esc(t(lang, 'printQuizLink'))}</a></div>`
    + `<p class="note ptip">${esc(t(lang, 'printTip'))}</p>`
    + (w > h * 1.15 ? '<style>@page{size:landscape}@media print{.pmap svg{max-height:160mm}}</style>' : '')
    + `<div class="pmap" data-src="${pr.src}"><img src="${pr.src}" alt="${esc(title)}" width="${w}" height="${h}" decoding="async" fetchpriority="low"></div>`
    + `<ol class="pkey">${list.map((x) => `<li data-id="${esc(x.id)}"><span class="nm">${esc(x.n)}</span></li>`).join('')}</ol>`
    + printAbout(lang, pr, items.length);
  const crumbs = [{ name: t(lang, 'printHubTitle'), p: 'printables/' }, { name: title, p: pr.p }];
  const ld = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: desc, url: abs(lang, pr.p), inLanguage: L[lang].hreflang, dateModified: LASTMOD, publisher: ORG,
    primaryImageOfPage: { '@type': 'ImageObject', url: DOMAIN + pr.src }, learningResourceType: 'Worksheet', isAccessibleForFree: true };
  page(lang, pr.p, { title, desc, body, crumbs, jsonld: [ld], nav: 'printables/', printJs: true });
}
function printHub(lang) {
  const p = 'printables/';
  const title = t(lang, 'printHubTitle');
  const desc = t(lang, 'printHubDesc', { m: provCountries.length });
  const stamp = (pr, i) => `<a class="stamp" href="${url(lang, pr.p)}"><span class="perf"><span class="art" style="--tile:#2B5F73"><img src="${pr.thumb}" alt="" width="320" height="190"${i < 2 ? '' : ' loading="lazy"'}></span><span class="cap">${esc(printInfo(lang, pr).title)}</span></span></a>`;
  const scopes = printsOf().filter((pr) => pr.kind === 'scope');
  const rest = sortBy(lang, printsOf().filter((pr) => pr.kind === 'prov' || pr.kind === 'extra'), (pr) => printInfo(lang, pr).title);
  const small = sortBy(lang, printsOf().filter((pr) => pr.kind === 'country'), (pr) => printInfo(lang, pr).title);
  const flagOf = (pr) => (pr.kind === 'extra' ? pr.x.c : pr.c).iso2;
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>`
    + `<h2>${esc(t(lang, 'printSecCont'))}</h2><nav class="stamps" aria-label="${esc(t(lang, 'printSecCont'))}">${scopes.map(stamp).join('')}</nav>`
    + `<h2>${esc(t(lang, 'provTitle'))}</h2><ul class="links">${rest.map((pr) => `<li><img src="${flagSrc(flagOf(pr))}" alt="" width="28" height="21" loading="lazy"><a href="${url(lang, pr.p)}">${esc(printInfo(lang, pr).title)}</a></li>`).join('')}</ul>`
    + `<h2>${esc(t(lang, 'navCountries'))}</h2><ul class="links">${small.map((pr) => `<li><img src="${flagSrc(flagOf(pr))}" alt="" width="28" height="21" loading="lazy"><a href="${url(lang, pr.p)}">${esc(printInfo(lang, pr).title)}</a></li>`).join('')}</ul>`;
  page(lang, p, { title, desc, body, nav: p, crumbs: [{ name: title, p }] });
}

// ---------- Extra map quizzes (islands of Hawaii, counties of England...) ----------
const extraPath = (x) => `countries/${x.c.slug}/${x.slug}/`;
function extraPlace(lang, x) {
  const parent = x.parent && subdivisions[x.country] && subdivisions[x.country].divisions.find((d) => d.iso === x.parent);
  return parent ? nm(parent.name, lang) : cName(x.c, lang);
}
const extraTitle = (lang, x) => t(lang, 'provMapQuiz', { c: extraPlace(lang, x), term: L[lang].term[x.term], Term: L[lang].Term[x.term] });
const extraCapPath = (x) => `countries/${x.c.slug}/${x.capSlug}/`;
const extraCapTitle = (lang, x) => t(lang, 'provCapQuiz', { c: extraPlace(lang, x), term: L[lang].term[x.term], Term: L[lang].Term[x.term] });
const extraHasCap = (x) => x.capSlug && x.divisions.filter((d) => d.capital).length >= 4;
// Links to every quiz made from the extra sets (map quiz, then capitals quiz where there is one).
const extraLinks = (lang, sets) => sets.flatMap((x) => [[extraPath(x), extraTitle(lang, x)], ...(extraHasCap(x) ? [[extraCapPath(x), extraCapTitle(lang, x)]] : [])]);
function extraCapQuiz(lang, x) {
  const p = extraCapPath(x);
  const name = cName(x.c, lang);
  const place = extraPlace(lang, x);
  const withCap = sortBy(lang, x.divisions.filter((d) => d.capital), (d) => nm(d.name, lang));
  const title = extraCapTitle(lang, x);
  const desc = t(lang, 'provCapDesc', { c: place, n: withCap.length, term: L[lang].term[x.term] });
  const data = { type: 'pcap', key: `xcap-${x.key}-${lang}`, title, picMap: `/maps/x/${x.key}.svg`, items: withCap.map((d) => ({ id: d.id, n: nm(d.name, lang), a: nm(d.capital, lang) })), s: quizStrings(lang) };
  const table = `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thName'))}</th><th>${esc(t(lang, 'divCapital'))}</th></tr></thead><tbody>${withCap.map((d) => `<tr><td>${esc(nm(d.name, lang))}</td><td>${esc(nm(d.capital, lang))}</td></tr>`).join('')}</tbody></table></div>`;
  const faq = faqBlock(lang, [[t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
  const related = `<h2>${esc(t(lang, 'related'))}</h2><ul class="links"><li><a href="${url(lang, extraPath(x))}">${esc(extraTitle(lang, x))}</a></li>${hasProv.has(x.country) ? `<li><a href="${url(lang, `countries/${x.c.slug}/map-quiz/`)}">${esc(provQuizTitle(lang, x.c, 'map'))}</a></li>` : ''}<li><a href="${url(lang, `countries/${x.c.slug}/`)}">${esc(name)}</a></li></ul>`;
  page(lang, p, { title, desc, script: true, nav: 'maps/', crumbs: [{ name: t(lang, 'countriesTitle'), p: 'countries/' }, { name, p: `countries/${x.c.slug}/` }, { name: title, p }],
    jsonld: [quizLd(lang, p, title, desc, place), faq.ld], body: `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data, coverImg(`/img/x/${x.key}-capitals.svg`, '#3F4A5A'))}${table}${faq.body}${related}` });
}
function extraMapQuiz(lang, x) {
  const p = extraPath(x);
  const name = cName(x.c, lang);
  const place = extraPlace(lang, x);
  const divs = sortBy(lang, x.divisions, (d) => nm(d.name, lang));
  const onMap = divs.filter((d) => MAP_IDS['x-' + x.key].has(d.id));
  const title = extraTitle(lang, x);
  const desc = t(lang, 'setMapDesc', { c: place, n: onMap.length, term: L[lang].term[x.term] });
  const data = { type: 'pmap', key: `x-${x.key}-${lang}`, title, map: `/maps/x/${x.key}.svg`, ar: MAP_AR['x-' + x.key], items: onMap.map((d) => ({ id: d.id, n: nm(d.name, lang) })), s: quizStrings(lang) };
  const answers = `<h2 id="answers">${esc(t(lang, 'answersTitle'))}</h2><ul class="links">${onMap.map((d) => `<li>${esc(nm(d.name, lang))}</li>`).join('')}</ul>`;
  const tmX = L[lang].term[x.term];
  const faq = faqBlock(lang, [[t(lang, 'qSetFaq', { c: place, term: tmX }), t(lang, 'aSetFaq', { c: place, n: onMap.length, term: tmX, list: listJoin(lang, onMap.slice(0, 3).map((d) => nm(d.name, lang))) })], [t(lang, 'qMapFaq'), t(lang, 'aMap')], [t(lang, 'qScoreFaq'), t(lang, 'aScore')]]);
  const others = EXTRA_SETS.filter((e) => e !== x);
  const related = `<h2>${esc(t(lang, 'related'))}</h2><ul class="links">${hasProv.has(x.country) ? `<li><a href="${url(lang, `countries/${x.c.slug}/map-quiz/`)}">${esc(provQuizTitle(lang, x.c, 'map'))}</a></li>` : ''}<li><a href="${url(lang, `countries/${x.c.slug}/`)}">${esc(name)}</a></li>${extraLinks(lang, [x]).slice(1).concat(extraLinks(lang, others)).map(([h, n]) => `<li><a href="${url(lang, h)}">${esc(n)}</a></li>`).join('')}</ul>`;
  page(lang, p, { title, desc, script: true, nav: 'maps/', crumbs: [{ name: t(lang, 'countriesTitle'), p: 'countries/' }, { name, p: `countries/${x.c.slug}/` }, { name: title, p }],
    jsonld: [quizLd(lang, p, title, desc, place), faq.ld], body: `${printAside(lang, printFor((pr) => pr.kind === 'extra' && pr.x === x))}<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${gameShell(lang, data)}${answers}${faq.body}${related}` });
}

function provincesHub(lang) {
  const p = 'provinces/';
  const title = t(lang, 'provTitle');
  const last = provLargest[provLargest.length - 1];
  const desc = t(lang, 'provHubDesc', { n: provCountries.length, last: last ? cName(last, lang) : '' });
  const rows = provCountries.map((c) => `<tr><td><img src="${flagSrc(c.iso2)}" alt="" width="32" height="24" loading="lazy"></td><td><a href="${url(lang, `countries/${c.slug}/#divisions`)}">${esc(cName(c, lang))}</a></td><td class="num">${subdivisions[c.iso2].divisions.length}</td><td><a href="${url(lang, `countries/${c.slug}/map-quiz/`)}">${esc(t(lang, 'typeMaps'))}</a></td><td>${hasCapQuiz(c) ? `<a href="${url(lang, `countries/${c.slug}/capitals-quiz/`)}">${esc(t(lang, 'typeCapitals'))}</a>` : ''}</td></tr>`).join('');
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p><div class="tbl"><table><thead><tr><th>${esc(t(lang, 'thFlag'))}</th><th>${esc(t(lang, 'thCountry'))}</th><th class="num">#</th><th>${esc(t(lang, 'typeMaps'))}</th><th>${esc(t(lang, 'typeCapitals'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  page(lang, p, { title, desc, body, nav: p, crumbs: [{ name: title, p }] });
}

// ---------- About ----------
function about(lang) {
  const p = 'about/';
  const title = t(lang, 'aboutTitle');
  const desc = t(lang, 'aboutDesc');
  // Two sections have their current text in src/i18n-pages.js: names, capitals and population
  // (the second), and the maps section (the one naming Natural Earth), which states the owner's
  // border policy.
  const secs = L[lang].about.map(([h, txt], i) => [h, i === 1 ? pg(lang).aboutData : txt.includes('Natural Earth') ? pg(lang).aboutMaps : txt]).map(([h, txt]) => `<h2>${esc(h)}</h2><p>${esc(txt.replace('{n}', countries.length).replace('{d}', dateFmt(lang, DATA_DATE)))}</p>`).join('');
  const lic = provCountries.map((c) => `<li>${esc(cName(c, lang))}: ${esc(subdivisions[c.iso2].source.license || '')}${subdivisions[c.iso2].source.sourceName ? ' · ' + esc(subdivisions[c.iso2].source.sourceName) : ''}</li>`).join('');
  const worldSrc = `<h2>${esc(tt(lang, 'worldGames'))}</h2><p>${esc(tt(lang, 'source', { s: 'Natural Earth (public domain); Wikidata (CC0); RESOLVE Ecoregions 2017 (CC BY 4.0); NASA Planetary Fact Sheet' }))}</p>`;
  // Contact line, once an address is set in site.config.js (contactEmail).
  const contact = config.contactEmail ? `<h2>${esc(t(lang, 'contactTitle'))}</h2><p>${esc(t(lang, 'contactText', { e: '@@EMAIL@@' })).replace('@@EMAIL@@', `<a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`)}</p>` : '';
  const body = `<h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p>${secs}${contact}${worldSrc}<h2>geoBoundaries · OpenStreetMap</h2><ul class="note">${lic}${EXTRA_SETS.map((x) => `<li>${esc(extraTitle(lang, x))}: ${esc(x.source.license)} · ${esc(x.source.sourceName)}</li>`).join('')}</ul>${flagCountries.length ? `<h2>Wikimedia Commons</h2><ul class="note">${flagCountries.map((iso2) => `<li><a href="${url(lang, flagQuizPath(byIso[iso2]))}">${esc(flagQuizTitle(lang, byIso[iso2]))}</a></li>`).join('')}</ul>` : ''}`;
  page(lang, p, { title, desc, body, crumbs: [{ name: title, p }], jsonld: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: title, url: abs(lang, p), inLanguage: L[lang].hreflang, dateModified: LASTMOD, publisher: ORG }] });
}

// ---------- About us and Privacy policy ----------
// Text in src/i18n-pages.js. PRIVACY_DATE is the date the policy last changed: update it with
// any change to what the site collects or stores.
const PAGES = require('./src/i18n-pages');
const PRIVACY_DATE = '2026-10-09';
const pg = (lang) => PAGES[lang] || PAGES.en;
function fillPage(lang, txt) {
  const mail = config.contactEmail ? `<a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>` : '';
  return esc(txt.replace('{n}', countries.length).replace('{p}', provCountries.length).replace('{l}', LANGS.length).replace('{d}', dateFmt(lang, PRIVACY_DATE)))
    .replace('{e}', mail);
}
function aboutUs(lang) {
  const P = pg(lang), p = 'about-us/';
  const body = `<h1>${esc(P.usTitle)}</h1><p class="lede">${esc(P.usDesc)}</p>`
    + P.us.map(([h, txt]) => `<h2>${esc(h)}</h2><p>${fillPage(lang, txt)}</p>`).join('')
    + `<p><a href="${url(lang, 'about/')}">${esc(P.usSources)}</a></p>`;
  page(lang, p, { title: P.usTitle, desc: P.usDesc, body, crumbs: [{ name: P.usTitle, p }],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: P.usTitle, description: P.usDesc, url: abs(lang, p), inLanguage: L[lang].hreflang, dateModified: LASTMOD, about: ORG, publisher: ORG }] });
}
function privacy(lang) {
  const P = pg(lang), p = 'privacy/';
  const body = `<h1>${esc(P.pvTitle)}</h1><p class="lede">${esc(P.pvDesc)}</p><p class="note">${fillPage(lang, P.pvDate)}</p>`
    + P.pv.map(([h, txt]) => `<h2>${esc(h)}</h2><p>${fillPage(lang, txt)}</p>`).join('');
  page(lang, p, { title: P.pvTitle, desc: P.pvDesc, body, crumbs: [{ name: P.pvTitle, p }],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: P.pvTitle, description: P.pvDesc, url: abs(lang, p), inLanguage: L[lang].hreflang, dateModified: PRIVACY_DATE, publisher: ORG }] });
}

// ---------- Static files ----------
function statics() {
  // Flags: only the countries on the site.
  const flagDir = path.dirname(require.resolve('flag-icons/package.json')) + '/flags/4x3/';
  fs.mkdirSync(path.join(DIST, 'flags'), { recursive: true });
  for (const c of countries) fs.copyFileSync(flagDir + c.iso2.toLowerCase() + '.svg', path.join(DIST, 'flags', c.iso2.toLowerCase() + '.svg'));
  write('app.js', fs.readFileSync(path.join(__dirname, 'src', 'app.js'), 'utf8'));
  write('search.js', fs.readFileSync(path.join(__dirname, 'src', 'search.js'), 'utf8'));
  if (config.gaId) write('ga.js', GA_JS);
  write('print.js', fs.readFileSync(path.join(__dirname, 'src', 'print.js'), 'utf8'));
  for (const lang of LANGS) write(`search/${lang}.json`, JSON.stringify(SEARCH[lang].sort((a, b) => a[2] - b[2])));
  fs.copyFileSync(path.join(__dirname, 'brand', 'logo-512-background.png'), path.join(DIST, 'logo.png'));
  // Pinterest pin images (scripts/pin-images.js), served so brand/pins/pins.csv can bulk-upload them.
  const pinDir = path.join(__dirname, 'brand', 'pins');
  if (fs.existsSync(pinDir)) {
    fs.mkdirSync(path.join(DIST, 'img', 'pins'), { recursive: true });
    for (const f of fs.readdirSync(pinDir).filter((x) => x.endsWith('.png'))) fs.copyFileSync(path.join(pinDir, f), path.join(DIST, 'img', 'pins', f));
  }
  write('favicon.svg',LOGO.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true"', ''));

  const bots = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'CCBot', 'DuckDuckBot', 'YandexBot', 'Baiduspider'];
  write('robots.txt', `${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nUser-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);

  // Sitemaps: one per language, each URL with its alternates.
  const alt = (p) => LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${L[l].hreflang}" href="${abs(l, p)}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${abs('en', p)}"/>`;
  for (const l of LANGS) write(`sitemap-${l}.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemap[l].map((p) => `<url><loc>${abs(l, p)}</loc><lastmod>${pageDate[l][p]}</lastmod>${alt(p)}</url>`).join('\n')}\n</urlset>\n`);
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${LANGS.map((l) => `<sitemap><loc>${DOMAIN}/sitemap-${l}.xml</loc><lastmod>${Object.values(pageDate[l]).sort().pop()}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`);

  // Dates for the next build (only pages that still exist).
  fs.writeFileSync(lastmodFile, JSON.stringify(Object.fromEntries(Object.keys(lastmodNext).sort().map((k) => [k, lastmodNext[k]]))) + '\n');

  write('llms.txt', `# ${SITE}

> Free geography quizzes: flags, capital cities, click-the-country maps, and province/state quizzes. ${countries.length} countries (193 UN members plus Vatican City and Palestine), and first-level divisions with capitals for ${provCountries.length} countries, large and small. Available in ${LANGS.length} languages: ${LANGS.map((l) => L[l].native).join(', ')}.

## Key pages
- [Countries of the world](${abs('en', 'countries/')}): capital, flag, continent, area and population of every country
- [All capitals](${abs('en', 'capitals/')}): full country and capital table
- [All flags](${abs('en', 'flags/')}): every flag with its country
- [Provinces and states](${abs('en', 'provinces/')}): ${provCountries.length} countries with divisions, capitals, population and area
- [World games](${abs('en', 'world/')}): ${WORLD_GAMES.map((g) => tt('en', 'g.' + g.key)).join(', ')}
- Country games: ${COUNTRY_GAMES.map((g) => `[${tt('en', 'g.' + g.key)}](${abs('en', `games/${g.key}/`)})`).join(', ')}
- [Country lists and rankings](${abs('en', 'lists/')}): ${LISTS.map((l) => `[${listTitle('en', l)}](${abs('en', listPath(l))})`).join(', ')}
- [Printable maps and worksheets](${abs('en', 'printables/')}): free printable maps of the world, every continent, the provinces and states of ${provCountries.length} countries and outline maps of smaller countries, each as a blank map, numbered worksheet, labelled map and answer key
- [Key facts for every country as plain text](${DOMAIN}/llms-full.txt)
- [Sources and methodology](${abs('en', 'about/')})

## URL patterns
- Country facts: ${DOMAIN}/countries/{country-slug}/ (e.g. ${abs('en', 'countries/pakistan/')})
- Province/state list and capitals: ${DOMAIN}/countries/{country-slug}/#divisions
- Quizzes: ${DOMAIN}/{flags|capitals|maps}/{world|africa|asia|europe|north-america|south-america|oceania}/
- Other languages: prefix the path with ${LANGS.slice(1).map((l) => `/${l}/`).join(', ')}

## Data sources
- Names, capitals and province data: Wikidata (CC0), fetched ${DATA_DATE}
- Country population: World Bank (CC BY 4.0), latest year, the same year for every country (Vatican City: Wikidata)
- Country codes, area, borders, languages, currencies: world-countries (ODbL), with corrections where it differs from official sources
- Country boundaries: Natural Earth 1:50m (public domain). Province boundaries: geoBoundaries ADM1 (gbOpen), or OpenStreetMap (ODbL) via Wikidata for countries whose divisions changed after the geoBoundaries release. Division flags: Wikimedia Commons (author and licence listed on each flag quiz page)
- Flags: flag-icons (MIT)
`);

  // One plain-text line of key facts per country, for AI assistants to read and cite.
  const factLine = (c) => {
    const bits = [`Capital: ${capsOf(c, 'en').join(', ')}`, `Continent: ${L.en.cont[c.continent]}`, `Area: ${num('en', c.area)} km²`];
    if (c.population) bits.push(`Population: ${num('en', c.population.value)}${c.population.year ? ` (${c.population.year})` : ''}`);
    if (c.currencies.length) bits.push(`Currency: ${currencyOf('en', c).join(', ')}`);
    const langs = langNamesFor('en', c.iso2);
    if (langs.length) bits.push(`Official languages: ${langs.join(', ')}`);
    bits.push(`Land neighbours: ${c.borders.map((b) => byIso[b] && byIso[b].name.en).filter(Boolean).join(', ') || 'none'}`);
    bits.push(`Landlocked: ${c.landlocked ? 'yes' : 'no'}`);
    if (hasProv.has(c.iso2)) bits.push(`First-level divisions: ${subdivisions[c.iso2].divisions.length}`);
    return `- [${c.name.en}](${abs('en', `countries/${c.slug}/`)}): ${bits.join('; ')}.`;
  };
  write('llms-full.txt', `# ${SITE}: key facts for ${countries.length} countries

> Data: Wikidata (CC0) for names and capitals, fetched ${DATA_DATE}; World Bank (CC BY 4.0) for population, the same year for every country; world-countries (ODbL, with corrections) for area, borders, languages and currencies. Each line links to the country's page, which has its flag, map, provinces and quizzes.

${sortBy('en', countries, (c) => c.name.en).map(factLine).join('\n')}
`);

  // IndexNow key file (see scripts/indexnow.js).
  if (config.indexNowKey) write(`${config.indexNowKey}.txt`, config.indexNowKey);

  // One 301 from http and from alias hostnames (www) to https on the main domain, keeping the path.
  const host = DOMAIN.replace(/^https?:\/\//, '');
  const aliasConds = (config.aliasDomains || []).map((d) => `RewriteCond %{HTTP_HOST} ^${d.replace(/\./g, '\\.')}$ [NC,OR]`).join('\n');
  const redirects = `<IfModule mod_rewrite.c>
RewriteEngine On
${aliasConds ? aliasConds + '\n' : ''}RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://${host}/$1 [R=301,L]
</IfModule>
`;
  write('.htaccess', `${redirects}ErrorDocument 404 /404.html
Options -Indexes
AddType image/svg+xml .svg
<IfModule mod_headers.c>
Header always set Strict-Transport-Security "max-age=31536000"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Content-Security-Policy "${CSP}"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain application/json
</IfModule>
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/html "access plus 1 hour"
ExpiresByType image/svg+xml "access plus 30 days"
ExpiresByType application/javascript "access plus 1 year"
</IfModule>
`);
}

function notFound() {
  const lang = 'en';
  const body = `<h1>${esc(t(lang, 'notFound'))}</h1><p>${esc(t(lang, 'notFoundText'))}</p><p><a class="btn" href="/">${esc(t(lang, 'backHome'))}</a></p>`;
  page(lang, '404-tmp/', { title: t(lang, 'notFound'), desc: t(lang, 'notFoundText'), body, noindex: true });
  fs.renameSync(path.join(DIST, '404-tmp', 'index.html'), path.join(DIST, '404.html'));
  fs.rmSync(path.join(DIST, '404-tmp'), { recursive: true });
}

// ---------- Main ----------
(async () => {
  const t0 = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  for (const s of QUIZ_SCOPES) {
    const svg = await continentSvg(s, inScope(s));
    write(`maps/${s}.svg`, svg);
    const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    MAP_AR[s] = `${vb[1]}/${vb[2]}`;
  }
  for (const c of provCountries) {
    const { svg, ids } = await adm1Svg(c.iso3, subdivisions[c.iso2].divisions);
    MAP_IDS[c.iso2] = new Set(ids);
    write(`maps/p/${c.iso2.toLowerCase()}.svg`, svg);
    const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    MAP_AR['p-' + c.iso2] = `${vb[1]}/${vb[2]}`;
    write(`img/p/${c.iso2.toLowerCase()}.svg`, await adm1Thumb(c.iso3, subdivisions[c.iso2].divisions));
  }
  // Card pictures for the continent pages.
  for (const c of provCountries) write(`img/p/${c.iso2.toLowerCase()}-capitals.svg`, addStar(fs.readFileSync(path.join(DIST, 'img', 'p', `${c.iso2.toLowerCase()}.svg`), 'utf8')));
  for (const x of EXTRA_SETS) {
    const file = path.join(__dirname, 'data', 'geo', `extra-${x.key}.json`);
    const { svg, ids } = await adm1Svg('x-' + x.key, x.divisions, { file });
    MAP_IDS['x-' + x.key] = new Set(ids);
    write(`maps/x/${x.key}.svg`, svg);
    const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    MAP_AR['x-' + x.key] = `${vb[1]}/${vb[2]}`;
    write(`img/x/${x.key}.svg`, await adm1Thumb('x-' + x.key, x.divisions, { file }));
    if (extraHasCap(x)) write(`img/x/${x.key}-capitals.svg`, addStar(fs.readFileSync(path.join(DIST, 'img', 'x', `${x.key}.svg`), 'utf8')));
  }
  for (const iso2 of flagCountries) {
    const dir = path.join(__dirname, 'data', 'division-flags', iso2.toLowerCase());
    for (const d of subdivisions[iso2].divisions) write(`img/dflags/${iso2.toLowerCase()}/${divisionFlags[iso2][d.id].file}`, fs.readFileSync(path.join(dir, divisionFlags[iso2][d.id].file)));
  }
  for (const s of QUIZ_SCOPES) {
    if (s === 'world') continue;
    const mine = (iso2) => byIso[iso2] && (s === 'caribbean' ? CARIBBEAN.has(iso2) : byIso[iso2].continent === s);
    write(`img/c/${s}.svg`, await continentThumb(s, mine));
    write(`img/c/${s}-capitals.svg`, await continentThumb(s, mine, 'capitals'));
  }

  for (const r of REGIONS) write(`img/${r.key}.svg`, await regionArt(r.key, (iso2) => byIso[iso2] && inRegion(r, byIso[iso2])));

  // Country games: hemisphere data and stamp art.
  HEMI = await hemispheres();
  for (const l of LISTS.filter((x) => HEMI_LISTS[x.key])) write(`img/lists/${l.key}.svg`, await listMap(new Set(l.rows().map((c) => c.iso2)), { shade: HEMI_LISTS[l.key].shade }));
  const printCaps = {};
  for (const c of countries) if (!hasProv.has(c.iso2)) printCaps[c.iso2] = c.capitals.filter((k) => capCoords[k.qid]).map((k) => ({ id: k.qid, at: capCoords[k.qid] }));
  SHAPES = await countryShapes({ prints: printCaps });
  for (const [iso2, svg] of Object.entries(printCaps)) if (typeof svg === 'string') { write(`maps/c/${iso2.toLowerCase()}.svg`, svg); COUNTRY_PRINTS.add(iso2); }
  // Every outline is written (capitals quizzes show small countries too); the shapes quizzes use only hasShape ones.
  for (const c of countries.filter((x) => SHAPES[x.iso2])) write(`img/shapes/${c.iso2.toLowerCase()}.svg`, SHAPES[c.iso2]);
  for (const g of COUNTRY_GAMES) write(`img/games/${g.key}.svg`, await countryGameArt(g.key, { landlocked: new Set(countries.filter((c) => c.landlocked).map((c) => c.iso2)), neighbours: byIso.FR.borders }));

  // World games: the quiz map for each, and a card image.
  for (const p of planets) write(`img/planets/${p.id}.svg`, planetSvg(p.id));
  for (const g of WORLD_GAMES) {
    let svg;
    let art;
    if (g.type === 'phys') {
      const geoFile = path.join(__dirname, 'data', 'geo', `phys-${g.key}.json`);
      const geo = fs.existsSync(geoFile) ? JSON.parse(fs.readFileSync(geoFile, 'utf8')) : null;
      svg = await physSvg(g.key, physical[g.key], geo);
      art = await physSvg(g.key, physical[g.key], geo && JSON.parse(JSON.stringify(geo)), { art: true });
    } else if (g.type === 'latlong') { svg = await latLongSvg(); art = await latLongSvg({ art: true }); }
    else if (g.type === 'diagram') svg = art = DIAGRAMS[g.key].svg();
    else if (g.type === 'solar') svg = art = solarSystemSvg(planets);
    else if (g.key === 'countries') art = fs.readFileSync(path.join(DIST, 'img', 'world.svg'), 'utf8');
    else if (g.key === 'capitals') art = await physSvg('capitals', physical.cities || { kind: 'point', items: [] }, null, { art: true });
    if (svg) {
      write(`maps/w/${g.key}.svg`, svg);
      const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      MAP_AR['w-' + g.key] = `${vb[1]}/${vb[2]}`;
    }
    // Some games read better as an illustration than as a map close-up.
    if (SCENES[g.key]) art = SCENES[g.key]();
    // Shapes card: six outlines on a grid.
    if (g.key === 'shapes') art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190">${['BR', 'IN', 'IT', 'AU', 'JP', 'GB'].map((iso2, i) => SHAPES[iso2].replace('<svg xmlns="http://www.w3.org/2000/svg"', `<svg x="${8 + (i % 3) * 102}" y="${6 + Math.floor(i / 3) * 90}" width="100" height="86"`)).join('')}</svg>`;
    if (art) write(`img/games/${g.key}.svg`, art);
  }

  makeOgCards();

  for (const lang of LANGS) {
    home(lang);
    for (const r of REGIONS) regionHub(lang, r);
    for (const g of WORLD_GAMES) if (g.type !== 'link') worldGame(lang, g);
    for (const g of COUNTRY_GAMES) countryGame(lang, g);
    for (const g of COUNTRY_GAMES.filter((x) => CONT_GAMES.includes(x.key))) for (const s of CONT_KEYS.filter((x) => x !== 'world')) countryGame(lang, g, s);
    listsHub(lang);
    for (const l of LISTS) listPage(lang, l);
    for (const q of QUIZ_TYPES) { hubPage(lang, q); for (const s of QUIZ_SCOPES) continentQuiz(lang, q, s); }
    countriesIndex(lang);
    for (const c of countries) countryPage(lang, c);
    provincesHub(lang);
    for (const c of provCountries) provinceQuizzes(lang, c);
    for (const iso2 of flagCountries) divisionFlagQuiz(lang, byIso[iso2]);
    for (const x of EXTRA_SETS) { extraMapQuiz(lang, x); if (extraHasCap(x)) extraCapQuiz(lang, x); }
    printHub(lang);
    for (const pr of printsOf()) printPage(lang, pr);
    about(lang);
    aboutUs(lang);
    privacy(lang);
    searchPage(lang);
  }
  notFound();
  statics();
  const pages = LANGS.reduce((n, l) => n + sitemap[l].length, 0);
  console.log(`Built ${pages} pages (${provCountries.length} countries with provinces) in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
})();
