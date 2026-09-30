// Site search: a type-ahead box in the header, plus the full results page (/search/?q=).
// The index (/search/<lang>.json) loads only when someone starts to search.
(() => {
  const forms = document.querySelectorAll('form.search');
  if (!forms.length) return;
  let index = null;
  let loading = null;
  const load = (src) => loading || (loading = fetch(src).then((r) => r.json()).then((d) => {
    index = d.map(([title, href, rank, flag, alias]) => ({ title, href, rank, flag, key: ' ' + fold(title + ' ' + (alias || '')).replace(SEP, ' ') }));
    return index;
  }));
  // Case and accent insensitive (Latin accents, Arabic vowel marks), same for query and titles.
  const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ٟ]/g, '').replace(/ß/g, 'ss');

  const SEP = /[\s,.:;!?"'«»„“”()/\-–]+/g;
  // Little words that titles phrase differently ("provinces of Spain" vs "Spain: regions").
  const STOP = new Set('of the and a in on quiz de del la las los el le les des du d y et en und der die das von e do da dos das di и в के की का और এর ও'.split(' '));
  // Chinese and Japanese have no spaces between words: match anywhere. Elsewhere: word starts.
  const CJK = /[぀-鿿]/;

  function find(q, max) {
    let words = fold(q).split(SEP).filter(Boolean);
    if (words.some((w) => !STOP.has(w))) words = words.filter((w) => !STOP.has(w));
    if (!words.length || !index) return [];
    const hits = [];
    for (const e of index) {
      let first = Infinity;
      let ok = true;
      for (const w of words) {
        let i = CJK.test(w) ? e.key.indexOf(w) : e.key.indexOf(' ' + w);
        // Plurals: "planets" also finds "planet", "volcanoes" finds "volcano".
        if (i < 0 && w.length > 4 && /s$/.test(w)) i = e.key.indexOf(' ' + w.replace(/(es|s)$/, ''));
        if (i < 0) { ok = false; break; }
        if (i < first) first = i;
      }
      // Games first (whole-world ones ahead), then titles that start with the search, then shorter titles.
      if (ok) hits.push([e.rank * 1000 + (first <= 1 ? 0 : 500) + e.title.length - (/\/world\//.test(e.href) ? 600 : 0), e]);
    }
    return hits.sort((a, b) => a[0] - b[0]).slice(0, max).map((h) => h[1]);
  }

  const esc = (s) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  const item = (e, attrs = '') => `<li${attrs}><img src="${e.flag ? `/flags/${e.flag}.svg` : '/favicon.svg'}" alt="" width="28" height="21" loading="lazy"${e.flag ? '' : ' class="nf"'}><a href="${e.href}" tabindex="-1">${esc(e.title)}</a></li>`;

  // Header type-ahead.
  for (const form of forms) {
    const input = form.querySelector('input');
    const list = form.querySelector('.sr');
    if (!list) continue;
    let active = -1;
    let shown = [];
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; input.removeAttribute('aria-activedescendant'); };
    const paint = () => {
      list.innerHTML = shown.length
        ? shown.map((e, i) => item(e, ` role="option" id="${list.id}-${i}"${i === active ? ' aria-selected="true"' : ''}`)).join('')
        : `<li class="none">${esc(form.dataset.none)}</li>`;
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      if (active >= 0) input.setAttribute('aria-activedescendant', `${list.id}-${active}`);
    };
    const update = async () => {
      const q = input.value.trim();
      if (!q) { close(); return; }
      await load(form.dataset.idx);
      if (input.value.trim() !== q) return;
      shown = find(q, 8);
      active = -1;
      paint();
    };
    input.addEventListener('focus', () => load(form.dataset.idx), { once: true });
    input.addEventListener('input', update);
    input.addEventListener('keydown', (ev) => {
      if (list.hidden || !shown.length) { if (ev.key === 'Escape') close(); return; }
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        ev.preventDefault();
        // -1 is the text box itself; the arrows cycle through it.
        if (ev.key === 'ArrowDown') active = active + 1 >= shown.length ? -1 : active + 1;
        else active = active - 1 < -1 ? shown.length - 1 : active - 1;
        paint();
      } else if (ev.key === 'Enter' && active >= 0) {
        ev.preventDefault();
        location.href = shown[active].href;
      } else if (ev.key === 'Escape') close();
    });
    list.addEventListener('mousedown', (ev) => {
      const li = ev.target.closest('li[role="option"]');
      if (li) { ev.preventDefault(); location.href = li.querySelector('a').getAttribute('href'); }
    });
    input.addEventListener('blur', () => setTimeout(close, 150));
  }

  // Full results page.
  const out = document.getElementById('search-results');
  if (out) {
    const form = document.querySelector('form.search.big');
    const input = form.querySelector('input');
    const count = document.getElementById('search-count');
    const q0 = new URLSearchParams(location.search).get('q') || '';
    input.value = q0;
    const show = async () => {
      const q = input.value.trim();
      if (!q) { out.innerHTML = ''; count.textContent = ''; return; }
      await load(form.dataset.idx);
      const hits = find(q, Infinity);
      count.textContent = hits.length ? form.dataset.results.replace('%s', q) + ` (${hits.length})` : form.dataset.none;
      out.innerHTML = hits.map((e) => item(e).replace(' tabindex="-1"', '')).join('');
    };
    input.addEventListener('input', show);
    form.addEventListener('submit', (ev) => { ev.preventDefault(); history.replaceState(null, '', '?q=' + encodeURIComponent(input.value.trim())); show(); });
    if (q0) show(); else input.focus();
  }
})();
