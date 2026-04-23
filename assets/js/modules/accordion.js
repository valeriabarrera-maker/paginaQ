/* ==========================================
   Module: Accordion
   Toggle 'open' sobre el ancestro más cercano del trigger.
   Sincroniza aria-expanded para accesibilidad.

   Uso:
     Accordion.init('.faq-question', '.faq-item');
   ========================================== */
(function (global) {
  'use strict';

  function init(triggerSelector, itemSelector, openClass) {
    var triggers = document.querySelectorAll(triggerSelector);
    if (!triggers.length) return;

    openClass = openClass || 'open';

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest(itemSelector);
        if (!item) return;
        var isOpen = item.classList.contains(openClass);
        item.classList.toggle(openClass);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  global.Accordion = { init: init };
})(window);
