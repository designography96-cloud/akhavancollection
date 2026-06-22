/* ============================================================
   AKHAVAN COLLECTION — Visual Feedback Tool  v2
   Press F → pick mode → hover to highlight → click to select
   → panel opens with section pre-filled → copy Claude prompt
   ============================================================ */

(function () {
  'use strict';

  /* ── Section selector map (most-specific first) ──────────── */
  const SELECTORS = [
    /* Navbar elements */
    { s: '.nav-reserve',                   label: 'Navbar — Reserve a Visit Button (orange CTA)' },
    { s: '.hamburger',                     label: 'Navbar — Hamburger Button (left)' },
    { s: '.header__logo',                  label: 'Navbar — Logo (centered)' },
    { s: '.lang-toggle',                   label: 'Navbar — DE / EN Language Toggle' },
    { s: '.mode-wrap',                     label: 'Navbar — Day / Night Mode Toggle' },
    { s: '.header',                        label: 'Navbar (overall)' },
    /* Panels */
    { s: '.menu-panel',                    label: 'Side Menu Panel (hamburger slide-out)' },
    { s: '.reserve-panel',                 label: 'Reserve a Visit Panel (Calendly slider)' },
    /* Home */
    { s: '.hero__content',                 label: 'Hero — Tagline & CTA Button' },
    { s: '.hero',                          label: 'Hero Image' },
    { s: '.home-grid',                     label: 'Home Grid (Interior Photos)' },
    { s: '.home-exhb',                     label: 'Exhibitions Preview Cards' },
    { s: '.about-teaser',                  label: 'About Teaser Section' },
    /* Collection */
    { s: '.collection-item',               label: 'Artwork Item Card (Collection)' },
    { s: '.collection-grid',               label: 'Collection Grid (Masonry)' },
    /* Exhibitions */
    { s: '.exhb-cover',                    label: 'Exhibitions — Cover Banner "On View Now"' },
    { s: '.exhb-row--rev',                 label: 'Exhibition II Row — Between the Spaces' },
    { s: '.exhb-row',                      label: 'Exhibition I Row — Fragments of Silence' },
    /* Exhibition detail */
    { s: '.exhb-detail-hd',               label: 'Exhibition Detail — Header (Title / Artist / Dates)' },
    /* Location */
    { s: '.location-map-box',              label: 'Location — Map Embed' },
    { s: '.location-info__hours',          label: 'Location — Opening Hours' },
    { s: '.location-info',                 label: 'Location — Address & Get Directions' },
    { s: '.location-photo',                label: 'Location — Venue Photo' },
    { s: '.location-photos',               label: 'Location — Venue Photos Strip' },
    { s: '.venue-rental',                  label: 'Location — Venue Rental Form' },
    /* About */
    { s: '.about-cover',                   label: 'About — Cover Image' },
    { s: '.about-body__heading',           label: 'About — Our Story Heading' },
    { s: '.about-body',                    label: 'About — Story Body Text' },
    /* Page title */
    { s: '.page-title',                    label: 'Page Title Header' },
    /* Footer */
    { s: '.footer__cta',                   label: 'Footer — Reserve a Visit CTA Button' },
    { s: '.footer__brand-logo',            label: 'Footer — Logo' },
    { s: '.footer__address',               label: 'Footer — Address' },
    { s: '.footer__top > div:first-child', label: 'Footer — Logo & Address Block' },
    { s: '.footer__links',                 label: 'Footer — Navigation Links' },
    { s: '.footer__col-title',             label: 'Footer — Column Title' },
    { s: '.footer__bottom',                label: 'Footer — Bottom Bar (copyright)' },
    { s: '.footer',                        label: 'Footer (overall)' },
  ];

  /* ── Page meta ────────────────────────────────────────────── */
  const PAGE_META = {
    'index.html':            'Home',
    'collection.html':       'Collection',
    'exhibitions.html':      'Exhibitions',
    'exhibition-detail.html':'Exhibition Detail',
    'location.html':         'Location',
    'about.html':            'About',
    'privacy.html':          'Privacy Policy',
    'imprint.html':          'Imprint',
  };
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  const pageName = PAGE_META[filename] || filename;

  /* ── Styles ───────────────────────────────────────────────── */
  const css = document.createElement('style');
  css.textContent = `
    /* ---- Badge ---- */
    #akfb-badge {
      position: fixed; bottom: 28px; left: 28px;
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(5,2,0,.72);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(244,244,244,.18);
      color: rgba(244,244,244,.65);
      font-family: 'TT Corals', Georgia, serif;
      font-size: 14px; font-weight: 500;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 8500;
      transition: transform .2s, border-color .2s, color .2s, background .2s;
      box-shadow: 0 2px 12px rgba(0,0,0,.35);
    }
    #akfb-badge:hover { color: #f4f4f4; border-color: rgba(244,244,244,.35); transform: scale(1.08); }
    #akfb-badge.picking { background: #fe751f; border-color: #fe751f; color: #fff; transform: scale(1.12); box-shadow: 0 4px 18px rgba(254,117,31,.45); }
    body.light #akfb-badge { background: rgba(244,244,244,.86); border-color: rgba(5,2,0,.14); color: rgba(5,2,0,.55); }
    body.light #akfb-badge.picking { background: #fe751f; border-color: #fe751f; color: #fff; }

    /* ---- Pick mode instruction banner ---- */
    #akfb-instruction {
      position: fixed; top: 76px; left: 50%; transform: translateX(-50%);
      background: rgba(10,6,3,.88);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(244,244,244,.14);
      border-radius: 100px;
      padding: 9px 20px;
      font-family: 'TT Corals', Georgia, serif;
      font-size: 11px; font-weight: 400; letter-spacing: 0.08em;
      color: rgba(244,244,244,.75);
      display: none; align-items: center; gap: 10px;
      z-index: 8700; white-space: nowrap;
    }
    #akfb-instruction.visible { display: flex; }
    #akfb-instruction span.dot { width: 6px; height: 6px; border-radius: 50%; background: #fe751f; flex-shrink: 0; animation: akfb-pulse 1.4s ease infinite; }
    @keyframes akfb-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    body.light #akfb-instruction { background: rgba(248,248,246,.94); border-color: rgba(5,2,0,.10); color: rgba(5,2,0,.65); }

    /* ---- Highlight box ---- */
    #akfb-highlight {
      position: fixed; pointer-events: none; z-index: 8600;
      border: 2px solid #fe751f;
      border-radius: 6px;
      background: rgba(254,117,31,.08);
      transition: top .08s, left .08s, width .08s, height .08s;
      display: none;
    }

    /* ---- Section label chip ---- */
    #akfb-pick-label {
      position: fixed; pointer-events: none; z-index: 8701;
      background: #fe751f;
      color: #fff;
      font-family: 'TT Corals', Georgia, serif;
      font-size: 10px; font-weight: 500; letter-spacing: 0.08em;
      padding: 4px 10px; border-radius: 100px;
      white-space: nowrap;
      display: none;
      box-shadow: 0 2px 10px rgba(254,117,31,.4);
    }

    /* ---- Feedback panel overlay ---- */
    #akfb-overlay {
      position: fixed; inset: 0;
      background: rgba(5,2,0,.50);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      z-index: 8800;
      display: none; align-items: center; justify-content: center; padding: 20px;
    }
    #akfb-overlay.open { display: flex; }

    /* ---- Panel ---- */
    #akfb-panel {
      width: min(500px, 100%);
      background: rgba(10,6,3,.94);
      backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(244,244,244,.13);
      border-radius: 22px;
      padding: 34px 32px 28px;
      font-family: 'TT Corals', Georgia, serif;
      color: #f4f4f4; position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,.5);
    }
    body.light #akfb-panel {
      background: rgba(248,248,246,.96);
      border-color: rgba(5,2,0,.10); color: #050200;
      box-shadow: 0 16px 48px rgba(0,0,0,.14);
    }
    #akfb-close {
      position: absolute; top: 16px; right: 16px;
      width: 28px; height: 28px; border-radius: 50%;
      background: transparent; border: 1px solid rgba(244,244,244,.14);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: opacity .2s;
    }
    #akfb-close:hover { opacity: .5; }
    #akfb-close svg { stroke: #f4f4f4; fill: none; stroke-width: 1.5; width:12px; height:12px; }
    body.light #akfb-close { border-color: rgba(5,2,0,.12); }
    body.light #akfb-close svg { stroke: #050200; }

    #akfb-panel h3 { font-size: 17px; font-weight: 300; letter-spacing: -0.01em; margin-bottom: 4px; }
    #akfb-page-tag { font-size: 10px; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(244,244,244,.35); margin-bottom: 24px; }
    body.light #akfb-page-tag { color: rgba(5,2,0,.35); }

    .akfb-label { display: block; font-size: 9px; font-weight: 400; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(244,244,244,.38); margin-bottom: 7px; }
    body.light .akfb-label { color: rgba(5,2,0,.38); }

    /* Section display (read-only chip) */
    #akfb-section-display {
      width: 100%; padding: 10px 13px;
      background: rgba(254,117,31,.12);
      border: 1px solid rgba(254,117,31,.35);
      border-radius: 10px;
      color: #fe751f;
      font-family: 'TT Corals', Georgia, serif;
      font-size: 13px; font-weight: 400;
      margin-bottom: 16px;
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
    }
    #akfb-section-display span { flex: 1; }
    #akfb-repick {
      font-size: 10px; font-weight: 400; letter-spacing: 0.06em;
      color: rgba(254,117,31,.65); cursor: pointer; white-space: nowrap;
      text-decoration: underline; background: none; border: none;
      font-family: inherit; transition: color .2s;
    }
    #akfb-repick:hover { color: #fe751f; }

    #akfb-text {
      width: 100%; padding: 11px 13px;
      background: rgba(244,244,244,.06); border: 1px solid rgba(244,244,244,.11);
      border-radius: 10px; color: #f4f4f4;
      font-family: 'TT Corals', Georgia, serif;
      font-size: 13px; font-weight: 300; line-height: 1.65;
      resize: vertical; min-height: 100px; margin-bottom: 22px;
      transition: border-color .2s;
    }
    #akfb-text:focus { outline: none; border-color: rgba(254,117,31,.5); }
    body.light #akfb-text { background: rgba(5,2,0,.04); border-color: rgba(5,2,0,.11); color: #050200; }
    body.light #akfb-text:focus { border-color: rgba(254,117,31,.6); }
    #akfb-text::placeholder { color: rgba(244,244,244,.22); }
    body.light #akfb-text::placeholder { color: rgba(5,2,0,.22); }

    .akfb-actions { display: flex; gap: 10px; justify-content: flex-end; }
    #akfb-cancel {
      padding: 9px 20px; border-radius: 100px;
      border: 1px solid rgba(244,244,244,.16); background: transparent;
      color: rgba(244,244,244,.5);
      font-family: 'TT Corals', Georgia, serif; font-size: 11px; font-weight: 400; letter-spacing: 0.04em;
      cursor: pointer; transition: border-color .2s, color .2s;
    }
    #akfb-cancel:hover { border-color: rgba(244,244,244,.35); color: #f4f4f4; }
    body.light #akfb-cancel { border-color: rgba(5,2,0,.16); color: rgba(5,2,0,.5); }
    body.light #akfb-cancel:hover { border-color: rgba(5,2,0,.35); color: #050200; }

    #akfb-copy {
      padding: 9px 22px; border-radius: 100px; border: none;
      background: #fe751f; color: #f4f4f4;
      font-family: 'TT Corals', Georgia, serif; font-size: 11px; font-weight: 500; letter-spacing: 0.05em;
      cursor: pointer; transition: background .2s, transform .15s, box-shadow .2s;
      box-shadow: 0 2px 12px rgba(254,117,31,.32);
    }
    #akfb-copy:hover { background: #e86015; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(254,117,31,.42); }
    #akfb-copy.ak-copied { background: #2f7d42; box-shadow: 0 2px 12px rgba(47,125,66,.3); }
  `;
  document.head.appendChild(css);

  /* ── DOM elements ─────────────────────────────────────────── */
  const badge = document.createElement('button');
  badge.id = 'akfb-badge';
  badge.setAttribute('aria-label', 'Feedback inspector (press F)');
  badge.textContent = 'F';
  document.body.appendChild(badge);

  const instruction = document.createElement('div');
  instruction.id = 'akfb-instruction';
  instruction.innerHTML = '<span class="dot"></span>Click any section to select it &nbsp;·&nbsp; Esc to cancel';
  document.body.appendChild(instruction);

  const highlight = document.createElement('div');
  highlight.id = 'akfb-highlight';
  document.body.appendChild(highlight);

  const pickLabel = document.createElement('div');
  pickLabel.id = 'akfb-pick-label';
  document.body.appendChild(pickLabel);

  const overlay = document.createElement('div');
  overlay.id = 'akfb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div id="akfb-panel">
      <button id="akfb-close" aria-label="Close">
        <svg viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
      <h3>Design Feedback</h3>
      <p id="akfb-page-tag">${pageName} — akhavancollection.at</p>

      <label class="akfb-label">Section</label>
      <div id="akfb-section-display">
        <span id="akfb-section-text">—</span>
        <button id="akfb-repick">Re-pick</button>
      </div>

      <label class="akfb-label" for="akfb-text">Your feedback</label>
      <textarea id="akfb-text" placeholder="Describe what you'd like to change or improve…"></textarea>

      <div class="akfb-actions">
        <button id="akfb-cancel">Cancel</button>
        <button id="akfb-copy">Copy Prompt</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ── State ────────────────────────────────────────────────── */
  let picking = false;
  let hoveredLabel = null;
  let selectedSection = null;

  /* ── Section finder ──────────────────────────────────────── */
  function findSection(target) {
    let el = target;
    // Walk up the DOM
    while (el && el !== document.body) {
      for (const { s, label } of SELECTORS) {
        try { if (el.matches(s)) return { el, label }; } catch (_) {}
      }
      el = el.parentElement;
    }
    return null;
  }

  /* ── Pick mode ────────────────────────────────────────────── */
  function enterPickMode() {
    picking = true;
    document.body.style.cursor = 'crosshair';
    badge.classList.add('picking');
    instruction.classList.add('visible');
  }

  function exitPickMode(keepHighlight) {
    picking = false;
    document.body.style.cursor = '';
    badge.classList.remove('picking');
    instruction.classList.remove('visible');
    if (!keepHighlight) {
      highlight.style.display = 'none';
      pickLabel.style.display = 'none';
    }
  }

  /* ── Panel open/close ─────────────────────────────────────── */
  function openPanel() {
    const txt = document.getElementById('akfb-section-text');
    txt.textContent = selectedSection || '(none selected)';
    overlay.classList.add('open');
    setTimeout(() => document.getElementById('akfb-text').focus(), 80);
  }

  function closePanel() {
    overlay.classList.remove('open');
    highlight.style.display = 'none';
    pickLabel.style.display = 'none';
  }

  /* ── Mouse move in pick mode ─────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    if (!picking) return;
    // Skip our own UI elements
    if (e.target.closest('#akfb-instruction, #akfb-badge')) return;

    const found = findSection(e.target);
    if (found) {
      const r = found.el.getBoundingClientRect();
      highlight.style.cssText = `
        display:block;
        top:${r.top}px; left:${r.left}px;
        width:${r.width}px; height:${r.height}px;
      `;
      // Label: prefer above element, else below
      const labelTop = r.top > 30 ? r.top - 26 : r.bottom + 4;
      pickLabel.style.cssText = `
        display:block;
        top:${labelTop}px;
        left:${Math.max(4, Math.min(r.left, window.innerWidth - 260))}px;
      `;
      pickLabel.textContent = found.label;
      hoveredLabel = found.label;
    } else {
      highlight.style.display = 'none';
      pickLabel.style.display = 'none';
      hoveredLabel = null;
    }
  });

  /* ── Click in pick mode (capture phase) ─────────────────── */
  document.addEventListener('click', function (e) {
    if (!picking) return;
    if (e.target.closest('#akfb-instruction, #akfb-badge')) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    selectedSection = hoveredLabel;
    exitPickMode(true); // keep highlight visible as confirmation
    openPanel();
  }, true);

  /* ── Badge click ─────────────────────────────────────────── */
  badge.addEventListener('click', function (e) {
    e.stopPropagation();
    if (overlay.classList.contains('open')) { closePanel(); return; }
    if (picking) { exitPickMode(false); return; }
    selectedSection = null;
    enterPickMode();
  });

  /* ── Re-pick button ──────────────────────────────────────── */
  document.getElementById('akfb-repick').addEventListener('click', function () {
    closePanel();
    selectedSection = null;
    enterPickMode();
  });

  /* ── Panel close controls ────────────────────────────────── */
  document.getElementById('akfb-close').addEventListener('click', closePanel);
  document.getElementById('akfb-cancel').addEventListener('click', closePanel);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePanel(); });

  /* ── Copy prompt ─────────────────────────────────────────── */
  document.getElementById('akfb-copy').addEventListener('click', function () {
    const section  = selectedSection || document.getElementById('akfb-section-text').textContent;
    const feedback = document.getElementById('akfb-text').value.trim();
    const mode     = document.body.classList.contains('light') ? 'Light (Day mode)' : 'Dark (Night mode)';

    const prompt = `[AK] ${pageName} (${filename}) · ${section} · ${mode}\n\n${feedback || '(no feedback text entered)'}`.trim();

    const btn = this;
    (navigator.clipboard
      ? navigator.clipboard.writeText(prompt)
      : new Promise(res => {
          const ta = Object.assign(document.createElement('textarea'), { value: prompt, style: 'position:fixed;opacity:0' });
          document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); res();
        })
    ).then(() => {
      btn.textContent = '✓ Copied!';
      btn.classList.add('ak-copied');
      setTimeout(() => { btn.textContent = 'Copy Prompt'; btn.classList.remove('ak-copied'); }, 2200);
    });
  });

  /* ── Keyboard ────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    const tag = (document.activeElement || {}).tagName || '';
    const typing = ['INPUT','TEXTAREA','SELECT'].includes(tag.toUpperCase());

    if (e.key === 'f' && !typing && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      if (overlay.classList.contains('open')) { closePanel(); return; }
      if (picking) { exitPickMode(false); return; }
      selectedSection = null;
      enterPickMode();
    }
    if (e.key === 'Escape') {
      if (overlay.classList.contains('open')) { closePanel(); return; }
      if (picking) exitPickMode(false);
    }
  });

})();
