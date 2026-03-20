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

  // tools/importer/import-static-page.js
  var import_static_page_exports = {};
  __export(import_static_page_exports, {
    default: () => import_static_page_default
  });

  // tools/importer/transformers/foc-static-cleanup.js
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
      const { document } = payload;
      WebImporter.DOMUtils.remove(element, [
        "header.js-header",
        ".header__summary",
        ".header__observer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer#footer",
        ".tag-bar"
      ]);
      const searchSection = element.querySelector("section.section--light");
      if (searchSection) searchSection.remove();
      WebImporter.DOMUtils.remove(element, [
        ".safe-embed",
        ".js-safe-embed"
      ]);
      element.querySelectorAll("img[nitro-lazy-src]").forEach((img) => {
        const lazySrc = img.getAttribute("nitro-lazy-src");
        if (lazySrc) {
          img.src = lazySrc;
          img.removeAttribute("nitro-lazy-src");
          img.removeAttribute("nitro-lazy-empty");
          img.classList.remove("nitro-lazy");
        }
      });
      element.querySelectorAll("article.simpe-post-embed").forEach((embed) => {
        const link = embed.querySelector("a");
        if (!link) {
          embed.remove();
          return;
        }
        const href = link.href;
        const heading = embed.querySelector("h3");
        const img = embed.querySelector("img");
        const span = embed.querySelector("span");
        const frag = document.createDocumentFragment();
        if (heading) {
          const h3 = document.createElement("h3");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = heading.textContent.trim();
          h3.appendChild(a);
          frag.appendChild(h3);
        }
        if (img) {
          const p = document.createElement("p");
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          p.appendChild(newImg);
          frag.appendChild(p);
        }
        if (span) {
          const p = document.createElement("p");
          p.textContent = span.textContent.trim();
          frag.appendChild(p);
        }
        embed.replaceWith(frag);
      });
      element.querySelectorAll("span.h2, span.h3").forEach((span) => {
        span.replaceWith(...span.childNodes);
      });
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
      element.querySelectorAll("[data-track]").forEach((el) => el.removeAttribute("data-track"));
      element.querySelectorAll("[data-unilnk-region]").forEach((el) => el.removeAttribute("data-unilnk-region"));
      WebImporter.DOMUtils.remove(element, ["noscript", "link", "script"]);
      element.querySelectorAll('.js-cookie-preferences, [class*="cookie"]').forEach((el) => {
        const parent = el.closest("p") || el;
        parent.remove();
      });
      element.querySelectorAll("a").forEach((a) => {
        if (a.textContent.trim() === "Cookie Preferences" && (!a.href || a.href === "#" || a.href.endsWith("#"))) {
          const parent = a.closest("p") || a;
          parent.remove();
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.src || "";
        if (src.includes("pixel.wp.com") || src.includes("g.gif") || img.width === 1 && img.height === 1 || img.getAttribute("width") === "1" && img.getAttribute("height") === "1") {
          const parent = img.closest("p") || img;
          parent.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, ["iframe", "#teconsent"]);
      element.querySelectorAll("p").forEach((p) => {
        if (p.innerHTML.trim() === "&nbsp;" || p.textContent.trim() === "") {
          p.remove();
        }
      });
    }
  }

  // tools/importer/import-static-page.js
  var PAGE_TEMPLATE = {
    name: "static-page",
    description: "Static informational page such as About, Contact, or other non-blog content pages",
    urls: [
      "https://www.the-future-of-commerce.com/about/"
    ],
    blocks: []
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
  var import_static_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_static_page_exports);
})();
