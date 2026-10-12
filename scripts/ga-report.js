// GA4 Data API report for Geography Arcade (property 557987912) via the claude-seo service account.
// Usage: node ga_report.js [days]
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const PROPERTY = '557987912';
const days = process.argv[2] || '28';
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/claude-seo/google-api.json'), 'utf8'));
const key = JSON.parse(fs.readFileSync(cfg.service_account_path.replace(/^~/, os.homedir()), 'utf8'));
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
const jwt = unsigned + '.' + crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url');

async function run(token, dims, metrics, limit = 10) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`, {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }], dimensions: dims.map((name) => ({ name })), metrics: metrics.map((name) => ({ name })), orderBys: [{ metric: { metricName: metrics[0] }, desc: true }], limit }),
  });
  const d = await r.json();
  if (r.status !== 200) throw new Error(`HTTP ${r.status}: ${d.error && d.error.message}`);
  return (d.rows || []).map((row) => [...(row.dimensionValues || []).map((v) => v.value), ...(row.metricValues || []).map((v) => v.value)]);
}

(async () => {
  const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt })).json();
  if (!t.access_token) return console.log('token error:', t.error);
  const show = (title, rows) => { console.log(`\n== ${title}`); for (const r of rows) console.log('  ' + r.join(' | ')); };
  show('Totals (users | sessions | page views)', await run(t.access_token, [], ['activeUsers', 'sessions', 'screenPageViews'], 1));
  show('By day', (await run(t.access_token, ['date'], ['activeUsers', 'screenPageViews'], 40)).sort((a, b) => a[0].localeCompare(b[0])));
  show('Countries', await run(t.access_token, ['country'], ['activeUsers'], 12));
  show('Traffic sources', await run(t.access_token, ['sessionSource', 'sessionMedium'], ['sessions'], 12));
  show('Top pages', await run(t.access_token, ['pagePath'], ['screenPageViews', 'activeUsers'], 15));
  show('Devices', await run(t.access_token, ['deviceCategory'], ['activeUsers'], 5));
})().catch((e) => console.log(e.message));
