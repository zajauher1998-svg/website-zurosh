#!/usr/bin/env python3
"""Generates the static pages so header / mega menu / footer stay identical."""
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + os.sep

EMAIL = 'info@zurosh.com'          # TODO: confirm
PHONE = '+92 000 0000000'          # TODO: replace
CITY = 'Pakistan'                  # TODO: add office address

ICON = {
 'tower': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v13M8 22l4-13 4 13M9.5 16h5"/><path d="M8.5 5.5a5 5 0 0 0 0 7M15.5 5.5a5 5 0 0 1 0 7M6 3a8.5 8.5 0 0 0 0 12M18 3a8.5 8.5 0 0 1 0 12"/><circle cx="12" cy="9" r="1.2"/></svg>',
 'building': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V5l7-3v19M12 9h7v12"/><path d="M8 7h1M8 11h1M8 15h1M15 13h1M15 17h1"/></svg>',
 'fiber': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c6 0 6 6 12 6h3M2 12h15M2 18c6 0 6-6 12-6"/><path d="M17 8.5l4 3.5-4 3.5z"/></svg>',
 'consult': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/><path d="M15 6l3-3 3 3M18 3v6"/></svg>',
 'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',
 'plaza': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h20M4 21V8h16v13M4 8l2-4h12l2 4"/><path d="M8 21v-5h3v5M14 12h3M14 16h3M8 12h3"/></svg>',
 'map': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
 'mail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
 'phone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
 'shield': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
 'clock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 'layers': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
 'hardhat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18M5 18v-3a7 7 0 0 1 14 0v3"/><path d="M10 8V5h4v3"/></svg>',
 'doc': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
}
CHEV = '<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'

def head(title, desc):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#15284A">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script>try{{if(sessionStorage.getItem('zurosh-veil'))document.documentElement.classList.add('veil-in')}}catch(e){{}}</script>
</head>'''

def header(current):
    def cur(k): return ' aria-current="page"' if current == k else ''
    return f'''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Zurosh Enterprises — home">
      <img src="assets/img/zurosh-logo-horizontal.svg" alt="Zurosh Enterprises" width="533" height="102">
    </a>
    <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <a href="index.html"{cur('home')}>Home</a>
      <div class="nav-item">
        <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Our Sectors {CHEV}</button>
        <div class="mega" role="group" aria-label="Our sectors">
          <div class="sector sector-telecom">
            <div class="sector-head">
              <span class="sector-icon">{ICON['tower']}</span>
              <div><div class="sector-label">Sector 01</div><div class="sector-title">Telecom</div></div>
            </div>
            <ul>
              <li><a class="sub" href="telecom.html#ftth"><strong>FTTH Networks</strong><span>Fibre-to-the-home design, rollout &amp; splicing</span></a></li>
              <li><a class="sub" href="telecom.html#towers"><strong>5G Tower Infrastructure</strong><span>Site acquisition through to tower handover</span></a></li>
              <li><a class="sub" href="telecom.html#consultancy"><strong>Telecom Consultancy</strong><span>Planning, feasibility &amp; regulatory advisory</span></a></li>
            </ul>
            <a class="sector-all" href="telecom.html">All telecom services <span aria-hidden="true">→</span></a>
          </div>
          <div class="sector sector-construction">
            <div class="sector-head">
              <span class="sector-icon">{ICON['building']}</span>
              <div><div class="sector-label">Sector 02</div><div class="sector-title">Construction</div></div>
            </div>
            <ul>
              <li><a class="sub" href="construction.html#residential"><strong>Residential Units</strong><span>Homes, villas &amp; apartment blocks</span></a></li>
              <li><a class="sub" href="construction.html#commercial"><strong>Commercial Plazas</strong><span>Retail, office &amp; mixed-use plazas</span></a></li>
              <li><a class="sub" href="construction.html#process"><strong>Design &amp; Build</strong><span>Approvals, construction &amp; handover</span></a></li>
            </ul>
            <a class="sector-all" href="construction.html">All construction services <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <a href="about.html"{cur('about')}>About</a>
      <a href="contact.html"{cur('contact')}>Contact</a>
      <a class="btn btn-primary" href="contact.html">Start a project</a>
    </nav>
  </div>
</header>'''

FOOTER = f'''<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="assets/img/zurosh-logo-stacked-white.svg" alt="Zurosh Enterprises" width="372" height="286" loading="lazy">
        <p>Telecom infrastructure and construction across Pakistan — two sectors, one standard of delivery.</p>
      </div>
      <div>
        <h4 class="t">Telecom</h4>
        <ul>
          <li><a href="telecom.html#ftth">FTTH Networks</a></li>
          <li><a href="telecom.html#towers">5G Tower Infrastructure</a></li>
          <li><a href="telecom.html#lifecycle">Site Acquisition → Handover</a></li>
          <li><a href="telecom.html#consultancy">Telecom Consultancy</a></li>
        </ul>
      </div>
      <div>
        <h4 class="c">Construction</h4>
        <ul>
          <li><a href="construction.html#residential">Residential Units</a></li>
          <li><a href="construction.html#commercial">Commercial Plazas</a></li>
          <li><a href="construction.html#process">Design &amp; Build</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About Zurosh</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li><a href="tel:{PHONE.replace(' ', '')}">{PHONE}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Zurosh Enterprises. All rights reserved.</span>
      <span>{CITY}</span>
    </div>
  </div>
</footer>'''

def page(fname, title, desc, current, body, body_class='', three=False):
    scripts = ''
    if three:
        scripts += '<script src="assets/vendor/three.min.js"></script>\n<script src="assets/js/pixel-stage.js"></script>\n'
    scripts += '<script src="assets/js/main.js"></script>'
    cls = f' class="{body_class}"' if body_class else ''
    html = f'''{head(title, desc)}
<body{cls}>
{header(current)}
{body}
{FOOTER}
{scripts}
</body>
</html>
'''
    open(OUT + fname, 'w').write(html)
    print('wrote', fname)

def cta(title, text, sector=''):
    q = f'?sector={sector}' if sector else ''
    return f'''<section class="section">
  <div class="container">
    <div class="cta-band reveal">
      <div><h2>{title}</h2><p>{text}</p></div>
      <a class="btn btn-gold" href="contact.html{q}">Talk to our team <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>'''

# =========================================================================== HOME
home = f'''<canvas class="stage-canvas" data-stage="scroll" aria-hidden="true"></canvas>
<div class="stage-fallback" aria-hidden="true"><img src="assets/img/z-mark.svg" alt=""></div>

<ol class="progress-rail" aria-label="Page sections">
  <li><a href="#top"><span>Zurosh</span></a></li>
  <li><a href="#sectors"><span>Two sectors</span></a></li>
  <li><a href="#telecom"><span>Telecom</span></a></li>
  <li><a href="#tower-lifecycle"><span>Tower lifecycle</span></a></li>
  <li><a href="#construction"><span>Construction</span></a></li>
  <li><a href="#start"><span>Start a project</span></a></li>
</ol>

<main id="main">
  <section class="scene hero-scene" id="top" data-kf="z" data-side="center" data-rot="0">
    <h1 class="visually-hidden">Zurosh Enterprises — telecom infrastructure and construction in Pakistan</h1>
    <div class="scroll-cue" aria-hidden="true"><span class="mouse"></span>Scroll</div>
  </section>

  <section class="scene scene-tall" id="sectors" data-kf="globe" data-side="right" data-rot="1">
    <div class="container">
      <div class="panel reveal">
        <span class="eyebrow">Zurosh Enterprises</span>
        <h2>Two sectors.<br>One standard.</h2>
        <p class="lead">We build the networks that connect Pakistan and the buildings people live and work in. Two separate specialist divisions, each with its own teams — held to the same standard of delivery.</p>
        <div class="split-sectors">
          <a class="t" href="telecom.html"><small>Sector 01</small><strong>Telecom</strong>FTTH · 5G towers · Consultancy</a>
          <a class="c" href="construction.html"><small>Sector 02</small><strong>Construction</strong>Residential · Commercial plazas</a>
        </div>
      </div>
    </div>
  </section>

  <section class="scene scene-tall right" id="telecom" data-kf="tower" data-side="left" data-rot="1">
    <div class="container">
      <div class="panel dark reveal">
        <span class="eyebrow on-dark">Sector 01 · Telecom</span>
        <h2>Networks, end to end.</h2>
        <p class="lead">From fibre on the street to steel in the sky — we plan, build and commission the infrastructure operators depend on.</p>
        <ul class="tag-list">
          <li>FTTH deployment</li><li>5G tower infrastructure</li><li>Site acquisition</li><li>Telecom consultancy</li>
        </ul>
        <a class="btn btn-gold" href="telecom.html">Explore telecom <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall right" id="tower-lifecycle" data-kf="tower" data-side="left" data-rot="1.5">
    <div class="container">
      <div class="panel reveal">
        <span class="eyebrow">5G Tower Infrastructure</span>
        <h2>From site acquisition to handover.</h2>
        <p class="lead">One accountable partner across the full tower lifecycle.</p>
        <ol class="steps-mini">
          <li>Site hunting &amp; acquisition</li><li>Survey &amp; design</li>
          <li>Permits &amp; approvals</li><li>Civil works &amp; foundation</li>
          <li>Tower erection</li><li>Power &amp; installation</li>
          <li>Testing &amp; commissioning</li><li>Handover</li>
        </ol>
        <a class="btn btn-primary" href="telecom.html#lifecycle">See the lifecycle <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall" id="construction" data-kf="buildings" data-side="right" data-rot="2">
    <div class="container">
      <div class="panel reveal">
        <span class="eyebrow">Sector 02 · Construction</span>
        <h2>Spaces built to last.</h2>
        <p class="lead">Residential units and commercial plazas across Pakistan — delivered with the same engineering discipline as our networks.</p>
        <ul class="tag-list">
          <li>Residential units</li><li>Commercial plazas</li><li>Design &amp; build</li><li>Project management</li>
        </ul>
        <a class="btn btn-primary" href="construction.html">Explore construction <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall right" id="start" data-kf="z" data-side="left" data-rot="3" data-scale="0.85">
    <div class="container">
      <div class="panel reveal">
        <span class="eyebrow">Start a project</span>
        <h2>Let's build what's next.</h2>
        <p class="lead">Tell us about your network rollout, tower programme or building project.</p>
        <a class="btn btn-primary" href="contact.html">Get in touch <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</main>'''
page('index.html', 'Zurosh Enterprises | Telecom & Construction, Pakistan',
     'Zurosh Enterprises delivers FTTH networks, 5G tower infrastructure, telecom consultancy, and residential and commercial construction across Pakistan.',
     'home', home, 'home', three=True)

# =========================================================================== TELECOM
def card(icon, h, p):
    return f'<div class="card reveal"><div class="ico">{ICON[icon]}</div><h3>{h}</h3><p>{p}</p></div>'

telecom = f'''<main id="main" class="telecom-page">
  <section class="page-hero telecom track-hero" id="network">
    <div class="track-sticky">
    <div class="container">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Telecom</div>
        <span class="sector-badge">{ICON['tower'].replace('<svg', '<svg width="16" height="16"')} Sector 01 · Telecom</span>
        <h1>Telecom infrastructure, from fibre to 5G.</h1>
        <p class="lead">Zurosh designs, builds and commissions the networks Pakistan runs on — FTTH rollouts, turnkey 5G tower sites and the consultancy that keeps programmes on track.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">
          <a class="btn btn-gold" href="#towers">5G towers <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost on-dark" href="contact.html?sector=Telecom">Request a proposal</a>
        </div>
      </div>
      <div class="hero-canvas-wrap">
        <canvas data-stage="track" data-from="map" data-form="tower" data-track="#network" data-dark aria-hidden="true"></canvas>
        <img class="fallback" src="assets/img/z-mark.svg" alt="">
        <div class="stage-caption" aria-hidden="true">
          <span class="cap-a"><i></i>Fibre backbone across Pakistan</span>
          <span class="cap-b"><i></i>5G tower infrastructure</span>
        </div>
      </div>
    </div>
    <div class="track-hint" aria-hidden="true">Scroll to build</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <article class="service-block" id="ftth">
        <div><div class="num">01</div><h2>FTTH Networks</h2><p class="lead">Fibre-to-the-home for housing societies, apartment blocks, commercial areas and operators.</p></div>
        <div class="feature-grid">
          {card('map', 'Survey &amp; network design', 'Route surveys, GIS mapping and optimised GPON / XGS-PON architecture.')}
          {card('fiber', 'Civil &amp; cable works', 'Trenching, ducting, aerial and underground fibre laying with minimal disruption.')}
          {card('layers', 'Splicing &amp; termination', 'Fusion splicing, ODF / FDT / FAT installation and drop-cable connections.')}
          {card('shield', 'Testing &amp; documentation', 'OTDR and power-meter testing with complete as-built records.')}
        </div>
      </article>

      <article class="service-block" id="towers">
        <div><div class="num">02</div><h2>5G Tower Infrastructure</h2><p class="lead">Turnkey tower sites — one partner from the first site search to the final handover.</p></div>
        <div class="feature-grid">
          {card('map', 'Site acquisition', 'Site hunting, landlord negotiation, lease agreements and title verification.')}
          {card('doc', 'Permits &amp; approvals', 'NOCs and approvals from the relevant authorities, managed for you.')}
          {card('hardhat', 'Civil &amp; erection', 'Foundations, greenfield and rooftop towers, monopoles and shelters.')}
          {card('tower', 'Installation &amp; commissioning', 'Antennas, RRUs, microwave links, power systems, testing and integration.')}
        </div>
      </article>

      <article class="service-block" id="consultancy">
        <div><div class="num">03</div><h2>Telecom Consultancy</h2><p class="lead">Independent, practical advice for operators, tower companies, developers and investors.</p></div>
        <div class="feature-grid">
          {card('consult', 'Network planning', 'Coverage and capacity planning for 4G / 5G and fibre networks.')}
          {card('doc', 'Feasibility &amp; costing', 'Business cases, BOQs and rollout cost modelling.')}
          {card('shield', 'Regulatory advisory', 'Guidance on licensing and compliance in Pakistan’s telecom landscape.')}
          {card('clock', 'Project management', 'Programme governance, vendor management and quality audits.')}
        </div>
      </article>
    </div>
  </section>

  <section class="section navy" id="lifecycle">
    <div class="container two-col" style="align-items:start">
      <div class="section-head reveal sticky-head">
        <span class="eyebrow on-dark">Tower lifecycle</span>
        <h2>From site acquisition to handing over the tower.</h2>
        <p>Every step is run by one accountable team, so operators get a single point of contact and a single timeline — not a chain of subcontractors.</p>
        <a class="btn btn-gold" href="contact.html?sector=Telecom" style="margin-top:12px">Plan a rollout <span class="arrow" aria-hidden="true">→</span></a>
      </div>
      <ol class="timeline">
        <li class="reveal"><h3>Site hunting &amp; acquisition</h3><p>Candidate search against the operator’s search ring, landlord negotiation and lease signing.</p></li>
        <li class="reveal"><h3>Survey &amp; design</h3><p>Technical site surveys, soil testing, structural and electrical design.</p></li>
        <li class="reveal"><h3>Permits &amp; approvals</h3><p>NOCs and approvals from the relevant municipal and regulatory authorities.</p></li>
        <li class="reveal"><h3>Civil works &amp; foundation</h3><p>Excavation, foundations, boundary walls, shelters and access.</p></li>
        <li class="reveal"><h3>Tower erection</h3><p>Greenfield lattice towers, monopoles and rooftop structures erected to design.</p></li>
        <li class="reveal"><h3>Power &amp; installation</h3><p>Grid connection, generators, batteries and solar; antennas, RRUs and microwave links.</p></li>
        <li class="reveal"><h3>Testing &amp; commissioning</h3><p>Alignment, integration and acceptance testing with the operator.</p></li>
        <li class="reveal"><h3>Handover</h3><p>Site handed over with full documentation, as-built drawings and warranties.</p></li>
      </ol>
    </div>
  </section>

{cta('Planning a fibre or tower rollout?', 'Share your scope and timeline — we will come back with a plan.', 'Telecom')}
</main>'''
page('telecom.html', 'Telecom Services | Zurosh Enterprises',
     'FTTH networks, turnkey 5G tower infrastructure from site acquisition to handover, and telecom consultancy in Pakistan.',
     'telecom', telecom, three=True)

# =========================================================================== CONSTRUCTION
construction = f'''<main id="main" class="construction-page">
  <section class="page-hero construction track-hero" id="build">
    <div class="track-sticky">
    <div class="container">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Construction</div>
        <span class="sector-badge">{ICON['building'].replace('<svg', '<svg width="16" height="16"')} Sector 02 · Construction</span>
        <h1>Residential and commercial construction.</h1>
        <p class="lead">Homes, apartment blocks and commercial plazas built across Pakistan — planned carefully, built well and handed over on schedule.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">
          <a class="btn btn-primary" href="#residential">Our work <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost" href="contact.html?sector=Construction">Discuss a project</a>
        </div>
      </div>
      <div class="hero-canvas-wrap">
        <canvas data-stage="track" data-from="house" data-form="commercial" data-track="#build" data-rot0="-0.5" aria-hidden="true"></canvas>
        <img class="fallback" src="assets/img/z-mark.svg" alt="">
        <div class="stage-caption" aria-hidden="true">
          <span class="cap-a"><i></i>Residential units</span>
          <span class="cap-b"><i></i>Commercial plazas</span>
        </div>
      </div>
    </div>
    <div class="track-hint" aria-hidden="true">Scroll to build</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <article class="service-block" id="residential">
        <div><div class="num">01</div><h2>Residential Units</h2><p class="lead">Quality homes for families, investors and housing developers.</p></div>
        <div class="feature-grid">
          {card('home', 'Houses &amp; villas', 'Grey structure and turnkey finishing for individual homes and villas.')}
          {card('building', 'Apartment blocks', 'Low- and mid-rise apartments with efficient, durable layouts.')}
          {card('layers', 'Housing schemes', 'Multi-unit residential developments, including infrastructure.')}
          {card('hardhat', 'Renovation &amp; extension', 'Structural additions, remodelling and refurbishment.')}
        </div>
      </article>

      <article class="service-block" id="commercial">
        <div><div class="num">02</div><h2>Commercial Plazas</h2><p class="lead">Retail, office and mixed-use plazas designed for footfall and long-term value.</p></div>
        <div class="feature-grid">
          {card('plaza', 'Retail plazas', 'Shop-front plazas with ground-floor retail and upper-floor units.')}
          {card('building', 'Office buildings', 'Functional office space with modern services and utilities.')}
          {card('layers', 'Mixed-use developments', 'Commercial podiums combined with residential or office floors.')}
          {card('shield', 'MEP &amp; finishing', 'Electrical, plumbing, HVAC, façades and interior finishing.')}
        </div>
      </article>
    </div>
  </section>

  <section class="section alt" id="process">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Design &amp; build</span>
        <h2>How we deliver a building</h2>
        <p class="lead" style="margin-inline:auto">A clear, staged process with one team responsible from the first drawing to the keys.</p>
      </div>
      <div class="feature-grid">
        {card('doc', '1 · Plan &amp; design', 'Brief, architectural and structural design, BOQ and budget.')}
        {card('shield', '2 · Approvals', 'Building plan approvals from the relevant development authority.')}
        {card('hardhat', '3 · Construction', 'Structure, MEP and finishing, with on-site supervision and quality checks.')}
        {card('home', '4 · Handover', 'Snagging, final inspection and handover with documentation.')}
      </div>
    </div>
  </section>

{cta('Have a site or a plan in mind?', 'Tell us what you want to build and where.', 'Construction')}
</main>'''
page('construction.html', 'Construction | Zurosh Enterprises',
     'Residential units and commercial plazas built across Pakistan by Zurosh Enterprises — design, approvals, construction and handover.',
     'construction', construction, three=True)

# =========================================================================== ABOUT
about = f'''<main id="main">
  <section class="page-hero plain">
    <div class="container" style="grid-template-columns:1fr">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / About</div>
        <span class="eyebrow">About Zurosh</span>
        <h1>Connecting and building Pakistan.</h1>
        <p class="lead">Zurosh Enterprises works in two distinct sectors — telecom infrastructure and construction — each run by its own specialist team.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container two-col">
      <div class="stacked-logo-feature reveal">
        <img src="assets/img/zurosh-logo-stacked.svg" alt="Zurosh Enterprises" width="372" height="286">
      </div>
      <div class="reveal">
        <span class="eyebrow">Who we are</span>
        <h2>Two sectors, kept deliberately separate.</h2>
        <p>Telecom and construction need different skills, partners and regulations. So we keep them apart: our <strong>telecom division</strong> handles FTTH networks, 5G tower infrastructure and consultancy, and our <strong>construction division</strong> builds residential units and commercial plazas.</p>
        <p>What they share is the way we work: clear scopes, honest timelines, safe sites and documentation you can rely on.</p>
        <div class="split-sectors" style="margin-top:24px">
          <a class="t" href="telecom.html"><small>Sector 01</small><strong>Telecom</strong>FTTH · 5G towers · Consultancy</a>
          <a class="c" href="construction.html"><small>Sector 02</small><strong>Construction</strong>Residential · Commercial plazas</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">How we work</span><h2>What we stand for</h2></div>
      <div class="values">
        {card('shield', 'Safety first', 'Safe sites and safe work at height, on every tower and every building.')}
        {card('clock', 'On schedule', 'Realistic plans, tracked weekly, with no surprises at handover.')}
        {card('layers', 'One point of contact', 'One accountable team from first survey to final handover.')}
        {card('doc', 'Complete documentation', 'As-built drawings, test results and warranties as standard.')}
      </div>
    </div>
  </section>

{cta('Work with Zurosh', 'Whether it is a network or a building, let’s talk.')}
</main>'''
page('about.html', 'About | Zurosh Enterprises',
     'About Zurosh Enterprises — telecom infrastructure and construction in Pakistan.',
     'about', about)

# =========================================================================== CONTACT
contact = f'''<main id="main">
  <section class="page-hero plain">
    <div class="container" style="grid-template-columns:1fr">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Contact</div>
        <span class="eyebrow">Contact</span>
        <h1>Let’s talk about your project.</h1>
        <p class="lead">Choose your sector, tell us a little about the work, and the right team will get back to you.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container contact-grid">
      <div class="contact-info reveal">
        <div class="item"><span class="ico">{ICON['mail']}</span><div><small>Email</small><a href="mailto:{EMAIL}">{EMAIL}</a></div></div>
        <div class="item"><span class="ico">{ICON['phone']}</span><div><small>Phone</small><a href="tel:{PHONE.replace(' ', '')}">{PHONE}</a></div></div>
        <div class="item"><span class="ico">{ICON['map']}</span><div><small>Location</small><span style="font-weight:600;color:var(--navy)">{CITY}</span></div></div>
        <div class="stacked-logo-feature" style="margin-top:12px;padding:36px">
          <img src="assets/img/zurosh-logo-stacked.svg" alt="Zurosh Enterprises" width="372" height="286" style="width:200px">
        </div>
      </div>

      <form class="form reveal" id="enquiry-form" data-to="{EMAIL}" novalidate>
        <fieldset class="field">
          <legend>Which sector?</legend>
          <div class="sector-pick">
            <label><input type="radio" name="sector" value="Telecom" checked> Telecom</label>
            <label><input type="radio" name="sector" value="Construction"> Construction</label>
          </div>
        </fieldset>
        <div class="field"><label for="f-service">Service</label><select id="f-service" name="service" required></select></div>
        <div class="row">
          <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" required autocomplete="name"></div>
          <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
        </div>
        <div class="row">
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        </div>
        <div class="field"><label for="f-location">Project location (city)</label><input id="f-location" name="location"></div>
        <div class="field"><label for="f-message">Project details</label><textarea id="f-message" name="message" required></textarea></div>
        <button class="btn btn-primary" type="submit">Send enquiry <span class="arrow" aria-hidden="true">→</span></button>
        <p class="form-note">Submitting opens your email app with the details filled in.</p>
      </form>
    </div>
  </section>
</main>'''
page('contact.html', 'Contact | Zurosh Enterprises',
     'Contact Zurosh Enterprises about telecom infrastructure or construction projects in Pakistan.',
     'contact', contact)
