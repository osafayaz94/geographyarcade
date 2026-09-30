// Small Wikidata client used by the fetch scripts. Results are cached in
// data/cache so re-running a fetch does not hit the network again.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE = path.join(__dirname, '..', 'data', 'cache');
const UA = 'geography-quiz-site-build/1.0 (static site generator)';
const LANGS = ['en', 'zh-hans', 'zh-cn', 'zh', 'hi', 'es', 'ar', 'fr', 'bn'];

fs.mkdirSync(CACHE, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cachedFetch(url, { json = true } = {}) {
  const key = crypto.createHash('sha1').update(url).digest('hex');
  const file = path.join(CACHE, key + (json ? '.json' : '.txt'));
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, 'utf8');
    return json ? JSON.parse(raw) : raw;
  }
  for (let attempt = 1; ; attempt++) {
    try {
      await sleep(400); // stay polite to Wikidata's rate limits
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: json ? 'application/json' : '*/*' } });
      if (res.status === 429 || res.status >= 500) {
        const wait = Number(res.headers.get('retry-after')) || 10;
        await sleep(wait * 1000);
        throw new Error('HTTP ' + res.status);
      }
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
      const text = await res.text();
      fs.writeFileSync(file, text);
      return json ? JSON.parse(text) : text;
    } catch (err) {
      if (attempt >= 8) throw err;
      await sleep(1500 * attempt);
    }
  }
}

async function sparql(query) {
  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query);
  const data = await cachedFetch(url);
  return data.results.bindings.map((b) => {
    const row = {};
    for (const k in b) row[k] = b[k].value.replace('http://www.wikidata.org/entity/', '');
    return row;
  });
}

// Fetch full entities (labels + claims), 50 per request.
async function entities(ids) {
  const out = {};
  const uniq = [...new Set(ids.filter(Boolean))];
  // Batches of 15: big country items can push a 50-item response past the API's size limit,
  // which silently truncates it. Anything still missing is fetched on its own below.
  for (let i = 0; i < uniq.length; i += 15) {
    const batch = uniq.slice(i, i + 15);
    const url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels|claims|sitelinks&sitefilter=enwiki'
      + '&languages=' + LANGS.join('|') + '&ids=' + batch.join('|');
    const data = await cachedFetch(url);
    if (data.error) {
      // One bad id fails the whole batch; fetch the rest one by one.
      for (const id of batch) {
        const one = await cachedFetch(url.replace(/&ids=.*$/, '&ids=' + id));
        if (one.entities) Object.assign(out, one.entities);
      }
    } else Object.assign(out, data.entities);
    for (const id of batch) {
      if (out[id]) continue;
      const one = await cachedFetch(url.replace(/&ids=.*$/, '&ids=' + id));
      if (one.entities) Object.assign(out, one.entities);
    }
  }
  return out;
}

function label(entity, lang) {
  if (!entity || !entity.labels) return null;
  const order = lang === 'zh' ? ['zh-hans', 'zh-cn', 'zh'] : [lang];
  for (const l of order) if (entity.labels[l]) return entity.labels[l].value;
  return null;
}

function labels(entity) {
  const o = {};
  for (const l of ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'bn']) o[l] = label(entity, l);
  return o;
}

// Current values of a claim: drop deprecated and ended statements, prefer "preferred" rank.
function claimValues(entity, prop) {
  const list = (entity && entity.claims && entity.claims[prop]) || [];
  const live = list.filter((s) => s.rank !== 'deprecated' && !(s.qualifiers && s.qualifiers.P582));
  const pref = live.filter((s) => s.rank === 'preferred');
  return (pref.length ? pref : live).map((s) => s.mainsnak.datavalue && s.mainsnak.datavalue.value).filter((v) => v != null);
}

function qidValues(entity, prop) {
  return claimValues(entity, prop).map((v) => v.id).filter(Boolean);
}

// Latest quantity with its year, using the P585 (point in time) qualifier.
function latestQuantity(entity, prop) {
  const list = ((entity && entity.claims && entity.claims[prop]) || []).filter((s) => s.rank !== 'deprecated' && s.mainsnak.datavalue);
  let best = null;
  for (const s of list) {
    const amount = Number(s.mainsnak.datavalue.value.amount);
    const unit = s.mainsnak.datavalue.value.unit || '';
    const t = s.qualifiers && s.qualifiers.P585 && s.qualifiers.P585[0].datavalue && s.qualifiers.P585[0].datavalue.value.time;
    const year = t ? Number(t.slice(1, 5)) : 0;
    // Newest year wins; "preferred" rank only breaks ties within a year.
    const score = year * 10 + (s.rank === 'preferred' ? 1 : 0);
    if (!best || score > best.score) best = { amount, unit, year: year || null, score };
  }
  return best ? { value: best.amount, year: best.year, unit: best.unit } : null;
}

module.exports = { cachedFetch, sparql, entities, label, labels, claimValues, qidValues, latestQuantity, sleep };
