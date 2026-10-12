// Search Console check for sc-domain:geographyarcade.com via the claude-seo service account.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const SITE = 'sc-domain:geographyarcade.com';
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/claude-seo/google-api.json'), 'utf8'));
const key = JSON.parse(fs.readFileSync(cfg.service_account_path.replace(/^~/, os.homedir()), 'utf8'));
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
const jwt = unsigned + '.' + crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url');
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
(async () => {
  const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt })).json();
  const q = async (dimensions, rowLimit = 10) => {
    const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: 'Bearer ' + t.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ startDate: day(30), endDate: day(1), dimensions, rowLimit }) });
    const d = await r.json();
    if (r.status !== 200) throw new Error(`HTTP ${r.status}: ${d.error && d.error.message}`);
    return d.rows || [];
  };
  const fmt = (r) => `${(r.keys || ['TOTAL']).join(' | ')} | clicks ${r.clicks} | impr ${r.impressions} | pos ${r.position.toFixed(1)}`;
  console.log('== Totals, last 30 days'); for (const r of await q([], 1)) console.log('  ' + fmt(r));
  console.log('== By date'); for (const r of await q(['date'], 40)) console.log('  ' + fmt(r));
  console.log('== Top queries'); for (const r of await q(['query'], 12)) console.log('  ' + fmt(r));
  console.log('== Top countries'); for (const r of await q(['country'], 8)) console.log('  ' + fmt(r));
})().catch((e) => console.log(e.message));
