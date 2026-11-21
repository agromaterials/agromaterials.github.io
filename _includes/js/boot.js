  // File: _includes/js/boot.js - Runs last: first language pass and scroll fade-in.
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  syncLang();   // first language pass: every feature has registered its 'langchange' listener by now

  // ---- Scroll fade-in ----
  var fadeEls = qsa('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (n) { el.style.transitionDelay = Math.min(n, 5) * 90 + 'ms'; setTimeout(function () { el.style.transitionDelay = ''; }, 1100); }   // cards that appear together enter one after another
          n++;
          el.classList.add('visible'); obs.unobserve(el);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    fadeEls.forEach(function (el) { obs.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }
