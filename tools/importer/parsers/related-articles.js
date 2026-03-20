/* eslint-disable */
/* global WebImporter */

/**
 * Parser for related-articles block.
 * Source: article.simpe-post-embed
 * Extracts linked article with title, image, and description into block rows.
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  const cells = [];

  const link = element.querySelector('a');
  if (!link) return;

  const href = link.getAttribute('href');
  const heading = element.querySelector('h3, h2');
  const img = element.querySelector('img');
  const span = element.querySelector('span');

  // Build a single row with: link, image, title, description
  const row = [];

  // Create a clean link with the article URL
  const articleLink = document.createElement('a');
  articleLink.href = href;
  articleLink.textContent = heading ? heading.textContent.trim() : href;
  row.push(articleLink);

  if (img) {
    row.push(img);
  }

  if (span) {
    const desc = document.createElement('p');
    desc.textContent = span.textContent.trim();
    row.push(desc);
  }

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Related Articles', cells });
  element.replaceWith(block);
}
