/* eslint-disable */
/* global WebImporter */

/**
 * Parser for author-card block.
 * Source: aside.post-single-sidebar > section.post-single-author
 * Extracts author avatar, name link, and social links into a 2-row block.
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Author image + name link
  const img = element.querySelector('.post-single-author-image, img');
  const nameLink = element.querySelector('.post-single-author-name a, address a');

  if (img || nameLink) {
    const row = [];
    if (img) row.push(img);
    if (nameLink) row.push(nameLink);
    cells.push(row);
  }

  // Row 2: Social links
  const socialLinks = element.querySelectorAll('.post-single-author-social a');
  if (socialLinks.length > 0) {
    const socialRow = [];
    socialLinks.forEach((a) => {
      // Create a clean text link (SVG icons won't transfer)
      const href = a.getAttribute('href');
      const link = document.createElement('a');
      link.href = href;
      if (href.includes('linkedin')) {
        link.textContent = 'LinkedIn';
      } else if (href.includes('twitter') || href.includes('x.com')) {
        link.textContent = 'X';
      } else {
        link.textContent = 'Profile';
      }
      socialRow.push(link);
    });
    cells.push(socialRow);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Author Card', cells });
  element.replaceWith(block);
}
