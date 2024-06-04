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
  try {
    const dataLayerJson = filteredScripts[0] ? JSON.parse(
      filteredScripts[0].textContent
        .replaceAll('\n', '')
        .replace('dataLayer', '')
        .replace('=', '')
        .replace(';', '')
        .replace("'user'", '"user"')
        .replace("'page'", '"page"'),
    ) : [];
    if (dataLayerJson) {
      meta.creationDate = dataLayerJson[1]
        ? new Date(Date.parse(`${dataLayerJson[1]?.page.creationDate} UTC`)).toUTCString()
        : '';
      meta.updateDate = dataLayerJson[1]
        ? new Date(Date.parse(`${dataLayerJson[1]?.page.updateDate} UTC`)).toUTCString()
        : '';
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing data layer JSON:', error);
  }
};

const addSolutionMeta = (url, meta) => {
  // detect solutions pages based on url and set solutions metadata
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/solutions\//)) {
    const solution = url.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/solutions\//, '').replace(/\.html$/, '').split('/');
    if (url.pathname.includes('/process-steps/')) {
      meta.solution = solution.at(1);
    }
  }
};

const addCategoryMeta = (url, meta) => {
  // detect category pages based on url and set category metadata and maybe parent category metadata
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/products\/(?!family\/|sku\/)/)) {
    const category = url.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/products\//, '').replace(/\.html$/, '').replace(/\/topics/, '').split('/');
    if (url.pathname.indexOf('/topics/') > -1) {
      category.pop();
    }
    meta.FullCategory = category.join('|');
  }
};

const isDefaultProductPage = (url) => url.pathname.match(/\/content\/danaher\/ls\/us\/en\/products\/product-coveo/);
const isArticleTemplatePage = (url) => url.pathname.match(/topics-template/);

const addSKUMeta = (url, meta) => {
  // detect family|sku|budle pages based on url and set sku metadata
  if (url.pathname.match(/\/content\/danaher\/ls\/us\/en\/products\/(family\/|sku\/|bundle\/)/)) {
    const sku = url.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/products\//, '').replace(/\.html$/, '').split('/');
    meta.sku = sku.pop();
  }
};

// eslint-disable-next-line no-unused-vars
const createMetadata = (main, document, html, params, urlStr) => {
  const url = new URL(urlStr);
  if (isDefaultProductPage(url) || isArticleTemplatePage(url)) return {};

  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const canonical = document.querySelector('[rel="canonical"]');
  if (canonical) {
    // make canonical absolute to the hostname of url, if not already
    let canonicalUrl = canonical.href;
    const href = new URL(canonical.href, url);

    if ([
      'lifesciences.danaher.com',
      'stage.lifesciences.danaher.com',
      url.hostname,
    ].some((h) => href.hostname === h)) {
      // make canonical url absolute to the given hostname
      canonicalUrl = new URL(href.pathname, 'https://lifesciences.danaher.com/').href;
    }

    meta.canonical = canonicalUrl;
  }

  const keywords = document.querySelector('[name="keywords"]');
  if (keywords) {
    meta.keywords = keywords.content;
  }

  const tags = document.querySelector('[name="tags"]');
  if (tags && tags.content) {
    meta.Tags = tags.content;
  }

  const opco = document.querySelector('[name="opco"]');
  if (opco && opco.content) {
    meta.brand = opco.content;
  }

  const topic = document.querySelector('[name="topic"]');
  if (topic && topic.content) {
    meta.topics = topic.content;
  }

  const workflow = document.querySelector('[name="workflow"]');
  if (workflow && workflow.content) {
    meta.workflows = workflow.content;
  }

  const productCategories = document.querySelector('[name="productCategories"]');
  if (productCategories && productCategories.content) {
    meta.productCategories = productCategories.content;
  }

  const productSKU = document.querySelector('[name="productSKU"]');
  if (productSKU && productSKU.content) {
    meta.productSKUs = productSKU.content;
  }

  const productFamily = document.querySelector('[name="productFamily"]');
  if (productFamily && productFamily.content) {
    meta.productFamilies = productFamily.content;
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

  addArticleMeta(document, meta);
  addDataLayerMeta(document, html, meta);
  addCategoryMeta(url, meta);
  addSolutionMeta(url, meta);
  addSKUMeta(url, meta);

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export default createMetadata;
