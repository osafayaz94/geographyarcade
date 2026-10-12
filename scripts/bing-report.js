// Bing Webmaster report: verified sites, daily clicks/impressions and top queries.
// The API key is read from ~/.config/claude-seo/backlinks-api.json (bing_api_key) and never printed.
// Usage: node scripts/bing-report.js [site]   (default https://geographyarcade.com/)
const fs = require('fs'), os = require('os'), path = require('path');
const SITE = process.argv[2] || 'https://geographyarcade.com/';
const { bing_api_key: KEY } = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/claude-seo/backlinks-api.json'), 'utf8').replace(/^﻿/, ''));
const api = async (method, params = {}) => {
  const qs = new URLSearchParams({ ...params, apikey: KEY });
  const r = await fetch(`https://www.bing.com/webmaster/api.svc/json/${method}?${qs}`);
  const text = await r.text();
  if (r.status !== 200) throw new Error(`${method}: HTTP ${r.status} ${text.replace(KEY, '***').slice(0, 200)}`);
  return JSON.parse(text).d;
};
const day = (s) => new Date(Number(/\d+/.exec(s)[0])).toISOString().slice(0, 10);
(async () => {
  const sites = await api('GetUserSites');
  console.log('== Sites in this Bing account');
  for (const s of sites) console.log(`  ${s.Url} | verified: ${s.IsVerified}`);
  const stats = await api('GetRankAndTrafficStats', { siteUrl: SITE });
  console.log(`\n== ${SITE} by day (clicks | impressions)`);
  for (const r of stats.slice(-21)) console.log(`  ${day(r.Date)} | ${r.Clicks} | ${r.Impressions}`);
  const tot = stats.reduce((a, r) => [a[0] + r.Clicks, a[1] + r.Impressions], [0, 0]);
  console.log(`  TOTAL (${stats.length} days) | ${tot[0]} | ${tot[1]}`);
  const qs = await api('GetQueryStats', { siteUrl: SITE });
  const agg = {};
  for (const q of qs) { const a = agg[q.Query] || (agg[q.Query] = { c: 0, i: 0, p: 0, n: 0 }); a.c += q.Clicks; a.i += q.Impressions; a.p += q.AvgImpressionPosition; a.n++; }
  console.log('\n== Top queries (clicks | impressions | avg position)');
  for (const [q, a] of Object.entries(agg).sort((x, y) => y[1].i - x[1].i).slice(0, 15)) console.log(`  ${q} | ${a.c} | ${a.i} | ${(a.p / a.n).toFixed(1)}`);
})().catch((e) => console.log(e.message));
