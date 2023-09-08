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
    const p1 = document.createElement('p');
    p1.textContent = description;
    div.append(p1);
    const p2 = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = percentage;
    p2.append(strong);
    div.append(p2);
    const p3 = document.createElement('p');
    const videoElemHTML = `<a href="https://player.vimeo.com/video/${videoid}?loop=1&app_id=122963">${ctaText}</a>`;
    p3.innerHTML = videoElemHTML;
    div.append(p3);

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

        const leftDiv = document.createElement('div');
        if (h2) {
          leftDiv.append(h2);  
        }
        const img = document.createElement('img');
        img.setAttribute('src', cardImg);
        leftDiv.append(img);
        const rightDiv = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = cardTitle;
        rightDiv.append(h3);
        const p = document.createElement('p');
        p.textContent = cardDescription;
        const a = document.createElement('a');
        a.setAttribute('href', cardHref);
        a.textContent = cardLinkText;
        p.append(a);
        rightDiv.append(p);
        cards.push([leftDiv, rightDiv]);
      }
    });
    const cells = [
      ['Cards (articlecard)'],
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
    const sectionCells = [['Section Metadata'], ['style', 'bg-gray-200']];
    const table = WebImporter.DOMUtils.createTable(sectionCells, document);
    logoCloud.after(block, table, document.createElement('hr'));
  }
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
  main.querySelectorAll('fulllayout').forEach((e) => {
    const div = e.querySelector('div');
    const style = div.getAttribute('class');
    const cells = [['Section Metadata'], ['style', style]];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    e.after(table);
    table.after(document.createElement('hr'));
  });
};

const createBrandNavigation = (brandNavigationEl, document, main) => {
  // eslint-disable-next-line no-undef
  const brands = JSON.parse(decodeHtmlEntities(brandNavigationEl.getAttribute('brands')));
  const items = [];
  brands.forEach((brand) => {
    const a = document.createElement('a');
    a.setAttribute('href', brand.brandlink);
    a.textContent = brand.brandimagealt;
    const img = document.createElement('img');
    img.setAttribute('src', brand.brandimage);
    img.setAttribute('alt', brand.brandimagealt);
    items.push([img, a]);
  });
  const block = () => {
    const list = document.createElement('ul');
    items.forEach((item) => {
      const li = document.createElement('li');
      li.append(item[0]);
      li.append(item[1]);
      list.append(li);
    });
    return list;
  };
  main.append(block());
  main.append(document.createElement('hr'));
};

const createNavBar = (navBarEl, main, document) => {
  const logoTemplateEl = navBarEl.querySelector('template[\\#logo]');
  if (logoTemplateEl) {
    const logo = logoTemplateEl.content.querySelector('logo');
    if (logo) {
      const imgSrc = '/content/dam/danaher/brand-logos/svg/1-color/danaher-1c.svg';
      const imgAlt = 'Danaher';
      const link = '/';
      const img = document.createElement('img');
      img.setAttribute('src', imgSrc);
      img.setAttribute('alt', imgAlt);
      const anc = document.createElement('a');
      anc.setAttribute('href', link);
      anc.append(imgAlt);
      main.append(img);
      main.append(anc);
    }
  }
  const linkTemplateEl = navBarEl.querySelector('template[\\#links]');
  if (linkTemplateEl) {
    const headerLinksEl = linkTemplateEl.content.querySelector('header-links');
    if (headerLinksEl) {
      // eslint-disable-next-line no-undef
      const headerLinks = JSON.parse(decodeHtmlEntities(headerLinksEl.getAttribute('headerlinks')));
      const list = document.createElement('ul');
      headerLinks.forEach((i) => {
        const item = document.createElement('li');
        const anc = document.createElement('a');
        anc.setAttribute('href', i.linkUrl);
        anc.append(`:${i.linkIcon.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase())}: ${i.linkName}`);
        item.append(anc);
        list.append(item);
      });
      main.append(list);
    }
  }

  main.append(document.createElement('hr'));
};

const createMegaMenu = async (megaMenuHoverEl, main, document) => {
  // eslint-disable-next-line no-undef
  const skipItems = JSON.parse(decodeHtmlEntities(megaMenuHoverEl.getAttribute('menuheadervalues')));
  const response = await fetch('https://lifesciences.danaher.com/content/dam/danaher/system/navigation/megamenu_items_us.json');
  const data = await response.json();
  if (data.length > 0) {
    const list = document.createElement('ul');
    const homeItem = document.createElement('li');
    const homeAnc = document.createElement('a');
    homeAnc.setAttribute('href', '/');
    homeAnc.append('Life Sciences :home-icon:');
    homeItem.append(homeAnc);
    list.append(homeItem);
    data.sort((a, b) => a.displayOrder - b.displayOrder).forEach((i) => {
      if (skipItems.length > 0 && skipItems.includes(i.name)) {
        return;
      }
      const listItem = document.createElement('li');
      if (i.href) {
        const anc = document.createElement('a');
        anc.setAttribute('href', i.href);
        anc.append(i.name);
        listItem.append(anc);
      } else {
        listItem.append(i.name);
      }
      if (i.items.length > 0) {
        const subList = document.createElement('ul');
        i.items.forEach((j) => {
          const subListItem = document.createElement('li');
          const anc = document.createElement('a');
          anc.setAttribute('href', j.href);
          anc.append(j.name);
          subListItem.append(anc);
          subList.append(subListItem);
        });
        listItem.append(subList);
      }
      list.append(listItem);
    });
    main.append(list);
    main.append(document.createElement('hr'));
  }
};

const createHeader = async (main, document) => {
  const danaherHeaderEl = main.querySelector('danaher-header');
  if (danaherHeaderEl) {
    const templates = Array.from(danaherHeaderEl.getElementsByTagName('template'));
    // eslint-disable-next-line no-restricted-syntax
    for await (const t of templates) {
      const brandNavigationEl = t.content.querySelector('brand-navigation');
      if (brandNavigationEl) {
        createBrandNavigation(brandNavigationEl, document, main);
      }

      const navBarEl = t.content.querySelector('navbar');
      if (navBarEl) {
        createNavBar(navBarEl, main, document);
      }

      const megaMenuHoverEl = t.content.querySelector('megamenuhover');
      if (megaMenuHoverEl) {
        await createMegaMenu(megaMenuHoverEl, main, document);
      }
    }
  }
};

const createFooter = (main, document) => {
  main.querySelectorAll('footer > div > div > div').forEach((e) => {
    main.append(e);
    main.append(document.createElement('hr'));
  });
  const copyright = main.querySelector('footer > div > div:last-child');
  if (copyright) {
    main.append(copyright);
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
    createHero(main, document);
    createCards(main, document);
    createLogoCloud(main, document);
    createWeSee(main, document);
    createFeatureImage(main, document);

    // we only create the footer and header if not included via XF on a page
    const xf = main.querySelector('div.experiencefragment');
    if (!xf) {
      await createHeader(main, document);
      createFooter(main, document);
    }

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
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
