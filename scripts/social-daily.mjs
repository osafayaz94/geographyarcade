#!/usr/bin/env node
// Daily social posts for Geography Arcade: one Instagram post, one Instagram story and one Facebook
// post a day, each a multiple-choice question (flag, country shape or capital) built from the site's
// own data, so every fact is the site's.
//
//   node scripts/social-daily.mjs plan [--start 2026-11-24] [--days 7]   make a week: images + text
//   node scripts/social-daily.mjs approve --start 2026-11-24             mark that week ready to post
//   node scripts/social-daily.mjs post [--date 2026-11-24] [--dry]       post the day (if approved)
//
// Files live in social/daily/<date>/ (gitignored): post.png (1080x1350), story.png (1080x1920),
// item.json. Instagram only takes images that are already online, so each image is first uploaded to
// the Facebook Page as an unpublished photo and Instagram is given that copy's address.
// Tokens come from .env; the Instagram token is renewed when it is more than 30 days old.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const require = createRequire(import.meta.url);
const { Resvg } = require('@resvg/resvg-js');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'social', 'daily');
const ENV_FILE = join(ROOT, '.env');
const SITE = 'geographyarcade.com';
const countries = require(join(ROOT, 'data', 'countries.json'));

// ---------- .env ----------
const env = Object.fromEntries(readFileSync(ENV_FILE, 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l))
  .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const setEnv = (key, value) => {
  let text = readFileSync(ENV_FILE, 'utf8');
  const line = `${key}=${value}`;
  text = new RegExp(`^${key}=.*$`, 'm').test(text) ? text.replace(new RegExp(`^${key}=.*$`, 'm'), line) : text.replace(/\s*$/, `\n${line}\n`);
  writeFileSync(ENV_FILE, text);
  env[key] = value;
};

// ---------- picking questions ----------
const name = (c) => c.name.en || c.name;
const capital = (c) => c.capitals && c.capitals[0] && c.capitals[0].name.en;
const hasFlag = (c) => existsSync(join(DIST, 'flags', c.iso2.toLowerCase() + '.svg'));
const hasShape = (c) => existsSync(join(DIST, 'img', 'shapes', c.iso2.toLowerCase() + '.svg'));
// By weekday (0 = Sunday): two printable-map days, the rest quizzes.
const CYCLE = ['capital', 'flag', 'shape', 'printable', 'capital', 'flag', 'printable'];
// The printable maps that already have Pinterest images (scripts/pin-images.js): [page, title lines].
const PRINTABLES = [...readFileSync(join(ROOT, 'scripts', 'pin-images.js'), 'utf8').matchAll(/\['[a-z-]+', '([a-z/-]+)', \[([^\]]+)\]/g)]
  .map((m) => ({ page: m[1], lines: [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]) }));
const usedFile = join(OUT, 'used.json');
const loadUsed = () => (existsSync(usedFile) ? JSON.parse(readFileSync(usedFile, 'utf8')) : {});

// A small seeded random so a day's question doesn't change when the plan is made again.
function rng(seed) {
  let s = [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const shuffle = (arr, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function pickQuestion(date, used) {
  const type = CYCLE[new Date(date + 'T12:00:00Z').getUTCDay()];
  const r = rng(date);
  if (type === 'printable') {
    const fresh = PRINTABLES.filter((p) => !(used.printable || []).includes(p.page));
    const p = shuffle(fresh.length ? fresh : PRINTABLES, r)[0];
    return { date, type, page: p.page, lines: p.lines, title: p.lines.join(' '), iso2: p.page, country: p.lines.join(' ') };
  }
  const ok = (c) => c.unMember !== false && (type === 'flag' ? hasFlag(c) : type === 'shape' ? hasShape(c) : !!capital(c));
  const pool = countries.filter(ok);
  const fresh = pool.filter((c) => !(used[type] || []).includes(c.iso2));
  const answer = shuffle(fresh.length ? fresh : pool, r)[0];
  // Three wrong options from the same continent, so the choice is a real one.
  const label = type === 'capital' ? capital : name;
  const others = shuffle(pool.filter((c) => c !== answer && c.continent === answer.continent && label(c) !== label(answer)), r).slice(0, 3);
  const options = shuffle([answer, ...others], r).map(label);
  return { date, type, iso2: answer.iso2, country: name(answer), slug: answer.slug, options, answer: label(answer), letter: 'ABCD'[options.indexOf(label(answer))] };
}

// ---------- text ----------
const QUESTION = { flag: 'Which country has this flag?', shape: 'Which country has this shape?', capital: (q) => `What is the capital of ${q.country}?` };
const question = (q) => (typeof QUESTION[q.type] === 'function' ? QUESTION[q.type](q) : QUESTION[q.type]);
const LINK = { flag: '/flags/world/', shape: '/guess-the-country/world/', capital: (q) => `/countries/${q.slug}/` };
const link = (q) => `https://${SITE}` + (typeof LINK[q.type] === 'function' ? LINK[q.type](q) : LINK[q.type]);
const PLAY = { flag: 'Play the full flags quiz', shape: 'Play Guess the Country', capital: (q) => `Learn more about ${q.country}` };
const play = (q) => (typeof PLAY[q.type] === 'function' ? PLAY[q.type](q) : PLAY[q.type]);
const TAGS = { flag: '#flags #geography #quiz', shape: '#geography #maps #quiz', capital: '#capitals #geography #quiz' };
const optionLines = (q) => q.options.map((o, i) => `${'ABCD'[i]}) ${o}`).join('\n');

function captions(q) {
  if (q.type === 'printable') {
    const url = `https://${SITE}/printables/${q.page}/`;
    const what = 'Blank outline map, numbered worksheet, labelled map and answer key. Print it or save it as a PDF. No sign-up.';
    return {
      instagram: `Free printable ${q.title} 🗺️

${what}

Great for class, homework and test revision. Save this post so you can find it later!

Download it free on ${SITE} (link in bio).

#printables #geography #homeschool`,
      comment: null,
      facebook: `Free printable ${q.title} 🗺️

${what}

Great for class, homework and test revision.

Download it free: ${url}`,
    };
  }
  const instagram = `${question(q)} 🌍\n\n${optionLines(q)}\n\nComment your letter, then check the first comment for the answer.\n\n${play(q)} on ${SITE} (link in bio).\n\n${TAGS[q.type]}`;
  const comment = `Answer: ${q.letter}) ${q.answer}`;
  const facebook = `${question(q)} 🌍\n\n${optionLines(q)}\n\nComment your letter before you scroll down!\n\n${play(q)}: ${link(q)}\n\n.\n.\n.\n.\n.\nAnswer: ${q.letter}) ${q.answer}`;
  return { instagram, comment, facebook };
}

// ---------- images ----------
const INK = '#152238', PAPER = '#EAF1EF', SEA = '#1F5F8B', MAG = '#A3195B', LINE = '#C5D3D0';
const FONT = "'Segoe UI', Arial, sans-serif";
const LOGO = '<circle cx="16" cy="16" r="14" fill="#1F5F8B"/><path d="M8 11c3-3 7-1 9 1s1 5-2 6-3 5 0 7M20 6c-1 3 1 5 4 5s4 3 3 6" fill="none" stroke="#B9CC8E" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="21" r="3" fill="#A3195B"/>';
const uri = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const text = (x, y, size, weight, fill, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-weight="${weight}" font-size="${size}" fill="${fill}">${esc(s)}</text>`;

// Fit a question on one or two lines.
function wrap(s, max) {
  if (s.length <= max) return [s];
  const words = s.split(' '); let a = '';
  while (words.length && (a + ' ' + words[0]).trim().length <= max) a = (a + ' ' + words.shift()).trim();
  return [a, words.join(' ')];
}

function picture(q) {
  const file = q.type === 'shape' ? join(DIST, 'img', 'shapes', q.iso2.toLowerCase() + '.svg') : join(DIST, 'flags', q.iso2.toLowerCase() + '.svg');
  let svg = readFileSync(file, 'utf8');
  // Country shapes are drawn in the site's own colours by CSS; give them a solid fill here.
  if (q.type === 'shape') svg = svg.replace('<svg ', `<svg style="fill:${SEA}" `).replace(/<path /g, `<path fill="${SEA}" stroke="${INK}" `);
  return svg;
}

function renderPrintable(q, W, H) {
  const story = H > 1400;
  const html = readFileSync(join(DIST, 'printables', q.page, 'index.html'), 'utf8');
  const map = readFileSync(join(DIST, html.match(/data-src="\/([^"]+)"/)[1]), 'utf8');
  const vb = map.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const big = q.lines.length > 1 ? 84 : 96;
  const titleY = story ? 330 : 190;
  const card = { x: 70, y: titleY + q.lines.length * big + (story ? 60 : 20), w: W - 140, h: story ? 900 : 700 };
  let mw = card.w - 60, mh = mw * vb[3] / vb[2];
  if (mh > card.h - 60) { mh = card.h - 60; mw = mh * vb[2] / vb[3]; }
  const below = card.y + card.h + (story ? 90 : 62);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${PAPER}"/>`
    + text(W / 2, titleY - big + (story ? 0 : 10), story ? 44 : 38, 700, MAG, 'FREE PRINTABLE')
    + q.lines.map((l, i) => text(W / 2, titleY + i * big * 1.02, big, 800, INK, l)).join('')
    + `<rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="18" fill="#fff" stroke="${LINE}" stroke-width="3"/>`
    + `<image href="${uri(map)}" x="${card.x + (card.w - mw) / 2}" y="${card.y + (card.h - mh) / 2}" width="${mw}" height="${mh}" preserveAspectRatio="xMidYMid meet"/>`
    + text(W / 2, below, story ? 42 : 36, 600, SEA, 'Blank map · Worksheet · Answer key')
    + (story ? text(W / 2, below + 80, 40, 600, INK, 'Free download: link in bio') : '')
    + `<g transform="translate(${W / 2 - 250} ${H - (story ? 160 : 105)}) scale(1.9)">${LOGO}</g>`
    + text(W / 2 - 180, H - (story ? 160 : 105) + 44, 44, 700, INK, SITE, 'start')
    + '</svg>';
  return new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } }).render().asPng();
}

function render(q, W, H) {
  if (q.type === 'printable') return renderPrintable(q, W, H);
  const story = H > 1400;
  const lines = wrap(question(q), story ? 22 : 26);
  const qSize = story ? 70 : 62;
  const top = story ? 300 : 150;
  const picY = top + lines.length * qSize * 1.15 + (story ? 60 : 30);
  const picH = story ? 460 : 420, picW = W - 240;
  const optY = picY + picH + (story ? 70 : 50);
  const optH = story ? 110 : 96, gap = story ? 22 : 18;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="${PAPER}"/>`
    + text(W / 2, top - (story ? 110 : 60), story ? 40 : 34, 700, MAG, q.type === 'capital' ? 'CAPITALS QUIZ' : q.type === 'flag' ? 'FLAG QUIZ' : 'GUESS THE COUNTRY')
    + lines.map((l, i) => text(W / 2, top + i * qSize * 1.15, qSize, 800, INK, l)).join('')
    + (q.type === 'capital'
      ? `<image href="${uri(picture({ ...q, type: 'flag' }))}" x="${(W - picW) / 2}" y="${picY}" width="${picW}" height="${picH}" preserveAspectRatio="xMidYMid meet"/>`
      : `<image href="${uri(picture(q))}" x="${(W - picW) / 2}" y="${picY}" width="${picW}" height="${picH}" preserveAspectRatio="xMidYMid meet"/>`)
    + q.options.map((o, i) => {
      const y = optY + i * (optH + gap);
      return `<rect x="120" y="${y}" width="${W - 240}" height="${optH}" rx="${optH / 2}" fill="#fff" stroke="${LINE}" stroke-width="3"/>`
        + text(175, y + optH * 0.64, optH * 0.42, 800, SEA, 'ABCD'[i], 'start') + text(240, y + optH * 0.64, optH * 0.38, 600, INK, o, 'start');
    }).join('')
    + `<g transform="translate(${W / 2 - 250} ${H - (story ? 160 : 105)}) scale(1.9)">${LOGO}</g>`
    + text(W / 2 - 180, H - (story ? 160 : 105) + 44, 44, 700, INK, SITE, 'start')
    + (story ? text(W / 2, H - 250, 40, 600, SEA, 'Answer in today\'s post') : '')
    + '</svg>';
  return new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' } }).render().asPng();
}

// ---------- plan / approve ----------
const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const today = () => new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 10); // Pakistan time

function plan(start, days) {
  mkdirSync(OUT, { recursive: true });
  const used = loadUsed();
  const made = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    const dir = join(OUT, date);
    const itemFile = join(dir, 'item.json');
    if (existsSync(itemFile) && JSON.parse(readFileSync(itemFile, 'utf8')).posted) continue; // never redo a posted day
    const q = pickQuestion(date, used);
    (used[q.type] = used[q.type] || []).push(q.type === 'printable' ? q.page : q.iso2);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'post.png'), render(q, 1080, 1350));
    writeFileSync(join(dir, 'story.png'), render(q, 1080, 1920));
    writeFileSync(itemFile, JSON.stringify({ ...q, ...captions(q), approved: false, posted: null }, null, 2));
    made.push(`${date}  ${q.type.padEnd(9)} ${q.country}` + (q.answer ? `  (answer ${q.letter}: ${q.answer})` : ''));
  }
  writeFileSync(usedFile, JSON.stringify(used));
  console.log(made.join('\n') || 'Nothing to plan.');
}

function approve(start, days) {
  for (let i = 0; i < days; i++) {
    const f = join(OUT, addDays(start, i), 'item.json');
    if (!existsSync(f)) continue;
    const item = JSON.parse(readFileSync(f, 'utf8'));
    item.approved = true;
    writeFileSync(f, JSON.stringify(item, null, 2));
    console.log('approved', addDays(start, i));
  }
}

// ---------- posting ----------
const V = env.IG_API_VERSION || 'v23.0';
async function call(url, opts) {
  const res = await fetch(url, opts);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`${url.split('?')[0]}: ${JSON.stringify(json.error || json)}`);
  return json;
}
const ig = (path, params = {}, method = 'GET') => {
  const u = new URL(`https://graph.instagram.com/${V}/${path}`);
  for (const [k, v] of Object.entries({ ...params, access_token: env.IG_ACCESS_TOKEN })) u.searchParams.set(k, v);
  return call(u, { method });
};

// Upload a local image to the Facebook Page (published or hidden); returns the post id and the image address.
async function fbPhoto(file, { published, caption = '' }) {
  const form = new FormData();
  form.append('source', new Blob([readFileSync(file)], { type: 'image/png' }), 'image.png');
  form.append('published', String(published));
  if (caption) form.append('caption', caption);
  form.append('access_token', env.FB_PAGE_ACCESS_TOKEN);
  const { id, post_id } = await call(`https://graph.facebook.com/${V}/${env.FB_PAGE_ID}/photos`, { method: 'POST', body: form });
  const { images } = await call(`https://graph.facebook.com/${V}/${id}?fields=images&access_token=${env.FB_PAGE_ACCESS_TOKEN}`);
  return { id: post_id || id, url: images.sort((a, b) => b.width - a.width)[0].source };
}

async function igPublish(params) {
  const { id } = await ig(`${env.IG_USER_ID}/media`, params, 'POST');
  for (let i = 0; i < 40; i++) {
    const { status_code } = await ig(id, { fields: 'status_code' });
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`Instagram media ${status_code}`);
    await new Promise((r) => setTimeout(r, 3000));
  }
  return (await ig(`${env.IG_USER_ID}/media_publish`, { creation_id: id }, 'POST')).id;
}

async function refreshToken() {
  const last = env.IG_TOKEN_REFRESHED ? Date.parse(env.IG_TOKEN_REFRESHED) : 0;
  if (Date.now() - last < 30 * 864e5) return;
  const u = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${env.IG_ACCESS_TOKEN}`;
  const { access_token } = await call(u);
  setEnv('IG_ACCESS_TOKEN', access_token);
  setEnv('IG_TOKEN_REFRESHED', new Date().toISOString().slice(0, 10));
  console.log('Instagram login renewed for another 60 days.');
}

async function post(date, dry) {
  const dir = join(OUT, date);
  const f = join(dir, 'item.json');
  if (!existsSync(f)) return console.log(`No post planned for ${date}.`);
  const item = JSON.parse(readFileSync(f, 'utf8'));
  if (!item.approved) return console.log(`${date} is not approved yet: nothing posted.`);
  item.posted = item.posted || {};
  const save = () => writeFileSync(f, JSON.stringify(item, null, 2));
  console.log(`${date}: ${item.type} quiz, ${item.country}${dry ? ' (dry run)' : ''}`);
  if (dry) return console.log(item.instagram + '\n---\n' + item.comment + '\n---\n' + item.facebook);
  await refreshToken();
  // Each step is recorded as soon as it succeeds, so a re-run after a failure never posts twice.
  if (!item.posted.instagram) {
    const hidden = await fbPhoto(join(dir, 'post.png'), { published: false });
    item.posted.instagram = await igPublish({ image_url: hidden.url, caption: item.instagram }); save();
    console.log('Instagram post', item.posted.instagram);
  }
  if (item.comment && !item.posted.comment) {
    item.posted.comment = (await ig(`${item.posted.instagram}/comments`, { message: item.comment }, 'POST')).id; save();
    console.log('Instagram answer comment', item.posted.comment);
  }
  if (!item.posted.story) {
    const hidden = await fbPhoto(join(dir, 'story.png'), { published: false });
    item.posted.story = await igPublish({ media_type: 'STORIES', image_url: hidden.url }); save();
    console.log('Instagram story', item.posted.story);
  }
  if (!item.posted.facebook) {
    item.posted.facebook = (await fbPhoto(join(dir, 'post.png'), { published: true, caption: item.facebook })).id; save();
    console.log('Facebook post', item.posted.facebook);
  }
}

// ---------- main ----------
const [cmd] = process.argv.slice(2);
const { values } = parseArgs({ args: process.argv.slice(3), options: { start: { type: 'string' }, days: { type: 'string', default: '7' }, date: { type: 'string' }, dry: { type: 'boolean', default: false } } });
const days = Number(values.days);
const next = () => { const done = existsSync(OUT) ? readdirSync(OUT).filter((d) => /^\d{4}-/.test(d)).sort() : []; return done.length && done.at(-1) >= today() ? addDays(done.at(-1), 1) : addDays(today(), 1); };
if (cmd === 'plan') plan(values.start || next(), days);
else if (cmd === 'approve') approve(values.start || addDays(today(), 1), days);
else if (cmd === 'post') post(values.date || today(), values.dry).catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
else console.log('Usage: node scripts/social-daily.mjs plan|approve|post [--start YYYY-MM-DD] [--date YYYY-MM-DD] [--dry]');
