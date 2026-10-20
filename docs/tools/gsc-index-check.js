// Run from the repo root after a build (it reads dist/ for the sitemap): node docs/tools/gsc-index-check.js
// Which page types are indexed? GSC pages with impressions + URL Inspection sample. No keys printed.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const SITE = 'sc-domain:geographyarcade.com';
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/claude-seo/google-api.json'), 'utf8'));
const key = JSON.parse(fs.readFileSync(cfg.service_account_path.replace(/^~/, os.homedir()), 'utf8'));
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3000 });
const jwt = unsigned + '.' + crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url');
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const DIST = 'D:/claude code/2nd website geography quiz/dist';
const LANGS = 'en zh hi es ar fr de bn pt ru ur id it ja ko pl nl'.split(' ');

function kind(u) {
  let p = new URL(u).pathname.replace(/^\//, '');
  let lang = 'en';
  const seg = p.split('/');
  if (LANGS.includes(seg[0]) && seg[0] !== 'en') { lang = seg[0]; seg.shift(); }
  const s0 = seg[0] || 'home';
  let type = s0;
  if (s0 === 'countries' && seg.length > 2 && seg[1]) type = 'country-sub (' + seg[2].replace(/-quiz$/, '') + ')';
  else if (s0 === 'countries' && seg.length === 2) type = 'countries/index';
  else if (s0 === 'countries') type = 'country-page';
  if (s0 === 'printables') type = 'printables';
  return { lang, type: type.startsWith('country-sub') ? 'country-sub' : type };
}

(async () => {
  const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` })).json();
  const H = { Authorization: 'Bearer ' + t.access_token, 'Content-Type': 'application/json' };
  // 1. Pages that got impressions in the last 28 days.
  const seen = new Set();
  for (let start = 0; start < 50000; start += 25000) {
    const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { method: 'POST', headers: H, body: JSON.stringify({ startDate: day(28), endDate: day(1), dimensions: ['page'], rowLimit: 25000, startRow: start }) });
    const d = await r.json();
    if (r.status !== 200) { console.log('GSC error', r.status, d.error && d.error.message); break; }
    (d.rows || []).forEach((x) => seen.add(x.keys[0]));
    if ((d.rows || []).length < 25000) break;
  }
  console.log('pages with impressions (28d):', seen.size);
  // 2. All sitemap URLs from the local build.
  const urls = [];
  for (const f of fs.readdirSync(DIST).filter((x) => /^sitemap.*\.xml$/.test(x) && x !== 'sitemap.xml')) {
    const x = fs.readFileSync(path.join(DIST, f), 'utf8');
    for (const m of x.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
  }
  console.log('sitemap urls (local build):', urls.length);
  const by = {};
  for (const u of urls) { const k = kind(u); const key2 = k.type; by[key2] = by[key2] || { n: 0, seen: 0 }; by[key2].n++; if (seen.has(u)) by[key2].seen++; }
  console.log('\n== With impressions, by page type (en+17 langs)');
  Object.entries(by).sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) => console.log(`  ${k.padEnd(22)} ${String(v.n).padStart(6)} urls | ${String(v.seen).padStart(5)} with impressions | ${(100 * v.seen / v.n).toFixed(0)}%`));
  const byL = {};
  for (const u of urls) { const k = kind(u).lang; byL[k] = byL[k] || { n: 0, seen: 0 }; byL[k].n++; if (seen.has(u)) byL[k].seen++; }
  console.log('\n== By language');
  Object.entries(byL).sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) => console.log(`  ${k}  ${v.n} urls | ${v.seen} with impressions | ${(100 * v.seen / v.n).toFixed(0)}%`));
  // 3. URL Inspection on a stratified sample.
  const groups = {};
  for (const u of urls) { const k = kind(u).type; (groups[k] = groups[k] || []).push(u); }
  const sample = [];
  for (const [k, list] of Object.entries(groups)) {
    const n = Math.min(list.length, k === 'country-page' || k === 'country-sub' || k === 'printables' ? 8 : 3);
    for (let i = 0; i < n; i++) sample.push([k, list[Math.floor((i + 0.5) * list.length / n)]]);
  }
  console.log('\n== URL Inspection sample:', sample.length, 'urls');
  const state = {};
  for (const [k, u] of sample) {
    try {
      const r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { method: 'POST', headers: H, body: JSON.stringify({ inspectionUrl: u, siteUrl: SITE }) });
      const d = await r.json();
      if (r.status !== 200) { console.log('  inspect error', r.status, (d.error && d.error.message || '').slice(0, 120)); break; }
      const s = d.inspectionResult.indexStatusResult;
      const line = `${s.coverageState}${s.lastCrawlTime ? ' | crawled ' + s.lastCrawlTime.slice(0, 10) : ''}`;
      state[k] = state[k] || {}; state[k][s.coverageState] = (state[k][s.coverageState] || 0) + 1;
      console.log(`  ${k.padEnd(14)} ${u.replace('https://geographyarcade.com', '').slice(0, 60).padEnd(60)} ${line}`);
    } catch (e) { console.log('  fail', e.message); break; }
  }
  console.log('\n== Summary by type'); Object.entries(state).forEach(([k, v]) => console.log(' ', k, JSON.stringify(v)));
})().catch((e) => console.log('ERR', e.message));
