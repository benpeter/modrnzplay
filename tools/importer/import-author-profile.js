/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import authorBioParser from './parsers/author-bio.js';

// TRANSFORMER IMPORTS
import focAuthorCleanupTransformer from './transformers/foc-author-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'author-bio': authorBioParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'author-profile',
  description: 'Author/contributor profile page with bio, avatar, social links, and article list',
  urls: [
    'https://www.the-future-of-commerce.com/contributor/grant-smith/',
  ],
  blocks: [
    {
      name: 'author-bio',
      instances: ['.contributor-col-left'],
    },
  ],
  sections: [
    {
      id: 'section-profile',
      name: 'Author Profile',
      selector: 'main .container',
      style: 'dark',
      blocks: ['author-bio'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  focAuthorCleanupTransformer,
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

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
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

    // 4. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 5. Add "Articles by" heading as default content after the block
    const authorBlock = main.querySelector('table');
    if (authorBlock) {
      const hr = document.createElement('hr');
      authorBlock.after(hr);
      // Add section metadata for dark style on the profile section
      const sectionMeta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: 'dark' },
      });
      authorBlock.after(sectionMeta);
    }

    // Add articles heading in a new section
    const articlesHeading = main.querySelector('h2');
    if (!articlesHeading) {
      // Create one from the author name
      const nameEl = document.querySelector('h1.contributor-name, h1');
      if (nameEl) {
        const firstName = nameEl.textContent.trim().split(' ')[0];
        const h2 = document.createElement('h2');
        h2.textContent = `Articles by ${firstName}:`;
        main.appendChild(h2);
      }
    }

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Generate sanitized path
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
