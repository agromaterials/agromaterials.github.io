  // File: _includes/js/views.js - Read counts under article titles and on blog cards (Firebase Realtime Database, REST).
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- View counts (Firebase Realtime Database, REST, no SDK): under an article title and on blog and news cards; shown only when above zero ----
  var viewEls = qsa('.card-views[data-views-path]');
  var viewHead = document.getElementById('postViews');
  if ((viewEls.length || viewHead) && window.LAB_FB && window.fetch) {
    var fbBase = String(window.LAB_FB).replace(/\/+$/, '');
    var viewKey = function (path) { return path.replace(/^\/+|\/+$/g, '').replace(/[.$#\[\]\/]/g, '~'); };   // Firebase keys cannot hold . $ # [ ] /
    var viewShow = function (el, numSel, n) {
      if (!n) return;
      el.querySelector(numSel).textContent = n.toLocaleString(lang() === 'id' ? 'id-ID' : 'en-US');
      el.hidden = false;
    };
    var viewAll = function () {
      return fetch(fbBase + '/views.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    };
    // Count one read per article per browser session; skip bots and the owner's own browser (same switch as GoatCounter, #toggle-goatcounter)
    var viewCountable = function () {
      try { if (localStorage.getItem('skipgc')) return false; } catch (e) {}
      if (navigator.webdriver || /bot|crawl|spider|headless|preview/i.test(navigator.userAgent)) return false;
      return true;
    };
    var viewHit = function (key) {
      var mark = 'view-' + key;
      try { if (sessionStorage.getItem(mark)) return Promise.resolve(null); sessionStorage.setItem(mark, '1'); } catch (e) {}
      return fetch(fbBase + '/views/' + key + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ '.sv': { increment: 1 } }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (n) { return typeof n === 'number' ? n : null; })
        .catch(function () { return null; });
    };
    setTimeout(function () {
      viewAll().then(function (all) {
        all = all || {};
        if (viewHead) {
          var key = viewKey(window.location.pathname);
          var done = function (n) { viewShow(viewHead, '.post-views-num', n); };
          if (key && viewCountable()) {
            viewHit(key).then(function (n) { done(n === null ? (all[key] || 0) : n); });
          } else { done(all[key] || 0); }
        }
        viewEls.forEach(function (el) { viewShow(el, '.card-views-num', all[viewKey(el.getAttribute('data-views-path'))] || 0); });
      });
    }, 1500);
  }
