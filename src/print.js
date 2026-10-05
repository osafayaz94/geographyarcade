// Printable maps (/printables/...): loads the quiz map as inline SVG, numbers every place in the
// list (in list order) and switches between three versions: a blank outline map, a worksheet
// (numbers on the map, empty lines in the list), a labelled map (names on the map) and an answer
// key (numbers and names). Every version carries a small geographyarcade.com mark.
// Without this script the page still shows the coloured map image and the full list of names.
(function () {
  'use strict';
  var box = document.querySelector('.pmap');
  if (!box) return;
  var NS = 'http://www.w3.org/2000/svg';
  var body = document.body;

  // Version buttons, and the Print button (window.print opens the browser's print dialog,
  // where "Save as PDF" makes a PDF).
  function setMode(mode) {
    body.classList.remove('pm-blank', 'pm-worksheet', 'pm-labeled', 'pm-answers');
    body.classList.add('pm-' + mode);
    Array.prototype.forEach.call(document.querySelectorAll('[data-mode]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
  }
  // A link can name the version (#blank, #worksheet, #labeled, #answers); switching updates it,
  // so the address can be shared or bookmarked.
  var MODES = ['blank', 'worksheet', 'labeled', 'answers'];
  Array.prototype.forEach.call(document.querySelectorAll('[data-mode]'), function (b) {
    b.addEventListener('click', function () {
      setMode(b.getAttribute('data-mode'));
      if (window.history && history.replaceState) history.replaceState(null, '', '#' + b.getAttribute('data-mode'));
    });
  });
  var printBtn = document.querySelector('[data-print]');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  var fromLink = location.hash.slice(1);
  setMode(MODES.indexOf(fromLink) >= 0 ? fromLink : 'worksheet');

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
    var items = Array.prototype.slice.call(document.querySelectorAll('.pkey li[data-id]'));
    // Crowded maps (the world: 195 countries) use smaller numbers and number only the places big
    // enough to hold one; the others are left out of the worksheet list too, so the numbers on
    // the map and in the list always match.
    var crowded = items.length > 80;
    // Country outlines carry only their capital: big, readable labels there.
    var size = crowded ? Math.max(7, Math.round(vb[2] / 120)) : items.length <= 3 ? Math.round(vb[2] / 38) : Math.max(8, Math.round(vb[2] / 85));
    var minArea = crowded ? size * size * 2.2 : 0;
    var n = 0;
    items.forEach(function (li) {
      var els = svg.querySelectorAll('[data-id="' + li.getAttribute('data-id') + '"]');
      var pick = null;
      Array.prototype.forEach.call(els, function (el) {
        var c = centre(el);
        if (c && (!pick || c.area > pick.c.area)) pick = { el: el, c: c };
      });
      if (!pick || pick.c.area < minArea) { li.classList.add('pskip'); return; }
      n += 1;
      var t = document.createElementNS(NS, 'text');
      t.setAttribute('x', pick.c.x);
      t.setAttribute('y', pick.c.y);
      t.setAttribute('class', 'pnum');
      t.setAttribute('font-size', size);
      t.textContent = String(n);
      pick.el.parentNode.appendChild(t);
      // The name, for the labelled version.
      var nm = document.createElementNS(NS, 'text');
      nm.setAttribute('x', pick.c.x);
      nm.setAttribute('y', pick.c.y);
      nm.setAttribute('class', 'pname');
      nm.setAttribute('font-size', Math.max(6, Math.round(size * 0.8)));
      nm.textContent = (li.querySelector('.nm') || li).textContent;
      pick.el.parentNode.appendChild(nm);
    });
    // The site's mark in the bottom corner of every version.
    var wm = document.createElementNS(NS, 'text');
    wm.setAttribute('x', vb[0] + vb[2] - 10);
    wm.setAttribute('y', vb[1] + vb[3] - 10);
    wm.setAttribute('class', 'pwm');
    wm.setAttribute('font-size', Math.max(10, Math.round(vb[2] / 60)));
    wm.textContent = 'geographyarcade.com';
    svg.appendChild(wm);
  });
})();
