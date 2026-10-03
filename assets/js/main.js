/* ==========================================================================
   Zurosh Enterprises — site behaviour
   header state · two-sector mega menu · mobile nav · Z-slash page transitions
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

  /* ---------- page transition: the Z's diagonal sweeps between pages ----------
     A gold streak cuts across at the logo's stroke angle, a navy band follows
     and covers the screen while the Z mark + destination name appear (echoing
     the stacked logo), then the band exits along the same diagonal.        */
  var SLANT = Math.tan(37.8 * Math.PI / 180);  // angle of the Z's diagonal strokes
  var NAMES = { 'index': 'Home', '': 'Home', 'telecom': 'Telecom', 'construction': 'Construction', 'about': 'About', 'contact': 'Contact' };
  var wipe = document.createElement('div');
  wipe.className = 'z-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML =
    '<div class="zw-band zw-navy"></div><div class="zw-band zw-gold"></div>' +
    '<div class="zw-center"><svg viewBox="0 0 94 100"><path fill="#fff" d="M0 0 L94 0 L16.451 100 L0 100 L67.468 13 L0 13 Z"/>' +
    '<path fill="#C29B57" d="M77.549 31.005 L94 31.005 L40.495 100 L24.044 100 Z"/><path fill="#fff" d="M58.169 87 L94 87 L94 100 L48.087 100 Z"/></svg>' +
    '<span class="zw-rule"></span><span class="zw-label"></span></div>';
  document.body.appendChild(wipe);
  var navy = wipe.querySelector('.zw-navy'), gold = wipe.querySelector('.zw-gold');
  var center = wipe.querySelector('.zw-center'), label = wipe.querySelector('.zw-label');
  var running = [];

  function geom() {
    var W = window.innerWidth, H = window.innerHeight, lean = H * SLANT;
    var B = W + lean + 40, g = Math.max(46, W * 0.045);
    navy.style.width = B + 'px'; navy.style.left = (W - B) / 2 + 'px';
    gold.style.width = g + 'px'; gold.style.left = (W - g) / 2 + 'px';
    return { off: B + lean, goff: W / 2 + g + lean };
  }
  function tx(x) { return 'translateX(' + x + 'px) skewX(-37.8deg)'; }
  function anim(el, frames, opts) {
    opts.fill = 'forwards';
    var a = el.animate(frames, opts);
    running.push(a);
    return a;
  }
  function reset() {
    running.forEach(function (a) { a.cancel(); });
    running = [];
    wipe.classList.remove('active');
  }
  function pageName(url) {
    var file = url.pathname.split('/').pop().replace(/\.html$/, '');
    return NAMES[file] || 'Zurosh';
  }

  var EASE = 'cubic-bezier(.76, 0, .24, 1)';

  // leaving: gold streak, navy band covers, mark + name settle, then navigate
  function leave(url) {
    var g = geom(), name = pageName(url);
    reset();
    label.textContent = name;
    wipe.classList.add('active');
    try { sessionStorage.setItem('zurosh-veil', name); } catch (err) {}
    anim(gold, [{ transform: tx(-g.goff) }, { transform: tx(g.goff) }], { duration: 760, easing: 'cubic-bezier(.65, 0, .35, 1)' });
    anim(navy, [{ transform: tx(-g.off) }, { transform: tx(0) }], { duration: 640, delay: 90, easing: EASE });
    anim(center, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: 470, easing: 'ease-out' });
    setTimeout(function () { location.href = url.href; }, 820);
  }

  // arriving: start covered, name fades, band exits along the diagonal, page rises in
  if (doc.classList.contains('veil-in')) {
    var g0 = geom(), name0 = 'Zurosh';
    try { name0 = sessionStorage.getItem('zurosh-veil') || name0; sessionStorage.removeItem('zurosh-veil'); } catch (e) {}
    label.textContent = name0;
    wipe.classList.add('active');
    navy.style.transform = tx(0);
    gold.style.transform = tx(-g0.goff);
    center.style.opacity = 1;
    doc.classList.remove('veil-in');
    anim(center, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 260, delay: 160, easing: 'ease-in' });
    anim(navy, [{ transform: tx(0) }, { transform: tx(g0.off) }], { duration: 720, delay: 300, easing: EASE });
    var last = anim(gold, [{ transform: tx(-g0.goff) }, { transform: tx(g0.goff) }], { duration: 800, delay: 380, easing: 'cubic-bezier(.65, 0, .35, 1)' });
    var main = document.querySelector('main');
    if (main) main.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 480, easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'backwards' });
    last.onfinish = function () {
      reset();
      navy.style.transform = gold.style.transform = center.style.opacity = '';
    };
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
    leave(url);
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
