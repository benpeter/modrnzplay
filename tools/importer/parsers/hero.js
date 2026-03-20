/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero.
 * Source: https://www.the-future-of-commerce.com/2025/05/08/how-sales-ai-helps-in-tough-markets/
 * Blog post hero: full-width feature image with dark background, no text overlay.
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Source HTML: <div class="post-single-header"><img src="..." alt="..."></div>
  const img = element.querySelector('img');

  const cells = [];
  if (img) {
    cells.push([img]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
