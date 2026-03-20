/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: enriched metadata extraction.
 * Extracts author, publish date, categories/tags, and reading time
 * from JSON-LD, meta tags, and article body word count.
 * Injects <meta> tags so WebImporter.rules.createMetadata picks them up.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const { document } = payload;
  const head = document.head || document.querySelector('head');
  if (!head) return;

  // Helper – add a <meta name="..." content="..."> if value is truthy
  function addMeta(name, content) {
    if (!content) return;
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    head.appendChild(meta);
  }

  // 1. Author name – try JSON-LD first, then sidebar author link
  let authorName = null;
  const jsonLd = document.querySelector('script[type="application/ld+json"]');
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd.textContent);
      if (data.author && data.author.name) {
        authorName = data.author.name;
      }
    } catch (e) { /* ignore parse errors */ }
  }
  if (!authorName) {
    const authorEl = element.querySelector('.post-single-author-name a, aside .post-single-author a, address a');
    if (authorEl) authorName = authorEl.textContent.trim();
  }
  addMeta('Author', authorName);

  // 2. Publish date – from article:published_time or JSON-LD datePublished
  let publishDate = null;
  const pubMeta = document.querySelector('meta[property="article:published_time"]');
  if (pubMeta) {
    publishDate = pubMeta.content.split('T')[0]; // keep YYYY-MM-DD
  }
  if (!publishDate && jsonLd) {
    try {
      const data = JSON.parse(jsonLd.textContent);
      if (data.datePublished) publishDate = data.datePublished;
    } catch (e) { /* ignore */ }
  }
  addMeta('Publication Date', publishDate);

  // 3. Tags/keywords – from JSON-LD keywords
  let tags = null;
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd.textContent);
      if (data.keywords && Array.isArray(data.keywords)) {
        tags = data.keywords.join(', ');
      }
    } catch (e) { /* ignore */ }
  }
  addMeta('Tags', tags);

  // 4. Reading time – calculated from body text word count (200 wpm)
  const articleBody = element.querySelector('.post-single-content, main article, .entry-content');
  if (articleBody) {
    const text = articleBody.textContent.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / 200);
    addMeta('Reading Time', `${minutes} min`);
  }
}
