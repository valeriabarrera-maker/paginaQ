/* ==========================================
   QBRETE — Community Card Component (renderer)
   Uso:
     CommunityCard.render(container, dataArray)
     CommunityCard.create(data) → HTMLElement
   ========================================== */
(function (global) {
  'use strict';

  // Icono de miembros — Figma 574:3264 (Community Card): persona sola #FF4E00
  var ICON_USERS =
    '<svg class="community-card__members-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12C10.9 12 9.95833 11.6083 9.175 10.825ZM4 20V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.9542 16.85 17.8625 16.7C17.7708 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5625 14.775 15.3375C13.8583 15.1125 12.9333 15 12 15C11.0667 15 10.1417 15.1125 9.225 15.3375C8.30833 15.5625 7.4 15.9 6.5 16.35C6.35 16.4333 6.22917 16.55 6.1375 16.7C6.04583 16.85 6 17.0167 6 17.2V18ZM13.4125 9.4125C13.8042 9.02083 14 8.55 14 8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6C11.45 6 10.9792 6.19583 10.5875 6.5875C10.1958 6.97917 10 7.45 10 8C10 8.55 10.1958 9.02083 10.5875 9.4125C10.9792 9.80417 11.45 10 12 10C12.55 10 13.0208 9.80417 13.4125 9.4125Z" fill="currentColor"/>' +
    '</svg>';

  var ICON_ARROW =
    '<svg class="btn__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
      '<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  function escapeHTML(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Crea el elemento DOM de una Community Card.
   * @param {Object} data
   * @param {string} data.image        URL de la imagen de fondo
   * @param {string} data.title        Título (ej. "Mujeres que cuidan")
   * @param {string} data.description  Texto descriptivo
   * @param {string} [data.chip]       Etiqueta superior (por defecto "Popular"; pasar "" para ocultar)
   * @param {string} [data.members]    Texto de miembros (ej. "2.4k miembros")
   * @param {string} [data.ctaLabel]   Texto del botón (por defecto "Unirme")
   * @param {string} [data.ctaHref]    URL del botón (por defecto "#")
   * @param {string} [data.alt]        Alt de la imagen (accesibilidad)
   * @returns {HTMLElement}
   */
  function create(data) {
    data = data || {};
    var chip = data.chip == null ? 'Popular' : data.chip;
    var ctaLabel = data.ctaLabel || 'Unirme';
    var ctaHref = data.ctaHref || '#';
    var members = data.members || '';
    var alt = data.alt || data.title || '';

    var article = document.createElement('article');
    article.className = 'community-card';
    article.setAttribute('role', 'article');
    if (alt) article.setAttribute('aria-label', alt);

    article.innerHTML =
      '<div class="community-card__image" ' +
        'style="background-image:url(\'' + escapeHTML(data.image) + '\')" ' +
        'role="img" aria-label="' + escapeHTML(alt) + '">' +
        (chip ? '<span class="community-card__chip">' + escapeHTML(chip) + '</span>' : '') +
      '</div>' +
      '<div class="community-card__body">' +
        '<div class="community-card__info">' +
          '<h3 class="community-card__title">' + escapeHTML(data.title) + '</h3>' +
          '<p class="community-card__desc">' + escapeHTML(data.description) + '</p>' +
        '</div>' +
        '<div class="community-card__footer">' +
          (members
            ? '<span class="community-card__members">' + ICON_USERS + escapeHTML(members) + '</span>'
            : '<span></span>') +
          '<a href="' + escapeHTML(ctaHref) + '" class="btn btn--primary">' +
            escapeHTML(ctaLabel) + ICON_ARROW +
          '</a>' +
        '</div>' +
      '</div>';

    return article;
  }

  /**
   * Renderiza un array de datos dentro de un contenedor.
   * @param {HTMLElement|string} target  Nodo o selector contenedor
   * @param {Array<Object>} items
   */
  function render(target, items) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el || !Array.isArray(items)) return;
    el.innerHTML = '';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) frag.appendChild(create(items[i]));
    el.appendChild(frag);
  }

  global.CommunityCard = { create: create, render: render };
})(window);
