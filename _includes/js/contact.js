  // File: _includes/js/contact.js - Contact form (Web3Forms).
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  // ---- Contact form (Web3Forms, no backend of our own) ----
  var cForm = document.getElementById('contactForm');
  var cStatus = document.getElementById('cfStatus');
  var cStatusKey = null;
  var showStatus = function (key, cls) {
    if (!cStatus) return;
    cStatusKey = key;
    cStatus.className = 'form-status' + (cls ? ' ' + cls : '');
    cStatus.textContent = '';
    if (!key) return;
    cStatus.appendChild(document.createTextNode(tr(key) + (key === 'form_err' ? ' ' : '')));
    if (key === 'form_err') {
      var a = document.createElement('a'); a.href = 'mailto:' + cForm.dataset.mail; a.textContent = cForm.dataset.mail;
      cStatus.appendChild(a);
    }
  };
  if (cForm) {
    var cSend = document.getElementById('cfSend');
    cForm.dataset.mail = (document.querySelector('.contact-primary-email') || {}).textContent || '';
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cForm.checkValidity()) { cForm.reportValidity(); return; }
      var body = {};
      [].slice.call(cForm.elements).forEach(function (el) {
        if (!el.name || el.type === 'submit') return;
        body[el.name] = el.type === 'checkbox' ? (el.checked ? 'on' : '') : el.value;
      });
      body.subject = 'Website inquiry - ' + body.topic;
      body.language = lang();
      cSend.disabled = true; showStatus('form_sending', '');
      fetch(cForm.action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (!j.success) throw new Error(j.message || 'failed'); cForm.reset(); showStatus('form_ok', 'is-ok'); })
        .catch(function () { showStatus('form_err', 'is-error'); })
        .then(function () { cSend.disabled = false; });
    });
  }

  document.addEventListener('langchange', function () {
    var sendLbl = document.getElementById('cfSendLabel'); if (sendLbl) sendLbl.textContent = tr('form_send');
    if (cStatusKey) showStatus(cStatusKey, cStatus.className.replace('form-status', '').trim());
  });
