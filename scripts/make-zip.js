// Packs dist/ for upload. Default: geographyarcade-site.7z, used by scripts/deploy.js. 7z compresses
// across files, and every page carries the same inlined stylesheet, so the archive is about a
// quarter of a zip's size (24 MB against 99.5 MB on 2026-10-02). Hostinger's deploy call failed
// with HTTP 500 once the zip passed about 85 MB.
// `--zip`: geographyarcade-site.zip instead, for a manual upload in hPanel's File manager (upload,
// then Extract). Zip paths use "/" so Linux servers recreate the folders (a Windows "\" path would
// be unpacked as a flat file literally named "about\index.html").
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BS = String.fromCharCode(92);

function check(names, out) {
  const norm = names.map((n) => n.split(BS).join('/'));
  if (!norm.includes('about/index.html') || !norm.includes('.htaccess')) throw new Error(`${path.basename(out)} is missing expected files`);
  console.log(`${path.basename(out)}: ${norm.length} files, ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);
}

if (process.argv.includes('--zip')) {
  const AdmZip = require('adm-zip');
  const OUT = path.join(ROOT, 'geographyarcade-site.zip');
  if (fs.existsSync(OUT)) fs.unlinkSync(OUT);
  const zip = new AdmZip();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else zip.addFile(path.relative(DIST, p).split(path.sep).join('/'), fs.readFileSync(p));
    }
  };
  walk(DIST);
  zip.writeZip(OUT);
  const entries = new AdmZip(OUT).getEntries().map((e) => e.entryName);
  const bad = entries.filter((n) => n.includes(BS));
  if (bad.length) throw new Error(`${bad.length} zip paths contain a backslash, e.g. ${bad[0]}`);
  check(entries, OUT);
} else {
  const { path7za } = require('7zip-bin');
  try { fs.chmodSync(path7za, 0o755); } catch (e) { /* read-only install: already executable */ }
  const OUT = path.join(ROOT, 'geographyarcade-site.7z');
  if (fs.existsSync(OUT)) fs.unlinkSync(OUT);
  // -mx=7: strong LZMA2; -ms=on: one solid block, so repeated page parts compress away.
  execFileSync(path7za, ['a', '-t7z', '-mx=7', '-ms=on', '-bso0', '-bsp0', OUT, '.'], { cwd: DIST, stdio: 'inherit' });
  // List the archive (one block per entry) and keep the files, not the folders.
  const list = execFileSync(path7za, ['l', '-slt', OUT], { maxBuffer: 256 * 1024 * 1024 }).toString();
  const blocks = list.split(/\r?\n\r?\n/).filter((b) => /^Path = /m.test(b) && /^Size = /m.test(b));
  const files = blocks.filter((b) => !/^Attributes = D/m.test(b)).map((b) => b.match(/^Path = (.+)$/m)[1].trim());
  check(files, OUT);
}
