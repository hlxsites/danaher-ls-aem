/* global WebImporter */
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

const addDataLayerMeta = (document, html, meta) => {
  const divEl = document.createElement('div');
  divEl.innerHTML = html;
  const scriptElements = Array.from(divEl.querySelectorAll('script'));
  const filteredScripts = scriptElements.filter((script) => script.textContent.startsWith('\n    dataLayer = '));
  const dataLayerJson = filteredScripts[0] ? JSON.parse(filteredScripts[0].textContent.replaceAll('\n', '').replace('dataLayer', '').replace('=', '').replace(';', '')
    .replaceAll('\'', '"')) : [];
  if (dataLayerJson) {
    meta.creationDate = dataLayerJson[1] ? new Date(Date.parse(`${dataLayerJson[1]?.page.creationDate} UTC`)).toUTCString() : '';
    meta.updateDate = dataLayerJson[1] ? new Date(Date.parse(`${dataLayerJson[1]?.page.updateDate} UTC`)).toUTCString() : '';
  }
};

const addCategoryMeta = (url, meta) => {
  // detect category pages based on url and set category metadata and maybe parent category metadata
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/products\/(?!family\/|sku\/)/)) {
    const category = url.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/products\//, '').replace(/\.html$/, '').replace(/\/topics/, '').split('/');
    console.log(category);
    if (url.pathname.indexOf('/topics/') > -1) {
      category.pop();
    }
    meta.FullCategory = category.join('|');
  }
};

// eslint-disable-next-line no-unused-vars
const createMetadata = (main, document, html, params, url) => {
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
    const imgUrl = new URL(img.content);
    el.src = imgUrl.pathname;
    meta.Image = el;
  }

  if (meta.Title && (meta.Title === 'Footer' || meta.Title === 'Header')) {
    meta.Robots = 'noindex, nofollow';
    delete meta.Title;
  }

  addArticleMeta(document, meta);
  addDataLayerMeta(document, html, meta);
  addCategoryMeta(url, meta);

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export default createMetadata;
