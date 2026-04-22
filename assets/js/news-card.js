/* ==========================================
   QBRETE — News Card Component (renderer)
   Uso:
     NewsCard.render(container, dataArray)
     NewsCard.create(data) → HTMLElement
   ========================================== */
(function (global) {
  'use strict';

  // Arrow icon — Figma 723:4457 (CommunityCard news): right arrow (line + chevron), stroke 1.667
  var ICON_ARROW =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
      '<path d="M4.167 10h11.667M10 4.167L15.833 10 10 15.833" stroke="currentColor" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"/>' +
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
   * Crea el elemento DOM de una News Card.
   * @param {Object} data
   * @param {string} data.image        URL de la imagen
   * @param {string} data.title        Título de la noticia
   * @param {string[]} [data.chips]    Etiquetas (máx. 3 recomendado)
   * @param {string} data.excerpt      Descripción / extracto
   * @param {string} data.date         Fecha (ej. "Enero 11, 2026")
   * @param {string} [data.author]     Autor/Fuente como línea completa (ej. "Autor: Valeria Barrera Serrano")
   * @param {string} [data.href]       URL del detalle (default "#")
   * @param {string} [data.category]   Categoría para filtros (ej. "mascotas")
   * @param {string} [data.alt]        Alt de imagen
   * @returns {HTMLElement}
   */
  function create(data) {
    data = data || {};
    var chips = Array.isArray(data.chips) ? data.chips : [];
    var href = data.href || '#';
    var alt = data.alt || data.title || '';
    var author = data.author || '';

    var article = document.createElement('article');
    article.className = 'news-card';
    if (data.category) article.setAttribute('data-category', data.category);
    article.setAttribute('role', 'article');
    if (alt) article.setAttribute('aria-label', alt);

    var chipsHTML = chips.map(function (c) {
      return '<span class="news-card__chip">' + escapeHTML(c) + '</span>';
    }).join('');

    article.innerHTML =
      '<div class="news-card__image" ' +
        'style="background-image:url(\'' + escapeHTML(data.image) + '\')" ' +
        'role="img" aria-label="' + escapeHTML(alt) + '"></div>' +
      '<div class="news-card__body">' +
        '<div class="news-card__info">' +
          '<h3 class="news-card__title">' + escapeHTML(data.title) + '</h3>' +
          (chipsHTML ? '<div class="news-card__chips">' + chipsHTML + '</div>' : '') +
          '<p class="news-card__desc">' + escapeHTML(data.excerpt) + '</p>' +
        '</div>' +
        '<div class="news-card__footer">' +
          '<div class="news-card__meta">' +
            '<p class="news-card__date">' + escapeHTML(data.date) + '</p>' +
            (author ? '<p class="news-card__author">' + escapeHTML(author) + '</p>' : '') +
          '</div>' +
          '<a href="' + escapeHTML(href) + '" class="news-card__arrow" aria-label="Leer más">' +
            ICON_ARROW +
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

  global.NewsCard = { create: create, render: render };
})(window);
