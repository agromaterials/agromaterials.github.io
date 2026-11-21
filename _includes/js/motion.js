  // File: _includes/js/motion.js - Pointer effects and scroll progress (all off for reduce motion).
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- Motion polish (desktop pointer effects, scroll progress); every effect is off for "reduce motion" ----
  var calmM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePtr = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!calmM) {
    // thin progress bar at the top while scrolling
    var bar = document.createElement('div');
    bar.className = 'scroll-bar'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var barTick = false;
    var barDraw = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.pageYOffset / h) : 0) + ')';
      barTick = false;
    };
    window.addEventListener('scroll', function () { if (!barTick) { barTick = true; requestAnimationFrame(barDraw); } }, { passive: true });
    barDraw();
  }
  if (!calmM && finePtr) {
    // hero: the isometric scene and the hexagon pattern shift a little in opposite directions with the pointer
    var heroWrap = document.querySelector('.hero-wrap');
    var heroVis = document.querySelector('.hero--iso .hero-visual');
    if (heroWrap && heroVis) {
      var hTick = false, hx = 0, hy = 0;
      var hDraw = function () {
        heroWrap.style.setProperty('--hx', (hx * -14).toFixed(1) + 'px');
        heroWrap.style.setProperty('--hy', (hy * -10).toFixed(1) + 'px');
        heroVis.style.setProperty('--vx', (hx * 10).toFixed(1) + 'px');
        heroVis.style.setProperty('--vy', (hy * 7).toFixed(1) + 'px');
        heroVis.style.setProperty('--ry', (hx * 2.2).toFixed(2) + 'deg');
        heroVis.style.setProperty('--rx', (hy * -1.6).toFixed(2) + 'deg');
        hTick = false;
      };
      heroWrap.addEventListener('pointermove', function (e) {
        var r = heroWrap.getBoundingClientRect();
        hx = ((e.clientX - r.left) / r.width - .5) * 2; hy = ((e.clientY - r.top) / r.height - .5) * 2;
        if (!hTick) { hTick = true; requestAnimationFrame(hDraw); }
      });
      heroWrap.addEventListener('pointerleave', function () { hx = 0; hy = 0; requestAnimationFrame(hDraw); });
    }
    // cards: gentle 3D tilt and a soft yellow glow that follows the pointer
    qsa('.blog-card, .feat-card, .grant-card, .team-member').forEach(function (card) {
      card.classList.add('tilt');
      var tTick = false, ev = null;
      var tDraw = function () {
        if (!ev) { tTick = false; return; }
        var r = card.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((x - .5) * 3).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - y) * 2.4).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(0) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(0) + '%');
        tTick = false;
      };
      card.addEventListener('pointermove', function (e) { ev = e; if (!tTick) { tTick = true; requestAnimationFrame(tDraw); } });
      card.addEventListener('pointerleave', function () { ev = null; card.style.removeProperty('--ry'); card.style.removeProperty('--rx'); });
    });
    // primary buttons lean slightly toward the pointer
    qsa('.btn-primary, .btn-outline').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--bx', ((e.clientX - r.left) / r.width - .5) * 6 + 'px');
        b.style.setProperty('--by', ((e.clientY - r.top) / r.height - .5) * 4 + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.removeProperty('--bx'); b.style.removeProperty('--by'); });
    });
  }
