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

  /* ---------- pixel veil: pages dissolve into / out of pixels ---------- */
  var veil = document.createElement('canvas');
  veil.className = 'pixel-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  var ctx = veil.getContext('2d');
  var cells = [], cols, rows, size;

  function buildGrid() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    veil.width = window.innerWidth * dpr;
    veil.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = window.innerWidth < 700 ? 34 : 52;
    cols = Math.ceil(window.innerWidth / size);
    rows = Math.ceil(window.innerHeight / size);
    cells = [];
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      // order: diagonal sweep + noise so pixels fall like the Z's stroke
      cells.push({ x: x, y: y, o: (x / cols + y / rows) / 2 * 0.6 + Math.random() * 0.4, g: Math.random() < 0.14 });
    }
  }
  function draw(p, filling) {
    ctx.clearRect(0, 0, veil.width, veil.height);
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i];
      var on = filling ? c.o <= p : c.o > p;
      if (!on) continue;
      ctx.fillStyle = c.g ? '#C29B57' : '#15284A';
      ctx.fillRect(c.x * size, c.y * size, size + 0.5, size + 0.5);
    }
  }
  function animate(dur, filling, done) {
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      draw(p, filling);
      if (p < 1) requestAnimationFrame(step); else if (done) done();
    })(t0);
  }

  // arriving via a transition: start covered, then dissolve
  var arriving = doc.classList.contains('veil-in');
  if (arriving) {
    buildGrid();
    draw(0, false);
    doc.classList.remove('veil-in');
    try { sessionStorage.removeItem('zurosh-veil'); } catch (e) {}
    animate(650, false, function () { ctx.clearRect(0, 0, veil.width, veil.height); });
  }
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { ctx.clearRect(0, 0, veil.width, veil.height); doc.classList.remove('veil-in'); }
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || reduced || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname) return; // same-page anchors scroll normally
    e.preventDefault();
    buildGrid();
    try { sessionStorage.setItem('zurosh-veil', '1'); } catch (err) {}
    animate(480, true, function () { location.href = url.href; });
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
