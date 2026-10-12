// Submits up to Bing's daily quota of URLs (100) through the Bing Webmaster API, best pages first:
// the pages with the most Google impressions (Search Console, last 30 days), then the main hubs.
// When those run out, it continues through the sitemaps (English first). Already-submitted URLs are
// remembered in ~/.config/claude-seo/bing-submitted-geographyarcade.json (outside the repo, so the
// daily scheduled run leaves the project clean), seeded once from data/bing-submitted.json.
// Keys come from ~/.config/claude-seo (never printed). Usage: node scripts/bing-submit.js [max]
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const SITE = 'https://geographyarcade.com/';
const DONE = path.join(os.homedir(), '.config/claude-seo/bing-submitted-geographyarcade.json');
const SEED = path.join(__dirname, '..', 'data', 'bing-submitted.json');
const conf = (f) => JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/claude-seo', f), 'utf8').replace(/^ï»¿/, ''));
const { bing_api_key: KEY } = conf('backlinks-api.json');
const bing = async (method, body, params = {}) => {
  const r = await fetch(`https://www.bing.com/webmaster/api.svc/json/${method}?${new URLSearchParams({ ...params, apikey: KEY })}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) } : {});
  const t = await r.text();
  if (r.status !== 200) throw new Error(`${method}: HTTP ${r.status} ${t.replace(KEY, '***').slice(0, 300)}`);
  return JSON.parse(t).d;
};

async function googlePages() {
  const cfg = conf('google-api.json');
  const key = JSON.parse(fs.readFileSync(cfg.service_account_path.replace(/^~/, os.homedir()), 'utf8'));
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const jwt = unsigned + '.' + crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url');
  const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt })).json();
  const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent('sc-domain:geographyarcade.com')}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: 'Bearer ' + t.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ startDate: day(30), endDate: day(1), dimensions: ['page'], rowLimit: 2000 }) });
  return ((await r.json()).rows || []).sort((a, b) => b.impressions - a.impressions).map((x) => x.keys[0]);
}

(async () => {
  const max = Number(process.argv[2]) || 100;
  const quota = await bing('GetUrlSubmissionQuota', null, { siteUrl: SITE });
  const left = Math.min(max, quota.DailyQuota);
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  if (!left) return console.log(`${stamp} Bing's daily quota is already used up; trying again tomorrow.`);
  const from = fs.existsSync(DONE) ? DONE : fs.existsSync(SEED) ? SEED : null;
  const done = new Set(from ? JSON.parse(fs.readFileSync(from, 'utf8')) : []);
  const hubs = ['', 'maps/', 'flags/', 'capitals/', 'provinces/', 'countries/', 'printables/', 'world/', 'lists/', 'guess-the-country/'].map((p) => SITE + p);
  let pick = [...new Set([...hubs, ...(await googlePages())])].filter((u) => u.startsWith(SITE) && !done.has(u)).slice(0, left);
  // Then the rest of the site, language by language (English first).
  for (const lang of ['en', 'es', 'fr', 'de', 'pt', 'it', 'pl', 'nl', 'ru', 'ar', 'hi', 'bn', 'ur', 'id', 'ja', 'ko', 'zh']) {
    if (pick.length >= left) break;
    const xml = await (await fetch(`${SITE}sitemap-${lang}.xml`, { headers: { 'User-Agent': 'Mozilla/5.0 (geographyarcade bing-submit)' } })).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !done.has(u) && !pick.includes(u));
    pick = pick.concat(urls.slice(0, left - pick.length));
  }
  if (!pick.length) return console.log('Nothing new to submit.');
  await bing('SubmitUrlBatch', { siteUrl: SITE, urlList: pick });
  for (const u of pick) done.add(u);
  fs.writeFileSync(DONE, JSON.stringify([...done], null, 1));
  console.log(` Submitted ${pick.length} URLs to Bing (daily quota ${quota.DailyQuota}, ${done.size} submitted in total). First few:\n  ` + pick.slice(0, 8).join('\n  '));
})().catch((e) => console.log(e.message));
