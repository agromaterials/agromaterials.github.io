  // File: _includes/js/grants.js - Grants filter, Grants total with the live USD/IDR rate, and the count-up of the hero and stat numbers (Home, About, Grants).
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- Grants: filter by status ----
  var grantFilters = document.getElementById('grantFilters');
  if (grantFilters) {
    var grantCards = qsa('.grant-card');
    var grantCount = document.getElementById('grantCount');
    var grantEmpty = document.getElementById('grantEmpty');
    var grantStatus = 'all';
    var applyGrants = function () {
      var shown = 0;
      grantCards.forEach(function (c) {
        var ok = grantStatus === 'all' || c.dataset.status === grantStatus;
        c.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      qsa('.grant-filter-btn', grantFilters).forEach(function (b) { b.classList.toggle('active', b.dataset.status === grantStatus); });
      if (grantCount) grantCount.textContent = shown + ' ' + tr('js_grants');
      if (grantEmpty) grantEmpty.hidden = shown > 0;
    };
    grantFilters.addEventListener('click', function (e) {
      var btn = e.target.closest('.grant-filter-btn');
      if (!btn) return;
      grantStatus = btn.dataset.status;
      applyGrants();
    });
    document.addEventListener('langchange', applyGrants);
    applyGrants();
  }

  // ---- Grants total: count-up and live USD/IDR rate (falls back to the reference rate in _config.yml) ----
  var gt = document.getElementById('grantTotal'), hs = document.getElementById('hsUsd'), host = gt || hs;   // Grants page card, or the Home hero figure
  if (host) {
    var total = parseFloat(host.getAttribute('data-total')) || 0;
    var elIdr = document.getElementById('gtIdr'), elUsd = document.getElementById('gtUsd'), elRate = document.getElementById('gtRate');
    var rate = parseFloat(host.getAttribute('data-rate')) || 0, rateDate = host.getAttribute('data-rate-date') || '', live = false, rateTime = false, rateSrc = '';
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fmtNum = function (n) { return Math.round(n).toLocaleString(lang() === 'id' ? 'id-ID' : 'en-US'); };
    var fmtRp = function (n) { return Math.round(n).toLocaleString('id-ID'); };   // Rupiah always with dots, as on the rest of the site
    var shown = { idr: total, usd: rate ? total / rate : 0 };
    // short form for the Home figure: 842 / 42K / 1.2M (same number as the Grants card, only rounded for display)
    var fmtShort = function (n) {
      if (n >= 999500) { var m = (Math.round(n / 1e5) / 10).toString(); return (lang() === 'id' ? m.replace('.', ',') : m) + 'M'; }
      if (n >= 1000) return Math.round(n / 1000) + 'K';
      return Math.round(n).toString();
    };
    var paint = function () {
      if (gt) {
        elIdr.textContent = 'Rp ' + fmtRp(shown.idr);
        elUsd.textContent = rate ? 'US$ ' + fmtNum(shown.usd) : '';
      }
      if (hs && rate) hs.textContent = fmtShort(shown.usd);
    };
    var rateKnown = false;   // the note under the total stays empty until the rate request has finished (no flash of "reference rate" before "Google Finance")
    var note = function () {
      if (!elRate || !rateKnown) return;
      if (!rate) { elRate.textContent = ''; return; }
      var d = rateDate;
      try {
        if (rateTime) d = new Date(d).toLocaleString(lang() === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        else if (/^\d{4}-\d{2}-\d{2}/.test(d)) d = new Date(d.slice(0, 10) + 'T00:00:00Z').toLocaleDateString(lang() === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
      } catch (e) {}
      elRate.textContent = tr(rateSrc === 'gf' ? 'js_rate_gf' : (live ? 'js_rate_live' : 'js_rate_ref')).replace('{rate}', fmtRp(rate)).replace('{date}', d);
    };
    var animate = function (from, to, ms, done) {
      if (calm || !window.requestAnimationFrame) { done(to); return; }
      var t0 = null;
      var step = function (t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
        done(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var fetchJson = function (url) {
      return new Promise(function (ok, no) {
        var c = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (c) c.abort(); no(new Error('timeout')); }, 4500);
        fetch(url, c ? { signal: c.signal } : {}).then(function (r) { return r.json(); }).then(function (j) { clearTimeout(timer); ok(j); }, function (e) { clearTimeout(timer); no(e); });
      });
    };
    var parseNum = function (t) {
      t = String(t || '').replace(/["\s]/g, '').replace(/^Rp/i, '');
      var lc = t.lastIndexOf(','), ld = t.lastIndexOf('.');
      if (lc > -1 && ld > -1) t = lc > ld ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
      else if (lc > -1) t = /,\d{1,2}$/.test(t) ? t.replace(',', '.') : t.replace(/,/g, '');
      else if (ld > -1 && /\.\d{3}(\.|$)/.test(t) && t.split('.').length > 2) t = t.replace(/\./g, '');
      return parseFloat(t);
    };
    var sheetUrl = host.getAttribute('data-sheet') || '';
    var getSheetRate = function () {
      var c = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (c) c.abort(); }, 4500);
      return fetch(sheetUrl + (sheetUrl.indexOf('?') > -1 ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store', signal: c ? c.signal : undefined })
        .then(function (r) { clearTimeout(timer); return r.text(); })
        .then(function (txt) {
          var row = txt.split(/\r?\n/)[0].match(/("([^"]*)"|[^,]+)/g) || [];
          var v = parseNum(row[0]);
          if (!(v > 1000 && v < 100000)) throw new Error('bad');
          var when = String(row[1] || '').replace(/"/g, '').trim();
          var d = new Date(when);
          return { rate: v, date: isNaN(d) ? new Date().toISOString() : d.toISOString(), time: true, src: 'gf' };
        });
    };
    var getRate = function () {
      if (!window.fetch || !window.Promise) return Promise.reject(new Error('unsupported'));
      if (sheetUrl) return getSheetRate().catch(function () { return getPublicRate(); });
      return getPublicRate();
    };
    var getPublicRate = function () {
      return fetchJson('https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR').then(function (j) {
        if (!j || !j.rates || !j.rates.IDR) throw new Error('bad');
        return { rate: j.rates.IDR, date: j.date };
      }).catch(function () {
        return fetchJson('https://open.er-api.com/v6/latest/USD').then(function (j) {
          if (!j || !j.rates || !j.rates.IDR) throw new Error('bad');
          return { rate: j.rates.IDR, date: (j.time_last_update_utc ? new Date(j.time_last_update_utc).toISOString() : '') };
        });
      });
    };
    if (gt) { shown.idr = 0; shown.usd = 0; paint(); }
    var ratePromise = getRate().then(function (r) {
      if (r.rate > 1000 && r.rate < 100000) { rate = r.rate; rateDate = r.date || rateDate; rateTime = !!r.time; rateSrc = r.src || ''; live = true; }
    }, function () {}).then(function () { rateKnown = true; note(); });
    // Home: the three hero numbers wait for the live rate (1.5 s at most) so they count up together
    var statGate = !gt ? Promise.race([ratePromise, new Promise(function (ok) { setTimeout(ok, 1500); })]) : Promise.resolve();
    window.LAB_STAT_GATE = statGate;
    var run = function () {
      if (!gt) {
        // Home hero: starts together with the other two stats (they all wait for the live rate, 1.5 s at most); a rate that arrives later is picked up on the fly
        var finished = false;
        var usdNow = function () { return rate ? total / rate : 0; };
        statGate.then(function () {
          animate(0, 1, 1200, function (k) { finished = k >= 1; shown.usd = k * usdNow(); paint(); });
        });
        ratePromise.then(function () { if (finished) { shown.usd = usdNow(); paint(); } });
        return;
      }
      ratePromise.then(function () {
        var usdTo = rate ? total / rate : 0;
        animate(0, total, 1600, function (v) { shown.idr = v; shown.usd = rate ? v / total * usdTo : 0; paint(); });
      });
    };
    // Home hero: show 0 from the start (no flash of the final number before the count begins)
    if (hs && !gt && !calm && 'IntersectionObserver' in window && rate) { shown.usd = 0; paint(); }
    if ('IntersectionObserver' in window && !calm) {
      var o2 = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { o2.disconnect(); run(); } }, { threshold: gt ? .4 : .6 });
      o2.observe(host);
    } else { run(); }
    document.addEventListener('langchange', function () { paint(); note(); });
    new MutationObserver(function () { paint(); note(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  // ---- Count-up for the small statistic numbers (Home hero, About, Grants); the HTML holds the final number, it is set to 0 at once and counted up when visible ----
  var statEls = qsa('.hero-stats b, .grant-stat-num').filter(function (el) { return el.id !== 'hsUsd' && /^\d+$/.test(el.textContent.trim()); });   // the USD figure has its own count-up above
  var calmStats = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (statEls.length && 'IntersectionObserver' in window && window.requestAnimationFrame && !calmStats) {
    var statTo = new WeakMap();
    var countUp = function (el) {
      var to = statTo.get(el), t0 = null;
      var step = function (t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 1200);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      (window.LAB_STAT_GATE || Promise.resolve()).then(function () { requestAnimationFrame(step); });   // on Home, wait with the USD figure so all three start together
    };
    statEls.forEach(function (el) {
      statTo.set(el, parseInt(el.textContent, 10));
      el.style.minWidth = el.offsetWidth + 'px';   // keep the layout steady while the number grows
      el.textContent = '0';
    });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { so.unobserve(en.target); countUp(en.target); } });
    }, { threshold: .6 });
    statEls.forEach(function (el) { so.observe(el); });
  }
  document.documentElement.classList.add('stats-ready');   // reveals the numbers (they are hidden by CSS until now, so the final value never flashes)
