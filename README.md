# The Future of Commerce -- AEM Edge Delivery Services

A migration of [The Future of Commerce](https://www.the-future-of-commerce.com/) to Adobe Edge Delivery Services, using the SAP Digital Design System. This project demonstrates an AI-assisted content migration workflow, from design token extraction to content import.

## Environments

- Preview: https://main--modrnzplay--benpeter.aem.page/
- Live: https://main--modrnzplay--benpeter.aem.live/

## What Was Migrated

Three page templates were established, each with its own import pipeline:

### Blog Post
**Source:** `/2025/05/08/how-sales-ai-helps-in-tough-markets/`

Full article page with hero image, inline audio player, author byline with social links, body content with pull quotes and CTAs, and related article cards. Metadata is enriched with Author, Publication Date, and Reading Time.

**Blocks:** hero, author-card, social-share, article-player, related-articles

### Author Profile
**Source:** `/contributor/grant-smith/`

Contributor page with avatar, name/title/company, bio, social links, and article listing. Rendered on a dark section background.

**Blocks:** author-bio

### Static Page
**Source:** `/about/`

Informational page composed entirely of default content (headings, paragraphs, lists, images, linked article teasers). No custom blocks needed.

**Blocks:** none

## Design System

The global stylesheet implements SAP Digital Design System tokens:

- **Font:** SAP 72 Brand Variable (weight 100-900)
- **Colors:** SAP brand blues (`#0057d2`), dark navy surfaces (`#223548`), with light/dark/brand section variants
- **Spacing:** Token scale from `xxs` (4px) to `4xl` (80px)
- **Buttons:** Three variants -- primary (filled), secondary (outlined), accent (ghost)
- **Layout:** 1200px max-width, mobile-first with breakpoints at 600px / 900px / 1200px

## Project Structure

```
blocks/
  article-player/    Audio player placeholder
  author-bio/        Full author profile card
  author-card/       Compact author byline
  cards/             Generic cards (boilerplate)
  columns/           Multi-column layout (boilerplate)
  footer/            Site footer fragment
  fragment/          Content fragment loader
  header/            Site navigation with mobile hamburger
  hero/              Full-width hero image
  related-articles/  Linked article preview cards
  social-share/      Platform share buttons (X, Facebook, LinkedIn)

tools/importer/
  import-blog-post.js         Blog post import script
  import-author-profile.js    Author profile import script
  import-static-page.js       Static page import script
  page-templates.json          Template definitions with block selectors
  parsers/                    Block-specific content extractors (6 parsers)
  transformers/               Page-level cleanup and enrichment (5 transformers)

styles/
  styles.css          SAP design tokens and global styles
  fonts.css           72 Brand Variable font definition
  lazy-styles.css     Post-LCP styles (placeholder)

scripts/
  scripts.js          Page decoration, auto-blocking, custom button logic
  aem.js              Core AEM library (do not modify)
  delayed.js          Deferred functionality
```

## Import Pipeline

Each template has a self-contained import pipeline:

1. **Transformers** clean the source HTML (remove chrome, fix lazy-loaded images, strip tracking)
2. **Parsers** extract structured content from DOM selectors and create EDS block tables
3. **Import scripts** wire transformers and parsers together, apply WebImporter rules, and enrich metadata
4. **Bundling** via esbuild produces a single IIFE file consumed by the bulk import runner

Key transformers shared across templates:
- `foc-cleanup.js` -- Removes site header/footer, modals, tracking attributes
- `foc-sections.js` -- Adds section breaks and section-metadata blocks
- `foc-metadata.js` -- Extracts author, dates, and reading time from page meta tags

## How It Was Built

This project was built through an AI-assisted migration workflow:

1. **Design System Extraction** -- Analyzed the source site to extract colors, typography, spacing, and button styles into CSS custom properties
2. **Navigation Setup** -- Created nav and footer content fragments from the source site structure
3. **Blog Post Migration** -- Analyzed page structure, identified 5 blocks, created parsers/transformers, ran content import, iterated on metadata enrichment
4. **Author Profile Migration** -- Established a second template with the author-bio block and dark section styling
5. **Static Page Migration** -- Created a third template for non-blog content (About page), demonstrating that not every page needs custom blocks
6. **Visual Refinement** -- Compared rendered output against the original site and adjusted block CSS for fidelity

Each step followed the AEM Edge Delivery philosophy: minimize blocks, prefer default content, and keep everything authorable in a document editor.

## Development

```sh
npm install
aem up                    # Start local dev server at http://localhost:3000
npm run lint              # Run ESLint + Stylelint
```

## Documentation

- [AEM Edge Delivery Docs](https://www.aem.live/docs/)
- [Developer Tutorial](https://www.aem.live/developer/tutorial)
- [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Markup, Sections, Blocks](https://www.aem.live/developer/markup-sections-blocks)
- [Keeping It 100](https://www.aem.live/developer/keeping-it-100)
