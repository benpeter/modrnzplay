var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-author-profile.js
  var import_author_profile_exports = {};
  __export(import_author_profile_exports, {
    default: () => import_author_profile_default
  });

  // tools/importer/parsers/author-bio.js
  function parse(element, { document }) {
    const cells = [];
    const img = element.querySelector(".contributor-photo img, .contributors-biography-image");
    const nameEl = element.querySelector("h1.contributor-name, h1");
    const titleEl = element.querySelector("p.contributor-title");
    const companyEl = element.querySelector("p.contributor-company");
    const infoContainer = document.createElement("div");
    if (nameEl) {
      const h = document.createElement("h2");
      h.textContent = nameEl.textContent.trim();
      infoContainer.append(h);
    }
    if (titleEl) {
      const p = document.createElement("p");
      p.textContent = titleEl.textContent.trim();
      infoContainer.append(p);
    }
    if (companyEl) {
      const p = document.createElement("p");
      p.textContent = companyEl.textContent.trim();
      infoContainer.append(p);
    }
    if (img) {
      const lazySrc = img.getAttribute("nitro-lazy-src");
      if (lazySrc && (img.src.startsWith("data:") || img.src.startsWith("blob:") || !img.src.includes("http"))) {
        img.src = lazySrc;
      }
      cells.push([img, infoContainer]);
    } else {
      cells.push([infoContainer]);
    }
    const bioEl = element.querySelector(".contributor-bio");
    if (bioEl) {
      const bioDiv = document.createElement("div");
      bioEl.querySelectorAll("p").forEach((p) => {
        const clone = p.cloneNode(true);
        bioDiv.append(clone);
      });
      cells.push([bioDiv]);
    }
    const socialLinks = element.querySelectorAll(".contributor-social-desktop .contributors-biography-social-link, .contributor-social-links a");
    const seen = /* @__PURE__ */ new Set();
    if (socialLinks.length > 0) {
      const linksDiv = document.createElement("div");
      socialLinks.forEach((a) => {
        if (seen.has(a.href)) return;
        seen.add(a.href);
        const link = document.createElement("a");
        link.href = a.href;
        if (a.href.includes("linkedin")) link.textContent = "LinkedIn";
        else if (a.href.includes("twitter") || a.href.includes("x.com")) link.textContent = "X";
        else link.textContent = a.textContent.trim() || "Profile";
        linksDiv.append(link);
        linksDiv.append(document.createTextNode(" "));
      });
      cells.push([linksDiv]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Author Bio", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/foc-author-cleanup.js
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
      const rightCol = element.querySelector(".contributor-col-right");
      if (rightCol) {
        const links = rightCol.querySelector(".contributor-right-links");
        if (links) links.remove();
      }
      WebImporter.DOMUtils.remove(element, [
        ".contributor-photo-meta-mobile"
      ]);
      const searchSection = element.querySelector('.tag-bar, [aria-label*="Search by Topic"]');
      if (searchSection) {
        const parent = searchSection.closest("section") || searchSection;
        parent.remove();
      }
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
      element.querySelectorAll("[data-track]").forEach((el) => el.removeAttribute("data-track"));
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/import-author-profile.js
  var parsers = {
    "author-bio": parse
  };
  var PAGE_TEMPLATE = {
    name: "author-profile",
    description: "Author/contributor profile page with bio, avatar, social links, and article list",
    urls: [
      "https://www.the-future-of-commerce.com/contributor/grant-smith/"
    ],
    blocks: [
      {
        name: "author-bio",
        instances: [".contributor-col-left"]
      }
    ],
    sections: [
      {
        id: "section-profile",
        name: "Author Profile",
        selector: "main .container",
        style: "dark",
        blocks: ["author-bio"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
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
  var import_author_profile_default = {
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
      const authorBlock = main.querySelector("table");
      if (authorBlock) {
        const hr2 = document.createElement("hr");
        authorBlock.after(hr2);
        const sectionMeta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: "dark" }
        });
        authorBlock.after(sectionMeta);
      }
      const articlesHeading = main.querySelector("h2");
      if (!articlesHeading) {
        const nameEl = document.querySelector("h1.contributor-name, h1");
        if (nameEl) {
          const firstName = nameEl.textContent.trim().split(" ")[0];
          const h2 = document.createElement("h2");
          h2.textContent = `Articles by ${firstName}:`;
          main.appendChild(h2);
        }
      }
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
  return __toCommonJS(import_author_profile_exports);
})();
