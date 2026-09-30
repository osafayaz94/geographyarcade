// Minimal .xlsx reader (first worksheet -> array of rows) using adm-zip, so keyword files from
// Excel can be imported without another dependency. Handles shared and inline strings.
const AdmZip = require('adm-zip');

const unxml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&');
const colIndex = (ref) => [...ref.replace(/\d+/g, '')].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;

function readXlsx(file, sheet = 1) {
  const zip = new AdmZip(file);
  const text = (name) => { const e = zip.getEntry(name); return e ? e.getData().toString('utf8') : ''; };
  const shared = [...text('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)]
    .map((m) => unxml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')));
  const sheetName = `xl/worksheets/sheet${sheet}.xml`;
  const rows = [];
  for (const r of text(sheetName).matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    for (const c of r[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = c[1];
      const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1];
      const type = (attrs.match(/t="(\w+)"/) || [])[1];
      const body = c[2] || '';
      let v = (body.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      if (type === 's') v = shared[Number(v)];
      else if (type === 'inlineStr') v = unxml([...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(''));
      else if (v != null) v = unxml(v);
      row[ref ? colIndex(ref) : row.length] = v == null ? '' : v;
    }
    rows.push(row);
  }
  return rows;
}

module.exports = { readXlsx };
if (require.main === module) {
  const rows = readXlsx(process.argv[2], Number(process.argv[4]) || 1);
  console.log(`${rows.length} rows`);
  for (const r of rows.slice(0, Number(process.argv[3]) || 8)) console.log(JSON.stringify(r));
}
