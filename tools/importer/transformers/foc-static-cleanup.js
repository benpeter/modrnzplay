/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: static page cleanup for future-of-commerce.
 * Handles About page and similar static informational pages.
 * Converts inline article embeds to default content and removes non-content elements.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove modals/overlays
    WebImporter.DOMUtils.remove(element, [
      '.js-video-modal',
      '.js-newsletter-modal',
      '.js-form-suc-modal',
      '.js-copro-modal',
      'template',
    ]);
  }

  if (hookName === H.after) {
    const { document } = payload;

    // Remove site header and navigation
    WebImporter.DOMUtils.remove(element, [
      'header.js-header',
      '.header__summary',
      '.header__observer',
    ]);

    // Remove site footer
    WebImporter.DOMUtils.remove(element, [
      'footer#footer',
      '.tag-bar',
    ]);

    // Remove search by topic section
    const searchSection = element.querySelector('section.section--light');
    if (searchSection) searchSection.remove();

    // Remove third-party embeds (podcast player, etc.)
    WebImporter.DOMUtils.remove(element, [
      '.safe-embed',
      '.js-safe-embed',
    ]);

    // Fix nitro-lazy-src images throughout the page
    element.querySelectorAll('img[nitro-lazy-src]').forEach((img) => {
      const lazySrc = img.getAttribute('nitro-lazy-src');
      if (lazySrc) {
        img.src = lazySrc;
        img.removeAttribute('nitro-lazy-src');
        img.removeAttribute('nitro-lazy-empty');
        img.classList.remove('nitro-lazy');
      }
    });

    // Convert article.simpe-post-embed elements to clean default content
    element.querySelectorAll('article.simpe-post-embed').forEach((embed) => {
      const link = embed.querySelector('a');
      if (!link) {
        embed.remove();
        return;
      }

      const href = link.href;
      const heading = embed.querySelector('h3');
      const img = embed.querySelector('img');
      const span = embed.querySelector('span');

      // Build replacement: heading (linked), image, description paragraph
      const frag = document.createDocumentFragment();

      if (heading) {
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = heading.textContent.trim();
        h3.appendChild(a);
        frag.appendChild(h3);
      }

      if (img) {
        const p = document.createElement('p');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        p.appendChild(newImg);
        frag.appendChild(p);
      }

      if (span) {
        const p = document.createElement('p');
        p.textContent = span.textContent.trim();
        frag.appendChild(p);
      }

      embed.replaceWith(frag);
    });

    // Remove inline style attributes (color, text-align kept as-is for author intent)
    // Remove WordPress-specific wrapper spans
    element.querySelectorAll('span.h2, span.h3').forEach((span) => {
      // Unwrap these spans - they were CSS class overrides in WP
      span.replaceWith(...span.childNodes);
    });

    // Clean tracking attributes
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
    element.querySelectorAll('[data-track]').forEach((el) => el.removeAttribute('data-track'));
    element.querySelectorAll('[data-unilnk-region]').forEach((el) => el.removeAttribute('data-unilnk-region'));

    // Remove non-content elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link', 'script']);

    // Remove cookie preferences buttons/links
    element.querySelectorAll('.js-cookie-preferences, [class*="cookie"]').forEach((el) => {
      const parent = el.closest('p') || el;
      parent.remove();
    });
    // Remove cookie preferences links by text content
    element.querySelectorAll('a').forEach((a) => {
      if (a.textContent.trim() === 'Cookie Preferences' && (!a.href || a.href === '#' || a.href.endsWith('#'))) {
        const parent = a.closest('p') || a;
        parent.remove();
      }
    });

    // Remove tracking pixels (1x1 images, wp.com pixels, etc.)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.src || '';
      if (src.includes('pixel.wp.com') || src.includes('g.gif')
        || (img.width === 1 && img.height === 1)
        || (img.getAttribute('width') === '1' && img.getAttribute('height') === '1')) {
        const parent = img.closest('p') || img;
        parent.remove();
      }
    });

    // Remove iframes (teconsent, tracking, etc.)
    WebImporter.DOMUtils.remove(element, ['iframe', '#teconsent']);

    // Remove empty paragraphs (nbsp-only)
    element.querySelectorAll('p').forEach((p) => {
      if (p.innerHTML.trim() === '&nbsp;' || p.textContent.trim() === '') {
        p.remove();
      }
    });
  }
}
