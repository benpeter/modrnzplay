/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: author profile page cleanup.
 * Removes non-authorable site chrome specific to contributor pages.
 * Selectors from: https://www.the-future-of-commerce.com/contributor/grant-smith/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
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
    // Remove right sidebar links (Meet contributors / Visit SAP)
    const rightCol = element.querySelector('.contributor-col-right');
    if (rightCol) {
      const links = rightCol.querySelector('.contributor-right-links');
      if (links) links.remove();
    }
    // Remove mobile duplicate content (keep only desktop)
    WebImporter.DOMUtils.remove(element, [
      '.contributor-photo-meta-mobile',
    ]);
    // Remove search by topic section
    const searchSection = element.querySelector('.tag-bar, [aria-label*="Search by Topic"]');
    if (searchSection) {
      const parent = searchSection.closest('section') || searchSection;
      parent.remove();
    }
    // Clean tracking attributes
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
    element.querySelectorAll('[data-track]').forEach((el) => el.removeAttribute('data-track'));
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
