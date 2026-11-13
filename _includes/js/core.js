  // File: _includes/js/core.js - Shared helpers (qsa, lang, tr), navigation, dropdowns, email links, language switch, back to top. Always first.
  // These parts are joined into assets/js/main.js by Jekyll (one closure, shared helpers from core.js). Do not load them separately.

  var qsa = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  // ---- Language helpers (strings come from _data/i18n.yml via window.LAB_I18N) ----
  var I18N = window.LAB_I18N || {};
  var lang = function () { return document.documentElement.lang === 'id' ? 'id' : 'en'; };
  var tr = function (key) { var v = I18N[key]; return v ? (v[lang()] || v.en) : key; };

  // ---- Mobile navigation ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var siteNav = document.querySelector('.site-nav');
    toggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('open');
      if (siteNav) { siteNav.classList.toggle('is-open', !expanded); siteNav.classList.remove('is-hidden'); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-nav') && links.classList.contains('open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
        if (siteNav) siteNav.classList.remove('is-open');
      }
    });
  }

  // ---- Navbar: glass after scrolling, hides on the way down (phones), sliding hover pill, shortcut hint ----
  var navEl = document.querySelector('.site-nav');
  if (navEl) {
    var lastY = window.pageYOffset, navTick = false, mqMobile = window.matchMedia ? window.matchMedia('(max-width: 1060px)') : { matches: false };
    var navDraw = function () {
      var y = window.pageYOffset;
      navEl.classList.toggle('is-scrolled', y > 8);
      if (mqMobile.matches && !navEl.classList.contains('is-open')) {
        if (y > lastY + 6 && y > 140) navEl.classList.add('is-hidden');
        else if (y < lastY - 6 || y <= 140) navEl.classList.remove('is-hidden');
      } else { navEl.classList.remove('is-hidden'); }
      lastY = y; navTick = false;
    };
    window.addEventListener('scroll', function () { if (!navTick) { navTick = true; requestAnimationFrame(navDraw); } }, { passive: true });
    navDraw();
    var kbd = navEl.querySelector('.search-pill-kbd');
    if (kbd && /Mac|iPhone|iPad/.test(navigator.platform || '')) kbd.textContent = '\u2318K';
    var navUl = navEl.querySelector('.nav-links');
    if (navUl) {
      var ind = document.createElement('li');
      ind.className = 'nav-indicator no-anim'; ind.setAttribute('aria-hidden', 'true');
      navUl.insertBefore(ind, navUl.firstChild);
      var navLinks = qsa('.nav-links > li > a:not(.nav-cta-link)', navEl);
      var place = function (a) {
        if (!a || mqMobile.matches) { ind.style.opacity = '0'; return; }
        var r = a.getBoundingClientRect(), p = navUl.getBoundingClientRect();
        ind.style.width = r.width + 'px'; ind.style.transform = 'translateX(' + (r.left - p.left) + 'px)'; ind.style.opacity = '1';
      };
      var rest = function () { place(navUl.querySelector('li > a.active:not(.nav-cta-link)')); };
      navLinks.forEach(function (a) {
        a.addEventListener('mouseenter', function () { place(a); });
        a.addEventListener('focus', function () { place(a); });
      });
      navUl.addEventListener('mouseleave', rest);
      navUl.addEventListener('focusout', function () { setTimeout(function () { if (!navUl.contains(document.activeElement)) rest(); }, 0); });
      window.addEventListener('resize', rest);
      rest();
      setTimeout(function () { ind.classList.remove('no-anim'); }, 60);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ind.classList.add('no-anim'); rest(); setTimeout(function () { ind.classList.remove('no-anim'); }, 60); });
    }
  }

  // ---- Dropdown menus ----
  var closeDropdowns = function (except) {
    qsa('.nav-dropdown__toggle').forEach(function (btn) {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      if (btn.nextElementSibling) btn.nextElementSibling.classList.remove('open');
    });
  };
  qsa('.nav-dropdown__toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var expanded = this.getAttribute('aria-expanded') === 'true';
      closeDropdowns(btn);
      this.setAttribute('aria-expanded', String(!expanded));
      if (this.nextElementSibling) this.nextElementSibling.classList.toggle('open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) closeDropdowns(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDropdowns(null); });

  // ---- Email links: also copy the address and show it, because mailto does nothing without a mail app ----
  var toastEl = null, toastTimer = null;
  var showToast = function (text) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); document.body.appendChild(toastEl); }
    toastEl.textContent = text; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  };
  var copyText = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); } document.body.removeChild(ta);
    });
  };
  qsa('a[href^="mailto:"]').forEach(function (a) {
    var addr = a.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
    a.addEventListener('click', function () {
      copyText(addr).then(function () { showToast(addr + ' ' + tr('copied')); }, function () { showToast(addr); });
    });
  });

  // ---- Language switch (EN | ID); the choice is remembered in this browser ----
  var syncLang = function () {
    qsa('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.setLang === lang())); });
    qsa('[data-ph]').forEach(function (el) { el.placeholder = tr(el.dataset.ph); });
    qsa('[data-opt]').forEach(function (el) { el.textContent = tr(el.dataset.opt); });
    document.dispatchEvent(new Event('langchange'));
  };
  qsa('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = this.dataset.setLang === 'id' ? 'id' : 'en';
      document.documentElement.lang = next;
      try { localStorage.setItem('lang', next); } catch (e) {}
      syncLang();
    });
  });
  // (the first syncLang() call is in boot.js, after every feature has registered its 'langchange' listener)

  // ---- Back to top button (appears after scrolling down) ----
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var onScroll = function () { toTop.hidden = window.scrollY < 700; };
    window.addEventListener('scroll', onScroll, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    onScroll();
  }
  document.addEventListener('langchange', function () { var b = document.getElementById('toTop'); if (b) b.setAttribute('aria-label', tr('back_to_top')); });
