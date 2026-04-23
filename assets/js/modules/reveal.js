/* ==========================================
   Module: Reveal
   Añade 'is-visible' a los elementos cuando entran en viewport.
   Respeta prefers-reduced-motion (aplica visible de inmediato).

   Uso:
     Reveal.init('.sel1, .sel2');
     Reveal.init('.card', { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
   ========================================== */
(function (global) {
  'use strict';

  var DEFAULT_OPTS = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  function init(selector, opts) {
    var targets = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector;
    if (!targets || !targets.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }

    var options = Object.assign({}, DEFAULT_OPTS, opts || {});
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, options);

    targets.forEach(function (t) { io.observe(t); });
  }

  global.Reveal = { init: init };
})(window);
