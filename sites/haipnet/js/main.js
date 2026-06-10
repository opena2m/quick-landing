/* Shared page behaviour: i18n boot, mobile nav, sticky header, reveal-on-scroll. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (window.I18N) window.I18N.init();

    // --- Mobile nav toggle ---
    var navToggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-open', open);
      });
      // close the menu after following an in-page link
      nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        });
      });
    }

    // --- Sticky header shadow on scroll ---
    var header = document.querySelector('[data-header]');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Reveal on scroll (progressive enhancement) ---
    var revealables = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && revealables.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // --- Current year in footer ---
    var yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  });
})();
