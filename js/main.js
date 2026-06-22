/* ============================================================
   COLLECTION AKHAVAN — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ---- Mode toggle ---- */
  const body = document.body;
  const modeCapsule = document.getElementById('modeCapsule');
  const modeIcon    = document.getElementById('modeIcon');

  function applyMode(light) {
    body.classList.toggle('light', light);
    localStorage.setItem('akhavan-mode', light ? 'light' : 'dark');
    renderModeIcon(light);
    if (modeCapsule) modeCapsule.title = light ? 'Switch to Night mode' : 'Switch to Day mode';
  }

  function renderModeIcon(light) {
    if (!modeIcon) return;
    modeIcon.innerHTML = light
      ? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  const savedMode = localStorage.getItem('akhavan-mode');
  applyMode(savedMode === 'light');

  if (modeCapsule) {
    modeCapsule.addEventListener('click', () => applyMode(!body.classList.contains('light')));
  }

  /* ---- Language toggle ---- */
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ---- Scroll: header state ---- */
  const header = document.querySelector('.header');
  if (header && !header.classList.contains('solid')) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Panel system ---- */
  const overlay    = document.getElementById('overlay');
  const menuPanel  = document.getElementById('menuPanel');
  const resPanel   = document.getElementById('reservePanel');

  function lockScroll(on) {
    if (on) {
      const scrollW = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollW + 'px';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
  }

  function openPanel(el) {
    if (!el) return;
    el.classList.add('open');
    overlay && overlay.classList.add('visible');
    lockScroll(true);
  }

  function closePanel(el) {
    if (!el) return;
    el.classList.remove('open');
    const still = document.querySelector('.menu-panel.open, .reserve-panel.open');
    if (!still) {
      overlay && overlay.classList.remove('visible');
      lockScroll(false);
    }
  }

  function closeAll() {
    document.querySelectorAll('.menu-panel, .reserve-panel').forEach(p => p.classList.remove('open'));
    overlay && overlay.classList.remove('visible');
    lockScroll(false);
  }

  /* Hamburger open */
  document.getElementById('menuOpen')?.addEventListener('click', () => openPanel(menuPanel));
  document.getElementById('menuClose')?.addEventListener('click', () => closePanel(menuPanel));

  /* Reserve open — any element with data-reserve attribute */
  document.querySelectorAll('[data-reserve]').forEach(el => {
    el.addEventListener('click', () => {
      closePanel(menuPanel);
      openPanel(resPanel);
    });
  });

  document.getElementById('reserveClose')?.addEventListener('click', () => closePanel(resPanel));

  /* Overlay + Escape */
  overlay?.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ---- Scroll reveal ---- */
  const revEls = document.querySelectorAll('.reveal');
  if (revEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    revEls.forEach(el => io.observe(el));
    /* Reveal elements already in viewport on load */
    const triggerVisible = () => {
      revEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    };
    requestAnimationFrame(triggerVisible);
    setTimeout(triggerVisible, 120);
  }

  /* ---- Location parallax photo strip ---- */
  const locStrip = document.getElementById('locPhotosStrip');
  const locTrack = document.getElementById('locPhotosTrack');
  if (locStrip && locTrack) {
    let isDragging = false;
    let dragX = 0;
    let dragShift = 0;

    function getMaxShift() {
      return -(locTrack.scrollWidth - locStrip.offsetWidth);
    }
    function clampShift(v) {
      return Math.max(getMaxShift(), Math.min(0, v));
    }
    function getCurrentShift() {
      const m = locTrack.style.transform.match(/-?\d+\.?\d*/);
      return m ? parseFloat(m[0]) : 0;
    }

    function updateLocParallax() {
      if (isDragging) return;
      const rect = locStrip.getBoundingClientRect();
      const winH = window.innerHeight;
      const progress = (winH / 2 - (rect.top + rect.height / 2)) / (winH + rect.height);
      const clamped = Math.max(-0.5, Math.min(0.5, progress));
      locTrack.style.transform = 'translateX(' + ((clamped + 0.5) * getMaxShift()) + 'px)';
    }
    window.addEventListener('scroll', updateLocParallax, { passive: true });
    updateLocParallax();

    /* Mouse drag */
    locStrip.addEventListener('mousedown', function(e) {
      isDragging = true;
      dragX = e.clientX;
      dragShift = getCurrentShift();
      e.preventDefault();
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const dx = e.clientX - dragX;
      dragX = e.clientX;
      dragShift = clampShift(dragShift + dx);
      locTrack.style.transform = 'translateX(' + dragShift + 'px)';
    });
    window.addEventListener('mouseup', function() {
      isDragging = false;
    });

    /* Touch swipe (touch screens) */
    locStrip.addEventListener('touchstart', function(e) {
      isDragging = true;
      dragX = e.touches[0].clientX;
      dragShift = getCurrentShift();
    }, { passive: true });
    locStrip.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - dragX;
      dragX = e.touches[0].clientX;
      dragShift = clampShift(dragShift + dx);
      locTrack.style.transform = 'translateX(' + dragShift + 'px)';
    }, { passive: true });
    locStrip.addEventListener('touchend', function() {
      isDragging = false;
    });

    /* Trackpad / mousewheel horizontal swipe */
    var wheelTimer;
    locStrip.addEventListener('wheel', function(e) {
      if (Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      isDragging = true;
      dragShift = clampShift(getCurrentShift() - e.deltaX);
      locTrack.style.transform = 'translateX(' + dragShift + 'px)';
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function() { isDragging = false; }, 200);
    }, { passive: false });
  }

  /* ---- Exhibition detail: load content from URL param ---- */
  const exhbDetailPage = document.querySelector('.exhb-detail-cover');
  if (exhbDetailPage) {
    const exhibitions = {
      '1': {
        num: 'Exhibition I',
        title: 'Fragmente der\nStille',
        titleEn: 'Fragments of\nSilence',
        artist: 'Anonymous Collective',
        dates: '15 Jan — 28 Mar 2026',
        works: 16
      },
      '2': {
        num: 'Exhibition II',
        title: 'Zwischen\nden Räumen',
        titleEn: 'Between\nthe Spaces',
        artist: 'Various Artists',
        dates: '10 Apr — 30 Jun 2026',
        works: 16
      }
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '1';
    const data = exhibitions[id] || exhibitions['1'];

    const coverImg = document.getElementById('exhbDetailCoverImg');
    const numEl    = document.getElementById('exhbDetailNum');
    const titleEl  = document.getElementById('exhbDetailTitle');
    const artistEl = document.getElementById('exhbDetailArtist');
    const datesEl  = document.getElementById('exhbDetailDates');

    if (coverImg) coverImg.src = `assets/images/exhibitions/exhibition-${id}/cover.jpg`;

    if (numEl)    numEl.textContent    = data.num;
    if (titleEl)  titleEl.textContent  = data.titleEn;
    if (artistEl) artistEl.textContent = data.artist;
    if (datesEl)  datesEl.textContent  = data.dates;

    /* Dynamically build detail grid with explicit 3-column layout */
    const grid = document.querySelector('.collection-grid');
    if (grid) {
      grid.innerHTML = '';

      function n(i) { return String((i % 7) + 1).padStart(2, '0'); }
      function mkItem(imgNum, extraClass) {
        const cls = 'collection-item' + (extraClass ? ' ' + extraClass : '') + ' reveal';
        return `<div class="${cls}">` +
          `<img src="assets/images/exhibitions/exhibition-${id}/detail-${imgNum}.jpg" alt="${data.titleEn}" />` +
          `<div class="collection-item__reveal">` +
          `<span class="collection-item__title">Untitled ${imgNum}</span>` +
          `<span class="collection-item__sub">${data.artist}, 2025</span>` +
          `</div></div>`;
      }

      const c1 = document.createElement('div'); c1.className = 'exhb-col';
      const c2 = document.createElement('div'); c2.className = 'exhb-col';
      const c3 = document.createElement('div'); c3.className = 'exhb-col';

      if (id === '1') {
        /* Col 1: items 0-3, then item 10 moved here (~400px tall), item 4 removed */
        c1.innerHTML = mkItem(n(0)) + mkItem(n(1)) + mkItem(n(2)) + mkItem(n(3)) + mkItem(n(10), 'collection-item--tall');
        /* Col 2: items 5-9 (item 10 moved away) */
        c2.innerHTML = mkItem(n(5)) + mkItem(n(6)) + mkItem(n(7)) + mkItem(n(8)) + mkItem(n(9));
        /* Col 3: items 11-15, all at full natural height */
        c3.innerHTML = mkItem(n(11)) + mkItem(n(12)) + mkItem(n(13)) + mkItem(n(14)) + mkItem(n(15));
      } else if (id === '2') {
        /* Col 1: items 0-4 normal */
        c1.innerHTML = mkItem(n(0)) + mkItem(n(1)) + mkItem(n(2)) + mkItem(n(3)) + mkItem(n(4));
        /* Col 2: items 5-6, then swapped (use col3's first image n(11)) at position 3, then 8-10(small) */
        c2.innerHTML = mkItem(n(5)) + mkItem(n(6)) + mkItem(n(11)) + mkItem(n(8)) + mkItem(n(9)) + mkItem(n(10), 'collection-item--small');
        /* Col 3: swapped first (use col2's 3rd image n(7)), then items 12-15(small) */
        c3.innerHTML = mkItem(n(7)) + mkItem(n(12)) + mkItem(n(13)) + mkItem(n(14)) + mkItem(n(15), 'collection-item--small');
      }

      grid.appendChild(c1);
      grid.appendChild(c2);
      grid.appendChild(c3);

      /* Re-observe new elements */
      grid.querySelectorAll('.reveal').forEach(el => {
        const io2 = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } });
        }, { threshold: 0.08 });
        io2.observe(el);
      });
    }
  }

})();
