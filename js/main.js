/* ==========================================================================
   MAXMET – main script (no dependencies)
   ========================================================================== */
(function () {
  'use strict';

  var IMAGES = window.MAXMET_IMAGES || {};
  var I18N = window.MAXMET_I18N || {};
  var LANGS = ['sv', 'fi', 'en'];
  var DEFAULT_LANG = 'sv';
  var CARD_WIDTHS = [400, 600, 800, 1200];
  var GALLERY_WIDTHS = [300, 450, 600, 900];
  var LIGHTBOX_W = 1800;

  var lang = DEFAULT_LANG;

  function t(key) {
    var dict = I18N[lang] || {};
    return dict[key] != null ? dict[key] : (I18N[DEFAULT_LANG] || {})[key];
  }
  function altOf(img) {
    if (!img || !img.alt) return '';
    return typeof img.alt === 'string' ? img.alt : (img.alt[lang] || img.alt[DEFAULT_LANG] || '');
  }
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, obj);
  }

  /* ---------------- Images ---------------- */
  function buildImg(cfg, opts) {
    var img = document.createElement('img');
    var srcset = window.MAXMET_SRCSET(cfg.src, opts.widths);
    img.src = window.MAXMET_SRC(cfg.src, opts.fallbackW);
    if (srcset) { img.srcset = srcset; img.sizes = opts.sizes || '100vw'; }
    img.alt = altOf(cfg);
    img.decoding = 'async';
    if (opts.eager) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    } else {
      img.loading = 'lazy';
    }
    if (cfg.position) img.style.setProperty('--pos', cfg.position);
    img._cfg = cfg;
    var done = function () { img.classList.add('is-loaded'); };
    if (img.complete) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); }
    return img;
  }

  function renderSlots() {
    document.querySelectorAll('[data-slot]').forEach(function (el) {
      var cfg = getPath(IMAGES, el.getAttribute('data-slot'));
      if (!cfg || !cfg.src) return;
      var eager = el.hasAttribute('data-eager');
      el.appendChild(buildImg(cfg, {
        widths: eager ? window.MAXMET_HERO_WIDTHS : CARD_WIDTHS,
        fallbackW: eager ? 1600 : 800,
        sizes: el.getAttribute('data-sizes'),
        eager: eager
      }));
    });
  }

  /* ---------------- Gallery + lightbox ---------------- */
  var gallery = (IMAGES.gallery || []).filter(function (g) { return g && g.src; });
  var lb = document.getElementById('lightbox');
  var lbImg = lb && lb.querySelector('.lightbox-img');
  var lbText = lb && lb.querySelector('.lightbox-text');
  var lbCount = lb && lb.querySelector('.lightbox-count');
  var current = 0;
  var lastFocus = null;

  function renderGallery() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;
    if (!gallery.length) { document.getElementById('gallery').hidden = true; return; }
    var frag = document.createDocumentFragment();
    gallery.forEach(function (cfg, i) {
      var li = document.createElement('li');
      li.className = 'gallery-item reveal';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-index', i);
      var frame = document.createElement('div');
      frame.className = 'frame frame-1x1';
      frame.appendChild(buildImg(cfg, {
        widths: GALLERY_WIDTHS, fallbackW: 600,
        sizes: '(min-width: 1100px) 290px, (min-width: 700px) 32vw, 50vw'
      }));
      btn.appendChild(frame);
      btn.addEventListener('click', function () { openLightbox(i); });
      li.appendChild(btn);
      frag.appendChild(li);
    });
    grid.appendChild(frag);
    updateGalleryLabels();
    if (lb && gallery.length < 2) lb.classList.add('is-single');
  }

  function updateGalleryLabels() {
    document.querySelectorAll('#gallery-grid button').forEach(function (b) {
      var cfg = gallery[+b.getAttribute('data-index')];
      b.setAttribute('aria-label', t('gallery.open') + ': ' + altOf(cfg));
    });
  }

  function showSlide(i) {
    var n = gallery.length;
    current = (i + n) % n;
    var cfg = gallery[current];
    lbImg.classList.add('is-loading');
    lbImg.onload = lbImg.onerror = function () { lbImg.classList.remove('is-loading'); };
    lbImg.src = window.MAXMET_SRC(cfg.src, LIGHTBOX_W);
    lbImg.alt = altOf(cfg);
    lbText.textContent = altOf(cfg);
    lbCount.textContent = (current + 1) + ' / ' + n;
    // Preload neighbours for snappy navigation
    [current + 1, current - 1].forEach(function (k) {
      var c = gallery[(k + n) % n];
      if (c) { var p = new Image(); p.src = window.MAXMET_SRC(c.src, LIGHTBOX_W); }
    });
  }

  function openLightbox(i) {
    if (!lb || typeof lb.showModal !== 'function') {
      window.open(window.MAXMET_SRC(gallery[i].src, LIGHTBOX_W), '_blank', 'noopener');
      return;
    }
    lastFocus = document.activeElement;
    showSlide(i);
    lb.showModal();
    document.body.classList.add('lb-open');
  }
  function closeLightbox() { if (lb.open) lb.close(); }

  function initLightbox() {
    if (!lb) return;
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', function () { showSlide(current - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { showSlide(current + 1); });
    lb.addEventListener('close', function () {
      document.body.classList.remove('lb-open');
      if (lastFocus) lastFocus.focus();
    });
    // Click on the dark background closes
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-figure')) closeLightbox();
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(current - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(current + 1); }
    });
    // Swipe
    var startX = 0, startY = 0, tracking = false;
    var fig = lb.querySelector('.lightbox-figure');
    fig.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      tracking = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    fig.addEventListener('touchend', function (e) {
      if (!tracking) return; tracking = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3 && gallery.length > 1) {
        showSlide(current + (dx < 0 ? 1 : -1));
      } else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) {
        closeLightbox(); // swipe down to close
      }
    }, { passive: true });
  }

  /* ---------------- i18n ---------------- */
  function applyLang(next, persist) {
    if (LANGS.indexOf(next) === -1) next = DEFAULT_LANG;
    lang = next;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); var v = t(p[1]);
        if (p[0] && v != null) el.setAttribute(p[0].trim(), v);
      });
    });
    document.title = t('meta.title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta.description'));

    // Image alt texts
    document.querySelectorAll('img').forEach(function (img) { if (img._cfg) img.alt = altOf(img._cfg); });
    updateGalleryLabels();
    if (lb && lb.open) showSlide(current);

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    var hidden = document.querySelector('#quote-form input[name="language"]');
    if (hidden) hidden.value = lang;

    if (persist) {
      try { localStorage.setItem('maxmet-lang', lang); } catch (e) { /* ignore */ }
      try {
        var url = new URL(location.href);
        if (lang === DEFAULT_LANG) url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
        history.replaceState(null, '', url);
      } catch (e) { /* ignore */ }
    }
  }

  function initialLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q && LANGS.indexOf(q) > -1) return q;
    } catch (e) { /* ignore */ }
    try {
      var s = localStorage.getItem('maxmet-lang');
      if (s && LANGS.indexOf(s) > -1) return s;
    } catch (e) { /* ignore */ }
    return DEFAULT_LANG;
  }

  /* ---------------- Header / nav ---------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var nav = document.getElementById('site-nav');
    var toggle = document.querySelector('.menu-toggle');

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      // Back at the hero: no nav item is "current"
      if (window.scrollY < window.innerHeight * 0.4) {
        document.querySelectorAll('.nav-list a[aria-current]').forEach(function (a) { a.removeAttribute('aria-current'); });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function setMenu(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
    }
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
    });

    // Highlight current section in nav
    if ('IntersectionObserver' in window) {
      var links = {};
      document.querySelectorAll('.nav-list a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && links[en.target.id]) {
            Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
            links[en.target.id].setAttribute('aria-current', 'true');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) {
      // tiny stagger for siblings in grids
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      if (idx > 0 && idx < 8) el.style.transitionDelay = (idx * 60) + 'ms';
      io.observe(el);
    });
  }

  /* ---------------- Quote form ---------------- */
  function initForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var btnLabel = btn.querySelector('[data-i18n]');

    function setStatus(type, key) {
      status.className = 'form-status is-' + type;
      status.textContent = t(key);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var valid = f.checkValidity() && f.value.trim() !== '';
        f.closest('.field').classList.toggle('is-invalid', !valid);
        f.setAttribute('aria-invalid', String(!valid));
        if (!valid && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;

      // TODO: remove this block once the real form endpoint is set in index.html
      if (/YOUR_FORM_ID/.test(form.action)) { setStatus('info', 'form.demo'); return; }

      btn.disabled = true;
      btnLabel.textContent = t('form.sending');
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        setStatus('success', 'form.success');
      }).catch(function () {
        setStatus('error', 'form.error');
      }).then(function () {
        btn.disabled = false;
        btnLabel.textContent = t('form.submit');
      });
    });

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('is-invalid') && e.target.checkValidity() && e.target.value.trim()) {
        field.classList.remove('is-invalid');
        e.target.removeAttribute('aria-invalid');
      }
    });
  }

  /* ---------------- Boot ---------------- */
  renderSlots();
  renderGallery();
  initLightbox();
  initHeader();
  initForm();
  var start = initialLang();
  if (start !== DEFAULT_LANG) applyLang(start, false);
  else applyLang(DEFAULT_LANG, false);
  initReveal();
})();
