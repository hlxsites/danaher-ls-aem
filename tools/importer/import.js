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
/* eslint-disable no-console, class-methods-use-this */

// helix-importer-ui <-> node compatibility:
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  if (meta.Title && (meta.Title === 'Footer' || meta.Title === 'Header')) {
    meta.Robots = 'noindex, nofollow';
    delete meta.Title;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

const createHero = (main, document) => {
  const heroVideo = main.querySelector('herovideoplayer');
  if (heroVideo) {
    const title = heroVideo.getAttribute('title');
    const description = heroVideo.getAttribute('description');
    const percentage = heroVideo.getAttribute('percentage');
    const ctaText = heroVideo.getAttribute('btntext');
    const videoid = heroVideo.getAttribute('videoid');
    const imgSrc = 'https://danaherls.scene7.com/is/image/danaher/hero-image?$danaher-transparent$';
    const imgAlt = heroVideo.getAttribute('imagealt');

    const img = document.createElement('img');
    img.setAttribute('src', imgSrc);
    img.setAttribute('alt', imgAlt);

    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    div.append(h2);
    const p = document.createElement('p');
    p.textContent = description;
    const strong = document.createElement('strong');
    strong.textContent = percentage;
    p.append(strong);
    const videoElemHTML = `<a href="https://player.vimeo.com/video/${videoid}?loop=1&app_id=122963">https://player.vimeo.com/video/${videoid}?loop=1&app_id=122963${ctaText}</a>`;
    strong.insertAdjacentHTML('afterend', videoElemHTML);
    div.append(p);

    const cells = [
      ['Hero'],
      [img, div],
    ];

    const block = WebImporter.DOMUtils.createTable(cells, document);
    heroVideo.append(block);
  }
};

const createCards = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((fl) => {
    const cards = [];
    fl.querySelectorAll('grid[columns="3"] > template').forEach((tmp) => {
      const h2 = tmp.content.querySelector('h2');
      const articleCard = tmp.content.querySelector('articlecard');
      if (articleCard) {
        const cardImg = articleCard.getAttribute('cardimg');
        const cardTitle = articleCard.getAttribute('cardtitle');
        const cardDescription = articleCard.getAttribute('carddescription');
        const cardHref = articleCard.getAttribute('cardhref');
        const cardLinkText = articleCard.getAttribute('linktext');

        const img = document.createElement('img');
        img.setAttribute('src', cardImg);
        const div = document.createElement('div');
        div.append(h2);
        const h3 = document.createElement('h3');
        h3.textContent = cardTitle;
        div.append(h3);
        const p = document.createElement('p');
        p.textContent = cardDescription;
        const a = document.createElement('a');
        a.setAttribute('href', cardHref);
        a.textContent = cardLinkText;
        p.append(a);
        div.append(p);
        cards.push([img, div]);
      }
    });
    const cells = [
      ['Cards'],
      ...cards,
    ];

    if (cards.length > 0) {
      fl.before(document.createElement('hr'));
      const block = WebImporter.DOMUtils.createTable(cells, document);
      fl.append(block);
    }
  });
};

const createFeatureImage = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((fl) => {
    fl.querySelectorAll('grid[columns="2"]').forEach((item) => {
      const columns = [];
      const templates = item.querySelectorAll('template');
      if (templates.length > 2) {
        const featureImage = templates[0].content.querySelector('div.featureimage');
        const imageText = templates[1].content.querySelector('imagetext');
        if (featureImage) {
          columns.push(featureImage);
        }
        if (imageText) {
          const img = document.createElement('img');
          img.setAttribute('src', imageText.getAttribute('image'));
          columns.push(img);
        }
        const cells = [
          ['Columns'],
          [...columns],
        ];

        if (columns.length > 0) {
          fl.before(document.createElement('hr'));
          const block = WebImporter.DOMUtils.createTable(cells, document);
          fl.append(block);
        }
      }
    });
  });
};

const createLogoCloud = (main, document) => {
  const logoCloud = main.querySelector('logo-cloud');
  if (logoCloud) {
    const div = document.createElement('div');
    const template = logoCloud.querySelector('template');
    div.append(template.content.querySelector('h2'));
    template.content.querySelectorAll('p').forEach((item) => div.append(item));

    const items = [];
    // eslint-disable-next-line no-undef
    const logos = JSON.parse(decodeHtmlEntities(logoCloud.getAttribute('logos')));
    logos.forEach((logo) => {
      const a = document.createElement('a');
      a.setAttribute('href', logo.imageLink);
      a.textContent = logo.imageAlt;
      const img = document.createElement('img');
      img.setAttribute('src', logo.image);
      img.setAttribute('alt', logo.imageAlt);
      items.push([img, a]);
    });

    const cells = [
      ['Logo Clouds'],
      [div],
      ...items,
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    logoCloud.append(block);
  }
};

const createFullLayoutSection = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((e) => {
    const div = e.querySelector('div');
    const style = div.getAttribute('class');
    const cells = [['Section Metadata'], ['style', style]];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    e.after(table);
    table.after(document.createElement('hr'));
  });
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
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;
    createFullLayoutSection(main, document);
    createHero(main, document);
    createCards(main, document);
    createLogoCloud(main, document);
    createFeatureImage(main, document);
    // createFooter(main);

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'div.headerexperiencefragmen',
      'div.footer.experiencefragment',
      'component',
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
