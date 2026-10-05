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

  /* ---------- page transition: the Z splits along its own diagonal ----------
     Leaving: two navy halves, cut along the Z's diagonal, slide together and the Z floats in.
     Arriving: the gold stripe flies up-right, the rest of the Z down-left,
     the halves part sideways along the cut, and the new page rises in.             */
  var DIR = { x: 0.613, y: -0.790 };  // unit vector along the Z's diagonal (up-right on screen)
  var wipe = document.createElement('div');
  wipe.className = 'z-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML =
    '<div class="zw-half zw-a"></div><div class="zw-half zw-b"></div>' +
    '<div class="zw-mark">' +
    '<svg class="zw-white" viewBox="0 0 94 100"><path fill="#fff" d="M0 0 L94 0 L16.451 100 L0 100 L67.468 13 L0 13 Z"/><path fill="#fff" d="M58.169 87 L94 87 L94 100 L48.087 100 Z"/></svg>' +
    '<svg class="zw-gold" viewBox="0 0 94 100"><path fill="#C29B57" d="M77.549 31.005 L94 31.005 L40.495 100 L24.044 100 Z"/></svg>' +
    '</div>';
  document.body.appendChild(wipe);
  var halfA = wipe.querySelector('.zw-a'), halfB = wipe.querySelector('.zw-b');
  var mark = wipe.querySelector('.zw-mark'), zWhite = wipe.querySelector('.zw-white'), zGold = wipe.querySelector('.zw-gold');
  var running = [];

  // split the screen along a line through its centre at the Z's angle; each half is
  // oversized by P on every side so only the diagonal edge is ever seen while it moves
  function geom() {
    var W = window.innerWidth, H = window.innerHeight, P = W + H;
    var Wt = W + 2 * P, Ht = H + 2 * P, cx = W / 2 + P, cy = H / 2 + P, m = DIR.x / DIR.y;
    var xt = cx + (0 - cy) * m, xb = cx + (Ht - cy) * m;
    [halfA, halfB].forEach(function (h) {
      h.style.left = h.style.top = -P + 'px';
      h.style.width = Wt + 'px'; h.style.height = Ht + 'px';
    });
    halfA.style.clipPath = 'polygon(0 0, ' + (xt + 1) + 'px 0, ' + (xb + 1) + 'px ' + Ht + 'px, 0 ' + Ht + 'px)';
    halfB.style.clipPath = 'polygon(' + (xt - 1) + 'px 0, ' + Wt + 'px 0, ' + Wt + 'px ' + Ht + 'px, ' + (xb - 1) + 'px ' + Ht + 'px)';
    return W + H;
  }
  function side(d) { return 'translateX(' + d + 'px)'; }
  function along(d) { return 'translate(' + (DIR.x * d) + 'px, ' + (DIR.y * d) + 'px)'; }
  function anim(el, frames, opts) {
    opts.fill = 'both';
    var a = el.animate(frames, opts);
    running.push(a);
    return a;
  }
  function reset() {
    running.forEach(function (a) { a.cancel(); });
    running = [];
    wipe.classList.remove('active');
  }
  var EASE_IN = 'cubic-bezier(.7, 0, .3, 1)', EASE_OUT = 'cubic-bezier(.6, 0, .2, 1)';

  // leaving: halves close along the diagonal, Z floats in, navigate
  function leave(url) {
    var D = geom();
    reset();
    wipe.classList.add('active');
    try { sessionStorage.setItem('zurosh-veil', '1'); } catch (err) {}
    anim(halfA, [{ transform: side(-D) }, { transform: 'none' }], { duration: 340, easing: EASE_IN });
    anim(halfB, [{ transform: side(D) }, { transform: 'none' }], { duration: 340, easing: EASE_IN });
    anim(mark, [{ opacity: 0, transform: 'translateY(14px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: 160, easing: 'ease-out' });
    setTimeout(function () { location.href = url.href; }, 430);
  }

  // arriving: Z floats a beat, then splits apart with the navy and the page appears
  if (doc.classList.contains('veil-in')) {
    var D0 = geom();
    try { sessionStorage.removeItem('zurosh-veil'); } catch (e) {}
    wipe.classList.add('active');
    doc.classList.remove('veil-in');
    var T = 140; // short float before the split
    anim(mark, [{ transform: 'none' }, { transform: 'translateY(-6px)' }], { duration: T + 80, easing: 'ease-in-out' });
    anim(zGold, [{ transform: 'none', opacity: 1 }, { transform: along(D0 * 0.6), opacity: 0 }], { duration: 520, delay: T, easing: EASE_OUT });
    anim(zWhite, [{ transform: 'none', opacity: 1 }, { transform: along(-D0 * 0.6), opacity: 0 }], { duration: 520, delay: T, easing: EASE_OUT });
    anim(halfB, [{ transform: 'none' }, { transform: side(D0) }], { duration: 560, delay: T + 40, easing: EASE_OUT });
    var last = anim(halfA, [{ transform: 'none' }, { transform: side(-D0) }], { duration: 560, delay: T + 40, easing: EASE_OUT });
    var main = document.querySelector('main');
    if (main) main.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: T + 120, easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'backwards' });
    last.onfinish = reset;
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

  /* ---------- home page sector zones: the backdrop changes per sector ---------- */
  var zones = [].slice.call(document.querySelectorAll('[data-zone]'));
  if (zones.length) {
    var current = '', ticking = false;
    var setZone = function () {
      ticking = false;
      var mid = window.innerHeight / 2, z = 'neutral';
      for (var i = 0; i < zones.length; i++) {
        var r = zones[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { z = zones[i].getAttribute('data-zone'); break; }
      }
      if (z !== current) { current = z; document.body.setAttribute('data-zone', z); }
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(setZone); } }, { passive: true });
    window.addEventListener('resize', setZone);
    setZone();
  }

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
      Telecom: ['FTTH Network Deployment', '5G Tower Infrastructure (Turnkey)', 'Site Acquisition', 'Telecom Consultancy', 'Business Feasibility Report', 'Other Telecom Services'],
      Construction: ['Residential Units', 'Commercial Buildings', 'Renovation & Extension', 'Other Construction Services']
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
