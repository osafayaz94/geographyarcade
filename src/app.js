// Quiz engine. Loaded with `defer`; every page works without it (answers are in the HTML).
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fmt = function (s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var root = document.documentElement.getAttribute('data-root') || '/';

  // Pick n wrong answers, preferring ones that are not identical text to the right one.
  function options(items, item, field, n) {
    var right = item[field];
    var pool = shuffle(items.filter(function (x) { return x !== item && x[field] && x[field] !== right; }));
    var seen = {}; seen[right] = 1;
    var out = [right];
    for (var i = 0; i < pool.length && out.length < n + 1; i++) if (!seen[pool[i][field]]) { seen[pool[i][field]] = 1; out.push(pool[i][field]); }
    return shuffle(out);
  }

  // ---------- Home: one flag at a time ----------
  var hero = $('#hero');
  if (hero) {
    var hd = JSON.parse($('#hero-data').textContent);
    var img = $('.flag', hero), box = $('.opts', hero), next = $('.next', hero);
    var bind = function (answer) {
      Array.prototype.forEach.call(box.children, function (b) {
        b.onclick = function () {
          Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; if (x.textContent === answer) x.classList.add('ok'); });
          if (b.textContent !== answer) b.classList.add('bad');
          next.hidden = false; next.focus();
        };
      });
    };
    bind(hero.getAttribute('data-answer'));
    next.onclick = function () {
      var item = hd[Math.floor(Math.random() * hd.length)];
      img.src = root + 'flags/' + item.id.toLowerCase() + '.svg';
      box.innerHTML = '';
      options(hd, item, 'n', 3).forEach(function (o) { var b = el('button', 'opt', o); b.type = 'button'; box.appendChild(b); });
      next.hidden = true;
      bind(item.n);
    };
  }

  // ---------- Quiz pages ----------
  var game = $('#game');
  if (!game) return;
  var Q = JSON.parse($('#quiz-data').textContent);
  var S = Q.s;
  // Picture quizzes: item.img names the file when it is not "<id>.svg" (division flags can be PNG).
  var imgOf = function (item) { return root + (Q.imgBase || 'flags/') + (item.img || item.id.toLowerCase() + '.svg'); };
  var isMap = Q.type === 'map' || Q.type === 'pmap';
  var bestKey = 'best:' + Q.key;
  var state, timer;

  var stage = $('.stage', game);
  var bar = el('div', 'bar');
  var meter = el('div', 'meter'); meter.appendChild(el('i'));
  var prompt = el('p', 'prompt'); prompt.setAttribute('aria-live', 'polite');
  var feedback = el('p', 'feedback'); feedback.setAttribute('role', 'status');

  // Q.seconds: a countdown round (answer as many as you can) instead of a fixed list.
  var clock = function (s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
  function tick() {
    if (!state || state.done) return;
    var s = Math.floor((Date.now() - state.t0) / 1000);
    if (Q.seconds) {
      var left = Math.max(0, Q.seconds - s);
      $('.tm', bar).textContent = clock(left);
      meter.firstChild.style.width = (100 * (Q.seconds - left) / Q.seconds) + '%';
      if (!left) finish();
      return;
    }
    $('.tm', bar).textContent = clock(s);
  }
  function drawBar() {
    bar.innerHTML = '';
    var p = el('span', 'grow'); p.innerHTML = '<b></b>'; p.firstChild.textContent = Q.seconds ? '' : fmt(S.progress, { i: Math.min(state.i + 1, state.list.length), n: state.list.length });
    var sc = el('span'); sc.textContent = S.score + ': '; sc.appendChild(el('b', null, state.score));
    var tm = el('span'); tm.textContent = (Q.seconds ? S.timeLeft : S.time) + ': '; tm.appendChild(el('b', 'tm', Q.seconds ? clock(Q.seconds) : '0:00'));
    bar.append(p, sc, tm);
    if (!Q.seconds) meter.firstChild.style.width = (100 * state.i / state.list.length) + '%';
    tick();
  }

  function start() {
    var list = shuffle(Q.items.filter(function (x) { return Q.type !== 'capitals' && Q.type !== 'pcap' || x.a; }));
    if (Q.limit) list = list.slice(0, Q.limit); // e.g. 20 countries per round
    state = { list: list, i: 0, score: 0, miss: [], t0: Date.now(), done: false };
    stage.innerHTML = '';
    stage.append(bar, meter, prompt);
    if (isMap) { overlay.remove(); tip.hidden = true; stage.appendChild(mapBox); resetMap(); } else stage.appendChild(mcBox);
    stage.appendChild(feedback);
    clearInterval(timer); timer = setInterval(tick, 1000);
    ask();
  }

  function advance(correct, item) {
    if (correct) state.score++; else state.miss.push(item);
    state.i++;
    if (Q.seconds && state.i >= state.list.length) { state.list = state.list.concat(shuffle(Q.items)); } // keep going until time runs out
    var wait = Q.seconds ? (correct ? 250 : 800) : (correct ? 650 : 1400);
    setTimeout(function () { if (state.done) return; state.i >= state.list.length ? finish() : ask(); }, wait);
  }

  // "Pick all that apply": toggle options, then Check. Correct only if the picks match exactly.
  function askMulti(item) {
    prompt.textContent = item.p;
    var box = el('div', 'opts multi');
    var picked = {};
    shuffle(item.o).forEach(function (o) {
      var b = el('button', 'opt', o); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.onclick = function () { picked[o] = !picked[o]; b.setAttribute('aria-pressed', String(!!picked[o])); b.classList.toggle('on', !!picked[o]); };
      box.appendChild(b);
    });
    var go = el('button', 'btn check', S.check); go.type = 'button';
    go.onclick = function () {
      var ok = true;
      Array.prototype.forEach.call(box.children, function (x) {
        x.disabled = true;
        var right = item.a.indexOf(x.textContent) >= 0;
        if (right) x.classList.add('ok');
        if (picked[x.textContent] && !right) x.classList.add('bad');
        if (!!picked[x.textContent] !== right) ok = false;
      });
      go.disabled = true;
      feedback.textContent = ok ? S.right : fmt(S.wrong, { a: item.a.join(', ') });
      feedback.className = 'feedback ' + (ok ? 'ok' : 'bad');
      advance(ok, item);
    };
    mcBox.append(box, go);
  }

  function ask() {
    drawBar();
    feedback.textContent = ''; feedback.className = 'feedback';
    var item = state.list[state.i];
    if (isMap) return askMap(item);
    mcBox.innerHTML = '';
    if (Q.type === 'multi') return askMulti(item);
    var field = Q.type === 'flags' ? 'n' : 'a';
    // Questions that bring their own prompt and options (currencies, languages, hemispheres, yes/no).
    var fixed = item.o ? (Q.type === 'tf' ? item.o : shuffle(item.o)) : null;
    if (fixed) prompt.textContent = item.p;
    else if (Q.type === 'flags') {
      prompt.textContent = S.qFlag;
      var im = el('img', 'flag'); im.src = imgOf(item); im.alt = ''; im.width = 400; im.height = 300;
      mcBox.appendChild(im);
      // Warm the cache for the next flag.
      var nx = state.list[state.i + 1]; if (nx) (new Image()).src = imgOf(nx);
    } else {
      prompt.textContent = fmt(S.qCapital, { c: item.n });
      // Capitals quizzes: the country's outline above the choices (item.s: an outline exists).
      if (Q.picBase && item.s) {
        var pic = el('img', 'pic'); pic.src = root + Q.picBase + item.id.toLowerCase() + '.svg'; pic.alt = ''; pic.width = 260; pic.height = 195;
        mcBox.appendChild(pic);
        var nxt = state.list[state.i + 1]; if (nxt && nxt.s) (new Image()).src = root + Q.picBase + nxt.id.toLowerCase() + '.svg';
      }
    }
    var box = el('div', 'opts');
    (fixed || options(state.list, item, field, 3)).forEach(function (o) {
      var b = el('button', 'opt', o); b.type = 'button';
      b.onclick = function () {
        Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; if (x.textContent === item[field]) x.classList.add('ok'); });
        var ok = o === item[field];
        if (!ok) b.classList.add('bad');
        feedback.textContent = ok ? S.right : fmt(S.wrong, { a: item[field] });
        feedback.className = 'feedback ' + (ok ? 'ok' : 'bad');
        advance(ok, item);
      };
      box.appendChild(b);
    });
    mcBox.appendChild(box);
  }
  var mcBox = el('div');

  function finish() {
    state.done = true; clearInterval(timer);
    meter.firstChild.style.width = '100%';
    var n = Q.seconds ? state.i : state.list.length; // a countdown round counts the questions answered
    var best = store.get(bestKey);
    if (best == null || state.score > best) { best = state.score; store.set(bestKey, best); }
    var r = el('div', 'result');
    r.appendChild(el('p', 'big', state.score + ' / ' + n));
    r.appendChild(el('p', null, fmt(S.done, { s: state.score, n: n }) + ' · ' + $('.tm', bar).textContent));
    r.appendChild(el('p', 'note', fmt(S.best, { b: best, n: n })));
    var again = el('button', 'btn', S.restart); again.type = 'button'; again.onclick = start;
    r.appendChild(again);
    if (state.miss.length) {
      r.appendChild(el('h3', null, S.mistakes));
      var ul = el('ul');
      state.miss.forEach(function (m) { ul.appendChild(el('li', null, (m.p ? m.p + ' ' : m.n + (m.a && Q.type !== 'flags' ? ': ' : '')) + (m.a && Q.type !== 'flags' ? [].concat(m.a).join(', ') : ''))); });
      r.appendChild(ul);
    }
    stage.innerHTML = ''; stage.appendChild(r);
    // Keep the coloured-in map under the score so players can study it (names show on hover).
    if (isMap) stage.appendChild(mapBox);
    again.focus();
  }

  // ---------- Map mode ----------
  // Map quizzes ship the map frame in the HTML at its final size, so nothing shifts on load.
  var mapBox = $('.map', game) || el('div', 'map');
  var svg, vb0, vb, byId = {};
  var nameOf = {};
  Q.items.forEach(function (x) { nameOf[x.id] = x.n; });
  // Before the first game the map is on show with a Start button over it.
  var overlay = el('div', 'overlay');
  var tip = el('div', 'tip'); tip.hidden = true;
  if (isMap) {
    var go = el('button', 'btn start', S.start); go.type = 'button'; go.onclick = start;
    overlay.append(go, el('p', null, S.mapHint));
    mapBox.style.setProperty('--ar', Q.ar);
    var ar = Q.ar.split('/');
    mapBox.style.setProperty('--arn', ar[0] / ar[1]); // keeps the whole map on screen
    var loadingEl = $('.maploading', mapBox) || mapBox.appendChild(el('div', 'maploading', S.loading));
    mapBox.appendChild(overlay);
    stage.innerHTML = '';
    stage.appendChild(mapBox);
    fetch(Q.map).then(function (r) { return r.text(); }).then(function (txt) {
      loadingEl.remove();
      mapBox.insertAdjacentHTML('afterbegin', txt);
      mapBox.appendChild(tip);
      svg = $('svg', mapBox);
      svg.setAttribute('aria-label', Q.title);
      vb0 = svg.getAttribute('viewBox').split(' ').map(Number);
      vb = vb0.slice();
      Array.prototype.forEach.call(svg.querySelectorAll('.c'), function (p) { (byId[p.getAttribute('data-id')] = byId[p.getAttribute('data-id')] || []).push(p); });
      var z = el('div', 'zoom');
      [['+', S.zoomIn, 1 / 1.6], ['−', S.zoomOut, 1.6], ['⟲', S.zoomReset, 0]].forEach(function (d) {
        var b = el('button', null, d[0]); b.type = 'button'; b.title = d[1]; b.setAttribute('aria-label', d[1]);
        b.onclick = function () { d[2] ? zoom(d[2], vb[0] + vb[2] / 2, vb[1] + vb[3] / 2) : resetMap(); };
        z.appendChild(b);
      });
      mapBox.appendChild(z);
      bindPan();
      if (state && !state.done) askMap(state.list[state.i]);
    });
  }
  function setVB() { if (svg) svg.setAttribute('viewBox', vb.join(' ')); }
  function resetMap() { if (!vb0) return; vb = vb0.slice(); setVB(); if (svg) Array.prototype.forEach.call(svg.querySelectorAll('.c'), function (p) { p.classList.remove('ok', 'bad', 'flash', 'done-ok', 'done-bad'); }); }
  function zoom(f, cx, cy) {
    var w = Math.min(vb0[2], Math.max(vb0[2] / 40, vb[2] * f)), h = w * vb0[3] / vb0[2];
    vb = [cx - (cx - vb[0]) * w / vb[2], cy - (cy - vb[1]) * h / vb[3], w, h];
    clamp(); setVB();
  }
  function clamp() {
    vb[0] = Math.max(vb0[0] - vb[2] * .25, Math.min(vb[0], vb0[0] + vb0[2] - vb[2] * .75));
    vb[1] = Math.max(vb0[1] - vb[3] * .25, Math.min(vb[1], vb0[1] + vb0[3] - vb[3] * .75));
  }
  function toSvg(x, y) { var r = svg.getBoundingClientRect(); return [vb[0] + (x - r.left) * vb[2] / r.width, vb[1] + (y - r.top) * vb[3] / r.height]; }
  function bindPan() {
    var pts = {}, moved = 0, last = null, pinch = null;
    svg.addEventListener('wheel', function (e) { e.preventDefault(); var p = toSvg(e.clientX, e.clientY); zoom(e.deltaY < 0 ? 1 / 1.25 : 1.25, p[0], p[1]); }, { passive: false });
    svg.addEventListener('pointerdown', function (e) { pts[e.pointerId] = [e.clientX, e.clientY]; moved = 0; last = [e.clientX, e.clientY]; pinch = null; });
    svg.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = [e.clientX, e.clientY];
      var ids = Object.keys(pts);
      var r = svg.getBoundingClientRect();
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        var c = toSvg((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        if (pinch) zoom(pinch / d, c[0], c[1]);
        pinch = d; moved = 99; return;
      }
      var dx = e.clientX - last[0], dy = e.clientY - last[1];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6 && vb[2] < vb0[2]) { if (!svg.hasPointerCapture(e.pointerId)) svg.setPointerCapture(e.pointerId); vb[0] -= dx * vb[2] / r.width; vb[1] -= dy * vb[3] / r.height; clamp(); setVB(); }
      last = [e.clientX, e.clientY];
    });
    var up = function (e) { delete pts[e.pointerId]; pinch = null; };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    svg.addEventListener('click', function (e) {
      if (moved > 6) return;
      var t = e.target.closest('.c');
      if (!t) return;
      if (state && !state.done) pick(t.getAttribute('data-id'));
      else showTip(t, e); // study mode: a tap shows the name
    });
    // Study mode (before a game and after it): hovering shows names. Never during a game.
    svg.addEventListener('mousemove', function (e) {
      var t = e.target.closest && e.target.closest('.c');
      if (t && !(state && !state.done)) showTip(t, e); else tip.hidden = true;
    });
    svg.addEventListener('mouseleave', function () { tip.hidden = true; });
  }
  function showTip(t, e) {
    var name = nameOf[t.getAttribute('data-id')];
    if (!name) { tip.hidden = true; return; }
    var r = mapBox.getBoundingClientRect();
    tip.textContent = name;
    tip.style.left = (e.clientX - r.left) + 'px';
    tip.style.top = (e.clientY - r.top) + 'px';
    tip.hidden = false;
  }
  function paint(id, cls, on) { (byId[id] || []).forEach(function (p) { p.classList.toggle(cls, on !== false); }); }
  function askMap(item) {
    prompt.textContent = fmt(S.qFind, { c: item.n });
    state.tries = 3; state.locked = false;
  }
  function pick(id) {
    var item = state.list[state.i];
    if (state.locked || !svg) return;
    if (id === item.id) {
      state.locked = true;
      var first = state.tries === 3;
      // Green if found first time, red if it took more tries (it scores nothing).
      paint(id, first ? 'done-ok' : 'done-bad');
      feedback.textContent = S.right; feedback.className = 'feedback ok';
      return advance(first, item);
    }
    state.tries--;
    paint(id, 'bad'); setTimeout(function () { paint(id, 'bad', false); }, 500);
    var other = Q.items.filter(function (x) { return x.id === id; })[0];
    if (state.tries > 0) {
      feedback.textContent = (other ? other.n + '. ' : '') + fmt(S.triesLeft, { t: state.tries });
      feedback.className = 'feedback bad';
      return;
    }
    state.locked = true;
    paint(item.id, 'flash');
    feedback.textContent = fmt(S.wrong, { a: item.n }); feedback.className = 'feedback bad';
    setTimeout(function () { paint(item.id, 'flash', false); paint(item.id, 'done-bad'); }, 1400);
    advance(false, item);
  }

  if (!isMap) $('.start', game).addEventListener('click', start);
})();
