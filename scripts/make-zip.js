// Packs dist/ into geographyarcade-site.zip for upload (Hostinger File Manager: upload, then Extract).
// Paths inside the zip use "/" so Linux servers recreate the folders (a Windows "\" path
// would be unpacked as a flat file literally named "about\index.html").
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
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
const bad = entries.filter((n) => n.includes(String.fromCharCode(92)));
if (bad.length) throw new Error(`${bad.length} zip paths contain a backslash, e.g. ${bad[0]}`);
if (!entries.includes('about/index.html') || !entries.includes('.htaccess')) throw new Error('zip is missing expected files');
console.log(`${path.basename(OUT)}: ${entries.length} files, ${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB, folder paths use "/"`);
