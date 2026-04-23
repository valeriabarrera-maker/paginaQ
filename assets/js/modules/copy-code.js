/* ==========================================
   Module: CopyCode
   Copia al portapapeles el texto de un elemento hermano
   al botón (ambos dentro de un contenedor común).

   Uso:
     CopyCode.init(
       '.benefit-card__share',
       '.benefit-card__footer',
       '.benefit-card__code-value'
     );
   ========================================== */
(function (global) {
  'use strict';

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_err) {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }

  function init(buttonSelector, containerSelector, codeSelector, feedbackMs) {
    var buttons = document.querySelectorAll(buttonSelector);
    if (!buttons.length) return;

    feedbackMs = feedbackMs || 1500;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var container = btn.closest(containerSelector);
        var codeEl = container && container.querySelector(codeSelector);
        var code = codeEl && codeEl.textContent.trim();
        if (!code) return;

        await copyText(code);

        var originalLabel = btn.getAttribute('aria-label');
        btn.setAttribute('aria-label', 'Código copiado');
        btn.classList.add('is-copied');

        setTimeout(function () {
          btn.setAttribute('aria-label', originalLabel || 'Copiar código');
          btn.classList.remove('is-copied');
        }, feedbackMs);
      });
    });
  }

  global.CopyCode = { init: init };
})(window);
