/* ==========================================
   QBRETE — Global Header Component
   Renders the header consistently across all pages
   ========================================== */

(function () {
  const NAV_LINKS = [
    { label: 'Inicio', href: 'index.html' },
    { label: 'Servicios', href: 'servicios.html' },
    { label: 'Mi comunidad', href: 'comunidad.html' },
    { label: 'Beneficios', href: '#' },
    { label: 'PQRS', href: '#' },
    { label: 'Reporta tu siniestro', href: '#' },
  ];

  const SVG_UNDERLINE = `<svg class="nav-underline" viewBox="0 0 48 6" fill="none" preserveAspectRatio="none"><path d="M1.5 4.5C8.08537 3.19828 26.3049 0.813533 46.5 1.68829" stroke="#FF4E00" stroke-width="3" stroke-linecap="round"/></svg>`;

  const HAMBURGER_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

  const CLOSE_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return file;
  }

  function buildNavLinks(currentPage) {
    return NAV_LINKS.map(link => {
      const isActive = link.href === currentPage ||
        (currentPage === '' && link.href === 'index.html') ||
        (currentPage === '/' && link.href === 'index.html');
      const activeClass = isActive ? ' class="active"' : '';
      return `<a href="${link.href}"${activeClass}><span class="nav-label">${link.label}${SVG_UNDERLINE}</span></a>`;
    }).join('\n        ');
  }

  function buildMobileNavLinks(currentPage) {
    return NAV_LINKS.map(link => {
      const isActive = link.href === currentPage ||
        (currentPage === '' && link.href === 'index.html') ||
        (currentPage === '/' && link.href === 'index.html');
      const activeClass = isActive ? ' class="active"' : '';
      return `<a href="${link.href}"${activeClass}>${link.label}</a>`;
    }).join('\n      ');
  }

  function renderHeader() {
    const currentPage = getCurrentPage();
    const target = document.getElementById('header-root');
    if (!target) return;

    target.innerHTML = `
    <header class="header">
      <a href="index.html" class="logo">
        <img src="assets/logos/logo-qbrete.svg" alt="Qbrete" />
      </a>
      <nav>
        <div class="nav-links">
          ${buildNavLinks(currentPage)}
        </div>
      </nav>
      <a href="#" class="btn btn--primary">Contáctanos</a>
      <button class="hamburger-btn" aria-label="Menu" aria-expanded="false">
        ${HAMBURGER_SVG}
      </button>
    </header>
    <div class="mobile-nav" id="mobileNav">
      <button class="mobile-nav-close" aria-label="Cerrar menu">
        ${CLOSE_SVG}
      </button>
      ${buildMobileNavLinks(currentPage)}
      <a href="#" class="btn btn--primary">Contáctanos</a>
    </div>`;
  }

  // Render as soon as the script runs (should be placed after #header-root in the DOM)
  renderHeader();
})();
