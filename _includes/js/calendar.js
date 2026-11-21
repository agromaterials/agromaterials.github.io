  // File: _includes/js/calendar.js - Calendar page (hidden for now): past items and days remaining.
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- Calendar: mark past items and show days remaining ----
  var deadlineItems = qsa('.deadline-item');
  var renderDeadlines = function () {
    deadlineItems.forEach(function (item) {
      var parts = (item.dataset.date || '').split('-');
      if (parts.length !== 3) return;
      var due = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var days = Math.round((due - today) / 86400000);
      var label = item.querySelector('.deadline-count');
      if (days < 0) { item.classList.add('is-past'); if (label) label.textContent = tr('js_passed'); }
      else if (label) {
        label.textContent = days === 0 ? tr('js_today')
          : (lang() === 'id' ? days + ' ' + tr('js_days_left') : days + ' ' + tr(days === 1 ? 'js_day_left' : 'js_days_left'));
      }
    });
  };
  document.addEventListener('langchange', renderDeadlines);
