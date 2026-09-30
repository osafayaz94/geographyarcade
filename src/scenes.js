// Illustrated stamp art (320x190) for games where a map close-up says little:
// volcanoes, mountains, deserts, mountain ranges, lakes and islands. Flat shapes only.

const svg = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190"><defs>${defs}</defs>${body}</svg>`;
const sky = (id, top, bottom) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`;
const pine = (x, y, h, fill = '#1F4031') => `<rect x="${x - 1.5}" y="${y - 6}" width="3" height="6" fill="#4A3526"/><polygon points="${x - h * 0.32},${y - 5} ${x},${y - h} ${x + h * 0.32},${y - 5}" fill="${fill}"/>`;
const birds = (list) => list.map(([x, y]) => `<path d="M${x - 6} ${y}q3-4 6 0q3-4 6 0" fill="none" stroke="#34496B" stroke-width="1.6" stroke-linecap="round"/>`).join('');

const SCENES = {
  volcanoes: () => svg(
    sky('s', '#FF9F68', '#FFE3B3') + '<radialGradient id="g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD166"/><stop offset="1" stop-color="#FFD166" stop-opacity="0"/></radialGradient>',
    '<rect width="320" height="190" fill="url(#s)"/>'
    + '<g fill="#7A7A7A" opacity=".8"><circle cx="152" cy="46" r="15"/><circle cx="170" cy="32" r="20"/><circle cx="194" cy="22" r="18"/><circle cx="216" cy="16" r="14"/><circle cx="140" cy="30" r="11"/></g>'
    + '<circle cx="162" cy="74" r="42" fill="url(#g)"/>'
    + '<path d="M0 150Q60 128 110 142T220 136T320 132V190H0Z" fill="#9C6B4A"/>'
    + '<polygon points="58,190 142,74 182,74 272,190" fill="#5B3A29"/><polygon points="162,74 182,74 272,190 206,190" fill="#48291B"/>'
    + '<ellipse cx="162" cy="75" rx="21" ry="5" fill="#FF6B35"/>'
    + '<path d="M152 77C146 100 152 122 138 152L147 153C158 124 154 100 160 77Z" fill="#FF6B35"/><path d="M168 77C176 104 170 128 188 162L196 160C181 126 185 100 175 77Z" fill="#F4442E"/>'
    + '<rect y="176" width="320" height="14" fill="#3E2A1F"/>' + pine(24, 178, 24, '#2E3B2A') + pine(40, 178, 18, '#2E3B2A') + pine(292, 178, 22, '#2E3B2A'),
  ),
  mountains: () => svg(
    sky('s', '#8FD0F2', '#E6F6FF'),
    '<rect width="320" height="190" fill="url(#s)"/><circle cx="266" cy="38" r="17" fill="#FFD166"/>'
    + '<polygon points="0,150 55,98 98,126 146,78 196,122 250,90 320,138 320,190 0,190" fill="#A9BCD6"/>'
    + '<polygon points="66,190 176,28 292,190" fill="#56709A"/><polygon points="176,28 292,190 204,190" fill="#445C82"/>'
    + '<polygon points="176,28 148,70 160,66 169,77 179,64 190,75 205,65" fill="#FFFFFF"/>'
    + '<path d="M0 170Q80 154 160 168T320 164V190H0Z" fill="#2F5D46"/>'
    + pine(18, 182, 30) + pine(38, 184, 22) + pine(282, 182, 28) + pine(302, 184, 22) + pine(262, 185, 18),
  ),
  deserts: () => svg(
    sky('s', '#FFDFA6', '#FFF6E0'),
    '<rect width="320" height="190" fill="url(#s)"/><circle cx="248" cy="46" r="27" fill="#F4A259"/>'
    + '<path d="M0 128Q80 98 160 124T320 116V190H0Z" fill="#E9C46A"/>'
    + '<path d="M0 150Q100 118 200 150T320 144V190H0Z" fill="#D9A441"/>'
    + '<path d="M0 172Q120 150 240 172T320 168V190H0Z" fill="#C98A3A"/>'
    + '<g fill="#4E8A3A"><rect x="84" y="92" width="17" height="74" rx="8.5"/><path d="M84 132H70a7 7 0 0 1-7-7v-20a7 7 0 0 1 14 0v13h7Z"/><path d="M101 120h11v-22a7 7 0 0 1 14 0v28a7 7 0 0 1-7 7h-18Z"/></g>'
    + '<g stroke="#3B6B2C" stroke-width="1.2"><path d="M92.5 100v60"/></g>'
    + '<ellipse cx="228" cy="170" rx="15" ry="6" fill="#8C6A4A"/><ellipse cx="246" cy="172" rx="8" ry="4" fill="#7A5A3C"/>',
  ),
  ranges: () => svg(
    sky('s', '#CFE8F5', '#F4F9FB'),
    '<rect width="320" height="190" fill="url(#s)"/>' + birds([[60, 30], [78, 38], [240, 26]])
    + '<path d="M0 120L30 90 55 105 85 68 115 100 140 80 170 105 200 62 230 95 260 74 290 100 320 84V190H0Z" fill="#B8C7D9"/>'
    + '<g fill="#fff"><polygon points="85,68 76,80 94,80"/><polygon points="200,62 190,76 210,76"/><polygon points="260,74 252,84 268,84"/></g>'
    + '<path d="M0 140L40 104 70 124 110 94 150 130 190 100 230 130 270 104 320 134V190H0Z" fill="#7D93B2"/>'
    + '<path d="M0 160L50 130 90 150 140 118 190 154 240 128 290 150 320 140V190H0Z" fill="#56709A"/>'
    + '<path d="M0 178L60 158 120 172 180 148 240 170 320 158V190H0Z" fill="#34496B"/>',
  ),
  lakes: () => svg(
    sky('s', '#BDE6FA', '#EAF7FD'),
    '<rect width="320" height="190" fill="url(#s)"/>'
    + '<path d="M0 112L60 60 110 100 170 48 230 94 280 64 320 90V122H0Z" fill="#8FA7C4"/>'
    + '<g fill="#fff"><polygon points="170,48 158,62 182,62"/><polygon points="60,60 51,70 69,70"/><polygon points="280,64 272,73 288,73"/></g>'
    + '<rect y="120" width="320" height="56" fill="#3E8FC4"/>'
    + '<path d="M0 122L60 170 110 134 170 186 230 140 280 168 320 144V122Z" fill="#8FA7C4" opacity=".28"/>'
    + '<g>' + Array.from({ length: 22 }, (_, i) => pine(8 + i * 14.5, 124, 14 + (i % 3) * 4, '#2F5D46')).join('') + '</g>'
    + '<g stroke="#fff" stroke-width="1.5" opacity=".6" stroke-linecap="round"><path d="M40 146h26M120 158h30M240 150h22M180 168h18"/></g>'
    + '<path d="M196 150h36l-6 8h-24Z" fill="#8B5A2B"/><path d="M212 150v-26l14 24Z" fill="#FBF8F1"/><path d="M212 150v-22" stroke="#4A3526" stroke-width="1.5"/>'
    + '<path d="M0 176Q160 166 320 176V190H0Z" fill="#6E9E4E"/>',
  ),
  islands: () => {
    const palm = (x, y, tx, ty) => `<path d="M${x} ${y}Q${(x + tx) / 2 - 8} ${(y + ty) / 2} ${tx} ${ty}" fill="none" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>`
      + [[-26, 6], [-20, -10], [0, -16], [20, -10], [26, 8]].map(([dx, dy]) => `<path d="M${tx} ${ty}q${dx / 2} ${dy - 10} ${dx} ${dy}q${-dx / 3} ${-dy / 3 + 2} ${-dx} ${-dy}Z" fill="#3E8E41"/>`).join('');
    return svg(
      sky('s', '#8FDDF5', '#E8FAFF'),
      '<rect width="320" height="190" fill="url(#s)"/><circle cx="58" cy="40" r="20" fill="#FFD166"/>'
      + '<rect y="118" width="320" height="72" fill="#2E9BD6"/><rect y="150" width="320" height="40" fill="#2789C2"/>'
      + '<path d="M104 150Q170 106 246 150Z" fill="#F2D49B"/><path d="M128 136Q170 114 220 136Q170 126 128 136Z" fill="#6DB33F"/>'
      + palm(160, 134, 150, 84) + palm(192, 136, 208, 94)
      + '<path d="M258 140Q276 128 298 140Z" fill="#F2D49B"/>' + palm(278, 134, 282, 112).replace(/stroke-width="5"/, 'stroke-width="3"')
      + '<g stroke="#fff" stroke-width="2" fill="none" opacity=".75" stroke-linecap="round"><path d="M20 164q8-5 16 0t16 0"/><path d="M70 176q8-5 16 0t16 0"/><path d="M230 170q8-5 16 0t16 0"/><path d="M270 158q8-5 16 0"/></g>',
    );
  },
};

module.exports = { SCENES };
