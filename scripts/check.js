/*
 * SEO and link audit for dist/. Run after the build: `npm run check`.
 * Fails (exit 1) on errors; prints warnings separately.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const CONFIG = require('../site.config');

const DIST = path.join(__dirname, '..', 'dist');
const SITE = CONFIG.domain.replace(/\/+$/, '');
const errors = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const toUrlPath = (file) => {
  const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};
const exists = (urlPath) => {
  const clean = urlPath.split('#')[0].split('?')[0];
  const p = path.join(DIST, decodeURIComponent(clean));
  return clean.endsWith('/') ? fs.existsSync(path.join(p, 'index.html')) : fs.existsSync(p);
};
const all = (re, s) => Array.from(s.matchAll(re));
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const pages = {};
htmlFiles.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const u = toUrlPath(file);
  const p = { u, html };
  p.noindex = /<meta name="robots" content="noindex/.test(html);
  p.title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  p.desc = (html.match(/<meta name="description" content="([^"]*)">/) || [])[1];
  p.canonical = (html.match(/<link rel="canonical" href="([^"]*)">/) || [])[1];
  p.lang = (html.match(/<html lang="([^"]+)"/) || [])[1];
  p.dir = (html.match(/<html lang="[^"]+" dir="([^"]+)"/) || [])[1];
  p.h1 = all(/<h1[\s>]/g, html).length;
  p.alts = all(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g, html).map((m) => ({ tag: m[1], href: m[2] }));
  pages[u] = p;
});

const titles = {}, descs = {};
Object.values(pages).forEach((p) => {
  const where = p.u;
  if (!p.lang) errors.push(`${where}: missing <html lang>`);
  if (!p.dir) errors.push(`${where}: missing dir attribute`);
  if (p.h1 !== 1) errors.push(`${where}: has ${p.h1} <h1> elements`);
  if (!p.title) errors.push(`${where}: missing <title>`);
  if (!p.desc) errors.push(`${where}: missing meta description`);
  if (/<h[1-6][^>]*>\s*<\/h[1-6]>/.test(p.html)) errors.push(`${where}: empty heading`);
  if (/\s(?:href|src)=""/.test(p.html)) errors.push(`${where}: empty href or src`);
  // A {placeholder} left in the page means a translation used a variable the build didn't pass.
  const leftover = p.html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').match(/\{[A-Za-z]+\}/);
  if (leftover) errors.push(`${where}: unfilled placeholder ${leftover[0]}`);
  // House style: no em or en dashes in visible copy.
  if (/[–—]/.test(p.html.replace(/<script[\s\S]*?<\/script>/g, ''))) errors.push(`${where}: em or en dash in page copy`);

  // JSON-LD must parse.
  all(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, p.html).forEach((m) => {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${where}: invalid JSON-LD`); }
  });
  // Internal links and assets must exist.
  all(/\s(?:href|src)="(\/[^"]*)"/g, p.html).forEach((m) => {
    if (!exists(decode(m[1]))) errors.push(`${where}: broken link ${m[1]}`);
  });

  if (p.noindex) return;

  // Latin-script length guidance (non-Latin scripts are measured differently by Google).
  if (/^(en|es|fr|de|pt|ru|id|it|pl|nl)/.test(p.lang)) {
    if (p.title.length > 65) warnings.push(`${where}: title ${p.title.length} chars`);
    if (decode(p.desc).length > 165) warnings.push(`${where}: description ${decode(p.desc).length} chars`);
  }
  (titles[p.title] = titles[p.title] || []).push(where);
  (descs[p.desc] = descs[p.desc] || []).push(where);

  if (p.canonical !== SITE + p.u) errors.push(`${where}: canonical ${p.canonical} does not match its own URL`);

  // hreflang: self-reference, x-default, targets exist and link back (reciprocity).
  const tags = p.alts.map((a) => a.tag);
  if (new Set(tags).size !== tags.length) errors.push(`${where}: duplicate hreflang values`);
  if (!p.alts.some((a) => a.href === SITE + p.u)) errors.push(`${where}: hreflang set does not include itself`);
  if (!tags.includes('x-default')) errors.push(`${where}: no x-default hreflang`);
  const self = p.alts.find((a) => a.href === SITE + p.u);
  if (self && self.tag !== p.lang) errors.push(`${where}: hreflang ${self.tag} differs from html lang ${p.lang}`);
  p.alts.forEach((a) => {
    const targetPath = a.href.slice(SITE.length);
    const target = pages[targetPath];
    if (!target) { errors.push(`${where}: hreflang target missing ${a.href}`); return; }
    if (target.noindex) errors.push(`${where}: hreflang points to noindex page ${a.href}`);
    if (!target.alts.some((b) => b.href === SITE + p.u)) errors.push(`${where}: ${a.href} does not link back`);
  });
});
Object.entries(titles).forEach(([t, list]) => { if (list.length > 1) errors.push(`Duplicate title "${t}" on ${list.join(', ')}`); });
Object.entries(descs).forEach(([d, list]) => { if (list.length > 1) errors.push(`Duplicate description on ${list.join(', ')}`); });

// Sitemap lists exactly the indexable pages.
// sitemap.xml may be a sitemap index pointing at one sitemap per language.
const rootMap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
let sitemap = rootMap;
if (/<sitemapindex/.test(rootMap)) {
  sitemap = all(/<loc>([^<]+)<\/loc>/g, rootMap).map((m) => {
    const rel = m[1].slice(SITE.length);
    if (!exists(rel)) { errors.push(`Sitemap index lists a missing file ${rel}`); return ''; }
    return fs.readFileSync(path.join(DIST, rel), 'utf8');
  }).join('\n');
}
const locs = new Set(all(/<loc>([^<]+)<\/loc>/g, sitemap).map((m) => m[1]));
const indexable = Object.values(pages).filter((p) => !p.noindex).map((p) => SITE + p.u);
indexable.forEach((u) => { if (!locs.has(u)) errors.push(`Sitemap is missing ${u}`); });
locs.forEach((u) => { if (!indexable.includes(u)) errors.push(`Sitemap lists a non-page ${u}`); });
if (!/Sitemap: /.test(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8'))) errors.push('robots.txt has no Sitemap line');

// Crawl like a search engine from the home page: every indexable page must be reachable (no orphans).
const depth = { '/': 0 };
const queue = ['/'];
while (queue.length) {
  const u = queue.shift();
  const page = pages[u];
  if (!page) continue;
  // Search engines drop the #fragment, so /countries/#asia counts as a link to /countries/.
  all(/<a [^>]*href="(\/[^"#?]*)[^"]*"/g, page.html).forEach((m) => {
    if (!(m[1] in depth)) { depth[m[1]] = depth[u] + 1; queue.push(m[1]); }
  });
}
const orphans = Object.values(pages).filter((p) => !p.noindex && !(p.u in depth)).map((p) => p.u);
orphans.forEach((u) => errors.push(`Orphan page (no internal links reach it): ${u}`));
const maxDepth = Math.max(...Object.values(pages).filter((p) => !p.noindex && p.u in depth).map((p) => depth[p.u]));
if (maxDepth > 3) warnings.push(`Deepest page is ${maxDepth} clicks from the home page, e.g. ${Object.keys(depth).filter((u) => depth[u] === maxDepth).slice(0, 3).join(', ')}`);

// Transfer size once the server compresses it (gzip; Brotli is smaller still).
const zlib = require('zlib');
const sizes = htmlFiles.map((f) => zlib.gzipSync(fs.readFileSync(f)).length);
const avgKb = (sizes.reduce((a, b) => a + b, 0) / sizes.length / 1024).toFixed(1);
const maxKb = (Math.max(...sizes) / 1024).toFixed(1);

console.log(`Checked ${htmlFiles.length} HTML pages, ${locs.size} sitemap URLs.`);
console.log(`Every indexable page is reachable from / in at most ${maxDepth} clicks. Compressed HTML: ${avgKb} KB average, ${maxKb} KB largest.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + warnings.slice(0, 40).join('\n  '));
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ` + errors.slice(0, 60).join('\n  '));
  process.exit(1);
}
console.log('No errors.');
