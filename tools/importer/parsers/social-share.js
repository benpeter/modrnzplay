/* eslint-disable */
/* global WebImporter */

/**
 * Parser for social-share block.
 * Source: section.post-single-share-aside
 * Extracts X, Facebook, LinkedIn share links into separate rows.
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  const cells = [];

  const shareLinks = element.querySelectorAll('.post-single-share-menu a');
  shareLinks.forEach((a) => {
    const href = a.getAttribute('href');
    const link = document.createElement('a');
    link.href = href;

    // Create clean text labels (SVG icons won't transfer)
    if (href.includes('twitter.com')) {
      link.textContent = 'Share on X';
    } else if (href.includes('facebook.com')) {
      link.textContent = 'Share on Facebook';
    } else if (href.includes('linkedin.com')) {
      link.textContent = 'Share on LinkedIn';
    } else {
      link.textContent = 'Share';
    }

    cells.push([link]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Social Share', cells });
  element.replaceWith(block);
}
