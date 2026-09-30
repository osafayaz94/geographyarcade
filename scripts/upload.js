// Uploads geographyarcade-site.zip to the website's public_html with the TUS protocol.
// The upload URL and keys are one-time values from Hostinger's "Generate upload URL" API;
// after the upload, Hostinger's "Deploy static site archive" API unpacks it over the site.
// scripts/deploy.js does all of that with an API token. By hand:
//   node scripts/upload.js <url> <auth_key> <rest_auth_key>
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'geographyarcade-site.zip');
const CHUNK = 8 * 1024 * 1024;

async function upload(url, auth, rest, file = FILE) {
  const name = path.basename(file);
  const size = fs.statSync(file).size;
  const target = `${url.replace(/\/$/, '')}/${name}?override=true`;
  const headers = { 'X-Auth': auth, 'X-Auth-Rest': rest, 'Tus-Resumable': '1.0.0' };
  const create = await fetch(target, { method: 'POST', headers: { ...headers, 'Upload-Length': String(size), 'Upload-Offset': '0' } });
  if (create.status !== 201) throw new Error(`create failed: HTTP ${create.status} ${await create.text()}`);
  const fd = fs.openSync(file, 'r');
  let offset = 0;
  while (offset < size) {
    const len = Math.min(CHUNK, size - offset);
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, offset);
    let res;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        res = await fetch(target, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': String(offset) }, body: buf });
        if (res.status === 204) break;
      } catch (e) { /* network error: retry this chunk */ }
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
    if (!res || res.status !== 204) throw new Error(`upload failed at byte ${offset}: HTTP ${res && res.status}`);
    offset = Number(res.headers.get('upload-offset')) || offset + len;
    process.stdout.write(`\r${name}: ${Math.round((offset / size) * 100)}%`);
  }
  fs.closeSync(fd);
  console.log(`\nUploaded ${name} (${(size / 1048576).toFixed(1)} MB) to public_html.`);
  return name;
}

module.exports = { upload, FILE };

if (require.main === module) {
  const [url, auth, rest] = process.argv.slice(2);
  if (!url || !auth || !rest) throw new Error('usage: node scripts/upload.js <url> <auth_key> <rest_auth_key>');
  upload(url, auth, rest).catch((e) => { console.error(e.message); process.exit(1); });
}
