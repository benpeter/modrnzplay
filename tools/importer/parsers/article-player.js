/* eslint-disable */
/* global WebImporter */

/**
 * Parser for article-player block.
 * Source: section.js-post-player.post-player
 * Creates a simple block with the "Listen to article" label.
 * The actual player functionality is handled by the block's JS decorator.
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract heading text
  const heading = element.querySelector('h2');
  const text = heading ? heading.textContent.trim() : 'Listen to article';

  const label = document.createElement('p');
  label.textContent = text;
  cells.push([label]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Article Player', cells });
  element.replaceWith(block);
}
