// Run: node docs/tools/gsc-trends.js
// Deeper Search Console look: daily impressions by page type, biggest losers, country x day. No keys printed.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const SITE = 'sc-domain:geographyarcade.com';
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/claude-seo/google-api.json'), 'utf8'));
const key = JSON.parse(fs.readFileSync(cfg.service_account_path.replace(/^~/, os.homedir()), 'utf8'));
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3000 });
const jwt = unsigned + '.' + crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url');
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const LANGS = 'zh hi es ar fr de bn pt ru ur id it ja ko pl nl'.split(' ');
function kind(u) {
  const seg = new URL(u).pathname.replace(/^\//, '').split('/');
  let lang = 'en';
  if (LANGS.includes(seg[0])) { lang = seg[0]; seg.shift(); }
  let type = seg[0] || 'home';
  if (type === 'countries' && seg.length > 2 && seg[1]) type = 'country-sub';
  else if (type === 'countries' && seg.length === 2) type = 'country-page';
  return { lang, type };
}
(async () => {
  const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` })).json();
  const H = { Authorization: 'Bearer ' + t.access_token, 'Content-Type': 'application/json' };
  const q = async (body) => {
    let rows = [];
    for (let start = 0; ; start += 25000) {
      const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { method: 'POST', headers: H, body: JSON.stringify({ ...body, rowLimit: 25000, startRow: start }) });
      const d = await r.json();
      if (r.status !== 200) throw new Error(d.error && d.error.message);
      rows = rows.concat(d.rows || []);
      if ((d.rows || []).length < 25000) break;
    }
    return rows;
  };
  const rows = await q({ startDate: day(21), endDate: day(1), dimensions: ['date', 'page'] });
  console.log('date x page rows:', rows.length);
  const dates = [...new Set(rows.map((r) => r.keys[0]))].sort();
  const byType = {}, byLang = {};
  for (const r of rows) {
    const [d, u] = r.keys; const k = kind(u);
    (byType[k.type] = byType[k.type] || {})[d] = ((byType[k.type] || {})[d] || 0) + r.impressions;
    (byLang[k.lang] = byLang[k.lang] || {})[d] = ((byLang[k.lang] || {})[d] || 0) + r.impressions;
  }
  const show = (title, map, n) => {
    console.log('\n== ' + title + ' (impressions per day: ' + dates.map((d) => d.slice(5)).join(' ') + ')');
    Object.entries(map).sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0)).slice(0, n)
      .forEach(([k, v]) => console.log('  ' + k.padEnd(14) + dates.map((d) => String(v[d] || 0).padStart(5)).join('')));
  };
  show('By page type', byType, 10);
  show('By language', byLang, 8);
  // Biggest losers: pages with most impressions Oct 5-12 vs Oct 13-last.
  const a = {}, b = {};
  for (const r of rows) { const [d, u] = r.keys; const bucket = d >= '2026-10-13' ? b : d >= '2026-10-05' && d <= '2026-10-12' ? a : null; if (bucket) bucket[u] = (bucket[u] || 0) + r.impressions; }
  const diffs = Object.keys(a).map((u) => [u, a[u], b[u] || 0]).sort((x, y) => (y[1] - y[2]) - (x[1] - x[2])).slice(0, 12);
  console.log('\n== Pages that lost most (Oct 5-12 impressions -> Oct 13+)');
  diffs.forEach(([u, x, y]) => console.log(`  ${u.replace('https://geographyarcade.com', '').slice(0, 70).padEnd(70)} ${String(x).padStart(5)} -> ${y}`));
  // Country x day for the top countries.
  const crows = await q({ startDate: day(21), endDate: day(1), dimensions: ['date', 'country'] });
  const byC = {};
  for (const r of crows) (byC[r.keys[1]] = byC[r.keys[1]] || {})[r.keys[0]] = r.impressions;
  show('By country', byC, 8);
  // Total clicks/impr/ctr/pos by device
  const dev = await q({ startDate: day(14), endDate: day(1), dimensions: ['device'] });
  console.log('\n== Device (14d)'); dev.forEach((r) => console.log(`  ${r.keys[0]} clicks ${r.clicks} impr ${r.impressions} ctr ${(100 * r.ctr).toFixed(1)}% pos ${r.position.toFixed(1)}`));
  const qs = await q({ startDate: day(14), endDate: day(1), dimensions: ['query'] });
  const withClicks = qs.filter((r) => r.clicks > 0).length;
  console.log(`\n== Queries (14d): ${qs.length} distinct, ${withClicks} with clicks, ${qs.filter((r) => r.position <= 10).length} at position <= 10, ${qs.filter((r) => r.position > 10 && r.position <= 20).length} at 11-20`);
  console.log('Top queries at position 11-20 with most impressions (page-2 chances):');
  qs.filter((r) => r.position > 10 && r.position <= 20).sort((x, y) => y.impressions - x.impressions).slice(0, 12).forEach((r) => console.log(`  ${r.keys[0].slice(0, 60).padEnd(60)} impr ${r.impressions} pos ${r.position.toFixed(1)}`));
})().catch((e) => console.log('ERR', e.message));
