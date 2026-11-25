  // File: _includes/js/publications.js - Publications page: theme, year and search filters, and the charts that filter the list.
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- Publication filters: theme + year + search, all combinable; long list shows 10 first ----
  var pubFilters = document.getElementById('pubFilters');
  if (pubFilters) {
    var PUB_LIMIT = 10;
    var pubClear = document.getElementById('pubClear');
    var pubEmpty = document.getElementById('pubEmpty');
    var pubSearch = document.getElementById('pubSearch');
    var pubYear = document.getElementById('pubYear');
    var pubLevel = document.getElementById('pubLevel');
    var pubCount = document.getElementById('pubCount');
    var pubMore = document.getElementById('pubMore');
    var pubItems = qsa('.pub-item');
    var pubText = pubItems.map(function (el) { return el.textContent.toLowerCase(); });
    var activeTheme = null, activeYear = null, activeLevel = null, query = '', expanded = false;

    var apply = function () {
      var filtered = activeTheme !== null || activeYear !== null || activeLevel !== null || query !== '';
      var shown = 0, visible = 0;
      pubItems.forEach(function (item, i) {
        var match = (activeTheme === null || item.dataset.theme === activeTheme) &&
                    (activeYear === null || item.dataset.year === activeYear) &&
                    (activeLevel === null || item.dataset.level === activeLevel) &&
                    (query === '' || pubText[i].indexOf(query) !== -1);
        var show = match && (filtered || expanded || shown < PUB_LIMIT);
        item.style.display = show ? '' : 'none';
        if (match) shown++;
        if (show) visible++;
      });
      qsa('.pub-filter-theme', pubFilters).forEach(function (b) { b.classList.toggle('active', b.dataset.theme === activeTheme); });
      if (pubYear) pubYear.value = activeYear === null ? '' : activeYear;
      if (pubLevel) pubLevel.value = activeLevel === null ? '' : activeLevel;
      if (pubClear) pubClear.hidden = !filtered;
      if (pubEmpty) pubEmpty.hidden = shown > 0;
      if (pubMore) {
        pubMore.hidden = filtered || pubItems.length <= PUB_LIMIT;
        pubMore.textContent = expanded ? tr('show_less') : tr('pub_more') + ' (' + (pubItems.length - PUB_LIMIT) + ')';
      }
      if (pubCount) pubCount.textContent = filtered
        ? shown + ' ' + tr('js_of') + ' ' + pubItems.length + ' ' + tr('js_publications')
        : pubItems.length + ' ' + tr('js_publications');
    };

    if (pubSearch) pubSearch.addEventListener('input', function () { query = this.value.trim().toLowerCase(); apply(); });
    if (pubYear) pubYear.addEventListener('change', function () { activeYear = this.value === '' ? null : this.value; apply(); });
    if (pubLevel) pubLevel.addEventListener('change', function () { activeLevel = this.value === '' ? null : this.value; apply(); });
    if (pubMore) pubMore.addEventListener('click', function () { expanded = !expanded; apply(); });
    pubFilters.addEventListener('click', function (e) {
      var btn = e.target.closest('.pub-filter-btn');
      if (!btn) return;
      if (btn === pubClear) {
        activeTheme = null; activeYear = null; activeLevel = null; query = '';
        if (pubSearch) pubSearch.value = '';
      } else if (btn.dataset.theme !== undefined) {
        activeTheme = activeTheme === btn.dataset.theme ? null : btn.dataset.theme;
      }
      apply();
    });
    qsa('.pub-theme').forEach(function (pill) {
      pill.addEventListener('click', function () {
        activeTheme = activeTheme === this.dataset.theme ? null : this.dataset.theme;
        apply();
        pubFilters.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    apply();
    document.addEventListener('langchange', apply);
  }

  // ---- Publications charts: a bar filters the list below ----
  qsa('.pub-charts .bar-v').forEach(function (b) {
    b.addEventListener('click', function () {
      var sel = document.getElementById('pubYear'); if (!sel) return;
      sel.value = sel.value === b.getAttribute('data-year') ? '' : b.getAttribute('data-year');
      sel.dispatchEvent(new Event('change'));
      var f = document.getElementById('pubFilters'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  qsa('.pub-charts .bar-h[data-level]').forEach(function (b) {
    b.addEventListener('click', function () {
      var sel = document.getElementById('pubLevel'); if (!sel) return;
      sel.value = sel.value === b.getAttribute('data-level') ? '' : b.getAttribute('data-level');
      sel.dispatchEvent(new Event('change'));
      var f = document.getElementById('pubFilters'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  qsa('.pub-charts .bar-h[data-theme]').forEach(function (b) {
    b.addEventListener('click', function () {
      var btn = document.querySelector('.pub-filter-theme[data-theme="' + b.getAttribute('data-theme') + '"]');
      if (btn) btn.click();
      var f = document.getElementById('pubFilters'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // language: placeholder and select texts of the publication filters
  document.addEventListener('langchange', function () {
    var s = document.getElementById('pubSearch');
    if (s) { s.placeholder = tr('search_placeholder'); s.setAttribute('aria-label', tr('search_placeholder')); }
    var y = document.getElementById('pubYear');
    if (y) { y.options[0].textContent = tr('year_all'); y.setAttribute('aria-label', tr('year_filter')); }
    var lv = document.getElementById('pubLevel');
    if (lv) { lv.options[0].textContent = tr('level_all'); lv.setAttribute('aria-label', tr('level_filter')); }
  });
