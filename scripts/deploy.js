// Hostinger API helper. `--cache-only` (used by the monthly workflow, which publishes with rsync
// over SSH): clear the server and CDN cache. Without it, the fallback archive deploy: upload
// geographyarcade-site.7z (from `npm run zip`) into public_html, unpack it over the site, then
// clear the cache. The archive deploy failed above ~85 MB, which is why the workflow uses rsync.
//
// Needs HOSTINGER_API_TOKEN in the environment (hPanel: Account > API). The monthly GitHub
// workflow passes it from the repository secret of the same name; it is never stored in the code.
const config = require('../site.config');
const { upload } = require('./upload');

const TOKEN = process.env.HOSTINGER_API_TOKEN;
const CACHE_ONLY = process.argv.includes('--cache-only');
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
  // --cache-only: the monthly workflow publishes with rsync over SSH and only needs the cache cleared.
  if (!CACHE_ONLY) await deployArchive();
  // Unpacking runs on Hostinger's side and the cache clear can fail while it does (HTTP 500 seen),
  // so wait, retry, and only warn if it keeps failing: the site is already published, and
  // cached pages expire within an hour anyway (.htaccess sets max-age 3600).
  for (let attempt = 1; attempt <= 5; attempt++) {
    if (!CACHE_ONLY || attempt > 1) await new Promise((r) => setTimeout(r, 90 * 1000));
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

// Upload geographyarcade-site.7z (npm run zip) and ask Hostinger to unpack it over the site.
async function deployArchive() {
  const send = async () => {
    const up = await api('POST', '/files/upload-urls', { username: USER, domain: DOMAIN });
    return upload(up.url, up.auth_key, up.rest_auth_key);
  };
  // The deploy call sometimes fails with HTTP 500 "[Hosting:9999] Request failed" on Hostinger's
  // side (seen 2026-10-01). Wait and retry; from the third try, upload the zip again in case the
  // failed attempt removed it.
  let name = await send();
  for (let attempt = 1; ; attempt++) {
    try {
      await api('POST', `/accounts/${USER}/websites/${DOMAIN}/deploy`, { archive_path: name });
      break;
    } catch (e) {
      if (attempt >= 4) throw e;
      console.log(`Deploy attempt ${attempt} failed: ${e.message.split('\n')[0]}. Retrying in ${attempt * 2} minutes.`);
      await new Promise((r) => setTimeout(r, attempt * 120 * 1000));
      if (attempt >= 2) name = await send();
    }
  }
  console.log(`Deploy of ${name} to ${DOMAIN} accepted.`);
}
