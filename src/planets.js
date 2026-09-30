// Planet illustrations drawn in SVG (no photos, so nothing to license). Each planet is drawn
// in a 200x200 box, radius 80, centred at (100,100); ids are prefixed so several planets can
// share one SVG (the Solar System diagram).

function art(id) {
  const p = id; // id prefix for gradients and clip paths
  const clip = `<clipPath id="${p}-c"><circle cx="100" cy="100" r="80"/></clipPath>`;
  // Light from the top left: a soft highlight and a darker rim.
  const shade = `<radialGradient id="${p}-s" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>`;
  const top = `<circle cx="100" cy="100" r="80" fill="url(#${p}-s)"/>`;
  const bands = (list) => `<g clip-path="url(#${p}-c)">${list.map(([y, h, c]) => `<rect x="0" y="${y}" width="200" height="${h}" fill="${c}"/>`).join('')}</g>`;
  switch (id) {
    case 'mercury':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#A8A29A"/><g fill="#8A847C" clip-path="url(#${p}-c)"><circle cx="70" cy="70" r="12"/><circle cx="125" cy="60" r="7"/><circle cx="130" cy="120" r="15"/><circle cx="80" cy="135" r="9"/><circle cx="55" cy="105" r="6"/><circle cx="150" cy="90" r="5"/></g>${top}` };
    case 'venus':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#E3BB76"/><g fill="#F2D7A2" opacity=".75" clip-path="url(#${p}-c)"><ellipse cx="90" cy="70" rx="70" ry="12"/><ellipse cx="115" cy="110" rx="75" ry="10"/><ellipse cx="85" cy="145" rx="60" ry="9"/></g>${top}` };
    case 'earth':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#2E7DD1"/><g clip-path="url(#${p}-c)"><path fill="#4CAF50" d="M40 60c15-15 40-18 52-6s-2 26-16 30-20 20-34 16S28 72 40 60zM110 45c20-6 45 4 50 22s-10 30-26 28-18 16-30 10-16-30-6-44 2-12 12-16zM95 120c14-4 30 6 32 20s-8 30-22 30-24-12-24-26 4-20 14-24z"/><path fill="#fff" opacity=".7" d="M30 95c30-8 60-6 90-2-30 6-60 8-90 2zM90 160c25-6 50-6 75 0-25 5-50 5-75 0z"/></g>${top}` };
    case 'mars':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#C1440E"/><g clip-path="url(#${p}-c)"><g fill="#8E2F08" opacity=".7"><ellipse cx="75" cy="95" rx="28" ry="12"/><ellipse cx="135" cy="125" rx="22" ry="10"/><ellipse cx="110" cy="75" rx="14" ry="6"/></g><ellipse cx="100" cy="24" rx="34" ry="10" fill="#F4EDE6"/></g>${top}` };
    case 'jupiter':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#D8B48A"/>${bands([[34, 12, '#B07A4F'], [58, 10, '#E8D2B0'], [76, 14, '#9C6A45'], [104, 10, '#E8D2B0'], [120, 14, '#B07A4F'], [146, 10, '#C99A6B']])}<ellipse cx="130" cy="127" rx="16" ry="9" fill="#C1502E"/>${top}` };
    case 'saturn': {
      // Ring behind the planet, the planet, then the front half of the ring.
      const ring = (d) => `<path d="${d}" fill="none" stroke="#CDB47A" stroke-width="10"/><path d="${d}" fill="none" stroke="#E8D7A8" stroke-width="4"/>`;
      return { defs: clip + shade, body: `<g transform="rotate(-18 100 100)">${ring('M6 100a94 24 0 1 1 188 0')}<circle cx="100" cy="100" r="62" fill="#E3C98D"/>${bandsSmall(p)}<circle cx="100" cy="100" r="62" fill="url(#${p}-s)"/>${ring('M194 100a94 24 0 1 1 -188 0')}</g>` };
    }
    case 'uranus':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#9FE3E6"/>${bands([[70, 8, '#B6EDEF'], [120, 8, '#8AD6DA']])}${top}` };
    case 'neptune':
      return { defs: clip + shade, body: `<circle cx="100" cy="100" r="80" fill="#3F5BD8"/><g clip-path="url(#${p}-c)"><ellipse cx="80" cy="110" rx="18" ry="9" fill="#2A3C9E"/><path d="M40 70c40-8 80-8 120 0" stroke="#fff" stroke-opacity=".45" stroke-width="5" fill="none"/></g>${top}` };
    default:
      throw new Error('unknown planet ' + id);
  }
}

// Saturn's bands sit on its smaller (r=62) disc.
function bandsSmall(p) {
  return `<clipPath id="${p}-c2"><circle cx="100" cy="100" r="62"/></clipPath><g clip-path="url(#${p}-c2)"><rect x="0" y="70" width="200" height="10" fill="#CFAE6E"/><rect x="0" y="112" width="200" height="12" fill="#CFAE6E"/></g>`;
}

// One planet on its own, for the picture quiz.
function planetSvg(id) {
  const a = art(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>${a.defs}</defs>${a.body}</svg>`;
}

// The Solar System in a row (sizes and distances not to scale), for the click-the-planet quiz.
// planets: [{ id }] in order from the Sun. Each planet gets a transparent hit circle with
// class "c" and data-id, which the quiz engine colours when answered.
const LAYOUT = { mercury: [285, 11], venus: [340, 17], earth: [402, 18], mars: [460, 13], jupiter: [565, 50], saturn: [700, 42], uranus: [822, 27], neptune: [928, 26] };
function solarSystemSvg(planets) {
  const H = 360;
  const cy = H / 2;
  const sun = { cx: -140, r: 330 };
  // A fixed scatter of stars, so every build draws the same sky.
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  let stars = '';
  for (let i = 0; i < 70; i++) stars += `<circle cx="${Math.round(rnd() * 1000)}" cy="${Math.round(rnd() * H)}" r="${(rnd() * 1.4 + 0.4).toFixed(1)}"/>`;
  let defs = '<radialGradient id="sun" cx=".75" cy=".5" r=".6"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".6" stop-color="#FFC233"/><stop offset="1" stop-color="#FF8A1F"/></radialGradient>';
  let orbits = '';
  let bodies = '';
  let hits = '';
  for (const p of planets) {
    const [x, r] = LAYOUT[p.id];
    orbits += `<circle cx="${sun.cx}" cy="${cy}" r="${x - sun.cx}"/>`;
    const a = art(p.id);
    defs += a.defs;
    const s = r / 80;
    bodies += `<g transform="translate(${(x - 100 * s).toFixed(1)} ${(cy - 100 * s).toFixed(1)}) scale(${s.toFixed(3)})">${a.body}</g>`;
    hits += `<circle class="c" data-id="${p.id}" cx="${x}" cy="${cy}" r="${Math.max(r + 6, 18)}" fill="transparent"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="solar" viewBox="0 0 1000 ${H}" role="img"><defs>${defs}</defs>`
    + `<rect width="1000" height="${H}" fill="#0B1030"/><g fill="#fff" opacity=".7">${stars}</g>`
    + `<g fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1">${orbits}</g>`
    + `<circle cx="${sun.cx}" cy="${cy}" r="${sun.r}" fill="url(#sun)"/>${bodies}${hits}</svg>`;
}

module.exports = { planetSvg, solarSystemSvg };
