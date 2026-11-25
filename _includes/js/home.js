  // File: _includes/js/home.js - Home page: the "From plant to product" map, and the typed hero word.
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- From plant to product (Home): selectable steps, auto-advance until the visitor interacts ----
  var flow = document.getElementById('flowMap');
  if (flow) {
    var fNodes = qsa('.flow-node', flow), fPanels = qsa('.flow-panel', flow), fFill = document.getElementById('flowFill');
    var fCur = 0, fAuto = null, fTouched = false;
    var fSet = function (i) {
      fCur = (i + fNodes.length) % fNodes.length;
      fNodes.forEach(function (n, k) {
        n.classList.toggle('is-active', k === fCur); n.classList.toggle('is-done', k < fCur);
        n.setAttribute('aria-selected', k === fCur ? 'true' : 'false'); n.setAttribute('tabindex', k === fCur ? '0' : '-1');
      });
      fPanels.forEach(function (p, k) { p.classList.toggle('is-active', k === fCur); });
      flow.style.setProperty('--p', fCur / (fNodes.length - 1));
    };
    var fStop = function () { fTouched = true; if (fAuto) { clearInterval(fAuto); fAuto = null; } };
    fNodes.forEach(function (n, k) {
      n.addEventListener('click', function () { fStop(); fSet(k); });
      n.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); fStop(); fSet(fCur + d); fNodes[fCur].focus(); }
      });
    });
    flow.addEventListener('pointerenter', function () { if (fAuto) { clearInterval(fAuto); fAuto = null; } });
    fSet(0);
    var calmF = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calmF && 'IntersectionObserver' in window) {
      var fStart = function () { if (!fTouched && !fAuto) fAuto = setInterval(function () { fSet(fCur + 1); }, 4500); };
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) fStart(); else if (fAuto) { clearInterval(fAuto); fAuto = null; }
      }, { threshold: .5 }).observe(flow);
      flow.addEventListener('pointerleave', function () { if (!fTouched) fStart(); });
    }
  }

  // ---- Hero title: one highlighted word is typed, deleted and replaced by the next (loops while the hero is visible) ----
  var typerLive = null;
  var typerStart = function () {
    if (typerLive) { typerLive.stop(); typerLive = null; }
    var h1 = document.querySelector('.hero-title');
    var el = h1 && qsa('.typer', h1).filter(function (e) { return e.offsetParent !== null; })[0];
    if (!el) return;
    var words = (el.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (words.length < 2) return;
    // reserve the tallest wrapped height so nothing below the title jumps while the word changes
    var lockHeight = function () {
      var keep = el.textContent, max = 0;
      h1.style.minHeight = '';
      words.forEach(function (w) { el.textContent = w; max = Math.max(max, h1.offsetHeight); });
      el.textContent = keep; h1.style.minHeight = max + 'px';
    };
    var calmT = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.textContent = words[0];
    lockHeight();
    if (calmT) return;
    var timer = null, running = false, wi = 0, ci = words[0].length, phase = 'hold', seen = true;
    el.classList.add('is-typing');
    var tick = function () {
      if (!running) return;
      var w = words[wi], d = 90;
      if (phase === 'hold') { phase = 'del'; d = 1900; }
      else if (phase === 'del') {
        ci--; el.textContent = w.slice(0, ci); d = 42;
        if (ci <= 0) { wi = (wi + 1) % words.length; phase = 'type'; d = 280; }
      } else {
        ci++; el.textContent = words[wi].slice(0, ci); d = 85;
        if (ci >= words[wi].length) { phase = 'hold'; d = 0; }
      }
      timer = setTimeout(tick, d);
    };
    var go = function () { if (!running && seen && !document.hidden) { running = true; timer = setTimeout(tick, 1500); } };
    var halt = function () { running = false; if (timer) { clearTimeout(timer); timer = null; } };
    var vis = function () { if (document.hidden) halt(); else go(); };
    document.addEventListener('visibilitychange', vis);
    var onResize = function () { var keep = el.textContent; lockHeight(); el.textContent = keep; };
    window.addEventListener('resize', onResize);
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (en) { seen = en[0].isIntersecting; if (seen) go(); else halt(); }, { threshold: .1 });
      io.observe(h1);
    }
    go();
    typerLive = { stop: function () {
      halt(); document.removeEventListener('visibilitychange', vis); window.removeEventListener('resize', onResize);
      if (io) io.disconnect(); el.classList.remove('is-typing'); el.textContent = words[0]; h1.style.minHeight = '';
    } };
  };
  typerStart();
  new MutationObserver(function () { setTimeout(typerStart, 0); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // ---- Logo marquee: on touch screens it pauses only while a finger is pressing (hover would stay stuck after a tap) ----
  var marqueeEl = document.querySelector('.marquee');
  if (marqueeEl) {
    var hold = function (on) { marqueeEl.classList.toggle('is-held', on); };
    marqueeEl.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') hold(true); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { marqueeEl.addEventListener(t, function () { hold(false); }); });
    window.addEventListener('blur', function () { hold(false); });
  }
