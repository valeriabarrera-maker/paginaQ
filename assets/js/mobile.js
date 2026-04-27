/* ==========================================================================
   QBRETE — Mobile behavior (≤1023px)

   Gated por matchMedia: si no es mobile, no se registra nada.
   Desktop (≥1024) sigue idéntico.

   Módulos:
     - drawer           → abre/cierra el off-canvas, focus trap, Esc, body lock
     - backToTop        → botón volver arriba tras 600px de scroll
     - scrollProgress   → barra de progreso superior
     - footerAccordion  → colapsa secciones del footer

   Carga: <script src="assets/js/mobile.js" defer></script>
   Como `header.js` carga sincrónico antes, cuando corre este script
   el header/drawer ya están renderizados en el DOM.
   ========================================================================== */

(function () {
  'use strict';

  const MOBILE_MQ = window.matchMedia('(max-width: 1023px)');
  if (!MOBILE_MQ.matches) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Drawer off-canvas
     El markup (.mobile-nav, .header__hamburger, .mobile-nav__close)
     lo inyecta header.js. Aquí agregamos el comportamiento.
     ------------------------------------------------------------------ */
  function initDrawer() {
    const hamburger = document.querySelector('.header__hamburger');
    const drawer = document.getElementById('mobileNav');
    const closeBtn = drawer && drawer.querySelector('.mobile-nav__close');
    if (!hamburger || !drawer || !closeBtn) return;

    let lastFocused = null;
    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // ARIA iniciales
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Menú de navegación');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-controls', 'mobileNav');
    hamburger.setAttribute('aria-expanded', 'false');

    function focusable() {
      return Array.from(drawer.querySelectorAll(FOCUSABLE))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }

    function isOpen() {
      return drawer.classList.contains('mobile-nav--open');
    }

    function open() {
      lastFocused = document.activeElement;
      drawer.classList.add('mobile-nav--open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Cerrar menú');
      closeBtn.focus({ preventScroll: true });
    }

    function close(restoreFocus = true) {
      drawer.classList.remove('mobile-nav--open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú');
      if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus({ preventScroll: true });
      }
    }

    hamburger.addEventListener('click', () => (isOpen() ? close() : open()));
    closeBtn.addEventListener('click', () => close());

    // Click en cualquier link del drawer → cerrar (sin restaurar foco)
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) close(false);
    });

    // Esc cierra; Tab queda atrapado
    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const els = focusable();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Al cruzar a desktop, cerrar automáticamente
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const onMQChange = (e) => { if (e.matches && isOpen()) close(false); };
    if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onMQChange);
    else mqDesktop.addListener(onMQChange);
  }

  /* ------------------------------------------------------------------
     2. Back-to-top
     ------------------------------------------------------------------ */
  function initBackToTop() {
    if (document.querySelector('.m-back-to-top')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'm-back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<line x1="12" y1="19" x2="12" y2="5"/>' +
      '<polyline points="5,12 12,5 19,12"/>' +
      '</svg>';
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btn);

    let ticking = false;
    const update = () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     4. Scroll progress — barra superior
     ------------------------------------------------------------------ */
  function initScrollProgress() {
    if (document.querySelector('.m-scroll-progress')) return;

    const bar = document.createElement('div');
    bar.className = 'm-scroll-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Progreso de lectura');
    document.body.appendChild(bar);

    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     5. Footer accordion
     Convierte headings (h3/h4) del footer en toggles y sus siguientes
     siblings en paneles colapsables. Defensivo: si no hay estructura
     reconocible, no hace nada.
     ------------------------------------------------------------------ */
  function initFooterAccordion() {
    const footer = document.querySelector('.footer, footer');
    if (!footer) return;

    const headings = footer.querySelectorAll('h3, h4');
    if (!headings.length) return;

    headings.forEach((h, i) => {
      const panel = h.nextElementSibling;
      // Saltar si no hay contenido colapsable a continuación
      if (!panel || panel.tagName === 'H3' || panel.tagName === 'H4') return;
      // Saltar si ya se convirtió (re-entry protection)
      if (h.parentElement && h.parentElement.querySelector('[data-accordion-toggle]')) return;

      const id = `m-acc-${i}`;
      panel.setAttribute('data-accordion-panel', '');
      panel.setAttribute('data-open', 'false');
      panel.id = panel.id || id;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-accordion-toggle', '');
      btn.setAttribute('aria-controls', panel.id);
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML =
        `<span>${h.textContent}</span>` +
        '<svg class="m-chevron" width="16" height="16" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
        'aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        panel.setAttribute('data-open', open ? 'false' : 'true');
      });
      h.replaceWith(btn);
    });
  }

  /* ---- Boot ---------------------------------------------------- */
  initDrawer();
  initBackToTop();
  initScrollProgress();
  // El footer puede inyectarse por otro script; esperamos al siguiente tick.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAccordion);
  } else {
    queueMicrotask(initFooterAccordion);
  }
})();
