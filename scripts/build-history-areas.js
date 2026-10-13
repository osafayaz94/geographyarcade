// Cuts the area of each civilization in data/history.js out of the Historical Basemaps snapshots
// (https://github.com/aourednik/historical-basemaps, GPL-3.0, see data/history-source.md) and saves
// them, rounded to 0.1 degree (about 10 km: ancient borders were never exact), in data/history-areas.json.
// Run only when data/history.js changes: node scripts/build-history-areas.js <folder with world_<snap>.geojson files>
const fs = require('fs');
const path = require('path');
const d3 = require('d3-geo');
const CIVS = require('../data/history');

const dir = process.argv[2];
if (!dir) throw new Error('usage: node scripts/build-history-areas.js <folder with the world_*.geojson snapshots>');
const r1 = (n) => Math.round(n * 10) / 10;
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
// d3 reads a clockwise outer ring as "inside"; flip any polygon that would be read as the whole globe.
const fix = (p) => (d3.geoArea({ type: 'Polygon', coordinates: p }) > 2 * Math.PI ? p.map((ring) => ring.slice().reverse()) : p);

const cache = {};
const out = {};
for (const c of CIVS) {
  const file = path.join(dir, `world_${c.snap}.geojson`);
  cache[c.snap] = cache[c.snap] || JSON.parse(fs.readFileSync(file, 'utf8'));
  const parts = [];
  for (const f of cache[c.snap].features) {
    if (!f.geometry || !c.names.includes(f.properties.NAME)) continue;
    for (const p of polys(f.geometry)) {
      const rings = p.map((ring) => {
        const q = [];
        for (const [x, y] of ring) { const pt = [r1(x), r1(y)]; const l = q[q.length - 1]; if (!l || l[0] !== pt[0] || l[1] !== pt[1]) q.push(pt); }
        return q;
      }).filter((ring) => ring.length >= 4);
      if (rings.length) parts.push(fix(rings));
    }
  }
  if (!parts.length) throw new Error(`${c.key}: no polygons named ${c.names.join(', ')} in ${c.snap}`);
  out[c.key] = { type: 'MultiPolygon', coordinates: parts };
  console.log(`${c.key}: ${parts.length} polygons, ${Math.round(JSON.stringify(out[c.key]).length / 1024)} KB`);
}
fs.writeFileSync(path.join(__dirname, '..', 'data', 'history-areas.json'), JSON.stringify(out));
console.log('saved', Math.round(fs.statSync(path.join(__dirname, '..', 'data', 'history-areas.json')).size / 1024), 'KB');
