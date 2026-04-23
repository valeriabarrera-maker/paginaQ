/* ==========================================
   Module: Tabs
   Filtro por data-attribute.
     Botón tab: data-tab="mascotas"
     Item:     data-category="mascotas"
   El valor 'todas' (o el selector activo inicial) muestra todo si se define.

   Uso:
     Tabs.init('.ben-tab', '.benefit-card');
     Tabs.init('.news-tab', '.news-card', { activeClass: 'active', allValue: 'todas' });
   ========================================== */
(function (global) {
  'use strict';

  function init(tabSelector, itemSelector, opts) {
    var tabs = document.querySelectorAll(tabSelector);
    var items = document.querySelectorAll(itemSelector);
    if (!tabs.length || !items.length) return;

    opts = opts || {};
    var activeClass = opts.activeClass || 'active';
    var allValue = opts.allValue || 'todas';

    function filter(category) {
      items.forEach(function (item) {
        var matches = category === allValue || item.dataset.category === category;
        item.hidden = !matches;
      });
    }

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.forEach(function (b) { b.classList.remove(activeClass); });
        btn.classList.add(activeClass);
        filter(btn.dataset.tab);
      });
    });

    // Aplica filtro inicial si ya hay un tab activo
    var initial = document.querySelector(tabSelector + '.' + activeClass);
    if (initial) filter(initial.dataset.tab);
  }

  global.Tabs = { init: init };
})(window);
