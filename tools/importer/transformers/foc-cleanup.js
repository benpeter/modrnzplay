/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: future-of-commerce cleanup.
 * Removes non-authorable site chrome, modals, and widgets.
 * Selectors from captured DOM of:
 * https://www.the-future-of-commerce.com/2025/05/08/how-sales-ai-helps-in-tough-markets/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove modals/overlays that could interfere with block parsing
    WebImporter.DOMUtils.remove(element, [
      '.js-video-modal',
      '.js-newsletter-modal',
      '.js-form-suc-modal',
      '.js-copro-modal',
      'template',
    ]);
  }
  if (hookName === H.after) {
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
    // Remove newsletter signup from sidebar (keep author section for author-card block)
    WebImporter.DOMUtils.remove(element, [
      '.post-single-newsletter',
    ]);
    // Remove featured sections carousel (site-wide navigation component)
    const featuredSection = element.querySelector('section.section--light');
    if (featuredSection) featuredSection.remove();
    // Remove empty related-posts-footer section
    const relatedFooter = element.querySelector('.js-related-posts-footer');
    if (relatedFooter) {
      const parentSection = relatedFooter.closest('.section.section--dark');
      if (parentSection) parentSection.remove();
    }
    // Clean tracking attributes
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
    element.querySelectorAll('[data-track]').forEach((el) => el.removeAttribute('data-track'));
    // Remove safe non-content elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
