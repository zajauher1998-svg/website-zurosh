#!/usr/bin/env python3
"""Generates the static pages so header / mega menu / footer stay identical."""
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + os.sep

EMAIL = 'info@zurosh.com'
PHONE = '+92 323 2222062'          # shown as written; spaces are stripped for the tel: link
ADDRESS = 'Office-3, 2nd Floor, Galaxy Mall, Airport Road, Lahore'
MAP_URL = 'https://www.google.com/maps/search/?api=1&amp;query=Galaxy+Mall+Airport+Road+Lahore'

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
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script>try{{if(sessionStorage.getItem('zurosh-veil'))document.documentElement.classList.add('veil-in')}}catch(e){{}}</script>
</head>'''

def header(current):
    def cur(k): return ' aria-current="page"' if current == k else ''
    return f'''<a class="skip-link" href="#main">Skip to Content</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Zurosh Enterprises home page">
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
              <li><a class="sub" href="telecom.html#ftth"><strong>FTTH Networks</strong><span>Fiber-to-the-home design, deployment and splicing</span></a></li>
              <li><a class="sub" href="telecom.html#towers"><strong>5G Tower Infrastructure</strong><span>Site acquisition through to tower handover</span></a></li>
              <li><a class="sub" href="telecom.html#consultancy"><strong>Telecom Consultancy</strong><span>FTTH and long-haul network planning, design and as-built drawings</span></a></li>
              <li><a class="sub" href="telecom.html#feasibility"><strong>Business Feasibility Reports</strong><span>Customer needs, business model, costing and feasibility</span></a></li>
            </ul>
            <a class="sector-all" href="telecom.html">All Telecom Services <span aria-hidden="true">→</span></a>
          </div>
          <div class="sector sector-construction">
            <div class="sector-head">
              <span class="sector-icon">{ICON['building']}</span>
              <div><div class="sector-label">Sector 02</div><div class="sector-title">Construction</div></div>
            </div>
            <ul>
              <li><a class="sub" href="construction.html#residential"><strong>Residential Units</strong><span>Houses, villas and apartment buildings</span></a></li>
              <li><a class="sub" href="construction.html#commercial"><strong>Commercial Buildings</strong><span>Retail, office and mixed-use commercial buildings</span></a></li>
              <li><a class="sub" href="construction.html#renovation"><strong>Renovation &amp; Extension</strong><span>Extensions, remodelling and refurbishment</span></a></li>
              <li><a class="sub" href="construction.html#supervision"><strong>Construction Supervision</strong><span>Site supervision on the owner’s behalf</span></a></li>
            </ul>
            <a class="sector-all" href="construction.html">All Construction Services <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <a href="about.html"{cur('about')}>About</a>
      <a href="team.html"{cur('team')}>Our Team</a>
      <a href="contact.html"{cur('contact')}>Contact</a>
      <a class="btn btn-primary" href="contact.html">Start a Project</a>
    </nav>
  </div>
</header>'''

FOOTER = f'''<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="assets/img/zurosh-logo-stacked-white.svg" alt="Zurosh Enterprises" width="372" height="286" loading="lazy">
        <p>Telecommunications infrastructure and construction services across Pakistan.</p>
      </div>
      <div>
        <h4 class="t">Telecom</h4>
        <ul>
          <li><a href="telecom.html#ftth">FTTH Networks</a></li>
          <li><a href="telecom.html#towers">5G Tower Infrastructure</a></li>
          <li><a href="telecom.html#lifecycle">Site Acquisition to Handover</a></li>
          <li><a href="telecom.html#consultancy">Telecom Consultancy</a></li>
          <li><a href="telecom.html#feasibility">Business Feasibility Reports</a></li>
        </ul>
      </div>
      <div>
        <h4 class="c">Construction</h4>
        <ul>
          <li><a href="construction.html#residential">Residential Units</a></li>
          <li><a href="construction.html#commercial">Commercial Buildings</a></li>
          <li><a href="construction.html#renovation">Renovation &amp; Extension</a></li>
          <li><a href="construction.html#supervision">Construction Supervision</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About Zurosh</a></li>
          <li><a href="team.html">Our Team</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li><a href="tel:{PHONE.replace(' ', '')}">{PHONE}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Zurosh Enterprises. All rights reserved.</span>
      <span>{ADDRESS}</span>
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
      <a class="btn btn-gold" href="contact.html{q}">Contact Our Team <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>'''

# =========================================================================== HOME
home = f'''<div class="zone-bg" aria-hidden="true"><div class="zone zone-telecom"></div><div class="zone zone-construction"></div></div>
<canvas class="stage-canvas" data-stage="scroll" aria-hidden="true"></canvas>
<div class="stage-fallback" aria-hidden="true"><img src="assets/img/z-mark.svg" alt=""></div>

<ol class="progress-rail" aria-label="Page sections">
  <li><a href="#top"><span>Zurosh</span></a></li>
  <li><a href="#sectors"><span>Two Sectors</span></a></li>
  <li><a href="#telecom"><span>Telecom</span></a></li>
  <li><a href="#tower-lifecycle"><span>Tower Lifecycle</span></a></li>
  <li><a href="#construction"><span>Residential</span></a></li>
  <li><a href="#commercial"><span>Commercial</span></a></li>
  <li><a href="#start"><span>Start a Project</span></a></li>
</ol>

<main id="main">
  <section class="scene hero-scene" id="top" data-zone="neutral" data-kf="z" data-side="center" data-rot="0">
    <h1 class="visually-hidden">Zurosh Enterprises: Telecommunications Infrastructure and Construction in Pakistan</h1>
  </section>

  <section class="scene scene-tall" id="sectors" data-zone="neutral" data-kf="globe" data-side="right" data-rot="1">
    <div class="container">
      <div class="panel reveal">
        <span class="eyebrow">Zurosh Enterprises</span>
        <h2>Two Sectors.<br>One Standard.</h2>
        <p class="lead">Zurosh Enterprises operates through two dedicated divisions. Our Telecom division delivers fiber networks and tower infrastructure for operators, and our Construction division develops residential and commercial properties. Each division is led by its own specialist team and works to common standards of quality, safety and accountability.</p>
        <div class="split-sectors">
          <a class="t" href="telecom.html"><small>Sector 01</small><strong>Telecom</strong>FTTH · 5G Towers · Consultancy</a>
          <a class="c" href="construction.html"><small>Sector 02</small><strong>Construction</strong>Residential · Commercial · Renovation · Supervision</a>
        </div>
      </div>
    </div>
  </section>

  <section class="scene scene-tall right" id="telecom" data-zone="telecom" data-kf="map" data-side="left" data-rot="1" data-scale="0.72">
    <div class="container">
      <div class="panel dark tel reveal">
        <span class="hud" aria-hidden="true"></span>
        <div class="panel-meta"><span class="eyebrow on-dark">Sector 01 · Telecom</span><span class="signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>
        <h2>Fiber Across Pakistan</h2>
        <p class="spec">FTTH · GPON / XGS-PON · OTDR Tested</p>
        <p class="lead">We plan, deploy and commission fiber optic networks and telecom infrastructure for operators and developers in every province of Pakistan.</p>
        <ul class="tag-list">
          <li>FTTH Deployment</li><li>5G Tower Infrastructure</li><li>Site Acquisition</li><li>Telecom Consultancy</li><li>Feasibility Reports</li>
        </ul>
        <a class="btn btn-gold" href="telecom.html">Explore Telecom <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall right" id="tower-lifecycle" data-zone="telecom" data-kf="tower" data-side="left" data-rot="2" data-scale="0.8" data-y="-0.045">
    <div class="container">
      <div class="panel tel reveal">
        <span class="hud" aria-hidden="true"></span>
        <div class="panel-meta"><span class="eyebrow">Sector 01 · Telecom</span><span class="signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>
        <h2>5G Tower Infrastructure</h2>
        <p class="tagline">From Site Acquisition to Handover</p>
        <p class="spec">4G / 5G · Greenfield · Rooftop · Monopole</p>
        <p class="lead">A single point of accountability at every stage of the tower lifecycle.</p>
        <ol class="steps-mini">
          <li>Site Hunting &amp; Acquisition</li><li>Survey &amp; Design</li>
          <li>NOC &amp; Approval Facilitation</li><li>Civil Works &amp; Foundation</li>
          <li>Tower Erection</li><li>Power &amp; Installation</li>
          <li>Testing &amp; Commissioning</li><li>Handover</li>
        </ol>
        <a class="btn btn-primary" href="telecom.html#lifecycle">View the Lifecycle <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall" id="construction" data-zone="construction" data-kf="house" data-side="right" data-rot="2.92">
    <div class="container">
      <div class="panel con reveal">
        <span class="ruler" aria-hidden="true"></span>
        <span class="title-block" aria-hidden="true"><b>Sheet A-101</b><span>Residential · 1:100</span></span>
        <span class="eyebrow">Sector 02 · Construction</span>
        <h2>Residential Construction</h2>
        <p class="lead">We construct houses, villas and apartment buildings to approved designs, with full site supervision from foundation to finishing.</p>
        <ul class="tag-list">
          <li>Houses &amp; Villas</li><li>Apartment Buildings</li><li>Renovation &amp; Extension</li><li>Construction Supervision</li>
        </ul>
        <a class="btn btn-primary" href="construction.html#residential">Residential Units <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall" id="commercial" data-zone="construction" data-kf="commercial" data-side="right" data-rot="2.92" data-scale="0.86" data-y="0.045">
    <div class="container">
      <div class="panel con reveal">
        <span class="ruler" aria-hidden="true"></span>
        <span class="title-block" aria-hidden="true"><b>Sheet A-201</b><span>Commercial · 1:100</span></span>
        <span class="eyebrow">Sector 02 · Construction</span>
        <h2>Commercial Buildings</h2>
        <p class="lead">We develop retail, office and mixed-use commercial buildings, managing design, regulatory approvals, construction and handover.</p>
        <ul class="tag-list">
          <li>Retail Buildings</li><li>Office Buildings</li><li>Mixed-Use</li><li>Design &amp; Build</li>
        </ul>
        <a class="btn btn-primary" href="construction.html#commercial">Explore Construction <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <section class="scene scene-tall right" id="start" data-zone="neutral" data-kf="z" data-side="left" data-rot="5" data-scale="0.85">
    <div class="container">
      <div class="panel reveal">
        <span class="eyebrow">Get in Touch</span>
        <h2>Start Your Project</h2>
        <p class="lead">Contact us to discuss a fiber rollout, tower programme or construction project.</p>
        <a class="btn btn-primary" href="contact.html">Contact Us <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</main>'''
page('index.html', 'Zurosh Enterprises | Telecom & Construction, Pakistan',
     'Zurosh Enterprises provides FTTH networks, 5G tower infrastructure, telecom consultancy, and residential and commercial construction across Pakistan.',
     'home', home, 'home', three=True)

# =========================================================================== TELECOM
def card(icon, h, p):
    return f'<div class="card reveal"><div class="ico">{ICON[icon]}</div><h3>{h}</h3><p>{p}</p></div>'

telecom = f'''<main id="main" class="telecom-page">
  <section class="page-hero telecom" id="network">
    <div class="container">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Telecom</div>
        <span class="sector-badge">{ICON['tower'].replace('<svg', '<svg width="16" height="16"')} Sector 01 · Telecom</span>
        <h1>Telecom Infrastructure from Fiber to 5G</h1>
        <p class="lead">Zurosh Enterprises designs, builds and commissions telecommunications infrastructure in Pakistan, including FTTH networks, turnkey 5G tower sites and specialist consultancy.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">
          <a class="btn btn-gold" href="#towers">5G Towers <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost on-dark" href="contact.html?sector=Telecom">Request a Proposal</a>
        </div>
      </div>
      <div class="hero-canvas-wrap">
        <canvas data-stage="cycle" data-from="map" data-form="tower" data-dark aria-hidden="true"></canvas>
        <img class="fallback" src="assets/img/z-mark.svg" alt="">
        <div class="stage-caption" aria-hidden="true">
          <span class="cap-a"><i></i>Fiber Backbone Across Pakistan</span>
          <span class="cap-b"><i></i>5G Tower Infrastructure</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <article class="service-block" id="ftth">
        <div><div class="num">01</div><h2>FTTH Networks</h2><p class="lead">Fiber-to-the-home networks for housing societies, apartment buildings, commercial areas and service providers.</p></div>
        <div class="feature-grid">
          {card('map', 'Survey &amp; Network Design', 'Route surveys, GIS mapping and GPON / XGS-PON network design.')}
          {card('fiber', 'Civil &amp; Cable Works', 'Trenching, ducting, and aerial or underground fiber installation.')}
          {card('layers', 'Splicing &amp; Termination', 'Fusion splicing, ODF, FDT and FAT installation, and drop cable connections.')}
          {card('shield', 'Testing &amp; Documentation', 'OTDR and optical power testing, with complete as-built records.')}
        </div>
      </article>

      <article class="service-block" id="towers">
        <div><div class="num">02</div><h2>5G Tower Infrastructure</h2><p class="lead">Turnkey tower sites delivered under a single contract, from site search to final handover.</p></div>
        <div class="feature-grid">
          {card('map', 'Site Acquisition', 'Site hunting, landlord negotiation, lease agreements and title verification.')}
          {card('doc', 'NOC &amp; Approval Facilitation', 'Support for clients in obtaining NOCs and statutory approvals, including documentation and liaison with the relevant authorities.')}
          {card('hardhat', 'Civil Works &amp; Erection', 'Foundations, greenfield and rooftop towers, monopoles and equipment shelters.')}
          {card('tower', 'Installation &amp; Commissioning', 'Antennas, RRUs, microwave links, power systems, testing and integration.')}
        </div>
      </article>

    </div>
  </section>

  <section class="section navy" id="lifecycle">
    <div class="container two-col" style="align-items:start">
      <div class="section-head reveal sticky-head">
        <span class="eyebrow on-dark">Tower Lifecycle</span>
        <h2>From Site Acquisition to Tower Handover</h2>
        <p>Each stage is managed by a single project team, giving operators one point of contact and one consolidated schedule.</p>
        <a class="btn btn-gold" href="contact.html?sector=Telecom" style="margin-top:12px">Plan a Rollout <span class="arrow" aria-hidden="true">→</span></a>
      </div>
      <ol class="timeline">
        <li class="reveal"><h3>Site Hunting &amp; Acquisition</h3><p>Identification of candidate sites within the operator’s search ring, landlord negotiation and lease execution.</p></li>
        <li class="reveal"><h3>Survey &amp; Design</h3><p>Technical site surveys, soil investigation, and structural and electrical design.</p></li>
        <li class="reveal"><h3>NOC &amp; Approval Facilitation</h3><p>Support for the client in obtaining NOCs and approvals from municipal and regulatory authorities, from preparing documentation to following up on applications.</p></li>
        <li class="reveal"><h3>Civil Works &amp; Foundation</h3><p>Excavation, foundations, boundary walls, equipment shelters and site access.</p></li>
        <li class="reveal"><h3>Tower Erection</h3><p>Erection of greenfield lattice towers, monopoles and rooftop structures to approved designs.</p></li>
        <li class="reveal"><h3>Power &amp; Installation</h3><p>Grid connection, generators, batteries and solar systems, followed by installation of antennas, RRUs and microwave links.</p></li>
        <li class="reveal"><h3>Testing &amp; Commissioning</h3><p>Alignment, integration and acceptance testing with the operator.</p></li>
        <li class="reveal"><h3>Handover</h3><p>Formal site handover with complete documentation, as-built drawings and warranties.</p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <article class="service-block" id="consultancy">
        <div><div class="num">03</div><h2>Telecom Consultancy</h2><p class="lead">Technical and commercial advisory services for operators, ISPs, tower companies, developers and investors, from network planning through design, documentation and delivery oversight.</p></div>
        <div class="consult-body">
          <div class="scope-grid reveal">
            <div class="scope">
              <h3>Network Planning &amp; Design</h3>
              <ul class="check-list">
                <li><strong>FTTH networks:</strong> GPON / XGS-PON architecture, splitter ratios and OLT, FDH and FAT placement for housing societies, high-rises and commercial areas</li>
                <li><strong>Long-haul and backbone:</strong> intercity fiber routes, ring topologies for redundancy, and duct, aerial or direct-buried route design</li>
                <li><strong>Metro and access networks:</strong> city rings, fiber-to-the-building and enterprise links</li>
                <li><strong>Wireless networks:</strong> 4G / 5G coverage and capacity planning, site nominations and microwave backhaul</li>
              </ul>
            </div>
            <div class="scope">
              <h3>Engineering Documentation</h3>
              <ul class="check-list">
                <li><strong>Route surveys and GIS mapping</strong> of planned and existing networks</li>
                <li><strong>Detailed design drawings:</strong> route plans, splicing diagrams and fiber allocation schedules</li>
                <li><strong>As-built drawings</strong> and network records after construction</li>
                <li><strong>Optical link budgets,</strong> bills of quantities and technical specifications</li>
              </ul>
            </div>
          </div>
          <div class="feature-grid">
            {card('shield', 'Regulatory Advisory', 'Guidance on telecom licensing and compliance requirements in Pakistan.')}
            {card('clock', 'Project Management', 'Programme governance, vendor management and progress reporting.')}
            {card('layers', 'Quality Audits', 'Independent inspection of installed networks and acceptance test results.')}
            {card('consult', 'Vendor &amp; Tender Support', 'Technical specifications, bid evaluation and equipment selection.')}
          </div>
        </div>
      </article>

      <article class="service-block" id="feasibility">
        <div><div class="num">04</div><h2>Business Feasibility Reports</h2><p class="lead">Feasibility studies for telecom projects, prepared for operators, investors, developers and lenders to support investment and rollout decisions.</p>
          <a class="btn btn-primary" href="contact.html?sector=Telecom" style="margin-top:8px">Request a Feasibility Report <span class="arrow" aria-hidden="true">→</span></a></div>
        <div class="report-scope reveal">
          <h3>What Each Report Covers</h3>
          <ol class="report-list">
            <li><strong>Customer Needs Assessment</strong><span>Demand analysis, target customers, service requirements and market size in the proposed coverage area.</span></li>
            <li><strong>Business Model</strong><span>Service offering, pricing, revenue streams and go-to-market approach.</span></li>
            <li><strong>Costing</strong><span>Capital expenditure on network, towers and equipment, and operating expenditure estimates.</span></li>
            <li><strong>Financial Feasibility</strong><span>Revenue projections, cash flow, payback period, NPV and IRR.</span></li>
            <li><strong>Technical Feasibility</strong><span>Network design options, coverage and capacity requirements, and technology selection.</span></li>
            <li><strong>Risk &amp; Regulatory Review</strong><span>Licensing requirements, regulatory approvals and key project risks.</span></li>
          </ol>
        </div>
      </article>
    </div>
  </section>


{cta('Planning a Fiber or Tower Rollout?', 'Send us your scope and timeline, and our team will prepare a proposal.', 'Telecom')}
</main>'''
page('telecom.html', 'Telecom Services | Zurosh Enterprises',
     'FTTH networks, turnkey 5G tower infrastructure from site acquisition to handover, telecom consultancy and business feasibility reports in Pakistan.',
     'telecom', telecom, three=True)

# =========================================================================== CONSTRUCTION
construction = f'''<main id="main" class="construction-page">
  <section class="page-hero construction" id="build">
    <div class="container">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Construction</div>
        <span class="sector-badge">{ICON['building'].replace('<svg', '<svg width="16" height="16"')} Sector 02 · Construction</span>
        <h1>Residential and Commercial Construction</h1>
        <p class="lead">Zurosh Enterprises constructs residential units and commercial buildings, carries out renovation and extension works, and provides construction supervision across Pakistan.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px">
          <a class="btn btn-primary" href="#residential">Our Services <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost" href="contact.html?sector=Construction">Discuss a Project</a>
        </div>
      </div>
      <div class="hero-canvas-wrap">
        <canvas data-stage="cycle" data-from="house" data-form="commercial" data-rot0="-0.5" aria-hidden="true"></canvas>
        <img class="fallback" src="assets/img/z-mark.svg" alt="">
        <div class="stage-caption" aria-hidden="true">
          <span class="cap-a"><i></i>Residential Units</span>
          <span class="cap-b"><i></i>Commercial Buildings</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <article class="service-block" id="residential">
        <div><div class="num">01</div><h2>Residential Units</h2><p class="lead">Residential construction for families and investors.</p></div>
        <div class="feature-grid">
          {card('home', 'Houses &amp; Villas', 'Construction of individual houses and villas to approved designs.')}
          {card('building', 'Apartment Buildings', 'Low-rise and mid-rise apartment buildings with efficient, durable layouts.')}
          {card('layers', 'Grey Structure', 'Foundations, frame, masonry and roofing, ready for the client’s own finishing works.')}
          {card('shield', 'Turnkey Construction', 'Complete construction from foundation to final finishes, ready for occupation.')}
        </div>
      </article>

      <article class="service-block" id="commercial">
        <div><div class="num">02</div><h2>Commercial Buildings</h2><p class="lead">Retail, office and mixed-use commercial buildings planned for financial viability and long-term value.</p></div>
        <div class="feature-grid">
          {card('plaza', 'Retail Buildings', 'Commercial buildings with ground-floor retail and upper-floor units.')}
          {card('building', 'Office Buildings', 'Office space with modern building services and utilities.')}
          {card('layers', 'Mixed-Use Developments', 'Commercial podiums combined with residential or office floors.')}
          {card('shield', 'MEP &amp; Finishing', 'Electrical, plumbing, HVAC, façades and interior finishing.')}
        </div>
      </article>

      <article class="service-block" id="renovation">
        <div><div class="num">03</div><h2>Renovation &amp; Extension</h2><p class="lead">Renovation, extension and refurbishment of existing residential and commercial buildings.</p></div>
        <div class="feature-grid">
          {card('building', 'Extensions &amp; Additional Floors', 'Structural extensions and additional storeys, designed and approved by the relevant authority.')}
          {card('hardhat', 'Renovation &amp; Remodelling', 'Layout changes, upgrades and remodelling of existing spaces.')}
          {card('layers', 'Structural Repairs', 'Strengthening and repair of foundations, columns, beams and slabs.')}
          {card('home', 'Refurbishment &amp; Finishing', 'New finishes, MEP upgrades and interior refurbishment.')}
        </div>
      </article>

      <article class="service-block" id="supervision">
        <div><div class="num">04</div><h2>Construction Supervision</h2><p class="lead">For owners who are unable to supervise their own project, our engineers oversee the construction on your behalf at affordable rates, so you do not have to manage the site yourself.</p>
          <ul class="check-list benefit-list">
            <li>Workmanship inspected against approved drawings</li>
            <li>Material usage tracked to prevent wastage</li>
            <li>Contractor coordination, scheduling and site issues handled</li>
          </ul>
          <a class="btn btn-primary" href="contact.html?sector=Construction" style="margin-top:8px">Request Supervision <span class="arrow" aria-hidden="true">→</span></a></div>
        <div class="feature-grid">
          {card('shield', 'Quality Assurance', 'Workmanship is inspected at every key stage against approved drawings and specifications, so quality is never compromised.')}
          {card('layers', 'Material Monitoring', 'Delivery, quality and consumption of materials are checked and recorded to prevent wastage and misuse.')}
          {card('hardhat', 'Complete Site Management', 'Coordination with your contractor, resolution of site issues, and schedule control from start to handover.')}
          {card('doc', 'Progress Reports', 'Regular written reports with photographs, so you always know where the project stands.')}
        </div>
      </article>
    </div>
  </section>

  <section class="section alt" id="process">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Design &amp; Build</span>
        <h2>Our Delivery Process</h2>
        <p class="lead" style="margin-inline:auto">A structured four-stage process, managed by a single project team from initial design to handover.</p>
      </div>
      <div class="feature-grid">
        {card('doc', '1 · Planning &amp; Design', 'Client brief, architectural and structural design, bill of quantities and budget.')}
        {card('shield', '2 · Approvals', 'Building plan approval from the relevant development authority.')}
        {card('hardhat', '3 · Construction', 'Structural, MEP and finishing works under continuous site supervision and quality control.')}
        {card('home', '4 · Handover', 'Snagging, final inspection and handover with complete documentation.')}
      </div>
    </div>
  </section>

{cta('Planning a Construction Project?', 'Share your site details and requirements, and our team will be in touch.', 'Construction')}
</main>'''
page('construction.html', 'Construction | Zurosh Enterprises',
     'Residential units, commercial buildings, renovation and extension works, and construction supervision across Pakistan by Zurosh Enterprises.',
     'construction', construction, three=True)

# =========================================================================== ABOUT
about = f'''<main id="main">
  <section class="page-hero plain">
    <div class="container" style="grid-template-columns:1fr">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / About</div>
        <span class="eyebrow">About Us</span>
        <h1>Connecting and Building Pakistan</h1>
        <p class="lead">Zurosh Enterprises is a Pakistani company working in telecommunications infrastructure and construction, with a dedicated team for each sector.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container two-col">
      <div class="stacked-logo-feature reveal">
        <img src="assets/img/zurosh-logo-stacked.svg" alt="Zurosh Enterprises" width="372" height="286">
      </div>
      <div class="reveal">
        <span class="eyebrow">Who We Are</span>
        <h2>Two Sectors, Managed Independently</h2>
        <p>Telecommunications and construction require different expertise, partners and regulatory approvals, so each sector is run as a separate division. Our <strong>Telecom division</strong> delivers FTTH networks, 5G tower infrastructure, consultancy services and business feasibility reports. Our <strong>Construction division</strong> builds residential units and commercial buildings, carries out renovation and extension works, and provides construction supervision for owners.</p>
        <p>Both divisions follow the same principles: clearly defined scope, realistic schedules, safe working practices and complete project documentation.</p>
        <div class="split-sectors" style="margin-top:24px">
          <a class="t" href="telecom.html"><small>Sector 01</small><strong>Telecom</strong>FTTH · 5G Towers · Consultancy</a>
          <a class="c" href="construction.html"><small>Sector 02</small><strong>Construction</strong>Residential · Commercial · Renovation · Supervision</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Our Principles</span><h2>What We Stand For</h2></div>
      <div class="values">
        {card('shield', 'Safety', 'Safe working practices on every site, including all work at height.')}
        {card('clock', 'Schedule Discipline', 'Realistic programmes, monitored weekly and reported transparently.')}
        {card('layers', 'Single Point of Contact', 'One project team accountable from the first survey to final handover.')}
        {card('doc', 'Complete Documentation', 'As-built drawings, test results and warranties provided as standard.')}
      </div>
    </div>
  </section>

{cta('Work with Zurosh Enterprises', 'Contact us to discuss your telecom or construction requirements.')}
</main>'''
page('about.html', 'About | Zurosh Enterprises',
     'About Zurosh Enterprises, a telecommunications infrastructure and construction company in Pakistan.',
     'about', about)

# =========================================================================== TEAM
# Edit the team here. Each entry: (name, role, short description, photo path or '').
# Photos go in assets/img/team/ (square, at least 600 x 600 px). Without a photo,
# the card shows the person's initials.
TEAM = {
    'leadership': [
        ('Zulfiqar Ali', 'Chief Executive Officer', 'Leads Zurosh Enterprises across its Telecom and Construction divisions.', 'assets/img/team/zulfiqar-ali.jpg'),
    ],
    # Add division team members here when ready; empty sections are hidden.
    'telecom': [],
    'construction': [],
}

def initials(name):
    parts = [w for w in name.split() if w[:1].isalpha()]
    return (parts[0][0] + (parts[-1][0] if len(parts) > 1 else '')).upper() if parts else 'Z'

def member(m, lead=False):
    name, role, bio, photo = m
    pic = (f'<img src="{photo}" alt="{name}" loading="lazy">' if photo
           else f'<span class="monogram" aria-hidden="true">{initials(name)}</span>')
    bio_html = f'<p>{bio}</p>' if bio else ''
    return (f'<article class="member reveal{" lead" if lead else ""}"><div class="member-photo">{pic}</div>'
            f'<div class="member-body"><h3>{name}</h3><div class="member-role">{role}</div>{bio_html}</div></article>')

def team_grid(key, lead=False):
    return '\n          '.join(member(m, lead) for m in TEAM[key])

def division(key, tag, title, text, cls):
    if not TEAM[key]:
        return ''
    return f'''      <div class="team-division">
        <div class="division-head {cls} reveal">
          <span class="division-tag">{tag}</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div class="team-grid">
          {team_grid(key)}
        </div>
      </div>'''

DIVISIONS = division('telecom', 'Sector 01', 'Telecom Division', 'FTTH networks, 5G tower infrastructure, consultancy and business feasibility reports.', 'telecom-head') + \
            division('construction', 'Sector 02', 'Construction Division', 'Residential units, commercial buildings, and renovation and extension works.', 'construction-head')
DIVISION_SECTION = f'''  <section class="section alt">
    <div class="container">
{DIVISIONS}
    </div>
  </section>
''' if DIVISIONS else ''

team = f'''<main id="main">
  <section class="page-hero plain">
    <div class="container" style="grid-template-columns:1fr">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Our Team</div>
        <span class="eyebrow">Our Team</span>
        <h1>The People Behind Zurosh</h1>
        <p class="lead">Zurosh Enterprises is led by a leadership team with experience across telecommunications and construction.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal"><span class="eyebrow">Leadership</span><h2>Management</h2></div>
      <div class="team-grid lead-grid">
          {team_grid('leadership', True)}
      </div>
    </div>
  </section>

{DIVISION_SECTION}
{cta('Join Our Team', 'We are always interested in hearing from experienced engineers and project professionals. Send your CV to ' + EMAIL + '.')}
</main>'''
page('team.html', 'Our Team | Zurosh Enterprises',
     'Meet the leadership and specialist teams of Zurosh Enterprises across the Telecom and Construction divisions.',
     'team', team)

# =========================================================================== CONTACT
contact = f'''<main id="main">
  <section class="page-hero plain">
    <div class="container" style="grid-template-columns:1fr">
      <div class="hero-copy">
        <div class="breadcrumb"><a href="index.html">Home</a> / Contact</div>
        <span class="eyebrow">Contact</span>
        <h1>Discuss Your Project</h1>
        <p class="lead">Select the relevant sector and share a few details about your project. The appropriate team will respond to your enquiry.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container contact-grid">
      <div class="contact-info reveal">
        <div class="item"><span class="ico">{ICON['mail']}</span><div><small>Email</small><a href="mailto:{EMAIL}">{EMAIL}</a></div></div>
        <div class="item"><span class="ico">{ICON['phone']}</span><div><small>Phone</small><a href="tel:{PHONE.replace(' ', '')}">{PHONE}</a></div></div>
        <div class="item"><span class="ico">{ICON['map']}</span><div><small>Office</small><a href="{MAP_URL}" target="_blank" rel="noopener">Office-3, 2nd Floor, Galaxy Mall,<br>Airport Road, Lahore</a></div></div>
        <div class="stacked-logo-feature" style="margin-top:12px;padding:36px">
          <img src="assets/img/zurosh-logo-stacked.svg" alt="Zurosh Enterprises" width="372" height="286" style="width:200px">
        </div>
      </div>

      <form class="form reveal" id="enquiry-form" data-to="{EMAIL}" novalidate>
        <fieldset class="field">
          <legend>Sector</legend>
          <div class="sector-pick">
            <label><input type="radio" name="sector" value="Telecom" checked> Telecom</label>
            <label><input type="radio" name="sector" value="Construction"> Construction</label>
          </div>
        </fieldset>
        <div class="field"><label for="f-service">Service</label><select id="f-service" name="service" required></select></div>
        <div class="row">
          <div class="field"><label for="f-name">Full Name</label><input id="f-name" name="name" required autocomplete="name"></div>
          <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
        </div>
        <div class="row">
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        </div>
        <div class="field"><label for="f-location">Project Location (City)</label><input id="f-location" name="location"></div>
        <div class="field"><label for="f-message">Project Details</label><textarea id="f-message" name="message" required></textarea></div>
        <button class="btn btn-primary" type="submit">Send Enquiry <span class="arrow" aria-hidden="true">→</span></button>
        <p class="form-note">Submitting this form opens your email application with your details included.</p>
      </form>
    </div>
  </section>
</main>'''
page('contact.html', 'Contact | Zurosh Enterprises',
     'Contact Zurosh Enterprises about telecom infrastructure or construction projects in Pakistan.',
     'contact', contact)
