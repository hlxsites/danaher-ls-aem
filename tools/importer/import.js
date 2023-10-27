/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable class-methods-use-this */

// helix-importer-ui <-> node compatibility:
import {
  xfTransformers, xfAsyncTransformers, transformers,
} from './transformers/index.js';

import {
  featureimage, imagetext, appendText, pdfembed, productcitations,
} from './transformers/util.js';

if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser

const addArticleMeta = (document, meta) => {
  const articleinfo = document.querySelector('div.articleinfo');
  if (articleinfo) {
    const articleinfoEL = articleinfo.querySelector('articleinfo');
    if (articleinfoEL) {
      if (articleinfoEL.hasAttribute('articlename')) meta.authorName = articleinfoEL.getAttribute('articlename');
      if (articleinfoEL.hasAttribute('title')) meta.authorTitle = articleinfoEL.getAttribute('title');
      if (articleinfoEL.hasAttribute('postdate')) meta.publishDate = new Date(Date.parse(`${articleinfoEL.getAttribute('postdate')} UTC`)).toUTCString();
      if (articleinfoEL.hasAttribute('articleimage')) {
        const img = document.createElement('img');
        img.src = articleinfoEL.getAttribute('articleimage');
        meta.authorImage = img;
      }
      if (articleinfoEL.hasAttribute('opco')) meta.brand = articleinfoEL.getAttribute('opco');
      meta.readingTime = parseInt(articleinfoEL.getAttribute('time'), 10);
    }
  }
};

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const canonical = document.querySelector('[rel="canonical"]');
  if (canonical) {
    meta.canonical = canonical.href.replace('/content/danaher/ls/', 'https://lifesciences.danaher.com/');
  }

  const keywords = document.querySelector('[name="keywords"]');
  if (keywords) {
    meta.keywords = keywords.content;
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    const url = new URL(img.content);
    el.src = url.pathname;
    meta.Image = el;
  }

  if (meta.Title && (meta.Title === 'Footer' || meta.Title === 'Header')) {
    meta.Robots = 'noindex, nofollow';
    delete meta.Title;
  }

  addArticleMeta(document, meta);
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const createTwoColumn = (main, document) => {
  main.querySelectorAll('grid[columns="2"]').forEach((item) => {
    const columns = [];
    const templates = item.querySelectorAll('template');
    [...templates].forEach((template) => {
      if (template.content.firstElementChild) {
        if (template.content.firstElementChild.className === 'featureimage') {
          const featureImage = template.content.querySelector('div.featureimage');
          if (featureImage?.firstElementChild?.localName === 'feature-image') {
            featureimage(featureImage, document);
            WebImporter.DOMUtils.remove(featureImage, ['feature-image']);
          }

          if (featureImage) {
            columns.push(featureImage);
          }
        } else if (template.content.firstElementChild.className === 'imagetext') {
          const imageText = template.content.querySelector('imagetext');

          if (imageText) {
            const img = document.createElement('img');
            img.setAttribute('src', imageText.getAttribute('image'));
            columns.push(img);
          }
        } else if (template.content.firstElementChild.className === 'script') {
          const featureImage = template.content.querySelector('div.featureimage');

          if (featureImage) {
            columns.push(featureImage);
          }
        }
      }
    });
    const cells = [
      ['Columns'],
      [...columns],
    ];

    if (columns.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      item.append(block);
    }
  });
};

const createWeSee = (main, document) => {
  const weSee = main.querySelector('wesee');
  if (weSee) {
    const anc = document.createElement('a');
    anc.setAttribute('href', 'https://main--danaher-ls-aem--hlxsites.hlx.page/fragments/wesee.html');
    anc.textContent = 'WeSee';
    weSee.after(WebImporter.DOMUtils.createTable([['We See'], [anc]], document), document.createElement('hr'));
  }
};

const createFullLayoutSection = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((e, i, arr) => {
    const div = e.querySelector('div');
    const style = div.getAttribute('class');
    if (style) {
      const cells = [['Section Metadata'], ['style', style]];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      e.after(table);
      if (i < arr.length - 1) {
        table.after(document.createElement('hr'));
      }
    }
  });
};

const createBlogHeader = (main, document) => {
  const headings = main.querySelectorAll('div.heading');
  [...headings].forEach((heading) => {
    const headingEL = heading?.querySelector('heading');
    const hTag = headingEL?.getAttribute('headingtag') ? headingEL?.getAttribute('headingtag') : 'h1';
    const headEl = document.createElement(hTag);
    headEl.textContent = headingEL?.getAttribute('heading');
    if (headEl.innerHTML) {
      heading.append(headEl);
    }

    const p = document.createElement('p');
    p.innerHTML = headingEL?.getAttribute('subheadingtext');
    if (p.innerHTML) {
      heading.append(p);
    }
  });
};

const createImage = (main, document) => {
  const imageText = main.querySelectorAll('div.imagetext');
  [...imageText].forEach((imgText) => {
    imagetext(imgText, document);
  });
};

const createFeatureImage = (main, document) => {
  const featureImage = main.querySelectorAll('div.featureimage');
  [...featureImage].forEach((featureImg) => {
    featureimage(featureImg, document);
  });
};

const createPDFEmbed = (main, document) => {
  const pdfViewer = main.querySelectorAll('div.pdfviewer');
  pdfViewer.forEach((pdf) => {
    pdfembed(pdf, document);
  });
};

const createSidebarArticle = (main, document) => {
  const sidebar = main.querySelector('div#recent-articles')?.parentNode;
  if (sidebar) {
    sidebar.innerHTML = '';
    const block = [['recent-articles'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    sidebar.append(document.createElement('hr'));
    sidebar.append(table);
  }
};

const createProductPage = (main, document) => {
  const product = main.querySelector('product-page');
  if (product) {
    const btnText = product.getAttribute('rfqbuttontext');
    const productCells = [
      ['Product Details'],
      [btnText],
    ];

    if (btnText) {
      const block = WebImporter.DOMUtils.createTable(productCells, document);
      product.append(block, document.createElement('hr'));
    }

    const tabs = JSON.parse(product.getAttribute('producttabs'));
    tabs.forEach((tab, i, arr) => {
      const sectionCells = [['Section Metadata'], ['icon', tab.icon], ['tabId', tab.tabId], ['tabName', tab.tabName]];
      const attributeCells = [];
      const template = product.querySelector(`template[v-slot:${tab.tabId}]`);

      if (tab.tabId === 'specification') {
        const attributes = JSON.parse(product.getAttribute('attributes'));
        attributeCells.push(['product-attribute-table']);
        attributes.forEach((attribute) => {
          attributeCells.push([attribute.attributeLabel, attribute.attribute]);
        });
        const attributeTable = WebImporter.DOMUtils.createTable(attributeCells, document);
        main.append(attributeTable);
      }

      if (template.content.childNodes.length > 1) {
        const elementsArray = Array.from(template.content.childNodes);
        elementsArray.forEach((element) => {
          if (element.outerHTML) {
            switch (element.className) {
              case 'imagetext':
                main.append(imagetext(element, document));
                break;
              case 'text':
                main.append(appendText(element));
                break;
              case 'product-citations':
                main.append(productcitations(element));
                break;
              default:
                main.append(featureimage(element, document));
            }
          }
        });
      }

      const sectionTable = WebImporter.DOMUtils.createTable(sectionCells, document);
      main.append(sectionTable);
      if (i < arr.length - 1) {
        main.append(document.createElement('hr'));
      }
    });
  }
};

const createCardList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  if (url) {
    let blockName;
    if (url.endsWith('/blog.html')) blockName = 'Card List (blog)';
    else if (url.endsWith('/news.html')) blockName = 'Card List (news)';
    else if (url.endsWith('/library.html')) blockName = 'Card List (library)';

    if (blockName) {
      const block = [[blockName], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      main.append(table);
    }
  }
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: async ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;
    createFullLayoutSection(main, document);
    createWeSee(main, document);
    createTwoColumn(main, document);
    createBlogHeader(main, document);
    createImage(main, document);
    createFeatureImage(main, document);
    createPDFEmbed(main, document);
    createSidebarArticle(main, document);
    createProductPage(main, document);
    createCardList(main, document);

    transformers.forEach(
      (fn) => fn.call(this, main, document, params, url),
    );

    // we only create the footer and header if not included via XF on a page
    const xf = main.querySelector('div.experiencefragment');
    if (!xf) {
      xfTransformers.forEach(
        (fn) => fn.call(this, main, document, params, url),
      );
      await Promise.all(xfAsyncTransformers.map((fn) => fn(main, document, params, url)));
    }

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      'component',
      'div.social',
      'div.cloudservice.testandtarget',
    ]);

    // create the metadata block and append it to the main element
    createMetadata(main, document);
    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
