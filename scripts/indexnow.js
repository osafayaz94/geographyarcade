/*
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver...) about every URL in the sitemaps.
 * Run it only after the new build is live on your domain: `npm run indexnow`.
 * Google doesn't use IndexNow; it discovers pages through the sitemap in Search Console.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const CONFIG = require('../site.config');

const SITE = CONFIG.domain.replace(/\/+$/, '');
const KEY = CONFIG.indexNowKey;

if (/example\.com/.test(SITE)) { console.error('Set domain in site.config.js first.'); process.exit(1); }
if (!KEY) { console.error('Set indexNowKey in site.config.js first.'); process.exit(1); }

// sitemap.xml is an index; the page URLs are in the per-language sitemaps next to it (and in
// sitemap-held.xml, the pages held back from Google only).
// Only the pages that changed in this build are sent: Bing asks sites not to send everything in one
// batch on every deploy. A page that changed carries the build's date as its lastmod, the newest date
// in the sitemaps; unchanged pages keep their older date. --all sends every URL (first setup only).
const dist = path.join(__dirname, '..', 'dist');
const entries = fs.readdirSync(dist).filter((f) => /^sitemap-.+\.xml$/.test(f)).flatMap((f) =>
  Array.from(fs.readFileSync(path.join(dist, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g), (m) => ({ url: m[1], date: m[2] || '' })));
const newest = entries.reduce((d, e) => (e.date > d ? e.date : d), '');
const recent = newest && Date.now() - Date.parse(newest + 'T00:00:00Z') < 2 * 864e5;
const urls = process.argv.includes('--all') ? entries.map((e) => e.url) : recent ? entries.filter((e) => e.date === newest).map((e) => e.url) : [];
console.log(`${entries.length} page URLs in the sitemaps; ${urls.length} changed in this build (${newest || 'no dates'}).`);
if (!urls.length) { console.log('Nothing new to send.'); process.exit(0); }

(async () => {
  // The key file must be reachable on the live site, or the submission is rejected.
  const keyUrl = `${SITE}/${KEY}.txt`;
  const check = await fetch(keyUrl);
  if (!check.ok || (await check.text()).trim() !== KEY) {
    console.error(`${keyUrl} is not live yet. Upload dist/ first.`);
    process.exit(1);
  }
  for (let i = 0; i < urls.length; i += 10000) {
    const batch = urls.slice(i, i + 10000);
    // Bing's own endpoint: api.indexnow.org answered 403 here (it could not read the key file
    // through Hostinger's bot protection), while Bing's crawler can. Bing shares the URLs with the
    // other IndexNow engines.
    const res = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: keyUrl, urlList: batch }),
    });
    console.log(`Submitted ${batch.length} URLs: HTTP ${res.status}`);
    if (res.status >= 400) process.exit(1);
  }
})();
