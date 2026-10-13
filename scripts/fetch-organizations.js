// Names, founding year, headquarters and current head of each organisation in
// data/organizations.js, from Wikidata, in every language. Writes data/organizations.json.
// Member lists stay curated in data/organizations.js (checked here against the official count).
// Run: node scripts/fetch-organizations.js (part of `npm run fetch`).
const fs = require('fs');
const path = require('path');
const { sparql } = require('./wikidata');
const ORGS = require('../data/organizations');
const countries = require('../data/countries.json');
const LANGS = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'de', 'bn', 'pt', 'ru', 'ur', 'id', 'it', 'ja', 'ko', 'pl', 'nl'];
const iso = new Set(countries.map((c) => c.iso2));

async function labelsOf(ids) {
  const out = {};
  if (!ids.length) return out;
  const rows = await sparql(`SELECT ?i ?l ?lang WHERE { VALUES ?i { ${ids.map((q) => 'wd:' + q).join(' ')} } ?i rdfs:label ?l. BIND(LANG(?l) AS ?lang) FILTER(?lang IN (${LANGS.map((l) => `"${l}"`).join(',')}, "zh-hans")) }`);
  for (const r of rows) { const l = r.lang === 'zh-hans' ? 'zh' : r.lang; out[r.i] = out[r.i] || {}; if (!out[r.i][l] || r.lang === 'zh-hans') out[r.i][l] = r.l.replace(/\s*[–—]\s*/g, '-'); } // house style: no dashes ("стран-экспортёров", "secretaris-generaal")
  return out;
}

(async () => {
  for (const o of ORGS) {
    const m = o.members.split(' ');
    const bad = m.filter((x) => !iso.has(x));
    if (bad.length || m.length !== o.count || new Set(m).size !== m.length) throw new Error(`${o.key}: members ${m.length} vs count ${o.count}, unknown ${bad.join(' ')}`);
  }
  const qids = ORGS.map((o) => o.qid).filter(Boolean);
  const formerQids = ORGS.flatMap((o) => (o.former || []).map((f) => f.qid));
  const facts = await sparql(`SELECT ?o ?inc ?web WHERE { VALUES ?o { ${qids.map((q) => 'wd:' + q).join(' ')} } OPTIONAL { ?o wdt:P571 ?inc } OPTIONAL { ?o wdt:P856 ?web } }`);
  // Current head: chairperson (P488) or director/manager (P1037) with no end date; the office's name (P2388).
  const heads = await sparql(`SELECT ?o ?h ?office WHERE { VALUES ?o { ${qids.map((q) => 'wd:' + q).join(' ')} }
    { ?o p:P488 ?st. ?st ps:P488 ?h. } UNION { ?o p:P1037 ?st. ?st ps:P1037 ?h. }
    FILTER NOT EXISTS { ?st pq:P582 ?end } OPTIONAL { ?o wdt:P2388 ?office } }`);
  const headOf = {};
  for (const r of heads) if (!headOf[r.o]) headOf[r.o] = { qid: r.h, office: r.office || null };
  // Usually Wikidata records the office (P2388, e.g. "Secretary General of NATO") and the person
  // holds it (P39) with a start date and no end date: take the latest such holder.
  const holders = await sparql(`SELECT ?o ?office ?h ?start WHERE { VALUES ?o { ${qids.map((q) => 'wd:' + q).join(' ')} }
    ?o wdt:P2388 ?office. ?h p:P39 ?st. ?st ps:P39 ?office. OPTIONAL { ?st pq:P580 ?start } FILTER NOT EXISTS { ?st pq:P582 ?end } }`);
  for (const r of holders.sort((a, b) => String(b.start || '').localeCompare(String(a.start || '')))) {
    if (!headOf[r.o] || !headOf[r.o].fromOffice) headOf[r.o] = { qid: r.h, office: r.office, fromOffice: true, since: r.start ? String(r.start).slice(0, 4) : null };
  }
  const lab = await labelsOf([...new Set([...qids, ...ORGS.map((o) => o.hq).filter(Boolean), ...formerQids, ...Object.values(headOf).flatMap((h) => [h.qid, h.office]).filter(Boolean)])]);
  const out = {};
  for (const o of ORGS) {
    const f = facts.find((r) => r.o === o.qid) || {};
    if (o.region) { f.inc = null; f.web = null; } // regions have no founding year, website or head
    // Only a holder of a standing office (Secretary General, Head of the Commonwealth) with a
    // start date: rotating chairs (OPEC president, AU chairperson, ECOWAS chair) go out of date.
    const h0 = o.region ? null : headOf[o.qid];
    const officeEn = h0 && h0.office && lab[h0.office] ? lab[h0.office].en || '' : '';
    const h = h0 && h0.fromOffice && h0.since && /secretary|head of the commonwealth/i.test(officeEn) ? h0 : null;
    out[o.key] = {
      name: { ...(lab[o.qid] || {}), ...(o.name || {}) },
      former: o.former ? o.former.map((x) => ({ name: lab[x.qid] || {}, from: x.from, until: x.until })) : undefined,
      founded: o.founded || (f.inc ? Number(String(f.inc).slice(0, 4)) : null),
      website: f.web || null,
      hq: o.hq ? lab[o.hq] || null : null,
      head: h && lab[h.qid] ? { name: lab[h.qid], office: h.office ? lab[h.office] || null : null, since: h.since || null } : null,
    };
    console.log(`${o.key}: ${out[o.key].name.en} | founded ${out[o.key].founded} | HQ ${out[o.key].hq ? out[o.key].hq.en : '-'} | head ${out[o.key].head ? out[o.key].head.name.en + (out[o.key].head.office ? ' (' + out[o.key].head.office.en + ')' : '') : '-'} | names ${Object.keys(out[o.key].name).length}`);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'organizations.json'), JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), orgs: out }, null, 1));
})().catch((e) => { console.error(e.message); process.exit(1); });
