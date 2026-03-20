/* eslint-disable */
/* global WebImporter */

/**
 * Parser for author-bio block.
 * Source: https://www.the-future-of-commerce.com/contributor/grant-smith/
 * Extracts author name, title, company, avatar, social links, and bio text.
 * Generated: 2026-03-20
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Avatar image | Name, Title, Company
  const img = element.querySelector('.contributor-photo img, .contributors-biography-image');
  const nameEl = element.querySelector('h1.contributor-name, h1');
  const titleEl = element.querySelector('p.contributor-title');
  const companyEl = element.querySelector('p.contributor-company');

  const infoContainer = document.createElement('div');
  if (nameEl) {
    const h = document.createElement('h2');
    h.textContent = nameEl.textContent.trim();
    infoContainer.append(h);
  }
  if (titleEl) {
    const p = document.createElement('p');
    p.textContent = titleEl.textContent.trim();
    infoContainer.append(p);
  }
  if (companyEl) {
    const p = document.createElement('p');
    p.textContent = companyEl.textContent.trim();
    infoContainer.append(p);
  }

  if (img) {
    // Use nitro-lazy-src for the actual image URL
    const lazySrc = img.getAttribute('nitro-lazy-src');
    if (lazySrc && (img.src.startsWith('data:') || img.src.startsWith('blob:') || !img.src.includes('http'))) {
      img.src = lazySrc;
    }
    cells.push([img, infoContainer]);
  } else {
    cells.push([infoContainer]);
  }

  // Row 2: Bio text
  const bioEl = element.querySelector('.contributor-bio');
  if (bioEl) {
    const bioDiv = document.createElement('div');
    bioEl.querySelectorAll('p').forEach((p) => {
      const clone = p.cloneNode(true);
      bioDiv.append(clone);
    });
    cells.push([bioDiv]);
  }

  // Row 3: Social links
  const socialLinks = element.querySelectorAll('.contributor-social-desktop .contributors-biography-social-link, .contributor-social-links a');
  const seen = new Set();
  if (socialLinks.length > 0) {
    const linksDiv = document.createElement('div');
    socialLinks.forEach((a) => {
      if (seen.has(a.href)) return;
      seen.add(a.href);
      const link = document.createElement('a');
      link.href = a.href;
      if (a.href.includes('linkedin')) link.textContent = 'LinkedIn';
      else if (a.href.includes('twitter') || a.href.includes('x.com')) link.textContent = 'X';
      else link.textContent = a.textContent.trim() || 'Profile';
      linksDiv.append(link);
      linksDiv.append(document.createTextNode(' '));
    });
    cells.push([linksDiv]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Author Bio', cells });
  element.replaceWith(block);
}
