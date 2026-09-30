// Publishes geographyarcade-site.zip (from `npm run zip`) to the live site through the Hostinger
// API: get a one-time upload URL, upload the zip into public_html, unpack it over the site
// (Hostinger removes the zip afterwards), then clear the server and CDN cache.
//
// Needs HOSTINGER_API_TOKEN in the environment (hPanel: Account > API). The monthly GitHub
// workflow passes it from the repository secret of the same name; it is never stored in the code.
const config = require('../site.config');
const { upload } = require('./upload');

const TOKEN = process.env.HOSTINGER_API_TOKEN;
const API = 'https://developers.hostinger.com/api/hosting/v1';
const USER = config.hostingerUsername;
const DOMAIN = config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path}: HTTP ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

(async () => {
  if (!TOKEN) throw new Error('Set HOSTINGER_API_TOKEN (hPanel: Account > API) to deploy.');
  if (!USER) throw new Error('Set hostingerUsername in site.config.js.');
  const up = await api('POST', '/files/upload-urls', { username: USER, domain: DOMAIN });
  const name = await upload(up.url, up.auth_key, up.rest_auth_key);
  await api('POST', `/accounts/${USER}/websites/${DOMAIN}/deploy`, { archive_path: name });
  console.log(`Deploy of ${name} to ${DOMAIN} accepted.`);
  // Unpacking runs on Hostinger's side and the cache clear can fail while it does (HTTP 500 seen),
  // so wait, retry, and only warn if it keeps failing: the site is already published, and
  // cached pages expire within an hour anyway (.htaccess sets max-age 3600).
  for (let attempt = 1; attempt <= 5; attempt++) {
    await new Promise((r) => setTimeout(r, 90 * 1000));
    try {
      await api('DELETE', `/accounts/${USER}/websites/${DOMAIN}/cache/clear`);
      console.log('Cache cleared.');
      return;
    } catch (e) {
      console.log(`Cache clear attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
    }
  }
  console.log('::warning::Published, but Hostinger did not clear the cache; pages refresh within an hour.');
})().catch((e) => { console.error(e.message); process.exit(1); });
