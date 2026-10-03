/* ==========================================================================
   Zurosh Enterprises — site behaviour
   header state · two-sector mega menu · mobile nav · pixel page transitions
   · scroll reveals · contact form
   ========================================================================== */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    document.body.classList.toggle('has-scrolled', window.scrollY > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- mega menu (Telecom | Construction) ---------- */
  var desktop = window.matchMedia('(min-width: 961px)');
  [].forEach.call(document.querySelectorAll('.nav-item'), function (item) {
    var trigger = item.querySelector('.nav-trigger'), timer;
    function set(open) {
      item.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    }
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      set(!item.classList.contains('open'));
    });
    item.addEventListener('mouseenter', function () { if (desktop.matches) { clearTimeout(timer); set(true); } });
    item.addEventListener('mouseleave', function () { if (desktop.matches) { timer = setTimeout(function () { set(false); }, 160); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && item.classList.contains('open')) { set(false); trigger.focus(); } });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
  });

  /* ---------- page transition: a navy panel wipes over, then away ---------- */
  var wipe = document.createElement('div');
  wipe.className = 'page-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML = '<svg class="wipe-mark" viewBox="0 0 94 100"><path fill="#fff" d="M0 0 L94 0 L16.451 100 L0 100 L67.468 13 L0 13 Z"/>' +
    '<path fill="#C29B57" d="M77.549 31.005 L94 31.005 L40.495 100 L24.044 100 Z"/><path fill="#fff" d="M58.169 87 L94 87 L94 100 L48.087 100 Z"/></svg>';
  document.body.appendChild(wipe);

  function afterTransition(fn, ms) {
    var done = false;
    function go() { if (!done) { done = true; fn(); } }
    wipe.addEventListener('transitionend', function h(e) {
      if (e.target === wipe && e.propertyName === 'transform') { wipe.removeEventListener('transitionend', h); go(); }
    });
    setTimeout(go, ms); // safety net if transitionend never fires
  }
  function reset() { wipe.className = 'page-wipe'; }

  // leaving: panel rises from the bottom and covers the page, then navigate
  function leave(href) {
    try { sessionStorage.setItem('zurosh-veil', '1'); } catch (err) {}
    wipe.className = 'page-wipe anim';
    void wipe.offsetWidth; // commit the start position before animating
    wipe.classList.add('cover');
    afterTransition(function () { location.href = href; }, 700);
  }

  // arriving: start covered, then the panel continues upward and off screen
  if (doc.classList.contains('veil-in')) {
    wipe.className = 'page-wipe cover';
    doc.classList.remove('veil-in');
    try { sessionStorage.removeItem('zurosh-veil'); } catch (e) {}
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wipe.className = 'page-wipe anim leave';
        afterTransition(reset, 900);
      });
    });
  }
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { reset(); doc.classList.remove('veil-in'); }
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || reduced || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // same-page anchors scroll normally
    e.preventDefault();
    leave(url.href);
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    [].forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    [].forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  /* ---------- footer year ---------- */
  [].forEach.call(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- contact form → opens the visitor's email app ---------- */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    var pre = params.get('sector');
    if (pre) {
      var radio = form.querySelector('input[name="sector"][value="' + pre + '"]');
      if (radio) radio.checked = true;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var sector = d.get('sector') || 'General';
      var subject = 'Enquiry (' + sector + ') — ' + d.get('service');
      var body = [
        'Name: ' + d.get('name'),
        'Company: ' + (d.get('company') || '-'),
        'Email: ' + d.get('email'),
        'Phone: ' + (d.get('phone') || '-'),
        'Sector: ' + sector,
        'Service: ' + d.get('service'),
        'Location: ' + (d.get('location') || '-'),
        '',
        d.get('message')
      ].join('\n');
      location.href = 'mailto:' + form.getAttribute('data-to') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });

    // keep service options in step with the chosen sector
    var services = {
      Telecom: ['FTTH network deployment', '5G tower infrastructure (turnkey)', 'Site acquisition', 'Telecom consultancy', 'Other telecom'],
      Construction: ['Residential units', 'Commercial plaza', 'Design & build', 'Project management', 'Other construction']
    };
    var select = form.querySelector('select[name="service"]');
    function fill() {
      var s = (form.querySelector('input[name="sector"]:checked') || {}).value || 'Telecom';
      select.innerHTML = services[s].map(function (o) { return '<option>' + o + '</option>'; }).join('');
    }
    [].forEach.call(form.querySelectorAll('input[name="sector"]'), function (r) { r.addEventListener('change', fill); });
    fill();
  }
})();
