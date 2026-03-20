var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-blog-post.js
  var import_blog_post_exports = {};
  __export(import_blog_post_exports, {
    default: () => import_blog_post_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const img = element.querySelector("img");
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/author-card.js
  function parse2(element, { document }) {
    const cells = [];
    const img = element.querySelector(".post-single-author-image, img");
    const nameLink = element.querySelector(".post-single-author-name a, address a");
    if (img || nameLink) {
      const row = [];
      if (img) row.push(img);
      if (nameLink) row.push(nameLink);
      cells.push(row);
    }
    const socialLinks = element.querySelectorAll(".post-single-author-social a");
    if (socialLinks.length > 0) {
      const socialRow = [];
      socialLinks.forEach((a) => {
        const href = a.getAttribute("href");
        const link = document.createElement("a");
        link.href = href;
        if (href.includes("linkedin")) {
          link.textContent = "LinkedIn";
        } else if (href.includes("twitter") || href.includes("x.com")) {
          link.textContent = "X";
        } else {
          link.textContent = "Profile";
        }
        socialRow.push(link);
      });
      cells.push(socialRow);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Author Card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-share.js
  function parse3(element, { document }) {
    const cells = [];
    const shareLinks = element.querySelectorAll(".post-single-share-menu a");
    shareLinks.forEach((a) => {
      const href = a.getAttribute("href");
      const link = document.createElement("a");
      link.href = href;
      if (href.includes("twitter.com")) {
        link.textContent = "Share on X";
      } else if (href.includes("facebook.com")) {
        link.textContent = "Share on Facebook";
      } else if (href.includes("linkedin.com")) {
        link.textContent = "Share on LinkedIn";
      } else {
        link.textContent = "Share";
      }
      cells.push([link]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Social Share", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/article-player.js
  function parse4(element, { document }) {
    const cells = [];
    const heading = element.querySelector("h2");
    const text = heading ? heading.textContent.trim() : "Listen to article";
    const label = document.createElement("p");
    label.textContent = text;
    cells.push([label]);
    const block = WebImporter.Blocks.createBlock(document, { name: "Article Player", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/related-articles.js
  function parse5(element, { document }) {
    const cells = [];
    const link = element.querySelector("a");
    if (!link) return;
    const href = link.getAttribute("href");
    const heading = element.querySelector("h3, h2");
    const img = element.querySelector("img");
    const span = element.querySelector("span");
    const row = [];
    const articleLink = document.createElement("a");
    articleLink.href = href;
    articleLink.textContent = heading ? heading.textContent.trim() : href;
    row.push(articleLink);
    if (img) {
      row.push(img);
    }
    if (span) {
      const desc = document.createElement("p");
      desc.textContent = span.textContent.trim();
      row.push(desc);
    }
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "Related Articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/foc-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".js-video-modal",
        ".js-newsletter-modal",
        ".js-form-suc-modal",
        ".js-copro-modal",
        "template"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.js-header",
        ".header__summary",
        ".header__observer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer#footer",
        ".tag-bar"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".post-single-newsletter"
      ]);
      const featuredSection = element.querySelector("section.section--light");
      if (featuredSection) featuredSection.remove();
      const relatedFooter = element.querySelector(".js-related-posts-footer");
      if (relatedFooter) {
        const parentSection = relatedFooter.closest(".section.section--dark");
        if (parentSection) parentSection.remove();
      }
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
      element.querySelectorAll("[data-track]").forEach((el) => el.removeAttribute("data-track"));
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/foc-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = (_a = payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-blog-post.js
  var parsers = {
    "hero": parse,
    "author-card": parse2,
    "social-share": parse3,
    "article-player": parse4,
    "related-articles": parse5
  };
  var PAGE_TEMPLATE = {
    name: "blog-post",
    description: "Blog post page with hero image, author byline, publish date, body content, and related posts",
    urls: [
      "https://www.the-future-of-commerce.com/2025/05/08/how-sales-ai-helps-in-tough-markets/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".post-single-header"]
      },
      {
        name: "author-card",
        instances: ["aside.post-single-sidebar .post-single-author"]
      },
      {
        name: "social-share",
        instances: ["section.post-single-share-aside"]
      },
      {
        name: "article-player",
        instances: ["section.post-player"]
      },
      {
        name: "related-articles",
        instances: ["article.simpe-post-embed"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero Image",
        selector: ".section.section--dark > .container",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-article",
        name: "Article Content",
        selector: ".section > .container > main.post-single-main",
        style: null,
        blocks: ["social-share", "article-player", "author-card", "related-articles"],
        defaultContent: [
          "h1.post-single-title",
          ".post-single-content > p",
          ".post-single-content > h2",
          ".post-single-content > h3",
          ".post-single-content > hr"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_blog_post_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_blog_post_exports);
})();
