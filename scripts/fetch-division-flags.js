// Flags of first-level divisions (US states, Canadian provinces...) for the division flag quizzes.
// Which flag: the division's Wikidata "flag image" (P41). The file, its author and licence:
// Wikimedia Commons (read through the Wikipedia API, which serves Commons file info). Small SVGs are kept as SVG; bigger ones (seals, detailed arms) are
// saved as a 400px-wide PNG so the quiz stays light.
// Output: data/division-flags/<iso2>/<division id>.(svg|png) and data/division-flags.json.
const fs = require('fs');
const path = require('path');
const { cachedFetch, entities, claimValues } = require('./wikidata');

const COUNTRIES = ['US', 'CA', 'AU', 'DE', 'BR', 'MX', 'JP', 'CH'];
const MAX_SVG = 30 * 1024;
const DATA = path.join(__dirname, '..', 'data');
const OUT = path.join(DATA, 'division-flags');
const subdivisions = require('../data/subdivisions.json');
const UA = 'geography-quiz-build/1.0 (static site data build)';

const stripHtml = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function download(url, file) {
  if (fs.existsSync(file)) return;
  await new Promise((r) => setTimeout(r, 1500)); // stay under Wikimedia's rate limit
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) { fs.writeFileSync(file, Buffer.from(await res.arrayBuffer())); return; }
    } catch (e) { /* network error: retry */ }
    await new Promise((r) => setTimeout(r, 5000 * attempt)); // Wikimedia rate-limits bursts
  }
  throw new Error('download failed: ' + url);
}

(async () => {
  const meta = {};
  const prevFile = path.join(DATA, 'division-flags.json');
  const prev = fs.existsSync(prevFile) ? JSON.parse(fs.readFileSync(prevFile, 'utf8')) : {};
  for (const iso2 of COUNTRIES) {
    const sub = subdivisions[iso2];
    if (!sub) { console.log(`${iso2}: no division data, skipped`); continue; }
    const ent = await entities(sub.divisions.map((d) => d.qid).filter(Boolean));
    const files = {};
    for (const d of sub.divisions) {
      const f = d.qid && ent[d.qid] ? claimValues(ent[d.qid], 'P41')[0] : null;
      if (f) files[d.id] = f;
    }
    // A quiz with gaps would be misleading: only countries where every division has a flag.
    const missing = sub.divisions.filter((d) => !files[d.id]);
    if (missing.length) { console.log(`${iso2}: no flag on Wikidata for ${missing.map((d) => d.name.en).join(', ')}; skipped`); continue; }

    fs.mkdirSync(path.join(OUT, iso2.toLowerCase()), { recursive: true });
    const titles = Object.values(files).map((f) => 'File:' + f);
    const info = {};
    for (let i = 0; i < titles.length; i += 40) {
      const q = titles.slice(i, i + 40).map(encodeURIComponent).join('|');
      const r = await cachedFetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=400&titles=${q}`);
      const norm = Object.fromEntries((r.query.normalized || []).map((n) => [n.to, n.from]));
      for (const p of Object.values(r.query.pages)) info[(norm[p.title] || p.title).replace(/^File:/, '').replace(/_/g, ' ')] = p.imageinfo && p.imageinfo[0];
    }
    const out = {};
    let failed = null; // a download that keeps failing skips the country; the rest are kept
    for (const [id, f] of Object.entries(files)) {
      const ii = info[f.replace(/_/g, ' ')];
      if (!ii) throw new Error(`${iso2}: no Commons info for ${f}`);
      const md = ii.extmetadata || {};
      const svg = /\.svg$/i.test(f) && ii.size <= MAX_SVG;
      const name = id.replace(/[^A-Za-z0-9-]/g, '_') + (svg ? '.svg' : '.png');
      try { await download(svg ? ii.url : ii.thumburl, path.join(OUT, iso2.toLowerCase(), name)); } catch (e) { failed = e.message; break; }
      out[id] = {
        file: name, commons: f, page: ii.descriptionurl,
        license: stripHtml(md.LicenseShortName && md.LicenseShortName.value),
        author: stripHtml(md.Artist && md.Artist.value).slice(0, 160),
      };
    }
    if (failed) {
      // Keep last run's flags (the image files are still in data/division-flags) rather than
      // dropping the country's flag quiz until the next run.
      const kept = prev[iso2] && Object.values(prev[iso2]).every((v) => fs.existsSync(path.join(OUT, iso2.toLowerCase(), v.file)));
      if (kept) meta[iso2] = prev[iso2];
      console.log(`${iso2}: ${kept ? "kept last run's flags" : 'skipped'} this run (${failed})`);
      continue;
    }
    meta[iso2] = out;
    const lic = {};
    for (const v of Object.values(out)) lic[v.license] = (lic[v.license] || 0) + 1;
    console.log(`${iso2}: ${Object.keys(out).length} flags (${Object.entries(lic).map(([k, v]) => `${k || 'no licence'} ${v}`).join(', ')})`);
  }
  fs.writeFileSync(path.join(DATA, 'division-flags.json'), JSON.stringify(meta, null, 1));
})();
