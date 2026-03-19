# Project Instructions

## What This Project Is

Migration of https://www.the-future-of-commerce.com (WordPress/Yoast) to AEM Edge Delivery Services, reskinned with the SAP Digital Design System.

## Design System

Apply the SAP Digital Design System from Figma as the visual language for this site. Extract design tokens (colors, typography, spacing, border radii, shadows) and set them as CSS custom properties in `styles/styles.css`.

- Figma file: https://www.figma.com/design/OFEfvhyXJvYJ6MQZ30699m/SAP-Digital-Design-System-UI-Kit?node-id=93-3671
- The site should look like a fresh SAP-branded property, not a clone of the WordPress theme.
- Figma API token is configured in Settings.

## Migration Scope

Use the sitemap at https://www.the-future-of-commerce.com/sitemap_index.xml to identify content.

### In scope

1. **300 most recent blog posts** - identified by publication date in URLs (`/YYYY/MM/DD/slug/`). The newest posts are in `post-sitemap4.xml` (227 posts) and `post-sitemap3.xml` (517 posts, take the most recent to reach 300 total).

2. **Author profile pages** - only authors who wrote at least one of the 300 selected posts. Author URLs follow `/contributor/name-slug/`. Full author sitemap: `author-sitemap.xml`.

3. **All static pages** - all 33 pages from `page-sitemap.xml` (about, privacy policy, contact, contributors, etc.)

### Out of scope

- Category archive pages (`/category/...`)
- Tag archive pages (`/tag/...`)
- Web stories (`/web-stories/...`)
- Tag list index pages (`/tag-list/...`)

## Content Patterns

The source site has these recurring content patterns that will need EDS blocks:

- Blog post pages with hero image, author byline, publish date, body content, and related posts
- Author/contributor profile pages
- Static informational pages
- Site-wide header with navigation
- Site-wide footer

## Workflow Preferences

- Start with a single representative blog post to establish block infrastructure
- Complete site-wide design extraction before styling individual blocks
- Use bulk import only after single-page infrastructure is validated
- Follow Content-Driven Development methodology
