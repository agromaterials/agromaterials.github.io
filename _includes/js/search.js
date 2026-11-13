  // File: _includes/js/search.js - Site search (Ctrl/Cmd+K, / or the magnifier).
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- Site search (Ctrl/Cmd+K, "/" or the magnifier): the index loads only when the box is first opened ----
  var sIndex = null, sBox = null, sInput, sList, sSel = 0, sHits = [];
  var sNorm = function (t) { return String(t || '').toLowerCase(); };
  var sBuild = function () {
    sBox = document.createElement('div');
    sBox.className = 'search-modal'; sBox.hidden = true;
    sBox.innerHTML = '<div class="search-backdrop" data-search-close></div><div class="search-panel" role="dialog" aria-modal="true" aria-label="' + tr('search_open') + '">' +
      '<div class="search-field"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input type="search" autocomplete="off" spellcheck="false" aria-label="' + tr('search_open') + '"><kbd>Esc</kbd></div>' +
      '<ul class="search-list" role="listbox"></ul><p class="search-hint"></p></div>';
    document.body.appendChild(sBox);
    sInput = sBox.querySelector('input'); sList = sBox.querySelector('.search-list');
    sBox.addEventListener('click', function (e) { if (e.target.hasAttribute('data-search-close')) sClose(); });
    sInput.addEventListener('input', sRun);
    sInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!sHits.length) return;
        sSel = (sSel + (e.key === 'ArrowDown' ? 1 : -1) + sHits.length) % sHits.length; sPaint();
      } else if (e.key === 'Enter') {
        if (sHits[sSel]) { window.location.href = sHits[sSel].u; }
      }
    });
  };
  var sPaint = function () {
    var L = lang();
    sList.innerHTML = '';
    if (!sInput.value.trim()) { sBox.querySelector('.search-hint').textContent = tr('search_hint'); return; }
    sBox.querySelector('.search-hint').textContent = sHits.length ? '' : tr('search_none');
    sHits.forEach(function (h, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      if (i === sSel) li.className = 'is-sel';
      var a = document.createElement('a'); a.href = h.u;
      if (/^https?:/.test(h.u)) { a.target = '_blank'; a.rel = 'noopener'; }
      var tag = document.createElement('span'); tag.className = 'search-tag'; tag.textContent = tr('search_type_' + h.t);
      var ti = document.createElement('span'); ti.className = 'search-title'; ti.textContent = L === 'id' ? h.b : h.a;
      a.appendChild(tag); a.appendChild(ti); li.appendChild(a);
      a.addEventListener('mousemove', function () { sSel = i; var s = sList.querySelector('.is-sel'); if (s) s.classList.remove('is-sel'); li.classList.add('is-sel'); });
      sList.appendChild(li);
    });
    var cur = sList.querySelector('.is-sel'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
  };
  var sRun = function () {
    var q = sNorm(sInput.value).trim();
    sSel = 0; sHits = [];
    if (q && sIndex) {
      var toks = q.split(/\s+/);
      sIndex.forEach(function (it) {
        var ti = sNorm(it.a + ' ' + it.b), tx = sNorm(it.x), sc = 0, ok = true;
        toks.forEach(function (w) {
          if (ti.indexOf(w) !== -1) sc += 3 + (ti.indexOf(w) === 0 ? 1 : 0); else if (tx.indexOf(w) !== -1) sc += 1; else ok = false;
        });
        if (ok) { var o = { t: it.t, a: it.a, b: it.b, u: it.u, s: sc }; sHits.push(o); }
      });
      sHits.sort(function (x, y) { return y.s - x.s; }); sHits = sHits.slice(0, 8);
    }
    sPaint();
  };
  var sClose = function () { if (sBox) { sBox.hidden = true; document.documentElement.classList.remove('search-open'); } };
  var sOpen = function () {
    if (!sBox) sBuild();
    sBox.hidden = false; document.documentElement.classList.add('search-open');
    sInput.placeholder = tr('search_site_placeholder'); sInput.value = ''; sHits = []; sPaint(); sInput.focus();
    if (!sIndex && window.fetch && window.LAB_SEARCH) {
      fetch(window.LAB_SEARCH).then(function (r) { return r.json(); }).then(function (j) { sIndex = j; sRun(); }).catch(function () {});
    }
  };
  qsa('[data-search-open]').forEach(function (b) { b.addEventListener('click', function () { sOpen(); }); });
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sOpen(); }
    else if (e.key === '/' && !typing && !(sBox && !sBox.hidden)) { e.preventDefault(); sOpen(); }
    else if (e.key === 'Escape' && sBox && !sBox.hidden) { sClose(); }
  });
  // a search link from the site search can open Publications with the text already in the filter box
  (function () {
    var box = document.getElementById('pubSearch');
    var m = /[?&]q=([^&]*)/.exec(window.location.search);
    if (box && m) { try { box.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); box.dispatchEvent(new Event('input')); } catch (e) {} }
  })();
