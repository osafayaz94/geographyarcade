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
  // Unpacking runs on Hostinger's side; give it time before clearing the cache.
  await new Promise((r) => setTimeout(r, 90 * 1000));
  await api('DELETE', `/accounts/${USER}/websites/${DOMAIN}/cache/clear`);
  console.log('Cache cleared.');
})().catch((e) => { console.error(e.message); process.exit(1); });
