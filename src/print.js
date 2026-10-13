// Printable maps (/printables/...): loads the quiz map as inline SVG, numbers every place in the
// list (in list order) and shows four versions one below the other: a blank outline map, a worksheet
// (numbers on the map, empty lines in the list), a labelled map (names on the map) and an answer
// key (numbers and names). Every version carries a small geographyarcade.com mark.
// Without this script the page still shows the coloured map image and the full list of names.
(function () {
  'use strict';
  var box = document.querySelector('.pmap');
  if (!box) return;
  var NS = 'http://www.w3.org/2000/svg';

  // All four versions sit one below the other. A version button scrolls to its sheet and selects
  // it; scrolling selects the sheet in view. Print prints, for a numbered map, two pages: the
  // worksheet (map + blank lines) and the answer key (map + names); a blank or labelled map prints
  // on its own (window.print opens the browser's print dialog, where "Save as PDF" makes a PDF).
  var MODES = ['blank', 'worksheet', 'labeled', 'answers'];
  var landscape = false; // a wide map prints on a landscape page (build.js sets @page for it)
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-mode]'));
  var sheets = {};
  var current = 'worksheet';
  function setMode(mode) {
    current = mode;
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
    MODES.forEach(function (m) { if (sheets[m]) sheets[m].classList.toggle('pon', m === mode); });
  }
  // A link can name the version (#blank, #worksheet, #labeled, #answers); choosing one updates
  // it, so the address can be shared or bookmarked.
  function go(mode) {
    setMode(mode);
    if (window.history && history.replaceState) history.replaceState(null, '', '#' + mode);
    if (sheets[mode]) sheets[mode].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { go(b.getAttribute('data-mode')); });
  });
  // The printed document (.pprint, shown only when printing): the chosen map, then, when that map
  // carries numbers, the answer sheet (numbered blank lines) and the answer key, each on a new page.
  // The two lists are never shown on the page itself.
  var printDoc = null;
  // buildPrint('blank') etc. prints that one version alone (scripts/make-pdfs.js: one PDF each).
  // The version is remembered, because the browser's own "beforeprint" event calls this again just
  // before printing and must not turn a single version back into the full set.
  var forced = null;
  function buildPrint(only) {
    if (!sheets.worksheet) return;
    if (typeof only === 'string') forced = only;
    only = forced;
    if (!printDoc) {
      printDoc = document.createElement('div');
      printDoc.className = 'pprint';
      sheets.answers.parentNode.parentNode.insertBefore(printDoc, sheets.answers.parentNode.nextSibling);
    }
    printDoc.innerHTML = '';
    // One page per version, like a classroom worksheet: the map with its list underneath.
    function part(mode, what) {
      var s = document.createElement('section');
      s.className = 'pm-' + mode;
      s.appendChild(sheets[mode].querySelector('h2').cloneNode(true));
      what.forEach(function (sel) {
        var el = sheets[mode].querySelector(sel);
        if (el) s.appendChild(el.cloneNode(true));
      });
      // A short list stays under its map on one page; a long one starts on the next page (and may
      // run on to a third), so a list is never cut in two across the map's page.
      if (what.indexOf('.pkey') >= 0) {
        var rows = sheets[mode].querySelectorAll('.pkey li:not(.pskip)').length;
        s.classList.add(rows > (landscape ? 30 : 50) ? 'psplit' : 'ptog');
      }
      printDoc.appendChild(s);
    }
    if (only) {
      part(only, only === 'blank' || only === 'labeled' ? ['.pmap'] : ['.pmap', '.pkey']);
    } else if (current === 'worksheet' || current === 'answers') {
      part('worksheet', ['.pmap', '.pkey']);
      part('answers', ['.pmap', '.pkey']);
    } else {
      part(current, ['.pmap']);
    }
  }
  window.buildPrint = buildPrint; // used by scripts/make-pdfs.js
  window.addEventListener('beforeprint', buildPrint);
  var printBtn = document.querySelector('[data-print]');
  if (printBtn) printBtn.addEventListener('click', function () { buildPrint(); window.print(); });
  var fromLink = location.hash.slice(1);
  setMode(MODES.indexOf(fromLink) >= 0 ? fromLink : 'worksheet');

  // Copies the finished map and list into one sheet per version, in place of the single map.
  function makeSheets(svg) {
    var key = document.querySelector('.pkey');
    var wrap = document.createElement('div');
    MODES.forEach(function (m) {
      var b = document.querySelector('[data-mode="' + m + '"]');
      var s = document.createElement('section');
      s.className = 'psheet pm-' + m;
      s.id = m;
      var h = document.createElement('h2');
      h.textContent = b ? b.textContent : m;
      // Each version has its own PDF: a download button beside its heading.
      var pl = document.querySelector('.pdl a[data-pdf="' + m + '"]');
      var lab = document.querySelector('.pdl');
      if (pl && lab) {
        var dl = document.createElement('a');
        dl.className = 'btn ghost pdfdl';
        dl.href = pl.getAttribute('href');
        dl.setAttribute('download', '');
        dl.textContent = lab.getAttribute('data-label');
        h.appendChild(dl);
      }
      var map = document.createElement('div');
      map.className = 'pmap';
      map.appendChild(svg.cloneNode(true));
      s.appendChild(h);
      s.appendChild(map);
      if (key && m !== 'blank' && m !== 'labeled') s.appendChild(key.cloneNode(true));
      wrap.appendChild(s);
      sheets[m] = s;
    });
    box.parentNode.insertBefore(wrap, box);
    box.parentNode.removeChild(box);
    if (key) key.parentNode.removeChild(key);
    setMode(current);
    if (MODES.indexOf(fromLink) >= 0) sheets[fromLink].scrollIntoView({ block: 'start' });
    // The sheet nearest the top of the screen becomes the selected one while scrolling.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setMode(e.target.id);
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      MODES.forEach(function (m) { io.observe(sheets[m]); });
    }
  }

  // The centre of the biggest piece of a shape (the mainland, not an outlying island), in the
  // coordinates of the shape's parent, so a number placed there sits on the right spot even
  // inside an inset box. The map paths use only absolute M, L and Z commands, so each piece's
  // box comes straight from its numbers, without measuring anything in the page.
  function centre(el) {
    if (el.tagName.toLowerCase() === 'circle') {
      return { x: +el.getAttribute('cx'), y: +el.getAttribute('cy'), area: 0 };
    }
    var best = null;
    (el.getAttribute('d') || '').split('M').forEach(function (d) {
      var nums = d.match(/-?\d+(?:\.\d+)?/g);
      if (!nums || nums.length < 4) return;
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (var i = 0; i + 1 < nums.length; i += 2) {
        var x = +nums[i], y = +nums[i + 1];
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      var area = (x1 - x0) * (y1 - y0);
      if (!best || area > best.area) best = { x: (x0 + x1) / 2, y: (y0 + y1) / 2, area: area };
    });
    return best;
  }

  fetch(box.getAttribute('data-src')).then(function (r) { return r.text(); }).then(function (txt) {
    var holder = document.createElement('div');
    holder.innerHTML = txt;
    var svg = holder.querySelector('svg');
    if (!svg) return;
    svg.removeAttribute('role');
    svg.setAttribute('aria-hidden', 'true');
    box.innerHTML = '';
    box.appendChild(svg);
    var vb = (svg.getAttribute('viewBox') || '0 0 1000 600').split(/\s+/).map(Number);
    landscape = vb[2] > vb[3] * 1.15;
    var items = Array.prototype.slice.call(document.querySelectorAll('.pkey li[data-id]'));
    // Crowded maps (the world: 195 countries) use smaller numbers and number only the places big
    // enough to hold one; the others are left out of the worksheet list too, so the numbers on
    // the map and in the list always match.
    var crowded = items.length > 80;
    // A map of some countries only (the Equator, a hemisphere, an organisation): those are shaded.
    var setMap = box.hasAttribute('data-set');
    if (setMap) svg.classList.add('pset');
    // Country outlines carry only their capital: big, readable labels there.
    // Minimum sizes are for a map about 1000 units wide; a cropped map (an organisation) scales them.
    var k = Math.min(1, vb[2] / 1000);
    var size = crowded ? Math.max(7 * k, vb[2] / 120) : items.length <= 3 ? vb[2] / 38 : Math.max(8 * k, vb[2] / (k < 1 ? 45 : 85));
    size = Math.round(size * 10) / 10;
    // Small-country circles shrink with a cropped map too.
    if (k < 1) Array.prototype.forEach.call(svg.querySelectorAll('circle'), function (c) { c.setAttribute('r', +c.getAttribute('r') * Math.max(k * 1.6, 0.35)); });
    var minArea = crowded ? size * size * 2.2 : 0;
    var n = 0;
    items.forEach(function (li) {
      var els = svg.querySelectorAll('[data-id="' + li.getAttribute('data-id') + '"]');
      var pick = null;
      Array.prototype.forEach.call(els, function (el) {
        var c = centre(el);
        if (c && (!pick || c.area > pick.c.area)) pick = { el: el, c: c };
      });
      if (setMap) Array.prototype.forEach.call(els, function (el) { el.classList.add('pin'); });
      if (!pick || pick.c.area < minArea) { li.classList.add('pskip'); return; }
      n += 1;
      var t = document.createElementNS(NS, 'text');
      t.setAttribute('x', pick.c.x);
      t.setAttribute('y', pick.c.y);
      t.setAttribute('class', 'pnum');
      t.setAttribute('font-size', size);
      t.textContent = String(n);
      if (k < 1) t.style.strokeWidth = (3 * k) + 'px';
      pick.el.parentNode.appendChild(t);
      // The name, for the labelled version.
      var nm = document.createElementNS(NS, 'text');
      nm.setAttribute('x', pick.c.x);
      nm.setAttribute('y', pick.c.y);
      nm.setAttribute('class', 'pname');
      nm.setAttribute('font-size', Math.round(Math.max(6 * k, size * 0.8) * 10) / 10);
      nm.textContent = (li.querySelector('.nm') || li).textContent;
      if (k < 1) nm.style.strokeWidth = (2.5 * k) + 'px';
      pick.el.parentNode.appendChild(nm);
    });
    // The site's mark in the bottom corner of every version.
    var wm = document.createElementNS(NS, 'text');
    wm.setAttribute('x', vb[0] + vb[2] - 10);
    wm.setAttribute('y', vb[1] + vb[3] - 10);
    wm.setAttribute('class', 'pwm');
    wm.setAttribute('font-size', Math.round(Math.max(10 * k, vb[2] / 60) * 10) / 10);
    wm.textContent = 'geographyarcade.com';
    svg.appendChild(wm);
    makeSheets(svg);
  });
})();
