/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import authorCardParser from './parsers/author-card.js';
import socialShareParser from './parsers/social-share.js';
import articlePlayerParser from './parsers/article-player.js';
import relatedArticlesParser from './parsers/related-articles.js';

// TRANSFORMER IMPORTS
import focCleanupTransformer from './transformers/foc-cleanup.js';
import focSectionsTransformer from './transformers/foc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'author-card': authorCardParser,
  'social-share': socialShareParser,
  'article-player': articlePlayerParser,
  'related-articles': relatedArticlesParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'blog-post',
  description: 'Blog post page with hero image, author byline, publish date, body content, and related posts',
  urls: [
    'https://www.the-future-of-commerce.com/2025/05/08/how-sales-ai-helps-in-tough-markets/',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.post-single-header'],
    },
    {
      name: 'author-card',
      instances: ['aside.post-single-sidebar .post-single-author'],
    },
    {
      name: 'social-share',
      instances: ['section.post-single-share-aside'],
    },
    {
      name: 'article-player',
      instances: ['section.post-player'],
    },
    {
      name: 'related-articles',
      instances: ['article.simpe-post-embed'],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Image',
      selector: '.section.section--dark > .container',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-article',
      name: 'Article Content',
      selector: '.section > .container > main.post-single-main',
      style: null,
      blocks: ['social-share', 'article-player', 'author-card', 'related-articles'],
      defaultContent: [
        'h1.post-single-title',
        '.post-single-content > p',
        '.post-single-content > h2',
        '.post-single-content > h3',
        '.post-single-content > hr',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  focCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [focSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
