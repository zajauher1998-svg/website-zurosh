/* ==========================================================================
   Zurosh Enterprises — 3D pixel stage
   The Zurosh "Z" is voxelised into thousands of small cubes ("pixels").
   Every other shape on the site (globe, 5G tower, buildings) is built from
   the exact same set of pixels, so the Z can rotate, shatter and re-assemble
   into each page's subject.

   Modes (set on the <canvas>):
     data-stage="scroll"    home page — morph is driven by scroll position
                            through sections marked with data-kf.
     data-stage="assemble"  inner pages — Z shatters into data-form on load.
   Requires the global THREE (assets/vendor/three.min.js).
   ========================================================================== */
(function () {
  'use strict';

  var NAVY = 0x15284A, GOLD = 0xC29B57, LIGHT = 0xE6EBF3;

  /* Z mark geometry — taken from the official SVG logo (viewBox 0 0 94 100) */
  var Z_POLYS = [
    { c: 'n', p: [[0, 0], [94, 0], [16.451, 100], [0, 100], [67.468, 13], [0, 13]] },
    { c: 'g', p: [[77.549, 31.005], [94, 31.005], [40.495, 100], [24.044, 100]] },
    { c: 'n', p: [[58.169, 87], [94, 87], [94, 100], [48.087, 100]] }
  ];

  var STEP = 2.25;          // grid step in logo units
  var LAYERS = 4;           // depth layers of the extruded Z
  var UNIT = 0.1;           // logo units -> world units
  var CELL = STEP * UNIT;   // world size of one pixel

  /* ---------- helpers ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function inPoly(x, y, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ---------- formations: arrays of {x,y,z,c} ---------- */
  function formZ() {
    var pts = [];
    for (var gy = 0; gy * STEP < 100; gy++) {
      for (var gx = 0; gx * STEP < 94; gx++) {
        var x = (gx + 0.5) * STEP, y = (gy + 0.5) * STEP, col = null;
        for (var k = 0; k < Z_POLYS.length; k++) if (inPoly(x, y, Z_POLYS[k].p)) { col = Z_POLYS[k].c; break; }
        if (!col) continue;
        for (var l = 0; l < LAYERS; l++) {
          pts.push({ x: (x - 47) * UNIT, y: (50 - y) * UNIT, z: (l - (LAYERS - 1) / 2) * CELL, c: col });
        }
      }
    }
    return pts;
  }

  // sample points along weighted line segments
  function fromSegments(segs, n) {
    var total = 0;
    segs.forEach(function (s) {
      s.len = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1], s.b[2] - s.a[2]);
      total += s.len * (s.w || 1);
    });
    var pts = [];
    segs.forEach(function (s) {
      var cnt = Math.max(2, Math.round(s.len * (s.w || 1) / total * n));
      for (var i = 0; i < cnt; i++) {
        var t = cnt === 1 ? 0.5 : i / (cnt - 1);
        pts.push({
          x: s.a[0] + (s.b[0] - s.a[0]) * t,
          y: s.a[1] + (s.b[1] - s.a[1]) * t,
          z: s.a[2] + (s.b[2] - s.a[2]) * t,
          c: s.c || 'n'
        });
      }
    });
    return pts;
  }

  function formTower(n) {
    var segs = [], H0 = -5.6, H1 = 3.4, b0 = 1.9, b1 = 0.45, LV = 8;
    function half(y) { return b0 + (b1 - b0) * (y - H0) / (H1 - H0); }
    function corner(i, y) {
      var h = half(y), s = [[1, 1], [1, -1], [-1, -1], [-1, 1]][i % 4];
      return [s[0] * h, y, s[1] * h];
    }
    var i, k;
    for (i = 0; i < 4; i++) segs.push({ a: corner(i, H0), b: corner(i, H1), w: 1.6 });
    for (k = 0; k <= LV; k++) {
      var y0 = H0 + (H1 - H0) * k / LV;
      for (i = 0; i < 4; i++) segs.push({ a: corner(i, y0), b: corner(i + 1, y0), w: 0.9 });
      if (k < LV) {
        var y1 = H0 + (H1 - H0) * (k + 1) / LV;
        for (i = 0; i < 4; i++) {
          segs.push({ a: corner(i, y0), b: corner(i + 1, y1), w: 0.75 });
          segs.push({ a: corner(i + 1, y0), b: corner(i, y1), w: 0.75 });
        }
      }
    }
    // mast + head-frame
    segs.push({ a: [0, H1, 0], b: [0, 6.3, 0], w: 1.4 });
    segs.push({ a: [0, 6.3, 0], b: [0, 7.0, 0], c: 'g', w: 2.4 });        // antenna tip
    var P = 0.95;
    [[P, P], [P, -P], [-P, -P], [-P, P]].forEach(function (s, j, arr) {
      var nx = arr[(j + 1) % 4];
      segs.push({ a: [s[0], H1, s[1]], b: [nx[0], H1, nx[1]], w: 1.2 });
      segs.push({ a: [s[0], H1 + 1.7, s[1]], b: [nx[0], H1 + 1.7, nx[1]], w: 0.8 });
    });
    // 5G sector antennas (gold) — 3 sectors, 120° apart
    for (k = 0; k < 3; k++) {
      var ang = k * Math.PI * 2 / 3 + Math.PI / 6, r = 1.25;
      var cx = Math.cos(ang) * r, cz = Math.sin(ang) * r, tx = -Math.sin(ang), tz = Math.cos(ang);
      for (var o = -1; o <= 1; o++) {
        var ox = cx + tx * o * 0.2, oz = cz + tz * o * 0.2;
        segs.push({ a: [ox, H1 + 0.15, oz], b: [ox, H1 + 2.0, oz], c: 'g', w: 2.6 });
      }
    }
    // microwave dish (gold ring)
    var DY = 1.2, DR = 0.55, prev = null;
    for (k = 0; k <= 16; k++) {
      var a2 = k / 16 * Math.PI * 2;
      var p = [0.9 + Math.cos(a2) * 0.06, DY + Math.sin(a2) * DR, 0.9 + Math.cos(a2) * DR];
      if (prev) segs.push({ a: prev, b: p, c: 'g', w: 2.2 });
      prev = p;
    }
    return fromSegments(segs, n);
  }

  function formBuildings() {
    var pts = [], sp = 0.27, baseY = -5.2;
    // residential towers + a stepped commercial plaza
    var boxes = [
      { x: -2.9, z: 0.2, w: 2.5, d: 2.5, h: 10.2, kind: 'res' },
      { x: 3.4, z: 0.9, w: 2.0, d: 2.0, h: 7.0, kind: 'res' },
      { x: 0.6, z: -1.0, w: 4.4, d: 3.4, h: 3.3, kind: 'plaza' },
      { x: 0.6, z: -1.2, w: 2.9, d: 2.2, h: 2.4, y0: 3.3, kind: 'plaza-top' }
    ];
    boxes.forEach(function (b) {
      var y0 = baseY + (b.y0 || 0), y1 = y0 + b.h;
      var nx = Math.max(2, Math.round(b.w / sp)), nz = Math.max(2, Math.round(b.d / sp)), ny = Math.max(2, Math.round(b.h / sp));
      function col(u, v, nu) {
        if (u === 0 || u === nu || v === 0 || v === ny) return 'n';
        if (b.kind === 'plaza' && v <= 3) return 'g';                    // glass storefronts
        if (b.kind === 'plaza' || b.kind === 'plaza-top') return (v % 3 === 0) ? 'g' : 'n';
        return (v % 3 === 1 && u % 2 === 1) ? 'g' : 'n';                // window grid
      }
      var u, v;
      // vertical faces
      for (v = 0; v <= ny; v++) {
        var y = y0 + b.h * v / ny;
        for (u = 0; u <= nx; u++) {
          var x = b.x - b.w / 2 + b.w * u / nx;
          pts.push({ x: x, y: y, z: b.z + b.d / 2, c: col(u, v, nx) });
          pts.push({ x: x, y: y, z: b.z - b.d / 2, c: col(u, v, nx) });
        }
        for (u = 1; u < nz; u++) {
          var z = b.z - b.d / 2 + b.d * u / nz;
          pts.push({ x: b.x + b.w / 2, y: y, z: z, c: col(u, v, nz) });
          pts.push({ x: b.x - b.w / 2, y: y, z: z, c: col(u, v, nz) });
        }
      }
      // roof
      for (u = 1; u < nx; u++) for (var w = 1; w < nz; w++) {
        pts.push({ x: b.x - b.w / 2 + b.w * u / nx, y: y1, z: b.z - b.d / 2 + b.d * w / nz, c: 'n' });
      }
    });
    return pts;
  }

  // sample the surface of a box on a grid; col(face, u, v, nu, nv) picks the colour
  function boxSurface(pts, b, sp, col) {
    var nx = Math.max(2, Math.round(b.w / sp)), nz = Math.max(2, Math.round(b.d / sp)), ny = Math.max(2, Math.round(b.h / sp));
    var x0 = b.x - b.w / 2, z0 = b.z - b.d / 2, u, v;
    for (v = 0; v <= ny; v++) {
      var y = b.y + b.h * v / ny;
      for (u = 0; u <= nx; u++) {
        pts.push({ x: x0 + b.w * u / nx, y: y, z: z0 + b.d, c: col('front', u, v, nx, ny) });
        pts.push({ x: x0 + b.w * u / nx, y: y, z: z0, c: col('back', u, v, nx, ny) });
      }
      for (u = 1; u < nz; u++) {
        pts.push({ x: x0 + b.w, y: y, z: z0 + b.d * u / nz, c: col('side', u, v, nz, ny) });
        pts.push({ x: x0, y: y, z: z0 + b.d * u / nz, c: col('side', u, v, nz, ny) });
      }
    }
    if (b.roof) for (u = 1; u < nx; u++) for (v = 1; v < nz; v++) {
      pts.push({ x: x0 + b.w * u / nx, y: b.y + b.h, z: z0 + b.d * v / nz, c: 'n' });
    }
  }

  // a two-storey family house with a pitched roof
  function formHouse() {
    var pts = [], sp = 0.25, W = 6, D = 4, H = 3.75, Y = -4.2, R = 2.3;
    boxSurface(pts, { x: 0, z: 0, w: W, d: D, h: H, y: Y }, sp, function (face, u, v, nu, nv) {
      if (u === 0 || u === nu || v === 0 || v === nv) return 'n';
      if (face === 'front') {
        var mid = Math.round(nu / 2);
        if (v <= 7 && Math.abs(u - mid) <= 1) return 'g';                    // front door
        var inWin = (v >= 3 && v <= 5) || (v >= 10 && v <= 12);              // two floors of windows
        var col = u % 6;
        if (inWin && (col === 2 || col === 3) && Math.abs(u - mid) > 2) return 'g';
      }
      if (face === 'side' && ((v >= 10 && v <= 12) && (u === Math.round(nu / 2) || u === Math.round(nu / 2) + 1))) return 'g';
      return 'n';
    });
    // gable roof: two slopes meeting at a gold ridge, with triangular gable ends
    var nx = Math.round((W + 0.6) / sp), ns = Math.round(Math.hypot(D / 2 + 0.3, R) / sp), u, k;
    for (u = 0; u <= nx; u++) {
      var x = -W / 2 - 0.3 + (W + 0.6) * u / nx;
      for (k = 0; k <= ns; k++) {
        var t = k / ns, y = Y + H + R * t, z = (D / 2 + 0.3) * (1 - t);
        var c = k === ns ? 'g' : 'n';
        pts.push({ x: x, y: y, z: z, c: c });
        if (k < ns) pts.push({ x: x, y: y, z: -z, c: c });
      }
    }
    for (k = 1; k < ns; k++) {
      var tt = k / ns, yy = Y + H + R * tt, half = (D / 2) * (1 - tt);
      for (var zz = -half; zz <= half; zz += sp) {
        pts.push({ x: W / 2, y: yy, z: zz, c: 'n' });
        pts.push({ x: -W / 2, y: yy, z: zz, c: 'n' });
      }
    }
    // chimney
    boxSurface(pts, { x: 1.7, z: -0.7, w: 0.6, d: 0.6, h: 1.6, y: Y + H + 0.9, roof: true }, sp, function () { return 'n'; });
    return pts;
  }

  // a multi-storey commercial plaza: glass shopfronts, office floors, signage band
  function formCommercial() {
    var pts = [], sp = 0.26, Y = -5.2;
    boxSurface(pts, { x: 0, z: 0, w: 6.4, d: 3.6, h: 3.1, y: Y, roof: true }, sp, function (face, u, v, nu, nv) {
      if (u === 0 || u === nu) return 'n';
      if (v === nv || v === nv - 1) return 'n';                               // podium slab
      return (u % 4 === 0) ? 'n' : 'g';                                        // shopfront glazing
    });
    boxSurface(pts, { x: 0, z: -0.2, w: 5.2, d: 3.0, h: 6.9, y: Y + 3.1, roof: true }, sp, function (face, u, v, nu, nv) {
      if (u === 0 || u === nu) return 'n';
      if (v >= nv - 2) return 'g';                                             // signage band
      return (v % 3 === 1 && u % 3 !== 0) ? 'g' : 'n';                         // office window bands
    });
    boxSurface(pts, { x: -1.2, z: -0.4, w: 1.4, d: 1.4, h: 0.9, y: Y + 10, roof: true }, sp, function () { return 'n'; });
    return pts;
  }

  function formGlobe(n) {
    // a sphere split into two hemispheres: telecom (navy) | construction (gold)
    var pts = [], R = 5.1, golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
      var x = Math.cos(th) * r, z = Math.sin(th) * r;
      var right = x >= 0;
      pts.push({ x: x * R + (right ? 0.55 : -0.55), y: y * R, z: z * R, c: right ? 'g' : 'n' });
    }
    return pts;
  }

  /* Pakistan — simplified outline (lon, lat) following Pakistan's official map,
     including the whole of Jammu & Kashmir. Clockwise from the Iran border on the
     Makran coast. */
  var PK = [
    [61.6, 25.2], [61.9, 26.4], [63.2, 27.1], [62.8, 28.2], [61.9, 28.6], [60.9, 29.4], [60.9, 29.9],
    [62.4, 29.4], [64.2, 29.5], [66.3, 29.9], [66.5, 30.9], [67.4, 31.3], [68.2, 31.8], [69.3, 31.9],
    [69.6, 32.8], [70.1, 33.3], [70.0, 33.9], [71.1, 34.1], [71.6, 35.0], [71.4, 35.6], [71.6, 36.4],
    [72.6, 36.9], [74.0, 36.9], [75.0, 37.0], [75.6, 36.8], [76.2, 36.0], [77.0, 35.6], [77.8, 35.5],
    // Jammu & Kashmir (incl. Ladakh) — eastern and southern limits
    [78.3, 34.6], [79.0, 34.3], [78.8, 33.6], [79.4, 33.0], [79.5, 32.6], [78.4, 32.5], [77.8, 32.7],
    [77.3, 32.9], [76.6, 33.0], [75.9, 32.8], [75.6, 32.4], [75.4, 32.3], [74.9, 32.4],
    [74.6, 31.9], [74.6, 31.1], [74.0, 30.6], [73.4, 29.9], [72.8, 29.0], [71.9, 28.1], [70.7, 27.8],
    [70.0, 27.2], [69.6, 26.6], [70.2, 26.2], [70.1, 25.6], [69.5, 24.8], [69.0, 24.3], [68.2, 23.7],
    [67.4, 23.9], [67.0, 24.8], [66.7, 25.4], [65.6, 25.3], [64.6, 25.2], [63.5, 25.3], [62.3, 25.1]
  ];
  // fiber nodes (major cities) and backbone routes between them
  var CITIES = {
    karachi: [67.0, 24.9], hyderabad: [68.4, 25.4], sukkur: [68.9, 27.7], quetta: [67.0, 30.2],
    gwadar: [62.3, 25.3], multan: [71.5, 30.2], bahawalpur: [71.7, 29.4], faisalabad: [73.1, 31.4],
    lahore: [74.3, 31.5], sialkot: [74.5, 32.5], islamabad: [73.05, 33.7], peshawar: [71.5, 34.0],
    gilgit: [74.3, 35.9], dikhan: [70.9, 31.8]
  };
  var ROUTES = [
    ['gwadar', 'karachi'], ['karachi', 'hyderabad'], ['hyderabad', 'sukkur'], ['sukkur', 'quetta'],
    ['sukkur', 'bahawalpur'], ['bahawalpur', 'multan'], ['quetta', 'multan'], ['multan', 'faisalabad'],
    ['faisalabad', 'lahore'], ['lahore', 'sialkot'], ['sialkot', 'islamabad'], ['faisalabad', 'islamabad'],
    ['islamabad', 'peshawar'], ['islamabad', 'gilgit'], ['multan', 'dikhan'], ['dikhan', 'peshawar']
  ];
  var MAP_K = 0.95, MAP_LON = 70.2, MAP_LAT = 30.4, MAP_LAYERS = 2;
  function project(lon, lat) {
    return [(lon - MAP_LON) * MAP_K * 0.87, (lat - MAP_LAT) * MAP_K];
  }
  function formMap() {
    var pts = [], dlon = CELL / (MAP_K * 0.87), dlat = CELL / MAP_K;
    for (var lat = 23.6; lat < 37.2; lat += dlat) {
      for (var lon = 60.8; lon < 79.6; lon += dlon) {
        if (!inPoly(lon, lat, PK)) continue;
        var xy = project(lon, lat);
        for (var l = 0; l < MAP_LAYERS; l++) {
          pts.push({ x: xy[0], y: xy[1], z: (l - (MAP_LAYERS - 1) / 2) * CELL, c: 'n' });
        }
      }
    }
    return pts;
  }

  // resize a point list to exactly n entries
  function fit(pts, n, rand) {
    var out = pts.slice();
    for (var i = out.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)), t = out[i]; out[i] = out[j]; out[j] = t; }
    if (out.length > n) return out.slice(0, n);
    var base = out.length;
    while (out.length < n) {
      var s = out[Math.floor(rand() * base)];
      out.push({ x: s.x + (rand() - 0.5) * 0.05, y: s.y + (rand() - 0.5) * 0.05, z: s.z + (rand() - 0.5) * 0.05, c: s.c });
    }
    return out;
  }

  // sort by height (+ noise) so pixels travel coherently between shapes
  function pack(pts, palette, rand) {
    pts.forEach(function (p) { p.k = p.y + (rand() - 0.5) * 2.2; });
    pts.sort(function (a, b) { return a.k - b.k; });
    var n = pts.length, P = new Float32Array(n * 3), C = new Float32Array(n * 3);
    var navy = new THREE.Color(palette.n), gold = new THREE.Color(palette.g);
    pts.forEach(function (p, i) {
      P[i * 3] = p.x; P[i * 3 + 1] = p.y; P[i * 3 + 2] = p.z;
      var c = p.c === 'g' ? gold : navy;
      C[i * 3] = c.r; C[i * 3 + 1] = c.g; C[i * 3 + 2] = c.b;
    });
    return { p: P, c: C };
  }

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }

  /* ======================================================================
     Stage
     ====================================================================== */
  function Stage(canvas, opts) {
    this.canvas = canvas;
    this.opts = opts;
    var palette = { n: opts.dark ? LIGHT : NAVY, g: GOLD }, lightPal = { n: LIGHT, g: GOLD };
    // shapes shown over a dark backdrop (home page telecom zone) use light pixels
    function pal(name) { return (opts.lightForms || []).indexOf(name) >= 0 ? lightPal : palette; }
    var rand = rng(1998);

    var zPts = formZ();
    var N = this.N = zPts.length;
    this.forms = {
      z: pack(zPts, palette, rand),
      globe: pack(fit(formGlobe(N), N, rand), palette, rand),
      tower: pack(fit(formTower(N), N, rand), pal('tower'), rand),
      buildings: pack(fit(formBuildings(), N, rand), palette, rand)
    };
    if (opts.net) this.forms.map = pack(fit(formMap(), N, rand), pal('map'), rand);
    this.forms.house = pack(fit(formHouse(), N, rand), palette, rand);
    this.forms.commercial = pack(fit(formCommercial(), N, rand), palette, rand);

    // per-pixel randomness: delay, burst direction, spin
    this.rnd = new Float32Array(N);
    this.burst = new Float32Array(N * 3);
    this.spin = new Float32Array(N * 2);
    for (var i = 0; i < N; i++) {
      this.rnd[i] = rand();
      var u = rand() * 2 - 1, a = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u), m = 0.6 + rand() * 1.1;
      this.burst[i * 3] = Math.cos(a) * s * m;
      this.burst[i * 3 + 1] = u * m;
      this.burst[i * 3 + 2] = Math.sin(a) * s * m * 1.6;
      this.spin[i * 2] = (rand() - 0.5) * 6;
      this.spin[i * 2 + 1] = (rand() - 0.5) * 6;
    }

    var r = this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
    this.camera.position.set(0, 0, 30);

    this.scene.add(new THREE.HemisphereLight(0xffffff, opts.dark ? 0x1c2c4c : 0xd9dee8, opts.dark ? 1.4 : 1.7));
    var key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(7, 10, 14); this.scene.add(key);
    var rim = new THREE.DirectionalLight(0xF1D9A8, 1.0); rim.position.set(-10, -4, 6); this.scene.add(rim);

    var geo = new THREE.BoxGeometry(CELL * 0.86, CELL * 0.86, CELL * 0.86);
    var mat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.18 });
    var mesh = this.mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;

    this.group = new THREE.Group();
    this.group.add(mesh);
    this.scene.add(this.group);

    // the solid logo: shown at rest, swapped for the pixels once morphing starts
    var solid = this.solid = new THREE.Group(), depth = LAYERS * CELL, mats = this.solidMats = [];
    Z_POLYS.forEach(function (poly) {
      var shape = new THREE.Shape();
      poly.p.forEach(function (pt, k) {
        var x = (pt[0] - 47) * UNIT, y = (50 - pt[1]) * UNIT;
        if (k) shape.lineTo(x, y); else shape.moveTo(x, y);
      });
      var g = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
      g.translate(0, 0, -depth / 2);
      var hex = poly.c === 'g' ? palette.g : palette.n;
      // faces keep the exact brand colour; the sides are lit to show depth
      var face = new THREE.MeshBasicMaterial({ color: hex, transparent: true });
      var side = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.4, metalness: 0.2, transparent: true });
      mats.push(face, side);
      solid.add(new THREE.Mesh(g, [face, side]));
    });
    this.group.add(solid);
    this.solidV = -1;
    this.setSolid(1);
    if (opts.net) this.buildNet();
    this.buildSignal();

    this.dummy = new THREE.Object3D();
    this.last = '';
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var self = this;
    window.addEventListener('pointermove', function (e) {
      self.mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      self.mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    this.resize();
    window.addEventListener('resize', function () { self.resize(); });
  }

  Stage.prototype.resize = function () {
    var w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.visH = 2 * this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    this.visW = this.visH * this.camera.aspect;
    this.last = '';
  };

  /* 1 = original solid logo, 0 = pixels, in between = logo fading into pixels */
  Stage.prototype.setSolid = function (v) {
    v = clamp(v, 0, 1);
    if (v === this.solidV) return;
    this.solidV = v;
    this.solid.visible = v > 0;
    this.mesh.visible = v < 1;
    this.solidMats.forEach(function (m) { m.opacity = v; });
  };

  /* fiber network over the map: glowing city nodes, backbone arcs, travelling pulses */
  Stage.prototype.buildNet = function () {
    var net = this.net = new THREE.Group(), front = (MAP_LAYERS / 2) * CELL + 0.12;
    var gold = new THREE.Color(GOLD), mats = this.netMats = [];
    function mat(color, opacity) {
      var m = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity, depthWrite: false, side: THREE.DoubleSide });
      m.userData.base = opacity; mats.push(m); return m;
    }
    var pos = {}, coreGeo = new THREE.SphereGeometry(0.15, 16, 12), ringGeo = new THREE.RingGeometry(0.2, 0.25, 40);
    this.rings = [];
    Object.keys(CITIES).forEach(function (k, i) {
      var xy = project(CITIES[k][0], CITIES[k][1]);
      pos[k] = new THREE.Vector3(xy[0], xy[1], front);
      var core = new THREE.Mesh(coreGeo, mat(gold, 1));
      core.position.copy(pos[k]); net.add(core);
      var ring = new THREE.Mesh(ringGeo, mat(gold, 0.8));
      ring.position.copy(pos[k]); ring.userData.phase = i * 0.37; net.add(ring);
      this.rings.push(ring);
    }, this);
    this.links = [];
    var lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.75, depthWrite: false });
    lineMat.userData.base = 0.75; mats.push(lineMat);
    var pulseGeo = new THREE.SphereGeometry(0.075, 10, 8), pulseMat = mat(0xffffff, 1);
    ROUTES.forEach(function (r, i) {
      var a = pos[r[0]], b = pos[r[1]], mid = a.clone().add(b).multiplyScalar(0.5);
      mid.z += a.distanceTo(b) * 0.18;                       // arcs lift off the map
      var curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      net.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)), lineMat));
      for (var j = 0; j < 2; j++) {
        var pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.userData = { curve: curve, phase: (i * 0.29 + j * 0.5) % 1, dir: j ? -1 : 1 };
        net.add(pulse); this.links.push(pulse);
      }
    }, this);
    this.group.add(net);
  };
  Stage.prototype.updateNet = function (v, time) {
    if (!this.net) return;
    v = clamp(v, 0, 1);
    this.net.visible = v > 0.01;
    if (!this.net.visible) return;
    this.netMats.forEach(function (m) { m.opacity = m.userData.base * v; });
    var still = this.reduced;
    this.rings.forEach(function (r) {
      var f = still ? 0.4 : (time * 0.7 + r.userData.phase) % 1;
      r.scale.setScalar(1 + f * 2.2);
      r.material.opacity = r.material.userData.base * v * (1 - f);
    });
    this.links.forEach(function (p) {
      var f = still ? p.userData.phase : (time * 0.28 + p.userData.phase) % 1;
      p.position.copy(p.userData.curve.getPoint(p.userData.dir > 0 ? f : 1 - f));
    });
  };

  /* signal waves broadcast from the top of the tower: arcs either side of the
     antenna tip that ripple outward and fade, plus a pulsing beacon */
  var SIGNAL_Y = 7.0;
  Stage.prototype.buildSignal = function () {
    var sig = this.signal = new THREE.Group(), arcs = this.arcs = [];
    sig.position.set(0, SIGNAL_Y, 0);
    for (var k = 0; k < 3; k++) {
      [0, Math.PI].forEach(function (start) {
        var m = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
        var arc = new THREE.Mesh(new THREE.RingGeometry(1, 1.09, 40, 1, start - Math.PI / 4, Math.PI / 2), m);
        arc.userData.phase = k / 3;
        sig.add(arc); arcs.push(arc);
      });
    }
    var beacon = this.beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 16, 12),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, depthWrite: false })
    );
    sig.add(beacon);
    sig.visible = false;
    this.group.add(sig);
  };
  Stage.prototype.updateSignal = function (v, time) {
    v = clamp(v, 0, 1);
    this.signal.visible = v > 0.01;
    if (!this.signal.visible) return;
    var still = this.reduced;
    this.arcs.forEach(function (a) {
      var f = still ? 0.5 : (time * 0.55 + a.userData.phase) % 1;     // 0 → 1 as the wave travels out
      a.scale.setScalar(0.55 + f * 2.2);
      a.material.opacity = v * (still ? 0.6 : Math.sin(Math.PI * f) * 0.95);
    });
    this.beacon.material.opacity = v * (still ? 1 : 0.65 + 0.35 * Math.sin(time * 5));
  };

  /* place every pixel for a morph between two formations (t: 0..1) */
  Stage.prototype.layout = function (from, to, t) {
    var key = from + '|' + to + '|' + t.toFixed(4);
    if (key === this.last) return;
    this.last = key;
    var A = this.forms[from], B = this.forms[to], N = this.N;
    var mat = this.mesh.instanceMatrix.array, col = this.mesh.instanceColor.array;
    var d = this.dummy, burstAmp = this.reduced ? 0 : 3.6, same = from === to;
    for (var i = 0; i < N; i++) {
      var i3 = i * 3, e = 1;
      if (!same && t < 1) {
        // pixels peel away left→right with jitter
        var delay = clamp((A.p[i3] + 5) / 10, 0, 1) * 0.55 + this.rnd[i] * 0.3;
        e = ease(clamp((t - delay * 0.4) / 0.6, 0, 1));
      }
      if (same) e = 0;
      var bump = same ? 0 : Math.sin(Math.PI * e);
      d.position.set(
        A.p[i3] + (B.p[i3] - A.p[i3]) * e + this.burst[i3] * bump * burstAmp,
        A.p[i3 + 1] + (B.p[i3 + 1] - A.p[i3 + 1]) * e + this.burst[i3 + 1] * bump * burstAmp,
        A.p[i3 + 2] + (B.p[i3 + 2] - A.p[i3 + 2]) * e + this.burst[i3 + 2] * bump * burstAmp
      );
      d.rotation.set(this.spin[i * 2] * bump, this.spin[i * 2 + 1] * bump, 0);
      var s = 1 - 0.3 * bump;
      d.scale.set(s, s, s);
      d.updateMatrix();
      d.matrix.toArray(mat, i * 16);
      col[i3] = A.c[i3] + (B.c[i3] - A.c[i3]) * e;
      col[i3 + 1] = A.c[i3 + 1] + (B.c[i3 + 1] - A.c[i3 + 1]) * e;
      col[i3 + 2] = A.c[i3 + 2] + (B.c[i3 + 2] - A.c[i3 + 2]) * e;
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
  };

  Stage.prototype.render = function (rotY, x, y, scale, sway, time) {
    var m = this.mouse;
    m.x += (m.tx - m.x) * 0.05; m.y += (m.ty - m.y) * 0.05;
    var g = this.group;
    var wobble = this.reduced ? 0 : Math.sin(time * 0.6) * 0.32 * sway;
    g.rotation.y = rotY + wobble + m.x * 0.18;
    g.rotation.x = m.y * 0.1 + (this.reduced ? 0 : Math.sin(time * 0.45) * 0.05 * sway);
    g.position.x = x;
    g.position.y = y + (this.reduced ? 0 : Math.sin(time * 0.8) * 0.18 * sway);
    g.scale.setScalar(scale);
    // keep the signal waves facing the viewer while the tower turns
    if (this.signal) { this.signal.rotation.y = -g.rotation.y; this.signal.rotation.x = -g.rotation.x; }
    this.renderer.render(this.scene, this.camera);
  };

  /* ======================================================================
     Home: scroll-driven
     ====================================================================== */
  function initScroll(canvas) {
    var stage = new Stage(canvas, { net: true, lightForms: ['map', 'tower'] });
    var sections = [].slice.call(document.querySelectorAll('[data-kf]'));
    var rail = [].slice.call(document.querySelectorAll('.progress-rail a'));
    var kf = [], anchors = [];

    function measure() {
      var vh = window.innerHeight, narrow = stage.camera.aspect < 1.05;
      var off = narrow ? 0 : Math.min(stage.visW * 0.23, 9);
      var fitScale = narrow ? Math.min(1, stage.visW / 13) : 1;
      kf = sections.map(function (s, i) {
        var side = s.getAttribute('data-side') || 'center';
        // on narrow screens the object floats above the text panel
        var lift = narrow && i > 0;
        return {
          form: s.getAttribute('data-kf'),
          rot: parseFloat(s.getAttribute('data-rot') || '0') * Math.PI * 2,
          x: side === 'left' ? -off : side === 'right' ? off : 0,
          y: lift ? stage.visH * 0.27 : parseFloat(s.getAttribute('data-y') || '0') * stage.visH,
          scale: parseFloat(s.getAttribute('data-scale') || '1') * fitScale * (lift ? 0.6 : 1),
          sway: s.getAttribute('data-kf') === 'z' ? 0.5 : 1
        };
      });
      // a section is "reached" when its panel sits in the reading position
      var maxY = Math.max(1, document.documentElement.scrollHeight - vh), prev = 0;
      anchors = sections.map(function (s, i) {
        if (i === 0) return 0;
        var el = s.querySelector('.panel') || s, r = el.getBoundingClientRect();
        // phones: the panel's top sits just below the object; desktop: the panel is centred
        var a = narrow ? r.top + window.scrollY - vh * 0.44 : r.top + window.scrollY + r.height / 2 - vh * 0.5;
        prev = Math.max(prev + 1, Math.min(maxY, a));
        return prev;
      });
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    var start = performance.now();
    function frame(now) {
      var y = window.scrollY, i = 0;
      while (i < anchors.length - 2 && y >= anchors[i + 1]) i++;
      var span = Math.max(1, anchors[i + 1] - anchors[i]);
      var raw = clamp((y - anchors[i]) / span, 0, 1);
      // hold zones around each section; the opening logo reacts to the first scroll
      var th = i === 0 ? clamp(raw / 0.9, 0, 1) : clamp((raw - 0.1) / 0.8, 0, 1);
      var a = kf[i], b = kf[i + 1];
      var tr = ease(clamp(th / 0.65, 0, 1));     // rotate first…
      var tm = clamp((th - 0.22) / 0.78, 0, 1);  // …then shatter & rebuild
      stage.layout(a.form, b.form, tm);
      // solid logo until the pixels start moving; it returns once they have re-formed a Z
      stage.setSolid(a.form === 'z' && tm < 0.05 ? 1 - tm / 0.05 : b.form === 'z' && tm > 0.95 ? (tm - 0.95) / 0.05 : 0);
      // fiber network shows only while the pixels rest as the map
      stage.updateNet(a.form === 'map' ? 1 - tm / 0.12 : b.form === 'map' ? (tm - 0.88) / 0.12 : 0, (now - start) / 1000);
      stage.updateSignal(a.form === 'tower' && b.form === 'tower' ? 1 : a.form === 'tower' ? 1 - tm / 0.12 : b.form === 'tower' ? (tm - 0.88) / 0.12 : 0, (now - start) / 1000);
      stage.render(
        a.rot + (b.rot - a.rot) * tr,
        a.x + (b.x - a.x) * ease(th),
        a.y + (b.y - a.y) * ease(th),
        a.scale + (b.scale - a.scale) * ease(th),
        a.sway + (b.sway - a.sway) * th,
        (now - start) / 1000
      );
      var active = raw > 0.5 ? i + 1 : i;
      rail.forEach(function (r, k) { r.classList.toggle('active', k === active); });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ======================================================================
     Inner pages: Z assembles into the page subject
     ====================================================================== */
  function initAssemble(canvas) {
    var form = canvas.getAttribute('data-form') || 'tower';
    var stage = new Stage(canvas, { dark: canvas.hasAttribute('data-dark') });
    var start = performance.now(), visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
    }
    var HOLD = 0.7, DUR = stage.reduced ? 0.01 : 2.8;
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      var t = (now - start) / 1000;
      var p = clamp((t - HOLD) / DUR, 0, 1);
      var tm = clamp((p - 0.15) / 0.85, 0, 1);
      stage.layout('z', form, tm);
      stage.setSolid(1 - tm / 0.05);
      var spinAfter = stage.reduced ? 0 : Math.max(0, t - HOLD - DUR) * 0.22;
      stage.render(ease(clamp(p / 0.6, 0, 1)) * Math.PI * 2 + spinAfter, 0, 0, 0.92, 0.6, t);
    }
    requestAnimationFrame(frame);
  }

  /* ======================================================================
     Sector pages: the hero loops between two shapes on a timer
     (telecom: map of Pakistan with fiber network <-> 5G tower;
      construction: house <-> commercial plaza)
     ====================================================================== */
  function initCycle(canvas) {
    var from = canvas.getAttribute('data-from') || 'map', form = canvas.getAttribute('data-form') || 'tower';
    var host = canvas.closest('section') || canvas.parentNode;
    var stage = new Stage(canvas, { dark: canvas.hasAttribute('data-dark'), net: from === 'map' });
    stage.setSolid(0);
    var rot0 = parseFloat(canvas.getAttribute('data-rot0') || '0');
    var HOLD = 1.8, MORPH = 1.7, LOOP = 2 * (HOLD + MORPH);
    var start = performance.now(), visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      var t = (now - start) / 1000, c = t % LOOP, a = from, b = form, m = 0;
      if (c < HOLD) m = 0;                                                     // first shape
      else if (c < HOLD + MORPH) m = (c - HOLD) / MORPH;                       // first -> second
      else if (c < 2 * HOLD + MORPH) m = 1;                                    // second shape
      else { a = form; b = from; m = (c - 2 * HOLD - MORPH) / MORPH; }         // second -> first
      stage.layout(a, b, m);
      var atMap = (a === 'map' && m === 0) || (b === 'map' && m === 1) ? 1 : (a === 'map' ? 1 - m / 0.12 : b === 'map' ? (m - 0.88) / 0.12 : 0);
      stage.updateNet(atMap, t);
      stage.updateSignal(a === 'tower' ? 1 - m / 0.12 : b === 'tower' ? (m - 0.88) / 0.12 : 0, t);
      stage.render(rot0 + ease(clamp(m, 0, 1)) * Math.PI * 2, 0, 0, 0.92, 0.7, t);
      host.classList.toggle('is-built', (b === form && m > 0.5) || (a === form && m < 0.5 && b !== form));
    }
    requestAnimationFrame(frame);
  }

  function boot() {
    var canvases = document.querySelectorAll('canvas[data-stage]');
    if (!canvases.length) return;
    if (!window.THREE || !webglOK()) { document.documentElement.classList.add('no-webgl'); return; }
    [].forEach.call(canvases, function (c) {
      try {
        var mode = c.getAttribute('data-stage');
        if (mode === 'scroll') initScroll(c); else if (mode === 'cycle') initCycle(c); else initAssemble(c);
      } catch (err) {
        document.documentElement.classList.add('no-webgl');
        if (window.console) console.error(err);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
